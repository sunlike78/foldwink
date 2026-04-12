# TODO — Foldwink

## Current phase

**0.4.2 progression + doc correction pass complete.**

- Library clarity fixed: **current 98** vs **target 500** is explicit in every live doc and on the menu.
- Easy → Medium progression model finished: simple unlock at 5 easy wins, smarter recommendation, soft fallback, time only as secondary signal.
- Standard mode split into Easy and Medium tracks with independent cursors.
- Full rules in `docs/PROGRESSION_RULES.md`.

Latest report: `docs/reports/FOLDWINK_0_4_2_PROGRESSION_PASS_REPORT.md`.
Prior pass: `docs/reports/FOLDWINK_0_4_1_POLISH_PASS_REPORT.md`.

Next step: the first human in-browser QA pass (H11) + sound ear pass — both still block any closed-beta invitations.

## In progress

(none)

## Next — before closed beta

- [ ] **H11** First human in-browser QA pass on a phone-sized and a desktop-sized viewport against `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md`. Blocks closed-beta invitations.
- [ ] **S1** Sound ear pass — listen to each 0.4.1 cue twice on speakers + headphones. Any cue that still feels synthetic / bright / annoying on repeat: retune or disable. Documented in `docs/SOUND_DESIGN.md`.
- [ ] **S2** Share card visual pass — render flawless / fail / no-wink outputs and review typography/spacing/new Neural Void sublabel.
- [ ] **H2** Raster 1200×630 OG image alongside `public/og.svg`. Human-art task.
- [ ] Real designed wordmark / logotype. Human-art task.
- [ ] Deploy `dist/` to `neural-void.com/foldwink`. Branding text already points there.

## Queue — after closed beta

### Content

- [ ] Content batch #1 — first disciplined 25-puzzle batch against `docs/content/BATCH_WORKFLOW.md`. Target pool 98 → 123.
- [ ] Content batch #2 — second batch. Target pool 123 → 150. Reassess 200 vs. 500 target after.
- [ ] Editorial report per batch under `docs/reports/FOLDWINK_CONTENT_BATCH_N_REPORT.md`.

### Retention (1.1 candidates)

- [ ] Daily history archive selector (read-only)
- [ ] Hard difficulty
- [ ] Grade-based micro-achievements (local only, no badges UI creep)

### Audio (1.1 candidates)

- [ ] Swap synthesised cues for real recorded paper / card / wood / tile samples. Single integration point: `src/audio/sound.ts::RECIPES`.

## Blocked

(none)

## Deferred past 1.0 (red-flagged by scope-keeper)

- Premium / supporter / paid packs
- Ad integration
- Network analytics
- Accounts, leaderboards, cloud sync
- New twist mechanics beyond Tabs + Wink
- Full 3D / motion framework
- Pool beyond 200 without explicit editorial throughput evidence

---

## Done — Post-MVP sprints (0.4.0)

### Sprint 0 — Audit and baseline

- [x] Repository audit against the new 8-sprint master plan
- [x] Component/flow map, risk list, quick wins, hard blockers
- [x] Scope-keeper pass (red / yellow / green verdict)
- [x] Baseline audit + updated backlog

### Sprint 0.5 — Hygiene before polish

- [x] H1 React error boundary at the app root
- [ ] H2 Raster OG image — deferred (human-art task)
- [x] H3 `docs/PUZZLE_SCHEMA.md` — `AnchorTwist`/`twist` removed, medium example rewritten, fairness §6 updated
- [x] H4 `CLAUDE.md` — full rewrite for Foldwink
- [x] H5 `StatsScreen.tsx` duplicate cells removed
- [x] H6 `store.ts::winkTab` refactored to call `canWinkGroup`
- [x] H7 `FoldwinkTabs.tsx` preserves ✦ on solved-winked tab
- [x] H8 `dailyPlayedDate` dropped, selector over `todayDailyRecord?.date`
- [x] H9 `.gitignore` tightened; stray root files deleted / relocated
- [x] H10 `scripts/validate-puzzles.ts` header + obsolete `editorialNotes` cleanup
- [ ] H11 First in-browser QA pass — open (human task)

### Sprint 1 — Visual polish + motion foundation

- [x] V1 `src/styles/motion.ts` shared transition tokens
- [x] V2 Card press / select / deselect micro-motion
- [x] V3 Wrong-submit shake + correct-group snap/settle
- [x] V4 FoldwinkTabs reveal polish + solved-tab transition
- [x] V5 Subtle 2.5D lift on selected cards
- [x] V6 Result-screen arrival (pre-existing `fw-result-pop`)
- [x] V7 Visual audit — rejected decorative additions

### Sprint 2 — Sound system

- [x] A1 `SoundEvent` union + `useSound` hook
- [x] A2 Recipe manifest (paper / card / wood / tile palette, synthesised)
- [x] A3 Hooks on select / deselect / submit / wrong / correct / tab reveal / Wink / solve / fail
- [x] A4 Sound settings (mute, persisted) via `SoundToggle`
- [x] A5 Asset strategy: Web Audio synthesis, `RECIPES` is the swap point for real samples
- [x] A6 No perf regression on rapid select/deselect (build clean)

### Sprint 3 — Share card as image

- [x] SH1 Canvas-based share-card renderer (no deps)
- [x] SH2 Framed result card with branding + mode + difficulty + mistakes + Wink flag + date
- [x] SH3 `navigator.share` with files + clipboard image + download + text fallback (5-layer pipeline)
- [x] SH4 CTA placement preserved on ResultScreen
- [x] SH5 Desktop fallback sanity (naturally steps down)

### Sprint 4 — Retention layer

- [x] RT1 Grading (`flawless`, `clean`, `steady`, `clutch`, `no-wink-medium`) as pure function
- [x] RT2 Stats screen: Depth section with flawless / avg mistakes / medium win % / winks spent
- [ ] RT3 Daily history archive selector — deferred to 1.1
- [x] RT4 Menu streak display — already present in 0.3.3, kept
- [x] RT5 Mid-game persistence (single `foldwink:active-session` blob, auto-restore on init)

### Sprint 5 — Content pipeline scaling

- [x] C1 Validator extensions: label-shape collision index, theme signature, niche-character flag, diversity score
- [x] C2 `docs/content/EASY_VS_MEDIUM_PROFILE.md` cognitive profile
- [x] C3 `docs/content/BATCH_WORKFLOW.md` batch workflow + rejection quotas + stop condition
- [ ] C4 Raise pool 98 → 150 — deferred to human-driven batches (see "Queue")
- [x] C5 Editorial report template codified in `BATCH_WORKFLOW.md`

### Sprint 6 — Monetization readiness (scoped down)

- [x] M1 Privacy one-liner in new `AboutFooter` component
- [x] M2 Support email surfaced in `AboutFooter`
- [x] M3 Minimal local-only event log (`src/analytics/eventLog.ts`), zero network
- Deferred: ads, premium, network analytics (scope-keeper red-flag)

### Sprint 7 — Final QA and stabilization

- [x] Q1 Regression pass across typecheck / test / lint / format / validate / build
- [x] Q2 Share flow pipeline (5 layers, manual browser verification is H11)
- [x] Q3 Audio sanity (no binaries, mute honored, no auto-play on boot)
- [x] Q4 Perf check — bundle 74 kB → 79.4 kB gzip
- [x] Q5 Release readiness report — `docs/reports/FOLDWINK_POST_MVP_SPRINTS_REPORT.md`

---

## Done — MVP (0.1.0 → 0.3.3)

### Phase 1 — Discovery

- [x] Read PROJECT_SPEC, ARCHITECTURE, PUZZLE_SCHEMA, CONTENT_GUIDELINES, MVP_TASK_GRAPH, STYLE_SYSTEM, QA_CHECKLIST, RELEASE_CHECKLIST
- [x] Produce MVP_DECISIONS.md
- [x] Produce BUILD_PLAN.md

### Phase 2 — Freeze

- [x] Stack locked: React 18 + TS + Vite + Tailwind + Zustand + Vitest
- [x] Folder structure locked
- [x] Daily selection strategy locked (FNV-1a mod pool)
- [x] Persistence keys locked
- [x] Produce ARCH_PLAN.md

### Phase 3 — Scaffold

- [x] package.json, tsconfig, vite.config, tailwind, postcss, index.html
- [x] Entry `src/main.tsx`, `src/app/App.tsx`
- [x] Tailwind directives in `src/styles/index.css`
- [x] `.gitignore`, `public/favicon.svg`
- [x] Dependencies installed clean

### Phase 4 — Domain + engine

- [x] Types: `puzzle`, `game`, `stats`
- [x] Utils: `hash` (FNV-1a), `date`, `storage`
- [x] Engine: `shuffle`, `submit`, `progress`, `result` (all pure)
- [x] Loader with `import.meta.glob` + dev-fail on bad data
- [x] Daily selector
- [x] Stats module + localStorage persistence
- [x] Vitest suite: 26 tests

### Phase 5 — UI

- [x] Zustand store wiring engine + stats + nav + flash
- [x] Components: Button, Card, Grid, Header, MistakesDots, ResultSummary
- [x] Screens: MenuScreen, GameScreen, ResultScreen, StatsScreen
- [x] Mobile-first layout, viewport meta, focus ring

### Phase 6 — Content

- [x] Upgraded validator (`scripts/validate-puzzles.ts`)
- [x] 30 → 98 curated puzzles
- [x] All pass validator

### Phase 7 — QA

- [x] Automated gates (typecheck + tests + validate + build)
- [x] Manual logic review (per `QA_CHECKLIST.md`)
- [x] BUG-001 fixed (daily replay double-count stats)
- [x] Wrote `QA_REPORT.md`

### Phase 8 — Release pack (0.1.0 → 0.3.3)

- [x] README.md, release notes, deploy docs
- [x] Foldwink rename + brand surface
- [x] Foldwink Tabs + Wink mechanic
- [x] Onboarding, DailyCompleteCard, StatStrip, Wordmark
- [x] ESLint + Prettier + GitHub Actions CI
- [x] Closed-beta pack

## Shipping facts — 0.4.2

|                  |                                                                               |
| ---------------- | ----------------------------------------------------------------------------- |
| Version          | 0.4.2                                                                         |
| Tests            | 99 / 99 across 11 suites                                                      |
| Current library  | 98 curated puzzles (65 easy + 33 medium)                                      |
| Target library   | **500** (disciplined batches per `docs/content/BATCH_WORKFLOW.md`)            |
| Progression      | Easy → Medium soft-gate at 5 easy wins + smarter recommendation               |
| Standard mode    | Split into Easy and Medium tracks (independent cursors)                       |
| Bundle           | 247.26 kB JS / 80.77 kB gzip, 17.68 kB CSS / 4.43 kB gzip                     |
| Runtime deps     | 3 (react, react-dom, zustand)                                                 |
| Dev deps         | 14                                                                            |
| Persistence keys | 7 (stats, progress, daily, onboarded, sound, active-session, events)          |
| Branding         | Foldwink by Neural Void · foldwink@neural-void.com · neural-void.com/foldwink |

## Shipping facts — 0.4.1

|                      |                                                                               |
| -------------------- | ----------------------------------------------------------------------------- |
| Version              | 0.4.1                                                                         |
| Tests                | 82 / 82 across 11 suites                                                      |
| Puzzles              | 98 (65 easy + 33 medium)                                                      |
| Diversity score      | 0.992                                                                         |
| Metadata coverage    | 0/98 (schema is opt-in; populated by future disciplined batches)              |
| Bundle               | 244.40 kB JS / 79.79 kB gzip, 17.68 kB CSS / 4.43 kB gzip                     |
| HTML                 | 1.86 kB                                                                       |
| Runtime deps         | 3 (react, react-dom, zustand)                                                 |
| Dev deps             | 14                                                                            |
| Persistence keys     | 7 (stats, progress, daily, onboarded, sound, active-session, events)          |
| Default sound volume | 0.42 (lowered from 0.55 in 0.4.1)                                             |
| Branding             | Foldwink by Neural Void · foldwink@neural-void.com · neural-void.com/foldwink |

## Shipping facts — 0.4.0

|                  |                                                                      |
| ---------------- | -------------------------------------------------------------------- |
| Version          | 0.4.0                                                                |
| Tests            | 76 / 76 across 10 suites                                             |
| Puzzles          | 98 (65 easy + 33 medium)                                             |
| Diversity score  | 0.992                                                                |
| Bundle           | 243.16 kB JS / 79.39 kB gzip, 17.60 kB CSS / 4.41 kB gzip            |
| HTML             | 1.55 kB                                                              |
| Runtime deps     | 3 (react, react-dom, zustand)                                        |
| Dev deps         | 14                                                                   |
| Persistence keys | 7 (stats, progress, daily, onboarded, sound, active-session, events) |
