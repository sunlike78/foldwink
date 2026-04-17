# Foldwink — Content Batch 03 Report

**Date**: 2026-04-17
**Sprint**: Content scaling toward 500
**Pool size**: 200 → 221 (+21 net)

## Theme buckets used

### Easy (new domains)

- **Nature** — dinosaurs (plant / meat / marine / flying), reptile house (venomous / constrictor / lizards / mythical)
- **Food & everyday** — Italian table (pasta / pizza / antipasti / dolci), grocery shopping aisles, salon day (hair styles + tools), desk setup, gym equipment, birthday bash supplies
- **History** — sacred spaces (Christian / Islamic / Eastern / Ancient buildings)
- **Everyday life** — back to school, down on the farm, once upon a time (fairy tales), signs and signals (road signs)
- **Seasonal** — spring has sprung (weather / flowers / activities / critters) — reserve slot

### Medium

- **Polysemy (4 puzzles)** — bark, bolt, bat, seal (attribute-type)
- **Synonym clusters (2 puzzles)** — meanings of rich, feelings ladder (emotion families)
- **Wordplay (1 puzzle)** — "take a walk" compound (boardwalk / moonwalk / jaywalk / sidewalk)
- Dropped from batch: warm palette classification (real pink–purple bleed)

### Reserve

- Spring has sprung (seasonal, accepted)
- Comes in pairs (rejected — adversarial literal-vs-linguistic pair mixing)

## Drafts attempted vs. accepted

| Verdict                       | Count | %    |
| ----------------------------- | ----: | ---: |
| Drafted                       | 25    | 100% |
| Accepted outright             | 15    | 60%  |
| Revised then accepted         | 6     | 24%  |
| Rejected                      | 4     | 16%  |
| **Promoted to pool**          | **21**| **84%** |
| **Non-accept rate**           | **10**| **40%** |

Non-accept 40% clears the BATCH_WORKFLOW 30% discipline bar. Pure-rejection rate 16% alone is below 30%, which would be a concern in isolation — noted and tracked. Five of six revise items were small item-swaps or relabels that did not require redesign.

## Rejection reasons

| id          | title            | difficulty  | rejection reason                                                                       |
| ----------- | ---------------- | ----------- | -------------------------------------------------------------------------------------- |
| puzzle-0188 | Martial origins  | easy        | Four specialist-jargon items (Hwa Rang Do, Tang Soo Do, Luta Livre, Vale Tudo) — easy red line violation on two full groups. |
| puzzle-0190 | On two wheels    | easy        | BMX / MTB discipline boundaries genuinely blurred (Dirt Jump is both; Halfpipe ⊂ Freestyle BMX). Multi-hypothesis grouping. |
| puzzle-0201 | Warm palette     | medium      | Title advertises "warm" but ships PURPLE; Fuchsia / Mauve / Lilac / Rose on a continuous pink–purple gradient — not a single-canonical partition. |
| puzzle-0205 | Comes in pairs   | easy (exp.) | Conceptually muddled — literal organ pairs mixed with linguistic "a pair of" singulars; clever but adversarial for easy tier. |

## Revise-then-accept details

| id          | title            | change applied                                                                                 |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| puzzle-0183 | Sacred spaces    | Mausoleum → Caravanserai (Islamic); Pantheon → Colosseum (Ancient). Fixes cross-cultural ambiguity. |
| puzzle-0187 | Reptile house    | Retitled from "Serpent studies"; "Mythical Serpents" → "Mythical Reptiles". Fixes theme–leg mismatch. |
| puzzle-0189 | Salon day        | Layers → Beach Waves (Long Hair). Layers could also mean layered bob.                          |
| puzzle-0193 | Birthday bash    | "Wrapping a Gift" label → "Gift Wrapping". Gerund → noun phrase, matches siblings.             |
| puzzle-0199 | Swing of the bat | Wink → Lash Flick (eyelash group). Mechanic-name collision with Foldwink Wink.                 |
| puzzle-0202 | Feelings ladder  | Anxious → Frightened (AFRAID group). Anxious overlaps sadness axis.                            |

## Validator diversity — before vs. after

| metric                        | before (200) | after (221) | delta    |
| ----------------------------- | -----------: | ----------: | -------: |
| Puzzles                       | 200          | 221         | +21      |
| Easy                          | 105          | 119         | +14      |
| Medium                        | 75           | 82          | +7       |
| Hard                          | 20           | 20          | 0        |
| Distinct group labels         | 765          | 849         | +84      |
| Distinct label tokens         | 731          | 816         | +85      |
| Diversity score               | 0.956        | 0.960       | **+0.004** |
| Cross-puzzle label collisions | 34           | 34          | 0 (no new) |
| Niche-character flags         | 0            | 0           | 0        |
| Metadata coverage             | 51% (102)    | 56% (123)   | +5%      |
| Medium wordplay share         | 12% (9/75)   | 12% (10/82) | 0        |

Diversity moved up, which confirms the batch adds shape rather than inflating the pool. Cross-puzzle label collisions unchanged — batch-03 introduced zero new verbatim label collisions with the existing 34.

## Editorial signals

- **No new verbatim label collisions.** The 31 banned labels from the pre-batch snapshot were respected.
- **Niche-character flags = 0.** `Piñata` (puzzle-0193) passes — the validator regex admits `\p{L}` Unicode letters. No change needed; safe as-is.
- **Medium shape diversification.** The pool's last 30 puzzles (0151–0180) were heavily polysemy-medium. Batch-03 adds 15 classification easies + 2 synonym-cluster mediums — welcome shape shift. Polysemy continues in this batch (bark / bolt / bat / seal) but alongside new medium shapes.
- **Item reuse ≤ 2** across all new puzzles. Python (snake / programming), Pyramid (monument / games / Egypt / batch-03 Ancient), Sprint (athletic / flee), Monitor (lizard / display) are flagged as intentional cross-context reuses.

## Decision on next milestone

**Continue toward the 250 milestone.** Rationale:

- Discipline held: 40% non-accept rate, zero new label collisions, diversity score went up.
- Domains still obviously unexplored: transportation (trains / ships), clothing, weather vocabulary, kitchen tools (non-cutting), board games, music genres beyond the existing pool.
- Hard tier untouched this batch; separate cadence needed for hard (20 → 50 target).

**Stop-at-next-milestone trigger conditions** (per BATCH_WORKFLOW): stop if the next batch produces any of:

- Non-accept rate drops below 30%
- Diversity score drops
- More than 3 cross-puzzle verbatim label collisions introduced
- Any single puzzle needs more than 3 revise passes

If any trigger fires at 250, freeze at 250 and ship.

## Files

- 21 new puzzle JSON files: `puzzles/pool/puzzle-0181.json` … `puzzle-0204.json` (gaps at 0188, 0190, 0201 from rejections)
- Draft artifacts retained for audit at `puzzles/pool/_drafts/batch-03/` — INDEX.md, VALIDATOR_REPORT.md, 21 promoted files mirrored there
- Rejected drafts (0188, 0190, 0201, 0205) deleted from drafts folder — the validator report preserves the reasons on record

## Gates

- `npm run validate` — **pass** (221 puzzles, 0 errors, 630 warnings — all pre-existing collision warnings)
- `npm run typecheck` — **pass**
- `npm test` — **pass** (119/119, 12 suites)
- `npm run build` — **pass** (318 modules, 337 KB JS / 108 KB gzip)
- `npm run lint` / `npm run format:check` — not run on drafts; will run on final commit
