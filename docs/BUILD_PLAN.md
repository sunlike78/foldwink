# Build Plan — Foldwink MVP

Smallest path from empty scaffold to public static release. Order is strict.

## Step 1 — Scaffold

- `npm create vite@latest` equivalent: manual `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/app/App.tsx`
- Install: `react`, `react-dom`, `zustand`, dev: `typescript`, `vite`, `@vitejs/plugin-react`, `vitest`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `tsx`
- Tailwind init (`tailwind.config.js`, `postcss.config.js`, directives in `src/styles/index.css`)
- Scripts: `dev`, `build`, `preview`, `typecheck`, `test`, `validate`

**Checkpoint:** `npm run dev` boots blank page.

## Step 2 — Types + sample data

- `src/game/types/*.ts` — Puzzle, PuzzleGroup, GameState, Stats
- `puzzles/pool/puzzle-0001.json` through a few bootstrap puzzles copied and adapted from `puzzles/examples/`
- `src/puzzles/loader.ts` — glob import, normalize, sorted by id
- `src/puzzles/daily.ts` — deterministic daily selection (FNV-1a hash)

**Checkpoint:** `npm run typecheck`.

## Step 3 — Pure engine

- `src/game/engine/shuffle.ts` — seedable shuffle
- `src/game/engine/submit.ts` — `findMatchingGroup`, `canSubmit`
- `src/game/engine/progress.ts` — `applyCorrectGroup`, `applyIncorrectGuess`, `isWin`, `isLoss`
- `src/game/engine/result.ts` — `calculateResultSummary`
- Tests in `src/game/engine/__tests__/*.test.ts`

**Checkpoint:** `npm test` passes (≥ 10 assertions covering submit/win/loss/daily/shuffle).

## Step 4 — Stats + persistence

- `src/stats/stats.ts` — pure stats update functions
- `src/stats/persistence.ts` — `readKey`, `writeKey` with try/catch
- Tests for stats transitions

**Checkpoint:** `npm test` green.

## Step 5 — Zustand store

- `src/game/state/store.ts` — app state: screen, mode, session, stats
- Actions: `startStandard`, `startDaily`, `toggleSelection`, `clearSelection`, `submit`, `goToMenu`, `showStats`, `startNext`
- Load stats + progress from localStorage on init

**Checkpoint:** store compiles, actions exported.

## Step 6 — UI skeleton

- `src/app/App.tsx` — screen switch
- `src/screens/MenuScreen.tsx`
- `src/screens/GameScreen.tsx`
- `src/screens/ResultScreen.tsx`
- `src/screens/StatsScreen.tsx`
- `src/components/Card.tsx`, `Grid.tsx`, `Header.tsx`, `MistakesDots.tsx`, `ResultSummary.tsx`

**Checkpoint:** one full game playable end-to-end in dev.

## Step 7 — Content pipeline

- Upgrade `scripts/validate-puzzles.ts` to point at `puzzles/pool/` with better error reporting
- Author puzzles via `puzzle-designer` + verify via `puzzle-validator` subagents
- Target: 30+ (18 easy, 12 medium)

**Checkpoint:** `npm run validate` prints success.

## Step 8 — QA sweep

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run validate`
- Manual QA against `docs/QA_CHECKLIST.md`
- Record findings in `docs/QA_NOTES.md`

## Step 9 — Release pack

- `README.md` with install/dev/build/deploy
- `docs/RELEASE_NOTES.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/DEPLOY.md`

## Definition of MVP completion

- Dev server boots; first playable within seconds
- One full game playable end-to-end
- Daily puzzle deterministic by date
- Standard progression works across sessions
- Stats persist and update correctly
- `npm run validate` passes on a pool of ≥ 30 puzzles
- `npm run typecheck` green
- `npm test` green
- `npm run build` emits a deployable `dist/`
- README and release docs present
