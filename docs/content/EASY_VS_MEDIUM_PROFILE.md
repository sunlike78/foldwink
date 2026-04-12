# Easy vs. Medium — Cognitive Profile

This document defines the cognitive profile Foldwink uses to divide its
curated pool into the **easy** and **medium** tiers. It exists so the split
stays meaningful as the pool grows past 100, 200, and eventually 500
puzzles — without drifting into "harder = just more obscure".

Written 2026-04-11 during Sprint 5.

## 1. What easy is

Easy puzzles test **recognition**. A skilled player should be able to look
at the board, form a confident hypothesis within the first 20 seconds, and
solve the puzzle in 60–120 seconds without needing Wink (which doesn't exist
on easy anyway).

### Easy category shape

- A plain classification: "Planets", "Shades of red", "Chess pieces".
- Each item unambiguously belongs to exactly one category.
- Category labels are real, widely known, and defensible in one sentence.

### Easy item pool

- Common nouns the average literate adult recognises without translation.
- No regional slang, no specialist jargon, no pop-culture trivia with a
  half-life shorter than 10 years.
- Items in a group are broadly at the same lexical level: don't mix "dog"
  with "Shiba Inu" in the same "Pets" group.

### Easy false trails

- **Allowed**: two items in group A visually rhyme with group B's theme
  (e.g. "Mercury" the planet vs. "Mercury" the metal if Planets and Metals
  are both present).
- **Not allowed**: an item that genuinely fits two groups. Ambiguity on easy
  destroys trust faster than anything else.
- Keep false trails to at most one per puzzle on easy.

### Easy red lines

- Never gate on spelling, grammar tricks, or word-play.
- Never require the player to already know a specialist concept (e.g. "NATO
  phonetic alphabet", "philosophical movements").
- Never include a group where one item is a generic and the other three
  are specific. "Fruits / Apple, Banana, Orange, Strawberry" is fine;
  "Fruits / Apple, Banana, Orange, Honeycrisp" is not — Honeycrisp is at
  the wrong lexical level.

## 2. What medium is

Medium puzzles test **disambiguation under pressure**. The player can see
two or three plausible hypotheses on the board and has to use the Foldwink
Tabs mechanic, plus careful re-reading, to decide which is correct. The
target solve time is 120–240 seconds and a well-played medium should end
with either 0 or 1 mistakes.

### Medium category shape

- Categories are real but require a second-order read: not "Colors" but
  "Shades of red". Not "Fruits" but "Red fruits".
- `revealHint` is a keyword (not a giveaway item): `Reds`, `Fruits`,
  `Birds`, `Signals`.
- Every group ships a `revealHint` — medium is the tier that carries the
  mechanic.

### Medium item pool

- Items remain broadly recognisable but the disambiguation is harder.
- Items can lean on shared attributes, colour association, origin, or
  shared shape instead of literal category membership.
- Word-play mediums (`___ FLY`, `___ BALL`) are allowed **sparingly**.
  They gate non-native English speakers. Target ≤ 25% of the medium pool.
- Classification-shape mediums (red fruits, stop signals, extinct birds)
  should dominate the medium pool.

### Medium false trails

- Multiple items may evoke a tempting but collapsible pattern. Example:
  four items feel like "stop signals" but three of them are actually "red
  birds" and the fourth is the one thing that actually stops a car.
- The canonical solution must remain unambiguous on careful reading. A
  medium is not a brain-teaser that admits multiple valid answers.
- At most two false trails per puzzle. Beyond two, the puzzle starts to
  feel adversarial instead of clever.

### Wink-aware design

- Because Wink can fully reveal one `revealHint` at any point, the `revealHint`
  must be a _keyword_, not a giveaway item. If revealing the hint instantly
  names three of the four items, the hint is too strong and the puzzle is
  broken.
- A medium should still be solvable without Wink. Wink is a strategic aid,
  not a required crutch.

### Medium red lines

- Never introduce a group whose solution depends on a pun the player is
  unlikely to recognise in under 60 seconds.
- Never introduce a group where the category label itself is a trick (e.g.
  "Words that mean opposite of themselves" — that's a crossword-style trap,
  not a grouping puzzle).
- Never rely on current pop culture under the 10-year rule.

## 3. Authoring heuristics

When drafting a new puzzle, ask these questions in order. If any answer is
uncomfortable, rewrite or drop.

| #   | Question                                                   | Easy    | Medium       |
| --- | ---------------------------------------------------------- | ------- | ------------ |
| 1   | Can an average literate adult recognise every item?        | yes     | yes          |
| 2   | Does every item belong to exactly one of the 4 groups?     | yes     | yes          |
| 3   | Is the category label real and defensible in one sentence? | yes     | yes          |
| 4   | Is there exactly one canonical solution?                   | yes     | yes          |
| 5   | Can the player form a first hypothesis in under 20s?       | yes     | not required |
| 6   | Does at least one group have a collapsible false trail?    | allowed | required     |
| 7   | Does every group carry a meaningful `revealHint`?          | n/a     | yes          |
| 8   | Is the `revealHint` a keyword, not a giveaway item?        | n/a     | yes          |
| 9   | Can the puzzle be solved without Wink?                     | n/a     | yes          |
| 10  | Is the hardest group still solvable on careful re-reading? | yes     | yes          |

## 4. Pool balance target

For a 500-puzzle curated library, aim for this mix:

| Difficulty                  | Share  | Count   |
| --------------------------- | ------ | ------- |
| Easy                        | 55–60% | 275–300 |
| Medium                      | 35–40% | 175–200 |
| Themed / seasonal / reserve | 5–10%  | 25–50   |

Word-play mediums ≤ 25% of the medium tier.
Classification-shape mediums ≥ 75% of the medium tier.

## 5. When to reject a draft

Reject any draft that fails any of:

- two items that genuinely fit two groups
- a category label that cannot be explained in one sentence
- reliance on trivia the average player will not know
- a `revealHint` that gives away more than one item
- a word-play medium whose pun is not recognisable under pressure
- a theme signature (set of 4 label tokens) that already exists in the pool
- a label shape already used verbatim in the pool

The validator (`npm run validate`) catches structural dupes, label shape
collisions, and niche-character flags. Fairness, pun quality, and ambiguity
still need a human pass.

## 6. Why this document exists

The 98 puzzles in the pool today were authored by intuition. That works up
to ~100. It does not work up to 500: without a written profile, later
batches drift, the split between easy and medium blurs, and the curated
library starts to feel fabricated. This doc pins the intent so future
batches can be reviewed against a fixed bar, not a shifting one.
