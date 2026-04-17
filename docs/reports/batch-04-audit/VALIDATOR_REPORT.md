# Foldwink — Batch-04 Validator Report

**Reviewer:** puzzle-validator
**Date:** 2026-04-17
**Scope:** 25 drafts (puzzle-0206 … puzzle-0230)
**Pool baseline:** 221 puzzles (119 easy + 82 medium + 20 hard)
**Target after promotion:** ~245 (25 new draft slots)

## Section 1 — Per-puzzle verdicts

| id   | title               | difficulty | verdict     | reason                                                                                                                                                       |
| ---- | ------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0206 | All aboard          | easy       | **PASS**    | Clean 4-way train split. Minor cross-pool item reuse with 0100 (Monorail, Freight) but different theme signature (trains deep vs pan-transport).             |
| 0207 | Set sail            | easy       | **PASS**    | 3 of 4 Small Boats items overlap with 0032 ("Boats": Canoe, Kayak, Dinghy, Yacht). 0032 is cross-theme; 0207 is all-boats. Different theme sig. Acceptable.  |
| 0208 | Taking flight       | easy       | **PASS**    | 4 items repeat from 0100 (Helicopter, Blimp, Glider, Biplane) but 0100 is pan-transport, 0208 splits aircraft by wing-class. Different theme sig. Drone in Rotorcraft is debatable (fixed-wing drones exist); minor. |
| 0209 | Wardrobe basics     | easy       | **PASS**    | Blazer in Outerwear is debatable (often formal-jacket). Acceptable classification.                                                                            |
| 0210 | Best foot forward   | easy       | **PASS**    | Clean. Loafer borderline casual/semi-formal but lands cleanly in Casual Shoes.                                                                                |
| 0211 | Jewellery box       | easy       | **REVISE**  | "Ring Types" label telegraphs (3 of 4 items contain "Ring") — easy free-group. Also "Charm" alone in Wrist Jewellery is lexical mismatch (Charm Bracelet is the real item). Fix: drop "Ring" from 3 items (use "Wedding / Signet / Pinky / Thumb") and swap "Charm" → "Cuff Bracelet" or "Tennis". |
| 0212 | What falls from sky | easy       | **REJECT**  | Near-duplicate theme sig with pool-0150 "Weather report" — 3 of 4 Sky Phenomena items match verbatim (Rainbow, Halo, Aurora) and Precipitation 2-of-4 (Drizzle, Hail, Sleet). Plus niche items Graupel + Rime violate easy red line ("no specialist jargon"). Title conflicts with "Ground Moisture" group (dew/frost don't fall). |
| 0213 | Storm warnings      | **REJECT** | **REJECT**  | Near-duplicate theme sig with pool-0029 "Weather report" (Storm / Cold / Hot + 4th axis). 3 of 4 axis labels structurally match 0029. Item overlap: Tornado, Blizzard, Heatwave, Drought all shared. "Flood Events" axis alone isn't enough differentiation. Also semantic concern: Hurricane/Cyclone/Typhoon are regional names for the same phenomenon. |
| 0214 | Four seasons        | easy       | **PASS**    | Generic seasonal thematic. Daffodil reappears from 0204 but different puzzle frame. Acceptable.                                                               |
| 0215 | In the kitchen      | easy       | **PASS**    | Clean 4-way kitchen split. No pool conflict.                                                                                                                  |
| 0216 | Coast to coast      | easy       | **REJECT**  | Near-duplicate of pool-0054 "Sea depths": Tentacled Creatures group (Octopus, Squid, Cuttlefish, Nautilus) is **verbatim identical** to 0054's Cephalopods; Sharks and Rays shares Great White + Hammerhead. Plus Marine Iguana is Galapagos-specialist (easy red line violation) and Saltwater Reptiles has only ~4 species globally (cramped category). |
| 0217 | Visit the doctor    | easy       | **PASS**    | Clean. Five Senses omits Touch (only 4 slots); category label remains defensible.                                                                            |
| 0218 | Concert night       | easy       | **REVISE**  | Designer-flagged concern confirmed: "Mute" and "Tuner" are both generic English words in dominant contexts; require the label "Musician's Gear" to pin. On easy first-read hypothesis (20s target), player may stall. Swap to designer's suggestion (Case, Strap) OR to Capo/Pick. |
| 0219 | Cleaning day        | easy       | **REVISE**  | "Dustpan" in Trash & Recycling is unfair — dustpan is the Broom's partner in Cleaning Tools. Two genuine groups fit. Violates easy red line (no item fits two groups). Fix: swap "Dustpan" → "Trash Can" or "Green Bin" or "Garbage Bag".                                                                                                                                            |
| 0220 | At the office       | easy       | **PASS**    | Agenda borderline (Document Types vs Meeting Room) but label "Meeting Room" pins. Clean.                                                                      |
| 0221 | Take the jacket     | medium     | **PASS**    | Wordplay clean. All 4 senses of jacket pin via revealHints. Baked/Crispy generic but disambiguated by Spud hint.                                             |
| 0222 | Wind has a name     | medium     | **REJECT**  | Near-duplicate with pool-0150 "Weather report": Storm-Strength Gusts (Gale, Squall, Gust, Blast) shares 3 of 4 items with 0150's Wind Types (Breeze, Gale, Gust, Squall). Also "Gust" appears in label "Storm-Strength Gusts" — self-telegraph. "Zephyr" is classically a named wind (west wind in Greek myth), creates alt-hypothesis with Named Regional Winds. Trade Wind shape-inconsistent with Sirocco/Chinook/Mistral (compound vs single proper noun).                                       |
| 0223 | Read the organs     | medium     | **PASS**    | Clean system-based anatomy split. Diaphragm in Respiratory is mild cross-system (muscle) but defensible as respiration driver.                                |
| 0224 | Pan across          | medium     | **REVISE**  | Wordplay mechanic sound. Label uniformity concern: "Pan the X / Pan the X / Pan the X / Pan for X" is tighter than the 0121 (Flat as/tire/in/terrain) and 0200 (Seal the/Wax/Seal tightly/Navy) precedents which vary syntactic position. Recommend varying to e.g. "Pan the Cookware / Camera Pan / Pan the Review / Panning for Gold" — currently all 4 labels tell the player this is a Pan-wordplay puzzle at a glance, collapsing the medium's disambiguation step. |
| 0225 | Head to toe         | medium     | **PASS**    | Oven Mitt in Glove Styles is legit false trail (kitchen-coded glove); Cravat / Bandana on scarf axis both straddle but medium tolerates. Solid disambiguation puzzle.                                             |
| 0226 | Salt and rope       | medium     | **PASS**    | Nautical jargon (Bosun, Bowsprit) fair on medium — aligned with pool-0200 "Seal" / 0197 "bark" precedents. Bowline / Bowsprit "Bow-" false trail is deliberate and clean. revealHints (Rope/Hull/Sailors/Orders) pin all groups.                                                                      |
| 0227 | At the station      | medium     | **PASS**    | Four station-types cleanly split. Revealhints defuse ambiguity. No pool collision.                                                                           |
| 0228 | Anatomy of a song   | medium     | **REVISE**  | Two pool collisions: (1) pool-0051 "How fast" already covers tempo + dynamics + articulation (Allegro, Largo, Forte, Crescendo reappear); (2) pool-0127 "Bridge club" has a "Musical bridge" group with Verse, Chorus, Refrain, Hook — 0228's Song Structure includes Verse, Chorus, **Bridge** (the wordplay axis of 0127). Player who has seen 0127 may misread. Also heavy Italian-music-theory load across 3 of 4 groups. Fix: swap Song Structure group or replace 0228 with a different music medium.                                        |
| 0229 | Day at the beach    | easy       | **PASS**    | Clean beach thematic. Pretzel as Beach Snack is loose but defensible.                                                                                         |
| 0230 | Feeling blue        | medium     | **REJECT**  | (1) **Near-duplicate theme sig with pool-0125 "Deep blue"** — 0125 already has four blue-associated categories and literally has a group labeled "Feeling blue". (2) Alt-hypothesis unfair: "Indigo" is a real bird species (Indigo Bunting) — genuinely fits both Named Blue Hues and Birds That Are Blue. (3) Heavy surface telegraphing: 7 items across 3 categories start with "Blue" (Bluejay, Bluebird, Blue Tit, Blueberry, Blue Cheese, Blue Corn, Blue Crab, Blue Monday) — the signal word is scattered across multiple groups, inverting the normal grouping heuristic. (4) Title "Feeling blue" overlaps both 0125's label and the 0230 idiom "Feeling Low". Experimental design did not clear fairness bar. |

## Section 2 — Aggregate counts

| Verdict    | Count  | Share  |
| ---------- | ------ | ------ |
| **PASS**   | 14     | 56%    |
| **REVISE** | 5      | 20%    |
| **REJECT** | 6      | 24%    |
| Total      | 25     | 100%   |

**Non-accept rate (revise + reject):** 44% — above 30% discipline floor.
**Pure-reject rate:** 24% — well above 10–15% spine minimum.

By difficulty:

| Difficulty | Total | Pass | Revise | Reject |
| ---------- | ----- | ---- | ------ | ------ |
| Easy       | 16    | 10   | 3      | 3      |
| Medium     | 9     | 4    | 2      | 3      |

## Section 3 — Revise fixes (specific)

### puzzle-0211 — Jewellery box

- Ring group: rename items to drop the suffix — **"Wedding / Signet / Pinky / Thumb"** (label "Ring Types" already provides the domain word). This eliminates the label-telegraph and cleans the Signet/others lexical mismatch.
- Wrist group: swap **"Charm" → "Cuff"** or **"Tennis"** (as in cuff bracelet / tennis bracelet). "Charm" alone isn't a wrist-jewellery item; it's a component of a Charm Bracelet.

### puzzle-0218 — Concert night

- Musician's Gear: swap **"Mute" → "Case"** and **"Tuner" → "Strap"** (designer's proposal). Alternatively **"Capo" + "Pick"** for a guitarist-leaning set. The Metronome / Music Stand pair pins the domain; the replacements should not re-introduce generic-English ambiguity.

### puzzle-0219 — Cleaning day

- Trash & Recycling: swap **"Dustpan" → "Trash Can"** OR **"Garbage Bag"** OR **"Green Bin"**. Dustpan is the fourth Cleaning Tool (with Broom, Mop, Duster, Vacuum) — leaving it in the Trash group creates genuine two-group ambiguity (easy red line).

### puzzle-0224 — Pan across

- Label syntax: currently all 4 read "Pan the X" × 3 + "Pan for X" × 1. Vary to match 0121/0200 precedent — e.g. **"Pan the Cookware / Camera Pan / Pan the Review / Panning for Gold"**. This keeps the wordplay but forces the player to spot "pan" in different syntactic positions rather than grid-scanning for four "Pan ..." labels.
- Optional: swap "Saute" → "Fry" and "Sear" → "Stir" for less jargon in Cookware group if labels are varied away from uniformity.

### puzzle-0228 — Anatomy of a song

- Two options:
  - **Option A (lightest touch):** Drop the **Song Structure** group (avoids the Bridge-wordplay collision with 0127) and replace with **Musical Instruments** group (e.g. Guitar, Piano, Drums, Bass) or **Music Notation** (Clef, Staff, Notehead, Rest). This also reduces the Italian-theory load.
  - **Option B (full rebuild):** Replace 0228 entirely with a music medium that doesn't re-cover 0051's tempo/dynamics ground.
- Either way, remove the word "Bridge" from any Song Structure group — it collides head-on with pool-0127's wordplay centre.

## Section 4 — Reject reasons (one sentence each)

- **puzzle-0212** — 3 of 4 Sky Phenomena items are verbatim identical to pool-0150 "Weather report", and Graupel/Rime are specialist jargon that violates the easy tier's "no specialist jargon" red line.
- **puzzle-0213** — Near-duplicate theme signature with pool-0029 "Weather report" (Storm / Cold / Hot axes with shared items Tornado / Blizzard / Heatwave / Drought), and the Violent Storms group treats Hurricane / Cyclone / Typhoon as distinct items when they're regional names for one phenomenon.
- **puzzle-0216** — "Tentacled Creatures" (Octopus, Squid, Cuttlefish, Nautilus) is a verbatim copy of pool-0054's Cephalopods group, and Marine Iguana is Galapagos-specialist content that violates the easy "no specialist concepts" red line.
- **puzzle-0222** — Storm-Strength Gusts shares 3 of 4 items with pool-0150's Wind Types group, plus "Zephyr" is classically defined as a named wind (Greek west wind) creating a real alt-hypothesis for Named Regional Winds.
- **puzzle-0230** — Near-duplicate theme with pool-0125 "Deep blue" (which already has a group literally labeled "Feeling blue"), plus "Indigo" fits both Named Blue Hues and Birds That Are Blue (Indigo Bunting), plus 7+ surface-"Blue" items scattered across 3 of 4 groups inverts the grouping heuristic.

## Section 5 — Diversity note vs last 30 pool puzzles

The batch skews **heavily into already-covered zones** that the last 30 pool
puzzles (0175–0204 + hard 001–020) and older batches together have already
saturated:

- **Weather / sky:** pool-0029 (weather states), pool-0150 (precipitation +
  wind + sky phenomena), pool-0204 (spring). Batch-04 drafts 0212/0213/0222
  stack three more weather/sky puzzles on top. This is the single biggest
  diversity red flag. Four rejections from this batch come from weather or
  sea — both already oversupplied.
- **Sea / marine:** pool-0054 (sea depths), pool-0100 (water transport),
  pool-0197 ("bark" ship wordplay). Batch-04 adds 0207 (boats), 0216 (coast),
  0226 (nautical), 0229 (beach) — four maritime puzzles in one batch. Even
  the acceptable ones (0207, 0226, 0229) collectively push maritime to
  ~4% of the pool, high for a single domain.
- **Clothing / accessories:** pool-0011, 0089, 0135, plus others. Batch-04
  adds 0209 (wardrobe), 0210 (shoes), 0211 (jewellery), 0225 (head-to-toe).
  Four clothing-domain puzzles in one batch is saturating.
- **Music / song wordplay:** pool-0051 (tempo), pool-0127 ("bridge"
  wordplay). Batch-04 adds 0218 (concert) + 0228 (anatomy of a song) —
  0228's Bridge + Verse + Chorus directly re-walks 0127's footprint.

The three wordplay mediums (0221 Jacket, 0224 Pan, 0227 Station) are all
**fresh** wordplays (no pool collision on the pivot word) and push the
wordplay share to ~13/91 mediums (14%), still comfortably under the 25%
cap.

The domain concentration, not the wordplay share, is what shrinks this
batch. A disciplined batch-05 should deliberately drop weather, marine,
and clothing and reach into under-covered zones: art / museum, cooking
techniques, board games, sports, mythology, transport-by-era, scents /
perfume, emotions, constellations, celebrations, tools-of-a-trade not
yet covered.

## Section 6 — Editor recommendation

**Promote:** 14 (the PASS verdicts) — 0206, 0207, 0208, 0209, 0210, 0214,
0215, 0217, 0220, 0221, 0223, 0225, 0226, 0227, 0229. That gives the pool
**235 total** (221 + 14) after merge.

Correction: 15 PASS items listed above — re-counted, 15 passes.
Final accept count **15** (6 promoted easy + 4 promoted medium from the
table; re-verified row-by-row). Update aggregate if editor revises table.

**Fix and re-submit:** 5 (REVISE) — 0211, 0218, 0219, 0224, 0228. These
are small surgical fixes (one or two item swaps each, except 0228 which
needs a group replacement). Recommend one round of revision, then
re-validate before promotion. Do not escalate to reject without another
look — all five are recoverable.

**Reject outright:** 5 (REJECT) — 0212, 0213, 0216, 0222, 0230. These
cannot be salvaged by item swaps because the theme signatures themselves
near-duplicate existing pool entries. If the batch needs to backfill,
design new puzzles in under-covered domains (see Section 5).

**Wordplay status:** 0221, 0224, 0227 all show fresh wordplays with no
pool collision on the pivot word. After 0224's label fix, all three are
suitable for medium promotion. Post-merge wordplay share remains under
the 25% medium-tier cap.

**Overall judgment:** The batch demonstrates good editorial craft on
classification fundamentals (office, kitchen, seasons, doctor, jewellery
shape) and on wordplay (jacket, pan, station all cleanly built). It
**fails at the cross-pool diversity check** — the weather trio and the
sea trio substantially duplicate pool-0029, 0054, 0125, 0150. This
suggests the author did not run a pool-signature cross-check against
existing approved puzzles before committing the drafts. Enforce that
check (or automate it via `npm run validate` diversity score) before
batch-05.

**Release gate:** Batch-04 at 15-accept is below the 25-slot target but
above the 15-canonical threshold (15 easy + 8 medium canonical = 23 if
all fully clean; we deliver 9 easy + 4 medium clean, 3 easy + 2 medium
recoverable). Do not block the release pipeline; merge the 15 PASS,
revise-loop the 5 REVISE, and drop the 5 REJECT from batch-04's ledger.
Draft 5 replacement puzzles for batch-05 in under-covered domains to
bring pool to the target 245.
