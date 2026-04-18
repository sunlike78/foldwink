# Foldwink — Itch.io First-Impression Hardening Report

**Date:** 2026-04-15
**Version:** 0.6.1 (post-hardening)

## 1. Executive summary

**Verdict: READY FOR ITCH.IO PAGE TEST.**

The embed-layout and first-impression issues on the itch.io page have
been resolved with targeted, non-gameplay-affecting changes. At the
typical itch HTML embed sizes (960×720 and 1280×720), the menu now
fits without an inner scrollbar. The first visible frame communicates
the product in one line and offers an immediate primary CTA ("Play
today's puzzle"). Gameplay, tests, and bundle size are unchanged.

### What was wrong

- Menu content overflowed the ~720 px tall itch iframe → a pointless
  inner scrollbar appeared on desktop embed.
- The opening state was text-heavy: a 3-line subtitle, duplicate
  motivation copy ("Current streak 7 · best 12"), dev-facing counter
  ("200 curated puzzles in this build · target library 500"), and a
  stacked footer with sound/haptics/about each on its own line.
- Too much vertical gap between every menu section (`gap-8` + `pt-10`)
  wasted embed height.

### What was fixed

- Tightened menu vertical rhythm (`gap-4`, `pt-1 sm:pt-3`, main
  `py-4 sm:py-6`).
- One-line, punchy subtitle: _"Find 4 hidden groups of 4 in a 4×4
  grid — 2–5 minutes."_
- Wordmark sublabel ("by Neural Void") hidden in the menu first-paint
  (still visible in the About footer, and the brand mark carries the
  identity on its own).
- Removed the duplicate streak line from the menu (the same info lives
  on the Stats screen and in the post-result pulse).
- Collapsed the footer into a single horizontal strip: toggles · About
  · puzzle count.
- Added `overflow-x: hidden` and `overscroll-behavior: contain` on
  `body` to eliminate accidental 1-px horizontal scroll and iframe
  rubber-banding.

### Is the first impression materially better

Yes. On a 960×720 itch embed the menu now renders without a scrollbar
and the primary CTA is visible above the fold. The Stats button,
Master Challenge, toggles, and brand are all on one screen. Player
knows in < 1 s that this is a 2–5 minute daily puzzle, and can tap
"Play today's puzzle" without scrolling.

## 2. Root cause

`html, body, #root { height: 100% }` + `min-h-full` on the App root
means the scroll container is exactly the iframe viewport height. Any
menu content that exceeded ~720 px forced the browser to render an
inner scrollbar on the document, which inside an itch iframe reads as
"the game has its own internal scroll" — the defining symptom the user
flagged.

Before the fix, the menu stack rendered at ~760–790 px:

| Slice                                      | Approx height |
| ------------------------------------------ | ------------- |
| `py-10` top + `pt-10` menu padding         | ~80 px        |
| Wordmark `lg` + sublabel + 3-line subtitle | ~220 px       |
| `gap-8` between each major block (×4)      | ~128 px       |
| 5 button stack                             | ~268 px       |
| Readiness caption block (2 lines)          | ~36 px        |
| Duplicate streak line                      | ~20 px        |
| Stacked footer (pool + toggles + about)    | ~90 px        |
| **Total**                                  | **~840 px**   |

After the fix, ~670–690 px: fits every standard embed size.

## 3. First-impression changes

### Layout

- `App.tsx` — main padding `py-6 sm:py-10` → `py-4 sm:py-6`.
- `MenuScreen.tsx` — outer spacing `gap-8 pt-6 sm:pt-10` → `gap-4 pt-1
sm:pt-3`.

### Onboarding / help visibility

- Subtitle trimmed from 108 characters to 60 characters (1 line).
- Wordmark `showSublabel` set to `false` on menu (-28 px).
- Duplicate "Current streak · best" row removed (info already on Stats
  screen, and the streak pulse on result already celebrates gains).

### Sizing / density

- Menu footer collapsed from three stacked rows (pool copy · toggles ·
  About) into a single horizontal strip:
  `Sound off · Haptics on · About · Privacy · 200 puzzles`.
- Dev-facing "target library 500" removed from first-paint (still in
  the About footer long-copy when a player opens it).

### Desktop embed

- Menu now renders top-aligned in a 720-px iframe with no inner scroll
  and visible negative space below the final section — no cramped
  feeling, no scrollbar.

### Mobile

- Same tightening applies. On real phone viewports (≥ 800 px tall) the
  menu fits comfortably. On a pessimistic 390×660 test case the menu
  is still ~15 px over — acceptable since real iOS Safari renders at
  844+ and itch mobile embed uses fullscreen by default.

## 4. Files changed

| File                         | Purpose                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/App.tsx`            | Reduced `main` vertical padding for denser layout in small iframes                                                                                                     |
| `src/screens/MenuScreen.tsx` | Tightened outer spacing, shorter subtitle, hid sublabel on menu, removed dev-copy pool line, removed duplicate streak line, collapsed footer into one horizontal strip |
| `src/styles/index.css`       | Added `overflow-x: hidden` and `overscroll-behavior: contain` on body to prevent iframe rubber-banding and accidental horizontal scroll                                |
| `src/stats/persistence.ts`   | Committed the `clearAllLocalData` function that was left unstaged in the previous record-fix commit (unblocked CI typecheck)                                           |
| `scripts/human-like-qa.mjs`  | One-line lint fix — prefixed unused `statsBtn` with underscore (pre-existing CI lint failure, unrelated to gameplay)                                                   |

## Deploy

Pushed to `main` in three targeted commits after the local embed edits:

- `463ed95` — embed/menu tightening (src/app/App.tsx, MenuScreen.tsx, index.css)
- `4d3a334` — ship the missing `clearAllLocalData` that had been orphaned
  from the earlier record-fix commit (fixes CI typecheck)
- `7711cb9` — trivial lint fix in a QA script (fixes CI lint)

The `.github/workflows/deploy.yml` pipeline auto-deploys `main` → GitHub
Pages. The deploy run on `4d3a334` completed **success**, so the
neural-void.com site now serves the full post-fix build (record fix +
embed fix) with the same bundle as the itch upload zip.

## 5. Verification

Measured with Playwright at real embed sizes using
`scripts/capture-embed-verify.mjs`:

| Viewport                     | docHeight | Inner scroll | Notes                                |
| ---------------------------- | --------- | ------------ | ------------------------------------ |
| 960 × 720 (itch default)     | 720       | **No**       | fits exactly                         |
| 1280 × 720 (itch wider)      | 720       | **No**       | fits exactly                         |
| 1440 × 900 (fullscreen)      | 900       | **No**       | plenty of headroom                   |
| 390 × 660 (mobile iframe)    | 675       | ~15 px over  | non-blocking, real phones are taller |
| 360 × 640 (smallest mobile)  | 675       | ~35 px over  | edge case; itch fullscreen resolves  |
| 390 × 660 + fresh onboarding | 660       | **No**       | overlay scrolls internally if needed |

### Gameplay / tests / build

- **Unit tests:** 119/119 pass (unchanged behavior).
- **Production build:** `npm run build` → 1.38 s; 325 kB raw / 104 kB
  gzip (within ±0.04 kB of pre-fix build).
- **Visual regression on captured screenshots:** all 12 pack images
  re-captured successfully; `01-desktop-menu.png` now renders the
  tighter, cleaner menu.

### Fullscreen

- itch fullscreen switches the iframe to `100vh` of the real
  viewport. Menu still fits; gameplay unchanged.

### Inner scroll

- Gone at all standard desktop embed heights (720, 900).

## 6. Remaining non-blockers

- Mobile iframe shorter than ~675 px still scrolls by ~15 px. Real
  mobile phones and itch fullscreen are taller than 700 px — the
  pessimistic 640/660 test cases are non-representative.
- OG image is still SVG (raster 1200×630 remains a nice-to-have).
- Audio palette still synthesised (no human listening pass yet).

## 7. Final verdict

## READY FOR ITCH.IO PAGE TEST

The embed layout is clean, the first frame reads as a polished
product, and the retry/CTA flow is one-click. Nothing in gameplay
changed. Pre-commit test and build gates are green.
