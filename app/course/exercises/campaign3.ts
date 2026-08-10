/** Authored exercises for campaign 3 quests. See docs/EXERCISE_AUTHORING_SPEC.md. */
import type { AtlasExercise } from "./types.ts";

export const CAMPAIGN3_EXERCISES: Record<string, AtlasExercise> = {
"edge-ownership-charter": {
  starter: `import Quickshell
import QtQuick

ShellRoot {
    PanelWindow {
        width: 720
        height: 44
        color: "transparent"

        Rectangle {
            anchors.fill: parent
            radius: 12
            color: "#263244"

            Text {
                anchors.centerIn: parent
                text: "Workspace 3 · 09:42"
                color: "white"
            }
        }
    }
}`,
  solution: `import Quickshell
import QtQuick
import QtQuick.Layouts

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            required property ShellScreen modelData
            screen: modelData
            implicitHeight: 44
            exclusiveZone: implicitHeight
            color: "transparent"
            anchors {
                top: true
                left: true
                right: true
            }

            Rectangle {
                id: roundedBody
                anchors.fill: parent
                anchors.topMargin: 4
                radius: 10
                color: "#263244"
            }

            Rectangle {
                id: flatEdgeCap
                anchors.top: parent.top
                width: parent.width
                height: 14
                color: roundedBody.color
            }

            RowLayout {
                anchors.fill: parent
                anchors.margins: 10
                Text {
                    text: "Workspace 3"
                    color: "white"
                }
                Item { Layout.fillWidth: true }
                Text {
                    text: "09:42"
                    color: "white"
                }
            }
        }
    }
}`,
  checks: [
    { label: "Own a screen edge", hint: "Anchor the PanelWindow to at least one edge with an explicit true value.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?anchors\\s*\\{[^}]*\\b(?:top|bottom|left|right)\\s*:\\s*true", flags: "m" },
    { label: "Reserve the bar height", hint: "Give the anchored PanelWindow an exclusiveZone matching its implicit height.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?exclusiveZone\\s*:\\s*implicitHeight\\b", flags: "m" },
    { label: "Keep the spine compact", hint: "Set a deliberate bar-sized implicitHeight between 40 and 48 pixels.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?implicitHeight\\s*:\\s*4[0-8]\\b", flags: "m" },
  ],
  rules: ["Anchor every per-screen PanelWindow explicitly to its claimed edge.", "Match exclusiveZone to the compact implicitHeight so clients receive honest geometry.", "Keep the screen-contact side flat while rounding the edge that faces application content."],
  explanation: ["An edge-owned surface is mechanically attached to a screen boundary and reserves only the space it actually needs. This bar behaves like a harbour quay: unmistakably part of the shoreline without occupying the bay.", "Variants creates one PanelWindow for each entry in Quickshell.screens, while required property ShellScreen modelData supplies the corresponding screen. The top, left, and right anchors establish ownership, and exclusiveZone follows the 44-pixel implicitHeight.", "A floating pill may resemble a bar while reserving no edge space, so application windows can appear underneath it or collide with it. The failure becomes obvious when a maximized window ignores the decorative surface despite its bar-like styling."],
},
"bar-information-choreography": {
  starter: `import QtQuick
import QtQuick.Layouts

Rectangle {
    width: 720
    height: 48
    color: "#202733"

    RowLayout {
        anchors.fill: parent
        spacing: 24

        Text { text: "1 2 3 4"; color: "white" }
        Text {
            text: "Quarterly planning notes — final review with the design team"
            color: "white"
        }
        Text { text: "09:42"; color: "white" }
        Text { text: "VPN · 🔋"; color: "white" }
    }
}`,
  solution: `import QtQuick
import QtQuick.Layouts

Rectangle {
    id: barCanvas
    width: 720
    height: 48
    color: "#202733"

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 12
        anchors.rightMargin: 12
        spacing: 14

        Row {
            id: workspaceCluster
            spacing: 5
            Text { text: "●"; color: "#8aadf4" }
            Text { text: "2"; color: "white" }
            Text { text: "3"; color: "#8991a5" }
            Text { text: "4"; color: "#8991a5" }
        }

        Text {
            id: activeTask
            text: "Quarterly planning notes — final review with the design team"
            Layout.fillWidth: true
            elide: Text.ElideRight
            color: "white"
        }

        RowLayout {
            id: statusCluster
            spacing: 7

            Text {
                id: stableClock
                text: "09:42"
                Layout.preferredWidth: 72
                horizontalAlignment: Text.AlignHCenter
                font.family: "monospace"
                color: "white"
            }
            Text { text: "VPN"; color: "#a6da95" }
            Text { text: "🔋"; color: "white" }
        }
    }
}`,
  checks: [
    { label: "Let the task breathe", hint: "Give activeTask the remaining layout width and elide its excess text.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*activeTask\\b[\\s\\S]*?Layout\\.fillWidth\\s*:\\s*true[\\s\\S]*?elide\\s*:\\s*Text\\.ElideRight", flags: "m" },
    { label: "Cluster related signals", hint: "Place the workspace indicators inside a nested Row rather than the outer flat layout.", pattern: "RowLayout\\s*\\{[\\s\\S]*?Row\\s*\\{\\s*id\\s*:\\s*workspaceCluster\\b", flags: "m" },
    { label: "Stabilize the clock", hint: "Reserve a predictable preferred width for stableClock.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*stableClock\\b[\\s\\S]*?Layout\\.preferredWidth\\s*:\\s*(?:6[4-9]|[7-9]\\d|1\\d{2})\\b", flags: "m" },
  ],
  rules: ["Cluster workspace indicators separately from tray and system status signals.", "Give the active task flexible width and elide its tail when space runs out.", "Reserve a stable clock width so changing digits cannot reflow neighbouring content."],
  explanation: ["Information choreography arranges signals so the eye reads them as a sentence instead of a widget inventory. Workspace position leads into the active task, while time and system state form a compact closing phrase.", "The outer RowLayout contains a workspaceCluster Row, a flexible activeTask Text, and a statusCluster RowLayout. Layout.fillWidth lets the task absorb changing space, Text.ElideRight trims its tail, and stableClock uses Layout.preferredWidth with a monospace font.", "A flat, equally spaced row gives every signal the same emphasis and lets a long title push or clip the clock. Developers notice the failure as jitter during minute changes, unpredictable title clipping, and slow visual scanning."],
},
"bar-overflow-ladder": {
  starter: `import QtQuick
import QtQuick.Layouts

Rectangle {
    id: root
    width: 420
    height: 48
    color: "#202733"

    RowLayout {
        anchors.fill: parent

        Rectangle {
            Layout.preferredWidth: root.width * 0.10
            Layout.preferredHeight: root.width * 0.10
            color: "#8aadf4"
        }
        Text {
            Layout.preferredWidth: root.width * 0.35
            font.pixelSize: root.width * 0.04
            text: "Current workspace"
        }
        Text {
            font.pixelSize: root.width * 0.04
            text: "Weather · 18°C · Clear"
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Layouts

Rectangle {
    id: root
    width: 520
    height: 52
    color: "#202733"

    RowLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 8

        Rectangle {
            id: emergencyTarget
            property int priority: 3
            implicitWidth: 44
            implicitHeight: 44
            radius: 8
            color: "#8aadf4"

            Text {
                anchors.centerIn: parent
                text: "1"
            }
            TapHandler {
                onTapped: root.forceActiveFocus()
            }
        }

        Text {
            id: activeLabel
            property int priority: 2
            text: "Current workspace · Quarterly planning review"
            Layout.fillWidth: true
            elide: Text.ElideRight
            visible: root.width > 180
            color: "white"
        }

        Text {
            id: weatherSecondary
            property int priority: 1
            text: "18°C · Clear"
            visible: root.width > 560
            color: "#cad3f5"
        }

        Rectangle {
            id: decorativeBadge
            property int priority: 0
            implicitWidth: 28
            implicitHeight: 28
            visible: root.width > 720
            radius: 14
            color: "#494d64"
        }
    }
}`,
  checks: [
    { label: "Hide lower-value status first", hint: "Bind weatherSecondary visibility to a root.width threshold.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*weatherSecondary\\b[\\s\\S]*?visible\\s*:\\s*root\\.width\\s*>\\s*\\d+", flags: "m" },
    { label: "Preserve the essential target", hint: "Keep emergencyTarget at a fixed 44 by 44 implicit size.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*emergencyTarget\\b[\\s\\S]*?implicitWidth\\s*:\\s*44\\b[\\s\\S]*?implicitHeight\\s*:\\s*44\\b", flags: "m" },
    { label: "Shorten before hiding", hint: "Use right-side elision on activeLabel before its visibility threshold is reached.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*activeLabel\\b[\\s\\S]*?elide\\s*:\\s*Text\\.ElideRight", flags: "m" },
  ],
  rules: ["Hide decorative and secondary signals at wider thresholds than essential content.", "Elide the active label before removing it from the narrowest layout.", "Hold every essential interactive target at no less than 44 pixels in each dimension."],
  explanation: ["An overflow ladder is an ordered plan for what compresses, shortens, and disappears as space becomes scarce. The bar needs one because portrait and narrow screens cannot preserve every signal at full length.", "Each child declares a priority, while visible bindings compare root.width with thresholds chosen for its value. activeLabel uses Text.ElideRight during compression, and emergencyTarget keeps fixed 44-pixel implicitWidth and implicitHeight values.", "Uniform scaling preserves low-value decoration by making everything tiny, including controls and the clock. The mistake appears as unreadable text and hit targets that become difficult to tap long before the bar actually runs out of optional content."],
},
"edge-fullscreen-contract": {
  starter: `import QtQml

QtObject {
    id: edgePolicy
    property bool fullscreen: false

    readonly property real opacity: fullscreen ? 0 : 1
    readonly property int exclusiveZone: 40
    readonly property real edgeRadius: 16
    readonly property int inputRegionHeight: 40
    readonly property bool ornamentsVisible: true
}`,
  solution: `import QtQml

QtObject {
    id: edgePolicy
    property bool fullscreen: false

    readonly property int exclusiveZone: fullscreen ? 0 : 40
    readonly property real edgeRadius: fullscreen ? 0 : 16
    readonly property bool barVisible: !fullscreen
    readonly property real barOpacity: fullscreen ? 0 : 1
    readonly property int inputRegionHeight: fullscreen ? 0 : 40
    readonly property bool ornamentsVisible: !fullscreen
    readonly property bool surfaceTransparent: fullscreen
}`,
  checks: [
    { label: "Release excluded space", hint: "Derive exclusiveZone directly from the shared fullscreen property.", pattern: "readonly\\s+property\\s+int\\s+exclusiveZone\\s*:[^\\n;]*\\bfullscreen\\b", flags: "m" },
    { label: "Flatten fullscreen geometry", hint: "Derive edgeRadius from the same fullscreen decision.", pattern: "readonly\\s+property\\s+real\\s+edgeRadius\\s*:[^\\n;]*\\bfullscreen\\b", flags: "m" },
    { label: "Coordinate visibility", hint: "Bind barVisible or barOpacity to fullscreen instead of maintaining an independent flag.", pattern: "readonly\\s+property\\s+(?:bool|real)\\s+(?:barVisible|barOpacity)\\s*:[^\\n;]*\\bfullscreen\\b", flags: "m" },
  ],
  rules: ["Derive excluded space directly from the shared fullscreen property.", "Flatten edge geometry and remove ornaments whenever fullscreen is active.", "Collapse visibility, opacity, and input-region height through the same fullscreen decision."],
  explanation: ["A fullscreen contract is one policy decision that controls every mechanical and visual consequence of yielding the edge. It keeps the bar, its reserved space, its ornament, and its input footprint in the same mode.", "The edgePolicy QtObject exposes fullscreen as its single source of truth. readonly property bindings derive exclusiveZone, edgeRadius, barVisible, barOpacity, inputRegionHeight, and ornament state from that one boolean.", "Fading opacity alone leaves an invisible exclusion zone and input region above the fullscreen client. A developer notices that the application cannot occupy the entire screen or that clicks near the supposedly hidden edge never reach it."],
},
"edge-spine-boss": {
  starter: `import Quickshell
import QtQuick

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            screen: modelData
            width: 640
            height: 44
            color: "#202733"

            Text {
                anchors.centerIn: parent
                text: "Workspace 3 · Online · 09:42"
                color: "white"
            }
        }
    }
}`,
  solution: `import Quickshell
import QtQuick
import QtQuick.Layouts

ShellRoot {
    id: shell
    required property QtObject statusService

    Variants {
        model: Quickshell.screens

        PanelWindow {
            id: edgeWindow
            required property ShellScreen modelData
            screen: modelData
            implicitHeight: 44
            exclusiveZone: shell.statusService.fullscreen ? 0 : 44
            color: "transparent"
            anchors { top: true; left: true; right: true }

            FocusScope {
                id: barInput
                anchors.fill: parent
                visible: !shell.statusService.fullscreen
                focus: true
                Keys.onEscapePressed: barInput.focus = false

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 10
                    anchors.rightMargin: 10
                    spacing: 8

                    Text { text: "WS 3"; color: "white" }
                    Text {
                        id: activeTask
                        text: "Shellcraft lesson"
                        Layout.fillWidth: true
                        elide: Text.ElideRight
                        color: "white"
                    }
                    Text {
                        id: sharedStatus
                        visible: edgeWindow.width > 620
                        text: shell.statusService.available ? shell.statusService.status : "Offline"
                        color: "white"
                    }
                    Rectangle {
                        id: keyboardTarget
                        implicitWidth: 44
                        implicitHeight: 44
                        radius: 8
                        color: "#8aadf4"
                        Accessible.role: Accessible.Button
                        Accessible.name: "Open status"
                        TapHandler { onTapped: barInput.forceActiveFocus() }
                    }
                }
            }

            mask: Region { item: barInput }
        }
    }
}`,
  checks: [
    { label: "Track screens with typed variants", hint: "Bind Variants to Quickshell.screens and declare modelData as a required ShellScreen property.", pattern: "Variants\\s*\\{[\\s\\S]*?model\\s*:\\s*Quickshell\\.screens[\\s\\S]*?PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData\\b", flags: "m" },
    { label: "Coordinate edge exclusion", hint: "Set exclusiveZone explicitly on the per-screen PanelWindow.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?exclusiveZone\\s*:\\s*(?!0\\b)[^;\\n}]+", flags: "m" },
    { label: "Read the shared service", hint: "Inject statusService as a required QtObject and use its available and status properties.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+statusService\\b[\\s\\S]*?statusService\\.available\\s*\\?[\\s\\S]*?statusService\\.status", flags: "m" },
  ],
  rules: ["Create and retire one typed PanelWindow with each entry in Quickshell.screens.", "Drive fullscreen exclusion and visibility from the shared injected statusService.", "Hide secondary status before compressing the 44-pixel accessible action target."],
  explanation: ["A production edge spine combines screen lifecycle, shared state, responsive hierarchy, and input behaviour in one composed surface. Every monitor receives a stable bar without turning each indicator into an independent observer.", "Variants follows Quickshell.screens, and required property ShellScreen modelData binds each PanelWindow to its own screen. The injected statusService supplies fullscreen, available, and status values, while exclusiveZone, responsive visibility, elision, keyboard focus, and the Region mask shape the resulting surface.", "Without typed per-screen variants, hotplug can leave orphaned windows; without priority collapse, portrait layouts clip; and without shared service state, indicators can disagree. Developers see stale bars after unplugging a display, tiny or missing targets at narrow widths, or conflicting status messages along the same edge."],
},
"trigger-popout-contract": {
  starter: `import QtQuick

Item {
    id: floatingCard
    property var content
    property var trigger
    property bool open: false

    x: 560
    y: 48
    visible: open
    width: card.implicitWidth
    height: card.implicitHeight

    Rectangle {
        id: card
        implicitWidth: 240
        implicitHeight: 160
        radius: 12
    }
}`,
  solution: `import QtQuick

Item {
    id: hingedPopout
    required property Item trigger
    required property QtObject action
    readonly property bool open: action.checked

    x: trigger.x
    y: trigger.y + trigger.height
    visible: open
    width: popoutSurface.implicitWidth
    height: popoutSurface.implicitHeight

    Rectangle {
        id: popoutSurface
        implicitWidth: 240
        implicitHeight: 160
        radius: 12

        Text {
            anchors.centerIn: parent
            text: "Connection actions"
        }

        TapHandler {
            onTapped: action.trigger()
        }
    }
}`,
  checks: [
    { label: "Require the opening trigger", hint: "Declare the trigger Item as a required component input.", pattern: "Item\\s*\\{[\\s\\S]*?\\brequired\\s+property\\s+Item\\s+trigger\\b", flags: "m" },
    { label: "Require the shared action", hint: "Accept the action object that owns the open state and activation.", pattern: "Item\\s*\\{[\\s\\S]*?\\brequired\\s+property\\s+QtObject\\s+action\\b", flags: "m" },
    { label: "Place from the hinge", hint: "Bind x or y to a coordinate on the trigger instead of a fixed global position.", pattern: "Item\\s*\\{[\\s\\S]*?\\b(?:x|y)\\s*:\\s*[^\\n]*\\btrigger\\.(?:x|y)\\b", flags: "m" },
  ],
  rules: ["Require the opening trigger instead of accepting an optional origin.", "Drive visibility from the shared action object's state.", "Derive the popout position from the trigger's geometry."],
  explanation: ["A trigger-owned popout treats the control that opened it as its visible hinge. This borough needs that relationship so placement, state, and the eventual focus return all refer to the same origin.", "The component declares required property Item trigger and required property QtObject action. Its open value follows action.checked, while x and y bind directly to trigger coordinates and keep the local Rectangle content inside the reusable component.", "A global popup manager can display a card without knowing which control requested it. The defect appears as context floating in an arbitrary place, and later as focus returning nowhere because the opener was never part of the contract."],
},
"constrained-popout-placement": {
  starter: `import QtQuick

Rectangle {
    id: fixedPopout
    required property real triggerX
    required property real triggerY

    x: 640
    y: 20
    width: 260
    height: 180
    radius: 12

    Text {
        anchors.centerIn: parent
        text: "Display settings"
    }
}`,
  solution: `import QtQuick

Rectangle {
    id: boundedPopout
    required property real triggerX
    required property real triggerY
    required property real screenWidth
    required property real screenHeight

    implicitWidth: 260
    implicitHeight: 180
    readonly property real gap: 8

    x: Math.max(0, Math.min(
        (triggerX + implicitWidth > screenWidth)
            ? triggerX - implicitWidth - gap
            : triggerX + gap,
        screenWidth - implicitWidth))
    y: Math.max(0, Math.min(
        (triggerY + implicitHeight + gap > screenHeight)
            ? triggerY - implicitHeight - gap
            : triggerY + gap,
        screenHeight - implicitHeight))

    radius: 12

    Text {
        anchors.centerIn: parent
        text: "Display settings"
    }
}`,
  checks: [
    { label: "Follow the trigger coordinates", hint: "Make both final coordinates depend on triggerX and triggerY.", pattern: "Rectangle\\s*\\{(?=[\\s\\S]*?\\bx\\s*:[\\s\\S]*?\\btriggerX\\b)(?=[\\s\\S]*?\\by\\s*:[\\s\\S]*?\\btriggerY\\b)[\\s\\S]*?\\}", flags: "m" },
    { label: "Clamp to the monitor", hint: "Use nested Math.max and Math.min bounds involving a screen dimension.", pattern: "Rectangle\\s*\\{[\\s\\S]*?\\b(?:x|y)\\s*:\\s*Math\\.max\\s*\\([\\s\\S]*?Math\\.min\\s*\\([\\s\\S]*?(?:screenWidth|screenHeight)", flags: "m" },
    { label: "Flip when space runs out", hint: "Use a ternary that compares implicit size with an available screen dimension.", pattern: "Rectangle\\s*\\{[\\s\\S]*?\\b(?:x|y)\\s*:[\\s\\S]*?(?:implicitWidth|implicitHeight)[\\s\\S]*?(?:screenWidth|screenHeight)[\\s\\S]*?\\?[\\s\\S]*?:", flags: "m" },
  ],
  rules: ["Measure placement with implicitWidth and implicitHeight.", "Flip to the opposite side when the preferred direction exceeds a screen boundary.", "Clamp each final coordinate inside the monitor after choosing a side."],
  explanation: ["Constrained placement keeps contextual content close to its trigger without assuming every monitor has the same shape. The popout needs its natural size and the current screen bounds because portrait layouts and scaling reduce the space available in different directions.", "The x and y bindings first use a ternary to select the preferred or flipped side. Math.min limits the far edge, Math.max protects the near edge, and implicitWidth or implicitHeight supplies the actual footprint being fitted.", "Fixed global coordinates can look correct on one development display while sending the card partly off-screen elsewhere. A developer notices clipped controls or a popout visually detached from its trigger when testing a smaller, rotated, or scaled monitor."],
},
"dismissal-focus-protocol": {
  starter: `import QtQuick

FocusScope {
    id: splitDismissal
    required property Item returnTarget
    visible: true
    width: 280
    height: 180
    focus: true

    Keys.onEscapePressed: splitDismissal.visible = false

    Rectangle {
        anchors.fill: parent
        radius: 12
    }

    MouseArea {
        anchors.fill: parent
        onClicked: splitDismissal.visible = false
    }
}`,
  solution: `import QtQuick

FocusScope {
    id: dismissalScope
    required property Item returnTarget
    visible: true
    width: 280
    height: 180
    focus: visible

    function close(): void {
        visible = false
        returnTarget.forceActiveFocus()
    }

    Keys.onEscapePressed: close()

    Rectangle {
        anchors.fill: parent
        radius: 12

        Text {
            anchors.centerIn: parent
            text: "Session actions"
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: dismissalScope.close()
    }
}`,
  checks: [
    { label: "Own one close transition", hint: "Declare a typed close function that hides the scope and restores focus.", pattern: "FocusScope\\s*\\{[\\s\\S]*?function\\s+close\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?visible\\s*=\\s*false[\\s\\S]*?forceActiveFocus\\s*\\(", flags: "m" },
    { label: "Route Escape through close", hint: "Call close from Keys.onEscapePressed instead of assigning visible inline.", pattern: "FocusScope\\s*\\{[\\s\\S]*?Keys\\.onEscapePressed\\s*:\\s*(?:\\w+\\.)?close\\s*\\(\\s*\\)", flags: "m" },
    { label: "Route outside dismissal through close", hint: "Make the MouseArea click handler call the same close function.", pattern: "MouseArea\\s*\\{[\\s\\S]*?onClicked\\s*:\\s*(?:\\w+\\.)?close\\s*\\(\\s*\\)", flags: "m" },
  ],
  rules: ["Put visibility cleanup and focus restoration in one close function.", "Call the shared close function from the Escape key path.", "Send the outside-click path through the same close transition."],
  explanation: ["A dismissal protocol is one closing checklist shared by every way out of a popout. This FocusScope needs it because hiding the surface and restoring keyboard focus are two parts of the same state transition.", "The solution defines function close(): void, sets visible to false there, and calls returnTarget.forceActiveFocus(). Both Keys.onEscapePressed and the outside MouseArea onClicked handler invoke that function instead of maintaining separate cleanup bodies.", "Independent handlers gradually produce incompatible closed states. The failure becomes visible when Escape hides the card but keyboard input remains stranded, or an outside click removes the surface without returning focus to the surviving trigger."],
},
"popout-control-grammar": {
  starter: `import QtQuick

Rectangle {
    id: tinyAudioToggle
    required property QtObject action

    width: 32
    height: 32
    radius: 5
    color: mouse.containsMouse ? "#557799" : "#334455"

    Text {
        anchors.centerIn: parent
        text: "M"
    }

    MouseArea {
        id: mouse
        anchors.fill: parent
        hoverEnabled: true
        onClicked: action.trigger()
    }
}`,
  solution: `import QtQuick

Rectangle {
    id: muteControl
    required property QtObject action

    implicitWidth: 44
    implicitHeight: 44
    radius: 8
    activeFocusOnTab: true
    Accessible.role: Accessible.Button
    Accessible.name: "Mute microphone"
    Accessible.description: "Toggles microphone capture"
    color: tap.pressed ? "#6688aa" : hover.hovered ? "#557799" : "#334455"

    function activate(): void {
        action.trigger()
    }

    Text {
        anchors.centerIn: parent
        text: "M"
    }

    HoverHandler {
        id: hover
    }

    TapHandler {
        id: tap
        onTapped: muteControl.activate()
    }

    Keys.onSpacePressed: activate()
    Keys.onReturnPressed: activate()
}`,
  checks: [
    { label: "Use the control target token", hint: "Give the control both a 44-pixel implicit width and height.", pattern: "Rectangle\\s*\\{(?=[\\s\\S]*?\\bimplicitWidth\\s*:\\s*44\\b)(?=[\\s\\S]*?\\bimplicitHeight\\s*:\\s*44\\b)[\\s\\S]*?\\}", flags: "m" },
    { label: "Expose accessible semantics", hint: "Pair an Accessible role with an Accessible name on the control.", pattern: "Rectangle\\s*\\{(?=[\\s\\S]*?Accessible\\.role\\s*:)(?=[\\s\\S]*?Accessible\\.name\\s*:)[\\s\\S]*?\\}", flags: "m" },
    { label: "Offer pointer and keyboard activation", hint: "Keep a TapHandler and route Space or Return to activation.", pattern: "Rectangle\\s*\\{(?=[\\s\\S]*?TapHandler\\s*\\{)(?=[\\s\\S]*?Keys\\.on(?:Space|Return)Pressed\\s*:)[\\s\\S]*?\\}", flags: "m" },
  ],
  rules: ["Give every popout control a 44-pixel semantic target size.", "Derive one state-layer color from the shared hover and press handlers.", "Provide accessible metadata and keyboard activation beside pointer input."],
  explanation: ["A control grammar is a repeatable structural recipe for how controls look, respond, and describe themselves. Popout controls need one grammar so a toggle behaves like part of the same system as nearby sliders, menus, and action groups.", "The Rectangle uses implicitWidth and implicitHeight tokens of 44, while HoverHandler and TapHandler feed a single color binding for the interaction state layer. Accessible.role, Accessible.name, activeFocusOnTab, and the Space and Return handlers expose the same action through assistive technology, keyboard, and pointer routes.", "Feature-specific hover literals and improvised key handlers make behavior vary according to whoever authored each control. Users notice inconsistent feedback and missing keyboard routes, while maintainers cannot audit accessibility or interaction states as one coherent family."],
},
"popout-family-boss": {
  starter: `import QtQuick
import Quickshell

PanelWindow {
    id: decorativePopout
    color: "transparent"
    width: 320
    height: 220
    visible: true

    Rectangle {
        anchors.centerIn: parent
        width: 280
        height: 180
        radius: 14

        Text {
            anchors.centerIn: parent
            text: "Quick settings"
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

PanelWindow {
    id: boroughPopout
    required property Item trigger

    color: "transparent"
    width: 320
    height: 220
    visible: true
    exclusiveZone: 0
    mask: Region {
        item: popoutSurface
    }

    function close(): void {
        visible = false
        trigger.forceActiveFocus()
    }

    Rectangle {
        id: popoutSurface
        anchors.centerIn: parent
        width: 280
        height: 180
        radius: 14
        focus: true

        Text {
            anchors.centerIn: parent
            text: "Quick settings"
        }

        Keys.onEscapePressed: boroughPopout.close()
    }
}`,
  checks: [
    { label: "Mask the transparent panel", hint: "Give the PanelWindow a color binding and a Region mask whose item is the visible surface.", pattern: "PanelWindow\\s*\\{(?=[\\s\\S]*?\\bcolor\\s*:)(?=[\\s\\S]*?\\bmask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*\\w+\\s*\\})[\\s\\S]*?\\}", flags: "m" },
    { label: "Keep the opener as owner", hint: "Require the Item that triggered this popout.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?\\brequired\\s+property\\s+Item\\s+trigger\\b", flags: "m" },
    { label: "Dismiss and restore focus", hint: "Restore focus to trigger inside close and call close from Escape.", pattern: "PanelWindow\\s*\\{(?=[\\s\\S]*?function\\s+close\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?trigger\\.forceActiveFocus\\s*\\()(?=[\\s\\S]*?Keys\\.onEscapePressed\\s*:\\s*(?:\\w+\\.)?close\\s*\\()[\\s\\S]*?\\}", flags: "m" },
  ],
  rules: ["Require every shipped popout window to retain its opening trigger.", "Mask the transparent PanelWindow to its single visible popout surface.", "Restore focus to the trigger whenever the shared close path dismisses the window."],
  explanation: ["A coherent popout family shares behavioral attachment, not merely card colors and corner radii. Each PanelWindow must remain owned by its trigger, accept input only over visible content, and close without breaking the keyboard route.", "The window declares required property Item trigger, stays transparent, and assigns mask: Region with item: popoutSurface. Its typed close function hides the window and calls trigger.forceActiveFocus(), while Keys.onEscapePressed routes dismissal through that function.", "A transparent panel without the correct mask can invisibly capture clicks across empty desktop space. Missing ownership or focus restoration creates a second boss-level failure: the card looks attached but Escape strands focus, which becomes obvious when keyboard navigation cannot continue from the opener."],
},
"desktop-entry-index": {
  starter: `pragma Singleton
import QtQml

QtObject {
    id: applicationIndex

    function search(query: string): var {
        return scanDesktopFiles(query)
    }

    function launch(name: string): void {
        desktopLauncher.launch(name)
    }

    required property QtObject desktopLauncher
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    id: applicationIndex

    required property QtObject entryProvider
    required property QtObject desktopLauncher

    property var indexedEntries: []
    readonly property var entries: indexedEntries

    function index(): void {
        indexedEntries = entryProvider.normalizedEntries()
    }

    function search(query: string): var {
        var needle = query.toLowerCase()
        return entries.filter(entry => !entry.hidden
                              && entry.name.toLowerCase().includes(needle))
    }

    function launch(id: string): void {
        var entry = entries.find(candidate => candidate.id === id)
        if (!entry || entry.hidden)
            return
        desktopLauncher.launchById(entry.id)
    }

    Component.onCompleted: index()
}`,
  checks: [
    { label: "Declare a shared singleton", hint: "Place pragma Singleton before the application-index QtObject.", pattern: "^\\s*pragma\\s+Singleton\\b", flags: "m" },
    { label: "Build the readonly catalogue once", hint: "Expose readonly entries and populate its backing store from Component.onCompleted.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+(?:var|list<QtObject>)\\s+entries\\s*:[\\s\\S]*?Component\\.onCompleted\\s*:\\s*index\\s*\\(\\s*\\)", flags: "m" },
    { label: "Launch only a validated stable id", hint: "Give launch a typed id parameter and find the matching indexed entry before invoking the launcher.", pattern: "function\\s+launch\\s*\\(\\s*id\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?entries\\.find\\s*\\([\\s\\S]*?\\.id\\s*===\\s*id[\\s\\S]*?launchById\\s*\\(", flags: "m" },
  ],
  rules: ["Populate the normalized desktop-entry catalogue exactly once when the singleton completes.", "Exclude hidden entries while searching the cached catalogue.", "Resolve every launch request through a stable entry id before handing it to the launcher."],
  explanation: ["An application index is a shared catalogue of normalized desktop entries, including their stable identities and visibility. A launcher needs one catalogue because rereading desktop files during every query would put filesystem work directly in the typing path.", "The singleton exposes readonly property var entries as a view of indexedEntries, then calls index() from Component.onCompleted. search(query) filters that cached list, while function launch(id: string): void uses entries.find() to validate the stable id before calling desktopLauncher.launchById().", "The tempting failure is to scan the desktop-entry directories on each keystroke and launch whatever raw display name the user selected. The launcher then visibly stalls while typing, and renamed or maliciously crafted display text can resolve to the wrong target."],
},
"fuzzy-ranking-engine": {
  starter: `import QtQuick

Item {
    id: rankingSurface
    required property QtObject source

    ListView {
        anchors.fill: parent
        model: source.values
            .filter(value => value.score > 0)
            .sort((a, b) => b.score - a.score)

        delegate: Text {
            required property var modelData
            text: modelData.label
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

Item {
    id: rankingSurface
    required property QtObject source

    ScriptModel {
        id: ranked
        values: source.values
            .filter(value => value.score > 0)
            .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    }

    ListView {
        anchors.fill: parent
        model: ranked

        delegate: Text {
            required property var modelData
            text: modelData.label
        }
    }
}`,
  checks: [
    { label: "Preserve result objects", hint: "Place the ranked values in a ScriptModel instead of binding the view to a fresh array.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?\\bid\\s*:\\s*ranked\\b[\\s\\S]*?\\bvalues\\s*:", flags: "m" },
    { label: "Sort in the model layer", hint: "The ScriptModel values binding should filter and sort before delegates see results.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?\\bvalues\\s*:[\\s\\S]*?\\.sort\\s*\\(", flags: "m" },
    { label: "Break equal-score ties", hint: "After comparing scores, compare stable ids so equal matches keep deterministic order.", pattern: "\\.sort\\s*\\(\\s*\\(a\\s*,\\s*b\\)\\s*=>\\s*b\\.score\\s*-\\s*a\\.score\\s*\\|\\|\\s*a\\.id\\.localeCompare\\s*\\(\\s*b\\.id\\s*\\)", flags: "m" },
  ],
  rules: ["Rank source values inside a ScriptModel rather than inside a view delegate or model binding.", "Sort first by descending match score.", "Resolve equal scores by comparing stable result ids deterministically."],
  explanation: ["Fuzzy ranking orders approximate text matches by relevance, while stable identity means the same result object survives when its position changes. A keyboard launcher needs both so hover, focus, and delegate state remain attached to the intended application.", "ScriptModel owns the values binding and evaluates source.values.filter(...).sort(...) outside the delegates. The comparator uses score as its primary key and id.localeCompare() after || as an explicit tie-breaker, while ListView binds model directly to ranked.", "A plain filtered and sorted JavaScript array is recreated whenever dependencies change, and a score-only comparator leaves ties free to move. Users notice the failure when highlighted rows flicker, keyboard selection jumps, or two equally relevant applications exchange places between keystrokes."],
},
"launcher-keyboard-route": {
  starter: `import QtQuick

FocusScope {
    id: launcher
    property int activeIndex: 0
    property var results: []
    required property QtObject launcherService

    function activateCurrent(): void {
        launcherService.launchById(results[activeIndex].id)
    }

    TextInput {
        id: queryInput
        focus: true
    }
}`,
  solution: `import QtQuick

FocusScope {
    id: launcher

    required property var results
    required property QtObject launcherService
    required property QtObject previousFocus
    property string activeResultId: ""

    function moveSelection(direction: int): void {
        if (results.length === 0) {
            activeResultId = ""
            return
        }
        var current = results.findIndex(entry => entry.id === activeResultId)
        var next = (current + direction + results.length) % results.length
        activeResultId = results[next].id
    }

    function activateCurrent(): void {
        var selected = results.find(entry => entry.id === activeResultId)
        if (selected)
            launcherService.launchById(selected.id)
    }

    function closeLauncher(): void {
        previousFocus.forceActiveFocus()
    }

    TextInput {
        id: queryInput
        focus: true
        Keys.onUpPressed: launcher.moveSelection(-1)
        Keys.onDownPressed: launcher.moveSelection(1)
        Keys.onReturnPressed: launcher.activateCurrent()
        Keys.onEscapePressed: launcher.closeLauncher()
    }

    Text {
        visible: false
        text: results.length + " results"
        Accessible.role: Accessible.AlertMessage
        Accessible.name: text
    }
}`,
  checks: [
    { label: "Select by stable identity", hint: "Store the active result as a string id rather than as a row index.", pattern: "FocusScope\\s*\\{[\\s\\S]*?\\bproperty\\s+string\\s+activeResultId\\s*:", flags: "m" },
    { label: "Announce result counts", hint: "Add a hidden Text element with the Accessible.AlertMessage role.", pattern: "Text\\s*\\{[\\s\\S]*?Accessible\\.role\\s*:\\s*Accessible\\.AlertMessage\\b", flags: "m" },
    { label: "Provide an escape route", hint: "Handle Escape from the focused query input and restore the previous focus context.", pattern: "TextInput\\s*\\{[\\s\\S]*?Keys\\.onEscapePressed\\s*:\\s*launcher\\.closeLauncher\\s*\\(\\s*\\)", flags: "m" },
  ],
  rules: ["Keep activeResultId tied to a result identity even when ranking changes row positions.", "Route arrow and activation keys through the focused query input.", "Return focus to the previous context on Escape and announce the current result count accessibly."],
  explanation: ["A keyboard route defines how focus, navigation, activation, and closure work without a pointer. Stable selection matters here because search results can reorder while the user is still typing or listening to announcements.", "The FocusScope stores property string activeResultId, and moveSelection() converts temporary positions back into stable result ids. The focused TextInput handles arrow, Return, and Escape keys, while a hidden Text with Accessible.role: Accessible.AlertMessage reports results.length.", "An activeIndex can continue pointing at the same row number after that row acquires a different application. The user notices when pressing Return launches a result other than the highlighted or spoken one, which is why activation performs a fresh id lookup."],
},
"safe-search-providers": {
  starter: `import QtQml

QtObject {
    id: calculatorProvider
    required property QtObject resultSink

    function query(text): var {
        var result = eval(text)
        resultSink.publish(result)
        return result
    }

    property bool includeClipboardHistory: true
}`,
  solution: `import QtQml

QtObject {
    id: calculatorProvider

    required property QtObject calculatorService
    required property QtObject resultSink

    property int currentRequestId: 0
    readonly property int maxResults: 8
    readonly property string allowedCharacters: "0123456789+-*/(). "

    function beginRequest(requestId: int): void {
        currentRequestId = requestId
    }

    function isAllowed(text: string): bool {
        if (text.length === 0)
            return false
        for (var index = 0; index < text.length; index += 1) {
            if (!allowedCharacters.includes(text.charAt(index)))
                return false
        }
        return true
    }

    function query(text: string, requestId: int): void {
        if (requestId !== currentRequestId)
            return
        if (!isAllowed(text))
            return
        var result = calculatorService.evaluateValidated(text)
        if (requestId !== currentRequestId)
            return
        resultSink.publish(requestId, [result].slice(0, maxResults))
    }
}`,
  checks: [
    { label: "Type the provider contract", hint: "Accept both typed query text and a typed request generation, and return void.", pattern: "function\\s+query\\s*\\(\\s*text\\s*:\\s*string\\s*,\\s*requestId\\s*:\\s*int\\s*\\)\\s*:\\s*void\\s*\\{", flags: "m" },
    { label: "Drop obsolete work", hint: "Compare the query requestId with the provider's currentRequestId before publishing.", pattern: "function\\s+query\\s*\\([^)]*requestId\\s*:\\s*int[^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?requestId\\s*!==\\s*currentRequestId", flags: "m" },
    { label: "Fence and limit results", hint: "Declare a maximum result count and validate each character against an allow-list.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+maxResults\\s*:[\\s\\S]*?function\\s+isAllowed\\s*\\([^)]*\\)[\\s\\S]*?allowedCharacters\\.includes\\s*\\(", flags: "m" },
  ],
  rules: ["Require every calculator query to carry a typed request generation.", "Reject characters outside the calculator allow-list before invoking the injected evaluator.", "Discard stale generations and cap every published result batch at maxResults."],
  explanation: ["A provider contract is a narrow boundary describing what a search source accepts, publishes, and is allowed to reveal. Calculator, clipboard, file, command, and web sources need separate fences because their permissions and privacy risks are not interchangeable.", "function query(text: string, requestId: int): void checks requestId against currentRequestId before and after the injected calculation. isAllowed() tests every character through allowedCharacters.includes(), and the published array is sliced to maxResults.", "Directly evaluating arbitrary query text turns a convenience field into a code-execution path, while unlimited history results can expose private material in logs or screenshots. A developer would spot the failure as hostile input triggering unintended work, stale results replacing a newer query, or sensitive rows flooding the launcher."],
},
"keyboard-launcher-boss": {
  starter: `import QtQuick

FocusScope {
    id: launcher
    required property QtObject source
    required property QtObject launchService
    property int activeIndex: 0

    function launch(index: int): void {
        launchService.launchById(source.values[index].id)
    }

    ListView {
        anchors.fill: parent
        model: source.values.filter(value => value.score > 0)
        delegate: Text {
            required property var modelData
            text: modelData.label
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

FocusScope {
    id: launcher
    required property QtObject source
    required property QtObject providerService
    required property QtObject launchService
    required property QtObject previousFocus
    property string activeResultId: ""
    property int currentRequestId: 0
    property bool loading: false
    readonly property int maxQueryLength: 120

    ScriptModel {
        id: ranked
        values: source.values.filter(value => !value.private && value.score > 0)
                             .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    }

    function beginQuery(text: string): void {
        currentRequestId += 1; loading = true
        providerService.query(text.trim().slice(0, maxQueryLength), currentRequestId)
    }
    function acceptResults(requestId: int, values: var): void {
        if (requestId !== currentRequestId) return
        source.values = values; loading = false
    }
    function moveSelection(direction: int): void {
        if (ranked.values.length === 0) { activeResultId = ""; return }
        var index = ranked.values.findIndex(value => value.id === activeResultId)
        activeResultId = ranked.values[(index + direction + ranked.values.length) % ranked.values.length].id
    }
    function launch(id: string): void {
        var match = ranked.values.find(value => value.id === id)
        if (!match || match.private) return
        launchService.launchById(match.id)
    }

    TextInput {
        id: queryInput; focus: true
        onTextChanged: launcher.beginQuery(text)
        Keys.onDownPressed: launcher.moveSelection(1)
        Keys.onUpPressed: launcher.moveSelection(-1)
        Keys.onReturnPressed: launcher.launch(launcher.activeResultId)
        Keys.onEscapePressed: previousFocus.forceActiveFocus()
    }
    Text {
        visible: false
        text: loading ? "Searching" : ranked.values.length + " results"
        Accessible.role: Accessible.AlertMessage
        Accessible.name: text
    }
    ListView {
        model: ranked
        delegate: Text {
            required property var modelData
            text: modelData.label
            font.bold: modelData.id === launcher.activeResultId
        }
    }
}`,
  checks: [
    { label: "Rank through ScriptModel", hint: "Keep filtered and deterministically sorted result objects in a ScriptModel.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?\\bid\\s*:\\s*ranked\\b[\\s\\S]*?\\bvalues\\s*:[\\s\\S]*?\\.sort\\s*\\(", flags: "m" },
    { label: "Carry selection by id", hint: "Track the active result with a string identity instead of a numeric cursor.", pattern: "FocusScope\\s*\\{[\\s\\S]*?\\bproperty\\s+string\\s+activeResultId\\s*:", flags: "m" },
    { label: "Validate before launch", hint: "Find the requested id in ranked.values and launch only the validated match.", pattern: "function\\s+launch\\s*\\(\\s*id\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?ranked\\.values\\.find\\s*\\([\\s\\S]*?\\.id\\s*===\\s*id[\\s\\S]*?launchService\\.launchById\\s*\\(\\s*match\\.id\\s*\\)", flags: "m" },
  ],
  rules: ["Filter private rows and deterministically rank visible results inside ScriptModel.", "Carry keyboard selection as activeResultId across every result reorder.", "Reject stale provider generations, announce loading, and validate the selected id before launch."],
  explanation: ["The complete launcher is a coordinated pipeline: typed input starts provider work, ranked objects retain identity, and keyboard focus follows a stable result id. Accessible status is equally important because pending or empty results otherwise look like a silent blank surface.", "ScriptModel filters private entries and sorts by score with an id tie-breaker, while activeResultId drives the highlighted delegate. currentRequestId fences acceptResults(), the AlertMessage Text announces loading or result counts, and launch(id) uses ranked.values.find() before calling launchService.launchById().", "The boss failure combines several subtle bugs: row indices drift during re-ranking, stale work overwrites new results, private rows leak, and loading produces no spoken feedback. Users experience the damage as the wrong app launching, old matches returning after newer ones, sensitive content appearing, or a screen reader falling silent during a slow query."],
},
"control-centre-rhythm": {
  starter: `import QtQuick
import QtQuick.Layouts

Rectangle {
    width: 360
    height: 520

    ColumnLayout {
        anchors.fill: parent
        spacing: 10

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 112
            Text { text: "Volume and brightness" }
        }
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 112
            Text { text: "Network" }
        }
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 112
            Text { text: "Connection history and setup" }
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Layouts

Rectangle {
    id: controlCentre
    width: 360
    height: 520
    property bool expanded: false
    property string networkStatus: "unavailable"

    ColumnLayout {
        id: controlSections
        anchors.fill: parent
        spacing: 10

        Rectangle {
            id: primaryControls
            Layout.fillWidth: true
            Layout.preferredHeight: 176
            Text { text: "Volume 60% · Brightness 72% · Wi-Fi on" }
        }

        Rectangle {
            id: networkSection
            Layout.fillWidth: true
            Layout.preferredHeight: 104
            Text {
                text: controlCentre.networkStatus === "loading" ? "Loading controls" : controlCentre.networkStatus === "unavailable" ? "Network unavailable" : "Wi-Fi ready"
            }
        }

        Rectangle {
            id: historySection
            Layout.fillWidth: true
            Layout.preferredHeight: 72
            visible: controlCentre.expanded
            Text { text: "Connection history and advanced setup" }
        }

        Text {
            text: controlCentre.expanded ? "Hide advanced" : "Show advanced"
            TapHandler { onTapped: controlCentre.expanded = !controlCentre.expanded }
        }
    }
}`,
  checks: [
    { label: "Task-shaped section stack", hint: "Place both primary and deeper sections inside the same ColumnLayout.", pattern: "ColumnLayout\\s*\\{(?=[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*primaryControls\\b)(?=[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*historySection\\b)", flags: "m" },
    { label: "Progressive depth", hint: "Gate the history section with the control centre's expanded state.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*historySection\\b[\\s\\S]*?visible\\s*:\\s*controlCentre\\.expanded\\b", flags: "m" },
    { label: "Designed unavailable state", hint: "Derive the network section's text from networkStatus with a ternary branch.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*networkSection\\b[\\s\\S]*?Text\\s*\\{[\\s\\S]*?text\\s*:\\s*controlCentre\\.networkStatus\\s*===\\s*[^?\\n]+\\?[^:\\n]+:", flags: "m" },
  ],
  rules: ["Place frequent live controls before setup and history sections.", "Hide the advanced history section until the user explicitly expands it.", "Render a distinct network message when its backing status is loading or unavailable."],
  explanation: ["Information architecture assigns visual weight according to the user's task instead of the number of available widgets. A control centre needs that hierarchy because volume and brightness are visited far more often than connection history or setup.", "The ColumnLayout lists primaryControls first with a larger Layout.preferredHeight, while historySection uses visible: controlCentre.expanded. The networkSection derives its Text.text from networkStatus with ternary branches for loading, unavailable, and ready compositions.", "Equal-height, always-open cards make specialist actions compete with daily controls and leave disappearing services visually ambiguous. Developers notice the failure when the panel becomes noisy and an unavailable section looks indistinguishable from a quiet one."],
},
"orchestration-window-frame": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    PanelWindow {
        id: barWindow
        color: "transparent"
        anchors.top: true
        anchors.right: true
        Rectangle {
            objectName: "barContent"
            width: 420
            height: 48
        }
    }

    PanelWindow {
        id: drawerWindow
        color: "transparent"
        anchors.top: true
        anchors.right: true
        Rectangle {
            objectName: "drawerContent"
            width: 340
            height: 360
        }
    }
}`,
  solution: `import QtQuick
import Quickshell
ShellRoot {
    Variants {
        model: Quickshell.screens
        PanelWindow {
            id: orchestrationWindow
            required property ShellScreen modelData
            screen: modelData
            color: "transparent"
            property bool drawerOpen: true
            anchors.top: true
            anchors.bottom: true
            anchors.left: true
            anchors.right: true
            mask: Region { item: interactiveUnion }

            Item {
                id: interactiveUnion
                x: parent.width - width
                width: Math.max(barRegion.width, drawerRegion.visible ? drawerRegion.width : 0)
                height: barRegion.height + (drawerRegion.visible ? drawerRegion.height : 0)

                Rectangle {
                    id: barRegion
                    width: 420
                    height: 48
                }

                Rectangle {
                    id: drawerRegion
                    y: barRegion.height
                    x: parent.width - width
                    width: 340
                    height: 360
                    visible: orchestrationWindow.drawerOpen
                }
            }
        }
    }
}`,
  checks: [
    { label: "Single orchestration window", hint: "Keep the bar and drawer regions beneath one PanelWindow and one shared container.", pattern: "^(?![\\s\\S]*PanelWindow\\s*\\{[\\s\\S]*PanelWindow\\s*\\{)[\\s\\S]*PanelWindow\\s*\\{[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*interactiveUnion\\b(?=[\\s\\S]*?id\\s*:\\s*barRegion\\b)(?=[\\s\\S]*?id\\s*:\\s*drawerRegion\\b)", flags: "m" },
    { label: "Shared input mask", hint: "Point the PanelWindow mask at interactiveUnion.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?mask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*interactiveUnion\\b", flags: "m" },
    { label: "Connected child regions", hint: "Nest distinct barRegion and drawerRegion objects inside interactiveUnion.", pattern: "Item\\s*\\{\\s*id\\s*:\\s*interactiveUnion\\b[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*barRegion\\b[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*drawerRegion\\b", flags: "m" },
  ],
  rules: ["Declare one PanelWindow template for each screen model entry.", "Point the window mask at the container that bounds every visible interactive region.", "Nest both barRegion and drawerRegion inside interactiveUnion instead of giving them separate windows."],
  explanation: ["An orchestration window is one native shell window that coordinates several connected surfaces. The bar and drawer need this shared owner so their geometry, stacking, and input behavior cannot drift apart.", "Variants creates one PanelWindow for each entry in Quickshell.screens, and interactiveUnion contains both barRegion and drawerRegion. The mask: Region { item: interactiveUnion } declaration makes the accepted input rectangle follow that shared container as the drawer appears or disappears.", "Independent windows can reveal seams, disagree about z-order, and leave gaps or overlaps in their input masks. The problem becomes visible when clicks near the join reach the wrong surface or invisible window space intercepts an application underneath."],
},
"connected-background-deformation": {
  starter: `import QtQuick

Rectangle {
    id: surface
    width: open ? 364 : 64
    height: 280
    radius: open ? 10 : 28
    property bool open: false
    property bool showLabels: false

    Behavior on width {
        NumberAnimation { duration: 220 }
    }

    Text {
        x: 16
        text: "Connected controls"
        opacity: surface.showLabels ? 1 : 0
        Behavior on opacity {
            NumberAnimation { duration: 620 }
        }
    }

    TapHandler {
        onTapped: {
            surface.open = !surface.open
            surface.showLabels = !surface.showLabels
        }
    }
}`,
  solution: `import QtQuick

Rectangle {
    id: connectedSurface
    property real progress: 0
    width: 64 + progress * 300
    height: 72 + progress * 208
    radius: 28 - progress * 18
    color: "#26324a"

    Behavior on progress {
        NumberAnimation {
            duration: 260
            easing.type: Easing.OutCubic
        }
    }

    Text {
        x: 16
        y: 24
        text: "Connected controls"
        opacity: connectedSurface.progress
        color: "white"
    }

    TapHandler {
        onTapped: connectedSurface.progress = connectedSurface.progress < 0.5 ? 1 : 0
    }
}`,
  checks: [
    { label: "Normalized shared progress", hint: "Declare one real progress property initialized in the normalized range.", pattern: "Rectangle\\s*\\{[\\s\\S]*?property\\s+real\\s+progress\\s*:\\s*(?:0(?:\\.0+)?|0?\\.\\d+)\\b", flags: "m" },
    { label: "Reversible progress behavior", hint: "Animate changes with Behavior on progress and a NumberAnimation.", pattern: "Behavior\\s+on\\s+progress\\s*\\{[\\s\\S]*?NumberAnimation\\s*\\{", flags: "m" },
    { label: "One value, several visual roles", hint: "Bind background geometry and content opacity to the same progress property.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*connectedSurface\\b[\\s\\S]*?width\\s*:[^\\n]*\\bprogress\\b[\\s\\S]*?radius\\s*:[^\\n]*\\bprogress\\b[\\s\\S]*?Text\\s*\\{[\\s\\S]*?opacity\\s*:[^\\n]*\\bprogress\\b", flags: "m" },
  ],
  rules: ["Keep progress normalized between zero and one.", "Derive the surface width, height, radius, and content opacity from the same progress value.", "Animate progress with a Behavior so reversals begin at the currently rendered shape."],
  explanation: ["Shared progress is a normalized value, meaning zero represents closed and one represents fully open. It gives every part of this connected surface the same account of where the transition currently is.", "The connectedSurface computes width, height, and radius from progress, while its Text computes opacity from connectedSurface.progress and keeps a fixed x position. Behavior on progress supplies an interruptible NumberAnimation, so tapping during motion reverses from the value already on screen.", "Separate timers let the background join and label visibility fall out of phase, producing a torn-looking seam. Moving the label as aggressively as the surface also makes words hard to track, which developers notice as a distracting slide or flicker during rapid reversals."],
},
"drawer-gesture-arbitration": {
  starter: `import QtQuick

Item {
    id: drawer
    width: 340
    height: 600

    function close(): void {
        drawer.x = -drawer.width
    }

    Rectangle {
        anchors.fill: parent

        DragHandler {
            id: closingDrag
            xAxis.enabled: true
            yAxis.enabled: true
            onActiveChanged: {
                if (!active && Math.abs(activeTranslation.x) > 40)
                    drawer.close()
            }
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: drawer
    width: 340
    height: 600
    property int edge: Qt.RightEdge
    property int activeEdge: Qt.RightEdge
    property real dragStartX: 0
    property real startProgress: 1
    property real progress: 1
    property real threshold: 48
    property real travel: 320

    Rectangle {
        anchors.right: parent.right
        width: drawer.width * drawer.progress
        height: parent.height

        DragHandler {
            id: drawerDrag
            xAxis.enabled: true
            yAxis.enabled: false
            grabPermissions: PointerHandler.TakeOverForbidden

            onActiveChanged: {
                if (active) {
                    drawer.activeEdge = drawer.edge
                    drawer.dragStartX = centroid.position.x
                    drawer.startProgress = drawer.progress
                } else {
                    if (activeTranslation.x < -8 && Math.abs(activeTranslation.x) > drawer.threshold)
                        drawer.progress = 0
                    else
                        drawer.progress = 1
                }
            }

            onActiveTranslationChanged: {
                drawer.progress = Math.max(0, Math.min(1, drawer.startProgress + activeTranslation.x / drawer.travel))
            }
        }
    }
}`,
  checks: [
    { label: "Continuous directional progress", hint: "Update drawer.progress from activeTranslation whenever the drag translation changes.", pattern: "Item\\s*\\{\\s*id\\s*:\\s*drawer\\b[\\s\\S]*?property\\s+real\\s+progress\\s*:[\\s\\S]*?DragHandler\\s*\\{[\\s\\S]*?onActiveTranslationChanged\\s*:\\s*\\{[\\s\\S]*?drawer\\.progress\\s*=[\\s\\S]*?activeTranslation\\.x", flags: "m" },
    { label: "Direction and distance threshold", hint: "Require a negative horizontal direction and an absolute-distance threshold before closing.", pattern: "DragHandler\\s*\\{[\\s\\S]*?onActiveChanged\\s*:\\s*\\{[\\s\\S]*?activeTranslation\\.x\\s*<\\s*-?\\d+[\\s\\S]*?Math\\.abs\\s*\\(\\s*activeTranslation\\.x\\s*\\)\\s*>\\s*drawer\\.threshold", flags: "m" },
    { label: "Explicit grab arbitration", hint: "Set grabPermissions on the DragHandler instead of accepting its default.", pattern: "DragHandler\\s*\\{[\\s\\S]*?grabPermissions\\s*:\\s*PointerHandler\\.[A-Za-z]+", flags: "m" },
  ],
  rules: ["Update progress continuously while horizontal translation changes.", "Require both closing direction and threshold distance before settling the drawer closed.", "Set DragHandler.grabPermissions explicitly so neighbouring handlers can predict ownership."],
  explanation: ["Gesture arbitration decides which nearby interaction owns a pointer sequence without stealing unrelated motion. A drawer needs it because a horizontal close gesture often begins over vertically scrollable content.", "drawerDrag records activeEdge, dragStartX, and startProgress when activation begins, then onActiveTranslationChanged clamps progress between zero and one. Its release branch combines a negative activeTranslation.x test with Math.abs distance, while grabPermissions declares the handler's takeover policy.", "A distance-only test treats a long vertical scroll with slight horizontal drift as a close command. Without continuous progress and the release branch that restores one, users also cannot reverse course, so the drawer appears to snap away and forces them to find another opening control."],
},
"connected-drawer-boss": {
  starter: `import QtQuick
import Quickshell

PanelWindow {
    id: drawerWindow
    required property QtObject controlService
    color: "transparent"
    anchors.top: true
    anchors.bottom: true
    anchors.right: true

    Rectangle {
        width: 384
        height: parent.height
        color: "#26324a"
        Text { text: drawerWindow.controlService.status }
    }

    Keys.onEscapePressed: controlService.close()
}`,
  solution: `import QtQuick
import Quickshell

PanelWindow {
    id: orchestrationWindow
    required property QtObject controlService
    color: "transparent"
    property real progress: 0
    anchors.top: true
    anchors.bottom: true
    anchors.left: true
    anchors.right: true
    mask: Region { item: drawerSurface }
    Behavior on progress { NumberAnimation { duration: 260; easing.type: Easing.OutCubic } }

    FocusScope {
        anchors.fill: parent
        focus: true
        Keys.onEscapePressed: orchestrationWindow.progress = 0

        Rectangle {
            id: drawerSurface
            width: 64 + orchestrationWindow.progress * 320
            height: parent.height
            radius: orchestrationWindow.controlService.fullscreen ? 0 : 18 - orchestrationWindow.progress * 10
            color: "#26324a"
            Text { text: orchestrationWindow.controlService.status }

            DragHandler {
                id: drawerDrag
                property real dragOrigin: 0
                xAxis.enabled: true
                yAxis.enabled: false
                grabPermissions: PointerHandler.TakeOverForbidden
                onActiveChanged: {
                    if (active)
                        dragOrigin = orchestrationWindow.progress
                    else
                        orchestrationWindow.progress = orchestrationWindow.progress > 0.5 ? 1 : 0
                }
                onActiveTranslationChanged: orchestrationWindow.progress = Math.max(0, Math.min(1, dragOrigin + activeTranslation.x / 320))
            }
        }
    }
}`,
  checks: [
    { label: "Service-backed precise window", hint: "Give the PanelWindow an injected controlService and a Region mask targeting drawerSurface.", pattern: "PanelWindow\\s*\\{(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+controlService\\b)(?=[\\s\\S]*?mask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*drawerSurface\\b)", flags: "m" },
    { label: "Progress-driven geometry", hint: "Declare progress on the orchestration window and use it in drawerSurface width.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?property\\s+real\\s+progress\\s*:[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*drawerSurface\\b[\\s\\S]*?width\\s*:[^\\n]*\\bprogress\\b", flags: "m" },
    { label: "Escape shares drawer state", hint: "Handle Escape by assigning the same progress property used by the drag and geometry.", pattern: "Keys\\.onEscapePressed\\s*:[^\\n]*\\bprogress\\s*=\\s*0\\b", flags: "m" },
  ],
  rules: ["Keep the bar-and-drawer interaction inside one transparent PanelWindow.", "Drive drawerSurface geometry and its Region mask from the same visible surface state.", "Close through progress for both Escape and DragHandler input so the two routes cannot diverge."],
  explanation: ["The boss surface combines window ownership, precise input, direct manipulation, service state, and keyboard access into one connected drawer. It must behave as a real Wayland shell surface, so a browser-like visual resemblance is not sufficient proof.", "orchestrationWindow injects controlService, animates one progress property, and masks itself with Region { item: drawerSurface }. drawerDrag updates that same progress through activeTranslation, while the focused Keys.onEscapePressed handler assigns zero and the service's fullscreen property adapts the surface radius.", "Separate windows would expose seams, and a missing mask would let invisible space block applications beneath the shell. If Escape used another close route, keyboard and gesture state could disagree; developers would see stale geometry, intercepted clicks, or a drawer that immediately reappears after one input path closes it."],
},
"toast-lane-coordinator": {
  starter: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: toastCoordinator

    property int toastCount: 0

    function toastY(index: int): int {
        return 40 + index * 80
    }

    function showToast(): void {
        toastCount += 1
    }
}`,
  solution: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: toastCoordinator

    required property QtObject toastSource
    property int reservedTop: 0
    property int safeInsetTop: 0
    property bool fullscreenActive: false
    property bool doNotDisturb: false
    property int toastSpacing: 80

    readonly property list<QtObject> activeToasts: toastSource.values
    readonly property bool suppressed: fullscreenActive || doNotDisturb

    function laneOffset(id: string): int {
        var position = activeToasts.findIndex(toast => toast.id === id)
        return reservedTop + safeInsetTop
            + Math.max(position, 0) * toastSpacing
    }

    function shouldPresent(id: string): bool {
        return !suppressed && activeToasts.some(toast => toast.id === id)
    }
}`,
  checks: [
    { label: "Own the alert lane centrally", hint: "Declare the coordinator as a QML singleton.", pattern: "^\\s*pragma\\s+Singleton\\b", flags: "m" },
    { label: "Clear reserved edge space", hint: "Calculate the lane offset from the reserved top geometry.", pattern: "function\\s+laneOffset\\s*\\([^)]*id\\s*:\\s*string[^)]*\\)\\s*:\\s*int\\s*\\{[\\s\\S]*?reservedTop", flags: "m" },
    { label: "Derive suppression policy", hint: "Make suppression depend on fullscreen or do-not-disturb state.", pattern: "readonly\\s+property\\s+bool\\s+suppressed\\s*:\\s*[^\\n]*(?:fullscreenActive|doNotDisturb)", flags: "m" },
  ],
  rules: ["Assign each toast by stable notification identity within the shared alert lane.", "Add the bar exclusion and safe inset before stacking any toast.", "Suppress presentation whenever fullscreen or do-not-disturb policy requires it."],
  explanation: ["An alert lane is a screen-specific strip reserved for transient notices, much like a runway assigned by air-traffic control. This shell surface needs one coordinator because bars, drawers, OSDs, and monitor edges all compete for the same geometry.", "The singleton exposes activeToasts from toastSource and finds a toast with findIndex using its stable id. laneOffset then adds reservedTop and safeInsetTop before applying toastSpacing, while suppressed derives directly from fullscreenActive and doNotDisturb.", "A bare calculation such as 40 plus an array index knows nothing about occupied edge space or mixed-scale screens. The mistake appears as toasts jumping after dismissal or covering a bar, popout, or screencast control."],
},
"notification-centre-depth": {
  starter: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: notificationArchive

    property list<var> history: []

    function receive(rawEvent: var): void {
        history.push(rawEvent)
    }

    function clearHistory(): void {
        history = []
    }
}`,
  solution: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: notificationArchive

    required property QtObject source

    readonly property list<QtObject> groupedHistory:
        source.values.filter(notification => !Privacy.shouldHide(notification))

    function groupKey(notification: QtObject): string {
        return notification.appName + ":" + notification.category
    }

    function dismiss(id: int): void {
        source.dismiss(id)
    }

    function markRead(id: int): void {
        source.markRead(id)
    }

    function invokeAction(id: int, actionId: string): void {
        source.invokeAction(id, actionId)
    }
}`,
  checks: [
    { label: "Share one archive owner", hint: "Make the notification centre model a singleton.", pattern: "^\\s*pragma\\s+Singleton\\b", flags: "m" },
    { label: "Filter before exposure", hint: "Build grouped history by filtering shared records through Privacy.", pattern: "readonly\\s+property\\s+list<QtObject>\\s+groupedHistory\\s*:[\\s\\S]*?source\\.values\\.filter\\s*\\([^\\n]*Privacy\\.", flags: "m" },
    { label: "Delegate typed actions", hint: "Dismiss by typed id through the shared source.", pattern: "function\\s+dismiss\\s*\\(\\s*id\\s*:\\s*int\\s*\\)\\s*:\\s*void\\s*\\{\\s*source\\.dismiss\\s*\\(\\s*id\\s*\\)\\s*;?\\s*\\}", flags: "m" },
  ],
  rules: ["Expose filtered records from the shared notification source instead of copying raw events.", "Derive grouping keys from notification meaning while preserving each source record's identity.", "Delegate dismiss, read, and action operations through typed functions on the shared source."],
  explanation: ["A notification centre turns short-lived interruptions into searchable history without creating a second truth. It must reuse the toast pipeline so replacement, dismissal, unread state, and redaction remain synchronized.", "groupedHistory binds to source.values and calls Privacy.shouldHide inside filter before any record reaches the view. groupKey supplies an app-and-category grouping key, while dismiss, markRead, and invokeAction forward typed identifiers to source.", "Appending every raw event duplicates replacement updates and leaves copied sensitive text behind after upstream redaction. Developers notice repeated entries, dismissed notices returning, or private content surviving in history."],
},
"osd-coalescing-queue": {
  starter: `import QtQuick

Item {
    id: volumeOsd

    required property QtObject volumeService
    property var queue: []

    function onVolumeKeyPressed(): void {
        queue.push({ value: volumeService.level })
        osdTimer.start()
    }

    Timer {
        id: osdTimer
        interval: 1200
    }

    Text {
        text: queue.length > 0 ? queue[0].value : ""
    }
}`,
  solution: `import QtQuick

Item {
    id: osdCoordinator

    required property QtObject volumeService
    property var activeItems: ({})
    property string activeDomain: ""
    property real displayedValue: 0

    function updateDomain(domain: string, value: real): void {
        activeItems[domain] = value
        activeDomain = domain
        displayedValue = value
        osdSurface.opacity = 1
        dwellTimer.restart()
    }

    function syncVolume(): void {
        updateDomain("volume", volumeService.level)
    }

    Rectangle {
        id: osdSurface
        width: 240
        height: 72
        opacity: 0

        Text {
            anchors.centerIn: parent
            text: osdCoordinator.activeDomain + " " + osdCoordinator.displayedValue
        }
    }

    Timer {
        id: dwellTimer
        interval: 1200
        onTriggered: osdSurface.opacity = 0
    }
}`,
  checks: [
    { label: "Inject the domain service", hint: "Receive the volume service as a required QtObject dependency.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+volumeService\\b", flags: "m" },
    { label: "Overwrite by domain", hint: "Update the existing map entry selected by the domain string.", pattern: "function\\s+updateDomain\\s*\\(\\s*domain\\s*:\\s*string[^)]*\\)[\\s\\S]*?activeItems\\s*\\[\\s*domain\\s*\\]\\s*=", flags: "m" },
    { label: "Restart the dwell window", hint: "Restart the same Timer whenever updateDomain receives a new value.", pattern: "function\\s+updateDomain\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?dwellTimer\\.restart\\s*\\(\\s*\\)", flags: "m" },
  ],
  rules: ["Store one active OSD value per domain key instead of appending event snapshots.", "Overwrite the visible domain value immediately when fresher feedback arrives.", "Restart the shared dwell timer after every in-place domain update."],
  explanation: ["Coalescing means folding repeated events into one current presentation rather than preserving every obsolete intermediate value. Volume and brightness OSDs need it because key repeats can arrive much faster than a person can read separate cards.", "activeItems is a map whose activeItems[domain] entry is overwritten by updateDomain. The same function refreshes displayedValue, reveals osdSurface, and calls dwellTimer.restart so the latest reading receives a full viewing interval.", "A push-based queue turns rapid key presses into a backlog of stale animations. Users see the OSD continue stepping through old values long after the real volume or brightness has stopped changing."],
},
"alert-content-replacement": {
  starter: `import QtQuick

Item {
    id: alertCard

    required property QtObject source

    Text {
        id: messageLabel
        anchors.centerIn: parent
        text: source.message
        opacity: source.visible ? 1 : 0

        Behavior on opacity {
            NumberAnimation { duration: 180 }
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: alertCard

    required property QtObject source
    property string displayedMessage: ""

    Component.onCompleted: displayedMessage = source.message

    Text {
        id: messageLabel
        anchors.centerIn: parent
        text: alertCard.displayedMessage
        opacity: 1
    }

    Connections {
        target: source

        function onMessageChanged(): void {
            replacement.restart()
        }
    }

    SequentialAnimation {
        id: replacement

        NumberAnimation {
            target: messageLabel
            properties: "opacity"
            to: 0
            duration: 140
        }

        PropertyAction {
            target: alertCard
            properties: "displayedMessage"
            value: source.message
        }

        NumberAnimation {
            target: messageLabel
            properties: "opacity"
            to: 1
            duration: 180
        }
    }
}`,
  checks: [
    { label: "Stage replacement sequentially", hint: "Use one SequentialAnimation for the replacement transaction.", pattern: "SequentialAnimation\\s*\\{[\\s\\S]*?\\bid\\s*:\\s*replacement\\b", flags: "m" },
    { label: "Swap between fade phases", hint: "Place a PropertyAction after the fade-out and before the fade-in.", pattern: "SequentialAnimation\\s*\\{[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?\\}[\\s\\S]*?PropertyAction\\s*\\{[\\s\\S]*?displayedMessage[\\s\\S]*?\\}[\\s\\S]*?NumberAnimation\\s*\\{", flags: "m" },
    { label: "Render staged content", hint: "Bind the Text to displayedMessage, not directly to source.message.", pattern: "Text\\s*\\{[\\s\\S]*?text\\s*:\\s*(?:alertCard\\.)?displayedMessage\\b", flags: "m" },
  ],
  rules: ["Render alert text from a local staged property rather than the changing source property.", "Fade the old message completely out before assigning the replacement value.", "Reveal the new message only after the PropertyAction has completed the swap."],
  explanation: ["Staged replacement treats a content change as an ordered transaction: hide, swap, then reveal. An alert surface needs that ordering because text, artwork, urgency, and progress must describe the same moment.", "displayedMessage holds the local snapshot rendered by messageLabel.text. replacement is a SequentialAnimation whose first NumberAnimation fades out, whose PropertyAction assigns source.message, and whose final NumberAnimation fades back in.", "A live text binding can change halfway through an opacity fade, mixing old and new content in a single transition. The flicker is visible on screen, while assistive technology may repeatedly announce incomplete or mismatched messages."],
},
"attention-system-boss": {
  starter: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: attentionPolicy

    required property QtObject someToastItem
    property var osdQueue: []

    function incomingUrgent(rawEvent: QtObject): void {
        someToastItem.message = rawEvent.message
        someToastItem.visible = true
        someToastItem.forceActiveFocus()
    }

    function incomingOsd(value: real): void {
        osdQueue.push(value)
    }
}`,
  solution: `pragma Singleton
import QtQuick
import QtQml

QtObject {
    id: attentionPolicy

    required property QtObject source
    property int reservedTop: 0
    property int toastSpacing: 80
    property var activeOsd: ({})
    property string urgentMessage: ""

    readonly property bool stealsFocus: false
    readonly property list<QtObject> visibleToasts:
        source.values.filter(notification => !Privacy.shouldHide(notification))

    function laneOffset(id: string): int {
        var position = visibleToasts.findIndex(notification => notification.id === id)
        return reservedTop + Math.max(position, 0) * toastSpacing
    }

    function updateOsd(domain: string, value: real): void {
        activeOsd[domain] = value
    }

    function announceUrgent(message: string): void {
        urgentMessage = message
    }

    property Item urgentAnnouncer: Item {
        width: 1
        height: 1
        opacity: 0.01
        visible: attentionPolicy.urgentMessage.length > 0
        Accessible.role: Accessible.AlertMessage
        Accessible.name: attentionPolicy.urgentMessage
    }
}`,
  checks: [
    { label: "Filter the shared attention stream", hint: "Declare a singleton whose visible toast binding applies Privacy before rendering.", pattern: "^\\s*pragma\\s+Singleton\\b[\\s\\S]*?readonly\\s+property\\s+list<QtObject>\\s+visibleToasts\\s*:[\\s\\S]*?source\\.values\\.filter\\s*\\([^\\n]*Privacy\\.", flags: "m" },
    { label: "Coalesce OSD domains", hint: "Overwrite the active OSD entry selected by its domain key.", pattern: "function\\s+updateOsd\\s*\\(\\s*domain\\s*:\\s*string[^)]*\\)[\\s\\S]*?activeOsd\\s*\\[\\s*domain\\s*\\]\\s*=", flags: "m" },
    { label: "Announce without focus theft", hint: "Expose urgent content through the AlertMessage accessibility role.", pattern: "Accessible\\.role\\s*:\\s*Accessible\\.AlertMessage\\b", flags: "m" },
  ],
  rules: ["Filter shared notification records through Privacy before exposing any visible toast.", "Place toasts beyond reservedTop and coalesce OSD feedback by domain key.", "Announce urgent messages with Accessible.AlertMessage while keeping stealsFocus false."],
  explanation: ["A shared attention policy coordinates every surface that asks the user to notice something. Toasts, history, OSDs, and urgent media overlays need one owner so their placement, privacy, timing, and accessibility decisions agree.", "visibleToasts filters source.values through Privacy.shouldHide, laneOffset adds reservedTop, and updateOsd overwrites activeOsd[domain]. urgentAnnouncer exposes urgentMessage with Accessible.AlertMessage, while stealsFocus records the non-stealing keyboard policy.", "Without coordination, alerts collide, repeated keys create stale OSD queues, and presentation or lock modes can reveal protected text. Calling forceActiveFocus for an urgent arrival is especially disruptive because the user suddenly types into the alert instead of the application they were using."],
},
"workspace-overview-model": {
  starter: `import QtQuick
import Quickshell

Item {
    id: overview
    required property QtObject source
    property int activeWorkspace: 1

    Repeater {
        model: source.windows.length

        delegate: Item {
            required property int index
            property var win: source.windows[index]
            width: 180
            height: 110
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

Item {
    id: overview
    required property QtObject source
    property int activeWorkspace: 1
    readonly property bool privacyMode: source.privacyMode
    readonly property bool previewAllowed: !privacyMode
    readonly property int previewLifetimeMs: 5000

    ScriptModel {
        id: overviewModel
        values: source.windows.filter(candidate => candidate.workspace === overview.activeWorkspace)
    }

    Repeater {
        model: overviewModel

        delegate: Item {
            id: windowCard
            required property var modelData
            readonly property string stableWindowId: modelData.id
            width: 180
            height: 110

            Rectangle {
                anchors.fill: parent
                visible: overview.previewAllowed
                color: modelData.urgent ? "tomato" : "steelblue"
            }

            DragHandler {
                target: windowCard
            }

            TapHandler {
                onTapped: overview.source.activate(windowCard.stableWindowId)
            }
        }
    }
}`,
  checks: [
    { label: "Build a ScriptModel", hint: "Place the overview collection in a ScriptModel instead of indexing a separate live array.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?id\\s*:\\s*overviewModel", flags: "m" },
    { label: "Filter by workspace", hint: "Bind ScriptModel.values to a filter expression that compares each window's workspace with activeWorkspace.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?values\\s*:\\s*source\\.windows\\.filter\\s*\\(\\s*candidate\\s*=>\\s*candidate\\.workspace\\s*===\\s*overview\\.activeWorkspace\\s*\\)", flags: "m" },
    { label: "Gate private previews", hint: "Derive previewAllowed from privacy state before rendering preview content.", pattern: "Item\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+previewAllowed\\s*:\\s*!\\s*privacyMode", flags: "m" },
  ],
  rules: ["Feed delegates the stable compositor object from ScriptModel.modelData.", "Filter the window collection by activeWorkspace inside the values binding.", "Disable preview rendering whenever the privacy source reports privacy mode."],
  explanation: ["A ScriptModel exposes a derived collection while preserving the identity of source objects that remain in the result. The overview needs that continuity because windows can change workspace or sort position without becoming different windows.", "The values binding calls source.windows.filter(...) with activeWorkspace, and every delegate receives its window through required property var modelData. stableWindowId reads modelData.id, while previewAllowed is derived from the injected privacyMode before the preview Rectangle becomes visible.", "Index-based delegates silently acquire different windows when the live array is reordered, which appears as cards jumping, inheriting urgency, or activating the wrong target. Rendering every preview unconditionally also wastes GPU time and can put private work into screenshots, so the privacy gate is part of the model boundary rather than an animation afterthought."],
},
"task-switch-focus-return": {
  starter: `import QtQuick

FocusScope {
    id: taskSwitcher
    required property QtObject compositorActions
    required property Item returnTarget
    property int selectedIndex: 0
    focus: true

    function selectAndClose(id: string): void {
        compositorActions.activate(id)
        taskSwitcher.visible = false
    }

    Keys.onEscapePressed: taskSwitcher.visible = false
}`,
  solution: `import QtQuick

FocusScope {
    id: taskSwitcher
    required property QtObject compositorActions
    required property Item returnTarget
    required property var filteredWindows
    property string selectedWindowId: ""
    readonly property int resultCount: filteredWindows.length
    focus: true
    Accessible.name: resultCount + " matching windows"

    function activate(id: string): void {
        selectedWindowId = id
        compositorActions.activateValidated(id, function(success) {
            if (success) {
                taskSwitcher.visible = false
                returnTarget.forceActiveFocus()
            }
        })
    }

    Keys.onEscapePressed: {
        selectedWindowId = ""
        taskSwitcher.visible = false
        returnTarget.forceActiveFocus()
    }

    ListView {
        anchors.fill: parent
        model: taskSwitcher.filteredWindows

        delegate: Item {
            required property var modelData
            width: ListView.view.width
            height: 48

            TapHandler {
                onTapped: taskSwitcher.activate(modelData.id)
            }
        }
    }
}`,
  checks: [
    { label: "Select by compositor id", hint: "Store the selected window's stable string id instead of a delegate index.", pattern: "FocusScope\\s*\\{[\\s\\S]*?property\\s+string\\s+selectedWindowId\\s*:", flags: "m" },
    { label: "Close after confirmation", hint: "Put the visibility change inside the successful activation callback.", pattern: "function\\s+activate\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?activateValidated\\s*\\(\\s*id\\s*,\\s*function\\s*\\(\\s*success\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*success\\s*\\)\\s*\\{[\\s\\S]*?visible\\s*=\\s*false", flags: "m" },
    { label: "Return focus on Escape", hint: "Handle Keys.onEscapePressed as an immediate cancellation path.", pattern: "Keys\\.onEscapePressed\\s*:\\s*\\{[\\s\\S]*?returnTarget\\.forceActiveFocus\\s*\\(\\s*\\)", flags: "m" },
  ],
  rules: ["Track the chosen window with its stable compositor id.", "Hide the task switcher only inside a successful activation confirmation.", "Return focus to returnTarget immediately when Escape cancels the switch."],
  explanation: ["Keyboard-first task switching needs a durable selection and an explicit focus destination. A compositor id remains meaningful while filtering changes row positions, so selectedWindowId identifies the task rather than its temporary place in the list.", "The activate(id: string) function calls the injected compositorActions.activateValidated and waits for its success callback. Only that callback hides taskSwitcher and focuses returnTarget, while Keys.onEscapePressed performs cancellation and focus restoration directly.", "Optimistically hiding the overview can strand keyboard focus on the desktop when a window vanishes or activation is refused. The failure is visible as an apparently closed switcher followed by keystrokes going nowhere, which the confirmation boundary prevents."],
},
"session-confirmation-flow": {
  starter: `import QtQuick
import Quickshell

FocusScope {
    id: sessionMenu
    property string pendingAction: ""
    focus: true

    Process {
        id: process
        command: []
    }

    Rectangle {
        width: 180
        height: 48

        TapHandler {
            onTapped: {
                sessionMenu.pendingAction = "shutdown"
                process.command = [sessionMenu.pendingAction]
                process.running = true
            }
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

FocusScope {
    id: sessionMenu
    property bool menuOpen: false
    property string pendingAction: ""
    focus: true

    Process {
        id: process
        command: []
    }

    function request(action: string): void {
        if (!["lock", "logout", "suspend", "shutdown"].includes(action))
            return
        pendingAction = action
    }

    function confirm(action: string): void {
        if (!["lock", "logout", "suspend", "shutdown"].includes(action))
            return
        process.command = ["sessionctl", action]
        process.running = true
        pendingAction = ""
    }

    Keys.onEscapePressed: {
        pendingAction = ""
        menuOpen = false
    }

    Component.onCompleted: pendingAction = ""

    Rectangle {
        width: 180
        height: 48

        TapHandler {
            onTapped: sessionMenu.request("shutdown")
        }
    }

    TapHandler {
        enabled: pendingAction !== ""
        onTapped: sessionMenu.confirm(pendingAction)
    }
}`,
  checks: [
    { label: "Validate destructive actions", hint: "Guard confirm with an allow-list includes(action) check before starting the process.", pattern: "function\\s+confirm\\s*\\(\\s*action\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{\\s*if\\s*\\(\\s*!\\s*\\[[\\s\\S]*?\\]\\.includes\\s*\\(\\s*action\\s*\\)\\s*\\)\\s*return[\\s\\S]*?process\\.running\\s*=\\s*true", flags: "m" },
    { label: "Clear confirmed intent", hint: "Reset pendingAction after the validated process has started.", pattern: "function\\s+confirm\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?process\\.running\\s*=\\s*true[\\s\\S]*?pendingAction\\s*=\\s*\\x22\\x22", flags: "m" },
    { label: "Cancel with Escape", hint: "Use Keys.onEscapePressed to discard pendingAction before execution.", pattern: "Keys\\.onEscapePressed\\s*:\\s*\\{[\\s\\S]*?pendingAction\\s*=\\s*\\x22\\x22", flags: "m" },
  ],
  rules: ["Keep menuOpen separate from the pending destructive action.", "Reject every session action that is absent from the explicit allow-list.", "Clear pendingAction after confirmation, on Escape, and when the component loads."],
  explanation: ["A confirmation boundary separates browsing session choices from authorizing a consequential operation. menuOpen represents harmless presentation state, while pendingAction records the choice that still requires an explicit confirmation.", "request(action) records only allowed names, and confirm(action) repeats the allow-list check before assigning Process.command and setting running. Keys.onEscapePressed clears the pending choice, and Component.onCompleted removes stale intent whenever the surface is reconstructed.", "A persisted shutdown choice or a one-click raw Process can execute intent from an earlier UI lifetime. A developer might notice the machine acting immediately after a reload or after one accidental tap, so pending intent must be temporary and execution must stay behind validation."],
},
"auth-boundary-lab": {
  starter: `import QtQuick

FocusScope {
    id: authGate
    property string enteredText: ""
    property bool unlocked: false
    focus: true

    TextInput {
        anchors.centerIn: parent
        text: authGate.enteredText

        onAccepted: {
            if (enteredText === "letmein")
                authGate.unlocked = true
        }
    }
}`,
  solution: `import QtQuick

FocusScope {
    id: authGate
    required property QtObject authSession
    property string authenticationText: ""
    readonly property bool failed: authSession.status === "denied"
    focus: true

    function submit(): void {
        authSession.verify(authenticationText)
        authenticationText = ""
    }

    function cancel(): void {
        authenticationText = ""
        authSession.cancel()
    }

    Keys.onEscapePressed: cancel()
    Component.onDestruction: authenticationText = ""

    TextInput {
        id: credentialField
        anchors.centerIn: parent
        echoMode: TextInput.Password
        text: authGate.authenticationText

        onTextEdited: authGate.authenticationText = text
        onAccepted: authGate.submit()
    }

    Text {
        anchors.top: credentialField.bottom
        visible: authGate.failed
        text: "Authentication denied"
    }
}`,
  checks: [
    { label: "Inject the verifier", hint: "Declare authSession as a required opaque QtObject dependency.", pattern: "FocusScope\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+authSession\\b", flags: "m" },
    { label: "Erase after submission", hint: "Clear authenticationText immediately after passing it to authSession.verify.", pattern: "function\\s+submit\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{\\s*authSession\\.verify\\s*\\(\\s*authenticationText\\s*\\)\\s*authenticationText\\s*=\\s*\\x22\\x22", flags: "m" },
    { label: "Erase on teardown", hint: "Use Component.onDestruction to remove authenticationText when the surface disappears.", pattern: "Component\\.onDestruction\\s*:\\s*authenticationText\\s*=\\s*\\x22\\x22", flags: "m" },
  ],
  rules: ["Delegate credential verification exclusively to the injected authSession.", "Erase authenticationText immediately after submit and cancel operations.", "Read denial state from authSession.status instead of implementing a local password test."],
  explanation: ["An authentication boundary keeps presentation code separate from credential verification performed by an audited system. This QML surface may collect temporary text and display status, but it must treat authSession as the opaque authority.", "required property QtObject authSession injects that authority, submit() calls authSession.verify(authenticationText), and the next statement erases authenticationText. The failed binding reads authSession.status, while Component.onDestruction clears any text left when the surface is torn down.", "A hard-coded comparison creates the false impression that QML can safely decide who is authorized and can leave secrets in memory or screenshots. The mistake becomes obvious when a mock password unlocks locally, text survives cancellation, or debugging output exposes what the user typed."],
},
"daily-shell-gate-boss": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    id: dailyShell

    Item {
        id: barModule
        property QtObject services: QtObject {
            property bool online: true
        }
    }

    Item {
        id: drawerModule
        property QtObject services: QtObject {
            property bool online: true
        }
    }

    Process {
        id: sessionProcess
        command: ["sessionctl", "shutdown"]
    }

    TapHandler {
        onTapped: sessionProcess.running = true
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    id: dailyShell
    required property QtObject shellServices
    readonly property bool previewsAllowed: !shellServices.privacyMode

    function runSessionAction(action: string): void {
        if (!["lock", "logout", "suspend", "shutdown"].includes(action))
            return
        sessionProcess.command = ["sessionctl", action]
        sessionProcess.running = true
    }

    Process {
        id: sessionProcess
        command: []
    }

    Item {
        id: barModule
        property QtObject services: dailyShell.shellServices
    }

    Item {
        id: drawerModule
        property QtObject services: dailyShell.shellServices
    }

    Item {
        id: overviewModule
        property QtObject services: dailyShell.shellServices
        property bool previewsAllowed: dailyShell.previewsAllowed
    }

    PanelWindow {
        id: orchestrationWindow
        anchors.top: true
        color: "transparent"
        width: 640
        height: 48
        mask: Region { item: interactiveSurface }

        Item {
            id: interactiveSurface
            anchors.fill: parent

            TapHandler {
                onTapped: dailyShell.runSessionAction("lock")
            }
        }
    }
}`,
  checks: [
    { label: "Compose from ShellRoot", hint: "Use ShellRoot as the top-level QML object.", pattern: "^ShellRoot\\s*\\{", flags: "m" },
    { label: "Share one service bundle", hint: "Inject shellServices once and bind that same object into both the bar and drawer modules.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+shellServices\\b[\\s\\S]*?id\\s*:\\s*barModule[\\s\\S]*?services\\s*:\\s*dailyShell\\.shellServices[\\s\\S]*?id\\s*:\\s*drawerModule[\\s\\S]*?services\\s*:\\s*dailyShell\\.shellServices", flags: "m" },
    { label: "Validate session routing", hint: "Guard runSessionAction with the session allow-list before starting its Process.", pattern: "function\\s+runSessionAction\\s*\\(\\s*action\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{\\s*if\\s*\\(\\s*!\\s*\\[[\\s\\S]*?\\]\\.includes\\s*\\(\\s*action\\s*\\)\\s*\\)\\s*return[\\s\\S]*?sessionProcess\\.running\\s*=\\s*true", flags: "m" },
  ],
  rules: ["Inject one shellServices bundle and pass the same object to every product surface.", "Restrict the transparent PanelWindow input area with a Region referencing interactiveSurface.", "Validate session action names against the allow-list before starting sessionProcess."],
  explanation: ["A daily shell is a composition boundary where independent surfaces must share state, focus conventions, input ownership, and security policy. ShellRoot owns those cross-cutting dependencies so the bar, drawer, overview, and session route behave like one product.", "required property QtObject shellServices supplies one observer bundle to barModule, drawerModule, and overviewModule, while previewsAllowed applies privacy state before overview rendering. orchestrationWindow uses mask: Region { item: interactiveSurface }, and runSessionAction checks its allow-list before configuring sessionProcess.", "Duplicated service objects drift apart and waste observers, while an unmasked transparent window can invisibly swallow input. Missing preview filtering or an unchecked session shortcut is more serious: private content can leak or a consequential action can bypass the same guard used elsewhere, making visual polish conceal a broken system boundary."],
},
};
