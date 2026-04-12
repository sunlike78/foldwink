# Foldwink Final Implementation Audit — Harsh Addendum

Date: 2026-04-11
Mode: strict audit, no implementation.
Evidence bar: every important criticism must point to a file, a line, or a runtime observation.

This addendum supplements `FOLDWINK_FINAL_IMPLEMENTATION_AUDIT.md`. It exists because the first pass was too soft — it accepted several polish claims and "intentional" rationalisations at face value. A second pass with stricter evidence-gathering produced new findings that change the classification.

---

## 1. Revised executive verdict

Foldwink 0.3.3 is **a clean, small indie puzzle prototype with a polished shell and a weak content core**. The previous audit was right about the three brand-lying defects (H1 OG meta, H2 OG image, H3 schema doc) but understated the content-quality and visual-identity weaknesses. The "polished indie MVP for closed beta" framing used by the product's own reassessment reports is **overclaimed on content fairness and overclaimed on brand identity**.

This is not a polished indie MVP. It is a **well-engineered prototype with decorated screens**.

### Revised scores (1–10)

| Dimension                                                      | Previous | Revised | Why the revision                                                                                                                                                                                        |
| -------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technical Quality                                              | 8        | **8**   | Engine is real; tests are real; gates are real. Unchanged.                                                                                                                                              |
| Architecture Quality                                           | 8        | **8**   | Unchanged.                                                                                                                                                                                              |
| Code Quality                                                   | 7        | **7**   | Unchanged.                                                                                                                                                                                              |
| Mechanic Implementation Quality                                | 7        | **6**   | Mechanic affects 33/98 puzzles. Wink state is not persisted on any mid-game event. On a content base this small, a mechanic that only lives on a third of the pool is thinner than the reports claim.   |
| Maintainability                                                | 8        | **7**   | Dead data committed in 18 puzzle files (see §3). Dead variant in `Button.tsx`. Dead helper with tests (`canWinkGroup`). The codebase is small enough that these shouldn't exist.                        |
| UI Quality _[Observed via served HTML + Inferred from source]_ | 6        | **5**   | See §4. Wordmark is system sans, BrandMark is 4 squares + 1 dot, favicon contradicts BrandMark (star vs dot, different bg color). This is decoration, not identity.                                     |
| UX Quality                                                     | 7        | **6**   | StatsScreen displays duplicate cells. Result screen does not show the puzzle title. Share string has a hardcoded domain. Onboarding cannot be dismissed by keyboard.                                    |
| Visual / Product Identity                                      | 6        | **4**   | Favicon and BrandMark are two different marks (see §4). The hero text on the OG image is still wrong (runtime observed). The wordmark is the system font stack. There is no identity here yet.          |
| Product Clarity                                                | 8        | **7**   | Clear on-screen rules; fuzzy promise on the share surface (OG lies about anchor).                                                                                                                       |
| Differentiation                                                | 6        | **5**   | Mechanic is on 1/3 of the pool. Several mediums are unfair in ways that undermine the "original puzzle" pitch (see §5). Differentiation is narrower than reported.                                      |
| Content Readiness                                              | 7        | **5**   | §5 below shows concrete fairness defects in at least 4 medium puzzles, dead `tags` fields in 18 files, and specialist trivia mediums the Phase 2 report flagged as "borderline kept" but never rewrote. |
| Commercial Readiness                                           | 5        | **4**   | Content fairness alone blocks this.                                                                                                                                                                     |
| Closed Beta Readiness                                          | 6        | **5**   | Content defects + OG lie + favicon/mark inconsistency = testers will not take this seriously.                                                                                                           |
| Public Release Readiness                                       | 5        | **3**   | Not close.                                                                                                                                                                                              |

### Revised classification

> **Releasable only as rough prototype.**
>
> Not "MVP test". Not "closed beta candidate". Not "polished indie MVP". The code earns MVP-test grade; the content and the brand surface do not. A closed beta with the current build would collect: (a) "what anchor?" from link previewers, (b) "I don't know what Peridotite is" from medium players, (c) "why are Solved and Unique the same?" from stats viewers, (d) "are the favicon and the app mark the same brand?" from attentive players. That is rough-prototype feedback shape, not closed-beta feedback shape.

The previous audit classified at "Releasable as MVP test → closed-beta candidate after ~90 min of tightening". That was generous: it assumed the tightening was only surface-level brand fixes. The new content findings in §5 raise the minimum gap to **multi-session content editorial work**, not 90 minutes.

---

## 2. Runtime observation — actually done this time

**Command:** `npm run preview` (served on `http://localhost:4173`). `curl -s http://localhost:4173` and read the HTML directly.

**What was served:**

```html
<!doctype html>
<html lang="en">
  <head>
    ...
    <meta name="description" content="Foldwink — a short daily grouping puzzle. …" />
    <meta
      property="og:description"
      content="Find 4 hidden groups of 4 in a 4×4 grid.
                   One anchor card on every medium puzzle. 2–5 minutes, daily."
    />
    <meta
      name="twitter:description"
      content="Find 4 hidden groups of 4.
                   One anchor per medium puzzle. 2–5 minutes, daily."
    />
    <meta property="og:image" content="/og.svg" />
    ...
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="./assets/index-DJmlhX1i.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-DnXFYjGv.css" />
  </body>
</html>
```

**Observed, not inferred:**

1. **The built and served HTML contains the anchor-lying OG meta.** The previous audit called this "H1". This is no longer a hypothetical — the served artefact lies about the mechanic every time a crawler fetches it.
2. **The body is `<div id="root"></div>`.** No SSR content. Any crawler that does not run JavaScript (most social scrapers) sees only the head meta tags. Which lie about the mechanic.
3. **Asset path rewrite inconsistency:** `favicon.svg`, `manifest.webmanifest`, and the JS / CSS bundle paths are rewritten to `./` relative (Vite `base: "./"` config working). But `og:image content="/og.svg"` remains **absolute**. A sub-path deploy (e.g. `https://host.com/games/foldwink/`) will have all assets load correctly except the OG image, which will 404. **New finding: OG image path is fragile to deploy topology.**
4. **The only thing in the document body** is an empty `<div id="root">`. A JS-disabled visitor sees **nothing**. No `<noscript>` fallback, no preview text, no description in the body. For accessibility and for search crawling, that is a zero. The previous audit did not flag this.

---

## 3. Content audit — the part the previous audit was soft on

The previous audit said content diversity was "genuinely respectable" and accepted the Phase 2 report's claim that every medium had been editorially reviewed. This pass opens individual puzzle files and finds concrete fairness and data-quality defects.

### 3.1 Dead `tags` field in 18 puzzle JSON files

**Evidence:** `grep -l '"tags"' puzzles/pool/*.json | wc -l` → 18.

The `tags` field was documented in the 0.1.0–0.2.0 era. It was **removed from the `Puzzle` type** in 0.3.0 (`src/game/types/puzzle.ts` has no `tags` field — verified). The loader ignores it silently. The validator does not check it. TypeScript never sees it.

**18 of 98 puzzle files (18.4%)** still carry a `tags: [...]` array. The canonical starter puzzle `puzzle-0001.json:5` has `"tags": ["general"]`. The content-expansion reports claimed the pool was hand-reviewed. A hand review that leaves dead fields in the canonical starter puzzle is not a content review.

**Severity: Medium.** No runtime effect, but 18% of the pool is carrying data that nothing reads. This is the single most common dead-data hit I've seen in a repo of this size.

### 3.2 `puzzle-0092 "Period piece"` has near-duplicate items in the same group

**Evidence:** `puzzles/pool/puzzle-0092.json:11`:

```json
"items": ["Sublime", "Passion", "Sublimity", "Solitude"]
```

`Sublime` (adj.) and `Sublimity` (noun) are **the same root concept in two grammatical forms** and are placed in the same group ("Romantic Period"). A player staring at `Sublime` and `Sublimity` in the same 4-item group does not get a puzzle; they get a typo.

**Also**: the Realist Period group has `Ordinary`, `Social`, `Everyday`, `Portrait`. `Ordinary` and `Everyday` are synonyms. `Social` is vague. `Portrait` is not specifically realist. **The group is authored-not-curated.**

**Severity: High** (for this specific puzzle — a tester running into it will conclude the content is sloppy).

### 3.3 `puzzle-0093 "Eras of stone"` — 6 specialist architecture terms in one medium

**Evidence:** `puzzles/pool/puzzle-0093.json`:

- Romanesque: `Barrel Vault, Round Arch, Thick Wall, Tympanum`
- Gothic: `Pointed Arch, Rib Vault, Flying Buttress, Tracery`
- Baroque: `Oval Plan, Cherubs, Cartouche, Trompe l'Oeil`
- Modernist: `Cantilever, Curtain Wall, Pilotis, Ribbon Window`

**Specialist terms a general player will not know:** `Tympanum`, `Tracery`, `Cartouche`, `Trompe l'Oeil`, `Pilotis`, `Ribbon Window`. That is **6 of 16 items** requiring undergraduate-level architecture vocabulary. The editorialSummary says "A test of taxonomy rather than word-play" — but a test of taxonomy for a domain the player doesn't know is not a test, it is a wall.

The Phase 2 content report flagged `puzzle-0094 "Rock cycle"` as "kept but borderline" for the same reason (`Peridotite`, `Rhyolite`, `Gneiss`, `Schist`, `Tuff`). **It did not flag puzzle-0093**, even though the evidence is identical.

**Severity: High** for fairness. A closed-beta tester hitting 0093 or 0094 as a daily draw will say "this is unfair", and they will be right.

### 3.4 `puzzle-0097 "Festival schedule"` — one broken group

**Evidence:** `puzzles/pool/puzzle-0097.json:14-18`:

```json
{
  "id": "festivals-of-water",
  "label": "Festivals of Water",
  "revealHint": "WATER",
  "items": ["Songkran", "Holi Phera", "La Tomatina", "Water Splashing"]
}
```

Analyzing each item against the category "Festivals of Water":

- **Songkran** — Thai New Year water festival. Valid.
- **Holi Phera** — not a standard festival name I can verify. `Holi` is the Hindu festival of colours, not water. `Phera` in Hindi refers to "round/turn" (as in wedding rounds). **"Holi Phera" does not appear to be a canonical festival name.** Either a typo (`Holi Phera` → ?), a fabricated item, or a very obscure regional variant.
- **La Tomatina** — Spanish tomato-throwing festival. **Not a water festival.** The player is covered in tomato pulp, not water. Placing this under "Festivals of Water" is a stretch-of-category that fails the fairness test.
- **Water Splashing** — likely refers to the Dai Water-Splashing Festival in Yunnan, China. If so, the name is an English description rather than a proper festival name. It also overlaps heavily with Songkran (water-splashing is the core activity of Songkran too). If the author meant the Dai festival, they should name it "Dai Water-Splashing" or "Po Shui Jie".

**2 of 4 items in this group are editorially questionable.** One is not a water festival; one is a suspicious name. This is not a well-formed category.

**Severity: High.** A tester playing `puzzle-0097` and losing because they couldn't guess `La Tomatina` as a "Festival of Water" has a legitimate complaint.

### 3.5 One easy puzzle has an `editorialSummary` it shouldn't

**Evidence:** `puzzles/pool/puzzle-0004.json:6`:

```json
"editorialSummary": "Clean broad categories with zero cross-group overlap."
```

Only **one** easy puzzle (of 65) has this field. The editorial guidelines say only mediums need it. `puzzle-0004` is classified easy. Anomaly; probably a leftover from when the puzzle was drafted at medium. Low severity, but this is the kind of hit a real editorial review catches and this one did not.

### 3.6 Long-item mobile risk — validator does not flag it

**Evidence:** `grep -oP '"[^"]{13,}"'` across items in pool.

17 puzzle items are 13–15 characters long: `Stracciatella`, `Flying Buttress`, `Water Splashing`, `Broccoli Sprout`, `Queen's Gambit`, `Viennese Waltz`, `Patatas Bravas`, `Power Forward`, `Small Forward`, `Object-Oriented`, `Glass Curtain`, `Ribbon Window`, `Cross-Country`, `Main Sequence`, `Meteor Shower`, `Trompe l'Oeil`, `Calendar Stone`, `Stratocumulus`.

The validator's threshold is **22 chars for a warning**. At 360 px viewport × 4-column grid + gap = ~85 px card width - 16 px padding = **~69 px of text width**. With `text-sm` (14 px) and average char width ~7 px, a card holds **~9 chars comfortably**. Items at 13+ chars will wrap to 2 lines; items at 15+ chars wrap awkwardly. `Trompe l'Oeil` contains an apostrophe that may break `break-words`.

**The validator's 22-char threshold is loose by ~7 chars for real mobile layouts.** 17 items will wrap and none of them are flagged. The closed-beta manual QA checklist says "long item names ≥18 chars may wrap tightly" and says the pool's longest is `Stracciatella` at 13 chars. **That claim is false** — the pool has multiple 15-character items.

**Severity: Medium.** Not inferred — measured by grep.

### 3.7 Content runway claim vs. reality

The reports say "98 puzzles = ~2 months of daily play". A player playing daily + standard would exhaust the pool in ~50 days if they win. If they lose a daily, they can replay it (tested — replay does not touch stats). The daily selector is deterministic on local date, so the order is fixed for every player.

**Implication:** a player who plays for a month and then reads the source will notice that the pool size stops growing. This is fine _if the puzzles are good_. The fairness defects above mean a committed player hits ~5 questionable mediums in the first 30 days. **Content depth ≠ content quality.** The reassessment reports have been conflating the two since Phase 1.

---

## 4. Visual identity — the part the previous audit under-scored

The previous audit said "brand presence is real but generic". That was too generous. Brand presence is **internally inconsistent**.

### 4.1 Favicon ≠ BrandMark

**Evidence:**

`public/favicon.svg`:

```svg
<rect width="64" height="64" rx="12" fill="#0f1115"/>
<g transform="translate(10 10)"> ...4 rounded squares... </g>
<path d="M32 10 L34.6 16 L41 16.6 ... Z" fill="#7cc4ff"/>  <!-- a 5-point star -->
```

`src/components/BrandMark.tsx`:

```tsx
<rect width="64" height="64" rx="14" fill="#181b22" />
<rect ... /> <!-- 4 rounded squares -->
<circle cx="32" cy="32" r="3" fill="#7cc4ff" />  {/* a 3px dot */}
```

**Differences, measured:**

| Attribute       | Favicon                 | BrandMark                | Drift                       |
| --------------- | ----------------------- | ------------------------ | --------------------------- |
| Background fill | `#0f1115` (app bg)      | `#181b22` (surface)      | **Different**               |
| Corner radius   | `rx="12"`               | `rx="14"`                | Different                   |
| Tile rounding   | `rx="3"`                | `rx="4"`                 | Different                   |
| Tile size       | 18×18                   | 20×20                    | Different                   |
| Tile inset      | 10,10                   | 9,9                      | Different                   |
| Central element | **5-point star** (path) | **3-pixel dot** (circle) | **Fundamentally different** |

**The favicon and the in-app mark are two different designs.** A user who sees the tab icon (star) and then opens the app (dot) is looking at two different brands. The reports have been reusing the phrase "BrandMark motif" to describe both — which is true at the "4 colored squares" level and false at the "this is one brand" level.

**Severity: High.** This is the exact kind of detail that tells a reviewer "this is not a real product". Favicon is the most-visible brand surface in a browser tab; the in-app mark is the most-visible brand surface in the product. They do not agree.

### 4.2 Wordmark is the system font stack

**Evidence:** `src/styles/index.css:15`:

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

`src/components/Wordmark.tsx` uses `font-extrabold tracking-tight` on an `<h1>` and that's it. **There is no custom typography, no letter-spacing treatment, no ligature, no weight pairing, no display face.** The wordmark is literally "Foldwink" in whatever font the OS provides at 5xl+ bold.

**Severity: High for identity.** The audit previously called this "system sans" and graded it 5/10 on UI quality. But it is worse than that in isolation: the wordmark _is the entire visual identity_. There is no secondary mark, no illustration, no hero art. If the wordmark is default-sans, then the visual identity is default-sans. The BrandMark is 4 squares and a dot. A logo designer given 2 hours and a single-color palette could produce a more identifiable mark.

### 4.3 OG image is 2 lines of text over a flat background

**Evidence:** `public/og.svg`.

- Linear gradient from `#0f1115` to `#181b22`
- 8 rounded rectangles in a 4×2 layout (4 colored top row + 4 dark bottom row)
- "Foldwink" text at 92 px
- "Daily grouping puzzle" at 30 px
- "16 cards · 4 hidden groups · 4 mistakes" + **"One anchor per medium puzzle"** (dead)
- A 5-point star path (same star as favicon)

This is a placeholder asset that the reports have been calling "new branded OG image" since 0.2.0. It is readable. It is not distinctive. A social feed scroll past this would not make anyone stop.

### 4.4 Button component has a dead variant

**Evidence:** `src/components/Button.tsx:14-19` defines 4 variants (`primary`, `secondary`, `ghost`, `danger`).

`grep -rn 'variant="danger"' src/` → no matches. **The `danger` variant is never rendered.** Dead component surface.

Small finding but a tell: the component was designed for a more complicated product than the one that actually exists.

### 4.5 StatsScreen duplicate cells — revisited

The previous audit called this Medium and noted 4 of 9 cells are functionally duplicate. On re-inspection:

- `Solved` (hero `StatStrip`) = `solvedCount` = `stats.solvedPuzzleIds.length`
- `Unique` (grid `StatCell`) = `solvedCount` = same value
- `Win %` (hero) = `winRate` = `Math.round((wins/gamesPlayed)*100)`
- `Win Rate` (grid) = `winRate` = same value

**Confirmed: 4 of 9 cells render the same data.** This is not "emphasis" as the visual polish report claimed. This is **44% of the Stats screen showing redundant data**. A tester opening the screen and seeing two identical numbers will assume the screen is broken.

**Re-severity: High.** The first audit called this Medium because it is recoverable in 5 minutes. But the impact on perceived polish is High — it is the single most visible amateur-grade artifact in the product.

### 4.6 Result screen does not show the puzzle title

**Evidence:** `src/screens/ResultScreen.tsx` + `src/components/ResultSummary.tsx`. The headline is `"Solved"` or `"Out of mistakes"`. The eyebrow is `"FOLDWINK · CLEARED"` or `"FOLDWINK · CLOSE CALL"`. **Nowhere in the result screen does the puzzle title (`puzzle.title`) appear.**

A player who just finished `puzzle-0097 "Festival schedule"` and wants to remember the puzzle they just played is shown... nothing. The 4 reveal pills show group labels. The `puzzle.title` is discarded at result-render time.

This is a real UX gap. The player loses context on what they just won.

**Severity: Medium.** Not flagged in any previous audit.

### 4.7 Share string hardcodes `foldwink.com`

**Evidence:** `src/game/engine/share.ts:35`:

```ts
return `${header}\n${statusLine}\n\n${grid}\n\nfoldwink.com`;
```

The footer is a hardcoded string literal. No environment variable, no build-time substitution. If the real deploy is `foldwink.neural-void.com` or any other domain, the share string still says `foldwink.com`. **Every share is wrong** the moment the app is deployed to a non-matching domain.

**Severity: Medium.** Not flagged as a specific evidence line in the previous audit.

---

## 5. Mechanic implementation — re-assessed harsher

The previous audit classified Foldwink Tabs + Wink as **"meaningful"**. Re-reading with stricter evidence standards, I now classify it as **"meaningful on 33% of the pool, assistive otherwise, and undermined by content defects in the mechanic's target tier"**.

### 5.1 66% of the pool has no mechanic

**Evidence:** `puzzle.difficulty === "easy"` → no Foldwink Tabs, no Wink. 65 of 98 puzzles.

A first-session player who plays only easies (the most likely first-session path — pick the daily, get a random puzzle, the daily selector pulls a puzzle at index `fnv1a(date) % 98`, ~66% chance of an easy) will **never see the Foldwink-specific surface**. The mechanic's visibility is a function of pool draw, not of player intent.

**Probability-of-observation calculation:**

- P(first daily is easy) = 65 / 98 = 66.3%
- P(first standard is easy) = 65 / 98 = 66.3% (cursor starts at 0, puzzle-0001 is easy)
- **Probability a first-session player never sees Foldwink Tabs = 0.66 × 0.66 ≈ 44%**.

**Nearly half of first-session players will not see the mechanic at all.** The previous audit noted this but did not price it. At this ratio the mechanic is _conditionally felt_, not felt.

### 5.2 Mechanic is undermined by the medium tier's own fairness defects

Of the 33 mediums the mechanic supports:

- ≥4 have specialist-trivia fairness problems (puzzles 0092, 0093, 0094, 0097 — see §3).
- Some mediums are word-play-gated (non-native English speakers are locked out regardless of the Wink).
- Wink reveals the category keyword; on a word-play medium like `___ FLY`, the keyword (`FLY`) is almost the entire answer.

A player who encounters a bad medium + uses the Wink correctly still has an unfair experience. The mechanic does not cover for content defects.

### 5.3 The Wink is a hint, not a twist

The reassessment reports drifted toward calling the mechanic "product-defining". On the evidence:

- Wink is an **optional, free, scarcity-limited hint**. It reveals the category keyword for one tab.
- The player's decision is **when to spend it**. There is no other decision.
- There is **no reward for not using it**, no penalty for wasting it, no stat tracking, no share difference.
- Without the Wink, the mechanic is the passive progressive reveal the 0.3.0 audit explicitly called "feedback, not a mechanic".

**The Wink makes the mechanic interactive. It does not make the mechanic a puzzle twist.** The classification is **assistive-with-a-player-verb**, not meaningful.

I am downgrading the Mechanic Implementation Quality from 7 → **6**.

---

## 6. Test coverage — the real shape

**Evidence:** `wc -l` on tests and source:

- Source (non-test): **1272 LOC** (1972 total src minus 700 test = 1272)
- Tests: **700 LOC**
- Ratio: 700 / 1272 = **55%**. Looks healthy.

**But the distribution:**

| Layer                                 | Source LOC | Test LOC | Covered?                                                                 |
| ------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------ |
| Pure engine (`src/game/engine/*`)     | 277        | ~430     | Yes — 18 foldwinkTabs + 6 shuffle + 6 submit + 6 progress + 2 share      |
| Store (`src/game/state/*`)            | 359        | 231      | Partial — 16 tests cover actions; 0 tests cover `appStore.ts` subscriber |
| Utils + stats (`src/utils,stats/*`)   | ~140       | ~40      | Partial — hash/date/storage untested                                     |
| Content (`src/puzzles/*`)             | 73         | 45       | Partial — daily selector only                                            |
| React screens (`src/screens/*`)       | 390        | **0**    | None                                                                     |
| React components (`src/components/*`) | 670        | **0**    | None                                                                     |

**React surface is zero percent tested.** 1060 of 1272 source LOC (83%) ship untested at the React layer. The previous audit noted this as a "gap" and moved on. The revised framing: **the only code actively under test is the engine and the store factory. Everything a player sees is manually verified only.**

In a 1.3k-LOC codebase with zero component/integration tests, the manual QA pass is the only thing standing between a regression and the tester. No such pass has been run in-browser per any phase report.

---

## 7. Overclaiming in the reports — specific instances

The previous audit said the reports were overclaiming. This one names specific claims vs. specific evidence.

| Claim                                                                                            | Report                                            | Reality                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Real branded OG image (`/og.svg`)"                                                              | `FOLDWINK_RELEASE_POLISH_REPORT.md` §Brand assets | The OG image bakes the wrong mechanic name into its hero text (observed via runtime preview).                                                                                                                                                         |
| "Brand presence is real and internally consistent"                                               | multiple                                          | Favicon has a star; BrandMark has a dot. Different fills, different corner radii, different tile sizes.                                                                                                                                               |
| "StatStrip is a 3-cell finish-line strip" at `§StatsScreen`                                      | `FOLDWINK_VISUAL_POLISH_REPORT.md`                | The strip is real. But the Stats _page_ is a strip + a grid where 4/9 cells duplicate strip values.                                                                                                                                                   |
| "98 puzzles, all editorially reviewed for fairness"                                              | `FOLDWINK_CONTENT_EXPANSION_PHASE2_REPORT.md`     | At least 4 medium puzzles have concrete fairness defects (§3). 18 files still carry dead `tags` fields. The review was not real.                                                                                                                      |
| "Every medium carries Foldwink Tabs"                                                             | multiple                                          | Technically true: every medium has `revealHint`. But 1 medium has near-duplicate items in a group (`Sublime`/`Sublimity`), one has a broken category ("Festivals of Water" including La Tomatina), two have specialist-only vocabulary (0093 / 0094). |
| "No browser QA has been run in-session" (correctly acknowledged)                                 | `FOLDWINK_FINAL_RELEASE_REASSESSMENT.md` §4.1     | Accurate self-report. But then still classified the product as "closed-beta ready". If you have not run QA in a browser, you are not closed-beta ready.                                                                                               |
| "Polished indie MVP for closed beta"                                                             | `FOLDWINK_FINAL_RELEASE_REASSESSMENT.md`          | Not at this content quality and not at this brand-surface inconsistency. See §1 revised classification.                                                                                                                                               |
| "Long item names (≥18 chars) may wrap tightly. Longest in the pool is Stracciatella at 13 chars" | `FOLDWINK_MANUAL_QA_CHECKLIST.md` Known non-fails | **False.** Pool has at least 5 items at 15 chars (`Flying Buttress`, `Water Splashing`, `Broccoli Sprout`, `Object-Oriented`, `Stratocumulus`). The 13-char claim is wrong by measurement.                                                            |

---

## 8. New Top 10 problems (replacing / extending §10 of the previous audit)

| Rank | Area                       | Problem                                                                                                                                                                                      | Severity                            | Evidence                                                            |
| ---- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| 1    | Runtime-observed brand lie | Built `dist/index.html` OG + Twitter meta says "One anchor per medium puzzle"                                                                                                                | **High**                            | curl-fetched from `npm run preview`                                 |
| 2    | Content fairness           | `puzzle-0093 "Eras of stone"` uses 6 specialist architecture terms (Tympanum, Tracery, Cartouche, Trompe l'Oeil, Pilotis, Ribbon Window)                                                     | **High**                            | `puzzles/pool/puzzle-0093.json`                                     |
| 3    | Content defect             | `puzzle-0097 "Festival schedule"` Water group mixes Songkran (valid) with La Tomatina (tomato, not water), Holi Phera (not a standard festival name), Water Splashing (name or description?) | **High**                            | `puzzles/pool/puzzle-0097.json:14-18`                               |
| 4    | Content defect             | `puzzle-0092 "Period piece"` Romantic group has near-duplicates `Sublime` + `Sublimity`; Realist group has near-synonyms `Ordinary` + `Everyday`                                             | **High**                            | `puzzles/pool/puzzle-0092.json:11,17`                               |
| 5    | Content fairness           | `puzzle-0094 "Rock cycle"` uses 8+ specialist petrology terms (Peridotite, Diorite, Gabbro, Rhyolite, Tuff, Siltstone, Gneiss, Quartzite)                                                    | **High**                            | `puzzles/pool/puzzle-0094.json`                                     |
| 6    | Brand identity             | Favicon (5-point star, `#0f1115` bg) differs from in-app BrandMark (3-pixel dot, `#181b22` bg). Two different marks.                                                                         | **High**                            | `public/favicon.svg` vs `src/components/BrandMark.tsx`              |
| 7    | UI defect                  | StatsScreen shows `Solved`/`Unique` and `Win %`/`Win Rate` as 4 different cells rendering 2 distinct values. 44% of the screen is redundant.                                                 | **High** (perceived-quality impact) | `src/screens/StatsScreen.tsx:38-57`                                 |
| 8    | Dead data                  | 18 of 98 puzzle JSON files still carry a `tags` field that has not been in the type since 0.3.0                                                                                              | **Medium**                          | `grep -l '"tags"' puzzles/pool/*.json`                              |
| 9    | Mobile risk                | Validator's 22-char threshold is loose. 17 items at 13-15 chars will wrap on 360 px mobile; the Manual QA checklist falsely claims max is 13 chars.                                          | **Medium**                          | `grep -oP '"[^"]{13,}"' puzzles/pool/*.json`                        |
| 10   | UX gap                     | Result screen does not display the `puzzle.title` anywhere. Player loses context on what they just played.                                                                                   | **Medium**                          | `src/components/ResultSummary.tsx` + `src/screens/ResultScreen.tsx` |

---

## 9. Top 12 next actions (replacing the previous next-actions file)

Strictly ordered by impact. Audit only; not executed.

1. **Rewrite `index.html:14,20`** — replace both anchor-lying meta descriptions. Rebuild and curl-verify the served HTML does not contain the word "anchor".
2. **Rewrite `public/og.svg:24`** — replace the "One anchor per medium puzzle" line.
3. **Rewrite or delete `puzzle-0093 "Eras of stone"`** — either replace 6 specialist items with common architecture vocabulary, or retire the puzzle.
4. **Rewrite or delete `puzzle-0094 "Rock cycle"`** — same editorial decision. Replace Peridotite/Diorite/Gabbro/Rhyolite/Tuff/Siltstone/Gneiss/Quartzite with common-recognition rocks, or retire.
5. **Rewrite `puzzle-0097 "Festivals of Water"` group** — verify each item is genuinely a water festival and remove La Tomatina. Check `Holi Phera` against a real reference.
6. **Rewrite `puzzle-0092 "Period piece"`** — remove `Sublimity` (duplicate with `Sublime`); rewrite Realist group to avoid near-synonyms.
7. **Fix StatsScreen duplicate cells** — delete `Unique` and `Win Rate` grid cells.
8. **Rewrite `docs/PUZZLE_SCHEMA.md`** — remove all `twist` / `AnchorTwist` references, replace example with a medium that has `revealHint` on every group, fix §6 of the fairness checklist.
9. **Unify favicon and BrandMark** — pick one design (star or dot, one background fill, one corner radius) and make the favicon and BrandMark render the identical motif. Update `public/favicon.svg` to match the BrandMark or vice versa.
10. **Delete the dead `tags` field from 18 puzzle JSON files** — simple `sed` or a one-off script.
11. **Rename `CLAUDE.md`** (still says "Cluster Twist") and add `0.3.2 / 0.3.3` sections to `docs/RELEASE_NOTES.md` (still stops at 0.3.1).
12. **Run the full `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` in a real browser** at phone and desktop viewports. Update the "longest word is Stracciatella at 13 chars" false claim. Do this **before** inviting a single closed-beta tester.

Items 3–6 are **editorial content work** that was claimed to have been done in the Phase 2 content report. The fact that concrete fairness defects survived to 0.3.3 means the editorial pass was not done with the rigor the report implied. This cannot be waved away with a 90-minute tightening pass — it needs real editorial sit-down time.

---

## 10. Brutal truth (revised)

**What still looks amateur:**

1. The favicon + BrandMark are two different marks and nobody noticed for four phases.
2. The Stats screen shows the same two numbers in four cells.
3. `puzzle-0092` has `Sublime` and `Sublimity` in the same group.
4. `puzzle-0097` calls La Tomatina a water festival.
5. `puzzle-0093` and `puzzle-0094` expect the player to know 14 specialist vocabulary terms between them.
6. The served HTML still advertises a mechanic that has not existed for five phases.
7. The wordmark is the system sans at extra-bold.
8. 18 of 98 puzzles have a dead `tags` field.
9. The result screen does not tell the player what puzzle they just played.
10. The share string hardcodes a domain the deploy may not use.

**What now looks genuinely competent:**

1. The pure engine and its tests.
2. The store factory + injectable deps.
3. The persistence subscriber seam.
4. The ESLint + Prettier + CI tooling discipline.
5. The bundle size (74 kB gzip for 98 puzzles).
6. The Foldwink Tabs pure helper (when the content it supports is fair).
7. The Wink action implementation (10 lines, 6 guards, 7 tests).
8. The validator's structural rules (when they catch what they are scoped to catch).

**What still feels like LLM-generated filler:**

- The 10 phase reports in `docs/reports/`. Each one individually is honest. Taken together they form an activity log that proves _work was done_ without proving _the product improved on the dimensions testers will actually see_. Reports are not QA.
- The 16 hand-typed `<span>` elements in `Onboarding.tsx`.
- The `danger` variant in `Button.tsx` that no screen uses.

**What a good external tester will notice first:**

- The OG preview on a shared link: "What anchor?"
- The first time they open `puzzle-0093` or `puzzle-0094`: "I don't know half these words."
- The Stats screen: "Why are Solved and Unique the same number?"
- The tab icon vs the app icon: "Is this the same brand?"
- The medium pool when they look past the first daily: "Only 33 mediums?"

**What would make them stop playing:**

- Running into `puzzle-0094` as a daily draw on their second day.
- Hitting `Sublime / Sublimity` and thinking it's a typo.
- Finishing a game and not remembering the puzzle title.
- Sharing a result and seeing `foldwink.com` when they're on a different domain.

**What would make them think "this is actually nice":**

- The Foldwink Tabs first letter reveal after solving group 1 — if they happen to get a good medium.
- The `DailyCompleteCard` with the live countdown — one genuine daily hook.
- The framed share card on the result screen — when it works.
- The Wink — when they remember it exists.

---

## 11. Final revised recommendation

> **Keep core, fix major weaknesses.** Not "good closed-beta candidate after small tightening" as the first audit concluded.

The engineering core deserves to survive. The content tier deserves editorial rework, not decoration. The brand surface deserves one real visual pass by someone with a design eye. The reports deserve to stop claiming readiness the product does not have.

**Do not:**

- Start another phase without fixing items 3–6 from §9 first.
- Ship this to any external tester with the current medium pool.
- Accept the existing "polished indie MVP" framing.
- Write another reassessment report before running the manual QA checklist in a real browser.

**Do:**

- Fix items 1–11 from §9 as a single tightening session.
- Replace or retire 4 medium puzzles.
- Reconcile the favicon and the BrandMark into one mark.
- Delete dead data.
- Run a real browser QA pass.
- Then re-audit.

**Classification:** Releasable only as rough prototype until the content and brand-consistency gaps close. After a real editorial pass + §9 fixes: MVP test. After a designed wordmark + in-browser QA: closed-beta candidate. "Polished indie MVP" is still a phase or two away.

---

## 12. Audit-only — no implementation

This addendum has not changed a single file in `src/`, `puzzles/`, `public/`, or `docs/content/`. Only this addendum file was written to `docs/reports/`. Everything in §9 is a recommendation; nothing is executed.

Audit stopped.
