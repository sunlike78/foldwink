# Bypass-Permissions Zero-Discussion Prompt for Claude Code

Paste the full block below into Claude Code **when you are intentionally running in a bypass-permissions / low-friction execution mode** and want the agent to build the MVP with as few interruptions as possible.

```text
You are operating in a repository where execution friction is intentionally minimized.
Treat this run as a focused build sprint for a single objective: ship the smallest correct Foldwink MVP.

Your job is to execute, not brainstorm.
Do not ask for approval on routine implementation choices.
Do not pause for low-risk permission confirmations.
Do not widen scope.
Do not re-litigate product decisions already captured in the repo docs.

# Mission
Build a clean, playable, web-first Foldwink MVP in this repository.
The MVP must include:
- 16-card grid
- 4 hidden groups of 4
- select/deselect cards
- submit validation
- solved groups lock in
- max 4 mistakes
- win/loss states
- standard puzzle mode
- deterministic daily puzzle mode
- local stats only
- mobile-friendly UI

No backend. No auth. No analytics SDK. No ads. No monetization logic. No cloud sync. No overengineering.

# Repository instructions to obey first
Read these first and treat them as source of truth:
- CLAUDE.md
- docs/PROJECT_SPEC.md
- docs/ARCHITECTURE.md
- docs/PUZZLE_SCHEMA.md
- docs/CONTENT_GUIDELINES.md
- docs/MVP_TASK_GRAPH.md
- docs/STYLE_SYSTEM.md
- docs/QA_CHECKLIST.md
- docs/RELEASE_CHECKLIST.md
- docs/PROMPTS.md

Also inspect:
- puzzles/examples/
- scripts/

# Operating contract for this run
You are in an execution-oriented mode.
Assume you are allowed to:
- read and write files inside this repository
- scaffold and modify app code
- install ordinary project dependencies if needed
- run local project commands such as install, typecheck, test, lint, build, and local validation scripts

Do NOT do any of the following unless they are already explicitly part of the repository workflow:
- touch files outside the repository
- delete large parts of the repo unless replacement is immediate and clearly necessary
- add secrets
- call external paid APIs
- create backend infrastructure
- introduce hosted services
- add tracking or monetization code
- perform risky shell actions unrelated to the MVP

# Behavioral rules
1. Move forward continuously.
2. Do not ask non-critical questions.
3. If a choice is small and reversible, choose the simplest option and continue.
4. If a blocker is real, choose the most conservative working path and continue.
5. Keep commits or change batches logically grouped, but do not stop for approval between phases.
6. Use subagents proactively when they reduce drift.

Recommended subagents:
- scope-keeper
- frontend-implementer
- puzzle-designer
- puzzle-validator
- qa-edge-tester
- release-manager

# Mandatory execution sequence
Follow this exact order.

## Phase 1 — Freeze before code
Before app code changes, create or update:
- docs/MVP_DECISIONS.md
- docs/TODO.md
- docs/BUILD_PLAN.md

`docs/MVP_DECISIONS.md` must include:
- stack confirmation
- assumptions
- defaults chosen without user input
- unresolved non-blocking ambiguities
- risk register
- milestone plan

`docs/TODO.md` must include:
- current phase
- in progress
- next
- blocked
- done

`docs/BUILD_PLAN.md` must include:
- exact build order
- test checkpoints
- definition of MVP completion

Do not write app code before these files exist.

## Phase 2 — Minimal scaffold
Scaffold or refine a minimal web app setup.
Preferred stack:
- React + TypeScript + Vite
- lightweight styling path only
- minimal dependencies

Rules:
- do not introduce unnecessary routing complexity
- do not introduce heavy state libraries unless clearly justified
- prefer CSS modules or simple CSS if faster than Tailwind
- keep structure aligned with repo docs

Ensure startup instructions are correct.

## Phase 3 — Core domain and engine
Implement the game domain as testable pure logic wherever possible.
Create or refine modules for:
- puzzle types/schema
- puzzle normalization
- game session state
- select/deselect logic
- submit validation
- solved group extraction
- mistake tracking
- win/loss detection
- deterministic daily puzzle selection
- local stats persistence

The core game logic must be separable from rendering.

## Phase 4 — UI MVP only
Build only the screens needed to finish MVP:
- main menu
- puzzle screen
- result screen
- stats screen

Required interactions:
- select/deselect cards
- selected count
- submit only when exactly 4 are selected
- clear selection
- visually lock solved groups
- show mistakes left
- show elapsed time if already simple enough
- victory/defeat state
- navigate to next standard puzzle and daily puzzle

UI principles:
- clean
- readable
- mobile-first
- minimal animation
- minimal chrome
- accessible contrast

## Phase 5 — Content pipeline
Implement and/or refine:
- puzzle schema/types
- validator script
- duplicate detection
- basic ambiguity-risk checks if feasible without overengineering

Expand puzzle content toward at least 30 curated puzzles.
Do not trust generated content blindly.
Validate all included puzzles.
Revise weak puzzles.

## Phase 6 — Verification
Run and fix, in this order where practical:
- install dependencies if needed
- typecheck
- tests
- lint only if already part of the repo or fast to add
- production build
- puzzle validation script
- manual QA pass against docs/QA_CHECKLIST.md

Record findings in:
- docs/QA_NOTES.md

## Phase 7 — Release prep
Create or update:
- README.md
- docs/RELEASE_NOTES.md
- docs/KNOWN_LIMITATIONS.md
- docs/DEPLOY.md

Also ensure:
- accurate app title
- basic metadata
- startup instructions
- build instructions
- validation instructions
- deployment notes

# Scope guardrails
Do not add:
- backend
- auth
- accounts
- online sync
- leaderboard
- analytics SDK
- ads
- premium packs
- localization beyond English
- runtime procedural generation
- multiplayer
- social systems
- large animation libraries
- speculative architecture

# Decision hierarchy
When uncertain, prefer in this order:
1. Smaller scope
2. Fewer dependencies
3. Pure functions over component-embedded logic
4. Local files over services
5. Working game loop over polish
6. Content quality over content quantity
7. Documentation of assumptions over asking questions

# Progress reporting behavior
At the end of each completed phase:
1. Summarize what changed.
2. Update docs/TODO.md.
3. State the next smallest high-value step.
4. Continue automatically.

Do not ask for confirmation between phases unless blocked by a hard technical failure that prevents further progress.

# Hard-stop conditions
Only stop and ask for input if one of these is true:
- the repository instructions directly conflict with each other in a way that blocks implementation
- a critical dependency or build tool is unavailable and there is no reasonable fallback
- a required decision would materially change the product scope and is not covered by docs
- the repo is missing a fundamental prerequisite and cannot be scaffolded safely

If you hit a hard-stop condition:
- explain the blocker in 3–6 bullets
- provide exactly 2 options
- recommend 1 option
- default to the smallest viable path if possible

# Definition of done
This run is done only when all of the following are true:
- the app starts locally
- at least one full game can be played end-to-end
- standard puzzle mode works
- daily puzzle mode works deterministically
- local stats persist
- core logic is covered by tests
- typecheck passes
- build passes
- included puzzles validate successfully
- release and QA docs are updated

# First action
Start immediately with Phase 1.
Read the repo instructions, create the freeze documents, then continue through the build in order without asking for approval on routine steps.
```

## Recommended usage

1. Open the repository root in Claude Code.
2. Ensure the repo already contains the starter kit files.
3. Enable the lower-friction execution mode you intend to use.
4. Paste the prompt above.
5. Let Claude Code run phase by phase.
6. If it starts wandering, send the short reset prompt below.

## Short reset prompt

```text
Return to execution mode.
Do not widen scope.
Re-read CLAUDE.md, docs/MVP_DECISIONS.md, docs/TODO.md, and docs/BUILD_PLAN.md.
Continue from the current phase and finish the smallest shippable Foldwink MVP.
No backend, no extra modes, no monetization, no speculative abstractions.
```
