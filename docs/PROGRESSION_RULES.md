# Foldwink Progression Rules

Written 2026-04-12. Scope: Easy → Medium progression introduced in 0.4.2.
This doc is the contract. If the code and this doc disagree, the doc is
wrong and should be corrected — not the other way around.

## Philosophy

Medium is a difficulty tier, not a reward. The progression system exists
to **guide** new players toward it at the right moment without hiding it
or making them jump through hoops.

Four rules:

1. **Medium is always visible.** No mystery content. The Medium button
   is present on the menu from the first visit.
2. **Unlock is simple.** 5 solved easy puzzles. No time gate, no rating,
   no minimum session count. If the doc ever mentions a more complex
   unlock, the doc has been corrupted.
3. **Recommendation is smarter than unlock.** Unlocking says "you may".
   Recommendation says "you should".
4. **Guidance is soft.** After two medium losses we suggest a few more
   easy puzzles. We never lock anything back.

## The thresholds

Single source of truth: `src/game/engine/readiness.ts` exports these as
named constants.

| Constant                      | Value     | What it means                                           |
| ----------------------------- | --------- | ------------------------------------------------------- |
| `EASY_NUDGE_AT`               | `3`       | Early nudge appears under the menu — "Medium is coming" |
| `MEDIUM_UNLOCK_AT`            | `5`       | Medium button becomes enabled                           |
| `RECOMMEND_WIN_RATE_MIN`      | `0.70`    | ≥ 70% easy win rate to be recommended                   |
| `RECOMMEND_AVG_MISTAKES_MAX`  | `2`       | ≤ 2 mistakes per game on average                        |
| `STRONG_RECENT_CONFIDENT_MIN` | `2`       | ≥ 2 recent confident solves for strong bump             |
| `STRONG_MEDIAN_TIME_MS`       | `180_000` | ≤ 3 min median easy solve for strong bump               |
| `FAST_CONFIDENT_TIME_MS`      | `150_000` | ≤ 2.5 min defines a "fast confident" solve              |
| `FAST_CONFIDENT_MISTAKES_MAX` | `1`       | ≤ 1 mistake defines a "confident" solve                 |
| `FALLBACK_LOSS_STREAK`        | `2`       | Two consecutive medium losses → gentle fallback         |

## The states

```
                 ┌────────────┐
                 │  locked    │  easyWins < 5
                 │  (nudge    │  (nudge at easyWins >= 3)
                 │   at 3)    │
                 └─────┬──────┘
                       │ 5 easy wins
                       ▼
                 ┌────────────┐
                 │ unlocked-  │  5+ easy wins, weak stats
                 │   weak     │
                 └─────┬──────┘
                       │ win rate ≥ 70% AND
                       │ avg mistakes ≤ 2 AND
                       │ ≥ 2 recent confident wins
                       ▼
                 ┌────────────┐
                 │ recommended│
                 └─────┬──────┘
                       │ ≥ 2 fast-confident recent wins
                       │ OR median easy time ≤ 3 min
                       ▼
                 ┌────────────┐
                 │   strong   │
                 └────────────┘
```

Plus the orthogonal `fallback`: after two consecutive medium losses the
signal returns a short suggestion (`"Two tough mediums in a row — try a
few more Easy puzzles first."`), **without changing the main level** and
**without locking medium**.

## Signal inputs

Derived from `Stats`:

- **`easyWins`** = `wins - mediumWins`
- **`easyLosses`** = `losses - mediumLosses`
- **`easyWinRate`** = `easyWins / (easyWins + easyLosses)`
- **`avgMistakes`** = `totalMistakes / gamesPlayed`
- **`recentSolves`** — rolling log, last 10 entries (0.4.2 addition)
- **`mediumLossStreak`** — consecutive medium losses (0.4.2 addition)

**Time is optional.** The `recentSolves` log only contributes to the
"strong" bump. If a player plays slowly but accurately, they still get
recommended. Time never blocks anything.

## The rules in plain English

### Locked (< 5 easy wins)

Medium button is visible but disabled with the label **"Medium — locked"**.
Under the menu: `Warming up · A few easy solves first — Medium unlocks at 5 easy wins.`

### Early nudge (3 or 4 easy wins, still locked)

Medium button still locked. Under the menu:
`Almost there · You're getting the hang of it. N more easy wins unlocks Medium — with Foldwink Tabs and one Wink per puzzle.`

### Unlocked but weak (5+ easy wins, shaky stats)

Medium button becomes **enabled** but rendered as the _secondary_ variant.
Under the menu: `Medium unlocked · Try one when you feel ready — or keep polishing Easy first.`

### Recommended

- ≥ 5 easy wins, AND
- ≥ 70% easy win rate, AND
- ≤ 2 average mistakes per game, AND
- ≥ 2 recent confident easy wins (≤ 1 mistake, time irrelevant)

Medium button becomes the **primary** variant on the menu. Under the menu:
`Recommended · A Medium puzzle is a good next step.`

### Strong

Everything from Recommended, plus:

- ≥ 2 recent fast-confident easy wins (≤ 2.5 min AND ≤ 1 mistake), **OR**
- median easy solve time ≤ 3 min across recent wins.

Medium button stays primary. Label text flips to the accent colour.
Under the menu: `Medium-ready · Your Easy form is steady. Foldwink Tabs will feel natural.`

### Fallback (medium loss streak ≥ 2)

A second muted line appears under the primary caption:
`Two tough mediums in a row — try a few more Easy puzzles first.`

The main level is unchanged. Medium remains accessible — the hint is
advisory. The streak resets on the next medium win.

## What this does not do

- **No time-based hard gate.** Ever.
- **No lockouts.** Once unlocked, medium stays unlocked.
- **No difficulty scaling.** The curated pool is fixed.
- **No adaptive pacing.** The readiness signal does not pick different
  medium puzzles based on the player's skill — medium mode walks the
  medium subset of the curated pool in order.
- **No server-side tracking.** Everything is derived from local stats.

## How to change a threshold

1. Update the constant in `src/game/engine/readiness.ts`.
2. Update the table in this doc (there is exactly one table).
3. Update or add a test in `src/game/engine/__tests__/readiness.test.ts`.
4. Think once more about whether this change makes Medium easier or
   harder to reach. If it makes it _harder_, you are probably doing the
   wrong thing — the product bias is always toward letting players try
   medium.

## Where this connects to the rest of the product

- **MenuScreen** renders the readiness signal under the two Standard buttons.
- **Easy puzzle** button calls `startEasy()` which iterates the easy
  subset of the curated pool using `progress.easyCursor`.
- **Medium puzzle** button calls `startMedium()` which iterates the
  medium subset using `progress.mediumCursor`. Click is a no-op when
  `readiness.unlocked === false`.
- **Daily mode** is unaffected — it stays deterministic by local date
  over the full curated pool.
- **Stats** track `mediumWins` / `mediumLosses` / `mediumLossStreak` /
  `recentSolves` which feed the readiness signal on every render.

## Hard / Master Challenge (0.4.3)

### What Hard is

Hard is the **upper mastery layer** above Medium. It gives strong players
somewhere to grow without breaking Foldwink's fairness or minimalism.

Cognitive ladder:

| Difficulty | Experience                                                        | Support                               |
| ---------- | ----------------------------------------------------------------- | ------------------------------------- |
| Easy       | "I get it" — recognition, low ambiguity                           | No Tabs, no Wink                      |
| Medium     | "I see several possibilities" — disambiguation                    | Tabs + 1 Wink                         |
| **Hard**   | "I can almost see the structure" — sustained constraint reasoning | **Tabs (half-speed reveal), no Wink** |

Hard is harder because it gives **less help**, not because it becomes
hostile. The same 4×4 / 4-groups / 4-mistakes core applies. The field is
just more demanding and the support thinner.

### Hard mechanical rules

- Same 4×4 grid, same 4 groups, same 4 mistakes.
- **Foldwink Tabs present but reveal at half speed.** Stage 0 → 1 letter,
  stage 1 → 1 letter, stage 2 → 2 letters, stage 3 → full. Formula:
  `visibleCount = max(1, floor(stage/2) + 1)`.
- **Wink disabled.** The player cannot tap a tab to reveal it. No Wink
  affordance is shown for Hard puzzles — `canWinkGroup` returns false.
- Error budget remains 4 — no change. Reducing errors to 3 was considered
  and rejected as punishment-first design.

### Hard progression

- **Visibility:** Master Challenge button is visible from the start.
- **Unlock:** `HARD_UNLOCK_AT = 3` medium wins.
- **Recommendation:** `mediumWins >= 5 AND mediumWinRate >= 60%`.
- **Fallback:** 2 consecutive hard losses → gentle hint:
  `"Tough stretch — try a Medium to rebuild momentum."`
- **Never re-locked** after unlocking.

### Hard content status (0.4.3)

**Scaffolded only.** The engine, store, loader, validator, readiness logic,
MenuScreen button, and docs are in place. The Hard puzzle pool is **empty**
(`HARD_POOL.length === 0`). The Menu shows:

> `Master Challenge — soon · Curated hard puzzles are being authored. Check back soon.`

Hard puzzle JSON files must set `"difficulty": "hard"` and carry
`revealHint` on every group (same as Medium). The validator already accepts
`"hard"`.

First real Hard content should go through the batch pipeline in
`docs/content/BATCH_WORKFLOW.md` with the same editorial discipline:

- batches of ≤ 10
- rejection quota ≥ 30%
- every puzzle must meet the quality bar in the spec above
- at least 2 plausible false trails per Hard puzzle
- constraint reasoning > trivia

## Library context

These progression rules operate on the **current library of 98 curated
puzzles (65 easy + 33 medium + 0 hard)**. Hard is scaffolded; no real Hard
puzzles exist in the pool yet. The long-term content target is
**500 curated puzzles** (easy + medium + hard), reached via the disciplined
batch pipeline in `docs/content/BATCH_WORKFLOW.md`. Progression thresholds
may need retuning once the library crosses ~200 puzzles. Not urgent at 98.
