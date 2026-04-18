# Known Limitations

Foldwink MVP is intentionally scoped small. These are known gaps documented so the next iteration has a clear starting point.

## Gameplay

- **Timer visibility (fixed 0.6.2).** A live in-game timer is rendered on the game-screen header. Earlier QA notes ("timer not visible") tracked a readability issue caused by a `text-muted` + 12px combo, not a missing element; 0.6.2 bumps the timer to normal body weight and contrast.
- **No one-away hint.** Deferred to post-MVP.
- **Standard mode wraps on completion.** After the last puzzle in the pool, the player restarts at the beginning. There is no "you finished everything" celebration.
- **Standard "Next puzzle" after a loss** retries the same puzzle. This is intentional ("retry") but may surprise first-time players.
- **Quit to menu mid-game** drops the attempt with no stats change — the game is simply abandoned.

## Daily mode

- **Local date, not UTC.** Two players in different time zones may see different daily puzzles on the same calendar day. Natural UX, but not "global daily".
- **Daily replay is allowed but not recorded.** A replay shows `· replay` in the header subtitle and does not touch stats or daily history.
- **No daily calendar or past-puzzle browser.** Only today's daily is reachable.
- **Countdown is local.** The "Next daily in HH:MM:SS" clock on the result screen is computed against the player's local midnight. It will disagree with a friend in a different time zone — acceptable, matches the selection rule.

## Content

- **Current library: 500 curated puzzles (272 easy · 194 medium · 34 hard).** Comfortable for ~1 year of daily + standard play. Every medium carries Foldwink Tabs (`revealHint` on all 4 groups) and supports the Wink action. Hard puzzles use half-speed Tabs with no Wink.
- **Content target reached.** Post-launch batches may extend toward 600 at a slower cadence.
- **One Wink per medium puzzle.** The player can tap a Foldwink Tab once per game to fully reveal its category. No second wink. Easy puzzles have no Wink affordance — by design, not a gap. Hard puzzles have no Wink by design.
- **Hard / Master Challenge: 20 real puzzles, fully playable.** Tabs reveal at half-speed and Wink is disabled. See `docs/PROGRESSION_RULES.md` for the product spec and progression model.
- **English only.** No localization.
- **Editorial notes are sparse on easy puzzles.** Medium puzzles carry `editorialSummary` hints for the false trails; easy puzzles mostly do not.

## Persistence

- **Mid-game persistence works.** Refreshing restores the active game via `foldwink:active-session`. Closing the tab preserves state in localStorage.
- **No cross-device sync.** All stats live in `localStorage` of the current browser.
- **Clearing site data wipes stats.** Expected.
- **No export/import of stats.**

## UX and accessibility

- **Keyboard navigation is default tab order only.** No custom arrow-key grid navigation. QA note D-18 (April 2026) confirms arrow-key navigation is missing; Tab / Enter / Space do work. Deferred to a dedicated accessibility pass after 1.0.
- **Onboarding modal is per-origin.** localStorage scopes the `foldwink:onboarded` flag to the origin the game was loaded from. A player who first dismisses onboarding on `sunlike78.github.io/foldwink/` will still see it on `neural-void.com/foldwink/` because those are different origins. Standard browser behavior, not a bug.
- **Console noise when the game is loaded through the neural-void.com launcher page.** The parent page may inject DatadogRUM, Facebook Pixel, and Intercom — these appear in the console alongside the game's own bundle logs. The game bundle itself logs nothing in production. Ignore third-party lines when triaging real issues.
- **Color is not the only signal** (solved groups also move visually to the lock state), but the four solved palette colors are not color-blind validated.
- **Screen reader experience is basic.** Cards announce text + `aria-pressed`; mistakes have an `aria-label`. No live region for game state changes.
- **Long item names** (≥18 chars) may wrap tightly on the smallest phones. The current pool is safe (longest word is "Stracciatella" at 13 chars).

## Build / tooling

- **ESLint + Prettier configured.** CI runs typecheck / test / validate / lint / format:check / build.
- **No component or e2e tests.** Only pure-logic unit tests in Vitest + Playwright browser QA automation.
- **No bundle analyser.** Production JS is 321 kB / 103 kB gzip — acceptable for web, on the heavier side for itch.io HTML5 embed.

## Observability

- **No analytics.** No Sentry, no Plausible, no network telemetry of any kind. 0.4.x adds a **local-only** aggregate event counter (`foldwink:events`) that never leaves the device. A clear-local-data affordance lives in the About footer on the menu.

## Audio (0.4.1)

- **Synthesised palette, not recorded.** All nine cues (`select`, `deselect`, `submit`, `wrong`, `correct`, `tabReveal`, `wink`, `win`, `loss`) are generated at runtime via the Web Audio API. The target material reference is paper / card / wood / bone; the 0.4.1 recipes tune bodies to 80–280 Hz with low-pass filtered noise taps to stay away from mobile-chime brightness. See `docs/SOUND_DESIGN.md` for the cue manifest and the asset-replacement plan.
- **No in-browser audio QA has been run on 0.4.1.** The retune is based on the documented material direction, not on a listening pass. Remains a human-verification task before a public launch.

## Progression (0.4.2)

- **Easy → Medium soft-gate.** Medium puzzles are visible from day one but the Medium button is disabled until the player has solved **5 easy puzzles**. The unlock is simple on purpose; see `docs/PROGRESSION_RULES.md` for the full model (unlock, recommendation, strong, fallback).
- **No mixed "Standard" walk anymore.** Since 0.4.2, Standard mode is split into Easy and Medium tracks with independent cursors (`progress.easyCursor`, `progress.mediumCursor`). Old saved state using the legacy single `cursor` field is read as the easy cursor on upgrade.
- **Time is not a hard gate.** Recent solve durations only affect the "strong" confidence bump on the recommendation signal — they never lock or unlock anything.
- **Fallback is gentle.** Two consecutive medium losses trigger a short hint suggesting more easy puzzles. Medium is never re-locked.

## Branding

- **System-sans wordmark only.** No human-designed logotype. The new "by Neural Void" sublabel (Wordmark / AboutFooter / share card / OG image) is typographic, not illustrated.
- **SVG-only OG image.** `public/og.svg` is updated for 0.4.1 (Neural Void sublabel + corrected tagline). A raster 1200×630 PNG is still a deferred human-art task — many social scrapers prefer PNG/JPG over SVG.
- **No deployed branded domain wired into production yet.** The app text and share-card footer reference `neural-void.com/foldwink` but the actual deployment is separate.

## Post-MVP candidates

See `docs/POST_MVP_ROADMAP.md` for the prioritized list of deferred features.
