# Foldwink 0.4.1 — Polish Pass Report

Date: 2026-04-12
Scope: disciplined improvement pass on top of 0.4.0 focused on branding,
sound, content pipeline metadata, and progression clarity. Target: close
the highest-value code-doable gaps flagged in the 0.4.0 post-run analysis
without scope creep or identity drift.

## 1. Phase-by-phase execution

### Phase 0 — Orient, verify, baseline

- Confirmed live sources of truth: `docs/reports/FOLDWINK_POST_MVP_SPRINTS_REPORT.md`, `docs/TODO.md`, `docs/KNOWN_LIMITATIONS.md`, release notes, content-pipeline docs, Sprint 0 audit.
- Ran baseline gates on 0.4.0: `typecheck` / `test` / `lint` / `validate` / `build` — all green. 76/76 tests. 79.39 kB gzip.

### Phase 1 — High-value code/product gaps

- Error boundary already shipped in 0.4.0 (`src/components/ErrorBoundary.tsx`). No regression.
- Replaced placeholder support email `hello@foldwink.com` → **`foldwink@neural-void.com`** in `AboutFooter`. Email is now a real `mailto:` link.
- Replaced placeholder site `foldwink.com` → **`neural-void.com/foldwink`** in:
  - `src/game/engine/share.ts` (share string footer)
  - `src/share/shareCard.ts` (canvas footer)
  - `src/game/engine/__tests__/share.test.ts` (test expectation)
- Support presence surfaced through `AboutFooter`: privacy note → support email → clear local event log. Not intrusive, collapsible.

### Phase 2 — Branding pass

- `Wordmark` component gained an optional `by Neural Void` sublabel (`showSublabel` prop, default on for `lg`, off for `sm`/`md`).
- `AboutFooter` now names Neural Void inline with a link to `https://neural-void.com` and exposes the support email as a `mailto:` link.
- `index.html` — description and OG/Twitter meta mention Neural Void, corrected the stale "One anchor card on every medium puzzle" wording to the Foldwink Tabs + Wink language, added `og:url` pointing at `neural-void.com/foldwink`.
- `public/og.svg` — added "BY NEURAL VOID" sublabel under the wordmark, corrected the tagline line from "One anchor per medium puzzle" to "Foldwink Tabs reveal the categories".
- `public/manifest.webmanifest` — added `id`, `categories`, `lang`, rewrote description to match the product copy.
- `src/share/shareCard.ts` canvas — draws "BY NEURAL VOID" under the wordmark and footer now reads `neural-void.com/foldwink`. Vertical rhythm tightened so the added line does not clip the solved-grid area.
- No human-designed logotype introduced. The new treatment is strictly typographic.

### Phase 3 — Sound direction refinement

- Rewrote every recipe in `src/audio/sound.ts` against the documented paper / card / wood / bone direction.
- **Removed bright chime register.** All oscillator bodies now live in the **80–280 Hz** band. Triangle oscillators removed from `correct` and `win` (they were reading as mobile-chime ascent).
- `submit` — single warm wood knock (1200 Hz LP tap + 140 Hz sine body).
- `wrong` — two muted wood knocks (900 / 700 Hz LP + 120 / 95 Hz sine).
- `correct` — three bone-on-wood settles in the 180/215/250 Hz range. No ascending melody.
- `wink` — warm tile lift (280 / 210 Hz sine), no high overtone.
- `win` — four evenly-paced tiles on wood (170/190/215/240 Hz). No melodic resolution.
- `loss` — unchanged from 0.4.0 except body lowered to 95 Hz and slightly longer decay.
- `tabReveal` — quietest cue, paper-thin micro tap.
- `select` / `deselect` — unchanged structure, slightly quieter and warmer filtering.
- Filter type switched from bandpass to low-pass by default — warmer, less hollow.
- Default master volume: **0.55 → 0.42**.
- New `docs/SOUND_DESIGN.md` documents the material direction, the cue manifest, the current synthesis implementation, and the exact asset-replacement plan (7 `.mp3` files under `public/sounds/`, ≤ 80 kB total, one-file swap).
- Placeholder strategy made explicit: synthesis is good enough for 0.4.x; final production requires recorded samples.

### Phase 4 — Share / result card polish

- Added "BY NEURAL VOID" sublabel to the canvas card.
- Footer switched to `neural-void.com/foldwink`.
- Tightened vertical rhythm (y-offsets) to fit the new sublabel without clipping the solved-grid.
- Text share string (`buildShareString`) now ends with `neural-void.com/foldwink`. Test expectation migrated.
- OG image branding aligned with in-app branding — single consistent treatment across app, share card, text share, and meta.
- Pipeline unchanged: 5-layer fallback (`navigator.share(files)` → `clipboard.write(ClipboardItem)` → download → `navigator.share(text)` → `clipboard.writeText`). Not re-verified in a browser.

### Phase 5 — Content pipeline upgrade toward 500

- New optional `Puzzle.meta` field in `src/game/types/puzzle.ts` with `theme`, `categoryType`, `wordplay`, `fairnessRisk` (0–3), `repetitionRisk` (0–3), `tags`, `batch`, `status` fields.
- **Zero migration required.** All 98 existing puzzles validate cleanly — every meta field is optional.
- Validator (`scripts/validate-puzzles.ts`) now reports:
  - metadata coverage (how many puzzles carry a meta block)
  - theme coverage and count
  - categoryType coverage and count
  - wordplay medium share vs. the ≤ 25% target
  - per-batch counts
  - editorial warning when `fairnessRisk ≥ 2`
- Current library remains **98 puzzles (65 easy + 33 medium)**. No mass generation — the disciplined batch path in `docs/content/BATCH_WORKFLOW.md` remains a human-driven task.
- Puzzle library status doc (export + repo) continues to state actual vs. target explicitly.

### Phase 6 — Progression / readiness review

- New pure function `mediumReadiness(stats)` in `src/game/engine/readiness.ts` returns one of three levels:
  - `warmup` — fewer than 3 wins
  - `ready` — 3+ wins, no specific medium confidence yet
  - `strong` — at least one flawless win OR 2+ medium wins
- Each level carries a short `label` and `caption` for UI. Never gates anything — medium puzzles remain reachable from day one. The signal is encouragement, not a lock.
- `MenuScreen` renders the readiness line under the Standard button **only if** the player has at least one played game. Empty-record players see nothing.
- 6 new unit tests pin every level path.

### Phase 7 — Release-readiness hardening

- `docs/KNOWN_LIMITATIONS.md` — added Audio and Branding sections reflecting 0.4.1 reality.
- `docs/RELEASE_NOTES.md` — new 0.4.1 section with full changelog.
- `docs/SOUND_DESIGN.md` — new doc, the sound contract.
- `docs/TODO.md` — updated (see next section).
- `package.json` — version `0.4.0` → `0.4.1`.
- No OG raster or human wordmark changes — both remain honestly deferred as human-art tasks in `03_known_issues.md` and this report.

### Phase 8 — Testing and quality gate

Final gate sweep:

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (82 / 82 across 11 suites)
npm run lint       → PASS (0 warnings)
npm run format:check → PASS (all files prettier-clean)
npm run validate   → PASS (98 puzzles — 65 easy + 33 medium)
                     diversity 0.992, 3 label collisions, 0 niche flags
                     metadata coverage 0/98 (baseline)
                     wordplay mediums 0/33 flagged (baseline)
npm run build      → PASS (244.40 kB JS / 79.79 kB gzip)
```

- **No browser session was run.** All visual and audio claims in this report are inferred from code. The 0.4.0 open blocker H11 (human in-browser QA) carries forward to 0.4.1 unchanged.

## 2. Changed files (0.4.0 → 0.4.1)

### New

- `src/game/engine/readiness.ts`
- `src/game/engine/__tests__/readiness.test.ts`
- `docs/SOUND_DESIGN.md`
- `docs/reports/FOLDWINK_0_4_1_POLISH_PASS_REPORT.md` (this file)

### Modified

- `package.json` — 0.4.0 → 0.4.1
- `index.html` — Neural Void meta, corrected Wink language, `og:url`
- `public/og.svg` — sublabel + corrected tagline
- `public/manifest.webmanifest` — `id`, `categories`, `lang`, full description rewrite
- `src/audio/sound.ts` — every recipe rewritten, default volume lowered, material documentation header
- `src/components/Wordmark.tsx` — `showSublabel` prop + "by Neural Void" sublabel
- `src/components/AboutFooter.tsx` — `foldwink@neural-void.com` mailto + Neural Void link
- `src/screens/MenuScreen.tsx` — `mediumReadiness` signal under the Standard button
- `src/game/types/puzzle.ts` — `PuzzleMeta` interface added
- `src/game/engine/share.ts` — `neural-void.com/foldwink` footer
- `src/game/engine/__tests__/share.test.ts` — expectation migrated
- `src/share/shareCard.ts` — Neural Void sublabel, `neural-void.com/foldwink` footer, vertical rhythm tightened
- `scripts/validate-puzzles.ts` — `PuzzleMeta` interface + coverage reporting
- `docs/KNOWN_LIMITATIONS.md` — Audio and Branding sections
- `docs/RELEASE_NOTES.md` — 0.4.1 section

## 3. Command results

All commands run from repo root on Windows via git-bash.

| Command                | Result                                  |
| ---------------------- | --------------------------------------- |
| `npm run typecheck`    | **PASS** — 0 errors                     |
| `npm test`             | **PASS** — 82/82 across 11 suites       |
| `npm run lint`         | **PASS** — 0 warnings                   |
| `npm run format:check` | **PASS** — all files clean              |
| `npm run validate`     | **PASS** — 98 puzzles, diversity 0.992  |
| `npm run build`        | **PASS** — 244.40 kB JS / 79.79 kB gzip |

## 4. Release readiness verdict

**Still Conditional Go for closed beta.**

What moved forward since 0.4.0:

- Branding is now consistent across app / share / meta / OG / footer / support.
- Support channel is real: `foldwink@neural-void.com`.
- Sound direction matches the written contract — at least on paper. Requires an ear pass.
- Content pipeline has a real metadata shape to carry the disciplined-batch expansion.
- Player has a gentle readiness signal on the menu.
- All hygiene items closed except the human-only ones.

What did not move:

- **H11 human in-browser QA pass** — still the top open blocker.
- **Sound ear-verification pass** — new blocker introduced by the 0.4.1 retune. Recipes are theoretically correct; real ears are the only proof.
- **Share card visual verification** — still never rendered and eyeballed.
- **Raster OG PNG** — still SVG only.
- **Designed wordmark / logotype** — still system sans.
- **Deployed branded domain** — still not wired to a live deployment.
- **Pool at 98** — the metadata shape is ready, the disciplined batches still need a human drafting session.

**Monetization verdict: not ready.** Unchanged from 0.4.0 analysis. Premium / ads / network analytics remain deferred. The `AboutFooter` + privacy note + local-only event log is the correct minimum for this stage.

## 5. Honest confidence statement

- **Confidence that the 0.4.1 branding is coherent:** high. The text and structure are auditable via `rg`/`grep` and the repo now has a single consistent Neural Void signature across app, share, meta, OG, footer, and support.
- **Confidence that the sound retune achieves its material direction:** **medium.** The numbers follow the contract (bodies ≤ 280 Hz, low-pass filters, no ascending melody, peak gains ≤ 0.22, default volume 0.42). But the only actual listening test is the one a human still has to run. A human ear may decide a cue is still too generic or too quiet, in which case the `RECIPES` block is the single swap point.
- **Confidence that content metadata schema is the right shape:** high for the fields it covers. Low for whether the human author will actually populate it on every new draft. The validator reports coverage, not enforcement.
- **Confidence that the readiness signal is a net positive:** high. It is advisory, gentle, and appears only after at least one played game.

## 6. Priority next actions after this pass

1. **Human in-browser QA pass** (H11) against `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` on a phone + desktop viewport. Still the top open blocker. Blocks any external test.
2. **Sound ear pass.** Play each cue twice in a row, two minutes apart, on speakers and headphones. Any cue that feels synthetic, bright, or annoying on repeat: retune or disable.
3. **Share card visual pass.** Render three outputs (flawless medium win, 3-mistake easy loss, no-wink medium win) to a file via a small node/canvas script or a manual browser DevTools call. Review for typography, spacing, and the new Neural Void sublabel position.
4. **First disciplined content batch.** 10 easy + 5 medium drafts through `docs/content/BATCH_WORKFLOW.md`, populating `meta.theme` / `meta.categoryType` / `meta.wordplay` / `meta.batch` on each. Run `npm run validate` to confirm the coverage report moves from 0/98 to 15/113 and the wordplay share stays ≤ 25% on mediums.
5. **Raster OG PNG** from the existing `og.svg` via any vector-to-raster tool. Human-art task.
6. **Deploy a preview build** to any static host and wire `neural-void.com/foldwink` as a real URL before any share goes public.

## 7. HANDOFF / RESUME

### Finished in this pass

- Branding integration (neural-void.com, foldwink@neural-void.com) across app, share, meta, OG, footer, support, share card.
- Sound recipes rewritten against the documented material palette. Default volume lowered.
- Sound design contract doc (`docs/SOUND_DESIGN.md`) with asset-replacement plan.
- Optional `Puzzle.meta` schema + validator coverage reporting.
- Medium readiness soft signal + 6 new tests.
- Release notes 0.4.1 section.
- Known limitations updated (Audio + Branding sections).
- Version bump to 0.4.1.
- All gates green: typecheck, 82 tests, lint, format, validate, build.

### Unfinished (deliberately — human-only or out of scope)

- H11 browser QA pass.
- Sound ear verification.
- Share card visual verification.
- Raster OG PNG.
- Designed wordmark / logotype.
- Deployed branded domain.
- Actual pool expansion beyond 98.
- Premium / ads / network analytics.
- Raster favicon PNG variants.

### Exact next recommended step

Run the in-browser QA pass from `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` against the 0.4.1 preview build on one phone-sized and one desktop-sized viewport. While doing it, listen to each sound cue twice in a row and mark any that still feels synthetic or annoying. This closes the largest remaining confidence gap in one human session.

### Known blockers

- Cannot render or visually verify the canvas share card without a real browser session.
- Cannot evaluate tactile quality of the sound retune without real speakers or headphones.
- Cannot credibly advance the pool past 98 without a disciplined human authoring session.

### Commands to rerun

```
npm run typecheck
npm test
npm run lint
npm run validate
npm run build
```

### Repo state

Stable. 0.4.1 committed-ready (no git operations performed). All gates green. Ready for the next supervised pass.

---

**HIBERNATE**

Further speculative changes stopped. Repo left in a stable 0.4.1 state. Next
supervised pass should start from the human tasks in section 6.
