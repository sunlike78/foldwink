# Puzzle Schema

## Canonical TypeScript shape

```ts
type PuzzleDifficulty = "easy" | "medium";

type PuzzleGroup = {
  id: string;
  label: string;
  items: [string, string, string, string];
  /**
   * Short keyword used by Foldwink Tabs on medium puzzles. The Tabs row
   * shows this hint progressively (one more letter per solved group) and
   * fully on solve or on Wink. Required on every group of a medium puzzle.
   */
  revealHint?: string;
};

type Puzzle = {
  id: string;
  title: string;
  difficulty: PuzzleDifficulty;
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
  editorialSummary?: string;
};
```

## JSON example (easy, no twist)

```json
{
  "id": "puzzle-0001",
  "title": "Starter Pack",
  "difficulty": "easy",
  "groups": [
    { "id": "planets", "label": "Planets", "items": ["Mars", "Venus", "Earth", "Jupiter"] },
    { "id": "colors", "label": "Colors", "items": ["Red", "Blue", "Green", "Yellow"] },
    { "id": "pets", "label": "Pets", "items": ["Dog", "Cat", "Hamster", "Rabbit"] },
    { "id": "sports", "label": "Sports", "items": ["Tennis", "Boxing", "Football", "Golf"] }
  ]
}
```

## JSON example (medium with Foldwink Tabs)

```json
{
  "id": "puzzle-0019",
  "title": "Red shades",
  "difficulty": "medium",
  "editorialSummary": "Four categories that all plausibly contain the word 'red' but only one actually names reds.",
  "groups": [
    {
      "id": "reds",
      "label": "Shades of red",
      "revealHint": "Reds",
      "items": ["Scarlet", "Crimson", "Ruby", "Cherry"]
    },
    {
      "id": "fruits",
      "label": "Red fruits",
      "revealHint": "Fruits",
      "items": ["Apple", "Strawberry", "Pomegranate", "Raspberry"]
    },
    {
      "id": "birds",
      "label": "Red birds",
      "revealHint": "Birds",
      "items": ["Cardinal", "Robin", "Flamingo", "Macaw"]
    },
    {
      "id": "signals",
      "label": "Stop signals",
      "revealHint": "Signals",
      "items": ["Brake", "Siren", "Alarm", "Flag"]
    }
  ]
}
```

The game renders these four hints across the Foldwink Tabs row above the grid. At stage 0 the player sees `R···` / `F·····` / `B····` / `S······`. Each correct solve reveals one more letter on every remaining tab. When a group is solved, its tab snaps to the full category `label` in its solved color.

### Wink mechanic

Once per medium puzzle the player may tap any unsolved tab to **Wink** it — that tab's `revealHint` is then shown in full immediately, regardless of the progressive-reveal stage. Only one tab can be winked per game. The winked tab is not solved — it still requires the player to find the 4 matching items. Because Wink can fully reveal a `revealHint` at any moment, authors should pick hints that feel meaningful when fully shown (a keyword, not an item).

## Validation rules (enforced by `npm run validate`)

Hard (error):

- exactly 4 groups
- each group has exactly 4 items
- every puzzle has a unique `id` across the pool
- every group has a unique `id` within the puzzle
- items must be non-empty strings
- labels must be non-empty strings
- no duplicate items across groups within a single puzzle (case-insensitive)
- difficulty must be `easy` or `medium`
- if a `revealHint` is present, it must be a non-empty string

Soft (warning):

- item length outside `[2, 22]` characters
- same item string appearing in multiple puzzles (cross-puzzle reuse — often intentional)

## Fairness checklist per puzzle

1. Is there one intended canonical solution?
2. Does any item naturally belong to more than one group?
3. Are the category labels real and defensible?
4. Are any items so obscure that they make the puzzle feel unfair?
5. Is the false trail interesting rather than trick-only?
6. For medium puzzles: does every group carry a `revealHint` short enough to fit a tab (≤ ~10 chars), and meaningful enough that revealing it via Wink still leaves a real puzzle to solve? The hint must be a category keyword, not a giveaway item.
