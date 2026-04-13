# Foldwink — Master Analysis Handoff

Generated: 2026-04-12
Source: repo `sunlike78/foldwink`, commit `a2c82a5`, version **0.6.0**
Purpose: self-contained analytical document for external review without repo access.

---

## 1. Executive Summary

**Foldwink** is a short-session daily grouping puzzle game by Neural Void. The player sees a 4x4 grid of 16 cards and must find 4 hidden groups of 4 that share a category. Easy puzzles are plain classification. Medium adds progressive-reveal **Foldwink Tabs** (hidden category hints that reveal one letter per solve) and one **Wink** (player-initiated full reveal of one tab). Hard (Master Challenge) slows the tabs to half-speed and removes Wink entirely.

| Fact            | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| Version         | **0.6.0**                                                        |
| Live URL        | https://sunlike78.github.io/foldwink/                            |
| Repo            | https://github.com/sunlike78/foldwink                            |
| Current library | **200 curated puzzles** (105 easy + 75 medium + 20 hard)         |
| Target library  | **500**                                                          |
| Tests           | 108 / 108 across 11 suites                                       |
| Bundle          | 321 kB JS / 103 kB gzip                                          |
| Deploy          | GitHub Pages via Actions, last deploy successful                 |
| Stack           | React 18 + TypeScript + Vite 5 + Zustand + Tailwind 3 + Vitest 2 |
| Runtime deps    | 3 (react, react-dom, zustand)                                    |

**Overall verdict:** Foldwink is a **playable, deployed, externally testable** small indie puzzle product. It has a distinct mechanic (Tabs + Wink), a 200-puzzle curated library across three difficulty tiers, a progression system, sound, share, and branding. It is NOT monetization-ready. It IS friend-testing-ready and conditionally public-test-ready.

---

## 2. Current Product Facts

| Metric           | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Version          | 0.6.0                                                    |
| Live URL         | https://sunlike78.github.io/foldwink/                    |
| Repo             | https://github.com/sunlike78/foldwink                    |
| Stack            | React 18 + TS + Vite 5 + Tailwind 3 + Zustand + Vitest 2 |
| Tests            | 108 / 108 (11 suites)                                    |
| Build size       | 321 kB JS / 103 kB gzip, 18 kB CSS / 4.5 kB gzip         |
| Puzzles (actual) | **200** (105 easy + 75 medium + 20 hard)                 |
| Puzzles (target) | **500**                                                  |
| Hard status      | **Credible small tier** — 20 real puzzles, playable mode |
| Deploy           | GitHub Pages, Actions workflow, last deploy green        |
| Persistence      | localStorage only (7 keys), no backend                   |
| Analytics        | Local-only aggregate counters, no network                |
| Branding         | "Foldwink by Neural Void", foldwink@neural-void.com      |
| OG image         | SVG only (raster PNG deferred)                           |
| Wordmark         | System sans, no human-designed logotype                  |
| Monetization     | None. No ads, no premium, no payment integration         |

---

## 3. Product State Snapshot

### What is already strong

- Core gameplay loop is tight: select 4 cards, submit, get immediate feedback, repeat. 2-5 minute sessions.
- Foldwink Tabs + Wink is a genuine differentiating mechanic that no other grouping puzzle has in this form.
- Progression from Easy to Medium to Hard is guided via a soft-gate model (nudge at 3 easy wins, unlock at 5, recommendation based on win rate/mistakes/recency, fallback on 2 consecutive losses).
- Sound system exists (9 cues, Web Audio synthesis, tactile paper/card/wood palette). iOS Safari resume fix in place.
- Share system has a 5-layer fallback pipeline (navigator.share with image -> clipboard image -> download -> navigator.share text -> clipboard text).
- Daily mode is deterministic by local date via FNV-1a hash.
- Mid-game persistence restores games on reload.
- Grading system (flawless / clean / steady / clutch / no-wink-medium / loss).
- Error boundary at the app root.
- All content passes structural + editorial validation.

### What is not yet strong enough

- **No human browser QA has ever been run.** Every visual, audio, and UX claim is inferred from code only. This is the single biggest confidence gap.
- **Sound recipes are synthesized**, not recorded. Material direction is documented but never validated by ear.
- **Share card has never been visually verified** — canvas output untested.
- **Accessibility is baseline.** Arrow-key grid nav was added in 0.5.0, solved cards have shape markers (●◆▲■), but no colour-blind audit, no screen-reader QA, no keyboard-only full flow test.
- **OG image is SVG** — many social scrapers prefer PNG/JPG.
- **No designed wordmark/logotype** — system sans with typographic treatment only.
- **No component or e2e tests** — only pure-logic unit tests.
- **Bundle at 103 kB gzip** is fine for the web but on the heavier side for an itch.io HTML5 embed.

### Product maturity class

**External-test ready (friend testing).** Conditionally ready for broader public testing. NOT monetization-ready.

---

## 4. Current Library and Content State

### Counts

| Difficulty | Count   | Share | Target (500) | Gap      |
| ---------- | ------- | ----- | ------------ | -------- |
| Easy       | 105     | 52.5% | ~175 (35%)   | +70      |
| Medium     | 75      | 37.5% | ~225 (45%)   | +150     |
| Hard       | 20      | 10%   | ~100 (20%)   | +80      |
| **Total**  | **200** | 100%  | **500**      | **+300** |

### Evolution

| Stage              | Easy    | Medium | Hard   | Total   |
| ------------------ | ------- | ------ | ------ | ------- |
| MVP (0.1.0)        | 18      | 12     | 0      | 30      |
| 0.3.0              | 47      | 26     | 0      | 73      |
| 0.3.3              | 65      | 33     | 0      | 98      |
| 0.6.0 batch-01     | 85      | 45     | 8      | 138     |
| **0.6.0 batch-02** | **105** | **75** | **20** | **200** |

### Milestones

| Milestone | Status                    |
| --------- | ------------------------- |
| 100       | done (0.6.0 batch-01)     |
| **200**   | **done (0.6.0 batch-02)** |
| 300       | next target               |
| 500       | final target              |

### Content quality signals (validator output)

| Signal                | Value                                                           |
| --------------------- | --------------------------------------------------------------- |
| Diversity score       | 0.956 (765 distinct labels / 800 total groups)                  |
| Label collisions      | 34 cross-puzzle                                                 |
| Niche character flags | 0                                                               |
| Metadata coverage     | 51% (102/200 carry full meta — all batch-01 + batch-02 puzzles) |
| Wordplay medium share | 12% (target ≤ 25%)                                              |
| Batches               | batch-01: 40, batch-02: 62                                      |

### Hard tier assessment

**Hard is credible but small.** 20 puzzles is enough for an initial playthrough and a taste of the upper tier. It is NOT enough for long-term retention of skilled players. The puzzle themes are diverse (language, abstract, science, professions) and the mechanical difference (half-speed Tabs, no Wink) is real.

Confidence: **medium-high** for structural quality; **unverified** for actual in-play feel (never played by a human).

---

## 5. Difficulty & Progression Model

### Difficulty ladder

| Tier   | Cognitive demand                  | Tabs                | Wink         | Reveal formula             |
| ------ | --------------------------------- | ------------------- | ------------ | -------------------------- |
| Easy   | Recognition, low ambiguity        | none                | none         | n/a                        |
| Medium | Disambiguation under noise        | yes, 1 letter/solve | yes (1/game) | `max(1, stage+1)`          |
| Hard   | Constraint reasoning, weaker help | yes, half-speed     | **none**     | `max(1, floor(stage/2)+1)` |

### Progression thresholds

| Transition    | Unlock        | Recommendation                                                 | Fallback                                  |
| ------------- | ------------- | -------------------------------------------------------------- | ----------------------------------------- |
| Easy → Medium | 5 easy wins   | 70% easy win rate + ≤ 2 avg mistakes + 2 recent confident wins | 2 consecutive medium losses → gentle hint |
| Medium → Hard | 3 medium wins | 5 medium wins + ≥ 60% medium win rate                          | 2 consecutive hard losses → gentle hint   |

- Time is a secondary confidence signal only (never a hard gate).
- Nudge at 3 easy wins ("Almost there").
- Unlock never regresses.
- Fallback never re-locks.

**Assessment:** Progression model is well-designed on paper. It is the strongest readiness/recommendation system I've seen in a puzzle MVP. However, it has **never been tested by a real player walking the full progression path**. The thresholds (5 wins, 70% rate, etc.) are reasonable guesses, not data-driven.

---

## 6. Core Gameplay State

### Rules

- 4×4 grid of 16 cards (text only)
- Select exactly 4 → Submit
- Correct: group locks in with colour tint + shape marker (●◆▲■)
- Incorrect: +1 mistake
- 4 mistakes = loss
- All 4 groups = win
- Max 1 Wink per medium game (no Wink on easy/hard)

### Modes

| Mode   | Source                                          | Cursor                  | Replay                          |
| ------ | ----------------------------------------------- | ----------------------- | ------------------------------- |
| Daily  | Full pool, deterministic by local date (FNV-1a) | n/a                     | Allowed, doesn't count to stats |
| Easy   | EASY_POOL (105)                                 | `progress.easyCursor`   | Sequential with wrap            |
| Medium | MEDIUM_POOL (75)                                | `progress.mediumCursor` | Sequential with wrap            |
| Hard   | HARD_POOL (20)                                  | `progress.hardCursor`   | Sequential with wrap            |

### Persistence

- Mid-game session auto-saves to `foldwink:active-session` on every mutation
- Restored on cold start if puzzle still in pool
- Cleared on menu/result transitions
- All stats in localStorage (7 keys total)

### Grading

| Grade          | Condition                                       |
| -------------- | ----------------------------------------------- |
| Flawless       | 0 mistakes, win                                 |
| Clean solve    | 1 mistake                                       |
| Steady solve   | 2 mistakes                                      |
| Clutch         | 3 mistakes (one away from loss)                 |
| No-Wink Medium | Medium win without using Wink (composable flag) |
| Close call     | Loss                                            |

### Stats tracked

gamesPlayed, wins, losses, currentStreak, bestStreak, solvedPuzzleIds, mediumWins, mediumLosses, totalMistakes, winkUses, flawlessWins, mediumLossStreak, hardWins, hardLosses, hardLossStreak, recentSolves (last 10 FIFO).

**Assessment:** Core gameplay is solid and mechanically complete. The split into Easy/Medium/Hard tracks with independent cursors is clean. Daily mode works. Grading adds post-puzzle texture without inflation. **Confidence: high** for code correctness; **unverified** for feel/pacing.

---

## 7. Foldwink Tabs / Wink Assessment

### How it works

- Medium: 4 tabs above the grid, each showing a `revealHint` keyword progressively (1 letter initially, +1 per solved group). Solved tab snaps to full label in colour.
- Hard: Same Tabs but reveal at half speed (1 letter stays until 2 groups solved).
- Wink: Medium-only. Player taps any unsolved tab once per game to fully reveal its keyword. Strategic choice: when to spend it. Winked tab shows ✦ mark, preserved even after solving.

### Differentiation value

Foldwink Tabs + Wink is the **only original mechanic** that separates Foldwink from other grouping puzzle clones. Without it, Foldwink is "just another Connections clone". With it, the Medium experience is genuinely distinct. Hard's reduced Tabs + no Wink creates real strategic pressure without new mechanics.

### Fairness assessment

- Tabs are helpful but not giveaway: revealing one letter is a hint, not an answer.
- Wink is player-controlled, optional, and capped at one: no abuse, no randomness.
- `canWinkGroup()` enforces rules cleanly; `revealStage()` and `revealStageHard()` are pure and tested.
- `revealHint` must be a keyword, not a giveaway item — enforced by editorial guidelines.

**Confidence: high** for mechanical correctness. **Medium** for UX quality (never observed in browser).

---

## 8. Front-End / UX Assessment

### MenuScreen

- Wordmark + BrandMark lockup with "by Neural Void" sublabel
- Daily button (primary or "Replay daily" if today's puzzle done)
- Easy button (always available)
- Medium button (disabled until 5 easy wins, labeled "Medium — locked")
- Hard / Master Challenge button (disabled until 3 medium wins OR no content, shows "Master Challenge — soon" / "locked" / normal)
- Readiness signal line under buttons (shows progression level + caption)
- Fallback line if applicable (after consecutive losses)
- Streak display if active
- Footer: puzzle count + SoundToggle + AboutFooter (collapsible)
- **Strength:** clear hierarchy, guided progression, honest Hard state
- **Weakness:** visually dense with 5+ buttons + signals + footer; never tested on small screens

### GameScreen

- Header: title, difficulty · mode label, GameTimer (live M:SS), MistakesDots
- FoldwinkTabs (medium/hard only)
- 4×4 Grid with arrow-key navigation (role="grid")
- Cards with selection lift, solved pop, shape markers (●◆▲■)
- Submit + Clear buttons, selection count
- Quit to menu link
- Grid shake animation on wrong guess
- Sound cues wired: select, deselect, submit, correct, wrong, tabReveal, wink
- **Strength:** core interactions clean, timer adds awareness, a11y improved
- **Weakness:** GameTimer never observed live; grid arrow-key nav never tested

### ResultScreen

- ResultSummary: headline + stat strip (time / mistakes / streak) + group list
- Grade card (Flawless / Clean / etc.)
- Streak celebration card (if applicable)
- Loss encouragement card
- Daily countdown (next daily in HH:MM:SS)
- Share section with ShareButton (text + canvas card)
- Next puzzle / Stats / Back to menu buttons
- **Strength:** complete flow for all outcomes
- **Weakness:** share card never visually verified

### StatsScreen

- Wordmark + StatStrip (Solved / Played / Win %)
- 2×2 stat cells (Wins / Losses / Streak / Best)
- Depth section (Flawless / Avg mistakes / Medium win % / Winks spent)
- **Daily Archive** — last 30 daily records (date, solved/failed, mistakes, time)
- Back to menu
- **Strength:** meaningful stats, daily history adds retention surface
- **Weakness:** no Medium/Hard breakdown in stats display

### Onboarding

- First-run modal with BrandMark + grid illustration + tab demo
- 4 bullet points explaining: core rules, mistakes, Easy/Medium/Hard ladder, Tabs + Wink
- "Got it" dismisses and persists
- **Strength:** covers the difficulty ladder, concise
- **Weakness:** doesn't explain progression (unlock thresholds) — acceptable for first-run simplicity

### Hard surface

- Master Challenge button visible, disabled with honest label when pool empty or locked
- When unlocked + content present: enabled as ghost variant
- When recommended: enabled as primary
- Readiness caption explains what Hard is
- **Assessment:** surface is honest and functional. 20 hard puzzles make it playable.

---

## 9. Sound / Motion / Share Assessment

### Sound system

| Aspect                               | Status                                                                     | Confidence                      |
| ------------------------------------ | -------------------------------------------------------------------------- | ------------------------------- |
| 9 cues implemented                   | yes                                                                        | high (code verified)            |
| Web Audio synthesis                  | yes                                                                        | high                            |
| Bodies ≤ 280 Hz                      | yes                                                                        | high (no bright chime)          |
| iOS Safari resume fix                | yes                                                                        | high (tested on iPhone)         |
| Mute toggle + persistence            | yes                                                                        | high                            |
| Sound heard by human                 | **partial** — iOS test confirmed audio works; recipes not quality-assessed | **medium**                      |
| Material direction (paper/wood/bone) | documented in docs/SOUND_DESIGN.md                                         | **inferred from code, not ear** |

**Verdict:** Sound works. Sound _quality_ is unverified beyond "it plays and it's not silence."

### Motion system

| Animation          | Trigger             | Duration   | Confidence    |
| ------------------ | ------------------- | ---------- | ------------- |
| Card press (scale) | any tap             | 120 ms     | code-verified |
| Selected lift      | selected card       | continuous | code-verified |
| Solved pop         | card becomes solved | 260 ms     | code-verified |
| Grid shake         | wrong guess         | 420 ms     | code-verified |
| Result pop         | result screen       | 320 ms     | code-verified |
| Tab reveal         | tab content changes | 220 ms     | code-verified |
| Streak pulse       | streak card         | 1800 ms    | code-verified |
| Reduced motion     | all                 | respected  | code-verified |

**Verdict:** Motion tokens centralized in one file. All animations CSS-only, transform-based, no library. **Never observed in browser.** Could be too subtle or too aggressive.

### Share system

| Layer                  | Status                                      | Confidence                                      |
| ---------------------- | ------------------------------------------- | ----------------------------------------------- |
| Text share string      | shipped                                     | high                                            |
| Canvas 1080×1080 card  | shipped                                     | **low** — never rendered and visually inspected |
| navigator.share(files) | shipped                                     | medium — depends on browser support             |
| Clipboard image        | shipped                                     | medium                                          |
| Download fallback      | shipped                                     | medium                                          |
| Text-only fallback     | shipped                                     | high                                            |
| Branding on card       | "BY NEURAL VOID" + neural-void.com/foldwink | code-verified                                   |

**Verdict:** Pipeline is architecturally sound with 5 fallback layers. Visual quality of the canvas card is the main unknown.

---

## 10. Branding Assessment

| Surface                   | Content                                                    | Status                         |
| ------------------------- | ---------------------------------------------------------- | ------------------------------ |
| Wordmark                  | System sans `<h1>Foldwink</h1>` + accent underline         | interim — no designed logotype |
| "by Neural Void" sublabel | Shown on lg Wordmark, share card, OG image                 | consistent                     |
| BrandMark SVG             | 2×2 coloured tile motif + accent star                      | shipped                        |
| Support email             | foldwink@neural-void.com (AboutFooter mailto)              | shipped                        |
| Site URL                  | neural-void.com/foldwink (share text, card, OG, meta)      | text-only — domain not wired   |
| OG image                  | 1200×630 SVG with tiles + "BY NEURAL VOID"                 | SVG only, raster deferred      |
| Manifest                  | Standalone, portrait, dark theme, categories: games/puzzle | shipped                        |
| Meta tags                 | og:url, twitter:card, description mentions Neural Void     | shipped                        |

**Assessment:** Branding is **consistent but interim.** The "by Neural Void" presence is coherent across all surfaces. The wordmark is honest-minimalist but not memorable. A designed logotype and raster OG image would significantly improve social presence and store-page readiness.

---

## 11. Testing / QA / Confidence Map

| Area                        | Method                                      | Confidence |
| --------------------------- | ------------------------------------------- | ---------- |
| Pure game logic (engine)    | 108 Vitest unit tests                       | **high**   |
| Store actions + state       | 20 store tests                              | **high**   |
| Progression/readiness       | 24 readiness tests                          | **high**   |
| Stats bookkeeping           | 11 stats tests                              | **high**   |
| Daily determinism           | 4 daily tests                               | **high**   |
| Content structural validity | Validator (200 puzzles, 0 errors)           | **high**   |
| Content editorial quality   | Authored by AI, not human-reviewed          | **medium** |
| TypeScript types            | `tsc --noEmit` clean                        | **high**   |
| Lint                        | ESLint clean                                | **high**   |
| Component rendering         | **no tests**                                | **none**   |
| E2E / integration           | **no tests**                                | **none**   |
| Browser visual QA           | **never run**                               | **none**   |
| Mobile responsive QA        | **never run**                               | **none**   |
| Sound quality QA            | iOS confirmed working; quality not assessed | **low**    |
| Share card visual QA        | **never rendered and inspected**            | **none**   |
| Colour-blind accessibility  | **never audited**                           | **none**   |
| Keyboard-only full flow     | **never tested**                            | **low**    |
| Screen reader experience    | **basic aria only, never tested**           | **low**    |

---

## 12. Validator / Tooling / Content Ops

### Validator features (`scripts/validate-puzzles.ts`)

| Check                               | Type              |
| ----------------------------------- | ----------------- |
| 4 groups × 4 items                  | hard error        |
| Unique IDs (puzzle + group)         | hard error        |
| Valid difficulty (easy/medium/hard) | hard error        |
| Non-empty items/labels              | hard error        |
| No intra-puzzle item duplicates     | hard error        |
| revealHint presence on medium       | hard error        |
| Item length [2, 22]                 | warning           |
| Cross-puzzle item reuse             | warning           |
| revealHint length ≤ 24              | warning           |
| revealHint duplicates within puzzle | warning           |
| Niche characters (unusual Unicode)  | warning           |
| Label shape collisions across pool  | warning           |
| Theme signature collisions          | warning           |
| Diversity score                     | info line         |
| Metadata coverage                   | info line         |
| Wordplay medium share               | info line         |
| Per-batch counts                    | info line         |
| fairnessRisk ≥ 2                    | editorial warning |

### Scaling readiness

The validator is sufficient for disciplined growth to 500. It catches structural problems, flags editorial risks, and reports diversity/coverage metrics. The main gap is that **editorial quality assessment is still fully manual** — the validator cannot judge whether a puzzle is fun, fair in practice, or boringly similar to another.

---

## 13. Milestones / Evolution Summary

| Version   | Date           | Key changes                                                                                                                                                                             |
| --------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1.0     | 2026-04-10     | Internal MVP: 30 puzzles, core loop, daily mode, stats. Codename "Cluster Twist".                                                                                                       |
| 0.2.0     | 2026-04-11     | Rebrand to Foldwink. Share flow. Onboarding. Anchor twist (later removed). 42 puzzles.                                                                                                  |
| 0.3.0     | 2026-04-11     | **Foldwink Tabs mechanic.** BrandMark. 73 puzzles. Anchor twist replaced by Tabs.                                                                                                       |
| 0.3.1     | 2026-04-11     | **Wink mechanic** — one-per-puzzle active player choice. 65 tests.                                                                                                                      |
| 0.3.3     | 2026-04-11     | Closed-beta candidate. 98 puzzles. CI. Closed-beta pack.                                                                                                                                |
| 0.4.0     | 2026-04-11     | Post-MVP 8-sprint pass: ErrorBoundary, motion tokens, Web Audio sound (9 cues), canvas share card, grading, mid-game persistence, content pipeline docs+validator extensions. 76 tests. |
| 0.4.1     | 2026-04-12     | Neural Void branding integrated. Sound retuned (bodies ≤ 280 Hz). Content metadata schema.                                                                                              |
| 0.4.2     | 2026-04-12     | Easy/Medium progression model (soft-gate, recommendation, fallback). Standard split into Easy+Medium tracks. 98 puzzles still.                                                          |
| 0.4.3     | 2026-04-12     | Hard / Master Challenge scaffolded (engine, store, readiness, validator, UI — 0 puzzles).                                                                                               |
| 0.5.0     | 2026-04-12     | Front-end pass: live in-game timer, daily archive, onboarding V2, arrow-key grid nav, colour-beyond-colour markers.                                                                     |
| **0.6.0** | **2026-04-12** | **Content expansion: 98 → 200 puzzles** in two batches. Hard goes from 0 to 20. Master Challenge becomes playable. Milestone 200 reached.                                               |

---

## 14. Known Issues / Weaknesses / Deferred Work

### Critical

1. **No human browser QA has ever been run.** All visual/audio/UX claims are code-inferred. This blocks confident external release.

### High

2. **Sound recipes never quality-assessed by ear.** Working but possibly too synthetic.
3. **Share card never visually verified.** Typography/spacing unknown.
4. **No raster OG image.** Social previews may look broken on Twitter/Facebook.
5. **No designed wordmark/logotype.** Product looks honest-minimal but not memorable.
6. **No component or e2e tests.** Regression risk on UI surfaces.
7. **Content was authored by AI, not human-reviewed for playability.** Structural correctness confirmed; game-feel quality assumed.

### Medium

8. **Bundle 103 kB gzip** — not problematic for web but heavier for itch.io embed.
9. **98 original puzzles have no metadata** — only batch-01 + batch-02 puzzles (102/200) carry meta.
10. **34 cross-puzzle label collisions** — mostly domain terms, not critical but worth editorial attention.
11. **Accessibility is baseline** — no colour-blind audit, no screen-reader QA.
12. **No branded domain deployed** — neural-void.com/foldwink is text-only placeholder.
13. **StatsScreen doesn't show Medium/Hard breakdown** separately.

### Low / Deferred

14. No in-app purchase / premium / ad system.
15. No localization beyond English.
16. No cloud sync / accounts.
17. No "one-away" hint.
18. Standard mode wraps with no "finished everything" celebration.
19. No export/import of stats.

---

## 15. Readiness Verdicts

| Level                   | Verdict                                                                       | Why                                                                                                    | Blockers                                                                     |
| ----------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Internal QA**         | **Conditional Ready**                                                         | All automated gates green; 200 puzzles validate; progression logic tested.                             | Browser QA never run. Sound never heard by reviewer.                         |
| **Friend testing**      | **Ready**                                                                     | Product is playable, deployed, distinct. Friends can play and give feedback now.                       | Need to communicate that sound/share card may have rough edges.              |
| **Broader public test** | **Conditional Ready**                                                         | Enough content (200), progression works, deploy live.                                                  | Missing: raster OG, designed wordmark, browser QA pass, sound quality check. |
| **Monetization**        | **Not Ready**                                                                 | No payment integration, no premium surface, content still growing, sound unverified, no real wordmark. | Needs: 300+ puzzles, verified sound, designed branding, payment setup.       |
| **B2B demo**            | **Not directly relevant** but could demo the puzzle engine and Tabs mechanic. | Would need a dedicated demo flow or presentation page.                                                 | Out of scope for current product state.                                      |

---

## 16. Recommended Next Steps

### Immediate (before next code sprint)

1. **Run the browser QA pass** (`docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md`) on a phone + desktop. This is the #1 blocker.
2. **Listen to all 9 sound cues** twice on speakers + headphones. Mark any that feel synthetic.
3. **Render 3 share-card outputs** and visually verify typography/spacing.
4. **Raster OG image** — export og.svg to a 1200×630 PNG.
5. **Play 5 puzzles at each difficulty** as a human. Note any that feel unfair or boring.

### Next sprint

1. Content batch-03: +50 medium + +30 hard + +20 easy → 300 total.
2. Fix any issues surfaced by the browser QA pass.
3. Retune sound cues if ear test reveals problems.
4. Add component tests for ErrorBoundary, ShareButton, FoldwinkTabs.

### What NOT to do

- Do not add monetization before 300+ puzzles and verified sound/visual quality.
- Do not add a backend, accounts, or cloud sync.
- Do not add new mechanics (the Tabs + Wink identity is strong enough).
- Do not mass-generate puzzles without the batch pipeline discipline.
- Do not redesign the progression system — it's well-structured, just untested.

---

## 17. Confidence & Honesty Notes

| Claim                                      | Basis                                                                                | Confidence             |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------- |
| 200 puzzles pass structural validation     | `npm run validate` output, 0 errors                                                  | **confirmed**          |
| All 108 tests pass                         | `npm test` output                                                                    | **confirmed**          |
| Build succeeds                             | `npm run build` output                                                               | **confirmed**          |
| Deploy is live                             | `gh run list` + HTTP 200 on live URL                                                 | **confirmed**          |
| Progression logic works correctly          | 24 unit tests + code review                                                          | **high (code)**        |
| Sound plays on iOS Safari                  | Tested by user in a prior session                                                    | **confirmed (works)**  |
| Sound _quality_ matches material direction | Recipes tuned to spec but never ear-tested by reviewer                               | **inferred from code** |
| Share card looks good                      | Canvas drawing code reviewed, never rendered                                         | **inferred from code** |
| Motion animations feel right               | CSS keyframes reviewed, never observed in browser                                    | **inferred from code** |
| Puzzle fairness                            | Authored with editorial discipline, structurally validated, never played by human    | **medium**             |
| Hard is genuinely harder than Medium       | Mechanical rules (half-speed Tabs, no Wink) are real; puzzle content quality assumed | **medium**             |
| Onboarding is clear for first-time players | Copy reviewed, never tested on a naive user                                          | **inferred**           |
| Accessibility is adequate                  | Arrow-key nav + shape markers added, never tested with assistive tech                | **low**                |

---

## 18. Itch.io Publishing & Monetization Readiness

### X1 — HTML5 Delivery Readiness

| Check                               | Status                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Self-contained build                | **yes** — `dist/` contains index.html + hashed assets + manifest + favicon + og.svg       |
| Relative asset paths (`base: "./"`) | **yes** — works on any subpath including itch.io iframe                                   |
| iframe embed suitability            | **yes** — no router, no path-dependent logic, no external API calls                       |
| Fullscreen launch suitability       | **yes** — `min-h-full` layout, viewport-fit=cover, touch-action: manipulation             |
| Mobile-friendly                     | **probably** — Tailwind responsive, mobile-first design, but never QA'd on mobile browser |
| Audio after user interaction        | **yes** — AudioContext resume chains onto first user gesture (iOS fix in place)           |
| No scroll trapping                  | **probably** — `touch-action: manipulation` on body, but untested in itch.io iframe       |
| No unsupported API deps             | **yes** — Web Audio, Canvas, localStorage, navigator.share (with fallbacks)               |
| Recommended embed size              | 420×720 (portrait mobile) or 800×600 (desktop)                                            |
| Recommended launch mode             | **Click to launch in new window** (avoids iframe scroll/sizing issues)                    |

**Verdict: Conditional Ready.** The build is technically suitable for itch.io HTML5 upload. The main risk is untested iframe embed behavior and mobile viewport sizing within itch.io's player wrapper.

**Blocker:** Run one test upload to itch.io in draft mode and verify the game loads, sounds work after first click, and the viewport isn't clipped.

### X2 — Store Page Readiness

| Asset                 | Status                                                               |
| --------------------- | -------------------------------------------------------------------- |
| Project title         | "Foldwink" — ready                                                   |
| Tagline               | "A short daily grouping puzzle by Neural Void" — ready               |
| Short description     | Available from README/meta — ready                                   |
| Long description      | Needs dedicated itch.io copy — **partial**                           |
| Screenshots           | **missing** — no screenshots exist                                   |
| Cover image (630×500) | **missing** — og.svg exists but needs raster conversion and cropping |
| Favicon/icon          | favicon.svg exists — needs PNG conversion for itch.io                |
| Version text          | "0.6.0 — 200 curated puzzles" — ready                                |
| Support/contact       | foldwink@neural-void.com — ready                                     |
| Privacy statement     | In-app AboutFooter — ready for reference                             |
| Devlog/update notes   | Release notes exist in docs — needs itch.io formatting               |

**Verdict: Not Ready.** Missing screenshots and cover image are hard blockers for a credible store page. Writing dedicated itch.io copy is a medium blocker.

**Minimum asset list for itch.io page:**

1. 3–5 screenshots (menu, easy game, medium with tabs, result, stats)
2. Cover image 630×500 PNG
3. Dedicated store description (~200 words)
4. "What's included" section (200 puzzles, 3 difficulties, daily mode)

### X3 — Monetization Readiness

**Verdict: Not Ready for paid.** Ready for **free** or **pay-what-you-want (minimum $0)**.

| Factor                            | Assessment                                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Content depth for paid            | 200 puzzles is borderline — enough for a free test, thin for a paid product. 300+ with verified quality would be stronger. |
| Polish for paid                   | Sound/share/visual unverified. No designed wordmark. Paying customers expect higher polish.                                |
| Retention for paid                | Progression model is good on paper. Daily + 200 puzzles = ~3 months of play. Acceptable for a low price.                   |
| Payment setup                     | Not configured. Itch.io seller settings, Stripe/PayPal, tax — all manual/external.                                         |
| Recommended initial mode          | **Free** or **Pay-what-you-want ($0 minimum)** for the first external test round.                                          |
| Recommended first paid experiment | After 300+ puzzles + browser QA + screenshots: **pay-what-you-want with $1.50 minimum** or **fixed $2.00**.                |
| Revenue share                     | Itch.io default 10% to platform. Consider 0% during testing, 10% for paid.                                                 |

### X4 — External Test Readiness

| Test level                          | Verdict               | Why                                                                                   | Blockers                                                          |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Friend testing via itch.io**      | **Conditional Ready** | Game works, content sufficient, deploy live.                                          | Need: test upload to itch.io draft, screenshots, basic page copy. |
| **Soft public testing via itch.io** | **Not Ready**         | Missing screenshots, cover image, itch.io page copy. Unverified sound/visual quality. | Need: screenshots, cover, browser QA, sound check.                |
| **Paid test via itch.io**           | **Not Ready**         | All soft-public blockers + payment setup + content depth + verified polish.           | Need: 300+ puzzles, full QA, payment config.                      |

### X5 — Itch.io Release Checklist

**A. Build/package**

- [x] HTML5 package ready (`dist/` is self-contained)
- [x] Upload format: zip of `dist/` contents
- [x] Relative asset paths (`base: "./"`)
- [ ] Launch mode chosen → recommended: click-to-launch fullscreen
- [ ] Mobile-friendly verified in itch.io player
- [ ] Audio after click verified in itch.io player
- [ ] Viewport sizing tested in itch.io embed

**B. Store page**

- [x] Title: Foldwink
- [x] Tagline: "A short daily grouping puzzle by Neural Void"
- [ ] Short description (200 words)
- [ ] Long description with rules/features
- [ ] 3–5 screenshots
- [ ] Cover image 630×500 PNG
- [ ] Icon/favicon PNG
- [ ] Devlog/update text
- [x] Support/contact: foldwink@neural-void.com
- [x] External link: neural-void.com/foldwink (when domain live)
- [x] Version text: 0.6.0

**C. Monetization**

- [ ] Pricing model chosen (recommended: free or PWYW $0 minimum)
- [ ] Seller settings configured on itch.io
- [ ] Payment provider connected
- [ ] Payout/tax setup complete
- [ ] Revenue share setting chosen
- [x] Recommendation: **do NOT charge money until browser QA + screenshots + 300 puzzles**

**D. QA before itch.io publish**

- [ ] Desktop browser pass
- [ ] Mobile browser pass
- [ ] Fullscreen pass
- [ ] Audio pass (after first click)
- [ ] Share flow pass
- [ ] Onboarding pass
- [ ] Progression clarity pass
- [ ] Hard mode honesty pass
- [ ] Itch.io page asset review

### X6 — Final Itch.io Verdicts

| Question                         | Verdict                                                                                                   | Why                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Ready to upload as HTML5?        | **Conditional Ready**                                                                                     | Build is self-contained, paths are relative, audio has user-gesture fix. Need one test upload to verify itch.io iframe. |
| Ready for free external testing? | **Conditional Ready**                                                                                     | Game works. Need screenshots + page copy + one test upload.                                                             |
| Ready for pay-what-you-want?     | **Not Ready**                                                                                             | Missing screenshots, unverified sound/visual, no seller setup.                                                          |
| Ready for fixed-price?           | **Not Ready**                                                                                             | Needs 300+ puzzles, full QA, designed branding, payment setup.                                                          |
| Safest first config?             | **Free, unlisted, draft mode** for friend testing. Then **free public** after screenshots and browser QA. |

---

## 19. Appendix

### Key file paths

- Puzzles: `puzzles/pool/*.json` (200 files)
- Engine: `src/game/engine/` (8 pure modules)
- Store: `src/game/state/store.ts` + `appStore.ts`
- Components: `src/components/` (19 files)
- Screens: `src/screens/` (4 files)
- Sound: `src/audio/sound.ts` + `useSound.ts`
- Share: `src/share/shareCard.ts`
- Validator: `scripts/validate-puzzles.ts`
- Motion: `src/styles/motion.ts` + `index.css`

### Key commands

```
npm run typecheck   # tsc --noEmit
npm test            # vitest run (108 tests)
npm run lint        # eslint
npm run validate    # puzzle validator (200 puzzles)
npm run build       # production build to dist/
npm run dev         # local dev server
npm run preview     # serve built dist/
```

### Key docs

- `docs/PROGRESSION_RULES.md` — full progression model
- `docs/SOUND_DESIGN.md` — sound palette contract
- `docs/content/BATCH_WORKFLOW.md` — content scaling process
- `docs/content/EASY_VS_MEDIUM_PROFILE.md` — difficulty cognitive profile
- `docs/KNOWN_LIMITATIONS.md` — known gaps
- `docs/RELEASE_NOTES.md` — version history

### Final counts (repeated for clarity)

|                            | Count   |
| -------------------------- | ------- |
| **Total puzzles (actual)** | **200** |
| Easy                       | 105     |
| Medium                     | 75      |
| Hard                       | 20      |
| **Target**                 | **500** |
| Next milestone             | 300     |
| Tests                      | 108     |
| Build gzip                 | 103 kB  |

---

## 20. Itch.io Pre-Release Gate (Phase Y)

### Y1 — Real Package Readiness

**Package analysis:**

| Check                                        | Result                                                                                                           | Confidence |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| `dist/` is self-contained                    | **yes** — index.html + assets/ + favicon.svg + manifest.webmanifest + og.svg                                     | confirmed  |
| Root `index.html` at zip root                | **yes** — zipping `dist/*` places index.html at root                                                             | confirmed  |
| All asset refs are relative (`./`)           | **yes** — `./assets/index-BbLHCbui.js`, `./assets/index-G3ZBv_-R.css`, `./favicon.svg`, `./manifest.webmanifest` | confirmed  |
| No hardcoded localhost / absolute URLs in JS | **yes** — grep confirms 0 matches                                                                                | confirmed  |
| No extra files that shouldn't be uploaded    | **yes** — dist/ contains only build artifacts, no source                                                         | confirmed  |
| Total package size                           | **353 kB uncompressed** (~115 kB zipped)                                                                         | confirmed  |
| No dev dependencies in bundle                | **yes** — Vite tree-shakes, only react + react-dom + zustand                                                     | confirmed  |

**Persistence on itch.io:**

| Concern                  | Assessment                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| localStorage origin      | itch.io serves each game from its own subdomain (`*.itch.zone`), so localStorage is isolated per game. **Safe.** |
| Daily puzzle determinism | Based on `todayLocal()` which uses `new Date()` — works regardless of origin. **Safe.**                          |
| Mid-game session restore | Reads `foldwink:active-session` from localStorage — survives itch.io page reload. **Safe.**                      |
| Sound mute persistence   | Same key, same origin. **Safe.**                                                                                 |
| Stats persistence        | Same. **Safe.**                                                                                                  |
| Risk: clearing site data | Itch.io doesn't clear localStorage between visits. Only explicit user action. **Acceptable.**                    |

**iframe / fullscreen:**

| Concern                        | Assessment                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| iframe embed safety            | The app has no router, no path-dependent logic, no external API calls. Touch events use `touch-action: manipulation`. **Likely safe.**                |
| Scroll trapping risk           | Body has `touch-action: manipulation` and `height: 100%`. Possible issue: itch.io iframe may not give full viewport height. **Mild risk** — untested. |
| Keyboard focus in iframe       | Arrow-key grid nav works via `onKeyDown` on the grid div. Focus should propagate into iframe. **Likely safe but unverified.**                         |
| Fullscreen via click-to-launch | This avoids iframe sizing entirely. **Recommended mode.**                                                                                             |
| Recommended embed dimensions   | If embedded: **420×720** (portrait) or **800×600** (landscape).                                                                                       |

**Input behavior:**

| Input                | Assessment                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Mouse                | All buttons are `<button>` elements with click handlers. **Works.**                       |
| Touch                | Cards are buttons with generous padding (aspect-[3/2]). **Works on modern phones.**       |
| Keyboard             | Arrow keys navigate grid. Tab key cycles buttons. Enter/Space activates. **Works.**       |
| Small screen density | Cards are ~80px wide at 420px viewport. Text is `text-sm` (14px). **Adequate but tight.** |
| Pointer precision    | Cards have ample touch targets. Buttons have Tailwind padding. **Acceptable.**            |

**Package verdict: Conditional Ready.**
The build is technically suitable for itch.io. Relative paths, self-contained zip, no hardcoded URLs.

**Recommended launch mode: Click to launch in new window** (avoids iframe height issues).

**Packaging blocker: none.** The only remaining risk is untested itch.io iframe viewport behavior — mitigated by using click-to-launch mode.

### Y2 — Pre-Publish QA Matrix (Mandatory)

This checklist must be completed by a human before any itch.io publication.

**Desktop Chrome (or equivalent):**

| Check                                                          | Status               |
| -------------------------------------------------------------- | -------------------- |
| App loads without errors                                       | [ ] not yet verified |
| Onboarding appears on first visit, dismisses cleanly           | [ ] not yet verified |
| Menu shows Easy/Medium/Hard buttons with correct states        | [ ] not yet verified |
| Easy puzzle starts and plays to completion                     | [ ] not yet verified |
| Medium puzzle shows Foldwink Tabs, reveal works, Wink works    | [ ] not yet verified |
| Hard puzzle shows slow Tabs, no Wink affordance                | [ ] not yet verified |
| Timer ticks during play                                        | [ ] not yet verified |
| Sound plays after first interaction                            | [ ] not yet verified |
| Mute toggle works and persists                                 | [ ] not yet verified |
| Result screen shows grade, share section, streak if applicable | [ ] not yet verified |
| Share button produces result (copy/download/native share)      | [ ] not yet verified |
| Stats screen shows meaningful data after 2+ games              | [ ] not yet verified |
| Daily archive shows records                                    | [ ] not yet verified |
| Reload mid-game restores session                               | [ ] not yet verified |
| No console errors                                              | [ ] not yet verified |
| No layout overflow or clipped text                             | [ ] not yet verified |
| Arrow-key grid navigation works                                | [ ] not yet verified |
| Keyboard-only flow (Tab/Enter/Arrows) is usable                | [ ] not yet verified |

**Mobile Safari (iPhone):**

| Check                                             | Status                                    |
| ------------------------------------------------- | ----------------------------------------- |
| App loads in portrait                             | [ ] not yet verified                      |
| Cards are large enough to tap without error       | [ ] not yet verified                      |
| Sound plays after first tap (AudioContext resume) | [x] **confirmed working** (prior session) |
| Tabs are readable on small screen                 | [ ] not yet verified                      |
| Share flow works (navigator.share or clipboard)   | [ ] not yet verified                      |
| No horizontal scroll                              | [ ] not yet verified                      |
| Timer visible in header                           | [ ] not yet verified                      |

**Mobile Android (Chrome):**

| Check                               | Status               |
| ----------------------------------- | -------------------- |
| App loads                           | [ ] not yet verified |
| Touch interaction works             | [ ] not yet verified |
| Sound plays after first interaction | [ ] not yet verified |
| Layout is not clipped               | [ ] not yet verified |

**Itch.io context simulation:**

| Check                                                        | Status               |
| ------------------------------------------------------------ | -------------------- |
| Game loads from zipped dist/ served locally                  | [ ] not yet verified |
| Game works in an iframe (simulate with `<iframe src="...">`) | [ ] not yet verified |
| Click-to-launch fullscreen works                             | [ ] not yet verified |
| localStorage persists between sessions on same origin        | [ ] not yet verified |

**What can be approximated by automation only:** TypeScript types, linting, unit tests, validator structural checks (all currently green). **What CANNOT be approximated:** visual layout, sound quality, touch precision, iframe behavior, onboarding clarity for naive users.

### Y3 — Store Page Asset Readiness (Strict)

| Asset                         | Status      | Notes                                                                                               |
| ----------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| **Cover image (630×500)**     | **missing** | Needs a raster image. og.svg exists but is 1200×630 and wrong dimensions. Must be created manually. |
| **Thumbnail / icon**          | **missing** | favicon.svg exists but itch.io needs a raster icon (PNG).                                           |
| **Screenshots (3–5)**         | **missing** | Zero screenshots exist. Hard blocker for any public page.                                           |
| **Short hook / tagline**      | **ready**   | "A short daily grouping puzzle by Neural Void"                                                      |
| **Short description**         | **partial** | README has material but needs itch.io-specific rewrite.                                             |
| **Long description**          | **missing** | Needs dedicated store copy: what is it, how to play, what's included.                               |
| **How-to-play section**       | **partial** | Onboarding covers this in-app; store page needs a text version.                                     |
| **Difficulty explanation**    | **partial** | PROGRESSION_RULES.md has the content; needs store-friendly rewrite.                                 |
| **"What's included" section** | **missing** | Should list: 200 puzzles, 3 difficulties, daily mode, Foldwink Tabs + Wink, progression system.     |
| **Version / update note**     | **ready**   | "0.6.0 — 200 curated puzzles (105 easy + 75 medium + 20 hard)"                                      |
| **Contact / support**         | **ready**   | foldwink@neural-void.com                                                                            |
| **Privacy note**              | **ready**   | "No accounts, no tracking, no network. Stats live in your browser."                                 |
| **Branding consistency**      | **partial** | System-sans wordmark is honest but not memorable. Neural Void presence is consistent.               |
| **Overpromise risk**          | **low**     | Hard surface is honest ("Master Challenge"). Content count is exact. No fake claims.                |

**Minimum asset set by release type:**

| Release type             | Required                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| **Unlisted friend test** | Zip upload + 1 sentence description. Screenshots nice-to-have.                                     |
| **Public free page**     | Cover image + 3 screenshots + short description + how-to-play.                                     |
| **Paid page**            | All of the above + long description + "What's included" + designed cover + at least 5 screenshots. |

### Y4 — Commercial Readiness (Strict)

**1. Content-value fit:**

- 200 puzzles = ~3 months of daily play at 1/day + 1 standard/day. For a free game this is strong. For a $2 game it's borderline-acceptable. For $5+ it's thin.
- Medium (75 puzzles) is the core — adequate depth for initial paid experiment.
- Hard (20 puzzles) is enough to demonstrate the upper tier, not enough to sustain a skilled player.

**2. Polish-value fit:**

- Sound works but was never ear-tested for quality → paying customers may notice synthetic feel.
- Share card exists but was never visually verified → could look broken, damaging shareability.
- No designed wordmark → the page looks indie-honest but not professionally branded.
- No screenshots → the page cannot sell the game visually.

**3. Complaint risk (most likely bad-rating reasons):**

| Risk                               | Severity                | Avoidable?                                                        |
| ---------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| "Looks unfinished / prototype-ish" | high                    | yes — screenshots + cover + wordmark                              |
| "Sound is tinny / synthetic"       | medium                  | yes — ear test + possible retune                                  |
| "Too similar to NYT Connections"   | medium                  | partially — Tabs + Wink differentiate, but some will still say it |
| "Not enough hard puzzles"          | low                     | honest labeling mitigates                                         |
| "Why am I paying for this?"        | high if priced too high | price at $0 PWYW or max $2                                        |

**4. Best initial commercial mode:**

**Recommendation: Unlisted free friend test first → then public free → then PWYW ($0 min).**

Do NOT charge money until:

- Browser QA complete (desktop + mobile)
- 3+ screenshots captured
- Cover image created
- Sound pass completed (ear test)
- Share card visually verified
- Store copy written

**5. Minimum quality bar before charging:**

| Gate                          | Required for charging         |
| ----------------------------- | ----------------------------- |
| Browser QA (desktop + mobile) | **yes**                       |
| Screenshots (≥ 3)             | **yes**                       |
| Cover image                   | **yes**                       |
| Sound quality ear pass        | **yes**                       |
| Share card visual pass        | **yes**                       |
| Store description written     | **yes**                       |
| Library ≥ 200                 | **yes (already met)**         |
| Hard ≥ 10                     | **yes (already met — 20)**    |
| Progression tested by human   | **recommended**               |
| Designed wordmark             | **recommended, not required** |

**Monetization verdict: Not Ready to charge.** Ready for **free distribution** and **PWYW ($0 minimum)** as a test.

### Y5 — Itch.io Release Risk Register

| #   | Risk                                                  | Severity | Affects                 | Mitigation                                                |
| --- | ----------------------------------------------------- | -------- | ----------------------- | --------------------------------------------------------- |
| 1   | **No screenshots on store page**                      | high     | public + paid           | Capture 3–5 screenshots before any public listing         |
| 2   | **No cover image**                                    | high     | public + paid           | Create 630×500 raster from existing brand assets          |
| 3   | **iframe viewport clipping**                          | medium   | all                     | Use click-to-launch mode; test in draft before publishing |
| 4   | **Sound feels synthetic**                             | medium   | paid                    | Ear-test all 9 cues; retune or disable before paid        |
| 5   | **Share card visual quality unknown**                 | medium   | public + paid           | Render 3 test cards; verify typography/spacing            |
| 6   | **Mobile layout untested**                            | medium   | all                     | Test on real phone before any listing                     |
| 7   | **Content authored by AI, not human-played**          | medium   | paid                    | Play 10+ puzzles across all difficulties before paid      |
| 8   | **"Just another Connections clone" perception**       | medium   | public + paid           | Emphasize Tabs + Wink differentiator in store copy        |
| 9   | **No designed wordmark**                              | low      | paid                    | Acceptable for free/PWYW; needed for serious paid         |
| 10  | **OG image is SVG**                                   | low      | public (social sharing) | Convert to PNG; not critical for itch.io itself           |
| 11  | **localStorage wiped by itch.io updates**             | low      | all                     | Unlikely; itch.io preserves localStorage across updates   |
| 12  | **Daily puzzle already solved by GitHub Pages users** | low      | friend test             | Different origin = different localStorage; daily is fresh |

### Y6 — Release Sequencing Recommendation

**Stage 1: Draft Internal Package**

- Entry criteria: `npm run build` clean, dist/ zipped.
- Verify: zip loads locally in a browser.
- Assets needed: none (draft, not visible to public).
- **Status: Ready now.**

**Stage 2: Unlisted Friend Test**

- Entry criteria: Draft uploaded to itch.io, "Restricted" visibility.
- Verify: game loads on itch.io, sound works after click, layout OK on phone.
- Assets needed: minimal page text, game zip.
- Learn: first impressions, onboarding clarity, mobile usability, progression feel.
- **Status: Conditional Ready** — need one test upload to verify itch.io hosting works.

**Stage 3: Public Free Launch**

- Entry criteria: friend test feedback addressed, screenshots captured, cover image created, store copy written.
- Verify: desktop + mobile browser QA, share card visual pass, sound ear pass.
- Assets needed: 3+ screenshots, cover image (630×500), short + long description, how-to-play text.
- Learn: organic interest, daily retention, share conversion, difficulty balance feedback.
- **Status: Not Ready** — missing screenshots, cover, store copy, full browser QA.

**Stage 4: Pay-What-You-Want ($0 minimum)**

- Entry criteria: all Stage 3 assets + positive friend feedback + no critical QA issues.
- Verify: all Stage 3 verification + payment settings configured on itch.io.
- Assets needed: same as Stage 3.
- Learn: whether anyone voluntarily pays, what price they choose, what feedback they leave.
- **Status: Not Ready** — blocked on Stage 3.

**Stage 5: Paid Experiment ($1.50–$2.00 minimum)**

- Entry criteria: Stage 4 feedback positive, 300+ puzzles, sound verified, designed branding, store page polished.
- Verify: full QA, complaint-risk review, competitive positioning.
- Assets needed: 5+ screenshots, designed cover, polished description, "What's included" section.
- Learn: conversion rate, rating quality, refund rate, price sensitivity.
- **Status: Not Ready** — blocked on content depth (300+), branding, full QA.

### Y7 — Final Itch.io Decision Block

## Itch.io Pre-Release Gate — Decision Block

| Question                                                                     | Verdict             | Why                                                                               | Next step                                                                                              |
| ---------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Can Foldwink be uploaded as an HTML5 draft build right now?**              | **Yes**             | Build is self-contained, all paths relative, 353 kB.                              | Zip `dist/` contents and upload to itch.io as draft.                                                   |
| **Can Foldwink be shared with friends via itch.io unlisted link right now?** | **Conditional Yes** | Game works and is deployed. Need to verify it loads in itch.io player.            | Upload draft, set Restricted visibility, test loading + sound + layout, then share link.               |
| **Can Foldwink be made public for free right now?**                          | **No**              | Missing: screenshots, cover image, store copy. No browser QA completed.           | Capture screenshots, create cover, write store copy, run browser QA on desktop + mobile.               |
| **Can Foldwink be listed as pay-what-you-want right now?**                   | **No**              | All public blockers + no sound/visual verification + no payment setup.            | Complete all public-free requirements + ear-test sound + verify share card + configure itch.io seller. |
| **Can Foldwink be sold at a fixed minimum price right now?**                 | **No**              | All PWYW blockers + content still at 200 (300+ preferred) + no designed branding. | Reach 300 puzzles, verify polish, design wordmark, configure payment.                                  |

**Safest release configuration right now:**
**Draft HTML5 upload on itch.io, Restricted visibility, shared only via direct unlisted link to 3–5 friends for feedback.**

**Safest monetization configuration right now:**
**No monetization.** Free distribution only. PWYW ($0 min) after screenshots + QA + positive friend feedback.

**One recommended immediate action before any itch.io publish:**
**Zip the `dist/` folder, upload as a draft HTML5 project on itch.io with click-to-launch mode, and verify the game loads correctly, sound plays after first click, and the layout is not clipped — all in one 10-minute session.**
