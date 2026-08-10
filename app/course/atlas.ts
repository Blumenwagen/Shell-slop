/**
 * Expansion curriculum for the five-map Shellcraft atlas.
 *
 * This file intentionally contains only the 134 new quests. The original 26
 * quests remain in app/page.tsx until the course-engine migration joins both
 * sources. Browser previews are labelled as simulations; only the
 * linux-wayland-runtime tier may ask for live Quickshell/compositor evidence.
 */

export type CampaignNumber = 1 | 2 | 3 | 4 | 5;
export type ExecutionTier = "browser-simulation" | "static-qml-check" | "linux-wayland-runtime";
export type QuizFormat =
  | "mental-model"
  | "code-detective"
  | "design-transfer"
  | "debug"
  | "accessibility"
  | "security";
export type SceneKind =
  | "object"
  | "binding"
  | "layout"
  | "control"
  | "motion"
  | "model"
  | "theme"
  | "bar"
  | "screens"
  | "graph"
  | "drawer"
  | "audit"
  | "service"
  | "media"
  | "network"
  | "notification"
  | "launcher"
  | "security"
  | "release";

export type StructuralCheckSpec = {
  label: string;
  hint: string;
  /** A JavaScript-compatible regular-expression source string, never executable course data. */
  pattern: string;
  flags?: string;
};

export type AtlasQuizItem = {
  id: string;
  format: QuizFormat;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  conceptTags: string[];
  difficulty: 1 | 2 | 3;
};

export type AtlasQuestSeed = {
  id: string;
  campaign: CampaignNumber;
  regionId: string;
  order: number;
  title: string;
  subtitle: string;
  objective: string;
  story: string;
  explanation: [string, string, string];
  analogy: string;
  rules: [string, string, string];
  terms: [[string, string], [string, string], [string, string]];
  starter: string;
  solution: string;
  checks: [StructuralCheckSpec, StructuralCheckSpec, StructuralCheckSpec];
  quizzes: [AtlasQuizItem, AtlasQuizItem, AtlasQuizItem, AtlasQuizItem, AtlasQuizItem, AtlasQuizItem];
  scene: SceneKind;
  xp: number;
  minutes: number;
  boss: boolean;
  sideQuest: boolean;
  conceptTags: string[];
  prerequisiteIds: string[];
  executionTier: ExecutionTier;
  verificationBoundary: string;
  supportedQuickshell: string;
  sourceReviewedAt: string;
};

export type AtlasRegion = {
  id: string;
  campaign: CampaignNumber;
  order: number;
  name: string;
  subtitle: string;
  description: string;
  targetQuestCount: number;
  mapX: number;
  mapY: number;
  color: string;
  scene: SceneKind;
};

export type CampaignMap = {
  id: string;
  number: CampaignNumber;
  name: string;
  subtitle: string;
  purpose: string;
  capstone: string;
  targetQuestCount: number;
  artKey: string;
  regions: AtlasRegion[];
};

const region = (
  id: string,
  campaign: CampaignNumber,
  order: number,
  name: string,
  subtitle: string,
  description: string,
  targetQuestCount: number,
  mapX: number,
  mapY: number,
  color: string,
  scene: SceneKind,
): AtlasRegion => ({ id, campaign, order, name, subtitle, description, targetQuestCount, mapX, mapY, color, scene });

export const atlasCampaigns: CampaignMap[] = [
  {
    id: "awakening-archipelago", number: 1, name: "Awakening Archipelago", subtitle: "QML foundations and a living vertical slice",
    purpose: "Turn first principles into a real per-screen bar and service-backed popout.",
    capstone: "A tested Map I prototype with service, state, UI, input, failure, and evidence paths.", targetQuestCount: 50, artKey: "awakening",
    regions: [
      region("first-sparks", 1, 1, "First Sparks", "Read the language", "Objects, values, scope, bindings, and repair habits for a true beginner.", 8, 20, 26, "violet", "object"),
      region("shape-district", 1, 2, "Shape District", "Compose visible things", "Geometry, layout negotiation, resilient content, and component contracts.", 8, 50, 25, "coral", "layout"),
      region("motion-arcade", 1, 3, "Motion Arcade", "Interaction with causality", "Pointer, keyboard, state layers, reversible motion, and controlled lifetime.", 8, 80, 27, "cyan", "motion"),
      region("system-frontier", 1, 4, "System Frontier", "Enter Quickshell honestly", "The platform stack, modules, tooling, windows, screens, and runtime proof.", 8, 50, 74, "gold", "screens"),
      region("living-shell", 1, 5, "Living Shell", "Give surfaces real state", "Services, processes, configuration, persistence, focus, and degraded states.", 8, 80, 72, "lime", "service"),
      region("hero-forge", 1, 6, "Hero Forge", "Ship the first coherent shell", "Visual direction, topology, responsive policy, action routes, and evidence.", 10, 20, 70, "pink", "audit"),
    ],
  },
  {
    id: "system-atlas", number: 2, name: "System Atlas", subtitle: "Real desktop truth, observed once",
    purpose: "Replace placeholder data with shared, typed, failure-aware Quickshell services.",
    capstone: "A live status spine consumed by the compact bar and deeper surfaces without duplicate observers.", targetQuestCount: 30, artKey: "systems",
    regions: [
      region("time-power-hardware", 2, 1, "Time, Power, and Hardware", "Cadence without waste", "Clocks, batteries, brightness, power policy, and measured resource sampling.", 5, 28, 20, "amber", "service"),
      region("sound-caverns", 2, 2, "Sound Caverns", "Trace the PipeWire graph", "Audio defaults, devices, privacy, hotplug, and one shared mixer service.", 5, 67, 20, "cyan", "service"),
      region("media-orbit", 2, 3, "Media Orbit", "Players that come and go", "MPRIS selection, transport, position, metadata, artwork, and compact depth.", 5, 83, 48, "magenta", "media"),
      region("signal-range", 2, 4, "Signal Range", "Connectivity with honest progress", "Network, Wi-Fi, Bluetooth, VPN, tray models, and permission boundaries.", 5, 68, 76, "lime", "network"),
      region("notification-archive", 2, 5, "Notification Archive", "One pipeline, many surfaces", "Protocol ownership, actions, history, DND, timeouts, and privacy redaction.", 5, 28, 76, "coral", "notification"),
      region("compositor-frontier", 2, 6, "Compositor Frontier", "Windows, workspaces, and focus", "Live compositor state, focused screens, mode policy, validated actions, and reconnects.", 5, 15, 48, "violet", "screens"),
    ],
  },
  {
    id: "surface-realms", number: 3, name: "Surface Realms", subtitle: "A coherent daily shell product",
    purpose: "Combine real integrations into surfaces whose hierarchy, input, and spatial origins agree.",
    capstone: "A daily-driver shell with bar, launcher, drawer, alerts, overview, and safe session surfaces.", targetQuestCount: 30, artKey: "surfaces",
    regions: [
      region("edge-spine", 3, 1, "Edge Spine", "Glanceable and calm", "Edge ownership, content priority, overflow, exclusion, and fullscreen adaptation.", 5, 18, 28, "violet", "bar"),
      region("popout-borough", 3, 2, "Popout Borough", "Context stays attached", "Placement, focus, dismissal, keyboard paths, and one control grammar.", 5, 50, 18, "coral", "control"),
      region("search-wilds", 3, 3, "Search Wilds", "Keyboard-first discovery", "Desktop entries, ranking, providers, cancellation, stable results, and announcements.", 5, 78, 26, "cyan", "launcher"),
      region("drawer-delta", 3, 4, "Drawer Delta", "Connected direct manipulation", "Orchestration windows, shared geometry, masks, gesture arbitration, and keyboard parity.", 5, 76, 73, "lime", "drawer"),
      region("alert-peaks", 3, 5, "Alert Peaks", "Inform without interruption", "Toast lanes, history, OSD coalescing, replacement, urgency, and privacy.", 5, 18, 72, "gold", "notification"),
      region("overview-session-gate", 3, 6, "Overview and Session Gate", "Focus and consequence", "Overview navigation, task return, confirmation, lock, PAM, polkit, and safe cancellation.", 5, 48, 49, "pink", "security"),
    ],
  },
  {
    id: "expression-expanse", number: 4, name: "Expression Expanse", subtitle: "Learn the canon; forge an identity",
    purpose: "Translate End-4 and Caelestia principles into an original, coherent visual system.",
    capstone: "An original state gallery scoring at least 21/28 with no visual rejection gate.", targetQuestCount: 25, artKey: "expression",
    regions: [
      region("canon-observatory", 4, 1, "Canon Observatory", "See the whole screen", "Edge ownership, negative space, progressive depth, critique, and canonical differences.", 4, 50, 48, "violet", "audit"),
      region("topology-foundry", 4, 2, "Topology Foundry", "Choose a dominant geometry", "Surface ladders, joins, corners, morphs, and visibly owned popouts.", 4, 67, 20, "coral", "drawer"),
      region("colour-biome", 4, 3, "Colour Biome", "Wallpaper-aware semantic colour", "Light/dark roles, tonal depth, hostile wallpaper contrast, and conditional transparency.", 4, 27, 21, "lime", "theme"),
      region("type-icon-quarter", 4, 4, "Type and Icon Quarter", "A legible visual voice", "Type roles, stable metrics, localization, coherent icons, and foreign artwork normalization.", 4, 18, 68, "gold", "theme"),
      region("motion-river", 4, 5, "Motion River", "Motion that explains", "Semantic roles, causality, interaction feedback, interruption, reduction, and low-power policy.", 4, 80, 56, "cyan", "motion"),
      region("responsive-mirrorlands", 4, 6, "Responsive Mirrorlands", "Every state looks intentional", "Monitor forms, overrides, fullscreen, degraded states, screenshot review, and the visual boss.", 5, 55, 80, "pink", "audit"),
    ],
  },
  {
    id: "production-citadel", number: 5, name: "Production Citadel", subtitle: "Make the shell dependable infrastructure",
    purpose: "Harden architecture, performance, resilience, security, validation, packaging, and maintenance.",
    capstone: "A versioned v1.0 shell with a reproducible evidence pack and known limitations.", targetQuestCount: 25, artKey: "production",
    regions: [
      region("architecture-keep", 5, 1, "Architecture Keep", "Dependencies flow one way", "Thin composition, explicit boundaries, injected contracts, per-screen identity, and refactoring.", 4, 29, 19, "violet", "graph"),
      region("performance-mines", 5, 2, "Performance Mines", "Measure before optimizing", "Startup, deferred work, stable models, caches, suspension, profiling, and plugin thresholds.", 4, 68, 18, "cyan", "audit"),
      region("resilience-range", 5, 3, "Resilience Range", "Recover without collateral damage", "Reloads, hotplug, restarts, malformed data, cancellation, backoff, and containment.", 4, 83, 48, "lime", "service"),
      region("security-bastion", 5, 4, "Security Bastion", "Protect boundaries and private state", "Arguments, permissions, logs, IPC, privacy modes, authentication, and threat scenarios.", 4, 70, 82, "red", "security"),
      region("validation-arena", 5, 5, "Validation Arena", "Evidence across the matrix", "Static, visual, input, screen, degradation, performance, accessibility, and privacy checks.", 4, 29, 82, "gold", "audit"),
      region("release-harbor", 5, 6, "Release Harbor", "Ship and maintain v1.0", "Version pins, migrations, install lifecycle, packaging, documentation, licensing, and final evidence.", 5, 16, 50, "pink", "release"),
    ],
  },
];

type RecipeId =
  | "qml-object" | "qml-values" | "qml-contract" | "qml-layout" | "qml-content"
  | "interaction" | "focus" | "animation" | "loader" | "shell-root" | "panel-window"
  | "screen-variants" | "service" | "process" | "config" | "persistent" | "mask"
  | "ipc" | "script-model" | "domain-view" | "privacy" | "notification" | "theme"
  | "motion-tokens" | "visual-policy" | "accessible-control" | "security" | "validation" | "release";

type Blueprint = {
  regionId: string;
  recipe: RecipeId;
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  focus: string;
  mechanism: string;
  failure: string;
  analogy: string;
  rules: [string, string, string];
  termKeys: [string, string, string];
  tags: string[];
  prerequisiteIds?: string[];
  executionTier?: ExecutionTier;
  boss?: boolean;
  sideQuest?: boolean;
};

type Recipe = {
  scene: SceneKind;
  tier: ExecutionTier;
  structure: string;
  a11y: string;
  security: string;
  starter: (label: string) => string;
  solution: (label: string) => string;
  checks: [StructuralCheckSpec, StructuralCheckSpec, StructuralCheckSpec];
};

const checks = (
  a: [string, string, string], b: [string, string, string], c: [string, string, string],
): [StructuralCheckSpec, StructuralCheckSpec, StructuralCheckSpec] => [
  { label: a[0], hint: a[1], pattern: a[2], flags: "m" },
  { label: b[0], hint: b[1], pattern: b[2], flags: "m" },
  { label: c[0], hint: c[1], pattern: c[2], flags: "m" },
];

const itemStarter = (label: string) => `import QtQuick\n\nItem {\n    id: root\n    width: 280\n    height: 96\n\n    Text { text: "${label}" }\n}`;
const itemSolution = (label: string) => `import QtQuick\n\nItem {\n    id: root\n    property bool active: false\n    readonly property string status: active ? "active" : "idle"\n    width: 280\n    height: 96\n\n    Rectangle {\n        anchors.fill: parent\n        radius: 16\n        color: root.active ? "#b7f397" : "#272331"\n    }\n    Text { anchors.centerIn: parent; text: "${label}: " + root.status }\n}`;

const RECIPES: Record<RecipeId, Recipe> = {
  "qml-object": {
    scene: "object", tier: "browser-simulation", structure: "a typed source property drives a visible child through a binding",
    a11y: "Give visible state a text equivalent and keep the reading order aligned with the object tree.",
    security: "Treat imported data as untrusted text; a visual binding should not evaluate external code.",
    starter: itemStarter, solution: itemSolution,
    checks: checks(["Typed property", "Declare a typed property on the root.", "property\\s+(?:bool|int|real|string|color|url)\\s+\\w+"], ["Derived value", "Add a readonly derived property.", "readonly\\s+property\\s+\\w+\\s+\\w+\\s*:"], ["Visible binding", "Bind visible content to root state.", "(?:text|color|width|height)\\s*:[^\\n]*root\\."]),
  },
  "qml-values": {
    scene: "binding", tier: "static-qml-check", structure: "precise QML value types feed a small derived expression without imperative copies",
    a11y: "Format values into readable labels instead of exposing raw codes or colour alone.",
    security: "Validate URLs and external strings before they reach commands, files, or privileged services.",
    starter: () => `import QtQml\n\nQtObject {\n    property var value\n}`,
    solution: (label) => `import QtQml\n\nQtObject {\n    property string label: "${label}"\n    property int count: 3\n    property bool available: true\n    property list<string> names: ["bar", "drawer", "launcher"]\n    readonly property string summary: available ? label + ": " + count : "Unavailable"\n}`,
    checks: checks(["Precise scalar", "Use a string, int, real, or bool property.", "property\\s+(?:string|int|real|bool)\\s+\\w+"], ["Typed list", "Declare a typed list value.", "property\\s+list<[^>]+>\\s+\\w+"], ["Safe derivation", "Derive a readonly value.", "readonly\\s+property\\s+\\w+\\s+\\w+\\s*:"]),
  },
  "qml-contract": {
    scene: "control", tier: "static-qml-check", structure: "required inputs and readonly outputs make the component boundary explicit",
    a11y: "Make an accessible name part of the component contract whenever icon-only content is possible.",
    security: "Do not pass ambient authority through a visual component; inject only the narrow action it needs.",
    starter: () => `import QtQuick\n\nItem {\n    property var model\n}`,
    solution: (label) => `import QtQuick\n\nItem {\n    required property string value\n    required property bool available\n    readonly property string accessibleLabel: "${label}: " + value\n    implicitWidth: content.implicitWidth + 24\n    implicitHeight: content.implicitHeight + 16\n\n    Text { id: content; text: parent.available ? parent.value : "Unavailable" }\n}`,
    checks: checks(["Required input", "Declare at least one required property.", "required\\s+property\\s+\\w+\\s+\\w+"], ["Readonly output", "Expose a readonly derived property.", "readonly\\s+property\\s+\\w+\\s+\\w+"], ["Natural size", "Report implicit width and height.", "implicitWidth\\s*:[\\s\\S]*implicitHeight\\s*:"]),
  },
  "qml-layout": {
    scene: "layout", tier: "browser-simulation", structure: "a layout negotiates child size while one flexible item absorbs remaining space",
    a11y: "Let content wrap or elide before shrinking interactive targets below 44 device-independent pixels.",
    security: "Layout code should display already-sanitized values and never construct executable command text.",
    starter: (label) => `import QtQuick\nimport QtQuick.Layouts\n\nRowLayout {\n    Text { text: "${label}" }\n}`,
    solution: (label) => `import QtQuick\nimport QtQuick.Layouts\n\nRowLayout {\n    width: 420\n    spacing: 12\n    Text { text: "${label}"; elide: Text.ElideRight; Layout.maximumWidth: 180 }\n    Item { Layout.fillWidth: true }\n    Rectangle { implicitWidth: 44; implicitHeight: 44; radius: 22 }\n}`,
    checks: checks(["Layout container", "Use RowLayout or ColumnLayout.", "(?:RowLayout|ColumnLayout)\\s*\\{"], ["Flexible space", "Let one child fill available space.", "Layout\\.fill(?:Width|Height)\\s*:\\s*true"], ["Content resilience", "Add elision, wrapping, or a size constraint.", "(?:elide|wrapMode|Layout\\.(?:maximum|minimum|preferred)(?:Width|Height))\\s*:"]),
  },
  "qml-content": {
    scene: "layout", tier: "browser-simulation", structure: "content reports natural size and has explicit overflow, crop, and failure behaviour",
    a11y: "Preserve readable text under zoom, localization, mixed scripts, and right-to-left layout.",
    security: "Do not load arbitrary remote artwork in privacy-sensitive surfaces without policy and caching limits.",
    starter: (label) => `import QtQuick\n\nText { text: "${label}" }`,
    solution: (label) => `import QtQuick\n\nItem {\n    implicitWidth: 240\n    implicitHeight: 72\n    Text {\n        anchors.fill: parent\n        text: "${label}"\n        wrapMode: Text.Wrap\n        elide: Text.ElideRight\n        maximumLineCount: 2\n    }\n}`,
    checks: checks(["Natural size", "Declare implicit dimensions.", "implicit(?:Width|Height)\\s*:"], ["Overflow policy", "Choose wrapping or elision.", "(?:wrapMode|elide)\\s*:"], ["Bounded content", "Set a line or geometry limit.", "(?:maximumLineCount|width|height|Layout\\.maximumWidth)\\s*:"]),
  },
  "interaction": {
    scene: "control", tier: "browser-simulation", structure: "a pointer handler changes intent while bindings render hover, press, and selection",
    a11y: "Provide a keyboard route, visible focus, a useful accessible name, and a target at least 44 pixels wide and high.",
    security: "Connect interaction to one narrow action instead of embedding privileged process construction in the handler.",
    starter: (label) => `import QtQuick\n\nRectangle {\n    width: 44; height: 44\n    Text { anchors.centerIn: parent; text: "${label}" }\n}`,
    solution: (label) => `import QtQuick\n\nRectangle {\n    id: control\n    width: 44; height: 44; activeFocusOnTab: true\n    Accessible.name: "${label}"\n    Accessible.role: Accessible.Button\n    color: tap.pressed ? "#8d7cff" : hover.hovered ? "#3d374a" : "#292531"\n    HoverHandler { id: hover }\n    TapHandler { id: tap; onTapped: control.forceActiveFocus() }\n    Keys.onSpacePressed: tap.tapped(null, Qt.LeftButton)\n}`,
    checks: checks(["Pointer handler", "Use TapHandler, HoverHandler, or DragHandler.", "(?:TapHandler|HoverHandler|DragHandler)\\s*\\{"], ["Keyboard route", "Handle keyboard focus or activation.", "(?:activeFocusOnTab|Keys\\.on(?:Space|Return|Enter)Pressed)\\s*:"], ["Accessible metadata", "Add an accessible name and role.", "Accessible\\.name\\s*:[\\s\\S]*Accessible\\.role\\s*:"]),
  },
  "focus": {
    scene: "control", tier: "static-qml-check", structure: "a FocusScope owns keyboard navigation and restores focus to the trigger after dismissal",
    a11y: "Keep focus visible, trap it only for true modal work, support Escape, and return it to the control that opened the surface.",
    security: "Clear focus grabs when a sensitive surface closes so hidden controls cannot continue receiving input.",
    starter: (label) => `import QtQuick\n\nFocusScope {\n    Text { text: "${label}" }\n}`,
    solution: (label) => `import QtQuick\n\nFocusScope {\n    id: scope\n    property Item returnTarget\n    activeFocusOnTab: true\n    Keys.onEscapePressed: { visible = false; returnTarget?.forceActiveFocus() }\n    Text { text: "${label}"; Accessible.name: text }\n}`,
    checks: checks(["Focus owner", "Use a FocusScope.", "FocusScope\\s*\\{"], ["Escape path", "Handle Escape explicitly.", "Keys\\.onEscapePressed\\s*:"], ["Focus restoration", "Return focus to the trigger.", "forceActiveFocus\\s*\\("]),
  },
  "animation": {
    scene: "motion", tier: "browser-simulation", structure: "semantic animation roles move the rendered property and remain reversible from its current value",
    a11y: "A reduced-motion branch keeps feedback but shortens distance and removes decorative overshoot.",
    security: "Never animate away a security state before the underlying lock or authorization transition succeeds.",
    starter: () => `import QtQuick\n\nRectangle { property bool open: false; x: open ? 0 : -width }`,
    solution: (label) => `import QtQuick\n\nRectangle {\n    id: surface\n    property bool open: false\n    property bool reducedMotion: false\n    x: open ? 0 : -width\n    opacity: open ? 1 : 0\n    Behavior on x { NumberAnimation { duration: surface.reducedMotion ? 80 : 360; easing.type: Easing.OutCubic } }\n    Behavior on opacity { NumberAnimation { duration: 160 } }\n    Accessible.name: "${label}"\n}`,
    checks: checks(["State-driven geometry", "Bind geometry to open state.", "(?:x|y|width|height)\\s*:[^\\n]*open"], ["Semantic motion", "Animate the causal property.", "Behavior\\s+on\\s+(?:x|y|width|height)"], ["Reduced motion", "Provide a reduced-motion branch.", "reducedMotion\\s*\\?"]),
  },
  "loader": {
    scene: "graph", tier: "static-qml-check", structure: "LazyLoader defers optional work and code avoids touching item while asynchronous loading is in progress",
    a11y: "Announce loading and error states while preserving a stable focus target.",
    security: "Do not persist authentication, confirmation, or secret-bearing loader state across reloads.",
    starter: (label) => `import Quickshell\n\nLazyLoader { component: Item { objectName: "${label}" } }`,
    solution: (label) => `import Quickshell\n\nLazyLoader {\n    id: optionalSurface\n    loading: true\n    active: UiState.drawerOpen\n    component: Item { objectName: "${label}" }\n    // Do not read optionalSurface.item while loading; that would force completion.\n}`,
    checks: checks(["Lazy surface", "Use LazyLoader.", "LazyLoader\\s*\\{"], ["Explicit lifetime", "Bind active to policy or UI state.", "active\\s*:[^\\n]+"], ["Deferred loading", "Enable asynchronous idle loading.", "loading\\s*:\\s*true"]),
  },
  "shell-root": {
    scene: "graph", tier: "linux-wayland-runtime", structure: "ShellRoot stays lifecycle glue and composes feature modules instead of owning their internals",
    a11y: "The root must not create hidden focus traps; each surface owns and restores focus deliberately.",
    security: "Keep secrets and authentication state outside root composition and persistent global objects.",
    starter: () => `import Quickshell\n\nShellRoot {\n    // Compose the shell here.\n}`,
    solution: (label) => `import Quickshell\nimport qs.modules.bar\nimport qs.services\n\nShellRoot {\n    Component.onCompleted: SystemService.start()\n    BarModule { objectName: "${label}" }\n}`,
    checks: checks(["Shell lifecycle", "Use ShellRoot as the root.", "ShellRoot\\s*\\{"], ["Module import", "Import a local module.", "import\\s+qs\\.modules\\."], ["Feature composition", "Instantiate a named feature module.", "\\b[A-Z][A-Za-z]+Module\\s*\\{"]),
  },
  "panel-window": {
    scene: "bar", tier: "linux-wayland-runtime", structure: "PanelWindow owns an edge, screen, exclusion, layer, and fullscreen policy explicitly",
    a11y: "Keep glanceable content readable and avoid requesting keyboard focus unless the surface actually needs it.",
    security: "A transparent window must not capture input outside its visible interactive region.",
    starter: () => `import Quickshell\n\nPanelWindow {\n    color: "transparent"\n}`,
    solution: (label) => `import Quickshell\n\nPanelWindow {\n    id: panel\n    anchors { top: true; left: true; right: true }\n    implicitHeight: 48\n    exclusiveZone: 48\n    color: "transparent"\n    Rectangle { anchors.fill: parent; objectName: "${label}"; radius: 16 }\n}`,
    checks: checks(["Panel surface", "Use PanelWindow.", "PanelWindow\\s*\\{"], ["Owned edge", "Set at least one window anchor.", "anchors\\s*\\{[^}]+(?:top|bottom|left|right)\\s*:\\s*true"], ["Exclusion policy", "Set the exclusive zone intentionally.", "exclusiveZone\\s*:"]),
  },
  "screen-variants": {
    scene: "screens", tier: "linux-wayland-runtime", structure: "Variants creates a screen-bound window for each live ShellScreen object",
    a11y: "Preserve focus and reading order when screens appear, disappear, or change scale.",
    security: "Never key sensitive or long-lived policy only by a mutable screen array index.",
    starter: () => `import Quickshell\n\nVariants { model: Quickshell.screens }`,
    solution: (label) => `import Quickshell\n\nVariants {\n    model: Quickshell.screens\n    PanelWindow {\n        required property ShellScreen modelData\n        screen: modelData\n        objectName: "${label}"\n    }\n}`,
    checks: checks(["Live screen model", "Use Quickshell.screens as the model.", "model\\s*:\\s*Quickshell\\.screens"], ["Typed delegate screen", "Declare required ShellScreen modelData.", "required\\s+property\\s+ShellScreen\\s+modelData"], ["Bind the window", "Assign screen: modelData.", "screen\\s*:\\s*modelData"]),
  },
  "service": {
    scene: "service", tier: "static-qml-check", structure: "one singleton owns a domain and exposes typed observations plus narrow actions",
    a11y: "Expose loading, unavailable, stale, denied, and failed states as words that every consuming surface can announce.",
    security: "Sanitize external text, keep secrets out of properties and logs, and expose only narrow actions.",
    starter: () => `pragma Singleton\nimport QtQml\n\nQtObject { property var value }`,
    solution: (label) => `pragma Singleton\nimport QtQml\n\nQtObject {\n    id: root\n    readonly property string status: "loading"\n    readonly property bool available: status === "ready"\n    readonly property string label: "${label}"\n    function refresh(): void { /* one domain observer refreshes here */ }\n}`,
    checks: checks(["Singleton owner", "Declare pragma Singleton.", "pragma\\s+Singleton"], ["Typed observations", "Expose readonly typed state.", "readonly\\s+property\\s+(?:bool|int|real|string|var)\\s+\\w+"], ["Narrow action", "Expose an explicitly typed function.", "function\\s+\\w+\\s*\\([^)]*\\)\\s*:\\s*\\w+"]),
  },
  "process": {
    scene: "service", tier: "linux-wayland-runtime", structure: "Process receives an argument list, streams results, and restarts only through bounded policy",
    a11y: "Keep the last readable value or a clear stale label while an external command reconnects.",
    security: "Pass arguments as a list; avoid sh -c and never interpolate untrusted text into a shell command.",
    starter: () => `import Quickshell.Io\n\nProcess { command: "program --status" }`,
    solution: (label) => `import Quickshell.Io\n\nProcess {\n    id: probe\n    property int failures: 0\n    command: ["program", "--status", "${label}"]\n    stdout: SplitParser { onRead: data => service.accept(data) }\n    onExited: code => { if (code !== 0 && failures < 4) failures += 1 }\n}`,
    checks: checks(["Argument array", "Pass Process.command as an array.", "command\\s*:\\s*\\["], ["Stream parser", "Attach a parser to stdout.", "stdout\\s*:\\s*(?:SplitParser|StdioCollector)"], ["Bounded failure", "Count or cap restart attempts.", "(?:failures|attempts)\\s*<\\s*\\d+"]),
  },
  "config": {
    scene: "graph", tier: "static-qml-check", structure: "FileView and JsonAdapter provide watched typed policy with defaults and debounced updates",
    a11y: "Configuration must include reduced-motion, contrast, scale, and transparency-safe choices with usable defaults.",
    security: "Store policy rather than secrets and use appropriate file permissions for any sensitive configuration.",
    starter: () => `import Quickshell.Io\n\nFileView { path: configPath }`,
    solution: () => `import Quickshell.Io\n\nFileView {\n    path: configPath\n    watchChanges: true\n    onFileChanged: reloadTimer.restart()\n    JsonAdapter {\n        id: values\n        property bool reducedMotion: false\n        property int drawerWidth: 420\n    }\n}`,
    checks: checks(["Watched file", "Use FileView with watchChanges.", "FileView\\s*\\{[\\s\\S]*watchChanges\\s*:\\s*true"], ["Typed adapter", "Nest a JsonAdapter with typed defaults.", "JsonAdapter\\s*\\{[\\s\\S]*property\\s+(?:bool|int|real|string)"], ["Debounced reload", "Restart a timer on file change.", "onFileChanged\\s*:\\s*\\w+\\.restart\\s*\\("]),
  },
  "persistent": {
    scene: "graph", tier: "static-qml-check", structure: "PersistentProperties retains safe reload continuity per screen while sensitive or destructive intent resets",
    a11y: "Restore harmless navigation context, but never strand focus on a component that no longer exists.",
    security: "Never persist passwords, authorization text, destructive confirmation, pressed state, or a focus grab.",
    starter: () => `import Quickshell\n\nPersistentProperties { property bool open }`,
    solution: () => `import Quickshell\n\nPersistentProperties {\n    required property ShellScreen modelData\n    property bool drawerOpen: false\n    property int selectedTab: 0\n    // Authentication and destructive confirmation state deliberately live elsewhere.\n}`,
    checks: checks(["Reload continuity", "Use PersistentProperties.", "PersistentProperties\\s*\\{"], ["Screen identity", "Keep per-screen state tied to ShellScreen.", "required\\s+property\\s+ShellScreen\\s+modelData"], ["Safe values", "Persist ordinary UI intent with typed properties.", "property\\s+(?:bool|int|string)\\s+(?:drawerOpen|selectedTab|page|expanded)"]),
  },
  "mask": {
    scene: "drawer", tier: "linux-wayland-runtime", structure: "one screen-scoped window renders connected content and a Region mask follows only interactive geometry",
    a11y: "Keyboard navigation must reach the same controls without relying on pointer-only masked areas.",
    security: "Empty transparent pixels must pass input through; hidden sensitive surfaces must leave the mask immediately.",
    starter: () => `import Quickshell\n\nPanelWindow { color: "transparent" }`,
    solution: (label) => `import Quickshell\n\nPanelWindow {\n    id: window\n    color: "transparent"\n    mask: Region { item: interactiveSurface }\n    Rectangle {\n        id: interactiveSurface\n        objectName: "${label}"\n        width: 420; height: 640\n    }\n}`,
    checks: checks(["Transparent owner", "Use a transparent PanelWindow.", "PanelWindow\\s*\\{[\\s\\S]*color\\s*:\\s*[\"']transparent[\"']"], ["Precise mask", "Bind mask to a Region.", "mask\\s*:\\s*Region\\s*\\{"], ["Visible target", "Make the Region follow an item.", "Region\\s*\\{\\s*item\\s*:\\s*\\w+"]),
  },
  "ipc": {
    scene: "graph", tier: "linux-wayland-runtime", structure: "IpcHandler and visual routes call the same typed action instead of maintaining parallel state",
    a11y: "Every IPC-only convenience must still have a discoverable keyboard or visual route when people need it.",
    security: "Expose narrow, validated actions and never return secrets or private notification content through IPC.",
    starter: () => `import Quickshell.Io\n\nIpcHandler { target: "surface" }`,
    solution: (label) => `import Quickshell.Io\n\nIpcHandler {\n    target: "surface"\n    function toggle(): void { ShellActions.toggle("${label}") }\n    function openForScreen(screenName: string): void { ShellActions.openValidated(screenName) }\n}`,
    checks: checks(["Stable endpoint", "Give IpcHandler a target.", "IpcHandler\\s*\\{[\\s\\S]*target\\s*:\\s*[\"'][^\"']+[\"']"], ["Typed function", "Declare explicit parameter and return types.", "function\\s+\\w+\\s*\\([^)]*:\\s*\\w+[^)]*\\)\\s*:\\s*void"], ["Shared action", "Delegate to one action owner.", "ShellActions\\.\\w+\\s*\\("]),
  },
  "script-model": {
    scene: "model", tier: "static-qml-check", structure: "ScriptModel preserves delegate identity while filters or sort order change",
    a11y: "Announce result-count changes without moving keyboard focus unexpectedly.",
    security: "Filter and rank data without executing provider text or leaking private entries into logs.",
    starter: () => `import Quickshell\n\nListView { model: source.values.filter(value => value.visible) }`,
    solution: () => `import Quickshell\n\nScriptModel {\n    id: filtered\n    values: source.values\n        .filter(value => value.visible)\n        .sort((a, b) => a.rank - b.rank)\n}\n\nListView { model: filtered }`,
    checks: checks(["Stable model", "Use ScriptModel for derived changing data.", "ScriptModel\\s*\\{"], ["Derived values", "Bind its values to a filter or sort.", "values\\s*:[\\s\\S]*\\.(?:filter|sort)\\s*\\("], ["View consumes model", "Bind the view to the ScriptModel id.", "model\\s*:\\s*filtered"]),
  },
  "domain-view": {
    scene: "service", tier: "linux-wayland-runtime", structure: "a visible surface consumes one typed domain service and renders ready, missing, and failed states",
    a11y: "Announce important state changes and keep controls labelled even when the backing device disappears.",
    security: "Actions validate identifiers at the service boundary and views never spawn their own commands.",
    starter: (label) => `import QtQuick\n\nText { text: "${label}" }`,
    solution: (label) => `import QtQuick\n\nItem {\n    required property QtObject service\n    readonly property string statusText: service.status === "ready" ? service.summary : service.status\n    Text { text: "${label}: " + parent.statusText; Accessible.name: text }\n    Connections { target: service; function onStatusChanged(): void { statusAnnouncement.text = service.status } }\n    Text { id: statusAnnouncement; visible: false; Accessible.role: Accessible.AlertMessage }\n}`,
    checks: checks(["Injected service", "Require a service object.", "required\\s+property\\s+QtObject\\s+service"], ["Degraded states", "Branch on a service status.", "service\\.status\\s*==="], ["Announcement", "Expose an accessible alert or label.", "Accessible\\.(?:name|role)\\s*:"]),
  },
  "privacy": {
    scene: "security", tier: "static-qml-check", structure: "a shared privacy policy redacts sensitive content before it reaches lock, presentation, screenshot, or IPC surfaces",
    a11y: "Redaction remains understandable to screen-reader users instead of becoming a silent blank region.",
    security: "Sensitive text is neither logged nor persisted, and redaction happens before rendering or export.",
    starter: () => `import QtQuick\n\nText { required property string secret; text: secret }`,
    solution: (label) => `import QtQuick\n\nText {\n    required property string privateText\n    required property bool privacyMode\n    text: privacyMode ? "${label}: hidden" : privateText\n    Accessible.name: privacyMode ? "Private content hidden" : text\n    // privateText is never logged, persisted, or returned through IPC.\n}`,
    checks: checks(["Privacy policy", "Require or bind a privacy mode.", "property\\s+bool\\s+privacyMode"], ["Redacted branch", "Render a safe replacement while private.", "privacyMode\\s*\\?[^:]+:"], ["Accessible redaction", "Name the hidden state for assistive technology.", "Accessible\\.name\\s*:[^\\n]*privacyMode"]),
  },
  "notification": {
    scene: "notification", tier: "linux-wayland-runtime", structure: "one notification owner normalizes events before toasts, history, badges, actions, and IPC consume them",
    a11y: "Urgent notices are announced without stealing focus; dismiss and action controls have explicit names.",
    security: "Apply lock and presentation redaction before storing history or exposing notification data.",
    starter: () => `pragma Singleton\nimport QtQml\n\nQtObject { property var notifications: [] }`,
    solution: (label) => `pragma Singleton\nimport QtQml\n\nQtObject {\n    readonly property list<QtObject> visibleNotifications: source.values.filter(n => !Privacy.shouldHide(n))\n    readonly property string state: source.available ? "ready" : "unavailable"\n    function dismiss(id: int): void { source.dismiss(id) }\n    function invoke(id: int, action: string): void { source.invokeValidated(id, action) }\n    readonly property string surfaceLabel: "${label}"\n}`,
    checks: checks(["Single owner", "Use a singleton notification boundary.", "pragma\\s+Singleton"], ["Privacy filter", "Filter content through privacy policy.", "Privacy\\.\\w+\\s*\\("], ["Typed actions", "Expose typed dismiss or action functions.", "function\\s+(?:dismiss|invoke)\\s*\\([^)]*:\\s*\\w+"]),
  },
  "theme": {
    scene: "theme", tier: "browser-simulation", structure: "semantic colour, type, spacing, radius, and depth roles replace scattered visual literals",
    a11y: "Semantic on-colours, focus roles, text scaling, and contrast-safe modes remain valid across wallpapers.",
    security: "Lock and authentication surfaces choose opaque privacy-safe materials regardless of decorative transparency settings.",
    starter: () => `pragma Singleton\nimport QtQml\n\nQtObject { property color accent: "#8d7cff" }`,
    solution: (label) => `pragma Singleton\nimport QtQml\n\nQtObject {\n    readonly property string direction: "${label}"\n    readonly property color background: "#151219"\n    readonly property color surface: "#292331"\n    readonly property color onSurface: "#f5efff"\n    readonly property color primary: "#b7f397"\n    readonly property int space3: 12\n    readonly property int radiusMedium: 16\n    readonly property int radiusFull: 999\n}`,
    checks: checks(["Semantic palette", "Define semantic surface and on-surface roles.", "property\\s+color\\s+surface[\\s\\S]*property\\s+color\\s+onSurface"], ["Spacing role", "Define a named spacing token.", "property\\s+int\\s+space\\w*"], ["Radius roles", "Define more than one semantic radius.", "radius(?:Medium|Large|Full)[\\s\\S]*radius(?:Medium|Large|Full)"]),
  },
  "motion-tokens": {
    scene: "motion", tier: "browser-simulation", structure: "purpose-named durations and easing roles keep arrivals, exits, effects, and large spatial changes coherent",
    a11y: "One motion scale shortens distance, removes decorative overshoot, and preserves short causal feedback.",
    security: "Consequential state changes wait for real completion; motion never fabricates authorization success.",
    starter: () => `pragma Singleton\nimport QtQml\n\nQtObject { property int duration: 300 }`,
    solution: () => `pragma Singleton\nimport QtQml\n\nQtObject {\n    property real scale: 1\n    readonly property int immediate: Math.round(120 * scale)\n    readonly property int fastEffect: Math.round(190 * scale)\n    readonly property int exit: Math.round(220 * scale)\n    readonly property int enter: Math.round(360 * scale)\n    readonly property int spatial: Math.round(440 * scale)\n    readonly property int largeSpatial: Math.round(600 * scale)\n}`,
    checks: checks(["Purpose names", "Define at least enter and exit roles.", "property\\s+int\\s+exit[\\s\\S]*property\\s+int\\s+enter"], ["Spatial role", "Define a spatial duration.", "property\\s+int\\s+(?:spatial|largeSpatial)"], ["Motion scale", "Derive durations from one scale.", "Math\\.round\\([^)]*scale"]),
  },
  "visual-policy": {
    scene: "audit", tier: "browser-simulation", structure: "one policy object derives compact, fullscreen, hostile-wallpaper, and reduced-motion presentation states",
    a11y: "Contrast, focus, truncation, target size, and reflow are checked in every representative state.",
    security: "Privacy and authentication contexts override transparency, artwork, and notification detail.",
    starter: () => `import QtQml\n\nQtObject { property bool fullscreen: false }`,
    solution: (label) => `import QtQml\n\nQtObject {\n    property bool fullscreen: false\n    property bool hostileWallpaper: false\n    property bool reducedMotion: false\n    property bool privacyContext: false\n    readonly property bool useTransparency: !hostileWallpaper && !privacyContext\n    readonly property real edgeRadius: fullscreen ? 0 : 20\n    readonly property string direction: "${label}"\n}`,
    checks: checks(["Context inputs", "Model at least two policy inputs.", "property\\s+bool\\s+fullscreen[\\s\\S]*property\\s+bool\\s+\\w+"], ["Derived transparency", "Derive transparency from safety context.", "useTransparency\\s*:[^\\n]*(?:hostileWallpaper|privacyContext)"], ["Fullscreen geometry", "Derive geometry from fullscreen state.", "(?:radius|edgeRadius|exclusiveZone)\\s*:[^\\n]*fullscreen"]),
  },
  "accessible-control": {
    scene: "control", tier: "static-qml-check", structure: "a keyboard-operable control exposes role, name, state, target size, and visible focus",
    a11y: "Keyboard, screen reader, zoom, high contrast, and reduced motion are first-class acceptance paths.",
    security: "Consequential controls state their action clearly and require confirmation without trapping or persisting focus.",
    starter: () => `import QtQuick\n\nRectangle { width: 24; height: 24 }`,
    solution: (label) => `import QtQuick\n\nRectangle {\n    id: control\n    implicitWidth: 44; implicitHeight: 44\n    activeFocusOnTab: true\n    border.width: activeFocus ? 3 : 0\n    Accessible.role: Accessible.Button\n    Accessible.name: "${label}"\n    Keys.onReturnPressed: activate()\n    function activate(): void { Actions.activate(objectName) }\n}`,
    checks: checks(["Target size", "Provide a 44-pixel-equivalent target.", "implicitWidth\\s*:\\s*44[\\s\\S]*implicitHeight\\s*:\\s*44"], ["Focus feedback", "Make focus visible.", "activeFocus(?:OnTab)?"], ["Semantic route", "Add accessible role/name and keyboard activation.", "Accessible\\.role[\\s\\S]*Accessible\\.name[\\s\\S]*Keys\\.on"]),
  },
  "security": {
    scene: "security", tier: "linux-wayland-runtime", structure: "validated argument arrays and ephemeral authentication state preserve the operating-system security boundary",
    a11y: "Failure, cancellation, retry, and confirmation remain keyboard-operable and clearly announced.",
    security: "Never weaken PAM, polkit, lock, or session boundaries; never log or persist authentication text.",
    starter: () => `import Quickshell.Io\n\nProcess { command: ["program", userInput] }`,
    solution: () => `import Quickshell.Io\n\nQtObject {\n    property string authenticationText: "" // ephemeral: never persisted or logged\n    function runValidated(action: string): void {\n        if (!["lock", "logout", "suspend"].includes(action)) return\n        process.command = ["sessionctl", action]\n        process.running = true\n    }\n    Process { id: process }\n    Component.onDestruction: authenticationText = ""\n}`,
    checks: checks(["Allow-list", "Validate actions against an allow-list.", "\\.(?:includes|indexOf)\\s*\\(action\\)"], ["Argument array", "Assign a Process command array.", "command\\s*=\\s*\\["], ["Ephemeral secret", "Clear authentication text on destruction or cancellation.", "authenticationText\\s*=\\s*[\"']{2}"]),
  },
  "validation": {
    scene: "audit", tier: "linux-wayland-runtime", structure: "a machine-readable evidence model separates static checks, browser simulations, and live runtime observations",
    a11y: "The evidence matrix includes keyboard, screen reader, focus, zoom, contrast, and reduced-motion results.",
    security: "Captured logs and screenshots are redacted before storage or sharing.",
    starter: () => `import QtQml\n\nQtObject { property var checks: [] }`,
    solution: (label) => `import QtQml\n\nQtObject {\n    readonly property string suite: "${label}"\n    property list<string> staticChecks: ["qmlls", "imports", "types"]\n    property list<string> runtimeChecks: ["hotplug", "fullscreen", "ipc"]\n    property list<string> accessibilityChecks: ["keyboard", "focus", "screen-reader"]\n    property bool redacted: true\n    readonly property bool complete: staticChecks.length > 0 && runtimeChecks.length > 0 && redacted\n}`,
    checks: checks(["Tiered evidence", "Separate static and runtime checks.", "staticChecks[\\s\\S]*runtimeChecks"], ["Accessibility evidence", "Include explicit accessibility checks.", "accessibilityChecks\\s*:"], ["Redaction state", "Record that evidence is redacted.", "redacted\\s*:\\s*true"]),
  },
  "release": {
    scene: "release", tier: "static-qml-check", structure: "typed release metadata pins the tested stack and links migrations, attribution, and validation evidence",
    a11y: "Installation, update, rollback, and troubleshooting instructions work without relying on colour, motion, or pointer-only steps.",
    security: "Packaging preserves safe permissions, verifies sources, and never bundles local secrets or authentication state.",
    starter: () => `import QtQml\n\nQtObject { property string version: "0.0.0" }`,
    solution: (label) => `import QtQml\n\nQtObject {\n    readonly property string product: "${label}"\n    readonly property string version: "1.0.0"\n    readonly property string quickshellVersion: "tested-version-required"\n    readonly property string qtVersion: "tested-version-required"\n    readonly property int configSchema: 1\n    readonly property list<string> evidence: ["VALIDATION.md", "ATTRIBUTION.md", "KNOWN_LIMITATIONS.md"]\n}`,
    checks: checks(["Semantic version", "Declare a release version.", "version\\s*:\\s*[\"']\\d+\\.\\d+\\.\\d+[\"']"], ["Pinned stack", "Record Quickshell and Qt versions.", "quickshellVersion[\\s\\S]*qtVersion"], ["Evidence pack", "Reference validation, attribution, or limitations evidence.", "(?:VALIDATION|ATTRIBUTION|KNOWN_LIMITATIONS)\\.md"]),
  },
};

const GLOSSARY: Record<string, string> = {
  object: "A live QML instance with typed properties and a lifetime.", binding: "A live expression that QML reevaluates when a dependency changes.", dependency: "A value read by a binding or module and therefore able to affect its result.",
  import: "A declaration that makes a module's types available.", scope: "The part of the component where an id or name can be referenced.", lifetime: "The interval during which an object exists and may own resources.",
  type: "A contract describing the values a property or function accepts.", enum: "A named choice from a fixed set of values.", nullish: "A missing value represented by null or undefined and handled deliberately.",
  coordinates: "An item's position measured in its parent's local space.", transform: "A visual translation, rotation, or scale applied without changing layout ownership.", stacking: "The order in which overlapping visual items are painted.",
  implicitSize: "The natural size a reusable item asks its parent or layout to provide.", layout: "A container that negotiates the geometry of its direct children.", constraint: "A minimum, preferred, maximum, fill, anchor, or other geometry rule.",
  elision: "Replacing overflowing text with an ellipsis.", localization: "Adapting text, numbers, dates, and layout for a language or locale.", asset: "An image, font, icon, or other content resource loaded by the shell.",
  handler: "An input object such as TapHandler, HoverHandler, or DragHandler.", focus: "The current destination for keyboard input.", semantics: "Machine-readable role, name, state, and action information for assistive technology.",
  animation: "A time-based change that communicates state or causality.", transition: "A coordinated animation between named states.", reversal: "Changing direction from the current rendered value without jumping.",
  loader: "An object that creates another component on demand.", creationContext: "The scope and references captured when a component is created.", disposal: "Stopping work and releasing resources when an object leaves the scene.",
  quickshell: "A Qt/QML framework for building desktop shells.", wayland: "The display protocol through which clients and a compositor exchange surfaces and input.", compositor: "The Wayland process that places windows, handles focus, and presents the final scene.",
  qmldir: "A module manifest that declares QML types and singletons.", qmlls: "The QML language server used for diagnostics and editor intelligence.", reload: "Recreating QML objects after source changes while preserving only safe continuity.",
  panel: "A layer-shell window that intentionally owns a screen edge.", exclusion: "Reserved edge space that affects ordinary application placement.", fullscreen: "A compositor state requiring coordinated surface, border, mask, and focus policy.",
  service: "A single domain owner exposing stable observations and narrow actions.", observer: "The one component that subscribes to or probes a system domain.", degraded: "A designed state such as unavailable, stale, denied, or failed.",
  process: "An external program started with explicit executable and argument boundaries.", backoff: "Increasing retry delay that prevents a failing dependency from thrashing.", cancellation: "Stopping obsolete asynchronous work and ignoring late results.",
  configuration: "Typed user policy with defaults and sparse overrides.", persistence: "State deliberately retained across reloads or launches.", atomicWrite: "Replacing a file as one operation so readers never see a partial update.",
  region: "A geometric input mask that controls where a transparent window accepts events.", focusGrab: "A temporary claim on keyboard focus with an explicit release path.", restoration: "Returning focus to the trigger after a dependent surface closes.",
  ipc: "Inter-process communication exposing stable shell actions outside the visual UI.", action: "One state transition shared by pointer, keyboard, shortcut, and IPC routes.", validation: "Checking inputs, structure, behaviour, and evidence against explicit expectations.",
  model: "A collection of domain objects consumed by delegates or views.", identity: "A stable key that lets a delegate survive filtering, sorting, and updates.", selection: "The policy that chooses one object, player, screen, or result from a model.",
  privacy: "Policy controlling when sensitive content may be rendered, stored, captured, or exposed.", redaction: "Replacing sensitive content with an intentional safe representation.", authentication: "Verification delegated to trusted PAM, polkit, or session facilities.",
  notification: "A protocol event containing content, urgency, timeout, and optional actions.", urgency: "A priority signal that affects presentation without automatically stealing focus.", history: "A pruned record of notifications retained under an explicit privacy policy.",
  palette: "A set of semantic colour roles rather than scattered literal colours.", topology: "The spatial relationship between edges, triggers, popouts, drawers, and modal layers.", depth: "Hierarchy expressed through surface level, tone, elevation, and focus policy.",
  typography: "Named text roles controlling size, weight, width, optical size, and use.", iconography: "A coherent icon family and systematic state treatment.", metric: "A measured dimension such as text width, baseline, scale, latency, or memory.",
  cadence: "The intentional rate at which changing data is observed or displayed.", hotplug: "A device or screen being added or removed while the shell is running.", sampling: "Observing a changing value at a bounded rate suited to its meaning.",
  pipewire: "The media graph commonly used for Linux audio and video routing.", node: "A PipeWire object representing a device, stream, or processing endpoint.", defaultDevice: "The current system-preferred input or output device.",
  mpris: "The D-Bus interface through which media players expose metadata and transport controls.", metadata: "Descriptive player data such as title, artist, length, and artwork URL.", transport: "Playback actions such as play, pause, seek, next, and previous.",
  connectivity: "The system's actual network reachability state, not merely an enabled radio.", permission: "An authority boundary that may allow, deny, or defer an operation.", foreignContent: "External artwork or icons normalized inside the shell without being redesigned.",
  workspace: "A compositor-managed group of application windows.", focusedScreen: "The screen resolved from compositor focus rather than a hard-coded index.", reconnect: "Re-establishing a service subscription after its provider restarts.",
  overflow: "A policy for what collapses, hides, scrolls, or moves deeper when space is scarce.", ownership: "The visible and architectural answer to which trigger, edge, or module a surface belongs to.", density: "The amount and priority of information presented within available space.",
  placement: "The constrained position of a contextual surface relative to its trigger and monitor.", dismissal: "Closing a transient surface through outside input, Escape, context change, or its owner.", progressiveDepth: "Revealing more detail at popout, drawer, and modal levels instead of overloading the bar.",
  ranking: "Ordering search results using relevance, recency, and stable tie-breakers.", provider: "A bounded source of launcher results such as apps, calculations, or clipboard entries.", announcement: "A concise accessible message reporting a meaningful state or result change.",
  gesture: "A pointer or touch sequence interpreted using direction, progress, threshold, and cancellation.", arbitration: "Resolving which surface or scroll view owns an ambiguous input sequence.", continuity: "Preserving spatial origin, identity, and legibility through a state change.",
  toast: "A brief notification surface placed in a coordinated alert lane.", osd: "An on-screen display for immediate feedback such as volume or brightness.", coalescing: "Combining rapid repeated events into one continuously updated presentation.",
  session: "The user environment whose lock, suspend, logout, and shutdown actions are consequential.", pam: "The system authentication framework that a shell must use without bypassing.", polkit: "The authorization framework for privileged desktop actions.",
  canon: "The shared design truths learned from End-4 and Caelestia without copying identity.", negativeSpace: "Screen area deliberately left to applications and wallpaper.", cardSoup: "A rejected composition made from unrelated rounded translucent cards.",
  semanticColor: "A role such as surface, onSurface, primary, error, or scrim whose meaning survives theme changes.", contrast: "The perceptual difference that keeps text, controls, and focus legible.", transparency: "A conditional material choice, not a substitute for tonal hierarchy.",
  motionRole: "A duration and easing token named by purpose such as enter, exit, or spatial.", reducedMotion: "A policy that removes decorative distance and overshoot while retaining causal feedback.", interruption: "Changing an in-progress transition without a discontinuity or queued animation tail.",
  responsive: "A composition that intentionally adapts to size, orientation, scale, and context.", override: "A sparse per-monitor or user value layered over typed defaults.", stateGallery: "A representative set of screenshots covering interaction, theme, size, and failure states.",
  architecture: "The dependency and ownership structure that keeps modules understandable.", injection: "Passing a required dependency explicitly instead of discovering it through hidden globals.", registry: "A stable mapping from screen and role to live component instances.",
  performance: "Measured startup, frame, CPU, GPU, and memory behaviour under realistic states.", lazyLoading: "Deferring optional object creation until policy or idle time requires it.", profiling: "Collecting evidence that identifies a real bottleneck before optimization.",
  resilience: "The ability to remain useful and recover through reloads, restarts, malformed data, and hotplug.", containment: "Preventing one failing service or module from breaking unrelated shell surfaces.", malformed: "External data that violates its expected shape and must be rejected safely.",
  secret: "Sensitive material that must not appear in QML logs, screenshots, IPC, or ordinary config.", allowlist: "A fixed set of accepted actions or values used to reject unexpected input.", threat: "A plausible path by which data, authority, or privacy could be harmed.",
  evidence: "A reproducible record showing which checks ran, where, and with what result.", matrix: "A deliberate combination of screens, input paths, states, services, and policies to test.", staticCheck: "A parser, type, import, lint, or structural check performed without a live compositor.",
  versioning: "Recording and comparing software and schema versions across releases.", migration: "A tested transformation from one persisted schema to another with rollback safety.", attribution: "License and source credit preserved for copied or adapted material.",
};

const termSet = (keys: [string, string, string]): [[string, string], [string, string], [string, string]] => keys.map(key => [key, GLOSSARY[key] ?? `Course term for ${key}.`]) as [[string, string], [string, string], [string, string]];

const seed = (value: Blueprint): Blueprint => value;

const s = (
  regionId: string, recipe: RecipeId, id: string, title: string, subtitle: string, objective: string,
  focus: string, mechanism: string, failure: string, analogy: string,
  rules: [string, string, string], termKeys: [string, string, string], tags: string[],
  options: Pick<Blueprint, "prerequisiteIds" | "executionTier" | "boss" | "sideQuest"> = {},
): Blueprint => seed({ regionId, recipe, id, title, subtitle, objective, focus, mechanism, failure, analogy, rules, termKeys, tags, ...options });

type CompactBlueprint = [
  recipe: RecipeId, id: string, title: string, subtitle: string, objective: string,
  mechanism: string, failure: string, analogy: string, termKeys: [string, string, string],
  tags: string[], options?: Pick<Blueprint, "prerequisiteIds" | "executionTier" | "boss" | "sideQuest">,
];

const expandRegion = (regionId: string, designFrame: string, entries: CompactBlueprint[]): Blueprint[] => entries.map((entry) => {
  const [recipe, id, title, subtitle, objective, mechanism, failure, analogy, termKeys, tags, options = {}] = entry;
  return seed({
    regionId, recipe, id, title, subtitle, objective,
    focus: `${objective} This lesson treats ${title.toLowerCase()} as ${designFrame}, so the learner can identify the owner, input, and visible consequence instead of memorizing an isolated widget recipe.`,
    mechanism,
    failure,
    analogy,
    rules: [
      `Name the owner and source of truth before implementing ${title.toLowerCase()}.`,
      `Connect ${termKeys[0]}, ${termKeys[1]}, and ${termKeys[2]} through typed, observable state.`,
      `Exercise the normal path and the specific failure described in this quest before calling it complete.`,
    ],
    termKeys, tags, ...options,
  });
});

const rawSeeds: Blueprint[] = [
  // Campaign I: 24 additions. Combined with the original 26, Awakening reaches 50 quests.
  s("first-sparks", "qml-object", "grammar-error-compass", "Follow the brace trail", "Grammar, imports, and useful error messages", "Read a small QML file, locate the object an error belongs to, and repair its braces without guessing.",
    "QML grammar is a nested object description: imports select toolboxes, a type name starts an object, and braces delimit its body.", "Read from the reported line outward, match every opening brace with its owner, then verify that each property uses a colon and each child starts with a type.", "Fixing only the highlighted line can leave the real mistake above it; parsers often notice a missing brace only when the next valid token arrives.", "following colored hiking markers back to the fork where the wrong turn began",
    ["Match braces from the root outward.", "Use the first parser error as a clue, not a verdict.", "Recheck imports and property colons before changing behaviour."], ["import", "object", "scope"], ["qml", "grammar", "diagnostics"], { prerequisiteIds: ["qml-is-a-description"] }),
  s("first-sparks", "qml-values", "value-toolchest", "Pack the value toolchest", "Numbers, text, choices, and missing data", "Choose precise QML types for numbers, strings, booleans, colours, URLs, enums, lists, null, and undefined.",
    "A property type is a promise about what a value means, which makes tools and later readers able to catch category mistakes.", "Use bool for two-state policy, numeric types for measurements, color and url for domain values, enums for fixed choices, and typed lists for collections.", "A broad var can hide misspellings and nullish values until a binding renders nonsense, so every optional value needs a deliberate fallback.", "packing labelled drawers so a battery percentage never ends up in the wallpaper drawer",
    ["Prefer the narrowest useful property type.", "Handle null and undefined before formatting.", "Use enums when only named choices are valid."], ["type", "enum", "nullish"], ["qml", "types", "values"]),
  s("first-sparks", "qml-object", "binding-repair-clinic", "Repair the reactive circuit", "Assignments, loops, and lost bindings", "Trace a dependency graph and repair a broken or looping binding while preserving one source of truth.",
    "Bindings form directed dependencies, so a view property should read authoritative state rather than copy another derived result.", "Mark each value as source or derived, follow arrows from inputs to outputs, and replace event-handler copies with expressions wherever the relationship must stay live.", "Assigning to a bound property removes its expression, while two properties that derive from each other create a loop with no stable owner.", "rewiring a signal circuit so current flows one way from the battery instead of chasing itself around a ring",
    ["Draw dependency arrows before editing.", "Assign only authoritative intent from events.", "Break every cycle by choosing one source of truth."], ["binding", "dependency", "validation"], ["qml", "bindings", "debugging"], { sideQuest: true }),
  s("first-sparks", "qml-contract", "lifetime-contract-lab", "Own state for exactly long enough", "Required inputs, readonly outputs, and lifetime", "Design a small component whose required inputs, derived outputs, id scope, and startup work have explicit owners.",
    "Required properties prevent an instance from entering the scene without the information its contract needs, while readonly properties expose facts consumers must not overwrite.", "Local ids connect objects inside one component, Component.onCompleted starts only work owned by that instance, and destruction must stop timers or asynchronous work it created.", "Using a global singleton to reach a local child or starting uncancelled work on completion makes reloads duplicate observers and leaves dead objects receiving results.", "issuing each workshop tool to one named bench and checking it back in when that bench closes",
    ["Require essential inputs at construction.", "Expose derived facts as readonly.", "Cancel instance-owned work when its lifetime ends."], ["scope", "lifetime", "type"], ["qml", "contracts", "lifetime"]),

  s("shape-district", "qml-layout", "coordinate-layer-lab", "Navigate local space", "Coordinates, transforms, stacking, and clipping", "Predict where nested items paint after local coordinates, transforms, z-order, clipping, and opacity are applied.",
    "Every visual item's x and y live in its parent's coordinate system, so the same number can point to different screen positions in different branches.", "Layout establishes geometry first; transforms alter presentation afterward; z and declaration order resolve overlap; clipping decides whether descendants may paint outside their owner.", "Using a transform to repair layout or lowering opacity to hide overflow leaves hit areas and ownership unchanged, producing controls that look moved but behave elsewhere.", "reading floors in a tower where every room has its own origin and the elevator map converts between them",
    ["Reason in the immediate parent's coordinates.", "Use transforms for presentation, not layout repair.", "Set clipping and z-order only with a named ownership reason."], ["coordinates", "transform", "stacking"], ["qml", "geometry", "painting"], { prerequisiteIds: ["geometry-anchors"] }),
  s("shape-district", "qml-contract", "implicit-size-chain", "Let components ask for room", "Natural size that propagates", "Build a reusable status control whose implicit size follows its text, padding, icon, and state without hard-coded caller dimensions.",
    "Implicit size is a component's honest request for room, not a command to its parent.", "Measure the content's implicit dimensions, add semantic padding, and let layouts compare that request with minimum, preferred, maximum, and fill constraints.", "If a reusable control reports zero or a fixed guessed size, long locales clip and every caller starts duplicating internal geometry knowledge.", "a musician stating the space their instrument needs before the stage manager assigns the final spot",
    ["Derive natural size from content plus padding.", "Let the parent decide final layout size.", "Test short, long, empty, and loading labels."], ["implicitSize", "layout", "constraint"], ["qml", "components", "sizing"]),
  s("shape-district", "qml-layout", "constraint-repair-yard", "Untangle the geometry orders", "Anchor conflicts and layout negotiation", "Diagnose an over-constrained item and rewrite it with one clear geometry owner.",
    "Anchors, direct x/y/width assignments, transforms, and layouts are separate geometry systems, and a direct child should not receive competing instructions on the same axis.", "Choose the owner that matches intent: anchors for maintained relationships, layouts for negotiated groups, coordinates for controlled canvases, and transforms for visual effects.", "A child anchored left and right while also given width may appear to work at one size but emit warnings or snap unpredictably when its parent changes.", "letting one conductor lead the orchestra instead of handing every musician a different tempo sheet",
    ["Name one geometry owner per axis.", "Remove constraints that merely restate derived size.", "Test resize and localization after every repair."], ["constraint", "layout", "coordinates"], ["qml", "anchors", "debugging"], { sideQuest: true }),
  s("shape-district", "qml-content", "resilient-content-gallery", "Make content survive the real world", "Text, images, localization, and loading", "Compose text and image content that handles truncation, wrapping, mixed scripts, right-to-left flow, crop policy, loading, and failure.",
    "Content is variable input: labels grow in translation, numbers change width, artwork arrives late, and some resources never arrive.", "Give text an overflow and direction policy, reserve image geometry before loading, choose a deliberate aspect mode, and render explicit loading, empty, and error states.", "A perfect English screenshot with an unconstrained Image says nothing about Arabic text, a broken artwork URL, or a 1.25-scale portrait display.", "designing shipping crates with adjustable padding and clear labels for packages of many shapes",
    ["Specify wrap or elision for bounded text.", "Reserve dimensions before asynchronous assets arrive.", "Design loading, empty, and failed content states."], ["elision", "localization", "asset"], ["qml", "content", "localization", "accessibility"]),

  s("motion-arcade", "interaction", "pointer-handler-field", "Choose the right pointer sensor", "Tap, hover, wheel, and drag", "Select TapHandler, HoverHandler, WheelHandler, or DragHandler according to intent and resolve gesture competition.",
    "Qt Quick pointer handlers separate recognition jobs, so tapping, hovering, scrolling, and dragging do not need one giant catch-all rectangle.", "Attach the narrowest handler to the owning item, observe its state through bindings, and define threshold and grab policy where two recognizers may compete.", "A broad MouseArea over a drawer can steal wheel and click input from nested controls or applications behind transparent pixels.", "assigning specialist referees to tap, hover, and drag events instead of asking one referee to guess every sport",
    ["Use the narrowest handler for the gesture.", "Keep visual feedback bound to handler state.", "Resolve scroll and drag ownership before accepting the gesture."], ["handler", "gesture", "arbitration"], ["qml", "pointer", "input"], { prerequisiteIds: ["interaction-state"] }),
  s("motion-arcade", "focus", "keyboard-focus-route", "Draw the invisible keyboard path", "FocusScope, tab order, and restoration", "Make an animated switcher completely operable with Tab, arrows, activation keys, Escape, and correct focus restoration.",
    "Keyboard focus is a route through the UI, and FocusScope lets a reusable surface own that route without leaking internal targets to its parent.", "Define entry, movement, activation, Escape, dismissal, and return behaviour, then render a visible focus state using the same interaction grammar as pointer feedback.", "Opening a popout by keyboard and closing it to nowhere strands the learner; trapping focus in a non-modal surface makes the rest of the desktop unreachable.", "laying tactile guide rails through a station and always returning travellers to the platform where they entered",
    ["Define where focus enters and leaves.", "Support conventional activation and Escape keys.", "Restore focus to the opening control after dismissal."], ["focus", "restoration", "semantics"], ["qml", "keyboard", "accessibility"]),
  s("motion-arcade", "animation", "motion-composition-stage", "Choreograph without hiding state", "Behaviors, groups, and staged replacement", "Combine sequential, parallel, spatial, and content animations while keeping the cause and final state obvious.",
    "A Behavior animates whenever a bound property changes, while explicit animation groups are useful when several ordered phases make one state transition readable.", "Move the surface from its spatial origin, run compatible effects in parallel, and stage text replacement out, swap, then in to avoid flicker.", "Animating every property together creates visual noise, and sequencing a necessary focus or hit-region update behind decoration makes the interface feel unresponsive.", "blocking a theatre scene so scenery, lighting, and dialogue change in a deliberate order rather than all technicians moving at once",
    ["Animate the property that explains causality.", "Parallelize independent effects and sequence dependent phases.", "Keep focus, input, and content truth synchronized with visible state."], ["animation", "transition", "motionRole"], ["qml", "motion", "composition"]),
  s("motion-arcade", "loader", "loader-lifetime-backstage", "Unload without ghosts", "Component, Loader, and creation context", "Create and retire an optional animated surface without forcing synchronous loading or leaving timers, signals, or focus behind.",
    "Component describes an object factory, and Loader or LazyLoader controls when that object joins the live tree and which creation context its bindings capture.", "Keep exit content alive until its closing animation finishes, release focus and connections, then set the loader inactive; preload only when first-use latency justifies the memory.", "Reading a LazyLoader's item while it is loading forces completion, while unloading immediately on close cuts off motion and can leave external callbacks targeting a dead instance.", "running a backstage fly system that keeps the set intact through the final curtain beat, then powers it down cleanly",
    ["Do not touch a lazy item while it is loading.", "Complete exit and focus cleanup before unloading.", "Stop instance-owned work at disposal."], ["loader", "creationContext", "disposal"], ["qml", "loader", "lifetime"], { sideQuest: true }),

  s("system-frontier", "shell-root", "platform-stack-crossing", "See the whole platform stack", "Qt, QML, Quickshell, Wayland, compositor", "Explain which layer owns types, object creation, shell windows, protocol surfaces, placement, focus, and final presentation.",
    "QML describes objects, Qt Quick renders and handles input, Quickshell supplies shell-oriented types and services, Wayland carries surfaces and events, and the compositor controls placement and focus.", "Trace a PanelWindow from its QML declaration through Quickshell's layer-shell integration to the compositor policy that places it on a physical output.", "A browser preview can illustrate bindings and geometry, but it cannot prove layer protocol behaviour, exclusion zones, hotplug, focus grabs, or compositor integration.", "following a letter from its writer through the local post office, transport network, and destination building manager",
    ["Name the layer responsible for each behaviour.", "Label simulations separately from static and runtime evidence.", "Verify compositor-specific behaviour on Linux/Wayland."], ["quickshell", "wayland", "compositor"], ["quickshell", "platform", "runtime"], { prerequisiteIds: ["shellroot-modules"], executionTier: "linux-wayland-runtime" }),
  s("system-frontier", "shell-root", "module-manifest-workshop", "Build a local QML module", "qmldir, singletons, and import diagnosis", "Create a local module with an explicit singleton and diagnose missing-type, duplicate-name, and import-path errors.",
    "A qmldir manifest tells the QML engine which named types and singletons a module exports, while import paths determine whether that manifest can be found.", "Keep module names aligned with directories, register singletons intentionally, import the module from a thin root, and use diagnostics to distinguish discovery from type errors.", "Copying files beside shell.qml without a consistent module boundary may work through accidental context and then fail when a component moves or qmlls indexes it.", "publishing a library catalogue so every workshop knows which tools exist and where to request them",
    ["Keep module URI, directory, and imports consistent.", "Register shared owners explicitly as singletons.", "Diagnose path discovery before rewriting valid component code."], ["qmldir", "import", "service"], ["quickshell", "modules", "tooling"], { executionTier: "static-qml-check" }),
  s("system-frontier", "validation", "reload-recovery-console", "Make errors recoverable", "qmlls, logs, hot reload, and syntax recovery", "Configure language tooling, interpret runtime logs, and recover from a syntax error without duplicating shell services.",
    "qmlls catches imports, properties, types, and unqualified access before launch, while Quickshell logs show binding loops, loader stalls, and runtime integration failures.", "Start from the first diagnostic, make one focused repair, reload, and confirm singleton observers, shortcuts, notification ownership, and IPC handlers were not duplicated.", "A reload that appears visually successful can still leave a second timer or service subscription consuming resources behind the same bar.", "resetting a circuit breaker while watching every branch, not merely checking that the room lights came back on",
    ["Fix the earliest structural diagnostic first.", "Read logs after every recovery reload.", "Count long-lived owners before and after reload."], ["qmlls", "reload", "observer"], ["quickshell", "debugging", "reload"], { sideQuest: true, executionTier: "linux-wayland-runtime" }),
  s("system-frontier", "panel-window", "window-policy-range", "Give every window a job", "Panel, popup, modal, and orchestration policy", "Choose the correct Quickshell window topology and prove its edge, layer, focus, exclusion, scale, and fullscreen behaviour.",
    "A persistent panel, trigger-owned popup, independent floating utility, modal surface, and screen-spanning orchestration window have different ownership and focus contracts.", "Select topology from the interaction and continuity requirements, then specify screen binding, layer, anchors, exclusion, keyboard interactivity, mask, and coordinated fullscreen transformation.", "Several independent transparent windows that visually pretend to be one connected drawer can tear, overlap input, and disagree about focus or fullscreen.", "choosing between a porch, a hinged cupboard, a private room, and one open-plan hall based on how people enter and move",
    ["Choose topology before styling.", "Specify input, focus, layer, and exclusion together.", "Test scale, hotplug, and fullscreen on the target compositor."], ["panel", "exclusion", "fullscreen"], ["quickshell", "windows", "topology"], { executionTier: "linux-wayland-runtime" }),

  s("living-shell", "service", "native-service-first", "Choose the closest source of truth", "Native modules before subprocesses", "Evaluate a data need and select a native Quickshell service, compositor object, D-Bus boundary, or carefully managed Process.",
    "The closest structured source usually preserves identity, events, types, and failure signals better than repeatedly parsing command output.", "Check the installed Quickshell version and target compositor first, wrap the chosen domain once in a typed service, and expose stable observations to every view.", "Delegate-level polling duplicates work, races state changes, loses hotplug identity, and turns missing executables into scattered visual failures.", "asking the building's control desk for the fire alarm state instead of sending every room occupant outside to sniff for smoke",
    ["Prefer native structured state when supported.", "Put one observer behind one stable service.", "Document the installed API version and fallback boundary."], ["service", "observer", "quickshell"], ["architecture", "services", "quickshell"], { prerequisiteIds: ["service-boundaries"], executionTier: "static-qml-check" }),
  s("living-shell", "process", "resilient-stream-bridge", "Cross a process boundary safely", "Streaming, cancellation, timeout, and backoff", "Wrap an unavoidable external monitor with argument arrays, streaming parsing, cancellation, timeout, and bounded restart behaviour.",
    "A long-running monitor should stream state into one service rather than spawn a fresh command in every delegate or on a frantic timer.", "Pass executable arguments as a list, validate inputs, parse complete records, ignore late cancelled work, surface stale status, and retry with a cap and increasing delay.", "Using sh -c with interpolated device names creates injection risk, while instant infinite restarts can pin a CPU when the dependency is absent.", "operating a guarded drawbridge that checks every traveller, closes on alarm, and reopens gradually after repeated faults",
    ["Use an executable plus argument list.", "Cancel obsolete work and reject late results.", "Cap retries and expose stale or failed state."], ["process", "cancellation", "backoff"], ["quickshell", "process", "resilience"], { executionTier: "linux-wayland-runtime" }),
  s("living-shell", "config", "sparse-override-ledger", "Separate policy from live state", "Typed defaults, watched JSON, and atomic updates", "Implement typed configuration with defaults, sparse per-monitor overrides, watched reloads, and debounced atomic writes.",
    "Configuration records user policy such as width or motion scale, not current volume, focused window, pressed state, or a drawer's derived geometry.", "Layer a sparse override over typed defaults, watch the small file, debounce read/write loops, and apply new policy reactively without recreating unrelated services.", "A config file used as an event bus accumulates transient facts, writes constantly, and becomes corrupted or impossible to migrate safely.", "keeping the building code in a controlled ledger while live elevator positions stay on the operations board",
    ["Persist user choices, not system truth.", "Apply sparse overrides over typed defaults.", "Debounce and write configuration atomically."], ["configuration", "override", "atomicWrite"], ["quickshell", "config", "persistence"], { executionTier: "static-qml-check" }),
  s("living-shell", "mask", "popout-focus-return", "Close the loop on a popout", "Focus grab, outside dismissal, and click-through", "Build a trigger-owned popout that dismisses from outside click or Escape, releases its grab, passes empty input through, and restores focus.",
    "A popout belongs both visually and behaviourally to the trigger that opened it, so placement, input, focus, dismissal, and return are one contract.", "Limit the clickable Region to visible content, add the popout and trigger to the focus group where supported, close all dependent state together, then focus the trigger.", "A full-screen transparent window with no precise mask blocks applications, while closing only the rectangle can leave a focus grab or keyboard target alive.", "opening a desk drawer that remains attached to its handle, closes from either hand, and never blocks the walkway when shut",
    ["Keep the popout visibly attached to its trigger.", "Make the input mask follow visible geometry.", "Release grabs and restore trigger focus on every close path."], ["focusGrab", "region", "restoration"], ["quickshell", "popout", "focus"], { executionTier: "linux-wayland-runtime" }),

  s("hero-forge", "theme", "authored-visual-contract", "Write the shell's visual constitution", "Direction, topology, grammar, and states", "Author a complete visual contract naming the canon direction, dominant topology, signature idea, palette, type, icon, spacing, radius, depth, transparency, and motion roles.",
    "A visual contract is a set of semantic decisions that lets every feature look related before any component-specific decoration is added.", "Declare an End-4-led, Caelestia-led, or intentional-hybrid direction; map surface depth; define light/dark roles, type and icon systems, spacing and radius ladders, and state treatments.", "A list of features, dimensions, gradients, and generic rounded cards does not explain ownership, hierarchy, responsive behaviour, or what makes the product recognizable.", "writing a city's building code and transit map before individual architects decorate storefronts",
    ["Name one dominant expression and topology.", "Define every shared visual and motion role semantically.", "Specify interaction, failure, responsive, and reduced-motion states."], ["canon", "palette", "topology"], ["design", "tokens", "canon"], { prerequisiteIds: ["connected-geometry"] }),
  s("hero-forge", "visual-policy", "topology-critique-studio", "Reject card soup with evidence", "End-4, Caelestia, and intentional synthesis", "Compare three shell compositions and defend which one preserves edge ownership, progressive depth, continuity, and a distinct identity.",
    "End-4 expresses broad playful utility through layered Material-like sheets, while Caelestia expresses edge-first continuity through connected screen-scoped geometry.", "Choose one dominant topology, import the other canon's strengths as subordinate rules, and evaluate the whole screen rather than isolated widgets.", "Combining both as unrelated translucent pills produces no spatial hierarchy: popouts lose owners, drawers float, and motion cannot explain where anything came from.", "editing a musical arrangement so one lead voice remains clear while supporting instruments borrow compatible techniques",
    ["Judge the whole screen, not cropped widgets.", "Keep one dominant topology and shape grammar.", "Reject blur, card repetition, and decorative motion as substitutes for hierarchy."], ["canon", "cardSoup", "progressiveDepth"], ["design", "critique", "topology"], { sideQuest: true }),
  s("hero-forge", "visual-policy", "responsive-fullscreen-matrix", "Transform as one system", "Monitor scale, orientation, and fullscreen", "Define per-monitor responsive rules and coordinate borders, exclusion, rounding, shadow, masks, and surface visibility through one fullscreen policy.",
    "A shell is screen-scoped: compact landscape, narrow portrait, ultrawide, mixed scale, and excluded monitors need deliberate compositions rather than proportional shrinking.", "Resolve tokens and surface priorities per ShellScreen, collapse low-priority content before reducing targets, and derive every fullscreen presentation change from one policy state.", "Changing only a bar's opacity in fullscreen leaves its exclusion zone, input mask, shadow, or neighbouring surfaces active and creates invisible collisions.", "reconfiguring a stage set for several theatre sizes with one cue sheet that moves lights, curtains, and scenery together",
    ["Adapt composition by available shape and scale.", "Collapse priority before shrinking accessible targets.", "Drive all fullscreen changes from one policy."], ["responsive", "override", "fullscreen"], ["quickshell", "responsive", "fullscreen"], { executionTier: "linux-wayland-runtime" }),
  s("hero-forge", "validation", "map-one-evidence-pack", "Prove the first living slice", "Runtime, screenshots, failure, and explanation", "Assemble the service → state → UI → input path and produce honest static, browser, and Linux/Wayland evidence for reload, hotplug, fullscreen, focus, and degradation.",
    "A vertical slice is complete only when one domain flows through a stable service, correctly owned state, a useful compact surface, contextual depth, every input route, and designed failures.", "Record the tested Quickshell, Qt, compositor, distribution, commands, monitor cases, screenshots, logs, keyboard and IPC results, and untested limitations.", "Passing regex checks or making a browser scene look right does not establish that a PanelWindow reserves space, a Region passes input, or services reconnect under Wayland.", "presenting a bridge with drawings, load calculations, inspection records, and a witnessed crossing rather than only a miniature model",
    ["Separate static, simulated, and runtime evidence.", "Test every action route and degraded state.", "Report untested paths and version limits plainly."], ["evidence", "matrix", "validation"], ["validation", "runtime", "capstone"], { executionTier: "linux-wayland-runtime" }),

  // Campaign II: System Atlas — 30 quests.
  ...expandRegion("time-power-hardware", "a shared hardware truth with a cadence and explicit absence policy", [
    ["service", "clock-locale-cadence", "Keep time at human speed", "Clocks, zones, locale, and calendars", "Build one clock service that updates only at the precision its consumers display and formats through locale-aware APIs.", "Derive minute and second ticks from one timer, expose typed date parts, and let views request formatting rather than parsing display strings.", "A 16 ms clock wastes CPU, while hand-built month names break locale, time-zone changes, and right-to-left presentation.", "a station clock whose mechanism ticks only as finely as each departure board needs", ["cadence", "localization", "service"], ["clock", "locale", "efficiency"], { prerequisiteIds: ["map-one-evidence-pack"] }],
    ["domain-view", "battery-ac-truth", "Read power without inventing it", "Battery, AC, and missing hardware", "Model batteries, line power, charge state, time estimates, and the valid no-battery case through the best supported native source.", "Normalize multiple devices into explicit availability and aggregate state while preserving per-device identity for deeper views.", "Assuming battery zero means absent makes a discharged laptop indistinguishable from a desktop and can trigger false critical alerts.", "a fuel desk that distinguishes an empty tank, a missing gauge, and a vehicle connected to a pump", ["service", "degraded", "hotplug"], ["power", "battery", "hardware"]],
    ["domain-view", "backlight-device-policy", "Choose the screen that can dim", "Brightness devices, limits, and permissions", "Discover backlight devices, clamp normalized brightness safely, and explain permission-denied and unsupported displays.", "Resolve a device for the focused screen, convert hardware ranges to 0–1, preserve a non-black minimum policy, and send changes through one action.", "Writing an assumed device path or raw percentage can target the wrong panel, exceed its range, or fail silently under restricted permissions.", "a lighting board that maps each room's different dimmer scale onto one safe slider", ["focusedScreen", "permission", "validation"], ["brightness", "hardware", "actions"]],
    ["process", "resource-sampling-budget", "Measure without becoming the load", "CPU, memory, thermal, and storage cadence", "Collect resource signals at bounded, domain-appropriate rates and suspend probes when no visible consumer needs them.", "Stream or batch related metrics, smooth noisy samples only for presentation, mark old readings stale, and stop expensive probes behind closed surfaces.", "Fast independent polling in every chart can consume more CPU than the shell is trying to report and keeps laptops awake.", "a doctor taking purposeful observations rather than waking the patient every second to ask if they are resting", ["sampling", "cadence", "performance"], ["resources", "polling", "power"], { sideQuest: true }],
    ["domain-view", "power-surface-incident", "Survive the missing-battery incident", "Power region boss", "Forge a compact and expanded power surface that remains truthful through AC changes, suspend, resume, denied brightness, and absent sensors.", "Bind the bar indicator and popout to the same hardware service, show ready and degraded states, and capture runtime evidence for device changes.", "A polished happy-path mockup fails the boss if suspend leaves stale charge, the popout owns another observer, or unavailable controls remain actionable.", "running an airport power board through gate changes, outages, and a full overnight shutdown drill", ["degraded", "evidence", "service"], ["power", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("sound-caverns", "one PipeWire graph translated into stable shell-facing audio state", [
    ["service", "pipewire-graph-map", "Map the audio cavern", "Objects, nodes, links, and models", "Explain the PipeWire object graph and map its devices, nodes, streams, and defaults into one Quickshell service boundary.", "Observe the native model once, keep stable object identity, and derive concise sink, source, stream, and availability collections for UI consumers.", "Flattening everything into names and volume numbers loses identity when profiles change or nodes disappear and reappear.", "charting a cave system by chambers and tunnels instead of keeping only a list of echoes", ["pipewire", "node", "model"], ["audio", "pipewire", "architecture"]],
    ["domain-view", "audio-default-resolution", "Follow the moving default", "Default sink and source selection", "Resolve default output and input as live references and update every surface when policy or hardware changes them.", "Bind defaults to graph identity, provide an explicit unavailable state, and let device selection call the service rather than mutate view-local indices.", "Caching index zero as the speaker breaks after USB hotplug, profile changes, Bluetooth reconnects, or a PipeWire restart.", "following the station's illuminated platform assignment rather than assuming every train always leaves from platform one", ["defaultDevice", "identity", "hotplug"], ["audio", "defaults", "devices"]],
    ["domain-view", "volume-mute-privacy", "Clamp sound and guard the microphone", "Volume, mute, and capture privacy", "Implement normalized volume and mute actions with safe clamping, microphone privacy status, and clear unavailable feedback.", "Convert native ranges once, clamp action inputs, preserve the distinction between muted and zero, and show capture activity without exposing application secrets.", "An unconstrained slider can request unsafe amplification, while colouring a microphone red without text hides privacy state from keyboard and screen-reader users.", "a mixing desk with physical limit stops and a recording lamp everyone can understand", ["validation", "privacy", "semantics"], ["audio", "volume", "microphone"]],
    ["domain-view", "audio-hotplug-reconnect", "Keep playing through graph churn", "Profiles, devices, and reconnects", "Handle device switching, profile changes, disappearing nodes, access denial, and PipeWire restarts without duplicate observers.", "Track stable objects, cancel actions aimed at vanished nodes, expose reconnecting state, and restore policy only when a compatible target returns.", "Holding a dead node reference can make sliders control nothing or crash bindings while a second reconnection observer races the first.", "a theatre sound crew relabelling channels during a microphone swap without rebuilding the entire console", ["hotplug", "reconnect", "cancellation"], ["audio", "resilience", "devices"], { sideQuest: true }],
    ["domain-view", "shared-mixer-boss", "Make one mixer serve three surfaces", "Sound Caverns boss", "Ship a single audio service consumed by bar, OSD, and control centre with device switching, privacy, hotplug, and failure evidence.", "Route every volume action through one service, coalesce rapid OSD feedback, and confirm all three views agree after default-device changes.", "The boss fails if each surface observes PipeWire independently, stale nodes remain selectable, or a browser animation is presented as live audio proof.", "running one orchestra console whose balcony meter, stage display, and engineer panel always show the same mix", ["service", "osd", "evidence"], ["audio", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("media-orbit", "a transient MPRIS player model with an explicit selection policy", [
    ["service", "mpris-player-lifecycle", "Orbit players that appear and vanish", "MPRIS availability and playback state", "Observe MPRIS players once and expose live identity, capabilities, playback state, and absence without fabricating a permanent player.", "Normalize player objects into a stable model, distinguish paused, playing, stopped, and gone, and let compact UI disappear or degrade by policy.", "Holding the last player forever leaves ghost controls after an app exits and makes stopped sessions look actionable.", "tracking satellites by active transponders rather than painting permanent dots on the sky", ["mpris", "model", "lifetime"], ["media", "mpris", "services"]],
    ["service", "active-player-policy", "Choose the voice in front", "Several players, one compact surface", "Define and test a deterministic active-player policy using playback, recency, pinning, and capability signals.", "Score candidates in the service, preserve a user's explicit pin, use stable tie-breakers, and expose why one player is active to deeper UI.", "Selecting the first model entry makes the bar jump between players as D-Bus ordering changes and can prioritize an idle browser over playing music.", "a radio producer choosing the live microphone by clear studio rules instead of cable order", ["selection", "identity", "mpris"], ["media", "policy", "models"]],
    ["domain-view", "media-transport-position", "Control playback without drift", "Transport, seek, and position", "Implement capability-aware play, pause, next, previous, seek, and position updates without aggressive timers.", "Enable only advertised actions, derive position from a timestamp while playing, resynchronize on player signals, and stop updates when hidden or paused.", "Polling every player many times per second wastes power, while exposing unsupported seek controls creates silent failures.", "a navigator estimating between trusted beacons and recalibrating whenever a new beacon arrives", ["transport", "cadence", "validation"], ["media", "controls", "performance"]],
    ["domain-view", "artwork-metadata-boundary", "Frame hostile media safely", "Titles, artwork, cache, and overflow", "Render untrusted metadata and artwork with truncation, cache limits, failure states, contrast overlays, and privacy policy.", "Treat text as variable external data, reserve artwork geometry, validate supported URLs, cap caches, and derive readable foreground roles from the actual image.", "A huge remote image or control character in a title can exhaust memory, destroy layout, flash stale art, or leak private listening context.", "curating a gallery where every borrowed painting is inspected, framed, labelled, and removed on schedule", ["metadata", "asset", "privacy"], ["media", "artwork", "security"], { sideQuest: true }],
    ["domain-view", "media-depth-boss", "Keep media useful at every depth", "Media Orbit boss", "Build one media experience that is glanceable in the bar, controllable in a popout, rich in a drawer, and stable across player churn.", "Use one active-player service, shared actions, responsive metadata, cached art, capability-aware controls, and explicit empty and disconnected compositions.", "The boss fails if compact and expanded surfaces disagree, artwork drives unreadable contrast, or vanished players retain focusable controls.", "flying one spacecraft whose cockpit, navigation console, and mission room all read the same telemetry", ["progressiveDepth", "service", "evidence"], ["media", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("signal-range", "an asynchronous connectivity state machine with permission-aware actions", [
    ["domain-view", "connectivity-truth-model", "Separate radio from reachability", "Network state that means what it says", "Model device state, link state, local connectivity, internet reachability, and captive or unknown conditions separately.", "Normalize provider signals into a small typed state machine and let labels explain the difference between enabled hardware and a usable route.", "Calling Wi-Fi enabled online misleads users during authentication, captive portals, cable changes, and upstream outages.", "a lighthouse reporting lamp power, beam visibility, and whether ships can actually see the coast as separate facts", ["connectivity", "service", "degraded"], ["network", "state", "truth"]],
    ["domain-view", "wifi-operation-state", "Make Wi-Fi actions observable", "Discovery, connection, and permission", "Present Wi-Fi scans and connection attempts as cancellable asynchronous operations with progress, denial, empty, and failure states.", "Keep stable network identity, debounce scans, validate the selected target, expose operation status, and avoid storing credentials in QML state.", "A connect button that only changes its label can claim success before authorization completes and may leak passwords through logs or persistence.", "a harbour radio that records request, acknowledgement, connection, and refusal instead of declaring docking at the first call", ["permission", "cancellation", "secret"], ["network", "wifi", "security"]],
    ["domain-view", "bluetooth-pairing-journey", "Pair without freezing the panel", "Discovery, trust, and asynchronous devices", "Model Bluetooth discovery, pairing, connection, trust, battery, and disappearance without blocking the interface.", "Represent each operation and device independently, cancel stale attempts, keep controls labelled during churn, and ask the trusted backend to handle secrets.", "Collapsing pairing into one boolean leaves the UI stuck after a timeout and may reconnect to a device that disappeared or changed identity.", "introducing two delegates through a translator who reports invitation, verification, acceptance, and departure", ["identity", "permission", "hotplug"], ["network", "bluetooth", "async"]],
    ["domain-view", "vpn-tray-normalization", "Normalize foreign status", "VPN policy and tray artwork", "Integrate supported VPN state and system-tray items while preserving foreign actions and normalizing visual containers.", "Expose capability and unavailable states for VPN, pass tray actions through their protocol owner, and normalize icon size, alignment, and target without distorting artwork.", "Repainting foreign icons as house glyphs erases app identity, while pretending every environment supports VPN actions creates dead controls.", "hosting visiting flags in equal-sized frames without redrawing the flags or inventing countries", ["foreignContent", "permission", "iconography"], ["network", "vpn", "tray"], { sideQuest: true }],
    ["domain-view", "connectivity-panel-boss", "Navigate the signal storm", "Signal Range boss", "Ship a connectivity panel that handles Wi-Fi, Bluetooth, VPN, tray, permission prompts, concurrent work, and provider absence.", "Share one service per domain, show operation progress beside its owner, preserve keyboard focus through model changes, and record runtime degradation evidence.", "The boss fails if actions optimistically mutate truth, passwords enter ordinary properties, foreign icons distort, or missing backends leave blank panels.", "running a communications bridge through weak signals, equipment swaps, denied channels, and a full relay outage", ["connectivity", "permission", "evidence"], ["network", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("notification-archive", "one privacy-aware protocol pipeline feeding several presentation depths", [
    ["notification", "notification-server-contract", "Own the notification protocol", "Server responsibility and replacement", "Explain notification-server ownership and normalize app identity, replacement ids, timeouts, hints, actions, and close reasons.", "Receive each event once, validate its fields, update replaced records in place, and publish a stable model for all shell surfaces.", "Two notification servers conflict, while appending every replacement creates duplicate toasts and a misleading history.", "operating one central mailroom that stamps updates onto the original parcel record instead of duplicating deliveries", ["notification", "identity", "service"], ["notifications", "protocol", "architecture"]],
    ["notification", "urgency-action-reply", "Respect urgency without stealing agency", "Actions, replies, and timeout policy", "Implement urgency, action buttons, inline reply, timeout, dismissal, and close reasons with keyboard and privacy-safe behaviour.", "Map urgency to presentation lanes and timing, validate action ids, keep focus within an opened reply field, and return it after completion or cancellation.", "Treating critical as permission to steal focus can interrupt authentication or games, while logging reply text exposes private content.", "a triage desk that changes routing and response time by severity without grabbing every visitor by the shoulders", ["urgency", "action", "privacy"], ["notifications", "actions", "accessibility"]],
    ["notification", "history-group-prune", "Curate a useful archive", "Grouping, persistence, and pruning", "Group and retain notification history under explicit age, count, app, dismissal, and privacy rules.", "Use stable ids and timestamps, update replacements, group semantically, prune on bounded policy, and keep ephemeral or sensitive notices out of durable storage.", "An unbounded transcript grows forever and can preserve one-time codes, private messages, and misleading replaced content.", "an archivist who files revisions together, seals private letters, and retires records on a published schedule", ["history", "persistence", "redaction"], ["notifications", "history", "privacy"]],
    ["privacy", "dnd-lock-redaction", "Hide content at the right boundary", "DND, fullscreen, lock, and presentation", "Create one notification presentation policy for do-not-disturb, fullscreen, lock, screen sharing, urgency exceptions, and redaction.", "Derive whether to toast, badge, queue, redact, or suppress from shared context before content reaches a surface or capture.", "Hiding only the toast still leaks text through history, IPC, screenshots, badges, or a lock-screen accessibility name.", "a theatre usher applying one audience policy to doors, announcements, signage, and recordings before the show begins", ["privacy", "redaction", "fullscreen"], ["notifications", "privacy", "policy"], { sideQuest: true }],
    ["notification", "notification-pipeline-boss", "Feed every alert from one river", "Notification Archive boss", "Build one pipeline driving toasts, history, badges, actions, replies, DND, privacy, and IPC without duplicate ownership.", "Trace one replaceable notification through normalization, policy, models, surfaces, action completion, close reason, and pruning with runtime evidence.", "The boss fails if a private payload reaches a locked surface, replacement duplicates history, focus is stolen, or multiple modules register as the server.", "testing a river system from source through locks, reservoirs, town taps, emergency spillways, and cleanup records", ["notification", "privacy", "evidence"], ["notifications", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("compositor-frontier", "a reconnectable compositor model resolved by stable screen and workspace identity", [
    ["domain-view", "workspace-window-model", "Read the compositor's living map", "Workspaces, windows, and urgency", "Expose stable workspace and window identity, titles, classes, active state, and urgency through one compositor service.", "Subscribe once, sanitize external titles, preserve identities across reorder, and publish models suited to compact and overview consumers.", "Rebuilding arrays from display order destroys delegate continuity and can make an urgent marker jump to another workspace.", "maintaining a railway control map keyed by train identity rather than the order trains happen to appear", ["workspace", "identity", "model"], ["compositor", "workspaces", "windows"]],
    ["screen-variants", "focused-context-resolution", "Find the screen that owns intent", "Focus without fixed indices", "Resolve focused screen and workspace from compositor context and safely handle no focus, hotplug, and excluded outputs.", "Map compositor output identity to live ShellScreen objects, fall back by explicit policy, and ask per-screen state registries for the matching surface.", "Using screens[0] opens drawers on the wrong monitor and can dereference a removed output during hotplug.", "routing a call to the staffed desk in the active building rather than always ringing office number one", ["focusedScreen", "hotplug", "registry"], ["compositor", "screens", "focus"]],
    ["visual-policy", "window-mode-policy", "Transform around client modes", "Fullscreen, maximized, floating, and special workspaces", "Derive a coordinated shell policy from compositor window modes without scattering checks across visual components.", "Normalize mode signals in the service, combine them with per-screen context, and drive edge, exclusion, radius, shadow, visibility, and input changes together.", "A bar that hides visually but retains exclusion or a mask still alters fullscreen clients and steals clicks invisibly.", "one stage manager cue that changes curtains, aisle lights, doors, and microphones for each scene mode", ["fullscreen", "workspace", "topology"], ["compositor", "fullscreen", "policy"]],
    ["ipc", "validated-compositor-actions", "Send intent through a guarded gate", "Workspace actions, shortcuts, and reconnect", "Route validated workspace and window actions from UI, keyboard, shortcut, and IPC through one compositor action boundary.", "Allow-list commands, validate stable ids, reject stale targets, report errors, and reconnect shortcut/action integration after compositor restart.", "Interpolating a window title into a command or keeping separate click and shortcut state creates injection paths and divergent behaviour.", "a signal box accepting only known routes and refusing commands for trains no longer on the board", ["action", "allowlist", "reconnect"], ["compositor", "actions", "security"], { sideQuest: true }],
    ["domain-view", "live-status-spine-boss", "Raise the live status spine", "System Atlas capstone", "Ship a compact status spine and drawer that consume the same typed compositor and system services through hotplug, fullscreen, and restart.", "Demonstrate focused-screen routing, stable workspace identity, validated actions, shared observers, reconnect states, and matching bar/drawer truth.", "The capstone fails if fixed screen indices remain, model updates recreate every delegate, or a browser preview is offered as compositor runtime evidence.", "commissioning one city control spine whose street signs and operations room share the same live map during outages", ["service", "focusedScreen", "evidence"], ["compositor", "capstone", "runtime"], { boss: true }],
  ]),

  // Campaign III: Surface Realms — 30 quests.
  ...expandRegion("edge-spine", "a persistent edge anchor whose content earns scarce glanceable space", [
    ["panel-window", "edge-ownership-charter", "Claim one edge clearly", "Persistent anchor and negative space", "Place a useful persistent surface whose geometry, exclusion, content, and styling visibly belong to one screen edge.", "Bind one PanelWindow per screen, keep the anchor compact, use edge-contact corner roles, and let applications retain most of the screen.", "A floating pill near an edge has no mechanical or visual ownership and can collide with popouts, notifications, and fullscreen clients.", "building a harbour quay that is unmistakably part of the shoreline without filling the whole bay", ["ownership", "panel", "negativeSpace"], ["bar", "topology", "composition"]],
    ["qml-layout", "bar-information-choreography", "Compose the glanceable sentence", "Workspace, task, clock, tray, and status", "Arrange workspace, active-task, time, tray, and system signals by priority and semantic grouping.", "Group related signals tightly, separate unrelated clusters, give the active task flexible space, and keep numeric metrics visually stable.", "Equal spacing and equal emphasis make the bar read as unrelated widgets rather than one calm information sentence.", "editing a newspaper masthead so readers grasp place, time, lead story, and alerts in one sweep", ["density", "layout", "typography"], ["bar", "hierarchy", "layout"]],
    ["qml-layout", "bar-overflow-ladder", "Collapse by value", "Responsive priority and overflow", "Define an overflow ladder that preserves essential status and accessible targets across narrow and portrait screens.", "Assign content priorities, shorten labels, merge related status, move secondary detail into owned depth, and hide only after those steps.", "Uniform scaling creates tiny hit targets and unreadable clocks while still wasting space on low-value decoration.", "packing an emergency kit by keeping water and maps before souvenirs, not shrinking every object equally", ["overflow", "responsive", "progressiveDepth"], ["bar", "responsive", "accessibility"]],
    ["visual-policy", "edge-fullscreen-contract", "Yield to fullscreen as one system", "Exclusion, layer, mask, and ornament", "Coordinate the bar and neighbouring surfaces through maximized and fullscreen client transitions.", "Derive exclusion, edge radius, shadow, border, visibility, transparency, and input region from one screen-scoped client-mode policy.", "Only fading the bar leaves an invisible exclusion zone or mask that still disturbs and intercepts the fullscreen application.", "lowering every part of a drawbridge together—deck, gate, lights, and warning arms—rather than painting it invisible", ["fullscreen", "exclusion", "region"], ["bar", "fullscreen", "policy"], { sideQuest: true }],
    ["panel-window", "edge-spine-boss", "Temper the daily edge", "Edge Spine boss", "Ship a per-screen bar that stays calm, legible, responsive, service-backed, keyboard-aware, and correct through fullscreen and hotplug.", "Combine shared services, stable layouts, priority collapse, coherent tokens, one fullscreen policy, and runtime screen-matrix evidence.", "The boss fails if content clips at portrait width, targets shrink, each indicator polls independently, or removed screens retain windows.", "sea-testing a ship's bridge from quiet harbour through storms, equipment loss, and a full crew change", ["responsive", "service", "evidence"], ["bar", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("popout-borough", "contextual depth that remains visibly and behaviourally owned by its trigger", [
    ["qml-contract", "trigger-popout-contract", "Keep context on its hinge", "Origin, ownership, and shared state", "Define a reusable trigger/popout contract whose open state, geometry, action, focus, and visual join have one owner.", "Pass the trigger item, screen, and shared action explicitly; derive opening shape and placement from that origin; keep local content inside the feature module.", "A global popup manager with no trigger reference produces arbitrary floating cards and cannot restore focus reliably.", "mounting every cupboard door on a visible hinge that determines where it opens and where the handle returns", ["ownership", "injection", "restoration"], ["popout", "components", "architecture"]],
    ["qml-layout", "constrained-popout-placement", "Fit context onto the real monitor", "Flip, clamp, and follow boundaries", "Place a popout near its trigger while respecting monitor bounds, scale, orientation, edge contact, and content size.", "Measure natural size, prefer the owned direction, flip only when space requires it, clamp within safe insets, and recompute when geometry changes.", "Hard-coded global coordinates send a popout off-screen on portrait or scaled monitors and disconnect it visually from its trigger.", "opening a market awning toward the street unless a wall forces it to fold the other way", ["placement", "implicitSize", "responsive"], ["popout", "geometry", "screens"]],
    ["focus", "dismissal-focus-protocol", "Close every exit cleanly", "Outside click, Escape, and return", "Unify outside dismissal, Escape, trigger toggle, context change, and focus restoration into one popout close protocol.", "Let one state transition release grabs, finish exit motion, unload dependent content, and return focus to the surviving trigger.", "Independent close handlers drift: Escape may hide content but leave a grab, while outside click may destroy the return target mid-animation.", "using one closing checklist for every exit door so lights, locks, signs, and keys end in the same state", ["dismissal", "focusGrab", "restoration"], ["popout", "focus", "keyboard"]],
    ["accessible-control", "popout-control-grammar", "Speak one control language", "Sliders, toggles, menus, and groups", "Build a family of popout controls sharing target size, type, icon, radius, state-layer, keyboard, and semantic contracts.", "Compose each control from one interaction state layer, semantic tokens, precise value and action inputs, and accessible role/name/value metadata.", "Feature-specific hover colours and custom key handling make controls inconsistent, difficult to discover, and impossible to audit as a system.", "standardizing the handles, labels, and feedback on every machine in a workshop", ["semantics", "iconography", "action"], ["popout", "controls", "accessibility"], { sideQuest: true }],
    ["mask", "popout-family-boss", "Open a coherent neighbourhood", "Popout Borough boss", "Ship several trigger-owned popouts that share placement, motion, input, focus, control, failure, and fullscreen policies.", "Demonstrate attachment at every scale, click-through outside content, complete keyboard paths, focus return, shared action routes, and designed service failures.", "The boss fails if the family is merely same-radius cards, if empty transparent space captures clicks, or if one close path strands focus.", "inspecting a row of shops whose doors, signs, awnings, and accessibility routes follow one street code", ["ownership", "region", "evidence"], ["popout", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("search-wilds", "a cancellable keyboard-first query pipeline with stable result identity", [
    ["service", "desktop-entry-index", "Index applications once", "Desktop entries and launch actions", "Build a shared application index that normalizes desktop entries, actions, icons, visibility, and launch identity.", "Parse through a trusted provider, retain stable ids, respect hidden and duplicate entries, normalize foreign icons, and launch through validated service actions.", "Scanning files on every keystroke freezes search, while constructing commands from display names risks launching the wrong or unsafe target.", "maintaining one card catalogue instead of rereading every book shelf for each query", ["provider", "identity", "action"], ["launcher", "applications", "services"]],
    ["script-model", "fuzzy-ranking-engine", "Rank without list churn", "Relevance, recency, and stable ties", "Implement cancellable fuzzy matching with relevance, recency, explicit weights, stable identity, and deterministic tie-breaking.", "Compute scores outside delegates, preserve model objects, sort through ScriptModel, and explain ranking signals in test fixtures.", "Recreating a JavaScript array per keystroke destroys delegate state and makes keyboard selection jump as equal scores reorder.", "a librarian sorting request cards by match, recent use, and call number while keeping each card intact", ["ranking", "identity", "model"], ["launcher", "search", "models"]],
    ["focus", "launcher-keyboard-route", "Search without leaving the keys", "Navigation and announcements", "Create predictable typing, result navigation, activation, escape, and focus-return behaviour with accessible result-count announcements.", "Keep the query field as entry focus, manage an active result id rather than a row number alone, announce material count changes, and restore the previous window context.", "Reordering results under an index-based cursor activates a different app than the one the user heard or saw selected.", "moving a spotlight by actor name while a narrator announces scene changes, never by the actor's temporary queue position", ["focus", "identity", "announcement"], ["launcher", "keyboard", "accessibility"]],
    ["service", "safe-search-providers", "Fence each provider", "Commands, calculator, clipboard, files, and web", "Design provider contracts with validation, cancellation, permissions, result limits, privacy categories, and explicit launch boundaries.", "Give every provider a typed query/result contract, cancel obsolete requests, escape display only, and pass validated arguments to actions without shell interpolation.", "A universal provider that evaluates query text can execute hostile input or leak clipboard and file history into logs and screenshots.", "giving each expedition team its own permit, route, radio channel, and return deadline", ["provider", "cancellation", "privacy"], ["launcher", "providers", "security"], { sideQuest: true }],
    ["script-model", "keyboard-launcher-boss", "Cross the wilds at typing speed", "Search Wilds boss", "Ship a fast launcher with applications and safe providers that never requires a pointer and remains stable through empty, slow, failed, and changing results.", "Measure query latency, preserve result identity and focus, announce state, cancel old work, validate activation, and record keyboard-only evidence.", "The boss fails if selection jumps, providers execute raw text, hidden private results appear, or loading produces an unannounced blank surface.", "completing an orienteering course by compass alone through fog, detours, closed paths, and changing landmarks", ["ranking", "focus", "evidence"], ["launcher", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("drawer-delta", "one screen-scoped connected surface whose geometry, input, and content share progress", [
    ["qml-layout", "control-centre-rhythm", "Design depth before decoration", "Sections, priority, and information architecture", "Arrange control-centre sections by user task, frequency, dependency, and progressive depth rather than by available widgets.", "Group primary controls near their status, move history and setup deeper, use tonal section rhythm, and design loading, empty, denied, and failure compositions.", "A grid of equal cards gives rare and frequent actions the same weight and becomes noisy as services disappear.", "planning a workshop floor so daily tools sit at hand, specialist benches group by task, and storage remains deeper", ["progressiveDepth", "density", "degraded"], ["drawer", "information-architecture", "design"]],
    ["mask", "orchestration-window-frame", "Unify the edge machinery", "Screen-spanning window and input region", "Create one per-screen orchestration window for cooperating bar, drawer, OSD, and utility geometry with precise click-through.", "Render shared backgrounds in one transparent window, register the screen state, and derive the Region union from currently visible interactive items.", "Several windows that fake a union show seams, disagree about z-order, and create overlapping focus or input masks.", "casting one continuous theatre backdrop with cut-outs for doors instead of aligning several moving painted walls", ["topology", "region", "continuity"], ["drawer", "windows", "input"]],
    ["animation", "connected-background-deformation", "Move the surface, steady the content", "Shared progress and legible morphs", "Drive connected background joins, panel transforms, radius changes, and content staging from one normalized open progress value.", "Use ordinary shapes first, compute joins from shared progress, transform the surface more than the text, and keep animation interruptible from its rendered state.", "Independent progress values tear seams and moving text with the deforming background makes content difficult to track.", "opening one folding map whose paper changes shape while its labels remain readable", ["continuity", "gesture", "reversal"], ["drawer", "motion", "geometry"]],
    ["mask", "drawer-gesture-arbitration", "Let every gesture have an inverse", "Thresholds, scroll conflicts, and neighbours", "Implement directional drag progress, cancellation, release thresholds, reverse-close, scroll conflict, and neighbouring-panel arbitration.", "Record the owning edge and start point, update normalized progress immediately, require direction plus distance, and centralize claims across adjacent panels.", "Distance-only recognition steals vertical scrolling, while a gesture with no reverse path leaves users hunting for a separate close control.", "routing river traffic through locks that sense direction, share gates, and always permit a safe return journey", ["gesture", "arbitration", "cancellation"], ["drawer", "gestures", "input"], { sideQuest: true }],
    ["mask", "connected-drawer-boss", "Sail the connected delta", "Drawer Delta boss", "Ship a connected control centre with real services, direct manipulation, keyboard parity, precise input, reversible motion, and fullscreen adaptation.", "Demonstrate shared progress, seamless joins, click-through, focus paths, scroll arbitration, service failures, reduced motion, and rapid reversal on Linux/Wayland.", "The boss fails if separate windows tear, invisible space blocks apps, gesture and keyboard routes diverge, or simulation is labelled runtime proof.", "piloting one river vessel through joined channels, reverse locks, narrow passages, and a sudden flood drill", ["continuity", "region", "evidence"], ["drawer", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("alert-peaks", "a coordinated attention system that communicates quickly without unnecessary focus", [
    ["notification", "toast-lane-coordinator", "Reserve an alert flight path", "Placement and surface collisions", "Coordinate toast placement with bar, OSD, drawer, fullscreen, monitor edges, and safe insets.", "Give each screen an alert lane, stack with stable identity, avoid occupied edge geometry, and transform or defer by fullscreen and DND policy.", "Independent top-right placement lets toasts overlap status, popouts, screencast controls, or each other across mixed-scale screens.", "air-traffic control assigning every arriving notice a runway that cannot cross active ground routes", ["toast", "placement", "fullscreen"], ["alerts", "notifications", "screens"]],
    ["notification", "notification-centre-depth", "Turn interruption into history", "Grouping, actions, and privacy", "Build a notification centre that groups history, exposes actions, distinguishes unread state, and applies privacy before rendering.", "Consume the shared pipeline, preserve replacement identity, group by user meaning, keep action focus stable, and prune under explicit policy.", "Copying toast objects into local history duplicates state and can retain sensitive text after the source was redacted or dismissed.", "moving urgent notes from the doorway into one indexed, access-controlled archive", ["history", "identity", "privacy"], ["alerts", "history", "actions"]],
    ["domain-view", "osd-coalescing-queue", "Compress rapid feedback", "Volume, brightness, and repeated input", "Design an OSD queue that coalesces repeated changes, interrupts obsolete content, and preserves readable progress feedback.", "Key events by domain, update the live item's value in place, restart its dwell policy, and stage domain replacement without queuing animation tails.", "Spawning one OSD per volume key press floods the screen and leaves a long queue reporting values that are already obsolete.", "a scoreboard updating one number in place rather than hanging a new sign for every point", ["osd", "coalescing", "interruption"], ["alerts", "osd", "motion"]],
    ["animation", "alert-content-replacement", "Change the message without a flicker", "Urgency, media, and staged replacement", "Stage icon, artwork, text, urgency, and progress replacement while keeping geometry, contrast, and announcement coherent.", "Animate old content out, swap values once, animate new content in, and let urgency change tone and timing rather than arbitrarily scaling everything.", "Changing text and artwork mid-fade produces mixed old/new frames and can cause screen readers to announce transient nonsense repeatedly.", "changing a station departure board by clearing one row, swapping the destination, then revealing the new service", ["interruption", "urgency", "announcement"], ["alerts", "motion", "accessibility"], { sideQuest: true }],
    ["notification", "attention-system-boss", "Signal without seizing control", "Alert Peaks boss", "Ship coordinated toasts, notification history, OSDs, and media overlays with collision, coalescing, privacy, accessibility, and focus policy.", "Trace events through one attention policy, validate lane placement, rapid replacement, DND/fullscreen behaviour, redaction, announcements, and non-stealing focus.", "The boss fails if alerts overlap, rapid keys queue stale OSDs, urgent notices steal focus, or lock/presentation modes leak content.", "running a mountain rescue signal network whose beacons remain distinct, timely, private, and non-blinding", ["toast", "osd", "privacy"], ["alerts", "capstone", "runtime"], { boss: true }],
  ]),
  ...expandRegion("overview-session-gate", "a focus-aware transition into deep or consequential shell surfaces", [
    ["script-model", "workspace-overview-model", "See work without losing identity", "Workspace and window overview", "Render stable workspace and window models with previews, urgent state, drag targets, and compositor actions.", "Keep compositor ids stable, derive filtered visual models without recreation, and normalize preview lifetime and privacy before animation.", "Index-keyed windows jump during moves, while uncapped live previews consume GPU and can expose private work in screenshots.", "laying out a live harbour chart where each vessel keeps its call sign while changing berth", ["workspace", "identity", "privacy"], ["overview", "windows", "models"]],
    ["focus", "task-switch-focus-return", "Return to the chosen task", "Search, navigation, and activation", "Make overview search and task switching keyboard-first with predictable focus entry, movement, cancellation, activation, and return.", "Track the selected window by stable id, announce filtered counts, activate through one compositor action, and close only after focus transfer is confirmed.", "Closing optimistically can leave focus on the desktop if the target vanished or activation was denied.", "a stage manager keeping the spotlight on an actor's name until the actor reaches the marked position", ["focus", "identity", "action"], ["overview", "keyboard", "compositor"]],
    ["security", "session-confirmation-flow", "Make consequence unmistakable", "Lock, logout, suspend, and shutdown", "Build session controls with clear consequence, confirmation, cancellation, countdown policy, and shared action routing.", "Separate harmless opening state from destructive confirmation, validate the chosen action, allow keyboard cancellation, and clear confirmation on reload or context loss.", "Persisting a pending shutdown or binding a button directly to a raw command can execute stale intent after reload or accidental activation.", "a ship captain repeating an irreversible order, receiving confirmation, and keeping an obvious abort signal until execution", ["session", "action", "validation"], ["session", "controls", "safety"]],
    ["security", "auth-boundary-lab", "Decorate around the lock, never through it", "PAM, polkit, and ephemeral authentication", "Integrate lock and authorization surfaces without implementing, bypassing, logging, or persisting credential verification in ordinary QML state.", "Delegate verification to supported trusted facilities, keep authentication text ephemeral, handle failure/cancel/retry, redact captures, and restore a safe focus state.", "Mock authentication that accepts a local string teaches a dangerous false model and can leak secrets through logs, reload state, or screenshots.", "building a beautiful bank lobby while leaving the vault mechanism to audited security engineers", ["authentication", "secret", "pam"], ["session", "security", "privacy"], { sideQuest: true }],
    ["security", "daily-shell-gate-boss", "Open the complete daily shell", "Surface Realms capstone", "Integrate bar, popouts, launcher, drawer, alerts, overview, and safe session surfaces into one coherent daily-driver shell.", "Verify shared services and actions, surface hierarchy, focus restoration, input masks, fullscreen, hotplug, privacy, authentication boundaries, and degraded states.", "The capstone fails if product surfaces feel unrelated, duplicate observers, block input invisibly, leak private content, or weaken system security for visual convenience.", "opening a city for daily life only after transport, utilities, emergency routes, public spaces, and secure gates pass inspection together", ["architecture", "privacy", "evidence"], ["surfaces", "capstone", "runtime"], { boss: true }],
  ]),

  // Campaign IV: Expression Expanse — 25 quests.
  ...expandRegion("canon-observatory", "a whole-screen design decision measured against the End-4/Caelestia canon", [
    ["visual-policy", "whole-screen-composition", "Compose beyond the widget crop", "Edges, wallpaper, windows, and negative space", "Map wallpaper, application space, persistent edges, transient depth, focus, and modal layers as one screen composition.", "Start with closed, compact, expanded, fullscreen, and lock maps; assign every surface an origin and protect deliberate negative space.", "Designing isolated cards in cropped screenshots hides collisions, unclear ownership, wasted space, and hierarchy that collapses at full-screen scale.", "planning a public square by streets, buildings, sightlines, and open air rather than decorating benches one at a time", ["negativeSpace", "ownership", "topology"], ["canon", "composition", "design"]],
    ["theme", "canon-common-ground", "Extract the shared truths", "Reactivity, depth, services, and motion", "Identify the principles End-4 and Caelestia share and translate them into independent product requirements.", "Trace live services into state, bindings, connected or layered surfaces, progressive depth, semantic motion, screen scope, and stable actions.", "Copying a screenshot reproduces identity without the architecture and interaction truths that make the source shell coherent.", "learning a chef's balance of acid, texture, and timing rather than tracing the plate decoration", ["canon", "service", "progressiveDepth"], ["canon", "architecture", "reactivity"]],
    ["visual-policy", "distinct-canon-lenses", "Compare expressive utility and continuity", "End-4 and Caelestia as distinct lessons", "Compare End-4-led layered expressive utility with Caelestia-led connected edge minimalism and choose a dominant lens for a new shell.", "Evaluate topology, density, microinteraction, screen-edge continuity, negative space, and implementation cost before declaring a deliberate synthesis.", "Selecting favourite details from both without hierarchy creates mismatched shapes, duplicate motion vocabularies, and no recognizable idea.", "choosing one architectural style for a house, then borrowing compatible furniture instead of combining two floor plans", ["canon", "density", "continuity"], ["canon", "comparison", "identity"]],
    ["visual-policy", "card-soup-critique-boss", "Diagnose the generic rice", "Before-and-after critique incident", "Critique and repair a shell dominated by floating rounded cards, universal blur, ownerless popouts, and decorative motion.", "Mark each rejection gate, redraw surface origins and depth, choose one topology, reduce decoration, and explain how every retained flourish improves use.", "A colour refresh cannot fix structural card soup; the composition remains generic if topology, hierarchy, and state behaviour stay unchanged.", "renovating a cluttered plaza by restoring streets and public zones before repainting every kiosk", ["cardSoup", "topology", "canon"], ["canon", "critique", "boss"], { boss: true }],
  ]),
  ...expandRegion("topology-foundry", "a dominant spatial grammar that makes every surface origin and depth legible", [
    ["visual-policy", "dominant-topology-choice", "Choose the geometry that leads", "Layered sheets or connected edge", "Select layered Material-like sheets or a connected edge surface as the dominant topology and document the subordinate influence.", "Compare product density, gesture goals, window mechanics, joins, focus, masks, and implementation budget, then write one signature spatial idea.", "Calling the design hybrid without naming a leader becomes permission for every module to invent a different shape system.", "choosing the river as a city's main transport spine before adding a few compatible rail links", ["topology", "canon", "architecture"], ["design", "topology", "identity"]],
    ["visual-policy", "surface-depth-map", "Chart every layer of depth", "Persistent, contextual, deep, modal, and lock", "Assign every planned shell surface to a distinct depth with origin, focus, material, input, and dismissal policy.", "Map persistent anchors, trigger popouts, drawers, modal/session layers, and lock as different topologies rather than differently sized cards.", "If every layer shares the same tone, radius, and elevation, consequence and focus are unreadable before content is examined.", "drawing nautical depth bands so a sailor can distinguish shore, channel, deep water, and restricted harbour at a glance", ["depth", "progressiveDepth", "focus"], ["design", "hierarchy", "surfaces"]],
    ["mask", "join-corner-ownership", "Forge seams that never tear", "Edges, joins, corners, and masks", "Define which surface owns every edge and corner, then implement joins that remain clean through opening, reversal, scale, and fullscreen.", "Derive adjoining radii and transforms from shared state, render cooperating backgrounds together, and keep the input Region synchronized with the visible union.", "Independent rounded windows expose double borders and gaps mid-animation and may accept input where the supposed union is transparent.", "forging one articulated metal hinge whose plates, pin, and safety guard move as a single mechanism", ["continuity", "region", "reversal"], ["design", "geometry", "input"]],
    ["qml-contract", "owned-popout-foundry-boss", "Attach every contextual surface", "Topology Foundry boss", "Refactor arbitrary floating panels into trigger-owned popouts and edge-owned drawers under one dominant geometry grammar.", "Inject origin and screen contracts, align joins, share motion and state layers, define dismissal, and review closed/open/fullscreen silhouettes.", "The boss fails if a surface could be moved anywhere without changing meaning or if visual attachment disagrees with focus and input ownership.", "rebuilding loose balconies so each is structurally joined to the room and building that owns it", ["ownership", "injection", "topology"], ["design", "popout", "boss"], { boss: true }],
  ]),
  ...expandRegion("colour-biome", "semantic colour policy derived from content while preserving contrast and privacy", [
    ["theme", "semantic-palette-ecosystem", "Grow roles, not swatches", "Light, dark, surface, on-colour, and accents", "Define complete light and dark semantic palettes for background, surface tiers, on-colours, accents, outline, scrim, success, and error.", "Generate or author role relationships, bind components only to roles, and reserve accents for focus, selection, progress, status, and primary action.", "One dark surface plus random alpha and accent literals cannot express depth or adapt safely to a new wallpaper.", "cultivating an ecosystem where each plant has a role instead of scattering attractive seeds at random", ["semanticColor", "palette", "depth"], ["design", "colour", "tokens"]],
    ["theme", "tonal-depth-ladder", "Build depth before blur", "Surface tiers, outline, shadow, and scrim", "Create a tonal depth ladder that distinguishes persistent, contextual, deep, and modal surfaces before adding conditional effects.", "Use background and surface-container roles first, add outline only where boundaries need it, and reserve scrim and shadow for focus changes.", "Universal blur and borders turn every element into the same floating card and become illegible over detailed wallpaper.", "carving landscape terraces by elevation before adding mist, fences, or stage lighting", ["depth", "semanticColor", "transparency"], ["design", "depth", "materials"]],
    ["visual-policy", "hostile-wallpaper-defense", "Defend contrast against any image", "Luminance, vibrancy, and safe modes", "Adapt palette and transparency to muted, bright, detailed, and highly vibrant wallpapers without sacrificing text, icons, focus, or disabled states.", "Measure representative backgrounds, increase material opacity or switch safe roles when needed, and validate all foreground states rather than average colour alone.", "A beautiful translucent bar on one wallpaper can make error text, focus rings, and tray icons vanish on another.", "tuning a greenhouse shade system for cloud, midday glare, patterned shadows, and night rather than one sunny photograph", ["contrast", "transparency", "semanticColor"], ["design", "wallpaper", "accessibility"], { sideQuest: true }],
    ["visual-policy", "colour-transition-boss", "Change themes without a flash", "Wallpaper updates and privacy-safe transparency", "Transition semantic colour roles across wallpaper and light/dark changes while enforcing opaque lock, authentication, privacy, and low-power materials.", "Compute the new palette off-screen, switch roles coherently, animate short colour effects only, and let safety contexts override decorative transparency.", "Updating roles one by one creates a flash of mismatched foreground/background colours and can briefly reveal private imagery behind authentication.", "changing theatre lighting from day to night on one synchronized cue while emergency exits remain continuously visible", ["palette", "interruption", "privacy"], ["design", "colour", "boss"], { boss: true }],
  ]),
  ...expandRegion("type-icon-quarter", "a coherent legibility system that survives variable content and display scale", [
    ["theme", "type-role-score", "Give every voice a part", "Headline, body, label, numeric, and monospace", "Define explicit type roles with size, weight, width, optical use, line height, and context rather than one font scaled randomly.", "Assign headline, title, body, label, numeric, reading, monospace, and icon roles only where they earn their space; keep the persistent edge compact.", "Making every important label bold removes hierarchy and causes dense surfaces to shout at the same volume.", "writing an orchestral score where melody, rhythm, bass, and solo parts have distinct ranges and purposes", ["typography", "density", "metric"], ["design", "type", "hierarchy"]],
    ["qml-content", "text-resilience-proof", "Make text survive translation", "Metrics, elision, scripts, and fractional scale", "Validate stable numbers, truncation, wrapping, localization, mixed scripts, right-to-left flow, and baselines at fractional scaling.", "Use font metrics and implicit size, stabilize frequently changing numbers, set overflow policy, mirror directional layouts, and inspect real localized strings.", "Hard-coded widths and Latin-only screenshots hide clipped Arabic, dancing resource numbers, broken baselines, and fuzzy half-pixel placement.", "tailoring a uniform with adjustable seams and script-aware nameplates rather than one fixed paper pattern", ["typography", "localization", "metric"], ["design", "text", "responsive"]],
    ["theme", "icon-family-grammar", "Choose one icon dialect", "Weight, fill, grade, and state", "Select one primary icon family and define systematic outline, fill, weight, grade, size, optical alignment, and label rules.", "Use state-dependent variants consistently, pair labels where discovery or consequence requires them, and reserve icon-only use for learned conventions.", "Mixing emoji, Nerd Font glyphs, Material icons, and app art gives identical actions different optical weight and semantics.", "publishing one road-sign standard so shape, stroke, colour, and labels carry predictable meaning", ["iconography", "semantics", "canon"], ["design", "icons", "consistency"]],
    ["qml-content", "foreign-artwork-frame-boss", "Welcome foreign art without distortion", "Apps, tray icons, avatars, and media", "Normalize application icons, tray art, album covers, and avatars inside the shell while preserving identity, aspect, loading, and contrast.", "Give foreign content consistent containers, optical bounds, cache and crop policy, fallbacks, and legible overlays without recolouring or stretching the source.", "Forcing every asset into a monochrome house icon erases identity, while raw uncropped art breaks alignment and can dominate the visual grammar.", "curating an international poster wall with consistent frames and lighting while leaving each poster intact", ["foreignContent", "asset", "iconography"], ["design", "assets", "boss"], { boss: true }],
  ]),
  ...expandRegion("motion-river", "semantic motion that preserves spatial cause, reversibility, and accessible feedback", [
    ["motion-tokens", "semantic-motion-vocabulary", "Name motion by purpose", "Immediate, effect, exit, enter, and spatial", "Define duration and easing roles for immediate feedback, fast effects, exits, entrances, ordinary spatial moves, and large topology changes.", "Scale all roles through one policy, use quicker acceleration for exits and expressive deceleration for arrival, and overshoot only suitable spatial motion.", "One global duration makes hover feel sluggish, overview movement abrupt, and dismissal slower than arrival.", "setting walking, cycling, train, and emergency speeds by journey purpose instead of one citywide speed", ["motionRole", "animation", "reducedMotion"], ["design", "motion", "tokens"]],
    ["animation", "spatial-causality-lab", "Move from the place that caused it", "Origins, asymmetric timing, and legibility", "Animate popouts from triggers, drawers from edges, and overviews into deliberate depth while content remains trackable.", "Move geometry along the causal path, let arrivals reveal hierarchy, dismiss more quickly toward the origin, and deform surfaces more than text.", "Fading everything at the centre gives no clue what opened, where it belongs, or how to reverse the action.", "watching a paper map unfold from its cover and fold back to the same crease", ["ownership", "motionRole", "continuity"], ["design", "motion", "causality"]],
    ["interaction", "state-layer-ripple-system", "Let every action answer", "Hover, press, focus, selection, and replacement", "Create one reusable state layer for hover, press/ripple origin, keyboard focus, disabled, selected, and optional shape morph.", "Derive overlay and geometry from interaction state, keep actions separate, use coherent tokens, and stage changing labels or icons when abrupt swaps flicker.", "Custom feedback in every module yields invisible keyboard focus, inconsistent disabled state, and ripples that ignore the actual pointer origin.", "installing one responsive material in every control so touch, pressure, focus, and selection leave consistent traces", ["handler", "focus", "semantics"], ["design", "interaction", "components"]],
    ["animation", "motion-policy-boss", "Reverse the river", "Interruption, reduction, and low power", "Prove major transitions through rapid reversal, interruption, reduced motion, hidden state, and low-power policy without jumps or wasted work.", "Animate from rendered values, cancel obsolete phases, shorten distance and settle layout under reduction, and suspend ambient work when surfaces hide.", "Queued animations overshoot stale targets, zero feedback hides causality, and invisible visualizers keep consuming GPU and battery.", "controlling a lock system whose water can reverse immediately, slow for safety, and stop machinery when the channel closes", ["reversal", "interruption", "performance"], ["design", "motion", "boss"], { boss: true }],
  ]),
  ...expandRegion("responsive-mirrorlands", "a representative state system reviewed across geometry, theme, input, and failure", [
    ["visual-policy", "form-factor-compositions", "Design more than one silhouette", "Compact, normal, portrait, and ultrawide", "Author distinct compositions for compact, normal, narrow, portrait, ultrawide, and mixed-scale screens.", "Reprioritize regions, change orientation where useful, preserve target and type roles, and let negative space grow instead of stretching every module.", "Uniform scaling wastes ultrawide space and turns portrait bars into clipped horizontal strips.", "tailoring related outfits for hiking, formal work, rain, and heat rather than resizing one costume", ["responsive", "density", "negativeSpace"], ["design", "screens", "responsive"]],
    ["visual-policy", "per-monitor-token-overlays", "Tune without forking the shell", "Sparse hardware-aware overrides", "Layer per-monitor configuration and token overrides over global typed defaults without duplicating modules.", "Resolve scale, orientation, safe insets, bar edge, density, motion, and transparency by stable screen identity and sparse policy.", "Forked screen-specific QML drifts visually and functionally, while index-keyed overrides move to the wrong monitor after hotplug.", "fitting one instrument design with adjustable bridges for different musicians instead of building unrelated instruments", ["override", "focusedScreen", "configuration"], ["design", "screens", "config"]],
    ["visual-policy", "representative-state-matrix", "Make every policy visible", "Theme, fullscreen, safety, and failures", "Design light, dark, fullscreen, transparency-disabled, reduced-motion, loading, empty, stale, denied, and failed variants.", "Drive variants from semantic policy, retain recognizable hierarchy, and ensure unavailable states still explain cause and next action.", "A blank error card or accidental light mode reveals that the visual system was designed only for the hero screenshot.", "rehearsing a play with every understudy, lighting cue, stage size, and emergency procedure", ["degraded", "fullscreen", "reducedMotion"], ["design", "states", "resilience"]],
    ["validation", "screenshot-critique-lab", "Inspect what code cannot describe", "Focus, contrast, truncation, and density", "Capture and critique representative screenshots at target scales, wallpapers, states, and input modes using the seven-part visual rubric.", "Score composition, coherence, hierarchy, continuity, legibility, responsiveness, and distinctiveness; record exact fixes rather than aesthetic impressions.", "A static architecture audit cannot detect generic card soup, unreadable contrast, awkward cropping, or seams that tear midway through motion.", "conducting dress rehearsal from every seat and recording blocked sightlines instead of reviewing blueprints alone", ["stateGallery", "contrast", "evidence"], ["design", "review", "validation"], { sideQuest: true }],
    ["validation", "original-state-gallery-boss", "Earn the Expression crest", "Expression Expanse capstone", "Present an original visual system and representative state gallery that scores at least 21/28 with no rejection gate.", "Document direction, topology, signature, complete grammar, responsive variants, interaction/failure states, evidence matrix, score, fixes, and independent identity.", "The capstone fails on card soup, ownerless popouts, universal blur, one radius/tone/type, decorative motion, or accidental policy states regardless of average score.", "opening an original world pavilion only after structure, wayfinding, accessibility, weather response, and identity pass public review", ["stateGallery", "canon", "evidence"], ["design", "capstone", "boss"], { boss: true }],
  ]),

  // Campaign V: Production Citadel — 25 quests.
  ...expandRegion("architecture-keep", "an explicit one-way dependency with a stable owner and testable contract", [
    ["shell-root", "thin-root-refactor", "Empty the throne room", "Composition and lifecycle only", "Refactor shell.qml until it contains only imports, lifecycle glue, top-level module composition, and intentionally global action endpoints.", "Move feature windows into modules, reusable primitives into components, system observers into services, intent into state, and policy into config.", "A giant root couples every reload and edit, hides ownership, and lets unrelated feature failures take down the whole shell.", "turning a crowded royal hall into a directory that sends each craft to its own accountable guild", ["architecture", "service", "configuration"], ["architecture", "refactor", "shell-root"]],
    ["qml-contract", "dependency-boundary-wall", "Make dependencies flow downhill", "Modules, components, services, state, config", "Enforce shell → modules → components and service/state/config boundaries with no visual delegate performing system discovery.", "Draw imports and runtime references, remove upward dependencies, keep feature-internal pieces local, and promote a primitive only after two features share its contract.", "Circular imports and service calls from delegates create invisible coupling, duplicate work, and reload-sensitive behaviour.", "engineering an aqueduct whose water follows a known direction instead of pipes secretly pumping into one another", ["architecture", "dependency", "observer"], ["architecture", "modules", "boundaries"]],
    ["qml-contract", "injection-registry-pattern", "Pass what a component truly needs", "Required properties, singletons, and screen registry", "Use required-property injection for local dependencies and a stable per-screen registry only for justified cross-cutting actions.", "Inject narrow service/state/action contracts, reserve singletons for true domain owners, and key registered components by ShellScreen plus stable role.", "Making every component a singleton or searching object trees by name creates ambient authority and breaks when screens reload or reorder.", "issuing scoped keys to named rooms while a reception ledger tracks only shared emergency contacts", ["injection", "registry", "focusedScreen"], ["architecture", "dependency-injection", "screens"]],
    ["qml-contract", "coupling-demolition-boss", "Demolish the hidden passageways", "Architecture Keep boss", "Split a giant feature graph, remove duplicate observers and hidden globals, and prove one-way dependencies and stable per-screen identity.", "Produce an architecture map, explicit contracts, ownership notes, reload counts, and focused-screen action tests before and after refactoring.", "The boss fails if moving a visual component changes system observation, screen identity relies on indices, or root composition still owns feature internals.", "renovating a fortress by exposing secret tunnels, assigning every room, and load-testing the new walls", ["architecture", "registry", "evidence"], ["architecture", "capstone", "refactor"], { boss: true }],
  ]),
  ...expandRegion("performance-mines", "a measured cost on the critical path or a deliberately suspended optional path", [
    ["validation", "first-useful-frame-budget", "Measure the first useful surface", "Cold start and critical path", "Measure cold start to the first useful bar frame and attribute time to imports, services, object creation, assets, and optional modules.", "Capture a repeatable baseline on target hardware, mark essential work, move optional tasks off the path, and compare distributions rather than one lucky run.", "Optimizing animation duration does nothing for a startup blocked by synchronous config, image analysis, or eager drawer construction.", "timing a mine elevator from button press to first safe platform and logging every delay underground", ["performance", "metric", "evidence"], ["performance", "startup", "profiling"]],
    ["loader", "deferred-stable-work", "Load depth after the edge", "LazyLoader, preloading, and stable models", "Defer optional surfaces, preload during idle only when measured, and preserve delegate identity through changing filtered models.", "Load bar, theme, state, and essential observers first; use LazyLoader without forcing item; use ScriptModel or native models for dynamic lists.", "Eager overview creation delays the bar, while raw filtered arrays recreate delegates and discard animation, focus, and cached content.", "opening the mine entrance immediately while equipment descends on scheduled lifts without shuffling labelled ore carts", ["lazyLoading", "identity", "model"], ["performance", "loading", "models"]],
    ["process", "hidden-work-suspension", "Power down invisible machinery", "Timers, visualizers, images, CPU, GPU, memory", "Suspend hidden visualizers, high-frequency timers, screencopy, image work, and unused probes; verify CPU, GPU, and memory across repeated transitions.", "Bind expensive lifetime to visibility and policy, simplify or cache images before motion, and profile open/close and reload loops on the slowest target.", "Opacity zero does not stop timers or rendering work, and uncapped caches turn everyday album art into long-term memory growth.", "shutting conveyors, lamps, and crushers when a mine gallery closes instead of merely drawing a curtain", ["performance", "disposal", "sampling"], ["performance", "power", "memory"], { sideQuest: true }],
    ["validation", "plugin-threshold-boss", "Prove native code earns its depth", "Profiling and the narrow C++ threshold", "Decide from profiles whether QML, built-in models, caching, or a narrow optional C++ QML plugin is the right optimization.", "Isolate the hotspot, benchmark simpler QML changes first, define a typed testable plugin boundary, and keep product orchestration outside native code.", "Adding C++ for ordinary controls increases build, ABI, packaging, and security complexity without evidence that it solves the bottleneck.", "opening a deeper mine shaft only after surveys prove surface extraction cannot reach the measured vein", ["profiling", "performance", "validation"], ["performance", "plugin", "boss"], { boss: true }],
  ]),
  ...expandRegion("resilience-range", "a bounded failure state that cannot duplicate owners or break unrelated modules", [
    ["validation", "reload-syntax-firebreak", "Keep the shell alive through a bad edit", "Hot reload and syntax recovery", "Test soft reload, deliberate syntax errors, correction, and safe state continuity without duplicating services, shortcuts, servers, or IPC.", "Record owner counts and logs, preserve only harmless UI context, recover to the last usable shell when possible, and clear unsafe confirmation or focus state.", "A visually recovered bar can hide doubled notification delivery, timers, or global shortcuts after several reload cycles.", "running a fire drill that counts every returning worker and prevents duplicate crews from entering", ["reload", "persistence", "containment"], ["resilience", "reload", "diagnostics"]],
    ["screen-variants", "hotplug-open-surface-drill", "Remove a screen mid-gesture", "Hotplug, focus, and state cleanup", "Handle monitor addition and removal while drawers, popouts, gestures, and focus grabs are active.", "Tie instances to live ShellScreen identity, cancel screen-owned gestures, release focus and masks, relocate only by explicit policy, and discard unsafe state.", "Index-keyed state migrates to the wrong output, while a removed orchestration window can leave focus or input captured.", "evacuating one train platform while rerouting passengers and signals without renumbering every station", ["hotplug", "focusedScreen", "cancellation"], ["resilience", "screens", "input"]],
    ["service", "provider-restart-containment", "Reconnect one domain at a time", "Compositor, service, and device restart", "Recover from compositor, PipeWire, network, notification, and device restarts without freezing or rebuilding unrelated surfaces.", "Each service exposes reconnecting and failed state, cancels stale work, rebinds once, preserves safe policy, and contains errors inside its domain.", "A global restart timer or shared failure boolean turns one missing provider into a whole-shell outage and can create reconnect storms.", "restoring power district by district so one substation fault never blacks out the entire city", ["reconnect", "service", "containment"], ["resilience", "services", "restart"]],
    ["process", "degraded-data-gauntlet-boss", "Weather every broken message", "Malformed, delayed, denied, and failed data", "Prove loading, empty, malformed, delayed, denied, stale, failed, cancellation, timeout, and bounded-backoff paths across representative services.", "Inject controlled fixtures, validate before state mutation, keep last trustworthy values with stale labels, cap retries, and demonstrate unrelated modules remain useful.", "The boss fails if malformed input enters bindings, retries thrash, a blank card replaces explanation, or one service exception collapses the shell.", "fortifying a frontier relay against garbled telegrams, late couriers, locked gates, broken lines, and repeated storms", ["malformed", "backoff", "containment"], ["resilience", "capstone", "failures"], { boss: true }],
  ]),
  ...expandRegion("security-bastion", "a least-authority boundary with validated input and deliberately ephemeral private state", [
    ["security", "argument-array-gate", "Never hand text to a shell blindly", "Process arrays, validation, and interpolation", "Replace shell command strings with executable/argument arrays, validate every external value, and justify any unavoidable sh -c boundary.", "Allow-list actions and formats, pass each argument separately, reject unexpected values before Process, and keep untrusted text out of shell syntax.", "Interpolated titles, SSIDs, paths, or queries can change command meaning and execute unintended operations.", "admitting travellers through individual passport checks instead of letting a handwritten crowd note open the gate", ["allowlist", "process", "validation"], ["security", "process", "injection"]],
    ["privacy", "secret-exposure-audit", "Remove secrets from every reflection", "Files, logs, screenshots, and IPC", "Audit QML properties, config, persistence, logs, screenshots, crash reports, IPC, and exported archives for secret-bearing data.", "Classify sensitive fields, minimize lifetime, redact before presentation or capture, restrict file permissions, and test that diagnostics never echo values.", "A password omitted from the UI may still survive in console logging, hot-reload properties, progress exports, or IPC inspection.", "searching a hall of mirrors and covering every angle where a private document could reflect", ["secret", "redaction", "ipc"], ["security", "privacy", "audit"]],
    ["privacy", "presentation-privacy-shield", "Protect public contexts", "Notifications, clipboard, previews, and capture", "Apply lock, presentation, screen-sharing, and screenshot privacy policy consistently to notifications, clipboard, search, previews, and media.", "Resolve one shared context before models reach views, redact accessible names too, clear cached previews where required, and provide understandable hidden states.", "Hiding only painted text still leaks content through screen-reader labels, search indices, cached artwork, or a remote IPC call.", "closing every window, vent, camera, and intercom when a secure meeting begins", ["privacy", "redaction", "foreignContent"], ["security", "presentation", "privacy"], { sideQuest: true }],
    ["security", "auth-threat-scenario-boss", "Defend the consequential gate", "PAM, polkit, lock, and cancellation", "Threat-model and test authentication, authorization, lock, suspend, logout, shutdown, failure, retry, timeout, and cancellation paths.", "Keep trusted facilities authoritative, make credential state ephemeral, validate session actions, prevent screenshot/log leaks, and fail closed without trapping users.", "The boss fails if mock credentials grant access, reload restores authorization, cancellation proceeds anyway, or visual success precedes trusted completion.", "guarding a citadel whose drawbridge, sentries, vault, alarms, and evacuation route all fail safely together", ["threat", "authentication", "session"], ["security", "capstone", "auth"], { boss: true }],
  ]),
  ...expandRegion("validation-arena", "reproducible evidence tied to an exact platform, state, input route, and expected result", [
    ["validation", "static-language-audit", "Clear the warnings before launch", "Audit, qmlls, imports, and structure", "Run structural audit, strict audit where appropriate, qmlls, formatting, type/import checks, and investigate every binding-loop or unqualified-access warning.", "Record commands and versions, separate framework limitations from defects, validate artifact assembly, and keep regex checks only as narrow hints.", "A regex match can be satisfied by a comment or malformed object and cannot prove types, imports, or runtime behaviour.", "inspecting arena equipment by blueprint, material certificate, and assembly test before combat begins", ["staticCheck", "qmlls", "validation"], ["validation", "static", "tooling"]],
    ["validation", "visual-state-evidence", "Photograph every meaningful state", "Light, dark, loading, failure, and motion", "Capture compact, interaction, opening, open, closing, loading, empty, stale, denied, error, theme, scale, and policy states.", "Use fixed scenarios and dimensions, include mid-transition joins, score the visual rubric, annotate failures, and rerun after fixes.", "One hero screenshot cannot reveal invisible focus, hostile contrast, accidental portrait composition, or seams during reversal.", "recording every round and camera angle instead of judging an athlete from one victory portrait", ["stateGallery", "contrast", "evidence"], ["validation", "visual", "screenshots"]],
    ["validation", "input-screen-service-matrix", "Cross every axis deliberately", "Keyboard, pointer, screens, IPC, and degradation", "Test pointer, keyboard, touch where targeted, focus, click-through, shortcuts, IPC, screen scale/hotplug, fullscreen, restart, and service failures.", "Build a bounded pairwise matrix, prioritize dangerous interactions, record expected and actual outcomes, and include rapid reversals and removed-screen cleanup.", "Testing each feature alone misses collisions such as a drawer drag during hotplug or a fullscreen transition while an IPC action opens a popout.", "running tournament brackets that deliberately pair every fighting style with difficult terrain and equipment faults", ["matrix", "hotplug", "ipc"], ["validation", "integration", "runtime"]],
    ["validation", "quality-evidence-boss", "Win with proof, not confidence", "Performance, accessibility, privacy, and limitations", "Assemble validated evidence for startup, transitions, idle use, memory, keyboard, screen reader, contrast, motion, privacy, security, and untested paths.", "Tie each claim to a command, capture, platform version, expected threshold, result, and limitation; redact artifacts before sharing.", "The boss fails if browser simulation is called runtime proof, secret-bearing logs are included, or accessibility and slow-hardware paths are omitted.", "earning an arena title through witnessed trials, calibrated instruments, medical checks, and an honest record of bouts not fought", ["evidence", "performance", "privacy"], ["validation", "capstone", "evidence"], { boss: true }],
  ]),
  ...expandRegion("release-harbor", "a maintainable release contract with reversible change and complete user-facing evidence", [
    ["release", "tested-stack-manifest", "Pin the vessel's working parts", "Quickshell, Qt, compositor, and distro", "Record the exact tested Quickshell, Qt, compositor, distribution, packaging, native services, and API source-review date.", "Use version gates for supported differences, describe the verified matrix, and re-review pre-1.0 APIs before each release.", "Saying latest hides incompatible Qt rebuilds and changing Quickshell properties that can break a previously working config.", "engraving every engine, chart revision, harbour rule, and inspection date into a ship's manifest", ["versioning", "quickshell", "evidence"], ["release", "versions", "compatibility"]],
    ["release", "config-migration-dock", "Move user policy without loss", "Schema upgrades and rollback", "Version typed configuration and progress state, migrate older schemas atomically, validate results, and preserve a rollback path.", "Read the old version, transform through explicit steps, validate against new defaults, write atomically, and retain a safe backup until successful launch.", "Editing config in place can strand users with partial writes, removed keys, or a new shell that cannot understand its own state.", "transferring cargo between ships with manifests, sealed containers, inspection, and a return berth", ["migration", "versioning", "atomicWrite"], ["release", "migration", "config"]],
    ["release", "install-update-uninstall-route", "Chart the whole install lifecycle", "No-admin paths, autostart, update, and removal", "Document and test installation, user-local no-admin setup, compositor autostart, safe update, rollback, uninstallation, and distro packaging boundaries.", "Use explicit paths and permissions, avoid overwriting user files, make every mutation reversible, and distinguish portable user installs from system packages.", "A one-line installer that copies into broad directories can destroy customization and leave orphaned services or credentials on removal.", "publishing harbour routes for arrival, refit, emergency return, and clean departure—not only the launch ceremony", ["versioning", "migration", "security"], ["release", "installation", "packaging"]],
    ["release", "documentation-license-ledger", "Leave a navigable wake", "README, troubleshooting, and attribution", "Write setup, architecture, dependencies, keybindings, configuration, screenshots, troubleshooting, validation, known limitations, changelog, and attribution documents.", "Make commands copyable and safe, label runtime requirements, link actions to files and evidence, inventory adapted material, and preserve compatible licenses.", "A polished shell without version, failure, and license documentation cannot be reproduced, repaired, or distributed responsibly.", "leaving charts, maintenance logs, radio procedures, cargo ownership, and hazard notices for the next crew", ["attribution", "evidence", "versioning"], ["release", "documentation", "licensing"], { sideQuest: true }],
    ["release", "shellwright-v1-boss", "Launch Shellwright v1.0", "Production Citadel capstone", "Ship a versioned original Quickshell shell with integrated project files, tested migrations, packaging, evidence matrix, documentation, attribution, and known limitations.", "Run static and Linux/Wayland matrices on the pinned stack, verify every input/action route and degraded state, review performance/security/accessibility, then sign the release record.", "Graduation fails if generated files do not assemble, simulation substitutes for runtime, private data enters evidence, upgrades are irreversible, or copied work lacks attribution.", "launching a vessel only after sea trials, safety inspection, crew manuals, cargo records, rescue drills, and an honest list of waters not tested", ["release", "evidence", "attribution"], ["release", "capstone", "graduation"], { boss: true }],
  ]),
];

const regionById = new Map(atlasCampaigns.flatMap(campaign => campaign.regions).map(value => [value.id, value]));
const existingCampaignOneByRegion: Record<string, number> = {
  "first-sparks": 4,
  "shape-district": 4,
  "motion-arcade": 4,
  "system-frontier": 4,
  "living-shell": 4,
  "hero-forge": 6,
};

const rotatedAnswer = (
  correct: string,
  distractors: [string, string, string],
  position: number,
): { options: [string, string, string, string]; answer: 0 | 1 | 2 | 3 } => {
  const answer = (position % 4) as 0 | 1 | 2 | 3;
  const options = [...distractors] as string[];
  options.splice(answer, 0, correct);
  return { options: options as [string, string, string, string], answer };
};

const quizBank = (blueprint: Blueprint, recipe: Recipe, questIndex: number): AtlasQuestSeed["quizzes"] => {
  const definitions: Array<{
    format: QuizFormat;
    question: string;
    correct: string;
    distractors: [string, string, string];
    explanation: string;
    difficulty: 1 | 2 | 3;
  }> = [
    {
      format: "mental-model",
      question: `Which mental model should guide “${blueprint.title}”?`,
      correct: blueprint.focus,
      distractors: ["Copy the screenshot first and decide ownership later.", "Store every visible result as independent mutable state.", "Let each delegate discover and poll the system for itself."],
      explanation: `The governing model is specific to this quest: ${blueprint.focus}`,
      difficulty: 1,
    },
    {
      format: "code-detective",
      question: `Which structural clue in the solution best demonstrates “${blueprint.title}”?`,
      correct: recipe.structure,
      distractors: ["a larger radius applied to every rectangle", "a browser animation with no state owner", "an untyped global value copied into several delegates"],
      explanation: `The starter-to-solution repair is designed around ${recipe.structure}.`,
      difficulty: 2,
    },
    {
      format: "design-transfer",
      question: `When transferring “${blueprint.title}” to another shell surface, which rule must survive?`,
      correct: blueprint.rules[1],
      distractors: ["Preserve the exact pixel dimensions from the exercise.", "Replace semantic roles with whichever colour looks exciting.", "Add a second observer so the new surface stays independent."],
      explanation: `Transfer means preserving the decision, not copying the picture: ${blueprint.rules[1]}`,
      difficulty: 2,
    },
    {
      format: "debug",
      question: `What failure is this quest specifically teaching you to detect?`,
      correct: blueprint.failure,
      distractors: ["The file uses consistent indentation.", "The surface has fewer decorative animations.", "The component reports a natural size to its parent."],
      explanation: `The repair task must reproduce and then remove this failure: ${blueprint.failure}`,
      difficulty: 2,
    },
    {
      format: "accessibility",
      question: `What is the strongest accessibility requirement for “${blueprint.title}”?`,
      correct: recipe.a11y,
      distractors: ["Hide the focus ring so the composition stays clean.", "Use colour alone because icons add visual weight.", "Require a pointer for advanced actions."],
      explanation: recipe.a11y,
      difficulty: 2,
    },
    {
      format: "security",
      question: `Which security or privacy boundary applies to “${blueprint.title}”?`,
      correct: recipe.security,
      distractors: ["Persist transient authorization so reload feels seamless.", "Return diagnostic state and private content through one broad IPC method.", "Use sh -c because a single command string is easier to read."],
      explanation: recipe.security,
      difficulty: 3,
    },
  ];

  return definitions.map((definition, questionIndex) => {
    const placed = rotatedAnswer(definition.correct, definition.distractors, questIndex + questionIndex);
    return {
      id: `${blueprint.id}-${definition.format}`,
      format: definition.format,
      question: definition.question,
      options: placed.options,
      answer: placed.answer,
      explanation: definition.explanation,
      conceptTags: blueprint.tags,
      difficulty: definition.difficulty,
    };
  }) as AtlasQuestSeed["quizzes"];
};

const regionCounters = new Map<string, number>();

export const atlasQuestSeeds: AtlasQuestSeed[] = rawSeeds.map((blueprint, questIndex) => {
  const atlasRegion = regionById.get(blueprint.regionId);
  if (!atlasRegion) throw new Error(`Unknown atlas region: ${blueprint.regionId}`);
  const localIndex = (regionCounters.get(blueprint.regionId) ?? 0) + 1;
  regionCounters.set(blueprint.regionId, localIndex);
  const recipe = RECIPES[blueprint.recipe];
  const executionTier = blueprint.executionTier ?? recipe.tier;
  const boss = blueprint.boss ?? false;
  const sideQuest = blueprint.sideQuest ?? false;
  const order = localIndex + (atlasRegion.campaign === 1 ? existingCampaignOneByRegion[blueprint.regionId] : 0);
  const previous = rawSeeds[questIndex - 1];
  const prerequisiteIds = blueprint.prerequisiteIds ?? (previous ? [previous.id] : []);
  const verificationBoundary = executionTier === "browser-simulation"
    ? "Browser simulation gives conceptual visual feedback only; it is not evidence that QML or Quickshell ran."
    : executionTier === "static-qml-check"
      ? "Static checks may establish syntax, imports, types, and structure; they do not prove live window, service, input, or compositor behaviour."
      : "Completion requires Linux/Wayland evidence from the pinned Quickshell, Qt, and compositor stack; browser feedback remains illustrative only.";

  return {
    id: blueprint.id,
    campaign: atlasRegion.campaign,
    regionId: blueprint.regionId,
    order,
    title: blueprint.title,
    subtitle: blueprint.subtitle,
    objective: blueprint.objective,
    story: `The route through ${atlasRegion.name} now reaches ${blueprint.title}. The artifact produced here becomes part of the same persistent shell rather than an isolated demo.`,
    explanation: [
      `${blueprint.focus} In a dynamic shell, the visible result is only trustworthy when its ownership and source of truth are equally clear. The objective is to make that relationship explainable before adding polish.`,
      `${blueprint.mechanism} Trace the path from input or system event through service and state to the rendered property, then use the same action path for pointer, keyboard, shortcut, or IPC wherever those routes apply.`,
      `${blueprint.failure} The exercise therefore asks for a deliberate failure reproduction, a structural repair, and evidence at the stated execution tier. A browser visualization may help reasoning, but it never stands in for live Quickshell runtime verification.`,
    ],
    analogy: `Think of it as ${blueprint.analogy}. The comparison matters because it identifies ownership, flow, and the failure the implementation must prevent.`,
    rules: blueprint.rules,
    terms: termSet(blueprint.termKeys),
    starter: recipe.starter(blueprint.title),
    solution: recipe.solution(blueprint.title),
    checks: recipe.checks.map(check => ({ ...check })) as AtlasQuestSeed["checks"],
    quizzes: quizBank(blueprint, recipe, questIndex),
    scene: recipe.scene,
    xp: boss ? 320 : sideQuest ? 145 : 190 + atlasRegion.campaign * 10,
    minutes: boss ? 70 : sideQuest ? 28 : 38 + atlasRegion.campaign * 2,
    boss,
    sideQuest,
    conceptTags: blueprint.tags,
    prerequisiteIds,
    executionTier,
    verificationBoundary,
    supportedQuickshell: "Verify against the installed pre-1.0 Quickshell release; canonical examples were reviewed against the v0.3.0-era documentation and must be rechecked when APIs change.",
    sourceReviewedAt: "2026-08-06",
  };
});

export const atlasQuestTargets = {
  existing: 26,
  new: 134,
  total: 160,
  byCampaign: { 1: 50, 2: 30, 3: 30, 4: 25, 5: 25 } as Record<CampaignNumber, number>,
} as const;

export type AtlasIntegrityReport = {
  valid: boolean;
  errors: string[];
  newQuestCount: number;
  combinedQuestCount: number;
  newByCampaign: Record<CampaignNumber, number>;
  combinedByCampaign: Record<CampaignNumber, number>;
  regionCount: number;
  quizCount: number;
};

export const validateAtlas = (): AtlasIntegrityReport => {
  const errors: string[] = [];
  const ids = new Set<string>();
  const titles = new Set<string>();
  const objectives = new Set<string>();
  const newByCampaign: Record<CampaignNumber, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const requiredFormats: QuizFormat[] = ["mental-model", "code-detective", "design-transfer", "debug", "accessibility", "security"];

  for (const quest of atlasQuestSeeds) {
    if (ids.has(quest.id)) errors.push(`Duplicate quest id: ${quest.id}`);
    if (titles.has(quest.title)) errors.push(`Duplicate quest title: ${quest.title}`);
    if (objectives.has(quest.objective)) errors.push(`Duplicate quest objective: ${quest.objective}`);
    ids.add(quest.id); titles.add(quest.title); objectives.add(quest.objective);
    newByCampaign[quest.campaign] += 1;
    if (quest.explanation.length !== 3 || quest.explanation.some(paragraph => paragraph.length < 180)) errors.push(`Thin explanation: ${quest.id}`);
    if (quest.rules.length !== 3 || quest.terms.length !== 3 || quest.checks.length !== 3) errors.push(`Incomplete learning contract: ${quest.id}`);
    if (quest.checks.some(check => typeof check.pattern !== "string" || check.pattern.length < 4)) errors.push(`Invalid structural check: ${quest.id}`);
    const formats = new Set(quest.quizzes.map(quiz => quiz.format));
    if (quest.quizzes.length < 6 || requiredFormats.some(format => !formats.has(format))) errors.push(`Incomplete quiz bank: ${quest.id}`);
    if (!quest.starter.includes("import ") || !quest.solution.includes("import ")) errors.push(`Missing QML import: ${quest.id}`);
  }

  const expectedNew: Record<CampaignNumber, number> = { 1: 24, 2: 30, 3: 30, 4: 25, 5: 25 };
  for (const campaign of [1, 2, 3, 4, 5] as CampaignNumber[]) {
    if (newByCampaign[campaign] !== expectedNew[campaign]) errors.push(`Campaign ${campaign} has ${newByCampaign[campaign]} new quests; expected ${expectedNew[campaign]}.`);
  }
  const regions = atlasCampaigns.flatMap(campaign => campaign.regions);
  if (regions.length !== 30) errors.push(`Atlas has ${regions.length} regions; expected 30.`);
  if (atlasQuestSeeds.length !== 134) errors.push(`Atlas has ${atlasQuestSeeds.length} new quests; expected 134.`);

  const combinedByCampaign: Record<CampaignNumber, number> = { ...newByCampaign, 1: newByCampaign[1] + 26 };
  return {
    valid: errors.length === 0,
    errors,
    newQuestCount: atlasQuestSeeds.length,
    combinedQuestCount: atlasQuestSeeds.length + 26,
    newByCampaign,
    combinedByCampaign,
    regionCount: regions.length,
    quizCount: atlasQuestSeeds.reduce((sum, quest) => sum + quest.quizzes.length, 0),
  };
};

export const atlasIntegrity = validateAtlas();

if (!atlasIntegrity.valid) {
  throw new Error(`Invalid Shellcraft atlas:\n${atlasIntegrity.errors.join("\n")}`);
}
