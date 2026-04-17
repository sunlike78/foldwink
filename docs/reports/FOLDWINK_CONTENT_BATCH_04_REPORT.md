# Foldwink — Content Batch 04 Report

**Date**: 2026-04-17
**Sprint**: Content scaling toward 500
**Pool size**: 221 → 241 (+20 net)

## Theme buckets used

### Easy (promoted 10 of 16)

- **Transportation** — trains (0206), boats (0207), aircraft (0208)
- **Clothing** — wardrobe basics (0209), footwear (0210), jewellery (0211)
- **Weather & sky** — seasons (0214) only; precipitation (0212), storms (0213), winds (0222) all rejected (heavy overlap with pool-0029, 0150)
- **Household** — cleaning day (0219), kitchen cookware (0215)
- **Medical / body** — doctor visit (0217)
- **Music / concert** — concert night (0218)
- **Office** — at the office (0220)
- **Seasonal** — day at the beach (0229, reserve)

### Medium (promoted 5 of 9)

- **Wordplay** — jacket (0221), pan (0224), station (0227)
- **Classification** — organ systems (0223), head-to-toe accessories (0225), song anatomy (0228)
- Rejected: wind names (0222), feeling blue (0230) — both pool-overlap issues

## Drafts attempted vs. accepted

| Verdict                       | Count | %    |
| ----------------------------- | ----: | ---: |
| Drafted                       | 25    | 100% |
| Accepted outright             | 15    | 60%  |
| Revised then accepted         | 5     | 20%  |
| Rejected                      | 5     | 20%  |
| **Promoted to pool**          | **20**| **80%** |
| **Non-accept rate**           | **10**| **40%** |
| **Pure-reject rate**          | **5** | **20%** |

Both non-accept rate (40%) and pure-reject rate (20%) clear the discipline bars. Pure-reject 20% is up from batch-03's 16% — the validator caught cross-pool theme-signature collisions that the designer missed because the designer did not run a pool-signature cross-check before submitting drafts.

## Rejection reasons

| id          | title               | reason                                                                                                                            |
| ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| puzzle-0212 | What falls from sky | Near-duplicate with pool-0150 "Weather report" — 3 of 4 Sky Phenomena items verbatim; Graupel/Rime specialist on easy.             |
| puzzle-0213 | Storm warnings      | Near-duplicate with pool-0029 axes; Hurricane/Cyclone/Typhoon are the same phenomenon regionally renamed.                          |
| puzzle-0216 | Coast to coast      | Tentacled Creatures group verbatim copy of pool-0054 Cephalopods; Marine Iguana Galapagos-specialist on easy.                     |
| puzzle-0222 | Wind has a name     | Storm-Strength Gusts shares 3 of 4 items with pool-0150 Wind Types; Zephyr alt-hypothesis conflict with Named Regional Winds.     |
| puzzle-0230 | Feeling blue        | Near-duplicate with pool-0125 "Deep blue" (which has a group literally labelled "Feeling blue"); Indigo dual-fit; surface-"Blue" telegraphs. |

## Revise-then-accept details

| id          | title            | change applied                                                                                 |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| puzzle-0211 | Jewellery box    | Ring Types items cleaned (drop "Ring" suffix): Wedding/Signet/Pinky/Thumb; Charm → Cuff in Wrist. |
| puzzle-0218 | Concert night    | Musician's Gear: Mute → Case, Tuner → Strap (disambiguate generic-English items).              |
| puzzle-0219 | Cleaning day     | Trash & Recycling: Dustpan → Trash Bag (Dustpan belongs in Cleaning Tools with Broom).         |
| puzzle-0224 | Pan across       | Label syntax varied: "Pan the Cookware / Camera Pan / Pan the Review / Panning for Gold" — breaks uniform-label telegraph. |
| puzzle-0228 | Anatomy of a song| Song Structure: Bridge → Outro (Bridge collides with pool-0127 "Bridge club" wordplay centre).  |

## Validator diversity — before vs. after

| metric                        | before (221) | after (241) | delta      |
| ----------------------------- | -----------: | ----------: | ---------: |
| Puzzles                       | 221          | 241         | +20        |
| Easy                          | 119          | 132         | +13        |
| Medium                        | 82           | 89          | +7         |
| Hard                          | 20           | 20          | 0          |
| Distinct group labels         | 849          | 929         | +80        |
| Distinct label tokens         | 816          | 879         | +63        |
| Diversity score               | 0.960        | 0.964       | **+0.004** |
| Cross-puzzle label collisions | 34           | 34          | 0 (no new) |
| Niche-character flags         | 0            | 0           | 0          |
| Metadata coverage             | 56% (123)    | 59% (143)   | +3%        |
| Medium wordplay share         | 12% (10/82)  | 11% (10/89) | –1%        |

Diversity score climbed again. Zero new label collisions. Medium wordplay share decreased because the validator's wordplay counter tracks `meta.wordplay === true` (boolean flag we don't set); meta.categoryType="wordplay" on the three new wordplay mediums isn't counted by the script. Script improvement candidate, not a pool-quality issue.

## Process feedback for batch-05

The validator report flagged an important process gap: **the designer did not cross-check draft theme signatures against the existing pool before submitting**. Five puzzles were rejected for near-duplication with pool-0029 / 0054 / 0125 / 0127 / 0150. Per BATCH_WORKFLOW, this is the "reviewer fatigue / same-shape" signal — not a quality failure of the designer, but a missing step.

**Fix for batch-05**: designer briefing must include explicit pool cross-check. Under-covered domains per validator: art / museum, cooking techniques, board games, sports-by-tier, mythology, transport-by-era, scents, emotions, constellations, celebrations, tools-of-a-trade not yet covered. Avoid: weather, marine, clothing (all saturated after batch-04).

## Stop-trigger status (all clear — continue)

- Non-accept rate 40% ≥ 30% ✓
- Pure-reject rate 20% ≥ 10% ✓
- Diversity score 0.964 > 0.960 ✓
- New label collisions = 0 ≤ 3 ✓
- Max revise passes per puzzle = 1 ≤ 3 ✓

Continue to batch-05, target 241 → 260.

## Files

- 20 new puzzle JSON files: `puzzles/pool/puzzle-0206.json` … `puzzles/pool/puzzle-0229.json` (gaps at 0212, 0213, 0216, 0222, 0230 from rejections)
- Audit trail: `docs/reports/batch-04-audit/INDEX.md`, `VALIDATOR_REPORT.md`

## Gates

- `npm run validate` — **pass** (241 puzzles, 0 errors, 726 warnings — all pre-existing cross-puzzle warnings; no new ones)
- `npm run typecheck` — **pass**
- `npm test` — **pass** (119/119, 12 suites)
- `npm run build` — **pass** (350 KB JS / 113 KB gzip; +13 KB for 20 new puzzles)
