# QA Report — Foldwink MVP

Run date: 2026-04-10
Reviewer: automated + code walk-through

## Automated gates

| Gate             | Command             | Result                                                 |
| ---------------- | ------------------- | ------------------------------------------------------ |
| Typecheck        | `npm run typecheck` | PASS (0 errors)                                        |
| Unit tests       | `npm test`          | PASS (26/26)                                           |
| Puzzle validator | `npm run validate`  | PASS (30 puzzles, 7 intentional cross-puzzle warnings) |
| Production build | `npm run build`     | PASS (175 kB JS / 58 kB gzip)                          |

## Manual logic review — functional checklist

| QA item                              | Status | Notes                                            |
| ------------------------------------ | ------ | ------------------------------------------------ |
| App loads without console errors     | ✅     | Pool loaded statically, dev-fail on invalid JSON |
| Menu → daily launches daily puzzle   | ✅     | `startDaily` guarded on empty pool               |
| Menu → play launches standard puzzle | ✅     | Reads progress cursor                            |
| Submit disabled when selection ≠ 4   | ✅     | `canSubmit` + button disabled                    |
| Tap selected card deselects          | ✅     | `toggleSelection` filters                        |
| Correct group recognized             | ✅     | `findMatchingGroup` exact set match              |
| Solved group non-interactable        | ✅     | Card `disabled` + `pointer-events-none`          |
| Incorrect guess → +1 mistake         | ✅     | `applyIncorrectGuess`                            |
| Game ends after 4 mistakes           | ✅     | `isLoss` + `finalizeIfEnded`                     |
| Game ends when all groups solved     | ✅     | `isWin` + `finalizeIfEnded`                      |
| Result screen shows status           | ✅     | ResultSummary component                          |

## Edge cases

| Case                                    | Status | Notes                                       |
| --------------------------------------- | ------ | ------------------------------------------- |
| Rapid repeated taps don't corrupt state | ✅     | Zustand is synchronous                      |
| Submit after game end                   | ✅     | Guard `if (active.result) return` in submit |
| Toggle after game end                   | ✅     | Same guard in `toggleSelection`             |
| Submitting same solved group            | ✅     | Cards for solved items disabled             |
| Timer stops when result reached         | ✅     | `endedAt` captured once; no live timer      |
| Corrupted localStorage                  | ✅     | `safeRead` wraps JSON.parse with fallback   |
| Invalid puzzle JSON in dev              | ✅     | loader throws with path context             |
| Invalid puzzle JSON in prod             | ✅     | loader drops with warn                      |

## Daily mode

| Case                                  | Status                  | Notes                                                                                   |
| ------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| Same date → same puzzle id            | ✅                      | FNV-1a hash, deterministic (4 tests cover this)                                         |
| Daily completion tracked              | ✅                      | Written to `foldwink:daily` on finalize                                                 |
| Replay after completion — streak safe | ✅ (fixed, see BUG-001) | Replay flagged non-recordable                                                           |
| Date rollover                         | ✅                      | Uses local midnight via `new Date()`                                                    |
| Timezone behavior                     | ⚠️ acceptable           | Players in different TZs get different puzzles on same UTC date — natural UX per design |

## Stats persistence

| Case                                     | Status           |
| ---------------------------------------- | ---------------- |
| Wins/losses increment correctly          | ✅               |
| Streak increments on win, resets on loss | ✅ (tests cover) |
| Best streak never decreases              | ✅ (tests cover) |
| `solvedPuzzleIds` dedup                  | ✅ (tests cover) |
| Storage corruption resets cleanly        | ✅               |
| Clearing storage fully resets            | ✅               |

## Mobile layout sanity

| Concern                        | Status | Notes                                                                                            |
| ------------------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| 4×4 grid at 360 px viewport    | ✅     | Tailwind `grid-cols-4 gap-2` with `max-w-md mx-auto`                                             |
| Card tap target                | ✅     | `aspect-[3/2]` — ~95×63 px on 360 px wide                                                        |
| Text wrapping for longer items | ⚠️     | `break-words` + `text-sm` handles "Fountain Pen", "Kung Fu", "Stracciatella". Tight but readable |
| Controls reachable one-handed  | ✅     | Submit/Clear at bottom, grid in middle                                                           |
| Viewport meta set              | ✅     | `width=device-width, initial-scale=1.0, viewport-fit=cover`                                      |
| Focus visible for keyboard     | ✅     | `:focus-visible` rule in index.css                                                               |

## Bugs

### BUG-001 — Daily replay double-counts stats

- **Severity:** medium
- **Status:** FIXED (this QA pass)
- **Repro:** Play daily puzzle → lose → return to menu → click Daily → complete. Before fix, both attempts wrote `stats` and `daily-history`.
- **Expected:** Only the first daily attempt per local date updates stats and daily history. QA_CHECKLIST specifies "replaying daily does not break streak".
- **Actual (before fix):** Replays overwrote `daily-history[date]` and double-bumped `gamesPlayed`, `wins`/`losses`, `currentStreak`.
- **Fix:** Added `countsToStats` field to `ActiveGame`. `startDaily` sets it to `false` when today's date already exists in daily history. `submit` guards stats/history writes behind `active.countsToStats`. Game screen shows a "· replay" suffix in the header subtitle for transparency.

## Non-bugs / deliberate choices

- **Live timer** — not rendered. Spec allows "show elapsed time if already simple enough"; omitted to keep the hud lean. Timer is still computed in `ResultSummary`.
- **Standard "Next puzzle" after loss** — loads the same puzzle (acts as retry). Acceptable: cursor only advances on win.
- **Abandoned game on tab close** — not persisted mid-session. MVP scope explicitly excludes cloud sync or mid-game persistence.
- **7 cross-puzzle item warnings** — intentional. Same noun used in different category contexts ("earth" as planet vs. classical element, "olive" as pizza topping vs. green shade). The validator treats these as warnings only.

## Regressions verified after BUG-001 fix

- `npm run typecheck` — clean
- `npm test` — 26/26 pass
- `npm run build` — clean, 175.21 kB JS

## Residual risks

1. **Content fairness** — 30 puzzles are curated with editorial notes for the medium set, but the MVP has no community fairness feedback loop. Post-launch we may discover unfair items.
2. **Standard cursor loop** — after 30 puzzles the pool wraps. Player gets the same puzzles again. Not a bug, but feels repetitive after full playthrough.
3. **No recovery on build-time puzzle errors** — adding a malformed JSON will hard-crash dev. Intentional: fail loud in development.
4. **Mobile long-string worst-case** — "Stracciatella" (14 chars) is the longest single word in the pool. Fine at `text-sm`. If future puzzles use 18+ char single words, they may clip.

## Sign-off

Ready for release prep (Phase 8).
