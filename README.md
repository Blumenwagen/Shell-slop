# QML Shellcraft

QML Shellcraft is a private, game-like course that takes a beginner from their first QML object to an original, validated Quickshell desktop shell. The curriculum studies the spatial continuity of Caelestia and the expressive utility of End-4 as design canon, then asks learners to create their own visual identity instead of cloning either project.

## The campaign

The course contains five illustrated maps and roughly 160 quests:

1. **Awakening Archipelago** — QML foundations and one complete Quickshell vertical slice.
2. **System Atlas** — shared services for power, audio, media, connectivity, notifications, and compositor state.
3. **Surface Realms** — a bar, popouts, launcher, connected drawer, alerts, overview, and session surfaces.
4. **Expression Expanse** — topology, colour, typography, iconography, motion, responsive states, and visual critique.
5. **Production Citadel** — architecture, performance, resilience, security, validation, packaging, and release.

Each quest moves through motivation, explanation, tracing, prediction, repair, building, transfer, and reflection. Six authored quiz signals, structural QML diagnostics, spaced review modes, boss incidents, and a cumulative Forge project turn progress into evidence rather than XP grinding.

## Runtime truth

The course distinguishes three execution levels:

- **Browser simulation** teaches concepts and works on macOS, Windows, and Linux.
- **Static QML check** validates structure without claiming a live compositor result.
- **Linux runtime** requires Quickshell on Linux/Wayland and real runtime evidence.

Quickshell does not run natively as a macOS shell. Mac learners can complete the browser curriculum and use a Linux VM, remote Linux host, or separate Linux installation for runtime graduation.

## Local development

Requirements: Node.js 22.13 or later and the dependencies recorded in `package.json`.

```bash
npm install
npm run dev
```

Validation:

```bash
npm run build
node --test tests/rendered-html.test.mjs
npm run lint
```

## Project structure

- `app/page.tsx` — current course shell and lesson renderer.
- `app/course/atlas.ts` — typed five-map curriculum and authored assessment banks.
- `app/course/editor.ts` — browser-safe structural QML diagnostics.
- `app/course/mastery.ts` — concept mastery and spaced-review selection.
- `app/course/forge.ts` — cumulative, exportable Quickshell project generator.
- `public/` — illustrated maps and learning art.
- `DEVELOPMENT_PLAN.md` — product direction, remaining milestones, and release gates.

Progress is local-first and exportable. No account or analytics backend is required.

## Design and licensing

The generated learning scaffold independently implements design principles associated with End-4 and Caelestia. It does not copy their identity or source code. If future course material adapts third-party code, screenshots, or assets, preserve the source license and attribution in the exported project.
