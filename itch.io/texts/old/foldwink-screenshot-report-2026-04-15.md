# Foldwink — Itch.io Screenshot Pack Report

**Date:** 2026-04-15
**Output root:** `itch.io/screenshots/`
**Contact sheet:** `itch.io/foldwink-screenshot-contact-sheet-2026-04-15.png`

## How the screenshots were produced

1. Fresh production build: `npm run build` → `dist/`.
2. Static preview server: `npx vite preview --port 4174 --strictPort` on
   `http://localhost:4174/`.
3. Playwright (chromium, headless, `deviceScaleFactor: 2`) drove the app
   through real UI flows — no mocks or faked frames.
4. Each scene used a clean context with seeded `localStorage` so the
   captures reflect a realistic mid-game progress state:
   - `foldwink:stats` — 22 wins / 6 losses, **current streak 7 · best 12**,
     realistic wink / flawless / medium counters.
   - `foldwink:onboarded` — `true` (no tutorial overlay).
   - `foldwink:sound` — muted (no audio gate prompt).
   - `foldwink:active-session` — cleared (every capture starts on the menu).
5. Script: `scripts/capture-itch-screenshots.mjs`.

## Viewports

| Flavor  | Viewport   | Scale | Notes                                              |
| ------- | ---------- | ----- | -------------------------------------------------- |
| Desktop | 1440 × 900 | 2×    | Standard laptop-class page                         |
| Mobile  | 390 × 844  | 2×    | iPhone-class portrait, with `hasTouch`, `isMobile` |

## Shot list (`itch.io/screenshots/`)

| #   | File                             | State                                                                 | Viewport | Use                    |
| --- | -------------------------------- | --------------------------------------------------------------------- | -------- | ---------------------- |
| 01  | `01-desktop-menu.png`            | Menu with seeded Best 12 record                                       | 1440×900 | **Hero candidate**     |
| 02  | `02-desktop-easy-selecting.png`  | Easy puzzle, 3 cards picked                                           | 1440×900 | Core loop              |
| 03  | `03-desktop-easy-one-solved.png` | Easy puzzle, planets group solved                                     | 1440×900 | Mid-session            |
| 04  | `04-desktop-medium-tabs.png`     | Medium, Foldwink Tabs at hint stage                                   | 1440×900 | **Mechanic USP**       |
| 05  | `05-desktop-medium-winked.png`   | Medium, one tab winked (BALL revealed)                                | 1440×900 | **Mechanic payoff**    |
| 06  | `06-desktop-stats.png`           | Stats screen, Best 12, streak 7                                       | 1440×900 | Retention surface      |
| 07  | `07-mobile-menu.png`             | Portrait menu                                                         | 390×844  | Platform coverage      |
| 08  | `08-mobile-easy-selecting.png`   | Portrait easy puzzle, selecting                                       | 390×844  | Platform coverage      |
| 09  | `09-mobile-medium-winked.png`    | Portrait medium with wink                                             | 390×844  | Platform + mechanic    |
| 10  | `10-desktop-hard-game.png`       | Hard (Master Challenge) puzzle "Four ways to break", longer hint dots | 1440×900 | **Difficulty ceiling** |
| 11  | `11-desktop-hard-selecting.png`  | Hard puzzle, 2 cards picked                                           | 1440×900 | Hard loop detail       |
| 12  | `12-mobile-hard-game.png`        | Portrait hard puzzle                                                  | 390×844  | Hard on mobile         |

## Recommended pick for the itch.io page (5–6 shots)

Itch allows up to 5 screenshots in the gallery and one cover. Pick in this
order for best shelf appeal:

1. **`05-desktop-medium-winked.png`** — the hero. Communicates the
   Foldwink Tabs + Wink mechanic at a glance (letter hints + one revealed
   category in accent blue). Best thumbnail at any size.
2. **`01-desktop-menu.png`** — brand landing, wordmark + seeded streak,
   immediately says "this is a puzzle with real stakes".
3. **`03-desktop-easy-one-solved.png`** — proof the game has satisfying
   feedback: the solved group is locked in coloured tint.
4. **`06-desktop-stats.png`** — shows the performance metric (Best 12).
   Players value this on a daily puzzle.
5. **`09-mobile-medium-winked.png`** — mobile platform shot, reuses the
   strongest mechanic image.

Optional sixth: **`10-desktop-hard-game.png`** if the listing needs to
signal depth — the "HARD · standard" chip plus longer hint dots
(`F······`, `C·····`) telegraph difficulty without overwhelming the
player scanning the page.

### Strongest "hero" (for itch.io cover or social)

**`05-desktop-medium-winked.png`** — alone communicates:

- what the game is (grouping puzzle with a 4×4 grid),
- the distinctive mechanic (category tabs with progressive letter reveal),
- the interactive twist (one Wink used, "BALL" visible in accent colour),
- the clean minimalist aesthetic.

## Contact sheet

A single overview image at
`itch.io/foldwink-screenshot-contact-sheet-2026-04-15.png`
(1764 × 1294 px) groups 8 desktop frames in a 4×2 grid above a 4-wide
mobile row. All three difficulty tiers (easy / medium / hard) are
represented on both viewports. Useful for a README, handoff email, or
pitch deck — not for upload to itch.io.

## Packaging

All artifacts bundled in:
`itch.io/foldwink-screenshot-pack-2026-04-15.zip`

Contents:

- 9 × PNG screenshots
- contact-sheet PNG
- this report

## Known limitations

- Result screen with `· new best` celebration is not captured. Reaching
  it deterministically through the UI requires solving all four groups of
  a medium puzzle, and the "new best" threshold is `bestStreak ≥ 3`. The
  Stats screenshot (#06) already shows `Best 12`, which covers the same
  selling point without risking a blurry post-confetti frame. Skipped on
  purpose to keep the pack clean.
- All captures are from a seeded-but-honest state. No compositing, no
  mockups, no pixel retouching.
