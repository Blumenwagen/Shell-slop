/**
 * Lightweight structural QML parser for the course's check engine.
 *
 * This is not a full QML/JS front end: expressions are captured as raw text
 * (with nesting, strings, and comments respected) while the declarative
 * skeleton — imports, pragmas, objects, ids, property declarations, bindings,
 * grouped properties, signals, functions, `Behavior on`, and object-valued
 * bindings — is parsed into a real tree with line numbers. That is exactly
 * the level mastery checks need: they can ask "is there a MouseArea whose
 * onClicked assigns expanded" instead of trusting a regex, and they cannot be
 * fooled by comments, strings, or formatting.
 *
 * The parser is error-recovering: a malformed member is reported and skipped
 * so one mistake never hides the rest of the file from diagnostics.
 */

export type QmlBinding = {
  /** Binding or declaration name; grouped properties are flattened ("anchors.top"). */
  name: string;
  /** Raw expression text; object-valued bindings get a placeholder ("Type { … }"). */
  expression: string;
  /** Parsed object when the value is a single object (e.g. component: HeavyDrawer { … }). */
  object?: QmlObjectNode;
  /** Parsed objects when the value is an array of objects (e.g. states: [State { … }]). */
  objects?: QmlObjectNode[];
  line: number;
  /** Declaration keywords ("property", "readonly", "required", "default", "alias"), empty for plain bindings. */
  keywords: string[];
  /** Declared type for property declarations (bool, string, list<string>, …). */
  propertyType?: string;
};

export type QmlSignal = { name: string; params: string; line: number };
export type QmlFunction = { name: string; params: string; returnType?: string; body: string; line: number };

export type QmlObjectNode = {
  /** Type name, possibly dotted (Rectangle, Quickshell.PanelWindow). */
  type: string;
  /** Target of a `Behavior on <target>` declaration. */
  on?: string;
  id?: string;
  line: number;
  bindings: QmlBinding[];
  signals: QmlSignal[];
  functions: QmlFunction[];
  children: QmlObjectNode[];
};

export type QmlParseError = { line: number; message: string };

export type QmlDocument = {
  imports: { text: string; line: number }[];
  pragmas: { text: string; line: number }[];
  root: QmlObjectNode | null;
  errors: QmlParseError[];
};

const IDENT_START = /[A-Za-z_$]/;
const IDENT_CHAR = /[A-Za-z0-9_$]/;
/** Trailing characters that mean an expression continues on the next line. */
const CONTINUES_AFTER = "?:+-*/%&|=<>,(.";
/** Leading characters on the next line that continue an expression (a member never starts with these). */
const CONTINUES_BEFORE = "?:.+-*/%&|=";

class Parser {
  private pos = 0;
  private line = 1;
  readonly errors: QmlParseError[] = [];

  private readonly code: string;

  constructor(code: string) { this.code = code; }

  private eof(): boolean { return this.pos >= this.code.length; }
  private peek(offset = 0): string { return this.code[this.pos + offset] ?? ""; }
  private advance(): string {
    const char = this.code[this.pos];
    this.pos += 1;
    if (char === "\n") this.line += 1;
    return char;
  }
  private save(): { pos: number; line: number } { return { pos: this.pos, line: this.line }; }
  private restore(state: { pos: number; line: number }): void { this.pos = state.pos; this.line = state.line; }
  private error(message: string, line = this.line): void { this.errors.push({ line, message }); }

  private skipTrivia(): void {
    while (!this.eof()) {
      const char = this.peek();
      if (char === " " || char === "\t" || char === "\r" || char === "\n") { this.advance(); continue; }
      if (char === "/" && this.peek(1) === "/") { while (!this.eof() && this.peek() !== "\n") this.advance(); continue; }
      if (char === "/" && this.peek(1) === "*") {
        this.advance(); this.advance();
        while (!this.eof() && !(this.peek() === "*" && this.peek(1) === "/")) this.advance();
        if (!this.eof()) { this.advance(); this.advance(); }
        continue;
      }
      break;
    }
  }

  private readIdentifier(): string {
    let out = "";
    while (!this.eof() && IDENT_CHAR.test(this.peek())) out += this.advance();
    return out;
  }

  private readDotted(): string {
    let out = this.readIdentifier();
    while (out && this.peek() === "." && IDENT_START.test(this.peek(1))) {
      this.advance();
      out += "." + this.readIdentifier();
    }
    return out;
  }

  /** Consume a string literal (", ', or `) and return its raw text including quotes. */
  private readStringToken(): string {
    const quote = this.advance();
    let out = quote;
    while (!this.eof()) {
      const char = this.advance();
      out += char;
      if (char === "\\" && !this.eof()) { out += this.advance(); continue; }
      if (char === quote) break;
    }
    return out;
  }

  /** Consume balanced (), [], or {} and return the raw text including delimiters. */
  private readBalanced(open: "(" | "[" | "{"): string {
    const close = open === "(" ? ")" : open === "[" ? "]" : "}";
    let depth = 0;
    let out = "";
    while (!this.eof()) {
      const char = this.peek();
      if (char === '"' || char === "'" || char === "`") { out += this.readStringToken(); continue; }
      if (char === "/" && this.peek(1) === "/") { while (!this.eof() && this.peek() !== "\n") this.advance(); continue; }
      if (char === "/" && this.peek(1) === "*") {
        this.advance(); this.advance();
        while (!this.eof() && !(this.peek() === "*" && this.peek(1) === "/")) this.advance();
        if (!this.eof()) { this.advance(); this.advance(); }
        continue;
      }
      out += this.advance();
      if (char === open) depth += 1;
      if (char === close) { depth -= 1; if (depth === 0) break; }
    }
    return out;
  }

  /**
   * Raw expression text: stops at ; , (when asked), an unmatched closer, or a
   * newline that does not continue the expression (`?`/`:` wrapping etc.).
   */
  private readExpressionText(stopAtComma: boolean): string {
    let paren = 0, bracket = 0, brace = 0;
    let out = "";
    while (!this.eof()) {
      const char = this.peek();
      if (paren === 0 && bracket === 0 && brace === 0) {
        if (char === ";" || char === "}" || char === ")" || char === "]") break;
        if (stopAtComma && char === ",") break;
        if (char === "\n") {
          const trimmed = out.trimEnd();
          const last = trimmed[trimmed.length - 1] ?? "";
          if (!CONTINUES_AFTER.includes(last)) {
            const state = this.save();
            this.advance();
            this.skipTrivia();
            const next = this.peek();
            this.restore(state);
            if (next === "" || !CONTINUES_BEFORE.includes(next)) break;
          }
        }
      }
      if (char === '"' || char === "'" || char === "`") { out += this.readStringToken(); continue; }
      if (char === "/" && this.peek(1) === "/") { while (!this.eof() && this.peek() !== "\n") this.advance(); continue; }
      if (char === "/" && this.peek(1) === "*") {
        this.advance(); this.advance();
        while (!this.eof() && !(this.peek() === "*" && this.peek(1) === "/")) this.advance();
        if (!this.eof()) { this.advance(); this.advance(); }
        continue;
      }
      if (char === "(") paren += 1;
      else if (char === ")") paren -= 1;
      else if (char === "[") bracket += 1;
      else if (char === "]") bracket -= 1;
      else if (char === "{") brace += 1;
      else if (char === "}") brace -= 1;
      out += this.advance();
    }
    return out.trim();
  }

  /** Binding value: a single object, an array of objects, or raw expression text. */
  private readBindingValue(): Pick<QmlBinding, "expression" | "object" | "objects"> {
    this.skipTrivia();
    if (/[A-Z]/.test(this.peek())) {
      const state = this.save();
      const typeName = this.readDotted();
      this.skipTrivia();
      if (this.peek() === "{") return { expression: `${typeName} { … }`, object: this.parseObject(typeName, state.line) };
      this.restore(state);
    }
    if (this.peek() === "[") {
      const state = this.save();
      this.advance();
      this.skipTrivia();
      if (/[A-Z]/.test(this.peek())) {
        const firstState = this.save();
        const firstType = this.readDotted();
        this.skipTrivia();
        if (this.peek() === "{") {
          const objects: QmlObjectNode[] = [this.parseObject(firstType, firstState.line)];
          for (;;) {
            this.skipTrivia();
            if (this.peek() === ",") { this.advance(); this.skipTrivia(); }
            if (this.peek() === "]") { this.advance(); break; }
            if (this.eof()) { this.error("Unterminated object list"); break; }
            const itemState = this.save();
            const itemType = this.readDotted();
            this.skipTrivia();
            if (itemType && /^[A-Z]/.test(itemType) && this.peek() === "{") { objects.push(this.parseObject(itemType, itemState.line)); continue; }
            this.error("Expected an object inside the list", itemState.line);
            while (!this.eof() && this.peek() !== "," && this.peek() !== "]") this.advance();
          }
          return { expression: "[ … ]", objects };
        }
      }
      this.restore(state);
    }
    return { expression: this.readExpressionText(false) };
  }

  /** property type with optional generic argument, e.g. list<string>. */
  private readPropertyType(): string {
    let type = this.readDotted();
    if (this.peek() === "<") {
      let depth = 0;
      let generic = "";
      while (!this.eof()) {
        const char = this.advance();
        generic += char;
        if (char === "<") depth += 1;
        if (char === ">") { depth -= 1; if (depth === 0) break; }
      }
      type += generic;
    }
    return type;
  }

  /** Skip to a safe recovery point after a malformed member. */
  private recoverMember(): void {
    while (!this.eof()) {
      const char = this.peek();
      if (char === "\n" || char === ";") { this.advance(); return; }
      if (char === "}") return;
      if (char === '"' || char === "'" || char === "`") { this.readStringToken(); continue; }
      if (char === "{") { this.readBalanced("{"); continue; }
      this.advance();
    }
  }

  private parseGroup(prefix: string, target: QmlObjectNode): void {
    this.advance(); // {
    for (;;) {
      this.skipTrivia();
      if (this.eof()) { this.error(`Unclosed ${prefix} group`); return; }
      if (this.peek() === "}") { this.advance(); return; }
      if (this.peek() === ";") { this.advance(); continue; }
      const line = this.line;
      const name = this.readDotted();
      this.skipTrivia();
      if (name && this.peek() === ":") {
        this.advance();
        const value = this.readBindingValue();
        target.bindings.push({ name: `${prefix}.${name}`, line, keywords: [], ...value });
        continue;
      }
      if (name && this.peek() === "{") { this.parseGroup(`${prefix}.${name}`, target); continue; }
      this.error(`Unexpected content inside ${prefix} { … }`, line);
      this.recoverMember();
    }
  }

  private parseObject(typeName: string, line: number, on?: string): QmlObjectNode {
    const node: QmlObjectNode = { type: typeName, on, line, bindings: [], signals: [], functions: [], children: [] };
    this.advance(); // {
    for (;;) {
      const loopStart = this.pos;
      this.skipTrivia();
      if (this.eof()) { this.error(`Unclosed ${typeName} object`, line); return node; }
      if (this.peek() === "}") { this.advance(); return node; }
      if (this.peek() === ";") { this.advance(); continue; }
      this.parseMember(node);
      if (this.pos === loopStart) this.advance(); // hard guarantee of progress
    }
  }

  private parseMember(node: QmlObjectNode): void {
    const memberLine = this.line;
    if (!IDENT_START.test(this.peek())) {
      this.error("Expected a property, object, signal, or function here", memberLine);
      this.recoverMember();
      return;
    }

    const state = this.save();
    const first = this.readDotted();

    // Declaration keywords -------------------------------------------------
    if (first === "default" || first === "required" || first === "readonly") {
      const keywords = [first];
      this.skipTrivia();
      let word = this.readIdentifier();
      while (word === "default" || word === "required" || word === "readonly") {
        keywords.push(word);
        this.skipTrivia();
        word = this.readIdentifier();
      }
      if (word !== "property") {
        this.error(`Expected "property" after "${keywords.join(" ")}"`, memberLine);
        this.recoverMember();
        return;
      }
      this.parsePropertyDeclaration(node, [...keywords, "property"], memberLine);
      return;
    }
    if (first === "property") {
      // `property` can also be a plain binding NAME (NumberAnimation { property: "opacity" });
      // only treat it as a declaration keyword when a type follows instead of ":".
      const lookahead = this.save();
      this.skipTrivia();
      const isBindingName = this.peek() === ":";
      this.restore(lookahead);
      if (!isBindingName) { this.parsePropertyDeclaration(node, ["property"], memberLine); return; }
    }
    if (first === "signal") {
      this.skipTrivia();
      const name = this.readIdentifier();
      this.skipTrivia();
      const params = this.peek() === "(" ? this.readBalanced("(") : "";
      node.signals.push({ name, params, line: memberLine });
      return;
    }
    if (first === "function") {
      this.skipTrivia();
      const name = this.readIdentifier();
      this.skipTrivia();
      const params = this.peek() === "(" ? this.readBalanced("(") : "";
      this.skipTrivia();
      let returnType: string | undefined;
      if (this.peek() === ":") { this.advance(); this.skipTrivia(); returnType = this.readPropertyType(); this.skipTrivia(); }
      const body = this.peek() === "{" ? this.readBalanced("{") : "";
      node.functions.push({ name, params, returnType, body, line: memberLine });
      return;
    }
    if (first === "enum") {
      this.skipTrivia();
      this.readIdentifier();
      this.skipTrivia();
      if (this.peek() === "{") this.readBalanced("{");
      return;
    }
    if (first === "component") {
      // inline component: `component Name: Type { … }`; plain `component:` binding otherwise
      this.skipTrivia();
      if (IDENT_START.test(this.peek())) {
        this.readIdentifier();
        this.skipTrivia();
        if (this.peek() === ":") {
          this.advance();
          this.skipTrivia();
          const typeState = this.save();
          const typeName = this.readDotted();
          this.skipTrivia();
          if (typeName && this.peek() === "{") { node.children.push(this.parseObject(typeName, typeState.line)); return; }
        }
        this.error("Malformed inline component", memberLine);
        this.recoverMember();
        return;
      }
    }

    // id, bindings, grouped properties, child objects, Behavior on ---------
    this.restore(state);
    const name = this.readDotted();
    this.skipTrivia();

    if (this.peek() === ":") {
      this.advance();
      if (name === "id") {
        this.skipTrivia();
        node.id = this.readIdentifier();
        return;
      }
      const value = this.readBindingValue();
      node.bindings.push({ name, line: memberLine, keywords: [], ...value });
      return;
    }

    if (this.peek() === "{") {
      if (/^[a-z]/.test(name) && !name.includes(".")) { this.parseGroup(name, node); return; }
      node.children.push(this.parseObject(name, memberLine));
      return;
    }

    // `Behavior on opacity { … }`
    if (IDENT_START.test(this.peek())) {
      const wordState = this.save();
      const word = this.readIdentifier();
      if (word === "on") {
        this.skipTrivia();
        const target = this.readDotted();
        this.skipTrivia();
        if (this.peek() === "{") { node.children.push(this.parseObject(name, memberLine, target)); return; }
      }
      this.restore(wordState);
    }

    this.error(`Unexpected token after "${name}" — expected :, {, or "on"`, memberLine);
    this.recoverMember();
  }

  private parsePropertyDeclaration(node: QmlObjectNode, keywords: string[], memberLine: number): void {
    this.skipTrivia();
    const propertyType = this.readPropertyType();
    this.skipTrivia();
    const name = this.readIdentifier();
    if (!propertyType || !name) {
      this.error("Malformed property declaration", memberLine);
      this.recoverMember();
      return;
    }
    this.skipTrivia();
    if (this.peek() === ":") {
      this.advance();
      const value = this.readBindingValue();
      node.bindings.push({ name, line: memberLine, keywords, propertyType, ...value });
      return;
    }
    node.bindings.push({ name, expression: "", line: memberLine, keywords, propertyType });
  }

  parse(): QmlDocument {
    const imports: QmlDocument["imports"] = [];
    const pragmas: QmlDocument["pragmas"] = [];
    for (;;) {
      this.skipTrivia();
      const state = this.save();
      const word = this.readIdentifier();
      if (word === "import" || word === "pragma") {
        let text = word;
        while (!this.eof() && this.peek() !== "\n") text += this.advance();
        (word === "import" ? imports : pragmas).push({ text: text.trim(), line: state.line });
        continue;
      }
      this.restore(state);
      break;
    }

    let root: QmlObjectNode | null = null;
    this.skipTrivia();
    if (!this.eof()) {
      const state = this.save();
      const typeName = this.readDotted();
      this.skipTrivia();
      if (typeName && /^[A-Z]/.test(typeName) && this.peek() === "{") {
        root = this.parseObject(typeName, state.line);
      } else {
        this.restore(state);
        this.error(typeName ? `Expected "{" after root type ${typeName}` : "Expected a root object declaration");
      }
    }

    this.skipTrivia();
    if (root && !this.eof()) this.error("Content after the root object is not part of any QML document");

    return { imports, pragmas, root, errors: this.errors };
  }
}

export function parseQml(code: string): QmlDocument {
  return new Parser(code).parse();
}

let cachedCode: string | null = null;
let cachedDoc: QmlDocument | null = null;

/** Parse with a single-entry memo — checks re-run on every keystroke against the same text. */
export function parseQmlCached(code: string): QmlDocument {
  if (cachedCode === code && cachedDoc) return cachedDoc;
  cachedCode = code;
  cachedDoc = parseQml(code);
  return cachedDoc;
}

// Query helpers --------------------------------------------------------------

/** All objects in document order, including object-valued bindings (delegate:, component:, states: [ … ]). */
export function allObjects(doc: QmlDocument): QmlObjectNode[] {
  const out: QmlObjectNode[] = [];
  const walk = (node: QmlObjectNode): void => {
    out.push(node);
    node.children.forEach(walk);
    node.bindings.forEach(binding => {
      if (binding.object) walk(binding.object);
      binding.objects?.forEach(walk);
    });
  };
  if (doc.root) walk(doc.root);
  return out;
}

/** Objects whose type matches (last dotted segment compared, so "PanelWindow" matches "Quickshell.PanelWindow"). */
export function findObjects(doc: QmlDocument, typeName: string): QmlObjectNode[] {
  return allObjects(doc).filter(node => node.type === typeName || node.type.split(".").pop() === typeName);
}

/** Every binding in the document with its owning object. */
export function allBindings(doc: QmlDocument): { owner: QmlObjectNode; binding: QmlBinding }[] {
  return allObjects(doc).flatMap(owner => owner.bindings.map(binding => ({ owner, binding })));
}

/** A binding on this specific object by exact (possibly flattened) name. */
export function bindingOf(node: QmlObjectNode, name: string): QmlBinding | undefined {
  return node.bindings.find(binding => binding.name === name);
}
