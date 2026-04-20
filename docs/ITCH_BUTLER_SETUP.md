# Foldwink — itch.io releases via butler

**Why butler (not the web uploader):** every time you delete a zip in the
itch.io dashboard and upload a new one, the file gets a new internal ID and
the embed iframe URL changes. For returning players that reads as a new
origin path, and in some mobile clients / strict-privacy browsers
`localStorage` is lost — stats, daily history and progress reset.

`butler push` reuses the **same channel** across releases, so the served
URL is stable and returning players keep their saves.

## One-time setup (≈ 2 minutes)

1. **Install butler.**
   Download from <https://itch.io/docs/butler/installing.html> and put the
   binary somewhere on `PATH`. Verify:

   ```bash
   butler -V
   ```

2. **Log in once.** Opens a browser, grants butler an API key, stored in
   your user profile.

   ```bash
   butler login
   ```

3. **Record your itch target** (`user/game-slug`, e.g. `sunlike78/foldwink`).
   Pick one of the three options — the release script reads them in order:

   - `.itch-target` file in repo root (gitignored — recommended):
     ```
     sunlike78/foldwink
     ```
   - env var `ITCH_TARGET=sunlike78/foldwink`
   - CLI flag: `npm run release:butler -- --target=sunlike78/foldwink`

## Release workflow

```bash
npm run release:butler
```

What it does:

1. runs `npm run pack:itch` → builds + writes a fresh versioned zip into
   `itch.io/export/foldwink-itch-upload-v<version>-<date>[-rN].zip`
2. picks the newest zip matching the current `package.json` version
3. `butler push <zip> <target>:html --userversion=<version>`

Channel defaults to `html`. Override with `--channel=<name>` if you ever
need a separate staging channel. Skip the rebuild with `--skip-pack` to
re-push an existing zip.

## Verifying it worked

- `butler status <target>` → shows channels and latest builds
- on the itch page, the embed URL should not change between successive
  `release:butler` runs. Hard-refresh in a browser that already has
  foldwink progress in localStorage — the saved stats should still be
  there.

## First-time migration from the web uploader

Current players who saved progress via an old manually-uploaded zip may
still see a reset on the **first** butler release, because that release
publishes to a new channel URL. From the second butler release onward the
URL is stable and localStorage survives.

If you want zero-reset for existing players, point the butler channel at
the same URL the current web upload uses (only possible if you created
the upload via butler originally — itch's web uploads don't expose a
channel to butler). For a closed-beta this trade-off is usually fine.
