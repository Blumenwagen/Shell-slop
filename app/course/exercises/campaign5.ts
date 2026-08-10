/** Authored exercises for campaign 5 quests. See docs/EXERCISE_AUTHORING_SPEC.md. */
import type { AtlasExercise } from "./types.ts";

export const CAMPAIGN5_EXERCISES: Record<string, AtlasExercise> = {
  // ---------------------------------------------------------------------
  // architecture-keep
  // ---------------------------------------------------------------------
  "thin-root-refactor": {
    starter: `import Quickshell
import Quickshell.Io
import QtQuick

ShellRoot {
    id: shell
    PanelWindow {
        anchors { top: true; left: true; right: true }
        exclusiveZone: 32
        Rectangle {
            anchors.fill: parent
            color: "#20242b"
            Text { anchors.centerIn: parent; text: "Production Citadel" }
        }
    }
    Process {
        id: batteryPoller
        command: ["upower", "--enumerate"]
        running: true
    }
    PanelWindow {
        id: drawerWindow
        visible: false
        Rectangle {
            anchors.fill: parent
            color: "#d020242b"
            Text { anchors.centerIn: parent; text: "Quick settings" }
        }
    }
}`,
    solution: `import Quickshell
import Quickshell.Io
import QtQuick
import qs.modules.bar
import qs.modules.drawer
import qs.services.power

ShellRoot {
    id: shell

    PowerService {
        id: powerService
    }

    BarModule {
        powerService: powerService
    }

    DrawerModule {
        id: drawer
    }

    IpcHandler {
        target: "shell"
        function toggleDrawer(): void {
            drawer.toggle()
        }
    }

    Component.onCompleted: console.info("Shell composition ready")
}`,
    checks: [
      { label: "Feature packages are imported", hint: "Import the bar, drawer, and power-owner packages instead of defining their internals in shell.qml.", pattern: "^(?:import[^\\n]*\\n)+(?=[\\s\\S]*import\\s+qs\\.modules\\.bar\\b)(?=[\\s\\S]*import\\s+qs\\.modules\\.drawer\\b)(?=[\\s\\S]*import\\s+qs\\.services\\.power\\b)[\\s\\S]*ShellRoot\\s*\\{" },
      { label: "Root only composes owners", hint: "Instantiate PowerService once and pass it to BarModule while composing DrawerModule separately.", pattern: "ShellRoot\\s*\\{(?=[\\s\\S]*?\\bPowerService\\s*\\{)(?=[\\s\\S]*?\\bBarModule\\s*\\{[\\s\\S]*?powerService\\s*:\\s*powerService)(?=[\\s\\S]*?\\bDrawerModule\\s*\\{)[\\s\\S]*\\}" },
      { label: "Feature internals leave the root", hint: "Keep lifecycle glue and the global IPC endpoint, but remove inline windows, processes, and rectangles.", pattern: "ShellRoot\\s*\\{(?![\\s\\S]*(?:PanelWindow|Process|Rectangle)\\s*\\{)(?=[\\s\\S]*Component\\.onCompleted\\s*:)(?=[\\s\\S]*IpcHandler\\s*\\{)[\\s\\S]*\\}" },
    ],
    rules: ["Import the bar, drawer, and power service from named packages instead of defining their internals inside ShellRoot.", "Instantiate PowerService once at composition level and inject it into BarModule through its powerService property.", "Leave only module composition, lifecycle glue, and the intentional shell IPC endpoint in shell.qml."],
    explanation: [
      "A thin root is a composition boundary: a small file that declares which independently owned features make up the shell. Keeping that boundary sparse lets a bar, drawer, or observer reload and fail within its own domain instead of entangling every top-level window.",
      "The solution imports qs.modules.bar, qs.modules.drawer, and qs.services.power, then composes BarModule, DrawerModule, and PowerService under ShellRoot. The powerService object is passed explicitly to BarModule, while Component.onCompleted and the shell IpcHandler remain as legitimate lifecycle and global-action glue.",
      "The original root mixes bar geometry, drawer visuals, and a battery Process in one ownership scope, so an edit to any feature can disturb all three. This failure is recognizable when shell.qml contains visual primitives, polling commands, or feature policy rather than a short inventory of named modules.",
    ],
  },
  "dependency-boundary-wall": {
    starter: `import QtQuick
import Quickshell.Io

Rectangle {
    id: notificationCard
    required property string summary
    width: 320
    height: 72

    Process {
        id: notificationDiscovery
        command: ["notifyctl", "watch"]
        running: true
    }

    Text {
        anchors.centerIn: parent
        text: notificationCard.summary
    }

    MouseArea {
        anchors.fill: parent
        onClicked: notificationDiscovery.running = true
    }
}`,
    solution: `import QtQuick
import Quickshell.Io

Item {
    id: notificationsModule
    width: 320
    height: 72

    property QtObject notificationState: QtObject {
        property string summary: "No new notifications"
    }

    Process {
        id: notificationObserver
        command: ["notifyctl", "watch"]
        running: true
    }

    function dismissLatest(): void {
        notificationState.summary = "No new notifications"
    }

    component NotificationCard: Rectangle {
        required property QtObject notificationState
        required property var dismissAction

        width: 320
        height: 72
        color: "#252a33"

        Text {
            anchors.centerIn: parent
            text: notificationState.summary
        }

        MouseArea {
            anchors.fill: parent
            onClicked: dismissAction()
        }
    }

    NotificationCard {
        notificationState: notificationsModule.notificationState
        dismissAction: notificationsModule.dismissLatest
    }
}`,
    checks: [
      { label: "Module owns system observation", hint: "Place the notification Process in the module above the visual component definition.", pattern: "Item\\s*\\{(?=[\\s\\S]*?\\bid\\s*:\\s*notificationsModule\\b)[\\s\\S]*?Process\\s*\\{[\\s\\S]*?command\\s*:\\s*\\[\\s*\"notifyctl\"\\s*,\\s*\"watch\"\\s*\\][\\s\\S]*?component\\s+NotificationCard\\s*:" },
      { label: "Delegate contract is injected", hint: "Give NotificationCard required notificationState and dismissAction properties.", pattern: "component\\s+NotificationCard\\s*:\\s*Rectangle\\s*\\{(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+notificationState\\b)(?=[\\s\\S]*?required\\s+property\\s+var\\s+dismissAction\\b)[\\s\\S]*\\}" },
      { label: "Delegate stays presentation-only", hint: "Read the injected summary and call the injected action without creating another Process.", pattern: "component\\s+NotificationCard\\s*:\\s*Rectangle\\s*\\{(?![\\s\\S]*?\\bProcess\\s*\\{)(?=[\\s\\S]*?notificationState\\.summary)(?=[\\s\\S]*?dismissAction\\s*\\(\\))[\\s\\S]*?\\n\\s*\\}" },
    ],
    rules: ["Create the notification observer once in the owning notifications module.", "Declare notificationState and dismissAction as required properties on NotificationCard.", "Render injected state and invoke the injected action without placing a Process inside NotificationCard."],
    explanation: [
      "Dependency direction describes which layer may know about another layer, with higher-level modules owning system access and lower-level visual components receiving narrow contracts. This downhill flow makes notification cards reusable and prevents every delegate from starting its own operating-system observer.",
      "The notificationsModule owns one Process with the array command for notifyctl and exposes state plus the dismissLatest action. Its inline NotificationCard declares required property QtObject notificationState and required property var dismissAction, then binds text and input exclusively to those injected members.",
      "When a delegate performs discovery itself, every card can duplicate work and become sensitive to creation order or hot reloads. Look for Process objects, service singletons, or system queries inside rectangles and list delegates; those are strong signs that observation has leaked below its owner.",
    ],
  },
  "injection-registry-pattern": {
    starter: `import QtQuick

Item {
    id: networkButton
    width: 40
    height: 40

    function openPopout(): void {
        parent.parent.children[0].visible = true
    }

    Rectangle {
        anchors.fill: parent
        color: "#384152"
    }

    MouseArea {
        anchors.fill: parent
        onClicked: networkButton.openPopout()
    }
}`,
    solution: `import Quickshell
import QtQuick

Item {
    id: networkControl

    required property QtObject networkState
    required property QtObject popoutRegistry
    required property ShellScreen screen

    readonly property string connectionLabel: networkState.status ?? "unavailable"

    function togglePopout(): void {
        networkPopout.visible = !networkPopout.visible
    }

    Rectangle {
        width: 120
        height: 40
        color: "#384152"

        Text {
            anchors.centerIn: parent
            text: networkControl.connectionLabel
        }

        MouseArea {
            anchors.fill: parent
            onClicked: networkControl.togglePopout()
        }
    }

    PanelWindow {
        id: networkPopout
        screen: networkControl.screen
        visible: false
        anchors { top: true; right: true }
        implicitWidth: 280
        implicitHeight: 180
        color: "#252a33"
    }

    Component.onCompleted: popoutRegistry.register(screen, "network-popout", networkPopout)
    Component.onDestruction: popoutRegistry.unregister(screen, "network-popout")
}`,
    checks: [
      { label: "Local contracts are required", hint: "Inject both network state and the cross-cutting registry as explicit QtObject properties.", pattern: "Item\\s*\\{(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+networkState\\b)(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+popoutRegistry\\b)[\\s\\S]*\\}" },
      { label: "Window receives stable screen identity", hint: "Require a ShellScreen and bind the popout window directly to it.", pattern: "Item\\s*\\{(?=[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+screen\\b)(?=[\\s\\S]*?PanelWindow\\s*\\{[\\s\\S]*?screen\\s*:\\s*networkControl\\.screen)[\\s\\S]*\\}" },
      { label: "Registry uses screen and role", hint: "Register and unregister the popout using the ShellScreen object plus one stable role string.", pattern: "Item\\s*\\{(?=[\\s\\S]*?Component\\.onCompleted\\s*:\\s*popoutRegistry\\.register\\(screen,\\s*\"network-popout\",\\s*networkPopout\\))(?=[\\s\\S]*?Component\\.onDestruction\\s*:\\s*popoutRegistry\\.unregister\\(screen,\\s*\"network-popout\"\\))[\\s\\S]*\\}" },
    ],
    rules: ["Require networkState, popoutRegistry, and screen instead of discovering them through ancestors or object names.", "Bind networkPopout.screen to the injected ShellScreen object rather than a numeric screen index.", "Register and unregister the shared popout under the stable network-popout role for its exact screen."],
    explanation: [
      "Injection means a component receives the capabilities it needs through declared properties rather than discovering authority in its surroundings. A registry is a deliberately shared ledger, appropriate here only because shell-wide actions must locate the active network popout for a particular physical screen.",
      "The solution requires networkState, popoutRegistry, and a ShellScreen named screen, making each dependency visible at construction time. Component.onCompleted registers networkPopout with the pair of screen and network-popout role, while Component.onDestruction removes precisely that same entry.",
      "Walking parent.parent or selecting children by array position depends on an accidental object-tree shape that changes during refactors and screen reloads. The defect often appears as the wrong popout opening after monitors reorder, or as a null ancestor access when an innocent wrapper Item is introduced.",
    ],
  },
  "coupling-demolition-boss": {
    starter: `import Quickshell
import Quickshell.Io
import QtQuick

ShellRoot {
    Process {
        id: rootResourcePoller
        command: ["uptime", "-p"]
        running: true
    }

    Variants {
        model: Quickshell.screens

        PanelWindow {
            required property int index
            screen: Quickshell.screens[index]
            anchors { top: true }

            Process {
                id: perScreenResourcePoller
                command: ["uptime", "-p"]
                running: true
            }

            Text { text: perScreenResourcePoller.running ? "loading" : "ready" }
        }
    }
}`,
    solution: `import Quickshell
import Quickshell.Io
import QtQuick

ShellRoot {
    id: shell

    readonly property string ownershipNote: "resourceService owns uptime observation"
    property int reloadCount: 0

    component ResourceService: QtObject {
        id: service

        readonly property string state: observer.running ? "loading" : "ready"

        property Process observer: Process {
            id: observer
            command: ["uptime", "-p"]
            running: true
        }
    }

    component ScreenFeature: PanelWindow {
        id: feature

        required property ShellScreen modelData
        required property QtObject resourceService

        screen: modelData
        anchors { top: true }
        exclusiveZone: 28
        color: "#252a33"

        Text {
            anchors.centerIn: parent
            text: resourceService.state
        }
    }

    ResourceService {
        id: resourceOwner
    }

    Variants {
        model: Quickshell.screens

        ScreenFeature {
            resourceService: resourceOwner
        }
    }

    Component.onCompleted: reloadCount += 1
}`,
    checks: [
      { label: "Exactly one observer owner remains", hint: "Put the sole uptime Process inside ResourceService and remove every duplicate Process.", pattern: "ShellRoot\\s*\\{(?![\\s\\S]*\\bProcess\\s*\\{[\\s\\S]*\\bProcess\\s*\\{)(?=[\\s\\S]*component\\s+ResourceService\\s*:\\s*QtObject\\s*\\{[\\s\\S]*?property\\s+Process\\s+observer\\s*:\\s*Process\\s*\\{[\\s\\S]*?command\\s*:\\s*\\[\\s*\"uptime\"\\s*,\\s*\"-p\"\\s*\\])[\\s\\S]*\\}" },
      { label: "Visual feature consumes an injected contract", hint: "Require resourceService on ScreenFeature and read its state without adding another observer.", pattern: "component\\s+ScreenFeature\\s*:\\s*PanelWindow\\s*\\{(?![\\s\\S]*?\\bProcess\\s*\\{)(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+resourceService\\b)(?=[\\s\\S]*?text\\s*:\\s*resourceService\\.state\\b)[\\s\\S]*?\\n\\s*\\}" },
      { label: "Screens are keyed by object identity", hint: "Drive Variants from Quickshell.screens and require ShellScreen modelData instead of using an index.", pattern: "ShellRoot\\s*\\{(?=[\\s\\S]*component\\s+ScreenFeature\\s*:\\s*PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData\\b[\\s\\S]*?screen\\s*:\\s*modelData)(?=[\\s\\S]*Variants\\s*\\{[\\s\\S]*?model\\s*:\\s*Quickshell\\.screens[\\s\\S]*?ScreenFeature\\s*\\{[\\s\\S]*?resourceService\\s*:\\s*resourceOwner)[\\s\\S]*\\}" },
    ],
    rules: ["Consolidate uptime observation into the single ResourceService-owned Process.", "Inject resourceOwner into every ScreenFeature and keep Process objects out of the visual feature.", "Identify each ScreenFeature with required ShellScreen modelData from Quickshell.screens instead of an array index."],
    explanation: [
      "The capstone architecture establishes one owner for each system observation, one-way contracts for consumers, and object identity for per-screen instances. Those three guarantees let visual modules move or reload without changing polling behavior, duplicating external work, or attaching state to the wrong monitor.",
      "ResourceService owns the only Process and publishes its state, while ScreenFeature requires that owner through a QtObject property. Variants iterates Quickshell.screens, supplies required ShellScreen modelData, and binds PanelWindow.screen directly to that identity; ownershipNote and reloadCount preserve simple review evidence.",
      "The broken graph polls uptime once at the root and again for every screen, then chooses screens by a mutable numeric index. It fails under monitor reorder or repeated reload when observations multiply, labels follow the wrong output, or relocating a Text component unexpectedly changes how many system processes run.",
    ],
  },

  // ---------------------------------------------------------------------
  // performance-mines
  // ---------------------------------------------------------------------
  "first-useful-frame-budget": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    property bool overviewRequested: false

    Component.onCompleted: overviewRequested = true

    LazyLoader {
        active: root.overviewRequested
        component: Component {
            PanelWindow {
                visible: true
                width: 640
                height: 480
                color: "#20242b"
            }
        }
    }

    PanelWindow {
        visible: true
        height: 32
        anchors { top: true; left: true; right: true }
        color: "#16191f"
    }
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    readonly property real startedAtMs: Date.now()
    property bool firstFrameReady: false
    property bool idleWindow: false

    QtObject {
        id: startupMetric
        property real barReadyMs: -1
        readonly property string essentialPhase: "bar"
        readonly property string deferredPhase: "overview"
    }

    PanelWindow {
        visible: true
        height: 32
        anchors { top: true; left: true; right: true }
        color: "#16191f"

        Component.onCompleted: {
            startupMetric.barReadyMs = Date.now() - root.startedAtMs
            root.firstFrameReady = true
            idleGate.start()
        }
    }

    Timer {
        id: idleGate
        interval: 250
        repeat: false
        onTriggered: root.idleWindow = true
    }

    LazyLoader {
        id: overviewLoader
        active: root.firstFrameReady && root.idleWindow
        component: Component {
            PanelWindow {
                visible: true
                width: 640
                height: 480
                color: "#20242b"
            }
        }
    }
}`,
    checks: [
      { label: "Typed startup metric", hint: "Record bar readiness in a dedicated typed metric object.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*startupMetric[\\s\\S]*?property\\s+real\\s+barReadyMs\\s*:\\s*-1" },
      { label: "Bar marks readiness", hint: "Capture elapsed startup time when the essential bar object becomes ready.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?Component\\.onCompleted\\s*:\\s*\\{[\\s\\S]*?startupMetric\\.barReadyMs\\s*=\\s*Date\\.now\\(\\)\\s*-\\s*root\\.startedAtMs" },
      { label: "Overview leaves the critical path", hint: "Activate the optional overview only after bar readiness and the idle gate.", pattern: "LazyLoader\\s*\\{[\\s\\S]*?id\\s*:\\s*overviewLoader[\\s\\S]*?active\\s*:\\s*root\\.firstFrameReady\\s*&&\\s*root\\.idleWindow" },
    ],
    rules: ["Record the bar-ready duration in startupMetric.barReadyMs.", "Construct the essential PanelWindow before activating the overview.", "Gate overviewLoader on both firstFrameReady and idleWindow."],
    explanation: [
      "The first useful frame is the earliest rendered surface that lets the user understand or operate the shell, rather than merely the moment its process starts. Measuring that milestone separates essential startup cost from attractive but optional work and makes cold-start comparisons meaningful.",
      "The solution stores Date.now() in startedAtMs and writes the elapsed value to startupMetric.barReadyMs from the bar's Component.onCompleted handler. It then starts idleGate, while overviewLoader remains inactive until both firstFrameReady and idleWindow are true.",
      "An eager overview can create windows, delegates, images, and service bindings before the small bar is available, so shortening an animation will not repair the actual delay. The recognizable symptom is a late bar accompanied by startup work from surfaces the user has not requested.",
    ],
  },
  "deferred-stable-work": {
    starter: `import QtQuick
import Quickshell

Item {
    id: root
    width: 420
    height: 300
    required property var values
    property bool showOptional: false

    ListView {
        anchors.fill: parent
        model: root.values.filter(entry => entry.enabled).sort((left, right) => left.rank - right.rank)
        delegate: Text { text: modelData.label }
    }

    LazyLoader {
        id: detailsLoader
        active: root.showOptional
        component: Component {
            Rectangle { width: 240; height: 180; color: "#252a33" }
        }
    }

    readonly property Item details: detailsLoader.item
}`,
    solution: `import QtQuick
import Quickshell

Item {
    id: root
    width: 420
    height: 300
    required property var values
    property bool showOptional: false

    ScriptModel {
        id: stableEntries
        values: root.values.filter(entry => entry.enabled).sort((left, right) => left.rank - right.rank)
    }

    ListView {
        anchors.fill: parent
        model: stableEntries

        delegate: Text {
            required property var modelData
            text: modelData.label
        }
    }

    LazyLoader {
        id: detailLoader
        active: root.showOptional
        component: Component {
            Rectangle {
                width: 240
                height: 180
                color: "#252a33"
            }
        }
    }

    readonly property Item optionalItem: detailLoader.active && !detailLoader.loading
        ? detailLoader.item
        : null
}`,
    checks: [
      { label: "Stable filtered model", hint: "Place the filtered and sorted values behind a ScriptModel.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?id\\s*:\\s*stableEntries[\\s\\S]*?values\\s*:\\s*root\\.values\\.filter\\(entry\\s*=>\\s*entry\\.enabled\\)\\.sort\\(\\(left,\\s*right\\)\\s*=>\\s*left\\.rank\\s*-\\s*right\\.rank\\)" },
      { label: "List uses model identity", hint: "Bind the ListView to the ScriptModel instead of a raw array expression.", pattern: "ListView\\s*\\{[\\s\\S]*?model\\s*:\\s*stableEntries\\b" },
      { label: "Loader access is guarded", hint: "Read the loaded item only when the loader is active and no longer loading.", pattern: "readonly\\s+property\\s+Item\\s+optionalItem\\s*:\\s*detailLoader\\.active\\s*&&\\s*!detailLoader\\.loading\\s*\\?\\s*detailLoader\\.item\\s*:\\s*null" },
    ],
    rules: ["Expose filtered and sorted entries through stableEntries.", "Bind the ListView model to the ScriptModel object.", "Read detailLoader.item only after active is true and loading is false."],
    explanation: [
      "Delegate identity is the continuity between one logical model entry and its existing visual delegate across updates. A production shell needs that continuity so focus, transitions, cached content, and interaction state survive when filtering or ordering changes.",
      "ScriptModel owns the derived values in stableEntries, and the ListView binds its model directly to that named object instead of consuming a fresh array expression. The optionalItem binding also checks detailLoader.active and detailLoader.loading before it reads detailLoader.item.",
      "Repeatedly assigning raw filtered arrays can make a view discard delegates even when the underlying entries remain the same, producing flicker, lost keyboard focus, or restarted animations. Unconditional loader-item access adds a second warning sign because optional depth begins influencing the supposedly essential path.",
    ],
  },
  "hidden-work-suspension": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject mediaPlayer
    property bool drawerOpen: false

    PanelWindow {
        visible: true
        width: 360
        anchors { top: true; bottom: true; right: true }
        color: "#151922"
        opacity: root.drawerOpen ? 1 : 0

        Rectangle {
            id: visualizer
            anchors.fill: parent
            property real sample: 0

            Timer {
                interval: 16
                repeat: true
                running: true
                onTriggered: visualizer.sample = root.mediaPlayer.level
            }
        }
    }
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject mediaPlayer
    property bool drawerOpen: false
    readonly property int artworkCacheLimit: 12

    ScriptModel {
        id: artworkCache
        values: (root.mediaPlayer.artworkHistory ?? []).filter(
            (entry, index) => index < root.artworkCacheLimit
        )
    }

    PanelWindow {
        id: mediaDrawer
        visible: root.drawerOpen
        width: 360
        anchors { top: true; bottom: true; right: true }
        color: "#151922"

        Rectangle {
            id: visualizer
            anchors.fill: parent
            color: "#202735"
            property real sample: 0

            Timer {
                interval: 16
                repeat: true
                running: root.drawerOpen
                onTriggered: visualizer.sample = root.mediaPlayer.level ?? 0
            }
        }
    }
}`,
    checks: [
      { label: "Bounded artwork cache", hint: "Declare a finite artwork-cache limit on the shell root.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+artworkCacheLimit\\s*:\\s*12\\b" },
      { label: "Sampling follows visibility", hint: "Bind the high-frequency timer to the drawer-open state.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?id\\s*:\\s*mediaDrawer[\\s\\S]*?Timer\\s*\\{[\\s\\S]*?interval\\s*:\\s*16[\\s\\S]*?running\\s*:\\s*root\\.drawerOpen\\b" },
      { label: "Cache input is capped", hint: "Filter artwork history to entries below artworkCacheLimit.", pattern: "ScriptModel\\s*\\{[\\s\\S]*?id\\s*:\\s*artworkCache[\\s\\S]*?values\\s*:\\s*\\(root\\.mediaPlayer\\.artworkHistory\\s*\\?\\?\\s*\\[\\]\\)\\.filter\\([\\s\\S]*?\\(entry,\\s*index\\)\\s*=>\\s*index\\s*<\\s*root\\.artworkCacheLimit" },
    ],
    rules: ["Bind the visualizer Timer running property to drawerOpen.", "Hide mediaDrawer with visible instead of relying on opacity alone.", "Limit artworkCache to the first artworkCacheLimit entries."],
    explanation: [
      "Suspension means stopping expensive machinery when its output cannot be seen, not merely making the resulting pixels transparent. Shell visualizers often sample many times per second, so an invisible but active timer can consume CPU and provoke rendering work throughout an ordinary desktop session.",
      "The mediaDrawer uses visible: root.drawerOpen, and its 16-millisecond Timer independently binds running to the same policy state. artworkCache is a ScriptModel whose filter retains only indices below artworkCacheLimit, giving retained album-art data an explicit upper bound.",
      "Opacity zero still leaves an item present and does not automatically halt timers, service polling, texture updates, or related bindings. This defect appears as persistent processor or graphics activity after closing the drawer, while an uncapped history reveals itself through memory that rises across repeated track changes.",
    ],
  },
  "plugin-threshold-boss": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject nativeHotspot

    readonly property var optimizedResult: root.nativeHotspot.result
    readonly property string selectedEngine: "native"

    QtObject {
        id: optimizationState
        property bool enabled: true
    }
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject nativeHotspot
    required property real profiledMs
    required property real qmlAttemptedMs
    required property int profileRuns
    readonly property real qmlResult: root.qmlAttemptedMs

    QtObject {
        id: optimizationDecision
        readonly property real thresholdMs: 8
        readonly property bool nativeJustified: root.profileRuns >= 5
            && root.profiledMs > optimizationDecision.thresholdMs
            && root.qmlAttemptedMs > optimizationDecision.thresholdMs
        readonly property string selectedEngine: nativeJustified ? "native" : "qml"
    }

    readonly property var optimizedResult: optimizationDecision.nativeJustified
        ? root.nativeHotspot.result
        : root.qmlResult
}`,
    checks: [
      { label: "Typed profiling evidence", hint: "Require measured hotspot time, QML-attempt time, and a run count.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?required\\s+property\\s+real\\s+profiledMs[\\s\\S]*?required\\s+property\\s+real\\s+qmlAttemptedMs[\\s\\S]*?required\\s+property\\s+int\\s+profileRuns" },
      { label: "Evidence gates native use", hint: "Justify native code only after repeated profiles and both timings exceed the threshold.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*optimizationDecision[\\s\\S]*?readonly\\s+property\\s+bool\\s+nativeJustified\\s*:\\s*root\\.profileRuns\\s*>=\\s*5[\\s\\S]*?root\\.profiledMs\\s*>\\s*optimizationDecision\\.thresholdMs[\\s\\S]*?root\\.qmlAttemptedMs\\s*>\\s*optimizationDecision\\.thresholdMs" },
      { label: "QML fallback remains active", hint: "Choose the injected native result only when nativeJustified is true.", pattern: "readonly\\s+property\\s+var\\s+optimizedResult\\s*:\\s*optimizationDecision\\.nativeJustified\\s*\\?\\s*root\\.nativeHotspot\\.result\\s*:\\s*root\\.qmlResult" },
    ],
    rules: ["Require profiledMs, qmlAttemptedMs, and profileRuns as typed evidence.", "Set nativeJustified only after five runs and two above-threshold measurements.", "Use nativeHotspot.result only through the nativeJustified decision."],
    explanation: [
      "A native plugin is compiled code exposed to QML, and it adds an application-binary-interface boundary that must remain compatible across builds and packages. That depth is worthwhile only when repeatable profiles identify a hotspot that simpler QML structure, built-in models, or caching did not remove.",
      "The root receives nativeHotspot through a required QtObject property and separately requires profiledMs, qmlAttemptedMs, and profileRuns as typed evidence. optimizationDecision enables its nativeJustified flag only after five samples and after both the original profile and QML-first attempt exceed thresholdMs.",
      "Jumping directly to nativeHotspot.result hides whether compiled code solves the measured problem while immediately accepting build, packaging, security, and compatibility costs. The failure is recognizable when a native path is always selected despite missing run counts, absent QML benchmarks, or timings below the declared threshold.",
    ],
  },

  // ---------------------------------------------------------------------
  // resilience-range
  // ---------------------------------------------------------------------
  "reload-syntax-firebreak": {
    starter: `import QtQuick
import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    property bool focusHeld: true

    PersistentProperties {
        property string selectedTab: "status"
        property bool confirmationVisible: true
    }

    IpcHandler {
        target: "shell"
        function reloadStatus(): string { return "ready" }
    }
}`,
    solution: `pragma Singleton
import QtQuick
import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    readonly property int ownerInstanceCount: reloadState.ownerCount
    property bool confirmationVisible: false
    property bool focusHeld: false

    PersistentProperties {
        id: reloadState
        property int ownerCount: 0
        property string selectedTab: "status"
    }

    IpcHandler {
        target: "shell"
        function reloadStatus(): string {
            return root.ownerInstanceCount === 1 ? "ready" : "duplicate"
        }
    }

    Component.onCompleted: {
        if (reloadState.ownerCount === 0)
            reloadState.ownerCount = 1
        confirmationVisible = false
        focusHeld = false
    }

    Component.onDestruction: {
        confirmationVisible = false
        focusHeld = false
    }
}`,
    checks: [
      { label: "Singleton owner", hint: "Place the reload-sensitive owner in a singleton root and expose its typed instance count.", pattern: "pragma\\s+Singleton[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+ownerInstanceCount\\s*:\\s*reloadState\\.ownerCount" },
      { label: "Harmless persistence only", hint: "Persist the selected tab and owner guard without persisting confirmation or focus state.", pattern: "PersistentProperties\\s*\\{[\\s\\S]*?id\\s*:\\s*reloadState[\\s\\S]*?property\\s+int\\s+ownerCount\\s*:\\s*0[\\s\\S]*?property\\s+string\\s+selectedTab\\s*:" },
      { label: "Unsafe state cleared", hint: "Initialize the owner guard and explicitly clear confirmation and focus state after reload.", pattern: "Component\\.onCompleted\\s*:\\s*\\{[\\s\\S]*?reloadState\\.ownerCount\\s*===\\s*0[\\s\\S]*?reloadState\\.ownerCount\\s*=\\s*1[\\s\\S]*?confirmationVisible\\s*=\\s*false[\\s\\S]*?focusHeld\\s*=\\s*false" },
    ],
    rules: ["Declare the reload-sensitive IPC owner in a pragma Singleton component.", "Persist only ownerCount and selectedTab across soft reloads.", "Clear confirmationVisible and focusHeld whenever the singleton is initialized or destroyed."],
    explanation: [
      "A soft reload replaces editable QML while trying to keep the shell usable, so ownership must survive without multiplying. A singleton is one shared QML instance, which makes IPC registration and owner-count evidence belong to a stable boundary instead of every reconstructed bar.",
      "The solution uses pragma Singleton above ShellRoot and exposes readonly property int ownerInstanceCount from reloadState.ownerCount. PersistentProperties retains only ownerCount and selectedTab, while Component.onCompleted initializes the guard and resets confirmationVisible and focusHeld.",
      "A bar can look fully recovered even when each reload has registered another IPC handler, notification listener, timer, or shortcut. Repeated commands, duplicated notifications, or ownerInstanceCount differing from one reveal that visual recovery concealed an ownership leak.",
    ],
  },
  "hotplug-open-surface-drill": {
    starter: `import QtQuick
import Quickshell

PanelWindow {
    id: drawer
    screen: Quickshell.screens[0]
    anchors {
        left: true
        top: true
        bottom: true
    }
    property bool drawerOpen: true
    property bool dragging: true
    property bool focusHeld: true
    width: 360
    exclusiveZone: 0
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    Variants {
        model: Quickshell.screens

        PanelWindow {
            id: window
            required property ShellScreen modelData
            screen: modelData
            property bool drawerOpen: false
            property bool dragging: false
            property bool focusHeld: false

            anchors {
                left: true
                top: true
                bottom: true
            }
            width: 360
            exclusiveZone: 0
            color: "transparent"
            mask: Region { item: window.dragging ? gestureSurface : null }

            Item {
                id: gestureSurface
                anchors.fill: parent
            }

            Component.onDestruction: {
                dragging = false
                drawerOpen = false
                focusHeld = false
            }
        }
    }
}`,
    checks: [
      { label: "Live screen identity", hint: "Create one PanelWindow per live ShellScreen and bind its screen to modelData.", pattern: "Variants\\s*\\{[\\s\\S]*?model\\s*:\\s*Quickshell\\.screens[\\s\\S]*?PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData[\\s\\S]*?screen\\s*:\\s*modelData" },
      { label: "Screen-owned gesture state", hint: "Keep drawer and drag state inside each screen-specific PanelWindow.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?screen\\s*:\\s*modelData[\\s\\S]*?property\\s+bool\\s+drawerOpen\\s*:\\s*false[\\s\\S]*?property\\s+bool\\s+dragging\\s*:\\s*false" },
      { label: "Hotplug cancellation", hint: "Cancel dragging, close the drawer, and release modeled focus during destruction.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?Component\\.onDestruction\\s*:\\s*\\{[\\s\\S]*?dragging\\s*=\\s*false[\\s\\S]*?drawerOpen\\s*=\\s*false[\\s\\S]*?focusHeld\\s*=\\s*false" },
    ],
    rules: ["Instantiate each drawer from Quickshell.screens with a required ShellScreen modelData property.", "Bind every PanelWindow screen directly to its own modelData object.", "Cancel dragging, drawerOpen, and focusHeld in Component.onDestruction."],
    explanation: [
      "Hotplug means adding or removing an output while the shell is running, and an array index is not a durable monitor identity. Per-screen instances keep gestures, drawers, and focus bookkeeping attached to the exact ShellScreen object that owns them.",
      "Variants watches Quickshell.screens and constructs a PanelWindow whose required property ShellScreen modelData receives each live screen. The screen binding uses modelData directly, while drawerOpen, dragging, focusHeld, and the Region mask remain local to that window.",
      "Index-keyed state can jump from a removed monitor to whichever output becomes Quickshell.screens[0], making an old drag appear on the wrong display. A stuck input region, invisible focus capture, or drawer that migrates after unplugging a screen indicates missing destruction-time cancellation.",
    ],
  },
  "provider-restart-containment": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject audioService
    required property QtObject networkService
    property bool anyServiceFailed:
        audioService.state !== "ready"
        || networkService.state !== "ready"

    PanelWindow {
        visible: !root.anyServiceFailed
        anchors {
            top: true
            left: true
            right: true
        }
        height: 32
        color: "#20242b"
        Text { text: "Audio and network controls" }
    }
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject audioService
    required property QtObject networkService

    QtObject {
        id: audioDomain
        readonly property string state:
            root.audioService.state === "ready" ? "ready"
            : root.audioService.state === "reconnecting" ? "reconnecting"
            : "failed"
    }

    QtObject {
        id: networkDomain
        readonly property string state:
            root.networkService.state === "ready" ? "ready"
            : root.networkService.state === "reconnecting" ? "reconnecting"
            : "failed"
    }

    PanelWindow {
        anchors {
            top: true
            left: true
            right: true
        }
        height: 32
        color: "#20242b"

        Row {
            anchors.fill: parent
            spacing: 12
            Rectangle {
                id: audioControl
                enabled: audioDomain.state !== "failed"
                width: 150
                height: parent.height
                Text { text: "Audio: " + audioDomain.state }
            }
            Rectangle {
                id: networkControl
                enabled: networkDomain.state !== "failed"
                width: 150
                height: parent.height
                Text { text: "Network: " + networkDomain.state }
            }
        }
    }
}`,
    checks: [
      { label: "Audio domain state", hint: "Normalize the injected audio provider into an audio-only typed state property.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*audioDomain[\\s\\S]*?readonly\\s+property\\s+string\\s+state\\s*:\\s*root\\.audioService\\.state\\s*===\\s*\"ready\"" },
      { label: "Network domain state", hint: "Normalize the injected network provider independently from audio.", pattern: "QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*networkDomain[\\s\\S]*?readonly\\s+property\\s+string\\s+state\\s*:\\s*root\\.networkService\\.state\\s*===\\s*\"ready\"" },
      { label: "Independent controls", hint: "Let each control read only the state of its own provider domain.", pattern: "Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*audioControl[\\s\\S]*?enabled\\s*:\\s*audioDomain\\.state\\s*!==\\s*\"failed\"[\\s\\S]*?id\\s*:\\s*networkControl[\\s\\S]*?enabled\\s*:\\s*networkDomain\\.state\\s*!==\\s*\"failed\"" },
    ],
    rules: ["Normalize audioService.state inside an audioDomain object.", "Normalize networkService.state inside a separate networkDomain object.", "Enable each domain control from its own state instead of a shared failure boolean."],
    explanation: [
      "Failure containment limits an outage to the provider domain that actually failed, such as audio or networking. Separate state models let a shell continue presenting healthy controls while one external daemon reconnects or reaches a terminal failed state.",
      "The solution injects audioService and networkService as required QtObject properties, then normalizes each provider through its own readonly property string state. audioControl reads audioDomain.state, and networkControl independently reads networkDomain.state without consulting a global failure flag.",
      "A shared anyServiceFailed boolean erases which provider broke and can hide or disable the entire bar during a single restart. If losing PipeWire also removes network controls, or losing networking silences audio controls, the provider boundaries have leaked into one global outage switch.",
    ],
  },
  "degraded-data-gauntlet-boss": {
    starter: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    property string rawOutput: ""
    property string status: rawOutput
    readonly property string cardText: status

    Process {
        id: probe
        command: ["weather-probe", "--once"]
        running: true
        stdout: SplitParser { onRead: data => root.rawOutput = data }
        onExited: running = true
    }
}`,
    solution: `import Quickshell
import Quickshell.Io
ShellRoot {
    id: root
    property string state: "loading"
    property string lastGoodValue: ""
    property bool stale: false
    property int failures: 0
    property bool cancelled: false
    property bool receivedValidValue: false
    readonly property string displayText: lastGoodValue.length > 0 ? lastGoodValue + (stale ? " (stale)" : "") : state
    function isValid(data): bool { return data.startsWith("status=") && data.slice(7).trim().length > 0 }
    function acceptLine(data): void {
        if (data.trim() === "denied") { stale = lastGoodValue.length > 0; state = "denied"; receivedValidValue = true; probe.running = false; return }
        if (!isValid(data)) {
            stale = lastGoodValue.length > 0; state = "reconnecting"; probe.running = false
            return
        }
        lastGoodValue = data.slice(7).trim(); stale = false; state = "ready"
        failures = 0; receivedValidValue = true
    }
    function noteFailure(): void {
        failures += 1
        stale = lastGoodValue.length > 0
        state = failures < 5 ? "reconnecting" : "failed"
        if (!cancelled && failures < 5) retryTimer.restart()
    }
    Process {
        id: probe; command: ["weather-probe", "--once"]
        running: true
        stdout: SplitParser { onRead: data => root.acceptLine(data) }
        onExited: { if (!root.receivedValidValue) root.noteFailure() }
    }
    Timer {
        id: retryTimer; interval: 1000 * (root.failures + 1); repeat: false
        onTriggered: { if (!root.cancelled && root.failures < 5) probe.running = true }
    }
    Timer { interval: 5000; running: probe.running; onTriggered: probe.running = false }
    Component.onDestruction: { root.cancelled = true; retryTimer.stop(); probe.running = false }
}`,
    checks: [
      { label: "Structured probe stream", hint: "Use an argument-array Process command and route complete lines through acceptLine.", pattern: "Process\\s*\\{[\\s\\S]*?command\\s*:\\s*\\[\\s*\"weather-probe\"\\s*,\\s*\"--once\"\\s*\\][\\s\\S]*?stdout\\s*:\\s*SplitParser\\s*\\{[\\s\\S]*?onRead\\s*:\\s*data\\s*=>\\s*root\\.acceptLine\\(data\\)" },
      { label: "Validate before mutation", hint: "Reject invalid lines before assigning their payload to lastGoodValue.", pattern: "function\\s+acceptLine\\s*\\(data\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?if\\s*\\(\\s*!isValid\\(data\\)\\s*\\)[\\s\\S]*?return[\\s\\S]*?lastGoodValue\\s*=\\s*data\\.slice\\(7\\)\\.trim\\(\\)" },
      { label: "Bounded stale recovery", hint: "Keep typed stale data and stop scheduling retries once failures reaches five.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+string\\s+state\\s*:[\\s\\S]*?property\\s+string\\s+lastGoodValue\\s*:[\\s\\S]*?property\\s+bool\\s+stale\\s*:[\\s\\S]*?property\\s+int\\s+failures\\s*:\\s*0[\\s\\S]*?if\\s*\\([\\s\\S]*?failures\\s*<\\s*5[\\s\\S]*?retryTimer\\.restart\\(\\)" },
    ],
    rules: ["Validate each SplitParser line before assigning lastGoodValue.", "Preserve lastGoodValue and mark it stale while the probe reconnects.", "Stop retrying when failures reaches five or cancelled becomes true."],
    explanation: [
      "Degraded-state modeling gives loading, denied, reconnecting, stale, and failed conditions honest names instead of turning every problem into an empty value. A production shell needs those distinctions so trustworthy older data can remain visible while one unreliable provider recovers.",
      "The Process uses an argument array and sends SplitParser lines to acceptLine, where isValid checks the status prefix before lastGoodValue changes. stale preserves an earlier reading, the timeout stops delayed probes, failures controls retryTimer, and displayText always supplies either evidence or an explicit state.",
      "Directly binding raw stdout lets malformed or empty messages enter the interface, while unconditional onExited restarts can create a CPU-heavy reconnect storm. Blank cards, rapidly spawning probes, disappearing trusted values, or unrelated shell surfaces failing alongside this service identify the containment defects.",
    ],
  },

  // ---------------------------------------------------------------------
  // security-bastion
  // ---------------------------------------------------------------------
  "argument-array-gate": {
    starter: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    property string ssid: ""

    Process {
        id: wifiProcess
        command: ["sh", "-c", "nmcli connection up id " + root.ssid]
    }

    function requestConnection(): void {
        wifiProcess.running = true
    }
}`,
    solution: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    required property list<string> allowedSsids
    property string ssid: ""

    Process {
        id: wifiProcess
        command: []
        running: false
    }

    function requestConnection(): void {
        const validSsid = root.ssid.length > 0
            && root.ssid.length <= 64
            && root.allowedSsids.includes(root.ssid)

        if (!validSsid)
            return

        wifiProcess.command = [
            "nmcli", "connection", "up", "id", root.ssid
        ]
        wifiProcess.running = true
    }
}`,
    checks: [
      { label: "Use an argument array", hint: "Assign nmcli and every argument as separate Process command elements.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?function\\s+requestConnection\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?wifiProcess\\.command\\s*=\\s*\\[\\s*\"nmcli\"\\s*,\\s*\"connection\"\\s*,\\s*\"up\"\\s*,\\s*\"id\"\\s*,\\s*root\\.ssid\\s*\\]" },
      { label: "Validate the SSID", hint: "Require a nonempty, bounded SSID that appears in the injected allow-list.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?function\\s+requestConnection\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{(?=[\\s\\S]*?ssid\\.length\\s*>\\s*0)(?=[\\s\\S]*?ssid\\.length\\s*<=\\s*64)(?=[\\s\\S]*?allowedSsids\\.includes\\s*\\(\\s*root\\.ssid\\s*\\))[\\s\\S]*?if\\s*\\(\\s*!validSsid\\s*\\)[\\s\\S]*?return" },
      { label: "Keep text out of a shell", hint: "The Wi-Fi Process must not invoke sh -c.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?![\\s\\S]*?Process\\s*\\{[\\s\\S]*?command\\s*:\\s*\\[\\s*\"sh\"\\s*,\\s*\"-c\")[\\s\\S]*?Process\\s*\\{[\\s\\S]*?id\\s*:\\s*wifiProcess" },
    ],
    rules: ["Reject an SSID unless it is nonempty, at most 64 characters long, and present in allowedSsids.", "Pass nmcli, its subcommands, and the selected SSID as separate Process command array elements.", "Return from requestConnection before changing the Process when SSID validation fails."],
    explanation: [
      "An allow-list is a collection of values explicitly permitted to cross a security boundary. A desktop shell needs this gate because network names originate outside its trusted code, and treating those names as executable syntax can turn an ordinary connection request into an unintended command.",
      "The solution injects allowedSsids, checks root.ssid for a useful length, and calls allowedSsids.includes before starting wifiProcess. Only then does it assign Process.command to an array containing nmcli, each fixed subcommand, and root.ssid as an independent argument.",
      "The dangerous version invokes sh -c with an interpolated SSID, so punctuation inside the network name can be interpreted by a command shell instead of nmcli. Recognize this defect whenever externally supplied text is concatenated into one command string or placed after a shell execution flag.",
    ],
  },
  "secret-exposure-audit": {
    starter: `import Quickshell

ShellRoot {
    id: root
    property string ssid: ""
    property string state: "idle"
    property string passphrase: ""

    function submitLogin(): void {
        console.log("attempt:", root.passphrase)
        root.state = "connecting"
    }

    IpcHandler {
        target: "wifiLogin"
        function revealPassphrase(): string {
            return root.passphrase
        }
    }
}`,
    solution: `import Quickshell

ShellRoot {
    id: root
    required property QtObject loginService
    property string ssid: ""
    property string state: "idle"
    property string passphrase: ""
    readonly property var ipcSafeFields: ["ssid", "state"]

    function submitLogin(): void {
        root.state = "connecting"
        root.loginService.authenticate(root.ssid, root.passphrase)
        root.passphrase = ""
    }

    IpcHandler {
        target: "wifiLogin"

        function readField(field: string): string {
            if (!root.ipcSafeFields.includes(field))
                return ""

            return field === "ssid" ? root.ssid : root.state
        }
    }

    Component.onDestruction: root.passphrase = ""
}`,
    checks: [
      { label: "Declare an IPC allow-list", hint: "Expose only ssid and state through an explicit safe-field list.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?![\\s\\S]*?console\\.log\\s*\\()[\\s\\S]*?readonly\\s+property\\s+var\\s+ipcSafeFields\\s*:\\s*\\[\\s*\"ssid\"\\s*,\\s*\"state\"\\s*\\]" },
      { label: "Gate IPC reflection", hint: "Check the requested field against ipcSafeFields before returning data.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?IpcHandler\\s*\\{[\\s\\S]*?function\\s+readField\\s*\\(\\s*field\\s*:\\s*string\\s*\\)\\s*:\\s*string\\s*\\{[\\s\\S]*?ipcSafeFields\\.includes\\s*\\(\\s*field\\s*\\)[\\s\\S]*?return\\s+field\\s*===\\s*\"ssid\"\\s*\\?\\s*root\\.ssid\\s*:\\s*root\\.state" },
      { label: "Erase the passphrase", hint: "Clear passphrase after authentication and again when the component is destroyed.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?=[\\s\\S]*?function\\s+submitLogin\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?loginService\\.authenticate\\s*\\([^)]*root\\.passphrase[^)]*\\)[\\s\\S]*?root\\.passphrase\\s*=\\s*\"\")(?=[\\s\\S]*?Component\\.onDestruction\\s*:\\s*root\\.passphrase\\s*=\\s*\"\")[\\s\\S]*?IpcHandler\\s*\\{" },
    ],
    rules: ["Exclude passphrase from ipcSafeFields and reject every IPC field not present in that allow-list.", "Remove all diagnostic logging of the entered passphrase before invoking loginService.authenticate.", "Clear root.passphrase immediately after authentication begins and again during component destruction."],
    explanation: [
      "Secret minimization means retaining sensitive data only in the places and for the time needed to perform its purpose. A shell must apply it beyond painted controls because QML properties can also surface through IPC inspection, debugging output, hot reloads, diagnostics, and exported state.",
      "The solution limits reflection with readonly ipcSafeFields, and IpcHandler.readField returns an empty string unless that list contains the requested name. submitLogin passes the credential directly to loginService.authenticate without logging it, then overwrites root.passphrase and repeats that cleanup in Component.onDestruction.",
      "Merely hiding a password widget leaves a leak when console output or an IPC helper can still reproduce the underlying property value. The warning signs are broad property-by-name export functions, logging calls beside authentication code, and secret properties that remain populated after submission or teardown.",
    ],
  },
  "presentation-privacy-shield": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject notification
    property bool presenting: false

    Text {
        id: notificationBody
        text: root.presenting ? "Hidden" : root.notification.body
        Accessible.name: root.notification.body
    }
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: root
    required property QtObject notification
    property bool presenting: false
    property bool locked: false

    readonly property bool hide: root.presenting || root.locked
    readonly property string protectedBody: root.hide
        ? "Notification hidden during private session"
        : root.notification.body

    Text {
        id: notificationBody
        text: root.protectedBody
        Accessible.name: root.protectedBody
    }
}`,
    checks: [
      { label: "Resolve one privacy context", hint: "Derive hide from both presentation and lock state.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+hide\\s*:\\s*root\\.presenting\\s*\\|\\|\\s*root\\.locked" },
      { label: "Derive protected content once", hint: "Use hide to choose between a private-state message and notification.body.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+protectedBody\\s*:\\s*root\\.hide\\s*\\?\\s*\"Notification hidden during private session\"\\s*:\\s*root\\.notification\\.body" },
      { label: "Redact pixels and accessibility", hint: "Bind both Text.text and Accessible.name to the same protected value.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?ShellRoot\\s*\\{[\\s\\S]*?Text\\s*\\{(?=[\\s\\S]*?text\\s*:\\s*root\\.protectedBody)(?=[\\s\\S]*?Accessible\\.name\\s*:\\s*root\\.protectedBody)[\\s\\S]*?id\\s*:\\s*notificationBody" },
    ],
    rules: ["Derive root.hide from both presenting and locked instead of checking privacy modes independently in each view.", "Derive protectedBody from root.hide before notification content reaches the Text object.", "Bind both notificationBody.text and notificationBody.Accessible.name to the same protectedBody value."],
    explanation: [
      "A privacy context is the combined state that determines whether content is safe to disclose, including presentation and lock modes here. The shell needs one shared decision because visual text and assistive technology are separate output channels that can otherwise disagree about what is private.",
      "The solution computes readonly hide from root.presenting and root.locked, then derives protectedBody before the notification reaches the view. Both Text.text and the Accessible.name attached property consume that protected value, so painted pixels and screen-reader speech follow identical policy.",
      "Redacting only Text.text creates a deceptive success: the screen looks safe while a screen reader continues announcing notification.body. This bug is recognizable when any accessibility label, search field, preview cache, or remote representation binds to raw content instead of the shared privacy-filtered value.",
    ],
  },
  "auth-threat-scenario-boss": {
    starter: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    property string typedCredential: ""

    PersistentProperties {
        id: remembered
        property bool unlocked: false
    }

    Process {
        id: logoutProcess
        command: ["loginctl", "terminate-session"]
    }

    function submitAndLogout(): void {
        if (root.typedCredential === "1234")
            remembered.unlocked = true
        logoutProcess.running = true
    }
}`,
    solution: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: root
    required property QtObject authService
    property string typedCredential: ""
    property string pendingAction: ""
    readonly property list<string> allowedActions: ["lock-session", "terminate-session", "suspend"]
    readonly property bool unlocked: root.authService.authenticated ?? false

    Process {
        id: actionProcess
        command: []
        running: false
    }

    function submitCredential(): void {
        root.authService.authenticate(root.typedCredential)
        root.typedCredential = ""
    }

    function requestAction(action: string): void {
        if (!root.allowedActions.includes(action)) return
        root.pendingAction = action
        if (root.authService.authenticated) root.runPendingAction()
    }

    function runPendingAction(): void {
        if (!root.authService.authenticated || !root.allowedActions.includes(root.pendingAction)) return
        actionProcess.command = ["loginctl", root.pendingAction]
        actionProcess.running = true
        root.pendingAction = ""
    }

    function cancelPending(): void {
        root.pendingAction = ""
        actionProcess.running = false
        root.authService.cancel()
    }

    Connections {
        target: root.authService
        function onAuthenticatedChanged(): void {
            if (root.authService.authenticated && root.pendingAction !== "") root.runPendingAction()
        }
    }
}`,
    checks: [
      { label: "Delegate authentication", hint: "Send the transient credential to authService and erase it without comparing it in QML.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?![\\s\\S]*?typedCredential\\s*===)(?=[\\s\\S]*?required\\s+property\\s+QtObject\\s+authService\\b)[\\s\\S]*?function\\s+submitCredential\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?authService\\.authenticate\\s*\\(\\s*root\\.typedCredential\\s*\\)[\\s\\S]*?root\\.typedCredential\\s*=\\s*\"\"" },
      { label: "Keep authorization ephemeral", hint: "Derive unlocked from the trusted service and do not persist authorization.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?![\\s\\S]*?PersistentProperties\\s*\\{)[\\s\\S]*?readonly\\s+property\\s+bool\\s+unlocked\\s*:\\s*root\\.authService\\.authenticated\\s*\\?\\?\\s*false" },
      { label: "Wait, validate, and cancel", hint: "Validate pending actions, wait for authenticated, and provide a path that stops both authentication and the Process.", pattern: "^\\s*import\\s+Quickshell[\\s\\S]*?ShellRoot\\s*\\{(?=[\\s\\S]*?function\\s+requestAction\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?allowedActions\\.includes\\s*\\(\\s*action\\s*\\))(?=[\\s\\S]*?function\\s+runPendingAction\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?!root\\.authService\\.authenticated[\\s\\S]*?actionProcess\\.command\\s*=\\s*\\[\\s*\"loginctl\"\\s*,\\s*root\\.pendingAction\\s*\\][\\s\\S]*?actionProcess\\.running\\s*=\\s*true)(?=[\\s\\S]*?function\\s+cancelPending\\s*\\([^)]*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?actionProcess\\.running\\s*=\\s*false[\\s\\S]*?authService\\.cancel\\s*\\(\\s*\\))(?=[\\s\\S]*?Connections\\s*\\{[\\s\\S]*?onAuthenticatedChanged[\\s\\S]*?authService\\.authenticated[\\s\\S]*?runPendingAction\\s*\\(\\s*\\))[\\s\\S]*?Process\\s*\\{[\\s\\S]*?id\\s*:\\s*actionProcess" },
    ],
    rules: ["Delegate credential verification to authService and erase typedCredential immediately after submitting it.", "Derive unlocked from authService.authenticated without storing authorization in PersistentProperties.", "Start actionProcess only after allow-list validation and trusted authentication, and stop the pending path when cancelPending runs."],
    explanation: [
      "Authentication proves identity through a trusted facility, while authorization decides whether that identity may perform a consequential action. A production shell must keep both decisions outside local mock comparisons because reloading QML, guessing a literal, or restoring persistent state must never create an authenticated session.",
      "The solution injects authService, calls its authenticate method, erases typedCredential, and derives unlocked from authService.authenticated. requestAction allow-lists session verbs, Connections waits for authenticated to change, and runPendingAction rechecks both conditions before assigning a separated loginctl command array.",
      "The broken gate grants authority from a QML-side password literal, persists that authority, and launches logout even when verification fails. Detect this class of failure when success appears before the trusted service reports completion, cancellation leaves a Process running, or a restart restores an unlocked flag.",
    ],
  },

  // ---------------------------------------------------------------------
  // validation-arena
  // ---------------------------------------------------------------------
  "static-language-audit": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: audit

    property var results: "looks fine"
    property string reviewer: "release team"
    property bool launchApproved: true
    property string artifact: "shell.qml"
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: audit

    property list<string> toolsRun: ["structural-audit", "strict-audit", "qmlls", "qmlformat", "type-import-check"]
    readonly property string qtVersion: "6.8.2"
    readonly property string quickshellVersion: "0.3.1"

    property bool structuralAuditClean: true
    property bool strictAuditClean: true
    property bool qmllsClean: true
    property bool qmlformatClean: true
    property bool typeImportCheckClean: true
    property bool artifactAssembled: true

    readonly property bool launchReady: structuralAuditClean
        && strictAuditClean && qmllsClean && qmlformatClean
        && typeImportCheckClean && artifactAssembled
}`,
    checks: [
      { label: "Names every audit tool", hint: "Record the structural, strict, language-server, formatting, and type/import checks as concrete tool names.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+toolsRun\\s*:\\s*\\[[\\s\\S]*?\"structural-audit\"[\\s\\S]*?\"strict-audit\"[\\s\\S]*?\"qmlls\"[\\s\\S]*?\"qmlformat\"[\\s\\S]*?\"type-import-check\"[\\s\\S]*?\\]" },
      { label: "Pins platform versions", hint: "Tie the audit to explicit Qt and Quickshell versions.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+qtVersion\\s*:\\s*\"[^\"]+\"[\\s\\S]*?readonly\\s+property\\s+string\\s+quickshellVersion\\s*:\\s*\"[^\"]+\"" },
      { label: "Records falsifiable outcomes", hint: "Give qmlls, formatting, type/import validation, and artifact assembly their own Boolean outcomes.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+bool\\s+qmllsClean\\s*:\\s*true[\\s\\S]*?property\\s+bool\\s+qmlformatClean\\s*:\\s*true[\\s\\S]*?property\\s+bool\\s+typeImportCheckClean\\s*:\\s*true[\\s\\S]*?property\\s+bool\\s+artifactAssembled\\s*:\\s*true" },
    ],
    rules: ["List every structural, strict, qmlls, formatting, and type/import audit that was executed.", "Pin the Qt and Quickshell versions associated with the recorded audit results.", "Require each audit and artifact-assembly result to pass before setting launchReady."],
    explanation: [
      "A static audit is a reproducible inspection of source structure, imports, types, formatting, and tool diagnostics before the shell launches. A production shell needs this record because a vague approval cannot reveal which checks ran or which platform version produced the result.",
      "The solution stores concrete tool names in property list<string> toolsRun and pins qtVersion plus quickshellVersion as readonly properties. Separate Boolean properties preserve each outcome, while launchReady remains a binding over the audits and artifactAssembled instead of becoming an independent assertion.",
      "The prevented failure is treating a regex hit or a reassuring sentence as proof that valid QML was assembled. It is recognizable when reviewers cannot identify the qmlls result, reproduce the toolchain, or distinguish a framework warning from an unresolved defect.",
    ],
  },
  "visual-state-evidence": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: gallery

    property url heroScreenshot: "captures/panel-hero.png"
    property string verdict: "looks polished"
    property int captureWidth: 1440
    property int captureHeight: 900
    property bool reviewComplete: true
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: gallery

    property list<string> capturedStates: [
        "compact", "opening", "open", "closing",
        "loading", "empty", "stale", "denied", "error"
    ]
    property bool capturedLight: true
    property bool capturedDark: true
    readonly property bool coversDarkAndLight: capturedLight && capturedDark

    readonly property int captureWidth: 1440
    readonly property int captureHeight: 900
    property list<string> transitionJoins: ["opening-to-closing", "closing-to-opening"]
    readonly property bool galleryComplete: capturedStates.length === 9
        && coversDarkAndLight && transitionJoins.length === 2
}`,
    checks: [
      { label: "Captures interaction states", hint: "Name compact, opening, open, and closing evidence rather than relying on one hero image.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+capturedStates\\s*:\\s*\\[[\\s\\S]*?\"compact\"[\\s\\S]*?\"opening\"[\\s\\S]*?\"open\"[\\s\\S]*?\"closing\"" },
      { label: "Captures degraded states", hint: "Include loading, empty, stale, denied, and error in the same state gallery.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+capturedStates\\s*:\\s*\\[[\\s\\S]*?\"loading\"[\\s\\S]*?\"empty\"[\\s\\S]*?\"stale\"[\\s\\S]*?\"denied\"[\\s\\S]*?\"error\"[\\s\\S]*?\\]" },
      { label: "Proves both themes", hint: "Record light and dark captures and derive theme completeness from both flags.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+bool\\s+capturedLight\\s*:\\s*true[\\s\\S]*?property\\s+bool\\s+capturedDark\\s*:\\s*true[\\s\\S]*?readonly\\s+property\\s+bool\\s+coversDarkAndLight\\s*:\\s*capturedLight\\s*&&\\s*capturedDark" },
    ],
    rules: ["Capture every named interaction and degraded state in capturedStates.", "Record light-theme and dark-theme captures as separate Boolean facts.", "Include both transition-reversal joins at the fixed 1440-by-900 capture dimensions."],
    explanation: [
      "A state gallery is a controlled collection of images for every meaningful visual condition, including moments inside a transition. Shell review needs this breadth because focus, contrast, layout seams, and reversal glitches can disappear completely from a carefully chosen hero screenshot.",
      "The solution names nine conditions in property list<string> capturedStates and records the opening-to-closing and closing-to-opening joins separately. Fixed readonly captureWidth and captureHeight keep comparisons stable, while coversDarkAndLight binds completeness to both capturedLight and capturedDark.",
      "The characteristic failure is approving a shell from one attractive frame that says nothing about loading, denial, stale content, or hostile theme contrast. Suspect it when evidence has no state labels, no matching light and dark views, or no frame taken while motion reverses.",
    ],
  },
  "input-screen-service-matrix": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: matrix

    property bool pointerTested: true
    property bool keyboardTested: true
    property bool hotplugTested: true
    property bool fullscreenTested: true
    property bool ipcTested: true
    property bool restartTested: true
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: matrix

    property list<QtObject> testedPairs: [
        dragDuringHotplug, fullscreenIpcOpen, touchDuringRestart
    ]
    readonly property bool allPairsPassed: testedPairs.filter(pair => !pair.passed).length === 0

    QtObject {
        id: dragDuringHotplug
        property string a: "drawerDrag"
        property string b: "hotplug"
        property string expected: "drag cancels and removed screen is released"
        property string actual: "drag cancelled and removed screen released"
        property bool passed: true
    }

    QtObject {
        id: fullscreenIpcOpen
        property string a: "fullscreen"
        property string b: "ipcOpen"
        property string expected: "popout opens without stealing fullscreen focus"
        property string actual: "popout opened and fullscreen focus remained"
        property bool passed: true
    }

    QtObject {
        id: touchDuringRestart
        property string a: "touch"
        property string b: "serviceRestart"
        property string expected: "gesture ends in a recoverable stale state"
        property string actual: "gesture ended stale and recovered after restart"
        property bool passed: true
    }
}`,
    checks: [
      { label: "Pairs dragging with hotplug", hint: "Represent drawerDrag and hotplug inside one scenario record with a pass result.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?QtObject\\s*\\{\\s*id\\s*:\\s*dragDuringHotplug[\\s\\S]*?property\\s+string\\s+a\\s*:\\s*\"drawerDrag\"[\\s\\S]*?property\\s+string\\s+b\\s*:\\s*\"hotplug\"[\\s\\S]*?property\\s+bool\\s+passed\\s*:\\s*true" },
      { label: "Pairs fullscreen with IPC", hint: "Exercise fullscreen and ipcOpen together and record the expected and actual outcomes.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?QtObject\\s*\\{\\s*id\\s*:\\s*fullscreenIpcOpen[\\s\\S]*?property\\s+string\\s+a\\s*:\\s*\"fullscreen\"[\\s\\S]*?property\\s+string\\s+b\\s*:\\s*\"ipcOpen\"[\\s\\S]*?property\\s+string\\s+expected\\s*:[\\s\\S]*?property\\s+string\\s+actual\\s*:[\\s\\S]*?property\\s+bool\\s+passed\\s*:\\s*true" },
      { label: "Derives matrix success", hint: "Compute overall success from every paired case instead of maintaining another independent flag.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+allPairsPassed\\s*:\\s*testedPairs\\.filter\\(pair\\s*=>\\s*!pair\\.passed\\)\\.length\\s*===\\s*0" },
    ],
    rules: ["Exercise drawer dragging and screen hotplug within the same recorded test case.", "Pair fullscreen transitions with IPC-driven popout opening and compare expected with actual behavior.", "Derive allPairsPassed from every paired scenario record instead of setting it independently."],
    explanation: [
      "A pairwise matrix is a bounded test set that deliberately combines two behavioral axes likely to interfere with each other. Desktop shells need these collisions exercised because input, screen lifetime, focus policy, IPC, and service recovery share state even when each feature passes alone.",
      "The solution stores QtObject records in property list<QtObject> testedPairs, with a and b naming each paired axis. Every record carries expected, actual, and passed properties, and allPairsPassed filters the collection so one failed interaction prevents the matrix from reporting success.",
      "The avoided failure is a checklist where pointer, hotplug, fullscreen, and IPC each receive an isolated tick while their dangerous overlaps remain untouched. It is visible when no test can answer what happened to an active drag during screen removal or to focus during an IPC-triggered popout.",
    ],
  },
  "quality-evidence-boss": {
    starter: `import QtQuick
import Quickshell

ShellRoot {
    id: evidenceVault

    property string proof: "browser preview screenshot proves the shell works on Wayland"
    property url screenshot: "captures/browser-preview.png"
    property string capturedLog: "login user=arena password=hunter2"
    property bool readyToShare: true
    property string platform: "desktop"
}`,
    solution: `import QtQuick
import Quickshell

ShellRoot {
    id: evidenceVault

    readonly property string platformVersion: "Wayland 1.23 / Qt 6.8.2 / Quickshell 0.3.1"
    property bool redacted: true
    property list<string> untestedPaths: ["slow-hardware", "screen-reader-navigation"]
    readonly property string capturedLog: "startup user=[redacted] credential=[redacted]"
    readonly property string shareableLog: redacted ? capturedLog : ""
    readonly property bool mayShareArtifacts: redacted && evidence.length > 0
    property list<QtObject> evidence: [runtimeEvidence, simulationReference]

    QtObject {
        id: runtimeEvidence
        property string claim: "Wayland startup and transition budget"
        property string tier: "linux-wayland-runtime"
        property list<string> command: ["qs", "-c", "production-citadel"]
        property url capture: "captures/runtime-transition.webm"
        property string platformVersion: evidenceVault.platformVersion
        property string expectedThreshold: "startup below 900 ms and no dropped transition frames"
        property string result: "startup 742 ms and transition rubric passed"
        property string limitation: "slow hardware remains untested"
    }

    QtObject {
        id: simulationReference
        property string claim: "layout preview only"
        property string tier: "browser-simulation"
        property list<string> command: ["browser-preview", "--theme", "dark"]
        property url capture: "captures/browser-layout.png"
        property string platformVersion: "browser simulation fixture 5"
        property string expectedThreshold: "no clipping at the reference viewport"
        property string result: "reference viewport passed"
        property string limitation: "not evidence of Wayland input, services, or accessibility"
    }
}`,
    checks: [
      { label: "Labels runtime evidence honestly", hint: "Give the Wayland claim an explicit linux-wayland-runtime tier.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?QtObject\\s*\\{\\s*id\\s*:\\s*runtimeEvidence[\\s\\S]*?property\\s+string\\s+claim\\s*:\\s*\"Wayland startup and transition budget\"[\\s\\S]*?property\\s+string\\s+tier\\s*:\\s*\"linux-wayland-runtime\"" },
      { label: "Gates logs on redaction", hint: "Mark the evidence redacted and expose capturedLog only through a redaction-dependent binding.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+bool\\s+redacted\\s*:\\s*true[\\s\\S]*?readonly\\s+property\\s+string\\s+shareableLog\\s*:\\s*redacted\\s*\\?\\s*capturedLog\\s*:\\s*\"\"" },
      { label: "Records untested paths", hint: "Keep slow-hardware and screen-reader coverage gaps in a typed list.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+untestedPaths\\s*:\\s*\\[[\\s\\S]*?\"slow-hardware\"[\\s\\S]*?\"screen-reader-navigation\"[\\s\\S]*?\\]" },
    ],
    rules: ["Assign every evidence claim its actual static, browser-simulation, or linux-wayland-runtime tier.", "Expose captured logs for sharing only after the redacted flag is true and secrets have been replaced.", "List slow-hardware and screen-reader gaps explicitly in untestedPaths."],
    explanation: [
      "Quality evidence is a typed chain connecting each production claim to its test tier, platform, procedure, threshold, result, artifact, and known limitation. A hardened shell needs that chain because confidence cannot substitute for runtime proof across performance, accessibility, privacy, security, and interaction behavior.",
      "The solution represents claims as QtObject entries in evidence, and each entry names tier, command, capture, platformVersion, expectedThreshold, result, and limitation. The redacted binding gates shareableLog, while untestedPaths preserves slow-hardware and screen-reader gaps instead of letting release language erase them.",
      "This boss prevents browser imagery from being mislabeled as Wayland execution evidence and blocks raw credentials from entering a shareable bundle. The failure is recognizable when tiers are absent, logs contain secret-bearing fields, thresholds have no measured result, or accessibility limitations vanish from the report.",
    ],
  },

  // ---------------------------------------------------------------------
  // release-harbor
  // ---------------------------------------------------------------------
  "tested-stack-manifest": {
    starter: `import QtQml

QtObject {
    id: manifest
    property string quickshellVersion: "latest"
    property string qtVersion: "recent"
    property string compositor: "current"
    property string distribution: "rolling"
    property string packaging: "native"
    property string nativeServices: "installed"
    property string apiReviewedAt: "sometime this year"
}`,
    solution: `import QtQml

QtObject {
    id: manifest

    readonly property string quickshellVersion: "0.3.0"
    readonly property string qtVersion: "6.8.1"
    readonly property string compositor: "Hyprland 0.44"
    readonly property string distribution: "Arch Linux 2026.08.01"
    readonly property string packaging: "Arch PKGBUILD revision 7"
    readonly property string nativeServices: "systemd 256, PipeWire 1.2.7"
    readonly property string apiReviewedAt: "2026-08-01"
    readonly property string supportedQtMinor: "6.8"
    readonly property bool qtGateOpen: supportsQtMinor(supportedQtMinor)

    function supportsQtMinor(candidate: string): bool {
        return candidate === "6.8"
    }
}`,
    checks: [
      { label: "Pin core framework versions", hint: "Record exact Quickshell and Qt versions instead of moving labels such as latest or recent.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+quickshellVersion\\s*:\\s*\"0\\.3\\.0\"[\\s\\S]*?readonly\\s+property\\s+string\\s+qtVersion\\s*:\\s*\"6\\.8\\.1\"" },
      { label: "Record the verified environment", hint: "Name the tested compositor, distribution, packaging revision, and native service versions.", pattern: "QtObject\\s*\\{[\\s\\S]*?compositor\\s*:\\s*\"Hyprland 0\\.44\"[\\s\\S]*?distribution\\s*:\\s*\"Arch Linux 2026\\.08\\.01\"[\\s\\S]*?packaging\\s*:\\s*\"Arch PKGBUILD revision 7\"[\\s\\S]*?nativeServices\\s*:\\s*\"systemd 256, PipeWire 1\\.2\\.7\"" },
      { label: "Gate and date API compatibility", hint: "Include a source-review date and an explicit function that admits only the supported Qt minor line.", pattern: "QtObject\\s*\\{[\\s\\S]*?apiReviewedAt\\s*:\\s*\"2026-08-01\"[\\s\\S]*?function\\s+supportsQtMinor\\s*\\(candidate\\s*:\\s*string\\)\\s*:\\s*bool\\s*\\{[\\s\\S]*?candidate\\s*===\\s*\"6\\.8\"[\\s\\S]*?\\}" },
    ],
    rules: ["Pin the exact Quickshell and Qt versions exercised by the release matrix.", "Record the tested compositor, distribution, packaging revision, and native service versions.", "Date the pre-1.0 API review and gate supported Qt differences explicitly."],
    explanation: [
      "A tested-stack manifest is a machine-readable inventory of the precise environment known to work. The shell needs it because framework, toolkit, compositor, packaging, and service changes can each alter behavior even when the project files themselves have not changed.",
      "The solution stores immutable evidence in readonly QML properties such as quickshellVersion, qtVersion, compositor, and apiReviewedAt. The supportsQtMinor(candidate: string): bool function is a version gate, meaning an explicit compatibility decision that admits the verified Qt 6.8 line.",
      "Labels such as latest, recent, or rolling describe moving targets and cannot reproduce a reported failure. This defect becomes visible when two users claim the same setup but have different Qt rebuilds or Quickshell APIs and the manifest cannot distinguish their environments.",
    ],
  },
  "config-migration-dock": {
    starter: `import QtQml

QtObject {
    id: settings
    required property QtObject config

    property int schemaVersion: config.schemaVersion
    property int drawerWidth: config.drawerWidth
    property bool showClock: config.showClock
    property bool loaded: true
    property string configPath: config.path
}`,
    solution: `import QtQml

QtObject {
    id: settings
    required property QtObject config

    readonly property int currentSchema: 3
    property int loadedSchema: config.schemaVersion
    property string backupPath: config.path + ".schema-" + loadedSchema + ".backup"
    readonly property string writeMode: "atomic-replace"
    property int drawerWidth: config.drawerWidth ?? 320
    property bool showClock: config.showClock ?? true
    property bool migrationValid: false
    property bool atomicWritePending: false
    property bool launchConfirmed: false

    function migrate(loadedVersion: int): void {
        if (loadedVersion < 2) {
            drawerWidth = 360
            loadedVersion = 2
        }
        if (loadedVersion < 3) {
            showClock = true
            loadedVersion = 3
        }
        migrationValid = loadedVersion === currentSchema && drawerWidth >= 240
        atomicWritePending = migrationValid
    }

    function confirmSuccessfulLaunch(): void {
        if (migrationValid && atomicWritePending) {
            launchConfirmed = true
            atomicWritePending = false
        }
    }
}`,
    checks: [
      { label: "Step through schema versions", hint: "Declare schema 3 and advance older inputs through explicit version 2 and version 3 transformations.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+currentSchema\\s*:\\s*3[\\s\\S]*?function\\s+migrate\\s*\\(loadedVersion\\s*:\\s*int\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?loadedVersion\\s*<\\s*2[\\s\\S]*?loadedVersion\\s*=\\s*2[\\s\\S]*?loadedVersion\\s*<\\s*3[\\s\\S]*?loadedVersion\\s*=\\s*3" },
      { label: "Retain an atomic rollback record", hint: "Keep a versioned backup path and identify the replacement as an atomic write.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+string\\s+backupPath\\s*:\\s*config\\.path\\s*\\+\\s*\"\\.schema-\"[\\s\\S]*?readonly\\s+property\\s+string\\s+writeMode\\s*:\\s*\"atomic-replace\"[\\s\\S]*?property\\s+bool\\s+atomicWritePending\\s*:\\s*false" },
      { label: "Validate before committing", hint: "Set the pending atomic write only from the result of explicit schema and value validation.", pattern: "QtObject\\s*\\{[\\s\\S]*?function\\s+migrate[\\s\\S]*?migrationValid\\s*=\\s*loadedVersion\\s*===\\s*currentSchema\\s*&&\\s*drawerWidth\\s*>=\\s*240[\\s\\S]*?atomicWritePending\\s*=\\s*migrationValid" },
    ],
    rules: ["Advance loaded configuration through explicit schema steps until it reaches currentSchema.", "Validate the migrated drawer width and schema before marking an atomic write as pending.", "Retain a versioned backup path until the migrated configuration survives a successful launch."],
    explanation: [
      "A configuration migration is a controlled transformation from one typed schema version to another. The shell needs this contract because persisted user policy outlives individual releases, and an upgrade must preserve meaningful settings without pretending old data already has the newest shape.",
      "The migrate(loadedVersion: int): void function performs separate version-two and version-three steps before comparing the result with currentSchema. migrationValid controls atomicWritePending, while atomic-replace means the completed file replaces the old file in one operation rather than exposing a partially written document.",
      "Editing the live configuration in place can leave removed keys, half-written values, or data that neither release understands. The warning signs are direct reads with no schema branch, no validation result, and no backupPath from which the previous shell can recover.",
    ],
  },
  "install-update-uninstall-route": {
    starter: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: lifecycle
    property bool installed: true
    property bool uninstallRequested: false

    Process {
        running: lifecycle.uninstallRequested
        command: ["rm", "-rf", "/usr/share/shellwright"]
    }
}`,
    solution: `import Quickshell
import Quickshell.Io

ShellRoot {
    id: lifecycle

    property bool userLocalPathsOnly: true
    property bool autostartRegistered: false
    property bool uninstallPreservesUserConfig: true
    property bool installRequested: false
    property bool autostartRequested: false
    property bool uninstallRequested: false

    readonly property string shellDir: "/home/user/.local/share/shellwright"
    readonly property string shellEntry: shellDir + "/shell.qml"
    readonly property string autostartFile: "/home/user/.config/autostart/shellwright.desktop"

    Process {
        id: installStep
        running: lifecycle.installRequested && lifecycle.userLocalPathsOnly
        command: ["mkdir", "-p", lifecycle.shellDir]
    }

    Process {
        id: autostartStep
        running: lifecycle.autostartRequested && !lifecycle.autostartRegistered
        command: ["ln", "-s", lifecycle.shellEntry, lifecycle.autostartFile]
    }

    Process {
        id: removalStep
        running: lifecycle.uninstallRequested && lifecycle.uninstallPreservesUserConfig
        command: ["rm", "-f", lifecycle.autostartFile]
    }
}`,
    checks: [
      { label: "Track lifecycle steps separately", hint: "Replace the single installed bit with user-path, autostart, and configuration-preservation state.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?property\\s+bool\\s+userLocalPathsOnly\\s*:\\s*true[\\s\\S]*?property\\s+bool\\s+autostartRegistered\\s*:\\s*false[\\s\\S]*?property\\s+bool\\s+uninstallPreservesUserConfig\\s*:\\s*true" },
      { label: "Gate narrow install actions", hint: "Run array-form install and autostart commands only when their corresponding lifecycle states permit them.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?Process\\s*\\{[\\s\\S]*?id\\s*:\\s*installStep[\\s\\S]*?running\\s*:\\s*lifecycle\\.installRequested\\s*&&\\s*lifecycle\\.userLocalPathsOnly[\\s\\S]*?command\\s*:\\s*\\[[\\s\\S]*?\\][\\s\\S]*?Process\\s*\\{[\\s\\S]*?id\\s*:\\s*autostartStep[\\s\\S]*?running\\s*:\\s*lifecycle\\.autostartRequested\\s*&&\\s*!lifecycle\\.autostartRegistered[\\s\\S]*?command\\s*:\\s*\\[" },
      { label: "Remove only owned integration", hint: "Preserve user configuration and remove only the precise autostart file, never a broad directory tree.", pattern: "ShellRoot\\s*\\{(?![\\s\\S]*\"-rf\")[\\s\\S]*?Process\\s*\\{[\\s\\S]*?id\\s*:\\s*removalStep[\\s\\S]*?running\\s*:\\s*lifecycle\\.uninstallRequested\\s*&&\\s*lifecycle\\.uninstallPreservesUserConfig[\\s\\S]*?command\\s*:\\s*\\[\\s*\"rm\"\\s*,\\s*\"-f\"\\s*,\\s*lifecycle\\.autostartFile\\s*\\]" },
    ],
    rules: ["Represent user-local installation, autostart registration, and configuration preservation as separate boolean states.", "Pass every install or removal command to Process as an explicit argument array.", "Limit uninstallation to the owned autostart entry while preserving the user's shell configuration."],
    explanation: [
      "A lifecycle record is typed state describing which installation mutations actually occurred, rather than one vague installed flag. A production shell needs this detail so user-local setup, compositor startup integration, updates, rollback, and removal can be reasoned about independently.",
      "The solution gives installStep, autostartStep, and removalStep separate Process objects whose command properties are argument arrays. Their running bindings consult userLocalPathsOnly, autostartRegistered, and uninstallPreservesUserConfig, so each narrow filesystem action is enabled by the state it changes.",
      "A recursive deletion aimed at a shared directory can erase customization, unrelated package files, or credentials while still leaving startup integration behind. Recognize this design flaw when uninstall uses rm -rf, when commands are broad strings, or when a single boolean hides which operations must be reversed.",
    ],
  },
  "documentation-license-ledger": {
    starter: `import QtQml

QtObject {
    id: documentation
    property bool hasReadme: true
    property string setupNotes: "See README"
    property string architectureNotes: "Obvious from the files"
    property string licenseStatus: "Probably compatible"
    property bool screenshotsExist: true
    property bool readyToPublish: hasReadme
}`,
    solution: `import QtQml

QtObject {
    id: documentation

    property list<string> documentsWritten: [
        "README.md",
        "ARCHITECTURE.md",
        "DEPENDENCIES.md",
        "KEYBINDINGS.md",
        "CONFIGURATION.md",
        "SCREENSHOTS.md",
        "TROUBLESHOOTING.md",
        "VALIDATION.md",
        "KNOWN_LIMITATIONS.md",
        "CHANGELOG.md"
    ]

    property list<string> attributions: [
        "Harbor Icons: MIT, https://example.org/harbor-icons",
        "Tidebar QML layout: Apache-2.0, https://example.org/tidebar"
    ]

    readonly property bool documentationComplete: documentsWritten.length >= 10
    readonly property bool attributionComplete: attributions.length >= 2
    readonly property bool distributable: documentationComplete && attributionComplete
}`,
    checks: [
      { label: "Inventory the documentation set", hint: "Use a typed document list that includes setup, troubleshooting, and known-limitations evidence.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+documentsWritten\\s*:\\s*\\[[\\s\\S]*?\"README\\.md\"[\\s\\S]*?\"TROUBLESHOOTING\\.md\"[\\s\\S]*?\"KNOWN_LIMITATIONS\\.md\"[\\s\\S]*?\\]" },
      { label: "Record licensed source attribution", hint: "List each adapted source with its license and source URL.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+attributions\\s*:\\s*\\[[\\s\\S]*?MIT[\\s\\S]*?https://example\\.org/harbor-icons[\\s\\S]*?Apache-2\\.0[\\s\\S]*?https://example\\.org/tidebar[\\s\\S]*?\\]" },
      { label: "Derive distribution readiness", hint: "Require both the complete document inventory and the attribution ledger before distribution.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+documentationComplete\\s*:\\s*documentsWritten\\.length\\s*>=\\s*10[\\s\\S]*?readonly\\s+property\\s+bool\\s+distributable\\s*:\\s*documentationComplete\\s*&&\\s*attributionComplete" },
    ],
    rules: ["List every required release document in the typed documentsWritten manifest.", "Record each adapted asset or QML source with its license and source URL in attributions.", "Derive distributable from both documentation completeness and attribution completeness."],
    explanation: [
      "A documentation ledger is a typed inventory of the material required to operate, repair, validate, and redistribute a release. Attribution means identifying adapted work, its creator or project, its source, and its license so downstream users can preserve the same legal obligations.",
      "The documentsWritten list names setup, architecture, dependency, keybinding, configuration, screenshot, troubleshooting, validation, limitation, and change records. The attributions list pairs each borrowed source with an MIT or Apache-2.0 license and a URL, while distributable combines the two completeness bindings.",
      "A README-only project may look polished yet provide no route for diagnosing failure or proving that copied material can be shipped. The problem is recognizable when requirements are prose claims, limitations are absent, or icons and adapted QML have no source-and-license entry.",
    ],
  },
  "shellwright-v1-boss": {
    starter: `import QtQml
import Quickshell

ShellRoot {
    id: release
    property string version: "1.0"
    property string releaseName: "Shellwright"
    property bool tested: true
    property string evidenceNote: "Looks good locally"
    property bool published: version.length > 0
}`,
    solution: `import QtQml
import Quickshell

ShellRoot {
    id: release

    readonly property string version: "1.0.0"
    readonly property string quickshellVersion: "0.3.0"
    readonly property string qtVersion: "6.8.1"
    readonly property string compositor: "Hyprland 0.44"
    readonly property string apiReviewedAt: "2026-08-01"
    readonly property bool migrationsReversible: true
    readonly property bool staticMatrixPassed: true
    readonly property bool waylandMatrixPassed: true
    readonly property bool inputRoutesValidated: true
    readonly property bool evidenceRedacted: true
    readonly property bool releaseSigned: true

    property list<string> evidence: [
        "VALIDATION.md",
        "ATTRIBUTION.md",
        "KNOWN_LIMITATIONS.md"
    ]
    property list<string> attributions: [
        "Harbor Icons: MIT, https://example.org/harbor-icons"
    ]

    readonly property bool readyToShip: migrationsReversible
        && evidence.length >= 3
        && staticMatrixPassed
        && waylandMatrixPassed
        && inputRoutesValidated
        && evidenceRedacted
        && releaseSigned
        && attributions.length > 0
}`,
    checks: [
      { label: "Pin the signed release stack", hint: "Use semantic versioning and record the exact Quickshell, Qt, compositor, and API-review values.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+version\\s*:\\s*\"1\\.0\\.0\"[\\s\\S]*?quickshellVersion\\s*:\\s*\"0\\.3\\.0\"[\\s\\S]*?qtVersion\\s*:\\s*\"6\\.8\\.1\"[\\s\\S]*?compositor\\s*:\\s*\"Hyprland 0\\.44\"[\\s\\S]*?apiReviewedAt\\s*:\\s*\"2026-08-01\"" },
      { label: "Carry reversible evidence", hint: "Declare reversible migrations and provide validation, attribution, and known-limitations files as typed evidence.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+migrationsReversible\\s*:\\s*true[\\s\\S]*?property\\s+list<string>\\s+evidence\\s*:\\s*\\[[\\s\\S]*?\"VALIDATION\\.md\"[\\s\\S]*?\"ATTRIBUTION\\.md\"[\\s\\S]*?\"KNOWN_LIMITATIONS\\.md\"[\\s\\S]*?\\]" },
      { label: "Derive the graduation gate", hint: "Make shipping readiness depend on reversible migration and a complete evidence set.", pattern: "ShellRoot\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+readyToShip\\s*:\\s*migrationsReversible\\s*&&\\s*evidence\\.length\\s*>=\\s*3" },
    ],
    rules: ["Pin Shellwright's semantic version and every framework value used by its release matrix.", "Require reversible migrations, redacted evidence, attribution, and both static and Wayland validation results.", "Derive readyToShip from the complete typed release record instead of setting a manual publication flag."],
    explanation: [
      "A release record is the typed contract proving that a particular build is fit to leave development, and semantic versioning is the three-part major.minor.patch identifier used to communicate compatibility. Shellwright needs this evidence because a version label alone says nothing about runtime trials, reversibility, privacy, or redistribution rights.",
      "The solution pins version, quickshellVersion, qtVersion, compositor, and apiReviewedAt, then records validation and safety results as readonly booleans. The evidence and attributions lists name inspectable artifacts, while readyToShip forms a derived conjunction across migration, matrix, input-route, redaction, signature, and attribution requirements.",
      "Graduation fails when a simulated success is mistaken for a Wayland runtime result, private data enters captured evidence, or an upgrade has no return path. Detect that hollow release by looking for a manually asserted ready flag, an incomplete evidence list, unpinned dependencies, or copied assets without attribution.",
    ],
  },
};
