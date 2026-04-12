# Foldwink Visual Polish Report — 0.3.2

## Goal

Take Foldwink from _neat prototype_ to _small indie product feel_. Tighten the title hero, give the daily loop a proper inline completion surface, promote the result metrics to a finish-line strip, and refine the stats screen. No new design system. No new libraries. No noise.

## What changed visually

### New shared components

- **`src/components/Wordmark.tsx`** — single, reusable brand lockup: BrandMark + wordmark + accent underline + optional subtitle. Three sizes (`sm`, `md`, `lg`). Used on Menu (lg, animated) and Stats (sm). Kills the two inline SVG copies that were drifting out of sync.
- **`src/components/StatStrip.tsx`** — compact 2–4 cell metric strip used at the top of `ResultSummary` and as the hero row on `StatsScreen`. One container, single border, `tabular-nums`, 10 px uppercase labels with `0.12em` tracking, tone variants `default / accent / muted`. No gradients, no extra colors.
- **`src/components/DailyCompleteCard.tsx`** — inline card for when today's daily is already solved. Shows an eyebrow (`✦ Daily complete`), the day's result in large tabular numerals (`2:05` / `1/4 mistakes`), the current streak, and the next-daily countdown. Becomes the first thing the returning player sees on the menu.

### `MenuScreen` — re-upgraded

- Replaced the inline 44 px SVG + raw `<h1>` with `<Wordmark size="lg" animated subtitle="…" />`.
- New tagline (now product-facing): _"A daily grouping puzzle. Medium puzzles reveal their categories one letter at a time — tap once to Wink."_ — names both halves of the mechanic in one sentence, and mentions Wink.
- **Daily-complete inline surface.** When `todayDailyRecord` is present, the menu renders `<DailyCompleteCard />` above the CTAs with the live `DailyCountdown`. The primary CTA for a done player is _Standard puzzle_, and the daily CTA degrades to a secondary _Replay daily_ (still routes to the existing replay flow, which does not touch stats).
- **Reordered CTAs.** Daily is the first CTA for a fresh-day player; when the daily is already done, Standard becomes the primary action. The ghost _Stats_ CTA stays third.
- **Empty state refined.** Replaced the bare red text with a bordered card (`Empty pool` eyebrow + monospaced `puzzles/pool/` hint). No red. Consistent with the rest of the surface.
- **Current-streak pill** preserved but only shown when the daily is not yet done (so the DailyCompleteCard owns the streak display on return visits).
- **Footer microcopy** unchanged: `{N} puzzles · dark, calm, daily`.

### `ResultSummary` — promoted to finish-line

- Added a `currentStreak: number` prop.
- Replaced the muted caption line under the headline (`2:05 · 1 mistakes`) with a 3-cell `<StatStrip cells={[Time, Mistakes, Streak]} />` — `Time` in bold tabular numerals, `Mistakes` in `N/4` format (turns muted at 3+ mistakes), `Streak` in accent tone after a winning game.
- The accent underline is kept but moved above the strip for tighter hierarchy.
- Group reveal pills unchanged.
- `fw-result-pop` entrance animation preserved.

### `ResultScreen` — framed

- Subscribes to `stats.currentStreak` and passes it down to `ResultSummary`.
- New **loss warmth card**: when the game is a loss, render a small bordered card with an eyebrow (`Close one`) and one encouragement line (`"Every good solver misses a puzzle. A new daily lands tomorrow."` for daily, `"Try a fresh one — the pattern won't catch you twice."` for standard). Gives the loss state a next-step hook instead of a dead end.
- The daily countdown is now rendered inside a framed surface card instead of as naked text.
- The share area is now a framed **share card**: `rounded-2xl bg-surface border` with a `Share your result` eyebrow above the share button. Gives the share action a visual home instead of existing as just another CTA button.
- Action button stack tightened (`gap-2.5` instead of `gap-3`).

### `StatsScreen` — re-upgraded

- Replaced the bare `<h1>Stats</h1>` with `<Wordmark size="sm" subtitle="Your Foldwink record" />`.
- New `<StatStrip />` hero with 3 cells: `Solved` (accent when > 0), `Played`, `Win %`.
- Existing 6-cell grid kept but restyled (`tabular-nums`, tighter uppercase tracking, `Unique` and `Win Rate` added so the grid is 2×3 and not 2×2 with wasted row).
- New **empty record card** when `gamesPlayed === 0` — bordered card with `Empty record` eyebrow and a one-line CTA hint.
- _Back to menu_ button now full-width.

### Store / state additions

- `ActiveGame` and store state were already tracking `dailyPlayedDate: string | null`. Added a peer field `todayDailyRecord: DailyRecord | null` that carries the full result (result kind, time, mistakes, puzzle id) — required by the new `DailyCompleteCard`.
- Bootstrap: `appStore.ts` now loads today's `DailyRecord` once from `loadDailyHistory()` and seeds both `initialDailyPlayedDate` and `initialTodayDailyRecord` from it.
- Persistence subscriber: moved the daily-history write trigger from `state.dailyPlayedDate` change to `state.todayDailyRecord` change. The subscriber now writes the full record directly (instead of reconstructing it from `summary` + `puzzle`). Simpler and more direct.
- `submit` sets `nextTodayDailyRecord` at the same time as `nextDailyPlayedDate` inside the daily-finalization branch.

### Styles

- No new animation keyframes. The existing `fw-result-pop`, `fw-streak-pulse`, `fw-tab-fade` continue to power the motion and already respect `prefers-reduced-motion`.
- No new colors. Every addition uses the existing `bg`, `surface`, `surfaceHi`, `text`, `muted`, `accent`, `solved1..4`, `danger` tokens.
- No gradients anywhere.

## What changed in the UX surface

| Surface                | Before                                                        | After                                                                             |
| ---------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Menu hero              | Inline 44 px SVG + raw `<h1>` + 1-liner tagline               | `Wordmark lg animated` + accent underline + Foldwink Tabs+Wink tagline            |
| Menu return-visit      | Same as first visit — no acknowledgment that daily was solved | Inline `DailyCompleteCard` with result pill + streak + live countdown             |
| Menu CTA order         | Standard first / Daily second / Stats third                   | Daily first for fresh day · Standard first for return day                         |
| Menu empty state       | Red text line                                                 | Bordered card with monospaced path hint                                           |
| Result headline zone   | Eyebrow + big headline + muted caption                        | Eyebrow + big headline + accent underline + `StatStrip(Time · Mistakes · Streak)` |
| Result loss state      | Headline + group reveal only                                  | Adds bordered warmth card with a next-step sentence                               |
| Result daily countdown | Naked line                                                    | Framed surface card                                                               |
| Result share           | One button in a flat stack                                    | Framed `share card` container with eyebrow + button                               |
| Stats header           | Bare `<h1>Stats</h1>`                                         | `Wordmark sm` + subtitle + 3-cell `StatStrip` hero                                |
| Stats grid             | 6 plain cells                                                 | 6 tabular-num cells + hero strip + empty-record card                              |

## Respect for constraints

- **No new libraries.** All changes use existing React + Tailwind + Zustand.
- **No heavy animation.** The only animation tokens in play are the three existing keyframes, all gated by `prefers-reduced-motion: reduce`.
- **No new design system.** One `Wordmark` lockup, one `StatStrip`, one `DailyCompleteCard`. All three are small, single-purpose, and reuse the existing color tokens.
- **No puzzle schema changes.** Pool untouched. Validator untouched.
- **No engine changes.** Pure engine is identical.
- **No new runtime deps.** Still 3.
- **CI unchanged.**

## What still feels temporary

1. **Wordmark typography is still system sans.** A designed logotype would lift the brand perception further but is out of scope for this pass.
2. **OG image is still an SVG placeholder.** Most scrapers prefer PNG/JPG. The SVG is readable but not as reliable.
3. **Favicon is still the same 2×2 + star motif.** Passable for a small indie but not distinctive.
4. **Card animation on submit is still a static ring flash.** A subtle reveal pulse on correct group solves would tighten the finish-line feel.
5. **StatsScreen's 6-cell grid has some redundancy** (`Win %` appears both in the hero strip and the grid; `Unique` / `Solved` overlap). Intentional for emphasis in this pass; could be rebalanced later.
6. **The result-screen share card has no preview of the actual emoji grid.** Showing a small read-only preview of `buildShareString(...)` output would make the CTA feel earned.
7. **No per-puzzle title in the result summary**, only _Solved_ / _Out of mistakes_. A smaller `{puzzle.title}` subtitle would connect the result to the puzzle.
8. **Mobile-first layout is already good**, but a long streak number (≥3 digits) could eventually overflow the `StatStrip` cell on 360 px. Not observed in practice.

## What still blocks stronger public release

1. **No designed wordmark / logotype.** System sans is competent but not memorable.
2. **No bespoke hero art** on menu. The motif + wordmark is clean but not scroll-stopping.
3. **Content pool is still 73 puzzles.** Above the MVP target but thin for a paid tier.
4. **No pay affordance.** "Support the author" link still does not exist.
5. **Final OG PNG** not yet rendered from the SVG placeholder.
6. **No error boundary** at the React root — a render bug still white-screens the app.
7. **No in-browser QA session** was run during this pass. The polish is verified by code + tests only.
8. **Daily calendar / past-puzzle browser** still absent — a committed daily player has no archive.

## Changed files

New:

- `src/components/Wordmark.tsx`
- `src/components/StatStrip.tsx`
- `src/components/DailyCompleteCard.tsx`
- `docs/reports/FOLDWINK_VISUAL_POLISH_REPORT.md`

Modified:

- `src/game/types/game.ts` (state field carrying — no new field here; `DailyRecord` re-export path untouched)
- `src/game/state/store.ts` — added `todayDailyRecord` slice, bootstrap param, submit wiring
- `src/game/state/appStore.ts` — bootstrap seeds `initialTodayDailyRecord`, subscriber writes on `todayDailyRecord` change
- `src/game/state/__tests__/store.test.ts` — `initialTodayDailyRecord: null` in `makeDeps`
- `src/screens/MenuScreen.tsx` — Wordmark, DailyCompleteCard, reordered CTAs, new empty state
- `src/screens/ResultScreen.tsx` — streak prop, loss warmth card, framed countdown, share card
- `src/components/ResultSummary.tsx` — StatStrip under headline, streak prop
- `src/screens/StatsScreen.tsx` — Wordmark header, StatStrip hero, refined grid, empty-record card

## Verification

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (65 / 65 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (73 puzzles — 47 easy + 26 medium)
npm run build      → PASS (212.79 kB JS / 69.43 kB gzip, 14.92 kB CSS / 3.92 kB gzip)
```

Bundle delta vs 0.3.1: **+4.08 kB JS (+0.95 kB gzip), +0.76 kB CSS (+0.15 kB gzip)** — the cost of three new components plus the store field. Below 1 kB gzipped per new component.
