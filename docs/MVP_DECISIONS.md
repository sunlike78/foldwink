# MVP Decisions — Foldwink

Locked on 2026-04-10. Any change must be justified against shipping speed and MVP scope.

## Stack

- **frontend:** React 18 + TypeScript, Vite
- **styling:** Tailwind CSS (utility-first, no custom theme framework)
- **state:** Zustand for app-level store; pure functions for all game logic
- **testing:** Vitest for pure logic; no component tests in MVP
- **package manager:** npm
- **hosting target:** static web build (any static host — Netlify / Cloudflare Pages / GitHub Pages)

## Locked decisions

### Daily selection strategy

Deterministic index into the validated local pool:
`index = hash(YYYY-MM-DD) mod pool.length`
Stable FNV-1a hash. Same date → same puzzle for all users on same build.

### Standard mode progression

Sequential through the pool starting from `puzzle-0001`. Progress cursor stored in localStorage. After the last puzzle, wrap to the first (simplest possible; no unlock logic, no shuffling).

### Persistence keys (localStorage)

- `foldwink:stats` — aggregate stats JSON
- `foldwink:progress` — standard mode cursor + solved puzzle ids
- `foldwink:daily` — map of `date -> { result, mistakes, timeMs }`
- `foldwink:settings` — reserved (not used in MVP)

Corruption handling: wrap all reads in try/catch; on parse failure, reset that key to default.

### Content source

Local JSON files in `puzzles/pool/`. Imported via Vite glob import at build time. `puzzles/examples/` kept as reference but not used at runtime.

### Validator approach

Single Node/TS script at `scripts/validate-puzzles.ts`. Run via `npm run validate` using `tsx`. Validates structure, unique ids, exactly 4 groups × 4 items, no duplicate items within a puzzle, no duplicate puzzle ids across the pool. CI-grade hard failure on any violation.

### Folder structure

```
src/
  app/              # app entry, router-like screen switch
  components/       # Card, Grid, Header, MistakesDots, ResultSummary
  game/
    engine/         # pure functions (submit, win/loss, shuffle)
    state/          # Zustand store
    types/          # Puzzle, GameState, Stats types
  puzzles/          # loader, daily selector, normalization
  screens/          # MenuScreen, GameScreen, ResultScreen, StatsScreen
  stats/            # stats logic + persistence
  styles/           # index.css with Tailwind directives
  utils/            # hash, date, storage helpers
puzzles/
  pool/             # runtime puzzle pool (30+ files)
  examples/         # unchanged reference content
scripts/
  validate-puzzles.ts
```

### Screen flow

State-based navigation via Zustand `screen` field. No `react-router`. Minimal history: back-to-menu is the single escape hatch.

### Puzzle loading

Startup normalization: load all JSON via `import.meta.glob('../puzzles/pool/*.json', { eager: true })`. Fail fast in dev if any puzzle is malformed. In prod, drop malformed entries silently and log once.

### Shuffle

Deterministic shuffle seeded by `puzzleId + dateOrAttemptIndex` for daily (one attempt per date) and `puzzleId + Date.now()` for standard (fresh shuffle each session). Tested against fixed seed.

## Risks

1. **Puzzle fairness** — the highest risk. Mitigation: every puzzle passes the validator + manual editorial check, documented in editorialSummary.
2. **Content volume** — 30 validated puzzles is the floor. Mitigation: use `puzzle-designer` + `puzzle-validator` subagents in Phase 6.
3. **Overengineering** — resisted by keeping state in Zustand, logic in pure functions, zero speculative layers.
4. **Mobile layout** — Tailwind mobile-first + grid auto-fit. QA pass in Phase 7.
5. **LocalStorage corruption** — wrapped reads with defaults.

## Nice-to-have deferred (post-MVP)

- one-away hint
- share result string
- keyboard controls
- success animation
- streak continuation grace
- themed packs

## Explicitly out of MVP

- backend, auth, accounts, leaderboards, cloud sync
- ads, IAP, monetization
- localization beyond English
- procedural generation
- animation library
- routing library
- component tests
