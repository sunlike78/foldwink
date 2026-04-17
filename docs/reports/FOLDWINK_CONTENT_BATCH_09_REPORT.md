# Foldwink Content Batch-09 Report

**Date:** 2026-04-18
**Pool before:** 339 puzzles (easy=185, medium=132, hard=22)
**Pool after:** 364 puzzles (+25) — easy=200, medium=140, hard=24
**Batch drafts:** 25 (IDs 0331–0353, hard-023, hard-024)

## Results

| Verdict         | Count | IDs |
|----------------|-------|-----|
| Pass            | 16    | 0333, 0336, 0337, 0338, 0339, 0341, 0342, 0344, 0345, 0347, 0348, 0349, 0350, 0351, hard-023, hard-024 |
| Revise + Accept | 9     | 0331, 0332, 0334, 0335, 0340, 0343, 0346, 0352, 0353 |
| Reject          | 0     | — |

**Non-accept rate: 36%** — above the 30% target floor, strong discipline maintained.

## Revisions Applied

| Puzzle | Issue | Fix |
|--------|-------|-----|
| 0331 | Walrus not a pod animal | → Narwhal |
| 0332 | Lenticular Truss ≠ cable-supported; Suspension Bridge duplicated in 0352 | → Rope Bridge; Suspension Bridge → Pontoon Bridge |
| 0334 | Shrubland is its own biome, not a grassland | → Steppe |
| 0335 | Emetophobia = specific phobia, not social | → Erythrophobia |
| 0340 | Track Cycling Omnium debuted 2012 not 2008; Sailing RS:X ≠ 2008 debut + colon chars | → Women's Team Sprint (confirmed Beijing 2008); Women's Steeplechase retained |
| 0343 | Aversive Conditioning is a stimulus property, not a conditioning type | → Latent Learning |
| 0346 | Sentimentalism is literary, not a visual-art movement | → Veduta |
| 0352 | Catenary is a curve shape, not a structural system | → Tensegrity |
| 0353 | Action Points belongs in turn/action economy, not resource management | → Set Collection |

Cross-batch item overlap fix: puzzle-0338 gemstone items (Ruby, Aquamarine, Emerald, Amethyst) replaced with Garnet, Lapis Lazuli, Green Tourmaline, Sugilite to avoid collision with hard-024's multi-axis false-trail design.

## Theme Coverage Added

collective nouns/animals (0331), bridge types (0332, 0352), languages by family (0333), biomes (0334), phobias (0335), writing systems (0333, 0349), cloud types (0336), literary genres (0337), gemstones by color (0338), art movements (0339, 0346), Olympic debuts (0340), heraldry (0341), architecture (0342, 0352), conditioning/psychology (0343), board game mechanics (0353), hard: existentialism/philosophy (hard-023), hard: gemstones by mineral family (hard-024)

## Gate Results

| Gate       | Result |
|-----------|--------|
| typecheck  | ✓ pass |
| test       | 119/119 across 12 suites |
| validate   | ✓ pass — 0 hard errors, 0 niche-character flags |
| build      | ✓ 459 kB JS / 149 kB gzip |

## Diversity

| Metric | Before | After |
|--------|--------|-------|
| Pool size | 339 | 364 |
| Distinct group labels | 1315 | 1415 |
| Diversity score | 0.970 | 0.972 |
| Cross-puzzle label collisions | 39 | 39 (no new collisions) |

## Open Risks

- puzzle-0350 item "Affirming the Consequent" = 24 chars (mobile layout flag, within acceptable range for medium puzzle)
- puzzle-0347 item "Girl with a Pearl Earring" = 25 chars (same — medium, acceptable)
- "Lightweight Rowing" in puzzle-0340 debuted 1996 but was dropped from Paris 2024; factually correct as debut item, editorial note added
- Arabic appears in both puzzle-0333 and puzzle-0349 — different contexts, acceptable if not in same daily rotation window

## Go / No-Go

**Go** — batch-09 passes all gates. Proceed to batch-10.
Next batch domains: geology/minerals, mythology beyond Greek/Norse, law & court vocabulary, theatre, carpentry tools, fashion eras, psychology disorders (diagnostic), space exploration milestones.
