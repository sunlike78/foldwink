# Foldwink — Sprint 0 Audit (Post-MVP Master Plan)

Date: 2026-04-11
Scope: baseline audit of Foldwink 0.3.3 against the new 8-sprint post-MVP master plan
(`FOLDWINK_MASTER_MEGA_PROMPT.md`). No code written in this pass.

## 1. Baseline snapshot

|              |                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------- |
| Version      | 0.3.3 (closed-beta candidate)                                                             |
| Stack        | React 18 + TS + Vite 5 + Zustand + Tailwind 3 + Vitest 2                                  |
| Tests        | 65 / 65 across 9 suites                                                                   |
| Build        | 226 kB JS / 74 kB gzip, 14.9 kB CSS / 3.9 kB gzip                                         |
| Content      | 98 validated puzzles (65 easy + 33 medium)                                                |
| Lint / CI    | ESLint + Prettier + GitHub Actions (typecheck, test, validate, lint, format:check, build) |
| Runtime deps | 3 (react, react-dom, zustand)                                                             |
| Dev deps     | 14                                                                                        |
| Persistence  | localStorage only, namespaced keys                                                        |

## 2. Component & flow map

```
src/
  app/App.tsx                root screen switcher (menu / game / result / stats)
  main.tsx                   Vite entry
  components/
    BrandMark, Wordmark      brand lockup (system sans — no designed mark yet)
    Card, Grid               4x4 board
    FoldwinkTabs             progressive-reveal + Wink mechanic
    Header, MistakesDots     top strip
    Onboarding               first-run modal
    DailyCompleteCard        post-daily state on menu
    DailyCountdown           live "next daily in HH:MM:SS"
    StatStrip                stats summary row
    ResultSummary            result screen body
    ShareButton              navigator.share + clipboard fallback
    Button                   shared button primitive
  game/
    engine/                  shuffle, submit, progress, result, share, foldwinkTabs (all pure)
    state/                   store.ts (301 LOC), appStore.ts — Zustand + persistence subscriber
    types/                   puzzle, game, stats
    solvedColors.ts          palette for solved tints
  puzzles/                   loader (import.meta.glob) + deterministic daily selector (FNV-1a)
  screens/                   MenuScreen, GameScreen, ResultScreen, StatsScreen
  stats/                     pure stats updates + persistence
  utils/                     hash, date, storage, countdown
  styles/                    Tailwind entry
puzzles/pool/                98 JSON files
scripts/validate-puzzles.ts  structural + revealHint + medium-only validator
```

Flow:

```
Menu ─┬─ Daily ─→ Game ─→ Result ─→ (DailyCompleteCard on return)
      ├─ Play  ─→ Game ─→ Result ─→ next / retry
      └─ Stats
```

Mechanic boundary:

- easy → plain 4x4, no tabs, no Wink
- medium → FoldwinkTabs row above grid, progressive letter reveal on each solve, one Wink per game

## 3. What exists vs. what the master plan asks for

### Already done in 0.3.3 (reuse, don't rebuild)

- S0 audit scaffolding (prior reassessments under `docs/reports/`)
- S1 partial: brand surface, dark palette, solved tints, FoldwinkTabs animations, DailyCompleteCard, StatStrip, Wordmark lockup
- S3 partial: ShareButton + pure `engine/share.ts` string builder + clipboard fallback + navigator.share path
- S4 partial: stats, streak counter, 6-cell StatStrip, daily history, DailyCompleteCard ritual
- S5 partial: curated pipeline discipline documented in `docs/research/CONTENT_EXPANSION_NOTES.md` and `docs/content/PUZZLE_EDITORIAL_GUIDELINES.md`; validator enforces structural rules
- S7 partial: manual QA checklist, tester feedback form, closed-beta pack

### Missing entirely

- **Sound system.** Zero audio files, zero audio hooks, zero sound settings. Biggest net-new surface in the plan.
- **Framed share card as an image.** Current share is text + clipboard + navigator.share; there is no rendered image/card export.
- **Retention grading.** No per-puzzle grade (flawless / 1-mistake / clutch / no-Wink-medium).
- **Error boundary** at React root.
- **Raster OG image.** `public/og.svg` only.
- **Real designed wordmark/logotype.** Current is a system sans `<h1>`.
- **Mid-game persistence.** Reload drops the attempt.
- **Hard difficulty.** Deferred from MVP.
- **Content scale toward 500.** Sitting at 98.
- **Content-generation tooling.** Only `validate-puzzles.ts` exists; no draft/dedupe/diversity scripts.
- **Analytics event map.** None.
- **Premium / supporter path.** None.
- **Deployed branded domain.** Placeholder `foldwink.com` strings.

## 4. Known stale items carried over from `FOLDWINK_FINAL_IMPLEMENTATION_NEXT_ACTIONS.md`

Several small items from the prior punch list are still open and are cheap wins:

1. `docs/PUZZLE_SCHEMA.md` still documents the obsolete `AnchorTwist` / `twist` field — schema lies.
2. `CLAUDE.md` still names the project "Cluster Twist" — it is the old MVP CLAUDE.md, not a Foldwink one.
3. `StatsScreen.tsx` has two duplicate cells (Unique / Win Rate).
4. `store.ts::winkTab` inlines guards that should call `canWinkGroup` from `foldwinkTabs.ts`.
5. `FoldwinkTabs.tsx` loses the ✦ mark on a solved-winked tab.
6. Store: `dailyPlayedDate` duplicates `todayDailyRecord.date`; derive it via selector.
7. `.gitignore` doesn't cover `.tsbuildinfo-node/`, `tsconfig*.tsbuildinfo`, `audit-results/`, `*.zip`. Stray files at repo root (`foldwink-audit-results.zip`, `README_START_HERE.md`, `FOLDWINK_MASTER_MEGA_PROMPT.md`, `audit-results/`) should be relocated or removed.
8. `scripts/validate-puzzles.ts` has an obsolete `editorialNotes` field and stale header.
9. No browser QA pass has ever been run — all visual claims in prior reports are inferred from code.

These are "clean house before starting S1" items. Most are 5–15 minute edits.

## 5. Risk list

**Architectural / technical**

- R1. `store.ts` at 301 LOC is still readable but starts to concentrate responsibilities (engine wiring, stats, flash, nav, persistence glue, wink). Next slice of features (sound, grading, mid-game persistence) will push it past a healthy limit. Plan a thin split before S4 lands.
- R2. No error boundary — any render bug white-screens the app.
- R3. Mid-game state is not persisted — reloading drops the attempt. Will bite real players more than beta testers.

**Visual / UX**

- R4. Motion layer is ad-hoc (Tailwind transitions inline on components). Adding S1 micro-motion risks accreting a "motion system" abstraction — scope-keeper flagged this. Keep motion in one small utility file, CSS/transform-only, no libraries.
- R5. No real designed wordmark. Adding decorative 2.5D polish around a system-sans `<h1>` will feel decorative rather than branded.
- R6. Word-play mediums (`___ FLY`, `___ BALL`) still gate non-native speakers. Content expansion must bias toward classification shapes.

**Audio**

- R7. No sound system exists. Must be a tiny static-asset + one thin hook, not a sound engine. Tactile, quiet, paper / card / wood / tile palette. Defer music entirely or keep it optional and off by default.
- R8. Placeholder-asset strategy needs to be explicit: where the final assets will live, which events map to which file, and how to swap them later without touching call sites.

**Content**

- R9. Scaling from 98 to 500 curated puzzles without discipline is the single biggest risk in the plan. Near-duplicate categories, reviewer fatigue, and "fabricated diversity" will destroy the trust the 98 existing puzzles built.
  - Gate: validator must be extended with semantic / near-duplicate / category-overlap / over-niche rejection **before** any batch generation.
  - Batches of ~25, editorial sign-off per batch, no exceptions.
  - If the bar cannot be sustained, target a realistic 200, not 500.
- R10. Easy vs. medium divergence is currently by author intuition. Needs a written cognitive profile to keep the split meaningful as the pool grows.

**Product / commercial**

- R11. Monetization readiness (S6) as scoped in the master plan is effectively a second product. Premium path + ad-safe UX + analytics + privacy surface all at once is scope creep. Defer premium and ads; keep only a minimal privacy-respecting analytics event map (or none) for beta.
- R12. "Daily identity" must stay local-only. No accounts, no cloud sync, no leaderboards, no push. Any of those four items is a red line.

## 6. Scope verdict (scope-keeper pass)

**Green-light (in-scope, ship):**

- S0 hygiene: error boundary, raster OG, real wordmark, in-browser QA pass, stale-doc cleanup.
- S1 micro-motion + 2.5D polish, CSS/transform-only, one small motion utility file.
- S2 sound system as static-asset pack + one thin hook (play/mute/volume, persisted). Tactile paper / card / wood / tile palette. Quiet, optional, no music.
- S3 finish the share flow: framed share card as image export, reuse existing `engine/share.ts` + ShareButton.
- S7 final QA and stabilization.

**Yellow-flag (do, but with discipline):**

- S4 retention. Local-only. Streak + grading as pure functions. No push, no FOMO, no login-streak-saver.
- S5 content expansion. Validator extensions first; batches of ~25; realistic stop at 200 if discipline cannot be held. **Use the existing curated pipeline, not scraping.**
- S1 motion. Reject if it becomes a framework.

**Red-flag (defer past 1.0 or cut):**

- S6 premium scaffolding and ad-safe UX in full — defer.
- Any new twist mechanic beyond Foldwink Tabs + Wink — out of scope per CLAUDE.md.
- Any backend, account, cloud sync, or leaderboard implied by "daily identity" — red line.

## 7. Quick wins (< 1 day each)

1. Add React error boundary at app root.
2. Ship a raster 1200×630 OG image alongside `og.svg`.
3. Fix the 9 stale items in §4 above (schema, duplicate stats cells, winkTab guard, `.gitignore`, stray root files, obsolete validator field, CLAUDE.md rename).
4. Add a tiny `motion.ts` utility with the 6–8 transition tokens used across the app (one source of truth for S1).
5. Extract a `useSound(event)` hook skeleton with a `SoundEvent` enum and a manifest file, even before real assets exist — unblocks S2 cleanly.
6. Add a written `easy vs medium` cognitive-profile page under `docs/content/` — unblocks S5 editorial discipline.

## 8. Hard blockers

Items that must be resolved before the corresponding sprint can actually land, not just be declared done.

| Sprint | Hard blocker                                                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S1     | Decision on dark-mode-only vs. light-theme variant. **Default:** dark-only for 1.0; themes deferred.                                                                                                         |
| S2     | Asset source. **Default:** author-recorded or CC0 paper/card/wood/tile SFX, placeholder silence until committed.                                                                                             |
| S3     | Share-card renderer choice — HTML→canvas (`html-to-image`) vs. hand-drawn canvas. **Default:** hand-drawn canvas, zero deps, deterministic.                                                                  |
| S4     | Grading rubric definition (what counts as flawless / clutch / no-Wink-medium). **Default:** flawless=0 mistakes; 1-mistake; 2-mistake; clutch=3 mistakes; no-Wink-medium = medium solved without using Wink. |
| S5     | Validator semantic / dedupe / diversity extensions must land **before** batch generation. Target realistic stop at 200 if 500 cannot be held.                                                                |
| S6     | Deferred. No blocker to resolve now.                                                                                                                                                                         |
| S7     | Must follow a real in-browser QA pass on at least one phone-sized and one desktop-sized viewport.                                                                                                            |

## 9. Recommended backlog (post-MVP)

**Sprint 0.5 — Hygiene before polish (fast, unblocks everything)**

- H1 Error boundary at root
- H2 Raster OG image
- H3 Schema doc truth-up (remove `AnchorTwist`)
- H4 `CLAUDE.md` rename ("Cluster Twist" → "Foldwink", describe Tabs + Wink)
- H5 `StatsScreen` duplicate cells removed
- H6 `store.ts::winkTab` refactored to call `canWinkGroup`
- H7 `FoldwinkTabs` solved-winked ✦ preservation
- H8 Drop `dailyPlayedDate` duplication
- H9 `.gitignore` tightening + stray root files relocated/deleted
- H10 `validate-puzzles.ts` header + obsolete field cleanup
- H11 Browser QA pass (phone + desktop) — first real in-browser check

**Sprint 1 — Visual polish + motion foundation**

- V1 `src/styles/motion.ts` with shared transition tokens (one source of truth)
- V2 Card press / select / deselect micro-motion
- V3 Wrong-submit shake + correct-group snap/settle
- V4 FoldwinkTabs reveal polish + solved-tab transition
- V5 Subtle 2.5D lift on selected cards (transform only)
- V6 Result-screen arrival transition
- V7 Visual audit against "small premium minimal" bar; reject anything that feels decorative

**Sprint 2 — Sound system**

- A1 `SoundEvent` enum and `useSound` hook
- A2 Static asset manifest (paper / card / wood / tile palette, placeholder silence entries)
- A3 Hooks wired on select / deselect / submit / wrong / correct / tab reveal / Wink / solve / fail
- A4 Sound settings (mute + volume, persisted)
- A5 Record or source CC0 assets
- A6 Perf check: no jank on rapid select/deselect

**Sprint 3 — Share card as image**

- SH1 Canvas-based share-card renderer (no deps)
- SH2 Framed result card with Foldwink branding + mode + difficulty + mistakes + Wink used + date
- SH3 `navigator.share` with image, clipboard image fallback, download fallback
- SH4 CTA placement: after daily solve/fail, after standard solve
- SH5 Desktop fallback sanity

**Sprint 4 — Retention layer**

- R1 Grading (flawless / 1 / 2 / clutch / no-Wink-medium) as pure function
- R2 Stats screen expansion: medium perf, Wink usage, avg mistakes
- R3 Daily-history archive selector (local-only)
- R4 Gentle streak display on menu (no streak-saver shenanigans)

**Sprint 5 — Content pipeline scaling**

- C1 Validator extensions: semantic dedupe, category overlap, over-niche rejection, diversity score
- C2 `docs/content/EASY_VS_MEDIUM_PROFILE.md` cognitive profile
- C3 Batch workflow: draft → auto-filter → editorial sign-off → commit, 25 puzzles per batch
- C4 Raise pool from 98 → 150 in disciplined batches; reassess target (200 vs. 500) after first two batches
- C5 Editorial reports per batch

**Sprint 6 — Monetization readiness (scoped down)**

- M1 Privacy page (one sentence, "we store nothing")
- M2 Support channel email surfaced in UI footer
- M3 Minimal local-only event log (no network) for author's self-evaluation
- M4 Deferred: ads, premium, analytics network layer — out of scope for now

**Sprint 7 — Final QA and stabilization**

- Q1 Regression pass against all modes (easy, medium, daily, standard)
- Q2 Share flow sanity on phone + desktop
- Q3 Audio sanity (no pops, no missing files, mute honored)
- Q4 Performance check (share-card render, animations on low-end mobile)
- Q5 Release readiness report

## 10. Unresolved ambiguities (Sprint 0 questions the plan doesn't answer)

| #   | Question             | Proposed default (proceed unless told otherwise)                                                          |
| --- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| A1  | Share-card renderer  | Hand-drawn canvas, zero deps                                                                              |
| A2  | Sound asset source   | CC0 / author-recorded; placeholder silence until committed                                                |
| A3  | Light theme in 1.0   | No — dark-only, theme support deferred                                                                    |
| A4  | Target content scale | 200 realistic; 500 aspirational; gated on validator extensions + batch discipline                         |
| A5  | Analytics            | None on network; local-only aggregate counts for author eval                                              |
| A6  | Premium path in 1.0  | Deferred — no pay affordance shipped in 1.0                                                               |
| A7  | Mid-game persistence | Implement in S4 as part of retention layer (single active-game record in localStorage)                    |
| A8  | Daily archive        | Read-only list in S4; no past-puzzle re-play that affects stats                                           |
| A9  | Hard difficulty      | Deferred past 1.0                                                                                         |
| A10 | New branding mark    | Out of scope for Claude Code; surfaced as a human-art hard blocker for public launch, not for closed beta |

## 11. Must-have vs. nice-to-have cut (for 1.0)

**Must-have for 1.0**

- All of Sprint 0.5 (hygiene)
- Sprint 1 polish at the level "reject anything decorative"
- Sprint 2 sound system (tactile, quiet, mute works)
- Sprint 3 framed share-card image export
- Sprint 4 grading + expanded stats + mid-game persistence
- Sprint 5 validator extensions + 150 puzzles minimum
- Sprint 7 final QA pass in a real browser

**Nice-to-have (ship if cheap)**

- Dark-mode alt theme
- Daily archive browser
- Hard difficulty
- Local-only event log for self-evaluation
- Pool beyond 150 toward 200/500

**Out of scope for 1.0 (defer)**

- Premium / supporter / paid packs
- Ad integration
- Network analytics
- Accounts, leaderboards, cloud sync
- New twist mechanics beyond Tabs + Wink
- Full 3D or motion framework

## 12. Go / No-Go — Sprint 0

**Go.** The baseline is clearly mapped, every sprint has a named blocker and a named default, scope-keeper has flagged the red lines, and Sprint 0.5 (hygiene) is ready to start as the next smallest high-value step. No code was written in this pass. Next sprint can begin without guessing.

---

## Sprint Report

### Sprint Summary

- **Goal:** produce an honest baseline for the 8-sprint post-MVP master plan against Foldwink 0.3.3.
- **Done:** read the full live doc set and the closed-beta reassessment, mapped components/flow, inventoried what already exists vs. what the master plan asks for, ran scope-keeper against the plan, produced the backlog, ambiguities, defaults, risks, quick wins, and hard blockers, wrote this audit and updated `docs/TODO.md`.
- **Not done (by design):** any code changes, any content changes, any asset work.

### Changed Files

- `docs/reports/FOLDWINK_SPRINT_0_AUDIT.md` (new — this file)
- `docs/TODO.md` (updated — post-MVP phase opened)

### Architecture / UX Notes

- Reuse `engine/share.ts` and `ShareButton` in S3 — don't rewrite.
- Motion lives in one small utility file, not a system.
- Sound goes through one `useSound` hook + a static manifest; swapping final assets must not touch call sites.
- `store.ts` is close to the healthy size ceiling; plan a light split before S4.
- Content pipeline scaling is gated on validator extensions landing first.

### Tests Run

- None in this pass (audit only).
- Baseline verified from the 0.3.3 reassessment: 65/65 tests, typecheck / validate / build all green.

### Quality Evaluation

- The plan aligns with the project identity only if S6 is scoped down and S5 is disciplined. Both have defaults written above.
- Foldwink identity (short, smart, tactile, minimal) is preserved in every green-lit item.

### Open Risks

- R9 content scaling is the biggest external risk.
- R1 store size + R4 motion accretion are the biggest internal risks.
- R11 monetization scope is the biggest product risk — already scoped down in this audit.

### Go / No-Go

**Go for Sprint 0.5 (hygiene before polish).** Recommended next smallest high-value step: H1 error boundary + H3/H4 doc truth-up, then the rest of Sprint 0.5.
