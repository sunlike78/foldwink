# Deploy

Foldwink is a fully static web app. `npm run build` produces a `dist/` folder that can be hosted on any static web host.

## Build

```bash
npm install
npm run build
```

Output is written to `dist/`. The build is configured with `base: "./"` so it works both at a root path and in a sub-directory of a static host.

## Quick local preview

```bash
npm run preview
```

## Platform recipes

### Cloudflare Pages

1. Connect the repo to Cloudflare Pages.
2. Framework preset: `Vite`.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Deploy.

### Netlify

1. New site → Import from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. No environment variables needed.

### GitHub Pages

Works with the repo's `dist/` via any Pages action that publishes a folder. Because `base: "./"` is set in `vite.config.ts`, the build runs fine from a sub-path.

### Any bucket / CDN

Upload the contents of `dist/` as-is. Make sure the host serves `index.html` for the root path. Assets are fingerprinted and can be cached indefinitely.

## Content updates without a code change

The puzzle pool is baked into the bundle at build time via `import.meta.glob`. To ship a new puzzle:

1. Add or edit a JSON file in `puzzles/pool/`.
2. `npm run validate`
3. `npm test`
4. `npm run build`
5. Re-deploy `dist/`.

## Release checklist

- [ ] `npm run validate` passes
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] README setup / dev / build instructions verified
- [ ] `docs/RELEASE_NOTES.md` updated with the new version
- [ ] `docs/KNOWN_LIMITATIONS.md` reviewed
- [ ] Deploy `dist/`
- [ ] Smoke-test the deployed URL on a phone (daily + standard + stats)
