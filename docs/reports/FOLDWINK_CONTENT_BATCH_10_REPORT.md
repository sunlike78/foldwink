# Foldwink Content Batch-10 Report

**Date:** 2026-04-18  
**Batch:** batch-10  
**Pool before:** 364 (easy=200, medium=140, hard=24)  
**Pool after:** 387 (easy=213, medium=149, hard=25)  
**Promoted:** 23 of 25 drafted

---

## Sprint Summary

Batch-10 drafted 25 puzzles across fresh domains including cognitive biases, logical fallacies, comedy styles, map types, Norse mythology, famous duos, economic terms, music theory, famous psychologists, world religions, number theory, body processes, therapy types, social media formats, political systems, math branches, psychological disorders, skeletal anatomy, influencer culture, self-concepts, kitchen science, religious rituals, and famous theorems.

Validation pass: puzzle-validator reviewed 22 puzzles (3 were reviewed editorially). Result: 4 pass, 19 revise+accept, 2 reject.

---

## Promoted Puzzles (23)

| ID | Title | Difficulty | Changes |
|----|-------|------------|---------|
| puzzle-0356 | Thinking Errors | easy | Renamed Decision Biases → Behavioural Economics Biases; new items: Sunk Cost, Loss Aversion, Status Quo Bias, Endowment Effect |
| puzzle-0357 | Shape Families | easy | Renamed "Triangles by Angle" → "Types of Triangles"; "Curved Shapes" → "Conic Sections"; Spiral → Circle; 3D Solids updated to Platonic solids |
| puzzle-0358 | Holy Books | easy | Mahabharata → Ramayana (Gita is contained within Mahabharata); Sunnah → Sira (practice vs. text) |
| puzzle-0359 | Governing Institutions | easy | Minor: Ombudsman already absent in draft |
| puzzle-0360 | Bone Types | easy | Scaphoid → Sesamoid in Hand Bones (Scaphoid is a specific carpal, covered by Carpals) |
| puzzle-0361 | Professional Kitchen | easy | Bench Scraper → Dough Hook in Mixing Equipment |
| puzzle-0362 | Internet Slang | easy | Bussin → Snatched in Viral Reaction Words; Lowkey Goals → Legend in Compliments |
| puzzle-0363 | Famous Psychologists | easy | Chomsky → George Miller in Cognitive Psychologists |
| puzzle-0364 | Popular Science Concepts | easy | PASS — no changes |
| puzzle-0365 | World Religions | easy | Zen → Cao Dai in East Asian Religions (Zen is a Buddhist school) |
| puzzle-0366 | Number Theory | easy | "Types of Numbers" → "Categories of Numbers"; Prime → Complex |
| puzzle-0367 | Therapy Types | medium | Craniosacral → Sensorimotor Therapy (pseudoscience replacement) |
| puzzle-0368 | Political Systems | medium | Divine Right → State Religion; "Constitutional Forms" → "Government Structures" |
| puzzle-0369 | Body Processes | easy | Chyme → Secretion (Chyme is a substance, not a process) |
| puzzle-0371 | Math Branches | medium | PASS — no changes |
| puzzle-0372 | Psychological Disorders | medium | PASS — no changes |
| puzzle-0373 | Social Media Formats | medium | PASS — no changes |
| puzzle-0374 | Skeletal Regions | easy | Sacral → Coccygeal (Sacrum already in Pelvic Girdle group) |
| puzzle-0376 | Famous Theorems | hard | Goldbach's Conjecture → Prime Number Theorem; "Fundamental Theorem" → "Fundamental Theorem of Calculus" |
| puzzle-0377 | Influencer Culture | medium | PASS — no changes |
| puzzle-0378 | Mind and Self | medium | PASS — no changes |
| puzzle-0379 | Kitchen Science | medium | Oxidation → Rendering in Heat Reactions; Lecithin → Aioli in Emulsification |
| puzzle-0380 | Religious Rituals | medium | PASS — no changes |

---

## Rejected Puzzles (2)

| ID | Title | Reason |
|----|-------|--------|
| puzzle-0370 | Sacred Places | Al-Aqsa Mosque and Temple Mount placed in different religious groups, but they occupy the same physical location — would make a knowledgeable player feel cheated; high political sensitivity |
| puzzle-0375 | On the Spectrum (political ideologies) | Libertarianism placement as exclusively right-wing is genuinely contested on the political compass; not appropriate for a casual daily puzzle |

---

## Build Gates

| Gate | Result |
|------|--------|
| typecheck | ✓ pass |
| test | ✓ 119/119 (12 suites) |
| validate | ✓ 387 puzzles, diversity 0.970 |
| build | ✓ 478 kB JS / 154 kB gzip |

---

## Open Risks

- Cross-puzzle label collisions at 42 (up from before) — "cognitive biases", "3D solids", "conic sections" appear in 2 puzzles each. Acceptable for now; validator will escalate if trend continues.
- Internet Slang puzzle (puzzle-0362) may feel dated within 12–18 months. Acceptable for 1.0 but flagged for review.
- Diversity score 0.970 (target ≥ 0.96) — healthy, room for batch-11.

---

## Next Step

**batch-11 → target 387 → ~412** (25 new puzzles, continuing fresh domain exploration)
