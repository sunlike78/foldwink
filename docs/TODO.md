# TODO — Foldwink

## Current phase

**0.6.1 release-hardening pass complete.**

- 200 curated puzzles (105 easy + 75 medium + 20 hard)
- Hard / Master Challenge fully playable
- Browser QA automation covers all 3 tiers + mobile + share flow
- Wink-on-Hard UI bug fixed
- Onboarding overflow on narrow viewport fixed
- Itch.io package, page copy, upload guide, and store screenshots ready
- All automated gates green

Latest report: `docs/reports/FOLDWINK_RELEASE_HARDENING_REPORT.md`.
Prior: `docs/reports/FOLDWINK_MASTER_ANALYSIS_HANDOFF.md`.

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

### Content

- [ ] Content batch — target 200 → 300 curated puzzles
- [ ] More hard puzzles — target 20 → 50
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
