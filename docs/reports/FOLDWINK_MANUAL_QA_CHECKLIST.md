# Foldwink Manual QA Checklist — 0.3.3

**Scope:** closed-beta candidate build. Run this list end-to-end before inviting testers.
**Expected duration:** 30–45 minutes at a steady pace.
**Environment:** a fresh browser profile (empty `localStorage`) on at least one phone-sized viewport and one desktop-sized viewport.

Mark each row `✅ pass`, `⚠️ minor`, or `❌ fail`. Note fails in a followup issue.

---

## Pre-flight

- [ ] Repo on the target build tag / commit hash recorded at top of the test run.
- [ ] `npm ci` succeeds clean.
- [ ] `npm run typecheck` → clean.
- [ ] `npm test` → 65 / 65 green.
- [ ] `npm run lint` → 0 warnings.
- [ ] `npm run validate` → 98 puzzles (65 easy + 33 medium), all intentional cross-puzzle warnings.
- [ ] `npm run build` → clean. Bundle ≈ 220–230 kB JS / ≈ 72–75 kB gzip.
- [ ] `npm run preview` boots on `http://localhost:4173` (or the port Vite prints).

## First-run (fresh browser profile)

- [ ] Opening the URL renders the `MenuScreen` within 1 second.
- [ ] The **Onboarding overlay** appears immediately on first load.
- [ ] Onboarding shows: BrandMark + "Foldwink" + "How to play" eyebrow + sample tabs row (`R·· / ✦ FLY / B·· / S··`) + 4×4 grid illustration + 4 bullets + "Got it" button.
- [ ] "Got it" dismisses the overlay.
- [ ] Refreshing the page does **not** re-show the overlay (`foldwink:onboarded` persisted).
- [ ] Clearing `localStorage` and reloading brings the overlay back.

## Menu — first visit of the day

- [ ] Wordmark lockup is centered: BrandMark (animated), "Foldwink" title, accent underline, tagline.
- [ ] Tagline mentions **Foldwink Tabs** and **Wink**.
- [ ] Primary CTA reads `Play today's puzzle`.
- [ ] Secondary CTA reads `Standard puzzle`.
- [ ] Ghost CTA reads `Stats`.
- [ ] Footer line reads `98 puzzles · dark, calm, daily`.
- [ ] No `DailyCompleteCard` is shown.

## Menu — after completing today's daily

- [ ] After completing a daily game and returning to menu, the **`DailyCompleteCard`** appears above the CTAs.
- [ ] Card shows `✦ Daily complete` eyebrow + `solved` or `missed` status.
- [ ] Card shows time in `M:SS` and `N/4 mistakes`.
- [ ] Card shows `Streak N` when streak > 0.
- [ ] Card shows a **live countdown** to next local midnight that ticks each second.
- [ ] Primary CTA is now `Standard puzzle`; daily CTA degrades to `Replay daily` secondary.
- [ ] Tapping `Replay daily` starts the same daily; header subtitle shows `· replay`; game completion does **not** change stats.

## Menu — empty pool edge case

- [ ] If `puzzles/pool/` has zero files (test in a separate build), the menu shows a bordered `Empty pool` card, not red text.

## Game screen — easy puzzle

- [ ] Header shows title + subtitle (`EASY · standard`) + mistakes dots.
- [ ] No Foldwink Tabs row (correct — easy puzzles don't have it).
- [ ] 16 cards render in a 4×4 grid.
- [ ] Tapping a card selects it (visible accent state).
- [ ] Tapping a selected card deselects it.
- [ ] Cannot select a 5th card.
- [ ] `Clear` button is disabled at 0 selected.
- [ ] `Submit` button is disabled at ≠4 selected.
- [ ] Selected count reads `N/4`.
- [ ] Quit-to-menu link is visible and returns to menu (abandons the game).

## Game screen — medium puzzle with Foldwink Tabs

- [ ] Header shows `MEDIUM · standard` (or `daily`).
- [ ] **Foldwink Tabs row** renders above the grid with:
  - `FOLDWINK TABS` eyebrow (left)
  - `0/4 solved · ✦ wink ready` (right)
  - Four tabs in a 2×2 layout, each showing a 1-letter preview (`R··`, `F··`, `B··`, `S··` or similar).
- [ ] Hovering an unsolved tab on desktop shows an accent border + cursor-pointer (winkable state).

## Solving a group

- [ ] Correct submit: the group locks into its solved color; all 4 cards become non-interactable; mistakes dots unchanged.
- [ ] The solved tab in the Foldwink Tabs row snaps to the **full label** in the group's solved color.
- [ ] The remaining unsolved tabs reveal **one more letter** each.
- [ ] `N/4 solved` counter increments.

## Incorrect submit

- [ ] Incorrect submit: one mistake dot turns red. A brief red flash appears on the game container.
- [ ] Selection clears.
- [ ] Tabs row stage does **not** advance.

## Wink action

- [ ] On a medium puzzle, tap any unsolved tab while `wink ready` — the tab fills with the full `revealHint` keyword in the accent color with a `✦` prefix.
- [ ] Header chip now reads `✦ wink used`.
- [ ] Other unsolved tabs are no longer clickable (no hover accent).
- [ ] Winking a second tab is silently ignored.
- [ ] Tapping an already-solved tab does nothing (no-op).
- [ ] Winking on an easy puzzle is not possible (no `wink ready` chip, tabs row is absent).

## Submit guards

- [ ] Submitting after the game has ended is not possible.
- [ ] Tapping a solved card is blocked.
- [ ] Rapid double-tapping the same card ends in a consistent state.

## Win state

- [ ] On the 4th correct solve, the screen transitions to the **result screen** automatically.
- [ ] Result screen shows:
  - Eyebrow `FOLDWINK · CLEARED`
  - Big `Solved` headline
  - Accent underline
  - `StatStrip` with `Time`, `Mistakes N/4`, `Streak` (streak in accent tone)
  - 4 group reveal pills in their solved colors
- [ ] If the winning submit incremented the streak to ≥ 2, a **streak celebration card** appears below the summary with `Streak N` and `· new best` if applicable.
- [ ] `Share your result` framed card is visible.
- [ ] For daily mode: a framed **Next daily in HH:MM:SS** countdown is visible, ticking.

## Loss state

- [ ] On the 4th mistake, the screen transitions to the result screen.
- [ ] Headline reads `Out of mistakes`; eyebrow reads `FOLDWINK · CLOSE CALL` in muted tone.
- [ ] `StatStrip` renders (mistakes cell shows `4/4` in muted tone).
- [ ] 4 group reveal pills still display (so the player learns the answers).
- [ ] **Loss warmth card** appears with `Close one` eyebrow and an encouragement sentence (different copy for daily vs. standard).
- [ ] No streak celebration.

## Sharing

- [ ] Tapping the `Share result` button either opens the native share sheet (if `navigator.share` exists) or falls back to clipboard.
- [ ] Clipboard fallback shows `Copied!` for ~1.8 s.
- [ ] The shared/copied text has the shape:

  ```
  Foldwink · YYYY-MM-DD
  Solved in M:SS · N/4 mistakes

  🟨🟨🟨🟨
  🟩🟩🟩🟩
  🟥🟥🟥🟥
  🟪🟪🟪🟪

  foldwink.com
  ```

  (standard mode replaces the date with `#NNN`.)

- [ ] Losses replace solved emoji rows with `⬛⬛⬛⬛` for unsolved groups.

## Navigation

- [ ] `Next puzzle` on a winning standard result advances the cursor and starts the next puzzle.
- [ ] `Next puzzle` is not shown on a daily result.
- [ ] `Stats` → StatsScreen.
- [ ] `Back to menu` → MenuScreen with state cleared.

## Stats screen

- [ ] Wordmark small + subtitle `Your Foldwink record`.
- [ ] Top StatStrip: `Solved`, `Played`, `Win %`.
- [ ] 6-cell grid: `Wins`, `Losses`, `Streak`, `Best`, `Unique`, `Win Rate`.
- [ ] On an empty record (0 games), a bordered `Empty record` card is shown.
- [ ] `Back to menu` full-width button returns to menu.

## Persistence

- [ ] After completing a game, refreshing the page preserves stats, daily history, onboarded flag, standard cursor.
- [ ] `localStorage` keys present after a game: `foldwink:stats`, `foldwink:progress`, `foldwink:daily`, `foldwink:onboarded`.
- [ ] Corrupting any one key (e.g. set `foldwink:stats = "{"` in devtools) and reloading still renders the app (safe defaults).

## Daily determinism

- [ ] Play today's daily. Note the puzzle title.
- [ ] Change system date forward by one day. Hard-reload.
- [ ] New daily loads with a different puzzle and no completion record for the new day.
- [ ] Change system date back. Hard-reload. The original daily record and title are restored.

## Mobile ergonomics (360–430 px viewport)

- [ ] Grid is readable; cards are tappable with a thumb.
- [ ] No horizontal scroll anywhere.
- [ ] `DailyCompleteCard` fits at 360 px.
- [ ] Foldwink Tabs row does not overflow; long keywords do not wrap into the card height oddly.
- [ ] Result screen buttons are thumb-reachable at the bottom.
- [ ] Onboarding overlay is scrollable if it ever overflows (should not on common sizes).

## Desktop (≥ 1280 px)

- [ ] Content caps at `max-w-xl`; desktop layout is centered with ample negative space.
- [ ] Focus-visible outlines appear when tabbing through buttons.
- [ ] Keyboard `Space` / `Enter` activates focused buttons.

## Accessibility basics

- [ ] Card `aria-pressed` toggles correctly in devtools Accessibility panel.
- [ ] Mistakes dots have an `aria-label` with the correct counter.
- [ ] Focus ring is visible on all interactive elements.
- [ ] Reduced motion: enable OS `prefers-reduced-motion`; result screen entrance, tab fade, and streak pulse animations are suppressed.

## Console hygiene

- [ ] No uncaught errors in console during a full win-path session.
- [ ] No uncaught errors during a full loss-path session.
- [ ] No warnings about missing keys or duplicate keys.
- [ ] No HMR-specific noise in production preview.

## Network / offline

- [ ] Load the app once with network. Go offline. Hard-reload: app loads from cache when served with a static host's default caching; no explicit service worker is shipped yet.
- [ ] No network calls to third parties in devtools Network panel (no analytics, no fonts from CDN, no trackers).

## Known non-fails (do **not** flag these as bugs)

- Mid-game refresh drops the active game and any Wink state — deliberate, mid-game persistence is out of scope.
- Easy puzzles have no Foldwink Tabs and no Wink — by design.
- Daily countdown disagrees with a friend in another time zone — matches the local-date selection rule.
- Cross-puzzle reuse warnings in `npm run validate` output — intentional context switches; only errors are blocking.
- Share string uses `foldwink.com` footer even if that domain is not yet owned — placeholder acceptable for closed beta.

## Sign-off

- [ ] Tester name:
- [ ] Device / browser / viewport:
- [ ] Overall verdict: ⬜ clean / ⬜ clean with notes / ⬜ blocker
- [ ] Attached notes:
