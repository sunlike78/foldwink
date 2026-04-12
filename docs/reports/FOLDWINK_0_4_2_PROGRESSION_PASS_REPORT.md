# Foldwink 0.4.2 — Progression + Doc Correction Pass Report

Date: 2026-04-12
Scope: finish the Easy → Medium progression model introduced in 0.4.1 and
correct every live doc so the **current 98** vs **target 500** distinction
is explicit and impossible to misread.

## 1. What was changed

### Phase 1 — Doc / spec correction

- **`README.md`** — version line updated to 0.4.2 with "by Neural Void" attribution. Content bullet now reads "**Current library: 98 curated puzzles** (65 easy + 33 medium) … **Target library: 500 curated puzzles** via the disciplined batch pipeline. 500 does not exist yet and will not be claimed anywhere in live docs until it does." New Progression bullet explains the soft-gate. Support line added.
- **`docs/KNOWN_LIMITATIONS.md`** — Content section rewritten:
  - "Current library: 98 curated puzzles" + "Target library: 500 curated puzzles" + "Near-term content goal: validate the disciplined pipeline and grow the library in reviewed batches toward 150 → 200 → 500."
  - Removed stale "150+ is the target" line that predated the 500 goal.
  - New Progression section documenting the 0.4.2 mode split and the soft-gate.
- **`docs/RELEASE_NOTES.md`** — new 0.4.2 section at the top. Leads with "Critical doc correction" covering every live-tier doc touched.
- **`src/screens/MenuScreen.tsx`** footer line now reads `N curated puzzles in this build · target library 500`.
- **`docs/PROGRESSION_RULES.md`** — new doc, 200+ lines, single source of truth for the progression system.
- **`docs/TODO.md`** — Current phase rewritten for 0.4.2, Shipping facts 0.4.2 section added above the 0.4.1 one.

**Grep verification:** no "99 puzzles" / "99 curated" wording anywhere in live
docs. All live docs consistently say 98. Archive-tier docs under `docs/`
(PROJECT_SPEC.md, BUILD_PLAN.md, ARCH_PLAN.md, MVP_DECISIONS.md, etc.) remain
historical and untouched — per the "Archive docs may remain historical"
allowance.

### Phase 2 — Progression model

**Mode split.** Standard mode is now two distinct tracks on the menu:

- **Easy puzzle** — walks `EASY_POOL` via `progress.easyCursor`.
- **Medium puzzle** — walks `MEDIUM_POOL` via `progress.mediumCursor`.

Legacy `progress.cursor` is preserved as an upgrade fallback for the easy
cursor. Daily mode is unchanged.

**Unlock logic.** Simple and explainable:

```
MEDIUM_UNLOCK_AT = 5 easy wins
```

Medium button is always visible. Disabled with the label `Medium — locked`
until the threshold. Never regresses.

**Early nudge.** At 3 easy wins the menu shows:

> `Almost there · You're getting the hang of it. N more easy wins unlocks Medium — with Foldwink Tabs and one Wink per puzzle.`

**Recommendation.** Once unlocked, the readiness signal computes:

| Level           | Condition                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `unlocked-weak` | unlocked but shaky stats                                                                                          |
| `recommended`   | unlocked + easy win rate ≥ 70% + avg mistakes ≤ 2 + ≥ 2 recent confident easy wins (≤ 1 mistake, time irrelevant) |
| `strong`        | recommended + (≥ 2 recent fast-confident easy wins ≤ 2.5 min ≤ 1 mistake OR median easy solve ≤ 3 min)            |

**Time is never a hard gate.** It only contributes to the `strong` bump via
`computeEasyMedianTimeMs` and `countFastConfidentRecent`. A slow accurate
player still gets `recommended`.

**Gentle failback.** Two consecutive medium losses (`mediumLossStreak >= 2`)
trigger a muted line:

> `Two tough mediums in a row — try a few more Easy puzzles first.`

Advisory only — medium is never re-locked and the streak resets on the next
medium win.

### Phase 3 — UX copy pass

All six states shipped with final copy (see § Copy manifest in
`docs/PROGRESSION_RULES.md`). Copy is concise, calm, non-patronising,
consistent with Foldwink's minimalist identity. The Medium button label
uses `Medium — locked` / `Medium puzzle` only — no long explanatory text
inside the button itself.

### Phase 4 — Doc update

- **New:** `docs/PROGRESSION_RULES.md` — the contract. Defines philosophy,
  all thresholds as a single table pointing at `src/game/engine/readiness.ts`,
  a state diagram, per-state behaviour, what the system does not do, and a
  "how to change a threshold" runbook.
- **Updated:** `README.md`, `docs/KNOWN_LIMITATIONS.md`, `docs/RELEASE_NOTES.md`,
  `docs/TODO.md`.

### Phase 5 — Testing

New tests: 15 readiness-path tests + 4 stats-bookkeeping tests + 4 store
mode-split tests. Updated existing tests to the new `GameResultContext`
shape (now includes `durationMs`) and the new `StoreDeps` shape (easy/medium
pool + indexers).

Gate sweep:

```
npm run typecheck      → PASS (0 errors)
npm test               → PASS (99 / 99 across 11 suites)
npm run lint           → PASS (0 warnings)
npm run format:check   → PASS (all files clean)
npm run validate       → PASS (98 puzzles — 65 easy + 33 medium)
                         diversity 0.992, 3 label collisions, 0 niche flags
                         metadata coverage 0/98 (baseline)
                         wordplay mediums 0/33 flagged (baseline)
npm run build          → PASS (247.26 kB JS / 80.77 kB gzip)
```

## 2. Final progression model (verified)

```
             ┌────────────┐
             │  locked    │  easyWins < 5
             │  (nudge    │  nudge at easyWins ≥ 3
             │   at 3)    │
             └─────┬──────┘
                   │ 5 easy wins
                   ▼
             ┌────────────┐
             │ unlocked-  │  5+ easy wins, shaky stats
             │   weak     │
             └─────┬──────┘
                   │ win rate ≥ 70% AND
                   │ avg mistakes ≤ 2 AND
                   │ ≥ 2 recent confident easy wins
                   ▼
             ┌────────────┐
             │ recommended│
             └─────┬──────┘
                   │ ≥ 2 fast-confident recent wins OR
                   │ median easy solve ≤ 3 min
                   ▼
             ┌────────────┐
             │   strong   │
             └────────────┘

+ orthogonal `fallback` after 2 consecutive medium losses (advisory only)
```

Every threshold lives as a named constant in `src/game/engine/readiness.ts`:

| Constant                      | Value   | Role                        |
| ----------------------------- | ------- | --------------------------- |
| `EASY_NUDGE_AT`               | 3       | Early nudge                 |
| `MEDIUM_UNLOCK_AT`            | 5       | Unlock threshold            |
| `RECOMMEND_WIN_RATE_MIN`      | 0.70    | Recommendation win rate     |
| `RECOMMEND_AVG_MISTAKES_MAX`  | 2       | Recommendation mistakes cap |
| `STRONG_RECENT_CONFIDENT_MIN` | 2       | Strong bump count           |
| `STRONG_MEDIAN_TIME_MS`       | 180_000 | Strong bump median time     |
| `FAST_CONFIDENT_TIME_MS`      | 150_000 | Fast-confident threshold    |
| `FAST_CONFIDENT_MISTAKES_MAX` | 1       | Confident-solve mistakes    |
| `FALLBACK_LOSS_STREAK`        | 2       | Fallback trigger            |

## 3. Changed files (0.4.1 → 0.4.2)

### New

- `src/game/engine/readiness.ts` (rewritten)
- `src/game/engine/__tests__/readiness.test.ts` (rewritten with full coverage)
- `docs/PROGRESSION_RULES.md`
- `docs/reports/FOLDWINK_0_4_2_PROGRESSION_PASS_REPORT.md` (this file)

### Modified

- `package.json` — 0.4.1 → 0.4.2
- `README.md` — version + library clarity + progression bullet + support line
- `docs/KNOWN_LIMITATIONS.md` — Content + Progression sections
- `docs/RELEASE_NOTES.md` — 0.4.2 section
- `docs/TODO.md` — Current phase + Shipping facts 0.4.2
- `src/game/types/stats.ts` — `RecentSolve`, `RECENT_SOLVES_LIMIT`, `recentSolves`, `mediumLossStreak`, `StandardProgress.easyCursor/mediumCursor`
- `src/stats/stats.ts` — `GameResultContext.durationMs`, `recentSolves` FIFO, `mediumLossStreak` update rule
- `src/stats/__tests__/stats.test.ts` — migrated to new context + 4 new tests
- `src/puzzles/loader.ts` — `EASY_POOL`, `MEDIUM_POOL`, `getEasyByIndex`, `getMediumByIndex`
- `src/game/state/store.ts` — `startEasy` / `startMedium` actions, cursor split, `startNextSame` preserves difficulty, `StoreDeps` extensions
- `src/game/state/__tests__/store.test.ts` — `makeDeps` extended with easy/medium pools, 4 new mode-split tests
- `src/screens/MenuScreen.tsx` — Easy + Medium buttons, locked label, readiness-based variants, fallback line, updated footer line (current 98 vs target 500)

### Unchanged (by design)

- Archive-tier docs under `docs/` (PROJECT_SPEC, BUILD_PLAN, ARCH_PLAN, MVP_DECISIONS, CONTENT_GUIDELINES, MVP_TASK_GRAPH, QA_CHECKLIST, QA_REPORT, RELEASE_CHECKLIST, STYLE_SYSTEM, POST_MVP_ROADMAP).
- `docs/SOUND_DESIGN.md` — no sound changes in 0.4.2.
- `src/audio/*`, `src/share/*` — untouched.
- `public/og.svg`, `public/manifest.webmanifest`, `index.html` — already consistent from 0.4.1.

## 4. Command results

| Command                | Result                                                       |
| ---------------------- | ------------------------------------------------------------ |
| `npm run typecheck`    | **PASS** — 0 errors                                          |
| `npm test`             | **PASS** — 99 / 99 across 11 suites (+17 since 0.4.1)        |
| `npm run lint`         | **PASS** — 0 warnings                                        |
| `npm run format:check` | **PASS**                                                     |
| `npm run validate`     | **PASS** — 98 puzzles (65 easy + 33 medium), diversity 0.992 |
| `npm run build`        | **PASS** — 247.26 kB JS / 80.77 kB gzip                      |

## 5. Library clarity verification

**Current library = 98 curated puzzles (65 easy + 33 medium).**
**Target library = 500 curated puzzles.**

This distinction is now explicit in:

- `README.md` (lines 9 + 10)
- `docs/KNOWN_LIMITATIONS.md` (Content section)
- `docs/PROGRESSION_RULES.md` (Library context section)
- `docs/RELEASE_NOTES.md` (0.4.2 Critical doc correction section)
- `docs/TODO.md` (Current phase + Shipping facts 0.4.2)
- `src/screens/MenuScreen.tsx` (menu footer line at runtime)
- `docs/content/BATCH_WORKFLOW.md` (already correct from 0.4.0)
- `docs/content/EASY_VS_MEDIUM_PROFILE.md` (already correct from 0.4.0)

**500 is not claimed anywhere as current.**
**No "99 puzzles" wording exists in live docs.**

## 6. Remaining ambiguity or deferred decisions

- **No new puzzles authored.** The progression mode split and the readiness signal operate on the same 98-puzzle library as 0.4.1. The content path to 500 remains a human-driven editorial task using the existing batch workflow doc.
- **Progression thresholds are placeholders.** `MEDIUM_UNLOCK_AT = 5` was chosen from the spec, not from telemetry. Real player data from a closed beta may argue for 4 or 7. The threshold is a single-line change; the doc says so explicitly.
- **`recentSolves` log size is 10.** Smaller than ideal for a median over a long session, larger than needed for a short one. 10 is a compromise.
- **Browser QA for the split.** Never verified in a real browser that the Medium button correctly transitions from disabled → enabled after the 5th easy win without needing a reload. Logic is correct; behaviour not confirmed.
- **`startStandard` is still exported** as a backwards-compat alias. Any external caller (there are none in this repo) will silently route to `startEasy`. If the MenuScreen ever re-adopts a mixed walk, it needs a new action, not a rewiring of `startStandard`.
- **No Mixed mode.** Removed the mixed-pool walk entirely. If a player in a closed beta complains that "Standard felt more like a random daily", that feedback is valid and we'll add a third button. Not urgent.

## 7. Release-readiness verdict

**Still Conditional Go for closed beta.** 0.4.2 closes the progression model
gap flagged in the 0.4.0 analysis and fixes the library-clarity wording
concern. It does **not** close the two hard blockers that still dominate:

- **H11 first in-browser QA pass** — still open, now with more UI surface
  to verify (Easy button, Medium button disabled state, Medium button
  enabled transition, fallback line).
- **Sound ear pass** — still open on the 0.4.1 retune.

Everything else the previous reports flagged as blocking remains deferred
as human-only (raster OG, designed wordmark, branded domain deployment,
first disciplined content batch).

## 8. HANDOFF / RESUME

### Finished in this pass

- Live doc correction: current 98 / target 500 clarity everywhere.
- Progression model: mode split, simple unlock at 5, smarter recommendation, strong bump, gentle fallback.
- UX copy for all six progression states.
- `docs/PROGRESSION_RULES.md` as single source of truth.
- 17 new tests + full migration of existing tests to new shapes.
- Version bump 0.4.1 → 0.4.2.
- All gates green: typecheck, 99/99 tests, lint, format, validate, build.

### Unfinished (deliberately — human-only)

- H11 browser QA pass on the new Easy/Medium split.
- Sound ear verification (0.4.1 retune).
- Share card visual verification.
- Raster OG PNG.
- Designed wordmark / logotype.
- Deployed branded domain.
- First disciplined content batch toward 150.

### Exact next recommended step

Run the manual QA pass from `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md`
against the 0.4.2 preview build on one phone-sized and one desktop-sized
viewport. Pay specific attention to:

- Medium button disabled state on a fresh record.
- Medium button transition to enabled after the 5th easy win (does it update
  without a reload? — this is the one place the new logic could visibly fail).
- The early nudge text appearing at 3 easy wins.
- The fallback line appearing after 2 consecutive medium losses.

### Commands to rerun

```
npm run typecheck
npm test
npm run lint
npm run validate
npm run build
```

### Repo state

Stable. 0.4.2 committed-ready (no git operations performed). All gates green.
Ready for the next supervised pass.

---

**HIBERNATE**

Further speculative changes stopped. Repo left in a stable 0.4.2 state. Next
supervised pass should start from the human tasks in section 8.
