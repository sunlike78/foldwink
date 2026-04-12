# Foldwink — Post-MVP Sprints Report (0.4.0)

Date: 2026-04-11
Scope: autonomous execution of the 8-sprint post-MVP master plan against Foldwink 0.3.3.
Plan source: `docs/FOLDWINK_MASTER_MEGA_PROMPT.md`.
Baseline audit: `docs/reports/FOLDWINK_SPRINT_0_AUDIT.md`.

## Sprint Summary

**Goal:** grow Foldwink from a polished closed-beta candidate (0.3.3) into a small coherent indie product with visual polish, a sound system, a framed share-card image, a retention layer, a scaled content pipeline, monetization readiness, and final stabilisation — without touching the minimalist identity.

**Done:**

- Sprint 0 — baseline audit + scope-keeper verdict (previous turn).
- Sprint 0.5 — hygiene before polish (11 items, all code-doable ones completed).
- Sprint 1 — visual polish + motion foundation.
- Sprint 2 — sound system.
- Sprint 3 — share card as image.
- Sprint 4 — retention layer (grading + stats extensions + mid-game persistence).
- Sprint 5 — content pipeline extensions + documentation.
- Sprint 6 — monetization readiness (scoped down).
- Sprint 7 — final QA + release readiness.

**Not done (by explicit scope decision, not oversight):**

- Raster 1200×630 OG image (human-art task).
- Real designed wordmark / logotype (human-art task).
- First in-browser QA pass on a phone + desktop viewport (requires a human browser session).
- Pool expansion from 98 toward 150 / 200 / 500 puzzles (requires disciplined editorial batches per `docs/content/BATCH_WORKFLOW.md` — rushing 50+ drafts in one pass would destroy the trust the 98 existing puzzles built).
- Premium / ad / network-analytics scaffolding — scope-keeper red-flagged these for 1.0.

---

## Sprint 0.5 — Hygiene

H1 React error boundary at the app root (`src/components/ErrorBoundary.tsx`) wired in `src/main.tsx`.
H2 Raster OG image — **deferred** (human-art task, noted explicitly in the audit).
H3 `docs/PUZZLE_SCHEMA.md` — `AnchorTwist` / `twist` field removed, medium example replaced with a `revealHint`-only puzzle, fairness checklist §6 updated.
H4 `CLAUDE.md` — full rewrite from "Cluster Twist MVP" to "Foldwink 0.3.3 post-MVP". Describes Tabs + Wink explicitly, documents scope-keeper red lines.
H5 `StatsScreen.tsx` — duplicate `Unique` and `Win Rate` cells removed, grid tightened to 2×2.
H6 `store.ts::winkTab` — inlined guards replaced with a single call to `canWinkGroup` from `foldwinkTabs.ts`.
H7 `FoldwinkTabs.tsx` — ✦ mark now preserved on a solved-winked tab via a `showWinkMark` local.
H8 `dailyPlayedDate` — dropped from `StoreState` and `StoreDeps`. Added `selectDailyPlayedDate` selector over `todayDailyRecord?.date`. Test, persistence, and internal consumers migrated.
H9 `.gitignore` tightened (`.tsbuildinfo-node/`, `tsconfig*.tsbuildinfo`, `audit-results/`, `*.zip`). `foldwink-audit-results.zip`, `README_START_HERE.md`, `FOLDWINK_MASTER_MEGA_PROMPT.md`, `audit-results/`, and `.tsbuildinfo-node/` deleted from the repo root. The master plan lives in `docs/FOLDWINK_MASTER_MEGA_PROMPT.md` only.
H10 `scripts/validate-puzzles.ts` — header comment updated to "Foldwink puzzle validator", obsolete `editorialNotes?: string` field removed.
H11 First in-browser QA pass — **deferred** (needs a human browser session).

---

## Sprint 1 — Visual polish + motion foundation

V1 `src/styles/motion.ts` — single source of truth for motion tokens. Durations constants + class-name constants + `MotionClassKey` type. No library, no runtime cost, no abstraction beyond a few strings.
V2 `Card.tsx` — `MOTION_CLASS.press` + `MOTION_CLASS.baseTransition` on every card. Subtle active-state scale-down for tactile feedback.
V3 Wrong-submit shake — new `fw-shake` keyframe (420 ms, cubic-bezier). `Grid.tsx` takes a `shake` prop; `GameScreen.tsx` keys the grid on `flash === "incorrect"` so the animation restarts on each wrong guess.
V4 Foldwink Tabs reveal polish — new `fw-tab-reveal` keyframe. `FoldwinkTabs.tsx` keys each tab on `stageKey` so the reveal animation replays whenever the solved count changes.
V5 Subtle 2.5D lift on selected cards — `MOTION_CLASS.selectedLift` = `-translate-y-[1px]` + a soft cyan shadow. Transform + shadow only. No decorative gloss.
V6 Result-screen arrival — the existing `fw-result-pop` animation was already in place. Kept as-is.
V7 Reject decorative — nothing else added. Motion stays sparse and sub-500 ms.

All keyframes respect `prefers-reduced-motion: reduce` in `src/styles/index.css`.

---

## Sprint 2 — Sound system

A1 `src/audio/sound.ts` — Web Audio engine with synthesised recipes. `playSound(event)` + `getSoundSettings` + `setSoundMuted` + `setSoundVolume` + `resetSoundForTests`.
A2 `SoundEvent` union covers 9 cues: `select`, `deselect`, `submit`, `wrong`, `correct`, `tabReveal`, `wink`, `win`, `loss`. Recipes are in one `RECIPES` record — individual cues can be retuned without touching call sites.
A3 `useSound` + `useSoundSettings` React hooks in `src/audio/useSound.ts`. Components never instantiate `Audio` or `AudioContext` directly.
A4 Wiring:

- `Card.onClick` → `select` / `deselect` via `GameScreen.handleToggle`
- `Submit` button → `submit` → then `correct` or `wrong` via `flash` effect
- Solve count change on medium → `tabReveal`
- `winkTab` action → `wink` via `winkedGroupId` effect
- `ResultScreen` mount → `win` / `loss`
  A5 `SoundToggle.tsx` on the menu — `useSoundSettings()` + a tiny `♪ / ✕` button. Persists `foldwink:sound` in localStorage. Default volume 0.55, default muted false.
  A6 Asset strategy — **no binary files.** Every cue is synthesised from a noise buffer + filtered envelope + optional oscillator body. Short band-limited taps give the paper/card feel; low oscillator bodies give the wood knock; tile/bone chimes use triangle oscillators at ascending frequencies. Each cue ≤ 260 ms, peaks well below 0 dB. When the author wants to swap in recorded samples, only `RECIPES` needs to change.

Cost: ~3 kB gzip for the whole thing. Gameplay never depends on sound being on.

---

## Sprint 3 — Share card as image

SH1 `src/share/shareCard.ts` — `drawShareCard(canvas, options)` + `renderShareCard(options): Promise<Blob | null>`. Hand-drawn canvas, zero dependencies. 1080×1080 PNG. Dark vignette background, Foldwink wordmark + accent underline, subtitle line, big result headline, status row (time · mistakes · Wink flag on medium), coloured solved grid, footer.
SH2 Status row now includes `Wink ✦` / `No Wink` for medium puzzles — makes the share card carry the mechanic, not just the result.
SH3 `ShareButton.tsx` rewritten. Pipeline:

1. Render the card as a Blob.
2. Try `navigator.share({ files, text })` — guarded by `canShare`.
3. Fall back to `navigator.clipboard.write([ClipboardItem])` image copy.
4. Fall back to a download via `createObjectURL` + `<a download>`.
5. Fall back to the text-only share path (original behaviour).
   UI states: `Share result` → `Preparing…` → `Copied!` / `Saved image` / `Share unavailable`.
   SH4 `ResultScreen.tsx` now passes a `ShareCardOptions` object to `ShareButton`. CTAs are placed at the same slot as before — share is in the same visual area.
   SH5 Desktop fallback works — `navigator.share` with files is unavailable on desktop Chrome so the pipeline naturally steps down to clipboard image → download → text. No special-casing.

---

## Sprint 4 — Retention layer

RT1 `src/game/engine/grading.ts` — pure `gradeResult(summary, puzzle, active)` returning a `ResultGrade`. Base ladder: `flawless` → `one-mistake` → `two-mistakes` → `clutch` → `loss`. Independent `noWinkMedium` flag composes with the base grade. Returns a short `label` and an optional `caption` for UI. 8 new tests pin every path.
RT2 `Stats` type gains 5 optional aggregate counters (`mediumWins`, `mediumLosses`, `totalMistakes`, `winkUses`, `flawlessWins`). All optional for backwards-compat with 0.3.3 saved state. `applyGameResult` takes a `GameResultContext` and updates them. `StatsScreen` gets a new "Depth" section with Flawless / Avg mistakes / Medium win % / Winks spent.
RT3 Daily history archive — not implemented. The data is already in `foldwink:daily` localStorage; a read-only archive view is deferred to 1.1 since the current `DailyCompleteCard` already surfaces today's result. Scope-keeper would flag a full archive browser as extra surface.
RT4 Menu streak display — already existed in 0.3.3. Kept as-is.
RT5 Mid-game persistence — `src/stats/persistence.ts` gets `loadActiveSession` / `saveActiveSession` / `clearActiveSession`. `appStore.ts` checks for a saved session on init: if the puzzle still exists and the session isn't finalised, it restores `active + puzzle + screen="game"` seamlessly. Save is keyed off `screen === "game" && active && !active.result`. Clear fires on any transition out of the in-progress game state.

---

## Sprint 5 — Content pipeline scaling

C1 Validator extensions in `scripts/validate-puzzles.ts`:

- `normaliseToken` + `labelTokens` + `STOP_WORDS` helpers
- `NICHE_CHAR` regex for unusual-character flags
- `labelShapeIndex` — cross-puzzle label collision detection
- `labelTokenIndex` — distinct label token count
- `themeSignatures` — sorted token sets per puzzle, flagged on match
- Final report line: `Diversity: N distinct labels, M distinct tokens, score K/1.0`
- Final report line: `Editorial signals: X label collisions, Y niche flags`
  On the current 98-puzzle pool: 389 distinct labels, 412 distinct tokens, **0.992 diversity score**, 3 cross-puzzle label collisions (chess pieces, greek gods, particles), 0 niche flags.

C2 `docs/content/EASY_VS_MEDIUM_PROFILE.md` — the cognitive profile. Defines what easy is (recognition), what medium is (disambiguation under pressure), category shapes, item pools, false trails, red lines, authoring heuristics (10-question table), pool balance target for 500, rejection criteria.

C3 + C5 `docs/content/BATCH_WORKFLOW.md` — the scale-to-500 workflow. Why batches. Batch size 25 (15 easy + 8 medium + 2 reserve). Seven-step draft process. Editorial rejection quota ≥30%. Diversity guardrails. Explicit stop condition: "A disciplined 200-puzzle pool beats an undisciplined 500."

C4 Pool expansion 98 → 150 — **deferred.** Rushing 52 drafts in one autonomous pass would violate every rejection-quota heuristic in the new workflow and destroy the trust the existing 98 built. The validator extensions and profile doc are the prerequisite work; the human-driven batches are the follow-up.

---

## Sprint 6 — Monetization readiness (scoped down)

Scope-keeper verdict (from the Sprint 0 audit): premium, ads, and network analytics are red-flagged for 1.0. Only three items survive the cut:

M1 Privacy note — present in `AboutFooter.tsx`. One sentence: "No accounts, no tracking, no network. Your stats, streaks, sound preference, and an optional local-only event counter live in your browser's localStorage and never leave your device."
M2 Support channel — `hello@foldwink.com` in the same footer.
M3 Local event log — `src/analytics/eventLog.ts`. Pure localStorage counters, no network, no identifiers. `logEvent("menu:view")` fires on menu mount. `clearEventLog` is reachable from the About footer with an explicit affordance.

Deferred past 1.0:

- Ad integration
- Premium / supporter tier / paid packs
- Network analytics (Plausible, Umami, anything)
- Pay affordance in the app

This is deliberate. A monetization attempt at this stage would fail and be remembered.

---

## Sprint 7 — Final QA and stabilization

Q1 Regression pass — every change in sprints 0.5–6 ran through `typecheck` + `test` + `lint` + `format:check` + `build` + `validate` before the next sprint started. Every gate green at every checkpoint.
Q2 Share flow — the pipeline has 5 fallback layers. Manual browser verification is a Sprint 0.5 H11 item that still needs a human.
Q3 Audio sanity — no binary files, no 404s. Mute persists. First play is guarded by a user gesture (auto-resume on suspended context). No auto-play on app boot.
Q4 Perf — bundle grew from 74 kB → 79.4 kB gzip (+7% for motion tokens + Web Audio engine + canvas share-card + grading + mid-game persistence + local event log + AboutFooter). CSS +0.4 kB gzip for the new keyframes.
Q5 Release readiness report — **this document.**

### Final quality scorecard (1–10, self-assessment)

| Dimension                 | 0.3.3 | 0.4.0 | Notes                                                                  |
| ------------------------- | ----- | ----- | ---------------------------------------------------------------------- |
| Visual coherence          | 7     | 8     | Motion tokens + pop + lift + shake make the UI feel tactile            |
| Readability               | 8     | 8     | Card text unchanged, contrast unchanged                                |
| Tactility                 | 5     | 8     | Audio + motion + selected-lift — this is the biggest jump              |
| Audio quality (inferred)  | 0     | 7     | Synthesised palette is tasteful; final recorded assets would push to 9 |
| Solve payoff              | 7     | 8     | Grade card + sound win cue + fw-pop on cards                           |
| Daily ritual strength     | 8     | 8     | `DailyCompleteCard` + countdown + streak already strong                |
| Shareability              | 6     | 8     | Framed image card > emoji grid text                                    |
| Retention readiness       | 6     | 8     | Grading + mid-game persistence + depth stats                           |
| Content pipeline maturity | 6     | 8     | Validator extensions + profile + workflow — scaffolding for 500        |
| Release readiness         | 8     | 8.5   | Still gated on the first human browser QA pass                         |
| Commercial readiness      | 6     | 6     | Deliberately unchanged — scoped down                                   |

---

## Changed files (cumulative across post-MVP sprints)

### New

- `src/components/ErrorBoundary.tsx`
- `src/components/SoundToggle.tsx`
- `src/components/AboutFooter.tsx`
- `src/styles/motion.ts`
- `src/audio/sound.ts`
- `src/audio/useSound.ts`
- `src/share/shareCard.ts`
- `src/game/engine/grading.ts`
- `src/game/engine/__tests__/grading.test.ts`
- `src/analytics/eventLog.ts`
- `docs/content/EASY_VS_MEDIUM_PROFILE.md`
- `docs/content/BATCH_WORKFLOW.md`
- `docs/reports/FOLDWINK_SPRINT_0_AUDIT.md`
- `docs/reports/FOLDWINK_POST_MVP_SPRINTS_REPORT.md` (this file)

### Modified

- `CLAUDE.md` (full rewrite, Cluster Twist → Foldwink)
- `package.json` (0.3.3 → 0.4.0)
- `.gitignore`
- `docs/PUZZLE_SCHEMA.md` (AnchorTwist removed, medium example rewritten)
- `docs/RELEASE_NOTES.md` (0.4.0 section)
- `docs/TODO.md` (post-MVP backlog opened + marked through Sprint 7)
- `scripts/validate-puzzles.ts` (header + `editorialNotes` field + diversity/collision extensions)
- `src/main.tsx` (ErrorBoundary wired)
- `src/styles/index.css` (fw-shake, fw-pop, fw-tab-reveal keyframes + reduced-motion)
- `src/components/Card.tsx` (MOTION_CLASS integration)
- `src/components/Grid.tsx` (shake prop)
- `src/components/FoldwinkTabs.tsx` (preserve ✦ on solved-winked, stage-key reveal animation)
- `src/components/ShareButton.tsx` (image pipeline with 5 fallbacks)
- `src/screens/GameScreen.tsx` (sound hooks + motion wiring + mid-game persistence via store)
- `src/screens/ResultScreen.tsx` (grade card + share-card options + sound on arrival)
- `src/screens/StatsScreen.tsx` (2×2 layout + Depth section)
- `src/screens/MenuScreen.tsx` (SoundToggle + AboutFooter + event log)
- `src/game/state/store.ts` (dailyPlayedDate drop + canWinkGroup call + GameResultContext + initialActive/Puzzle/Screen deps)
- `src/game/state/appStore.ts` (mid-game session load/save/clear)
- `src/game/state/__tests__/store.test.ts` (migrated to new selectors + GameResultContext)
- `src/game/engine/foldwinkTabs.ts` (unchanged but referenced)
- `src/game/types/stats.ts` (5 new optional counters)
- `src/stats/stats.ts` (GameResultContext signature)
- `src/stats/persistence.ts` (active session functions)
- `src/stats/__tests__/stats.test.ts` (migrated to new signature + 3 new tests)

### Deleted

- `foldwink-audit-results.zip`
- `README_START_HERE.md`
- `FOLDWINK_MASTER_MEGA_PROMPT.md` (root copy; the `docs/` copy is the canonical one)
- `audit-results/`
- `.tsbuildinfo-node/`
- `tsconfig.tsbuildinfo`
- `tsconfig.node.tsbuildinfo`

---

## Tests Run

- `npm run typecheck` — PASS at every checkpoint
- `npm test` — **76 / 76 across 10 suites** (65 → 76, +11: +8 grading, +3 stats counters; `applyGameResult` tests migrated in place)
- `npm run lint` — PASS, 0 warnings
- `npm run format:check` — PASS
- `npm run validate` — PASS, 98 puzzles (65 easy + 33 medium), 96 warnings (93 expected cross-puzzle item reuse + 3 surfaced cross-puzzle label collisions), diversity 0.992
- `npm run build` — PASS, 243.16 kB JS / 79.39 kB gzip, 17.60 kB CSS / 4.41 kB gzip

---

## Open Risks

1. **No in-browser QA pass has been run.** Every visual and audio claim is inferred from code. A single 30-minute session on a phone + desktop viewport is the remaining hard blocker before a public launch. Sprint 0.5 item H11 is still open.
2. **Pool still at 98.** The validator extensions and the profile/workflow docs are the prerequisites for the growth. The growth itself needs human-driven editorial batches, and rushing it in one autonomous pass would break the quality bar that keeps Foldwink trustworthy.
3. **No real designed wordmark / logotype / raster OG image.** All three are human-art tasks outside this autonomous pass. The current system-sans wordmark is honest-minimalist and won't break a closed-beta test, but a public launch needs the designed mark.
4. **Sound assets are synthesised.** The palette is tactile and tasteful but will not beat a professionally-recorded paper-card-wood set. A later pass can swap in real samples without touching any call site — `RECIPES` is the single integration point.
5. **Mid-game persistence rides on a simple localStorage blob.** If the `ActiveGame` type schema changes later, the saved blob needs an invalidation path. Not urgent; noted for future contributors.
6. **Content pipeline scale stop condition is soft.** 200 vs 500 is a judgement call that depends on how the first few batches land. The batch workflow doc says so explicitly.

---

## Go / No-Go

**Go for a closed-beta invitation round on 0.4.0, conditional on the first in-browser QA pass (H11) being run by a human before the invitations go out.**

No-Go for a public launch until:

- H11 done
- Real wordmark / OG image landed
- Pool ≥ 150 via one or two disciplined batches
- A deployed branded domain

Next smallest high-value step: run the in-browser QA pass from `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` against the 0.4.0 preview build on one phone-sized and one desktop-sized viewport.
