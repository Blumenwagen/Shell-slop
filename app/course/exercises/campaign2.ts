/** Authored exercises for campaign 2 quests. See docs/EXERCISE_AUTHORING_SPEC.md. */
import type { AtlasExercise } from "./types.ts";
export const CAMPAIGN2_EXERCISES: Record<string, AtlasExercise> = {
"clock-locale-cadence": {
  starter: `import QtQuick

QtObject {
    id: clockService

    property date now: new Date()
    property var monthNames: [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ]
    readonly property string displayText:
        monthNames[now.getMonth()] + " " + now.getDate()
        + " " + now.getHours() + ":" + now.getMinutes()

    property Timer clockTimer: Timer {
        interval: 16
        repeat: true
        running: true
        onTriggered: clockService.now = new Date()
    }
}`,
  solution: `import QtQuick

QtObject {
    id: clockService

    property date now: new Date()
    readonly property int secondTick:
        Math.floor(now.getTime() / 1000)
    readonly property int minuteTick:
        Math.floor(now.getTime() / 60000)
    readonly property int year: now.getFullYear()
    readonly property int month: now.getMonth() + 1
    readonly property int day: now.getDate()

    function formatDateTime(format: string): string {
        return Qt.locale().toString(now, format)
    }

    property Timer cadenceTimer: Timer {
        interval: 1000
        repeat: true
        running: true
        onTriggered: clockService.now = new Date()
    }
}`,
  checks: [
    { label: "Use one human-speed cadence", hint: "Drive the shared date from a repeating one-second Timer rather than a frame-rate timer.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+Timer\\s+cadenceTimer\\s*:\\s*Timer\\s*\\{[\\s\\S]*?interval\\s*:\\s*1000[\\s\\S]*?repeat\\s*:\\s*true[\\s\\S]*?onTriggered\\s*:\\s*clockService\\.now\\s*=\\s*new\\s+Date\\(\\)" },
    { label: "Derive both tick scales", hint: "Expose secondTick and minuteTick from the same now value.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+secondTick\\s*:[\\s\\S]*?now\\.getTime\\(\\)\\s*\\/\\s*1000[\\s\\S]*?readonly\\s+property\\s+int\\s+minuteTick\\s*:[\\s\\S]*?now\\.getTime\\(\\)\\s*\\/\\s*60000" },
    { label: "Format through the locale", hint: "Provide a typed formatting function that delegates to Qt.locale().toString.", pattern: "QtObject\\s*\\{[\\s\\S]*?function\\s+formatDateTime\\s*\\(\\s*format\\s*:\\s*string\\s*\\)\\s*:\\s*string\\s*\\{[\\s\\S]*?Qt\\.locale\\(\\)\\.toString\\(\\s*now\\s*,\\s*format\\s*\\)" },
  ],
  rules: ["Update the shared clock no faster than once per displayed second.", "Derive minute and second ticks from the same date value.", "Format dates and times through Qt.locale() instead of assembling translated text by hand."],
  explanation: ["Cadence is the intentional rate at which a service updates. A shell clock needs one trustworthy time source, but it does not need to wake the renderer every 16 milliseconds when its most precise view shows seconds.", "The cadenceTimer updates now once per second, while secondTick and minuteTick derive their scales from that same date. Views call formatDateTime with their desired format, and Qt.locale().toString supplies localized names, ordering, and presentation.", "A frame-speed clock wastes CPU and can keep a quiet system unnecessarily busy. Hand-built month names also reveal themselves when the desktop locale, time zone, or writing direction changes and the clock continues showing the old assumptions."],
},

"battery-ac-truth": {
  starter: `import QtQml

QtObject {
    id: powerModel

    required property QtObject upowerService

    readonly property real percentage: upowerService.percentage
    readonly property string statusText:
        percentage <= 0
            ? "No battery"
            : Math.round(percentage * 100) + "%"
    readonly property bool charging:
        upowerService.state === "charging"
    readonly property int remainingMinutes:
        upowerService.remainingMinutes ?? 0
}`,
  solution: `import QtQml

QtObject {
    id: powerModel

    required property QtObject upowerService

    readonly property bool available: upowerService.available
    readonly property real percentage: upowerService.percentage
    readonly property string chargeState: upowerService.state
    readonly property bool acConnected: upowerService.acConnected
    readonly property int remainingMinutes:
        upowerService.remainingMinutes ?? -1
    readonly property list<QtObject> batteryDevices:
        upowerService.devices ?? []

    readonly property string summaryText:
        !available
            ? "No battery present"
            : Math.round(percentage * 100) + "% — " + chargeState

    readonly property string powerSourceText:
        acConnected ? "Line power connected" : "Running on battery"
    readonly property string estimateText:
        !available || remainingMinutes < 0
            ? "No time estimate"
            : remainingMinutes + " minutes remaining"
}`,
  checks: [
    { label: "Expose explicit availability", hint: "Bind an available boolean directly to the injected UPower service.", pattern: "QtObject\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+upowerService[\\s\\S]*?readonly\\s+property\\s+bool\\s+available\\s*:\\s*upowerService\\.available" },
    { label: "Keep absence distinct from zero", hint: "Choose the no-battery text from available before rendering the percentage.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+summaryText\\s*:\\s*!available\\s*\\?\\s*\"No battery present\"\\s*:\\s*Math\\.round\\(\\s*percentage\\s*\\*\\s*100\\s*\\)" },
    { label: "Preserve aggregate and device truth", hint: "Expose charge state, AC state, and the service device list without replacing device identities.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+chargeState\\s*:\\s*upowerService\\.state[\\s\\S]*?readonly\\s+property\\s+bool\\s+acConnected\\s*:\\s*upowerService\\.acConnected[\\s\\S]*?readonly\\s+property\\s+list<QtObject>\\s+batteryDevices\\s*:\\s*upowerService\\.devices\\s*\\?\\?\\s*\\[\\]" },
  ],
  rules: ["Treat a missing battery as a valid state, not as 0 percent.", "Expose charge state and line-power state independently from charge percentage.", "Preserve the service device list so deeper views can identify individual batteries."],
  explanation: ["A power service is the shared hardware truth used by every battery surface in the shell. Availability must be explicit because a desktop with no battery and a laptop with an empty battery describe different situations.", "The injected upowerService supplies available, percentage, state, and acConnected as separate facts. batteryDevices retains per-device objects, while summaryText and estimateText turn the aggregate state into honest user-facing messages.", "Collapsing absence into zero creates false critical-battery alerts and misleading time estimates. The bug is recognizable when unplugged hardware or a desktop suddenly appears as a fully discharged laptop."],
},

"backlight-device-policy": {
  starter: `import QtQml

QtObject {
    id: brightnessModel

    required property QtObject backlightService
    required property QtObject focusedScreen

    readonly property string screenName: focusedScreen.name
    readonly property real sliderValue:
        backlightService.normalizedBrightness * 100
    readonly property bool controlEnabled: true

    function setBrightness(percent: real): void {
        backlightService.setBrightness(percent / 100)
    }
}`,
  solution: `import QtQml

QtObject {
    id: brightnessModel

    required property QtObject backlightService
    required property QtObject focusedScreen

    readonly property real minimumBrightness: 0.05
    readonly property string selectedScreenName:
        focusedScreen.name
    readonly property bool supported:
        backlightService.supported
    readonly property bool permissionDenied:
        backlightService.permissionDenied
    readonly property real normalizedBrightness:
        backlightService.normalizedBrightness
    readonly property bool controlEnabled:
        supported && !permissionDenied

    readonly property string statusText:
        !supported
            ? selectedScreenName + " has no controllable backlight"
            : permissionDenied
                ? "Brightness permission denied"
                : "Brightness ready"

    function setBrightness(value: real): void {
        if (controlEnabled)
            backlightService.setBrightness(
                value < minimumBrightness
                    ? minimumBrightness
                    : value > 1 ? 1 : value
            )
    }
}`,
  checks: [
    { label: "Resolve the focused display", hint: "Require focusedScreen and expose its name as the selected brightness target.", pattern: "QtObject\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+focusedScreen[\\s\\S]*?readonly\\s+property\\s+string\\s+selectedScreenName\\s*:\\s*focusedScreen\\.name" },
    { label: "Clamp through one action", hint: "Clamp below to minimumBrightness and above to 1 before forwarding to backlightService.", pattern: "QtObject\\s*\\{[\\s\\S]*?function\\s+setBrightness\\s*\\(\\s*value\\s*:\\s*real\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?backlightService\\.setBrightness\\([\\s\\S]*?value\\s*<\\s*minimumBrightness[\\s\\S]*?value\\s*>\\s*1\\s*\\?\\s*1\\s*:\\s*value" },
    { label: "Explain disabled brightness", hint: "Disable the control for unsupported hardware or denied permission and render both reasons.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+controlEnabled\\s*:\\s*supported\\s*&&\\s*!permissionDenied[\\s\\S]*?!supported\\s*\\?[\\s\\S]*?permissionDenied\\s*\\?" },
  ],
  rules: ["Bind the brightness target to the currently focused screen.", "Clamp requested brightness between a non-black minimum and 1 before forwarding it.", "Disable the brightness action and name whether hardware support or permission is missing."],
  explanation: ["Normalized brightness maps a device-specific hardware range onto values from 0 to 1. The shell also needs a target policy because different screens may expose different controls, and some external displays expose none at all.", "focusedScreen identifies the display being controlled, while backlightService supplies its normalizedBrightness and capability state. setBrightness applies minimumBrightness and the upper bound in one place before sending the safe value to the injected service.", "Writing raw percentages or an assumed device path can dim the wrong panel, exceed a hardware range, or fail without feedback. A slider that still moves during permission denial is the clearest sign that presentation and device truth have drifted apart."],
},

"resource-sampling-budget": {
  starter: `import QtQuick

QtObject {
    id: resourceModel

    required property QtObject resourceProbe
    property bool surfaceVisible: false
    property real cpuLoad: 0
    property real memoryLoad: 0
    property real temperature: 0

    property Timer sampleTimer: Timer {
        interval: 250
        repeat: true
        running: true
        onTriggered: {
            var sample = resourceProbe.sample()
            resourceModel.cpuLoad = sample.cpuLoad
            resourceModel.memoryLoad = sample.memoryLoad
            resourceModel.temperature = sample.temperature
        }
    }
}`,
  solution: `import QtQuick

QtObject {
    id: resourceModel

    required property QtObject resourceProbe

    property bool surfaceVisible: false
    property real cpuLoad: 0
    property real memoryLoad: 0
    property real temperature: 0
    property real storageLoad: 0
    property double lastSampleAt: 0
    property double observedNow: Date.now()
    readonly property int staleAfterMs: 10000
    readonly property bool stale:
        lastSampleAt === 0
        || observedNow - lastSampleAt > staleAfterMs

    property Timer sampleTimer: Timer {
        interval: resourceModel.surfaceVisible ? 1000 : 5000
        repeat: true
        running: true
        onTriggered: {
            resourceModel.observedNow = Date.now()
            if (resourceModel.surfaceVisible) {
                var sample = resourceProbe.sample()
                resourceModel.cpuLoad = sample.cpuLoad
                resourceModel.memoryLoad = sample.memoryLoad
                resourceModel.temperature = sample.temperature
                resourceModel.storageLoad = sample.storageLoad
                resourceModel.lastSampleAt = resourceModel.observedNow
            }
        }
    }
}`,
  checks: [
    { label: "Budget cadence by visibility", hint: "Make the Timer interval depend on surfaceVisible and only sample while the surface is open.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+Timer\\s+sampleTimer\\s*:\\s*Timer\\s*\\{[\\s\\S]*?interval\\s*:\\s*resourceModel\\.surfaceVisible\\s*\\?\\s*1000\\s*:\\s*5000[\\s\\S]*?if\\s*\\(\\s*resourceModel\\.surfaceVisible\\s*\\)\\s*\\{[\\s\\S]*?resourceProbe\\.sample\\(\\)" },
    { label: "Mark aging samples stale", hint: "Compare the observed time with lastSampleAt and a named stale threshold.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+staleAfterMs\\s*:\\s*10000[\\s\\S]*?readonly\\s+property\\s+bool\\s+stale\\s*:[\\s\\S]*?observedNow\\s*-\\s*lastSampleAt\\s*>\\s*staleAfterMs" },
    { label: "Batch related resource readings", hint: "Take one sample and update CPU, memory, thermal, and storage fields from it.", pattern: "QtObject\\s*\\{[\\s\\S]*?var\\s+sample\\s*=\\s*resourceProbe\\.sample\\(\\)[\\s\\S]*?cpuLoad\\s*=\\s*sample\\.cpuLoad[\\s\\S]*?memoryLoad\\s*=\\s*sample\\.memoryLoad[\\s\\S]*?temperature\\s*=\\s*sample\\.temperature[\\s\\S]*?storageLoad\\s*=\\s*sample\\.storageLoad" },
  ],
  rules: ["Sample CPU, memory, thermal, and storage data in one bounded batch.", "Run the expensive probe only while its consuming surface is visible.", "Mark readings stale when their age exceeds the declared threshold."],
  explanation: ["Sampling is the act of taking periodic measurements from changing system state. A resource monitor needs enough observations to feel current without becoming measurable load itself or repeatedly waking a sleeping laptop.", "sampleTimer uses a one-second visible cadence and a slower hidden bookkeeping cadence. One resourceProbe.sample call updates the related fields together, while lastSampleAt and staleAfterMs expose whether the displayed snapshot is still trustworthy.", "Independent 250-millisecond timers multiply process work and can make the shell distort the CPU figure it reports. The failure is visible when a closed dashboard continues producing probe traffic or an old temperature remains displayed without a stale marker."],
},

"power-surface-incident": {
  starter: `import QtQuick

Item {
    id: root

    required property QtObject upowerService
    required property QtObject backlightService

    Item {
        id: compact
        property string label:
            Math.round(root.upowerService.percentage * 100) + "%"
    }

    Item {
        id: expanded
        property QtObject powerObserver: root.upowerService
        property string batteryStatus:
            Math.round(powerObserver.percentage * 100) + "%"
        property bool brightnessActionEnabled: true
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    required property QtObject upowerService
    required property QtObject backlightService

    property bool powerDataReady: true
    property string lastEvidence: "Power observer attached"

    function recordEvidence(message: string): void {
        lastEvidence = message
    }

    function handleSuspend(): void {
        powerDataReady = false
        recordEvidence("Suspended; power readings marked stale")
    }

    function handleResume(): void {
        powerDataReady = false
        upowerService.refresh()
        recordEvidence("Resumed; requested fresh power state")
    }

    Connections {
        target: root.upowerService

        function onAvailableChanged(): void {
            root.powerDataReady = true
            root.recordEvidence("Battery availability changed")
        }

        function onPercentageChanged(): void {
            root.powerDataReady = true
            root.recordEvidence("Battery percentage changed")
        }

        function onAcConnectedChanged(): void {
            root.recordEvidence("Line power changed")
        }
    }

    Item {
        id: compact

        readonly property bool degraded:
            !root.powerDataReady || !root.upowerService.available
        readonly property string label:
            !root.powerDataReady
                ? "Power refreshing"
                : !root.upowerService.available
                    ? "AC only"
                    : Math.round(root.upowerService.percentage * 100) + "%"
    }

    Item {
        id: expanded

        readonly property string batteryStatus:
            !root.powerDataReady
                ? "Waiting for fresh power data"
                : !root.upowerService.available
                    ? "No battery present"
                    : root.upowerService.state + " at "
                        + Math.round(root.upowerService.percentage * 100) + "%"
        readonly property string linePowerStatus:
            root.upowerService.acConnected
                ? "Line power connected"
                : "Line power disconnected"
        readonly property bool brightnessActionEnabled:
            root.backlightService.supported
            && !root.backlightService.permissionDenied

        function requestBrightness(value: real): void {
            if (brightnessActionEnabled)
                root.backlightService.setBrightness(
                    value < 0.05 ? 0.05 : value > 1 ? 1 : value
                )
        }
    }
}`,
  checks: [
    { label: "Share one power service", hint: "Make both compact and expanded Items read root.upowerService directly.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+upowerService[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*compact[\\s\\S]*?root\\.upowerService\\.available[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*expanded[\\s\\S]*?root\\.upowerService\\.available" },
    { label: "Render degraded power states", hint: "Give both views explicit refreshing and absent-battery branches.", pattern: "Item\\s*\\{[\\s\\S]*?id\\s*:\\s*compact[\\s\\S]*?!root\\.powerDataReady[\\s\\S]*?!root\\.upowerService\\.available[\\s\\S]*?id\\s*:\\s*expanded[\\s\\S]*?!root\\.powerDataReady[\\s\\S]*?!root\\.upowerService\\.available" },
    { label: "Disable and audit unsafe actions", hint: "Gate brightness on support and permission, then record suspend, resume, and hardware-change evidence.", pattern: "Item\\s*\\{[\\s\\S]*?function\\s+handleSuspend\\s*\\(\\s*\\)\\s*:\\s*void[\\s\\S]*?function\\s+handleResume\\s*\\(\\s*\\)\\s*:\\s*void[\\s\\S]*?Connections\\s*\\{[\\s\\S]*?recordEvidence[\\s\\S]*?brightnessActionEnabled\\s*:\\s*root\\.backlightService\\.supported\\s*&&\\s*!root\\.backlightService\\.permissionDenied" },
  ],
  rules: ["Bind the compact indicator and expanded panel directly to the same injected power service.", "Show refreshing and no-battery states before rendering charge data.", "Disable brightness changes when support or permission is absent and record device-state evidence."],
  explanation: ["A composed power surface has several views but only one hardware truth. Its compact indicator and expanded panel must agree through AC changes, missing batteries, suspend, and resume instead of maintaining competing observers.", "Both child Items read root.upowerService, while handleSuspend marks current readings unready and handleResume requests a refresh. Connections records runtime evidence for availability, percentage, and line-power changes, and brightnessActionEnabled reflects the injected backlight service.", "A happy-path surface fails after resume when stale charge looks current or a second observer updates later than the bar. Another warning sign is a brightness control that accepts input while the display is unsupported or permission is denied."],
},
"pipewire-graph-map": {
  starter: `pragma Singleton
import QtQml

QtObject {
    id: audioGraph

    property QtObject nativeModel: null
    property list<QtObject> sinks: nativeModel === null ? [] : nativeModel.nodes
    property list<QtObject> sources: []
    property list<QtObject> streams: []

    readonly property QtObject defaultSink: sinks.length > 0 ? sinks[0] : null
    readonly property bool available: sinks.length > 0
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    id: audioGraph

    property QtObject nativeModel: null
    property list<QtObject> devices: nativeModel === null ? [] : nativeModel.devices
    property list<QtObject> nodes: nativeModel === null ? [] : nativeModel.nodes
    property list<QtObject> sinks: nodes.filter((node) => node.mediaClass === "Audio/Sink")
    property list<QtObject> sources: nodes.filter((node) => node.mediaClass === "Audio/Source")
    property list<QtObject> streams: nodes.filter((node) =>
        node.mediaClass === "Stream/Output/Audio"
        || node.mediaClass === "Stream/Input/Audio"
    )

    readonly property QtObject defaultSink: sinks.find((sink) => sink.isDefault) ?? null
    readonly property bool available: defaultSink !== null
}`,
  checks: [
    { label: "Expose a singleton sink collection", hint: "Declare AudioGraph as a QtQml singleton and keep its sinks as QtObject references.", pattern: "^\\s*pragma\\s+Singleton\\s+import\\s+QtQml[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?property\\s+list<QtObject>\\s+sinks\\s*:" },
    { label: "Resolve the default by identity", hint: "Find the sink whose isDefault member is true instead of keeping an array index.", pattern: "^\\s*pragma\\s+Singleton[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+QtObject\\s+defaultSink\\s*:\\s*sinks\\.find\\s*\\(\\s*\\(?\\s*sink\\s*\\)?\\s*=>\\s*sink\\.isDefault\\s*\\)\\s*\\?\\?\\s*null" },
    { label: "Derive the graph-facing collections", hint: "Expose devices, nodes, sources, streams, and an availability result from the same native model.", pattern: "^\\s*pragma\\s+Singleton[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?property\\s+list<QtObject>\\s+devices\\s*:[\\s\\S]*?property\\s+list<QtObject>\\s+nodes\\s*:[\\s\\S]*?property\\s+list<QtObject>\\s+sources\\s*:[\\s\\S]*?property\\s+list<QtObject>\\s+streams\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+available\\s*:" },
  ],
  rules: ["Keep PipeWire devices, nodes, sinks, sources, and streams as object references.", "Resolve the default sink with find and its isDefault identity marker.", "Report audio availability from the resolved default rather than from a cached position."],
  explanation: ["PipeWire presents audio as a graph of objects joined by links, much like chambers connected by tunnels. A shell needs to retain those objects because a familiar name can return with a different role after a profile change.", "The AudioGraph singleton observes nativeModel once and filters its nodes into sinks, sources, and streams. Its defaultSink binding uses sinks.find((sink) => sink.isDefault), so the result remains the actual graph object rather than an index-derived copy.", "Index caching fails when a node disappears or the model is reordered during hotplug. The giveaway is a panel that displays or controls the wrong device even though the graph has already selected another default."],
},

"audio-default-resolution": {
  starter: `import QtQuick

Item {
    required property QtObject service

    readonly property QtObject speaker: service.sinks[0] ?? null

    Text {
        id: speakerLabel
        text: speaker === null ? "No speaker" : speaker.name
    }

    function chooseOutput(nodeId: string): void {
        service.selectedSinkIndex = 0
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    required property QtObject audioService

    readonly property QtObject defaultSink: audioService.defaultSink ?? null

    Text {
        id: speakerLabel
        text: defaultSink === null ? "No default output" : defaultSink.name
    }

    function chooseOutput(nodeId: string): void {
        audioService.selectDefaultSink(nodeId)
    }

    MouseArea {
        anchors.fill: speakerLabel
        enabled: defaultSink !== null
        onClicked: root.chooseOutput(defaultSink.id)
    }
}`,
  checks: [
    { label: "Bind to the live default", hint: "Read audioService.defaultSink and normalize a missing reference to null.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+audioService[\\s\\S]*?readonly\\s+property\\s+QtObject\\s+defaultSink\\s*:\\s*audioService\\.defaultSink\\s*\\?\\?\\s*null" },
    { label: "Show an unavailable output state", hint: "Make the speaker label say No default output when the live reference is null.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?text\\s*:\\s*defaultSink\\s*===\\s*null\\s*\\?\\s*\"No default output\"" },
    { label: "Delegate device selection", hint: "Send the chosen node identity to audioService.selectDefaultSink.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?function\\s+chooseOutput\\s*\\(\\s*nodeId\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?audioService\\.selectDefaultSink\\s*\\(\\s*nodeId\\s*\\)" },
  ],
  rules: ["Bind the speaker label to audioService.defaultSink instead of sinks[0].", "Render No default output whenever the service has no default sink reference.", "Pass a selected node ID to audioService.selectDefaultSink."],
  explanation: ["A default device is a live policy decision, not the first entry in a device list. The shell must follow that decision whenever USB, Bluetooth, profiles, or PipeWire itself change the graph.", "The defaultSink property binds directly to audioService.defaultSink and converts an absent value to null. chooseOutput(nodeId: string) delegates selection to the service, while the Text object renders a clear No default output state.", "Assuming index zero is the speaker works only until the list is reordered. You can recognize this bug when the label and volume controls remain attached to an old device after the system default moves elsewhere."],
},

"volume-mute-privacy": {
  starter: `import QtQuick

Item {
    required property QtObject sink
    property bool microphoneCapturing: false

    function setVolume(value: real): void {
        sink.volume = value
    }

    Text {
        text: sink.muted || sink.volume === 0 ? "Silent" : Math.round(sink.volume * 100) + "%"
    }

    Rectangle {
        color: microphoneCapturing ? "red" : "gray"
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    required property QtObject sink
    property bool microphoneCapturing: false

    function setVolume(value: real): void {
        sink.volume = Math.max(0, Math.min(1.5, value))
    }

    Text {
        id: outputState
        text: sink.muted
            ? "Muted"
            : Math.round(sink.volume * 100) + "%"
    }

    Text {
        id: captureIndicator
        text: microphoneCapturing ? "Microphone in use" : "Microphone idle"
        color: microphoneCapturing ? "#d64b4b" : "#7f8c8d"
        Accessible.name: microphoneCapturing
            ? "Microphone capture active"
            : "Microphone capture inactive"
    }
}`,
  checks: [
    { label: "Clamp requested volume", hint: "Limit setVolume inputs with Math.max and Math.min so the accepted range is 0 through 1.5.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+sink[\\s\\S]*?function\\s+setVolume\\s*\\(\\s*value\\s*:\\s*real\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?Math\\.max\\s*\\(\\s*0\\s*,\\s*Math\\.min\\s*\\(\\s*1\\.5\\s*,\\s*value\\s*\\)\\s*\\)" },
    { label: "Keep mute distinct from zero", hint: "Render Muted from sink.muted, while an unmuted zero volume remains 0%.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?id\\s*:\\s*outputState[\\s\\S]*?text\\s*:\\s*sink\\.muted\\s*\\?\\s*\"Muted\"\\s*:\\s*Math\\.round\\s*\\(\\s*sink\\.volume\\s*\\*\\s*100\\s*\\)\\s*\\+\\s*\"%\"" },
    { label: "Name the capture state accessibly", hint: "Give the microphone indicator an Accessible.name for both active and inactive capture.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?id\\s*:\\s*captureIndicator[\\s\\S]*?Accessible\\.name\\s*:\\s*microphoneCapturing[\\s\\S]*?\"Microphone capture active\"[\\s\\S]*?\"Microphone capture inactive\"" },
  ],
  rules: ["Clamp every requested sink volume to the inclusive range from 0 to 1.5.", "Render a muted sink as Muted and an unmuted zero-volume sink as 0%.", "Describe microphone capture activity through Accessible.name as well as color."],
  explanation: ["Volume, mute, and capture are separate audio semantics, meaning they communicate different states even when they can sound equally quiet. A shell must enforce safe limits and make microphone use understandable without relying on eyesight.", "setVolume(value: real) clamps the sink volume between 0 and 1.5, allowing modest amplification without accepting an unbounded request. outputState branches on sink.muted before formatting volume, and captureIndicator supplies explicit visible and Accessible.name text.", "Collapsing mute and zero into Silent conceals whether unmuting will restore sound, while an unclamped slider can request excessive gain. A privacy indicator is also incomplete when its only evidence is a red rectangle that keyboard and screen-reader users cannot interpret."],
},

"audio-hotplug-reconnect": {
  starter: `import QtQuick

Item {
    required property QtObject service

    property QtObject selectedNode: service.nodes[0] ?? null

    function setTargetVolume(value: real): void {
        service.setVolumeFor(selectedNode.id, value)
    }

    Text {
        text: selectedNode === null ? "Device missing" : selectedNode.name
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    required property QtObject service

    property string targetNodeId: ""
    readonly property bool reconnecting: service.reconnecting

    function setTargetVolume(nodeId: string, value: real): void {
        if (reconnecting) {
            return
        }

        const target = service.nodes.find((node) => node.id === nodeId)
        if (target === undefined) {
            return
        }

        service.setVolumeFor(target.id, value)
    }

    Text {
        id: graphStatus
        text: reconnecting ? "Audio reconnecting" : "Audio ready"
    }
}`,
  checks: [
    { label: "Expose reconnecting state", hint: "Bind a boolean reconnecting property to the injected service state.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+service[\\s\\S]*?readonly\\s+property\\s+bool\\s+reconnecting\\s*:\\s*service\\.reconnecting" },
    { label: "Reject vanished targets", hint: "Find the node ID in service.nodes and return when no current node matches before calling setVolumeFor.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?function\\s+setTargetVolume\\s*\\(\\s*nodeId\\s*:\\s*string\\s*,\\s*value\\s*:\\s*real\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?service\\.nodes\\.find\\s*\\(\\s*\\(?\\s*node\\s*\\)?\\s*=>\\s*node\\.id\\s*===\\s*nodeId\\s*\\)[\\s\\S]*?if\\s*\\(\\s*target\\s*===\\s*undefined\\s*\\)\\s*\\{\\s*return\\s*;?\\s*\\}[\\s\\S]*?service\\.setVolumeFor\\s*\\(\\s*target\\.id\\s*,\\s*value\\s*\\)" },
    { label: "Render graph recovery", hint: "Show Audio reconnecting while the service rebuilds its graph.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?id\\s*:\\s*graphStatus[\\s\\S]*?text\\s*:\\s*reconnecting\\s*\\?\\s*\"Audio reconnecting\"\\s*:\\s*\"Audio ready\"" },
  ],
  rules: ["Expose service.reconnecting as visible shell state during graph recovery.", "Resolve a requested node ID against service.nodes immediately before sending its action.", "Cancel volume changes when the target has vanished or the service is reconnecting."],
  explanation: ["Graph churn is the replacement, removal, or reappearance of PipeWire objects during hotplug and recovery. The shell must tolerate that churn because a node captured a moment ago may already be dead.", "setTargetVolume resolves nodeId with service.nodes.find immediately before calling service.setVolumeFor. It returns early for a missing target or reconnecting service, while graphStatus tells the user that audio is being rebuilt.", "A stale reference can leave a slider apparently moving while no live device receives its commands. Racing recovery observers often reveal the same flaw through duplicate updates or controls that briefly act on the wrong returning profile."],
},

"shared-mixer-boss": {
  starter: `import QtQuick

Item {
    required property QtObject audioService

    Item {
        id: barIndicator
        Text {
            text: Math.round(audioService.sinks[0].volume * 100) + "%"
        }
    }

    Item {
        id: volumeOsd
        Text {
            text: Math.round(audioService.sinks[0].volume * 100) + "%"
        }
    }

    Item {
        id: controlCentreRow
        MouseArea {
            onClicked: audioService.sinks[0].volume += 0.05
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    required property QtObject audioService

    readonly property bool degraded: !audioService.available
        || audioService.defaultSink === null
        || audioService.defaultSink === undefined

    function requestVolume(value: real): void {
        if (!degraded) {
            audioService.setVolume(Math.max(0, Math.min(1.5, value)))
        }
    }

    function chooseOutput(nodeId: string): void {
        const target = audioService.sinks.find((sink) => sink.id === nodeId)
        if (target !== undefined) {
            audioService.setDefaultSink(target.id)
        }
    }

    Item {
        id: barIndicator

        Text {
            text: root.degraded
                ? "Audio unavailable"
                : Math.round(audioService.defaultSink.volume * 100) + "%"
        }
    }

    Item {
        id: volumeOsd
        visible: audioService.osdVisible
        opacity: visible && !root.degraded ? 1 : 0

        Behavior on opacity {
            NumberAnimation { duration: 120 }
        }

        Text {
            text: root.degraded
                ? "Audio reconnecting"
                : Math.round(audioService.defaultSink.volume * 100) + "%"
        }
    }

    Item {
        id: controlCentreRow
        property QtObject sink: audioService.defaultSink ?? null

        Text {
            text: root.degraded
                ? "No output device"
                : sink.name + (audioService.microphoneCapturing ? " · Microphone in use" : "")
        }

        MouseArea {
            enabled: !root.degraded
            onClicked: root.requestVolume(audioService.defaultSink.volume + 0.05)
        }
    }
}`,
  checks: [
    { label: "Share one service across three surfaces", hint: "Declare audioService once and reference it from the bar, OSD, and control-centre Items.", pattern: "^(?![\\s\\S]*\\brequired\\s+property\\s+QtObject\\b[\\s\\S]*\\brequired\\s+property\\s+QtObject\\b)\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+audioService\\b[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*barIndicator[\\s\\S]*?audioService\\.[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*volumeOsd[\\s\\S]*?audioService\\.[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*controlCentreRow[\\s\\S]*?audioService\\." },
    { label: "Centralize volume and device actions", hint: "Route volume through audioService.setVolume and validate device IDs against the current sink collection before switching.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?function\\s+requestVolume\\s*\\(\\s*value\\s*:\\s*real\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?audioService\\.setVolume\\s*\\([\\s\\S]*?function\\s+chooseOutput\\s*\\(\\s*nodeId\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?audioService\\.sinks\\.find\\s*\\([\\s\\S]*?audioService\\.setDefaultSink\\s*\\(\\s*target\\.id\\s*\\)" },
    { label: "Coalesce OSD feedback and show failure", hint: "Animate the OSD response with Behavior on opacity and render a degraded reconnecting branch.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+degraded\\s*:[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*volumeOsd[\\s\\S]*?Behavior\\s+on\\s+opacity\\s*\\{[\\s\\S]*?text\\s*:\\s*root\\.degraded\\s*\\?\\s*\"Audio reconnecting\"" },
  ],
  rules: ["Bind the bar, volume OSD, and control-centre row to the single audioService property.", "Route volume and default-device changes through audioService after validating current graph state.", "Animate rapid OSD opacity changes and render explicit unavailable or reconnecting text."],
  explanation: ["A shared mixer is one shell-facing service consumed by every audio surface. Keeping the bar, on-screen display, and control centre on that same boundary ensures they report one default device, one privacy state, and one volume.", "The three child Items all bind to audioService, while requestVolume and chooseOutput centralize mutations and reject stale sink identities. volumeOsd uses Behavior on opacity to smooth bursts of feedback, and degraded supplies a common branch when the graph has no usable default.", "The boss breaks when each surface keeps its own index, observer, or volume copy. The symptoms are disagreement after hotplug, selectable devices that no longer exist, or a polished OSD animation that continues despite live audio being unavailable."],
},
"mpris-player-lifecycle": {
  starter: `pragma Singleton
import QtQml

QtObject {
    property list<QtObject> players: []
    property QtObject lastPlayer: null

    readonly property string displayedIdentity:
        lastPlayer !== null ? lastPlayer.identity : "No player"
    readonly property bool actionable: lastPlayer !== null

    onPlayersChanged: {
        if (players.length > 0)
            lastPlayer = players[0]
    }
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    property list<QtObject> players: []

    readonly property bool hasActivePlayer: players.length > 0
    readonly property QtObject activePlayer:
        hasActivePlayer ? players[0] : null
    readonly property string activeIdentity:
        activePlayer !== null ? activePlayer.identity : "No player"
    readonly property bool activeCanControl:
        activePlayer !== null && activePlayer.canControl === true
    readonly property string playbackState:
        activePlayer !== null
            ? normalizeStatus(activePlayer.playbackStatus)
            : "Gone"
    readonly property bool controlsActionable:
        activePlayer !== null
        && (playbackState === "Playing" || playbackState === "Paused")

    function normalizeStatus(status: string): string {
        return status === "Playing"
            ? "Playing"
            : status === "Paused"
                ? "Paused"
                : "Stopped"
    }
}`,
  checks: [
    { label: "Track the live player list", hint: "Expose players and derive availability from its current length.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+list<QtObject>\\s+players\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+hasActivePlayer\\s*:\\s*players\\.length\\s*>\\s*0" },
    { label: "Represent an empty orbit", hint: "Make activePlayer null when the live list is empty and expose a Gone state.", pattern: "QtObject\\s*\\{[\\s\\S]*?activePlayer\\s*:\\s*hasActivePlayer\\s*\\?\\s*players\\s*\\[\\s*0\\s*\\]\\s*:\\s*null[\\s\\S]*?playbackState\\s*:[\\s\\S]*?\"Gone\"" },
    { label: "Expose live player details", hint: "Derive identity, control capability, and all three playback states from the active object.", pattern: "QtObject\\s*\\{[\\s\\S]*?activeIdentity\\s*:[\\s\\S]*?activePlayer\\.identity[\\s\\S]*?activeCanControl\\s*:[\\s\\S]*?activePlayer\\.canControl[\\s\\S]*?\"Playing\"[\\s\\S]*?\"Paused\"[\\s\\S]*?\"Stopped\"" },
  ],
  rules: ["Derive player availability from the current players list.", "Return null and the Gone state after the final player vanishes.", "Permit controls only for a live Playing or Paused player."],
  explanation: ["MPRIS players are transient processes whose presence changes as media applications start and exit, so the roster the shell observes is never fixed. A shell therefore needs to model absence as honestly as it models playback, because a stale reference is just as misleading as a wrong one.", "The players list is the live roster, while hasActivePlayer and activePlayer derive a nullable selection from it. normalizeStatus keeps Playing, Paused, and Stopped distinct, and playbackState adds Gone when no object remains.", "Caching the last object produces a ghost player after its application exits. You can recognize this bug when an old title and clickable controls survive after the players list becomes empty."],
},

"active-player-policy": {
  starter: `pragma Singleton
import QtQml

QtObject {
    property list<QtObject> players: []
    property string pinnedPlayerId: ""

    readonly property QtObject activePlayer:
        players.length > 0 ? players[0] : null
    readonly property string selectionReason:
        activePlayer !== null ? "First model entry" : "No players"
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    property list<QtObject> players: []
    property string pinnedPlayerId: ""

    readonly property var rankedPlayers:
        players
            .filter((player) => player.canControl !== false)
            .sort((left, right) => right.lastActiveAt - left.lastActiveAt)
    readonly property QtObject pinnedPlayer:
        pinnedPlayerId === ""
            ? null
            : players.find((player) => player.identity === pinnedPlayerId) ?? null
    readonly property QtObject playingPlayer:
        rankedPlayers.find(
            (player) => player.playbackStatus === "Playing"
        ) ?? null
    readonly property QtObject fallbackPlayer:
        rankedPlayers.find(
            (player) => player.playbackStatus === "Paused"
                || player.playbackStatus === "Stopped"
        ) ?? null
    readonly property QtObject activePlayer:
        pinnedPlayer ?? playingPlayer ?? fallbackPlayer
    readonly property string selectionReason:
        pinnedPlayer !== null
            ? "Pinned by identity"
            : playingPlayer !== null
                ? "Playing and most recent"
                : fallbackPlayer !== null
                    ? "Recent idle player"
                    : "No controllable player"
}`,
  checks: [
    { label: "Preserve an explicit pin", hint: "Find the pinned identity in the live players instead of relying on model position.", pattern: "QtObject\\s*\\{[\\s\\S]*?pinnedPlayerId\\s*:[\\s\\S]*?readonly\\s+property\\s+QtObject\\s+pinnedPlayer\\s*:[\\s\\S]*?players\\.find\\s*\\([\\s\\S]*?identity\\s*===\\s*pinnedPlayerId" },
    { label: "Rank controllable candidates", hint: "Filter by capability and sort recency before looking for playback states.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+var\\s+rankedPlayers\\s*:[\\s\\S]*?\\.filter\\s*\\([\\s\\S]*?canControl[\\s\\S]*?\\.sort\\s*\\([\\s\\S]*?lastActiveAt" },
    { label: "Apply the playback policy", hint: "Select the pin first, then a Playing candidate, then a Paused or Stopped fallback.", pattern: "QtObject\\s*\\{[\\s\\S]*?playingPlayer\\s*:[\\s\\S]*?\\.find\\s*\\([\\s\\S]*?playbackStatus\\s*===\\s*\"Playing\"[\\s\\S]*?fallbackPlayer\\s*:[\\s\\S]*?\"Paused\"[\\s\\S]*?\"Stopped\"[\\s\\S]*?activePlayer\\s*:\\s*pinnedPlayer\\s*\\?\\?\\s*playingPlayer\\s*\\?\\?\\s*fallbackPlayer" },
  ],
  rules: ["Keep a present pinned identity ahead of every automatic candidate.", "Prefer the most recent controllable Playing player when no pin applies.", "Choose a Paused or Stopped fallback with find instead of model index zero."],
  explanation: ["An active-player policy is a deterministic rule for deciding which of several media sessions owns a compact surface. It keeps the shell steady even when D-Bus discovery order changes.", "rankedPlayers removes explicitly uncontrollable candidates and sorts the remainder by lastActiveAt. pinnedPlayer, playingPlayer, and fallbackPlayer use find, while activePlayer combines those nullable results in declared priority order.", "Selecting players[0] makes discovery order masquerade as user intent. The failure appears as titles and controls jumping between an idle browser and current music without either session changing state."],
},

"media-transport-position": {
  starter: `import QtQuick
import QtQuick.Controls

Item {
    required property QtObject player
    property real displayedPosition: player.position

    Timer {
        interval: 100
        running: true
        repeat: true
        onTriggered: displayedPosition = player.position
    }

    Row {
        Button {
            text: "Seek +10"
            onClicked: player.seek(10)
        }
        Button {
            text: "Next"
            onClicked: player.next()
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls

Item {
    id: transport
    required property QtObject player
    property real estimatedPosition: player.position

    function togglePlayback(): void {
        if (player.playbackStatus === "Playing")
            player.pause()
        else
            player.play()
    }

    function goPrevious(): void {
        if (player.canGoPrevious === true)
            player.previous()
    }

    function goNext(): void {
        if (player.canGoNext)
            player.next()
    }

    function seekBy(delta: real): void {
        if (player.canSeek)
            player.seek(delta)
    }

    onPlayerChanged: estimatedPosition = player.position

    Connections {
        target: player

        function onPositionChanged(): void {
            transport.estimatedPosition = player.position
        }
    }

    Timer {
        interval: 1000
        repeat: true
        running: transport.visible
            && player.playbackStatus === "Playing"
        onTriggered: transport.estimatedPosition += interval / 1000
    }

    Row {
        spacing: 8

        Button {
            id: previousButton
            text: "Previous"
            enabled: player.canGoPrevious === true
            onClicked: transport.goPrevious()
        }
        Button {
            id: playPauseButton
            text: player.playbackStatus === "Playing" ? "Pause" : "Play"
            onClicked: transport.togglePlayback()
        }
        Button {
            id: seekForwardButton
            text: "Seek +10"
            enabled: player.canSeek
            onClicked: transport.seekBy(10)
        }
        Button {
            id: nextButton
            text: "Next"
            enabled: player.canGoNext
            onClicked: transport.goNext()
        }
    }
}`,
  checks: [
    { label: "Estimate at a calm cadence", hint: "Run a timer no faster than once per second and only while playback is Playing.", pattern: "Item\\s*\\{[\\s\\S]*?Timer\\s*\\{[\\s\\S]*?interval\\s*:\\s*(?:1000|[1-9]\\d{3,})[\\s\\S]*?running\\s*:[\\s\\S]*?playbackStatus\\s*===\\s*\"Playing\"" },
    { label: "Guard advertised actions", hint: "Bind the seek and next buttons to canSeek and canGoNext.", pattern: "Item\\s*\\{[\\s\\S]*?Button\\s*\\{[\\s\\S]*?id\\s*:\\s*seekForwardButton[\\s\\S]*?enabled\\s*:\\s*player\\.canSeek[\\s\\S]*?Button\\s*\\{[\\s\\S]*?id\\s*:\\s*nextButton[\\s\\S]*?enabled\\s*:\\s*player\\.canGoNext" },
    { label: "Resynchronize from player signals", hint: "Handle position changes and route transport calls through typed guard functions.", pattern: "Item\\s*\\{(?=[\\s\\S]*function\\s+togglePlayback\\s*\\(\\s*\\)\\s*:\\s*void)(?=[\\s\\S]*function\\s+goPrevious\\s*\\(\\s*\\)\\s*:\\s*void[\\s\\S]*?canGoPrevious)(?=[\\s\\S]*function\\s+goNext\\s*\\(\\s*\\)\\s*:\\s*void[\\s\\S]*?canGoNext)(?=[\\s\\S]*function\\s+seekBy\\s*\\(\\s*delta\\s*:\\s*real\\s*\\)\\s*:\\s*void[\\s\\S]*?canSeek)[\\s\\S]*?Connections\\s*\\{[\\s\\S]*?function\\s+onPositionChanged\\s*\\(\\s*\\)\\s*:\\s*void" },
  ],
  rules: ["Disable seek, previous, and next actions when the player does not advertise them.", "Advance the estimated position only once per second while the player is Playing and visible.", "Replace each estimate with the player's position whenever its position signal arrives."],
  explanation: ["Position estimation advances a trusted position locally between authoritative updates from the player. It gives the display motion without hammering every media process with rapid polling.", "The Timer runs at a 1000 millisecond cadence only while playbackStatus is Playing and the surface is visible. Connections resets estimatedPosition on player updates, while typed action functions check canSeek, canGoNext, and canGoPrevious before calling transport methods.", "An always-running fast timer wastes wakeups, and an unguarded button promises an operation the player may not support. The defect shows up as needless activity during pauses or as controls that accept clicks but do nothing."],
},

"artwork-metadata-boundary": {
  starter: `import QtQuick

Item {
    required property QtObject player

    Text {
        text: player.trackTitle
    }

    Image {
        source: player.artworkUrl
    }
}`,
  solution: `import QtQuick

Item {
    id: mediaCard
    width: 360
    height: 220

    required property QtObject player
    property bool exposeArtwork: true
    property bool artFailed: false

    Rectangle {
        id: artFrame
        width: 160
        height: 160
        anchors.horizontalCenter: parent.horizontalCenter
        color: "#292331"
    }

    Image {
        id: artwork
        width: 160
        height: 160
        anchors.centerIn: artFrame
        source: mediaCard.exposeArtwork ? player.artworkUrl : ""
        asynchronous: true
        cache: false
        fillMode: Image.PreserveAspectCrop

        onSourceChanged: mediaCard.artFailed = false
        onStatusChanged: {
            if (status === Image.Error)
                mediaCard.artFailed = true
        }
    }

    Rectangle {
        anchors.fill: artFrame
        color: "#5b5266"
        visible: mediaCard.artFailed

        Text {
            anchors.centerIn: parent
            text: "Artwork unavailable"
            color: "white"
        }
    }

    Rectangle {
        anchors.fill: artFrame
        color: "#66000000"
        visible: artwork.status === Image.Ready
    }

    Text {
        width: parent.width - 32
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: artFrame.bottom
        anchors.topMargin: 12
        text: player.trackTitle
        textFormat: Text.PlainText
        elide: Text.ElideRight
        maximumLineCount: 1
        color: "white"
    }
}`,
  checks: [
    { label: "Bound hostile titles", hint: "Give the title a finite width, render it as plain text, and elide overflow.", pattern: "Item\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?width\\s*:[^\\n]+[\\s\\S]*?text\\s*:\\s*player\\.trackTitle[\\s\\S]*?textFormat\\s*:\\s*Text\\.PlainText[\\s\\S]*?elide\\s*:\\s*Text\\.ElideRight" },
    { label: "Reserve and limit artwork", hint: "Set fixed image dimensions before source and disable the implicit image cache.", pattern: "Item\\s*\\{[\\s\\S]*?Image\\s*\\{[\\s\\S]*?width\\s*:\\s*\\d+[\\s\\S]*?height\\s*:\\s*\\d+[\\s\\S]*?source\\s*:[\\s\\S]*?player\\.artworkUrl[\\s\\S]*?cache\\s*:\\s*false" },
    { label: "Replace failed artwork", hint: "Detect Image.Error and reveal a dedicated fallback composition.", pattern: "Item\\s*\\{[\\s\\S]*?Image\\s*\\{[\\s\\S]*?onStatusChanged\\s*:\\s*\\{[\\s\\S]*?status\\s*===\\s*Image\\.Error[\\s\\S]*?artFailed\\s*=\\s*true[\\s\\S]*?Rectangle\\s*\\{[\\s\\S]*?visible\\s*:\\s*mediaCard\\.artFailed" },
  ],
  rules: ["Render the external track title as one bounded, elided line of plain text.", "Reserve fixed artwork dimensions before assigning the player's URL.", "Disable image caching and replace Image.Error with an explicit artwork fallback."],
  explanation: ["Media metadata is external input, so its length, formatting, and artwork cost are outside the shell's control. A safe media card reserves space and limits what that input can do to layout and memory.", "The title Text combines a fixed width, Text.PlainText, and Text.ElideRight. The Image declares its geometry before source, opts out of caching, and sets artFailed from Image.onStatusChanged so a separate fallback can occupy the same frame.", "Unbounded titles can push controls away, while unconstrained images can jump the layout or retain unwanted listening context. A blank or stale frame after Image.Error is the clearest sign that the failure path was treated as an afterthought."],
},

"media-depth-boss": {
  starter: `import QtQuick
import QtQuick.Controls

Item {
    required property QtObject mediaService
    property QtObject compactPlayer: mediaService.activePlayer
    property QtObject drawerPlayer: mediaService.players[0]

    Row {
        Text {
            text: compactPlayer.identity
        }
        Button {
            text: "Play"
            onClicked: compactPlayer.play()
        }
    }

    Column {
        Text {
            text: drawerPlayer.trackTitle
        }
        Button {
            text: "Next"
            onClicked: drawerPlayer.next()
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls

Item {
    id: mediaOrbit
    width: 520
    height: 360

    required property QtObject mediaService
    readonly property bool hasPlayer:
        mediaService.activePlayer !== null

    function togglePlayback(): void {
        const player = mediaService.activePlayer
        if (player === null)
            return
        if (player.playbackStatus === "Playing")
            player.pause()
        else
            player.play()
    }

    function goNext(): void {
        const player = mediaService.activePlayer
        if (player !== null && player.canGoNext)
            player.next()
    }

    function goPrevious(): void {
        const player = mediaService.activePlayer
        if (player !== null && player.canGoPrevious)
            player.previous()
    }

    Text {
        id: disconnectedState
        visible: mediaService.connected === false
        text: "Media service disconnected"
        color: "#b9afc6"
    }

    Text {
        id: emptyState
        visible: !mediaOrbit.hasPlayer
            && mediaService.connected !== false
        text: "No player in orbit"
        color: "#b9afc6"
    }

    Item {
        id: compactBar
        width: parent.width
        height: 48
        visible: mediaService.connected !== false

        Text {
            width: parent.width - 112
            text: mediaService.activePlayer !== null
                ? mediaService.activePlayer.identity
                : "Nothing playing"
            elide: Text.ElideRight
            color: "white"
        }

        Button {
            id: compactPlayPause
            anchors.right: parent.right
            enabled: mediaService.activePlayer !== null
            text: mediaService.activePlayer !== null
                && mediaService.activePlayer.playbackStatus === "Playing"
                    ? "Pause"
                    : "Play"
            onClicked: mediaOrbit.togglePlayback()
        }
    }

    Item {
        id: expandedDrawer
        width: parent.width
        height: 280
        anchors.top: compactBar.bottom
        visible: mediaService.connected !== false

        Rectangle {
            id: artFrame
            width: 180
            height: 180
            color: "#292331"

            Image {
                anchors.fill: parent
                source: mediaService.activePlayer !== null
                    ? mediaService.activePlayer.artworkUrl
                    : ""
                cache: false
                fillMode: Image.PreserveAspectCrop
            }

            Rectangle {
                anchors.fill: parent
                color: "#55000000"
            }
        }

        Text {
            width: parent.width - artFrame.width - 24
            anchors.left: artFrame.right
            anchors.leftMargin: 16
            text: mediaService.activePlayer !== null
                ? mediaService.activePlayer.trackTitle
                : "Choose a media app to begin"
            elide: Text.ElideRight
            color: "white"
        }

        Row {
            anchors.left: artFrame.right
            anchors.leftMargin: 16
            anchors.bottom: artFrame.bottom
            spacing: 8

            Button {
                text: "Previous"
                enabled: mediaService.activePlayer !== null
                    && mediaService.activePlayer.canGoPrevious
                onClicked: mediaOrbit.goPrevious()
            }
            Button {
                id: drawerPlayPause
                text: "Play/Pause"
                enabled: mediaService.activePlayer !== null
                onClicked: mediaOrbit.togglePlayback()
            }
            Button {
                text: "Next"
                enabled: mediaService.activePlayer !== null
                    && mediaService.activePlayer.canGoNext
                onClicked: mediaOrbit.goNext()
            }
        }
    }
}`,
  checks: [
    { label: "Share one active-player service", hint: "Inject one mediaService and bind both compactBar and expandedDrawer to its activePlayer.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+mediaService[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*compactBar[\\s\\S]*?mediaService\\.activePlayer[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*expandedDrawer[\\s\\S]*?mediaService\\.activePlayer" },
    { label: "Compose the empty state", hint: "Show a named no-player branch and explicitly disable controls when activePlayer is null.", pattern: "Item\\s*\\{[\\s\\S]*?Text\\s*\\{\\s*id\\s*:\\s*emptyState[\\s\\S]*?visible\\s*:\\s*!mediaOrbit\\.hasPlayer[\\s\\S]*?text\\s*:\\s*\"No player in orbit\"[\\s\\S]*?Button\\s*\\{[\\s\\S]*?enabled\\s*:\\s*mediaService\\.activePlayer\\s*!==\\s*null" },
    { label: "Reuse shared transport actions", hint: "Route compact and drawer play controls through the same typed action function.", pattern: "Item\\s*\\{[\\s\\S]*?function\\s+togglePlayback\\s*\\(\\s*\\)\\s*:\\s*void[\\s\\S]*?Button\\s*\\{[\\s\\S]*?id\\s*:\\s*compactPlayPause[\\s\\S]*?onClicked\\s*:\\s*mediaOrbit\\.togglePlayback\\s*\\(\\s*\\)[\\s\\S]*?Button\\s*\\{[\\s\\S]*?id\\s*:\\s*drawerPlayPause[\\s\\S]*?onClicked\\s*:\\s*mediaOrbit\\.togglePlayback\\s*\\(\\s*\\)" },
  ],
  rules: ["Bind the compact bar and expanded drawer to the same mediaService.activePlayer.", "Route play, previous, and next requests through shared capability-aware functions.", "Show explicit empty and disconnected compositions and disable every player control when activePlayer is null."],
  explanation: ["Progressive depth means presenting the same live media session with more detail as the surface expands. One service-backed selection prevents the bar and drawer from telling conflicting stories.", "Both compactBar and expandedDrawer read mediaService.activePlayer, and their play buttons call the same typed togglePlayback function. The drawer adds bounded artwork and guarded navigation, while emptyState and disconnectedState give absence distinct compositions.", "Copied player references become stale when a process vanishes and can leave focusable controls attached to a dead session. The boss is failing if the two surfaces show different titles, or if any transport button remains enabled while activePlayer is null."],
},
"connectivity-truth-model": {
  starter: `import QtQuick

Item {
    id: root
    required property QtObject networkService

    property bool online: networkService.radioEnabled

    Text {
        anchors.centerIn: parent
        text: root.online ? "Online" : "Offline"
    }
}`,
  solution: `import QtQuick

Item {
    id: root
    required property QtObject networkService

    property string connectivityText: !networkService.radioEnabled
        ? "Wi-Fi radio off"
        : !networkService.linkUp
            ? "Wi-Fi enabled — no link"
            : networkService.internetReachable === "captive"
                ? "Sign in to the captive portal"
                : networkService.internetReachable === true
                    ? "Online"
                    : "Link up — internet unknown"

    Text {
        anchors.centerIn: parent
        text: root.connectivityText
    }
}`,
  checks: [
    { label: "Injects the network provider", hint: "Declare networkService as a required QtObject on the root Item.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+networkService\\b" },
    { label: "Separates radio, link, and portal states", hint: "Branch on radioEnabled, linkUp, and the captive internetReachable state.", pattern: "Item\\s*\\{[\\s\\S]*?property\\s+string\\s+connectivityText\\s*:\\s*!networkService\\.radioEnabled\\s*\\?[\\s\\S]*?!networkService\\.linkUp\\s*\\?[\\s\\S]*?networkService\\.internetReachable\\s*===\\s*\"captive\"\\s*\\?" },
    { label: "Distinguishes online from unknown", hint: "Render fully reachable and unknown internet states with different text.", pattern: "Item\\s*\\{[\\s\\S]*?networkService\\.internetReachable\\s*===\\s*true\\s*\\?\\s*\"Online\"\\s*:\\s*\"Link up — internet unknown\"[\\s\\S]*?Text\\s*\\{[\\s\\S]*?text\\s*:\\s*root\\.connectivityText" },
  ],
  rules: ["Treat an enabled radio as hardware state, not proof of connectivity.", "Report a missing link separately from an unreachable internet route.", "Name captive and unknown reachability instead of collapsing them into offline."],
  explanation: ["Connectivity is a chain of separate facts: the radio can be powered, a link can exist, and the internet can still be unreachable. A shell needs each fact so its status text tells the user where communication stopped.", "The connectivityText property branches through networkService.radioEnabled, networkService.linkUp, and networkService.internetReachable. Its Text object then presents radio-off, link-down, captive-portal, online, and unknown outcomes without inventing a second source of truth.", "The dangerous failure is calling the machine online as soon as Wi-Fi is enabled. You can recognize it when a panel says Online during portal sign-in, router failure, or an upstream outage."],
},

"wifi-operation-state": {
  starter: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject wifiService

    property string selectedSsid: ""
    property string password: ""
    property bool connecting: false

    function startConnection(): void {
        connecting = true
        wifiService.connect(selectedSsid, password)
    }

    Button {
        text: root.connecting ? "Connected" : "Connect"
        onClicked: root.startConnection()
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject wifiService

    property string operationStatus: "idle"
    readonly property string operationText: operationStatus === "connecting"
        ? "Requesting permission and connecting…"
        : operationStatus === "denied"
            ? "Connection permission denied"
            : operationStatus === "connected"
                ? "Connected"
                : operationStatus === "failed"
                    ? "Connection failed"
                    : "Ready to connect"

    function requestConnection(ssid: string, password: string): void {
        operationStatus = "connecting"
        wifiService.connect(ssid, password)
    }

    function cancelConnection(): void {
        wifiService.cancel()
        operationStatus = "idle"
    }

    Connections {
        target: root.wifiService
        function onConnectionFinished(status: string): void {
            root.operationStatus = status
        }
    }

    Column {
        TextField { id: ssidField; placeholderText: "Network name" }
        TextField { id: passwordField; placeholderText: "Password"; echoMode: TextInput.Password }
        Text { text: root.operationText }
        Button {
            text: root.operationStatus === "connecting" ? "Cancel" : "Connect"
            onClicked: root.operationStatus === "connecting"
                ? root.cancelConnection()
                : root.requestConnection(ssidField.text, passwordField.text)
        }
    }
}`,
  checks: [
    { label: "Passes the secret through", hint: "Accept typed ssid and password parameters and pass both directly to wifiService.connect.", pattern: "Item\\s*\\{[\\s\\S]*?function\\s+requestConnection\\s*\\(\\s*ssid\\s*:\\s*string\\s*,\\s*password\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?wifiService\\.connect\\s*\\(\\s*ssid\\s*,\\s*password\\s*\\)" },
    { label: "Keeps passwords out of properties", hint: "Do not declare an ordinary property string named password.", pattern: "^(?![\\s\\S]*\\bproperty\\s+string\\s+password\\b)[\\s\\S]*Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+wifiService\\b" },
    { label: "Renders the operation state machine", hint: "Give connecting, denied, connected, and failed their own status text.", pattern: "Item\\s*\\{[\\s\\S]*?property\\s+string\\s+operationStatus\\s*:\\s*\"idle\"[\\s\\S]*?operationStatus\\s*===\\s*\"connecting\"[\\s\\S]*?operationStatus\\s*===\\s*\"denied\"[\\s\\S]*?operationStatus\\s*===\\s*\"connected\"[\\s\\S]*?operationStatus\\s*===\\s*\"failed\"[\\s\\S]*?Text\\s*\\{[\\s\\S]*?text\\s*:\\s*root\\.operationText" },
  ],
  rules: ["Pass the password directly from the action parameter to wifiService.connect.", "Render idle, connecting, denied, connected, and failed as distinct operation states.", "Offer cancellation while a connection request is still pending."],
  explanation: ["A Wi-Fi connection is an asynchronous operation, meaning its result arrives after the button press. The panel must expose progress, authorization denial, success, and failure instead of guessing the outcome.", "operationStatus holds the small state machine while Connections receives the provider's final status. requestConnection passes its password parameter straight to wifiService.connect, and cancelConnection gives the pending request an explicit exit.", "A boolean often turns the button into Connected before permission or authentication finishes. Another warning sign is a property string password, because that leaves a secret living in inspectable QML state."],
},

"bluetooth-pairing-journey": {
  starter: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject bluetoothService

    property bool isPairing: false

    Repeater {
        model: root.bluetoothService.devices
        delegate: Button {
            required property QtObject modelData
            text: root.isPairing ? "Pairing…" : modelData.address
            onClicked: {
                root.isPairing = true
                root.bluetoothService.pair(modelData.address)
            }
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject bluetoothService
    readonly property list<QtObject> devices: bluetoothService.devices

    function actOnDevice(address: string, state: string): void {
        const currentDevice = bluetoothService.devices.find(device => device.address === address)
        if (currentDevice === undefined) return
        if (state === "pairing")
            bluetoothService.cancelPairing(currentDevice.address)
        else
            bluetoothService.pair(currentDevice.address)
    }

    Column {
        Repeater {
            model: root.devices

            delegate: Column {
                required property QtObject modelData
                property string deviceKey: modelData.address

                Text { text: "Device " + modelData.address }
                Text {
                    text: modelData.pairingState === "discovered"
                        ? "Discovered"
                        : modelData.pairingState === "pairing"
                            ? "Waiting for verification…"
                            : modelData.pairingState === "paired"
                                ? "Paired"
                                : "Pairing failed"
                }
                Text {
                    text: modelData.connected
                        ? "Connected"
                        : modelData.trusted ? "Trusted, disconnected" : "Not trusted"
                }
                Text { text: "Battery " + modelData.batteryPercent + "%" }
                Button {
                    text: modelData.pairingState === "pairing" ? "Cancel pairing" : "Pair"
                    enabled: modelData.pairingState !== "paired"
                    onClicked: root.actOnDevice(modelData.address, modelData.pairingState)
                }
            }
        }
    }
}`,
  checks: [
    { label: "Exposes independent devices", hint: "Mirror bluetoothService.devices as a typed list instead of sharing one pairing flag.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+bluetoothService\\b[\\s\\S]*?property\\s+list<QtObject>\\s+devices\\s*:\\s*bluetoothService\\.devices" },
    { label: "Keys delegates by address", hint: "Store modelData.address as the delegate's stable device key and render its pairingState.", pattern: "Repeater\\s*\\{[\\s\\S]*?delegate\\s*:\\s*Column\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+modelData[\\s\\S]*?property\\s+string\\s+deviceKey\\s*:\\s*modelData\\.address[\\s\\S]*?modelData\\.pairingState" },
    { label: "Rejects stale pairing actions", hint: "Find the device by address and return when it has disappeared.", pattern: "Item\\s*\\{[\\s\\S]*?function\\s+actOnDevice\\s*\\(\\s*address\\s*:\\s*string\\s*,\\s*state\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?bluetoothService\\.devices\\.find\\s*\\(\\s*device\\s*=>\\s*device\\.address\\s*===\\s*address\\s*\\)[\\s\\S]*?if\\s*\\(\\s*currentDevice\\s*===\\s*undefined\\s*\\)\\s*return" },
  ],
  rules: ["Identify every Bluetooth delegate by its address instead of its model position.", "Render each device's discovered, pairing, paired, or failed state independently.", "Find the addressed device again before pairing or cancelling a stale request."],
  explanation: ["Bluetooth devices arrive, disappear, and change state independently while discovery continues. Stable identity means following a device by its address rather than by a list position that can shift.", "The devices list feeds delegates whose deviceKey comes from modelData.address and whose labels read modelData.pairingState. actOnDevice uses find before asking bluetoothService to pair or cancel, so a vanished device cannot receive a stale command.", "A shared isPairing boolean freezes every row into the same story and can survive after its original device disappears. The symptom is a panel that keeps showing Pairing or acts on a different row after the discovery list reorders."],
},

"vpn-tray-normalization": {
  starter: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject vpnService
    required property QtObject trayItem

    Button {
        text: "Toggle VPN"
        onClicked: root.vpnService.setActive(!root.vpnService.active)
    }

    Image {
        width: 32
        height: 20
        source: "image://theme/network-vpn"
        fillMode: Image.Stretch
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls

Item {
    id: root
    required property QtObject vpnService
    required property QtObject trayItem

    Column {
        Button {
            text: root.vpnService.active ? "Disconnect VPN" : "Connect VPN"
            visible: root.vpnService.supported
            enabled: root.vpnService.supported
            onClicked: root.vpnService.setActive(!root.vpnService.active)
        }

        Text {
            visible: !root.vpnService.supported
            text: "VPN controls unavailable"
        }

        Item {
            id: trayFrame
            width: 28
            height: 28

            Image {
                anchors.centerIn: parent
                width: 20
                height: 20
                source: root.trayItem.iconUrl
                fillMode: Image.PreserveAspectFit
            }

            MouseArea {
                anchors.fill: parent
                onClicked: root.trayItem.activate()
            }
        }
    }
}`,
  checks: [
    { label: "Honors VPN capability", hint: "Make the VPN button visible and enabled only when vpnService.supported is true.", pattern: "Item\\s*\\{[\\s\\S]*?Button\\s*\\{[\\s\\S]*?visible\\s*:\\s*root\\.vpnService\\.supported[\\s\\S]*?enabled\\s*:\\s*root\\.vpnService\\.supported" },
    { label: "Frames the foreign icon safely", hint: "Place trayItem.iconUrl in a fixed 28 by 28 frame and preserve its aspect ratio.", pattern: "Item\\s*\\{[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*trayFrame\\s+width\\s*:\\s*28\\s+height\\s*:\\s*28[\\s\\S]*?Image\\s*\\{[\\s\\S]*?source\\s*:\\s*root\\.trayItem\\.iconUrl[\\s\\S]*?fillMode\\s*:\\s*Image\\.PreserveAspectFit" },
    { label: "Returns actions to the owner", hint: "Forward a click to trayItem.activate instead of replacing the foreign action.", pattern: "Item\\s*\\{[\\s\\S]*?MouseArea\\s*\\{[\\s\\S]*?onClicked\\s*:\\s*root\\.trayItem\\.activate\\s*\\(\\s*\\)" },
  ],
  rules: ["Hide and disable the VPN toggle when vpnService reports that actions are unsupported.", "Source the tray artwork directly from trayItem.iconUrl.", "Preserve the foreign icon's aspect ratio inside a fixed-size frame."],
  explanation: ["System-tray artwork is foreign content, meaning another application owns both its identity and its actions. A shell may normalize the surrounding frame, but it must preserve that ownership and admit when VPN control is unsupported.", "The VPN Button binds visible and enabled to vpnService.supported, while the fallback Text explains its absence. trayFrame supplies consistent dimensions, Image.PreserveAspectFit protects the artwork, and trayItem.activate receives the click.", "Stretching or redrawing tray icons makes unrelated applications look like shell-owned controls. A permanently visible VPN button is another failure clue when pressing it can never work in the current environment."],
},

"connectivity-panel-boss": {
  starter: `import QtQuick
import QtQuick.Controls
import Quickshell

PanelWindow {
    id: root
    required property QtObject wifiService
    required property QtObject bluetoothService
    required property QtObject vpnService

    anchors { top: true; right: true }
    width: 360
    height: 420

    Column {
        Text { text: wifiService.connected ? "Wi-Fi connected" : "Wi-Fi offline" }
        Button { text: "Connect Wi-Fi"; onClicked: wifiService.connected = true }
        Text { text: bluetoothService.pairing ? "Pairing" : "Bluetooth ready" }
        Button { text: "Toggle VPN"; onClicked: vpnService.active = !vpnService.active }
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls
import Quickshell

PanelWindow {
    id: root
    required property QtObject wifiService
    required property QtObject bluetoothService
    required property QtObject vpnService
    property QtObject trayItem: null

    anchors { top: true; right: true }
    width: 380
    height: 560
    exclusiveZone: 0
    color: "#20242b"

    function connectWifi(ssid: string, password: string): void {
        if (wifiService !== null)
            wifiService.connect(ssid, password)
    }

    function pairBluetooth(address: string): void {
        if (bluetoothService === null) return
        const device = bluetoothService.devices.find(candidate => candidate.address === address)
        if (device !== undefined)
            bluetoothService.pair(device.address)
    }

    Column {
        spacing: 12

        Text {
            text: root.wifiService === null
                ? "Wi-Fi service unavailable"
                : "Wi-Fi operation: " + root.wifiService.operationStatus
        }
        TextField { id: ssidField; placeholderText: "Network name" }
        TextField { id: passwordField; placeholderText: "Password"; echoMode: TextInput.Password }
        Button {
            text: root.wifiService !== null
                && root.wifiService.operationStatus === "connecting"
                ? "Connecting…" : "Connect Wi-Fi"
            enabled: root.wifiService !== null
            onClicked: root.connectWifi(ssidField.text, passwordField.text)
        }

        Text {
            text: root.bluetoothService === null
                ? "Bluetooth service unavailable"
                : "Bluetooth operation: " + root.bluetoothService.operationStatus
        }
        Repeater {
            model: root.bluetoothService === null ? [] : root.bluetoothService.devices
            delegate: Button {
                required property QtObject modelData
                property string deviceKey: modelData.address
                text: modelData.address + " — " + modelData.pairingState
                onClicked: root.pairBluetooth(modelData.address)
            }
        }

        Text {
            text: root.vpnService === null || root.vpnService.supported === false
                ? "VPN service unavailable"
                : "VPN operation: " + root.vpnService.operationStatus
        }
        Button {
            visible: root.vpnService !== null && root.vpnService.supported
            enabled: root.vpnService !== null && root.vpnService.supported
            text: root.vpnService !== null && root.vpnService.active
                ? "Disconnect VPN" : "Connect VPN"
            onClicked: root.vpnService.setActive(!root.vpnService.active)
        }

        Item {
            width: 28
            height: 28
            visible: root.trayItem !== null

            Image {
                anchors.fill: parent
                source: root.trayItem === null ? "" : root.trayItem.iconUrl
                fillMode: Image.PreserveAspectFit
            }
            MouseArea {
                anchors.fill: parent
                onClicked: {
                    if (root.trayItem !== null)
                        root.trayItem.activate()
                }
            }
        }
    }
}`,
  checks: [
    { label: "Separates the three providers", hint: "Require one distinct QtObject service for Wi-Fi, Bluetooth, and VPN.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+wifiService\\b[\\s\\S]*?required\\s+property\\s+QtObject\\s+bluetoothService\\b[\\s\\S]*?required\\s+property\\s+QtObject\\s+vpnService\\b" },
    { label: "Shows work and degradation", hint: "Render every provider's operationStatus and include an explicit unsupported VPN message.", pattern: "PanelWindow\\s*\\{(?=[\\s\\S]*Text\\s*\\{[\\s\\S]*?wifiService\\.operationStatus)(?=[\\s\\S]*Text\\s*\\{[\\s\\S]*?bluetoothService\\.operationStatus)(?=[\\s\\S]*Text\\s*\\{[\\s\\S]*?vpnService\\.operationStatus)[\\s\\S]*?vpnService\\.supported\\s*===\\s*false[\\s\\S]*?\"VPN service unavailable\"" },
    { label: "Protects secrets and foreign artwork", hint: "Pass the password directly, avoid a password property, and preserve the tray item's icon ratio.", pattern: "^(?![\\s\\S]*\\bproperty\\s+string\\s+password\\b)(?=[\\s\\S]*function\\s+connectWifi\\s*\\(\\s*ssid\\s*:\\s*string\\s*,\\s*password\\s*:\\s*string\\s*\\)\\s*:\\s*void[\\s\\S]*?wifiService\\.connect\\s*\\(\\s*ssid\\s*,\\s*password\\s*\\))(?=[\\s\\S]*Image\\s*\\{[\\s\\S]*?trayItem\\.iconUrl[\\s\\S]*?Image\\.PreserveAspectFit)[\\s\\S]*PanelWindow\\s*\\{" },
  ],
  rules: ["Read Wi-Fi, Bluetooth, and VPN state from three distinct injected services.", "Show each domain's operation status beside its own controls and name unavailable providers explicitly.", "Pass Wi-Fi secrets through function parameters while preserving foreign tray artwork."],
  explanation: ["A connectivity panel coordinates several asynchronous providers without turning their requests into facts. It also needs degradation evidence, which is visible proof that a missing or unsupported service was detected rather than silently omitted.", "The PanelWindow injects wifiService, bluetoothService, and vpnService separately, and each section renders its own operationStatus. connectWifi forwards the password without storing it, pairBluetooth revalidates device identity, and the VPN branch names an unavailable backend.", "This boss breaks when buttons mutate provider truth optimistically, one busy flag covers unrelated work, or a missing provider leaves empty space. Password properties and stretched tray images are equally recognizable signs that convenience has crossed a trust boundary."],
},
"notification-server-contract": {
  starter: `pragma Singleton
import QtQml

QtObject {
    id: notificationStore

    property string protocolOwner: "Shellcraft"
    property list<QtObject> notifications: []

    function normalizedAppName(payload: var): string {
        return payload.desktopEntry
            ? payload.desktopEntry
            : (payload.appName ? payload.appName : "Unknown application")
    }

    function upsert(id: int, payload: var): void {
        payload.id = id
        payload.appName = normalizedAppName(payload)
        notifications.push(payload)
    }
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    id: notificationStore

    property string protocolOwner: "Shellcraft"
    property list<QtObject> notifications: []

    function normalizedAppName(payload: var): string {
        return payload.desktopEntry
            ? payload.desktopEntry
            : (payload.appName ? payload.appName : "Unknown application")
    }

    function upsert(id: int, payload: var): void {
        payload.id = id
        payload.appName = normalizedAppName(payload)
        payload.timeoutMs = payload.timeoutMs ?? 5000
        payload.hints = payload.hints ?? ({})
        payload.actions = payload.actions ?? []
        payload.closeReason = payload.closeReason ?? ""

        var existing = notifications.find(
            (notification) => notification.id === id
        )

        if (existing) {
            existing.appName = payload.appName
            existing.summary = payload.summary
            existing.body = payload.body
            existing.timeoutMs = payload.timeoutMs
            existing.hints = payload.hints
            existing.actions = payload.actions
            existing.closeReason = payload.closeReason
            return
        }

        notifications.push(payload)
    }
}`,
  checks: [
    { label: "Own one stable notification model", hint: "Declare the store as a singleton and expose one typed list of notification objects.", pattern: "^\\s*pragma\\s+Singleton[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?\\bproperty\\s+list<QtObject>\\s+notifications\\s*:" },
    { label: "Find replacements by protocol id", hint: "Inside upsert, search notifications for a record whose id equals the incoming id.", pattern: "function\\s+upsert\\s*\\(\\s*id\\s*:\\s*int\\s*,\\s*payload\\s*:\\s*var\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?notifications\\.find\\s*\\(\\s*\\(\\s*notification\\s*\\)\\s*=>\\s*notification\\.id\\s*===\\s*id\\s*\\)" },
    { label: "Update before appending", hint: "Modify the matching record and return; push the payload only after that branch.", pattern: "function\\s+upsert\\s*\\(\\s*id\\s*:\\s*int\\s*,\\s*payload\\s*:\\s*var\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?if\\s*\\(\\s*existing\\s*\\)\\s*\\{[\\s\\S]*?existing\\.summary\\s*=\\s*payload\\.summary[\\s\\S]*?return\\s*;?[\\s\\S]*?\\}[\\s\\S]*?notifications\\.push\\s*\\(\\s*payload\\s*\\)" },
  ],
  rules: ["Own the notification protocol through one singleton store.", "Normalize application identity, timeout, hints, actions, and close reason before publishing a record.", "Update a matching notification id in place and append only genuinely new deliveries."],
  explanation: ["A desktop notification server is the single process responsible for receiving and closing notification protocol messages. The shell needs one owner so applications do not encounter competing servers or inconsistent records.", "The NotificationStore singleton exposes property list<QtObject> notifications as the model shared by shell surfaces. Its typed upsert function normalizes protocol fields, uses .find() on notification.id, and updates an existing object before considering a push.", "Blindly appending replacements produces duplicate toasts and leaves obsolete text in history. You can recognize the fault when repeated progress updates create several rows with the same protocol id."],
},

"urgency-action-reply": {
  starter: `import QtQml

QtObject {
    id: controller

    required property string urgency
    property list<string> availableActions: ["open", "reply"]
    property string replyDraft: ""
    property bool replyOpen: false
    readonly property int timeoutMs: urgency === "critical" ? 1500 : 5000

    signal actionInvoked(actionId: string)
    signal replySubmitted(replyText: string)

    function invokeAction(actionId: string): void {
        actionInvoked(actionId)
    }

    function finishReply(replyText: string, cancelled: bool): void {
        if (!cancelled)
            replySubmitted(replyText)
    }
}`,
  solution: `import QtQml

QtObject {
    id: controller

    required property string urgency
    property list<string> availableActions: ["open", "reply", "dismiss"]
    property string replyDraft: ""
    property bool replyOpen: false
    readonly property int timeoutMs: urgency === "critical"
        ? 0
        : (urgency === "low" ? 3000 : 7000)

    signal actionInvoked(actionId: string)
    signal replySubmitted(replyText: string)
    signal closed(reason: string)
    signal focusReturned()

    function invokeAction(actionId: string): void {
        var allowed = availableActions.find(
            (candidate) => candidate === actionId
        )
        if (!allowed)
            return

        actionInvoked(actionId)
    }

    function finishReply(replyText: string, cancelled: bool): void {
        if (!cancelled)
            replySubmitted(replyText)

        replyDraft = ""
        replyOpen = false
        focusReturned()
    }

    function dismiss(reason: string): void {
        finishReply("", true)
        closed(reason)
    }
}`,
  checks: [
    { label: "Derive timeout without focus theft", hint: "Give critical notifications no automatic timeout, shorten low urgency, and do not call forceActiveFocus.", pattern: "^\\s*import\\s+QtQml[\\s\\S]*?QtObject\\s*\\{(?![\\s\\S]*?forceActiveFocus\\s*\\()[\\s\\S]*?required\\s+property\\s+string\\s+urgency[\\s\\S]*?readonly\\s+property\\s+int\\s+timeoutMs\\s*:\\s*urgency\\s*===\\s*\"critical\"\\s*\\?\\s*0\\s*:\\s*\\(\\s*urgency\\s*===\\s*\"low\"\\s*\\?\\s*3000\\s*:\\s*7000\\s*\\)" },
    { label: "Validate action identifiers", hint: "Find actionId in availableActions and return before emitting when it is absent.", pattern: "function\\s+invokeAction\\s*\\(\\s*actionId\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?availableActions\\.find\\s*\\(\\s*\\(\\s*candidate\\s*\\)\\s*=>\\s*candidate\\s*===\\s*actionId\\s*\\)[\\s\\S]*?if\\s*\\(\\s*!allowed\\s*\\)[\\s\\S]*?return[\\s\\S]*?actionInvoked\\s*\\(\\s*actionId\\s*\\)" },
    { label: "Close the private reply session", hint: "Clear replyDraft, close replyOpen, and request focus restoration after completion or cancellation.", pattern: "function\\s+finishReply\\s*\\(\\s*replyText\\s*:\\s*string\\s*,\\s*cancelled\\s*:\\s*bool\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?replyDraft\\s*=\\s*\"\"[\\s\\S]*?replyOpen\\s*=\\s*false[\\s\\S]*?focusReturned\\s*\\(\\s*\\)" },
  ],
  rules: ["Map critical, normal, and low urgency to distinct timeout policies without activating focus.", "Reject every action id that is absent from availableActions.", "Clear reply text and return focus after both reply submission and cancellation."],
  explanation: ["Urgency is a routing signal, not permission to interrupt the user. A shell can keep critical notices visible longer while preserving keyboard focus in an authentication prompt, game, or document.", "The timeoutMs binding uses urgency to choose zero, 3000, or 7000 milliseconds without calling forceActiveFocus(). invokeAction checks availableActions with .find(), while finishReply clears replyDraft and emits focusReturned after either outcome.", "An unchecked action id can invoke behavior the notification never offered, and a lingering reply draft can expose private words later. Focus jumping as soon as a critical alert arrives is another clear sign that severity has been confused with agency."],
},

"history-group-prune": {
  starter: `import QtQml

QtObject {
    id: archive

    property list<QtObject> history: []

    function record(entry: var): void {
        history.push(entry)
    }
}`,
  solution: `import QtQml

QtObject {
    id: archive

    property list<QtObject> history: []
    property int maxAgeMs: 604800000
    property int maxEntries: 200
    property double nowMs: Date.now()

    function record(entry: var): void {
        if (entry.transient === true) {
            return
        }

        var existing = history.find(
            (saved) => saved.id === entry.id
        )

        if (existing) {
            existing.appName = entry.appName
            existing.summary = entry.summary
            existing.body = entry.body
            existing.timestamp = entry.timestamp
        } else {
            history.push(entry)
        }

        prune()
    }

    function prune(): void {
        history = history
            .filter((entry) => nowMs - entry.timestamp <= maxAgeMs)
            .sort((left, right) => right.timestamp - left.timestamp)
            .slice(0, maxEntries)
    }
}`,
  checks: [
    { label: "Publish bounded archive policy", hint: "Place maxAgeMs and maxEntries beside the typed history model.", pattern: "^\\s*import\\s+QtQml[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?property\\s+list<QtObject>\\s+history\\s*:[\\s\\S]*?property\\s+int\\s+maxAgeMs\\s*:[\\s\\S]*?property\\s+int\\s+maxEntries\\s*:" },
    { label: "Exclude transient notices", hint: "Return from record when entry.transient is exactly true.", pattern: "function\\s+record\\s*\\(\\s*entry\\s*:\\s*var\\s*\\)\\s*:\\s*void\\s*\\{\\s*if\\s*\\(\\s*entry\\.transient\\s*===\\s*true\\s*\\)\\s*\\{\\s*return\\s*;?\\s*\\}" },
    { label: "Prune by age and count", hint: "Filter timestamps against maxAgeMs, then slice the result to maxEntries.", pattern: "function\\s+prune\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?history\\s*=\\s*history[\\s\\S]*?\\.filter\\s*\\([\\s\\S]*?nowMs\\s*-\\s*entry\\.timestamp\\s*<=\\s*maxAgeMs[\\s\\S]*?\\.slice\\s*\\(\\s*0\\s*,\\s*maxEntries\\s*\\)" },
  ],
  rules: ["Refuse durable storage for entries whose transient flag is true.", "Replace archived content sharing the same stable notification id.", "Remove expired records and cap the remaining archive at maxEntries."],
  explanation: ["A notification archive is a curated history rather than a transcript of everything applications emit. Explicit retention limits keep it useful while avoiding indefinite storage of old conversations, one-time codes, and stale progress notices.", "record() first rejects entry.transient, then finds an earlier revision through saved.id. prune() filters timestamps with maxAgeMs, orders recent entries first, and applies .slice(0, maxEntries) as the hard count boundary.", "A push-only archive grows without limit and preserves every superseded or sensitive payload. The defect becomes visible when repeated notification replacements form separate rows or notices older than the stated policy never disappear."],
},

"dnd-lock-redaction": {
  starter: `import QtQuick

Item {
    id: policy

    required property string privateText
    property bool locked: false
    property bool doNotDisturb: false
    readonly property bool shouldRedact: locked || doNotDisturb

    Text {
        id: notificationText
        text: policy.shouldRedact
            ? "Notification hidden"
            : policy.privateText
        Accessible.name: policy.privateText
    }
}`,
  solution: `import QtQuick

Item {
    id: policy

    required property string privateText
    property bool locked: false
    property bool doNotDisturb: false
    readonly property bool shouldRedact: locked || doNotDisturb

    Text {
        id: notificationText
        text: policy.shouldRedact
            ? "Notification hidden"
            : policy.privateText
        Accessible.name: policy.shouldRedact
            ? "Notification hidden"
            : policy.privateText
    }
}`,
  checks: [
    { label: "Derive one privacy boundary", hint: "Make shouldRedact true whenever the session is locked or do-not-disturb is active.", pattern: "^\\s*import\\s+QtQuick[\\s\\S]*?Item\\s*\\{[\\s\\S]*?property\\s+bool\\s+locked\\s*:[\\s\\S]*?property\\s+bool\\s+doNotDisturb\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+shouldRedact\\s*:\\s*locked\\s*\\|\\|\\s*doNotDisturb" },
    { label: "Redact visible notification text", hint: "Choose the hidden label from shouldRedact before displaying privateText.", pattern: "Text\\s*\\{[\\s\\S]*?\\btext\\s*:\\s*policy\\.shouldRedact\\s*\\?\\s*\"Notification hidden\"\\s*:\\s*policy\\.privateText" },
    { label: "Redact the accessibility name", hint: "Apply the same shouldRedact branch to Accessible.name instead of exposing privateText directly.", pattern: "Text\\s*\\{[\\s\\S]*?Accessible\\.name\\s*:\\s*policy\\.shouldRedact\\s*\\?\\s*\"Notification hidden\"\\s*:\\s*policy\\.privateText" },
  ],
  rules: ["Derive shouldRedact from both locked and doNotDisturb state.", "Render the neutral hidden label whenever shouldRedact is true.", "Apply the identical redaction decision to Accessible.name."],
  explanation: ["Redaction removes sensitive content before it reaches any presentation channel. The boundary matters on locked or quiet surfaces because hidden pixels alone do not protect accessibility output, captures, or other observers.", "shouldRedact combines locked and doNotDisturb into one shared decision. Both Text.text and Accessible.name branch on that property, so the visible label and the screen-reader label receive the same safe wording.", "A shell can appear private while still announcing the original message through its accessibility name. Test with redaction enabled: hearing privateText while seeing “Notification hidden” identifies the leak immediately."],
},

"notification-pipeline-boss": {
  starter: `pragma Singleton
import QtQml

QtObject {
    id: brokenPipeline

    property list<QtObject> toastNotifications: []
    property list<QtObject> archivedNotifications: []
    property bool locked: false

    function receive(payload: var): void {
        toastNotifications.push(payload)
        archivedNotifications.push(payload)
    }

    property QtObject toastSurface: QtObject {
        readonly property list<QtObject> source: brokenPipeline.toastNotifications
        function bodyFor(notification: var): string {
            return notification.body
        }
    }

    property QtObject archiveSurface: QtObject {
        readonly property list<QtObject> source: brokenPipeline.archivedNotifications
        readonly property int badgeCount: source.length
    }
}`,
  solution: `pragma Singleton
import QtQml

QtObject {
    id: pipeline

    property list<QtObject> notifications: []
    property bool locked: false
    property bool doNotDisturb: false
    readonly property bool shouldRedact: locked || doNotDisturb

    signal closed(id: int, reason: string)

    function upsert(id: int, payload: var): void {
        payload.id = id
        var existing = notifications.find(
            (notification) => notification.id === id
        )

        if (existing) {
            existing.appName = payload.appName
            existing.summary = payload.summary
            existing.body = payload.body
            existing.timestamp = payload.timestamp
            return
        }

        notifications.push(payload)
    }

    function dismiss(id: int, reason: string): void {
        notifications = notifications.filter(
            (notification) => notification.id !== id
        )
        closed(id, reason)
    }

    property QtObject toastSurface: QtObject {
        readonly property list<QtObject> source: pipeline.notifications

        function bodyFor(notification: var): string {
            return pipeline.shouldRedact
                ? "Notification hidden"
                : notification.body
        }
    }

    property QtObject archiveSurface: QtObject {
        readonly property list<QtObject> source: pipeline.notifications
        readonly property int badgeCount: source.length
    }
}`,
  checks: [
    { label: "Feed both surfaces from one singleton", hint: "Declare pragma Singleton exactly once and bind both surface sources to pipeline.notifications.", pattern: "^\\s*(?![\\s\\S]*?pragma\\s+Singleton[\\s\\S]*?pragma\\s+Singleton)(?=[\\s\\S]*?pragma\\s+Singleton)[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?property\\s+QtObject\\s+toastSurface\\s*:\\s*QtObject\\s*\\{[\\s\\S]*?source\\s*:\\s*pipeline\\.notifications[\\s\\S]*?property\\s+QtObject\\s+archiveSurface\\s*:\\s*QtObject\\s*\\{[\\s\\S]*?source\\s*:\\s*pipeline\\.notifications" },
    { label: "Merge replacements at the source", hint: "Find an existing id, update its body, return, and push only when no record matched.", pattern: "function\\s+upsert\\s*\\(\\s*id\\s*:\\s*int\\s*,\\s*payload\\s*:\\s*var\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?notifications\\.find\\s*\\(\\s*\\(\\s*notification\\s*\\)\\s*=>\\s*notification\\.id\\s*===\\s*id\\s*\\)[\\s\\S]*?if\\s*\\(\\s*existing\\s*\\)\\s*\\{[\\s\\S]*?existing\\.body\\s*=\\s*payload\\.body[\\s\\S]*?return\\s*;?[\\s\\S]*?\\}[\\s\\S]*?notifications\\.push\\s*\\(\\s*payload\\s*\\)" },
    { label: "Redact toasts and record closure", hint: "Gate bodyFor with shouldRedact and provide the typed dismiss function with a close reason.", pattern: "^\\s*pragma\\s+Singleton[\\s\\S]*?readonly\\s+property\\s+bool\\s+shouldRedact\\s*:\\s*locked\\s*\\|\\|\\s*doNotDisturb[\\s\\S]*?function\\s+dismiss\\s*\\(\\s*id\\s*:\\s*int\\s*,\\s*reason\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?closed\\s*\\(\\s*id\\s*,\\s*reason\\s*\\)[\\s\\S]*?property\\s+QtObject\\s+toastSurface\\s*:[\\s\\S]*?function\\s+bodyFor\\s*\\(\\s*notification\\s*:\\s*var\\s*\\)\\s*:\\s*string\\s*\\{[\\s\\S]*?return\\s+pipeline\\.shouldRedact\\s*\\?\\s*\"Notification hidden\"\\s*:\\s*notification\\.body" },
  ],
  rules: ["Register exactly one singleton pipeline as the owner of notification state.", "Merge replacement ids before the shared model reaches toast, archive, and badge consumers.", "Redact toast bodies from shared privacy state and emit the supplied close reason on dismissal."],
  explanation: ["The pipeline is the shell’s single river of notification state, feeding shallow toasts and deeper archival views from the same records. Central ownership makes replacement, privacy, action completion, and closure decisions consistent across every outlet.", "pipeline.notifications is consumed directly by both toastSurface and archiveSurface. upsert() merges matching ids, bodyFor() applies shouldRedact before rendering, and dismiss() removes the record while emitting its reason.", "Parallel stores drift: one may retain replaced text, expose a locked payload, or count a notice already dismissed elsewhere. Duplicate ids, mismatched badge totals, or private toast bodies under lock are runtime evidence that a surface has bypassed the river."],
},
"workspace-window-model": {
  starter: `import QtQuick

Item {
    id: root
    required property QtObject compositorService

    readonly property QtObject urgentWorkspace:
        compositorService.workspaces[2]

    Repeater {
        model: compositorService.workspaces
        delegate: Rectangle {
            required property QtObject modelData
            width: 24
            height: 24
            color: modelData.active ? "#8d7cff" : "#292531"
        }
    }
}`,
  solution: `import QtQuick

Item {
    id: root
    required property QtObject compositorService

    readonly property QtObject urgentWorkspace:
        compositorService.workspaces.find(workspace => workspace.urgent) ?? null
    readonly property QtObject activeWorkspace:
        compositorService.workspaces.find(workspace => workspace.active) ?? null

    Repeater {
        model: compositorService.workspaces
        delegate: Rectangle {
            id: workspaceDelegate
            required property QtObject modelData
            objectName: modelData.id
            width: 24
            height: 24
            radius: modelData.active ? 12 : 6
            color: modelData.urgent
                ? "#e0554f"
                : (modelData.active ? "#8d7cff" : "#292531")

            Text {
                anchors.centerIn: parent
                elide: Text.ElideRight
                text: workspaceDelegate.modelData.title.length > 0
                    ? workspaceDelegate.modelData.title
                    : workspaceDelegate.modelData.id
            }
        }
    }
}`,
  checks: [
    { label: "Inject the compositor's workspace list", hint: "Require compositorService and read its workspaces collection.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+compositorService\\b[\\s\\S]*?compositorService\\.workspaces" },
    { label: "Resolve urgency by identity", hint: "Find the urgent workspace with workspaces.find(workspace => workspace.urgent) instead of a fixed index.", pattern: "readonly\\s+property\\s+QtObject\\s+urgentWorkspace\\s*:\\s*compositorService\\.workspaces\\.find\\s*\\(\\s*workspace\\s*=>\\s*workspace\\.urgent\\s*\\)" },
    { label: "Key delegates by stable id", hint: "Give each Repeater delegate an objectName bound to modelData.id.", pattern: "Repeater\\s*\\{[\\s\\S]*?delegate\\s*:\\s*Rectangle\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+modelData[\\s\\S]*?objectName\\s*:\\s*modelData\\.id" },
  ],
  rules: ["Resolve the urgent workspace with find, never a hardcoded array position.", "Give every workspace delegate a stable identity key derived from modelData.id.", "Bound and elide workspace titles instead of trusting their reported length."],
  explanation: ["A compositor publishes workspaces as a changing collection, and identity is the stable key — here modelData.id — that lets a delegate survive that collection being reordered. Without it, the shell's urgent marker or active highlight can silently attach itself to the wrong workspace.", "compositorService.workspaces feeds a Repeater whose delegate reads modelData.id, modelData.urgent, and modelData.active. urgentWorkspace and activeWorkspace both call .find() on that same list instead of indexing into it, and the Text label elides an externally supplied title.", "Reading workspaces[2] assumes a fixed position that a workspace rename, closure, or reorder immediately breaks. The bug shows up as an urgent dot lighting up next to the wrong workspace number after the compositor reshuffles its own list."],
},

"focused-context-resolution": {
  starter: `import Quickshell

Variants {
    model: Quickshell.screens

    PanelWindow {
        required property ShellScreen modelData
        screen: modelData
        visible: modelData === Quickshell.screens[0]
    }
}`,
  solution: `import Quickshell

Variants {
    id: screenVariants
    required property QtObject compositorService

    model: Quickshell.screens

    PanelWindow {
        required property ShellScreen modelData
        screen: modelData

        readonly property bool isFocusedScreen:
            modelData.name === screenVariants.compositorService.focusedScreenName
        readonly property bool noFocusReported:
            screenVariants.compositorService.focusedScreenName === ""

        visible: isFocusedScreen
            || (noFocusReported && modelData === Quickshell.screens[0])
    }
}`,
  checks: [
    { label: "Bind each window to its live screen", hint: "Declare required property ShellScreen modelData on the delegate and set screen: modelData.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData[\\s\\S]*?screen\\s*:\\s*modelData" },
    { label: "Match focus by screen name", hint: "Compare modelData.name against compositorService.focusedScreenName instead of a fixed index.", pattern: "readonly\\s+property\\s+bool\\s+isFocusedScreen\\s*:\\s*modelData\\.name\\s*===\\s*screenVariants\\.compositorService\\.focusedScreenName" },
    { label: "Handle the no-focus fallback explicitly", hint: "Add a noFocusReported branch for when the compositor reports no focused screen.", pattern: "readonly\\s+property\\s+bool\\s+noFocusReported\\s*:\\s*screenVariants\\.compositorService\\.focusedScreenName\\s*===\\s*\"\"[\\s\\S]*?visible\\s*:\\s*isFocusedScreen\\s*\\|\\|\\s*\\(\\s*noFocusReported" },
  ],
  rules: ["Resolve the focused output by comparing modelData.name to the compositor's reported name.", "Never key focused-screen behaviour to Quickshell.screens[0].", "Give the missing-focus case its own named branch instead of silently defaulting."],
  explanation: ["focusedScreen is the display resolved from compositor focus rather than a hard-coded array position, and a registry is the mapping — here just a name comparison — from that live identity back to a ShellScreen object. Multi-monitor shells need this because the first screen in an array is rarely the one the user is looking at.", "Variants creates one PanelWindow per entry in Quickshell.screens, each carrying required property ShellScreen modelData. isFocusedScreen compares modelData.name with screenVariants.compositorService.focusedScreenName, and noFocusReported gives an explicit fallback for the moment a monitor is unplugged and nothing is focused yet.", "Quickshell.screens[0] opens drawers on whatever happens to enumerate first, which is visibly wrong on a laptop-plus-external setup and can dereference a screen that hotplug just removed. The tell is a popout that keeps appearing on the built-in display no matter which monitor the user is actually using."],
},

"window-mode-policy": {
  starter: `import QtQuick

Item {
    id: root

    property bool fullscreenClientPresent: false
    readonly property real exclusiveZone: 48

    Rectangle {
        id: bar
        height: 48
        opacity: root.fullscreenClientPresent ? 0 : 1
        visible: root.fullscreenClientPresent ? false : true
    }
}`,
  solution: `import QtQuick

Item {
    id: root

    property bool fullscreenClientPresent: false

    readonly property real exclusiveZone:
        fullscreenClientPresent ? 0 : 48
    readonly property bool barVisible:
        !fullscreenClientPresent
    readonly property real barRadius:
        fullscreenClientPresent ? 0 : 16
    readonly property bool barAcceptsInput:
        !fullscreenClientPresent

    Rectangle {
        id: bar
        height: root.exclusiveZone
        radius: root.barRadius
        visible: root.barVisible
        opacity: root.barVisible ? 1 : 0
        enabled: root.barAcceptsInput

        Behavior on opacity {
            NumberAnimation { duration: 160 }
        }
    }
}`,
  checks: [
    { label: "Derive exclusion from the mode flag", hint: "Bind exclusiveZone to fullscreenClientPresent with a ternary instead of a constant.", pattern: "readonly\\s+property\\s+real\\s+exclusiveZone\\s*:[\\s\\S]*?fullscreenClientPresent\\s*\\?\\s*0\\s*:\\s*48" },
    { label: "Derive visibility from the same flag", hint: "Bind barVisible to the negation of fullscreenClientPresent.", pattern: "readonly\\s+property\\s+bool\\s+barVisible\\s*:\\s*!fullscreenClientPresent" },
    { label: "Disable input together with visibility", hint: "Bind the bar's enabled state to barAcceptsInput so it stops accepting clicks in fullscreen.", pattern: "Rectangle\\s*\\{[\\s\\S]*?visible\\s*:\\s*root\\.barVisible[\\s\\S]*?enabled\\s*:\\s*root\\.barAcceptsInput" },
  ],
  rules: ["Derive exclusiveZone, barVisible, and barAcceptsInput from the same fullscreenClientPresent flag.", "Never leave exclusiveZone at a constant while visibility changes with fullscreen state.", "Disable input on a bar that has hidden itself for fullscreen, not just lower its opacity."],
  explanation: ["Window mode policy is the coordinated shell response to a compositor reporting fullscreen, maximized, floating, or special-workspace clients. One boolean signal should drive every dependent surface property together, not just the one a component author remembers first.", "fullscreenClientPresent is the single source, and exclusiveZone, barVisible, barRadius, and barAcceptsInput are each derived from it independently so a reviewer can see every consequence in one place. The Rectangle then binds visible, enabled, and its Behavior on opacity to those derived properties rather than reading fullscreenClientPresent itself.", "A bar that only fades its opacity in fullscreen keeps its exclusion zone reserved and keeps accepting clicks on invisible pixels, which silently steals space and input from the fullscreen client. The giveaway is a fullscreen video that cannot be clicked along its top edge even though nothing appears to be there."],
},

"validated-compositor-actions": {
  starter: `import QtQuick
import QtQuick.Controls
import Quickshell.Io

Item {
    id: root
    property list<string> knownWorkspaceIds: ["1", "2", "3"]

    Process {
        id: workspaceProcess
    }

    Button {
        text: "Go to 2"
        onClicked: {
            workspaceProcess.command = ["compositorctl", "workspace", "2"]
            workspaceProcess.running = true
        }
    }

    IpcHandler {
        target: "workspace"
        function go(id: string): void {
            workspaceProcess.command = ["compositorctl", "switch", id]
            workspaceProcess.running = true
        }
    }
}`,
  solution: `import QtQuick
import QtQuick.Controls
import Quickshell.Io

Item {
    id: root
    property list<string> knownWorkspaceIds: ["1", "2", "3"]

    Process {
        id: workspaceProcess
    }

    function switchWorkspace(workspaceId: string): void {
        if (!knownWorkspaceIds.includes(workspaceId)) return
        workspaceProcess.command = ["compositorctl", "workspace", workspaceId]
        workspaceProcess.running = true
    }

    Button {
        text: "Go to 2"
        onClicked: root.switchWorkspace("2")
    }

    IpcHandler {
        target: "workspace"
        function go(id: string): void { root.switchWorkspace(id) }
    }
}`,
  checks: [
    { label: "Validate before sending intent", hint: "Check knownWorkspaceIds.includes(workspaceId) and return before touching the process.", pattern: "function\\s+switchWorkspace\\s*\\(\\s*workspaceId\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{[\\s\\S]*?if\\s*\\(\\s*!knownWorkspaceIds\\.includes\\s*\\(\\s*workspaceId\\s*\\)\\s*\\)\\s*return" },
    { label: "Pass an argument list, never a shell string", hint: "Assign workspaceProcess.command as an array built from workspaceId.", pattern: "function\\s+switchWorkspace[\\s\\S]*?workspaceProcess\\.command\\s*=\\s*\\[\\s*\"compositorctl\"\\s*,\\s*\"workspace\"\\s*,\\s*workspaceId\\s*\\]" },
    { label: "Share one action across every route", hint: "Call root.switchWorkspace from both the Button and the IpcHandler function.", pattern: "Button\\s*\\{[\\s\\S]*?onClicked\\s*:\\s*root\\.switchWorkspace\\s*\\([\\s\\S]*?IpcHandler\\s*\\{[\\s\\S]*?function\\s+go\\s*\\(\\s*id\\s*:\\s*string\\s*\\)\\s*:\\s*void\\s*\\{\\s*root\\.switchWorkspace\\s*\\(\\s*id\\s*\\)\\s*\\}" },
  ],
  rules: ["Validate every workspace id against knownWorkspaceIds before building a command.", "Build Process.command as an argument array, never a concatenated shell string.", "Route the Button click and the IpcHandler call through the same switchWorkspace function."],
  explanation: ["A guarded gate is one validated action boundary that every input route — click, keyboard shortcut, or IPC — must pass through, so an allow-list is the fixed set of accepted ids that boundary checks requests against. Compositor actions need this because IPC callers are less trustworthy than a button the shell itself drew.", "switchWorkspace(workspaceId: string) rejects anything absent from knownWorkspaceIds with .includes(), then assigns workspaceProcess.command as the array [\"compositorctl\", \"workspace\", workspaceId]. Both the Button's onClicked and the IpcHandler's go function call that same root.switchWorkspace, so there is exactly one place validation can be added or a bug fixed.", "Building a command directly in a click handler while a parallel IpcHandler assembles a similar-but-different command creates two divergent, unvalidated paths — an IPC caller could send an id that was never checked. The symptom is inconsistent behaviour between a keyboard shortcut and its matching UI button, or a workspace switch that succeeds for values that should have been rejected."],
},

"live-status-spine-boss": {
  starter: `import QtQuick
import Quickshell

Item {
    id: root
    required property QtObject compositorService

    Item {
        id: statusSpine
        property QtObject focusedScreen: Quickshell.screens[0]
        property QtObject firstWorkspace: compositorService.workspaces[0]
        property string statusText: firstWorkspace.id
    }

    Item {
        id: statusDrawer
        property QtObject focusedScreen: Quickshell.screens[0]
        property QtObject firstWorkspace: compositorService.workspaces[0]
        property string statusText: "Workspace " + firstWorkspace.id
    }
}`,
  solution: `import QtQuick
import Quickshell

Item {
    id: root
    required property QtObject compositorService

    function focusedScreen(): ShellScreen {
        return Quickshell.screens.find(
            screen => screen.name === compositorService.focusedScreenName
        ) ?? null
    }

    function workspaceById(workspaceId: string): QtObject {
        return compositorService.workspaces.find(
            workspace => workspace.id === workspaceId
        ) ?? null
    }

    readonly property bool degraded:
        !compositorService.available || compositorService.reconnecting

    Item {
        id: statusSpine
        readonly property QtObject screen: root.focusedScreen()
        readonly property QtObject activeWorkspace:
            root.workspaceById(compositorService.activeWorkspaceId)
        readonly property string statusText:
            root.degraded
                ? "Compositor reconnecting"
                : (activeWorkspace !== null
                    ? "Workspace " + activeWorkspace.id
                    : "No active workspace")
    }

    Item {
        id: statusDrawer
        readonly property QtObject screen: root.focusedScreen()
        readonly property list<QtObject> workspaces: compositorService.workspaces
        readonly property string statusText:
            root.degraded
                ? "Compositor reconnecting"
                : "Screen " + (screen !== null ? screen.name : "unknown")
    }
}`,
  checks: [
    { label: "Share one compositor service", hint: "Require compositorService once and reference it from both statusSpine and statusDrawer.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+QtObject\\s+compositorService\\b[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*statusSpine[\\s\\S]*?compositorService[\\s\\S]*?Item\\s*\\{\\s*id\\s*:\\s*statusDrawer[\\s\\S]*?compositorService" },
    { label: "Resolve screen and workspace by identity", hint: "Match the focused screen by name and look up a workspace by id, never by array index.", pattern: "function\\s+focusedScreen\\s*\\(\\s*\\)\\s*:\\s*ShellScreen\\s*\\{[\\s\\S]*?screen\\.name\\s*===\\s*compositorService\\.focusedScreenName[\\s\\S]*?function\\s+workspaceById\\s*\\(\\s*workspaceId\\s*:\\s*string\\s*\\)\\s*:\\s*QtObject\\s*\\{[\\s\\S]*?workspace\\.id\\s*===\\s*workspaceId" },
    { label: "Render one shared degraded branch", hint: "Derive degraded from compositorService.available and .reconnecting and show it in both surfaces.", pattern: "readonly\\s+property\\s+bool\\s+degraded\\s*:\\s*!compositorService\\.available\\s*\\|\\|\\s*compositorService\\.reconnecting[\\s\\S]*?statusText\\s*:[\\s\\S]*?root\\.degraded[\\s\\S]*?\"Compositor reconnecting\"[\\s\\S]*?statusText\\s*:[\\s\\S]*?root\\.degraded[\\s\\S]*?\"Compositor reconnecting\"" },
  ],
  rules: ["Bind statusSpine and statusDrawer to the single injected compositorService instance.", "Resolve the focused screen by name and the active workspace by id, not by fixed index.", "Render the same degraded, reconnecting branch in both the compact and expanded surfaces."],
  explanation: ["A status spine is the capstone composition where a compact bar and an expanded drawer must agree, because they are two views of the same live compositor truth rather than two independent observers. Evidence, in this course's sense, is the reproducible proof — here, matching text in both surfaces — that they actually share state instead of merely looking similar.", "Both statusSpine and statusDrawer read root.compositorService, and both call the shared focusedScreen() and workspaceById() functions, which resolve identity through screen.name and workspace.id instead of an array position. The shared degraded property, derived from compositorService.available and .reconnecting, gates both statusText bindings so a reconnect shows the same message everywhere at once.", "The capstone fails exactly where earlier quests warned: a fixed screens[0] or workspaces[0] silently points at the wrong monitor or workspace after hotplug, and two independently written observers can disagree the moment the compositor restarts. The tell is the bar and drawer showing different workspace numbers, or both continuing to show stale data with no reconnecting message at all."],
},
};
