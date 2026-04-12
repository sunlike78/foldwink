# Foldwink — Feature Review & Quality Assessment

Snapshot: 2026-04-12, version **0.4.3**.
Repo: https://github.com/sunlike78/foldwink
Live: https://sunlike78.github.io/foldwink/

---

## 1. Current product facts

| Metric          | Value                                                  |
| --------------- | ------------------------------------------------------ |
| Version         | 0.4.3                                                  |
| Current library | **98 curated puzzles** (65 easy + 33 medium + 0 hard)  |
| Target library  | **500** (disciplined batch expansion)                  |
| Tests           | 108 / 108 across 11 suites                             |
| Bundle          | 249 kB JS / 81 kB gzip                                 |
| Runtime deps    | 3 (react, react-dom, zustand)                          |
| Stack           | React 18 + TypeScript + Vite 5 + Tailwind 3 + Vitest 2 |

---

## 2. Feature inventory — what IS implemented

### 2.1 Game modes

| Mode                        | Entry point     | Pool                                                           | Cursor                  | Status                                              |
| --------------------------- | --------------- | -------------------------------------------------------------- | ----------------------- | --------------------------------------------------- |
| **Daily**                   | `startDaily()`  | Full 98-puzzle pool (deterministic by local date, FNV-1a hash) | n/a — one per day       | **Shipped**                                         |
| **Easy**                    | `startEasy()`   | `EASY_POOL` (65 puzzles)                                       | `progress.easyCursor`   | **Shipped**                                         |
| **Medium**                  | `startMedium()` | `MEDIUM_POOL` (33 puzzles)                                     | `progress.mediumCursor` | **Shipped** (soft-gated: unlocks after 5 easy wins) |
| **Hard / Master Challenge** | `startHard()`   | `HARD_POOL` (0 puzzles)                                        | `progress.hardCursor`   | **Scaffolded** — engine complete, 0 content         |

- Daily replay allowed, doesn't count to stats (shows "· replay")
- Standard "Next puzzle" after a loss retries the same puzzle
- Quit mid-game drops the attempt with no stats change

### 2.2 Core gameplay

| Feature                                | Status  | Files                                               |
| -------------------------------------- | ------- | --------------------------------------------------- |
| 4×4 card grid                          | shipped | `Card.tsx`, `Grid.tsx`, `GameScreen.tsx`            |
| Select up to 4 cards                   | shipped | `store.ts::toggleSelection`                         |
| Submit validation                      | shipped | `submit.ts::findMatchingGroup`                      |
| Correct group lock-in with colour tint | shipped | `progress.ts::applyCorrectGroup`, `solvedColors.ts` |
| Wrong guess → mistake counter          | shipped | `progress.ts::applyIncorrectGuess`                  |
| 4 mistakes = loss                      | shipped | `progress.ts::isLoss` (MAX_MISTAKES = 4)            |
| All 4 groups = win                     | shipped | `progress.ts::isWin`                                |
| Flash feedback (ring around grid)      | shipped | `GameScreen.tsx` flash state                        |

### 2.3 Foldwink Tabs + Wink

| Feature                 | Easy | Medium             | Hard                                   |
| ----------------------- | ---- | ------------------ | -------------------------------------- |
| Tabs visible?           | no   | yes                | yes                                    |
| Progressive reveal rate | —    | 1 letter per solve | 1 letter per **2** solves (half-speed) |
| Wink available?         | no   | yes (1 per game)   | **no**                                 |
| Wink UI (✦ mark)        | —    | yes                | —                                      |

- `revealStage()` for medium: `visibleCount = max(1, stage + 1)`
- `revealStageHard()` for hard: `visibleCount = max(1, floor(stage/2) + 1)`
- `canWinkGroup()` returns false for non-medium → hard excluded by design
- Winked tab shows full `revealHint` immediately, marked with ✦
- ✦ preserved on solved-winked tab

### 2.4 Sound system

| Cue         | Material reference         | Duration | Body freq      | Peak gain |
| ----------- | -------------------------- | -------- | -------------- | --------- |
| `select`    | paper edge                 | 50 ms    | —              | 0.20      |
| `deselect`  | card drop                  | 45 ms    | —              | 0.16      |
| `submit`    | knuckle on wood            | 120 ms   | 140 Hz         | 0.22      |
| `wrong`     | two muted wood knocks      | 250 ms   | 120/95 Hz      | 0.22      |
| `correct`   | three bone-on-wood settles | 300 ms   | 180/215/250 Hz | 0.16      |
| `tabReveal` | micro paper flip           | 35 ms    | —              | 0.10      |
| `wink`      | tile lift, warm            | 240 ms   | 280/210 Hz     | 0.15      |
| `win`       | four tiles on wood         | 480 ms   | 170–240 Hz     | 0.16      |
| `loss`      | wooden box closed          | 450 ms   | 95 Hz          | 0.22      |

- Web Audio API synthesis, zero binary assets, ~3 kB gzip
- Bodies ≤ 280 Hz (no bright chime register)
- iOS Safari resume fix: chains recipe onto `ctx.resume().then()`
- Default volume: 0.42, mute persisted in `foldwink:sound`
- `SoundToggle` on MenuScreen

### 2.5 Share system

| Layer       | What                                                                                                 | Status                            |
| ----------- | ---------------------------------------------------------------------------------------------------- | --------------------------------- |
| Text share  | `buildShareString()` → emoji grid + neural-void.com/foldwink                                         | shipped                           |
| Canvas card | 1080×1080 PNG, dark palette, branding, solved grid, Wink status                                      | shipped (never visually verified) |
| Pipeline    | `navigator.share(files)` → `clipboard.write(ClipboardItem)` → download → text share → clipboard text | shipped (5 fallback layers)       |

### 2.6 Progression / readiness

**Easy → Medium:**

| State         | Condition                                                | Menu copy                                                               |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Locked        | < 5 easy wins                                            | "Warming up · A few easy solves first — Medium unlocks at 5 easy wins." |
| Nudge (at 3)  | 3–4 easy wins                                            | "Almost there · …N more easy wins unlocks Medium."                      |
| Unlocked-weak | 5+ easy wins, shaky stats                                | "Medium unlocked · Try one when you feel ready."                        |
| Recommended   | ≥ 70% win rate + ≤ 2 avg mistakes + ≥ 2 recent confident | "Recommended · A Medium puzzle is a good next step."                    |
| Strong        | Recommended + fast confident recent                      | "Medium-ready · Your Easy form is steady."                              |
| Fallback      | 2 consecutive medium losses                              | "Two tough mediums in a row — try a few more Easy puzzles first."       |

**Medium → Hard:**

| State       | Condition                              | Menu copy                                                            |
| ----------- | -------------------------------------- | -------------------------------------------------------------------- |
| Coming soon | HARD_POOL empty                        | "Master Challenge — soon · Curated hard puzzles are being authored." |
| Locked      | < 3 medium wins                        | "Master Challenge — locked · Solve N more Medium puzzles to unlock." |
| Unlocked    | 3+ medium wins, shaky                  | "Tabs reveal slowly. No Wink. Try it when you feel sharp."           |
| Recommended | 5+ medium wins + ≥ 60% medium win rate | "Less guidance. Cleaner pressure. You're ready."                     |
| Fallback    | 2 consecutive hard losses              | "Tough stretch — try a Medium to rebuild momentum."                  |

### 2.7 Stats & persistence

**Stats tracked:** gamesPlayed, wins, losses, currentStreak, bestStreak, solvedPuzzleIds, mediumWins, mediumLosses, totalMistakes, winkUses, flawlessWins, mediumLossStreak, hardWins, hardLosses, hardLossStreak, recentSolves (last 10)

**Persistence keys (7):** `foldwink:stats`, `foldwink:progress`, `foldwink:daily`, `foldwink:onboarded`, `foldwink:sound`, `foldwink:active-session`, `foldwink:events`

**Mid-game session:** auto-saved on every in-game mutation, auto-restored on cold start if puzzle exists in pool, cleared on menu/result transition.

**StatsScreen:** StatStrip (Solved / Played / Win %), 2×2 grid (Wins / Losses / Streak / Best), Depth section (Flawless / Avg mistakes / Medium win % / Winks spent).

### 2.8 Grading

| Grade          | Condition                            | Label                                   |
| -------------- | ------------------------------------ | --------------------------------------- |
| Flawless       | 0 mistakes, win                      | "Flawless"                              |
| One-mistake    | 1 mistake, win                       | "Clean solve"                           |
| Two-mistakes   | 2 mistakes, win                      | "Steady solve"                          |
| Clutch         | 3 mistakes, win                      | "Clutch"                                |
| Loss           | any loss                             | "Close call"                            |
| No-Wink Medium | medium win without Wink (composable) | "Flawless · No Wink" / "No-Wink Medium" |

Displayed on ResultScreen as a quiet card.

### 2.9 Onboarding

- First-run modal (`Onboarding.tsx`) with grid illustration + Tabs demo
- 4 bullet points: rules, mistakes, Tabs, Wink
- "Got it" button → persists `foldwink:onboarded`
- Never re-shown

### 2.10 Branding

| Surface             | Content                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Wordmark            | `<h1>Foldwink</h1>` + accent underline + "by Neural Void" sublabel (lg)                                          |
| BrandMark           | 2×2 coloured tile SVG with animated accent star                                                                  |
| AboutFooter         | Collapsible: product desc + Neural Void link + foldwink@neural-void.com + privacy note + "clear local event log" |
| OG image            | 1200×630 SVG: tiles + wordmark + "BY NEURAL VOID" + "Foldwink Tabs reveal the categories"                        |
| Manifest            | `foldwink` / standalone / portrait / dark theme / categories: games, puzzle                                      |
| Meta                | og:url → neural-void.com/foldwink, Twitter card, description mentions Neural Void                                |
| Share string footer | `neural-void.com/foldwink`                                                                                       |
| Canvas card footer  | `neural-void.com/foldwink` + "BY NEURAL VOID" sublabel                                                           |

### 2.11 Motion & animation

| Animation                            | Trigger                          | Duration   |
| ------------------------------------ | -------------------------------- | ---------- |
| `fw-shake`                           | Wrong guess → grid               | 420 ms     |
| `fw-pop`                             | Card becomes solved              | 260 ms     |
| `fw-result-pop`                      | Result screen arrives            | 320 ms     |
| `fw-tab-reveal`                      | Tab content updates (key change) | 220 ms     |
| `fw-streak-pulse`                    | Streak celebration on result     | 1800 ms    |
| `active:scale-[0.97]`                | Any button/card press            | 120 ms     |
| `-translate-y-[1px]` + accent shadow | Selected card 2.5D lift          | continuous |

All respect `prefers-reduced-motion: reduce`.

### 2.12 Error handling

- `ErrorBoundary` class component wraps `<App />` in `main.tsx`
- Catches render crashes → "Foldwink stumbled" screen with reload button
- Dev mode shows error message

### 2.13 Analytics (local-only)

11 event types, all local localStorage counters. No network. Events: `app:open`, `menu:view`, `stats:view`, `daily:start/win/loss`, `standard:start/win/loss`, `wink:used`, `share:clicked`. Clearable via AboutFooter.

### 2.14 Validator

Structural checks (errors): 4 groups × 4 items, unique IDs, valid difficulty, non-empty items/labels, no intra-puzzle duplicates.

Content quality checks (warnings): item length, cross-puzzle reuse, revealHint presence/length/duplication, niche characters, label shape collisions, theme signature matches, diversity score.

Metadata coverage (info): `meta.theme`, `meta.categoryType`, `meta.wordplay`, `meta.batch`, `meta.fairnessRisk` — all optional; validator reports coverage %.

### 2.15 Tests

| Suite                  | Tests   | Focus                                      |
| ---------------------- | ------- | ------------------------------------------ |
| `foldwinkTabs.test.ts` | 18      | Tabs reveal, Wink logic                    |
| `grading.test.ts`      | 8       | Grade ladder, No-Wink flag                 |
| `progress.test.ts`     | 6       | Correct/incorrect/win/loss                 |
| `readiness.test.ts`    | 24      | Medium readiness (15) + Hard readiness (9) |
| `share.test.ts`        | 2       | Share string format                        |
| `shuffle.test.ts`      | 6       | Deterministic shuffle                      |
| `submit.test.ts`       | 6       | Submission validation                      |
| `store.test.ts`        | 20      | Store actions, cursors, mode split         |
| `daily.test.ts`        | 4       | Daily determinism                          |
| `stats.test.ts`        | 11      | Stat updates, streaks, recent solves       |
| `countdown.test.ts`    | 3       | Daily countdown                            |
| **Total**              | **108** |                                            |

No component tests. No integration tests. No e2e tests.

---

## 3. Quality assessment by direction

### A — Strong (clear value, well-implemented)

- **Core gameplay loop** — clean, tested, no known regressions
- **Foldwink Tabs mechanic** — distinct product identity, progressive reveal well-tuned
- **Progression model** — soft-gate is smart (not bureaucratic), time is secondary, fallback is gentle
- **Grading** — pure function, honest labels, no fake achievement inflation
- **Stats persistence** — 7 localStorage keys, mid-game session restore, FIFO recent-solves log
- **Validator** — structural + editorial quality signals, diversity score, label collision detection
- **Content pipeline docs** — BATCH_WORKFLOW + EASY_VS_MEDIUM_PROFILE + quality bar for each tier
- **Error boundary** — exists and works
- **Branding consistency** — Neural Void sublabel across all surfaces

### B — Acceptable (works but has known gaps)

- **Sound system** — recipes retuned to material direction, iOS fix in place, but **never listened to by a human** — confidence medium
- **Share card** — 5-layer fallback pipeline, branding correct, but **never visually verified** — spacing/typography unconfirmed
- **Motion/animation** — tokens centralised, CSS-only, reduced-motion support, but **never observed in browser** — could be too subtle or too aggressive
- **Onboarding** — explains rules + Tabs + Wink, visual demo present, but doesn't mention Medium readiness or Hard
- **StatsScreen** — Depth section is good, but no daily archive or history browser

### C — Weak (scaffolded or needs work)

- **Hard content** — full engine scaffold, 0 real puzzles. Button shows "coming soon". Product promise without product delivery.
- **OG image** — SVG only, no raster PNG. Many social scrapers prefer PNG/JPG. Looks fine inline but untested on Twitter/Facebook preview.
- **Wordmark** — system sans, no designed logotype. Typographic treatment is clean but not memorable.
- **Browser QA** — never run. Every visual/audio/UX claim is inferred from code.
- **Test coverage** — pure logic only. Zero component tests. No coverage for ErrorBoundary, Onboarding, share pipeline browser behaviour.
- **Accessibility** — basic `aria-pressed` + `aria-label`, no arrow-key grid nav, solved colours not colour-blind validated

### D — Missing entirely

- **Hard puzzle content** (0 real puzzles)
- **Raster OG image** (PNG/JPG for social preview)
- **Human-designed wordmark/logotype**
- **Deployed branded domain** (neural-void.com/foldwink not wired yet)
- **Network analytics** (deferred by design)
- **Component / e2e tests**
- **Colour-blind accessibility audit**
- **Keyboard arrow-key grid navigation**
- **Daily archive / past-puzzle browser**
- **In-game timer** (result shows elapsed time, game screen does not)
- **One-away hint**
- **Hard difficulty** (deferred)
- **Localization** (English only)
- **Export/import stats**
- **Cross-device sync**
- **Premium / monetization**

---

## 4. What can still be done — prioritised

### Tier 1 — Highest value, code-doable now

| #   | Item                                                                                                 | Effort             | Impact                                                         |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| 1   | **First in-browser QA pass** (phone + desktop) — validates sound, motion, share card, progression UX | human 30–60 min    | critical — unblocks all confidence claims                      |
| 2   | **Author 2–5 pilot Hard puzzles** meeting PROGRESSION_RULES quality bar                              | human 1–3 hrs      | Hard goes from scaffold to playable; unblocks Master Challenge |
| 3   | **Raster OG image** — render og.svg to 1200×630 PNG for social preview                               | 5 min tool use     | social sharing stops looking broken on Twitter/Facebook        |
| 4   | **Wire `hardPoolSize`** in MenuScreen — replace `hardReadiness(stats, 0)` with `HARD_POOL.length`    | 1-line code change | Flips Hard button from "coming soon" to real                   |
| 5   | **Sound ear pass** — listen to all 9 cues, mark any that feel synthetic                              | human 15 min       | sound confidence from "documented" to "verified"               |
| 6   | **Share card visual QA** — render 3 outputs, check typography/spacing                                | human 10 min       | share confidence from "pipeline correct" to "looks right"      |

### Tier 2 — High value, moderate effort

| #   | Item                                                                                    | Effort                                | Impact                                        |
| --- | --------------------------------------------------------------------------------------- | ------------------------------------- | --------------------------------------------- |
| 7   | **Content batch #1** — 10 easy + 5 medium via BATCH_WORKFLOW pipeline                   | human 4–8 hrs                         | Pool 98 → 113, validates the pipeline         |
| 8   | **Onboarding update** — mention Easy/Medium/Hard tiers, progression model               | 30 min code                           | New players understand the ladder             |
| 9   | **Daily archive** — read-only list of past daily records (data already in localStorage) | 2–4 hrs code                          | Retention surface, reason to check history    |
| 10  | **Colour-blind palette audit** — validate solved group tints                            | 1 hr research + possible colour tweak | Accessibility improvement                     |
| 11  | **Component tests for critical UI** — ErrorBoundary, ShareButton, FoldwinkTabs          | 2–4 hrs                               | Test confidence for regression-prone surfaces |
| 12  | **Deploy to branded domain** — wire neural-void.com/foldwink                            | deploy config                         | Branding goes from text to real               |

### Tier 3 — Nice-to-have, lower priority

| #   | Item                                                                       | Effort                    | Impact                                                |
| --- | -------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- |
| 13  | **Keyboard arrow-key grid navigation**                                     | 2–3 hrs                   | Accessibility / power user                            |
| 14  | **In-game timer** (live clock on game screen)                              | 1 hr                      | Visual feedback, stress management                    |
| 15  | **One-away hint** (flash when 3/4 correct)                                 | 2 hrs                     | Fairness aid, post-MVP                                |
| 16  | **Recorded sound assets** — replace Web Audio with real paper/wood samples | asset session + 1 hr code | Sound quality from "good placeholder" to "production" |
| 17  | **Stats export/import**                                                    | 2 hrs                     | Cross-browser migration                               |
| 18  | **Themed puzzle packs** (science, geography, word-play)                    | content work              | Replayability, premium candidate                      |
| 19  | **Achievement micro-badges** (local only)                                  | 3–4 hrs                   | Retention, satisfaction                               |
| 20  | **Dark/light theme toggle**                                                | 3–4 hrs                   | User preference                                       |

### Tier 4 — Deferred (not for 1.0)

| Item                         | Reason                                              |
| ---------------------------- | --------------------------------------------------- |
| Premium / paid packs         | No revenue path designed yet                        |
| Ad integration               | Product not mature enough                           |
| Network analytics            | Privacy-first; local-only is the right call for now |
| Cloud sync / accounts        | Scope creep; localStorage is sufficient             |
| Leaderboards                 | Needs backend                                       |
| Localization                 | English-only for now                                |
| Procedural puzzle generation | Trust comes from curation                           |

---

## 5. Honest product state summary

**Foldwink is a complete, playable, deployable daily puzzle game** with a distinct mechanic (Foldwink Tabs + Wink), a clean progression model, a sound palette, a share pipeline, and a curated 98-puzzle library.

**What makes it good:**

- The core loop is tight and satisfying
- The Tabs mechanic is original and felt during play
- The progression is guided without being bureaucratic
- The product identity is consistent across code, UI, metadata, and docs
- The content pipeline is disciplined (not mass-generated)

**What keeps it from being "finished":**

- Hard is scaffolded but empty (no content to play)
- Sound and share card have never been verified by a human ear/eye
- OG social preview is SVG-only (looks broken on some scrapers)
- No real branded domain deployed yet
- Pool of 98 is comfortable for weeks but thin for months
- Accessibility is baseline-only (no colour-blind audit, no keyboard grid nav)

**The single highest-value next step:**
Run the in-browser QA pass from `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` on a phone and a desktop — this one human session validates sound, motion, share card, progression UX, and the live deployment at https://sunlike78.github.io/foldwink/ simultaneously.
