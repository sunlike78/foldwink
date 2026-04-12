# Foldwink Final Implementation Audit

Audit date: 2026-04-11
Auditor: strict pre-beta review pass against the working tree in `C:\AI\neural-void.com\foldwink`.
Package version at time of audit: **0.3.3**.

Gates re-run live before writing this report:

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (65 / 65 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (98 puzzles — 65 easy + 33 medium), 93 intentional cross-puzzle warnings
npm run build      → PASS (226.25 kB JS / 74.07 kB gzip, 14.92 kB CSS / 3.92 kB gzip)
```

**Runtime-inspection limitation:** no browser or preview session was opened for this audit. Every visual conclusion below is marked **[Inferred]** (from source + Tailwind tokens + component markup) unless explicitly marked **[Observed]**. No line in this report is marked Observed.

---

## 1. Executive verdict

Foldwink 0.3.3 is a small, disciplined indie puzzle codebase with a genuine pure-function game engine, a clean store architecture, 65 green tests, 98 validated puzzles, and a real player-facing signature mechanic (Foldwink Tabs + Wink) that is felt during play on medium puzzles. The technical foundation is competent small-product work.

It is also visibly **overclaimed in its public-facing surface** and carries two **hard brand-lying defects** that should have been caught by any review pass:

1. The OG meta tags in `index.html` **still describe the 0.2.0 anchor mechanic** that was removed in 0.3.0. Every link preview lies about the game.
2. The OG image asset `public/og.svg` has the same dead anchor pitch **baked into the hero text**.
3. The canonical schema doc `docs/PUZZLE_SCHEMA.md` still defines and exemplifies a `twist: { kind: "anchor" }` field that the runtime type no longer supports.

Any closed-beta launch that shares a link today will broadcast the wrong product pitch to every tester. That is not "polished indie MVP"; that is a 30-minute fix being left at the door for 4 phases in a row.

Separately:

- `CLAUDE.md` still calls the product "Cluster Twist".
- `docs/RELEASE_NOTES.md` stops at 0.3.1 while the package version is 0.3.3. Two phases of work are unrecorded.
- `StatsScreen` displays `Solved` and `Unique` as two separate grid cells with the same value. It displays `Win %` in the hero strip and `Win Rate` in the grid, same value. Four of nine stats cells are functionally duplicate.

The product-facing reports have been claiming "polished indie MVP for closed beta" since 0.3.0. The core engineering earns that. The shipping surface does not.

### Scores (1–10)

| Dimension                       | Score                                                        |
| ------------------------------- | ------------------------------------------------------------ |
| Technical Quality               | **8**                                                        |
| Architecture Quality            | **8**                                                        |
| Code Quality                    | **7**                                                        |
| Mechanic Implementation Quality | **7**                                                        |
| Maintainability                 | **8**                                                        |
| UI Quality _[Inferred]_         | **6**                                                        |
| UX Quality                      | **7**                                                        |
| Visual / Product Identity       | **6**                                                        |
| Product Clarity                 | **8**                                                        |
| Differentiation                 | **6**                                                        |
| Content Readiness               | **7**                                                        |
| Commercial Readiness            | **5**                                                        |
| Closed Beta Readiness           | **6** (would be **8** if the brand-lying defects were fixed) |
| Public Release Readiness        | **5**                                                        |

The Closed Beta Readiness score is the single most important number in this audit. The prior reassessment set it at 8. That was overclaimed. The OG lying about the mechanic alone demotes it to 6 — a closed beta with that surface will collect confused feedback about an "anchor" that doesn't exist.

---

## 2. What is actually implemented

### Real, working implementation

- **Core game loop.** 16-card 4×4 grid, select-up-to-4, submit, correct-group lock, mistake counter, win at 4 solves, loss at 4 mistakes. Pure functions in `src/game/engine/{submit,progress}.ts`.
- **Deterministic daily selector.** `src/puzzles/daily.ts` — FNV-1a over local date string, mod pool length. 4 pinning tests in `daily.test.ts`.
- **Standard mode progression.** Sequential cursor through `puzzles/pool/`, advances on win only, wraps at end.
- **98 validated puzzles** in `puzzles/pool/puzzle-0001.json` through `puzzle-0098.json`. 65 easy + 33 medium.
- **Foldwink Tabs reveal.** `src/game/engine/foldwinkTabs.ts` — pure `revealStage(hint, stage)` + `buildFoldwinkTabs(puzzle, solvedGroupIds, winkedGroupId)`. Medium-only. 18 tests pin it.
- **Wink action.** `src/game/state/store.ts:290-299` — one-per-puzzle guarded action. 7 store tests in `store.test.ts`.
- **Persistence subscriber.** `src/game/state/appStore.ts` — boot-time seed from `loadDailyHistory()` / `loadStats()` / `loadProgress()` / `loadOnboarded()`, and a single `subscribe` listener that writes slices when they change.
- **Share string.** `src/game/engine/share.ts` — `Foldwink · <date or #NNN>` header + emoji grid + `foldwink.com` footer.
- **Share button.** `src/components/ShareButton.tsx` — uses `navigator.share` when available, falls back to `navigator.clipboard.writeText` with transient "Copied!" state.
- **Next-daily countdown.** `src/components/DailyCountdown.tsx` — ticks every 1s against local midnight.
- **Onboarding overlay.** `src/components/Onboarding.tsx` — brand mark + rules + Foldwink Tabs sample + 4 bullets + persisted `foldwink:onboarded` flag.
- **Menu daily-complete card.** `src/components/DailyCompleteCard.tsx` — eyebrow + time/mistakes pill + streak + inline countdown.
- **Result screen.** Headline + StatStrip + group reveal pills + streak celebration + loss warmth card + framed share card.
- **Stats screen.** Wordmark + 3-cell hero strip + 6-cell grid + empty-record card.
- **Solved-color single source of truth.** `src/game/solvedColors.ts` — positional index, used by Card / GameScreen / ResultSummary / FoldwinkTabs.
- **65 tests across 9 suites.** Engine, store, daily, stats, share, countdown, foldwinkTabs, submit, shuffle, progress. All green.
- **ESLint flat config + Prettier + GitHub Actions CI** (`eslint.config.js`, `.prettierrc.json`, `.github/workflows/ci.yml`).

### Partial / superficial / placeholder

- **OG image (`public/og.svg`).** A placeholder SVG with a wordmark + 2×8 tile motif + accent star. Readable but **contains a dead tagline about the removed anchor mechanic.**
- **Favicon (`public/favicon.svg`).** Same 2×2 + star motif. Passable, not distinctive.
- **Wordmark typography.** System sans (`-apple-system, Segoe UI, Roboto, …`). Clean but not memorable.
- **`StatsScreen` 6-cell grid.** Structurally present but contains duplicate cells (see §4).
- **No hard difficulty.** Only easy and medium.
- **No share preview** of the emoji grid before the player taps Share.

### Stubs / placeholders / dead surface

- **`canWinkGroup` helper** in `src/game/engine/foldwinkTabs.ts:93-103` — exported and tested, but **never called by production code**. The store's `winkTab` action reimplements all the same guards inline. Pure dead code.
- **`PuzzleGroup.editorialNotes?` in validator's inline type** (`scripts/validate-puzzles.ts:29`). The runtime `PuzzleGroup` type does not have this field. Dead type annotation.
- **`docs/PUZZLE_SCHEMA.md`'s `twist: { kind: "anchor" }` field.** Documented, exemplified, and not implemented. Authors following this doc will write JSON with a `twist` field that silently does nothing.
- **`audit-results/` folder + `foldwink-audit-results.zip`** in repo root — historical artefacts from the first audit phase.
- **`FOLDWINK_MASTER_MEGA_PROMPT.md`, `README_START_HERE.md`** in repo root — historical bootstrap prompts.
- **`.tsbuildinfo-node/` directory + `tsconfig.tsbuildinfo` + `tsconfig.node.tsbuildinfo`** — leftover from an abandoned `tsconfig.node.json` attempt early in the project.

### Documentation claims vs. code

- **`docs/RELEASE_NOTES.md`** stops at 0.3.1. `package.json` is 0.3.3. **Two phases (visual polish, content Phase 2 / tightening) are completely unrecorded in release notes.**
- **`docs/PUZZLE_SCHEMA.md`** describes a mechanic that was removed in 0.3.0.
- **`CLAUDE.md`** (root project instructions) still describes the product as "Cluster Twist". The rebrand to Foldwink never reached this file.
- **`FOLDWINK_FINAL_RELEASE_REASSESSMENT.md`** (the report claiming "polished indie MVP / closed-beta ready") and the Manual QA Checklist were both written without running the manual QA pass in a browser. The reassessment document itself acknowledges this as its largest caveat, correctly.

---

## 3. Technical architecture audit

### 3.1 Overall architecture

Clean three-layer split: `src/game/engine` (pure) → `src/game/state` (Zustand factory + persistence subscriber) → `src/screens` / `src/components` (React). No layer import violations. Screens only read the store via `useGameStore`; engine imports zero React; persistence never reaches into engine.

**Issues:**

- **`defaultDeps` in `store.ts:63-74` statically imports `PUZZLE_POOL`** — the store factory's default dependency bundle binds to the production pool at module load time. Pure tests use `createStore(mockDeps)` to avoid this, which works. **Severity: Low.** Not a bug, but the factory / defaults dichotomy is mildly redundant — `appStore.ts` already passes every field explicitly.

### 3.2 State management

`StoreState` (13 slices) + `StoreDeps` (9 injectable dependencies). Actions are synchronous. Tests use a vanilla store built from mock deps without jsdom.

**Issues:**

- **M3: Duplicate state: `dailyPlayedDate` + `todayDailyRecord.date`.**
  - Evidence: `store.ts:27-28` declares both. `store.ts:148,151,221,234,241` writes both together.
  - Why it matters: two sources of truth for the same fact (did the player play today). `todayDailyRecord.date` is the authoritative one; `dailyPlayedDate` is now a redundant mirror.
  - Severity: **Medium**.
  - Fix: drop `dailyPlayedDate`, derive via selector `state => state.todayDailyRecord?.date ?? null`.

- **M4: Store is at 301 LOC.** One line over the 300-LOC smell threshold the 0.1.0 audit flagged for this same file.
  - Evidence: `wc -l src/game/state/store.ts` → 301.
  - Severity: **Medium**. Not urgent, but the pattern holds: every phase grew this file. Splitting into `sessionSlice` / `statsSlice` / `navSlice` was proposed by the 0.1.0 audit and deferred each time.

- **L6: Module-level subscriber state in `appStore.ts`.** `prevStats`, `prevProgress`, `prevTodayDailyRecord`, `prevOnboarded` are module-scope variables closed over by the subscribe callback. Works because `appStore.ts` is imported exactly once at module load. Fragile if a future test suite imports `appStore` directly.
  - Severity: **Low**.

### 3.3 Game engine / pure logic

`src/game/engine/{submit,progress,result,shuffle,share,foldwinkTabs}.ts`. All pure. All tested.

**Strong.** No issues found. This is the most trusted part of the codebase.

Minor note: `isWin` uses `game.solvedGroupIds.length === puzzle.groups.length` which is always 4. Correct but tied to the implicit assumption that `puzzle.groups.length === 4`. A future `hard` difficulty with 5 groups would break it silently. Not a current bug.

### 3.4 Mechanic implementation

See §5 for the full mechanic audit. Technical implementation:

- `buildFoldwinkTabs` is pure. 18 tests.
- `winkTab` action in the store is 10 lines, 6 guards, inline.
- `FoldwinkTabs.tsx` (93 LOC) renders two branches: clickable `<button>` for unsolved/unwinked while wink is available, `<div>` for everything else.

**Issue:**

- **M1: Dead `canWinkGroup` helper.** Exported from `foldwinkTabs.ts:93-103`, imported and tested by `foldwinkTabs.test.ts`, but **never imported by production code.**
  - Evidence: `grep -rn canWinkGroup src/` returns only the helper definition and the test file.
  - Why it matters: the store's `winkTab` action duplicates the same guard logic inline (`store.ts:293-297`). If the guards ever need to change, two places must be updated or they drift. This is classic dead-code-with-a-test — the worst kind of dead code because it looks maintained.
  - Fix: either replace the inline guards in `winkTab` with a call to `canWinkGroup`, or delete the helper.
  - Severity: **Medium**.

- **M8: Wink mark lost on a solved tab.** `FoldwinkTabs.tsx:51-59` — when `tab.solved`, the class uses only the solved color; when `tab.winked` (and unsolved), the ✦ prefix is added via line 85 inside the non-clickable `<div>` branch. A tab that was winked and _then_ solved is rendered as just the solved label with no acknowledgment of the wink.
  - Why it matters: small but it breaks the mechanic's own feedback loop. A player who spent their wink on a specific group loses the reminder that they did.
  - Severity: **Medium**.

- **M10: Inconsistent element semantics.** Solved tabs → `<div>`. Winked unsolved → `<div>`. Clickable unsolved → `<button>`. The visual affordance is uniform; the DOM semantics switch mid-render.
  - Severity: **Low/Medium**. Accessibility tree will differ between states.

### 3.5 Content pipeline / schema / validation

- Validator: `scripts/validate-puzzles.ts` — 229 LOC. Hard checks on structure + unique ids + duplicate items. Soft warnings on item length + cross-puzzle reuse. New `revealHint` validation for mediums.
- Loader: `src/puzzles/loader.ts` — eager glob import + runtime shape check + dev-fail-fast / prod-drop policy. 63 LOC.
- Pool: 98 JSON files, all validator-clean.

**Issues:**

- **H2: `docs/PUZZLE_SCHEMA.md` is canonically broken.**
  - Evidence: `docs/PUZZLE_SCHEMA.md:14-19` defines a `twist: Twist` field. `:47-63` shows an example medium puzzle with `"twist": { "kind": "anchor", "item": "Butter" }` — and **no `revealHint` fields anywhere**. `:65` then describes Foldwink Tabs rendering as if the example supported them. `:95` still mentions "the anchor".
  - Runtime reality: `src/game/types/puzzle.ts` has no `twist` field. `Twist` type does not exist. The validator does not check `twist`. An author who writes a puzzle following the example will produce a file that loads silently without any Foldwink Tabs reveal (because `revealHint` is missing, so `hintFor` falls back to the full `label`, which produces weird tabs like `_______ FLY`).
  - Why it matters: the canonical schema doc describes a product that does not exist. It also contradicts itself within the same file (examples vs. surrounding text).
  - Severity: **High**.

- **M5: Validator doc comment says "Cluster Twist".** `scripts/validate-puzzles.ts:2`. Cosmetic.

- **M6: Dead `editorialNotes` field** in validator's inline type (`scripts/validate-puzzles.ts:29`). Not in runtime type. Dead type surface.

- **L4: Validator does not require `revealHint` on medium puzzles** — only validates the field's shape when it's present. The editorial guidelines say "every medium group **must** have `revealHint`" but nothing enforces it. All 33 current mediums comply; future content drift is possible.
  - Severity: **Low**.

### 3.6 Persistence

Four keys: `foldwink:stats`, `foldwink:progress`, `foldwink:daily`, `foldwink:onboarded`. Wrapped in `safeRead` / `safeWrite` try/catch. Subscriber writes only on slice change.

**Strong.** No bugs found. Minor observations:

- No persistence of mid-game state. Acknowledged in every report. Acceptable for MVP.
- Persistence wrapper default return for `loadStats` correctly re-initializes `solvedPuzzleIds` if corrupted.

### 3.7 Testing quality

65 tests / 9 suites / all green. Distribution:

- Engine: shuffle (6), submit (6), progress (6), result (implicit via share), foldwinkTabs (18), share (2).
- State: store (16 — covers daily replay guard, cursor advance, selection cap, deselect, streak delta, onboarding, wink action with 7 guards).
- Content: daily (4).
- Stats: stats (4).
- Utils: countdown (3).

**Strong.** The store-level tests are the best engineering decision in this codebase — they pin the branchy behavior (daily replay, wink guards, streak delta) in plain Node without jsdom.

**Gaps:**

- **No component tests.** No `@testing-library/react`. React render logic is verified by tests only at the store level.
- **No integration / E2E tests.** The onboarding flow, the full game-to-result transition, and the share button fallback path are verified by inspection only.
- **No validator test.** The validator script has no unit tests; drift in its rules would only be caught by manual review.
- **No regression test for M8 (winked-then-solved tab display).** Because that branch is in JSX only, and there are no component tests, the bug cannot be pinned today.

### 3.8 Tooling / build / CI

ESLint 9 flat config, Prettier, GitHub Actions CI, `npm run format:check`. All green. Bundle is 74 kB gzipped for 98 puzzles. Tight.

**Issues:**

- **M7: `.gitignore` is incomplete.** Missing entries for leftover build artefacts:
  - `.tsbuildinfo-node/` (directory present in repo root)
  - `tsconfig.tsbuildinfo` (file present)
  - `tsconfig.node.tsbuildinfo` (file present)
  - `audit-results/` (directory)
  - `*.zip` (the audit zip file)
  - Severity: **Medium**. Not functional, but these files will pollute future commits.

- **Build script runs typecheck twice.** `package.json`: `"build": "tsc --noEmit && vite build"` and `"typecheck": "tsc --noEmit"`. Duplication. Visible but harmless.
  - Severity: **Low**.

### 3.9 Maintainability / technical debt

**Debt inventory:**

1. Store at 301 LOC, single-file god-object trajectory (M4).
2. Duplicate `dailyPlayedDate` / `todayDailyRecord.date` state (M3).
3. Dead `canWinkGroup` helper (M1).
4. Canonical schema doc out of sync with code (H2).
5. Release notes out of sync with version (H4 below).
6. Dead type fields in validator (M6).
7. Stale `CLAUDE.md` brand name (H3).
8. `.gitignore` leaks (M7).
9. Historical root-level files not archived.
10. No runtime enforcement of `revealHint` on mediums (L4).

**None of these are critical in isolation.** But the pattern is: every phase added polish without cleaning up its own breadcrumbs, and the latest phase promised "final tightening" while leaving the two highest-severity brand-lying defects (H1, H2) in place.

---

## 4. Code quality audit

**Overall:** disciplined small-codebase work with sloppy dead-surface hygiene.

**Good signals:**

- No `any`, no `@ts-ignore`, no debug `console.log` debris.
- Consistent naming (`ActiveGame`, `PuzzleGroup`, `findMatchingGroup`, `applyCorrectGroup`, `buildFoldwinkTabs`, `winkTab`, `canWinkGroup`).
- Pure functions are pure.
- Small file sizes (largest is `store.ts` at 301).
- ESLint flat config + TypeScript strict + no-unused-vars enforced.

**Smells:**

- **Duplicate stats cells.** `StatsScreen.tsx:38-47` (hero `StatStrip`) + `:52-57` (grid `StatCell`s) display the same numbers in different containers. `Solved` (hero) and `Unique` (grid) both render `solvedCount`. `Win %` (hero) and `Win Rate` (grid) both render `winRate`. Four of nine cells are functionally redundant.
  - Severity: **Medium** — not a bug, but it looks like a WIP grid the author never edited down.

- **Store action duplication of pure predicate.** `winkTab` (`store.ts:290-299`) inlines the same logic as `canWinkGroup` (`foldwinkTabs.ts:93-103`). See M1.

- **Inline conditional string concat in JSX.** `GameScreen.tsx:66-68`:

  ```tsx
  subtitle={
    `${puzzle.difficulty.toUpperCase()} · ${active.mode}` +
    (active.mode === "daily" && !active.countsToStats ? " · replay" : "")
  }
  ```

  Minor. A `computeSubtitle(puzzle, active)` helper would be cleaner.

- **`GameScreen.tsx` derives `solvedItems` and `groupColorByItem` inline at render time** via a `forEach` over puzzle groups (`:41-50`). This is a per-render computation that could be memoized or moved to a store selector. Very small puzzles (16 items, 4 groups) make this a non-issue today but the pattern is weak.

- **Onboarding has 16 hand-typed `<span>` elements** for the grid illustration (`Onboarding.tsx:40-57`). Should be an `Array.from({length:16}).map(...)`. Minor — no bug, but this is the single most LLM-generated-looking block in the codebase.

- **`FoldwinkTabs.tsx` tab rendering has three branches with repeated `rounded-lg px-2.5 py-1.5 text-xs …` base classes** stored as a `const base`. Fine. But the clickable vs. non-clickable branches then diverge into separate `<button>` vs `<div>` paths with the same inner content. A single `renderCell` helper would reduce the duplication.

- **Dead ESLint-looking comment**: `loader.ts:36` has a plain `console.warn` with no directive. This was correctly cleaned after the earlier audit pass. No issue now; noting for completeness.

**Typical LLM smell level: low to medium.** The codebase has been cleaned up multiple times and it shows. The surviving smells are mostly visual duplication (StatsScreen grid, Onboarding hand-typed cells) rather than generated-filler functions.

---

## 5. Technical idea implementation audit

### What is the intended idea?

**Foldwink Tabs + Wink:** on medium puzzles, a row of 4 small tabs above the grid shows progressive category reveals. Each tab starts with 1 letter visible (`R··`, `F··`, `B··`, `S··`) and reveals one more letter each time the player solves a group. Once per puzzle, the player may tap any unsolved tab to **Wink** it — the full category keyword is revealed instantly for that tab. Optional, no penalty, capped at one.

Stated pitch: _"Once per puzzle, tap a Foldwink Tab to Wink it and fully reveal its category — use it when you're stuck."_

### Is it actually implemented?

**Yes, technically.** `buildFoldwinkTabs` is pure and tested. `winkTab` action is guarded and tested. `FoldwinkTabs` component renders the correct three visual states. The Wink is a real piece of state (`ActiveGame.winkedGroupId`) that the engine and UI both respect.

### Does it feel like a mechanic or just assistance?

**It's a borderline mechanic — felt but passive.**

**Positives:**

- The tabs row visibly changes on every solve.
- The Wink is an active click the player makes.
- The `✦ wink ready` / `✦ wink used` chip is a clear scarcity signal.
- The mechanic is named and explained in the onboarding.

**Negatives:**

- **66% of the pool does not use it.** Easy puzzles (65 of 98) never render a tabs row and never expose a Wink. A player who only plays easies (the most common first-session path) will never encounter Foldwink's signature mechanic.
- **No reward for using the Wink well.** A player who solves without winking gets the same result screen as a player who wins with a wink. No stat, no badge, no sharing difference.
- **No penalty for wasting it.** A player who winks randomly on turn one gets the same outcome as one who saves it.
- **The Tabs reveal does not help the player who is stuck.** Stage 0 shows 1 letter per category — the player who couldn't find the first group is not given more information until they solve something. Classic anti-snowball failure. The Wink exists to patch exactly this gap, but a player who doesn't use it is still stuck.
- **The revealed keyword is the category name, not the category answer.** On a synonym puzzle (`Meaning SMALL`), seeing `SMALL` is less useful than seeing the items. On a word-play puzzle (`___ FLY`), seeing `FLY` is the whole game. The mechanic rewards word-play mediums disproportionately.

### Does it improve the game meaningfully?

On medium puzzles, yes — noticeably. On easy puzzles, not at all. Across the whole product surface, **partially**: a tester who only plays easies will see no mechanic at all and will correctly conclude that Foldwink is a Connections clone with a nicer UI.

### Is it elegant?

Yes, technically. One pure helper, one store action, one component, one state field. Less than 200 LOC of mechanic-specific code total. No engine rewrite.

### Is it fair?

Yes. Optional, no penalty, capped at one. The failure modes are "I didn't notice it" and "I wasted it", not "it cheated me".

### Is it robustly implemented?

Mostly. The guards in `winkTab` are explicit. The pure helper is tested. But:

- **M1** (dead `canWinkGroup`) means the guards are duplicated.
- **M8** (winked-then-solved tab loses ✦) means the visual state is incomplete.
- **No visual tests**, so the UI states are only verified by manual inspection.

### Does the current code support continued use without pain?

Yes. The mechanic is extensible: adding a second twist kind (e.g., a timed mode) would require only a new engine helper, a new store field, and a new component variant. The schema slot exists (`revealHint`). No architectural debt would block a second mechanic.

### Classification

**Meaningful** (not cosmetic, not assistive, not product-defining).

- **Cosmetic** would be: tabs that only decorate the UI without affecting play. This isn't that.
- **Assistive** would be: tabs that only help the player when things are going well. The Wink is a real player decision, so this isn't that either.
- **Meaningful** is: a mechanic the player interacts with on at least one dimension that changes their experience of the game. Foldwink Tabs + Wink clears that bar.
- **Product-defining** would require: the mechanic to be load-bearing — remove it and the game falls apart. That's not true here. You can play 66% of the pool (the easies) with no exposure to the mechanic at all and have a fine experience.

The reassessment reports have been claiming "meaningful" for two phases. That is correct. They have also been drifting toward claiming it is the Foldwink identity. That is not quite true yet.

---

## 6. Interface / UX / visual audit

All observations **[Inferred]** from source + Tailwind tokens + component markup. No rendered browser session was observed.

### Title / menu screen _[Inferred]_

- `MenuScreen.tsx:17-87`.
- `Wordmark size="lg" animated` — BrandMark (64 px, animated top-right tile fade) + system-sans `<h1>Foldwink</h1>` + accent underline + Foldwink Tabs + Wink tagline.
- Primary CTA: "Play today's puzzle" (primary) or "Replay daily" (secondary when done).
- Secondary CTA: "Standard puzzle".
- Ghost CTA: "Stats".
- `DailyCompleteCard` appears inline above the CTAs when today is done.
- Footer: `{N} puzzles · dark, calm, daily`.

**Strong:** explicit daily-done inline state, real primary CTA reordering based on state, accent underline under the wordmark, BrandMark animation, brand-consistent surface.

**Mediocre:** system-sans wordmark. No custom mark. The BrandMark motif is a placeholder-ish 4-color tile + blue dot.

**Amateur:** nothing on the menu is actively amateur; the grade is held down by the absence of a designed logotype, not by anything present.

### Onboarding _[Inferred]_

- `Onboarding.tsx:8-87`.
- Full-screen dim + bordered surface card + BrandMark + "Foldwink" title + "How to play" eyebrow + Foldwink Tabs sample (`R··`, `✦ FLY`, `B··`, `S··`) + 4×4 grid illustration with one solved row + 4 bullets (pick 4, mistake budget, Foldwink Tabs, Wink) + "Got it" CTA.
- Flag persisted via `foldwink:onboarded`.

**Strong:** names the mechanic, shows a visual sample of both Tabs and the winked state, has a real "solved row" illustration.

**Weak:** no Escape-to-dismiss, no click-outside-to-dismiss. The Got It button is the only exit. Acceptable for an overlay that is deliberately one-time, not great for power users.

### Game screen _[Inferred]_

- `GameScreen.tsx:61-118`.
- Header (title + subtitle + mistakes dots) → FoldwinkTabs (medium only) → 4×4 Grid → selected count + Clear + Submit → "Quit to menu" underline link.
- Flash ring (`ring-2 ring-solved2` / `ring-2 ring-danger`) around the game container after submit, cleared after 450 ms.

**Strong:** tight hierarchy. FoldwinkTabs sits directly between hud and grid, so any eye movement between header and board passes through it.

**Mediocre:** flash is a solid ring around the _entire_ game container, not a per-card pulse. Subtle but nothing to celebrate.

**Weak:** the "Quit to menu" underlined text link at the bottom is a marginal thumb target on mobile.

### Result screen _[Inferred]_

- `ResultScreen.tsx:42-103`.
- `ResultSummary` (eyebrow + headline + accent underline + `StatStrip(Time · Mistakes · Streak)` + 4 group reveal pills) → optional streak celebration card → loss warmth card (loss only) → daily countdown card (daily only) → framed share card → action buttons.

**Strong:** real finish-line hierarchy. `StatStrip` at the top reads as a finish line. Framed share card is a real container, not a naked button. Loss warmth card is a distinct piece of product thinking.

**Mediocre:** headline is still `Solved` / `Out of mistakes` in plain type. No celebration animation beyond the 320 ms `fw-result-pop` entrance and the streak pulse. A tester expecting "confetti-level" payoff will not get it.

**Weak:** no puzzle-title re-display (which puzzle did I just finish?). The result screen does not remind the player what they won on.

### Stats screen _[Inferred]_

- `StatsScreen.tsx:30-77`.
- Wordmark (sm) + `Your Foldwink record` subtitle → `StatStrip(Solved · Played · Win %)` hero → 6-cell grid → empty-record card (when no games) → Back to menu full-width button.

**Stats grid is structurally broken.** `StatsScreen.tsx:56,57`:

```tsx
<StatCell label="Unique" value={solvedCount} />
<StatCell label="Win Rate" value={`${winRate}%`} />
```

These are the same values already shown in the hero strip (`Solved` and `Win %`). Four of the nine cells are functional duplicates. **This looks like a draft.**

### Mobile feel _[Inferred]_

- Grid `grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto` — works down to 360 px.
- Result screen buttons stack in a column at the bottom.
- `DailyCompleteCard` is `max-w-xs` — fits comfortably on all phone widths.
- Onboarding is `max-w-sm` with `p-4` outer padding.

No layout red flags found in code. **Not observed in a browser.**

### Visual hierarchy _[Inferred]_

Consistent. `text-[10px]`/`text-[11px]` uppercase eyebrows with `tracking-[0.12em]` to `tracking-[0.18em]` on every card-style surface. One accent color. Four solved colors. One surface color. This is a small design system and it's used consistently.

### Brand presence _[Inferred]_

- Wordmark lockup reused on Menu / Onboarding / Stats.
- BrandMark SVG reused across all three.
- Accent underline motif reused.
- Solved palette reused across Cards + Reveal pills + DailyCompleteCard status.

**Brand presence is real but generic.** Nothing looks wrong; nothing looks memorable. A stranger seeing this product for 10 seconds would not recognize it 3 days later.

### Payoff / reward feel

**Inferred weak.** The game-screen submit is a ring flash. The result-screen win is a large "Solved" + StatStrip + 4 reveal pills. The streak celebration is an accent pulse. The Wink being used is a chip label change. No confetti, no sound, no haptics, no distinct transition.

This is consistent with the "minimal, calm, daily" brand stance. It is also the shape of a product that tests will describe as "polite but not memorable".

### Polish level _[Inferred]_

- **What looks strong:** spacing discipline, color token discipline, reused primitives (BrandMark, Wordmark, StatStrip, DailyCompleteCard), consistent eyebrow typography.
- **What looks mediocre:** system-sans wordmark, result-screen payoff, stats-screen grid.
- **What looks amateur:** the `StatsScreen` duplicate cells. The hand-typed 16-span onboarding grid. The OG image's dead anchor text baked into the asset.
- **What still feels temporary:** the favicon, the OG image, the wordmark, the result celebration, the hero on the menu.

---

## 7. Product / gameplay audit

### Clarity of rules

**Strong.** Four bullets in the onboarding cover pick-4, mistake budget, Foldwink Tabs, Wink. The `{N}/4` selected counter and the mistakes-dots row are immediately legible in the game screen.

### Difficulty ramp

**Flat.** 65 easies + 33 mediums, no within-difficulty progression. The validator does not tag difficulty beyond the enum. A player who plays `puzzle-0001` and then `puzzle-0075` will not experience a ramp; the order is alphabetical by filename, not curated.

A committed daily player will see all 98 puzzles within ~3 months at one daily + occasional standard. After that, the pool wraps and the same puzzles reappear. **There is no "you've seen everything" state.**

### Fairness

Validator + editorial pass catches structural issues. Cross-puzzle reuse warnings are inspected. The 33 mediums are roughly 20 classification / 13 word-play. Word-play mediums (`___ FLY / ___ BALL`) still gate non-native English speakers; Phase 2 content work reduced but did not eliminate this.

**Specific risk:** `puzzle-0094 "Rock cycle"` uses specialist petrology vocabulary (Peridotite, Rhyolite, Gneiss, Schist, Tuff). `puzzle-0074 "Long ago"` includes "Herald" in a medieval-roles group — recognizable but not obvious. These are flagged in the Phase 2 content report as "kept but borderline" — accurate.

### Medium puzzle quality

Mixed. The classification mediums (`puzzle-0096 "Under pressure"`, `puzzle-0097 "Festival schedule"`, `puzzle-0066 "State of play"`) are strong. The synonym mediums (`puzzle-0020 "Say it different"`, `puzzle-0062 "Soft and loud"`) are fair but language-gated. The word-play mediums (`puzzle-0019 "Tack it on"`, `puzzle-0061 "Turn the page"`, `puzzle-0068 "Change direction"`) are the most distinctive but also the most English-dependent.

### Daily loop

- Daily-complete inline card on the menu exists.
- Next-daily countdown ticks on both menu and result screen.
- Streak celebration fires on win streak ≥ 2.
- One daily puzzle per local date.

**What's missing:** a "new daily tomorrow" notification, a past-daily calendar, a "longest streak visible on menu when no streak is active", a day-count since registration.

### Retention potential

- Without the mechanic: same as any Connections clone — dependent on content volume.
- With the mechanic: slightly better, because medium players have one more reason to come back.
- **Honest projection:** 0.3.3 is in the retention shape where a committed player gets 2-3 months of runway before the pool exhausts, and where a casual player has no specific reason to return after the first session. Neither case justifies monetization today.

### Content breadth

98 puzzles covering: science, geography, food, music, everyday objects, word-play, language, history, sports, technology, anatomy, mythology, literature, dance, architecture, weather, crafts, transportation, festivals. Breadth is now genuinely respectable.

### Product identity

**Foldwink has a name, a mark, a mechanic, and a tagline.** It is no longer "Cluster Twist rebadged". A reviewer who plays 3 mediums will see the Foldwink Tabs and understand the mechanic.

**It still risks being perceived as a Connections clone** because:

- 66% of the pool has no mechanic.
- The mechanic is a hint, not a puzzle structure.
- The visual language is competent but not distinctive.
- The name is unusual but the game is the familiar 4×4 grouping format.

---

## 8. Content audit

### Pool size

- **98 puzzles** (65 easy + 33 medium).
- Enough for: **internal testing** ✓ / **closed beta** ✓ (5–10 testers for one week) / **open public testing** marginal / **monetization** no.
- For a committed daily player: ~3 months of daily + occasional standard before repeats.

### Diversity

Broad, per the Phase 2 report: science, geography, history, anatomy, literature, mythology, food, sports, dance, music, crafts, transportation, architecture, astronomy, weather, word-play. No domain is over 10% of the pool.

### Quality of easy puzzles

- Mostly concrete-noun identification (Planets, Spices, Flowers, Cheeses, Birds, Tools).
- A few borderline specialist puzzles: `0077 "Stones and sands"` (Bauxite, Magnetite, Hematite, Galena), `0041 "Lab day"` (particles), `0074 "Long ago"` (ancient empires).
- **The easy tier has no difficulty grading within it.** Puzzle 0001 and puzzle 0077 both live at `difficulty: "easy"` but the latter is measurably harder.

### Quality of medium puzzles

- ~20/33 classification-shape (solid).
- ~13/33 word-play / synonym (English-gated).
- Every medium has `revealHint` on all four groups (verified manually in Phase 2).
- **The mechanic helps word-play mediums most** — which is the inverse of where help is most needed (word-play mediums are already the least fair to non-native speakers).

### Repetition risk

Cross-puzzle item reuse: 93 warnings from validator, all intentional per Phase 2 review. A committed player _will_ notice that "Mercury" appears as both a planet and a metal, and that "Samba" appears in two dance puzzles. This is a deliberate false-trail design choice, not an accident.

### Language / culture bias

- **English-language bias:** word-play mediums.
- **Western-knowledge bias:** many puzzles assume European / North American cultural reference points (German dishes, Italian pasta, architecture periods, Greek gods, chess openings).
- **Not explicitly Eurocentric** — there are Asian (`0066 "State of play"` with Go terms), African (`0026` with African capitals), and Latin American (`0095 "On your feet"`) puzzles. But the baseline assumption is a Western-educated player.

### Content runway

| Use case                           | 98 puzzles enough?                                           |
| ---------------------------------- | ------------------------------------------------------------ |
| Internal testing (1 author)        | Yes                                                          |
| Closed beta (5–10 testers, 1 week) | Yes                                                          |
| Open public testing                | Marginal — a committed player exhausts the pool in ~3 months |
| Monetization                       | No — target is 150+ for a free tier with a paid-pack upsell  |

---

## 9. Commercial / release audit

### Would external testers take this seriously?

**Yes, for closed beta**, if and only if the brand-lying defects (H1, H2) are fixed. A tester who opens a shared link today will see an OG preview claiming "One anchor per medium puzzle" and will be confused immediately. The preview describes a product that does not exist.

### What weakens trust?

1. **The OG/meta defect** is the single largest trust weakness. Everything else is downstream.
2. The StatsScreen duplicate cells look like a draft.
3. The wordmark is a system sans — recognizable but not memorable.
4. The favicon is a 2×2 tile motif — passable but identically common across placeholder brand exercises.
5. `foldwink.com` in the share footer is a hardcoded placeholder.

### What weakens desire to return?

1. No notification / hook (deliberate — no accounts).
2. Mid-game refresh drops the attempt (acknowledged).
3. Easy puzzles have no mechanic — no reason to try them beyond the first.
4. No "new today" visual signal beyond the countdown.

### What weakens "worth paying for later" feel?

1. 98 puzzles is below the 150 threshold the reports themselves set.
2. No pay affordance, no supporter link.
3. No designed brand art.
4. No "pack" concept in the content format.
5. Only one mechanic.
6. No second difficulty tier.

### What still blocks broader launch?

In order:

1. Fix H1 + H2 (OG + og.svg).
2. Fix H2 (schema doc — any future author will hit this).
3. Write 0.3.2 + 0.3.3 release notes.
4. Rebrand `CLAUDE.md`.
5. Run the manual QA pass in a real browser.
6. Fix StatsScreen duplicate cells (M2).
7. Render a real PNG OG image.
8. Add an error boundary at App root.
9. Acquire and wire the `foldwink.com` domain (or whatever the real domain is).
10. Decide on logotype / wordmark direction.

### Are the current reports overclaiming readiness?

**Yes.** The Final Release Reassessment says "Releasable as polished indie MVP — for closed beta scope." The engineering deserves that label. The shipping surface does not. Specifically:

- The reassessment lists "No browser QA" as its biggest caveat (correctly) but still classifies the product as closed-beta ready.
- The reassessment does not mention the OG / og.svg anchor-lying defect because that defect is not in the phase's diff.
- The reassessment does not mention the schema doc drift.
- The reassessment does not mention the StatsScreen duplicate cells (they were "intentional for emphasis" per the visual polish report).

These are all surface defects that an auditor running gates + reading the live files in half an hour would catch. The fact that four phases of reports have not caught them is the real signal: **no one has actually sat in front of a tester-facing surface and looked at it critically.**

### Classification

> **Releasable as MVP test.**
>
> **Not** "Releasable as strong closed-beta candidate" until H1, H2, and H3 are fixed.

Once the three HIGH-severity items are fixed (estimated 30–60 minutes of work), the classification jumps to **"Releasable as strong closed-beta candidate"** — one notch below "polished indie MVP", because the brand art / wordmark / hero work are still missing.

**"Releasable as polished indie MVP"** would require all of the §9 items above plus a real browser QA pass and a designed mark.

---

## 10. Top problems

| Rank | Area            | Problem                                                                                                                 | Why it matters                                                                            | Severity   | Recommended next action                                           |
| ---- | --------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| 1    | Brand surface   | `index.html` OG + Twitter meta describes the removed 0.2.0 anchor mechanic                                              | Every shared link lies about the game to every tester                                     | **High**   | Rewrite the two meta descriptions to mention Foldwink Tabs + Wink |
| 2    | Brand asset     | `public/og.svg:24` bakes "One anchor per medium puzzle" into the hero text                                              | The OG image is the first thing any tester sees on a shared link                          | **High**   | Rewrite the SVG text, then later render to PNG                    |
| 3    | Canonical docs  | `docs/PUZZLE_SCHEMA.md` defines and exemplifies a `twist: { kind: "anchor" }` field that the runtime no longer supports | An author following this doc writes puzzles that silently lose the Foldwink Tabs mechanic | **High**   | Rewrite the schema doc around `revealHint` with a medium example  |
| 4    | Project seed    | `CLAUDE.md` still says "Cluster Twist"                                                                                  | Future Claude sessions inherit the wrong product name in their baseline context           | **High**   | Rename + refresh                                                  |
| 5    | Release notes   | `docs/RELEASE_NOTES.md` stops at 0.3.1; `package.json` is 0.3.3                                                         | Two phases of work (visual polish + tightening) are unrecorded; testers have no changelog | **High**   | Add 0.3.2 and 0.3.3 sections                                      |
| 6    | UI polish       | `StatsScreen` renders 4 duplicate-value cells out of 9 total                                                            | Looks like a draft on the first screen a tester opens for stats                           | **Medium** | Drop the `Unique` and `Win Rate` grid cells                       |
| 7    | Mechanic code   | Dead `canWinkGroup` helper — exported, tested, unused in production                                                     | Drift risk: the store's inline guards and the pure helper will desync                     | **Medium** | Either call the helper from `winkTab` or delete the helper        |
| 8    | Mechanic UX     | Winked-then-solved tab in `FoldwinkTabs.tsx` loses its ✦ mark                                                           | Breaks the mechanic's own feedback loop for the specific moment it matters most           | **Medium** | Preserve `winked` indicator in the solved branch                  |
| 9    | Store state     | Duplicate `dailyPlayedDate` + `todayDailyRecord.date` fields                                                            | Two sources of truth for the same fact, updated in lockstep; drift risk                   | **Medium** | Drop `dailyPlayedDate`, derive via selector                       |
| 10   | Tooling hygiene | `.gitignore` leaks `.tsbuildinfo-node/`, `tsconfig*.tsbuildinfo`, `audit-results/`, `*.zip`                             | Repo accumulates build leftovers and historical artefacts on every commit                 | **Medium** | Extend `.gitignore`; delete stale root-level files                |

---

## 11. Top strengths

1. **Pure game engine with real test coverage.** `src/game/engine/*` imports zero React; 6 engine files, 6 test files, all pinning behavior. This is the most trustworthy part of the codebase and it would survive a rewrite of every UI component around it.

2. **Store factory + injectable dependencies.** `createStore(deps: StoreDeps)` in `store.ts:111` — 16 store tests run in plain Node with mock deps, no jsdom. A developer can add a new store action with full test coverage in 10 minutes. Rare discipline for a project this size.

3. **65 tests across 9 suites, all green.** Shuffle, submit, progress, foldwinkTabs (18!), share, countdown, stats, daily selector, store. Real behavior, not surface coverage.

4. **Persistence subscriber is a single 58-LOC file.** `appStore.ts` is the clean seam between a pure store and browser localStorage. Adding a new persisted slice is a 3-line change.

5. **Solved-color single source of truth.** `src/game/solvedColors.ts` eliminates the cross-screen color bug that the first audit found. `colorIndexForGroup` is called from Card, GameScreen, ResultSummary, and FoldwinkTabs.

6. **`foldwinkTabs.ts` is a 105-LOC pure module** with three functions (`revealStage`, `hintFor`, `buildFoldwinkTabs`) and a dedicated interface. 18 tests. The mechanic's core is genuinely small.

7. **Wink action is 10 lines with 6 guards.** `store.ts:290-299` is the shortest meaningful new action in the codebase. No hidden complexity.

8. **Validator is strict enough to matter.** `scripts/validate-puzzles.ts` fails on duplicate items within a puzzle, duplicate puzzle ids, malformed groups, and malformed `revealHint`. It also warns on cross-puzzle reuse — a real content-drift signal.

9. **ESLint flat config + CI both exist and work.** `eslint.config.js`, `.github/workflows/ci.yml`. The lint passes with 0 warnings. The CI runs the full gate chain.

10. **Bundle is 74 kB gzip for 98 puzzles.** 226 kB raw JS includes React, ReactDOM, Zustand, every component, every puzzle. The engineering has stayed disciplined on dependency weight across every phase.

---

## 12. Brutal truth section

**What still looks amateur:**

- The OG meta tags and the OG image actively lying about the mechanic. The fact that four phases of reports missed this is diagnostic.
- `StatsScreen`'s duplicate-value cells.
- The schema doc describing a dead field.
- `CLAUDE.md` still saying "Cluster Twist".
- Release notes two phases behind package.json.

**What now looks genuinely competent:**

- The pure engine and its tests.
- The store factory pattern.
- The persistence subscriber seam.
- The Foldwink Tabs + Wink pure helpers.
- The 98-puzzle validator-clean pool.
- The CI + lint + Prettier setup.

**What still feels like LLM-generated filler or over-documentation:**

- The 16 hand-typed `<span>` elements in `Onboarding.tsx:40-57` — the single most generated-looking block in the codebase.
- `docs/reports/` — ten reports across six phases, each claiming progress, none having caught the anchor OG defect. The reports are extensive and professional in tone but they are the audit equivalent of a dashboard: they prove activity, not outcome.
- `docs/content/PUZZLE_EDITORIAL_GUIDELINES.md` and `docs/research/RESEARCH_SOURCES.md` — both are thorough and both are only touched by the author; no external editor has validated them.

**What would a good external tester notice first:**

- On a link share: the OG preview says "anchor" and the app says "Foldwink Tabs". This is the first 5 seconds of the experience and it is wrong.
- On opening the app: the menu is clean and the Wordmark is readable but unmemorable.
- On finishing a standard-mode easy puzzle: the win feels polite, not rewarding. There is no celebration beyond the StatStrip and the 4 reveal pills.
- On the stats screen: "Wait, are Solved and Unique the same thing?"
- On the daily replay: the subtitle says "· replay" and the wink works but nothing is tracked — minor surprise.

**What would make them stop playing:**

- Exhausting the medium pool (33 puzzles) in 10 daily plays.
- Running into two word-play mediums in a row (low-probability but possible given the alphabetical order in standard mode).
- Finding the StatsScreen duplication and concluding the product is unfinished.
- Clearing localStorage and reloading — losing everything silently.

**What would make them think "this is actually interesting":**

- The Foldwink Tabs reveal the first time a letter appears after they solve a group. Inferred; this is the single moment the product earns its name.
- Using the Wink on a stuck medium and finishing the puzzle. Inferred; scarcity + payoff in one tap.
- The DailyCompleteCard showing tomorrow's countdown after a win. Inferred; this is the retention hook.

**If the team asked for money soon:**

- The OG defect alone would kill it.
- 98 puzzles is below the 150 threshold the reports themselves set.
- No pay affordance, no supporter link, no branded domain.
- No second mechanic, no difficulty ladder.
- The wordmark and favicon are placeholder-grade.
- Any tester who paid would write an honest review that mentions all of the above.

Do not ask for money. Not this phase, not next phase.

---

## 13. Final recommendation

> **Good closed-beta candidate after small tightening.**

**Justification:**

The engineering underneath this product is closed-beta ready. The pure engine, the store, the persistence, the tests, the CI, the mechanic implementation, and the 98-puzzle pool all clear the bar. A tester who bypasses any shared-link preview and opens the app directly will have a consistent, small, honest indie puzzle experience with a real signature mechanic on 33 of 98 puzzles.

The shipping surface is not closed-beta ready, but the gap is small and mechanical:

1. Fix H1: rewrite the two meta descriptions in `index.html`. **5 minutes.**
2. Fix H2: rewrite `public/og.svg:24`. **5 minutes.**
3. Fix H3: rewrite `docs/PUZZLE_SCHEMA.md` around `revealHint`. **15 minutes.**
4. Fix H4: rename `CLAUDE.md`'s product references. **5 minutes.**
5. Fix H5: write 0.3.2 + 0.3.3 sections in `docs/RELEASE_NOTES.md`. **10 minutes.**
6. Fix M2: drop the two duplicate `StatsScreen` cells. **5 minutes.**
7. Fix M1 OR delete `canWinkGroup`. **5 minutes.**
8. Fix M8: preserve ✦ on solved-winked tab. **5 minutes.**
9. Fix M7: extend `.gitignore`, delete stale root files. **10 minutes.**
10. Run the manual QA pass **in a real browser** for 30 minutes.

Total: **~90 minutes of focused work**. That is the gap between "closed-beta candidate after tightening" and "strong closed-beta candidate".

Do **not** start a new phase. Do **not** add new features. Do **not** write another report without first running the list above and verifying each item in a rendered browser tab.

---

## 14. Appendix

### Evidence map — key files

| File                                            | Role in audit                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `package.json:4`                                | `version: "0.3.3"` — release notes stop at 0.3.1. H4 evidence.                                 |
| `index.html:14`                                 | OG description references removed anchor mechanic. H1 evidence.                                |
| `index.html:20`                                 | Twitter description references removed anchor mechanic. H1 evidence.                           |
| `public/og.svg:24`                              | Hero text "One anchor per medium puzzle" baked into the OG asset. H2 evidence.                 |
| `docs/PUZZLE_SCHEMA.md:14-19,47-63,95`          | Schema doc defines a `twist: { kind: "anchor" }` field that the runtime removed. H3 evidence.  |
| `CLAUDE.md:3,9`                                 | Project-instruction file still says "Cluster Twist". H4 evidence.                              |
| `docs/RELEASE_NOTES.md:3`                       | Newest entry is 0.3.1, two phases behind package.json. H5 evidence.                            |
| `src/screens/StatsScreen.tsx:38-47,52-57`       | 4 duplicate-value cells in a 3+6 grid. M2 evidence.                                            |
| `src/game/engine/foldwinkTabs.ts:93-103`        | `canWinkGroup` helper — exported, tested, unused by production. M1 evidence.                   |
| `src/game/state/store.ts:290-299`               | Inline duplicate of `canWinkGroup` guards in `winkTab`. M1 evidence.                           |
| `src/components/FoldwinkTabs.tsx:51-59,83-88`   | Solved branch omits the ✦ mark that the winked branch adds. M8 evidence.                       |
| `src/game/state/store.ts:27-28,148,221,234,241` | Duplicate `dailyPlayedDate` + `todayDailyRecord.date` state. M3 evidence.                      |
| `src/game/state/store.ts` LOC                   | 301 lines — past the 300-LOC smell threshold. M4 evidence.                                     |
| `scripts/validate-puzzles.ts:2`                 | Header comment says "Cluster Twist puzzle validator". M5 evidence.                             |
| `scripts/validate-puzzles.ts:29`                | Inline `PuzzleGroup.editorialNotes?` field not in runtime type. M6 evidence.                   |
| `.gitignore`                                    | Missing `.tsbuildinfo-node/`, `tsconfig*.tsbuildinfo`, `audit-results/`, `*.zip`. M7 evidence. |
| `src/puzzles/loader.ts:3`                       | `eager: true` glob — 98 puzzles inlined into the bundle. Fine at this size.                    |
| `src/game/engine/foldwinkTabs.ts`               | 105 LOC pure module. The mechanic's core.                                                      |
| `src/game/state/store.ts`                       | 301 LOC store factory with injectable deps + wink action.                                      |
| `src/game/state/appStore.ts`                    | 58 LOC persistence subscriber — clean seam.                                                    |
| `src/components/FoldwinkTabs.tsx`               | 93 LOC component; 3 rendering branches.                                                        |
| `src/components/StatStrip.tsx`                  | 52 LOC shared metric-strip primitive.                                                          |
| `src/components/Wordmark.tsx`                   | 43 LOC brand lockup.                                                                           |
| `src/components/DailyCompleteCard.tsx`          | 55 LOC daily return hook.                                                                      |
| `puzzles/pool/*.json`                           | 98 files, all validator-clean.                                                                 |

### Commands run (in order)

```
cat package.json
ls -la / src / docs / public
wc -l src/**
grep -H "version" package.json
grep -n "anchor" index.html public/og.svg docs/PUZZLE_SCHEMA.md
grep -n "Cluster Twist" CLAUDE.md README_START_HERE.md FOLDWINK_MASTER_MEGA_PROMPT.md
grep -rn canWinkGroup src/
grep -n "dailyPlayedDate" src/
grep -n "editorialNotes|editorialSummary" src/ scripts/
grep -n "73 puzzles|98 puzzles|42 puzzles" docs/
grep -n "inferred|Inferred|browser session" docs/reports/*.md
cat .gitignore
npm run typecheck
npm test
npm run lint
npm run validate
npm run build
```

Plus targeted reads of every file in `src/` and every file in `docs/reports/`.

### Runtime inspection limitations

**No browser session was opened.** `npm run preview` was not run against a real browser. No user interaction with a rendered page. All visual conclusions are inferred from source + tokens + markup.

This is the same limitation the Final Release Reassessment acknowledges. It is accurate. It is also the single biggest gap between the reports and the actual product surface — an actual in-browser pass would have caught H1 (OG meta) and H2 (OG asset) immediately, because the first thing a tester does is share a link and see the preview.

### Inconsistencies found between docs/reports and current repo

| Doc / report                                        | Claim                                                                  | Current reality                                                                                                                        |
| --------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/RELEASE_NOTES.md`                             | Newest release: 0.3.1                                                  | `package.json` is 0.3.3                                                                                                                |
| `docs/PUZZLE_SCHEMA.md`                             | Medium puzzles use `twist: { kind: "anchor" }`                         | `Puzzle` type has no `twist` field; runtime uses `PuzzleGroup.revealHint`                                                              |
| `CLAUDE.md`                                         | Product is "Cluster Twist"                                             | Product is Foldwink across code and live docs                                                                                          |
| `index.html` OG / Twitter meta                      | "One anchor card on every medium puzzle"                               | Anchor mechanic removed in 0.3.0, replaced with Foldwink Tabs + Wink                                                                   |
| `public/og.svg:24`                                  | "One anchor per medium puzzle" baked into hero                         | Same                                                                                                                                   |
| `FOLDWINK_FINAL_RELEASE_REASSESSMENT.md` §4.1       | "No browser QA has been run in-session" (stated as the biggest caveat) | Correct — this is the one honest self-report the reports have                                                                          |
| `FOLDWINK_VISUAL_POLISH_REPORT.md` §Inferred scores | UI Quality 7/10                                                        | Inferred; consistent with code; would need browser verification for "what looks strong"                                                |
| `FOLDWINK_MANUAL_QA_CHECKLIST.md`                   | Actionable 30–45 min pass                                              | Correct format; has not been actually run in a browser per any phase report                                                            |
| `FOLDWINK_ORIGINALITY_UPGRADE_REPORT.md`            | Describes the anchor twist mechanic as Foldwink's signature            | Stale — the anchor was removed in 0.3.0 and this report is from the pre-0.3.0 phase. Kept as historical record, but not marked as such |
| Validator header                                    | "Cluster Twist puzzle validator"                                       | Should say Foldwink                                                                                                                    |
| `scripts/validate-puzzles.ts:29`                    | `editorialNotes?: string` field in type                                | Not in runtime type; dead                                                                                                              |

**The pattern:** each phase's report was honest about that phase's work. No phase report was honest about surface defects from prior phases that survived into the current build. The reports are reliable as phase records and unreliable as product-state records.
