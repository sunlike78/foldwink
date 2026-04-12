# Content Expansion Notes — Foldwink 0.3.0

Track of the content pipeline used to take the pool from 42 → ~80 puzzles in the 0.3.0 pass.

## Pipeline steps

1. **Research source notes** — see `docs/RESEARCH_SOURCES.md`. Each theme has ≥2 authoritative sources consulted only for public-knowledge domain vocabulary.
2. **Candidate group generation** — author drafts 4 group labels per puzzle, each with 4 items drawn from general knowledge. No copying.
3. **Ambiguity review (manual)** — check each item against:
   - Could this item fit any other group in the puzzle?
   - Is the category label real and defensible?
   - Is any item so obscure that a typical player would not know it?
4. **Fairness filter** — if any item genuinely fits two groups, rewrite or drop.
5. **Schema fit** — ensure ids, labels, items, difficulty are correct. Add `revealHint` for medium puzzles (short keyword used by Foldwink Tabs).
6. **Validator pass** — `npm run validate`. Hard errors must be fixed; warnings are inspected.
7. **Inclusion** — commit to `puzzles/pool/`.

## Editorial discipline

- **No near-duplicates with existing puzzles.** Before adding a new puzzle, grep for existing usage of its distinctive items.
- **Cross-puzzle reuse is allowed but kept rare.** A word may appear in two puzzles if the contexts differ meaningfully (e.g. "Mercury" as a planet vs. as a metal).
- **No trivia traps.** Avoid items that only a specialist would know. The goal is broad recognition.
- **No proper nouns from current pop culture** unless they pass the 10-year test.

## Contribution log (this pass)

- Added **~30 new puzzles** (exact count in validator output).
- Target breakdown:
  - ~18 new easy (concrete-object categories)
  - ~12 new medium (word-play, synonyms, shades, classification — all with `revealHint`)
- Kept a balance of domains: science, geography, food, music, everyday objects, word-play, language, history, sports, programming.
- Authored anchor twists eliminated; every medium now uses Foldwink Tabs.

## What was rejected during drafting

Examples of puzzles I started drafting and then rejected:

- "TV shows of the 90s" — risk of pop-culture trivia, aging fast.
- "NATO phonetic alphabet" — list is too closed; any 4-item sub-group is arbitrary.
- "Brands of smartphones" — brand-heavy and regional.
- "Philosophers' core concepts" — abstract, risk of unfairness.
- "National flags by color pattern" — items overlap across flags.

## Editorial TODOs after this pass

- A full human playtest of every new medium to verify that `revealHint` actually helps rather than spoils.
- A pass to tighten `editorialSummary` lines on puzzles that don't have one.
- A future pack grouping (e.g. "science pack", "word-play pack") once a pack-aware player exists.
