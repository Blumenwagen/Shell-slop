# Atlas Exercise Authoring Spec

Every quest must teach with an exercise built for ITS OWN lesson. A learner
finishing the battery quest must have written battery code; finishing the
binding-repair quest must have repaired a binding. Generic recipe exercises
are fallbacks to be replaced, not a standard to imitate.

## Where authored exercises live

`app/course/exercises/campaign{1..5}.ts`, keyed by quest id:

```ts
import type { AtlasExercise } from "./types.ts";

export const CAMPAIGN2_EXERCISES: Record<string, AtlasExercise> = {
  "battery-ac-truth": {
    starter: "…", solution: "…",
    checks: [{ label, hint, pattern }, …, …],
    rules: ["…", "…", "…"],
    explanation: ["…", "…", "…"],
  },
};
```

Blueprint data (objective, mechanism, failure, analogy, termKeys, executionTier)
lives in `app/course/atlas.ts` — the exercise must implement exactly what those
sentences promise.

## Hard constraints (enforced by scripts/verify-atlas.mjs)

1. `solution` parses as structurally valid QML under `app/course/qmlAst.ts`:
   ONE root object, matched braces, valid member syntax.
2. `solution` passes all three `checks` (patterns run against comment-stripped code).
3. `starter` must NOT pass all three checks — there must be work to do.
4. `pattern` is a RegExp SOURCE STRING inside a TS string literal: escape
   backslashes twice (`"property\\s+bool\\s+\\w+"`). Never use the `g` flag.
5. Validation: `node --experimental-strip-types scripts/verify-atlas.mjs`
   must end with `ATLAS OK`.

## Exercise design principles

- **Starter embodies the quest's `failure` sentence.** The learner repairs or
  completes it; they never start from an empty or unrelated file. A starter is
  10–25 lines that compiles conceptually but does the wrong thing (polls in a
  delegate, copies state by hand, hard-codes screen index, misses the denied
  state…).
- **Solution demonstrates the quest's `mechanism` sentence**, idiomatically,
  15–40 lines. Use domain-plausible names from the quest's topic (battery,
  sink, player, workspace) — never placeholder labels.
- **Each check verifies one teachable structure** and its `hint` names the
  exact syntax to write (a beginner should be able to act on the hint alone).
  Checks must not be satisfiable by an unrelated line elsewhere in the file:
  anchor them (e.g. require `BatteryService\\s*\\{[\\s\\S]*?\\bstate\\s*:` rather
  than a bare `state\\s*:`).
- **Execution-tier discipline:**
  - `browser-simulation`: pure QtQuick (`import QtQuick` / `QtQml`) only.
  - `static-qml-check` / `linux-wayland-runtime`: Quickshell types allowed.
    Stay within well-documented v0.3-era surface: `ShellRoot`, `PanelWindow`
    (boolean `anchors`, `exclusiveZone`, `color`, `mask: Region`), `Variants`
    + `Quickshell.screens` + `required property ShellScreen modelData`,
    `PersistentProperties`, `LazyLoader`, `IpcHandler`, `Process` (argument
    LIST, never a shell string), `ScriptModel`, `Quickshell.Services.*`
    (Pipewire, Mpris, UPower, Notifications, SystemTray). When a deep service
    API would need invention, inject it instead:
    `required property QtObject batteryService` — teaching the pattern without
    fabricating API names.
- **No prior knowledge beyond earlier quests.** If the exercise needs a JS
  construct not yet taught (`??`, arrow functions), either avoid it or have a
  check hint spell it out.

## Rules and explanation authoring

- `rules`: three imperative, quest-specific, checkable sentences. Bad:
  "Connect service, degraded, and hotplug through typed, observable state."
  Good: "Treat a missing battery as a valid state, not as 0 percent."
- `explanation`: three paragraphs of 2–4 plain-language sentences each —
  (1) what the concept is and why the shell needs it, (2) how the mechanism
  works, concretely, with the actual syntax or object names the learner will
  use, (3) the failure mode this quest exists to prevent and how to recognize
  it. Define any new jargon inline the first time it appears. Never reuse
  stock sentences across quests.

## Gold-standard example

`binding-repair-clinic` (inline override in atlas.ts): the starter hand-copies
state in an event handler (the exact failure taught), the solution replaces
the copy with a readonly derived binding, and check #3
(`onClicked\\s*:(?![\\s\\S]*label\\s*=)[\\s\\S]*online\\s*=\\s*!`) verifies the
handler no longer writes the derived value — the check IS the lesson.
