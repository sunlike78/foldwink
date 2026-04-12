# Foldwink Content Expansion Report — 0.3.0

## Headline numbers

| Metric                                           | 0.2.0      | 0.3.0       | Delta                                  |
| ------------------------------------------------ | ---------- | ----------- | -------------------------------------- |
| Total puzzles                                    | 42         | **73**      | +31 (+74%)                             |
| Easy                                             | 26         | **47**      | +21                                    |
| Medium                                           | 16         | **26**      | +10                                    |
| Puzzles with Foldwink Tabs (medium + revealHint) | — (anchor) | **26 / 26** | full coverage                          |
| Validator errors                                 | 0          | 0           | =                                      |
| Validator warnings (cross-puzzle reuse)          | 15         | 62          | +47 (all intentional reuse, see below) |

## How web research was used

Per the strict no-copy rules laid out in the task brief, **web research was used for domain vocabulary only**, never for puzzle boards or puzzle wording. The full query + source log lives in `docs/RESEARCH_SOURCES.md`. A typical loop looked like this:

1. Query a broad domain ("list of types of clouds meteorology overview").
2. Skim the top Wikipedia / NOAA / NASA / Britannica / educational result to confirm which terms are publicly documented as belonging to that domain.
3. Close the source. Never copy a board, never copy a 4-item list verbatim.
4. Draft a fresh Foldwink puzzle by hand using 4 items I could write from general knowledge.
5. Run the three-question editorial test (see `docs/PUZZLE_EDITORIAL_GUIDELINES.md`).
6. Run `npm run validate` across the whole pool.
7. If a medium puzzle, add `revealHint` to every group.

## Categories researched

The following broad domains were queried. Per `docs/RESEARCH_SOURCES.md` each query touched only authoritative or educational sources:

- **Science:** meteorology / cloud types, solar system bodies / moons, chemical element groups, astronomy vocabulary.
- **Geography:** German regions, cities, rivers, cuisine.
- **Food:** Italian pasta shapes, German dishes, sushi, tapas, curry styles, BBQ styles.
- **Arts & language:** architectural styles, Italian musical terms (tempo / dynamics / articulation), word-formation patterns, English grammar part-of-speech sets.
- **Games:** chess openings and vocabulary, poker / go / tennis terms.
- **Technology:** programming paradigms, git vocabulary, common error taxonomies, build pipeline steps.
- **Mythology:** Greek / Roman / Norse / Egyptian pantheons.
- **Film:** film crew roles, shot types, post-production vocabulary.
- **Everyday life:** coffee drinks, pastries, citrus fruits, berries, melons, tropical fruits, workshop tools, map & hiking gear, paper currency, documents.

## Source domains consulted

Full list in `docs/RESEARCH_SOURCES.md`. High-level set:

- `en.wikipedia.org` (List of cloud types, List of pasta, List of architectural styles, Solar System, Pantheon, Programming paradigm, German cuisine, Glossary of chess, Glossary of music terminology, Film genre)
- `science.nasa.gov` (moons)
- `noaa.gov` (ten basic clouds)
- `scied.ucar.edu` (cloud types)
- `britannica.com` (solar system, pantheon)
- `britishmuseum.org` (greek/roman pantheon blog)
- `classicfm.com` (italian musical terms)
- `studiobinder.com` / `masterclass.com` (film terms)
- `germanfoods.org` (regional food)

**Zero visits** to NYT, Connections, Wordle-variants, puzzle archive sites, or answer-dump sites.

## Safety / originality precautions

- No puzzle board was ever stored to disk except originals authored for Foldwink.
- No wording was lifted verbatim. Category labels are written in Foldwink's own voice.
- Items were chosen from general knowledge, not from a shown list.
- Cross-puzzle item reuse was tracked via validator warnings and kept to contexts where the item clearly changes category type ("Earth" as element vs. planet, "Neptune" as Roman god vs. gas giant, "Silver" as metal vs. coin metal).
- The six new medium puzzles with word-play mechanics (`___ BOOK`, `___ FACE`, `___ WORD`, `___ LINE`, etc.) were authored from scratch using Foldwink's own false-trail playbook. The `___ FLY / ___ BALL / ___ POT / ___ HOUSE` board from 0.2.0 was kept and extended with `revealHint`, not re-used as a template.
- The four-pantheon puzzle (`puzzle-0047`) deliberately uses four-item canonical sets that any intro-mythology source confirms exist, but picks a fresh combination (e.g. "Athena / Hera / Poseidon / Artemis" — not the same quartet any single source lists).

## Drafted / kept / rejected counts

| Stage                                                                    | Count                  |
| ------------------------------------------------------------------------ | ---------------------- |
| Puzzles drafted in this pass                                             | 31                     |
| Puzzles surviving the three-question test                                | 31                     |
| Puzzles surviving validator                                              | **31**                 |
| Puzzles rejected during drafting (see `docs/CONTENT_EXPANSION_NOTES.md`) | ~6 additional concepts |

Rejection reasons captured: TV trivia that ages poorly, brand-heavy groups, closed lists with arbitrary subsets, philosophy/abstract categories too vague to be fair, flag pattern puzzles with unavoidable overlap.

## Quality concerns

- **Cross-puzzle warnings climbed from 15 to 62.** This is the expected cost of a larger pool with overlapping general-knowledge domains. Each warning was inspected. None of them represent a fairness problem (the items are categorized differently in their respective puzzles). The ones worth noting:
  - `io`, `europa`, `ganymede` — appear in both `puzzle-0034 "Night sky"` (moons of planets) and `puzzle-0046 "Around the sun"` (moons of Jupiter specifically). Same domain, narrower grouping in 0046. Intentional.
  - `silver` / `gold` — metals in 0038, coinage metals in 0069. Intentional refinement.
  - `neptune` — gas giant in 0046, Roman god in 0047. Classic context switch — this is exactly what the Foldwink audit called a "false-trail opportunity".
  - `logline` / `cut` — screenwriting in 0053, editing in 0064. Refinement.
  - `bratwurst` — German dish in 0049, German sausage subtype in 0063. Refinement.
- **Puzzle-0063 uses some non-English words** (`Kölsch`, `Weissbier`, `Roggenbrot`) inside group items — well-known in English food contexts but may be harder for non-European players. Flagged as a candidate for a future per-locale pack.
- **Medium puzzles with language-gated word-play** (e.g. `___ FLY`) remain harder for non-native English speakers. `revealHint` via Foldwink Tabs reduces the gap but does not eliminate it.
- **Puzzle 0073 "On a plate"** has a regional-cuisine group (BBQ Styles) that may not be recognized outside North America. Considered but kept because the four items are commonly documented.

## Recommended next editorial pass

1. **Human playtest** — one human solves every new puzzle front-to-back, and notes which medium `revealHint` strings feel like spoilers vs. genuine hints. Rewrite hints that spoil.
2. **Balance easy difficulty curve** — currently all easies are "recognize 4 concrete nouns". A gentle ramp (puzzles 0001–0010 = obvious, 0031+ = slightly trickier) would improve first-session feel.
3. **Per-pack metadata** — add `tags: string[]` back if a future packs feature materializes. Flagged intentionally as "not in 0.3.0".
4. **Language pass** — proofread every new `editorialSummary` and `revealHint`.
5. **Second mechanic exploration** — an optional "timed sprint" mode for a small subset of puzzles, not a schema change.

## Verification

```
npm run validate → PASS
  73 puzzles — 47 easy, 26 medium
  62 warnings — all cross-puzzle item reuse, inspected and intentional
  0 errors
```
