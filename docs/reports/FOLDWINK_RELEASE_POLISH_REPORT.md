# Foldwink Release Polish Report — 0.3.0

## Headline summary

0.3.0 takes Foldwink from "cleanly branded indie puzzle test" to "small indie puzzle product with a real, felt-during-play mechanic". The upgrade surface is narrow but load-bearing: a new title hero, the Foldwink Tabs row above every medium board, a brand mark everywhere, refined onboarding, refined result screen, 31 new puzzles, and a handful of lightweight motion tokens. Bundle grew from 61.87 → 67.80 kB gzip.

## Visual / product upgrades

### Brand mark

- New shared `src/components/BrandMark.tsx` — 64-px SVG motif (2×2 pastel tiles + an accent core dot) with an optional `animated` prop. The top-right tile gently fades on a 3.4 s cycle, suggesting the Foldwink Tabs reveal without being noisy.
- Rendered above the wordmark on `MenuScreen` and above the heading in `Onboarding`.

### Title screen (`MenuScreen`)

- Bigger wordmark (`text-5xl sm:text-6xl`).
- Accent underline bar under the wordmark.
- Product tagline: _"A daily grouping puzzle with **Foldwink Tabs** — categories that reveal themselves one letter at a time as you solve."_
- CTA reordered: **"Play today's puzzle"** (daily) first, **"Standard puzzle"** second, **"Stats"** third. Daily-done-today state shows `"Daily Puzzle · done today"` on the button.
- Current streak pill under the CTAs when `currentStreak > 0`, with `best` badge when `bestStreak > currentStreak`.
- Footer microcopy: _"{N} puzzles · dark, calm, daily"_.

### Onboarding

- `src/components/Onboarding.tsx` now opens with the brand mark + wordmark + "How to play" eyebrow.
- Visual block now shows the Foldwink Tabs sample (`R·· F·· B·· S··`) above the 4×4 grid illustration with one solved row — a single glance conveys the mechanic.
- Copy updated: three bullets covering (1) pick 4 + submit, (2) 4 mistakes, (3) the Foldwink Tabs reveal mechanic in plain English.

### Foldwink Tabs (the mechanic surface)

- New `src/components/FoldwinkTabs.tsx` — 2×2 grid of 4 thin pills between the header and the card grid on medium puzzles.
- Header row: `FOLDWINK TABS` (eyebrow) + `N/4 solved` (progress).
- Unsolved tabs: surface + subtle border + tracking-wide text using the masked hint (`R··`, `RE·`, `RED`).
- Solved tabs: full label in the group's solved color (same palette as the cards, via `solvedClassForGroup`).

### Result screen payoff

- `ResultSummary` rewritten with a `fw-result-pop` entrance animation (320 ms ease-out, transform + opacity, respects `prefers-reduced-motion`).
- New eyebrow text: `FOLDWINK · CLEARED` for wins, `FOLDWINK · CLOSE CALL` for losses.
- Headline size bumped (`text-4xl font-extrabold`).
- Under-headline accent bar (same token as the menu hero).
- Reveal pills use consistent uppercase eyebrow + body combo.
- Streak celebration card now uses a `fw-streak-pulse` ring effect and the accent color accent on "new best".

### Motion tokens (added to `src/styles/index.css`)

- `@keyframes fw-tab-fade` — subtle tile fade for `BrandMark(animated)`.
- `@keyframes fw-result-pop` — 320 ms entrance for `ResultSummary`.
- `@keyframes fw-streak-pulse` — 1.8 s box-shadow pulse for the streak card.
- Global `@media (prefers-reduced-motion: reduce)` rule that disables all of the above. No heavy animation library.

## UX upgrades

- **First-session clarity.** Onboarding now names the mechanic and shows it visually, so a first-time player has a concrete expectation of what "Foldwink Tabs" will look like in the next 10 seconds.
- **Daily tension.** "Play today's puzzle" + daily-done-today label create a clear daily return hook. When combined with the 0.2.0 next-daily countdown, the daily loop is complete.
- **Streak visibility.** Current streak is now on both the menu and the result screen, not just the stats screen.
- **Mechanic feedback.** Every correct submit visibly updates the Foldwink Tabs. The game stops being a silent selector and becomes a progressive reveal.
- **Reduced motion discipline.** All new animations respect the user's system preference out of the box.

## Release readiness changes

- Test count held steady at 51 (net: +8 new for Foldwink Tabs, −3 old anchor tests).
- `npm run lint` clean.
- `npm run validate` clean with 73 puzzles vs. 42.
- Bundle: `205.68 kB JS / 67.80 kB gzip` — +15.95 kB / +5.93 kB gzip over 0.2.0, almost entirely from the +31 puzzles and the new component surface.
- No new runtime dependencies. Same 3 runtime deps as 0.1.0 (`react`, `react-dom`, `zustand`).
- CI workflow unchanged; still runs `typecheck / test / validate / lint / format:check / build`.
- Docs updated:
  - `docs/PUZZLE_SCHEMA.md` — rewritten for `revealHint` + Foldwink Tabs.
  - `docs/PUZZLE_EDITORIAL_GUIDELINES.md` (new).
  - `docs/CONTENT_EXPANSION_NOTES.md` (new).
  - `docs/RESEARCH_SOURCES.md` (new).
  - `docs/KNOWN_LIMITATIONS.md` updated.
  - `docs/RELEASE_NOTES.md` 0.3.0 section added.

## Pre/post score delta (self-assessed, same dimensions as `RELEASE_READINESS_REASSESSMENT.md`)

| Dimension                        | 0.2.0 | 0.3.0 | Notes                                                                                            |
| -------------------------------- | ----- | ----- | ------------------------------------------------------------------------------------------------ |
| Technical Quality                | 8     | **8** | = Clean; no regressions. Store untouched.                                                        |
| Architecture Quality             | 8     | **8** | = Mechanic added as pure helper + view component, no churn.                                      |
| Code Quality                     | 8     | **8** | = Anchor removed cleanly. One new pure module.                                                   |
| Maintainability                  | 8     | **8** | = Schema added one optional field. Validator simpler than before.                                |
| UI / Visual Quality _(inferred)_ | 6     | **7** | Brand mark, tagline, accent bars, motion tokens, Foldwink Tabs row. Still no bespoke logotype.   |
| UX Quality                       | 7     | **8** | Mechanic is now felt, not read. Daily hook surface. Streak surfaced.                             |
| Product Clarity                  | 8     | **9** | One-sentence product pitch is now visible in the onboarding and the title screen.                |
| Differentiation                  | 5     | **7** | Foldwink Tabs is a real, visible, progression-tied mechanic. Still one mechanic, but a good one. |
| Commercial Readiness             | 5     | **6** | 73 puzzles + real mechanic + stronger brand surface. Still no pay path.                          |
| Release Readiness                | 7     | **8** | All gates green. Content runway for several weeks. Brand art still placeholder.                  |

## What still blocks a stronger public launch

1. **No designed wordmark.** The `<h1>Foldwink</h1>` in the system font stack is still the title. A custom lockup / type treatment would lift Visual Quality to 8+.
2. **OG image is still SVG.** Some crawlers prefer PNG/JPG. `/og.svg` is a clean placeholder but a final rendered 1200×630 PNG is the ideal ship asset.
3. **No pay affordance.** `Ko-fi / Gumroad / Patreon` link does not exist in the app. Commercial Readiness is capped at ~6 until there is some way to support the author.
4. **73 puzzles is enough for a closed test, not a paid tier.** 120–150 is the next credible target for "worth a small price".
5. **No hard difficulty.** Post-MVP.
6. **No share-a-friend invite loop.** The share string exists but there's no landing copy or referral hint.
7. **Mechanic only surfaces on medium.** An easy player never sees a Foldwink Tab. Considered and accepted — easy puzzles don't need a hint — but a future "mechanic preview" on the menu could raise awareness.
8. **No error boundary on the React tree.** A render bug would still white-screen the app. Low probability; easy to add in 0.3.1.
9. **No in-browser QA session was run during this pass.** The solved-color fix, the Foldwink Tabs UI, and the onboarding overlay were verified by code review + unit tests, not by direct observation of a running page.
10. **The daily tabs and the standard tabs use the same reveal rate.** A future tuning step could make daily tabs slightly more generous (rewarding daily return).

## Release classification after 0.3.0

**Still: "Releasable as polished indie MVP"**, but the _quality_ of that classification is higher.

0.2.0 earned "polished indie MVP" by being coherent; 0.3.0 earns it by being both coherent and _distinctive_. The Foldwink Tabs mechanic is the first thing in this repo that gives a reviewer a reason to say "this isn't Connections" without handwaving at author discipline.

The remaining gap to a credible paid indie release is primarily **brand art** (wordmark + hero + final OG PNG) and **content depth** (150+ puzzles). Both are additive and do not require further engineering.

## Gates

```
npm run typecheck  → PASS
npm test           → PASS (51 / 51 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (73 puzzles — 47 easy + 26 medium)
npm run build      → PASS (205.68 kB JS / 67.80 kB gzip)
```
