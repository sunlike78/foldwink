# Foldwink — Itch.io Build Report

**Date:** 2026-04-15
**Version built:** 0.6.1

## Detected stack

- React 18.3.1 + TypeScript 5.6.3 + Vite 5.4.10
- Tailwind 3.4.14, Zustand 4.5.5
- Vitest 2.1.4 (unit), Playwright 1.59.1 (e2e)
- Static-exportable: **yes**, all data bundled (no runtime backend)

## Build command

```
npm run build   # → tsc --noEmit && vite build
```

Cold build: **1.22 s**. Output size: 325 kB raw / 104 kB gzip JS + 18 kB CSS.

## Output folder

`dist/` — contains:

| File                        | Purpose                | Size    |
| --------------------------- | ---------------------- | ------- |
| `index.html`                | Entry                  | 1.87 kB |
| `favicon.svg`               | Scalable favicon       | 588 B   |
| `manifest.webmanifest`      | PWA manifest           | 643 B   |
| `og.svg`                    | Open Graph image (SVG) | 1.77 kB |
| `assets/index-DmNyPaDG.js`  | App bundle             | 325 kB  |
| `assets/index-wnvNOYhf.css` | Styles                 | 18.5 kB |

## Itch.io readiness checks

| Check                                       | Result                                                       |
| ------------------------------------------- | ------------------------------------------------------------ |
| Static-only build (no backend)              | ✅                                                           |
| `index.html` at upload root                 | ✅ (zip has it at root)                                      |
| Relative asset paths in `index.html`        | ✅ `./favicon.svg`, `./manifest.webmanifest`, `./assets/...` |
| `vite.config.ts` `base: "./"`               | ✅                                                           |
| Hash-based asset names (cache-safe)         | ✅                                                           |
| No `console.log` in prod bundle             | ✅ ESLint rule + grep clean                                  |
| No dev overlay / HMR artifacts              | ✅                                                           |
| No `window.parent` / fullscreen coupling    | ✅                                                           |
| `navigator.share` guarded                   | ✅ in `ShareButton.tsx`                                      |
| localStorage used inside same-origin iframe | ✅ standard behaviour                                        |
| Bundle size well under itch 1 GB limit      | ✅ 111 kB zipped                                             |

### Soft warnings (non-blocking)

- `og:image` references `/og.svg` and `og:url` references
  `https://neural-void.com/foldwink`. These affect only external
  link-preview scrapers of the iframe's source URL — itch.io generates
  its own OG tags for the game page, so user-shared itch links are
  unaffected. No action needed for a test release.

## Fixes applied in this task

**None.** The existing Vite config already produces an itch-compatible
build. The production-correctness fix to the personal-record system from
earlier in this session is already on disk and is reflected in this build.

## Archive

**Upload-ready archive:** `itch.io/foldwink-itch-upload-2026-04-15.zip`
(111 KB, 6 entries, `index.html` at root).

**How to upload to itch.io:**

1. itch project → Edit game → Kind: HTML → Upload this zip.
2. Tick **This file will be played in the browser**.
3. Set viewport: `960 × 720` or full-screen; enable **Mobile friendly** and
   (optionally) **Fullscreen button**.
4. Save as draft, preview, run the QA checklist in
   `reports/foldwink-itch-release-qa-checklist-2026-04-15.md`, then
   publish.

## GitHub / auto-deploy path

Repo: `https://github.com/sunlike78/foldwink.git`

An auto-deploy pipeline is already configured:

- `.github/workflows/deploy.yml` — on push to `main`, builds and
  publishes `dist/` to **GitHub Pages**. No change required.
- `.github/workflows/ci.yml` — typecheck + tests on push / PR.

**This task required no code changes,** so no GitHub push was performed
by this task. The working tree does contain unrelated uncommitted work
from prior sessions (including the earlier-fixed false "new best" bug).
That is outside this task's scope and is left for the user to commit
intentionally — pushing to `main` auto-deploys to GitHub Pages, which is a
visible shared-state action and was not explicitly requested in this
task.

### Recommended handoff (user decision)

If the Neural Void site should reflect the current working build, stage
and commit the itch-relevant parts and push:

```
git add src/game/state/store.ts src/screens/ResultScreen.tsx \
        src/game/state/__tests__/store.test.ts \
        src/stats/__tests__/persistence.test.ts
git commit -m "fix(record): strict newBest flag to suppress tie false-positive"
git push origin main
```

This triggers the existing Pages workflow and deploys the same bundle
that is packaged in the itch upload zip.

## Remaining risks

- Real itch.io in-iframe play test has not been executed (only static
  smoke tests locally).
- OG preview looks plain for people sharing the iframe's source URL
  directly — irrelevant for normal itch.io shares.

## Verdict

**READY FOR ITCH.IO UPLOAD.** Archive at
`itch.io/foldwink-itch-upload-2026-04-15.zip` can be uploaded as-is.
