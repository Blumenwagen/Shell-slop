/** Authored exercises for campaign 1 quests. See docs/EXERCISE_AUTHORING_SPEC.md. */
import type { AtlasExercise } from "./types.ts";

export const CAMPAIGN1_EXERCISES: Record<string, AtlasExercise> = {
  "lifetime-contract-lab": {
  starter: `import QtQuick

Item {
    id: badge
    property string sessionName: ""
    property int pulseCount: 0
    property string summary: sessionName + " · pulse " + pulseCount
    width: 240
    height: 72

    Text {
        anchors.centerIn: parent
        text: badge.summary
    }

    Timer {
        id: heartbeat
        interval: 1000
        repeat: true
        onTriggered: badge.pulseCount += 1
    }

    Component.onCompleted: heartbeat.start()
}`,
  solution: `import QtQuick

Item {
    id: badge
    required property string sessionName
    property int pulseCount: 0
    readonly property string summary: sessionName + " · pulse " + pulseCount
    width: 240
    height: 72

    Text {
        anchors.centerIn: parent
        text: badge.summary
    }

    Timer {
        id: heartbeat
        interval: 1000
        repeat: true
        onTriggered: badge.pulseCount += 1
    }

    Component.onCompleted: heartbeat.start()
    Component.onDestruction: heartbeat.stop()
}`,
  checks: [
    { label: "Require the session name", hint: "Declare required property string sessionName on the Item.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+string\\s+sessionName\\b" },
    { label: "Protect the derived summary", hint: "Declare summary as a readonly property string bound to sessionName.", pattern: "readonly\\s+property\\s+string\\s+summary\\s*:\\s*sessionName\\s*\\+" },
    { label: "Bound the heartbeat lifetime", hint: "Start heartbeat in Component.onCompleted and stop it in Component.onDestruction.", pattern: "Timer\\s*\\{[\\s\\S]*?id\\s*:\\s*heartbeat[\\s\\S]*?\\}[\\s\\S]*?Component\\.onCompleted\\s*:\\s*heartbeat\\.start\\(\\)[\\s\\S]*?Component\\.onDestruction\\s*:\\s*heartbeat\\.stop\\(\\)" },
  ],
  rules: ["Require every badge instance to provide its sessionName.", "Expose summary as a readonly binding instead of writable copied state.", "Start and stop the heartbeat in the component's matching lifetime handlers."],
  explanation: ["A required property is part of a component's contract: every creator must supply it before the instance can be used. A readonly property exposes a derived fact while preventing consumers from replacing that fact with unrelated state.", "The badge uses its local id to connect the heartbeat Timer to pulseCount and summary. Component.onCompleted starts the instance's timer, while Component.onDestruction stops the same timer when that badge leaves the scene.", "Work started without matching cleanup can survive reloads long enough to duplicate callbacks or target an object that is disappearing. Repeated pulses after a component closes, or steadily multiplying updates after reloads, are signs that instance lifetime was not respected."],
},

  "coordinate-layer-lab": {
  starter: `import QtQuick

Item {
    width: 320
    height: 180

    Rectangle {
        id: viewport
        x: 40
        y: 30
        width: 220
        height: 110
        color: "#263248"
        clip: false

        Rectangle {
            id: badge
            x: 0
            y: 0
            width: 36
            height: 24
            color: "#ffd166"
            transform: Translate { x: 166; y: 12 }
        }

        Rectangle {
            id: card
            x: 24
            y: 18
            width: 160
            height: 74
            color: "#4f78c4"
        }
    }
}`,
  solution: `import QtQuick

Item {
    width: 320
    height: 180

    Rectangle {
        id: viewport
        x: 40
        y: 30
        width: 220
        height: 110
        color: "#263248"
        clip: true

        Rectangle {
            id: card
            x: 24
            y: 18
            width: 160
            height: 74
            z: 1
            color: "#4f78c4"
        }

        Rectangle {
            id: badge
            x: card.x + card.width - width / 2
            y: card.y - height / 4
            width: 36
            height: 24
            z: 2
            radius: 12
            color: "#ffd166"
        }

        Rectangle {
            x: 196
            y: 76
            width: 54
            height: 22
            color: "#72d6c9"
        }
    }
}`,
  checks: [
    { label: "Place in local coordinates", hint: "Set badge.x from card.x and card.width, and set badge.y from card.y.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*badge[\\s\\S]*?x\\s*:\\s*card\\.x\\s*\\+\\s*card\\.width\\s*-\\s*width\\s*/\\s*2[\\s\\S]*?y\\s*:\\s*card\\.y" },
    { label: "Declare the foreground layer", hint: "Give badge an explicit z: 2 so declaration order cannot place it below the card.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*badge[\\s\\S]*?\\bz\\s*:\\s*2\\b" },
    { label: "Clip the viewport", hint: "Set clip: true on viewport so its descendants cannot paint beyond its bounds.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*viewport[\\s\\S]*?clip\\s*:\\s*true" },
  ],
  rules: ["Position the badge with x and y in the viewport coordinate system.", "Assign the badge an explicit z value above the card.", "Clip every decoration that crosses the viewport boundary."],
  explanation: ["Local coordinates measure an item's position from the origin of its immediate parent. Shell surfaces contain many nested layers, so identical x and y values can lead to different screen positions in different branches.", "Geometry is established with x, y, width, and height before a transform changes how an item is painted. Here badge derives its local position from card, z places it above the card, and viewport.clip limits descendant painting.", "A Translate can make a control look aligned while its original geometry remains elsewhere, which is especially confusing when pointer behavior uses that geometry. Missing z or clip policies show up as badges disappearing under siblings or decorations leaking beyond their owner."],
},

  "implicit-size-chain": {
  starter: `import QtQuick

Item {
    id: statusPill
    property real padding: 10
    width: 120
    height: 32

    Rectangle {
        anchors.fill: parent
        radius: height / 2
        color: "#254f46"
    }

    Text {
        id: label
        anchors.centerIn: parent
        text: "Synchronization completed"
        color: "#d8fff4"
    }
}`,
  solution: `import QtQuick

Item {
    id: statusPill
    property real padding: 10
    implicitWidth: label.implicitWidth + padding * 2
    implicitHeight: label.implicitHeight + padding * 2

    Rectangle {
        anchors.fill: parent
        radius: height / 2
        color: "#254f46"
    }

    Text {
        id: label
        anchors.centerIn: parent
        text: "Synchronization completed"
        color: "#d8fff4"
    }
}`,
  checks: [
    { label: "Measure the label width", hint: "Set implicitWidth to label.implicitWidth + padding * 2.", pattern: "implicitWidth\\s*:\\s*label\\.implicitWidth\\s*\\+\\s*padding\\s*\\*\\s*2" },
    { label: "Measure the label height", hint: "Set implicitHeight to label.implicitHeight + padding * 2.", pattern: "implicitHeight\\s*:\\s*label\\.implicitHeight\\s*\\+\\s*padding\\s*\\*\\s*2" },
    { label: "Leave final size to the caller", hint: "Remove direct width and height assignments from the StatusPill Item.", pattern: "Item\\s*\\{(?![\\s\\S]*\\b(?:width|height)\\s*:)[\\s\\S]*\\bimplicitWidth\\s*:" },
  ],
  rules: ["Derive the pill's implicit width from the label and two horizontal padding areas.", "Derive the pill's implicit height from the label and two vertical padding areas.", "Leave width and height unset so the caller owns the final allocation."],
  explanation: ["An implicit size is a component's natural request for space rather than a size imposed on its parent. A reusable status pill needs that request to change whenever its label or padding changes.", "The label already reports implicitWidth and implicitHeight from its rendered text. StatusPill adds padding on both sides with label.implicitWidth + padding * 2 and applies the same calculation vertically.", "A guessed width may fit one English message but clip a translation or a longer status. The warning sign is callers copying the pill's internal measurements or overriding its size just to reveal its text."],
},

  "constraint-repair-yard": {
  starter: `import QtQuick

Rectangle {
    width: 360
    height: 140
    color: "#18202d"

    Rectangle {
        id: statusBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        width: 180
        height: 48
        y: 46
        radius: 8
        color: "#5b7cfa"

        Text {
            anchors.centerIn: parent
            text: "Ready"
            color: "white"
        }
    }
}`,
  solution: `import QtQuick

Rectangle {
    width: 360
    height: 140
    color: "#18202d"

    Rectangle {
        id: statusBar
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        height: 48
        y: 46
        radius: 8
        color: "#5b7cfa"

        Text {
            anchors.centerIn: parent
            text: "Ready"
            color: "white"
        }
    }
}`,
  checks: [
    { label: "Choose horizontal anchors", hint: "Keep both anchors.left and anchors.right on statusBar so they own its horizontal span.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*statusBar[\\s\\S]*?anchors\\.left\\s*:\\s*parent\\.left[\\s\\S]*?anchors\\.right\\s*:\\s*parent\\.right" },
    { label: "Remove the competing width", hint: "Delete the direct width assignment from statusBar and keep its explicit height.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*statusBar(?![\\s\\S]*?\\bwidth\\s*:)[\\s\\S]*?height\\s*:\\s*48" },
    { label: "Preserve the inset", hint: "Use anchors.leftMargin and anchors.rightMargin for the 24-pixel horizontal inset.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*statusBar[\\s\\S]*?anchors\\.leftMargin\\s*:\\s*24[\\s\\S]*?anchors\\.rightMargin\\s*:\\s*24" },
  ],
  rules: ["Let the left and right anchors exclusively determine the status bar width.", "Express the horizontal inset through matching anchor margins.", "Keep the vertical position and height independent of the horizontal anchor repair."],
  explanation: ["A geometry owner is the single system responsible for an item's position or size on an axis. Clear ownership matters because anchors continuously maintain relationships when a shell window changes dimensions.", "The statusBar keeps anchors.left and anchors.right, so those anchors calculate its width from the parent and the two margins. Its direct width assignment is removed, while y and height continue to control the separate vertical axis.", "Combining both horizontal anchors with width gives competing instructions and can produce warnings or ignored values. You can recognize the defect when resizing the parent causes snapping, stale dimensions, or behavior that disagrees with the written width."],
},

  "resilient-content-gallery": {
  starter: `import QtQuick

Rectangle {
    id: card
    width: 320
    height: 240
    color: "#202634"

    Text {
        id: title
        x: 16
        y: 16
        text: "A very long album title prepared for an international audience"
        color: "white"
    }

    Image {
        id: artwork
        x: 16
        y: 80
        source: "missing-cover.png"
    }
}`,
  solution: `import QtQuick

Rectangle {
    id: card
    property string artworkSource: "missing-cover.png"
    width: 320
    height: 240
    color: "#202634"
    LayoutMirroring.enabled: Qt.application.layoutDirection === Qt.RightToLeft
    LayoutMirroring.childrenInherit: true

    Text {
        id: title
        x: 16
        y: 16
        width: parent.width - 32
        text: "A very long album title prepared for an international audience"
        wrapMode: Text.WordWrap
        color: "white"
    }

    Image {
        id: artwork
        x: 16
        y: 80
        width: 288
        height: 128
        fillMode: Image.PreserveAspectCrop
        asynchronous: true
        source: card.artworkSource
    }

    Rectangle {
        id: artworkFallback
        x: artwork.x
        y: artwork.y
        width: artwork.width
        height: artwork.height
        visible: card.artworkSource === "" || artwork.status === Image.Error || artwork.status === Image.Loading
        color: "#343d50"

        Text {
            anchors.centerIn: parent
            text: card.artworkSource === "" ? "No artwork" : artwork.status === Image.Error ? "Artwork unavailable" : "Loading artwork"
            color: "#d7deed"
        }
    }
}`,
  checks: [
    { label: "Constrain variable text", hint: "Give title an explicit width and set wrapMode: Text.WordWrap.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*title[\\s\\S]*?width\\s*:\\s*parent\\.width\\s*-\\s*32[\\s\\S]*?wrapMode\\s*:\\s*Text\\.WordWrap" },
    { label: "Reserve and crop artwork", hint: "Set artwork width and height before source, then use fillMode: Image.PreserveAspectCrop.", pattern: "Image\\s*\\{\\s*id\\s*:\\s*artwork[\\s\\S]*?width\\s*:\\s*288[\\s\\S]*?height\\s*:\\s*128[\\s\\S]*?fillMode\\s*:\\s*Image\\.PreserveAspectCrop[\\s\\S]*?source\\s*:" },
    { label: "Show loading and failure states", hint: "Make artworkFallback visible for both Image.Error and Image.Loading.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*artworkFallback[\\s\\S]*?visible\\s*:[^\\n]*Image\\.Error[^\\n]*Image\\.Loading" },
  ],
  rules: ["Constrain the title width and choose word wrapping for long translations.", "Reserve fixed artwork geometry and crop images with PreserveAspectCrop.", "Display explicit empty, loading, and error messages over the artwork area."],
  explanation: ["Content is variable input, so its length, writing direction, and availability cannot be inferred from one screenshot. Localization means adapting an interface for different languages and regions, including longer labels and right-to-left reading order.", "The title receives a bounded width and Text.WordWrap, while LayoutMirroring follows the application's text direction. The Image reserves width and height before loading, uses PreserveAspectCrop, and exposes its status to artworkFallback.", "Without these policies, long text escapes the card and a failed asset leaves an unexplained blank area. Test with a long title, an empty source, and a missing file; each should preserve the card's geometry and communicate what happened."],
},

  "pointer-handler-field": {
  starter: `import QtQuick

Rectangle {
    id: root
    width: 320
    height: 180
    property int activationCount: 0
    property real scrollOffset: 0
    property real lastY: 0
    color: mouse.containsMouse ? "#46536b" : "#303846"

    Text {
        anchors.centerIn: parent
        text: "Opened " + root.activationCount + " times\\nOffset " + root.scrollOffset
        color: "white"
    }

    MouseArea {
        id: mouse
        anchors.fill: parent
        hoverEnabled: true
        onPressed: function(event) { root.lastY = event.y }
        onPositionChanged: function(event) {
            if (pressed)
                root.scrollOffset += event.y - root.lastY
        }
        onClicked: root.activationCount += 1
    }
}`,
  solution: `import QtQuick

Rectangle {
    id: root
    width: 320
    height: 180
    property int activationCount: 0
    property real scrollOffset: 0

    HoverHandler {
        id: hoverSensor
    }

    TapHandler {
        id: tapSensor
        gesturePolicy: TapHandler.ReleaseWithinBounds
        onTapped: root.activationCount += 1
    }

    WheelHandler {
        target: null
        onWheel: function(event) {
            root.scrollOffset += event.angleDelta.y
        }
    }

    color: hoverSensor.hovered ? "#46536b" : "#303846"
    scale: tapSensor.pressed ? 0.98 : 1

    Text {
        anchors.centerIn: parent
        text: "Opened " + root.activationCount + " times\\nOffset " + root.scrollOffset
        color: "white"
    }
}`,
  checks: [
    { label: "Sense hover separately", hint: "Add a HoverHandler named hoverSensor and bind the card color to hoverSensor.hovered.", pattern: "(?:Item|Rectangle)\\s*\\{[\\s\\S]*?HoverHandler\\s*\\{[\\s\\S]*?id\\s*:\\s*hoverSensor[\\s\\S]*?\\}[\\s\\S]*?color\\s*:\\s*hoverSensor\\.hovered" },
    { label: "Recognize deliberate taps", hint: "Add a TapHandler named tapSensor with ReleaseWithinBounds and increment activationCount in onTapped.", pattern: "TapHandler\\s*\\{[\\s\\S]*?id\\s*:\\s*tapSensor[\\s\\S]*?gesturePolicy\\s*:\\s*TapHandler\\.ReleaseWithinBounds[\\s\\S]*?onTapped\\s*:\\s*root\\.activationCount\\s*\\+=\\s*1" },
    { label: "Route wheel input explicitly", hint: "Add a targetless WheelHandler whose onWheel function applies event.angleDelta.y to scrollOffset.", pattern: "WheelHandler\\s*\\{[\\s\\S]*?target\\s*:\\s*null[\\s\\S]*?onWheel\\s*:\\s*function\\s*\\(event\\)\\s*\\{[\\s\\S]*?scrollOffset\\s*\\+=\\s*event\\.angleDelta\\.y" },
  ],
  rules: ["Give hover, tap, and wheel input their own pointer handlers.", "Bind visual feedback to hovered and pressed instead of copying those states.", "Use ReleaseWithinBounds so a tap cancelled outside the card does not activate it."],
  explanation: ["A pointer handler is a focused recognizer for one kind of gesture. Shell surfaces need specialist recognizers because hovering, tapping, and scrolling can overlap without meaning the same thing.", "HoverHandler exposes hovered for the card color, while TapHandler exposes pressed and emits onTapped for activation. WheelHandler receives event.angleDelta.y without making one catch-all object guess whether movement was a click, drag, or scroll.", "A full-card MouseArea can claim input that belongs to a nested control or to content visible through transparent pixels. You can recognize this failure when scrolling activates the card, dragging becomes a click, or hover logic is mixed into every pointer callback."],
},

  "keyboard-focus-route": {
  starter: `import QtQuick

Item {
    id: root
    required property Item opener
    width: 280
    height: 120
    visible: true
    focus: visible
    property int currentIndex: 0

    Rectangle {
        anchors.fill: parent
        color: "#252936"
        border.width: 0
    }

    Text {
        anchors.centerIn: parent
        text: root.currentIndex === 0 ? "Previous workspace" : "Next workspace"
        color: "white"
    }

    Keys.onEscapePressed: root.visible = false
}`,
  solution: `import QtQuick

FocusScope {
    id: root
    required property Item opener
    width: 280
    height: 120
    visible: true
    focus: visible
    property int currentIndex: 0
    property string activatedAction: ""

    Keys.onLeftPressed: root.currentIndex = 0
    Keys.onRightPressed: root.currentIndex = 1
    Keys.onReturnPressed: root.activatedAction =
        root.currentIndex === 0 ? "previous" : "next"
    Keys.onEnterPressed: root.activatedAction =
        root.currentIndex === 0 ? "previous" : "next"
    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Space)
            root.activatedAction = root.currentIndex === 0 ? "previous" : "next"
    }
    Keys.onEscapePressed: {
        root.visible = false
        opener.forceActiveFocus()
    }

    Rectangle {
        anchors.fill: parent
        color: "#252936"
        border.color: "#8fc7ff"
        border.width: root.activeFocus ? 2 : 0
    }

    Text {
        anchors.centerIn: parent
        text: root.currentIndex === 0 ? "Previous workspace" : "Next workspace"
        color: "white"
    }
}`,
  checks: [
    { label: "Own the keyboard route", hint: "Make the popout root a FocusScope with a required Item property named opener.", pattern: "FocusScope\\s*\\{[\\s\\S]*?required\\s+property\\s+Item\\s+opener" },
    { label: "Restore the entry point", hint: "In Keys.onEscapePressed, hide root and then call opener.forceActiveFocus().", pattern: "FocusScope\\s*\\{[\\s\\S]*?Keys\\.onEscapePressed\\s*:\\s*\\{[\\s\\S]*?root\\.visible\\s*=\\s*false[\\s\\S]*?opener\\.forceActiveFocus\\(\\)" },
    { label: "Render active focus", hint: "Bind the popout border width to root.activeFocus with a visible 2-pixel focused state.", pattern: "FocusScope\\s*\\{[\\s\\S]*?Rectangle\\s*\\{[\\s\\S]*?border\\.width\\s*:\\s*root\\.activeFocus\\s*\\?\\s*2\\s*:\\s*0" },
  ],
  rules: ["Wrap the switcher in a FocusScope so it owns its internal keyboard route.", "Handle arrows and activation keys without requiring pointer input.", "Return focus to opener whenever Escape dismisses the popout."],
  explanation: ["Keyboard focus is the single destination that receives key events, and a FocusScope lets a reusable surface manage that destination internally. A shell popout also needs a known return point because hiding the focused object does not choose a sensible replacement automatically.", "The switcher accepts an opener Item, moves currentIndex with the arrow keys, and activates the selected action with Return, Enter, or Space. Its Escape handler hides the FocusScope and calls opener.forceActiveFocus(), while the border reads root.activeFocus to show where keyboard input is landing.", "Without restoration, closing a keyboard-opened popout leaves focus on an invisible object or nowhere useful. The warning signs are a dead Tab key, an Escape key that works only once, or a missing focus outline after the surface is reopened."],
},

  "motion-composition-stage": {
  starter: `import QtQuick

Item {
    id: root
    width: 420
    height: 240
    property bool expanded: false

    Rectangle {
        id: panel
        anchors.centerIn: parent
        width: root.expanded ? 320 : 220
        height: root.expanded ? 140 : 80
        opacity: root.expanded ? 1 : 0.7
        color: "#34445c"

        Behavior on width { NumberAnimation { duration: 260 } }
        Behavior on height { NumberAnimation { duration: 260 } }
        Behavior on opacity { NumberAnimation { duration: 260 } }

        Text {
            id: statusLabel
            anchors.centerIn: parent
            text: root.expanded ? "Services available" : "Compact status"
            color: "white"
            Behavior on text { PropertyAnimation { duration: 260 } }
        }

        MouseArea {
            anchors.fill: parent
            onClicked: root.expanded = !root.expanded
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: root
    width: 420
    height: 240
    property bool expanded: false

    Rectangle {
        id: panel
        anchors.centerIn: parent
        width: 220
        height: 80
        color: "#34445c"

        Text {
            id: statusLabel
            anchors.centerIn: parent
            text: "Compact status"
            color: "white"
        }

        MouseArea {
            anchors.fill: parent
            onClicked: {
                root.expanded = !root.expanded
                replaceLabel.nextText =
                    root.expanded ? "Services available" : "Compact status"
                resizeStage.restart()
                replaceLabel.restart()
            }
        }
    }

    ParallelAnimation {
        id: resizeStage
        NumberAnimation {
            target: panel
            properties: "width"
            to: root.expanded ? 320 : 220
            duration: 260
        }
        NumberAnimation {
            target: panel
            properties: "height"
            to: root.expanded ? 140 : 80
            duration: 260
        }
    }

    SequentialAnimation {
        id: replaceLabel
        property string nextText: ""
        NumberAnimation {
            target: statusLabel
            properties: "opacity"
            to: 0
            duration: 100
        }
        ScriptAction {
            script: statusLabel.text = replaceLabel.nextText
        }
        NumberAnimation {
            target: statusLabel
            properties: "opacity"
            to: 1
            duration: 140
        }
    }
}`,
  checks: [
    { label: "Compose geometry in parallel", hint: "Put width and height NumberAnimations for panel inside one ParallelAnimation named resizeStage.", pattern: "ParallelAnimation\\s*\\{[\\s\\S]*?id\\s*:\\s*resizeStage[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?target\\s*:\\s*panel[\\s\\S]*?properties\\s*:\\s*\"width\"[\\s\\S]*?\\}[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?target\\s*:\\s*panel[\\s\\S]*?properties\\s*:\\s*\"height\"" },
    { label: "Stage the text replacement", hint: "Use a SequentialAnimation that fades statusLabel to 0, assigns its text in ScriptAction, then fades it to 1.", pattern: "SequentialAnimation\\s*\\{[\\s\\S]*?id\\s*:\\s*replaceLabel[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?properties\\s*:\\s*\"opacity\"[\\s\\S]*?to\\s*:\\s*0[\\s\\S]*?ScriptAction\\s*\\{[\\s\\S]*?statusLabel\\.text\\s*=\\s*replaceLabel\\.nextText[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?properties\\s*:\\s*\"opacity\"[\\s\\S]*?to\\s*:\\s*1" },
    { label: "Expose the cause", hint: "In onClicked, flip expanded and restart both resizeStage and replaceLabel.", pattern: "MouseArea\\s*\\{[\\s\\S]*?onClicked\\s*:\\s*\\{[\\s\\S]*?root\\.expanded\\s*=\\s*!root\\.expanded[\\s\\S]*?resizeStage\\.restart\\(\\)[\\s\\S]*?replaceLabel\\.restart\\(\\)" },
  ],
  rules: ["Animate related width and height changes together in resizeStage.", "Fade the old status out before assigning the replacement text.", "Start both animation groups from the same explicit expanded-state change."],
  explanation: ["Animation composition gives each visible change a clear role in a larger transition. Geometry can move together, while content that must be replaced benefits from an ordered sequence.", "The ParallelAnimation named resizeStage changes panel width and height at the same time. The SequentialAnimation named replaceLabel fades statusLabel out, runs a ScriptAction to assign nextText, and then fades the new label in.", "A blanket set of Behaviors obscures which state change caused each effect and cannot meaningfully interpolate a string. The result is recognizable as jittering geometry, text that pops midway through motion, or several decorative changes competing for attention."],
},

  "loader-lifetime-backstage": {
  starter: `import QtQuick

Item {
    id: root
    width: 360
    height: 220
    property bool drawerOpen: false

    Component {
        id: drawerComponent
        Rectangle {
            property bool opened: false
            width: 240
            height: parent.height
            color: "#303b50"
            opacity: opened ? 1 : 0
            Behavior on opacity { NumberAnimation { duration: 240 } }
        }
    }

    Loader {
        id: drawerLoader
        anchors.left: parent.left
        active: root.drawerOpen
        sourceComponent: drawerComponent
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            root.drawerOpen = !root.drawerOpen
            if (root.drawerOpen)
                drawerLoader.item.opened = true
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: root
    width: 360
    height: 220
    property bool drawerOpen: false
    signal closeRequested()

    Component {
        id: drawerComponent

        Rectangle {
            id: drawer
            width: 240
            height: root.height
            opacity: 0
            color: "#303b50"
            focus: true

            function beginOpen() { openAnimation.start() }
            function beginClose() { closeAnimation.start() }

            Connections {
                target: root
                function onCloseRequested() {
                    drawer.beginClose()
                }
            }

            NumberAnimation {
                id: openAnimation
                target: drawer
                properties: "opacity"
                to: 1
                duration: 240
            }

            NumberAnimation {
                id: closeAnimation
                target: drawer
                properties: "opacity"
                to: 0
                duration: 240
                onStopped: {
                    drawer.focus = false
                    drawerLoader.active = false
                }
            }
        }
    }

    Loader {
        id: drawerLoader
        anchors.left: parent.left
        active: false
        asynchronous: true
        sourceComponent: drawerComponent
        onLoaded: root.drawerOpen ? item.beginOpen() : item.beginClose()
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            root.drawerOpen = !root.drawerOpen
            if (root.drawerOpen)
                drawerLoader.active = true
            else
                root.closeRequested()
        }
    }
}`,
  checks: [
    { label: "Wait for loaded content", hint: "Make drawerLoader asynchronous and call item.beginOpen or item.beginClose only from Loader.onLoaded; never read drawerLoader.item directly.", pattern: "^(?![\\s\\S]*drawerLoader\\.item)[\\s\\S]*Loader\\s*\\{[\\s\\S]*?id\\s*:\\s*drawerLoader[\\s\\S]*?active\\s*:\\s*false[\\s\\S]*?asynchronous\\s*:\\s*true[\\s\\S]*?onLoaded\\s*:\\s*root\\.drawerOpen\\s*\\?\\s*item\\.beginOpen\\(\\)\\s*:\\s*item\\.beginClose\\(\\)" },
    { label: "Route closing into the instance", hint: "Inside the loaded drawer, connect root.closeRequested to drawer.beginClose().", pattern: "Connections\\s*\\{[\\s\\S]*?target\\s*:\\s*root[\\s\\S]*?function\\s+onCloseRequested\\s*\\(\\)\\s*\\{[\\s\\S]*?drawer\\.beginClose\\(\\)" },
    { label: "Dispose after the curtain", hint: "In closeAnimation.onStopped, clear drawer.focus before setting drawerLoader.active to false.", pattern: "NumberAnimation\\s*\\{[\\s\\S]*?id\\s*:\\s*closeAnimation[\\s\\S]*?to\\s*:\\s*0[\\s\\S]*?onStopped\\s*:\\s*\\{[\\s\\S]*?drawer\\.focus\\s*=\\s*false[\\s\\S]*?drawerLoader\\.active\\s*=\\s*false" },
  ],
  rules: ["Keep drawerLoader active until closeAnimation reports that it has stopped.", "Read the newly created item only from Loader.onLoaded.", "Release the drawer's focus before deactivating its Loader."],
  explanation: ["A Component is an object factory, while Loader decides when an instance from that factory belongs to the live object tree. The instance keeps the creation context of drawerComponent, so its bindings and Connections can still reach root and drawerLoader.", "Opening activates the asynchronous Loader, and onLoaded starts the appropriate animation only after item exists. Closing emits root.closeRequested, which the loaded drawer receives through Connections; closeAnimation then clears focus and deactivates the Loader from onStopped.", "Binding active directly to drawerOpen destroys the drawer at the same moment closing begins, cutting the fade off before its final frame. Reading drawerLoader.item immediately after activation creates a second warning sign because loading may not have completed and code starts depending on synchronous timing."],
},

  "platform-stack-crossing": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    PanelWindow {
        id: bar
        x: 0
        y: 0
        width: 900
        height: 32
        color: "#20242b"

        Text {
            anchors.centerIn: parent
            text: "Shellcraft"
            color: "white"
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    PanelWindow {
        id: bar
        anchors.top: true
        anchors.left: true
        anchors.right: true
        exclusiveZone: height
        height: 32
        color: "#20242b"

        Text {
            anchors.centerIn: parent
            text: "Shellcraft"
            color: "white"
        }

        // Quickshell sends this placement request to the compositor.
    }
}`,
  checks: [
    { label: "Request the top edge", hint: "Set anchors.top: true inside the PanelWindow.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?anchors\\.top\\s*:\\s*true" },
    { label: "Stretch across the output", hint: "Set anchors.left: true and anchors.right: true inside the PanelWindow.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?anchors\\.left\\s*:\\s*true[\\s\\S]*?anchors\\.right\\s*:\\s*true" },
    { label: "Reserve the panel strip", hint: "Remove raw x/y placement and set exclusiveZone: height.", pattern: "PanelWindow\\s*\\{(?![\\s\\S]*?\\n\\s*(?:x|y)\\s*:)[\\s\\S]*?exclusiveZone\\s*:\\s*height" },
  ],
  rules: ["Express panel placement with edge anchors instead of desktop coordinates.", "Reserve exactly the bar's height with exclusiveZone.", "Treat final output placement as compositor policy mediated by Quickshell."],
  explanation: ["A shell window crosses several layers before it appears. QML creates the object graph, Qt Quick renders and handles input, Quickshell supplies PanelWindow, Wayland transports the surface request, and the compositor decides its final placement and focus.", "The PanelWindow uses anchors.top, anchors.left, and anchors.right to request a top-edge strip. Setting exclusiveZone to height asks the compositor to keep ordinary application windows out of that strip.", "Raw x and y coordinates misleadingly suggest that the QML file owns the desktop coordinate space. A browser preview may show similar geometry, but only a real Wayland compositor can prove edge placement, exclusion, focus, and output behavior."],
},
  "module-manifest-workshop": {
  starter: `import QtQuick
import Quickshell
import "."

ShellRoot {
    id: root

    property QtObject batteryService: QtObject {
        property bool available: true
    }
    readonly property bool batteryAvailable: batteryService.available

    PanelWindow {
        width: 240
        height: 40
        Text {
            anchors.centerIn: parent
            text: root.batteryAvailable ? "Battery ready" : "No battery"
        }
    }
}`,
  solution: `import QtQuick
import Quickshell
import "./services" as Services

ShellRoot {
    id: root

    readonly property bool batteryAvailable: Services.BatteryService.available

    PanelWindow {
        width: 240
        height: 40
        color: "#20242b"

        Text {
            anchors.centerIn: parent
            text: root.batteryAvailable ? "Battery ready" : "No battery"
            color: "white"
        }
    }
}`,
  checks: [
    { label: "Import the module directory", hint: "Write import \"./services\" as Services instead of importing the current directory.", pattern: "import\\s+\"\\./services\"\\s+as\\s+Services" },
    { label: "Use the exported singleton", hint: "Reference the capitalized singleton as Services.BatteryService.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?Services\\.BatteryService\\.available" },
    { label: "Bind local state to the module", hint: "Declare readonly property bool batteryAvailable: Services.BatteryService.available.", pattern: "readonly\\s+property\\s+bool\\s+batteryAvailable\\s*:\\s*Services\\.BatteryService\\.available" },
  ],
  rules: ["Import the services directory through the explicit Services namespace.", "Read battery state from the BatteryService singleton exported by the module.", "Expose the singleton value as readonly local state rather than recreating the service."],
  explanation: ["A qmldir file is a module manifest: it tells the QML engine which named types and singletons a directory exports. An explicit module boundary lets the runtime and qmlls resolve the same catalogue of services.", "The consuming file imports \"./services\" as Services and reads Services.BatteryService.available. The qualifier identifies the module, while the capitalized BatteryService name identifies the singleton registered by its manifest.", "Importing the current directory and constructing an ad-hoc service can appear to work because nearby files share accidental context. The weakness becomes visible when a component moves, an import path changes, or qmlls reports that the expected type cannot be found."],
},
  "reload-recovery-console": {
  starter: `import QtQuick
import Quickshell
import Quickshell.Io

ShellRoot {
    id: root

    property QtObject statusService: QtObject {
        function refresh() {}
    }

    Timer {
        interval: 30000
        repeat: true
        running: true
        onTriggered: root.statusService.refresh()
    }

    IpcHandler {
        target: root.objectName
        function refresh() {
            root.statusService.refresh()
        }
    }
}`,
  solution: `import QtQuick
import Quickshell
import Quickshell.Io

ShellRoot {
    id: root

    property QtObject statusService: QtObject {
        function refresh() {}
    }

    Timer {
        id: pollTimer
        interval: 30000
        repeat: true
        running: true
        triggeredOnStart: true
        onTriggered: root.statusService.refresh()
    }

    IpcHandler {
        id: recoveryIpc
        target: "reloadRecovery"

        function refresh() {
            root.statusService.refresh()
        }
    }

    Component.onDestruction: pollTimer.stop()
}`,
  checks: [
    { label: "Name the polling owner", hint: "Give the Timer id: pollTimer and keep running: true.", pattern: "Timer\\s*\\{\\s*id\\s*:\\s*pollTimer[\\s\\S]*?running\\s*:\\s*true" },
    { label: "Stop work during teardown", hint: "Add Component.onDestruction: pollTimer.stop() on the root.", pattern: "Component\\.onDestruction\\s*:\\s*pollTimer\\.stop\\s*\\(\\s*\\)" },
    { label: "Keep one stable IPC owner", hint: "Declare one IpcHandler with id: recoveryIpc and target: \"reloadRecovery\".", pattern: "^(?![\\s\\S]*\\bIpcHandler\\s*\\{[\\s\\S]*\\bIpcHandler\\s*\\{)[\\s\\S]*\\bIpcHandler\\s*\\{\\s*id\\s*:\\s*recoveryIpc[\\s\\S]*?target\\s*:\\s*\\x22reloadRecovery\\x22" },
  ],
  rules: ["Give every reload-sensitive Timer a stable id.", "Stop the polling Timer when its owning root is destroyed.", "Expose exactly one IpcHandler under the stable reloadRecovery target."],
  explanation: ["Hot reload replaces a live object tree, so recovery includes the resources owned by the old tree as well as the pixels shown by the new one. qmlls catches structural mistakes before launch, while runtime logs reveal repeated callbacks, binding loops, and integration failures.", "The Timer is named pollTimer so Component.onDestruction can stop it explicitly. A single recoveryIpc object owns the stable reloadRecovery target, making its lifetime and command entry point easy to inspect.", "A visually correct bar can hide an old polling loop or duplicated observer that survived long enough to consume resources. Repeated log messages, doubled refresh rates, or an IPC target ownership error are signs that teardown and recreation are not balanced."],
},
  "window-policy-range": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    PanelWindow {
        screen: Quickshell.screens[0]
        anchors.top: true
        anchors.left: true
        anchors.right: true
        exclusiveZone: height
        height: 36
        color: "#20242b"
    }

    PanelWindow {
        anchors.top: true
        anchors.right: true
        width: 260
        height: 220
        color: "#20242b"
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    Variants {
        model: Quickshell.screens

        delegate: Item {
            required property ShellScreen modelData

            PanelWindow {
                id: statusPanel
                screen: modelData
                anchors.top: true
                anchors.left: true
                anchors.right: true
                exclusiveZone: height
                height: 36
                color: "#20242b"
            }

            PanelWindow {
                id: trayPopup
                screen: modelData
                anchors.top: true
                anchors.right: true
                exclusiveZone: 0
                width: 260
                height: 220
                color: "transparent"
                mask: Region {
                    item: traySurface
                }

                Rectangle {
                    id: traySurface
                    anchors.fill: parent
                    radius: 12
                    color: "#20242b"
                }
            }
        }
    }
}`,
  checks: [
    { label: "Create one topology per screen", hint: "Use Variants with model: Quickshell.screens and required property ShellScreen modelData.", pattern: "Variants\\s*\\{[\\s\\S]*?model\\s*:\\s*Quickshell\\.screens[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData" },
    { label: "Bind both windows to one output", hint: "Set screen: modelData on both PanelWindows, and reserve height on statusPanel.", pattern: "PanelWindow\\s*\\{\\s*id\\s*:\\s*statusPanel[\\s\\S]*?screen\\s*:\\s*modelData[\\s\\S]*?exclusiveZone\\s*:\\s*height[\\s\\S]*?\\}\\s*PanelWindow\\s*\\{[\\s\\S]*?screen\\s*:\\s*modelData" },
    { label: "Limit popup input", hint: "Give trayPopup exclusiveZone: 0 and mask it with Region { item: traySurface }.", pattern: "PanelWindow\\s*\\{\\s*id\\s*:\\s*trayPopup[\\s\\S]*?anchors\\.top\\s*:\\s*true[\\s\\S]*?anchors\\.right\\s*:\\s*true[\\s\\S]*?exclusiveZone\\s*:\\s*0[\\s\\S]*?mask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*traySurface" },
  ],
  rules: ["Create the panel and its attached tray within the same per-screen delegate.", "Let the persistent status panel reserve its height while the tray popup reserves no additional space.", "Restrict tray popup input to the visible traySurface with a Region mask."],
  explanation: ["Window topology describes how surfaces are owned and how they participate in placement, reserved space, and input. A persistent panel and its attached tray have different jobs, but they must still agree about which physical output they belong to.", "Variants creates one delegate for each entry in Quickshell.screens, and modelData is the shared ShellScreen used by both PanelWindows. statusPanel reserves its height, while trayPopup uses exclusiveZone: 0 and a Region whose item is traySurface.", "Independent windows can accidentally land on different outputs, reserve conflicting strips, or intercept input through transparent pixels. A detached-looking tray, overlapping application content, or clicks disappearing outside the visible popup indicates that the window policies are no longer coordinated."],
},

  "native-service-first": {
  starter: `import QtQuick
import Quickshell

Item {
    width: 320
    height: 100

    Text {
        id: firstReadout
        property string rawOutput: "percentage: 0%"
        function parsePercentage(output) {
            return Number(output.split(":")[1].replace("%", "").trim())
        }
        text: parsePercentage(rawOutput) + "%"
        Process { id: firstPoll; command: ["upower", "-i", "/org/freedesktop/UPower/devices/battery_BAT0"] }
        Timer { interval: 2000; running: true; repeat: true; onTriggered: firstPoll.running = true }
    }

    Text {
        id: secondReadout
        anchors.right: parent.right
        property string rawOutput: "percentage: 0%"
        function parsePercentage(output) {
            return Number(output.split(":")[1].replace("%", "").trim())
        }
        text: parsePercentage(rawOutput) + "%"
        Process { id: secondPoll; command: ["upower", "-i", "/org/freedesktop/UPower/devices/battery_BAT0"] }
        Timer { interval: 2000; running: true; repeat: true; onTriggered: secondPoll.running = true }
    }
}`,
  solution: `import QtQuick
import Quickshell.Services.UPower

Item {
    id: root
    required property QtObject upowerBattery
    width: 320
    height: 100

    QtObject {
        id: batteryService
        readonly property QtObject source: root.upowerBattery
        readonly property bool available: source.available
        readonly property int percentage: available ? source.percentage : 0
    }

    Row {
        anchors.centerIn: parent
        spacing: 32

        Repeater {
            model: 2
            delegate: Text {
                text: batteryService.available
                    ? batteryService.percentage + "%"
                    : "Battery unavailable"
            }
        }
    }
}`,
  checks: [
    { label: "Select the native module", hint: "Import Quickshell.Services.UPower and create one QtObject named batteryService.", pattern: "import\\s+Quickshell\\.Services\\.UPower[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*batteryService" },
    { label: "Expose stable observations", hint: "Inside batteryService, expose readonly bool available and readonly int percentage properties.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*batteryService[\\s\\S]*?readonly\\s+property\\s+bool\\s+available[\\s\\S]*?readonly\\s+property\\s+int\\s+percentage" },
    { label: "Share one observer", hint: "Use a Repeater with model 2 whose Text delegate binds to batteryService.percentage.", pattern: "Repeater\\s*\\{[\\s\\S]*?model\\s*:\\s*2[\\s\\S]*?Text\\s*\\{[\\s\\S]*?batteryService\\.percentage" },
  ],
  rules: ["Import the native UPower module instead of launching an upower process in each readout.", "Wrap the injected native battery object once behind readonly availability and percentage observations.", "Bind both battery readouts to the same batteryService properties."],
  explanation: ["A native service is the structured source closest to the system event that changed. One observer can preserve battery availability and identity while supplying any number of readouts.", "The UPower module establishes the native boundary, while the injected upowerBattery object avoids guessing at version-specific device-discovery APIs. The batteryService QtObject turns that source into readonly available and percentage properties, and both Repeater delegates bind to them.", "Per-delegate processes duplicate polling and make each visual item responsible for parsing and failure handling. You can recognize the problem when adding a second battery label also adds another Process, Timer, or output parser."],
},

  "resilient-stream-bridge": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    property string deviceName: "default"

    Process {
        id: watcher
        running: true
        command: ["sh", "-c", "monitor-tool --device " + root.deviceName]
        onExited: watcher.running = true
    }

    Text {
        text: watcher.running ? "Monitoring" : "Restarting"
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    property string deviceName: "default"
    property bool monitorWanted: true
    property bool stale: false
    property int restartAttempts: 0
    readonly property int maxRestartAttempts: 5

    function cancelMonitor() {
        monitorWanted = false
        restartTimer.stop()
        watcher.running = false
        stale = true
    }

    Process {
        id: watcher
        running: root.monitorWanted
        command: ["monitor-tool", "--device", root.deviceName]

        onExited: {
            if (!root.monitorWanted)
                return

            root.restartAttempts += 1
            if (root.restartAttempts < root.maxRestartAttempts)
                restartTimer.restart()
            else
                root.stale = true
        }
    }

    Timer {
        id: restartTimer
        interval: Math.min(1000 * Math.pow(2, root.restartAttempts), 30000)
        repeat: false
        onTriggered: watcher.running = root.monitorWanted
    }
}`,
  checks: [
    { label: "Keep arguments separate", hint: "Set Process.command to [\"monitor-tool\", \"--device\", root.deviceName] without sh -c.", pattern: "Process\\s*\\{(?:(?!command)[\\s\\S])*?command\\s*:\\s*\\[(?!\\s*\"sh\")[\\s\\S]*?\"monitor-tool\"\\s*,\\s*\"--device\"\\s*,\\s*root\\.deviceName\\s*\\]" },
    { label: "Cap failed restarts", hint: "In onExited, increment restartAttempts, compare it with maxRestartAttempts, and set stale when the cap is reached.", pattern: "onExited\\s*:\\s*\\{[\\s\\S]*?restartAttempts\\s*\\+=\\s*1[\\s\\S]*?restartAttempts\\s*<\\s*root\\.maxRestartAttempts[\\s\\S]*?root\\.stale\\s*=\\s*true" },
    { label: "Back off before retrying", hint: "Use a Timer whose interval grows with restartAttempts and whose onTriggered restarts watcher.", pattern: "Timer\\s*\\{[\\s\\S]*?interval\\s*:[^\\n]*restartAttempts[\\s\\S]*?onTriggered\\s*:\\s*watcher\\.running\\s*=\\s*root\\.monitorWanted" },
  ],
  rules: ["Pass the monitor executable, option, and device name as separate command-list entries.", "Ignore exit callbacks after cancellation and stop any pending restart timer.", "Increase the retry delay and declare the monitor stale after five failed starts."],
  explanation: ["A process bridge is a single service boundary around a tool that cannot be replaced by a native module. Cancellation means deliberately ignoring and stopping work that is no longer wanted, while backoff means waiting progressively longer after repeated failures.", "Process.command receives the executable and every argument as distinct list entries, so deviceName never becomes shell program text. The onExited handler counts failures, restartTimer derives a bounded exponential delay from restartAttempts, and cancelMonitor prevents late exits from scheduling more work.", "A sh -c command makes an interpolated device name executable and therefore unsafe. An unconditional onExited restart is another warning sign: when the binary is absent, the shell can enter a rapid failure loop until it consumes a CPU core."],
},

  "sparse-override-ledger": {
  starter: `import QtQuick
import Quickshell

Item {
    width: 320
    height: 80

    PersistentProperties {
        id: config
        property int barWidth: 48
        property bool drawerCurrentlyOpen: false
        property int lastFocusedWorkspace: 1
    }

    Text {
        anchors.centerIn: parent
        text: "Bar width: " + config.barWidth
    }
}`,
  solution: `import QtQuick
import Quickshell

Item {
    id: root
    required property string screenName
    property bool drawerCurrentlyOpen: false
    property var pendingOverrides: savedPolicy.monitorOverrides
    width: 320
    height: 80

    QtObject {
        id: defaults
        readonly property int barWidth: 48
    }

    PersistentProperties {
        id: savedPolicy
        property var monitorOverrides: ({})
    }

    readonly property int effectiveBarWidth:
        savedPolicy.monitorOverrides[screenName] === undefined
            ? defaults.barWidth
            : savedPolicy.monitorOverrides[screenName].barWidth

    function setBarWidth(value) {
        var next = Object.assign({}, savedPolicy.monitorOverrides)
        next[root.screenName] = { barWidth: value }
        root.pendingOverrides = next
        saveDebounce.restart()
    }

    Timer {
        id: saveDebounce
        interval: 400
        repeat: false
        onTriggered: savedPolicy.monitorOverrides = root.pendingOverrides
    }

    Text {
        anchors.centerIn: parent
        text: "Bar width: " + root.effectiveBarWidth
    }
}`,
  checks: [
    { label: "Layer policy over a default", hint: "Define defaults.barWidth as a readonly int and derive effectiveBarWidth from savedPolicy.monitorOverrides.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*defaults[\\s\\S]*?readonly\\s+property\\s+int\\s+barWidth\\s*:\\s*48[\\s\\S]*?readonly\\s+property\\s+int\\s+effectiveBarWidth\\s*:[\\s\\S]*?savedPolicy\\.monitorOverrides" },
    { label: "Persist only sparse overrides", hint: "Store only property var monitorOverrides: ({}) in savedPolicy; remove drawerCurrentlyOpen and lastFocusedWorkspace from PersistentProperties.", pattern: "PersistentProperties\\s*\\{(?:(?!drawerCurrentlyOpen|lastFocusedWorkspace)[\\s\\S])*?property\\s+var\\s+monitorOverrides\\s*:\\s*\\(\\{\\}\\)(?:(?!drawerCurrentlyOpen|lastFocusedWorkspace)[\\s\\S])*?\\n\\s*\\}" },
    { label: "Debounce the atomic update", hint: "Add saveDebounce with interval 400 and assign pendingOverrides to savedPolicy.monitorOverrides in onTriggered.", pattern: "Timer\\s*\\{[\\s\\S]*?id\\s*:\\s*saveDebounce[\\s\\S]*?interval\\s*:\\s*400[\\s\\S]*?onTriggered\\s*:\\s*savedPolicy\\.monitorOverrides\\s*=\\s*root\\.pendingOverrides" },
  ],
  rules: ["Keep the typed bar-width default outside persistent storage.", "Persist only explicit per-screen barWidth overrides, never drawer or workspace runtime state.", "Replace the override map once after a 400 millisecond debounce instead of mutating storage on every edit."],
  explanation: ["Configuration is durable user policy, while live state describes what the shell is doing at this moment. A sparse override stores only values that differ by monitor, leaving the typed default authoritative everywhere else.", "The defaults object supplies readonly barWidth, and savedPolicy persists a monitorOverrides map keyed by screenName. setBarWidth creates a replacement map, then saveDebounce performs one observable assignment after editing pauses.", "Persisting drawerCurrentlyOpen or lastFocusedWorkspace turns the policy file into a noisy event log. Frequent writes, surprising state after restart, or difficulty migrating a simple width setting all indicate that transient facts have leaked into configuration."],
},

  "popout-focus-return": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property Item trigger
    property bool popoutOpen: true

    PanelWindow {
        id: popout
        visible: root.popoutOpen
        anchors.top: true
        anchors.bottom: true
        anchors.left: true
        anchors.right: true
        color: "transparent"

        Item {
            anchors.fill: parent
            focus: true
            Keys.onEscapePressed: root.popoutOpen = false
            MouseArea {
                anchors.fill: parent
                onClicked: root.popoutOpen = false
            }
            Rectangle {
                anchors.centerIn: parent
                width: 280
                height: 220
            }
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property Item trigger
    property bool popoutOpen: true

    PanelWindow {
        id: popout
        visible: root.popoutOpen
        anchors.top: true
        anchors.bottom: true
        anchors.left: true
        anchors.right: true
        exclusiveZone: 0
        color: "transparent"
        mask: Region { item: card }

        function dismiss() {
            root.popoutOpen = false
            root.trigger.forceActiveFocus()
        }

        onVisibleChanged: {
            if (visible)
                focusLayer.forceActiveFocus()
        }

        Item {
            id: focusLayer
            anchors.fill: parent
            focus: true
            Keys.onEscapePressed: popout.dismiss()

            MouseArea {
                anchors.fill: parent
                onClicked: popout.dismiss()
            }

            Rectangle {
                id: card
                anchors.centerIn: parent
                width: 320
                height: 260
                radius: 12
                color: "#cc20242b"

                Rectangle {
                    anchors.centerIn: parent
                    width: 260
                    height: 200
                    color: "#303640"
                    Text { anchors.centerIn: parent; text: "Tray controls"; color: "white" }
                    MouseArea { anchors.fill: parent; onClicked: mouse.accepted = true }
                }
            }
        }
    }
}`,
  checks: [
    { label: "Restrict the input region", hint: "Set the PanelWindow mask to Region { item: card } so only the visible card receives pointer input.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?mask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*card\\s*\\}" },
    { label: "Restore trigger focus", hint: "Create dismiss() that closes root.popoutOpen and calls root.trigger.forceActiveFocus().", pattern: "function\\s+dismiss\\s*\\(\\s*\\)\\s*\\{[\\s\\S]*?root\\.popoutOpen\\s*=\\s*false[\\s\\S]*?root\\.trigger\\.forceActiveFocus\\s*\\(\\s*\\)" },
    { label: "Share every close path", hint: "Call popout.dismiss() from both the outside MouseArea onClicked handler and Keys.onEscapePressed.", pattern: "PanelWindow\\s*\\{(?=[\\s\\S]*?Keys\\.onEscapePressed\\s*:\\s*popout\\.dismiss\\s*\\(\\s*\\))(?=[\\s\\S]*?MouseArea\\s*\\{[\\s\\S]*?onClicked\\s*:\\s*popout\\.dismiss\\s*\\(\\s*\\))[\\s\\S]*?id\\s*:\\s*popout" },
  ],
  rules: ["Restrict the PanelWindow input mask to the visible card so empty screen space remains clickable underneath.", "Route outside-card and Escape dismissal through the same dismiss function.", "Close the popout before restoring active focus to its trigger item."],
  explanation: ["A popout and its trigger form one focus contract: opening transfers keyboard attention, and dismissal returns it. An input Region is the portion of a surface allowed to receive pointer events, so transparent pixels outside that region can pass clicks through.", "The PanelWindow uses mask: Region { item: card } while focusLayer handles Escape and dismissal clicks in the card's outer padding. Both paths call popout.dismiss(), which closes popoutOpen and invokes trigger.forceActiveFocus().", "A transparent full-screen surface without a mask can silently intercept clicks meant for applications beneath it. If Escape closes the picture but keyboard input remains stranded, the close paths are bypassing shared cleanup and focus restoration."],
},

  "authored-visual-contract": {
  starter: `import QtQuick

Rectangle {
    width: 360
    height: 200
    color: "#2e2b3a"

    Rectangle {
        anchors.fill: parent
        anchors.margins: 12
        color: "#211d2b"
        radius: 14

        Text {
            anchors.centerIn: parent
            text: "Shellcraft"
            color: "#8b7cff"
        }
    }

    Rectangle {
        x: 24
        y: 24
        width: 48
        height: 6
        radius: 8
        color: "#8b7cff"
    }
}`,
  solution: `import QtQuick

Rectangle {
    width: 360
    height: 200
    color: tokens.surface

    QtObject {
        id: tokens
        readonly property string canonDirection: "intentional hybrid"
        readonly property string dominantTopology: "edge-first continuity"
        readonly property string signatureIdea: "connected violet horizon"
        readonly property color surface: "#211d2b"
        readonly property color surfaceRaised: "#2e2b3a"
        readonly property color accent: "#8b7cff"
        readonly property real overlayOpacity: 0.86
        readonly property string typeFamily: "Inter"
        readonly property string iconFamily: "Material Symbols Rounded"
        readonly property int spacingToken: 12
        readonly property int radiusToken: 14
        readonly property int motionDuration: 180
    }

    Rectangle {
        id: card
        anchors.fill: parent
        anchors.margins: tokens.spacingToken
        color: tokens.surfaceRaised
        radius: tokens.radiusToken
        opacity: tokens.overlayOpacity

        Text {
            anchors.centerIn: parent
            text: "Shellcraft"
            color: tokens.accent
            font.family: tokens.typeFamily
        }
    }

    Rectangle {
        width: 48
        height: 6
        x: tokens.spacingToken * 2
        y: tokens.spacingToken * 2
        radius: tokens.radiusToken
        color: tokens.accent
    }
}`,
  checks: [
    { label: "Name the visual direction", hint: "Declare canonDirection, dominantTopology, and signatureIdea as readonly string properties inside tokens.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*tokens[\\s\\S]*?readonly\\s+property\\s+string\\s+canonDirection[\\s\\S]*?readonly\\s+property\\s+string\\s+dominantTopology[\\s\\S]*?readonly\\s+property\\s+string\\s+signatureIdea" },
    { label: "Define semantic visual roles", hint: "Give tokens readonly surface, surfaceRaised, accent, and overlayOpacity properties.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+surface\\s*:[\\s\\S]*?readonly\\s+property\\s+color\\s+surfaceRaised\\s*:[\\s\\S]*?readonly\\s+property\\s+color\\s+accent\\s*:[\\s\\S]*?readonly\\s+property\\s+real\\s+overlayOpacity\\s*:" },
    { label: "Build with the contract", hint: "Bind the card's margin, color, radius, and label font to tokens instead of raw values.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*card[\\s\\S]*?anchors\\.margins\\s*:\\s*tokens\\.spacingToken[\\s\\S]*?color\\s*:\\s*tokens\\.surfaceRaised[\\s\\S]*?radius\\s*:\\s*tokens\\.radiusToken[\\s\\S]*?Text\\s*\\{[\\s\\S]*?font\\.family\\s*:\\s*tokens\\.typeFamily" },
  ],
  rules: ["Name the canon direction, dominant topology, and signature idea in the token object.", "Represent palette and depth with semantic roles instead of color-shaped names.", "Reference shared spacing, radius, color, and type tokens from visible elements."],
  explanation: ["A visual contract records the decisions that make separate shell features feel like one product. Like a city's building code, it establishes direction and hierarchy before individual surfaces receive decoration.", "The tokens QtObject gives semantic names to the palette, topology, type system, spacing, radius, transparency, and motion roles. The card then binds properties such as anchors.margins, color, radius, and font.family to those shared decisions.", "Scattered hex colors and unrelated corner radii create decoration without a recognizable grammar. You can spot that failure when equivalent surfaces use different raw values or when changing the shell's direction requires hunting through individual components."],
},

  "topology-critique-studio": {
  starter: `import QtQuick

Rectangle {
    width: 420
    height: 260
    color: "#17141f"

    Rectangle {
        anchors.centerIn: parent
        anchors.horizontalCenterOffset: -90
        width: 120
        height: 38
        radius: 19
        color: "#665d8070"
    }

    Rectangle {
        anchors.centerIn: parent
        anchors.verticalCenterOffset: 54
        width: 170
        height: 72
        radius: 22
        color: "#8b7cff60"
    }

    Rectangle {
        x: 286
        y: 38
        width: 92
        height: 42
        radius: 21
        color: "#665d8070"
    }
}`,
  solution: `import QtQuick

Rectangle {
    width: 420
    height: 260
    color: "#17141f"

    Rectangle {
        id: bar
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: 42
        color: "#2e2b3a"

        Rectangle {
            id: trigger
            anchors.right: parent.right
            anchors.rightMargin: 18
            anchors.verticalCenter: parent.verticalCenter
            width: 88
            height: 30
            radius: 10
            color: "#8b7cff"
        }
    }

    Rectangle {
        id: popout
        x: bar.x + trigger.x
        y: bar.y + bar.height
        width: 180
        height: 92
        radius: 12
        color: "#2e2b3a"

        Text {
            anchors.centerIn: parent
            text: "Quick settings"
            color: "#f4f0ff"
        }
    }
}`,
  checks: [
    { label: "Choose an edge owner", hint: "Create bar and anchor its top, left, and right edges to the composition.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*bar[\\s\\S]*?anchors\\.top\\s*:\\s*parent\\.top[\\s\\S]*?anchors\\.left\\s*:\\s*parent\\.left[\\s\\S]*?anchors\\.right\\s*:\\s*parent\\.right" },
    { label: "Give the popout a trigger", hint: "Declare a trigger Rectangle inside the edge-owned bar.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*bar[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*trigger[\\s\\S]*?anchors\\.right\\s*:\\s*parent\\.right" },
    { label: "Prove structural attachment", hint: "Derive popout.x from bar.x plus trigger.x and popout.y from bar.y plus bar.height.", pattern: "Rectangle\\s*\\{\\s*id\\s*:\\s*popout[\\s\\S]*?x\\s*:\\s*bar\\.x\\s*\\+\\s*trigger\\.x[\\s\\S]*?y\\s*:\\s*bar\\.y\\s*\\+\\s*bar\\.height" },
  ],
  rules: ["Anchor one dominant bar to the screen edge.", "Place the popout trigger inside that owning bar.", "Derive the popout position from its bar and trigger instead of independent coordinates."],
  explanation: ["Topology describes how shell surfaces own space and relate to one another. A dominant edge-owned bar gives supporting layers a clear origin while still allowing them to borrow playful color or depth treatments.", "The bar anchors to the composition's top, left, and right edges, and trigger lives inside it. The popout binds x to bar.x plus trigger.x and y to bar.y plus bar.height, making its ownership visible in both geometry and code.", "Card soup appears when every translucent pill floats from unrelated coordinates and none can explain where it came from. It becomes obvious when moving a trigger leaves its supposed popout behind or when several surfaces compete equally for attention."],
},

  "responsive-fullscreen-matrix": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            required property ShellScreen modelData
            property bool clientFullscreen: false

            screen: modelData
            anchors.top: true
            anchors.left: true
            anchors.right: true
            height: 34
            exclusiveZone: 34
            color: "#211d2b"
            opacity: clientFullscreen ? 0 : 1

            Rectangle {
                anchors.fill: parent
                color: "#2e2b3a"
            }
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            required property ShellScreen modelData
            property bool clientFullscreen: false
            readonly property bool fullscreenPolicy: clientFullscreen
            readonly property int barHeight: 34

            screen: modelData
            anchors.top: true
            anchors.left: true
            anchors.right: true
            height: barHeight

            Region {
                id: emptyRegion
            }

            Region {
                id: contentRegion
                item: barContent
            }

            exclusiveZone: fullscreenPolicy ? 0 : barHeight
            visible: !fullscreenPolicy
            mask: fullscreenPolicy ? emptyRegion : contentRegion
            color: fullscreenPolicy ? "transparent" : "#211d2b"

            Rectangle {
                id: barContent
                anchors.fill: parent
                color: "#2e2b3a"
            }
        }
    }
}`,
  checks: [
    { label: "Apply policy per screen", hint: "Use Variants with Quickshell.screens and require ShellScreen modelData on the PanelWindow.", pattern: "Variants\\s*\\{[\\s\\S]*?model\\s*:\\s*Quickshell\\.screens[\\s\\S]*?PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData" },
    { label: "Release invisible space", hint: "Derive fullscreenPolicy from clientFullscreen, then use it for both exclusiveZone and visible.", pattern: "readonly\\s+property\\s+bool\\s+fullscreenPolicy\\s*:\\s*clientFullscreen[\\s\\S]*?exclusiveZone\\s*:\\s*fullscreenPolicy\\s*\\?\\s*0\\s*:\\s*barHeight[\\s\\S]*?visible\\s*:\\s*!fullscreenPolicy" },
    { label: "Coordinate input and surface", hint: "Select emptyRegion for mask and transparent for color when fullscreenPolicy is active.", pattern: "mask\\s*:\\s*fullscreenPolicy\\s*\\?\\s*emptyRegion\\s*:\\s*contentRegion[\\s\\S]*?color\\s*:\\s*fullscreenPolicy\\s*\\?\\s*\"transparent\"\\s*:\\s*\"#211d2b\"" },
  ],
  rules: ["Instantiate the fullscreen policy inside each screen variant.", "Set the fullscreen exclusion zone to zero and hide the panel through the same policy.", "Replace the content input mask with an empty Region whenever fullscreen policy is active."],
  explanation: ["A responsive shell treats each ShellScreen as its own composition rather than shrinking one universal layout. Fullscreen is also a policy state: one cue must coordinate every window behavior that could affect the client underneath.", "Variants creates one PanelWindow for each entry in Quickshell.screens, with modelData identifying that screen. fullscreenPolicy drives exclusiveZone, visible, mask, and color, so presentation, reserved space, and input coverage change together.", "Opacity alone can make a bar look absent while its exclusive zone and input region remain active. The symptom is an invisible strip that still moves windows, rejects clicks, or leaves unexplained space beside a fullscreen client."],
},

  "map-one-evidence-pack": {
  starter: `import QtQuick
import Quickshell

ShellRoot {
    property bool detailsOpen: false

    PanelWindow {
        anchors.top: true
        anchors.left: true
        anchors.right: true
        height: detailsOpen ? 108 : 34
        exclusiveZone: 34
        color: "#211d2b"

        Text {
            text: "battery: 82%"
            color: "white"
        }

        Rectangle {
            y: 34
            width: 220
            height: 74
            visible: detailsOpen
            color: "#2e2b3a"
            Text { anchors.centerIn: parent; text: "Charge is healthy" }
        }

        MouseArea {
            anchors.fill: parent
            onClicked: detailsOpen = !detailsOpen
        }
    }
}`,
  solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    property bool detailsOpen: false

    QtObject {
        id: batteryService
        property bool available: true
        property int percentage: 82
        property int refreshCount: 0

        function refresh(): void {
            refreshCount += 1
        }
    }

    IpcHandler {
        target: "battery"

        function refresh(): void {
            batteryService.refresh()
        }
    }

    PanelWindow {
        anchors.top: true
        anchors.left: true
        anchors.right: true
        height: root.detailsOpen ? 112 : 34
        exclusiveZone: 34
        color: "#211d2b"

        Text {
            id: compactReadout
            text: batteryService.available ? batteryService.percentage + "%" : "n/a"
            color: "white"
        }

        Rectangle {
            id: popout
            y: 34
            width: 240
            height: 78
            visible: root.detailsOpen
            color: "#2e2b3a"

            Text {
                anchors.centerIn: parent
                text: batteryService.available
                    ? "Charge " + batteryService.percentage + "% · refresh " + batteryService.refreshCount
                    : "Battery unavailable"
                color: "white"
            }
        }

        MouseArea {
            anchors.fill: parent
            onClicked: root.detailsOpen = !root.detailsOpen
        }
    }
}`,
  checks: [
    { label: "Own service state", hint: "Create batteryService with available, percentage, and a refresh() function.", pattern: "QtObject\\s*\\{\\s*id\\s*:\\s*batteryService[\\s\\S]*?property\\s+bool\\s+available\\s*:[\\s\\S]*?property\\s+int\\s+percentage\\s*:[\\s\\S]*?function\\s+refresh\\s*\\(\\s*\\)\\s*:\\s*void" },
    { label: "Bind both surface depths", hint: "Bind compactReadout and the popout detail Text to batteryService.available and batteryService.percentage.", pattern: "Text\\s*\\{\\s*id\\s*:\\s*compactReadout[\\s\\S]*?text\\s*:\\s*batteryService\\.available\\s*\\?[\\s\\S]*?batteryService\\.percentage[\\s\\S]*?Rectangle\\s*\\{\\s*id\\s*:\\s*popout[\\s\\S]*?Text\\s*\\{[\\s\\S]*?text\\s*:\\s*batteryService\\.available\\s*\\?[\\s\\S]*?batteryService\\.percentage" },
    { label: "Expose a real input route", hint: "Add IpcHandler target \"battery\" whose refresh() function calls batteryService.refresh().", pattern: "IpcHandler\\s*\\{[\\s\\S]*?target\\s*:\\s*\"battery\"[\\s\\S]*?function\\s+refresh\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?batteryService\\.refresh\\s*\\(\\s*\\)" },
  ],
  rules: ["Keep battery availability and percentage in one service-owned object.", "Bind both compact and detailed battery surfaces to the same service state.", "Route the battery IPC refresh command into batteryService.refresh()."],
  explanation: ["A vertical slice is one domain working all the way from owned service state to useful surfaces and real input. It is the smallest unit that can provide meaningful runtime evidence because every layer participates.", "batteryService owns availability, percentage, and refresh state; compactReadout and popout bind directly to those properties. IpcHandler exposes refresh() under the battery target and forwards that input to the same service object.", "A hard-coded percentage can make screenshots convincing while proving nothing about state flow, degradation, or external control. The fake becomes visible when changing service state does not update every surface or when no IPC command can reach the domain."],
},
};
