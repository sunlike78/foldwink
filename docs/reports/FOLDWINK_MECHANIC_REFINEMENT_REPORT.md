# Foldwink Mechanic Refinement Report — 0.3.1

## Chosen mechanic direction

**Foldwink Tabs + Wink.** The passive progressive-reveal mechanic introduced in 0.3.0 gains a single player-driven action: **Wink**. Once per medium puzzle, the player may tap any unsolved Foldwink Tab to fully reveal its category keyword immediately. One wink per game, no penalty, no cost beyond its own scarcity.

One-sentence description: _"Once per puzzle, tap a Foldwink Tab to Wink it and fully reveal its category — use it when you're stuck."_

## Why this upgrade exists

The 0.3.0 audit feedback was specific: the Tabs mechanic was _felt through the eyes, not through the hands_. The player watched letters appear, but never decided anything about them. Every reveal was a consequence of a solve the player had already made — help was snowball-shaped, concentrated on whoever was already winning. And critically, the mechanic did not earn the "wink" half of the Foldwink name.

Wink fixes all three problems at once:

| Concern                                  | Before (Tabs alone)                      | After (Tabs + Wink)                                                |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| Does the player _do_ something?          | No — letters appear on solve.            | Yes — one deliberate click per game.                               |
| Anti-snowball rescue?                    | No — help grows with wins.               | Yes — Wink is most valuable when you're stuck early.               |
| Does it earn both syllables of the name? | Only "fold" (concealed tabs).            | Both — "fold" for the hidden Tabs, "wink" for the one-time reveal. |
| Scarcity creates tension?                | No — reveals are free and deterministic. | Yes — one wink per puzzle is a real strategic resource.            |
| Risk of unfairness?                      | None.                                    | None — Wink is optional, penalty-free, capped at one.              |

## What changed

### Types

- `src/game/types/game.ts` — added `winkedGroupId: string | null` to `ActiveGame`. Added `MAX_WINKS_PER_GAME = 1` as an explicit constant. The field is required and initialized to `null` by `initialActive`.

### Pure engine

- `src/game/engine/foldwinkTabs.ts`:
  - `FoldwinkTab` interface gains `winked: boolean`.
  - `buildFoldwinkTabs(puzzle, solvedGroupIds, winkedGroupId?)` — third parameter is optional for backward compatibility, defaults to `null`. A winked, unsolved tab returns the full `hintFor(group)` immediately, regardless of stage. If both solved and winked would apply (e.g. the winked group is then solved), `solved` takes precedence and the tab shows the full label in the solved color.
  - New `canWinkGroup(puzzle, solvedGroupIds, winkedGroupId, groupId)` helper — pure predicate encapsulating all the guards (medium-only, one wink per puzzle, not already solved, group must exist).

### Store

- `src/game/state/store.ts`:
  - `winkTab(groupId: string)` action added to `StoreState`. Guards: no active game, game already ended, not a medium puzzle, wink already used, group already solved, unknown group id — all are silent no-ops (consistent with the pattern used for `toggleSelection` / `submit`).
  - `initialActive` sets `winkedGroupId: null`. Nothing in the store mutates it except the `winkTab` action. A fresh game via `startStandard` / `startDaily` always resets it (via a fresh `initialActive`).

### UI

- `src/components/FoldwinkTabs.tsx` — rewritten:
  - Accepts `winkedGroupId: string | null`, `onWink: (groupId: string) => void`, `gameEnded: boolean`.
  - Header row now shows a third chip: `✦ wink ready` (available), `✦ wink used` (spent), or `✦ wink` (game ended).
  - Unsolved, unwinked tabs become `<button>` elements when a wink is available, with a hover-accent border and a descriptive aria-label.
  - Winked tabs render as non-clickable divs in accent color with a `✦` prefix and the full keyword.
  - Solved tabs render as before (solved color + full label).
- `src/screens/GameScreen.tsx` — subscribes to `winkTab`, passes `winkedGroupId`, `onWink`, `gameEnded` props through to `<FoldwinkTabs />`.
- `src/components/Onboarding.tsx` — updated:
  - The visual sample grid now shows one tab in the "winked" accent state (`✦ FLY`) alongside three unwinked tabs (`R··`, `B··`, `S··`).
  - A fourth bullet describes the Wink: _"Tap a tab once per puzzle to ✦ Wink it and fully reveal its category. Save it for when you're stuck."_

### Tests

- `src/game/engine/__tests__/foldwinkTabs.test.ts` — +7 tests:
  - `buildFoldwinkTabs`: winked tab shows full hint regardless of stage; winked flag propagates; solved state overrides winked when both apply.
  - `canWinkGroup`: allows first wink, refuses second wink, refuses solved group, refuses easy puzzles, refuses unknown group ids.
- `src/game/state/__tests__/store.test.ts` — +7 tests:
  - `winkTab` sets `winkedGroupId` on the first call.
  - Second `winkTab` is a no-op.
  - Winking a solved group is a no-op.
  - Winking on easy puzzles is a no-op.
  - Winking an unknown group id is a no-op.
  - `winkedGroupId` resets to `null` on a new game.
  - Winking after the game has ended is a no-op.
- `src/game/engine/__tests__/progress.test.ts` — updated the `base()` factory to include `winkedGroupId: null` (one-line fix).

Total test count: **65** across **9** suites (up from 51 / 9).

### Docs

- `docs/PUZZLE_SCHEMA.md` — added a short note under the `revealHint` section explaining how the Wink mechanic consumes the hint. No schema fields changed; the `PuzzleGroup.revealHint?: string` shape is stable.
- `docs/PUZZLE_EDITORIAL_GUIDELINES.md` — added a line under "Reveal hint tips": _"Because a player may choose to Wink any one tab, revealHint should feel like an earned unlock when fully shown — not a give-away."_
- `docs/KNOWN_LIMITATIONS.md` — documented the one-wink-per-puzzle constraint and its deliberate absence on easy puzzles.
- `docs/RELEASE_NOTES.md` — 0.3.1 section added.

## Why this is better than 0.3.0

- **Actionable.** The Tabs now accept a tap. They stopped being read-only.
- **Felt via a decision, not via a reveal.** Every medium puzzle now contains one micro-decision the player must make themselves: when to spend the Wink. This is the first moment in the codebase where the player exercises judgment about the mechanic rather than the answers.
- **Rescue-shaped, not snowball-shaped.** The Wink is most valuable when the passive reveal fails to help — which is exactly the early game, when the player has zero solves and the Tabs show only 1 letter each. Previously, a stuck early player had no recourse. Now they do.
- **Earns the name.** "Fold" = concealed tabs that reveal progressively. "Wink" = the one-time flash of clarity the player triggers. Both halves of _Foldwink_ now map directly to observable player behavior on the board.
- **No new system.** The upgrade adds one required field on `ActiveGame`, one store action, one pure predicate, and one component prop set. The engine, the scheduler, the persistence subscriber, the daily selector, the share string, and the stats pipeline are all untouched.
- **Backward compatible where it matters.**
  - `buildFoldwinkTabs` has an optional third parameter — existing call sites would still compile (all call sites were updated).
  - No puzzle JSON changes. The 73-puzzle pool is untouched.
  - No persistence keys changed.
  - Easy puzzles are unaffected.

## Tradeoffs

- **One extra field on `ActiveGame`.** Mid-game save/restore (not implemented today) would need to persist this field. Documented.
- **Authoring cost rises slightly.** A `revealHint` that was purely a progressive-reveal crutch is now also a potential full-reveal answer. Editorial guidance now reminds authors to pick keywords that feel meaningful when fully revealed.
- **Wink can be "wasted".** A new player who taps the first tab they see without understanding the constraint loses the rescue for later. Mitigation: the onboarding overlay now explicitly tells the player to save it for when stuck, and the header chip shows a clear `✦ wink ready` / `✦ wink used` state.
- **Still medium-only.** Easy puzzles have no Wink affordance. Deliberate — easy puzzles don't need a rescue, and adding the Wink to easy would dilute the mechanic's strategic weight. Accepted.
- **Wink is not persisted across a reload.** If the player refreshes mid-game, the entire `ActiveGame` (and therefore the wink state) is dropped. This matches the existing 0.3.0 behavior — mid-game persistence is deliberately out of scope.

## Remaining differentiation risks

1. **"One rescue button" is a familiar shape.** Some players will compare it to Wordle's reveal / Connections' shuffle. Mitigation: the Wink is tightly integrated with the Tabs surface — it's not a generic "show answer" button, it's "peel a specific tab". Foldwink remains the only game where you decide _which_ concealed category to open.
2. **Players may never use the Wink.** If a committed solver refuses to spend their wink and brute-forces every medium, the mechanic adds zero value for that player. This is fine — the Wink is a rescue, not a requirement.
3. **The mechanic is still a single one.** Foldwink has one core Tabs+Wink system. A second mechanic (e.g. a timed variant or a streak-boss medium) remains explicitly out of scope for 0.3.1.
4. **Visual signature could be stronger.** The Wink state uses a single accent border and a `✦` glyph. A future pass could introduce a subtle reveal animation on the first Wink of a session. Deliberately not added here to keep the pass minimal.
5. **Localization tax.** When Foldwink eventually ships non-English content, `revealHint` becomes a translation surface. Flagged for the future.

## Verification

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (65 / 65 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (73 puzzles — 47 easy + 26 medium), 62 intentional cross-puzzle warnings
npm run build      → PASS (208.71 kB JS / 68.48 kB gzip, 14.16 kB CSS / 3.77 kB gzip)
```

Bundle delta vs 0.3.0: **+3.03 kB JS (+0.68 kB gzip), +0.42 kB CSS (+0.05 kB gzip)**. The entire Wink mechanic costs less than 1 kB of gzipped JS.

## Files changed

- `src/game/types/game.ts` — `winkedGroupId`, `MAX_WINKS_PER_GAME`
- `src/game/engine/foldwinkTabs.ts` — `winked` on `FoldwinkTab`, `winkedGroupId` param on `buildFoldwinkTabs`, new `canWinkGroup` predicate
- `src/game/engine/__tests__/foldwinkTabs.test.ts` — +7 tests
- `src/game/state/store.ts` — `winkTab` action, `winkedGroupId: null` in `initialActive`
- `src/game/state/__tests__/store.test.ts` — +7 tests
- `src/game/engine/__tests__/progress.test.ts` — `winkedGroupId: null` in test factory
- `src/components/FoldwinkTabs.tsx` — interactive tabs with Wink affordance, header chip
- `src/screens/GameScreen.tsx` — pass `winkedGroupId`, `onWink`, `gameEnded`
- `src/components/Onboarding.tsx` — visual sample + 4th bullet describing the Wink
- `docs/PUZZLE_SCHEMA.md` — note about Wink consumption
- `docs/PUZZLE_EDITORIAL_GUIDELINES.md` — one-line reveal-hint note
- `docs/KNOWN_LIMITATIONS.md` — documented the one-wink-per-puzzle constraint
- `docs/RELEASE_NOTES.md` — 0.3.1 section
- `docs/reports/FOLDWINK_MECHANIC_REFINEMENT_REPORT.md` — this file
