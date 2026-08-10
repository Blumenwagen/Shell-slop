/** Authored exercises for campaign 4 quests. See docs/EXERCISE_AUTHORING_SPEC.md. */
import type { AtlasExercise } from "./types.ts";

export const CAMPAIGN4_EXERCISES: Record<string, AtlasExercise> = {
  "whole-screen-composition": {
    starter: `import QtQuick

Rectangle {
    width: 1280
    height: 720
    color: "#17151d"

    Rectangle {
        x: 864
        y: 72
        width: 320
        height: 196
        radius: 24
        color: "#302b38"
        Text {
            anchors.centerIn: parent
            text: "Now playing"
            color: "white"
        }
    }
}`,
    solution: `import QtQml

QtObject {
    property string screenState: "expanded"
    readonly property list<string> supportedStates: ["closed", "compact", "expanded", "fullscreen", "lock"]
    property list<QtObject> surfaces: [
        QtObject {
            readonly property string role: "wallpaper"
            readonly property string origin: "screen"
            readonly property string depthTier: "deep"
            readonly property real occupiedFraction: 0
        },
        QtObject {
            readonly property string role: "application-space"
            readonly property string origin: "workspace"
            readonly property string depthTier: "contextual"
            readonly property real occupiedFraction: 0.54
        },
        QtObject {
            readonly property string role: "persistent-edge"
            readonly property string origin: "top-edge"
            readonly property string depthTier: "persistent"
            readonly property real occupiedFraction: 0.08
        },
        QtObject {
            readonly property string role: "transient-depth"
            readonly property string origin: "focused-action"
            readonly property string depthTier: "contextual"
            readonly property real occupiedFraction: 0.06
        },
        QtObject {
            readonly property string role: "focus-layer"
            readonly property string origin: "keyboard-navigation"
            readonly property string depthTier: "deep"
            readonly property real occupiedFraction: 0.02
        },
        QtObject {
            readonly property string role: "modal-layer"
            readonly property string origin: "modal-trigger"
            readonly property string depthTier: "modal"
            readonly property real occupiedFraction: 0.12
        }
    ]
    readonly property real reservedNegativeSpace: 1 - surfaces.reduce((sum, surface) => sum + surface.occupiedFraction, 0)
}`,
    checks: [
      { label: "Models the complete state range", hint: "Declare the active screenState and enumerate closed, compact, expanded, fullscreen, and lock.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+string\\s+screenState\\s*:[\\s\\S]*?readonly\\s+property\\s+list<string>\\s+supportedStates\\s*:\\s*\\[\\s*\"closed\"\\s*,\\s*\"compact\"\\s*,\\s*\"expanded\"\\s*,\\s*\"fullscreen\"\\s*,\\s*\"lock\"\\s*\\]", flags: "m" },
      { label: "Assigns ownership and depth", hint: "Give every composition surface an explicit role, origin, and depthTier.", pattern: "property\\s+list<QtObject>\\s+surfaces\\s*:\\s*\\[[\\s\\S]*?role\\s*:\\s*\"wallpaper\"[\\s\\S]*?origin\\s*:\\s*\"screen\"[\\s\\S]*?depthTier\\s*:\\s*\"deep\"[\\s\\S]*?role\\s*:\\s*\"application-space\"[\\s\\S]*?origin\\s*:\\s*\"workspace\"[\\s\\S]*?depthTier\\s*:\\s*\"contextual\"[\\s\\S]*?role\\s*:\\s*\"persistent-edge\"[\\s\\S]*?origin\\s*:\\s*\"top-edge\"[\\s\\S]*?depthTier\\s*:\\s*\"persistent\"[\\s\\S]*?role\\s*:\\s*\"transient-depth\"[\\s\\S]*?origin\\s*:\\s*\"focused-action\"[\\s\\S]*?depthTier\\s*:\\s*\"contextual\"[\\s\\S]*?role\\s*:\\s*\"focus-layer\"[\\s\\S]*?origin\\s*:\\s*\"keyboard-navigation\"[\\s\\S]*?depthTier\\s*:\\s*\"deep\"[\\s\\S]*?role\\s*:\\s*\"modal-layer\"[\\s\\S]*?origin\\s*:\\s*\"modal-trigger\"[\\s\\S]*?depthTier\\s*:\\s*\"modal\"", flags: "m" },
      { label: "Derives negative space", hint: "Compute reservedNegativeSpace by reducing the occupied fractions instead of asserting a spare-space value.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+real\\s+reservedNegativeSpace\\s*:\\s*1\\s*-\\s*surfaces\\.reduce\\s*\\(\\s*\\(sum\\s*,\\s*surface\\)\\s*=>\\s*sum\\s*\\+\\s*surface\\.occupiedFraction\\s*,\\s*0\\s*\\)", flags: "m" },
    ],
    rules: ["Represent wallpaper, workspace, edges, transient depth, focus, and modal UI in one surfaces list.", "Name the origin and depthTier of every surface so its ownership remains visible.", "Derive reservedNegativeSpace from occupiedFraction values rather than choosing it independently."],
    explanation: ["Screen topology is the arrangement and ownership of surfaces across the whole display. Treating wallpaper, application space, edges, and overlays as one composition preserves hierarchy when the shell changes state.", "The surfaces list stores a role, origin, depthTier, and occupiedFraction for each participant. screenState selects the current map, while reservedNegativeSpace reduces the list into a measurable consequence of those choices.", "An isolated card crop conceals collisions and makes empty areas look accidental. In real screenshots, the failure appears as unrelated islands, ambiguous popout origins, or a layout that loses its hierarchy in fullscreen."],
  },
  "canon-common-ground": {
    starter: `import QtQml

QtObject {
    property color panelColor: "#292331"
    property color accentColor: "#b7f397"
    property int cornerRadius: 20
    property bool usesBlur: true
    property bool looksLikeEnd4: true
    property string screenshotMood: "futuristic"
    readonly property string visualIdentity: looksLikeEnd4
        ? "canon-matched"
        : "custom"
}`,
    solution: `import QtQml

QtObject {
    property bool servicesDriveState: true
    property int implementedDepthTiers: 3
    property bool semanticMotionPresent: true
    property bool connectedSurfacesPresent: true
    property bool stableActionsPresent: true
    property bool perScreenScopePresent: true

    readonly property bool stateIsServiceDerived: servicesDriveState
    readonly property int depthTierCount: implementedDepthTiers
    readonly property bool motionIsSemantic: semanticMotionPresent
    readonly property bool topologyIsConnected: connectedSurfacesPresent
    readonly property bool actionsRemainStable: stableActionsPresent
    readonly property bool scopeIsPerScreen: perScreenScopePresent

    readonly property bool honoursCanon: stateIsServiceDerived
        && depthTierCount >= 3
        && motionIsSemantic
        && topologyIsConnected
        && actionsRemainStable
        && scopeIsPerScreen
}`,
    checks: [
      { label: "Records implementation evidence", hint: "Describe service state, depth, motion, topology, actions, and screen scope with typed inputs.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+bool\\s+servicesDriveState\\s*:[\\s\\S]*?property\\s+int\\s+implementedDepthTiers\\s*:[\\s\\S]*?property\\s+bool\\s+semanticMotionPresent\\s*:[\\s\\S]*?property\\s+bool\\s+connectedSurfacesPresent\\s*:[\\s\\S]*?property\\s+bool\\s+stableActionsPresent\\s*:[\\s\\S]*?property\\s+bool\\s+perScreenScopePresent\\s*:", flags: "m" },
      { label: "Exposes shared canon roles", hint: "Translate the evidence into readonly architecture and interaction principles.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+stateIsServiceDerived\\s*:\\s*servicesDriveState[\\s\\S]*?readonly\\s+property\\s+int\\s+depthTierCount\\s*:\\s*implementedDepthTiers[\\s\\S]*?readonly\\s+property\\s+bool\\s+motionIsSemantic\\s*:\\s*semanticMotionPresent[\\s\\S]*?readonly\\s+property\\s+bool\\s+topologyIsConnected\\s*:\\s*connectedSurfacesPresent[\\s\\S]*?readonly\\s+property\\s+bool\\s+actionsRemainStable\\s*:\\s*stableActionsPresent[\\s\\S]*?readonly\\s+property\\s+bool\\s+scopeIsPerScreen\\s*:\\s*perScreenScopePresent", flags: "m" },
      { label: "Requires every shared truth", hint: "Derive honoursCanon from all six principles and require at least three depth tiers.", pattern: "readonly\\s+property\\s+bool\\s+honoursCanon\\s*:\\s*stateIsServiceDerived\\s*&&\\s*depthTierCount\\s*>=\\s*3\\s*&&\\s*motionIsSemantic\\s*&&\\s*topologyIsConnected\\s*&&\\s*actionsRemainStable\\s*&&\\s*scopeIsPerScreen", flags: "m" },
    ],
    rules: ["Record observable implementation evidence instead of visual resemblance to either reference shell.", "Require at least three meaningful depth tiers before claiming progressive depth.", "Make honoursCanon depend on service-derived state, semantic motion, connected topology, stable actions, and per-screen scope together."],
    explanation: ["A design canon is a set of durable principles behind a recognizable body of work. End-4 and Caelestia share behavioural truths that remain useful even when their colours, shapes, and visual identities change.", "CanonPrinciples uses implementation inputs such as servicesDriveState and semanticMotionPresent, then exposes readonly roles including stateIsServiceDerived and motionIsSemantic. honoursCanon combines every role and verifies that depthTierCount demonstrates progressive depth, meaning detail is revealed through intentional layers.", "A screenshot copy can reproduce blur and corner radii while omitting live state, stable actions, or screen-aware behaviour. You can recognize the failure when the shell looks familiar at rest but becomes incoherent as services update or surfaces open."],
  },
  "distinct-canon-lenses": {
    starter: `import QtQml

QtObject {
    property bool useEnd4Cards: true
    property bool useCaelestiaEdges: true
    property bool useExpressiveMotion: true
    property bool useMinimalMotion: true
    property string cardShape: "layered"
    property string edgeShape: "continuous"
    readonly property string direction: useEnd4Cards
        && useCaelestiaEdges
        ? "both"
        : "undecided"
}`,
    solution: `import QtQml

QtObject {
    readonly property string dominantLens: "caelestia-edge-continuity"
    readonly property string topology: "connected-edge"
    readonly property string density: "restrained"
    readonly property string microinteraction: "quiet-continuous"
    readonly property string screenEdgeContinuity: "primary"
    readonly property string negativeSpacePolicy: "protected"
    readonly property string implementationCost: "moderate"

    property list<string> subordinateInfluences: [
        "subordinate:end4-progressive-depth",
        "subordinate:end4-expressive-microinteraction"
    ]

    readonly property bool hasSingleDominantLens:
        dominantLens === "caelestia-edge-continuity"
        || dominantLens === "end4-layered-utility"
    readonly property bool isCoherent: hasSingleDominantLens && subordinateInfluences.length > 0 && subordinateInfluences.filter(trait => trait.startsWith("subordinate:")).length === subordinateInfluences.length
}`,
    checks: [
      { label: "Chooses one dominant lens", hint: "Name exactly one supported canon lens and encode its topology, density, continuity, and cost roles.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+dominantLens\\s*:\\s*\"(?:caelestia-edge-continuity|end4-layered-utility)\"[\\s\\S]*?readonly\\s+property\\s+string\\s+topology\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+density\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+microinteraction\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+screenEdgeContinuity\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+negativeSpacePolicy\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+implementationCost\\s*:", flags: "m" },
      { label: "Labels borrowed traits subordinate", hint: "Store the other lens's compatible influences in a typed list and prefix each with subordinate:.", pattern: "property\\s+list<string>\\s+subordinateInfluences\\s*:\\s*\\[\\s*\"subordinate:end4-progressive-depth\"\\s*,\\s*\"subordinate:end4-expressive-microinteraction\"\\s*\\]", flags: "m" },
      { label: "Computes coherence", hint: "Accept only a supported dominant lens and verify that every borrowed trait is explicitly subordinate.", pattern: "readonly\\s+property\\s+bool\\s+hasSingleDominantLens\\s*:\\s*dominantLens\\s*===\\s*\"caelestia-edge-continuity\"\\s*\\|\\|\\s*dominantLens\\s*===\\s*\"end4-layered-utility\"[\\s\\S]*?readonly\\s+property\\s+bool\\s+isCoherent\\s*:\\s*hasSingleDominantLens\\s*&&\\s*subordinateInfluences\\.length\\s*>\\s*0\\s*&&\\s*subordinateInfluences\\.filter\\s*\\(trait\\s*=>\\s*trait\\.startsWith\\s*\\(\\s*\"subordinate:\"\\s*\\)\\s*\\)\\.length\\s*===\\s*subordinateInfluences\\.length", flags: "m" },
    ],
    rules: ["Declare either Caelestia edge continuity or End-4 layered utility as the single dominant lens.", "Evaluate topology, density, microinteraction, edge continuity, negative space, and implementation cost as named roles.", "Prefix every borrowed trait with subordinate: so the second lens cannot become an equal-weight floor plan."],
    explanation: ["A canon lens is the dominant set of design priorities used to judge later choices. Edge continuity means surfaces visibly belong to a screen boundary, while layered utility prioritizes expressive depth and dense access to tools.", "LensDecision names dominantLens and records the chosen topology, density, microinteraction, continuity, negative-space policy, and implementation cost. subordinateInfluences contains compatible lessons from the other canon, and isCoherent checks that every borrowed trait remains explicitly secondary.", "Equal-weight mixing creates two shape systems and two motion vocabularies with no governing idea. The failure is visible when cards and edge surfaces compete for ownership or similar actions behave as though they came from different shells."],
  },
  "card-soup-critique-boss": {
    starter: `import QtQml

QtObject {
    property bool everySurfaceIsFloatingCard: true
    property bool blurAppliedUniversally: true
    property bool popoutsHaveNoOwner: true
    property bool motionIsDecorativeOnly: true
    property color refreshedAccent: "#a9f28f"
    property int universalRadius: 24
    property string proposedFix: "repaint"
    readonly property bool paletteUpdated: refreshedAccent
        !== "#8d7cff"
}`,
    solution: `import QtQml

QtObject {
    property bool everySurfaceIsFloatingCard: false
    property bool blurAppliedUniversally: false
    property bool popoutsHaveNoOwner: false
    property bool motionIsDecorativeOnly: false

    readonly property string topology: "connected-edge-with-owned-depth"
    readonly property string retainedFlourishPurpose:
        "motion preserves origin and confirms state change"

    readonly property bool rejectsFloatingUniformity:
        !everySurfaceIsFloatingCard
    readonly property bool rejectsUniversalBlur:
        !blurAppliedUniversally
    readonly property bool rejectsOwnerlessPopouts:
        !popoutsHaveNoOwner
    readonly property bool rejectsDecorativeMotion:
        !motionIsDecorativeOnly

    readonly property bool passesCardSoupGate:
        rejectsFloatingUniformity
        && rejectsUniversalBlur
        && rejectsOwnerlessPopouts
        && rejectsDecorativeMotion
    readonly property string verdict:
        passesCardSoupGate ? "pass" : "reject"
}`,
    checks: [
      { label: "Repairs all four anti-patterns", hint: "Set the typed audit inputs to a composition without universal cards, blur, ownerless popouts, or decorative-only motion.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+bool\\s+everySurfaceIsFloatingCard\\s*:\\s*false[\\s\\S]*?property\\s+bool\\s+blurAppliedUniversally\\s*:\\s*false[\\s\\S]*?property\\s+bool\\s+popoutsHaveNoOwner\\s*:\\s*false[\\s\\S]*?property\\s+bool\\s+motionIsDecorativeOnly\\s*:\\s*false", flags: "m" },
      { label: "Computes every rejection gate", hint: "Derive one readonly rejection gate from each card-soup input.", pattern: "readonly\\s+property\\s+bool\\s+rejectsFloatingUniformity\\s*:\\s*!everySurfaceIsFloatingCard[\\s\\S]*?readonly\\s+property\\s+bool\\s+rejectsUniversalBlur\\s*:\\s*!blurAppliedUniversally[\\s\\S]*?readonly\\s+property\\s+bool\\s+rejectsOwnerlessPopouts\\s*:\\s*!popoutsHaveNoOwner[\\s\\S]*?readonly\\s+property\\s+bool\\s+rejectsDecorativeMotion\\s*:\\s*!motionIsDecorativeOnly", flags: "m" },
      { label: "Ties repair to a verdict", hint: "Name the replacement topology, combine every gate, and derive pass or reject from the result.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+topology\\s*:\\s*\"connected-edge-with-owned-depth\"[\\s\\S]*?readonly\\s+property\\s+bool\\s+passesCardSoupGate\\s*:\\s*rejectsFloatingUniformity\\s*&&\\s*rejectsUniversalBlur\\s*&&\\s*rejectsOwnerlessPopouts\\s*&&\\s*rejectsDecorativeMotion[\\s\\S]*?readonly\\s+property\\s+string\\s+verdict\\s*:\\s*passesCardSoupGate\\s*\\?\\s*\"pass\"\\s*:\\s*\"reject\"", flags: "m" },
    ],
    rules: ["Reject floating-card uniformity, universal blur, ownerless popouts, and decorative-only motion through separate computed gates.", "Name the connected-edge-with-owned-depth topology that structurally replaces the rejected composition.", "Derive verdict from every rejection gate so a palette change alone can never pass the audit."],
    explanation: ["Card soup is a composition where nearly every function becomes an interchangeable floating rounded rectangle. A useful critique tests topology, ownership, depth, and behaviour before discussing polish because those structural decisions determine whether the shell has an idea.", "CardSoupAudit takes four typed anti-pattern inputs and negates each into a readonly rejection gate. passesCardSoupGate combines those gates, topology names the repair direction, and verdict converts the full audit into a machine-readable pass or reject.", "Recolouring a structurally generic shell leaves its universal blur, ownerless popouts, and arbitrary motion intact. You can recognize the failure when removing labels makes surfaces indistinguishable or when an overlay seems to emerge from nowhere."],
  },
  "dominant-topology-choice": {
    starter: `import QtQml

QtObject {
    id: topologyPolicy

    property int productDensity: 6
    property int gestureDensity: 8
    property bool needsScreenEdgeContinuity: true
    property bool needsWindowLayering: true
    property bool prefersContinuousJoins: true

    property string topology: "hybrid"
}`,
    solution: `import QtQml

QtObject {
    id: topologyPolicy

    property int productDensity: 6
    property int gestureDensity: 8
    property bool needsScreenEdgeContinuity: true
    property bool needsWindowLayering: false
    property bool prefersContinuousJoins: true
    property bool requiresFocusIsolation: false
    property bool complexMasksAffordable: true
    property int implementationBudget: 7

    readonly property int connectedScore: gestureDensity
        + (needsScreenEdgeContinuity ? 3 : 0)
        + (prefersContinuousJoins ? 2 : 0)
        - (needsWindowLayering ? 2 : 0)
        - (requiresFocusIsolation ? 1 : 0)
        + (complexMasksAffordable ? 1 : 0)
    readonly property string dominantTopology: connectedScore >= productDensity
        && implementationBudget >= 5 ? "connected-edge" : "layered-sheets"
    readonly property string signatureIdea: "Every contextual surface grows visibly from its owning screen edge."
    readonly property bool hasSingleLeader: (dominantTopology === "layered-sheets" || dominantTopology === "connected-edge")
}`,
    checks: [
      { label: "Compare the topology inputs", hint: "Use typed density, continuity, window, join, focus, mask, and budget inputs to derive the leader.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+int\\s+productDensity\\s*:[\\s\\S]*?property\\s+int\\s+gestureDensity\\s*:[\\s\\S]*?property\\s+bool\\s+needsScreenEdgeContinuity\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+connectedScore\\s*:", flags: "m" },
      { label: "Name one signature idea", hint: "Give the chosen grammar one concrete sentence describing its defining spatial move.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+signatureIdea\\s*:\\s*\"[^\"]+\\.[\"]", flags: "m" },
      { label: "Reject ambiguous leadership", hint: "Derive the leadership gate from the two permitted dominant topology names, excluding hybrid and empty values.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+dominantTopology\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+hasSingleLeader\\s*:\\s*\\(dominantTopology\\s*===\\s*\"layered-sheets\"\\s*\\|\\|\\s*dominantTopology\\s*===\\s*\"connected-edge\"\\)", flags: "m" },
    ],
    rules: ["Score the competing geometries from explicit product and implementation constraints.", "Choose either layered-sheets or connected-edge as the sole dominantTopology value.", "Describe the winning grammar with one signatureIdea sentence that names its spatial behavior."],
    explanation: ["Topology is the dominant spatial grammar that explains where surfaces originate and how they relate in depth. A shell needs one leader so separate modules still feel like parts of the same architecture.", "TopologyPolicy turns design judgment into typed inputs such as gestureDensity, needsScreenEdgeContinuity, and implementationBudget. connectedScore selects dominantTopology, while hasSingleLeader accepts only layered-sheets or connected-edge and signatureIdea records the defining move.", "The dangerous failure is a topology value of hybrid with no hierarchy between its influences. You can recognize it when neighboring panels invent unrelated corners, joins, and opening directions while every choice is defended as part of the mix."],
  },
  "surface-depth-map": {
    starter: `import QtQml

QtObject {
    id: depthLadder

    property list<QtObject> tiers: [
        QtObject { property string name: "persistent"; property int elevation: 4; property real tone: 0.2; property bool trapsFocus: false },
        QtObject { property string name: "contextual"; property int elevation: 4; property real tone: 0.2; property bool trapsFocus: false },
        QtObject { property string name: "deep"; property int elevation: 4; property real tone: 0.2; property bool trapsFocus: false },
        QtObject { property string name: "modal"; property int elevation: 4; property real tone: 0.2; property bool trapsFocus: true },
        QtObject { property string name: "lock"; property int elevation: 4; property real tone: 0.2; property bool trapsFocus: true }
    ]
}`,
    solution: `import QtQml

QtObject {
    id: depthLadder

    property list<QtObject> tiers: [
        QtObject { property string name: "persistent"; property int elevation: 0; property real tone: 0.08; property bool trapsFocus: false },
        QtObject { property string name: "contextual"; property int elevation: 4; property real tone: 0.18; property bool trapsFocus: false },
        QtObject { property string name: "deep"; property int elevation: 12; property real tone: 0.34; property bool trapsFocus: false },
        QtObject { property string name: "modal"; property int elevation: 24; property real tone: 0.58; property bool trapsFocus: true },
        QtObject { property string name: "lock"; property int elevation: 40; property real tone: 0.82; property bool trapsFocus: true }
    ]

    readonly property bool isProgressive:
        tiers[0].elevation < tiers[1].elevation
        && tiers[1].elevation < tiers[2].elevation
        && tiers[2].elevation < tiers[3].elevation
        && tiers[3].elevation < tiers[4].elevation
        && tiers[0].tone < tiers[1].tone
        && tiers[1].tone < tiers[2].tone
        && tiers[2].tone < tiers[3].tone
        && tiers[3].tone < tiers[4].tone
}`,
    checks: [
      { label: "Build five distinct depth bands", hint: "Assign strictly increasing elevation and tone values from persistent through lock.", pattern: "QtObject\\s*\\{[\\s\\S]*?name\\s*:\\s*\"persistent\"[\\s\\S]*?elevation\\s*:\\s*0[\\s\\S]*?tone\\s*:\\s*0\\.08[\\s\\S]*?name\\s*:\\s*\"contextual\"[\\s\\S]*?elevation\\s*:\\s*4[\\s\\S]*?tone\\s*:\\s*0\\.18[\\s\\S]*?name\\s*:\\s*\"deep\"[\\s\\S]*?elevation\\s*:\\s*12[\\s\\S]*?tone\\s*:\\s*0\\.34[\\s\\S]*?name\\s*:\\s*\"modal\"[\\s\\S]*?elevation\\s*:\\s*24[\\s\\S]*?tone\\s*:\\s*0\\.58[\\s\\S]*?name\\s*:\\s*\"lock\"[\\s\\S]*?elevation\\s*:\\s*40[\\s\\S]*?tone\\s*:\\s*0\\.82", flags: "m" },
      { label: "Reserve focus trapping for consequence", hint: "Keep persistent, contextual, and deep tiers non-trapping; modal and lock tiers must trap focus.", pattern: "property\\s+list<QtObject>\\s+tiers\\s*:\\s*\\[[\\s\\S]*?name\\s*:\\s*\"persistent\"[\\s\\S]*?trapsFocus\\s*:\\s*false[\\s\\S]*?name\\s*:\\s*\"contextual\"[\\s\\S]*?trapsFocus\\s*:\\s*false[\\s\\S]*?name\\s*:\\s*\"deep\"[\\s\\S]*?trapsFocus\\s*:\\s*false[\\s\\S]*?name\\s*:\\s*\"modal\"[\\s\\S]*?trapsFocus\\s*:\\s*true[\\s\\S]*?name\\s*:\\s*\"lock\"[\\s\\S]*?trapsFocus\\s*:\\s*true", flags: "m" },
      { label: "Prove the ladder progresses", hint: "Derive isProgressive by comparing every adjacent elevation and tone pair.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+isProgressive\\s*:[\\s\\S]*?tiers\\[0\\]\\.elevation\\s*<\\s*tiers\\[1\\]\\.elevation[\\s\\S]*?tiers\\[3\\]\\.elevation\\s*<\\s*tiers\\[4\\]\\.elevation[\\s\\S]*?tiers\\[0\\]\\.tone\\s*<\\s*tiers\\[1\\]\\.tone[\\s\\S]*?tiers\\[3\\]\\.tone\\s*<\\s*tiers\\[4\\]\\.tone", flags: "m" },
    ],
    rules: ["Order persistent, contextual, deep, modal, and lock tiers by increasing elevation and tone.", "Trap focus only in the modal and lock tiers where interaction outside the surface is forbidden.", "Compute isProgressive from every adjacent elevation and tone comparison instead of asserting the verdict."],
    explanation: ["A depth ladder assigns a recognizable level of consequence to every shell surface before its content is read. Progressive depth means each successive tier becomes unmistakably more prominent and restrictive.", "DepthLadder stores five typed QtObject entries in tiers, each carrying name, elevation, tone, and trapsFocus. The isProgressive property proves that both elevation and tone increase between every neighboring pair.", "A flat ladder makes a harmless popout, a modal prompt, and the lock surface look interchangeable. In code it appears as repeated elevation and tone values; in a screenshot it appears as a pile of similarly styled cards with no obvious focus order."],
  },
  "join-corner-ownership": {
    starter: `import QtQuick
import Quickshell

PanelWindow {
    id: joinWindow
    width: 360
    height: 280
    color: "transparent"

    Rectangle {
        id: edgeBar
        width: 56
        height: parent.height
        radius: 18
        color: "#24212b"
    }

    Rectangle {
        id: loosePopout
        x: 56
        width: 304
        height: parent.height
        radius: 10
        color: "#302b39"
    }

    mask: Region { item: edgeBar }
}`,
    solution: `import QtQuick
import Quickshell

PanelWindow {
    id: joinWindow
    width: unionSurface.width
    height: unionSurface.height
    color: "transparent"
    exclusiveZone: edgeBar.width

    anchors {
        top: true
        left: true
    }

    QtObject {
        id: seamPolicy
        property real openProgress: 0.75
        readonly property real baseRadius: 18
        readonly property real joinRadius: baseRadius * (1 - openProgress)
    }

    mask: Region { item: unionSurface }

    Item {
        id: unionSurface
        width: edgeBar.width + attachedPopout.width
        height: 280

        Rectangle {
            id: edgeBar
            width: 56
            height: parent.height
            radius: seamPolicy.joinRadius
            color: "#24212b"
        }

        Rectangle {
            id: attachedPopout
            x: edgeBar.width
            width: 304 * seamPolicy.openProgress
            height: parent.height
            radius: seamPolicy.joinRadius
            color: "#302b39"
        }
    }
}`,
    checks: [
      { label: "Derive one seam policy", hint: "Place openProgress, baseRadius, and the derived joinRadius in one shared QtObject.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?id\\s*:\\s*seamPolicy[\\s\\S]*?property\\s+real\\s+openProgress\\s*:[\\s\\S]*?readonly\\s+property\\s+real\\s+baseRadius\\s*:[\\s\\S]*?readonly\\s+property\\s+real\\s+joinRadius\\s*:\\s*baseRadius\\s*\\*\\s*\\(1\\s*-\\s*openProgress\\)", flags: "m" },
      { label: "Make both pieces obey the seam", hint: "Bind the edge bar and attached popout radii to the same joinRadius role.", pattern: "Item\\s*\\{[\\s\\S]*?id\\s*:\\s*unionSurface[\\s\\S]*?Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*edgeBar[\\s\\S]*?radius\\s*:\\s*seamPolicy\\.joinRadius[\\s\\S]*?Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*attachedPopout[\\s\\S]*?radius\\s*:\\s*seamPolicy\\.joinRadius", flags: "m" },
      { label: "Mask the complete union", hint: "Point the PanelWindow Region at the container spanning both cooperating rectangles.", pattern: "PanelWindow\\s*\\{[\\s\\S]*?mask\\s*:\\s*Region\\s*\\{\\s*item\\s*:\\s*unionSurface\\s*\\}[\\s\\S]*?Item\\s*\\{[\\s\\S]*?id\\s*:\\s*unionSurface", flags: "m" },
    ],
    rules: ["Drive both adjoining corner radii from seamPolicy.openProgress.", "Place the edge bar and attached popout inside one unionSurface whose width follows both pieces.", "Bind the PanelWindow input Region to unionSurface so input geometry changes with the visible join."],
    explanation: ["Corner ownership decides which adjoining surface controls a seam and how that seam changes while opening. A shared seam prevents the shell from briefly revealing gaps or doubled curves during reversible motion.", "seamPolicy converts openProgress into one joinRadius, and both edgeBar and attachedPopout bind to that role. unionSurface grows with the two pieces, while the PanelWindow mask uses a Region whose item is that same container.", "Independent radii drift apart at intermediate animation frames, especially under scaling or reversal. The defect appears as a bright slit, doubled border, or clickable transparent area beside an otherwise connected surface."],
  },
  "owned-popout-foundry-boss": {
    starter: `import QtQuick
import Quickshell

Item {
    id: floatingPanel
    x: 420
    y: 180
    width: 320
    height: 240

    Rectangle {
        anchors.fill: parent
        radius: 20
        color: "#302b39"
    }
}`,
    solution: `import QtQuick
import Quickshell

Item {
    id: ownedPopout

    required property Item trigger
    required property ShellScreen modelData

    QtObject {
        id: attachmentPolicy
        readonly property string dominantTopology: "connected-edge"
        readonly property int surfaceWidth: 320
        readonly property int surfaceHeight: 240
        readonly property int cornerRadius: 20
        readonly property color surface: "#302b39"
    }

    readonly property point origin: trigger.mapToItem(ownedPopout.parent, 0, trigger.height)
    readonly property bool isAttached: trigger !== null && origin.x === x && origin.y === y

    x: origin.x
    y: origin.y
    implicitWidth: attachmentPolicy.surfaceWidth
    implicitHeight: attachmentPolicy.surfaceHeight
    activeFocusOnTab: true

    function dismiss(): void {
        trigger.forceActiveFocus()
    }

    Keys.onEscapePressed: dismiss()

    Rectangle {
        anchors.fill: parent
        radius: attachmentPolicy.cornerRadius
        color: attachmentPolicy.surface
    }
}`,
    checks: [
      { label: "Inject the owner and screen", hint: "Require both the trigger Item and the ShellScreen contract on the reusable popout.", pattern: "Item\\s*\\{[\\s\\S]*?id\\s*:\\s*ownedPopout[\\s\\S]*?required\\s+property\\s+Item\\s+trigger[\\s\\S]*?required\\s+property\\s+ShellScreen\\s+modelData", flags: "m" },
      { label: "Derive attachment geometry", hint: "Compute origin with trigger.mapToItem and bind both x and y to that point.", pattern: "Item\\s*\\{[\\s\\S]*?readonly\\s+property\\s+point\\s+origin\\s*:\\s*trigger\\.mapToItem\\([^\\)]*ownedPopout\\.parent[^\\)]*trigger\\.height\\)[\\s\\S]*?x\\s*:\\s*origin\\.x[\\s\\S]*?y\\s*:\\s*origin\\.y", flags: "m" },
      { label: "Return focus on dismissal", hint: "Implement dismiss as an explicit ownership handoff back to the injected trigger.", pattern: "Item\\s*\\{[\\s\\S]*?function\\s+dismiss\\s*\\(\\s*\\)\\s*:\\s*void\\s*\\{\\s*trigger\\.forceActiveFocus\\(\\)\\s*\\}", flags: "m" },
    ],
    rules: ["Require the trigger Item and ShellScreen instead of consulting a free-floating global owner.", "Derive the popout origin and geometry from the injected trigger and attachmentPolicy roles.", "Restore focus to trigger inside dismiss() so visual and behavioral ownership agree."],
    explanation: ["An owned popout has a spatial and behavioral relationship with the control that summoned it. Injection means that owner and screen are supplied explicitly, preventing the component from silently attaching itself to unrelated global state.", "OwnedPopout requires trigger and modelData, then derives origin through trigger.mapToItem and binds x and y to the result. attachmentPolicy carries the dominant topology and visual roles, while dismiss() returns keyboard focus with trigger.forceActiveFocus().", "A free-floating panel can be moved anywhere without changing its meaning because its coordinates reveal no owner. The failure is visible when a popout points at one control but closes into another focus target, or when hard-coded coordinates detach it after a screen or layout change."],
  },
  "semantic-palette-ecosystem": {
    starter: `pragma Singleton
import QtQml

QtObject {
    property color surface: "#292331"
    property color randomAccent1: "#ff00ff"
    property color randomAccent2: "#00ffff"
    property color faintBorder: Qt.rgba(1, 1, 1, 0.12)
    property color translucentLayer: Qt.rgba(0.16, 0.14, 0.19, 0.6)
    property color warningText: "#ff6644"
}`,
    solution: `pragma Singleton
import QtQml

QtObject {
    property bool isDark: true

    readonly property color background: isDark ? "#151219" : "#f7f4fb"
    readonly property color surface: isDark ? "#292331" : "#ffffff"
    readonly property color surfaceHigh: isDark ? "#373040" : "#ebe5f0"
    readonly property color onBackground: isDark ? "#f8f1fb" : "#211d24"
    readonly property color onSurface: isDark ? "#f5efff" : "#29232e"
    readonly property color accent: isDark ? "#b7f397" : "#376f18"
    readonly property color onAccent: isDark ? "#183800" : "#ffffff"
    readonly property color outline: isDark ? "#958c9d" : "#746c78"
    readonly property color scrim: isDark ? "#b3000000" : "#99000000"
    readonly property color success: isDark ? "#8fe388" : "#267332"
    readonly property color error: isDark ? "#ffb4ab" : "#ba1a1a"
}`,
    checks: [
      { label: "Switch the foundation roles", hint: "Make background and surface typed readonly roles derived from the same isDark input.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+bool\\s+isDark\\s*:[\\s\\S]*?readonly\\s+property\\s+color\\s+background\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+surface\\s*:\\s*isDark\\s*\\?", flags: "m" },
      { label: "Pair surfaces with foregrounds", hint: "Provide onBackground, onSurface, accent, and onAccent roles that all respond to isDark.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+onBackground\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+onSurface\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+accent\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+onAccent\\s*:\\s*isDark\\s*\\?", flags: "m" },
      { label: "Complete the semantic ecosystem", hint: "Add outline, scrim, success, and error as readonly roles with light and dark outcomes.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+outline\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+scrim\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+success\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+error\\s*:\\s*isDark\\s*\\?", flags: "m" },
    ],
    rules: ["Derive every semantic colour role from the single isDark palette input.", "Pair backgrounds, surfaces, and accents with explicit readable on-colour roles.", "Name status, boundary, and modal colours by purpose instead of adding miscellaneous swatches."],
    explanation: ["A semantic palette names colours by responsibility, allowing the shell to change appearance without losing meaning. Like an ecosystem, its background, surface, foreground, accent, boundary, and status roles each occupy a distinct niche.", "The isDark input selects both palettes through readonly properties such as background, onSurface, accent, scrim, success, and error. A component can bind to those names without knowing which literal colour is currently active.", "A lone dark surface surrounded by arbitrary alpha values and bright swatches cannot describe depth or guarantee readable foregrounds. You can recognize this failure when changing the wallpaper or theme demands hunting through visual components for colour literals."],
  },
  "tonal-depth-ladder": {
    starter: `pragma Singleton
import QtQml

QtObject {
    property color persistentSurface: "#292331"
    property color contextualSurface: "#292331"
    property color deepSurface: "#292331"
    property color modalSurface: "#292331"

    property int universalBorderWidth: 1
    property real universalOpacity: 0.6
    property color universalBorder: "#66ffffff"
}`,
    solution: `pragma Singleton
import QtQml

QtObject {
    property bool isDark: true
    property bool boundariesNeedOutline: false
    property bool modalActive: false

    readonly property color background: isDark ? "#17141b" : "#f7f4f9"
    readonly property color surfaceContainerLow: isDark ? Qt.lighter(background, 1.06) : Qt.darker(background, 1.02)
    readonly property color surfaceContainer: isDark ? Qt.lighter(background, 1.12) : Qt.darker(background, 1.04)
    readonly property color surfaceContainerHigh: isDark ? Qt.lighter(background, 1.18) : Qt.darker(background, 1.07)
    readonly property color surfaceContainerHighest: isDark ? Qt.lighter(background, 1.24) : Qt.darker(background, 1.10)

    readonly property color outline: boundariesNeedOutline
        ? (isDark ? "#958c9d" : "#746c78") : "transparent"
    readonly property color scrim: modalActive ? "#99000000" : "transparent"
    readonly property real shadowOpacity: modalActive ? 0.28 : 0.0
}`,
    checks: [
      { label: "Compute the tonal ladder", hint: "Derive all four ordered surface-container roles from background with Qt.lighter or Qt.darker.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+surfaceContainerLow\\s*:[^\\n]*(?:Qt\\.lighter|Qt\\.darker)\\s*\\(\\s*background[\\s\\S]*?readonly\\s+property\\s+color\\s+surfaceContainer\\s*:[^\\n]*(?:Qt\\.lighter|Qt\\.darker)\\s*\\(\\s*background[\\s\\S]*?readonly\\s+property\\s+color\\s+surfaceContainerHigh\\s*:[^\\n]*(?:Qt\\.lighter|Qt\\.darker)\\s*\\(\\s*background[\\s\\S]*?readonly\\s+property\\s+color\\s+surfaceContainerHighest\\s*:[^\\n]*(?:Qt\\.lighter|Qt\\.darker)\\s*\\(\\s*background", flags: "m" },
      { label: "Make outlines conditional", hint: "Derive the outline role from boundariesNeedOutline and fall back to transparent.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+outline\\s*:\\s*boundariesNeedOutline\\s*\\?[\\s\\S]*?:\\s*\"transparent\"", flags: "m" },
      { label: "Reserve focus effects for modals", hint: "Let modalActive control both a dedicated scrim role and shadow opacity.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+scrim\\s*:\\s*modalActive\\s*\\?[\\s\\S]*?readonly\\s+property\\s+real\\s+shadowOpacity\\s*:\\s*modalActive\\s*\\?", flags: "m" },
    ],
    rules: ["Derive four ordered surface-container tones from one background role.", "Expose an outline only when boundariesNeedOutline requests a visible separator.", "Activate scrim and shadow roles only while modalActive changes the focus hierarchy."],
    explanation: ["A tonal depth ladder distinguishes elevation through related surface colours before effects are introduced. It gives persistent, contextual, deep, and modal content predictable places in the shell hierarchy.", "surfaceContainerLow through surfaceContainerHighest use Qt.lighter and Qt.darker with background as their shared source. boundariesNeedOutline gates outline, while modalActive separately enables scrim and shadowOpacity for a genuine focus change.", "Applying the same translucent fill and border everywhere creates card soup, where every region appears to float at the same elevation. It is visible when panels, menus, and ordinary rows all have identical edges despite serving different layers."],
  },
  "hostile-wallpaper-defense": {
    starter: `import QtQml

QtObject {
    property color materialColor: "#292331"
    property real materialOpacity: 0.5
    property color textColor: "#ffffff"
    property color trayIconColor: "#ffffff"
    property color focusRingColor: "#b7f397"
    property color errorColor: "#ffb4ab"
    property real disabledOpacity: 0.38
}`,
    solution: `import QtQml

QtObject {
    property real wallpaperLuminance: 0.5
    property real wallpaperVibrancy: 0.4
    property bool wallpaperIsBusy: false
    property color accentColor: "#b7f397"

    readonly property bool hostileWallpaper: wallpaperLuminance > 0.6
        || wallpaperVibrancy > 0.75 || wallpaperIsBusy
    readonly property real materialOpacity: hostileWallpaper ? 0.96 : 0.72
    readonly property color materialColor: hostileWallpaper ? "#211d25" : "#292331"
    readonly property color onMaterialColor: hostileWallpaper ? "#ffffff" : "#f5efff"
    readonly property color focusRingColor: hostileWallpaper ? "#ffffff" : accentColor
    readonly property color errorColor: hostileWallpaper ? "#ffd9d4" : "#ffb4ab"
    readonly property real disabledOpacity: hostileWallpaper ? 0.72 : 0.48
}`,
    checks: [
      { label: "Judge wallpaper hostility", hint: "Compute hostileWallpaper from measured luminance and busy or vibrant content instead of setting it manually.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+real\\s+wallpaperLuminance\\s*:[\\s\\S]*?property\\s+bool\\s+wallpaperIsBusy\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+hostileWallpaper\\s*:\\s*wallpaperLuminance\\s*>\\s*0?\\.6[\\s\\S]*?\\|\\|[\\s\\S]*?wallpaperIsBusy", flags: "m" },
      { label: "Raise material protection automatically", hint: "Derive materialOpacity from hostileWallpaper with the safer branch at 0.96.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+real\\s+materialOpacity\\s*:\\s*hostileWallpaper\\s*\\?\\s*0?\\.96\\s*:\\s*0?\\.72", flags: "m" },
      { label: "Protect interactive foreground states", hint: "Give focusRingColor and disabledOpacity explicit hostile-wallpaper branches.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+focusRingColor\\s*:\\s*hostileWallpaper\\s*\\?[\\s\\S]*?readonly\\s+property\\s+real\\s+disabledOpacity\\s*:\\s*hostileWallpaper\\s*\\?", flags: "m" },
    ],
    rules: ["Derive hostileWallpaper from measured luminance, vibrancy, and visual busyness.", "Increase materialOpacity automatically when the wallpaper threatens foreground contrast.", "Provide safe focus, error, and disabled-state roles instead of trusting average wallpaper colour."],
    explanation: ["Wallpaper defense is a presentation policy that reacts when imagery becomes too bright, vibrant, or visually detailed for translucent materials. The shell needs it because average colour alone cannot predict whether small icons and interaction states remain distinguishable.", "wallpaperLuminance, wallpaperVibrancy, and wallpaperIsBusy feed the readonly hostileWallpaper verdict. That verdict raises materialOpacity and selects safer onMaterialColor, focusRingColor, errorColor, and disabledOpacity values.", "A fixed translucent bar may look excellent over one photograph while losing focus rings, error text, or tray icons over another. The defect appears when moving the same shell across wallpapers changes whether essential foreground states can be found."],
  },
  "colour-transition-boss": {
    starter: `import QtQml

QtObject {
    id: themeTransition
    property bool isDark: true
    property color background: "#151219"
    property color surface: "#292331"
    property color onSurface: "#f5efff"
    property real materialOpacity: 0.72

    onIsDarkChanged: {
        background = isDark ? "#151219" : "#f7f4fb"
        surface = isDark ? "#292331" : "#ffffff"
        onSurface = isDark ? "#f5efff" : "#29232e"
    }
}`,
    solution: `import QtQuick
import QtQml

QtObject {
    id: themeTransition

    property bool isDark: true
    property bool privacyContext: false
    property bool authenticationActive: false
    property bool lowPowerMode: false

    readonly property color darkBackground: "#151219"
    readonly property color lightBackground: "#f7f4fb"
    readonly property color darkSurface: "#292331"
    readonly property color lightSurface: "#ffffff"
    readonly property color darkOnSurface: "#f5efff"
    readonly property color lightOnSurface: "#29232e"

    readonly property color background: isDark ? darkBackground : lightBackground
    readonly property color surface: isDark ? darkSurface : lightSurface
    readonly property color onSurface: isDark ? darkOnSurface : lightOnSurface

    readonly property bool useTransparency: !privacyContext
        && !authenticationActive && !lowPowerMode
    readonly property real materialOpacity: useTransparency ? 0.78 : 1.0
    readonly property int transitionDuration: lowPowerMode ? 0 : 160

    property QtObject colourEffect: QtObject {
        property color background: themeTransition.background
        property color surface: themeTransition.surface

        Behavior on background {
            ColorAnimation { duration: themeTransition.transitionDuration }
        }
        Behavior on surface {
            ColorAnimation { duration: themeTransition.transitionDuration }
        }
    }
}`,
    checks: [
      { label: "Flip roles as one palette", hint: "Remove the change handler and derive background, surface, and onSurface directly from isDark.", pattern: "QtObject\\s*\\{(?![\\s\\S]*onIsDarkChanged\\s*:)[\\s\\S]*?readonly\\s+property\\s+color\\s+background\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+surface\\s*:\\s*isDark\\s*\\?[\\s\\S]*?readonly\\s+property\\s+color\\s+onSurface\\s*:\\s*isDark\\s*\\?", flags: "m" },
      { label: "Let safety defeat transparency", hint: "Derive useTransparency from privacy, authentication, and power context, then make the opaque material branch equal 1.0.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+useTransparency\\s*:\\s*!privacyContext\\s*&&\\s*!authenticationActive\\s*&&\\s*!lowPowerMode[\\s\\S]*?readonly\\s+property\\s+real\\s+materialOpacity\\s*:\\s*useTransparency\\s*\\?[^:]+:\\s*1(?:\\.0)?", flags: "m" },
      { label: "Animate coherent colour effects", hint: "Bind an animated background proxy to themeTransition.background and use the shared transitionDuration token.", pattern: "property\\s+QtObject\\s+colourEffect\\s*:\\s*QtObject\\s*\\{[\\s\\S]*?property\\s+color\\s+background\\s*:\\s*themeTransition\\.background[\\s\\S]*?Behavior\\s+on\\s+background\\s*\\{[\\s\\S]*?ColorAnimation\\s*\\{[\\s\\S]*?duration\\s*:\\s*themeTransition\\.transitionDuration", flags: "m" },
    ],
    rules: ["Bind every visible semantic role to the same isDark source instead of assigning roles sequentially.", "Force materialOpacity to full opacity during privacy, authentication, or low-power contexts.", "Animate colour proxies with one short transitionDuration token while leaving safety policy immediate."],
    explanation: ["A coherent theme transition changes semantic roles from one shared state so foreground and background never belong to different palettes. Safety contexts remain immediate because privacy and authentication are requirements, not visual preferences.", "background, surface, and onSurface are readonly bindings driven by the same isDark flip. useTransparency combines privacyContext, authenticationActive, and lowPowerMode, while colourEffect applies ColorAnimation using the shared transitionDuration token.", "Imperatively assigning roles one after another can produce a visible flash of mismatched colours and may expose wallpaper behind a locked surface. The warning signs are an onIsDarkChanged assignment block or any transparency value that ignores authentication and privacy state."],
  },
  "type-role-score": {
    starter: `import QtQuick\n\nColumn {\n    spacing: 8\n\n    Text {\n        text: "Expression Expanse"\n        font.pixelSize: 30\n        font.weight: Font.Bold\n    }\n    Text {\n        text: "Design the shell as a system"\n        font.pixelSize: 18\n        font.weight: Font.Bold\n    }\n    Text {\n        text: "WORKSPACE 4"\n        font.pixelSize: 12\n        font.weight: Font.Bold\n    }\n}`,
    solution: `pragma Singleton\nimport QtQml\n\nQtObject {\n    readonly property int headlineSize: 32\n    readonly property int headlineWeight: Font.DemiBold\n    readonly property real headlineLineHeight: 1.12\n    readonly property int headlineWidthPercent: 100\n    readonly property string headlineOpticalUse: "display"\n    readonly property string headlineContext: "transient-page-heading"\n\n    readonly property int titleSize: 20\n    readonly property int titleWeight: Font.Medium\n\n    readonly property int bodySize: 15\n    readonly property int bodyWeight: Font.Normal\n    readonly property real bodyLineHeight: 1.45\n\n    readonly property int labelSize: 12\n    readonly property int labelWeight: Font.Bold\n    readonly property int labelWidthPercent: 92\n    readonly property string labelContext: "compact-persistent-edge"\n\n    readonly property int numericSize: 15\n    readonly property int numericWeight: Font.Medium\n    readonly property string numericFamily: "monospace"\n\n    readonly property int readingSize: 17\n    readonly property int readingWeight: Font.Normal\n    readonly property real readingLineHeight: 1.6\n\n    readonly property int monospaceSize: 14\n    readonly property int monospaceWeight: Font.Normal\n    readonly property string monospaceFamily: "monospace"\n\n    readonly property int iconSize: 20\n    readonly property int iconWeight: 500\n    readonly property real iconOpticalOffset: -0.5\n}`,
    checks: [
      { label: "Headline role", hint: "Give the headline its own typed size and weight tokens.", pattern: "pragma\\s+Singleton[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+headlineSize\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+headlineWeight\\s*:", flags: "m" },
      { label: "Body and label roles", hint: "Encode body and compact-label typography as separate readonly roles.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+bodySize\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+bodyWeight\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+labelSize\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+labelWeight\\s*:", flags: "m" },
      { label: "Real hierarchy", hint: "Use distinct weights: a demi-bold headline, normal body, and bold compact label.", pattern: "QtObject\\s*\\{[\\s\\S]*?headlineWeight\\s*:\\s*Font\\.DemiBold[\\s\\S]*?bodyWeight\\s*:\\s*Font\\.Normal[\\s\\S]*?labelWeight\\s*:\\s*Font\\.Bold", flags: "m" },
    ],
    rules: ["Assign headline, body, and label distinct size-and-weight combinations.", "Keep the persistent label compact while reserving display scale for transient headings.", "Encode line height, width, optical use, and context as named readonly role tokens."],
    explanation: ["A typographic role is a named bundle of choices for a particular voice, much like a part in an orchestral score. Explicit roles let a shell distinguish a page heading, ordinary prose, compact labels, changing numbers, code, and icons without turning every important message bold.", "TypeScale records those decisions in readonly properties such as headlineSize, bodyWeight, labelWidthPercent, and readingLineHeight. The headline uses Font.DemiBold, the body uses Font.Normal, and the smaller label earns Font.Bold because its compact context needs emphasis.", "When every label is bold, dense surfaces shout at one volume and scanning becomes difficult. You can recognize this failure when headings, descriptions, and edge controls differ mainly in pixel size but have nearly identical darkness and emphasis."],
  },
  "text-resilience-proof": {
    starter: `import QtQuick\n\nItem {\n    id: root\n    width: 120\n    height: 56\n    property string localizedLabel: "استخدام الموارد الحالي"\n    property string changingValue: "98%"\n\n    Text {\n        text: root.localizedLabel\n        width: parent.width\n    }\n    Text {\n        y: 28\n        text: root.changingValue\n    }\n}`,
    solution: `import QtQuick\n\nItem {\n    id: root\n    property string localizedLabel: "استخدام الموارد الحالي"\n    property string changingValue: "98%"\n    property bool rtl: Qt.application.layoutDirection === Qt.RightToLeft\n\n    QtObject {\n        id: textPolicy\n        readonly property int maximumLineWidth: 280\n        readonly property int horizontalPadding: 12\n        readonly property int rowGap: 6\n    }\n\n    FontMetrics {\n        id: labelMetrics\n        font: localizedText.font\n    }\n    FontMetrics {\n        id: numberMetrics\n        font: resourceValue.font\n    }\n\n    implicitWidth: Math.max(localizedText.width, resourceValue.width) + textPolicy.horizontalPadding * 2\n    implicitHeight: resourceValue.y + resourceValue.implicitHeight + textPolicy.horizontalPadding\n    LayoutMirroring.enabled: root.rtl\n    LayoutMirroring.childrenInherit: true\n\n    Text {\n        id: localizedText\n        x: textPolicy.horizontalPadding\n        y: textPolicy.horizontalPadding\n        width: Math.min(Math.ceil(labelMetrics.advanceWidth(root.localizedLabel)), textPolicy.maximumLineWidth)\n        text: root.localizedLabel\n        elide: Text.ElideRight\n        horizontalAlignment: root.rtl ? Text.AlignRight : Text.AlignLeft\n    }\n\n    Text {\n        id: resourceValue\n        x: textPolicy.horizontalPadding\n        y: localizedText.y + localizedText.implicitHeight + textPolicy.rowGap\n        width: Math.ceil(numberMetrics.advanceWidth("100%"))\n        text: root.changingValue\n        font.family: "monospace"\n        horizontalAlignment: Text.AlignRight\n    }\n}`,
    checks: [
      { label: "Measured width", hint: "Size the localized line from FontMetrics and a named maximum-width policy.", pattern: "Item\\s*\\{[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?maximumLineWidth\\s*:[\\s\\S]*?FontMetrics\\s*\\{[\\s\\S]*?Text\\s*\\{[\\s\\S]*?id\\s*:\\s*localizedText[\\s\\S]*?width\\s*:\\s*Math\\.min\\([\\s\\S]*?advanceWidth\\(", flags: "m" },
      { label: "Localized overflow", hint: "Declare elision and choose alignment from the RTL policy.", pattern: "Text\\s*\\{[\\s\\S]*?id\\s*:\\s*localizedText[\\s\\S]*?elide\\s*:\\s*Text\\.ElideRight[\\s\\S]*?horizontalAlignment\\s*:\\s*root\\.rtl\\s*\\?\\s*Text\\.AlignRight\\s*:\\s*Text\\.AlignLeft", flags: "m" },
      { label: "Stable numbers", hint: "Measure a fixed numeric slot and render changing digits with the monospace role.", pattern: "Text\\s*\\{[\\s\\S]*?id\\s*:\\s*resourceValue[\\s\\S]*?width\\s*:\\s*Math\\.ceil\\(numberMetrics\\.advanceWidth\\(\"100%\"\\)\\)[\\s\\S]*?font\\.family\\s*:\\s*\"monospace\"", flags: "m" },
    ],
    rules: ["Measure the localized label with FontMetrics before applying the maximum line width.", "Declare right-side elision and derive horizontal alignment from the application direction.", "Reserve a measured monospace slot wide enough for every percentage value."],
    explanation: ["Text resilience means allowing content to change language, script, length, and numeric value without breaking its container. The shell needs this because translations and live metrics rarely share the dimensions of a Latin placeholder screenshot.", "The textPolicy object supplies maximumLineWidth and spacing roles, while labelMetrics.advanceWidth measures the actual localizedLabel. localizedText declares Text.ElideRight and direction-aware alignment, and resourceValue uses a measured monospace slot sized for \"100%\" so its digits remain still.", "A fixed Latin-sized box can clip Arabic, misalign right-to-left text, and make proportional digits dance as a percentage changes. Look for unexplained width literals, missing overflow behavior, or neighboring controls that shift when a live number gains a digit."],
  },
  "icon-family-grammar": {
    starter: `import QtQuick\n\nRow {\n    spacing: 14\n\n    Text {\n        text: "🔋"\n        font.pixelSize: 22\n    }\n    Text {\n        text: ""\n        font.family: "Symbols Nerd Font"\n        font.pixelSize: 18\n    }\n    Text {\n        text: "settings"\n        font.family: "Material Icons"\n    }\n}`,
    solution: `pragma Singleton\nimport QtQml\n\nQtObject {\n    id: grammar\n    readonly property string family: "material-symbols"\n    readonly property string outlineStyle: "outline"\n    readonly property string filledStyle: "filled"\n    readonly property int defaultWeight: 500\n    readonly property int defaultGrade: 0\n    readonly property int compactSize: 20\n    readonly property int comfortableSize: 24\n    readonly property real opticalBaselineOffset: -0.5\n\n    readonly property Component iconRule: Component {\n        QtObject {\n            property bool selected: false\n            property bool isLearnedConvention: false\n            readonly property string family: grammar.family\n            readonly property string variant: selected ? grammar.filledStyle : grammar.outlineStyle\n            readonly property bool requiresLabel: !isLearnedConvention\n            readonly property string labelPlacement: requiresLabel ? "trailing" : "none"\n        }\n    }\n}`,
    checks: [
      { label: "One family", hint: "Name one primary icon family and expose a reusable rule component.", pattern: "pragma\\s+Singleton[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+string\\s+family\\s*:\\s*\"material-symbols\"[\\s\\S]*?readonly\\s+property\\s+Component\\s+iconRule\\s*:", flags: "m" },
      { label: "State variant", hint: "Derive filled versus outline presentation from selected state.", pattern: "Component\\s*\\{[\\s\\S]*?QtObject\\s*\\{[\\s\\S]*?property\\s+bool\\s+selected\\s*:\\s*false[\\s\\S]*?readonly\\s+property\\s+string\\s+variant\\s*:\\s*selected\\s*\\?\\s*grammar\\.filledStyle\\s*:\\s*grammar\\.outlineStyle", flags: "m" },
      { label: "Label policy", hint: "Derive label necessity from whether the icon is a learned convention.", pattern: "Component\\s*\\{[\\s\\S]*?property\\s+bool\\s+isLearnedConvention\\s*:\\s*false[\\s\\S]*?readonly\\s+property\\s+bool\\s+requiresLabel\\s*:\\s*!isLearnedConvention", flags: "m" },
    ],
    rules: ["Source every shell action icon from the single material-symbols family role.", "Map selected state to filled form and unselected state to outline form.", "Require a trailing label whenever an icon is not a learned convention."],
    explanation: ["An icon grammar is a shared road-sign standard for family, stroke character, size, alignment, and state. It makes repeated actions recognizable because the same visual changes carry the same meaning everywhere in the shell.", "IconGrammar names material-symbols as its sole family and stores weight, grade, size, and baseline roles beside it. Each iconRule instance derives variant from selected and derives requiresLabel from isLearnedConvention, so fill and label decisions follow one reusable policy.", "Emoji, Nerd Font glyphs, and app artwork have different boxes, stroke weights, and cultural meanings even when their nominal pixel sizes match. The failure appears as a toolbar whose icons sit on uneven baselines or where identical states use unrelated filled, outlined, and colourful forms."],
  },
  "foreign-artwork-frame-boss": {
    starter: `import QtQuick\n\nItem {\n    id: root\n    required property url source\n\n    Image {\n        anchors.fill: parent\n        source: root.source\n        fillMode: Image.Stretch\n    }\n}`,
    solution: `import QtQuick\n\nItem {\n    id: frame\n    required property url source\n    property string label: ""\n\n    QtObject {\n        id: framePolicy\n        readonly property int size: 96\n        readonly property int overlayPadding: 8\n        readonly property color placeholder: "#34343a"\n        readonly property color placeholderText: "#d7d7dc"\n        readonly property color scrim: "#b0000000"\n        readonly property color overlayText: "#ffffff"\n    }\n\n    implicitWidth: framePolicy.size\n    implicitHeight: framePolicy.size\n    clip: true\n\n    Image {\n        id: artwork\n        anchors.fill: parent\n        source: frame.source\n        fillMode: Image.PreserveAspectCrop\n        asynchronous: true\n        cache: true\n    }\n\n    Rectangle {\n        id: fallback\n        anchors.fill: parent\n        color: framePolicy.placeholder\n        visible: artwork.status === Image.Loading || artwork.status === Image.Error\n\n        Text {\n            anchors.centerIn: parent\n            text: artwork.status === Image.Loading ? "Loading…" : "Artwork unavailable"\n            color: framePolicy.placeholderText\n        }\n    }\n\n    Rectangle {\n        id: scrim\n        anchors.left: parent.left\n        anchors.right: parent.right\n        anchors.bottom: parent.bottom\n        height: caption.implicitHeight + framePolicy.overlayPadding * 2\n        color: framePolicy.scrim\n        visible: frame.label.length > 0\n\n        Text {\n            id: caption\n            anchors.centerIn: parent\n            text: frame.label\n            color: framePolicy.overlayText\n            elide: Text.ElideRight\n        }\n    }\n}`,
    checks: [
      { label: "Bounded frame", hint: "Require a source, derive both implicit dimensions from one frame-size role, and clip the bounds.", pattern: "Item\\s*\\{[\\s\\S]*?required\\s+property\\s+url\\s+source[\\s\\S]*?readonly\\s+property\\s+int\\s+size\\s*:[\\s\\S]*?implicitWidth\\s*:\\s*framePolicy\\.size[\\s\\S]*?implicitHeight\\s*:\\s*framePolicy\\.size[\\s\\S]*?clip\\s*:\\s*true", flags: "m" },
      { label: "Identity preserved", hint: "Crop without stretching, then show a neutral fallback for loading and error states.", pattern: "Image\\s*\\{[\\s\\S]*?id\\s*:\\s*artwork[\\s\\S]*?source\\s*:\\s*frame\\.source[\\s\\S]*?fillMode\\s*:\\s*Image\\.PreserveAspectCrop[\\s\\S]*?Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*fallback[\\s\\S]*?visible\\s*:\\s*artwork\\.status\\s*===\\s*Image\\.Loading\\s*\\|\\|\\s*artwork\\.status\\s*===\\s*Image\\.Error", flags: "m" },
      { label: "Legible overlay", hint: "Place caption text on a separate policy-coloured scrim over the untouched image.", pattern: "Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*scrim[\\s\\S]*?color\\s*:\\s*framePolicy\\.scrim[\\s\\S]*?visible\\s*:\\s*frame\\.label\\.length\\s*>\\s*0[\\s\\S]*?Text\\s*\\{[\\s\\S]*?id\\s*:\\s*caption[\\s\\S]*?color\\s*:\\s*framePolicy\\.overlayText", flags: "m" },
    ],
    rules: ["Constrain every foreign asset to the single framePolicy size and clip its optical bounds.", "Preserve source identity with aspect cropping and neutral loading or error fallbacks.", "Place overlay text on a separate semantic scrim without recolouring the source image."],
    explanation: ["An artwork frame gives foreign content consistent optical bounds—the visible box used to align it—while leaving the content's identity intact. Application icons, avatars, tray art, and album covers can then coexist with the shell without being stretched or remade as house icons.", "ArtworkFrame requires source and derives both implicit dimensions from framePolicy.size before clipping its contents. artwork uses Image.PreserveAspectCrop, fallback responds to Image.Loading and Image.Error, and the caption sits on a scrim—a translucent dimming layer behind text—whose colours come from the policy object.", "Stretching raw art distorts faces and logos, while uncontrolled artwork can break alignment or overwhelm nearby controls. In a screenshot, watch for changing frame sizes, squeezed circles, missing-image gaps, or captions that disappear against bright portions of an image."],
  },
  "semantic-motion-vocabulary": {
    starter: `pragma Singleton
import QtQuick

QtObject {
    property int duration: 300
    readonly property int easing: Easing.Linear

    function durationForPurpose(purpose) {
        return duration
    }
}`,
    solution: `pragma Singleton
import QtQuick

QtObject {
    property real scale: 1

    readonly property int immediate: Math.round(90 * scale)
    readonly property int effect: Math.round(140 * scale)
    readonly property int exit: Math.round(180 * scale)
    readonly property int enter: Math.round(280 * scale)
    readonly property int spatial: Math.round(360 * scale)
    readonly property int topology: Math.round(520 * scale)

    readonly property int immediateEasing: Easing.OutQuad
    readonly property int effectEasing: Easing.OutCubic
    readonly property int exitEasing: Easing.InCubic
    readonly property int enterEasing: Easing.OutCubic
    readonly property int spatialEasing: Easing.OutBack
    readonly property int topologyEasing: Easing.InOutCubic
}`,
    checks: [
      { label: "Scaled immediate roles", hint: "Derive immediate and effect durations from the shared scale policy.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+real\\s+scale\\s*:\\s*1[\\s\\S]*?readonly\\s+property\\s+int\\s+immediate\\s*:\\s*Math\\.round\\(90\\s*\\*\\s*scale\\)[\\s\\S]*?readonly\\s+property\\s+int\\s+effect\\s*:\\s*Math\\.round\\(140\\s*\\*\\s*scale\\)", flags: "m" },
      { label: "Purpose-named journeys", hint: "Give exits, entrances, spatial moves, and topology changes distinct scaled durations.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+exit\\s*:\\s*Math\\.round\\(180\\s*\\*\\s*scale\\)[\\s\\S]*?readonly\\s+property\\s+int\\s+enter\\s*:\\s*Math\\.round\\(280\\s*\\*\\s*scale\\)[\\s\\S]*?readonly\\s+property\\s+int\\s+spatial\\s*:\\s*Math\\.round\\(360\\s*\\*\\s*scale\\)[\\s\\S]*?readonly\\s+property\\s+int\\s+topology\\s*:\\s*Math\\.round\\(520\\s*\\*\\s*scale\\)", flags: "m" },
      { label: "Directional easing roles", hint: "Accelerate exits, decelerate entrances, and reserve overshoot for spatial movement.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+int\\s+exitEasing\\s*:\\s*Easing\\.InCubic[\\s\\S]*?readonly\\s+property\\s+int\\s+enterEasing\\s*:\\s*Easing\\.OutCubic[\\s\\S]*?readonly\\s+property\\s+int\\s+spatialEasing\\s*:\\s*Easing\\.OutBack", flags: "m" },
    ],
    rules: ["Derive every duration role from the single scale property with Math.round.", "Keep the exit duration shorter than the enter duration.", "Assign acceleration to exitEasing, deceleration to enterEasing, and overshoot only to spatialEasing."],
    explanation: ["A motion role names animation timing by purpose rather than treating every journey alike. It is like choosing walking, cycling, train, or emergency speed according to the trip. A shell needs these distinctions so tiny feedback stays quick while large changes remain legible.", "The Motion singleton exposes immediate, effect, exit, enter, spatial, and topology as readonly integer properties. Each duration is calculated from scale, while exitEasing, enterEasing, and spatialEasing encode how those journeys accelerate or settle. Changing scale therefore adjusts the whole vocabulary without erasing its hierarchy.", "One global duration makes hover feedback drag, dismissal linger, and overview travel snap past too quickly. In real code, the warning sign is the same duration property bound to unrelated animations regardless of their distance or purpose."],
  },
  "spatial-causality-lab": {
    starter: `import QtQuick

Rectangle {
    id: popout
    property bool open: false
    width: 280
    height: 180
    x: 240
    y: 160
    opacity: open ? 1 : 0
    color: Palette.surface

    Behavior on opacity {
        NumberAnimation { duration: 300 }
    }

    Text {
        anchors.centerIn: parent
        text: "Workspace controls"
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: popout
    required property point origin
    property bool open: false
    property real targetX: 240
    property real targetY: 160
    property real expandedWidth: 280

    x: open ? targetX : origin.x
    y: open ? targetY : origin.y
    width: open ? expandedWidth : 32
    height: 180
    clip: true
    color: Palette.surface

    Behavior on x {
        NumberAnimation {
            duration: popout.open ? Motion.enter : Motion.exit
            easing.type: popout.open ? Motion.enterEasing : Motion.exitEasing
        }
    }
    Behavior on y {
        NumberAnimation {
            duration: popout.open ? Motion.enter : Motion.exit
        }
    }
    Behavior on width {
        NumberAnimation {
            duration: popout.open ? Motion.enter : Motion.exit
        }
    }

    Text {
        anchors.centerIn: parent
        text: "Workspace controls"
        visible: popout.open
        color: Palette.onSurface
    }
}`,
    checks: [
      { label: "Causal origin", hint: "Bind both axes to the required trigger origin while the popout is closed.", pattern: "Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*popout[\\s\\S]*?required\\s+property\\s+point\\s+origin[\\s\\S]*?\\bx\\s*:\\s*open\\s*\\?\\s*targetX\\s*:\\s*origin\\.x[\\s\\S]*?\\by\\s*:\\s*open\\s*\\?\\s*targetY\\s*:\\s*origin\\.y", flags: "m" },
      { label: "Asymmetric return", hint: "Make horizontal travel use the entrance role outward and the quicker exit role homeward.", pattern: "Behavior\\s+on\\s+x\\s*\\{[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?duration\\s*:\\s*popout\\.open\\s*\\?\\s*Motion\\.enter\\s*:\\s*Motion\\.exit[\\s\\S]*?\\}", flags: "m" },
      { label: "Surface deformation", hint: "Animate the surface width while leaving its Text content without independent motion.", pattern: "Behavior\\s+on\\s+width\\s*\\{[\\s\\S]*?duration\\s*:\\s*popout\\.open\\s*\\?\\s*Motion\\.enter\\s*:\\s*Motion\\.exit[\\s\\S]*?Text\\s*\\{(?![\\s\\S]*?Behavior\\s+on\\s+(?:x|y|opacity))[\\s\\S]*?visible\\s*:\\s*popout\\.open", flags: "m" },
    ],
    rules: ["Require an origin point and return both x and y to that trigger position when closed.", "Use Motion.enter for opening travel and the shorter Motion.exit role for the return.", "Animate the popout geometry while switching its Text content without an independent text animation."],
    explanation: ["Spatial causality means a surface travels along a causal path, the visible route connecting an action to its result. A popout should emerge from its trigger and return there, much like a paper map unfolding from its cover and folding back to the same crease. This helps people understand ownership and predict reversal.", "The required origin point supplies the closed x and y values, while targetX and targetY locate the open surface. Behavior on x and Behavior on y choose Motion.enter when popout.open is true and Motion.exit when it is false. The width Behavior deforms the containing surface, but the inner Text only changes visibility.", "A centred opacity fade erases the relationship between trigger and result. You can recognize the failure when several popouts appear from the same arbitrary location or when closing one gives no visual clue about the control that owns it."],
  },
  "state-layer-ripple-system": {
    starter: `import QtQuick

Rectangle {
    id: control
    width: 160
    height: 44
    property bool selected: false
    property point rippleOrigin: Qt.point(width / 2, height / 2)
    color: hover.hovered ? "#3d374a" : "#292531"

    HoverHandler { id: hover }
    TapHandler { id: tap }

    Rectangle {
        x: control.rippleOrigin.x - width / 2
        y: control.rippleOrigin.y - height / 2
        width: tap.pressed ? 36 : 0
        height: width
        radius: width / 2
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: control
    width: 160
    height: 44
    activeFocusOnTab: true

    property bool disabled: false
    property bool selected: false
    readonly property bool hovered: hover.hovered
    readonly property bool pressed: tap.pressed
    readonly property point pressOrigin: tap.point.position
    readonly property color stateLayer: disabled
        ? Palette.onSurfaceDisabled
        : pressed
          ? Palette.stateLayerPressed
          : hovered
            ? Palette.stateLayerHover
            : selected
              ? Palette.stateLayerSelected
              : "transparent"

    color: stateLayer
    border.color: Palette.focusRing
    border.width: activeFocus ? 2 : 0

    HoverHandler {
        id: hover
        enabled: !control.disabled
    }
    TapHandler {
        id: tap
        enabled: !control.disabled
        onTapped: control.forceActiveFocus()
    }

    Rectangle {
        x: control.pressOrigin.x - width / 2
        y: control.pressOrigin.y - height / 2
        width: tap.pressed ? control.width * 1.5 : 0
        height: width
        radius: width / 2
        color: Palette.stateLayerPressed
        opacity: tap.pressed ? 0.35 : 0
        Behavior on width {
            NumberAnimation { duration: Motion.immediate }
        }
    }
}`,
    checks: [
      { label: "Unified state layer", hint: "Derive one colour with disabled first, followed by pressed, hovered, and selected.", pattern: "Rectangle\\s*\\{[\\s\\S]*?readonly\\s+property\\s+color\\s+stateLayer\\s*:\\s*disabled\\s*\\?\\s*Palette\\.onSurfaceDisabled\\s*:\\s*pressed\\s*\\?\\s*Palette\\.stateLayerPressed\\s*:\\s*hovered\\s*\\?\\s*Palette\\.stateLayerHover\\s*:\\s*selected\\s*\\?\\s*Palette\\.stateLayerSelected\\s*:\\s*\"transparent\"[\\s\\S]*?\\bcolor\\s*:\\s*stateLayer", flags: "m" },
      { label: "Pointer-owned ripple", hint: "Capture the TapHandler point position instead of manufacturing a centre point.", pattern: "Rectangle\\s*\\{[\\s\\S]*?readonly\\s+property\\s+point\\s+pressOrigin\\s*:\\s*tap\\.point\\.position[\\s\\S]*?HoverHandler\\s*\\{[\\s\\S]*?id\\s*:\\s*hover[\\s\\S]*?TapHandler\\s*\\{[\\s\\S]*?id\\s*:\\s*tap", flags: "m" },
      { label: "Visible keyboard focus", hint: "Make the control tabbable and show a two-pixel border only while it has active focus.", pattern: "Rectangle\\s*\\{[\\s\\S]*?activeFocusOnTab\\s*:\\s*true[\\s\\S]*?border\\.color\\s*:\\s*Palette\\.focusRing[\\s\\S]*?border\\.width\\s*:\\s*activeFocus\\s*\\?\\s*2\\s*:\\s*0", flags: "m" },
    ],
    rules: ["Derive hover, press, selection, and disabled feedback through the single stateLayer property.", "Capture the ripple origin from tap.point.position and bind the ripple geometry to it.", "Expose keyboard focus with a two-pixel focus ring and disable both handlers when control.disabled is true."],
    explanation: ["A state layer is one reusable overlay treatment derived from a control's interaction state. Sharing it keeps hover, press, selection, focus, and disabled feedback coherent across the shell. It also prevents pointer and keyboard users from receiving contradictory signals.", "The stateLayer property evaluates disabled first, then pressed, hovered, and selected, and the Rectangle binds its color to that one result. HoverHandler and TapHandler supply observable interaction state, while pressOrigin reads tap.point.position for a ripple centred on the actual contact. activeFocusOnTab and border.width provide a separate visible keyboard-focus cue.", "Bespoke feedback in every module commonly leaves disabled controls looking active and keyboard focus entirely invisible. Another tell is a ripple that always blooms from the centre even when the pointer landed near an edge."],
  },
  "motion-policy-boss": {
    starter: `import QtQuick

Rectangle {
    id: drawer
    width: 320
    height: 640
    property bool open: false
    x: -width
    visible: open
    color: Palette.surface

    NumberAnimation {
        id: slide
        target: drawer
        property: "x"
        duration: 440
    }

    Rectangle {
        id: activity
        anchors.centerIn: parent
        width: 32
        height: 32
        color: Palette.accent
        RotationAnimation {
            target: activity
            from: 0
            to: 360
            loops: Animation.Infinite
            duration: 1400
            running: true
        }
    }

    TapHandler {
        onTapped: {
            drawer.open = !drawer.open
            slide.to = drawer.open ? 0 : -drawer.width
            slide.restart()
        }
    }
}`,
    solution: `import QtQuick

Rectangle {
    id: drawer
    width: 320
    height: 640

    property bool open: false
    property bool reducedMotion: false

    x: open ? 0 : -width
    visible: open || x > -width
    color: Palette.surface

    Behavior on x {
        NumberAnimation {
            duration: drawer.reducedMotion
                ? Motion.immediate
                : Motion.spatial
            easing.type: Motion.spatialEasing
        }
    }

    Rectangle {
        id: activity
        anchors.centerIn: parent
        width: 32
        height: 32
        radius: width / 2
        color: Palette.accent

        RotationAnimation {
            target: activity
            property: "rotation"
            from: 0
            to: 360
            loops: Animation.Infinite
            duration: Motion.topology * 3
            running: drawer.visible && !drawer.reducedMotion
        }
    }

    TapHandler {
        onTapped: drawer.open = !drawer.open
    }
}`,
    checks: [
      { label: "Rendered-value reversal", hint: "Bind x directly to open and let a Behavior continue from the currently rendered position.", pattern: "Rectangle\\s*\\{[\\s\\S]*?id\\s*:\\s*drawer[\\s\\S]*?property\\s+bool\\s+open\\s*:\\s*false[\\s\\S]*?\\bx\\s*:\\s*open\\s*\\?\\s*0\\s*:\\s*-width[\\s\\S]*?Behavior\\s+on\\s+x\\s*\\{[\\s\\S]*?NumberAnimation\\s*\\{", flags: "m" },
      { label: "Reduced-motion timing", hint: "Keep causal feedback but shorten the drawer transition to Motion.immediate under reduction.", pattern: "Behavior\\s+on\\s+x\\s*\\{[\\s\\S]*?NumberAnimation\\s*\\{[\\s\\S]*?duration\\s*:\\s*drawer\\.reducedMotion\\s*\\?\\s*Motion\\.immediate\\s*:\\s*Motion\\.spatial", flags: "m" },
      { label: "Hidden-work suspension", hint: "Run the continuous activity animation only while the drawer is visible and motion is allowed.", pattern: "RotationAnimation\\s*\\{[\\s\\S]*?loops\\s*:\\s*Animation\\.Infinite[\\s\\S]*?running\\s*:\\s*drawer\\.visible\\s*&&\\s*!drawer\\.reducedMotion", flags: "m" },
    ],
    rules: ["Bind drawer.x directly to open and reverse it through Behavior on x without calling restart.", "Use Motion.immediate under reduced motion and Motion.spatial for ordinary drawer travel.", "Stop the continuous RotationAnimation whenever the drawer is hidden or reducedMotion is enabled."],
    explanation: ["Reversible motion preserves continuity when a transition is interrupted before reaching its target. QML Behavior animates from the currently rendered value, so changing direction does not require a queued phase or manual restart. Reduced motion keeps a short causal response instead of removing feedback altogether.", "The drawer binds x directly to open and places a NumberAnimation inside Behavior on x. Its duration switches between Motion.immediate and Motion.spatial through reducedMotion, while visible remains true until the closing journey finishes. The ambient RotationAnimation runs only when drawer.visible is true and reduction is off.", "Manually restarting one-shot animations can discard the rendered position and chase a stale destination during rapid reversal. Hard-coded running: true is the companion performance smell: the screenshot looks still after hiding the surface, but an invisible visualizer continues spending GPU time and battery."],
  },
  "form-factor-compositions": {
    starter: `import QtQuick

Item {
    id: shell
    property real screenWidth: 3440
    property real screenHeight: 1440
    property real scaleFactor: screenWidth / 1920
    width: screenWidth
    height: screenHeight

    Row {
        scale: shell.scaleFactor
        Rectangle { width: 280; height: 72; color: "#25222b" }
        Rectangle { width: 420; height: 72; color: "#25222b" }
        Rectangle { width: 240; height: 72; color: "#25222b" }
    }
}`,
    solution: `import QtQml

QtObject {
    id: formFactorPolicy
    objectName: "FormFactorPolicy"

    property real screenWidth: 1920
    property real screenHeight: 1080
    property real screenScale: 1

    readonly property string formFactor: screenWidth < 900 ? "compact"
        : (screenHeight > screenWidth ? "portrait"
        : (screenWidth > 2600 ? "ultrawide" : "normal"))

    readonly property list<string> visibleModules: formFactor === "compact"
        ? ["clock", "tray"]
        : formFactor === "ultrawide"
        ? ["clock", "media", "tray", "workspace", "search"]
        : ["clock", "media", "tray"]

    readonly property string compositionAxis: formFactor === "portrait" ? "vertical" : "horizontal"
    readonly property string densityRole: screenScale > 1.5 ? "mixed-scale" : "standard"
}`,
    checks: [
      { label: "Classify the silhouette", hint: "Derive compact, portrait, ultrawide, and normal from both screen dimensions.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+real\\s+screenWidth\\s*:[\\s\\S]*?property\\s+real\\s+screenHeight\\s*:[\\s\\S]*?readonly\\s+property\\s+string\\s+formFactor\\s*:\\s*screenWidth\\s*<\\s*900\\s*\\?\\s*\"compact\"\\s*:\\s*\\(screenHeight\\s*>\\s*screenWidth\\s*\\?\\s*\"portrait\"\\s*:\\s*\\(screenWidth\\s*>\\s*2600\\s*\\?\\s*\"ultrawide\"\\s*:\\s*\"normal\"\\s*\\)\\)", flags: "m" },
      { label: "Drop modules when compact", hint: "Make visibleModules a typed list whose compact branch keeps only clock and tray.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+list<string>\\s+visibleModules\\s*:\\s*formFactor\\s*===\\s*\"compact\"\\s*\\?\\s*\\[\\s*\"clock\"\\s*,\\s*\"tray\"\\s*\\]", flags: "m" },
      { label: "Expand ultrawide priorities", hint: "Give ultrawide screens workspace and search while retaining the smaller normal composition.", pattern: "visibleModules\\s*:[\\s\\S]*?formFactor\\s*===\\s*\"ultrawide\"\\s*\\?\\s*\\[\\s*\"clock\"\\s*,\\s*\"media\"\\s*,\\s*\"tray\"\\s*,\\s*\"workspace\"\\s*,\\s*\"search\"\\s*\\]\\s*:\\s*\\[\\s*\"clock\"\\s*,\\s*\"media\"\\s*,\\s*\"tray\"\\s*\\]", flags: "m" },
    ],
    rules: ["Derive the form factor from screen width and height instead of assigning a fixed silhouette.", "Remove low-priority modules from compact compositions and add useful regions on ultrawide screens.", "Switch portrait composition to a vertical axis while preserving named content roles."],
    explanation: ["A form-factor policy chooses a composition suited to a screen rather than enlarging one reference layout. Negative space—the deliberately unoccupied area around content—can then grow on wide displays without stretching every module.", "FormFactorPolicy derives formFactor from screenWidth and screenHeight, then uses that result to compute the typed visibleModules list. compositionAxis changes the portrait arrangement, while densityRole records mixed-scale context separately from geometry.", "Uniform scaling produces oversized gaps on ultrawide screens and clipped horizontal strips in portrait. In code, recognize it by one scaleFactor applied to an entire module row with no classification or reprioritization."],
  },
  "per-monitor-token-overlays": {
    starter: `import QtQml

QtObject {
    id: monitorSettings
    property int screenIndex: 0
    property var overrides: [
        { density: "compact" },
        { density: "normal" }
    ]

    readonly property string density: overrides[screenIndex].density
    readonly property real moduleScale: screenIndex === 0 ? 0.85 : 1
}`,
    solution: `import QtQml

QtObject {
    id: monitorTokens
    objectName: "MonitorTokens"

    property string screenName: "DP-1"
    property var overrides: ({
        "DP-1": { density: "compact", barEdge: "left", transparency: false }
    })

    readonly property string defaultDensity: "normal"
    readonly property string defaultBarEdge: "top"
    readonly property bool defaultTransparency: true

    readonly property string density: (overrides[screenName] && overrides[screenName].density)
        ? overrides[screenName].density : defaultDensity
    readonly property string barEdge: (overrides[screenName] && overrides[screenName].barEdge)
        ? overrides[screenName].barEdge : defaultBarEdge
    readonly property bool useTransparency: (overrides[screenName] && overrides[screenName].transparency !== undefined)
        ? overrides[screenName].transparency : defaultTransparency
}`,
    checks: [
      { label: "Key overrides by screen name", hint: "Use a stable screenName and a sparse object map containing a named connector entry.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+string\\s+screenName\\s*:\\s*\"[^\"]+\"[\\s\\S]*?property\\s+var\\s+overrides\\s*:\\s*\\(\\{[\\s\\S]*?\"DP-1\"\\s*:", flags: "m" },
      { label: "Resolve density with a default", hint: "Look up density through overrides[screenName] and fall back to the typed defaultDensity token.", pattern: "readonly\\s+property\\s+string\\s+density\\s*:\\s*\\(overrides\\[screenName\\]\\s*&&\\s*overrides\\[screenName\\]\\.density\\)\\s*\\?\\s*overrides\\[screenName\\]\\.density\\s*:\\s*defaultDensity", flags: "m" },
      { label: "Avoid monitor indices", hint: "Resolve another token by screenName without declaring a numeric screenIndex.", pattern: "QtObject\\s*\\{(?![\\s\\S]*property\\s+int\\s+screenIndex)[\\s\\S]*?readonly\\s+property\\s+string\\s+barEdge\\s*:\\s*\\(overrides\\[screenName\\]\\s*&&\\s*overrides\\[screenName\\]\\.barEdge\\)", flags: "m" },
    ],
    rules: ["Identify each monitor with a stable connector-style screenName rather than its current array position.", "Layer sparse density, bar-edge, and transparency overrides over typed global defaults.", "Resolve each token independently so an omitted override inherits policy instead of duplicating a screen module."],
    explanation: ["A sparse override stores only the monitor-specific values that differ from global defaults. This keeps one shell composition reusable while still accommodating unusual hardware without forking the module per screen.", "MonitorTokens uses screenName as the key into overrides and exposes typed defaultDensity, defaultBarEdge, and defaultTransparency roles. Each readonly resolver first checks the named entry and otherwise returns its corresponding default.", "An index-keyed configuration silently follows list order when displays are unplugged or rediscovered. The smell is overrides[screenIndex]: a hotplug can make yesterday’s compact side monitor settings appear on the main display."],
  },
  "representative-state-matrix": {
    starter: `import QtQuick

Rectangle {
    id: batteryCard
    width: 240
    height: 96
    property var batteryPercent: undefined
    color: "#24212a"

    Text {
        anchors.centerIn: parent
        text: batteryCard.batteryPercent + "%"
    }
}`,
    solution: `import QtQml

QtObject {
    id: surfaceState
    objectName: "SurfaceState"

    property string theme: "dark"
    property bool fullscreen: false
    property bool transparencyAllowed: true
    property bool reducedMotion: false
    property string dataStatus: "ready"

    readonly property string message: dataStatus === "loading" ? "Loading…"
        : dataStatus === "empty" ? "Nothing here yet"
        : dataStatus === "stale" ? "Showing last known value"
        : dataStatus === "denied" ? "Permission needed"
        : dataStatus === "failed" ? "Couldn't load — retry"
        : ""

    readonly property bool showsRetryAction: dataStatus === "failed" || dataStatus === "denied"
    readonly property bool showsContent: dataStatus === "ready" || dataStatus === "stale"
    readonly property bool useTransparency: transparencyAllowed && !fullscreen
    readonly property int transitionDuration: reducedMotion ? 0 : 220
}`,
    checks: [
      { label: "Model representative state", hint: "Declare typed theme, fullscreen, motion, transparency, and data-status policy inputs.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+string\\s+theme\\s*:[\\s\\S]*?property\\s+bool\\s+fullscreen\\s*:[\\s\\S]*?property\\s+bool\\s+transparencyAllowed\\s*:[\\s\\S]*?property\\s+bool\\s+reducedMotion\\s*:[\\s\\S]*?property\\s+string\\s+dataStatus\\s*:\\s*\"ready\"", flags: "m" },
      { label: "Explain every degraded state", hint: "Derive a non-blank message for loading, empty, stale, denied, and failed.", pattern: "readonly\\s+property\\s+string\\s+message\\s*:\\s*dataStatus\\s*===\\s*\"loading\"\\s*\\?\\s*\"Loading…\"\\s*:\\s*dataStatus\\s*===\\s*\"empty\"\\s*\\?\\s*\"Nothing here yet\"\\s*:\\s*dataStatus\\s*===\\s*\"stale\"\\s*\\?\\s*\"Showing last known value\"\\s*:\\s*dataStatus\\s*===\\s*\"denied\"\\s*\\?\\s*\"Permission needed\"\\s*:\\s*dataStatus\\s*===\\s*\"failed\"\\s*\\?\\s*\"Couldn't load — retry\"", flags: "m" },
      { label: "Offer recovery actions", hint: "Show retry or recovery affordances for failed and denied states.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+showsRetryAction\\s*:\\s*dataStatus\\s*===\\s*\"failed\"\\s*\\|\\|\\s*dataStatus\\s*===\\s*\"denied\"", flags: "m" },
    ],
    rules: ["Represent loading, empty, stale, denied, failed, and ready as explicit dataStatus values.", "Give every non-ready status a cause-oriented message instead of exposing an empty value.", "Expose a recovery action for failed and denied states while preserving stale content."],
    explanation: ["A representative state system describes the ordinary, transitional, and degraded conditions a surface can occupy. The shell needs these policies because real services spend substantial time outside the ideal ready state.", "SurfaceState stores dataStatus alongside theme, fullscreen, transparencyAllowed, and reducedMotion inputs. Its message binding covers every degraded value, while showsRetryAction and showsContent derive the appropriate recovery and content behavior.", "A hero-only component often concatenates an unavailable value into text, producing a blank label or something like undefined%. The same weakness appears in screenshots as an empty card with no cause, status, or next action."],
  },
  "screenshot-critique-lab": {
    starter: `import QtQml

QtObject {
    id: screenshotReview
    objectName: "ScreenshotReview"

    property string screenshotSet: "desktop-main"
    property int overallImpression: 8
    property string note: "Looks polished"

    readonly property bool readyToShare: overallImpression >= 7
}`,
    solution: `import QtQml

QtObject {
    id: screenshotRubric
    objectName: "ScreenshotRubric"

    property int composition: 3
    property int coherence: 3
    property int hierarchy: 4
    property int continuity: 2
    property int legibility: 3
    property int responsiveness: 4
    property int distinctiveness: 3

    property list<string> recordedFixes: [
        "Join the media popout seam to its owner during exit motion"
    ]

    readonly property int totalScore: composition + coherence + hierarchy
        + continuity + legibility + responsiveness + distinctiveness

    readonly property int lowScoreCount: (composition < 3 ? 1 : 0)
        + (coherence < 3 ? 1 : 0) + (hierarchy < 3 ? 1 : 0)
        + (continuity < 3 ? 1 : 0) + (legibility < 3 ? 1 : 0)
        + (responsiveness < 3 ? 1 : 0) + (distinctiveness < 3 ? 1 : 0)

    readonly property bool hasFixForLowScores: recordedFixes.length >= lowScoreCount
}`,
    checks: [
      { label: "Score all seven criteria", hint: "Declare an integer score for every named part of the 28-point visual rubric.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+int\\s+composition\\s*:[\\s\\S]*?property\\s+int\\s+coherence\\s*:[\\s\\S]*?property\\s+int\\s+hierarchy\\s*:[\\s\\S]*?property\\s+int\\s+continuity\\s*:[\\s\\S]*?property\\s+int\\s+legibility\\s*:[\\s\\S]*?property\\s+int\\s+responsiveness\\s*:[\\s\\S]*?property\\s+int\\s+distinctiveness\\s*:", flags: "m" },
      { label: "Compute the rubric total", hint: "Sum the seven criterion properties instead of assigning a hard-coded total.", pattern: "readonly\\s+property\\s+int\\s+totalScore\\s*:\\s*composition\\s*\\+\\s*coherence\\s*\\+\\s*hierarchy\\s*\\+\\s*continuity\\s*\\+\\s*legibility\\s*\\+\\s*responsiveness\\s*\\+\\s*distinctiveness", flags: "m" },
      { label: "Record fixes for weak scores", hint: "Count criteria below three and require enough recordedFixes to address them.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+list<string>\\s+recordedFixes\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+lowScoreCount\\s*:[\\s\\S]*?composition\\s*<\\s*3[\\s\\S]*?distinctiveness\\s*<\\s*3[\\s\\S]*?readonly\\s+property\\s+bool\\s+hasFixForLowScores\\s*:\\s*recordedFixes\\.length\\s*>=\\s*lowScoreCount", flags: "m" },
    ],
    rules: ["Score composition, coherence, hierarchy, continuity, legibility, responsiveness, and distinctiveness separately from zero to four.", "Calculate totalScore from the seven recorded scores rather than entering an overall impression.", "Record at least one concrete corrective action for every criterion scoring below three."],
    explanation: ["A visual rubric is a repeatable set of criteria for examining screenshots across scales, wallpapers, states, and input modes. Its seven scores separate structural problems from a vague sense that a screen looks good or bad.", "ScreenshotRubric stores each criterion as an integer and derives totalScore from their sum. lowScoreCount identifies weak areas, and hasFixForLowScores compares that count with concrete entries in recordedFixes.", "A single overallImpression conceals whether the real problem is contrast, cropping, hierarchy, or a motion seam. Recognize impression-only critique when notes use adjectives but cannot point to a specific element and a specific change."],
  },
  "original-state-gallery-boss": {
    starter: `import QtQml

QtObject {
    id: capstone

    property int totalScore: 24

    readonly property bool earnsExpressionCrest: totalScore >= 21

}`,
    solution: `import QtQml

QtObject {
    id: expressionCapstone
    objectName: "ExpressionCapstone"

    readonly property string visualDirection: "instrument-panel"
    readonly property string dominantTopology: "connected-edge"
    readonly property string signatureElement: "threaded-status-rail"
    readonly property list<string> grammarRoles: ["surface", "owner", "signal", "action"]
    readonly property list<string> responsiveVariants: ["compact", "portrait", "normal", "ultrawide"]
    readonly property list<string> interactionStates: ["hover", "pressed", "focus", "disabled"]
    readonly property list<string> failureStates: ["loading", "empty", "stale", "denied", "failed"]
    readonly property list<string> evidenceMatrix: [
        "compact/dark/loading",
        "portrait/light/denied",
        "ultrawide/dark/reduced-motion"
    ]

    property int composition: 4
    property int coherence: 3
    property int hierarchy: 4
    property int continuity: 3
    property int legibility: 4
    property int responsiveness: 3
    property int distinctiveness: 3

    readonly property int totalScore: composition + coherence + hierarchy
        + continuity + legibility + responsiveness + distinctiveness
    readonly property bool meetsScoreBar: totalScore >= 21

    property bool hasCardSoup: false
    property bool hasOwnerlessPopouts: false
    property bool hasUniversalBlur: false
    property bool hasSingleRadiusToneType: false
    property bool hasDecorativeOnlyMotion: false

    readonly property bool passesRejectionGates: !hasCardSoup
        && !hasOwnerlessPopouts
        && !hasUniversalBlur
        && !hasSingleRadiusToneType
        && !hasDecorativeOnlyMotion

    readonly property bool earnsExpressionCrest: meetsScoreBar && passesRejectionGates
}`,
    checks: [
      { label: "Meet the scored bar", hint: "Sum all seven rubric criteria and require a total of at least 21.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+int\\s+composition\\s*:[\\s\\S]*?property\\s+int\\s+distinctiveness\\s*:[\\s\\S]*?readonly\\s+property\\s+int\\s+totalScore\\s*:\\s*composition\\s*\\+\\s*coherence\\s*\\+\\s*hierarchy\\s*\\+\\s*continuity\\s*\\+\\s*legibility\\s*\\+\\s*responsiveness\\s*\\+\\s*distinctiveness[\\s\\S]*?readonly\\s+property\\s+bool\\s+meetsScoreBar\\s*:\\s*totalScore\\s*>=\\s*21", flags: "m" },
      { label: "Enforce every rejection gate", hint: "Declare all five independent defects and negate each one in passesRejectionGates.", pattern: "QtObject\\s*\\{[\\s\\S]*?property\\s+bool\\s+hasCardSoup\\s*:[\\s\\S]*?property\\s+bool\\s+hasOwnerlessPopouts\\s*:[\\s\\S]*?property\\s+bool\\s+hasUniversalBlur\\s*:[\\s\\S]*?property\\s+bool\\s+hasSingleRadiusToneType\\s*:[\\s\\S]*?property\\s+bool\\s+hasDecorativeOnlyMotion\\s*:[\\s\\S]*?readonly\\s+property\\s+bool\\s+passesRejectionGates\\s*:\\s*!hasCardSoup\\s*&&\\s*!hasOwnerlessPopouts\\s*&&\\s*!hasUniversalBlur\\s*&&\\s*!hasSingleRadiusToneType\\s*&&\\s*!hasDecorativeOnlyMotion", flags: "m" },
      { label: "Require score and integrity", hint: "Award the crest only when both the numeric bar and rejection gates pass.", pattern: "QtObject\\s*\\{[\\s\\S]*?readonly\\s+property\\s+bool\\s+earnsExpressionCrest\\s*:\\s*meetsScoreBar\\s*&&\\s*passesRejectionGates", flags: "m" },
    ],
    rules: ["Document the capstone’s direction, topology, signature, grammar, responsive variants, interaction states, failure states, and evidence matrix.", "Compute the seven-criterion score and require at least 21 of 28 points.", "Reject card soup, ownerless popouts, universal blur, single-treatment grammar, and decorative-only motion regardless of score."],
    explanation: ["The Expression capstone treats a visual system as a documented policy with evidence, not as one polished screenshot. A rejection gate is a disqualifying condition that overrides an otherwise acceptable average score.", "ExpressionCapstone records visualDirection, dominantTopology, signatureElement, grammar roles, representative states, and an evidenceMatrix. It derives totalScore and meetsScoreBar from seven criteria, then independently derives passesRejectionGates from five typed defect inputs.", "Score-only approval allows a shell with strong typography or contrast to hide structural failures such as card soup or ownerless popouts. The flaw is visible in code when earnsExpressionCrest compares only totalScore, and in screenshots when repeated cards, blur, radii, or decorative motion erase hierarchy and ownership."],
  },
};
