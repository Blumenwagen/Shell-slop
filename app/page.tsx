"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Check = { label: string; hint: string; test: (code: string) => boolean };
type Quiz = { question: string; options: string[]; answer: number; explanation: string };
type Scene = "object" | "binding" | "layout" | "control" | "motion" | "model" | "theme" | "bar" | "screens" | "graph" | "drawer" | "audit";

type Quest = {
  id: string;
  world: number;
  title: string;
  subtitle: string;
  minutes: number;
  xp: number;
  boss?: boolean;
  objective: string;
  story: string;
  explanation: string[];
  analogy: string;
  rules: string[];
  terms: [string, string][];
  anatomy: string;
  anatomyNotes: string[];
  starter: string;
  solution: string;
  checks: Check[];
  quiz: Quiz;
  scene: Scene;
};

type World = { name: string; eyebrow: string; description: string; color: string; image: string; mapX: number; mapY: number };

const worlds: World[] = [
  { name: "First Sparks", eyebrow: "World 1 · zero knowledge required", description: "Learn how QML thinks: objects, properties, identity, and reactive bindings.", color: "violet", image: "/world-first-sparks.png", mapX: 20, mapY: 27 },
  { name: "Shape District", eyebrow: "World 2 · compose visible things", description: "Own space, arrange content, extract components, and design interaction feedback.", color: "coral", image: "/world-shape-district.png", mapX: 50, mapY: 26 },
  { name: "Motion Arcade", eyebrow: "World 3 · make state feel alive", description: "Create causal motion, named states, stable collections, and a token-driven visual language.", color: "cyan", image: "/world-motion-arcade.png", mapX: 80, mapY: 28 },
  { name: "System Frontier", eyebrow: "World 4 · enter Quickshell", description: "Cross from ordinary QML into real desktop surfaces, screen models, and system services.", color: "lime", image: "/world-system-frontier.png", mapX: 79, mapY: 70 },
  { name: "Living Shell", eyebrow: "World 5 · architecture becomes UX", description: "Separate state, focus, input, services, and connected edge geometry into a reliable product.", color: "amber", image: "/world-living-shell.png", mapX: 50, mapY: 72 },
  { name: "Hero Forge", eyebrow: "World 6 · ship your own shell", description: "Add performance, IPC, a complete vertical slice, and the validation discipline of a shellwright.", color: "pink", image: "/world-hero-forge.png", mapX: 20, mapY: 70 },
];

const ck = (label: string, hint: string, pattern: RegExp): Check => ({ label, hint, test: code => pattern.test(code) });

const quests: Quest[] = [
  {
    id: "qml-is-a-description", world: 0, title: "Tell QML what exists", subtitle: "Declarative UI, without the jargon", minutes: 16, xp: 100,
    objective: "Create your first object and understand why QML is a description rather than a list of drawing commands.",
    story: "Every shell begins with one surface. Before we animate a drawer or read the volume, you need the one idea that makes every later lesson click.",
    explanation: [
      "QML is a language for describing a tree of objects. You say that a Rectangle exists, which properties it has, and which children live inside it. Qt keeps that tree on screen for you.",
      "This is different from imperative code, where you would create a window, calculate positions, paint pixels, and remember to repaint them. In QML you describe the result and the relationships that must remain true.",
      "A QML file normally creates one root object. Objects nested inside its braces become children. The child is drawn above its parent and can refer to the parent when sizing or positioning itself.",
    ],
    analogy: "Think of QML as a stage plan, not a stagehand's checklist. “A purple platform fills the stage; a label stands in its center” is QML. “Fetch wood, measure it, paint it, move it” is imperative code.",
    rules: ["A file describes one root object.", "Nested objects form a parent–child tree.", "Properties describe each object's current state."],
    terms: [["Object", "A live thing with properties, such as Rectangle or Text."], ["Root", "The outermost object created by the file."], ["Property", "A named value such as width, color, or text."]],
    anatomy: `import QtQuick

Rectangle {              // root object
    width: 240           // a number property
    height: 120
    color: "#8b7cff"     // a colour property

    Text {               // child object
        anchors.centerIn: parent
        text: "Hello, shell"
    }
}`,
    anatomyNotes: ["import makes Qt Quick's visual types available.", "Rectangle is the root and owns this little scene.", "Text is nested, so Rectangle becomes its parent."],
    starter: `import QtQuick

Rectangle {
    width: 220
    height: 100
}`,
    solution: `import QtQuick

Rectangle {
    width: 220
    height: 100
    color: "#8b7cff"

    Text {
        anchors.centerIn: parent
        text: "My first surface"
        color: "#17131f"
    }
}`,
    checks: [ck("Give the surface a colour", "Add color: \"#8b7cff\" inside Rectangle.", /color\s*:/), ck("Nest a Text object", "Place Text { … } inside the Rectangle.", /Text\s*\{/), ck("Give the text words", "Set the Text object's text property.", /text\s*:\s*["']/)],
    quiz: { question: "When a Text object is written inside a Rectangle, what is the Rectangle?", options: ["A function", "The Text object's parent", "An import", "A signal"], answer: 1, explanation: "Nesting creates the object tree. The outer object is the parent; the nested object is its child." },
    scene: "object",
  },
  {
    id: "imports-and-tree", world: 0, title: "Read the object tree", subtitle: "Imports, braces, and visual ancestry", minutes: 18, xp: 100,
    objective: "Read a QML file from the outside inward and identify which module provides each type.",
    story: "A shell can contain hundreds of objects, but it never stops being a tree. Learn to trace its branches and large files become far less mysterious.",
    explanation: [
      "An import makes a module's types available in the file. `import QtQuick` gives you visual primitives such as Item, Rectangle, Text, MouseArea, and animation types.",
      "Braces create and configure an object. Indentation is for humans; nesting is determined by braces. Siblings share the same parent, while deeper objects inherit another level of ancestry.",
      "Item is an invisible visual container. It has position and size but paints nothing. It is useful when you want structure without adding another visible sheet.",
    ],
    analogy: "Imports are toolboxes. Objects are the pieces you take out. Braces are the assembly instructions attached to each piece.",
    rules: ["Import the module that owns a type.", "Use Item for invisible structure.", "Read ownership from braces, not indentation alone."],
    terms: [["Import", "Makes types from a module available."], ["Item", "A visual object that owns geometry but paints nothing."], ["Sibling", "An object with the same parent as another object."]],
    anatomy: `import QtQuick

Item {                   // invisible root
    width: 320
    height: 180

    Rectangle {          // child 1
        anchors.fill: parent
        color: "#211d2b"
    }

    Text {               // child 2: sibling
        text: "Two children"
    }
}`,
    anatomyNotes: ["Item provides geometry without painting a background.", "Rectangle and Text are siblings because both sit directly inside Item.", "The later sibling is painted above the earlier one."],
    starter: `import QtQuick

Rectangle {
    width: 280
    height: 140
    color: "#211d2b"
}`,
    solution: `import QtQuick

Item {
    width: 280
    height: 140

    Rectangle {
        anchors.fill: parent
        color: "#211d2b"
    }

    Text {
        anchors.centerIn: parent
        text: "I am a sibling"
        color: "#f7f1ff"
    }
}`,
    checks: [ck("Use an invisible Item root", "Change the outer root to Item.", /Item\s*\{/), ck("Create two visible children", "Nest both Rectangle and Text inside Item.", /Rectangle\s*\{[\s\S]*Text\s*\{/), ck("Fill the background", "Set anchors.fill: parent on Rectangle.", /anchors\.fill\s*:\s*parent/)],
    quiz: { question: "Which QML type has size and position but paints nothing by itself?", options: ["Text", "Item", "Rectangle", "MouseArea"], answer: 1, explanation: "Item is QML's basic invisible visual container. It is ideal for structure and grouping." },
    scene: "object",
  },
  {
    id: "properties-types-ids", world: 0, title: "Name and type your state", subtitle: "Properties, id, and safe references", minutes: 22, xp: 110,
    objective: "Declare typed properties and use an id to refer to one object from another.",
    story: "A reactive shell needs facts it can trust. Typed properties give each fact a name and a shape; ids let nearby objects form clear relationships.",
    explanation: [
      "Built-in properties already belong to a type: Rectangle has width, height, radius, and color. You add your own state with `property <type> <name>: <value>`.",
      "Common types include bool, int, real, string, color, url, var, and references to QML types. Prefer a precise type; it catches mistakes and explains your intent to tools and future you.",
      "An `id` is a file-local object reference, not a string. Writing `id: card` lets descendants and siblings use `card.width` or `card.expanded`. It does not become a global variable.",
    ],
    analogy: "A property is a labelled socket. Its type determines which plug fits. An id is the local map coordinate that tells nearby objects which socket they are connected to.",
    rules: ["Prefer a specific type over var.", "Use lowerCamelCase property names.", "Use id for local references, not cross-application global state."],
    terms: [["bool", "A true/false value."], ["real", "A number that may contain decimals."], ["id", "A compile-time name for an object inside one QML component."]],
    anatomy: `Rectangle {
    id: card
    property bool expanded: false
    property int compactWidth: 160
    readonly property string label: "Launcher"

    width: card.compactWidth

    Text {
        text: card.label
    }
}`,
    anatomyNotes: ["expanded is mutable UI state.", "compactWidth is a typed design value.", "readonly means consumers can observe label but cannot assign it."],
    starter: `import QtQuick

Rectangle {
    width: 160
    height: 52

    Text { text: "Launcher" }
}`,
    solution: `import QtQuick

Rectangle {
    id: card
    property bool expanded: false
    property int compactWidth: 160
    readonly property string label: "Launcher"

    width: card.compactWidth
    height: 52

    Text {
        anchors.centerIn: parent
        text: card.label
    }
}`,
    checks: [ck("Give the root an id", "Add id: card.", /id\s*:\s*card/), ck("Declare typed state", "Add property bool expanded: false.", /property\s+bool\s+expanded/), ck("Reference the id", "Use card.<property> in a child or root property.", /card\.[A-Za-z]/)],
    quiz: { question: "What is `id: card` in QML?", options: ["A user-visible string", "A file-local object reference", "A CSS selector", "A persistent setting"], answer: 1, explanation: "An id names the actual QML object within the component. It is not text and is not automatically global or persistent." },
    scene: "binding",
  },
  {
    id: "reactive-bindings", world: 0, title: "Build the reactive chain", subtitle: "Bindings: QML's superpower", minutes: 28, xp: 180, boss: true,
    objective: "Make a surface derive its size, colour, radius, and label from one boolean property.",
    story: "Boss gate: wake the first living surface. One change should flow through the entire object tree without a manual update function.",
    explanation: [
      "A binding is an expression assigned to a property. `width: expanded ? 360 : 160` means width depends on expanded. QML records that dependency and evaluates the expression again whenever expanded changes.",
      "The crucial habit is to store the smallest source of truth and derive everything else. Do not store `expanded`, `currentWidth`, `currentRadius`, and `currentLabel` if all but one can be calculated.",
      "An event handler may change the source state. The view then follows through bindings. This clean direction—input changes intent, bindings change appearance—is the foundation of a maintainable shell.",
    ],
    analogy: "Bindings are spreadsheet formulas. Change one input cell and every formula that depends on it recalculates. You do not visit each result cell and type a new value.",
    rules: ["Store source state once.", "Derive view state with bindings.", "Avoid assigning to a property that should remain bound."],
    terms: [["Binding", "A live expression that keeps a property synchronized with dependencies."], ["Dependency", "A value read by a binding."], ["Source of truth", "The smallest authoritative state from which other values are derived."]],
    anatomy: `Rectangle {
    id: root
    property bool expanded: false

    width: expanded ? 360 : 160
    radius: expanded ? 28 : 18
    color: expanded ? "#baff75" : "#292336"

    Text {
        text: root.expanded ? "Open" : "Closed"
    }
}`,
    anatomyNotes: ["All four visual results read one source: expanded.", "The ternary operator chooses one of two values.", "No onExpandedChanged handler is needed."],
    starter: `import QtQuick

Rectangle {
    id: root
    property bool expanded: false

    width: 160
    height: 56
    radius: 18
    color: "#292336"

    Text { anchors.centerIn: parent; text: "Closed" }
}`,
    solution: `import QtQuick

Rectangle {
    id: root
    property bool expanded: false

    width: expanded ? 360 : 160
    height: expanded ? 220 : 56
    radius: expanded ? 28 : 18
    color: expanded ? "#baff75" : "#292336"

    Text {
        anchors.centerIn: parent
        text: root.expanded ? "Open" : "Closed"
    }

    MouseArea {
        anchors.fill: parent
        onClicked: root.expanded = !root.expanded
    }
}`,
    checks: [ck("Create one boolean source", "Declare property bool expanded: false.", /property\s+bool\s+expanded/), ck("Derive at least two properties", "Use expanded ? … : … on multiple properties.", /width\s*:[^\n]*expanded\s*\?[\s\S]*(?:radius|color|height|text)\s*:[^\n]*expanded\s*\?/), ck("Toggle the source from input", "Use onClicked to invert root.expanded.", /onClicked\s*:[^\n]*expanded\s*=\s*!/)],
    quiz: { question: "Why store only `expanded` instead of also storing currentWidth and currentLabel?", options: ["QML allows only one property", "Derived values stay consistent automatically", "It makes the file longer", "Bindings cannot use numbers"], answer: 1, explanation: "When width and label are derived, they cannot disagree with expanded. Fewer independent facts mean fewer impossible states." },
    scene: "binding",
  },
  {
    id: "geometry-anchors", world: 1, title: "Own a place in space", subtitle: "Coordinates, implicit size, and anchors", minutes: 24, xp: 110,
    objective: "Attach a compact status surface to an edge without calculating x and y yourself.",
    story: "Your surface is alive; now it needs a home. Shell UI should visibly belong to an edge or trigger, not drift around the screen by accident.",
    explanation: [
      "Every visual item has x, y, width, and height relative to its parent. You can assign them directly, but direct coordinates become fragile when the parent resizes.",
      "Anchors express relationships: left to parent's left, verticalCenter to a sibling's verticalCenter, or fill to all four parent edges. Margins add intentional breathing room.",
      "implicitWidth and implicitHeight are the size an item would like to be. Controls and text often provide useful implicit sizes; layouts can respect them without hard-coded dimensions.",
    ],
    analogy: "Coordinates say “stand at floor tile 120.” Anchors say “keep one hand on the right wall.” When the room changes size, the anchored person still knows where to stand.",
    rules: ["Anchor ownership, not every possible edge.", "Avoid mixing conflicting anchors with x/y.", "Use implicit size for natural content dimensions."],
    terms: [["Anchor", "A maintained geometric relationship between items."], ["Margin", "Space inserted between an anchor and its target."], ["implicitWidth", "The natural width requested by an item."]],
    anatomy: `Rectangle {
    id: badge
    width: label.implicitWidth + 24
    height: 36

    anchors {
        top: parent.top
        right: parent.right
        margins: 12
    }

    Text { id: label; text: "87%" }
}`,
    anatomyNotes: ["The label's natural width drives the badge width.", "Grouped anchor syntax keeps geometry readable.", "The surface remains attached as its parent changes."],
    starter: `import QtQuick

Rectangle {
    width: 360
    height: 180
    color: "#17131f"

    Rectangle {
        width: 72
        height: 36
        color: "#ff907f"
    }
}`,
    solution: `import QtQuick

Rectangle {
    width: 360
    height: 180
    color: "#17131f"

    Rectangle {
        width: label.implicitWidth + 24
        height: 36
        radius: 18
        color: "#ff907f"
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 12

        Text { id: label; anchors.centerIn: parent; text: "87%" }
    }
}`,
    checks: [ck("Attach to a vertical edge", "Use anchors.top or anchors.bottom.", /anchors\.(?:top|bottom)\s*:/), ck("Attach to a horizontal edge", "Use anchors.left or anchors.right.", /anchors\.(?:left|right)\s*:/), ck("Add intentional spacing", "Set an anchor margin.", /anchors\.(?:margins|topMargin|rightMargin|leftMargin|bottomMargin)\s*:/)],
    quiz: { question: "Why prefer anchors over fixed x/y for an edge badge?", options: ["Anchors change its colour", "Anchors preserve the relationship when the parent resizes", "x/y cannot be numbers", "Anchors make it persistent"], answer: 1, explanation: "Anchors describe what the position means. QML maintains that relationship as geometry changes." },
    scene: "layout",
  },
  {
    id: "layouts-and-sizing", world: 1, title: "Compose with rhythm", subtitle: "Rows, columns, and layout negotiation", minutes: 28, xp: 120,
    objective: "Build a compact bar whose middle space stretches while status groups keep their natural size.",
    story: "A useful bar is a piece of information choreography. Layouts keep its rhythm intact as clocks, languages, and screen sizes change.",
    explanation: [
      "Positioners such as Row and Column place children using their current sizes. Qt Quick Layouts add negotiation: children can request minimum, preferred, maximum, and fill behavior.",
      "Inside RowLayout, `Layout.fillWidth: true` lets one child absorb spare horizontal space. A plain Item can become a flexible spacer between semantic groups.",
      "Layouts own the geometry of their direct children. Do not anchor those same children along the layout's axis; that creates competing instructions.",
    ],
    analogy: "A layout is a seating host. Each guest reports how much room they need; one flexible guest agrees to take the empty seats. Anchoring a guest inside the row is like ignoring the seating plan.",
    rules: ["Use layouts for repeated rhythm.", "Use attached Layout properties on direct children.", "Group related items tightly and separate unrelated groups more strongly."],
    terms: [["RowLayout", "A horizontal layout that negotiates child widths."], ["Attached property", "A property supplied by a child's container, such as Layout.fillWidth."], ["spacing", "The consistent gap between children."]],
    anatomy: `RowLayout {
    anchors.fill: parent
    spacing: 10

    WorkspaceStrip { }
    Item { Layout.fillWidth: true }
    Clock { }
    StatusCluster { }
}`,
    anatomyNotes: ["The layout owns direct-child geometry.", "The invisible Item absorbs the variable middle space.", "The named groups express product hierarchy."],
    starter: `import QtQuick
import QtQuick.Layouts

Rectangle {
    width: 520
    height: 52

    Text { text: "1  2  3" }
    Text { text: "14:42" }
    Text { text: "87%" }
}`,
    solution: `import QtQuick
import QtQuick.Layouts

Rectangle {
    width: 520
    height: 52
    color: "#211d2b"

    RowLayout {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 12

        Text { text: "1  2  3"; color: "#b8a8ff" }
        Item { Layout.fillWidth: true }
        Text { text: "14:42"; color: "white" }
        Text { text: "87%"; color: "#baff75" }
    }
}`,
    checks: [ck("Use RowLayout", "Wrap bar content in RowLayout.", /RowLayout\s*\{/), ck("Fill the parent surface", "Anchor the layout with anchors.fill: parent.", /anchors\.fill\s*:\s*parent/), ck("Add a flexible spacer", "Put Layout.fillWidth: true on an Item.", /Item\s*\{[^}]*Layout\.fillWidth\s*:\s*true/)],
    quiz: { question: "Who should control the width of a direct RowLayout child?", options: ["The layout and its Layout.* hints", "An animation timer", "A global singleton", "The import statement"], answer: 0, explanation: "The layout negotiates direct-child geometry. Give it hints through Layout properties instead of conflicting anchors." },
    scene: "layout",
  },
  {
    id: "signals-and-functions", world: 1, title: "Send intent, not tentacles", subtitle: "Signals, handlers, and functions", minutes: 30, xp: 130,
    objective: "Make a reusable control announce an action without knowing what the application will do with it.",
    story: "The fastest way to make a shell tangled is letting every button reach into everything else. Signals cut those tentacles.",
    explanation: [
      "A signal announces that something happened. It may carry typed values. The component that emits `activated()` does not need to know whether the caller opens a drawer, changes workspace, or plays a sound.",
      "An event handler begins with `on`, followed by the signal name: clicked becomes onClicked; activated becomes onActivated. Handlers are a good place to update intent or call a function.",
      "Functions package reusable actions. Give parameters and return values explicit types when the QML version supports it; typed contracts make IPC and component behavior much easier to reason about.",
    ],
    analogy: "A doorbell emits “pressed.” It does not walk through the house and decide who should answer. The home decides what to do when it hears the signal.",
    rules: ["Signals describe events in product language.", "Emit intent from controls.", "Keep business or shell state outside visual primitives."],
    terms: [["Signal", "A typed event other objects may handle."], ["Handler", "Code that runs when a signal fires."], ["Function", "A named reusable action that can accept and return values."]],
    anatomy: `Rectangle {
    id: control
    signal activated(string actionId)

    function trigger(): void {
        activated("launcher")
    }

    TapHandler {
        onTapped: control.trigger()
    }
}`,
    anatomyNotes: ["The signal carries a semantic action id.", "trigger centralizes the component's action path.", "The parent chooses what onActivated means."],
    starter: `import QtQuick

Rectangle {
    id: control
    width: 120
    height: 40

    MouseArea { anchors.fill: parent }
}`,
    solution: `import QtQuick

Rectangle {
    id: control
    signal activated(string actionId)

    width: 120
    height: 40

    function trigger(): void {
        control.activated("launcher")
    }

    MouseArea {
        anchors.fill: parent
        onClicked: control.trigger()
    }
}`,
    checks: [ck("Declare a signal", "Add signal activated(string actionId).", /signal\s+activated\s*\(/), ck("Create a typed function", "Add a function ending in : void.", /function\s+\w+\s*\([^)]*\)\s*:\s*void/), ck("Route input through the action", "Call your function or signal from onClicked/onTapped.", /on(?:Clicked|Tapped)\s*:[^\n]*(?:trigger|activated)\s*\(/)],
    quiz: { question: "Why should a reusable button emit `activated()` instead of directly opening a global drawer?", options: ["Signals are prettier", "It keeps the button reusable and removes hidden coupling", "Global state is forbidden", "Functions cannot change state"], answer: 1, explanation: "The control reports intent. Its owner decides the effect, so the same control can be reused without knowing application policy." },
    scene: "control",
  },
  {
    id: "component-contracts", world: 1, title: "Forge a real component", subtitle: "Files, required properties, and encapsulation", minutes: 34, xp: 190, boss: true,
    objective: "Extract a repeated status pill into a reusable component with a clear public contract.",
    story: "Boss gate: turn a pile of one-off rectangles into a small design system. Reuse should preserve behavior, not only colour and radius.",
    explanation: [
      "A QML file whose name begins with a capital letter defines a component type. `StatusPill.qml` can be instantiated elsewhere as `StatusPill { ... }` when it is in the import path.",
      "`required property` means the caller must provide a value. Use it when the component cannot invent a safe default, such as a label, screen, model object, or service dependency.",
      "Keep implementation details behind the root object's public properties and signals. Callers should not reach inside to recolor an internal Rectangle or trigger an internal MouseArea.",
    ],
    analogy: "A component is a vending machine, not an open toolbox. Its buttons and coin slot are the contract; the motors inside are private implementation.",
    rules: ["Name reusable component files with a capital letter.", "Require essential inputs.", "Expose behavior through properties and signals, not child ids."],
    terms: [["Component", "A reusable QML object type."], ["required property", "An input the caller must supply."], ["Encapsulation", "Keeping internal implementation behind a small public interface."]],
    anatomy: `// StatusPill.qml
import QtQuick

Rectangle {
    id: root
    required property string label
    property bool selected: false
    signal activated

    width: text.implicitWidth + 24
    Text { id: text; text: root.label }
    TapHandler { onTapped: root.activated() }
}`,
    anatomyNotes: ["The filename makes StatusPill a type.", "label is essential, so it is required.", "selected and activated are the public state and intent surfaces."],
    starter: `import QtQuick

Rectangle {
    id: root
    width: labelItem.implicitWidth + 24
    height: 36

    Text {
        id: labelItem
        text: "Status"
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: root
    required property string label
    property bool selected: false
    signal activated

    width: labelItem.implicitWidth + 24
    height: 36
    radius: selected ? 18 : 10
    color: selected ? "#b8a8ff" : "#292336"

    Text {
        id: labelItem
        anchors.centerIn: parent
        text: root.label
    }

    TapHandler { onTapped: root.activated() }
}`,
    checks: [ck("Require the label", "Declare required property string label.", /required\s+property\s+string\s+label/), ck("Expose selected state", "Add property bool selected.", /property\s+bool\s+selected/), ck("Expose activation intent", "Declare and emit an activated signal.", /signal\s+activated[\s\S]*(?:activated\s*\(|activated\s*\))/)],
    quiz: { question: "Which value should usually be a `required property`?", options: ["A label the component cannot sensibly invent", "Every radius token", "Mouse hover state", "An internal animation object"], answer: 0, explanation: "Required properties are for essential dependencies or data. Internal state and safe design defaults should remain inside the component." },
    scene: "control",
  },
  {
    id: "interaction-state", world: 2, title: "Make every touch answer", subtitle: "Hover, press, focus, and selection", minutes: 26, xp: 120,
    objective: "Create one consistent interaction layer instead of reinventing feedback in every feature.",
    story: "A playful shell is never silent. Pointer, keyboard, and touch interactions should all receive immediate, coherent feedback.",
    explanation: [
      "Controls need more than clicked and not-clicked. Hover previews affordance, press confirms contact, keyboard focus shows location, selected communicates durable state, and disabled explains unavailable action.",
      "Treat these as layers over a semantic base colour. A small state overlay or shared ButtonBase component keeps every feature from inventing different opacity, timing, and cursor behavior.",
      "Focus is not an afterthought. Use visible focus treatment and preserve a sensible activation target; shell actions must remain possible without a pointer.",
    ],
    analogy: "Good interaction is a conversation: hover says “I hear you,” press says “I felt that,” focus says “you are here,” and selection says “this choice remains active.”",
    rules: ["Respond immediately to contact.", "Distinguish transient press from durable selection.", "Give keyboard focus a visible shape."],
    terms: [["Hover", "Pointer presence over an interactive target."], ["Focus", "The target receiving keyboard input."], ["State layer", "A reusable visual overlay for interaction states."]],
    anatomy: `Rectangle {
    id: button
    property bool selected: false

    color: selected ? theme.primary : theme.surface
    scale: tap.pressed ? 0.96 : 1

    HoverHandler { id: hover }
    TapHandler { id: tap }

    Rectangle {
        anchors.fill: parent
        opacity: tap.pressed ? 0.16 : hover.hovered ? 0.08 : 0
    }
}`,
    anatomyNotes: ["Durable selected state chooses the base colour.", "Press changes form immediately.", "The overlay centralizes hover/press emphasis."],
    starter: `import QtQuick

Rectangle {
    id: button
    property bool selected: false
    width: 120
    height: 42
    color: "#292336"
}`,
    solution: `import QtQuick

Rectangle {
    id: button
    property bool selected: false
    width: 120
    height: 42
    radius: tap.pressed ? 12 : 21
    color: selected ? "#b8a8ff" : "#292336"
    scale: tap.pressed ? 0.96 : 1

    HoverHandler { id: hover }
    TapHandler {
        id: tap
        onTapped: button.selected = !button.selected
    }

    Rectangle {
        anchors.fill: parent
        radius: parent.radius
        color: "white"
        opacity: tap.pressed ? 0.16 : hover.hovered ? 0.08 : 0
    }
}`,
    checks: [ck("Observe hover", "Add HoverHandler or hoverEnabled MouseArea.", /(?:HoverHandler|hoverEnabled\s*:\s*true)/), ck("Respond to press", "Bind scale, radius, colour, or opacity to pressed.", /(?:scale|radius|color|opacity)\s*:[^\n]*pressed/), ck("Keep durable selection", "Declare selected and toggle it from input.", /property\s+bool\s+selected[\s\S]*selected\s*=\s*!/)],
    quiz: { question: "Which state should remain after the pointer leaves?", options: ["Hover", "Pressed", "Selected", "Ripple origin"], answer: 2, explanation: "Selected is durable UI state. Hover and press only describe the current interaction." },
    scene: "control",
  },
  {
    id: "behaviors-motion", world: 2, title: "Teach motion a purpose", subtitle: "Behavior and semantic timing", minutes: 30, xp: 130,
    objective: "Animate a changing property from its current value with a motion role that explains causality.",
    story: "Motion is not confetti. Your next surface must reveal where it came from, where it went, and whether the user can reverse it.",
    explanation: [
      "A Behavior watches one property. When a binding gives that property a new target value, the Behavior animates from the current rendered value to the new value.",
      "Name timing by purpose: immediate feedback, fast effect, enter, exit, default spatial, and large spatial. Colour feedback should not wait as long as a large drawer movement.",
      "Spatial arrivals usually decelerate; exits can accelerate and finish sooner. Rapid reversal should continue from the current visual value, not jump back to an old starting point.",
    ],
    analogy: "A Behavior is a skilled courier between old and new values. You provide the destination; the courier chooses the meaningful route and speed.",
    rules: ["Animate the property that explains the change.", "Use semantic duration roles.", "Keep motion reversible and interruptible."],
    terms: [["Behavior", "An animation applied whenever one property changes."], ["Easing", "The speed curve across an animation."], ["Spatial motion", "Movement or resizing that explains where a surface exists."]],
    anatomy: `property int spatialEnter: 420

width: open ? 420 : 56

Behavior on width {
    NumberAnimation {
        duration: spatialEnter
        easing.type: Easing.OutCubic
    }
}`,
    anatomyNotes: ["The binding still owns the target width.", "Behavior supplies only the journey.", "The role name is reusable across spatial arrivals."],
    starter: `import QtQuick

Rectangle {
    id: drawer
    property bool open: false
    width: open ? 420 : 56
    height: 280
}`,
    solution: `import QtQuick

Rectangle {
    id: drawer
    property bool open: false
    readonly property int spatialEnter: 420

    width: open ? 420 : 56
    height: 280

    Behavior on width {
        NumberAnimation {
            duration: drawer.spatialEnter
            easing.type: Easing.OutCubic
        }
    }

    TapHandler { onTapped: drawer.open = !drawer.open }
}`,
    checks: [ck("Name a semantic duration", "Declare a property such as spatialEnter.", /property\s+int\s+(?:spatial|enter|effect)/i), ck("Attach a Behavior", "Use Behavior on width, x, y, or height.", /Behavior\s+on\s+(?:width|height|x|y)/), ck("Choose arrival easing", "Set an Out* easing type.", /easing\.type\s*:\s*Easing\.Out/)],
    quiz: { question: "What does a Behavior own?", options: ["The final state", "The journey when one property changes", "The object tree", "Persistent settings"], answer: 1, explanation: "Bindings or assignments choose target values. Behavior describes how one property travels to its new target." },
    scene: "motion",
  },
  {
    id: "states-transitions", world: 2, title: "Name whole modes", subtitle: "States, PropertyChanges, and Transitions", minutes: 32, xp: 140,
    objective: "Coordinate several property changes under named compact and expanded modes.",
    story: "When several values mean one product mode, naming the mode is clearer than scattering the same condition across twenty ternaries.",
    explanation: [
      "QML State objects group property changes under a name such as compact, expanded, loading, or fullscreen. The root's `state` property selects the active State.",
      "PropertyChanges targets an object and overrides a set of properties while the state is active. A Transition describes how the object moves between named states.",
      "Use states for meaningful modes, not every hover. Simple derived values remain clearer as bindings; states earn their weight when many coordinated changes form one concept.",
    ],
    analogy: "A theatre cue named “night scene” changes lights, curtains, and sound together. The crew invokes one named mode instead of issuing unrelated commands to each device.",
    rules: ["Name product modes, not arbitrary animations.", "Group coordinated changes.", "Keep simple one-property reactions as bindings or Behaviors."],
    terms: [["State", "A named set of property overrides."], ["PropertyChanges", "Changes applied to a target in one state."], ["Transition", "Animations used when moving between states."]],
    anatomy: `state: open ? "expanded" : "compact"

states: [
    State {
        name: "expanded"
        PropertyChanges { target: panel; width: 420; radius: 28 }
    }
]

transitions: Transition {
    NumberAnimation { properties: "width,radius" }
}`,
    anatomyNotes: ["state translates a boolean into a named mode.", "PropertyChanges coordinates geometry under that mode.", "Transition animates the path between modes."],
    starter: `import QtQuick

Rectangle {
    id: panel
    property bool open: false
    width: 64
    height: 240
    radius: 24
}`,
    solution: `import QtQuick

Rectangle {
    id: panel
    property bool open: false
    state: open ? "expanded" : "compact"
    width: 64
    height: 240
    radius: 24

    states: State {
        name: "expanded"
        PropertyChanges { target: panel; width: 420; radius: 32 }
    }

    transitions: Transition {
        NumberAnimation { properties: "width,radius"; duration: 420; easing.type: Easing.OutCubic }
    }

    TapHandler { onTapped: panel.open = !panel.open }
}`,
    checks: [ck("Select a named state", "Bind state to compact/expanded or similar names.", /state\s*:[^\n]*(?:expanded|open|compact)/), ck("Define a State", "Add State { name: … }.", /State\s*\{[\s\S]*name\s*:/), ck("Coordinate a Transition", "Add Transition with an animation.", /Transition\s*\{[\s\S]*(?:NumberAnimation|PropertyAnimation)/)],
    quiz: { question: "When are QML States most useful?", options: ["For every colour literal", "When several coordinated changes form one named mode", "Only for saving to disk", "Instead of all properties"], answer: 1, explanation: "States shine when many changes express one mode. A simple property reaction often remains clearer as a binding." },
    scene: "motion",
  },
  {
    id: "models-delegates", world: 2, title: "Multiply without copy-paste", subtitle: "Models, delegates, and stable identity", minutes: 38, xp: 200, boss: true,
    objective: "Render a changing workspace collection from data while preserving each delegate's identity.",
    story: "Boss gate: summon five workspaces from one recipe. A real shell has live collections everywhere; copy-paste cannot keep up.",
    explanation: [
      "A model holds data. A delegate describes one visual instance. Repeater creates a fixed set of visual children; ListView adds scrolling, virtualization, current item, and transitions.",
      "Delegates receive model roles such as index, modelData, name, or active. Declare required properties when using bound component behavior so dependencies stay explicit.",
      "Identity matters when data changes. In Quickshell, ScriptModel can preserve objects across filtering and sorting; rebuilding a raw JavaScript array may destroy every delegate and interrupt animation.",
    ],
    analogy: "A model is a guest list; a delegate is the name-card design. You change the guest list, not hand-design a new table for every person.",
    rules: ["Keep data separate from its visual recipe.", "Bind delegates to model roles.", "Preserve identity across live updates."],
    terms: [["Model", "A collection of data exposed to a view."], ["Delegate", "The component created for one model entry."], ["Identity", "The stable object relationship that lets state and animation survive updates."]],
    anatomy: `Row {
    property int activeWorkspace: 2

    Repeater {
        model: 5
        Rectangle {
            required property int index
            width: index + 1 === parent.activeWorkspace ? 48 : 28
        }
    }
}`,
    anatomyNotes: ["The model decides how many delegates exist.", "index is data supplied to each delegate.", "Appearance derives from data instead of copied objects."],
    starter: `import QtQuick

Row {
    spacing: 8
    Rectangle { width: 28; height: 28 }
    Rectangle { width: 28; height: 28 }
    Rectangle { width: 28; height: 28 }
}`,
    solution: `pragma ComponentBehavior: Bound

import QtQuick

Row {
    id: strip
    property int activeWorkspace: 2
    spacing: 8

    Repeater {
        model: 5

        Rectangle {
            required property int index
            width: index + 1 === strip.activeWorkspace ? 52 : 28
            height: 28
            radius: 14
            color: index + 1 === strip.activeWorkspace ? "#b8a8ff" : "#302a3c"

            Text { anchors.centerIn: parent; text: index + 1 }
        }
    }
}`,
    checks: [ck("Create delegates from a model", "Use Repeater or ListView with model.", /(?:Repeater|ListView)\s*\{[\s\S]*model\s*:/), ck("Receive delegate identity", "Declare required property int index or a model role.", /required\s+property\s+(?:int|var|QtObject)\s+(?:index|modelData|workspace)/), ck("Derive appearance from data", "Use index/modelData in width, colour, or radius.", /(?:width|color|radius)\s*:[^\n]*(?:index|modelData|workspace)/)],
    quiz: { question: "Why does stable delegate identity matter in a live shell?", options: ["It changes the font", "It preserves local state and animation across model updates", "It disables scrolling", "It removes imports"], answer: 1, explanation: "If every delegate is destroyed and recreated, animations jump and local interaction state disappears." },
    scene: "model",
  },
  {
    id: "theme-tokens", world: 3, title: "Author one visual grammar", subtitle: "Semantic colour, type, spacing, and radii", minutes: 32, xp: 130,
    objective: "Replace scattered literals with semantic tokens that can react to wallpaper, light mode, and scale.",
    story: "You are entering system territory. Before multiplying windows, give every future surface the same visual DNA.",
    explanation: [
      "A token names purpose rather than a specific value: surfaceContainer, onSurface, primary, spacingM, radiusSheet, or motionSpatial. Components bind to roles; the theme decides concrete values.",
      "Semantic tokens allow a wallpaper-derived palette to change without rewriting components. They also keep hierarchy intentional: compact edges, contextual popouts, and deep drawers can use distinct surface tiers.",
      "Radius is semantic too. A micro radius, control radius, sheet radius, connected-edge radius, and full pill communicate different relationships better than one rounded value everywhere.",
    ],
    analogy: "Tokens are a musical score's dynamics. Components play “primary” or “quiet surface,” not “hex value number 43.” The entire orchestra can change key and remain coherent.",
    rules: ["Name roles, not colours.", "Centralize a spacing and radius ladder.", "Use accent for focus, state, and action—not decoration everywhere."],
    terms: [["Semantic token", "A named design role whose concrete value may change."], ["Surface tier", "A tonal level expressing depth and hierarchy."], ["Palette seed", "A source colour used to derive related semantic roles."]],
    anatomy: `QtObject {
    readonly property color surface: "#1d1926"
    readonly property color surfaceHigh: "#2d2638"
    readonly property color onSurface: "#f7f1ff"
    readonly property color primary: "#b8a8ff"

    readonly property int spaceM: 12
    readonly property int radiusSheet: 28
}`,
    anatomyNotes: ["Roles describe intended use, not pigments.", "Several surface tiers create depth without relying on blur.", "Geometry and colour live in one theme contract."],
    starter: `import QtQuick

Rectangle {
    color: "#211d2b"
    radius: 24

    Text { color: "#f7f1ff"; text: "Now playing" }
}`,
    solution: `import QtQuick

Rectangle {
    id: root
    required property QtObject theme

    color: theme.surfaceHigh
    radius: theme.radiusSheet

    Text {
        color: theme.onSurface
        text: "Now playing"
    }
}`,
    checks: [ck("Require a theme dependency", "Add required property QtObject theme.", /required\s+property\s+QtObject\s+theme/), ck("Use a semantic colour", "Bind color to theme.<role>.", /color\s*:\s*theme\./), ck("Use semantic geometry", "Bind radius, spacing, or margins to theme.<role>.", /(?:radius|spacing|margins)\s*:\s*theme\./)],
    quiz: { question: "Which is the better token name?", options: ["purple500", "cardGray", "surfaceContainerHigh", "twentyFourPixels"], answer: 2, explanation: "surfaceContainerHigh describes purpose and hierarchy. Its actual colour can change with theme and wallpaper." },
    scene: "theme",
  },
  {
    id: "shellroot-modules", world: 3, title: "Cross into Quickshell", subtitle: "ShellRoot and a thin entrypoint", minutes: 28, xp: 130,
    objective: "Compose a Quickshell entrypoint that starts modules without implementing features inside shell.qml.",
    story: "Qt Quick can draw an app. Quickshell gives QML the types and services needed to become part of the desktop itself.",
    explanation: [
      "Quickshell is a runtime and toolkit for desktop shell components. A configuration begins at shell.qml, commonly with ShellRoot as the lifecycle root.",
      "Keep shell.qml boring. It imports and instantiates top-level modules, lifecycle services, and IPC handlers. Feature UI belongs in module files; shared system observation belongs in service singletons.",
      "The dependency direction should remain clear: shell.qml composes modules; modules use components plus state/config/services. Components should not reach upward and orchestrate the shell.",
    ],
    analogy: "shell.qml is the theatre director's call sheet, not the script for every actor. It says which productions exist and when they start.",
    rules: ["Keep ShellRoot compositional.", "Group product surfaces into modules.", "Point dependencies downward toward state, config, services, and components."],
    terms: [["ShellRoot", "The Quickshell configuration's root lifecycle object."], ["Module", "A product surface such as bar, drawer, or notifications."], ["Singleton", "One shared QML object instance for a service, theme, or state owner."]],
    anatomy: `import Quickshell
import qs.modules.bar
import qs.modules.drawers
import qs.services

ShellRoot {
    AudioService { }
    Bar { }
    Drawers { }
}`,
    anatomyNotes: ["Imports expose your local modules.", "Services start once at the root or as singletons.", "The entrypoint composes named product pieces."],
    starter: `import Quickshell

ShellRoot {
    // Your shell begins here.
}`,
    solution: `//@ pragma ShellId hero-shell

import Quickshell
import qs.modules.bar
import qs.modules.drawers

ShellRoot {
    settings.watchFiles: true

    Bar { }
    Drawers { }
}`,
    checks: [ck("Use ShellRoot", "Keep ShellRoot as the root object.", /ShellRoot\s*\{/), ck("Import feature modules", "Import qs.modules.<name>.", /import\s+qs\.modules\./), ck("Compose named modules", "Instantiate Bar and Drawers (or similarly named modules).", /\bBar\s*\{[\s\S]*\bDrawers\s*\{/)],
    quiz: { question: "What belongs in shell.qml?", options: ["Every button and animation", "Composition and lifecycle glue", "A polling loop per widget", "Only colour literals"], answer: 1, explanation: "A thin entrypoint makes the architecture legible. Features and integrations live in their dedicated layers." },
    scene: "graph",
  },
  {
    id: "panelwindow-edges", world: 3, title: "Claim a real screen edge", subtitle: "PanelWindow, anchors, and exclusion", minutes: 36, xp: 150,
    objective: "Create a top panel that owns its edge and intentionally reserves space for application windows.",
    story: "Your QML is leaving the app window. This surface will negotiate with the compositor and become part of the desktop's spatial contract.",
    explanation: [
      "PanelWindow is a Quickshell window designed for bars and panels. Its anchors attach it to screen edges. When opposite edges are anchored, implicit size controls the remaining dimension.",
      "exclusiveZone reserves space so tiled windows do not appear underneath a persistent bar. Transient overlays and drawers often ignore exclusion instead. Choose deliberately; do not let every shell window push apps around.",
      "Keep the actual window transparent when drawing custom rounded content inside it. Layer, keyboard focus, margins, and fullscreen behavior are part of the surface—not deployment details.",
    ],
    analogy: "A PanelWindow is a tenant negotiating floor space with the compositor. Anchors choose the wall; exclusiveZone says whether applications must keep the aisle clear.",
    rules: ["Declare the owning edge.", "Reserve space only for persistent surfaces.", "Coordinate transparency, layer, and fullscreen policy."],
    terms: [["PanelWindow", "A layer-shell-aware Quickshell panel surface."], ["exclusiveZone", "Screen space reserved from ordinary application placement."], ["Layer", "The compositor stacking level of a shell surface."]],
    anatomy: `PanelWindow {
    implicitHeight: 48
    exclusiveZone: implicitHeight
    color: "transparent"

    anchors {
        top: true
        left: true
        right: true
    }
}`,
    anatomyNotes: ["Three anchors make a top-spanning bar.", "implicitHeight supplies the unanchored dimension.", "exclusiveZone keeps tiled clients below the bar."],
    starter: `import QtQuick
import Quickshell

PanelWindow {
    implicitHeight: 48
}`,
    solution: `import QtQuick
import Quickshell

PanelWindow {
    implicitHeight: 48
    exclusiveZone: implicitHeight
    color: "transparent"

    anchors {
        top: true
        left: true
        right: true
    }

    Rectangle {
        anchors.fill: parent
        color: "#211d2b"
        bottomLeftRadius: 18
        bottomRightRadius: 18
    }
}`,
    checks: [ck("Use PanelWindow", "Make PanelWindow the root.", /PanelWindow\s*\{/), ck("Own a complete edge", "Anchor top/bottom plus left and right, or equivalent vertical edge.", /anchors\s*\{[\s\S]*(?:top|bottom)\s*:\s*true[\s\S]*left\s*:\s*true[\s\S]*right\s*:\s*true/), ck("Choose exclusion", "Set exclusiveZone intentionally.", /exclusiveZone\s*:/)],
    quiz: { question: "Which surface usually needs a positive exclusiveZone?", options: ["A persistent bar", "A temporary tooltip", "A modal scrim", "A launcher that closes immediately"], answer: 0, explanation: "Persistent bars usually reserve their lane. Transient surfaces generally overlay applications without changing their layout." },
    scene: "bar",
  },
  {
    id: "variants-screens", world: 3, title: "Tame every monitor", subtitle: "Variants and screen-scoped windows", minutes: 42, xp: 220, boss: true,
    objective: "Create one independent bar per live screen without assuming a primary monitor or stable array index.",
    story: "Boss gate: one monitor becomes three, one scale becomes mixed, and one screen disappears mid-animation. Your architecture must stay calm.",
    explanation: [
      "Quickshell.screens is a live model. Variants creates one non-Item object, such as PanelWindow or PersistentProperties, for every entry and updates instances as the model changes.",
      "Inside the delegate, `required property ShellScreen modelData` receives the screen object. Assign it to the window's screen property. Runtime state should follow that object, not `screens[0]`.",
      "Stored per-monitor preferences need a stable connector name or hardware identity. Runtime relationships can use the screen object. Never key long-lived state only by list index because hotplug changes ordering.",
    ],
    analogy: "Variants is a cookie cutter that follows a changing tray. Add a screen and it cuts one bar; remove a screen and it removes the matching instance.",
    rules: ["Treat screens as first-class live objects.", "Use Variants for screen-bound windows.", "Keep UI intent separate per screen."],
    terms: [["Variants", "Creates one non-Item instance per model entry."], ["ShellScreen", "Quickshell's object representing a connected screen."], ["Hotplug", "Adding or removing display hardware while the shell runs."]],
    anatomy: `Variants {
    model: Quickshell.screens

    PanelWindow {
        required property ShellScreen modelData
        screen: modelData
    }
}`,
    anatomyNotes: ["The live screen model controls instance lifetime.", "modelData is the actual screen for this delegate.", "Each window can bind to its own screen-scoped state and tokens."],
    starter: `import QtQuick
import Quickshell

PanelWindow {
    implicitHeight: 48
}`,
    solution: `pragma ComponentBehavior: Bound

import QtQuick
import Quickshell

Variants {
    model: Quickshell.screens

    PanelWindow {
        required property ShellScreen modelData
        screen: modelData
        implicitHeight: 48
        exclusiveZone: implicitHeight
        anchors { top: true; left: true; right: true }
    }
}`,
    checks: [ck("Follow the live screen model", "Wrap the window in Variants using Quickshell.screens.", /Variants\s*\{[\s\S]*model\s*:\s*Quickshell\.screens/), ck("Receive the screen", "Declare required property ShellScreen modelData.", /required\s+property\s+ShellScreen\s+modelData/), ck("Bind the window to it", "Set screen: modelData.", /screen\s*:\s*modelData/)],
    quiz: { question: "Why not always use `Quickshell.screens[0]`?", options: ["Arrays are unavailable", "Index zero may not be focused, primary, or stable across hotplug", "It disables animations", "PanelWindow requires two screens"], answer: 1, explanation: "Screen order is not a durable identity or user intent. Bind each instance to its actual modelData and resolve focused screens explicitly." },
    scene: "screens",
  },
  {
    id: "service-boundaries", world: 4, title: "Observe the system once", subtitle: "Services, truth, and degraded states", minutes: 38, xp: 150,
    objective: "Design one audio service that exposes stable state to many views instead of polling inside delegates.",
    story: "Your shell can now occupy the desktop. To become useful, it needs system truth—without every widget starting its own tiny chaos machine.",
    explanation: [
      "A service activates once, observes one domain, exposes mostly readonly typed state, and provides actions. Many views bind to the same volume, workspace, battery, or media objects.",
      "Prefer native Quickshell modules for PipeWire, MPRIS, notifications, UPower, tray, networking, and compositor state. Use Process only when no native integration exists, and pass arguments as a list.",
      "External systems fail. Model unavailable, loading, ready, stale, denied, and failed states so one broken service produces a designed degraded surface instead of breaking unrelated UI.",
    ],
    analogy: "A service is the shell's weather station. One calibrated station broadcasts observations; every window does not hang its own thermometer and argue about the temperature.",
    rules: ["One domain, one observer.", "Expose stable readonly truth and explicit actions.", "Design missing, loading, denied, and failed states."],
    terms: [["Service", "A shared object that integrates one system domain."], ["System truth", "State owned by an external system, such as current volume."], ["Degraded state", "A stable, useful presentation when a dependency is unavailable."]],
    anatomy: `pragma Singleton

Singleton {
    readonly property real volume: sink?.audio?.volume ?? 0
    readonly property bool available: sink !== null

    function setVolume(value: real): void {
        if (sink?.audio)
            sink.audio.volume = Math.max(0, Math.min(1, value))
    }
}`,
    anatomyNotes: ["Views can observe volume but cannot replace system truth.", "available supports a designed disconnected state.", "The action validates its boundary before writing."],
    starter: `pragma Singleton

import Quickshell

Singleton {
    property real volume: 0.5
}`,
    solution: `pragma Singleton

import Quickshell

Singleton {
    id: root
    property var sink: null
    readonly property real volume: sink?.audio?.volume ?? 0
    readonly property bool available: sink !== null

    function setVolume(value: real): void {
        if (sink?.audio)
            sink.audio.volume = Math.max(0, Math.min(1, value))
    }
}`,
    checks: [ck("Expose readonly truth", "Declare readonly property real volume.", /readonly\s+property\s+real\s+volume/), ck("Expose availability", "Add a bool such as available or ready.", /(?:readonly\s+)?property\s+bool\s+(?:available|ready|connected)/), ck("Provide a typed action", "Add function setVolume(value: real): void.", /function\s+\w+\s*\([^)]*:\s*real[^)]*\)\s*:\s*void/)],
    quiz: { question: "Where should a volume widget discover the default audio sink?", options: ["Inside every delegate", "In one shared audio service", "Inside the colour theme", "In a hover handler"], answer: 1, explanation: "One observer prevents duplicated work and disagreement. Views consume the same service state." },
    scene: "graph",
  },
  {
    id: "state-taxonomy", world: 4, title: "Put every fact in its home", subtitle: "Truth, policy, intent, and derived view state", minutes: 34, xp: 150,
    objective: "Separate system truth, user configuration, transient UI intent, and derived appearance.",
    story: "Most shell bugs are facts living in the wrong house. Classify them correctly and the architecture starts explaining itself.",
    explanation: [
      "System truth comes from services: volume, active workspace, battery. User policy comes from config: bar position, animation scale, disabled screens. UI intent belongs to state: drawerOpen, selectedTab, dragProgress.",
      "Derived view state is calculated: effective transparency, fullscreen radius, selected colour. Do not persist it; bindings can recreate it from truth, policy, and intent.",
      "Screen-scoped intent must not be one global drawerOpen flag. Use Variants to create a state object per screen and a helper to resolve the state for a given or focused screen.",
    ],
    analogy: "A library works because fiction, reference, returns, and staff notes have different shelves. Throwing every fact into one global drawer creates the same chaos as unsorted books.",
    rules: ["Services own external truth.", "Config owns durable user choices.", "State owns transient intent; bindings own derived values."],
    terms: [["Policy", "A durable user choice or product configuration."], ["UI intent", "What a specific interface surface is currently trying to do."], ["Derived state", "A value calculated from other authoritative values."]],
    anatomy: `// truth
readonly property real volume: Audio.volume
// policy
property bool transparencyEnabled: Config.transparency
// intent
property bool drawerOpen: false
// derived
readonly property real effectiveOpacity:
    transparencyEnabled && !fullscreen ? 0.82 : 1.0`,
    anatomyNotes: ["Each value has a different owner and lifetime.", "Derived opacity is never written to disk.", "Fullscreen policy can change the result without mutating inputs."],
    starter: `pragma Singleton

import Quickshell

Singleton {
    property bool drawerOpen: false
}`,
    solution: `pragma Singleton

import Quickshell

Singleton {
    id: root

    function forScreen(screen: ShellScreen): var {
        return states.instances.find(item => item.modelData === screen) ?? null
    }

    Variants {
        id: states
        model: Quickshell.screens

        QtObject {
            required property ShellScreen modelData
            property bool drawerOpen: false
            property real dragProgress: 0
        }
    }
}`,
    checks: [ck("Create state per screen", "Use Variants over Quickshell.screens.", /Variants\s*\{[\s\S]*Quickshell\.screens/), ck("Store UI intent there", "Add drawerOpen and/or dragProgress inside the delegate.", /property\s+(?:bool\s+drawerOpen|real\s+dragProgress)/), ck("Provide screen lookup", "Add forScreen that compares modelData with screen.", /function\s+forScreen[\s\S]*modelData\s*===\s*screen/)],
    quiz: { question: "Where should `drawerOpen` live for a multi-monitor shell?", options: ["In the audio service", "In screen-scoped UI state", "As a colour token", "In every drawer child"], answer: 1, explanation: "Drawer openness is transient intent and differs per screen. It belongs to screen-scoped state." },
    scene: "graph",
  },
  {
    id: "config-persistence", world: 4, title: "Remember only what is safe", subtitle: "Config, PersistentProperties, and reloads", minutes: 36, xp: 160,
    objective: "Preserve harmless UI continuity across QML reload while keeping durable preferences in typed config.",
    story: "A developer reload should not slam every drawer shut—but it must never preserve authentication or destructive confirmation state.",
    explanation: [
      "PersistentProperties keeps selected values across a Quickshell QML reload. It is for safe development continuity, not a general settings database or secret store.",
      "Durable user choices belong in typed configuration, commonly a watched FileView plus JsonAdapter for a modest QML-only shell. Supply defaults, debounce reload/write loops, and keep writes atomic.",
      "Never persist focus grabs, pressed state, PAM input, polkit decisions, lock secrets, or pending destructive confirmation. Reset safety-sensitive state deliberately.",
    ],
    analogy: "Reload persistence is a bookmark, not a vault. It remembers your page, but it should not store the key to the building.",
    rules: ["Persist only harmless continuity.", "Use typed defaults for user config.", "Reset authentication, focus, and destructive intent."],
    terms: [["PersistentProperties", "Reload-continuity storage managed by Quickshell."], ["JsonAdapter", "A typed QML adapter for JSON configuration."], ["Atomic write", "Replacing a file safely so interruptions do not leave partial data."]],
    anatomy: `PersistentProperties {
    property bool drawerOpen: false
    property string selectedTab: "home"
}

JsonAdapter {
    property int drawerWidth: 420
    property real animationScale: 1.0
}`,
    anatomyNotes: ["Open tab continuity is safe across a code reload.", "Width and animation scale are durable user policy.", "Sensitive state is intentionally absent."],
    starter: `import Quickshell

QtObject {
    property bool drawerOpen: false
    property string password: ""
}`,
    solution: `import Quickshell

PersistentProperties {
    property bool drawerOpen: false
    property string selectedTab: "home"

    // Authentication and destructive confirmations must reset.
}`,
    checks: [ck("Use reload persistence", "Change the safe state container to PersistentProperties.", /PersistentProperties\s*\{/), ck("Keep harmless UI intent", "Persist drawerOpen or selectedTab.", /property\s+(?:bool\s+drawerOpen|string\s+selectedTab)/), ck("Remove sensitive data", "Do not persist password, token, secret, or authentication text.", /^(?![\s\S]*(?:password|token|secret)\s*:)[\s\S]*$/i)],
    quiz: { question: "Which value is safe to keep in PersistentProperties?", options: ["PAM password text", "Pending shutdown confirmation", "The selected drawer tab", "A secret API token"], answer: 2, explanation: "A selected tab is harmless continuity. Security-sensitive and destructive state must reset." },
    scene: "graph",
  },
  {
    id: "focus-input-masks", world: 4, title: "Control focus and click-through", subtitle: "Popouts, grabs, and Region masks", minutes: 44, xp: 230, boss: true,
    objective: "Create a trigger-owned popout whose empty transparent window area does not steal application input.",
    story: "Boss gate: the most beautiful shell is unusable if an invisible window eats clicks. Make the visual illusion mechanically honest.",
    explanation: [
      "A popout should belong to its trigger in position, shape, and dismissal. Local contextual content can use an anchored popup; coordinated edge surfaces may share one larger orchestration window.",
      "A transparent full-screen window still receives input unless its mask limits the interactive Region. Set a Region from the visible surface so empty pixels pass clicks to applications behind it.",
      "Only surfaces needing keyboard input should request it. Under Hyprland, a focus grab can group dependent windows and report outside dismissal; close the whole group and restore focus coherently.",
    ],
    analogy: "Transparency is not a hole. It is invisible glass. A Region mask cuts real holes so the desktop underneath remains reachable.",
    rules: ["Give popouts visible trigger ownership.", "Mask all empty orchestration space.", "Request keyboard focus only for workflows that need it."],
    terms: [["Region mask", "The exact area of a window allowed to receive input."], ["Focus grab", "Temporary ownership of keyboard/pointer focus across related surfaces."], ["Dismissal", "The policy for closing contextual surfaces safely."]],
    anatomy: `PanelWindow {
    id: window
    color: "transparent"
    mask: Region { item: popout }

    Rectangle {
        id: popout
        width: 360
        height: 480
    }
}`,
    anatomyNotes: ["The window may span more space than its visible content.", "Region exposes only the popout as interactive.", "The remaining transparent window becomes click-through."],
    starter: `import QtQuick
import Quickshell

PanelWindow {
    color: "transparent"

    Rectangle {
        id: popout
        width: 360
        height: 480
    }
}`,
    solution: `import QtQuick
import Quickshell

PanelWindow {
    id: window
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    mask: Region { item: popout }

    anchors { top: true; right: true; bottom: true }

    Rectangle {
        id: popout
        anchors.right: parent.right
        width: 360
        height: parent.height
        color: "#211d2b"
        topLeftRadius: 28
        bottomLeftRadius: 28
    }
}`,
    checks: [ck("Keep the window transparent", "Set color: \"transparent\".", /color\s*:\s*["']transparent["']/), ck("Define an input Region", "Set mask: Region { … }.", /mask\s*:\s*Region\s*\{/), ck("Point at visible content", "Use item: popout inside Region.", /Region\s*\{[\s\S]*item\s*:\s*popout/)],
    quiz: { question: "Does a transparent window automatically pass clicks through?", options: ["Yes, transparent pixels are holes", "No, input needs an explicit mask", "Only on high-DPI screens", "Only while animated"], answer: 1, explanation: "Visual transparency and input regions are separate. A Region mask makes empty space mechanically click-through." },
    scene: "drawer",
  },
  {
    id: "connected-geometry", world: 5, title: "Grow one connected surface", subtitle: "Edge topology and shared progress", minutes: 46, xp: 170,
    objective: "Make an edge anchor and drawer share geometry, progress, and motion so they read as one surface.",
    story: "This is the Caelestia lesson: continuity is not a screenshot trick. Geometry, input, focus, and motion all agree on one spatial truth.",
    explanation: [
      "For a connected edge shell, place cooperating surfaces in one screen-scoped orchestration window. Draw a shared background or joined shapes instead of moving independent windows that can tear.",
      "Use one normalized openProgress from 0 to 1. Derive drawer translation, corner interpolation, background deformation, input region, and optional content reveal from that same value.",
      "Transform the surface more than the content. Text and controls should remain legible while the shell shape moves around them. Use ordinary rectangles first; add custom geometry only when measured need justifies it.",
    ],
    analogy: "A connected drawer is an accordion, not two boxes on wheels. One body expands; every fold reads the same motion progress.",
    rules: ["One window for cooperating edge geometry.", "One progress value for related transforms.", "Keep content legible while the surface changes form."],
    terms: [["Topology", "How shell surfaces connect and own screen space."], ["openProgress", "A normalized 0–1 value describing a transition."], ["Interpolation", "Calculating a value between closed and open endpoints."]],
    anatomy: `property real openProgress: state.drawerOpen ? 1 : 0

drawer.x: -drawer.width * (1 - openProgress)
drawer.radius: 8 + 24 * openProgress

Behavior on openProgress {
    NumberAnimation { duration: theme.spatialEnter }
}`,
    anatomyNotes: ["One progress source owns the spatial story.", "Position and shape interpolate together.", "Reversal continues from the current rendered value."],
    starter: `import QtQuick

Rectangle {
    id: shellSurface
    property bool open: false
    width: 420
    height: 600

    Rectangle { id: drawer; width: 360; height: parent.height }
}`,
    solution: `import QtQuick

Rectangle {
    id: shellSurface
    property bool open: false
    property real openProgress: open ? 1 : 0
    width: 420
    height: 600
    color: "transparent"

    Rectangle {
        id: drawer
        x: -width * (1 - shellSurface.openProgress)
        width: 360
        height: parent.height
        radius: 8 + 24 * shellSurface.openProgress
        color: "#211d2b"
    }

    Behavior on openProgress {
        NumberAnimation { duration: 420; easing.type: Easing.OutCubic }
    }
}`,
    checks: [ck("Create normalized progress", "Declare property real openProgress.", /property\s+real\s+openProgress/), ck("Derive geometry from it", "Use openProgress in x, width, radius, or transform.", /(?:x|width|radius)\s*:[^\n]*openProgress/), ck("Animate the shared source", "Add Behavior on openProgress.", /Behavior\s+on\s+openProgress/)],
    quiz: { question: "What should drive a connected drawer's translation and shape?", options: ["Separate unrelated timers", "One shared normalized progress value", "The wallpaper path", "A repeated JavaScript array"], answer: 1, explanation: "Shared progress keeps the geometry coherent and makes interruptions or reversals continuous." },
    scene: "drawer",
  },
  {
    id: "gesture-orchestration", world: 5, title: "Make movement reversible", subtitle: "Drag progress, thresholds, and arbitration", minutes: 42, xp: 170,
    objective: "Turn a pointer drag into immediate progress, then settle open or closed using direction and threshold.",
    story: "Direct manipulation makes a shell feel physical—but only when the gesture has an obvious inverse and never steals an application's scroll by surprise.",
    explanation: [
      "On press, record the start point and owning edge. During movement, convert distance into normalized progress immediately so the surface stays under the user's control.",
      "On release, combine threshold and direction. A short fast opening flick may count; a long reverse drag should close. Settle to the nearest intended state with semantic spatial motion.",
      "Centralize arbitration for neighboring panels. Resolve scrolling, fullscreen, competing edges, and application click-through before claiming a gesture.",
    ],
    analogy: "A good drawer feels like a spring-loaded door: it follows your hand, understands the direction, and can always be pushed back the way it came.",
    rules: ["Show progress during the drag.", "Use direction plus threshold.", "Provide the inverse gesture and protect application input."],
    terms: [["Threshold", "The progress or velocity needed to commit a gesture."], ["Arbitration", "Choosing which surface or scroll view owns an input sequence."], ["Settle", "Animating from released progress to the chosen final state."]],
    anatomy: `DragHandler {
    id: drag
    xAxis.enabled: true

    onTranslationChanged: {
        state.dragProgress = Math.max(0,
            Math.min(1, translation.x / drawer.width))
    }
    onActiveChanged: if (!active)
        state.drawerOpen = state.dragProgress > 0.42
}`,
    anatomyNotes: ["Progress updates immediately while dragging.", "Clamping protects the 0–1 contract.", "Release chooses intent, then the motion system settles."],
    starter: `import QtQuick

Item {
    id: surface
    property real dragProgress: 0
    width: 420
    height: 600
}`,
    solution: `import QtQuick

Item {
    id: surface
    property real dragProgress: 0
    property bool open: false
    width: 420
    height: 600

    DragHandler {
        id: drag
        xAxis.enabled: true
        yAxis.enabled: false

        onTranslationChanged: {
            surface.dragProgress = Math.max(0,
                Math.min(1, translation.x / surface.width))
        }
        onActiveChanged: if (!active)
            surface.open = surface.dragProgress > 0.42
    }
}`,
    checks: [ck("Use a drag handler", "Add DragHandler.", /DragHandler\s*\{/), ck("Calculate normalized progress", "Update dragProgress using distance divided by width/height.", /dragProgress\s*=[\s\S]{0,120}\/(?:\s*surface\.)?(?:width|height)/), ck("Settle from a threshold", "On release, compare progress with a numeric threshold.", /onActiveChanged[\s\S]*dragProgress\s*>\s*0?\./)],
    quiz: { question: "Why use both direction and threshold?", options: ["To increase file size", "To distinguish deliberate open/close gestures from incidental movement", "QML requires two numbers", "To change monitor scale"], answer: 1, explanation: "Distance alone misreads intent. Direction and velocity/threshold together produce reversible, predictable gestures." },
    scene: "drawer",
  },
  {
    id: "lazy-performance", world: 5, title: "Keep the first frame fast", subtitle: "LazyLoader, stable models, and idle work", minutes: 36, xp: 160,
    objective: "Defer a heavy drawer while keeping the bar and essential state immediately available.",
    story: "A shell launches with the session. Every indulgence competes with the first useful frame, so spectacle must earn its place on the critical path.",
    explanation: [
      "Load the bar, theme, state, and essential services immediately. Optional dashboards, visualizers, history views, and image analysis can be created with LazyLoader only when policy needs them.",
      "`loading: true` begins asynchronous creation during spare frames; `active` controls whether the item exists. Reading loader.item while loading forces completion and defeats the purpose.",
      "Suspend hidden timers, visualizers, screencopy, and expensive blur. Prefer transform and opacity motion over relayout of large trees when the result is equivalent.",
    ],
    analogy: "A fast shell packs a day bag before a storage unit. The bar and controls travel with you; the heavy archive is fetched only when needed.",
    rules: ["Render the first useful surface first.", "Do not touch loader.item while it is loading.", "Suspend expensive invisible work."],
    terms: [["Critical path", "Work required before the first useful UI appears."], ["LazyLoader", "Creates optional QML content later or on demand."], ["active", "Whether a LazyLoader's component should currently exist."]],
    anatomy: `LazyLoader {
    loading: true
    active: state.drawerOpen

    component: HeavyDrawer {
        screenState: state
    }
}`,
    anatomyNotes: ["Preloading can begin during spare frames.", "The heavy object exists only while policy requires it.", "Dependencies still enter through a clear contract."],
    starter: `import Quickshell

HeavyDrawer {
    // Always created during startup.
}`,
    solution: `import Quickshell

LazyLoader {
    id: drawerLoader
    loading: true
    active: ShellState.drawerOpen

    component: HeavyDrawer {
        screenState: ShellState
    }
}`,
    checks: [ck("Use LazyLoader", "Wrap HeavyDrawer in LazyLoader.", /LazyLoader\s*\{/), ck("Control lifetime", "Bind active to drawer state or policy.", /active\s*:/), ck("Keep the component lazy", "Declare HeavyDrawer under component, without reading loader.item.", /component\s*:\s*HeavyDrawer\s*\{[\s\S]*\}/)],
    quiz: { question: "What can accidentally force a LazyLoader to finish synchronously?", options: ["Setting active", "Reading its item while it is still loading", "Importing Quickshell", "Using a typed property"], answer: 1, explanation: "Accessing item before asynchronous creation finishes forces immediate completion and can stall the UI." },
    scene: "graph",
  },
  {
    id: "ipc-shortcuts", world: 5, title: "Give the shell an API", subtitle: "IPC, global shortcuts, one action path", minutes: 38, xp: 170,
    objective: "Expose one typed drawer action and route both visual and command triggers through the same state transition.",
    story: "A real shell can be operated by clicks, keys, scripts, and accessibility tools. Those routes must not become four different implementations.",
    explanation: [
      "IpcHandler exposes typed functions through Quickshell IPC. A target groups related actions; explicit parameter and return types make the command surface inspectable and reliable.",
      "A compositor shortcut and a visual button should call the same service action or update the same state property. Separate paths drift and produce impossible differences.",
      "Resolve the intended screen explicitly—commonly the compositor-focused screen—then retrieve its state. Never let the IPC route silently manipulate whichever screen happens to be index zero.",
    ],
    analogy: "Clicks, shortcuts, and IPC are different door handles on the same mechanism. They should move one latch, not operate separate hidden doors.",
    rules: ["Expose stable typed IPC actions.", "Route every trigger to one transition.", "Resolve focused-screen intent explicitly."],
    terms: [["IPC", "Inter-process communication: commands another process can call."], ["IpcHandler", "Quickshell object that exposes typed IPC functions."], ["Global shortcut", "A compositor keybinding available regardless of focused application."]],
    anatomy: `IpcHandler {
    target: "drawer"

    function toggle(): void {
        Actions.toggleDrawerFor(FocusedScreen.current)
    }
}

// Visual trigger calls the same action:
onActivated: Actions.toggleDrawerFor(screen)`,
    anatomyNotes: ["IPC names a stable target and typed function.", "Actions owns the actual state transition.", "Visual and command routes converge."],
    starter: `import Quickshell.Io

IpcHandler {
    target: "drawer"
}`,
    solution: `import Quickshell.Io

IpcHandler {
    target: "drawer"

    function toggle(): void {
        const state = ShellState.forScreen(FocusedScreen.current)
        if (state)
            state.drawerOpen = !state.drawerOpen
    }
}`,
    checks: [ck("Name an IPC target", "Set target: \"drawer\".", /target\s*:\s*["']drawer["']/), ck("Expose a typed function", "Add function toggle(): void.", /function\s+\w+\s*\([^)]*\)\s*:\s*void/), ck("Update shared state", "Route through ShellState or an Actions service.", /(?:ShellState|Actions)\./)],
    quiz: { question: "What should a global shortcut and visual button share?", options: ["Only the same icon", "The same underlying action/state transition", "Separate drawer state", "A fixed monitor index"], answer: 1, explanation: "All input routes should converge on the same action so behavior remains consistent and testable." },
    scene: "graph",
  },
  {
    id: "vertical-slice", world: 5, title: "Assemble the living slice", subtitle: "Bar + drawer + service + state", minutes: 64, xp: 220,
    objective: "Compose the smallest complete shell product: per-screen bar, one contextual drawer, one real service, state, motion, and action routes.",
    story: "This is the End-4 lesson: broad utility grows from coherent vertical slices, not from a giant dashboard full of disconnected prototypes.",
    explanation: [
      "A vertical slice crosses every necessary layer for one useful workflow. For media: one service observes players, state tracks the chosen player/drawer, the bar shows glanceable status, and the drawer reveals controls and history.",
      "Build service and failure states first, then screen state, compact surface, contextual depth, pointer/keyboard/IPC routes, motion, and connected geometry. Only then multiply features.",
      "The bar must remain useful when the drawer is closed. The drawer adds depth rather than compensating for a useless persistent edge.",
    ],
    analogy: "A vertical slice is one complete elevator through the building. A horizontal slice is twenty beautiful lobby buttons connected to nothing.",
    rules: ["Build one complete workflow through all layers.", "Keep the compact surface useful alone.", "Add depth progressively instead of making the bar a dashboard."],
    terms: [["Vertical slice", "One capability implemented end-to-end across architecture layers."], ["Progressive disclosure", "Revealing more detail only when requested."], ["Glanceable", "Useful information readable without opening a deeper surface."]],
    anatomy: `ShellRoot {
    MediaService { id: media }
    ShellState { id: state }

    Bar { service: media; screenState: state }
    MediaDrawer { service: media; screenState: state }

    ShellIpc { actions: state }
}`,
    anatomyNotes: ["One service owns player truth.", "Bar and drawer consume the same truth and intent.", "IPC reaches the same action surface."],
    starter: `import Quickshell

ShellRoot {
    // Compose one complete workflow.
}`,
    solution: `import Quickshell
import qs.modules.bar
import qs.modules.media
import qs.services
import qs.state

ShellRoot {
    MediaService { id: media }
    ShellState { id: shellState }

    Bar {
        service: media
        state: shellState
    }

    MediaDrawer {
        service: media
        state: shellState
    }

    ShellIpc { state: shellState }
}`,
    checks: [ck("Compose a service", "Instantiate MediaService or another domain service.", /\w+Service\s*\{/), ck("Compose compact and deep surfaces", "Instantiate both Bar and a Drawer.", /\bBar\s*\{[\s\S]*\b\w*Drawer\s*\{/), ck("Pass shared dependencies", "Provide service/state properties to modules.", /(?:service|state)\s*:\s*\w+/)],
    quiz: { question: "What makes a feature a complete vertical slice?", options: ["It has many animations", "It crosses service, state, UI, input, and failure paths", "It uses one giant QML file", "It only works on one monitor"], answer: 1, explanation: "A vertical slice is usable end-to-end. It proves the architecture before the feature set expands." },
    scene: "bar",
  },
  {
    id: "validation-capstone", world: 5, title: "Earn the Shellwright crest", subtitle: "Failure, hotplug, fullscreen, and ship", minutes: 75, xp: 300, boss: true,
    objective: "Write the capstone root and a validation contract that proves your shell survives the real desktop.",
    story: "Final boss: your shell is not finished when the happy-path screenshot looks good. It is finished when missing services, mixed scales, reloads, fullscreen, and rapid reversal cannot unravel it.",
    explanation: [
      "Validate compact, hover, pressed, selected, opening, open, closing, loading, empty, stale, denied, and failed states. Check dark/light, hostile wallpapers, reduced motion, transparency disabled, and fullscreen.",
      "Test one monitor, mixed scale, portrait, hotplug while drawers are open, focus changes, compositor restart, click-through, keyboard navigation, every IPC action, and missing dependencies.",
      "Measure cold start, idle CPU, repeated open/close memory, and the largest transition on the slowest target GPU. Report what you could not test; static confidence is not runtime proof.",
    ],
    analogy: "A shellwright does not only forge a beautiful key; they try it in rain, cold, darkness, and the wrong lock—and label every condition they have not yet tested.",
    rules: ["Test a matrix, not one screenshot.", "Design degraded states before failure arrives.", "Separate static validation from runtime evidence."],
    terms: [["Hot reload", "Re-evaluating QML while the shell remains running."], ["Reduced motion", "A policy that shortens/removes decorative motion while preserving feedback."], ["Failure boundary", "The point where one broken dependency is contained from unrelated features."]],
    anatomy: `ShellRoot {
    Bar { }
    Drawers { }

    IpcHandler {
        target: "shell"
        function toggleDrawer(): void {
            Actions.toggleDrawerFor(FocusedScreen.current)
        }
    }
}

// Validate: reload · hotplug · fullscreen · failure · reduced motion`,
    anatomyNotes: ["The root remains compositional at the finish line.", "Stable actions are available outside clicks.", "The validation contract is part of the product definition."],
    starter: `import Quickshell
import Quickshell.Io

ShellRoot {
    // Final composition
}`,
    solution: `//@ pragma ShellId my-living-shell

import Quickshell
import Quickshell.Io
import qs.modules.bar
import qs.modules.drawers
import qs.services
import qs.state

ShellRoot {
    settings.watchFiles: true

    SystemServices { }
    Bar { }
    Drawers { }

    IpcHandler {
        target: "shell"

        function toggleDrawer(): void {
            Actions.toggleDrawerFor(FocusedScreen.current)
        }
    }
}`,
    checks: [ck("Keep a thin ShellRoot", "Compose modules instead of implementing controls in the root.", /ShellRoot\s*\{[\s\S]*\bBar\s*\{[\s\S]*\bDrawers\s*\{/), ck("Expose a typed shell action", "Add IpcHandler with a typed function.", /IpcHandler\s*\{[\s\S]*function\s+\w+\s*\([^)]*\)\s*:\s*void/), ck("Resolve focused intent", "Route the action through Actions and a focused screen.", /Actions\.[\s\S]*(?:FocusedScreen|focused)/)],
    quiz: { question: "When is a shell ready to ship?", options: ["When one screenshot looks polished", "When architecture, interaction, failure, screen, and performance matrices have evidence", "When shell.qml is very large", "When all surfaces use blur"], answer: 1, explanation: "A shell is persistent infrastructure. Completion requires evidence across real states, hardware changes, failure paths, and input routes." },
    scene: "audit",
  },
];

function quizSetFor(quest: Quest): Quiz[] {
  const [termA, termB, termC] = quest.terms;
  return [
    quest.quiz,
    {
      question: `In this quest, what does “${termA[0]}” mean?`,
      options: [termB[1], termA[1], termC[1]],
      answer: 1,
      explanation: `${termA[0]} means ${termA[1]}`,
    },
    {
      question: "Which practice best matches this quest?",
      options: [
        "Store every visual result as unrelated mutable state.",
        quest.rules[0],
        "Let each visual delegate discover and poll the system independently.",
        "Use the same timing, radius, and surface role for every context.",
      ],
      answer: 1,
      explanation: `The key design rule here is: ${quest.rules[0]}`,
    },
  ];
}

const storageKey = "qml-shellcraft-adventure-v2";

const totalXp = quests.reduce((sum, quest) => sum + quest.xp, 0);
const ranks = ["Spark", "Binder", "Composer", "Signal Runner", "Edge Keeper", "Screen Tamer", "Shellwright"];

function readNumber(code: string, name: string, fallback: number) {
  const match = code.match(new RegExp(`${name}\\s*:\\s*(\\d+)`));
  return match ? Number(match[1]) : fallback;
}

function readColor(code: string, fallback: string) {
  const matches = [...code.matchAll(/#[0-9a-fA-F]{6}/g)];
  return matches.at(-1)?.[0] ?? fallback;
}

function CoreMark({ level = 1 }: { level?: number }) {
  return <span className="core-mark" style={{ "--level": Math.min(level, 7) } as React.CSSProperties}><i /><i /><i /></span>;
}

function ScenePreview({ quest, code }: { quest: Quest; code: string }) {
  const [active, setActive] = useState(false);
  const color = readColor(code, "#a99cff");
  const radius = Math.min(readNumber(code, "radius", 22), 64);
  const hasMotion = /Behavior|Animation|Transition/.test(code);
  const hasMask = /mask\s*:\s*Region/.test(code);
  const hasVariants = /Variants/.test(code);

  return (
    <button className={`scene scene-${quest.scene} ${active ? "is-active" : ""} ${hasMotion ? "has-motion" : ""}`} onClick={() => setActive(value => !value)} aria-label="Toggle conceptual preview state">
      <span className="scene-wallpaper"><i /><i /><i /></span>

      {quest.scene === "object" && <span className="object-tree"><i className="root-node">Rectangle</i><i>Text</i><i>child</i></span>}
      {quest.scene === "binding" && <span className="binding-scene"><i>expanded</i><b>→</b><i>width</i><b>→</b><i>view</i></span>}
      {quest.scene === "layout" && <span className="layout-scene"><i>1</i><i>2</i><b /><i>14:42</i><i>87%</i></span>}
      {quest.scene === "control" && <span className="control-scene" style={{ background: active ? color : "#332c42", borderRadius: active ? 28 : radius }}><i>{active ? "selected" : "activate"}</i><b /></span>}
      {quest.scene === "motion" && <span className="motion-scene"><i /><b>{active ? "expanded" : "compact"}</b></span>}
      {quest.scene === "model" && <span className="model-scene">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={(active ? n === 4 : n === 2) ? "current" : ""}>{n}</i>)}</span>}
      {quest.scene === "theme" && <span className="theme-scene"><i /><i /><i /><i /><b>semantic roles</b></span>}
      {quest.scene === "bar" && <><span className="preview-bar"><i>01</i><i>02</i><b /><i>14:42</i><i>87%</i></span>{active && <span className="preview-popout"><small>NOW PLAYING</small><strong>Reactive Dreams</strong><i /></span>}</>}
      {quest.scene === "screens" && <span className="screens-scene"><i><b /></i><i><b /></i><i className={active || hasVariants ? "ready" : ""}><b /></i></span>}
      {quest.scene === "graph" && <span className="graph-scene"><i>shell</i><b>modules</b><b>state</b><b>services</b><em /></span>}
      {quest.scene === "drawer" && <><span className="edge-anchor"><i /><i /><b /></span><span className="drawer-scene"><small>{hasMask ? "click-through safe" : "edge surface"}</small><strong>{active ? "Drawer open" : "Pull from edge"}</strong><i /></span></>}
      {quest.scene === "audit" && <span className="audit-scene">{["reload", "hotplug", "focus", "failure", "motion", "IPC"].map((item, index) => <i key={item} className={active || index < 3 ? "pass" : ""}>{item}<b /></i>)}</span>}

      <span className="scene-hud"><i className={hasMotion ? "on" : ""}>motion</i><i className={hasMask ? "on" : ""}>mask</i><i className={hasVariants ? "on" : ""}>screens</i><b>{active ? "STATE 1" : "STATE 0"}</b></span>
    </button>
  );
}

function WorldGlyph({ index }: { index: number }) {
  return <span className={`world-glyph glyph-${index}`} aria-hidden="true"><i /><i /><i /></span>;
}

function MapView({ completed, onOpenQuest }: { completed: string[]; onOpenQuest: (index: number) => void }) {
  const xp = quests.filter(q => completed.includes(q.id)).reduce((sum, q) => sum + q.xp, 0);
  const level = Math.min(7, Math.floor(xp / 450) + 1);
  const nextIndex = quests.findIndex(q => !completed.includes(q.id));
  const nextQuest = quests[nextIndex === -1 ? quests.length - 1 : nextIndex];
  const [selectedWorld, setSelectedWorld] = useState(nextQuest.world);
  const activeWorld = worlds[selectedWorld];
  const activeQuests = quests.map((quest, index) => ({ ...quest, index })).filter(quest => quest.world === selectedWorld);

  return (
    <div className="map-view">
      <section className="map-hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> zero → shellwright</span>
          <h1>Learn QML by<br /><em>awakening a shell.</em></h1>
          <p>No prior QML knowledge needed. Every quest explains one idea in plain language, lets you predict what code will do, then asks you to build the smallest real piece yourself.</p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => onOpenQuest(nextIndex === -1 ? quests.length - 1 : nextIndex)}><span>Continue quest</span><b>{nextQuest.title}</b><i>→</i></button>
            <div className="course-promise"><i>{quests.length}</i><span>quests</span><i>6</i><span>worlds</span><i>~15h</i><span>to hero</span></div>
          </div>
        </div>
        <div className="hero-core">
          <div className="orbit orbit-a"><i /></div><div className="orbit orbit-b"><i /></div>
          <CoreMark level={level} />
          <span className="core-label">SHELL CORE<br /><b>LEVEL {level}</b></span>
          <div className="core-stat"><span>{xp.toLocaleString("en-US")}</span><small>of {totalXp.toLocaleString("en-US")} XP</small></div>
        </div>
      </section>

      <section className="learning-loop">
        <span>YOUR QUEST LOOP</span>
        <div><i>01</i><b>Understand</b><small>Plain-language lesson</small></div><em>→</em>
        <div><i>02</i><b>Predict</b><small>Check your mental model</small></div><em>→</em>
        <div><i>03</i><b>Build</b><small>Edit real QML</small></div><em>→</em>
        <div><i>04</i><b>Master</b><small>Pass the gate, earn XP</small></div>
      </section>

      <section className="world-map">
        <header><div><span className="eyebrow">THE JOURNEY</span><h2>Six worlds. One living shell.</h2></div><p>Later worlds unlock as you clear quests. You can still preview any lesson—this path guides rather than punishes.</p></header>
        <div className="illustrated-map">
          <img src="/world-map.png" alt="Illustrated QML Shellcraft map with six connected regions" />
          <span className="map-instruction">Choose a region</span>
          {worlds.map((world, worldIndex) => {
            const worldQuests = quests.filter(quest => quest.world === worldIndex);
            const done = worldQuests.filter(quest => completed.includes(quest.id)).length;
            const isNext = worldIndex === nextQuest.world;
            return (
              <button
                className={`map-node world-${world.color} ${selectedWorld === worldIndex ? "selected" : ""} ${done === worldQuests.length ? "done" : ""} ${isNext ? "next" : ""}`}
                style={{ left: `${world.mapX}%`, top: `${world.mapY}%` }}
                key={world.name}
                onClick={() => setSelectedWorld(worldIndex)}
                aria-label={`Explore ${world.name}, ${done} of ${worldQuests.length} quests complete`}
              >
                <i>{done === worldQuests.length ? "✓" : worldIndex + 1}</i>
                <span><b>{world.name}</b><small>{done}/{worldQuests.length} cleared</small></span>
              </button>
            );
          })}
        </div>
        <article className={`region-drawer world-${activeWorld.color}`}>
          <img src={activeWorld.image} alt={`${activeWorld.name} illustrated region`} />
          <div className="region-copy">
            <small>{activeWorld.eyebrow}</small>
            <h3>{activeWorld.name}</h3>
            <p>{activeWorld.description}</p>
            <div className="region-quests">
              {activeQuests.map((quest, localIndex) => {
                const isDone = completed.includes(quest.id);
                const isNext = quest.index === nextIndex;
                return <button key={quest.id} className={`${isDone ? "done" : ""} ${isNext ? "next" : ""} ${quest.boss ? "boss" : ""}`} onClick={() => onOpenQuest(quest.index)}><i>{isDone ? "✓" : quest.boss ? "◆" : localIndex + 1}</i><span><b>{quest.title}</b><small>{quest.minutes} min · {quest.xp} XP</small></span><em>→</em></button>;
              })}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<"map" | "quest">("map");
  const [questIndex, setQuestIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>(() => Object.fromEntries(quests.map(q => [q.id, q.starter])));
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const quest = quests[questIndex];
  const code = codes[quest.id] ?? quest.starter;
  const checkResults = useMemo(() => quest.checks.map(check => check.test(code)), [quest, code]);
  const allChecksPass = checkResults.every(Boolean);
  const quizSet = useMemo(() => quizSetFor(quest), [quest]);
  const questQuizAnswers = quizSet.map((_, index) => quizAnswers[`${quest.id}:${index}`] ?? (index === 0 ? quizAnswers[quest.id] : undefined));
  const quizResults = quizSet.map((quiz, index) => questQuizAnswers[index] === quiz.answer);
  const quizCorrectCount = quizResults.filter(Boolean).length;
  const quizAnsweredCount = questQuizAnswers.filter(answer => answer !== undefined).length;
  const quizCorrect = quizCorrectCount === quizSet.length;
  const xp = quests.filter(q => completed.includes(q.id)).reduce((sum, q) => sum + q.xp, 0);
  const level = Math.min(7, Math.floor(xp / 450) + 1);
  const rank = ranks[level - 1];
  const levelFloor = (level - 1) * 450;
  const levelProgress = level === 7 ? 100 : Math.min(100, ((xp - levelFloor) / 450) * 100);

  const openQuest = (index: number) => {
    setQuestIndex(Math.max(0, index)); setView("quest"); setChecked(false); setHintOpen(false); setSolutionOpen(false); setNavOpen(false);
    requestAnimationFrame(() => document.querySelector(".lesson-scroll")?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
        if (Array.isArray(saved.completed)) setCompleted(saved.completed);
        if (saved.codes) setCodes(current => ({ ...current, ...saved.codes }));
        if (saved.quizAnswers) setQuizAnswers(saved.quizAnswers);
        if (saved.notes) setNotes(saved.notes);
      } catch { /* local progress must never block the course */ }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(storageKey, JSON.stringify({ completed, codes, quizAnswers, notes }));
  }, [completed, codes, quizAnswers, notes, hydrated]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setNavOpen(false); setGlossaryOpen(false); }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && view === "quest") { event.preventDefault(); setChecked(true); }
      if (event.altKey && event.key === "ArrowRight") openQuest(Math.min(questIndex + 1, quests.length - 1));
      if (event.altKey && event.key === "ArrowLeft") openQuest(Math.max(questIndex - 1, 0));
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });

  const updateCode = (value: string) => { setCodes(current => ({ ...current, [quest.id]: value })); setChecked(false); };

  const commitEditor = (value: string, selectionStart: number, selectionEnd = selectionStart) => {
    updateCode(value);
    requestAnimationFrame(() => {
      if (!editorRef.current) return;
      editorRef.current.selectionStart = selectionStart;
      editorRef.current.selectionEnd = selectionEnd;
    });
  };

  const onEditorKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    const lineStart = code.lastIndexOf("\n", start - 1) + 1;

    if (event.key === "Tab") {
      event.preventDefault();
      const spansLines = start !== end || code.slice(start, end).includes("\n");
      if (spansLines) {
        const block = code.slice(lineStart, end);
        const lines = block.split("\n");
        let removed = 0;
        let removedFromFirst = 0;
        const transformed = lines.map((line, index) => {
          if (!event.shiftKey) return `    ${line}`;
          const match = line.match(/^( {1,4}|\t)/);
          const count = match?.[0].length ?? 0;
          removed += count;
          if (index === 0) removedFromFirst = count;
          return line.slice(count);
        }).join("\n");
        const next = `${code.slice(0, lineStart)}${transformed}${code.slice(end)}`;
        const nextStart = event.shiftKey ? Math.max(lineStart, start - removedFromFirst) : start + 4;
        const nextEnd = event.shiftKey ? Math.max(nextStart, end - removed) : end + lines.length * 4;
        commitEditor(next, nextStart, nextEnd);
        return;
      }
      if (event.shiftKey) {
        const before = code.slice(lineStart, start);
        const match = before.match(/(?: {1,4}|\t)$/);
        const count = match?.[0].length ?? 0;
        if (count) commitEditor(`${code.slice(0, start - count)}${code.slice(end)}`, start - count);
        return;
      }
      commitEditor(`${code.slice(0, start)}    ${code.slice(end)}`, start + 4);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const lineBeforeCursor = code.slice(lineStart, start);
      const indent = lineBeforeCursor.match(/^\s*/)?.[0] ?? "";
      const opener = lineBeforeCursor.trimEnd().at(-1);
      const pairs: Record<string, string> = { "{": "}", "[": "]", "(": ")" };
      const closer = pairs[opener ?? ""];
      if (closer && code[start] === closer) {
        const insertion = `\n${indent}    \n${indent}`;
        commitEditor(`${code.slice(0, start)}${insertion}${code.slice(end)}`, start + indent.length + 5);
      } else {
        const extra = closer ? "    " : "";
        const insertion = `\n${indent}${extra}`;
        commitEditor(`${code.slice(0, start)}${insertion}${code.slice(end)}`, start + insertion.length);
      }
      return;
    }

    const pairs: Record<string, string> = { "{": "}", "[": "]", "(": ")" };
    if (pairs[event.key]) {
      event.preventDefault();
      const selected = code.slice(start, end);
      commitEditor(`${code.slice(0, start)}${event.key}${selected}${pairs[event.key]}${code.slice(end)}`, start + 1, selected ? end + 1 : start + 1);
      return;
    }

    if (["}", "]", ")"].includes(event.key) && code[start] === event.key && start === end) {
      event.preventDefault();
      commitEditor(code, start + 1);
      return;
    }

    if (event.key === "}" && /^\s+$/.test(code.slice(lineStart, start))) {
      event.preventDefault();
      const whitespace = code.slice(lineStart, start);
      const outdent = Math.min(4, whitespace.length);
      commitEditor(`${code.slice(0, start - outdent)}}${code.slice(end)}`, start - outdent + 1);
    }
  };

  const completeQuest = () => {
    if (!allChecksPass || !quizCorrect) return;
    setCompleted(current => current.includes(quest.id) ? current : [...current, quest.id]);
    setCelebration(true);
    window.setTimeout(() => setCelebration(false), 2400);
  };

  return (
    <main className={`adventure-shell ${view === "map" ? "map-mode" : "quest-mode"}`}>
      <header className="hud">
        <button className="brand" onClick={() => setView("map")} aria-label="Open world map"><CoreMark level={level} /><span><b>QML SHELLCRAFT</b><small>zero → hero adventure</small></span></button>
        <nav><button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>World map</button><button className={view === "quest" ? "active" : ""} onClick={() => setView("quest")}>Current quest</button></nav>
        <div className="player-hud"><span className="rank-chip"><i>LV {level}</i><b>{rank}</b></span><div className="xp-mini"><span><i style={{ width: `${levelProgress}%` }} /></span><small>{xp.toLocaleString("en-US")} XP</small></div><button className="nav-trigger" onClick={() => setNavOpen(true)} aria-label="Open quest navigator">{quests.length} quests <i>⌘</i></button></div>
      </header>

      {view === "map" ? <MapView completed={completed} onOpenQuest={openQuest} /> : (
        <div className="quest-view">
          <aside className="quest-rail">
            <button className="back-map" onClick={() => setView("map")}><i>←</i><span>World map</span></button>
            <div className="rail-world"><WorldGlyph index={quest.world} /><small>{worlds[quest.world].eyebrow}</small><b>{worlds[quest.world].name}</b><span>{questIndex + 1} / {quests.length}</span></div>
            <nav aria-label="World quests">
              {quests.filter(item => item.world === quest.world).map((item) => {
                const index = quests.findIndex(entry => entry.id === item.id);
                return <button key={item.id} className={`${index === questIndex ? "active" : ""} ${completed.includes(item.id) ? "done" : ""}`} onClick={() => openQuest(index)}><i>{completed.includes(item.id) ? "✓" : item.boss ? "◆" : index + 1}</i><span>{item.title}</span></button>;
              })}
            </nav>
            <div className="rail-companion"><span className="companion-face"><i /><i /><b /></span><p><b>CORE SAYS</b>{quizAnsweredCount === 0 ? "Read slowly. Predict before you run." : quizCorrect ? "All three mental models synchronized." : `${quizCorrectCount}/3 signals aligned. Mistakes are map data.`}</p></div>
          </aside>

          <section className="lesson-scroll">
            <article className="lesson-body">
              <header className="lesson-hero">
                <div className="quest-meta"><span>{quest.boss ? "BOSS QUEST" : `QUEST ${String(questIndex + 1).padStart(2, "0")}`}</span><i>{quest.minutes} min</i><i>+{quest.xp} XP</i></div>
                <p className="lesson-kicker">{quest.subtitle}</p>
                <h1>{quest.title}</h1>
                <p className="lesson-objective">{quest.objective}</p>
                <div className="story-callout"><span className="companion-face"><i /><i /><b /></span><div><small>MISSION BRIEF</small><p>{quest.story}</p></div></div>
                <figure className={`lesson-world-art world-${worlds[quest.world].color}`}><img src={worlds[quest.world].image} alt={`${worlds[quest.world].name} illustrated chapter`} /><figcaption><small>YOU ARE EXPLORING</small><b>{worlds[quest.world].name}</b><span>{worlds[quest.world].description}</span></figcaption></figure>
              </header>

              <section className="explanation-section">
                <div className="section-title"><span>01</span><div><small>UNDERSTAND</small><h2>Build the mental model</h2></div></div>
                <div className="explanation-copy">{quest.explanation.map((paragraph, index) => <p key={index}><i>{index + 1}</i>{paragraph}</p>)}</div>
                <aside className="analogy-box"><span>THINK OF IT LIKE THIS</span><p>{quest.analogy}</p></aside>
                <div className="rule-grid">{quest.rules.map((rule, index) => <div key={rule}><i>0{index + 1}</i><p>{rule}</p></div>)}</div>
              </section>

              <section className="anatomy-section">
                <div className="section-title"><span>02</span><div><small>DISSECT</small><h2>Read working QML</h2></div></div>
                <div className="anatomy-grid"><pre><code>{quest.anatomy}</code></pre><ol>{quest.anatomyNotes.map(note => <li key={note}>{note}</li>)}</ol></div>
                <button className="glossary-button" onClick={() => setGlossaryOpen(value => !value)}><span>New words in this quest</span><b>{quest.terms.map(term => term[0]).join(" · ")}</b><i>{glossaryOpen ? "−" : "+"}</i></button>
                {glossaryOpen && <div className="glossary-grid">{quest.terms.map(([term, definition]) => <div key={term}><b>{term}</b><p>{definition}</p></div>)}</div>}
              </section>

              <section className="quiz-section">
                <div className="section-title"><span>03</span><div><small>PREDICT · THREE SIGNALS</small><h2>Prove the idea from three angles</h2></div></div>
                <div className="quiz-stack">
                  {quizSet.map((quiz, quizIndex) => {
                    const answer = questQuizAnswers[quizIndex];
                    const correct = quizResults[quizIndex];
                    const answerKey = `${quest.id}:${quizIndex}`;
                    return <div className={`quiz-card ${answer !== undefined ? (correct ? "correct" : "incorrect") : ""}`} key={answerKey}>
                      <div className="quiz-progress"><span>SIGNAL {quizIndex + 1}</span><i>{correct ? "LOCKED ✓" : `${quizIndex + 1} / ${quizSet.length}`}</i></div>
                      <p>{quiz.question}</p>
                      <div className="quiz-options">{quiz.options.map((option, optionIndex) => <button key={option} className={answer === optionIndex ? "selected" : ""} onClick={() => setQuizAnswers(current => ({ ...current, [answerKey]: optionIndex }))}><i>{String.fromCharCode(65 + optionIndex)}</i><span>{option}</span></button>)}</div>
                      {answer !== undefined && <aside><b>{correct ? "Mental model locked in" : "Not quite—use this clue"}</b><p>{quiz.explanation}</p></aside>}
                    </div>;
                  })}
                </div>
              </section>

              <section className="mobile-lab-intro"><span>04</span><p>The build lab follows below on smaller screens.</p></section>
              <section className="notes-section"><button onClick={() => setNotesOpen(value => !value)}><span>Field notes</span><small>private to this device</small><i>{notesOpen ? "−" : "+"}</i></button>{notesOpen && <textarea value={notes[quest.id] ?? ""} onChange={event => setNotes(current => ({ ...current, [quest.id]: event.target.value }))} placeholder="Explain the idea back to yourself. What surprised you?" />}</section>
            </article>
          </section>

          <aside className="lab-dock">
            <header><div><span className="live-pip" /><b>BUILD LAB</b><small>quest_{String(questIndex + 1).padStart(2, "0")}.qml</small></div><button onClick={() => updateCode(quest.starter)}>Reset</button></header>
            <section className="mission-card"><span>04 · BUILD</span><p>{quest.objective}</p></section>
            <section className="preview-wrap"><div><span>CONCEPT PREVIEW</span><small>tap to change state</small></div><ScenePreview quest={quest} code={code} /></section>
            <section className="code-editor"><div className="editor-top"><span>QML</span><b className="smart-indent">smart indent · auto-pairs</b><small>browser checks · render for real in Quickshell</small></div><div className="editor-grid"><div className="line-numbers">{code.split("\n").map((_, index) => <i key={index}>{index + 1}</i>)}</div><textarea ref={editorRef} value={code} onChange={event => updateCode(event.target.value)} onKeyDown={onEditorKey} spellCheck={false} aria-label={`QML editor for ${quest.title}`} /></div></section>
            <section className="gate-panel">
              <div className="gate-heading"><div><span>MASTERY GATE</span><small>{checkResults.filter(Boolean).length}/{checkResults.length} code checks · quiz {quizCorrectCount}/{quizSet.length}</small></div><button onClick={() => setHintOpen(value => !value)}>Hint</button></div>
              <div className="checks">{quest.checks.map((check, index) => <div key={check.label} className={checked ? (checkResults[index] ? "pass" : "fail") : "idle"}><i>{checked ? (checkResults[index] ? "✓" : "×") : index + 1}</i><span>{check.label}</span></div>)}</div>
              {hintOpen && <aside className="hint"><b>CORE CLUE</b>{quest.checks.find((_, index) => !checkResults[index])?.hint ?? "Your code gates are ready. Answer the prediction question, then claim the quest."}</aside>}
              {solutionOpen && <pre className="solution"><code>{quest.solution}</code></pre>}
              <div className="gate-actions"><button className="solution-trigger" onClick={() => setSolutionOpen(value => !value)}>{solutionOpen ? "Hide solution" : "See solution"}</button>{!checked || !allChecksPass ? <button className="run-checks" onClick={() => setChecked(true)}>Run code checks <i>⌘↵</i></button> : !quizCorrect ? <button className="run-checks waiting" onClick={() => document.querySelector(".quiz-section")?.scrollIntoView({ behavior: "smooth" })}>Answer prediction ↑</button> : <button className="claim-quest" onClick={completeQuest}>{completed.includes(quest.id) ? "Quest mastered ✓" : `Claim +${quest.xp} XP`}</button>}</div>
            </section>
            <footer><button disabled={questIndex === 0} onClick={() => openQuest(questIndex - 1)}>←</button><span>Alt + arrows navigate</span><button disabled={questIndex === quests.length - 1} onClick={() => openQuest(questIndex + 1)}>→</button></footer>
          </aside>
        </div>
      )}

      {navOpen && <div className="navigator-backdrop"><button className="navigator-dismiss" onClick={() => setNavOpen(false)} aria-label="Close quest navigator" /><section className="navigator" role="dialog" aria-modal="true" aria-label="Quest navigator"><header><div><small>QUEST COMPASS</small><h2>Jump through the journey</h2></div><button onClick={() => setNavOpen(false)}>×</button></header><div>{worlds.map((world, worldIndex) => <section key={world.name}><span><WorldGlyph index={worldIndex} /><b>{world.name}</b></span>{quests.map((item, index) => ({ item, index })).filter(({ item }) => item.world === worldIndex).map(({ item, index }) => <button key={item.id} onClick={() => openQuest(index)} className={completed.includes(item.id) ? "done" : ""}><i>{completed.includes(item.id) ? "✓" : item.boss ? "◆" : index + 1}</i><span><b>{item.title}</b><small>{item.minutes} min · {item.xp} XP</small></span><em>→</em></button>)}</section>)}</div></section></div>}

      {celebration && <div className="celebration" role="status"><span className="burst"><i /><i /><i /><i /><i /><i /></span><CoreMark level={level} /><small>QUEST MASTERED</small><b>+{quest.xp} XP</b><p>{quest.title}</p></div>}
    </main>
  );
}
