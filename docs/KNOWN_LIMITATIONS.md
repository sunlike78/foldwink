# Known Limitations

Foldwink MVP is intentionally scoped small. These are known gaps documented so the next iteration has a clear starting point.

## Gameplay

- **No in-game timer.** The result screen shows elapsed time, but the game screen does not tick a live timer. Kept out to reduce visual noise.
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

- **Current library: 98 curated puzzles (65 easy + 33 medium).** Comfortable for ~2 months of committed daily + standard play at 1 daily + 1 standard per day. Every medium carries Foldwink Tabs (`revealHint` on all 4 groups) and supports the Wink action.
- **Target library: 500 curated puzzles.** This number does not exist yet and must never be claimed as current anywhere in live docs, UI, or metadata. The disciplined batch pipeline to reach it is documented in `docs/content/BATCH_WORKFLOW.md` — batches of 25, rejection quota ≥ 30%, diversity score guardrails, explicit stop condition at 200 if discipline cannot be held.
- **Near-term content goal:** validate the disciplined pipeline and grow the library in reviewed batches toward 150 → 200 → 500. 98 → 150 is the first milestone.
- **One Wink per medium puzzle.** The player can tap a Foldwink Tab once per game to fully reveal its category. No second wink. Easy puzzles have no Wink affordance — by design, not a gap. A mid-game refresh loses the wink state with the rest of the active game.
- **Hard / Master Challenge: scaffolded, 0 real puzzles (0.4.3).** The full engine support, store actions, readiness logic, and MenuScreen button exist and are tested. The Hard pool (`HARD_POOL`) is empty. When content arrives, Tabs reveal at half-speed and Wink is disabled. See `docs/PROGRESSION_RULES.md` for the product spec and progression model.
- **English only.** No localization.
- **Editorial notes are sparse on easy puzzles.** Medium puzzles carry `editorialSummary` hints for the false trails; easy puzzles mostly do not.

## Persistence

- **No mid-game save.** Refreshing or closing the tab mid-game loses the current attempt.
- **No cross-device sync.** All stats live in `localStorage` of the current browser.
- **Clearing site data wipes stats.** Expected.
- **No export/import of stats.**

## UX and accessibility

- **Keyboard navigation is default tab order only.** No custom arrow-key grid navigation.
- **Color is not the only signal** (solved groups also move visually to the lock state), but the four solved palette colors are not color-blind validated.
- **Screen reader experience is basic.** Cards announce text + `aria-pressed`; mistakes have an `aria-label`. No live region for game state changes.
- **Long item names** (≥18 chars) may wrap tightly on the smallest phones. The current pool is safe (longest word is "Stracciatella" at 13 chars).

## Build / tooling

- **No lint tool.** Kept out to reduce dependencies. TypeScript strict mode is the primary safety net.
- **No CI.** Validation and tests are manual steps before a release.
- **No component tests.** Only pure-logic unit tests are in Vitest.
- **No bundle analyser.** Production JS is 175 kB / 58 kB gzip — comfortable.

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
