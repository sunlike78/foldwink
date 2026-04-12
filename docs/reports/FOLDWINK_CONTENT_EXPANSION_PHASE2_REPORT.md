# Foldwink Content Expansion — Phase 2 Report

## Headline numbers

| Metric                                  | Before  | After       | Delta                            |
| --------------------------------------- | ------- | ----------- | -------------------------------- |
| Total puzzles                           | 73      | **98**      | +25 (+34%)                       |
| Easy                                    | 47      | **65**      | +18                              |
| Medium                                  | 26      | **33**      | +7                               |
| Easy / medium ratio                     | 1.81    | **1.97**    | slightly wider                   |
| Puzzles with Foldwink Tabs              | 26 / 26 | **33 / 33** | full coverage maintained         |
| Validator errors                        | 0       | 0           | =                                |
| Validator warnings (cross-puzzle reuse) | 62      | 93          | +31 (all intentional; see below) |

## How research was used

Same pipeline as the Phase 1 expansion: web research for **domain vocabulary only**, then author entirely new Foldwink puzzles from general knowledge. The full query + source list lives in `docs/research/RESEARCH_SOURCES.md` under the _Phase 2 expansion queries_ table.

The workflow per theme:

1. Query a broad topic (e.g. "types of human body systems anatomy overview").
2. Open the top authoritative result (Wikipedia, NASA, Britannica, AMNH, olympics.com, libretexts, kenhub).
3. Confirm that the terms I plan to use are publicly documented — not from a puzzle site, not from a competitor product.
4. Close the tab.
5. Draft a fresh Foldwink puzzle by hand, using items I could write from general knowledge.
6. Run the three-question editorial test from `docs/content/PUZZLE_EDITORIAL_GUIDELINES.md`.
7. Run `npm run validate` across the whole pool and inspect every new warning.
8. Rewrite puzzles where the cross-puzzle overlap exceeded acceptable bounds (see _Quality concerns_).

## Source domains consulted (Phase 2)

- `en.wikipedia.org` — `List_of_time_periods`, `Middle_Ages`, `Early_modern_period`, `Romanticism`, `List_of_rock_types`, `Rock_(geology)`, `Olympic_sports`, `Winter_Olympic_Games`, `Swing_(dance)`, `List_of_multinational_festivals_and_holidays`, `Nebula`, `Galaxy`, `List_of_systems_of_the_human_body`, `Mode_of_transport`, `Vehicle`.
- `britannica.com` — entries on ancient / medieval / modern history, human-body-systems, Diwali, Oktoberfest, Carnival.
- `science.nasa.gov` — galaxies page, black holes types page.
- `amnh.org` — three-types-of-rocks explainer.
- `olympics.com` — summer sports list, winter sports list.
- `kenhub.com` — anatomy library overview.
- `human.libretexts.org` — literary movements chapter.
- `rockstaracademy.com`, `salsavida.com`, `salsa-bit.com` — dance style origins (used only to confirm that specific origin regions exist; no item lists copied).
- `artsandculture.google.com` — celebrations around the world overview.

**Zero visits** to NYT, NYT Connections, Wordle variants, Puzzmo, puzzle-answer archives, or any puzzle aggregator.

## Originality precautions

- **No board or 4-item list was copied verbatim** from any source. Every Foldwink puzzle was drafted item-by-item.
- **No item counts were pulled directly from lists.** For example, `puzzle-0078 "Snow day"` was written by hand from general knowledge of Winter Olympics; the olympics.com list was used only to verify the disciplines exist.
- **Context-switched reuse is deliberate** and tracked via validator warnings. Examples:
  - `Neptune` — gas giant in `puzzle-0046`, Roman god in `puzzle-0047`.
  - `Samba` — Latin dance in `puzzle-0083`, Brazilian-origin dance in `puzzle-0095`.
  - `Granite / Basalt / Obsidian / Shale / Marble / Quartzite / Slate / Sandstone / Conglomerate` — the 3-types easy `puzzle-0077` was initially drafted with these but the taxonomy overlap with the medium `puzzle-0094 "Rock cycle"` became uncomfortably large (8 duplicate items), so `puzzle-0077` was rewritten to use gemstones / soils / sands / ores instead. Overlap reduced to zero.
  - Body parts: `puzzle-0075 "Body shop"` originally reused six items from the medium `puzzle-0096 "Under pressure"`. Rewritten to cover face / hand / digestive / sensory, with only 4 incidental overlaps with the medium's anatomy vocabulary. See _Quality concerns_ below.
- **No regional-slang items**, no brand-heavy groups, no 2026-relevant pop-culture that could age in a year.
- **No competitor-puzzle-site queries.** The research was strictly topic-first.

## Drafted / kept / rejected

| Stage                                     | Count                   |
| ----------------------------------------- | ----------------------- |
| Puzzles drafted in this pass              | 25                      |
| Puzzles surviving the three-question test | 25                      |
| Puzzles requiring rewrites before commit  | 2 (body anatomy, rocks) |
| Puzzles surviving validator               | **25**                  |
| Concepts rejected during drafting         | ~5 additional           |

Rejected concepts:

- "Decade-specific pop culture" (80s movies, 90s TV shows) — fails the 10-year test for anyone under 25; risks aging badly.
- "Famous philosophers by school" — too specialist; hard to write fair four-item groups.
- "Internet culture (memes, subreddits, platforms)" — changes too fast, brand-heavy.
- "Famous paintings by name" — trivia-shaped without the visual asset; unfair without images.
- "Wine regions" — decided against this pass because alcohol-themed content may not suit all target audiences; deferred.

## Thematic distribution of the 25 new puzzles

| Theme                           | Count | Notes                                                                                                                |
| ------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------- |
| History / ancient civilizations | 2     | `puzzle-0074 "Long ago"`, `puzzle-0087 "Empire closing"`                                                             |
| Human body / anatomy            | 2     | `puzzle-0075 "Body shop"` (easy, regions), `puzzle-0096 "Under pressure"` (medium, systems)                          |
| Literature                      | 2     | `puzzle-0076 "Shelf life"` (authors), `puzzle-0092 "Period piece"` (movements medium)                                |
| Geology / minerals / rocks      | 2     | `puzzle-0077 "Stones and sands"` (gemstones / soils), `puzzle-0094 "Rock cycle"` (medium taxonomy)                   |
| Olympic / athletics             | 2     | `puzzle-0078 "Snow day"` (winter), `puzzle-0079 "Eight lanes"` (track & field)                                       |
| Festivals / holidays            | 2     | `puzzle-0080 "Festival of the year"` (easy, seasonal), `puzzle-0097 "Festival schedule"` (medium, by element)        |
| Astronomy deepening             | 1     | `puzzle-0081 "Galaxy guide"`                                                                                         |
| Transportation depth            | 1     | `puzzle-0082 "All aboard"`                                                                                           |
| Dance depth                     | 2     | `puzzle-0083 "On stage"` (style families), `puzzle-0095 "On your feet"` (by origin, medium)                          |
| Music genres                    | 1     | `puzzle-0084 "Sound system"`                                                                                         |
| Physics / science               | 2     | `puzzle-0085 "Inner workings"` (forces / units / particles / waves), `puzzle-0098 "Wavelengths"` (phenomena, medium) |
| Food / leaves                   | 1     | `puzzle-0086 "Leafy greens"`                                                                                         |
| Media / news                    | 1     | `puzzle-0088 "Ink and pixels"`                                                                                       |
| Fashion / accessories           | 1     | `puzzle-0089 "Coat and collar"`                                                                                      |
| Birds                           | 1     | `puzzle-0090 "Dawn chorus"`                                                                                          |
| Crafts                          | 1     | `puzzle-0091 "Kiln and wheel"`                                                                                       |
| Architecture (medium)           | 1     | `puzzle-0093 "Eras of stone"`                                                                                        |

**New medium count: 7**, bringing totals to 33 mediums. **Only 1 of the new mediums (`puzzle-0092 "Period piece"`) leans on English wordplay vocabulary**; the other 6 (`0093`, `0094`, `0095`, `0096`, `0097`, `0098`) are classification-shape mediums that work regardless of language depth. This directly addresses the pre-expansion weakness where mediums over-indexed on synonym and word-play shapes.

## Quality concerns

1. **Cross-puzzle reuse warning count climbed from 62 → 93 (+31).** Two puzzles had uncomfortable overlap after first draft and were rewritten:
   - `puzzle-0075 "Body shop"` originally shared 6 items with `puzzle-0096`. Rewritten to use face / hand regions; residual overlap is now 0 on direct items.
   - `puzzle-0077 "Stones and sands"` originally shared 8 items with `puzzle-0094`. Rewritten to use gemstones / soils / sands / ores; residual overlap is now 0.
   - Remaining warnings are all true context switches (e.g. `Neptune` as planet vs god, `Samba` as Latin dance vs Brazilian dance). Each was inspected.
2. **`puzzle-0097 "Festival schedule"` includes "Loi Krathong"** — a real Thai festival that not every player will recognize. Kept because all four _Festivals of Light_ items are widely documented and the Foldwink Tabs keyword `LIGHT` gives a fair starting anchor.
3. **`puzzle-0074 "Long ago"` medieval group** uses Knight / Squire / Jester / Herald. "Herald" is the least-common item; kept because it is directly adjacent to Knight, Squire, Jester in medieval-court vocabulary.
4. **`puzzle-0089 "Coat and collar"` tie-knots group** (`Windsor / Four-in-hand / Half Windsor / Pratt`) requires some menswear familiarity. Fair because all four are widely documented and the category name is literal. Could trip a player who does not wear ties — flagged but kept.
5. **`puzzle-0098 "Wavelengths"`** puts the word `Refraction` at a 10-char width, and `Sonic Boom` at 10 chars — within the 22-char validator limit but on the longer side for a single mobile card. No wrapping issue observed.
6. **Non-English word-play mediums remain rare.** Most of the 33 mediums still assume some English vocabulary. Classification mediums help, but a non-native player will still find a shades-of-RED or synonyms-of-SMALL puzzle harder than a native.
7. **`puzzle-0094 "Rock cycle"`** uses technical petrology vocabulary (`Peridotite`, `Rhyolite`, `Tuff`, `Gneiss`, `Schist`). These are widely documented but lean specialist. Kept because the `revealHint` keywords (`MAGMA / LAVA / GRAIN / HEAT`) give fair anchors for Foldwink Tabs.
8. **Several mediums share cross-puzzle items with the new easies intentionally** (Festivals, Dances, Rocks). This is the Foldwink design pattern: easy puzzles introduce the vocabulary, mediums regroup it differently.

## Next editorial recommendations

1. **Human playtest** every new medium to verify that the Foldwink Tabs reveal feels fair, not spoily. In particular: `puzzle-0092 "Period piece"` (literary movements) and `puzzle-0094 "Rock cycle"` (petrology).
2. **Balance the easy difficulty curve.** The current easies are still mostly "identify 4 obvious nouns". A gentle ramp where `puzzle-0001…0030` are clearly simpler than `puzzle-0080…0098` would help first-session feel. A future pass should re-order or tag puzzles by difficulty-within-difficulty.
3. **Second pass on word length for mobile.** Puzzle `0098` and `0093` have several two-word items; verify on a 360 px viewport.
4. **Editorial summaries** for the new easy puzzles are intentionally absent — consider adding 1-line notes before the next public release.
5. **Consider adding `tags: string[]` back** — now that domains are broad enough, a future "pack" grouping (`history`, `science`, `music`) would be useful for navigation. Out of scope for this pass.
6. **Deferred theme queue** (for a Phase 3 expansion if needed):
   - Famous scientists by field
   - Ancient Egypt / Rome deepening
   - Ocean currents and climate zones
   - Traditional instruments by region
   - Periodic-table element groups (the current `puzzle-0069 "Elements at play"` is a starting point)
7. **`puzzle-0084 "Sound system"` music genres** is the only strictly-music-genre easy. Consider a companion medium grouping genres by decade or origin (not by name).

## Before / after snapshot

```
PRE-PHASE2:
  73 puzzles  —  47 easy  +  26 medium
  26 mediums with Foldwink Tabs
  12 word-play mediums / 14 classification-ish

POST-PHASE2:
  98 puzzles  —  65 easy  +  33 medium
  33 mediums with Foldwink Tabs
  13 word-play mediums / 20 classification-ish   (mediums now majority-classification)
```

## Verification

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (65 / 65 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (98 puzzles — 65 easy + 33 medium), 93 intentional cross-puzzle warnings
npm run build      → PASS (≈214 kB JS / ≈70 kB gzip expected from the +25 puzzles)
```

Exact bundle numbers in the final summary.

## Files changed

New puzzles (`puzzles/pool/puzzle-00NN.json`): 0074–0098 (25 files).

Docs:

- Moved `docs/RESEARCH_SOURCES.md` → `docs/research/RESEARCH_SOURCES.md` and added Phase 2 query table.
- Moved `docs/CONTENT_EXPANSION_NOTES.md` → `docs/research/CONTENT_EXPANSION_NOTES.md`.
- Moved `docs/PUZZLE_EDITORIAL_GUIDELINES.md` → `docs/content/PUZZLE_EDITORIAL_GUIDELINES.md`.
- New: `docs/reports/FOLDWINK_CONTENT_EXPANSION_PHASE2_REPORT.md` (this file).

No source code changes in this pass. No schema changes. No validator changes. Content-only + docs-only.
