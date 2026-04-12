# Puzzle Editorial Guidelines — Foldwink

Short, practical editorial rules for authoring Foldwink puzzles. These supplement `docs/CONTENT_GUIDELINES.md` and `docs/PUZZLE_SCHEMA.md`.

## The three-question test (every puzzle, every group)

1. **Does every item in this group unambiguously belong to this group?** If any item could go in another group in the same puzzle, rewrite.
2. **Is the category name real and defensible?** If a reasonable adult would say "that's not a category", rewrite.
3. **Would a typical player know all four items?** If one item requires specialist knowledge (obscure trivia, deep domain, niche subculture), replace it.

## Difficulty rules

### Easy

- 4 concrete nouns per group, each clearly in one category and obviously not in any other.
- Categories are direct ("Planets", "Rivers", "Spices", "Shoes").
- No `revealHint` needed — the label itself is the hint if anything.

### Medium

- Categories may be abstract, word-play, synonyms, shades, classifications.
- At least one group should create a genuine false trail (a tempting wrong path).
- Every group **must** have `revealHint`: a short keyword (1–8 chars) shown by the Foldwink Tabs mechanic.
- `revealHint` is the _inner_ keyword of the label:
  - `"Shades of RED"` → `"RED"`
  - `"___ FLY"` → `"FLY"`
  - `"Meaning QUIET"` → `"QUIET"`
  - `"Frozen Places"` → `"POLAR"` (pick the strongest keyword)
- `revealHint` is rendered as a progressive reveal: 1 char visible at game start, +1 char per solved group, full hint after 2 solves, full label after the group itself is solved.
- A `revealHint` that spoils the group (e.g. using the literal category label for an opaque word-play category) should be replaced by its characteristic keyword.

## Reveal hint tips

- Pick a **short** keyword that the player can recognize as a category name once revealed. 3–6 chars is usually ideal.
- Do **not** use the exact item text as the reveal hint — that would give one group away.
- Two groups in the same puzzle should not share the same reveal hint.
- Uppercase is conventional.
- **Because of the Wink mechanic**, any `revealHint` can be fully shown on demand — pick keywords that feel like earned unlocks when fully revealed, not give-away answers.

## False trails

- A good false trail tempts the player with a shape that feels right but collapses on inspection.
- A bad false trail is indistinguishable from the canonical answer. Reject.

## Item style

- Prefer common nouns and everyday vocabulary.
- Keep single-word items where possible.
- Two-word items are OK if well-known (e.g. "Fountain Pen", "Iced Tea").
- Avoid hyphens and punctuation unless necessary.
- Avoid items longer than 22 characters (the validator will warn).
- Prefer title case ("Pine", "Iced Tea", "Mount Etna"). The renderer preserves case.

## Cross-puzzle item reuse

- **Allowed but rare.** Reusing an item in a clearly different category is fine ("Earth" as planet in one puzzle and as element in another).
- **Avoid** reusing items in the same category type across multiple puzzles.
- The validator emits a warning on every cross-puzzle reuse — inspect each warning to confirm it's intentional.

## Anti-patterns

- **Alphabet soup:** four items starting with the same letter. Looks thematic, rarely is.
- **Trivia wall:** all four items require specialist knowledge.
- **Opaque labels:** category labels that require the player to already know the answer to recognize them.
- **Brand-heavy groups:** resist unless the puzzle is clearly a branded pack.
- **Regional slang:** avoid unless the puzzle is regional.
- **Overlap by intent:** "things that are round AND yellow" — arbitrary intersection.

## Editorial summary

Every medium puzzle should carry `editorialSummary` — a one-sentence author note explaining what the puzzle is doing. Not shown to the player in 0.3.0 but useful for future editorial review and future surfacing.

## Submission checklist

Before committing a new puzzle file:

- [ ] `npm run validate` is green for the whole pool.
- [ ] Three-question test passed for every group.
- [ ] For mediums: every group has a unique `revealHint`.
- [ ] `editorialSummary` present if medium.
- [ ] No items longer than 22 chars.
- [ ] No item appears in another group of the same puzzle.
- [ ] At least two of four group labels do not share the same first word.
