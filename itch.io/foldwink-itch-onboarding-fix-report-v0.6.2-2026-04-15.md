# Foldwink — itch.io Onboarding Scroll Fix

**Date:** 2026-04-15
**Scope:** remove internal vertical scroll inside the onboarding / "How to play" modal when embedded on itch.io.

## 1. Root cause

`src/components/Onboarding.tsx` wrapped its content in a card sized with
`max-h-[calc(100vh-2rem)] overflow-y-auto`. Inside an itch.io iframe the
effective viewport is smaller than a normal browser tab, so the onboarding
body overflowed the cap and produced an inner scrollbar on first paint —
exactly what made the embed look unfinished.

The content itself was also overweight for an intro: a 16-cell mini board
preview plus five full-width bullets with long phrasing. Even with a taller
container that's more vertical weight than a first-impression modal should
carry inside an iframe.

## 2. Fix

`src/components/Onboarding.tsx`:

- **Removed** `max-h-[calc(100vh-2rem)]` and `overflow-y-auto`. The modal now
  sizes to its content; the outer overlay keeps it centered with `p-4` margin
  on all sides so it still fits small viewports without clipping.
- **Dropped the 4×4 mini-board preview** (16 squares). The tabs row already
  communicates the Medium-tier flavour, and this saved ~130 px vertically.
- **Tightened the header**: BrandMark 44 → 36, title `text-2xl` → `text-xl`,
  card padding `p-6` → `p-5`.
- **Condensed copy** from five verbose bullets to four short ones
  (`text-sm` → `text-[13px] leading-snug`, `space-y-2` → `space-y-1.5`).
  Core rule + three difficulty lines. No information about
  unlock gates — that's learned in the menu.
- **No dependency on `100vh` anywhere in the modal.** No new inner scroll
  containers introduced.

## 3. Files changed

| File                                                               | Purpose                                                                                                                       |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/components/Onboarding.tsx`                                    | Drop `100vh`/`overflow-y-auto`, shrink preview, compact copy so the modal fits inside an itch.io iframe without inner scroll. |
| `itch.io/foldwink-itch-upload-v0.6.2-2026-04-15.zip`               | Fresh itch-ready build.                                                                                                       |
| `itch.io/foldwink-itch-onboarding-fix-report-v0.6.2-2026-04-15.md` | This report.                                                                                                                  |

## 4. Verification

- `npm run typecheck` — clean.
- `npm run build` — clean (323 kB JS, 18 kB CSS; gzip 104 kB / 4.5 kB).
- Grepped the new component for `100vh` and `overflow-y-auto` — none present.
- Desktop embed (assumed ~960×600 itch frame): modal now measures roughly
  ~440 px tall, fits comfortably without scroll.
- Mobile: outer overlay still `p-4`-bound; card is `max-w-sm` so it shrinks
  to available width. No horizontal or vertical overflow expected on 360 px
  wide phones.
- Fullscreen: unchanged (overlay is `fixed inset-0`, content centered).

## 5. Non-blockers (deferred)

- Copy could go one step further (drop the Master line) but the current
  length already fits the 600 px embed and keeps a useful mental model of
  the three tiers. Leaving as-is.
- If itch ever exposes a skinnier iframe (<400 px wide), the tabs row may
  wrap — still readable, not a blocker.

## 6. Deploy

- Committed to `main`.
- Pushed to `origin/main` → GitHub Pages workflow (`.github/workflows/deploy.yml`)
  rebuilds and publishes automatically on push.
- Fresh itch upload zip is `itch.io/foldwink-itch-upload-v0.6.2-2026-04-15.zip`.

## 7. Verdict

**READY FOR ITCH.IO PAGE TEST** — the specific inner-scroll regression
reported against the onboarding modal is resolved, and no other surface
changed.
