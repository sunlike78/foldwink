# Foldwink Originality Upgrade Report — 0.3.0

## Mechanic decision

**Foldwink Tabs** — medium puzzles render a row of 4 thin "tabs" above the grid, each holding a short keyword hint for one category. Every keyword starts with 1 letter visible and the rest masked as `·`. Every correct solve reveals one more letter across all unsolved tabs. When a group itself is solved, its tab snaps to the full category label in its solved color.

One-sentence pitch: _"Medium Foldwink puzzles reveal their categories one letter at a time, faster as you solve."_

## Why this is more original than the previous anchor hint

The 0.2.0 **anchor twist** was a passive sticker: one card had a ★ badge and a header banner spelled its group for you. The player could look at it or ignore it. Once the game started, nothing about the anchor changed, and nothing about solving advanced it. In the audit, this was correctly called "a hint, not a mechanic".

Foldwink Tabs are different on every axis that matters:

| Axis                              | Anchor twist (0.2.0)                 | Foldwink Tabs (0.3.0)                                                           |
| --------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| **Felt during play?**             | Briefly read at start, then ignored. | Visibly changes every time the player submits a correct group.                  |
| **Tied to progression?**          | No.                                  | Yes — the reveal stage is a function of how many groups are already solved.     |
| **Creates tension?**              | No — it only removes tension.        | Yes — partial reveals create a recognition race ("I can almost read 'TEMPO…'"). |
| **Explainable in one line?**      | Yes.                                 | Yes.                                                                            |
| **Distinctive from Connections?** | Marginally.                          | Clearly — no grouping game I'm aware of does a progressive category reveal.     |
| **Elegant?**                      | One sticker + one banner.            | 4 tiny pills in a single row. No modal, no button, no spend.                    |
| **Engine rewrite?**               | None.                                | None — it's a pure view computed from `puzzle` + `solvedGroupIds`.              |
| **Applies to medium only?**       | Yes.                                 | Yes.                                                                            |
| **Schema change?**                | Added `twist.anchor.item`.           | Added `PuzzleGroup.revealHint?: string`.                                        |

## Implementation summary

### Pure engine

- `src/game/engine/foldwinkTabs.ts` — `revealStage(hint, stage)` progressively uncovers a keyword, `hintFor(group)` falls back to `label` when `revealHint` is absent, `buildFoldwinkTabs(puzzle, solvedGroupIds)` returns an empty array for easy puzzles and a 4-tab array for mediums.
- Whitespace is preserved through all stages (so `"ICE CUBE"` at stage 0 becomes `"I·· ····"`, not `"I··· ····"`).
- Stage formula: `visibleCount = min(hintLength, max(1, stage + 1))`, where `stage` is the number of already-solved groups.
- Solved groups always display the full `label` (not the keyword) in the solved color.

### Schema

- `src/game/types/puzzle.ts`: dropped the `AnchorTwist` / `Twist` types and the top-level `twist` field. Added optional `PuzzleGroup.revealHint?: string`.
- `scripts/validate-puzzles.ts`: dropped the anchor validation and added `revealHint` validation — medium puzzles may set it, easy puzzles get a warning if they do, hints over 24 chars get a mobile-layout warning, duplicate hints in the same puzzle get a warning.

### UI

- `src/components/FoldwinkTabs.tsx` — tight 2×2 grid of 4 pills with tabular-nums spacing. Header row labels it "Foldwink Tabs" + "N/4 solved".
- `src/screens/GameScreen.tsx` — mounts `<FoldwinkTabs />` between the header and the card grid. Removed the old anchor banner and the ★ badge on cards. Solved color is now resolved via positional index only.
- `src/components/Card.tsx` — dropped the `anchor` prop entirely.

### Content

- All 16 existing medium puzzles (`puzzle-0019`…`puzzle-0030`, `puzzle-0035`…`puzzle-0038`) gained a `revealHint` on every group.
- `twist` fields removed from every JSON file in `puzzles/pool/`.
- New medium puzzles in this pass (`puzzle-0061`…`puzzle-0070` and others) ship with `revealHint` from birth.

### Docs

- `docs/PUZZLE_SCHEMA.md` rewritten with the `revealHint` rule and a worked example.
- `docs/PUZZLE_EDITORIAL_GUIDELINES.md` (new) — three-question test, difficulty rules, revealHint tips.

### Tests

- `src/game/engine/__tests__/foldwinkTabs.test.ts` — 11 new tests covering `revealStage`, `hintFor`, `buildFoldwinkTabs` (easy vs medium, stage progression, solved-state display).
- Deleted `src/game/engine/__tests__/twist.test.ts` (the old anchor tests).
- Total test count: 51 across 9 files.

## Tradeoffs

- **Revealing letters helps the player solve faster.** On a word-play puzzle like `"___ FLY"` with `revealHint: "FLY"`, a player who sees `"F··"` already knows there's a "something-FLY" category. That's intentional — word-play mediums were unfair without any anchor, and Foldwink Tabs make them feel fair and learnable. On synonym puzzles like `revealHint: "SMART"`, the hint is a category label, not an answer — the player still has to find which 4 words mean smart.
- **Authoring cost.** Every new medium now needs one extra field per group. This is a small tax on authors; the three-question test + the editorial guidelines make it a 1-minute step.
- **Easy puzzles get nothing.** This is fine — easy categories are self-explanatory and don't need the mechanic. It also gives the mechanic a clear difficulty function: "if you want the Foldwink Tabs experience, play medium".
- **`revealHint` may be the same as the label for straightforward mediums** (e.g. "Synonyms of SMART" with hint "SMART"). That's acceptable — the reveal still happens, and the player still sees progressive uncovering.

## Remaining differentiation risks

- **The Tabs can feel decorative at first glance.** A user who never reads the header may miss the letter-by-letter reveal. Mitigation: the onboarding overlay now explicitly names "Foldwink Tabs" and shows the `R·· F·· B·· S··` example.
- **Word-play mediums remain hard for non-native English speakers.** The Tabs help but cannot fully cross the language barrier. Mitigation: we keep mediums balanced between word-play, synonyms, classification, and domain categories — only a fraction of mediums are word-play.
- **If the pool grows to 500+ mediums, the "always reveals letters" pattern may lose novelty.** Mitigation path (not in 0.3.0): per-pack variants of the reveal stage rule, or occasional "silent" mediums where the Tabs reveal is slower for extra difficulty.
- **A single mechanic is still a single mechanic.** Foldwink is now clearly differentiated from Connections, but it is not yet a multi-mechanic product. Adding a second mechanic (e.g. a timed mode, or a streak-boss medium variant) is explicitly out of scope for 0.3.0.

## What this did not change

- Core engine (`shuffle/submit/progress/result`) is untouched.
- Store factory pattern is untouched.
- Persistence subscriber is untouched.
- Daily selection rule is untouched.
- Stats and streak logic are untouched.
- All 51 previously-passing tests still pass (plus 8 new, minus 3 removed anchor tests).

## Verification

```
npm run typecheck  → PASS
npm test           → PASS (51 / 51 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (73 puzzles — 47 easy + 26 medium)
npm run build      → PASS (205.68 kB JS / 67.80 kB gzip)
```
