# Foldwink Content Batch-07 Report

**Date:** 2026-04-17  
**Pool before:** 289 puzzles  
**Pool after:** 314 puzzles (+25)  
**Batch drafts:** 25 (IDs 0281–0305)

## Results

| Verdict | Count | IDs |
|---------|-------|-----|
| Accept  | 4     | 0284, 0291, 0293, 0294 |
| Revise + Accept | 19 | 0281–0283, 0285, 0287–0290, 0292, 0295–0298, 0300–0305 |
| Reject + Redraft | 2 | 0286, 0299 |

**Non-accept rate: 84%** — healthy, high validator engagement.

## Rejections

- **puzzle-0286 "South of the Equator"** — title made a geographic claim violated by 3 items (Caracas at 10°N, Quito on equator, Orinoco drains north of equator). Replaced with "African regions" (countries by subregion).
- **puzzle-0299 "Verse Forms"** — category "Single-Stanza Lyric Forms" factually wrong for 3/4 items (Pantoum, Rondeau, Ghazal are all multi-stanza). Replaced with "Story building blocks" (plot/character/perspective/conflict).

## Key Revisions

| Puzzle | Issue | Fix |
|--------|-------|-----|
| 0283 | Pelota not a racket sport | → Squash |
| 0285 | Caution=Yellow Card, Sending Off=Red Card (synonyms in same group) | → Suspension, Points Deduction |
| 0287 | Zambezi+Limpopo are Southern Africa, not East | → Jubba, Awash |
| 0289 | Brunei not an island nation | → Indonesia |
| 0290 | Poland eagle only on state flag, not civil | → Mexico |
| 0295 | Hydrogen Bond is intermolecular force, not primary bond | → Coordinate Bond |
| 0296 | Calculus disputed (Leibniz co-inventor), Kinetic Theory not Maxwell's alone | → Reflecting Telescope, Displacement Current |
| 0297 | Muscle Cell + Muscle Tissue in same puzzle (conceptual loop) | → Adipocyte; standardised tissue names |
| 0298 | Lithosphere ≠ Mantle Zone; Moho = boundary, not crust type | → Transition Zone, Granite Layer |
| 0302 | Missing diacritics on 4 names | Fixed: Pär, François, Wisława, José |
| 0303 | "Hanging Gardens" truncated | → "Hanging Gardens of Babylon" |
| 0304 | Fashion Capitals excluded Paris/London/NYC | → Big Four: Paris, Milan, London, New York |

## Theme Coverage Added

sports (×5), geography (×5), cinema/TV (×4), science (×4), literature (×4), history (×1), fashion (×1), cooking (×1)

## Gate Results

| Gate | Result |
|------|--------|
| validate | PASS — 314 puzzles, diversity 0.968 |
| typecheck | PASS |
| test | 119/119 PASS |
| build | PASS |

## Notes

- Long-item warnings on 0294, 0296, 0303 (item names >22 chars): items will render on mobile but may wrap. Flag for future editorial trim.
- Label collision: puzzle-0284 shares "soccer positions" label with pool-0056 — pre-existing carry-over, no blocker.

## Next

Batch-08 target: ~25 drafts. Prioritize: history (ancient, medieval, modern), music (genres, instruments, composers), nature (animals, ecosystems), technology, food/cooking.  
Avoid: sports (5 this batch), geography (5 this batch), cinema/TV (4 this batch).
