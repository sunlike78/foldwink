# Foldwink — Content Batch 05 Report

**Date**: 2026-04-17
**Pool size**: 241 → 265 (+24 net)

## Theme buckets used — deliberately under-covered domains

After batch-04 rejected 5 for cross-pool overlap, designer ran an explicit 100+ puzzle pool survey before drafting. Domains prioritised from validator's under-covered list:

- **Art / museum** — gallery (0231), magic show (0232)
- **Cooking techniques** — mise-en-place verbs (0233)
- **Board games / tabletop** — puzzle types (0234), tabletop RPG (0250)
- **Mythology non-basic-gods** — Chinese/Japanese culture (0235), Arthurian (0236), Greek heroes (0248)
- **Celebrations** — Halloween (0238), Western wedding (0253)
- **Tools of a trade** — automotive (0239)
- **Wellness / self-care** — spa (0243), makeup (0245)
- **Language / writing** — grammar + alphabets (0244)
- **Scents / perfume** — fragrance notes medium (0246)
- **Emotions beyond anger/sadness/fear** — wonder/pride/shame/anticipation (0247)
- **Transport by era** — Victorian through space (0252)
- **Mystery / genre** — whodunit medium (0255)
- **Everyday** — circus (0237), bed & breakfast (0240), post office (0241), wine cellar (0242), extreme sports (0254)
- **Wordplay** — SHOT polysemy (0249)

## Drafts attempted vs accepted

| Verdict                          | Count | %    |
| -------------------------------- | ----: | ---: |
| Drafted (official)               | 25    | 100% |
| Accepted outright                | 20    | 80%  |
| Revised then accepted            | 4     | 16%  |
| Rejected at validator            | 1     | 4%   |
| **Promoted to pool**             | **24**| **96%** |
| **Non-accept rate at validator** | **5** | **20%** |

**Designer pre-submission self-filter**: Before official submission, designer re-drafted 15 candidates for cross-pool collisions (detected during the 100+ puzzle survey). Counting those, effective non-accept rate from raw draft ideation = **15 pre-filter + 5 validator = 20 / 40 = 50%** across the ideation pipeline. This is healthy discipline — the filtering happened earlier in the process than batch-03/04, not less thoroughly.

### Validator stage verdicts

- **ACCEPT (20)**: 0232, 0233, 0237, 0238, 0239, 0240, 0241, 0242, 0243, 0244, 0245, 0246, 0247, 0248, 0249, 0250, 0252, 0253, 0254, 0255
- **REVISE (4)**: 0231, 0234, 0235, 0236
- **REJECT (1)**: 0251

## Rejection

### puzzle-0251 "Pastry school"

Four groups of specialist pastry vocabulary (Laminated Doughs, Classic Fillings, Meringue Types, Chocolate Work). The Meringue Types group requires knowing canonical meringue types (French / Italian / Swiss / Japanese) — 4th item "Japanese" is real in professional pastry but niche. More importantly, the whole puzzle fails the medium-shape test per EASY_VS_MEDIUM_PROFILE §2: medium difficulty should come from "disambiguation under pressure" with 2–3 plausible hypotheses on the board, not from pure domain knowledge. The 4×4 grid of pastry-school vocabulary leaves non-pastry-aware players without any hypothesis to work from. Same failure mode as batch-04's rejected 0226 "Salt and rope" (nautical specialist density).

## Revise-then-accept details

| id          | title               | change applied                                                                    |
| ----------- | ------------------- | --------------------------------------------------------------------------------- |
| puzzle-0231 | At the gallery      | Display Elements: Pedestal → Label Card (Plinth + Pedestal were near-synonyms).   |
| puzzle-0234 | Puzzle page         | Logic Puzzles: Brain Teaser → Syllogism (Brain Teaser is umbrella, not a format). |
| puzzle-0235 | Dragon and dumpling | Chinese Symbols: Lotus → Yin Yang (Lotus has strong Japanese/Buddhist dual-fit).  |
| puzzle-0236 | Round table         | Places: Tintagel → Castle; Glastonbury Tor → Forest (specialist on easy tier).    |

## Validator diversity — before vs after

| metric                        | before (241) | after (265) | delta      |
| ----------------------------- | -----------: | ----------: | ---------: |
| Puzzles                       | 241          | 265         | +24        |
| Easy                          | 132          | 148         | +16        |
| Medium                        | 89           | 97          | +8         |
| Hard                          | 20           | 20          | 0          |
| Distinct group labels         | 929          | 1025        | +96        |
| Distinct label tokens         | 879          | 976         | +97        |
| Diversity score               | 0.964        | 0.967       | **+0.003** |
| Cross-puzzle label collisions | 34           | 34          | 0 (no new) |
| Niche-character flags         | 0            | 0           | 0          |
| Metadata coverage             | 59% (143)    | 63% (167)   | +4%        |
| Medium wordplay share         | 11%          | 11%         | 0          |

Three consecutive batches of zero new verbatim label collisions. Diversity score climbed from 0.956 (pre-batch-03) → 0.967 across 3 batches (+65 puzzles) — the pool is diversifying, not inflating.

## Stop-trigger status

| trigger                                          | status                |
| ------------------------------------------------ | --------------------- |
| Non-accept rate ≥ 30% at validator               | **20%** ← FIRED       |
| Diversity score drops                            | clear (0.964 → 0.967) |
| >3 new verbatim label collisions                 | clear (0 new)         |
| Any single puzzle needs >3 revise passes         | clear (all 1-pass)    |

One of four triggers fired: validator-stage non-accept (20% < 30%). Designer's 100+ puzzle cross-check and 15 pre-submission rewrites moved the filtering upstream, lowering the validator-stage rate artificially.

Per user direction (explicitly continue toward 500), proceeding to batch-06 despite trigger. This is documented in case the tradeoff needs revisiting — if batch-06 shows further compression of the rate AND diversity score starts drifting, that would be the hard stop.

## Files

- 24 new puzzle JSON files: `puzzles/pool/puzzle-0231.json` … `puzzles/pool/puzzle-0255.json` (gap at 0251 from rejection)
- Audit trail: `docs/reports/batch-05-audit/INDEX.md`

## Gates

- `npm run validate` — **pass** (265 puzzles, 0 errors, 764 warnings — all pre-existing)
- `npm run typecheck` — **pass**
- `npm test` — **pass** (119/119, 12 suites)
- `npm run build` — **pass** (367 KB JS / 118 KB gzip)
