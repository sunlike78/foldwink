# CLAUDE.md

You are working on **Foldwink**, a small web-first daily grouping puzzle game.

Foldwink is past its MVP (0.3.3 closed-beta-ready). Your job is to grow it into
a polished small indie product: better visual + audio polish, framed share
card, lightweight retention layer, scaled curated content pipeline, and
release readiness — **without** losing its minimalist identity.

The active execution plan is `docs/FOLDWINK_MASTER_MEGA_PROMPT.md`. The
baseline audit and post-MVP backlog are in
`docs/reports/FOLDWINK_SPRINT_0_AUDIT.md` and `docs/TODO.md`.

## Product definition

Foldwink is a short daily puzzle: the player sees a **4×4 grid of 16 cards**
and must find **4 hidden groups of 4** that share a category.

### Core rules

- 16 cards in a 4×4 grid
- select exactly 4 cards, then Submit
- correct → group locks in with a solved tint
- incorrect → 1 mistake consumed
- **4 mistakes = loss**; all 4 groups solved = win
- game ends on all solved or mistakes exhausted
- daily mode: deterministic by local date; replays don't affect stats
- standard mode: sequential cursor through the curated pool
- save stats locally only

### Foldwink Tabs + Wink (medium puzzles)

On medium puzzles a small row of four **Foldwink Tabs** sits above the grid.
Each tab starts as a single-letter hint. Every correct solve reveals one more
letter on every unsolved tab. Once a group is solved, its tab snaps to the
full category label in the solved colour.

Once per puzzle the player may tap any unsolved tab to **Wink** it — that
tab's full category is revealed instantly, regardless of the current reveal
stage. Winking is optional, free, capped at one per game. The winked tab is
**not** solved — the player still has to find the 4 matching items. Wink is
the one active player decision the name earns.

Easy puzzles have no Foldwink Tabs and no Wink affordance by design.

### Allowed twist

Use **false trail** only if it doesn't create unfair ambiguity. The Foldwink Tabs and Wink mechanic is the only twist system. Do not add another.

## Primary goal

Grow Foldwink from a closed-beta candidate into a small coherent indie
product with a stronger daily ritual, tactile audio-visual polish, a framed
share card, a scaled curated content library, and release readiness — while
holding the line on minimalism.

## Non-goals

- no backend, accounts, cloud sync, leaderboards
- no live puzzle generation at runtime
- no multiplayer
- no ads in 1.0
- no premium paid packs in 1.0 (defer)
- no localisation beyond English in 1.0
- no 3D renderer — clean 2D + subtle 2.5D polish only
- no motion framework, no animation library
- no casino / FOMO / login-streak-saver retention tricks

## Default decisions

If not otherwise specified, assume:

- stack: React 18 + TypeScript + Vite (already locked)
- state: Zustand for app state, pure functions for game logic
- styling: Tailwind CSS
- routing: none
- testing: Vitest for pure logic + store
- package manager: npm
- deployment target: static web build
- content source: local JSON under `puzzles/pool/`
- daily puzzle selection: FNV-1a hash of date into pool index
- motion: CSS/transform-only, one small token file, no libraries
- sound: tiny static-asset pack + one `useSound` hook, tactile paper / card / wood / tile palette, mute-persisted
- share card: hand-drawn canvas, zero deps

## Mandatory workflow (post-MVP sprints)

Work sprint by sprint per `docs/FOLDWINK_MASTER_MEGA_PROMPT.md`. Each sprint:

1. Audit the zone before touching code.
2. Propose a short execution plan for the sprint.
3. Implement the tasks.
4. Run `typecheck`, `test`, `validate`, `build` as gates.
5. Produce a `docs/reports/FOLDWINK_SPRINT_N_*.md` report with:
   - Sprint Summary
   - Changed Files
   - Tests Run
   - Manual QA Notes
   - Open Risks
   - Go / No-Go for next sprint

Sprint order: **0 audit → 0.5 hygiene → 1 visual polish + motion → 2 sound →
3 share card → 4 retention → 5 content scaling → 6 monetization readiness
(scoped down) → 7 final QA.**

## Code standards

- prefer the smallest implementation that is clean and testable
- prefer pure functions for game logic (keep `src/game/engine/` pure)
- prefer flat, understandable modules over clever abstractions
- prefer one working screen over three speculative screens
- prefer local JSON content over content services
- avoid premature generalisation
- motion tokens live in one file (`src/styles/motion.ts` — to be created in S1)
- sound call sites must go through the `useSound` hook, never instantiate `Audio` directly

## Task management

Always maintain `docs/TODO.md` with:

- current sprint
- in progress
- queued / blocked
- deferred past 1.0

After each meaningful milestone:

- summarise what changed
- mention remaining risks
- suggest the next smallest high-value step

## Subagent usage

Use these subagents proactively when relevant:

- `scope-keeper` — sanity-check any new-feature surface before coding
- `frontend-implementer` — small clean React + TS implementations
- `puzzle-designer` — new curated puzzles
- `puzzle-validator` — fairness + ambiguity review on new content
- `qa-edge-tester` — regression + edge-case sweeps
- `release-manager` — near-release readiness checks

## Hard red lines (do not cross)

Do not:

- turn Foldwink into a multi-mechanic puzzle platform
- add a second twist system beyond Foldwink Tabs + Wink
- add a backend, auth, cloud sync, or leaderboard
- add ads, premium flows, or pay-to-win anything
- add a motion framework or animation library
- add a 3D renderer
- generate large batches of puzzles without validator + editorial sign-off
- make core gameplay dependent on sound being on
- use network analytics without an explicit privacy surface

## If blocked

If a decision is non-critical:

- choose the simplest option consistent with the red lines
- document it in the current sprint report
- continue

If a blocker is critical:

- produce exactly 2 options
- recommend 1
- proceed with the recommendation unless explicitly stopped
