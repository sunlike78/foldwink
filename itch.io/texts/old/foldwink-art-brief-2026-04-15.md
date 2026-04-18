# Foldwink — Art Brief

**Date:** 2026-04-15
**Purpose:** direction for cover / banner / thumbnail visuals for itch.io,
neural-void.com, and social posts.

## Visual positioning

Foldwink is a **minimalist daily grouping puzzle for thinking adults**.
Its visuals should feel like a calm, confident reading app — not a
candy-colored casual game. The product wears its design sense on its
sleeve, so the marketing art has to keep up.

Anchor words: **quiet, tactile, precise, dark-mode native, literate,
Sunday-morning-with-coffee.**

### What the cover must say in one second

1. **This is a grouping / categorization puzzle.** The 4×4 grid of
   rounded tiles is the single most recognizable silhouette.
2. **There is a twist.** The Foldwink Tabs + Wink mechanic — category
   pills with partially revealed letters (e.g. `F··`, `P··`, `H····`)
   and one pill "winked" fully open in accent blue — is the one-frame
   elevator pitch.
3. **It is calm and clean.** Dark canvas, generous space, high-contrast
   typography. Nothing is shouting.

## Visual DNA (drawn from the real build)

### Palette

| Role         | Hex       | Use                                      |
| ------------ | --------- | ---------------------------------------- |
| Canvas       | `#0f1115` | Almost-black background, primary surface |
| Surface      | `#1a1e26` | Tile / card body                         |
| Surface high | `#232832` | Pressed / selected tile                  |
| Text         | `#e9edf2` | Primary foreground                       |
| Muted        | `#8b93a3` | Secondary labels                         |
| Accent       | `#7cc4ff` | Wink, "new best", primary CTA            |
| Solved 1     | `#f5c86b` | Yellow-amber group                       |
| Solved 2     | `#8cd28e` | Sage green group                         |
| Solved 3     | `#ef9e9e` | Coral-pink group                         |
| Solved 4     | `#b49cf0` | Lavender-violet group                    |

All four solved colors are **desaturated pastels**, not primaries. This is
deliberate — they read "thoughtful" not "arcade".

### Shapes

- **Rounded squares** (`rx ≈ 12–16px`) are the hero shape. Every tile,
  every pill, the app icon, and the wink button all share this curve.
- **4×4 grid** is the one visual motif every player recognizes.
- **Dots** for the mistake meter (top-right), one-character hints on
  tabs, and small glyphs — echo the square grid on a smaller scale.
- **Sparkle / 4-point star** for the Wink affordance — the only
  non-geometric glyph. Use sparingly; it's precious.

### Typography

- Bold geometric sans-serif for the wordmark "Foldwink".
- Regular sans (system stack: SF Pro, Segoe, Roboto) for supporting copy.
- `tracking-[0.18em]` spacing on pill labels — the letter-spacing is part
  of the game's _look_. Reuse it in marketing art.
- Uppercase micro-labels at `tracking-[0.14em]` (e.g. `GRADE`, `FOLDWINK
TABS`).

### UI rhythm

- **Dense center, empty edges.** Game content sits in a `max-w-md`
  column. The visual silence around it is a feature, not unused space.
  Cover art should respect this — don't fill every pixel.

## Direction: **UI-led, not abstract-led**

The stronger direction is to lean into the real UI, not invent an abstract
pattern. The 4×4 grid + winked pill is already an iconic silhouette — more
recognizable than any abstract fold/wink metaphor we could paint.

**Recommended primary visual:** the menu / game grid composition with the
winked tab ("BALL" in accent blue, siblings concealed) framed as the
hero, Foldwink wordmark above or beside, wide safe margin around.

## Clichés to avoid

- **Saturated neon gradients.** Kills the calm tone.
- **Floating 3D / isometric blocks.** We are a flat, 2D product; do not
  imply a fake-depth engine.
- **Generic "brain puzzle" stock imagery** — no lightbulb icons, no
  jigsaw pieces, no crossword grids, no Sudoku.
- **Pixel-art treatments.** Not our register.
- **Cartoon mascots or characters.** Foldwink is an impersonal surface.
- **Confetti / celebration particle overlays.** The product's own streak
  pulse is restrained — the cover should match.
- **Over-styled photorealistic renders** (rim light, subsurface
  scattering, bokeh). Reads as casual-mobile AI slop.
- **Text-over-text chaos.** The game itself has a lot of words; the
  cover should have almost none.

## Typography guidance (safe)

- Wordmark `Foldwink` at ~8–10% of the cover height; always on dark.
- One single supporting tagline max, at ~25% of the wordmark size:
  _Daily grouping puzzle_ · _Find 4 hidden groups of 4_ · _Wink once,
  solve cleaner_.
- Do not put gameplay rules on the cover. The UI shot does that job.

## Thumbnail & crop guidance

### Itch.io cover (630×500)

- The winked tab + part of the grid must survive a 300×240 thumbnail.
- Wordmark top-left or top-center, grid dominates bottom 2/3.
- Never crop tighter than a 6×4 tile cluster — a full 4×4 must be
  visible, with 1 tile of breathing room on each side.

### Square social (1200×1200)

- Tighter crop of the grid; wordmark smaller, centered above.
- The winked "BALL" tab should be the first thing the eye lands on.

### Wide banner (2560×1440 / 1920×1080)

- Asymmetric composition: grid pushed right, wordmark + tagline on left
  at 40/60 split.
- Ample `#0f1115` negative space is not a bug.

### Mobile storefront (displayed ≤ 200px wide)

- The wordmark must be readable at 200px. Anything below that — cut.
- Do not rely on secondary copy at mobile size.

## Asset checklist

| Slot              | Size                        | Purpose                                     |
| ----------------- | --------------------------- | ------------------------------------------- |
| Itch cover        | 630×500 PNG                 | Main listing tile                           |
| Itch screenshot 1 | from `itch.io/screenshots/` | Use `05-desktop-medium-winked.png` as first |
| Social / OG       | 1200×630 PNG                | `og.svg` raster equivalent                  |
| Square thumbnail  | 1200×1200 PNG               | Social posts                                |
| Wide hero         | 2560×1440 PNG               | Press kit / site                            |
| Optional poster   | 1080×1920 PNG               | Story-format share                          |

## Reference frames

- `itch.io/screenshots/05-desktop-medium-winked.png` — mechanic payoff
- `itch.io/screenshots/01-desktop-menu.png` — brand landing
- `public/favicon.svg` — four colored tiles + sparkle, the atomic form
  of the identity
