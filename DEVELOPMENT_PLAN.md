# QML Shellcraft — Further Development Plan

Status: proposed roadmap

Baseline: commit d80e51b, 7 August 2026

Purpose: turn the current introductory adventure into a genuine zero-to-production path for building an original Quickshell desktop shell.

## Experience and visual contract

> Direction: intentional hybrid — Caelestia-led spatial continuity with End-4-led utility, discoverability, and expressive microinteraction
>
> Dominant topology: connected edge surface
>
> Signature idea: a living Shell Core powers several illustrated atlas maps; every cleared route forges a real file in one continuously runnable shell
>
> Visual grammar: wallpaper-aware semantic light/dark palette; headline, title, body, label, numeric, monospace, and icon roles; one rounded icon family; a 4/8/12/16/24/32/48 spacing ladder; micro, small, medium, large, and full radius roles; tonal depth before blur; semantic immediate, fast, exit, enter, spatial, and large-spatial motion; explicit reduced-motion and transparency-safe states

The course should feel playful, generous, and alive, but every visual flourish must teach orientation, state, causality, hierarchy, or direct manipulation. It must never become a collection of unrelated translucent cards with a game skin placed on top.

## 1. North-star outcome

The finished course must take a true beginner from “I have never written QML” to being able to design, implement, debug, validate, package, and explain an original Quickshell shell.

A graduating learner should leave with a runnable Linux/Wayland shell that contains:

- A useful per-monitor bar with workspace, active-window, clock, and status information.
- Trigger-owned popouts with correct placement, dismissal, focus restoration, and keyboard operation.
- A connected drawer or control centre with deliberate input regions and reversible motion.
- A keyboard-first launcher and search surface.
- Notifications, notification history, and OSDs.
- Real workspace/window, media, audio, power, brightness, and network integrations.
- Typed configuration, reload-safe non-sensitive state, and coherent degraded states.
- One shared action path for clicks, keyboard shortcuts, and Quickshell IPC.
- Fullscreen, hotplug, mixed-scale, portrait, reduced-motion, and accessibility policies.
- Documentation, version requirements, attribution, a validation record, and known limitations.

The learner’s final result must inherit the design principles of End-4 and Caelestia without cloning their identity. Architectural and visual ideas should be implemented independently. Any adapted code or assets must retain compatible licensing and attribution.

## 2. Honest platform promise

The browser course can teach QML concepts, simulate state and geometry, validate structured code, and assemble project files on any operating system.

Quickshell runtime work requires Linux and Wayland. The course must never imply that a browser preview or macOS simulation proves that a Quickshell shell runs correctly. Every exercise should display one of three execution badges:

1. Browser simulation — conceptual visual feedback only.
2. Static QML check — syntax, structure, types, imports, or project assembly checked without a live compositor.
3. Linux/Wayland runtime — run and verified with a supported Quickshell, Qt, and compositor combination.

Mac learners should receive a no-admin-friendly path using the browser course plus an exported project and a Linux VM, remote Linux desktop, or separate Linux machine for runtime milestones.

## 3. Current baseline

The existing release is a strong introductory prototype, not yet the complete hero journey.

| Current area | Baseline |
|---|---:|
| Campaign maps | 1 |
| Worlds | 6 |
| Quests | 26 |
| Advertised lesson time | 917 minutes, about 15.3 hours |
| Boss quests | 6 |
| Total XP | 4,140 |
| Per-quest quiz signals | 3 |
| Custom raster illustrations used by the course | 10 |
| Forge artifacts advertised | 13 |

What already works well:

- Plain-language explanations, analogies, rules, glossary terms, and annotated examples.
- A readable progression from declarative QML through bindings, components, motion, state, and early Quickshell architecture.
- Three prediction signals per quest, the five-question Quick Quiz, XP, ranks, bosses, and a review queue.
- Smart indentation, automatic pairs, keyboard shortcuts, learn/split/build focus modes, and concept previews.
- Local progress persistence, export/import, illustrated world selection, and a cumulative Forge concept.
- Direct introductory practice with ShellRoot, PanelWindow, Quickshell.screens, Variants, ShellScreen, PersistentProperties, Region masks, LazyLoader, and IpcHandler.

Why it is not yet zero-to-production:

- Twenty-six quests compress too many beginner and systems concepts into single lessons.
- Quickshell starts around quest fourteen and most real system modules are mentioned rather than implemented.
- PipeWire, MPRIS, notifications, UPower, tray, networking, compositor state, focus grabs, screencopy, and real focused-screen resolution are not built end to end.
- The audio and media examples rely on placeholders rather than a complete working service graph.
- Regex gates can be passed by malformed code or comments and do not prove parsing, types, imports, or runtime behaviour.
- Two of the three quiz signals are templated from generic patterns, so repetition can replace understanding.
- The Forge mostly exports a canned scaffold plus isolated practice files instead of progressively modifying one integrated project.
- Several promised artifacts and final-example types do not exist in the assembled project.
- Six world paintings are reused throughout; there are few technical diagrams, state comparisons, or quest-specific visual explanations.
- The main course implementation is concentrated in a single page file of more than two thousand lines, making large-scale content growth risky.

## 4. Target course shape

Build five campaign maps containing roughly 150–175 total quests and 95–130 guided hours. Around 110–130 quests should form the core route; the rest can be optional drills, bug hunts, visual studies, and challenge variants.

| Map | Purpose | Target size | Capstone |
|---|---|---:|---|
| I. Awakening Archipelago | QML foundations and one real vertical slice | 48–50 quests | Per-screen bar plus service-backed popout |
| II. System Atlas | Real Quickshell and desktop services | 30–36 quests | Live shared-service status spine |
| III. Surface Realms | Complete daily shell product surfaces | 30–36 quests | Usable bar, launcher, drawer, alerts, and session surfaces |
| IV. Expression Expanse | End-4/Caelestia design mastery and original identity | 25–30 quests | Original visual system and state gallery |
| V. Production Citadel | Reliability, security, performance, packaging, and release | 25–30 quests | Versioned v1.0 shell with evidence pack |

Maps should release region by region. The project should not wait for all five maps before learners receive deeper lessons.

## 5. Map I — Awakening Archipelago

Keep the current six world names and all useful existing lessons. Expand the map from 26 to roughly 48–50 quests so concepts are introduced, rehearsed, repaired, and applied before the boss.

### World 1: First Sparks — target 8 quests

Add or separate lessons for:

- Reading QML grammar, braces, indentation, imports, and useful error messages.
- Numbers, strings, booleans, colours, URLs, enums, lists, null, and undefined.
- Safe JavaScript expressions, conditions, arrays, objects, and simple iteration in QML.
- Dependency tracing, broken bindings, assignments, and binding-loop diagnosis.
- Required, readonly, default, and derived properties.
- Id scope, parent relationships, object lifetime, and Component.onCompleted.
- Deliberately repairing a broken first component.
- Boss: create a reactive status tile from a blank file and explain its dependency graph.

### World 2: Shape District — target 8 quests

Add or deepen:

- Parent and local coordinates, transforms, stacking order, clipping, and opacity.
- Implicit-size propagation and why reusable controls should report their natural size.
- Anchor conflicts and a repair clinic for over-constrained geometry.
- Layout negotiation, attached Layout properties, stretch, fill, and responsive constraints.
- Text metrics, elision, wrapping, localization, mixed scripts, and right-to-left layouts.
- Images, icons, fonts, cropping, aspect modes, loading, and caching.
- Component files, inline components, aliases, default properties, and explicit contracts.
- Boss: forge an accessible family of status controls that survives narrow layouts.

### World 3: Motion Arcade — target 8 quests

Add or deepen:

- Tap, hover, wheel, drag, and pointer handlers compared with MouseArea.
- FocusScope, Keys, tab order, focus restoration, and Accessible metadata.
- One reusable interaction state layer for hover, press, focus, selection, and disabled state.
- Behaviors compared with explicit animations.
- Sequential, parallel, spring-like, and staged content animation.
- Reversible transitions that continue from the current rendered value.
- Component, Loader, creation context, lifetime, and safe unloading.
- Boss: build a keyboard-accessible animated switcher whose motion reverses without jumping.

### World 4: System Frontier — target 8 quests

Make the Quickshell entry path concrete:

- Explain the relationship between Qt, QML, Quickshell, Wayland, and the compositor.
- Install and pin a tested Quickshell/Qt combination; introduce config and project layout.
- Teach qmldir files, local modules, singleton registration, and import diagnosis.
- Configure qmlls, formatting, logs, hot reload, and recovery from syntax errors.
- Keep shell.qml thin and use ShellRoot as lifecycle and composition glue.
- Compare PanelWindow, popup, floating, modal, and orchestration-window policies.
- Teach layers, exclusion zones, scale, focused-screen intent, and fullscreen policy.
- Boss: run a real bar on every screen and prove reload and hotplug behaviour.

### World 5: Living Shell — target 8 quests

Make architecture practical:

- One domain, one observer, with typed readonly service state and actions.
- Choosing a native Quickshell module before Process or shell commands.
- Streaming external data with cancellation, debounce, timeout, and bounded restart.
- System truth, user policy, UI intent, and derived view state.
- FileView, JsonAdapter, typed defaults, sparse overrides, and atomic updates.
- Safe PersistentProperties use and state that must always reset.
- Focus grabs, outside dismissal, click-through Region masks, and focus restoration.
- Boss: build a real service-backed popout with loading, empty, stale, denied, and failed states.

### World 6: Hero Forge — target 10 quests

Strengthen the current final chain:

- Author a complete visual contract and whole-screen surface map.
- Compare an End-4-led, Caelestia-led, and intentional-hybrid direction.
- Build connected geometry from one shared normalized progress value.
- Add directional gestures, thresholds, cancellation, and neighbouring-panel arbitration.
- Define semantic motion tokens, reduced motion, and low-power behaviour.
- Add per-monitor responsive rules and a coordinated fullscreen transformation.
- Use LazyLoader, stable models, deferred work, and hidden-surface suspension.
- Route visual controls, global shortcuts, and IPC through the same action layer.
- Assemble one complete service → state → UI → input → failure vertical slice.
- Boss: ship the Map I prototype with runtime, screenshot, and validation evidence.

## 6. Map II — System Atlas

Goal: replace simulated and placeholder data with real shared Quickshell services. Each region ends with a reusable service and one visible vertical slice.

### Region 1: Time, Power, and Hardware

- Clock cadence, dates, time zones, locale, and calendar models.
- Battery and AC state through the best supported native interface.
- Brightness and backlight devices, multiple devices, limits, and permissions.
- Power profiles, idle inhibition, suspend/resume, and stale values.
- CPU, memory, thermal, and storage data without aggressive polling.
- Boss: a compact power surface that behaves correctly when hardware is missing.

### Region 2: Sound Caverns

- PipeWire’s object graph and Quickshell’s corresponding models.
- Default sink/source discovery and changes.
- Volume, mute, microphone privacy, and safe clamping.
- Device switching and profile changes.
- Hotplug, disappearing nodes, denied access, and reconnect behaviour.
- Boss: a mixer shared by bar, OSD, and control centre without duplicate observers.

### Region 3: Media Orbit

- MPRIS players, playback state, and player availability.
- Active-player selection policy when several players exist.
- Play, pause, next, previous, seek, and position updates.
- Metadata, title truncation, artwork loading, caching, and hostile imagery.
- Stale players, vanished artwork, and disconnected-session handling.
- Boss: a media surface that remains useful in compact and expanded forms.

### Region 4: Signal Range

- Network state and connectivity truth.
- Wi-Fi discovery, connection actions, permission boundaries, and empty states.
- Bluetooth device discovery, pairing state, and asynchronous operation.
- VPN status and actions where the target environment supports them.
- System tray/status-notifier models and foreign icon normalization.
- Boss: a connectivity panel with clear progress, failure, and unavailable states.

### Region 5: Notification Archive

- Notification-server ownership and protocol responsibilities.
- Urgency, actions, replies, timeouts, replacement, and dismissal.
- Grouping, history, persistence, and pruning.
- Do-not-disturb and fullscreen behaviour.
- Lock-screen and privacy redaction policy.
- Boss: one notification pipeline feeding toasts, history, badges, and IPC actions.

### Region 6: Compositor Frontier

- Workspaces, active windows, titles, classes, and urgent state.
- Focused screen and focused workspace without fixed indices.
- Fullscreen, maximized, floating, and special-workspace behaviour.
- Window and workspace actions with validated arguments.
- Global shortcuts and compositor restart/reconnection.
- Boss: a live status spine whose compact bar and drawer consume the same typed services.

## 7. Map III — Surface Realms

Goal: combine real integrations into a coherent desktop product instead of a widget collection.

### Region 1: Edge Spine

- Persistent edge ownership and useful glanceable content.
- Workspace indicator, active task, clock, tray, and system status.
- Density, overflow, prioritization, and responsive collapse.
- Exclusion zones, maximized clients, and fullscreen transformation.
- Boss: a bar that remains calm, useful, and readable across screen sizes.

### Region 2: Popout Borough

- Trigger ownership and spatial origin.
- Placement, flipping, constraints, and monitor boundaries.
- Outside dismissal, focus grabs, keyboard escape, and focus restoration.
- Sliders, toggles, menus, grouped controls, and local progressive depth.
- Boss: a family of trigger-owned popouts sharing one component grammar.

### Region 3: Search Wilds

- Desktop entry and application models.
- Fuzzy search, ranking, recency, and stable list identity.
- Keyboard-first navigation and accessible result announcements.
- Commands, calculator, clipboard, file, and web providers with safe boundaries.
- Cancellation, caching, empty results, and provider failure.
- Boss: a fast launcher that never requires the pointer.

### Region 4: Drawer Delta

- Control-centre information architecture and section rhythm.
- One screen-scoped orchestration window for cooperating edge surfaces.
- Connected background geometry and content that stays legible while it deforms.
- Precise Region masks and click-through outside visible content.
- Drag progress, reversals, scroll conflicts, and neighbouring-panel arbitration.
- Boss: a connected drawer/control centre with direct manipulation and keyboard parity.

### Region 5: Alert Peaks

- Toast placement lanes and collision with other shell surfaces.
- Notification-centre history, grouping, actions, and privacy.
- OSD queues, coalescing, repeated input, and interruption.
- Media overlays, urgency, and content replacement.
- Boss: alerts that communicate quickly without stealing unnecessary focus.

### Region 6: Overview and Session Gate

- Workspace overview and window actions.
- Task switching, search, and focus return.
- Session controls with confirmation and cancellation.
- Lock, PAM, and polkit boundaries taught without weakening security.
- Authentication state that is never logged or persisted.
- Boss: a daily-driver shell containing bar, launcher, drawer, alerts, overview, and safe session surfaces.

## 8. Map IV — Expression Expanse

Goal: explicitly teach what makes End-4 and Caelestia excellent, then help the learner create a distinct visual identity.

### Region 1: Canon Observatory

- Whole-screen composition, edge ownership, negative space, and progressive depth.
- Shared End-4/Caelestia truths and their distinct expressions.
- Why generic card soup, indiscriminate blur, and decorative motion fail.
- Before/after critique exercises using representative shell states.

### Region 2: Topology Foundry

- Choose layered Material-like sheets or a connected edge surface as the dominant topology.
- Map persistent, contextual, deep, modal, session, and lock surfaces.
- Define joins, corner ownership, edge contact, and shape morphing.
- Build trigger-owned surfaces rather than arbitrary floating panels.

### Region 3: Colour Biome

- Wallpaper-derived semantic light and dark palettes.
- Background, surface tiers, on-colours, accents, outline, scrim, success, and error roles.
- Tonal depth before borders, shadows, or blur.
- Hostile-wallpaper contrast, conditional transparency, and colour transitions without flashing.

### Region 4: Type and Icon Quarter

- Headline, title, body, label, numeric, monospace, reading, and icon roles.
- Stable numbers, truncation, localization, mixed scripts, and fractional scale.
- One coherent icon family and state-dependent fill, grade, or weight.
- Normalizing application and tray artwork without distorting it.

### Region 5: Motion River

- Immediate, fast-effect, exit, enter, default-spatial, and large-spatial roles.
- Spatial causality and asymmetric arrival/dismissal.
- Ripple, hover, press, focus, selection, and content replacement.
- Reversal, interruption, reduced motion, and low-power policy.

### Region 6: Responsive Mirrorlands

- Compact, normal, narrow, portrait, ultrawide, and mixed-scale compositions.
- Per-monitor token/configuration overrides.
- Fullscreen, light/dark, transparency-disabled, and degraded variants.
- Screenshot review for keyboard focus, contrast, truncation, and density.
- Boss: an original visual system and representative state gallery scoring at least 21/28 with no rejection gate.

The visual boss must fail if any of these are present:

- Primarily unrelated floating rounded rectangles.
- Blur or opacity doing work that palette and composition should do.
- One radius, surface tone, or type treatment nearly everywhere.
- Popouts with no visible owner.
- Decorative or discontinuous motion.
- A generic Waybar-style strip with an unrelated dashboard attached.
- Accidental light, dark, fullscreen, portrait, or failure states.

## 9. Map V — Production Citadel

Goal: turn the learner’s personal shell into reliable persistent infrastructure.

### Region 1: Architecture Keep

- Thin shell.qml composition and lifecycle.
- Modules, components, services, state, config, and assets with one-way dependencies.
- Required-property dependency injection and controlled singleton use.
- Per-screen state and component registries with stable identities.
- Refactoring giant files and removing hidden cross-feature coupling.

### Region 2: Performance Mines

- Measure cold start to the first useful surface.
- Lazy loading, preloading, stable ScriptModel identity, and deferred work.
- Image analysis/caching and suspension of invisible visualizers and timers.
- GPU, CPU, and memory observation during major transitions and reload cycles.
- The threshold for a narrow C++ QML plugin after profiling proves it is necessary.

### Region 3: Resilience Range

- Hot reload and recovery from syntax errors.
- Monitor hotplug while drawers and popouts are open.
- Compositor, service, and device restart.
- Empty, malformed, delayed, denied, and failed external data.
- Cancellation, bounded backoff, and failure containment between modules.

### Region 4: Security Bastion

- Process argument arrays, validation, and avoiding unsafe shell interpolation.
- Secrets, file permissions, logs, screenshots, and IPC exposure.
- Notification and clipboard privacy in lock and presentation contexts.
- PAM, polkit, lock, and session boundaries.
- Threat scenarios and safe cancellation paths.

### Region 5: Validation Arena

- Static audit, qmlls, formatting, warnings, and import verification.
- Compact/open/loading/error state galleries in light and dark themes.
- Keyboard, pointer, touch, focus, click-through, shortcut, and IPC tests.
- One-screen, mixed-scale, portrait, hotplug, fullscreen, and compositor-restart tests.
- Service degradation, idle CPU, transition performance, reload memory, and rapid reversal.
- Accessibility and privacy evidence.

### Region 6: Release Harbor

- Quickshell, Qt, compositor, and distribution version pinning.
- API version gates and source-review dates for pre-1.0 Quickshell changes.
- Typed config migration and rollback.
- Installation, autostart, updates, uninstallation, and distro packaging.
- README, dependencies, keybindings, screenshots, troubleshooting, changelog, and attribution.
- Final boss: ship v1.0 with a test matrix, known limitations, dependency manifest, and license notices.

## 10. Standard quest loop

Every core quest should use the same learn-by-doing rhythm:

1. Motivate — show the real shell problem and why the concept matters.
2. Explain — introduce one mental model in plain language.
3. Trace — follow a binding, event, model update, or state transition.
4. Predict — answer a short retrieval question before running anything.
5. Repair — fix a deliberately broken example.
6. Build — implement the concept in the learner’s persistent project.
7. Transfer — apply it to a different surface or design situation.
8. Reflect and forge — explain the choice, record evidence, and connect the artifact.

Early quests can use fill-the-gap scaffolding. Later quests should progress through repair tasks, constrained blank files, and open specifications. Hints should fade as competence rises.

Each quest must define:

- Stable id, concept tags, prerequisites, supported version range, and expected time.
- One measurable competency and one real project artifact.
- A clear loading, empty, error, accessibility, and reduced-motion expectation when relevant.
- Six to ten authored assessment items in several formats.
- A hint ladder: nudge, relevant concept, relevant lines, partial diff, and full solution.
- A recovery task after viewing the full solution; seeing it must not automatically grant mastery.

## 11. Quiz and mastery system

Keep the current three inline signals and Quick Quiz, but rebuild their content and selection logic.

### Question formats

- Mental-model multiple choice.
- Predict the output or rendered state.
- Choose the responsible line.
- Find and repair the bug.
- Reorder lifecycle or architecture steps.
- Match concepts, owners, and persistence rules.
- Fill a binding, type, signal, or function.
- Diagnose a screenshot, input region, or animation discontinuity.
- Choose an architecture, accessibility, performance, or security tradeoff.
- Short code repair with structural validation.

### Mastery behaviour

- Write six to ten real questions per quest rather than generating generic variants.
- Tag questions by concept, difficulty, format, and prerequisite.
- Randomize option order and audit answer-position distribution.
- Add eight-to-twelve-question world checkpoints and longer boss-readiness drills.
- Evolve Quick Quiz into Weak Signals, Due Today, World Sprint, Boss Prep, and Mixed Atlas modes.
- Track attempts, last seen, confidence, hint use, solution use, and next review per concept.
- Use gentle same-day, two-day, seven-day, and twenty-one-day retrieval intervals.
- Make timers optional and never punish a learner for breaking a streak.
- Require code evidence plus reasoning, not XP grinding alone.
- Suggested world mastery gate: all required build checks and at least 80 percent concept mastery.

## 12. Editor and feedback system — highest product priority

Replace the textarea/highlight overlay with CodeMirror 6 or Monaco and a QML grammar.

Required editing experience:

- Tab and Shift-Tab indentation, smart Enter, auto-pairs, bracket matching, and selection indentation.
- QML-aware highlighting, snippets, completion, hover help, symbol search, and search/replace.
- Multi-file tabs and a project tree.
- Undo/redo, command palette, resizable panels, font controls, and keyboard-only operation.
- Side-by-side or inline diff against the starter, last checkpoint, and solution.
- Diagnostics tied to exact lines with an explanation and likely fix.
- Accessible diagnostic announcements and a high-contrast editor theme.

Run parsing and checking in a Web Worker. Prefer a QML parser, language-service output, or structured validators. Keep regex checks only as narrow fallbacks. A comment, malformed object, or unrelated property must not satisfy a mastery gate.

## 13. Forge and runtime bridge

The Forge must become one persistent virtual project rather than a set of isolated snippets.

- Every boss artifact should create or modify the actual file named in the artifact graph.
- Later quests must import and use earlier learner-built files.
- The exported archive must contain the learner’s integrated code, not mostly canned placeholders.
- The project tree should visualize dependencies among shell.qml, modules, components, services, state, and config.
- Each checkpoint should be restorable, diffable, and migration-safe.
- Use IndexedDB for the project and keep progress export/import with schema versions.

Add an optional no-admin companion tool for Linux with these responsibilities:

- doctor — report Quickshell, Qt, compositor, imports, and editor-tool versions.
- run — launch the selected course project safely.
- check — run static validation and supported runtime probes.
- capture — collect screenshots and redacted logs for evidence.
- pack — assemble the final project and validation report.

The companion must redact secrets, never upload by default, and use explicit argument arrays. Browser-only learners should still complete conceptual work while runtime badges remain honestly pending.

## 14. Gamification plan

- Add a zoomable multi-map atlas with portals unlocked by capstones.
- Reveal future map silhouettes through fog rather than hiding their existence.
- Animate completed routes and show a compact quest mini-map.
- Turn the Core companion into a context-sensitive tutor and mastery indicator.
- Add a visible competency tree for QML, composition, motion, Quickshell windows, services, product surfaces, and production.
- Keep XP and ranks as celebration; unlock competencies only from evidence.
- Make Forge artifacts real files shown in a dependency constellation.
- Add campfires for recap, side quests for depth, bounties for bug hunts, and boss incidents for integration.
- Boss incidents should include binding-loop storms, dead input masks, stranded hotplug drawers, duplicate services, fullscreen collisions, hostile wallpaper contrast, and privacy leaks.
- Add optional modifiers such as keyboard-only, reduced motion, and no hard-coded sizes.
- Keep previews open; progression should guide rather than punish.
- Do not add leaderboards, loot mechanics, dark patterns, or punitive streak loss.

## 15. Visual and image plan

Generated art should create atmosphere; precise diagrams should teach technical truth.

Create:

- One atlas panorama for each of the five maps.
- One distinct illustration for every region.
- Boss key art and feature art for audio, media, network, notifications, launcher, overview, security, performance, and release.
- Quest-specific UI anatomy plates where a still relationship matters.
- Interactive code-authored diagrams for object trees, binding graphs, service/state flow, window topology, Region masks, motion curves, and monitor matrices.
- Before/after critiques for generic card soup versus authored topology, End-4-led versus Caelestia-led expression, hostile wallpapers, fullscreen, and reduced motion.

Maintain a strict style bible for palette, perspective, Core silhouette, lighting, material language, and character proportions. Export responsive WebP or AVIF, reserve dimensions, lazy-load below the fold, use meaningful alt text, and offer low-data and reduced-motion modes. Preserve attribution for all non-generated screenshots or assets.

## 16. Accessibility and inclusion

Target WCAG 2.2 AA throughout the course.

- Complete keyboard access and visible focus.
- Correct dialog focus trapping and restoration.
- No colour-only state and contrast checks across generated themes.
- Practical 44-pixel-equivalent targets.
- Semantic landmarks, headings, labels, live regions, and skip links.
- Text zoom and reflow at 200 percent.
- Screen-reader-friendly editor and diagnostic output.
- Optional timers and no shortcut-only action.
- Course-level motion scale in addition to prefers-reduced-motion.
- Pause ambient art and replace large motion with short causal feedback.
- Test narrow/mobile layouts, keyboard only, screen readers, high contrast, and colour-vision simulations.

## 17. Course codebase architecture

Before multiplying content, split the current page monolith into a course engine and validated content.

Suggested structure:

- content/maps — map, region, quest, assessment, preview, and artifact definitions.
- content/schema — stable ids, prerequisites, concept tags, source-review date, and version support.
- course/navigation — atlas, routes, quest compass, and unlock guidance.
- course/lesson — lesson renderer, glossary, hints, and reflection.
- course/editor — editor, diagnostics, diffs, project tree, and worker bridge.
- course/mastery — question banks, scheduling, review queue, and competency state.
- course/forge — virtual file system, artifact patches, checkpoints, export, and migrations.
- course/persistence — IndexedDB, local settings, progress versions, and import/export.
- course/visualizers — browser simulations and technical diagrams.

Add automated checks for:

- Schema validity, duplicate ids, missing prerequisites, and prerequisite cycles.
- Question/explanation completeness and answer-position distribution.
- Supported-version metadata and stale Quickshell API review dates.
- Structured code gates and artifact assembly.
- Progress and project migration from the current storage format.
- Server rendering, keyboard/dialog flows, accessibility, and responsive layouts.
- Visual regressions, archive exports, broken links, image dimensions, and asset budgets.

## 18. Release sequence

### v0.1.1 — Roadmap and truth pass

- Add this roadmap.
- Replace the generic starter README with course-specific setup and architecture documentation.
- Add browser-simulation/runtime labels, a source/version page, and license/attribution notes.

### v0.2 — Course engine

- Extract typed content from the page monolith.
- Add the virtual project, IndexedDB, stable ids, and migration from current progress.
- Strengthen schema, persistence, SSR, and accessibility tests without changing the visual experience.

### v0.3 — Forge-grade editor

- Add CodeMirror or Monaco, QML grammar, multi-file project editing, diagnostics, diffs, and structural gates.
- Make every artifact change the same integrated project.

### v0.4 — Expanded Awakening

- Expand Map I to roughly 48–50 quests.
- Replace templated assessments with authored banks and spaced mastery.
- Ship the first genuinely runnable capstone and new technical diagrams.

### v0.5 — System Atlas

- Release Map II region by region.
- Add real Quickshell services, browser fixtures, and the optional companion-tool alpha.

### v0.6 — Surface Realms

- Build complete daily shell surfaces on the shared service and project foundations.
- Add incident-style bosses and a fully integrated Forge shell.

### v0.7 — Expression Expanse

- Ship the complete End-4/Caelestia design curriculum.
- Add wallpaper theming, topology labs, critique exercises, responsive state galleries, and the visual rubric.

### v0.8 — Production Citadel

- Add performance, security, resilience, validation, packaging, and release evidence.

### v1.0 — Shellwright

- Complete the graduation route and final production capstone.
- Finish accessibility, performance, documentation, migration, version, and attribution reviews.
- Consider optional private sync only after local/offline ownership is solid.

## 19. Definition of done

Every release must satisfy:

- Build, lint, and tests pass.
- Existing learner progress and project files migrate safely.
- Every new quest has authored explanation, assessment, hints, prerequisites, and a real artifact.
- Keyboard, screen-reader, reduced-motion, light/dark, and narrow-layout paths are reviewed.
- Loading, empty, disconnected, denied, and error states are intentionally designed.
- New images are optimized, accessible, within budget, and attributed where required.
- The exported project assembles without undefined promised types.
- Supported Quickshell APIs are checked against primary documentation and the tested release.
- Browser simulations and real runtime evidence are clearly distinguished.

Final graduation requires:

- Core quests and all five map capstones complete.
- At least 80 percent mastery in every core competency after delayed retrieval.
- Clean static and language-service checks for the final project.
- Linux/Wayland evidence for the required runtime matrix.
- Passing keyboard and IPC routes.
- Demonstrated degraded states and recovery.
- Completed performance, privacy, security, and accessibility checklists.
- README, setup, dependencies, keybindings, screenshots, validation record, attribution, and known limitations.

## 20. Priority order and guardrails

### Priority 0

- Extract content and stabilize schemas.
- Replace the editor.
- Build the persistent integrated Forge project.
- Deepen Map I.
- Replace templated questions with the mastery engine.

### Priority 1

- Build System Atlas.
- Add real Linux runtime guidance and the optional companion.

### Priority 2

- Build Surface Realms and Expression Expanse.

### Priority 3

- Build Production Citadel and optional private sync.

Do not prioritize social features, leaderboards, arbitrary AI tutoring, a C++ plugin, or elaborate backend sync before the learning/build loop is trustworthy.

Primary risks and mitigations:

- Scope growth — distinguish core routes from side quests and release one region at a time.
- Browser/runtime confusion — show an execution badge on every exercise and never call a simulation a runtime test.
- Quickshell API drift — pin versions, record source-review dates, and run an API review for each release.
- Quiz quantity reducing quality — require an authored-item rubric and content review.
- Asset bloat — set per-map budgets, use modern formats, lazy-load, and test transfer size.
- Progress breakage — preserve stable ids and ship tested migrations before changing schemas.
- Licensing — independently implement ideas and maintain an attribution inventory.
- Lock/authentication harm — keep sensitive state out of logs and persistence and never weaken PAM or polkit for convenience.

## 21. Success measures

Use privacy-first local measurement unless a learner explicitly opts in.

- Seven-day concept retention.
- Boss first-pass and recovery rates.
- Time from diagnostic to successful repair.
- Reduction in hint and full-solution dependence over the journey.
- Percentage of learners who export and successfully run the shell.
- Map capstone completion.
- Accessibility task completion.
- Final validation-matrix coverage.

Do not optimize for raw time on site, clicks, streak length, or XP earned. The meaningful outcome is whether the learner can independently build and maintain a coherent, dynamic Quickshell shell.

## 22. Immediate next implementation slice

The next development slice should be small enough to ship but foundational enough to prevent rework:

1. Add a course-specific README and the runtime-honesty badges.
2. Extract map, world, quest, quiz, and artifact content into typed modules with stable ids.
3. Add progress migration tests.
4. Replace the textarea editor with a QML-aware CodeMirror or Monaco prototype.
5. Turn the Forge into a persistent multi-file project for one complete Map I vertical slice.
6. Author the first expanded First Sparks chain and a real eight-to-ten-item question bank.
7. Validate the slice end to end before multiplying maps.

That slice proves the architecture, editor, assessment, persistence, and artifact loop that every later map depends on.
