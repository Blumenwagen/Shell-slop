"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Check = {
  label: string;
  hint: string;
  test: (code: string) => boolean;
};

type Lesson = {
  id: string;
  phase: string;
  number: string;
  title: string;
  kicker: string;
  duration: string;
  objective: string;
  concept: string;
  principles: string[];
  starter: string;
  solution: string;
  checks: Check[];
  preview: "surface" | "layout" | "component" | "motion" | "model" | "bar" | "state" | "drawer" | "shell";
};

const lessons: Lesson[] = [
  {
    id: "reactive-surface",
    phase: "QML foundations",
    number: "01",
    title: "Make a surface react",
    kicker: "Properties → bindings → state",
    duration: "18 min",
    objective: "Build a control whose form is derived from state instead of manually updated.",
    concept:
      "QML describes relationships. When active changes, every property bound to active recalculates automatically. This reactive chain becomes the operating model of your shell.",
    principles: [
      "Declare state once and derive appearance from it.",
      "Use typed properties so intent and tooling stay clear.",
      "Let input change state; let bindings change the view.",
    ],
    starter: `import QtQuick

Rectangle {
    id: root

    width: 180
    height: 52
    radius: 16
    color: "#282633"

    Text {
        anchors.centerIn: parent
        text: "Launcher"
        color: "#f5f2ff"
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: root
    property bool active: false

    width: active ? 220 : 180
    height: 52
    radius: active ? 26 : 16
    color: active ? "#c9b6ff" : "#282633"

    Text {
        anchors.centerIn: parent
        text: root.active ? "Launcher open" : "Launcher"
        color: root.active ? "#24163f" : "#f5f2ff"
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: root.active = !root.active
    }
}`,
    checks: [
      {
        label: "Declare typed UI state",
        hint: "Add property bool active: false to the Rectangle.",
        test: code => /property\s+bool\s+active\s*:/.test(code),
      },
      {
        label: "Bind form to active",
        hint: "Use active ? … : … in color, radius, width, or text.",
        test: code => /(?:color|radius|width|text)\s*:\s*[^\n]*active\s*\?/.test(code),
      },
      {
        label: "Toggle from input",
        hint: "Add a MouseArea and toggle root.active in onClicked.",
        test: code => /MouseArea\s*\{[\s\S]*onClicked\s*:[\s\S]*active\s*=\s*!/.test(code),
      },
    ],
    preview: "surface",
  },
  {
    id: "spatial-layout",
    phase: "QML foundations",
    number: "02",
    title: "Compose a compact bar",
    kicker: "Anchors, layouts, and rhythm",
    duration: "22 min",
    objective: "Arrange glanceable shell information without hard-coding every coordinate.",
    concept:
      "Anchors express spatial relationships; layouts distribute groups. A good shell uses both deliberately: anchors for ownership, layouts for repeated rhythm.",
    principles: [
      "Anchor the bar to its owning edge.",
      "Use spacing to reveal groups before adding separators.",
      "Keep persistent surfaces useful but quiet.",
    ],
    starter: `import QtQuick
import QtQuick.Layouts

Rectangle {
    width: 420
    height: 48
    color: "#1d1b24"

    Text { text: "1  2  3" }
    Text { text: "14:42" }
    Text { text: "87%" }
}`,
    solution: `import QtQuick
import QtQuick.Layouts

Rectangle {
    id: bar
    width: 420
    height: 48
    radius: 18
    color: "#1d1b24"

    RowLayout {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 16

        Text { text: "1  2  3"; color: "#c9b6ff" }
        Item { Layout.fillWidth: true }
        Text { text: "14:42"; color: "#f5f2ff" }
        Text { text: "87%"; color: "#b9f7c8" }
    }
}`,
    checks: [
      {
        label: "Use a layout container",
        hint: "Wrap the content in RowLayout.",
        test: code => /RowLayout\s*\{/.test(code),
      },
      {
        label: "Own the available space",
        hint: "Anchor the layout to its parent with anchors.fill.",
        test: code => /anchors\.fill\s*:\s*parent/.test(code),
      },
      {
        label: "Separate semantic groups",
        hint: "Add spacing and a fill-width Item between left and right groups.",
        test: code => /spacing\s*:\s*\d+/.test(code) && /Layout\.fillWidth\s*:\s*true/.test(code),
      },
    ],
    preview: "layout",
  },
  {
    id: "component-contracts",
    phase: "Reusable UI",
    number: "03",
    title: "Design a control contract",
    kicker: "Components, signals, required data",
    duration: "24 min",
    objective: "Turn a one-off button into a reusable shell primitive.",
    concept:
      "A component is not merely repeated styling. It is a small behavioral contract: typed inputs, semantic state, and signals that keep product logic outside the visual primitive.",
    principles: [
      "Require the data a component cannot sensibly invent.",
      "Emit intent through signals instead of reaching into global state.",
      "Centralize hover, press, focus, selected, and disabled feedback.",
    ],
    starter: `import QtQuick

Rectangle {
    id: root
    width: label.implicitWidth + 28
    height: 36
    radius: 18

    Text {
        id: label
        anchors.centerIn: parent
        text: "Action"
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: root
    required property string label
    property bool selected: false
    signal triggered

    width: textItem.implicitWidth + 28
    height: 36
    radius: pointer.pressed ? 10 : 18
    color: selected ? "#c9b6ff"
                    : pointer.containsMouse ? "#343140"
                    : "transparent"

    Text {
        id: textItem
        anchors.centerIn: parent
        text: root.label
        color: root.selected ? "#24163f" : "#f5f2ff"
    }

    MouseArea {
        id: pointer
        anchors.fill: parent
        hoverEnabled: true
        onClicked: root.triggered()
    }
}`,
    checks: [
      {
        label: "Require the label",
        hint: "Declare required property string label.",
        test: code => /required\s+property\s+string\s+label/.test(code),
      },
      {
        label: "Expose intent as a signal",
        hint: "Declare a signal, then emit it from onClicked.",
        test: code => /signal\s+\w+/.test(code) && /onClicked\s*:\s*root\.\w+\s*\(/.test(code),
      },
      {
        label: "Show interaction state",
        hint: "Respond to containsMouse or pressed in a visual property.",
        test: code => /(?:containsMouse|pressed)/.test(code) && /hoverEnabled\s*:\s*true/.test(code),
      },
    ],
    preview: "component",
  },
  {
    id: "semantic-motion",
    phase: "Reusable UI",
    number: "04",
    title: "Make motion explain state",
    kicker: "Behaviors, states, transitions",
    duration: "28 min",
    objective: "Animate a launcher from its trigger while keeping the transition reversible.",
    concept:
      "End-4 and Caelestia treat motion as a system. Effects are quick; spatial changes are slower. The animated property should explain where a surface came from and where it went.",
    principles: [
      "Animate geometry when geometry communicates causality.",
      "Name motion by role rather than by arbitrary duration.",
      "Let Behavior animate from the current rendered value during reversal.",
    ],
    starter: `import QtQuick

Rectangle {
    id: launcher
    property bool open: false

    width: open ? 420 : 52
    height: open ? 360 : 52
    radius: 26
}`,
    solution: `import QtQuick

Rectangle {
    id: launcher
    property bool open: false
    readonly property int spatialDuration: 420

    width: open ? 420 : 52
    height: open ? 360 : 52
    radius: open ? 28 : 26
    color: "#24212d"

    Behavior on width {
        NumberAnimation {
            duration: launcher.spatialDuration
            easing.type: Easing.OutCubic
        }
    }
    Behavior on height {
        NumberAnimation {
            duration: launcher.spatialDuration
            easing.type: Easing.OutCubic
        }
    }
    Behavior on radius {
        NumberAnimation { duration: 180 }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: launcher.open = !launcher.open
    }
}`,
    checks: [
      {
        label: "Name a motion role",
        hint: "Declare a semantic duration such as spatialDuration.",
        test: code => /property\s+int\s+\w*(?:Spatial|spatial)\w*\s*:/.test(code),
      },
      {
        label: "Animate spatial properties",
        hint: "Add Behavior on width or height with NumberAnimation.",
        test: code => /Behavior\s+on\s+(?:width|height|x|y)[\s\S]*NumberAnimation/.test(code),
      },
      {
        label: "Use purposeful easing",
        hint: "Choose a decelerating easing curve for arrival.",
        test: code => /easing\.type\s*:\s*Easing\.(?:Out|InOut)/.test(code),
      },
    ],
    preview: "motion",
  },
  {
    id: "stable-models",
    phase: "Data-driven UI",
    number: "05",
    title: "Render live collections",
    kicker: "Models, delegates, identity",
    duration: "30 min",
    objective: "Build animated workspace indicators from a model without duplicating UI.",
    concept:
      "Models separate changing data from its visual representation. Stable delegate identity matters: it preserves animation continuity when workspaces, notifications, or players change.",
    principles: [
      "Put collection data in a model, not repeated hand-written items.",
      "Keep delegates small and bind them to model roles.",
      "Use ScriptModel for changing Quickshell filters and sorts.",
    ],
    starter: `import QtQuick

Row {
    spacing: 8

    Rectangle { width: 28; height: 28 }
    Rectangle { width: 28; height: 28 }
    Rectangle { width: 28; height: 28 }
}`,
    solution: `import QtQuick

Row {
    id: workspaces
    spacing: 8
    property int activeWorkspace: 2

    Repeater {
        model: 5

        Rectangle {
            required property int index
            width: index + 1 === workspaces.activeWorkspace ? 52 : 28
            height: 28
            radius: 14
            color: index + 1 === workspaces.activeWorkspace
                ? "#c9b6ff" : "#343140"

            Text {
                anchors.centerIn: parent
                text: index + 1
            }
        }
    }
}`,
    checks: [
      {
        label: "Generate delegates from a model",
        hint: "Replace repeated rectangles with Repeater and model.",
        test: code => /Repeater\s*\{[\s\S]*model\s*:/.test(code),
      },
      {
        label: "Use delegate identity",
        hint: "Declare the required index property in the delegate.",
        test: code => /required\s+property\s+int\s+index/.test(code),
      },
      {
        label: "Derive selected appearance",
        hint: "Compare index against activeWorkspace in color, width, or radius.",
        test: code => /(?:color|width|radius)\s*:[\s\S]{0,100}(?:index|modelData)[\s\S]{0,100}\?/.test(code),
      },
    ],
    preview: "model",
  },
  {
    id: "per-screen-bar",
    phase: "Enter Quickshell",
    number: "06",
    title: "Own every screen edge",
    kicker: "Variants + PanelWindow",
    duration: "34 min",
    objective: "Create one real shell bar per connected monitor.",
    concept:
      "Quickshell turns QML into desktop infrastructure. Variants follows the live screen model and creates a PanelWindow for each screen—without assuming which monitor is first or primary.",
    principles: [
      "Screens are first-class, hot-pluggable objects.",
      "A panel must declare its edge, screen, and exclusion policy.",
      "Keep shell.qml as composition rather than a feature dump.",
    ],
    starter: `import QtQuick
import Quickshell

PanelWindow {
    implicitHeight: 48
    color: "#1d1b24"
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
        color: "transparent"

        anchors {
            top: true
            left: true
            right: true
        }

        Rectangle {
            anchors.fill: parent
            color: "#1d1b24"
        }
    }
}`,
    checks: [
      {
        label: "Follow the screen model",
        hint: "Wrap the PanelWindow in Variants using Quickshell.screens.",
        test: code => /Variants\s*\{[\s\S]*model\s*:\s*Quickshell\.screens/.test(code),
      },
      {
        label: "Bind the delegate screen",
        hint: "Require ShellScreen modelData and assign screen: modelData.",
        test: code => /required\s+property\s+ShellScreen\s+modelData/.test(code) && /screen\s*:\s*modelData/.test(code),
      },
      {
        label: "Declare edge ownership",
        hint: "Anchor the PanelWindow to an edge and set its exclusive zone.",
        test: code => /anchors\s*\{[\s\S]*(?:top|bottom|left|right)\s*:\s*true/.test(code) && /exclusiveZone\s*:/.test(code),
      },
    ],
    preview: "bar",
  },
  {
    id: "shell-state",
    phase: "Shell architecture",
    number: "07",
    title: "Separate truth from intent",
    kicker: "Services, UI state, persistence",
    duration: "38 min",
    objective: "Create screen-scoped UI state that survives safe QML reloads.",
    concept:
      "A reliable shell distinguishes system truth, user policy, UI intent, and derived appearance. End-4 and Caelestia stay coherent because visual components consume shared state instead of discovering the system independently.",
    principles: [
      "One domain gets one observer service.",
      "Transient open/selected/drag state belongs to the screen.",
      "PersistentProperties is reload continuity, not a settings database.",
    ],
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
        return states.instances.find(
            state => state.modelData === screen
        ) ?? null;
    }

    Variants {
        id: states
        model: Quickshell.screens

        PersistentProperties {
            required property ShellScreen modelData
            property bool drawerOpen: false
            property string selectedSurface: ""
        }
    }
}`,
    checks: [
      {
        label: "Make state screen-scoped",
        hint: "Create states with Variants over Quickshell.screens.",
        test: code => /Variants\s*\{[\s\S]*Quickshell\.screens/.test(code),
      },
      {
        label: "Preserve safe reload state",
        hint: "Place UI intent inside PersistentProperties.",
        test: code => /PersistentProperties\s*\{[\s\S]*property\s+bool\s+drawerOpen/.test(code),
      },
      {
        label: "Provide screen lookup",
        hint: "Add a forScreen function that finds matching modelData.",
        test: code => /function\s+forScreen\s*\([^)]*ShellScreen/.test(code) && /modelData\s*===\s*screen/.test(code),
      },
    ],
    preview: "state",
  },
  {
    id: "connected-drawer",
    phase: "Shell architecture",
    number: "08",
    title: "Connect edge and drawer",
    kicker: "Input masks + spatial continuity",
    duration: "42 min",
    objective: "Build a drawer whose geometry, hit region, and motion agree.",
    concept:
      "Caelestia’s magic is mechanical: cooperating surfaces share a window, progress, background, and input policy. The illusion fails if a transparent orchestration window steals clicks from applications.",
    principles: [
      "Derive transform and shape from one normalized progress value.",
      "Mask transparent window space so input passes through.",
      "Keep content steady while the surface does the expressive work.",
    ],
    starter: `import QtQuick
import Quickshell

PanelWindow {
    color: "transparent"

    Rectangle {
        id: drawer
        width: 420
        height: parent.height
    }
}`,
    solution: `import QtQuick
import Quickshell

PanelWindow {
    id: win
    property real openProgress: 0

    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    mask: Region { item: drawer }

    anchors {
        top: true
        right: true
        bottom: true
    }

    Rectangle {
        id: drawer
        x: width * (1 - win.openProgress)
        width: 420
        height: parent.height
        topLeftRadius: 28 * win.openProgress
        bottomLeftRadius: 28 * win.openProgress
        color: "#24212d"
    }

    Behavior on openProgress {
        NumberAnimation {
            duration: 420
            easing.type: Easing.OutCubic
        }
    }
}`,
    checks: [
      {
        label: "Use one motion source",
        hint: "Declare openProgress and derive x or radius from it.",
        test: code => /property\s+real\s+openProgress/.test(code) && /(?:x|radius|topLeftRadius)\s*:[^\n]*openProgress/.test(code),
      },
      {
        label: "Protect application input",
        hint: "Assign a Region mask to the visible drawer item.",
        test: code => /mask\s*:\s*Region\s*\{[\s\S]*item\s*:\s*drawer/.test(code),
      },
      {
        label: "Animate the shared progress",
        hint: "Add Behavior on openProgress with spatial easing.",
        test: code => /Behavior\s+on\s+openProgress[\s\S]*NumberAnimation/.test(code),
      },
    ],
    preview: "drawer",
  },
  {
    id: "capstone-shell",
    phase: "Capstone",
    number: "09",
    title: "Compose your living shell",
    kicker: "ShellRoot + modules + IPC",
    duration: "60 min",
    objective: "Assemble a thin entrypoint and one complete vertical slice.",
    concept:
      "Your capstone is not a giant dashboard. It is a small but complete shell product: per-screen bar, contextual drawer, one real service, state, semantic motion, keyboard/IPC routes, and designed degraded states.",
    principles: [
      "Compose modules; do not implement them inside shell.qml.",
      "Every major action gets a visual route and a stable command route.",
      "Validate reload, fullscreen, hotplug, failure, and reduced motion.",
    ],
    starter: `import Quickshell

ShellRoot {
    // Compose your shell here.
}`,
    solution: `//@ pragma ShellId my-living-shell
//@ pragma Env QS_NO_RELOAD_POPUP=1

import Quickshell
import Quickshell.Io
import qs.modules.bar
import qs.modules.drawer
import qs.state

ShellRoot {
    settings.watchFiles: true

    Bar {}
    Drawers {}

    IpcHandler {
        target: "shell"

        function toggleDrawer(): void {
            const state = ShellState.forScreen(
                Quickshell.screens[0]
            );
            if (state)
                state.drawerOpen = !state.drawerOpen;
        }
    }
}`,
    checks: [
      {
        label: "Keep the root compositional",
        hint: "Instantiate Bar and Drawers as modules.",
        test: code => /ShellRoot\s*\{[\s\S]*\bBar\s*\{\s*\}/.test(code) && /\bDrawers\s*\{\s*\}/.test(code),
      },
      {
        label: "Expose a stable action",
        hint: "Add an IpcHandler with a typed function.",
        test: code => /IpcHandler\s*\{[\s\S]*function\s+\w+\s*\([^)]*\)\s*:\s*void/.test(code),
      },
      {
        label: "Route action through shared state",
        hint: "Have the IPC function update ShellState instead of visual internals.",
        test: code => /ShellState\.forScreen/.test(code) && /drawerOpen\s*=/.test(code),
      },
    ],
    preview: "shell",
  },
];

const phases = ["QML foundations", "Reusable UI", "Data-driven UI", "Enter Quickshell", "Shell architecture", "Capstone"];
const storageKey = "qml-shellcraft-progress-v1";
const notesKey = "qml-shellcraft-notes-v1";

function readNumber(code: string, name: string, fallback: number) {
  const match = code.match(new RegExp(`${name}\\s*:\\s*(\\d+)`));
  return match ? Number(match[1]) : fallback;
}

function readColor(code: string, fallback: string) {
  const matches = [...code.matchAll(/#[0-9a-fA-F]{6}/g)];
  return matches.at(-1)?.[0] ?? fallback;
}

function ShellPreview({ lesson, code }: { lesson: Lesson; code: string }) {
  const [active, setActive] = useState(false);
  const width = Math.min(readNumber(code, "width", 180), 460);
  const height = Math.min(readNumber(code, "height", 52), 340);
  const radius = Math.min(readNumber(code, "radius", 18), 80);
  const color = readColor(code, "#c9b6ff");
  const hasMotion = /Behavior\s+on|NumberAnimation|Transition/.test(code);
  const hasHover = /containsMouse|hovered/.test(code);

  return (
    <div className={`preview-desktop preview-${lesson.preview}`}>
      <div className="preview-wallpaper" />
      <div className="preview-window window-one">
        <span />
        <span />
        <span />
      </div>
      <div className="preview-window window-two" />

      {lesson.preview === "layout" && (
        <div className="mock-bar horizontal">
          <b>1</b><span>2</span><span>3</span><i />
          <span>14:42</span><span className="green">87%</span>
        </div>
      )}

      {lesson.preview === "model" && (
        <div className="workspace-row">
          {[1, 2, 3, 4, 5].map(item => (
            <button key={item} className={active ? (item === 4 ? "selected" : "") : (item === 2 ? "selected" : "")} onClick={() => setActive(!active)}>{item}</button>
          ))}
        </div>
      )}

      {(lesson.preview === "bar" || lesson.preview === "shell") && (
        <div className="mock-bar horizontal full">
          <b>01</b><span>02</span><span>03</span><i />
          <span>14:42</span><span className="green">●</span>
        </div>
      )}

      {lesson.preview === "state" && (
        <div className="state-map">
          <span>Screen A</span><b className={active ? "on" : ""}>drawerOpen</b>
          <span>Screen B</span><b>closed</b>
        </div>
      )}

      {lesson.preview === "drawer" && (
        <>
          <div className="edge-rail"><b>01</b><span>02</span><i /><span>◦</span></div>
          <div className={`connected-drawer ${active ? "open" : ""}`}>
            <small>NOW PLAYING</small><strong>Glass Gardens</strong>
            <div className="wave"><i /><i /><i /><i /><i /></div>
          </div>
        </>
      )}

      {["surface", "component", "motion"].includes(lesson.preview) && (
        <button
          className={`qml-surface ${active ? "active" : ""} ${hasMotion ? "animated" : ""} ${hasHover ? "hoverable" : ""}`}
          style={{
            width: active && /width\s*:\s*[^\n]*\?/.test(code) ? Math.min(width + 60, 420) : width,
            height: active && /height\s*:\s*[^\n]*\?/.test(code) ? Math.min(height + 180, 300) : height,
            borderRadius: active ? Math.min(radius + 10, 60) : radius,
            background: active ? color : "#292633",
          }}
          onClick={() => setActive(!active)}
        >
          <span>{active ? "Launcher open" : "Launcher"}</span>
          <em>{active ? "click to reverse" : "click to inspect state"}</em>
        </button>
      )}

      <button className="preview-toggle" onClick={() => setActive(!active)} aria-label="Toggle preview state">
        state <span className={active ? "on" : ""}>{active ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}

function CourseMark() {
  return (
    <div className="course-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function Home() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>(() => Object.fromEntries(lessons.map(lesson => [lesson.id, lesson.starter])));
  const [completed, setCompleted] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const lesson = lessons[lessonIndex];
  const code = codes[lesson.id] ?? lesson.starter;
  const results = useMemo(() => lesson.checks.map(check => check.test(code)), [lesson, code]);
  const allPassing = results.every(Boolean);
  const progress = Math.round((completed.length / lessons.length) * 100);
  const filteredLessons = lessons.filter(item => `${item.title} ${item.phase} ${item.kicker}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      if (Array.isArray(saved.completed)) setCompleted(saved.completed);
      if (saved.codes && typeof saved.codes === "object") setCodes(current => ({ ...current, ...saved.codes }));
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) setNotes(savedNotes);
    } catch {
      // Device-local progress should never block the course.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ completed, codes }));
  }, [completed, codes, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(notesKey, notes);
  }, [notes, hydrated]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(value => !value);
      }
      if (event.altKey && event.key === "ArrowRight") {
        setLessonIndex(index => Math.min(index + 1, lessons.length - 1));
      }
      if (event.altKey && event.key === "ArrowLeft") {
        setLessonIndex(index => Math.max(index - 1, 0));
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const chooseLesson = (id: string) => {
    const nextIndex = lessons.findIndex(item => item.id === id);
    if (nextIndex >= 0) {
      setLessonIndex(nextIndex);
      setChecked(false);
      setHintOpen(false);
      setSolutionOpen(false);
      setPaletteOpen(false);
      setQuery("");
    }
  };

  const updateCode = (value: string) => {
    setCodes(current => ({ ...current, [lesson.id]: value }));
    setChecked(false);
  };

  const handleEditorKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const next = `${code.slice(0, target.selectionStart)}    ${code.slice(target.selectionEnd)}`;
    const cursor = target.selectionStart + 4;
    updateCode(next);
    requestAnimationFrame(() => {
      target.selectionStart = cursor;
      target.selectionEnd = cursor;
    });
  };

  const markComplete = () => {
    setCompleted(current => current.includes(lesson.id) ? current : [...current, lesson.id]);
    if (lessonIndex < lessons.length - 1) {
      setTimeout(() => chooseLesson(lessons[lessonIndex + 1].id), 420);
    }
  };

  return (
    <main className="course-shell">
      <aside className="course-rail">
        <div className="brand-block">
          <CourseMark />
          <div>
            <strong>QML<br />SHELLCRAFT</strong>
            <small>Interactive field course</small>
          </div>
        </div>

        <div className="progress-block">
          <div className="progress-copy"><span>Your path</span><b>{progress}%</b></div>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          <small>{completed.length} of {lessons.length} field lessons complete</small>
        </div>

        <nav className="lesson-nav" aria-label="Course lessons">
          {phases.map(phase => (
            <div className="phase-group" key={phase}>
              <p>{phase}</p>
              {lessons.filter(item => item.phase === phase).map(item => {
                const index = lessons.findIndex(entry => entry.id === item.id);
                const isActive = index === lessonIndex;
                const isComplete = completed.includes(item.id);
                return (
                  <button key={item.id} className={isActive ? "active" : ""} onClick={() => chooseLesson(item.id)}>
                    <span>{isComplete ? "✓" : item.number}</span>
                    <div><b>{item.title}</b><small>{item.duration}</small></div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <button className="command-button" onClick={() => setPaletteOpen(true)}>
          <span>Jump to a lesson</span><kbd>⌘ K</kbd>
        </button>
      </aside>

      <section className="lesson-stage">
        <header className="stage-header">
          <div className="breadcrumb"><span>{lesson.phase}</span><i /> <b>{lesson.number} / {lessons.length.toString().padStart(2, "0")}</b></div>
          <div className="stage-actions">
            <button onClick={() => setNotesOpen(value => !value)} className={notesOpen ? "active" : ""}>Field notes</button>
            <span className="saved-state"><i /> saved locally</span>
          </div>
        </header>

        <article className="lesson-content">
          <div className="lesson-intro">
            <div className="lesson-number">{lesson.number}</div>
            <p className="kicker">{lesson.kicker}</p>
            <h1>{lesson.title}</h1>
            <p className="objective">{lesson.objective}</p>
          </div>

          <div className="concept-grid">
            <div className="concept-copy">
              <span className="section-label">MENTAL MODEL</span>
              <p>{lesson.concept}</p>
            </div>
            <div className="principle-list">
              {lesson.principles.map((principle, index) => (
                <div key={principle}><span>0{index + 1}</span><p>{principle}</p></div>
              ))}
            </div>
          </div>

          <div className="mission-strip">
            <span>YOUR MISSION</span>
            <p>{lesson.objective}</p>
            <b>{lesson.duration}</b>
          </div>

          <div className="mobile-lab-note">The live lab follows this lesson on smaller screens.</div>

          {notesOpen && (
            <section className="notes-panel">
              <div><span className="section-label">FIELD NOTES</span><small>Private to this device</small></div>
              <textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Capture an insight, a question, or an idea for your shell…" />
            </section>
          )}
        </article>

        <footer className="lesson-footer">
          <button disabled={lessonIndex === 0} onClick={() => chooseLesson(lessons[lessonIndex - 1].id)}>← Previous</button>
          <span>Alt + arrows navigate</span>
          <button disabled={lessonIndex === lessons.length - 1} onClick={() => chooseLesson(lessons[lessonIndex + 1].id)}>Next lesson →</button>
        </footer>
      </section>

      <aside className="lab-panel">
        <header className="lab-header">
          <div><span className="live-dot" /><b>LIVE LAB</b><small>lesson_{lesson.number}.qml</small></div>
          <button onClick={() => updateCode(lesson.starter)}>Reset</button>
        </header>

        <section className="preview-panel">
          <div className="preview-label"><span>CONCEPTUAL PREVIEW</span><small>Click the surface to change state</small></div>
          <ShellPreview lesson={lesson} code={code} />
        </section>

        <section className="editor-panel">
          <div className="editor-toolbar">
            <span>QML</span>
            <small>browser checks · real rendering in Quickshell</small>
          </div>
          <div className="editor-wrap">
            <div className="line-numbers" aria-hidden="true">{code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div>
            <textarea
              ref={editorRef}
              value={code}
              onChange={event => updateCode(event.target.value)}
              onKeyDown={handleEditorKey}
              spellCheck={false}
              aria-label={`Code editor for ${lesson.title}`}
            />
          </div>
        </section>

        <section className={`checks-panel ${checked ? "checked" : ""}`}>
          <div className="checks-heading">
            <div><span>FIELD CHECKS</span><small>{results.filter(Boolean).length}/{results.length} passing</small></div>
            <button onClick={() => setHintOpen(value => !value)}>Hint</button>
          </div>
          <div className="checks-list">
            {lesson.checks.map((check, index) => (
              <div key={check.label} className={checked ? (results[index] ? "pass" : "fail") : "idle"}>
                <span>{checked ? (results[index] ? "✓" : "×") : index + 1}</span>
                <p>{check.label}</p>
              </div>
            ))}
          </div>
          {hintOpen && <div className="hint-box">{lesson.checks.find((_, index) => !results[index])?.hint ?? "Everything is in place. Run the checks."}</div>}
          {solutionOpen && <pre className="solution-box"><code>{lesson.solution}</code></pre>}
          <div className="check-actions">
            <button className="solution-button" onClick={() => setSolutionOpen(value => !value)}>{solutionOpen ? "Hide solution" : "Reveal solution"}</button>
            {!checked || !allPassing ? (
              <button className="run-button" onClick={() => setChecked(true)}>Run checks <span>⌘↵</span></button>
            ) : (
              <button className="complete-button" onClick={markComplete}>{completed.includes(lesson.id) ? "Completed ✓" : "Complete lesson →"}</button>
            )}
          </div>
        </section>
      </aside>

      {paletteOpen && (
        <div className="palette-backdrop" role="presentation" onMouseDown={() => setPaletteOpen(false)}>
          <section className="command-palette" role="dialog" aria-modal="true" aria-label="Jump to a lesson" onMouseDown={event => event.stopPropagation()}>
            <div className="palette-search"><span>⌕</span><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search concepts, lessons, or phases…" /><kbd>ESC</kbd></div>
            <div className="palette-results">
              {filteredLessons.map(item => (
                <button key={item.id} onClick={() => chooseLesson(item.id)}>
                  <span>{completed.includes(item.id) ? "✓" : item.number}</span>
                  <div><b>{item.title}</b><small>{item.phase} · {item.kicker}</small></div>
                  <i>→</i>
                </button>
              ))}
              {filteredLessons.length === 0 && <p>No lesson matches that search.</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
