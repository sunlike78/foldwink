# Architecture — Foldwink MVP

## 1. Architecture intent

Build the smallest codebase that remains:

- testable
- readable
- easy to extend with more content

Do not build a general puzzle engine.

## 2. Recommended repository structure

```text
foldwink/
  .claude/
    agents/
    commands/
  docs/
  puzzles/
    examples/
  scripts/
  src/
    app/
    components/
    game/
      engine/
      state/
      types/
    puzzles/
    screens/
    stats/
    styles/
    utils/
  public/
  package.json
  vite.config.ts
  tsconfig.json
  CLAUDE.md
  README.md
```

## 3. State model

Use a small app state plus pure domain logic.

```ts
type GameMode = "daily" | "standard";
type AppScreen = "menu" | "game" | "result" | "stats";

type ActiveGameState = {
  puzzleId: string;
  mode: GameMode;
  shuffledItems: PuzzleItem[];
  solvedGroupIds: string[];
  mistakesUsed: number;
  startedAt: number;
  endedAt?: number;
  result?: "win" | "loss";
};
```

Keep transient button/hover animation state out of global state.

## 4. Pure logic boundaries

Keep these functions pure and easy to test:

- `shufflePuzzleItems(puzzle, seed?)`
- `canSubmit(selectedIds)`
- `findMatchingGroup(selectedIds, puzzle)`
- `applyCorrectGroup(gameState, groupId)`
- `applyIncorrectGuess(gameState)`
- `isWin(gameState, puzzle)`
- `isLoss(gameState)`
- `getDailyPuzzleId(date, puzzlePool)`
- `calculateResultSummary(gameState, puzzle)`

## 5. Puzzle loading

MVP:

- import local validated JSON
- normalize at app startup
- fail fast if content invalid in development

## 6. Screen flow

```text
Menu
 ├── Daily -> Game -> Result
 ├── Play  -> Game -> Result
 └── Stats
```

Keep routing internal via state unless URL routes are obviously needed.

## 7. Persistence design

Use clear namespaced keys:

```text
foldwink:stats
foldwink:settings
foldwink:solved
foldwink:daily-history
```

Persist:

- games played
- wins/losses
- streaks
- solved puzzle ids
- completed daily ids or dates

## 8. Styling architecture

Preferred:

- Tailwind CSS with light utility usage

Alternative:

- CSS Modules

Do not build a design token engine or theme framework in MVP.

## 9. Testing strategy

Required:

- Vitest tests for group validation
- win/loss
- daily selector determinism
- stats/streak update logic

Optional:

- component tests for selection count and disabled submit state
