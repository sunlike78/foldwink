# Foldwink — Itch.io Handoff Index

**Date:** 2026-04-15
**Package:** `foldwink-itch-handoff-package-2026-04-15.zip`
**Everything lives under:** `itch.io/` at the project root.

This index is the single entry point for the itch.io launch. Follow the
recommended order below — every step points at a real artifact that has
already been produced, so a human operator can complete the launch in
under an hour without needing engineering help.

---

## Recommended order of use

### 1. Upload the build

| Artifact                                           | Purpose                                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `foldwink-itch-upload-2026-04-15.zip`              | Production HTML build; `index.html` at archive root, ready to upload as an itch HTML project |
| `foldwink-itch-upload-guide.md`                    | Step-by-step: itch project type, viewport, mobile flag, fullscreen button, draft flow        |
| `foldwink-itch-build-report-2026-04-15.md`         | What's in the build, size, embed-readiness checks, soft warnings                             |
| `foldwink-final-itch-release-report-2026-04-15.md` | Full release-gate verdict (READY); record-system sign-off                                    |

### 2. Choose screenshots

| Artifact                                           | Purpose                                                                          |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| `screenshots/` (12 PNG)                            | Real captures at desktop 1440×900 and mobile 390×844, all three difficulty tiers |
| `foldwink-screenshot-pack-2026-04-15.zip`          | Self-contained screenshot bundle with report + contact sheet                     |
| `foldwink-screenshot-report-2026-04-15.md`         | Recommended picks for the itch gallery; names the strongest hero                 |
| `foldwink-screenshot-contact-sheet-2026-04-15.png` | One-glance overview of all 12 shots                                              |

**Recommended 5 for the itch gallery** (from the screenshot report):

1. `screenshots/05-desktop-medium-winked.png` — hero
2. `screenshots/01-desktop-menu.png`
3. `screenshots/03-desktop-easy-one-solved.png`
4. `screenshots/06-desktop-stats.png`
5. `screenshots/09-mobile-medium-winked.png`
6. _(optional 6th)_ `screenshots/10-desktop-hard-game.png` — difficulty ceiling

### 3. Paste page copy

| Artifact                     | Purpose                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `foldwink-itch-page-copy.md` | Title, tagline, short description (search), long description, genre/tags, classification — all ready-to-paste text blocks |

### 4. Generate cover art

| Artifact                               | Purpose                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foldwink-art-brief-2026-04-15.md`     | Visual positioning, palette tokens, shape DNA, clichés to avoid, thumbnail safety rules                                                                                                                 |
| `foldwink-cover-prompts-2026-04-15.md` | Prompt packs for Gemini / Imagen / MJ / SDXL — cover (630×500), square (1200×1200), wide banner, story poster, screenshot overlays. Each with primary + restrained + punchy variants and negative lists |
| `foldwink-art-pack-2026-04-15.zip`     | Self-contained art bundle (brief + prompts + mockups)                                                                                                                                                   |
| `mockups/`                             | 3 non-AI reference compositions rendered from real screenshots: itch cover, hero banner, social square                                                                                                  |
| `foldwink-cover-generator.html`        | Local HTML cover generator (open in browser to produce a quick in-palette cover without external tools)                                                                                                 |

**Recommended primary direction:** the 4×4 grid with one Foldwink Tab
winked open (variant **1A** in the prompt pack). It's the one-frame
elevator pitch for the product.

### 5. Publish / check the page

| Artifact                                           | Purpose                                                                                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `foldwink-itch-release-qa-checklist-2026-04-15.md` | Tick-through QA list: pre-upload, project setup, desktop browser, mobile browser, iframe embed, console sanity, record sanity. Stop and file a bug if any line fails |

Flip the itch project from draft to public only after this checklist is
all green.

---

## Included artifacts

All paths are relative to the `itch.io/` root inside the handoff ZIP.

### Build

- `foldwink-itch-upload-2026-04-15.zip` — **the build** (111 KB, index.html at root)
- `foldwink-itch-build-report-2026-04-15.md`
- `foldwink-itch-build-package-2026-04-15.zip` — earlier build+report bundle (kept for compatibility)

### Release gate

- `foldwink-final-itch-release-report-2026-04-15.md`
- `foldwink-itch-release-qa-checklist-2026-04-15.md`

### Screenshots

- `screenshots/01-desktop-menu.png` … `12-mobile-hard-game.png` (12 PNG)
- `foldwink-screenshot-report-2026-04-15.md`
- `foldwink-screenshot-contact-sheet-2026-04-15.png`
- `foldwink-screenshot-pack-2026-04-15.zip`

### Page copy & operator docs

- `foldwink-itch-page-copy.md` — title, taglines, long description, tags
- `foldwink-itch-upload-guide.md` — upload walkthrough
- `foldwink-cover-generator.html` — local cover mock renderer

### Art / marketing

- `foldwink-art-brief-2026-04-15.md`
- `foldwink-cover-prompts-2026-04-15.md`
- `mockups/mockup-itch-cover-630x500.png`
- `mockups/mockup-hero-banner-1920x1080.png`
- `mockups/mockup-social-square-1200x1200.png`
- `foldwink-art-pack-2026-04-15.zip`

### This index

- `foldwink-itch-handoff-index-2026-04-15.md`

---

## Expected pieces — status

| Expected artifact         | Present | Notes                                                                                                                   |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| Browser upload ZIP        | ✅      | `foldwink-itch-upload-2026-04-15.zip`                                                                                   |
| Build report              | ✅      | `foldwink-itch-build-report-2026-04-15.md`                                                                              |
| Screenshot pack           | ✅      | 12 PNG + contact sheet + report + self-contained zip                                                                    |
| Screenshot report         | ✅      | `foldwink-screenshot-report-2026-04-15.md`                                                                              |
| Page copy markdown        | ✅      | `foldwink-itch-page-copy.md` (copied from `docs/ITCH_PAGE_COPY.md`)                                                     |
| HTML preview page         | ✅      | `foldwink-cover-generator.html` (copied from `scripts/generate-cover.html`) — local cover renderer; open in any browser |
| Art brief                 | ✅      | `foldwink-art-brief-2026-04-15.md`                                                                                      |
| Cover prompt pack         | ✅      | `foldwink-cover-prompts-2026-04-15.md`                                                                                  |
| Final release-gate report | ✅      | `foldwink-final-itch-release-report-2026-04-15.md`                                                                      |

**Nothing material is missing.** Two nice-to-haves explicitly deferred:

- Raster 1200×630 PNG for `og:image` (SVG currently; weak for social
  link previews, irrelevant for itch's own OG).
- Human audio QA pass on the 9 synthesised sound cues.

Both are documented in the final release report's "Remaining
non-blockers" section.

---

## One-line operator summary

Upload the zip → paste the page copy → gallery the 5 recommended
screenshots → pick one art prompt and generate → run the QA checklist →
flip to public.
