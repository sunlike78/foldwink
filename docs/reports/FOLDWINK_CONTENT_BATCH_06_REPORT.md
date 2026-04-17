# Foldwink Content Batch-06 Report

**Date:** 2026-04-17  
**Pool before:** 265 puzzles  
**Pool after:** 289 puzzles (+24)  
**Batch drafts:** 25 (IDs 0256–0280)

## Results

| Verdict | Count | IDs |
|---------|-------|-----|
| Accept  | 20    | 0256, 0260–0266, 0268–0270, 0272–0273, 0276–0280 |
| Revise + Accept | 4 | 0257, 0258, 0259, 0274 |
| Reject  | 1     | 0275 |

**Non-accept rate: 20%** (below 30% bar — second batch in a row; quality is improving, upstream filtering is working)

## Rejections

- **puzzle-0275 "Deep field"** — critical within-batch item collision: "Quasar" and "Pulsar" appeared identically in puzzle-0267 "Beyond the planets" (Deep-Sky Oddities group). Hard reject.

## Revisions

| Puzzle | Issue | Fix |
|--------|-------|-----|
| 0257 "Nine worlds" | "Kraken" is not Norse (Scandinavian sea folklore, not Eddic mythology) | Replaced with "Draugr" |
| 0258 "Land of pharaohs" | "Scarab" collides with "Scarab Beetle" in puzzle-0280 (Signs of Ra) | Replaced with "Was Scepter" |
| 0259 "Night chart" | "Andromeda" collides with puzzle-0267's Named Galaxies group (Andromeda Galaxy) | Replaced with "Cassiopeia" |
| 0274 "Asgard's own" | "Fire Skin" is non-canonical for Loki — fire association is speculative etymology | Replaced with "Fishing Net" (Loki invented it per Prose Edda) |

## Theme Coverage Added

architecture (×2), astronomy (×2), everyday, finance (×2), food (×2), garden (×3), law (×2), medical, music, mythology (×4), theatre, tools, wordplay

## Gate Results

| Gate | Result |
|------|--------|
| validate | PASS — 289 puzzles, diversity 0.968, no new label collisions |
| typecheck | PASS |
| test | 119/119 PASS |
| build | PASS — 382 kB JS |

## Notes

- Cross-pool: Cassiopeia now appears in both puzzle-0259 and pool puzzle-0034. Both are constellation contexts; no in-puzzle ambiguity but players may see the same word in two puzzles. Acceptable carry-over.
- Non-accept rate 20% < 30% for second consecutive batch. Stop-trigger noted; user direction is to continue to 500.

## Next

Batch-07 target: ~25 drafts. Avoid: astronomy (heavy), garden (3 this batch), mythology (4 this batch). 
Prioritize: sports, geography, cinema/TV, science, literature.
