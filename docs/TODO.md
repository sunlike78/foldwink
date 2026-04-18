# TODO — Foldwink

## Current phase

**Content scaling — batch-10 merged (387 curated puzzles).**

- 387 curated puzzles (easy=213, medium=149, hard=25) — target 500
- Diversity score: 0.970
- Batch-10: 25 drafted → 23 promoted (4 pass + 19 revise+accept + 2 reject)
- Rejected: Sacred Places (factual/political), On the Spectrum political ideologies (too contested)
- Fresh domains: cognitive biases, fabrics, logical fallacies, comedy styles, map types, Norse mythology, famous duos, economic terms, music theory, famous psychologists, world religions, number theory, body processes, therapy types, social media formats, political systems, math branches, psychological disorders, skeletal anatomy, influencer culture, self-concepts, kitchen science, religious rituals, famous theorems
- Latest report: `docs/reports/FOLDWINK_CONTENT_BATCH_10_REPORT.md`

## In progress

(none)

## Next — before public free launch

### Human-only tasks (cannot be automated)

- [ ] **H11** First human in-browser QA pass — phone + desktop against `docs/ITCH_QA_CHECKLIST.md`
- [ ] **S1** Sound ear pass — listen to all 9 cues on speakers + headphones. Use `scripts/preview-sounds.html`.
- [ ] **S2** Share card visual pass — render all 5 scenarios. Use `scripts/preview-share-cards.html`.
- [ ] **H2** Raster 1200×630 OG image (PNG/JPG) alongside `public/og.svg`. Human-art task.
- [ ] Real designed wordmark / logotype. Human-art task.
- [ ] Deploy `dist/` to `neural-void.com/foldwink`. Branding text already points there.

### Code-doable if time

- [ ] Itch.io draft upload + in-iframe verification
- [ ] Colour-blind palette audit (solved group tints + shape markers already exist)
- [ ] Screen-reader audit of game flow

## Queue — after public free

### Content (in flight — batches 03/04/05 merged 2026-04-17)

- [x] batch-03 → 200 → 221 (docs/reports/FOLDWINK_CONTENT_BATCH_03_REPORT.md)
- [x] batch-04 → 221 → 241 (docs/reports/FOLDWINK_CONTENT_BATCH_04_REPORT.md)
- [x] batch-05 → 241 → 265 (docs/reports/FOLDWINK_CONTENT_BATCH_05_REPORT.md)
- [x] batch-06 → 265 → 289 (docs/reports/FOLDWINK_CONTENT_BATCH_06_REPORT.md)
- [x] batch-07 → 289 → 314 (docs/reports/FOLDWINK_CONTENT_BATCH_07_REPORT.md)
- [x] batch-08 → 314 → 339 (docs/reports/FOLDWINK_CONTENT_BATCH_08_REPORT.md)
- [x] batch-09 → 339 → 364 (docs/reports/FOLDWINK_CONTENT_BATCH_09_REPORT.md)
- [x] batch-10 → 364 → 387 (docs/reports/FOLDWINK_CONTENT_BATCH_10_REPORT.md)
- [ ] batch-11 → target 387 → ~412
- [ ] More hard puzzles — target 20 → 50 (separate cadence)
- [ ] Editorial report per batch under `docs/reports/`

### Retention (1.1 candidates)

- [ ] Grade-based micro-achievements (local only)
- [ ] Daily calendar browser

### Audio (1.1 candidates)

- [ ] Swap synthesised cues for real recorded paper / card / wood / tile samples

## Blocked

(none)

## Deferred past 1.0 (red-flagged by scope-keeper)

- Premium / supporter / paid packs
- Ad integration
- Network analytics
- Accounts, leaderboards, cloud sync
- New twist mechanics beyond Tabs + Wink
- Full 3D / motion framework
- Pool beyond 500 without explicit editorial throughput evidence

---

## Shipping facts — 0.6.1

|                  |                                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| Version          | 0.6.1 (release-hardening pass)                                                |
| Tests            | 108 / 108 across 11 suites                                                    |
| Current library  | 200 curated puzzles (105 easy + 75 medium + 20 hard)                          |
| Target library   | **500** (disciplined batches per `docs/content/BATCH_WORKFLOW.md`)            |
| Bundle           | 321 kB JS / 103 kB gzip, 18 kB CSS / 4.5 kB gzip                              |
| Runtime deps     | 3 (react, react-dom, zustand)                                                 |
| Dev deps         | 16                                                                            |
| Persistence keys | 7 (stats, progress, daily, onboarded, sound, active-session, events)          |
| Branding         | Foldwink by Neural Void · foldwink@neural-void.com · neural-void.com/foldwink |
| Browser QA       | 25 screenshots, 20 findings, 0 critical/high, 0 console errors                |
| Itch package     | `dist/foldwink-itch.zip` (~110 KB)                                            |
