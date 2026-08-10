/**
 * Browser-safe project forge for the Shellcraft course.
 *
 * The forge is deliberately pure: it does not touch the filesystem, fetch data,
 * or depend on Node APIs. Every mutation returns a fresh Record<string, string>,
 * which can be downloaded, stored in IndexedDB/localStorage, or packed as a tar.
 *
 * Generated QML targets the documented Quickshell 0.3 API. Integrations that are
 * not portable across compositors expose explicit unavailable/degraded states.
 */

export type ForgeFiles = Record<string, string>;

export type ForgeAvailability = "loading" | "ready" | "empty" | "unavailable" | "failed";

export type ForgeArtifactCode =
  | "RT"
  | "BX"
  | "CP"
  | "SL"
  | "MX"
  | "MD"
  | "TH"
  | "PW"
  | "VS"
  | "SV"
  | "CG"
  | "IP"
  | "SW";

export type ForgeCheckpointId = "foundation" | "interaction" | "system" | "surfaces" | "ship";

export interface ForgeArtifact {
  readonly code: ForgeArtifactCode;
  readonly name: string;
  readonly description: string;
  readonly questId: string;
  readonly checkpointId: ForgeCheckpointId;
  readonly primaryFile: string;
  readonly files: readonly string[];
}

export interface ForgeCheckpoint {
  readonly id: ForgeCheckpointId;
  readonly name: string;
  readonly description: string;
  readonly artifactCodes: readonly ForgeArtifactCode[];
  readonly proof: readonly string[];
}

export interface ForgeProjectOptions {
  /** Human-readable title used in generated documentation. */
  readonly projectName?: string;
  /** Quickshell ShellId. Unsafe characters are converted to dashes. */
  readonly shellId?: string;
  readonly author?: string;
  /** The generated compositor adapter is honest and Hyprland-specific. */
  readonly compositor?: "hyprland";
  /** When true, createForgeProject may replace complete artifact files with questSources. */
  readonly applyLearnerSources?: boolean;
}

export interface ForgeManifest {
  readonly schemaVersion: 1;
  readonly generator: "qml-shellcraft-forge";
  readonly projectName: string;
  readonly shellId: string;
  readonly author: string;
  readonly target: {
    readonly quickshell: "0.3.x";
    readonly qt: "6.x";
    readonly platform: "Linux/Wayland";
    readonly compositorAdapter: "Hyprland";
  };
  readonly completedQuestIds: readonly string[];
  readonly appliedArtifactCodes: readonly ForgeArtifactCode[];
  readonly reachedCheckpointIds: readonly ForgeCheckpointId[];
}

export const FORGE_ARTIFACTS: readonly ForgeArtifact[] = [
  {
    code: "RT",
    name: "Root Tree",
    description: "A thin lifecycle root that composes real shell modules.",
    questId: "qml-is-a-description",
    checkpointId: "foundation",
    primaryFile: "shell.qml",
    files: ["shell.qml", "qmldir"],
  },
  {
    code: "BX",
    name: "Binding Core",
    description: "Screen-scoped intent whose derived progress remains reactive.",
    questId: "reactive-bindings",
    checkpointId: "foundation",
    primaryFile: "state/ShellState.qml",
    files: ["state/ShellState.qml", "state/qmldir"],
  },
  {
    code: "CP",
    name: "Component Contract",
    description: "A reusable status primitive with typed required inputs.",
    questId: "component-contracts",
    checkpointId: "interaction",
    primaryFile: "components/StatusPill.qml",
    files: ["components/StatusPill.qml", "components/SurfaceButton.qml"],
  },
  {
    code: "SL",
    name: "State Layer",
    description: "One hover, press, focus, selected, and disabled grammar.",
    questId: "interaction-state",
    checkpointId: "interaction",
    primaryFile: "components/StateLayer.qml",
    files: ["components/StateLayer.qml", "components/SurfaceButton.qml"],
  },
  {
    code: "MX",
    name: "Motion Roles",
    description: "Semantic, reduced-motion-aware timing used across surfaces.",
    questId: "behaviors-motion",
    checkpointId: "interaction",
    primaryFile: "config/Motion.qml",
    files: ["config/Motion.qml"],
  },
  {
    code: "MD",
    name: "Stable Model",
    description: "A ScriptModel-backed launcher that preserves delegate identity.",
    questId: "models-delegates",
    checkpointId: "interaction",
    primaryFile: "models/LauncherModel.qml",
    files: ["models/LauncherModel.qml", "models/qmldir"],
  },
  {
    code: "TH",
    name: "Theme Kernel",
    description: "One semantic palette, type scale, spacing ladder, and radius ladder.",
    questId: "theme-tokens",
    checkpointId: "system",
    primaryFile: "config/Theme.qml",
    files: ["config/Theme.qml", "config/Settings.qml", "settings.json"],
  },
  {
    code: "PW",
    name: "Screen Edge",
    description: "A useful PanelWindow with intentional edge ownership and exclusion.",
    questId: "panelwindow-edges",
    checkpointId: "system",
    primaryFile: "modules/bar/Bar.qml",
    files: ["modules/bar/Bar.qml"],
  },
  {
    code: "VS",
    name: "Screen Factory",
    description: "Live per-screen windows and state that survive monitor changes.",
    questId: "variants-screens",
    checkpointId: "system",
    primaryFile: "modules/bar/Bar.qml",
    files: ["modules/bar/Bar.qml", "state/ShellState.qml"],
  },
  {
    code: "SV",
    name: "Service Spine",
    description: "One typed observer per system domain with honest failure states.",
    questId: "service-boundaries",
    checkpointId: "system",
    primaryFile: "services/Audio.qml",
    files: [
      "services/Time.qml",
      "services/Audio.qml",
      "services/Media.qml",
      "services/Power.qml",
      "services/Network.qml",
      "services/Notifications.qml",
      "services/Compositor.qml",
    ],
  },
  {
    code: "CG",
    name: "Connected Surface",
    description: "Bar-adjacent drawer geometry driven by one reversible progress value.",
    questId: "connected-geometry",
    checkpointId: "surfaces",
    primaryFile: "modules/drawer/Drawer.qml",
    files: ["modules/drawer/Drawer.qml", "modules/popout/Popouts.qml"],
  },
  {
    code: "IP",
    name: "Shell API",
    description: "Pointer, keyboard, and IPC routes converge on the same action layer.",
    questId: "ipc-shortcuts",
    checkpointId: "surfaces",
    primaryFile: "state/Actions.qml",
    files: ["state/Actions.qml", "modules/ipc/Ipc.qml"],
  },
  {
    code: "SW",
    name: "Shellwright Crest",
    description: "A concrete validation and attribution evidence contract.",
    questId: "validation-capstone",
    checkpointId: "ship",
    primaryFile: "VALIDATION.md",
    files: ["VALIDATION.md", "README.md", "LICENSES/ATTRIBUTION.md"],
  },
] as const;

export const FORGE_CHECKPOINTS: readonly ForgeCheckpoint[] = [
  {
    id: "foundation",
    name: "Reactive Foundation",
    description: "The project has a legible object tree and screen-scoped source of UI intent.",
    artifactCodes: ["RT", "BX"],
    proof: ["shell.qml remains composition-only", "Derived geometry follows state bindings"],
  },
  {
    id: "interaction",
    name: "Interaction Grammar",
    description: "Reusable controls, semantic motion, and stable dynamic models share one contract.",
    artifactCodes: ["CP", "SL", "MX", "MD"],
    proof: ["Keyboard and pointer activation match", "Rapid reversal does not jump"],
  },
  {
    id: "system",
    name: "Live System Spine",
    description: "Every screen consumes the same typed services and visual policy.",
    artifactCodes: ["TH", "PW", "VS", "SV"],
    proof: ["No delegate discovers the OS", "Unavailable services remain visibly stable"],
  },
  {
    id: "surfaces",
    name: "Living Surface",
    description: "Persistent, contextual, deep, alert, and modal levels operate as one shell.",
    artifactCodes: ["CG", "IP"],
    proof: ["All actions share one state transition", "Empty orchestration space is click-through"],
  },
  {
    id: "ship",
    name: "Evidence Pack",
    description: "Runtime claims are separated from static checks and supported by recorded evidence.",
    artifactCodes: ["SW"],
    proof: ["Validation matrix is completed on Linux/Wayland", "License boundaries are documented"],
  },
] as const;

const MANIFEST_PATH = ".shellcraft/project.json";
const CHECKPOINT_PATH = ".shellcraft/CHECKPOINT.md";
const ARTIFACT_MARKER = "// Shellcraft artifacts: ";

function cleanText(value: string | undefined, fallback: string): string {
  const cleaned = [...(value ?? "")]
    .map((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127 ? " " : character;
    })
    .join("")
    .trim();
  return cleaned || fallback;
}

function slug(value: string | undefined): string {
  const cleaned = cleanText(value, "shellcraft-forge")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "shellcraft-forge";
}

function qmlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

function replaceTokens(source: string, tokens: Readonly<Record<string, string>>): string {
  return Object.entries(tokens)
    .sort(([left], [right]) => right.length - left.length)
    .reduce(
      (result, [token, value]) => result.split(token).join(value),
      source,
    );
}

function normalizeSource(source: string): string {
  return source.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").trimEnd() + "\n";
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function isForgeArtifactCode(value: unknown): value is ForgeArtifactCode {
  return typeof value === "string" && FORGE_ARTIFACTS.some((artifact) => artifact.code === value);
}

function isForgeCheckpointId(value: unknown): value is ForgeCheckpointId {
  return typeof value === "string" && FORGE_CHECKPOINTS.some((checkpoint) => checkpoint.id === value);
}

function checkpointIdsFor(codes: readonly ForgeArtifactCode[]): ForgeCheckpointId[] {
  const codeSet = new Set(codes);
  return FORGE_CHECKPOINTS
    .filter((checkpoint) => checkpoint.artifactCodes.every((code) => codeSet.has(code)))
    .map((checkpoint) => checkpoint.id);
}

function defaultManifest(options: ForgeProjectOptions = {}): ForgeManifest {
  const projectName = cleanText(options.projectName, "My Shellcraft Shell");
  return {
    schemaVersion: 1,
    generator: "qml-shellcraft-forge",
    projectName,
    shellId: slug(options.shellId ?? projectName),
    author: cleanText(options.author, "Shellcraft learner"),
    target: {
      quickshell: "0.3.x",
      qt: "6.x",
      platform: "Linux/Wayland",
      compositorAdapter: "Hyprland",
    },
    completedQuestIds: [],
    appliedArtifactCodes: [],
    reachedCheckpointIds: [],
  };
}

function readManifest(files: Readonly<ForgeFiles>, options: ForgeProjectOptions = {}): ForgeManifest {
  const fallback = defaultManifest(options);
  const source = files[MANIFEST_PATH];
  if (!source) return fallback;

  try {
    const parsed = JSON.parse(source) as Partial<ForgeManifest>;
    const codes = unique((parsed.appliedArtifactCodes ?? []).filter(isForgeArtifactCode));
    const quests = unique(
      (parsed.completedQuestIds ?? []).filter((value): value is string => typeof value === "string"),
    );
    const reached = unique((parsed.reachedCheckpointIds ?? []).filter(isForgeCheckpointId));
    return {
      ...fallback,
      projectName: cleanText(parsed.projectName, fallback.projectName),
      shellId: slug(parsed.shellId ?? fallback.shellId),
      author: cleanText(parsed.author, fallback.author),
      completedQuestIds: quests,
      appliedArtifactCodes: codes,
      reachedCheckpointIds: reached,
    };
  } catch {
    return fallback;
  }
}

function renderManifest(manifest: ForgeManifest): string {
  return JSON.stringify(manifest, null, 2) + "\n";
}

function renderCheckpoint(manifest: ForgeManifest): string {
  const reached = new Set(manifest.reachedCheckpointIds);
  const applied = new Set(manifest.appliedArtifactCodes);
  const lines = [
    `# ${manifest.projectName} — Forge checkpoint`,
    "",
    "This file is generated from `.shellcraft/project.json`. It records learning progress; it is not runtime validation evidence.",
    "",
    ...FORGE_CHECKPOINTS.flatMap((checkpoint) => [
      `## ${reached.has(checkpoint.id) ? "[x]" : "[ ]"} ${checkpoint.name}`,
      "",
      checkpoint.description,
      "",
      ...checkpoint.artifactCodes.map((code) => {
        const artifact = FORGE_ARTIFACTS.find((candidate) => candidate.code === code);
        return `- ${applied.has(code) ? "[x]" : "[ ]"} ${code} — ${artifact?.name ?? code}`;
      }),
      "",
      ...checkpoint.proof.map((proof) => `- Runtime proof still required: ${proof}`),
      "",
    ]),
  ];
  return lines.join("\n").trimEnd() + "\n";
}

function markArtifact(source: string, codes: readonly ForgeArtifactCode[]): string {
  const withoutMarker = source
    .split("\n")
    .filter((line) => !line.startsWith(ARTIFACT_MARKER))
    .join("\n");
  if (codes.length === 0) return normalizeSource(withoutMarker);

  const lines = withoutMarker.split("\n");
  const pragmaEnd = lines.findIndex((line) => !line.startsWith("//@ pragma"));
  const index = pragmaEnd === -1 ? lines.length : pragmaEnd;
  lines.splice(index, 0, `${ARTIFACT_MARKER}${codes.join(", ")}`);
  return normalizeSource(lines.join("\n"));
}

function renderQmldir(moduleName: string, entries: readonly string[]): string {
  return normalizeSource([`module ${moduleName}`, ...entries].join("\n"));
}

function productionTemplates(options: ForgeProjectOptions = {}): ForgeFiles {
  const manifest = defaultManifest(options);
  const tokens = {
    "__PROJECT_NAME__": manifest.projectName,
    "__PROJECT_NAME_QML__": qmlString(manifest.projectName),
    "__SHELL_ID__": manifest.shellId,
    "__AUTHOR__": manifest.author,
  } as const;

  const files: ForgeFiles = {
    "shell.qml": String.raw`//@ pragma ShellId __SHELL_ID__
//@ pragma Env QS_NO_RELOAD_POPUP=1

import Quickshell
import qs.config
import qs.modules.bar
import qs.modules.drawer
import qs.modules.ipc
import qs.modules.launcher
import qs.modules.notifications
import qs.modules.osd
import qs.modules.popout

ShellRoot {
    settings.watchFiles: Settings.watchFiles

    Bar {}
    Popouts {}
    Drawer {}
    Launcher {}
    NotificationToasts {}
    Osd {}
    Ipc {}
}
`,
    "qmldir": renderQmldir("qs", []),
    ".qmlls.ini": "",
    ".gitignore": String.raw`.qmlls.ini
.cache/
result
`,
    "settings.json": String.raw`{
  "animationScale": 1,
  "barHeight": 48,
  "drawerWidth": 440,
  "reducedMotion": false,
  "safeTransparency": false,
  "showSeconds": false,
  "watchFiles": true
}
`,
    "config/qmldir": renderQmldir("qs.config", [
      "singleton Theme 1.0 Theme.qml",
      "singleton Motion 1.0 Motion.qml",
      "singleton Settings 1.0 Settings.qml",
    ]),
    "config/Settings.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Io

Singleton {
    id: root

    readonly property real animationScale: values.animationScale
    readonly property int barHeight: values.barHeight
    readonly property int drawerWidth: values.drawerWidth
    readonly property bool reducedMotion: values.reducedMotion
    readonly property bool safeTransparency: values.safeTransparency
    readonly property bool showSeconds: values.showSeconds
    readonly property bool watchFiles: values.watchFiles

    FileView {
        id: file

        path: Quickshell.shellPath("settings.json")
        blockLoading: true
        watchChanges: true
        atomicWrites: true
        onFileChanged: reloadDebounce.restart()

        JsonAdapter {
            id: values

            property real animationScale: 1.0
            property int barHeight: 48
            property int drawerWidth: 440
            property bool reducedMotion: false
            property bool safeTransparency: false
            property bool showSeconds: false
            property bool watchFiles: true
        }
    }

    Timer {
        id: reloadDebounce

        interval: 150
        onTriggered: file.reload()
    }
}
`,
    "config/Theme.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell

Singleton {
    // Direction: intentional hybrid; Caelestia-led connected edge topology with
    // End-4-led utility density. Replace this seed with wallpaper-derived roles.
    readonly property color background: "#111018"
    readonly property color surface: "#1b1923"
    readonly property color surfaceContainer: "#24212d"
    readonly property color surfaceContainerHigh: "#302c39"
    readonly property color surfaceContainerHighest: "#3b3646"
    readonly property color onSurface: "#f2ecf7"
    readonly property color onSurfaceVariant: "#cbc3d1"
    readonly property color primary: "#cfbdff"
    readonly property color onPrimary: "#37245e"
    readonly property color primaryContainer: "#4e3b76"
    readonly property color onPrimaryContainer: "#eadfff"
    readonly property color secondary: "#b9c8ff"
    readonly property color success: "#9bd7b1"
    readonly property color warning: "#efc46f"
    readonly property color error: "#ffb4ab"
    readonly property color outline: "#958d9c"
    readonly property color outlineVariant: "#4b4552"
    readonly property color scrim: "#000000"

    readonly property real compactSurfaceOpacity: Settings.safeTransparency ? 1.0 : 0.94
    readonly property real deepSurfaceOpacity: Settings.safeTransparency ? 1.0 : 0.98

    readonly property string headlineFamily: "sans-serif"
    readonly property string bodyFamily: "sans-serif"
    readonly property string numericFamily: "monospace"
    readonly property string iconFamily: "system theme icons"
    readonly property int labelSmall: 11
    readonly property int labelMedium: 13
    readonly property int bodyMedium: 15
    readonly property int titleMedium: 18
    readonly property int headlineSmall: 24

    readonly property int space1: 4
    readonly property int space2: 8
    readonly property int space3: 12
    readonly property int space4: 16
    readonly property int space5: 24
    readonly property int space6: 32
    readonly property int space7: 48

    readonly property int radiusMicro: 4
    readonly property int radiusSmall: 8
    readonly property int radiusMedium: 14
    readonly property int radiusLarge: 22
    readonly property int radiusExtraLarge: 30
    readonly property int radiusFull: 999

    function stateColour(kind: string): color {
        switch (kind) {
        case "error": return error;
        case "warning": return warning;
        case "success": return success;
        case "accent": return primary;
        default: return onSurfaceVariant;
        }
    }
}
`,
    "config/Motion.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell

Singleton {
    readonly property int immediate: scaled(120)
    readonly property int fastEffect: scaled(190)
    readonly property int exit: scaled(210)
    readonly property int enter: scaled(360)
    readonly property int spatial: scaled(440)
    readonly property int largeSpatial: scaled(600)

    readonly property int standardEasing: Easing.OutCubic
    readonly property int enterEasing: Easing.OutExpo
    readonly property int exitEasing: Easing.InCubic

    function scaled(milliseconds: int): int {
        if (Settings.reducedMotion)
            return Math.min(90, milliseconds);
        return Math.max(0, Math.round(milliseconds * Math.max(0, Settings.animationScale)));
    }
}
`,
    "state/qmldir": renderQmldir("qs.state", [
      "singleton ShellState 1.0 ShellState.qml",
      "singleton Actions 1.0 Actions.qml",
    ]),
    "state/ShellState.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import qs.config

Singleton {
    id: root

    function forScreen(screen: ShellScreen): var {
        return states.instances.find(state => state.modelData === screen) ?? null;
    }

    function closeTransient(screen: ShellScreen): void {
        const state = forScreen(screen);
        if (state === null)
            return;
        state.popout = "";
        state.drawerOpen = false;
        state.launcherOpen = false;
    }

    Variants {
        id: states

        model: Quickshell.screens

        QtObject {
            required property ShellScreen modelData
            property bool drawerOpen: false
            property real drawerProgress: drawerOpen ? 1.0 : 0.0
            property string popout: ""
            property bool launcherOpen: false
            property string launcherQuery: ""
            property bool notificationCenterOpen: false
            property alias selectedDrawerPage: persisted.selectedDrawerPage

            // Only this harmless selection survives a QML reload. Open/focused
            // surfaces and any security-sensitive intent always reset above.
            property PersistentProperties continuity: PersistentProperties {
                id: persisted
                property string selectedDrawerPage: "status"
            }

            Behavior on drawerProgress {
                NumberAnimation {
                    duration: drawerOpen ? Motion.spatial : Motion.exit
                    easing.type: drawerOpen ? Motion.enterEasing : Motion.exitEasing
                }
            }
        }
    }
}
`,
    "state/Actions.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import qs.services

Singleton {
    function focusedScreen(): var {
        return Compositor.focusedScreen ?? Quickshell.screens[0] ?? null;
    }

    function stateFor(screen: ShellScreen): var {
        return ShellState.forScreen(screen);
    }

    function closeTransient(screen: ShellScreen): void {
        ShellState.closeTransient(screen);
    }

    function toggleDrawer(screen: ShellScreen): void {
        const state = stateFor(screen);
        if (state === null)
            return;
        const opening = !state.drawerOpen;
        state.popout = "";
        state.launcherOpen = false;
        state.drawerOpen = opening;
    }

    function toggleDrawerFocused(): void {
        const screen = focusedScreen();
        if (screen !== null)
            toggleDrawer(screen);
    }

    function toggleStatusPopout(screen: ShellScreen): void {
        const state = stateFor(screen);
        if (state === null)
            return;
        state.drawerOpen = false;
        state.launcherOpen = false;
        state.popout = state.popout === "status" ? "" : "status";
    }

    function toggleLauncher(screen: ShellScreen): void {
        const state = stateFor(screen);
        if (state === null)
            return;
        const opening = !state.launcherOpen;
        state.drawerOpen = false;
        state.popout = "";
        state.launcherOpen = opening;
        if (!opening)
            state.launcherQuery = "";
    }

    function toggleLauncherFocused(): void {
        const screen = focusedScreen();
        if (screen !== null)
            toggleLauncher(screen);
    }
}
`,
    "components/qmldir": renderQmldir("qs.components", [
      "Anim 1.0 Anim.qml",
      "StateLayer 1.0 StateLayer.qml",
      "SurfaceButton 1.0 SurfaceButton.qml",
      "StatusPill 1.0 StatusPill.qml",
      "ServiceRow 1.0 ServiceRow.qml",
    ]),
    "components/Anim.qml": String.raw`import QtQuick
import qs.config

NumberAnimation {
    enum Role { Immediate, FastEffect, Exit, Enter, Spatial, LargeSpatial }

    property int role: Anim.Spatial

    duration: {
        switch (role) {
        case Anim.Immediate: return Motion.immediate;
        case Anim.FastEffect: return Motion.fastEffect;
        case Anim.Exit: return Motion.exit;
        case Anim.Enter: return Motion.enter;
        case Anim.LargeSpatial: return Motion.largeSpatial;
        default: return Motion.spatial;
        }
    }
    easing.type: role === Anim.Exit ? Motion.exitEasing
        : role === Anim.Enter || role >= Anim.Spatial ? Motion.enterEasing
        : Motion.standardEasing
}
`,
    "components/StateLayer.qml": String.raw`import QtQuick
import qs.config

Item {
    id: root

    required property bool hovered
    required property bool pressed
    required property bool focused
    property bool selected: false
    property bool controlEnabled: true
    property real cornerRadius: Theme.radiusMedium

    Rectangle {
        anchors.fill: parent
        radius: root.pressed ? Math.max(Theme.radiusMicro, root.cornerRadius - Theme.space1) : root.cornerRadius
        color: {
            if (!root.controlEnabled)
                return "transparent";
            if (root.pressed)
                return Qt.rgba(Theme.primary.r, Theme.primary.g, Theme.primary.b, 0.20);
            if (root.hovered)
                return Qt.rgba(Theme.primary.r, Theme.primary.g, Theme.primary.b, 0.11);
            if (root.selected)
                return Qt.rgba(Theme.primary.r, Theme.primary.g, Theme.primary.b, 0.14);
            return "transparent";
        }

        Behavior on color {
            ColorAnimation { duration: Motion.immediate }
        }
        Behavior on radius {
            NumberAnimation { duration: Motion.immediate; easing.type: Motion.standardEasing }
        }
    }

    Rectangle {
        anchors.fill: parent
        anchors.margins: -2
        radius: root.cornerRadius + 2
        color: "transparent"
        border.width: root.focused ? 2 : 0
        border.color: Theme.primary
        opacity: root.controlEnabled ? 1.0 : 0.45

        Behavior on border.width {
            NumberAnimation { duration: Motion.immediate }
        }
    }
}
`,
    "components/SurfaceButton.qml": String.raw`import QtQuick
import QtQuick.Accessibility
import Quickshell
import qs.config

FocusScope {
    id: root

    required property string label
    property string iconName: ""
    property bool checked: false
    property bool compact: false
    property color containerColour: checked ? Theme.primaryContainer : Theme.surfaceContainer
    property color contentColour: checked ? Theme.onPrimaryContainer : Theme.onSurface
    signal clicked

    implicitWidth: Math.max(implicitHeight, content.implicitWidth + Theme.space4 * 2)
    implicitHeight: compact ? 34 : 42
    activeFocusOnTab: enabled
    opacity: enabled ? 1.0 : 0.44
    scale: tap.pressed ? 0.97 : 1.0

    Accessible.role: Accessible.Button
    Accessible.name: label
    Accessible.checkable: true
    Accessible.checked: checked
    Accessible.onPressAction: root.activate()

    function activate(): void {
        if (enabled)
            clicked();
    }

    Keys.onPressed: event => {
        if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Space) {
            root.activate();
            event.accepted = true;
        }
    }

    Rectangle {
        anchors.fill: parent
        radius: root.checked ? Theme.radiusFull : Theme.radiusMedium
        color: root.containerColour
        border.width: root.checked ? 0 : 1
        border.color: Theme.outlineVariant

        Behavior on radius {
            NumberAnimation { duration: Motion.fastEffect; easing.type: Motion.standardEasing }
        }
        Behavior on color {
            ColorAnimation { duration: Motion.fastEffect }
        }
    }

    Row {
        id: content

        anchors.centerIn: parent
        spacing: root.iconName.length > 0 && root.label.length > 0 ? Theme.space2 : 0

        Image {
            width: root.iconName.length > 0 ? 18 : 0
            height: width
            anchors.verticalCenter: parent.verticalCenter
            source: root.iconName.length > 0 ? Quickshell.iconPath(root.iconName, true) : ""
            sourceSize.width: 36
            sourceSize.height: 36
            visible: source.toString().length > 0
        }

        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: root.label
            color: root.contentColour
            font.family: Theme.bodyFamily
            font.pixelSize: Theme.labelMedium
            font.weight: Font.DemiBold
            elide: Text.ElideRight
        }
    }

    HoverHandler { id: hover }
    TapHandler {
        id: tap
        onTapped: root.activate()
    }

    StateLayer {
        anchors.fill: parent
        hovered: hover.hovered
        pressed: tap.pressed
        focused: root.activeFocus
        selected: root.checked
        controlEnabled: root.enabled
        cornerRadius: root.checked ? Theme.radiusFull : Theme.radiusMedium
    }

    Behavior on scale {
        NumberAnimation { duration: Motion.immediate; easing.type: Motion.standardEasing }
    }
}
`,
    "components/StatusPill.qml": String.raw`import QtQuick
import Quickshell
import qs.config

Rectangle {
    id: root

    required property string text
    required property string iconName
    property string tone: "neutral"
    property bool compact: false

    implicitWidth: content.implicitWidth + Theme.space3 * 2
    implicitHeight: compact ? 28 : 34
    radius: Theme.radiusFull
    color: Qt.rgba(Theme.stateColour(tone).r, Theme.stateColour(tone).g, Theme.stateColour(tone).b, 0.13)

    Row {
        id: content

        anchors.centerIn: parent
        spacing: Theme.space2

        Image {
            width: 16
            height: 16
            anchors.verticalCenter: parent.verticalCenter
            source: Quickshell.iconPath(root.iconName, true)
            sourceSize.width: 32
            sourceSize.height: 32
            visible: source.toString().length > 0
        }

        Text {
            anchors.verticalCenter: parent.verticalCenter
            text: root.text
            color: Theme.onSurface
            font.family: Theme.numericFamily
            font.pixelSize: Theme.labelMedium
            font.weight: Font.DemiBold
        }
    }
}
`,
    "components/ServiceRow.qml": String.raw`import QtQuick
import QtQuick.Layouts
import qs.config

Rectangle {
    id: root

    required property string title
    required property string detail
    required property string availability
    property string degradedReason: ""

    implicitHeight: detailColumn.implicitHeight + Theme.space3 * 2
    radius: Theme.radiusMedium
    color: Theme.surfaceContainerHigh

    RowLayout {
        anchors.fill: parent
        anchors.margins: Theme.space3
        spacing: Theme.space3

        Rectangle {
            Layout.preferredWidth: 8
            Layout.preferredHeight: 8
            radius: 4
            color: {
                if (root.availability === "ready") return Theme.success;
                if (root.availability === "loading") return Theme.warning;
                if (root.availability === "failed") return Theme.error;
                return Theme.outline;
            }
        }

        Column {
            id: detailColumn

            Layout.fillWidth: true
            spacing: Theme.space1

            Text {
                width: parent.width
                text: root.title
                color: Theme.onSurface
                font.family: Theme.bodyFamily
                font.pixelSize: Theme.bodyMedium
                font.weight: Font.DemiBold
                elide: Text.ElideRight
            }

            Text {
                width: parent.width
                text: root.degradedReason.length > 0 ? root.degradedReason : root.detail
                color: root.degradedReason.length > 0 ? Theme.warning : Theme.onSurfaceVariant
                font.family: Theme.bodyFamily
                font.pixelSize: Theme.labelSmall
                elide: Text.ElideRight
            }
        }

        Text {
            text: root.availability.toUpperCase()
            color: Theme.onSurfaceVariant
            font.family: Theme.numericFamily
            font.pixelSize: Theme.labelSmall
            font.weight: Font.DemiBold
        }
    }
}
`,
    "models/qmldir": renderQmldir("qs.models", ["LauncherModel 1.0 LauncherModel.qml"]),
    "models/LauncherModel.qml": String.raw`import Quickshell

ScriptModel {
    id: root

    required property string query
    readonly property string normalizedQuery: query.trim().toLocaleLowerCase()

    values: [...DesktopEntries.applications.values]
        .filter(entry => {
            if (root.normalizedQuery.length === 0)
                return true;
            const haystack = (entry.name + " " + entry.genericName + " " + entry.keywords.join(" ")).toLocaleLowerCase();
            return haystack.includes(root.normalizedQuery);
        })
        .sort((left, right) => left.name.localeCompare(right.name))
        .slice(0, 40)
}
`,
    "services/qmldir": renderQmldir("qs.services", [
      "singleton Time 1.0 Time.qml",
      "singleton Audio 1.0 Audio.qml",
      "singleton Media 1.0 Media.qml",
      "singleton Power 1.0 Power.qml",
      "singleton Network 1.0 Network.qml",
      "singleton Notifications 1.0 Notifications.qml",
      "singleton Compositor 1.0 Compositor.qml",
    ]),
    "services/Time.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import qs.config

Singleton {
    id: root

    readonly property string availability: "ready"
    readonly property bool degraded: false
    readonly property string degradedReason: ""
    property date now: new Date()
    readonly property string shortTime: Qt.formatTime(now, Settings.showSeconds ? "HH:mm:ss" : "HH:mm")
    readonly property string longDate: Qt.formatDate(now, "dddd, d MMMM")

    Timer {
        interval: Settings.showSeconds ? 1000 : 30000
        running: true
        repeat: true
        onTriggered: root.now = new Date()
    }
}
`,
    "services/Audio.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Pipewire

Singleton {
    id: root

    readonly property var sink: Pipewire.defaultAudioSink
    readonly property string availability: !Pipewire.ready ? "loading" : sink === null ? "unavailable" : "ready"
    readonly property bool degraded: availability === "unavailable" || availability === "failed"
    readonly property string degradedReason: availability === "unavailable"
        ? "PipeWire has no default audio sink"
        : availability === "loading" ? "Waiting for PipeWire's first sync" : ""
    readonly property real volume: sink !== null && sink.audio !== null ? sink.audio.volume : 0.0
    readonly property bool muted: sink !== null && sink.audio !== null ? sink.audio.muted : false
    readonly property string label: availability === "ready"
        ? (muted ? "Muted" : Math.round(volume * 100) + "%")
        : availability

    function setVolume(value: real): void {
        if (availability !== "ready")
            return;
        sink.audio.volume = Math.max(0.0, Math.min(1.0, value));
    }

    function changeVolume(delta: real): void {
        setVolume(volume + delta);
    }

    function toggleMuted(): void {
        if (availability === "ready")
            sink.audio.muted = !sink.audio.muted;
    }

    PwObjectTracker {
        objects: [root.sink]
    }
}
`,
    "services/Media.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Mpris

Singleton {
    id: root

    readonly property var players: Mpris.players.values
    readonly property var activePlayer: choosePlayer()
    readonly property string availability: activePlayer === null ? "empty" : "ready"
    readonly property bool degraded: false
    readonly property string degradedReason: availability === "empty" ? "No MPRIS player is active" : ""
    readonly property string title: activePlayer !== null ? (activePlayer.trackTitle || "Unknown title") : "Nothing playing"
    readonly property string artist: activePlayer !== null ? (activePlayer.trackArtist || activePlayer.identity) : "Open a media player"
    readonly property bool playing: activePlayer !== null ? activePlayer.isPlaying : false
    readonly property string artUrl: activePlayer !== null ? activePlayer.trackArtUrl : ""

    function choosePlayer(): var {
        const playingPlayer = players.find(player => player.isPlaying);
        return playingPlayer ?? players[0] ?? null;
    }

    function togglePlaying(): void {
        if (activePlayer !== null && activePlayer.canTogglePlaying)
            activePlayer.togglePlaying();
    }

    function next(): void {
        if (activePlayer !== null && activePlayer.canGoNext)
            activePlayer.next();
    }

    function previous(): void {
        if (activePlayer !== null && activePlayer.canGoPrevious)
            activePlayer.previous();
    }
}
`,
    "services/Power.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.UPower

Singleton {
    id: root

    readonly property var displayDevice: UPower.displayDevice
    readonly property string availability: !displayDevice.ready
        ? "loading"
        : displayDevice.isLaptopBattery ? "ready" : "unavailable"
    readonly property bool degraded: availability === "unavailable"
    readonly property string degradedReason: availability === "unavailable"
        ? "UPower reports no laptop battery"
        : availability === "loading" ? "Waiting for UPower" : ""
    readonly property int percentage: availability === "ready" ? Math.round(displayDevice.percentage) : 0
    readonly property bool onBattery: UPower.onBattery
    readonly property string label: availability === "ready" ? percentage + "%" : "AC"
}
`,
    "services/Network.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Networking

Singleton {
    id: root

    readonly property var devices: Networking.devices.values
    readonly property var connectedDevice: devices.find(device => device.connected) ?? null
    readonly property string availability: devices.length === 0 ? "unavailable" : "ready"
    readonly property bool degraded: availability === "unavailable"
    readonly property string degradedReason: availability === "unavailable"
        ? "NetworkManager's D-Bus backend is unavailable or has no devices"
        : ""
    readonly property bool connected: connectedDevice !== null
    readonly property string label: connected ? connectedDevice.name : (availability === "ready" ? "Offline" : "N/A")
    readonly property bool wifiEnabled: Networking.wifiEnabled

    function toggleWifi(): void {
        if (availability === "ready" && Networking.wifiHardwareEnabled)
            Networking.wifiEnabled = !Networking.wifiEnabled;
    }

    function refreshConnectivity(): void {
        if (Networking.canCheckConnectivity)
            Networking.checkConnectivity();
    }
}
`,
    "services/Notifications.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Services.Notifications

Singleton {
    id: root

    readonly property string availability: "ready"
    readonly property bool degraded: false
    readonly property string degradedReason: ""
    readonly property string integrationNote: "This instance implements the notification server; verify D-Bus ownership in runtime logs."
    property bool doNotDisturb: false
    property var latest: null
    property int unreadCount: 0
    readonly property var history: server.trackedNotifications.values

    function clearAll(): void {
        const copy = [...history];
        for (const notification of copy)
            notification.dismiss();
        latest = null;
        unreadCount = 0;
    }

    function markRead(): void {
        unreadCount = 0;
    }

    NotificationServer {
        id: server

        keepOnReload: true
        bodySupported: true
        actionsSupported: true
        imageSupported: true
        persistenceSupported: true
        inlineReplySupported: false

        onNotification: notification => {
            notification.tracked = true;
            root.latest = notification;
            root.unreadCount += 1;
        }
    }
}
`,
    "services/Compositor.qml": String.raw`pragma Singleton

import QtQuick
import Quickshell
import Quickshell.Hyprland

Singleton {
    id: root

    readonly property bool hyprlandConnected: Hyprland.eventSocketPath.length > 0
    readonly property string availability: hyprlandConnected ? "ready" : "unavailable"
    readonly property bool degraded: !hyprlandConnected
    readonly property string degradedReason: degraded
        ? "The bundled adapter targets Hyprland; implement another adapter for your compositor"
        : ""
    readonly property var workspaces: Hyprland.workspaces
    readonly property var activeToplevel: Hyprland.activeToplevel
    readonly property int activeWorkspaceId: Hyprland.focusedWorkspace !== null ? Hyprland.focusedWorkspace.id : -1
    readonly property string activeTitle: activeToplevel !== null && activeToplevel.title.length > 0
        ? activeToplevel.title : "Desktop"
    readonly property bool fullscreen: Hyprland.focusedWorkspace !== null
        ? Hyprland.focusedWorkspace.hasFullscreen : false
    readonly property var focusedScreen: resolveFocusedScreen()

    function resolveFocusedScreen(): var {
        const monitor = Hyprland.focusedMonitor;
        if (monitor === null)
            return Quickshell.screens[0] ?? null;
        return Quickshell.screens.find(screen => screen.name === monitor.name) ?? Quickshell.screens[0] ?? null;
    }

    function activateWorkspace(id: int): void {
        if (!hyprlandConnected || id < 1 || id > 99)
            return;
        const workspace = Hyprland.workspaces.values.find(candidate => candidate.id === id);
        if (workspace !== undefined)
            workspace.activate();
    }
}
`,
    "modules/bar/qmldir": renderQmldir("qs.modules.bar", ["Bar 1.0 Bar.qml"]),
    "modules/bar/Bar.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import qs.components
import qs.config
import qs.services
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        readonly property var screenState: ShellState.forScreen(modelData)

        screen: modelData
        color: "transparent"
        implicitHeight: Compositor.fullscreen ? 4 : Settings.barHeight
        exclusiveZone: Compositor.fullscreen ? 0 : implicitHeight

        anchors {
            top: true
            left: true
            right: true
        }

        Rectangle {
            id: surface

            anchors.fill: parent
            visible: !Compositor.fullscreen
            color: Theme.surface
            opacity: Theme.compactSurfaceOpacity

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: Theme.space2
                anchors.rightMargin: Theme.space2
                spacing: Theme.space2

                SurfaceButton {
                    label: "Apps"
                    iconName: "view-app-grid-symbolic"
                    compact: true
                    checked: window.screenState !== null && window.screenState.launcherOpen
                    onClicked: Actions.toggleLauncher(window.modelData)
                }

                Row {
                    Layout.preferredWidth: implicitWidth
                    spacing: Theme.space1

                    Repeater {
                        model: 5

                        SurfaceButton {
                            required property int index
                            label: String(index + 1).padStart(2, "0")
                            compact: true
                            checked: Compositor.activeWorkspaceId === index + 1
                            onClicked: Compositor.activateWorkspace(index + 1)
                        }
                    }
                }

                Text {
                    Layout.fillWidth: true
                    Layout.minimumWidth: 80
                    text: Compositor.activeTitle
                    color: Compositor.degraded ? Theme.onSurfaceVariant : Theme.onSurface
                    font.family: Theme.bodyFamily
                    font.pixelSize: Theme.bodyMedium
                    font.weight: Font.Medium
                    horizontalAlignment: Text.AlignHCenter
                    elide: Text.ElideMiddle
                }

                StatusPill {
                    text: Audio.label
                    iconName: Audio.muted ? "audio-volume-muted-symbolic" : "audio-volume-high-symbolic"
                    tone: Audio.degraded ? "warning" : "neutral"
                    compact: true
                }

                StatusPill {
                    text: Power.label
                    iconName: Power.onBattery ? "battery-good-symbolic" : "battery-full-charged-symbolic"
                    tone: Power.degraded ? "warning" : "neutral"
                    compact: true
                }

                StatusPill {
                    text: Time.shortTime
                    iconName: "preferences-system-time-symbolic"
                    tone: "accent"
                    compact: true
                }

                SurfaceButton {
                    label: Notifications.unreadCount > 0 ? String(Notifications.unreadCount) : "Status"
                    iconName: Notifications.unreadCount > 0 ? "notification-new-symbolic" : "view-more-symbolic"
                    compact: true
                    checked: window.screenState !== null && window.screenState.popout === "status"
                    onClicked: Actions.toggleStatusPopout(window.modelData)
                }

                SurfaceButton {
                    label: "Controls"
                    iconName: "preferences-system-symbolic"
                    compact: true
                    checked: window.screenState !== null && window.screenState.drawerOpen
                    onClicked: Actions.toggleDrawer(window.modelData)
                }
            }
        }

    }
}
`,
    "modules/popout/qmldir": renderQmldir("qs.modules.popout", ["Popouts 1.0 Popouts.qml"]),
    "modules/popout/Popouts.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import qs.components
import qs.config
import qs.services
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        readonly property var screenState: ShellState.forScreen(modelData)
        readonly property bool open: screenState !== null && screenState.popout === "status"

        screen: modelData
        color: "transparent"
        implicitWidth: 352
        implicitHeight: 330
        exclusionMode: ExclusionMode.Ignore
        visible: open
        mask: Region { item: surface }

        anchors {
            top: true
            right: true
        }
        margins {
            top: Settings.barHeight + Theme.space2
            right: Theme.space2
        }

        Rectangle {
            id: surface

            width: parent.width
            height: content.implicitHeight + Theme.space4 * 2
            y: window.open ? 0 : -Theme.space4
            radius: Theme.radiusLarge
            color: Theme.surfaceContainer
            opacity: window.open ? Theme.deepSurfaceOpacity : 0.0
            border.width: 1
            border.color: Theme.outlineVariant

            ColumnLayout {
                id: content

                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: Theme.space4
                spacing: Theme.space3

                RowLayout {
                    Layout.fillWidth: true

                    Column {
                        Layout.fillWidth: true
                        spacing: Theme.space1

                        Text {
                            text: "System pulse"
                            color: Theme.onSurface
                            font.family: Theme.headlineFamily
                            font.pixelSize: Theme.titleMedium
                            font.weight: Font.DemiBold
                        }
                        Text {
                            text: Time.longDate
                            color: Theme.onSurfaceVariant
                            font.family: Theme.bodyFamily
                            font.pixelSize: Theme.labelMedium
                        }
                    }

                    SurfaceButton {
                        label: "Close"
                        iconName: "window-close-symbolic"
                        compact: true
                        onClicked: window.screenState.popout = ""
                    }
                }

                ServiceRow {
                    Layout.fillWidth: true
                    title: "Audio"
                    detail: Audio.label
                    availability: Audio.availability
                    degradedReason: Audio.degradedReason
                }
                ServiceRow {
                    Layout.fillWidth: true
                    title: "Network"
                    detail: Network.label
                    availability: Network.availability
                    degradedReason: Network.degradedReason
                }
                ServiceRow {
                    Layout.fillWidth: true
                    title: "Compositor"
                    detail: Compositor.activeTitle
                    availability: Compositor.availability
                    degradedReason: Compositor.degradedReason
                }
            }

            Behavior on y {
                NumberAnimation { duration: window.open ? Motion.enter : Motion.exit; easing.type: Motion.standardEasing }
            }
            Behavior on opacity {
                NumberAnimation { duration: window.open ? Motion.enter : Motion.exit }
            }
        }
    }
}
`,
    "modules/drawer/qmldir": renderQmldir("qs.modules.drawer", ["Drawer 1.0 Drawer.qml"]),
    "modules/drawer/Drawer.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import QtQuick.Layouts
import Quickshell
import qs.components
import qs.config
import qs.services
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        readonly property var screenState: ShellState.forScreen(modelData)
        readonly property real progress: screenState !== null ? screenState.drawerProgress : 0.0

        screen: modelData
        color: "transparent"
        implicitWidth: Math.min(Settings.drawerWidth, Math.max(320, modelData.width - Theme.space6))
        exclusionMode: ExclusionMode.Ignore
        focusable: screenState !== null && screenState.drawerOpen
        mask: Region { item: surface }

        anchors {
            top: true
            right: true
            bottom: true
        }

        Rectangle {
            id: surface

            x: width * (1.0 - window.progress)
            width: parent.width
            height: parent.height
            color: Theme.surfaceContainer
            opacity: Theme.deepSurfaceOpacity
            topLeftRadius: Theme.radiusExtraLarge * window.progress
            bottomLeftRadius: Theme.radiusExtraLarge * window.progress

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: Theme.space5
                spacing: Theme.space4

                RowLayout {
                    Layout.fillWidth: true

                    Column {
                        Layout.fillWidth: true
                        spacing: Theme.space1

                        Text {
                            text: "Control current"
                            color: Theme.onSurface
                            font.family: Theme.headlineFamily
                            font.pixelSize: Theme.headlineSmall
                            font.weight: Font.DemiBold
                        }
                        Text {
                            text: "One surface · shared system truth"
                            color: Theme.onSurfaceVariant
                            font.family: Theme.bodyFamily
                            font.pixelSize: Theme.labelMedium
                        }
                    }

                    SurfaceButton {
                        label: "Close"
                        iconName: "window-close-symbolic"
                        onClicked: window.screenState.drawerOpen = false
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: mediaColumn.implicitHeight + Theme.space4 * 2
                    radius: Theme.radiusLarge
                    color: Theme.surfaceContainerHigh

                    ColumnLayout {
                        id: mediaColumn

                        anchors.fill: parent
                        anchors.margins: Theme.space4
                        spacing: Theme.space3

                        Text {
                            Layout.fillWidth: true
                            text: Media.title
                            color: Theme.onSurface
                            font.family: Theme.bodyFamily
                            font.pixelSize: Theme.titleMedium
                            font.weight: Font.DemiBold
                            elide: Text.ElideRight
                        }
                        Text {
                            Layout.fillWidth: true
                            text: Media.degradedReason.length > 0 ? Media.degradedReason : Media.artist
                            color: Theme.onSurfaceVariant
                            font.family: Theme.bodyFamily
                            font.pixelSize: Theme.labelMedium
                            elide: Text.ElideRight
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Theme.space2

                            SurfaceButton {
                                Layout.fillWidth: true
                                label: "Previous"
                                iconName: "media-skip-backward-symbolic"
                                enabled: Media.activePlayer !== null && Media.activePlayer.canGoPrevious
                                onClicked: Media.previous()
                            }
                            SurfaceButton {
                                Layout.fillWidth: true
                                label: Media.playing ? "Pause" : "Play"
                                iconName: Media.playing ? "media-playback-pause-symbolic" : "media-playback-start-symbolic"
                                enabled: Media.activePlayer !== null && Media.activePlayer.canTogglePlaying
                                checked: Media.playing
                                onClicked: Media.togglePlaying()
                            }
                            SurfaceButton {
                                Layout.fillWidth: true
                                label: "Next"
                                iconName: "media-skip-forward-symbolic"
                                enabled: Media.activePlayer !== null && Media.activePlayer.canGoNext
                                onClicked: Media.next()
                            }
                        }
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: audioColumn.implicitHeight + Theme.space4 * 2
                    radius: Theme.radiusLarge
                    color: Theme.surfaceContainerHigh

                    ColumnLayout {
                        id: audioColumn

                        anchors.fill: parent
                        anchors.margins: Theme.space4
                        spacing: Theme.space3

                        RowLayout {
                            Layout.fillWidth: true

                            Text {
                                Layout.fillWidth: true
                                text: "Output volume"
                                color: Theme.onSurface
                                font.family: Theme.bodyFamily
                                font.pixelSize: Theme.bodyMedium
                                font.weight: Font.DemiBold
                            }
                            Text {
                                text: Audio.label
                                color: Audio.degraded ? Theme.warning : Theme.onSurface
                                font.family: Theme.numericFamily
                                font.pixelSize: Theme.bodyMedium
                            }
                        }

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: Theme.space2

                            SurfaceButton {
                                label: "Quieter"
                                iconName: "audio-volume-low-symbolic"
                                enabled: Audio.availability === "ready"
                                onClicked: Audio.changeVolume(-0.05)
                            }
                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 8
                                radius: 4
                                color: Theme.surfaceContainerHighest

                                Rectangle {
                                    width: parent.width * Math.max(0.0, Math.min(1.0, Audio.volume))
                                    height: parent.height
                                    radius: parent.radius
                                    color: Audio.muted ? Theme.outline : Theme.primary

                                    Behavior on width {
                                        NumberAnimation { duration: Motion.fastEffect; easing.type: Motion.standardEasing }
                                    }
                                }
                            }
                            SurfaceButton {
                                label: "Louder"
                                iconName: "audio-volume-high-symbolic"
                                enabled: Audio.availability === "ready"
                                onClicked: Audio.changeVolume(0.05)
                            }
                        }
                    }
                }

                ServiceRow {
                    Layout.fillWidth: true
                    title: "Network"
                    detail: Network.label
                    availability: Network.availability
                    degradedReason: Network.degradedReason
                }

                ServiceRow {
                    Layout.fillWidth: true
                    title: "Power"
                    detail: Power.label
                    availability: Power.availability
                    degradedReason: Power.degradedReason
                }

                Item { Layout.fillHeight: true }

                RowLayout {
                    Layout.fillWidth: true

                    SurfaceButton {
                        Layout.fillWidth: true
                        label: Network.wifiEnabled ? "Wi-Fi on" : "Wi-Fi off"
                        iconName: "network-wireless-symbolic"
                        enabled: Network.availability === "ready"
                        checked: Network.wifiEnabled
                        onClicked: Network.toggleWifi()
                    }
                    SurfaceButton {
                        Layout.fillWidth: true
                        label: Notifications.doNotDisturb ? "Quiet" : "Alerts"
                        iconName: Notifications.doNotDisturb ? "notifications-disabled-symbolic" : "preferences-system-notifications-symbolic"
                        checked: Notifications.doNotDisturb
                        onClicked: Notifications.doNotDisturb = !Notifications.doNotDisturb
                    }
                }
            }
        }

        // Position updates are optional work and only run while media controls
        // are visible. The Variants tree itself remains eagerly instantiated.
        LazyLoader {
            loading: true
            active: window.screenState !== null
                && window.screenState.drawerOpen
                && Media.activePlayer !== null

            component: Scope {
                Timer {
                    interval: 1000
                    running: true
                    repeat: true
                    onTriggered: {
                        if (Media.activePlayer !== null && Media.activePlayer.positionSupported)
                            Media.activePlayer.positionChanged();
                    }
                }
            }
        }
    }
}
`,
    "modules/launcher/qmldir": renderQmldir("qs.modules.launcher", ["Launcher 1.0 Launcher.qml"]),
    "modules/launcher/Launcher.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import qs.components
import qs.config
import qs.models
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        readonly property var screenState: ShellState.forScreen(modelData)
        readonly property bool open: screenState !== null && screenState.launcherOpen

        screen: modelData
        color: "transparent"
        visible: open
        focusable: open
        exclusionMode: ExclusionMode.Ignore
        mask: Region { item: scrim }

        anchors {
            top: true
            left: true
            right: true
            bottom: true
        }

        Rectangle {
            id: scrim

            anchors.fill: parent
            color: Theme.scrim
            opacity: window.open ? 0.54 : 0.0

            TapHandler { onTapped: Actions.closeTransient(window.modelData) }
        }

        Rectangle {
            id: surface

            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top: parent.top
            anchors.topMargin: Math.max(Theme.space7, parent.height * 0.12)
            width: Math.min(680, parent.width - Theme.space6 * 2)
            height: Math.min(590, parent.height - anchors.topMargin - Theme.space7)
            radius: Theme.radiusExtraLarge
            color: Theme.surfaceContainer
            opacity: Theme.deepSurfaceOpacity
            scale: window.open ? 1.0 : 0.96

            Keys.onEscapePressed: Actions.closeTransient(window.modelData)

            Column {
                anchors.fill: parent
                anchors.margins: Theme.space5
                spacing: Theme.space4

                Text {
                    text: "Launch current"
                    color: Theme.onSurface
                    font.family: Theme.headlineFamily
                    font.pixelSize: Theme.headlineSmall
                    font.weight: Font.DemiBold
                }

                Rectangle {
                    width: parent.width
                    height: 52
                    radius: Theme.radiusLarge
                    color: Theme.surfaceContainerHigh
                    border.width: query.activeFocus ? 2 : 1
                    border.color: query.activeFocus ? Theme.primary : Theme.outlineVariant

                    TextInput {
                        id: query

                        anchors.fill: parent
                        anchors.margins: Theme.space4
                        color: Theme.onSurface
                        selectionColor: Theme.primaryContainer
                        selectedTextColor: Theme.onPrimaryContainer
                        font.family: Theme.bodyFamily
                        font.pixelSize: Theme.bodyMedium
                        clip: true
                        text: window.screenState !== null ? window.screenState.launcherQuery : ""
                        onTextEdited: window.screenState.launcherQuery = text
                        Keys.onDownPressed: results.incrementCurrentIndex()
                        Keys.onUpPressed: results.decrementCurrentIndex()
                        Keys.onEscapePressed: Actions.closeTransient(window.modelData)
                        Keys.onReturnPressed: {
                            if (results.currentItem !== null)
                                results.currentItem.launch();
                        }
                    }

                    Text {
                        anchors.fill: query
                        text: "Search installed applications"
                        color: Theme.onSurfaceVariant
                        font: query.font
                        visible: query.text.length === 0 && !query.activeFocus
                    }
                }

                ListView {
                    id: results

                    width: parent.width
                    height: parent.height - y
                    spacing: Theme.space2
                    clip: true
                    currentIndex: count > 0 ? 0 : -1
                    model: LauncherModel { query: query.text }

                    delegate: SurfaceButton {
                        id: result

                        required property var modelData
                        required property int index
                        property var entry: modelData

                        width: ListView.view.width
                        label: entry.name
                        iconName: entry.icon
                        checked: ListView.isCurrentItem

                        function launch(): void {
                            entry.execute();
                            Actions.closeTransient(window.modelData);
                        }

                        onClicked: launch()
                    }

                    Text {
                        anchors.centerIn: parent
                        text: query.text.length > 0 ? "No matching applications" : "No desktop entries available"
                        visible: results.count === 0
                        color: Theme.onSurfaceVariant
                        font.family: Theme.bodyFamily
                        font.pixelSize: Theme.bodyMedium
                    }
                }
            }

            Behavior on scale {
                NumberAnimation { duration: window.open ? Motion.enter : Motion.exit; easing.type: Motion.standardEasing }
            }
        }

        onVisibleChanged: {
            if (visible)
                query.forceActiveFocus();
        }
    }
}
`,
    "modules/notifications/qmldir": renderQmldir("qs.modules.notifications", [
      "NotificationToasts 1.0 NotificationToasts.qml",
    ]),
    "modules/notifications/NotificationToasts.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import qs.components
import qs.config
import qs.services
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        property bool showing: false
        readonly property bool ownsFocusedScreen: Actions.focusedScreen() === modelData

        screen: modelData
        color: "transparent"
        implicitWidth: 380
        implicitHeight: 210
        exclusionMode: ExclusionMode.Ignore
        visible: showing && Notifications.latest !== null && ownsFocusedScreen
        mask: Region { item: toast }

        anchors {
            top: true
            right: true
        }
        margins {
            top: Settings.barHeight + Theme.space3
            right: Theme.space3
        }

        Rectangle {
            id: toast

            width: parent.width
            height: content.implicitHeight + Theme.space4 * 2
            radius: Theme.radiusLarge
            color: Theme.surfaceContainerHigh
            opacity: Theme.deepSurfaceOpacity
            border.width: 1
            border.color: Theme.outlineVariant

            Column {
                id: content

                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: Theme.space4
                spacing: Theme.space2

                Text {
                    width: parent.width
                    text: Notifications.latest !== null ? Notifications.latest.appName : "Notification"
                    color: Theme.primary
                    font.family: Theme.bodyFamily
                    font.pixelSize: Theme.labelMedium
                    font.weight: Font.DemiBold
                    elide: Text.ElideRight
                }
                Text {
                    width: parent.width
                    text: Notifications.latest !== null ? Notifications.latest.summary : ""
                    color: Theme.onSurface
                    font.family: Theme.bodyFamily
                    font.pixelSize: Theme.titleMedium
                    font.weight: Font.DemiBold
                    elide: Text.ElideRight
                }
                Text {
                    width: parent.width
                    text: Notifications.latest !== null ? Notifications.latest.body : ""
                    color: Theme.onSurfaceVariant
                    font.family: Theme.bodyFamily
                    font.pixelSize: Theme.bodyMedium
                    textFormat: Text.PlainText
                    maximumLineCount: 2
                    wrapMode: Text.Wrap
                    elide: Text.ElideRight
                }
                SurfaceButton {
                    label: "Dismiss"
                    iconName: "window-close-symbolic"
                    compact: true
                    onClicked: {
                        if (Notifications.latest !== null)
                            Notifications.latest.dismiss();
                        window.showing = false;
                    }
                }
            }
        }

        Timer {
            id: timeout
            interval: 5000
            onTriggered: window.showing = false
        }

        Connections {
            target: Notifications
            function onLatestChanged(): void {
                if (Notifications.latest !== null && !Notifications.doNotDisturb && window.ownsFocusedScreen) {
                    window.showing = true;
                    timeout.restart();
                }
            }
        }
    }
}
`,
    "modules/osd/qmldir": renderQmldir("qs.modules.osd", ["Osd 1.0 Osd.qml"]),
    "modules/osd/Osd.qml": String.raw`pragma ComponentBehavior: Bound

import QtQuick
import Quickshell
import qs.config
import qs.services
import qs.state

Variants {
    model: Quickshell.screens

    PanelWindow {
        id: window

        required property ShellScreen modelData
        property bool showing: false
        readonly property bool ownsFocusedScreen: Actions.focusedScreen() === modelData

        screen: modelData
        color: "transparent"
        implicitWidth: 300
        implicitHeight: 72
        exclusionMode: ExclusionMode.Ignore
        visible: showing && ownsFocusedScreen
        mask: Region { item: surface }

        anchors {
            bottom: true
            right: true
        }
        margins {
            bottom: Theme.space5
            right: Theme.space5
        }

        Rectangle {
            id: surface
            anchors.fill: parent
            radius: Theme.radiusLarge
            color: Theme.surfaceContainerHigh

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                anchors.margins: Theme.space4
                height: 8
                radius: 4
                color: Theme.surfaceContainerHighest

                Rectangle {
                    width: parent.width * Math.max(0.0, Math.min(1.0, Audio.volume))
                    height: parent.height
                    radius: parent.radius
                    color: Audio.muted ? Theme.outline : Theme.primary
                }
            }

            Text {
                anchors.left: parent.left
                anchors.leftMargin: Theme.space4
                anchors.top: parent.top
                anchors.topMargin: Theme.space3
                text: Audio.availability === "ready" ? "Output · " + Audio.label : Audio.degradedReason
                color: Audio.degraded ? Theme.warning : Theme.onSurface
                font.family: Theme.bodyFamily
                font.pixelSize: Theme.bodyMedium
                font.weight: Font.DemiBold
            }
        }

        Timer { id: timeout; interval: 1400; onTriggered: window.showing = false }
        Connections {
            target: Audio
            function onVolumeChanged(): void {
                if (Audio.availability === "ready" && window.ownsFocusedScreen) {
                    window.showing = true;
                    timeout.restart();
                }
            }
            function onMutedChanged(): void {
                if (Audio.availability === "ready" && window.ownsFocusedScreen) {
                    window.showing = true;
                    timeout.restart();
                }
            }
        }
    }
}
`,
    "modules/ipc/qmldir": renderQmldir("qs.modules.ipc", ["Ipc 1.0 Ipc.qml"]),
    "modules/ipc/Ipc.qml": String.raw`import QtQuick
import Quickshell
import Quickshell.Io
import qs.services
import qs.state

Scope {
    IpcHandler {
        target: "shell"

        function toggleDrawer(): void { Actions.toggleDrawerFocused(); }
        function toggleLauncher(): void { Actions.toggleLauncherFocused(); }
        function close(): void {
            const screen = Actions.focusedScreen();
            if (screen !== null)
                Actions.closeTransient(screen);
        }
        function status(): string {
            return "audio=" + Audio.availability
                + " media=" + Media.availability
                + " power=" + Power.availability
                + " network=" + Network.availability
                + " compositor=" + Compositor.availability;
        }
    }

    IpcHandler {
        target: "audio"

        function setVolume(value: real): void { Audio.setVolume(value); }
        function changeVolume(delta: real): void { Audio.changeVolume(delta); }
        function toggleMuted(): void { Audio.toggleMuted(); }
        function volume(): real { return Audio.volume; }
    }

    IpcHandler {
        target: "media"

        function togglePlaying(): void { Media.togglePlaying(); }
        function next(): void { Media.next(); }
        function previous(): void { Media.previous(); }
        function title(): string { return Media.title; }
    }

    IpcHandler {
        target: "notifications"

        function clear(): void { Notifications.clearAll(); }
        function setDoNotDisturb(enabled: bool): void { Notifications.doNotDisturb = enabled; }
        function unread(): int { return Notifications.unreadCount; }
    }
}
`,
    "README.md": String.raw`# __PROJECT_NAME__

An independently written Quickshell learning project forged by QML Shellcraft.

## Platform contract

- Runtime target: Linux/Wayland + Quickshell 0.3.x + Qt 6.
- Bundled compositor adapter: Hyprland. Other compositors need their own services/Compositor.qml adapter.
- Browser/macOS previews teach concepts; they do not prove layer-shell, focus, IPC, hotplug, or service behaviour.
- PipeWire, MPRIS, UPower, NetworkManager, and notification availability is shown honestly in the UI. Missing services do not invent sample data.

## Run

1. Install a compatible Quickshell 0.3.x/Qt 6 build on Linux.
2. Place this directory under your Quickshell config directory or run it directly.
3. From this directory run **qs -p .** (some packages also expose **quickshell -p .**).
4. Inspect public actions with **qs ipc show**.

Useful calls:

~~~sh
qs ipc call shell status
qs ipc call shell toggleDrawer
qs ipc call shell toggleLauncher
qs ipc call audio changeVolume 0.05
qs ipc call audio toggleMuted
qs ipc call media togglePlaying
~~~

## Architecture

~~~text
shell.qml -> modules -> components
                 |          |
                 v          v
              state/config/services
~~~

shell.qml only composes top-level surfaces. services/ owns system truth once. state/ owns screen-scoped UI intent and shared actions. config/ owns typed policy and the visual grammar. Modules never launch discovery processes from delegates.

The persistent bar is useful on its own. Status popouts provide local inspection, the connected edge drawer reveals deeper controls, the launcher takes deliberate focus, and notifications/OSD occupy a separate alert lane.

## Visual contract

Direction: intentional hybrid — Caelestia-led spatial continuity with End-4-led utility and microinteraction.

Dominant topology: connected edge surface.

Signature idea: the top edge is a quiet current that grows into locally owned popouts and one deep right-edge control surface.

Visual grammar: semantic tonal palette; headline/body/numeric/icon roles; 4/8/12/16/24/32/48 spacing; micro/small/medium/large/extra-large/full radii; tonal depth before transparency; immediate/effect/exit/enter/spatial motion; explicit reduced-motion and opaque-safe policy.

Anti-goals: floating-card soup, universal blur, one radius everywhere, decorative motion, popouts without an origin, and fullscreen behaviour that happens by accident.

## Configuration

Edit settings.json. It is read through a typed JsonAdapter, watched, and reloaded after a short debounce. It contains policy only—never secrets, authentication data, focused controls, or destructive confirmations.

## What still needs runtime proof

This generator was statically authored against the Quickshell 0.3 documentation. Complete VALIDATION.md on the exact target machine. In particular, verify notification-server ownership, Hyprland focus behaviour, mixed-scale geometry, icon-theme coverage, and the APIs exposed by your packaged Quickshell build.
`,
    "VALIDATION.md": String.raw`# Validation evidence

Do not mark a browser simulation or TypeScript build as Quickshell runtime success.

## Environment record

- [ ] Distribution and version recorded
- [ ] Quickshell exact version/commit recorded
- [ ] Qt exact version recorded
- [ ] Compositor exact version recorded
- [ ] GPU/driver recorded
- [ ] Monitor names, resolutions, scales, and orientation recorded

## Static

- [ ] **python3 audit_shell.py .** passes
- [ ] **python3 audit_shell.py --strict .** passes or each exception is documented
- [ ] qmlls reports no unknown properties, binding loops, incompatible types, or unqualified access
- [ ] Every qmldir import resolves from a clean checkout
- [ ] shell.qml remains composition/lifecycle glue

## Startup and reload

- [ ] First useful bar appears before optional deep surfaces
- [ ] Clean state/cache startup works
- [ ] Soft reload preserves only safe state and duplicates no service, IPC handler, or notification server
- [ ] A temporary syntax error is recoverable
- [ ] Logs contain no repeated process restarts or synchronous loader stalls

## Screen and compositor

- [ ] One monitor at 1x
- [ ] Mixed fractional scales
- [ ] Narrow/portrait monitor
- [ ] Hotplug and removal while each surface is open
- [ ] Focused-monitor changes route actions correctly
- [ ] Empty, tiled, floating, maximized, special-workspace, and fullscreen states
- [ ] Exclusion, layer, masks, borders, rounding, and visibility transform together in fullscreen
- [ ] Non-Hyprland use is blocked or supplied with a tested adapter; it is never labelled ready accidentally

## Input and accessibility

- [ ] Pointer hover, click, rapid repeat, and outside dismissal
- [ ] Keyboard-only launcher search, arrows, activation, Escape, and focus restoration
- [ ] Every public IPC function inspected and called, including invalid values
- [ ] Empty transparent window areas pass input through
- [ ] Focus ring, disabled state, labels, elision, and 200% scale remain legible
- [ ] Reduced motion preserves causality without overshoot or ambient movement

## Service degradation

- [ ] PipeWire missing, initial sync, sink change, mute, and device hotplug
- [ ] Zero, one, and several MPRIS players; player disappears mid-action
- [ ] UPower missing and desktop with no battery
- [ ] NetworkManager missing, offline, hardware-disabled Wi-Fi, and reconnect
- [ ] Notification name conflict, malformed markup, privacy-sensitive body, replacement, and dismissal
- [ ] Hyprland IPC unavailable and compositor restart
- [ ] One failed service does not break unrelated surfaces

## Visual states

- [ ] Compact, hover, pressed, focused, selected, opening, open, closing
- [ ] Loading, empty, unavailable, failed, stale/denied where applicable
- [ ] Dark/light and muted/vibrant wallpaper contrast
- [ ] Persistent, contextual, deep, alert, modal, and fullscreen hierarchy are visibly distinct
- [ ] Popouts visibly belong to their trigger and edge joins do not tear
- [ ] Representative screenshots score at least 21/28 against the Shellcraft visual rubric with no rejection gate

## Performance and privacy

- [ ] Cold-start time to bar recorded
- [ ] Idle CPU and memory recorded with optional surfaces closed
- [ ] Drawer and launcher transitions profiled on the slowest supported GPU
- [ ] Repeated open/close, reload, and hotplug leak checks complete
- [ ] Notification contents and launcher queries are not logged or persisted
- [ ] No secrets, PAM text, tokens, or destructive confirmations enter config/state/IPC

## Evidence log

| Date | Build | Matrix subset | Result | Evidence/link | Known limitation |
|---|---|---|---|---|---|
| | | | | | |
`,
    "LICENSE": String.raw`MIT License

Copyright (c) __AUTHOR__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`,
    "LICENSES/ATTRIBUTION.md": String.raw`# Attribution and license boundaries

## This generated project

The QML in this project is independently written for QML Shellcraft and offered under the root LICENSE unless a file states otherwise. No End-4 or Caelestia source code, artwork, fonts, icons, or product identity is copied into the generated project.

The architecture and visual direction study publicly documented ideas: reactive service/state/config boundaries, per-screen composition, progressive depth, connected edge ownership, semantic motion, and wallpaper-aware colour. Ideas are reimplemented in a separate visual identity.

## Design references

- End-4 dots-hyprland: https://github.com/end-4/dots-hyprland — GPL-3.0
- Caelestia Shell: https://github.com/caelestia-dots/shell — GPL-3.0
- Quickshell documentation: https://quickshell.org/docs/v0.3.0/
- Quickshell source/license: https://github.com/quickshell-mirror/quickshell

## Runtime and foreign assets

Quickshell and Qt remain governed by their own licenses; generating or running this configuration does not relicense them. Icons are requested from the user's installed system icon theme by name and are not distributed here. Application icons, notification images, and media artwork are foreign runtime content and retain their original ownership.

If you later copy or adapt GPL code/assets from either reference shell, preserve its copyright notices, check compatibility, and document the resulting distribution obligations here. “Inspired by” is not a substitute for a source audit.
`,
  };

  for (const [path, source] of Object.entries(files)) {
    files[path] = normalizeSource(replaceTokens(source, tokens));
  }
  return files;
}

/** Create the complete, runnable/degradable baseline without marking quests complete. */
export function createBaseProject(options: ForgeProjectOptions = {}): ForgeFiles {
  const files = productionTemplates(options);
  const manifest = defaultManifest(options);
  files[MANIFEST_PATH] = renderManifest(manifest);
  files[CHECKPOINT_PATH] = renderCheckpoint(manifest);
  return { ...files };
}

/** More explicit alias for clients that have several project generators. */
export const createBaseForgeProject = createBaseProject;

function artifactForQuest(questId: string): ForgeArtifact | undefined {
  return FORGE_ARTIFACTS.find((artifact) => artifact.questId === questId);
}

function artifactCodesForFile(
  manifest: ForgeManifest,
  path: string,
): ForgeArtifactCode[] {
  const applied = new Set(manifest.appliedArtifactCodes);
  return FORGE_ARTIFACTS
    .filter((artifact) => artifact.primaryFile === path && applied.has(artifact.code))
    .map((artifact) => artifact.code);
}

function updateProgressFiles(files: ForgeFiles, manifest: ForgeManifest): ForgeFiles {
  return {
    ...files,
    [MANIFEST_PATH]: renderManifest(manifest),
    [CHECKPOINT_PATH]: renderCheckpoint(manifest),
  };
}

/**
 * Apply one quest artifact to the integrated project.
 *
 * `completeFileSource`, when supplied, must be a complete replacement for the
 * artifact's primary file—not an isolated practice fragment. Omitting it keeps
 * the production template and records the artifact/checkpoint immutably.
 */
export function applyQuestArtifact(
  project: Readonly<ForgeFiles>,
  questId: string,
  completeFileSource?: string,
  options: ForgeProjectOptions = {},
): ForgeFiles {
  const current = Object.keys(project).length > 0 ? { ...project } : createBaseProject(options);
  const artifact = artifactForQuest(questId);
  if (!artifact) {
    const manifest = readManifest(current, options);
    if (manifest.completedQuestIds.includes(questId)) return current;
    const completedQuestIds = [...manifest.completedQuestIds, questId];
    return updateProgressFiles(current, { ...manifest, completedQuestIds });
  }

  const oldManifest = readManifest(current, options);
  const appliedArtifactCodes = unique([...oldManifest.appliedArtifactCodes, artifact.code]);
  const completedQuestIds = unique([...oldManifest.completedQuestIds, questId]);
  const manifest: ForgeManifest = {
    ...oldManifest,
    appliedArtifactCodes,
    completedQuestIds,
    reachedCheckpointIds: checkpointIdsFor(appliedArtifactCodes),
  };

  if (completeFileSource !== undefined && completeFileSource.trim().length > 0) {
    current[artifact.primaryFile] = normalizeSource(completeFileSource);
  }

  if (artifact.primaryFile.endsWith(".qml")) {
    const source = current[artifact.primaryFile];
    if (source) {
      current[artifact.primaryFile] = markArtifact(
        source,
        artifactCodesForFile(manifest, artifact.primaryFile),
      );
    }
  }

  return updateProgressFiles(current, manifest);
}

/** Apply several quest artifacts in course order while preserving a fresh record each step. */
export function applyQuestArtifacts(
  project: Readonly<ForgeFiles>,
  questIds: readonly string[],
  completeFileSources: Readonly<Record<string, string>> = {},
  options: ForgeProjectOptions = {},
): ForgeFiles {
  return unique(questIds).reduce(
    (files, questId) => applyQuestArtifact(files, questId, completeFileSources[questId], options),
    { ...project },
  );
}

/**
 * Build the learner's cumulative project. The default always exports coherent
 * production templates. Set applyLearnerSources only when the editor contains
 * complete target files suitable for replacing integrated project files.
 */
export function createForgeProject(
  completedQuestIds: readonly string[] = [],
  questSources: Readonly<Record<string, string>> = {},
  options: ForgeProjectOptions = {},
): ForgeFiles {
  const sources = options.applyLearnerSources ? questSources : {};
  return applyQuestArtifacts(createBaseProject(options), completedQuestIds, sources, options);
}

/** Drop-in name for the course UI's former local generator. */
export const forgeProjectFiles = createForgeProject;

export function getForgeManifest(
  project: Readonly<ForgeFiles>,
  options: ForgeProjectOptions = {},
): ForgeManifest {
  return readManifest(project, options);
}

/** Persist a project through browser storage without relying on filesystem APIs. */
export function serializeForgeProject(project: Readonly<ForgeFiles>): string {
  const ordered = Object.fromEntries(
    Object.entries(project)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([path, source]) => [path, normalizeSource(source)]),
  );
  return JSON.stringify({ schemaVersion: 1, files: ordered });
}

function safeProjectPath(path: string): boolean {
  return path.length > 0
    && !path.startsWith("/")
    && !path.includes("\\")
    && path.split("/").every((segment) => segment.length > 0 && segment !== "." && segment !== "..");
}

/** Restore browser-persisted files and reject path traversal or non-string content. */
export function restoreForgeProject(serialized: string): ForgeFiles {
  const parsed = JSON.parse(serialized) as { schemaVersion?: unknown; files?: unknown };
  if (parsed.schemaVersion !== 1 || typeof parsed.files !== "object" || parsed.files === null) {
    throw new Error("Unsupported Shellcraft project snapshot");
  }

  const restored: ForgeFiles = {};
  for (const [path, source] of Object.entries(parsed.files as Record<string, unknown>)) {
    if (!safeProjectPath(path) || typeof source !== "string") {
      throw new Error(`Invalid Shellcraft project entry: ${path}`);
    }
    restored[path] = normalizeSource(source);
  }
  return restored;
}

export const REQUIRED_FORGE_FILES = [
  "shell.qml",
  "qmldir",
  ".qmlls.ini",
  "config/Theme.qml",
  "config/Motion.qml",
  "config/Settings.qml",
  "state/ShellState.qml",
  "state/Actions.qml",
  "services/Time.qml",
  "services/Audio.qml",
  "services/Media.qml",
  "services/Power.qml",
  "services/Network.qml",
  "services/Notifications.qml",
  "services/Compositor.qml",
  "components/StateLayer.qml",
  "components/SurfaceButton.qml",
  "components/StatusPill.qml",
  "modules/bar/Bar.qml",
  "modules/popout/Popouts.qml",
  "modules/drawer/Drawer.qml",
  "modules/launcher/Launcher.qml",
  "modules/notifications/NotificationToasts.qml",
  "modules/osd/Osd.qml",
  "modules/ipc/Ipc.qml",
  "README.md",
  "VALIDATION.md",
  "LICENSES/ATTRIBUTION.md",
] as const;
