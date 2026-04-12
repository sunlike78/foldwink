# Architecture Plan — Foldwink MVP

Concrete build blueprint. Pair with `MVP_DECISIONS.md` (locked choices) and `BUILD_PLAN.md` (step order).

## Final folder structure

```
foldwink/
  docs/
  puzzles/
    examples/                    # reference only
    pool/                        # runtime puzzles (>=30)
  scripts/
    validate-puzzles.ts
  public/
    favicon.svg
  src/
    main.tsx
    app/
      App.tsx
    components/
      Card.tsx
      Grid.tsx
      Header.tsx
      MistakesDots.tsx
      ResultSummary.tsx
      Button.tsx
    game/
      engine/
        shuffle.ts
        submit.ts
        progress.ts
        result.ts
        __tests__/
          shuffle.test.ts
          submit.test.ts
          progress.test.ts
      state/
        store.ts                 # Zustand
      types/
        puzzle.ts
        game.ts
        stats.ts
    puzzles/
      loader.ts                  # glob import + normalize
      daily.ts                   # deterministic selection
      __tests__/
        daily.test.ts
    screens/
      MenuScreen.tsx
      GameScreen.tsx
      ResultScreen.tsx
      StatsScreen.tsx
    stats/
      stats.ts                   # pure stats updates
      persistence.ts             # localStorage wrappers
      __tests__/
        stats.test.ts
    styles/
      index.css                  # tailwind directives + tiny globals
    utils/
      hash.ts                    # FNV-1a
      date.ts                    # YYYY-MM-DD formatter
      storage.ts                 # safe JSON read/write
  index.html
  package.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
  .gitignore
  README.md
```

## Type / model notes

`src/game/types/puzzle.ts`

```ts
export type PuzzleDifficulty = "easy" | "medium";

export interface PuzzleGroup {
  id: string;
  label: string;
  items: [string, string, string, string];
  editorialNotes?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: PuzzleDifficulty;
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
  tags?: string[];
  editorialSummary?: string;
}

export interface FlatItem {
  value: string;
  groupId: string;
}
```

`src/game/types/game.ts`

```ts
export type GameMode = "daily" | "standard";
export type AppScreen = "menu" | "game" | "result" | "stats";
export type GameResult = "win" | "loss";

export interface ActiveGame {
  puzzleId: string;
  mode: GameMode;
  order: string[]; // shuffled item values (length 16)
  selection: string[]; // current selected values (<=4)
  solvedGroupIds: string[]; // accumulated solved
  mistakesUsed: number;
  startedAt: number;
  endedAt?: number;
  result?: GameResult;
}
```

`src/game/types/stats.ts`

```ts
export interface Stats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  solvedPuzzleIds: string[];
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  puzzleId: string;
  result: GameResult;
  mistakesUsed: number;
  durationMs: number;
}
```

## Module responsibilities

| Module              | Responsibility                                                                  | Allowed imports               |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------- |
| `game/engine/*`     | Pure functions on `Puzzle` + `ActiveGame`. No React, no storage, no Date.now(). | types only                    |
| `game/state/store`  | Zustand store, orchestration of engine, loader, stats.                          | engine, puzzles, stats, types |
| `puzzles/loader`    | Static import of JSON, normalize + dev validation.                              | types                         |
| `puzzles/daily`     | `getDailyPuzzleId(date, pool)` — FNV-1a hash mod length.                        | types, utils/hash             |
| `stats/stats`       | Pure updates: `applyResult(stats, result)`, streak math.                        | types                         |
| `stats/persistence` | `loadStats()`, `saveStats(s)`, safe wrappers.                                   | utils/storage, types          |
| `screens/*`         | Thin presentational containers reading store; no business logic.                | store, components             |
| `components/*`      | Stateless visual primitives.                                                    | types (for card props)        |
| `utils/*`           | hash, date, storage.                                                            | none                          |

## Planned pure logic functions

```ts
// engine/shuffle.ts
export function flattenPuzzle(p: Puzzle): FlatItem[];
export function shuffleDeterministic<T>(arr: T[], seed: number): T[];
export function shuffleItems(p: Puzzle, seed: number): string[];

// engine/submit.ts
export function canSubmit(selection: string[]): boolean; // selection.length===4
export function findMatchingGroup(selection: string[], puzzle: Puzzle): PuzzleGroup | null;

// engine/progress.ts
export function applyCorrectGroup(game: ActiveGame, groupId: string): ActiveGame;
export function applyIncorrectGuess(game: ActiveGame): ActiveGame;
export function isWin(game: ActiveGame, puzzle: Puzzle): boolean;
export function isLoss(game: ActiveGame): boolean;
export function remainingMistakes(game: ActiveGame): number; // 4 - mistakesUsed

// engine/result.ts
export interface ResultSummary {
  result: GameResult;
  mistakesUsed: number;
  durationMs: number;
  solvedGroupIds: string[];
}
export function calculateResultSummary(game: ActiveGame, endedAt: number): ResultSummary;

// puzzles/daily.ts
export function getDailyPuzzleId(date: string, pool: Puzzle[]): string;

// stats/stats.ts
export function applyGameResult(stats: Stats, r: GameResult, puzzleId: string): Stats;

// utils/hash.ts
export function fnv1a(input: string): number; // 32-bit unsigned

// utils/date.ts
export function formatDateLocal(d: Date): string; // YYYY-MM-DD
```

## Test plan (Vitest)

Required:

- `shuffle.test` — flattenPuzzle returns 16 items; shuffleDeterministic stable under same seed; different seeds differ.
- `submit.test` — `canSubmit`; `findMatchingGroup` returns correct group for exact match, null otherwise, null on partial match, null on 4 items spanning groups.
- `progress.test` — `applyCorrectGroup` appends groupId once, clears selection; `applyIncorrectGuess` increments mistakes; `isWin` only when all 4 solved; `isLoss` at 4 mistakes; `remainingMistakes` math.
- `daily.test` — same date → same id; different dates usually differ; wraps within pool length.
- `stats.test` — win increments wins + streak; loss resets streak; bestStreak tracked; solvedPuzzleIds dedup.

Target: ≥ 20 assertions total. All green before moving to content.

## Dependency list

Runtime:

- `react` ^18
- `react-dom` ^18
- `zustand` ^4

Dev:

- `typescript` ^5
- `vite` ^5
- `@vitejs/plugin-react` ^4
- `@types/react` ^18
- `@types/react-dom` ^18
- `vitest` ^1
- `tailwindcss` ^3
- `postcss` ^8
- `autoprefixer` ^10
- `tsx` ^4

No router, no testing-library, no animation lib, no date lib, no icon lib, no utility lib.

## First coding milestone

**M0.1 — bootable scaffold**

1. Write `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/app/App.tsx`, `src/styles/index.css`, `.gitignore`.
2. `npm install`
3. `npm run dev` → blank page with title "Foldwink".
4. `npm run typecheck` clean.

After M0.1, proceed to types + pure engine (Step 2+3 in BUILD_PLAN).
