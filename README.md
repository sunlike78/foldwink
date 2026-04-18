# Foldwink

**Version 0.4.2 — closed beta candidate, by Neural Void.**

A short daily grouping puzzle with a progressive category-reveal mechanic and a one-per-puzzle Wink action. Find 4 hidden groups of 4 in a 4×4 grid, with 4 mistakes to spare.

- **Short:** 16 cards, 4 categories of 4, 4 mistakes. One daily puzzle per local date. Medium puzzles reveal their categories one letter at a time via **Foldwink Tabs**, and once per game the player can tap a tab to **Wink** and fully reveal its category.
- **Long:** Foldwink is a small web-first grouping puzzle. The player sees a 4×4 grid of 16 cards and must identify 4 hidden groups of 4. Each mistake costs one of 4 tries. On medium puzzles, a small row of four **Foldwink Tabs** sits above the grid — each tab starts as a single-letter hint (`R··`, `F··`, `B··`, `S··`) and reveals one more letter every time the player solves a group. Once per puzzle the player may tap any unsolved tab to **Wink** it: the full category keyword is revealed instantly for that tab. Winking is optional, free of penalty, and capped at one per game — the strategic choice is _when_ to spend it. The game is text-only, mobile-first, dark-themed, and plays in 2–5 minutes. Daily mode is deterministic by local date; replays do not affect stats. Standard mode is split into independent Easy and Medium tracks as of 0.4.2. No backend, no accounts, no tracking — stats live in localStorage.
- **Content:** **500 curated puzzles** (272 easy · 194 medium · 34 hard). Every medium carries the Foldwink Tabs mechanic via per-group `revealHint` keywords. Content pipeline closed; post-launch batches may extend toward 600.
- **Progression:** Medium is visible from day one but the Medium button unlocks after **5 solved easy puzzles**. Recommendation tightens as easy win rate, average mistakes, and recent confident solves improve. Time is a secondary confidence signal only — it never gates anything. See `docs/PROGRESSION_RULES.md`.
- **Support:** `foldwink@neural-void.com` · `neural-void.com/foldwink`

## Stack

- React 18 + TypeScript + Vite
- Zustand for app state; pure functions for game logic
- Tailwind CSS
- Vitest for unit tests
- `tsx` for the puzzle validator

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default: `http://localhost:5173`).

## Scripts

| Command              | What it does                             |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Vite dev server with HMR                 |
| `npm run build`      | Typecheck + production build to `dist/`  |
| `npm run preview`    | Serve the built `dist/` locally          |
| `npm run typecheck`  | `tsc --noEmit`                           |
| `npm test`           | Run Vitest suite once                    |
| `npm run test:watch` | Vitest in watch mode                     |
| `npm run validate`   | Validate every puzzle in `puzzles/pool/` |

## Deploy

Foldwink is a fully static build. `npm run build` emits `dist/`. Drop that folder into any static host.

See [`docs/DEPLOY.md`](docs/DEPLOY.md) for platform-specific instructions.

## Project layout

```
src/
  app/              # root screen switch
  components/       # Card, Grid, Header, MistakesDots, ResultSummary, Button
  game/
    engine/         # pure game functions (+ Vitest suites)
    state/          # Zustand store
    types/          # Puzzle, ActiveGame, Stats
  puzzles/          # loader + deterministic daily selector
  screens/          # MenuScreen, GameScreen, ResultScreen, StatsScreen
  stats/            # pure stats updates + localStorage persistence
  styles/           # Tailwind entry
  utils/            # hash, date, storage
puzzles/
  pool/             # runtime JSON puzzles (shipped in the bundle)
  examples/         # reference content (unused at runtime)
scripts/
  validate-puzzles.ts
docs/
  PROJECT_SPEC.md, ARCHITECTURE.md, PUZZLE_SCHEMA.md, CONTENT_GUIDELINES.md,
  MVP_DECISIONS.md, BUILD_PLAN.md, ARCH_PLAN.md,
  QA_REPORT.md, RELEASE_NOTES.md, DEPLOY.md, KNOWN_LIMITATIONS.md, TODO.md
```

## Adding a puzzle

1. Create a new file in `puzzles/pool/puzzle-NNNN.json` following `docs/PUZZLE_SCHEMA.md`.
2. Run `npm run validate`.
3. Run `npm test` and `npm run build`.
4. Editorial pass: check fairness per `docs/CONTENT_GUIDELINES.md`.

The validator enforces exactly 4 groups × 4 items, unique ids, non-duplicate items inside a puzzle, and reasonable item length. Cross-puzzle item reuse is a warning only.

## Game rules summary

- 16 cards in a 4×4 grid
- Select exactly 4 cards, then Submit
- Correct → group is locked in with a color tint
- Incorrect → 1 mistake consumed
- 4 mistakes = loss; all 4 groups solved = win
- Daily mode: one deterministic puzzle per local date; replays don't affect stats
- Standard mode: sequential cursor through the pool, wraps on completion
- **Medium puzzles only:** Foldwink Tabs reveal categories one letter per solve; one optional **Wink** per game fully reveals a tab of your choice

## Docs index

Live:

- `docs/PUZZLE_SCHEMA.md` — puzzle JSON shape (includes Foldwink Tabs `revealHint`)
- `docs/content/PUZZLE_EDITORIAL_GUIDELINES.md` — authoring rules
- `docs/research/RESEARCH_SOURCES.md` — web-research log (domain vocabulary only)
- `docs/research/CONTENT_EXPANSION_NOTES.md` — content pipeline notes
- `docs/KNOWN_LIMITATIONS.md` — known gaps and deferred work
- `docs/RELEASE_NOTES.md` — release history
- `docs/DEPLOY.md` — deploy instructions
- `docs/reports/` — all phase reports (audit, originality, mechanic, visual, content expansion, closed-beta prep, QA checklist, final reassessment)

Historical (internal MVP archive, kept for provenance):

- `docs/PROJECT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/ARCH_PLAN.md`, `docs/BUILD_PLAN.md`, `docs/MVP_DECISIONS.md`, `docs/CONTENT_GUIDELINES.md`, `docs/MVP_TASK_GRAPH.md`, `docs/QA_REPORT.md` (0.1.0 snapshot), `docs/QA_CHECKLIST.md`, `docs/RELEASE_CHECKLIST.md`, `docs/STYLE_SYSTEM.md`, `docs/TODO.md`, `docs/POST_MVP_ROADMAP.md`

## License

Proprietary — all rights reserved. Content and code are authored for the Foldwink MVP.
