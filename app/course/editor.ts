import { parseQmlCached } from "./qmlAst.ts";

export type QmlDiagnostic = {
  severity: "error" | "warning" | "info";
  line: number;
  message: string;
  hint: string;
};

type Delimiter = { char: "{" | "[" | "("; line: number };

const matchingOpen: Record<string, Delimiter["char"]> = { "}": "{", "]": "[", ")": "(" };

/**
 * Replace comment characters with spaces so downstream regex checks and
 * heuristics only ever match real code. String literals are preserved and
 * line/column positions stay stable (every stripped character becomes one
 * space, newlines are kept). Unlike a naive regex strip, this never eats
 * `//` inside a string such as "https://example.com".
 *
 * With `blankStrings`, string interiors are also blanked (quotes kept) so
 * structural heuristics cannot be fooled by text like `text: "Item { fake }"`.
 */
export function stripQmlComments(code: string, blankStrings = false): string {
  let out = "";
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    const next = code[index + 1];

    if (char === "\n") { out += "\n"; lineComment = false; continue; }
    if (lineComment) { out += " "; continue; }
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; out += "  "; index += 1; }
      else out += " ";
      continue;
    }
    if (quote) {
      if (escaped) { out += blankStrings ? " " : char; escaped = false; continue; }
      if (char === "\\") { out += blankStrings ? " " : char; escaped = true; continue; }
      if (char === quote) { out += char; quote = ""; continue; }
      out += blankStrings ? " " : char;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; out += "  "; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; out += "  "; index += 1; continue; }
    if (char === '"' || char === "'" || char === "`") quote = char;
    out += char;
  }

  return out;
}

export function analyzeQml(code: string): QmlDiagnostic[] {
  const diagnostics: QmlDiagnostic[] = [];
  const stack: Delimiter[] = [];
  let line = 1;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    const next = code[index + 1];

    if (char === "\n") {
      line += 1;
      lineComment = false;
      continue;
    }
    if (lineComment) continue;
    if (blockComment) {
      if (char === "*" && next === "/") { blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === "{" || char === "[" || char === "(") { stack.push({ char, line }); continue; }
    if (matchingOpen[char]) {
      const opening = stack.pop();
      if (!opening || opening.char !== matchingOpen[char]) diagnostics.push({ severity: "error", line, message: `Unexpected ${char}`, hint: "Match every closing delimiter to the object, list, or expression that opened it." });
    }
  }

  if (quote) diagnostics.push({ severity: "error", line, message: "Unclosed string", hint: "Add the missing quote before continuing the object declaration." });
  if (blockComment) diagnostics.push({ severity: "error", line, message: "Unclosed block comment", hint: "Close the comment with */ so the remaining QML is parsed." });
  stack.reverse().forEach(item => diagnostics.push({ severity: "error", line: item.line, message: `Unclosed ${item.char}`, hint: "Close the object, list, or expression before the end of the file." }));

  // Heuristics run with string interiors blanked as well, so string content
  // can never fake a root object, an id, or a warning trigger.
  const meaningful = stripQmlComments(code, true);
  if (!/^import\s+/m.test(meaningful)) diagnostics.push({ severity: "warning", line: 1, message: "No module import found", hint: "Most QML files begin with import QtQuick, import Quickshell, or a local module import." });
  if (!/\b[A-Z][A-Za-z0-9_.]*\s*\{/.test(meaningful)) diagnostics.push({ severity: "error", line: 1, message: "No root QML object found", hint: "Declare one root object such as Item, Rectangle, QtObject, ShellRoot, or PanelWindow." });

  const ids = [...meaningful.matchAll(/\bid\s*:\s*([a-z][A-Za-z0-9_]*)/g)];
  const seen = new Map<string, number>();
  ids.forEach(match => {
    const id = match[1];
    const idLine = meaningful.slice(0, match.index).split("\n").length;
    if (seen.has(id)) diagnostics.push({ severity: "error", line: idLine, message: `Duplicate id: ${id}`, hint: "An id must be unique inside its QML component." });
    else seen.set(id, idLine);
  });

  if (/command\s*:\s*["']/.test(meaningful)) diagnostics.push({ severity: "warning", line: meaningful.slice(0, meaningful.search(/command\s*:\s*["']/)).split("\n").length, message: "Process command is a string", hint: "Quickshell Process expects an argument list such as [\"program\", \"--flag\"]." });
  if (/Quickshell\.screens\s*\[\s*0\s*\]/.test(meaningful)) diagnostics.push({ severity: "warning", line: meaningful.slice(0, meaningful.search(/Quickshell\.screens\s*\[/)).split("\n").length, message: "Fixed screen index", hint: "Use Variants or an explicit focused-screen service; index zero is not stable across hotplug." });
  if (/PanelWindow\s*\{[\s\S]*color\s*:\s*["']transparent["'][\s\S]*anchors\s*\{[\s\S]*(top|bottom)[\s\S]*left[\s\S]*right/.test(meaningful) && !/mask\s*:\s*Region/.test(meaningful)) diagnostics.push({ severity: "warning", line: 1, message: "Transparent orchestration surface has no input mask", hint: "Use a Region mask so invisible areas pass clicks through to applications." });

  // Structural parse issues (beyond delimiter balance) with exact lines, e.g.
  // "Unexpected token after 'width' — expected :, {, or 'on'". Kept
  // non-blocking: the parser is intentionally lenient, and a false error here
  // must never lock a learner out of completing a quest.
  parseQmlCached(code).errors
    .filter(item => !item.message.startsWith("Unclosed") && !item.message.startsWith("Expected a root object"))
    .forEach(item => diagnostics.push({ severity: "warning", line: item.line, message: item.message, hint: "The object tree could not be fully read here — check property colons, braces, and declarations." }));

  return diagnostics.sort((a, b) => a.line - b.line || (a.severity === "error" ? -1 : 1));
}

export function hasBlockingDiagnostics(diagnostics: QmlDiagnostic[]): boolean {
  return diagnostics.some(diagnostic => diagnostic.severity === "error");
}
