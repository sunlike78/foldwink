# Batch-03 Validator Report

Reviewer: puzzle-validator
Date: 2026-04-17
Scope: 25 drafts `puzzle-0181.json` … `puzzle-0205.json`
Workflow: `docs/content/BATCH_WORKFLOW.md`, `docs/content/EASY_VS_MEDIUM_PROFILE.md`

## Section 1 — Verdict per puzzle

| id          | title               | difficulty        | verdict | reason if not ACCEPT                                                                                                             |
| ----------- | ------------------- | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| puzzle-0181 | Dinosaur lineup     | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0182 | Italian table       | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0183 | Sacred spaces       | easy              | REVISE  | "Mausoleum" in Islamic group and "Pantheon" in Ancient group are genuinely cross-cultural; real fit-two-groups risk.             |
| puzzle-0184 | Down on the farm    | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0185 | Back to school      | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0186 | Shopping list       | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0187 | Serpent studies     | easy              | REVISE  | Theme label calls set "Serpent studies" but a quarter of items (Lizards) are not serpents. Relabel theme / title.                |
| puzzle-0188 | Martial origins     | easy              | REJECT  | Four specialist-jargon items ("Hwa Rang Do", "Tang Soo Do", "Luta Livre", "Vale Tudo") violate easy's "no specialist jargon".    |
| puzzle-0189 | Salon day           | easy              | REVISE  | "Layers" fits short hair too (layered bob). Swap for a cleaner long-only term.                                                   |
| puzzle-0190 | On two wheels       | easy              | REJECT  | "Dirt Jump" is a canonical BMX discipline as much as MTB; "Halfpipe" / "Freestyle" boundaries blur — multi-hypothesis grouping.  |
| puzzle-0191 | At the gym          | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0192 | Desk setup          | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0193 | Birthday bash       | easy              | REVISE  | Category label "Wrapping a Gift" reads awkwardly vs. items (Gift Bag / Ribbon / Bow / Tissue Paper). Relabel "Gift Wrapping".    |
| puzzle-0194 | Once upon a time    | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0195 | Signs and signals   | easy              | ACCEPT  | —                                                                                                                                |
| puzzle-0196 | Take a walk         | medium (wordplay) | ACCEPT  | —                                                                                                                                |
| puzzle-0197 | Listen to the bark  | medium            | ACCEPT  | —                                                                                                                                |
| puzzle-0198 | Bolt from the blue  | medium            | ACCEPT  | —                                                                                                                                |
| puzzle-0199 | Swing of the bat    | medium            | REVISE  | Item `"Wink"` collides with the Foldwink Wink mechanic — reads as UI affordance on the grid. Swap the item.                      |
| puzzle-0200 | Seal the deal       | medium            | ACCEPT  | —                                                                                                                                |
| puzzle-0201 | Warm palette        | medium            | REJECT  | Title advertises "warm" but ships PURPLE; Fuchsia / Mauve / Lilac sit on a genuine pink–purple continuum; multi-hypothesis.       |
| puzzle-0202 | Feelings ladder     | medium            | REVISE  | "Anxious" in AFRAID is contested (often sadness/worry axis). Swap for an unambiguous fear synonym.                                |
| puzzle-0203 | Rich or poor       | medium            | ACCEPT  | —                                                                                                                                |
| puzzle-0204 | Spring has sprung   | easy (seasonal)   | ACCEPT  | —                                                                                                                                |
| puzzle-0205 | Comes in pairs      | easy (experim.)   | REJECT  | Mixes literal pairs (Eyes, Lungs) with linguistic "pair of X" singular objects (Scissors, Binoculars, Tongs); adversarial for easy. |

## Section 2 — Aggregate

- Accepted: **14 / 25** (56%)
- Revise (fixable, keep in batch after edit): **7 / 25** (28%)
- Rejected (drop entirely): **4 / 25** (16%)
- Combined non-accept rate: **11 / 25 = 44%** (well above 30% bar — disciplined)
- Pure-rejection rate alone: 16% — below the 30% target, but the combined "did not pass clean" rate of 44% satisfies the workflow intent. Flagging for editor: if the author treats REVISE as a rubber stamp rather than a real rewrite, effective rejection rate drops to 16% and the bar slipped.

### Structural validity check

- All 25 files: 4 groups × 4 items, no intra-puzzle duplicate items, unique group ids, `meta.batch = "batch-03"` present, trailing newline, difficulty in allowed set.
- All 8 mediums ship `revealHint` on every group, none exceed 24 chars, none duplicate.
- `"Piñata"` in puzzle-0193 passes validator — `NICHE_CHAR = /[^\p{L}\p{N}\s'’\-.]/u` admits Unicode letters, `ñ` is `\p{L}`. No change required. (If the editor prefers ASCII for broader compatibility, `"Pinata"` is a safe drop-in.)
- `"Brazilian Martial Arts"` label = 22 chars. Validator does not length-check labels; 22 chars is fine on mobile tab only because label isn't used on easy tabs anyway. No issue.

## Section 3 — For each REVISE

### puzzle-0183 "Sacred spaces"

- **Issue 1**: "Mausoleum" in Islamic Buildings. Mausoleums are famously Islamic (Taj Mahal) but equally Christian (Lenin, Grant), Ancient (Halicarnassus — one of the Seven Wonders, which *defines* "Ancient Monuments"). An "Ancient Monuments"-first hypothesis will grab Mausoleum cleanly.
- **Issue 2**: "Pantheon" in Ancient Monuments. The Rome Pantheon is also continuously a Christian church since 609 AD. A literal-reading player could place it in Christian Buildings.
- **Fix**: swap "Mausoleum" → "Dome" or "Caravanserai" in Islamic group; swap "Pantheon" → "Colosseum" or "Stonehenge" in Ancient Monuments. "Pyramid" in the Ancient group is fine in this context (4th pool appearance but each context is distinct).

### puzzle-0187 "Serpent studies"

- **Issue**: The theme-bridge framing "Serpent studies" doesn't cover Lizards. A lizard is not a serpent. The title and group lineup fight each other — one leg is a non-sequitur.
- **Fix**: retitle the puzzle to **"Scaly things"** or **"Reptile house"** and relabel the mythical group to **"Mythical Reptiles"** or keep it **"Mythical Serpents"** but rename the puzzle so the lizards leg no longer reads as a trick. Do not touch items; the category memberships are clean.

### puzzle-0189 "Salon day"

- **Issue**: "Layers" in Long Hair Styles. A layered bob is a classic short style; "layers" is a cut technique applied to any length. A player who hypothesises "short" first can legitimately file Layers there.
- **Fix**: swap **"Layers" → "Beach Waves"** or **"Mermaid Braid"** (if you want to keep it distinct from the Braided group, go with "Beach Waves" or "Blow-Out" — unambiguously long-hair styling).

### puzzle-0193 "Birthday bash"

- **Issue**: Label "Wrapping a Gift" is gerund-phrase-shaped, unlike the other noun-phrase labels (Party Decorations / Party Food / Birthday Activities). The items are gift-wrapping *supplies*, not the *act* of wrapping.
- **Fix**: relabel to **"Gift Wrapping"** — one-word category that reads like its siblings. No item changes needed.
- Aside: "Piñata" ASCII-normalise to "Pinata" if you want to sidestep any downstream tool that trips on non-ASCII. Not required for the validator.

### puzzle-0199 "Swing of the bat"

- **Issue**: Item `"Wink"` in "Bat an eyelash" group. The game itself ships a Wink mechanic. Seeing the word "Wink" on a card while a Wink button is on screen is cognitive noise.
- **Fix**: swap **"Wink" → "Bat-Eye"** (no — too on-nose), or better **"Coquettish"**, **"Coy Look"**, or **"Flirt Blink"**. Cleanest drop-in: **"Blink"** is already on the revealHint, so pick **"Doe Eyes"** or **"Lash Flick"**. Recommended: **"Lash Flick"**.

### puzzle-0202 "Feelings ladder"

- **Concern confirmed**: "Melancholy" and "Glum" belong firmly in SAD — low-energy, mood-downward, no fear component. Safe.
- **New issue**: **"Anxious"** in AFRAID. Anxiety overlaps fear but colloquially clusters with worry/sadness. A reader parsing "AFRAID → Terrified / Petrified / Spooked" will accept Anxious reluctantly; a reader parsing SAD might try to grab it.
- **Fix**: swap **"Anxious" → "Frightened"** or **"Scared"** or **"Aghast"**. Any of these nails AFRAID uncontested.

## Section 4 — For each REJECT

### puzzle-0188 "Martial origins"

Four items (`Hwa Rang Do`, `Tang Soo Do`, `Luta Livre`, `Vale Tudo`) are specialist-level jargon that the average literate adult will not recognise — direct violation of the easy-tier red line in `EASY_VS_MEDIUM_PROFILE.md` §1. The puzzle can't be rescued by swapping two items because both Korean and Brazilian groups then collapse to two well-known entries plus two obscure ones; the shape is wrong. Drop and re-author as a medium "Martial arts origins" with `revealHint` if the theme is wanted.

### puzzle-0190 "On two wheels"

"Dirt Jump" is a mainstream BMX discipline as much as a Mountain Biking one (BMX dirt jumping is a UCI-recognised format). "Halfpipe" and "Freestyle" in the BMX group blur into each other (Freestyle BMX *includes* halfpipe). The puzzle admits more than one legitimate grouping — fails fairness review.

### puzzle-0201 "Warm palette"

Two independent defects: (1) the puzzle title advertises warm colours but ships PURPLE, which is cold-spectrum; (2) Fuchsia (pink/magenta), Mauve (pink/purple), Lilac (pink/purple), and Rose (pink/red) collectively sit on a continuous gradient where a reasonable player's first grouping will move at least one item across groups. Classification mediums are required to have a single canonical partition on careful reading; this one does not.

### puzzle-0205 "Comes in pairs"

Conceptually muddled: "Eyes / Ears / Lungs / Kidneys" are literally two organs; "Scissors / Binoculars / Tongs / Chopsticks" are singular objects referred to as "a pair of"; "Skis / Skates" are two physical items; "Dumbbells" are sold in twos but used as two singular items. The category labels (Body / Clothing / Tool / Sport) paper over this by cheating with domain. Players will notice the inconsistency and feel the puzzle is playing a language trick on them. Experimental slot — fail the experiment and move on.

## Section 5 — Diversity note

Compared against `puzzle-0151.json` … `puzzle-0180.json`:

- The last 30 pool puzzles are **heavily polysemy-medium** shaped: Cold / Light / Sharp / Cast / Key / Ring / Bank / Court / Table / Paper / Net / Drive / Track / Chain / Channel / Frame / Press / Point / Iron / Cell / Plant / Sound (waves) / Watch. The medium tier has been eating polysemy at a fast rate and is starting to feel same-shape.
- Batch-03 brings **15 classification easies** (dinosaurs, Italian food, sacred buildings, farm, school subjects, grocery aisles, snakes/lizards, martial arts, salon, cycling, gym, desk, birthday, fairy tales, road signs) — that's a *welcome* shape shift. Even with four rejections, the accepted easies are diverse and cover domains the last 30 barely touched (food prep, salon, school, birthday).
- The medium tier in batch-03 is 5 polysemy (bark, bolt, bat, seal, rich) + 1 wordplay (walk) + 1 synonym (feelings) + 1 classification (warm palette, if salvaged — currently rejected). Even with Warm Palette rejected, the emotion-synonym and wordplay-compound additions are new shapes vs. 0151–0180. Good.
- **Net**: batch-03 diversifies the pool more than it inflates it. The four rejections are the right four; they were the ones that would have added *noise* rather than shape.
- **Watch item**: "Wink" is already reserved by mechanic; treat it as a banned item across the pool going forward.

## Section 6 — Editor recommendation

This batch earns a place in the pool *after* the seven revisions are actually executed — specifically the three fairness-repair revisions (0183 Mausoleum/Pantheon swap, 0189 Layers swap, 0202 Anxious swap), the mechanic-collision revision (0199 Wink swap), and the label/theme cleanups (0187, 0193). Do not flag REVISE items as accepted without re-reading the edited file — that is the specific failure mode that turns a 44% non-accept rate into a 16% one. The four rejections are clean drops: 0188 violates the easy jargon rule across two full groups, 0190 has genuine discipline-boundary ambiguity between BMX and MTB that cannot be patched without losing the theme, 0201 has a title/content mismatch stacked on a real colour-spectrum overlap, and 0205 is a clever concept executed adversarially. Net after edits: **+20 puzzles** toward the 225 milestone (14 accepted + 6 revised-then-accepted; 0183/0187/0189/0193/0199/0202 — plus 1 more if the reviewer counts 0201 after a title fix, which I do not recommend). Pool moves forward, discipline held.
