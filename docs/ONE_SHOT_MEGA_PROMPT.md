# One-Shot Mega Prompt for Claude Code

Paste the full block below into Claude Code at the repository root.

```text
You are the principal builder for this repository.
Your job is to autonomously turn this repository into a clean, playable Foldwink MVP with minimal supervision.

Operate as a disciplined product+engineering lead, not as a brainstorming partner.
Make the smallest correct decisions, document them, implement them, test them, and keep moving.

# Mission
Ship a web-first MVP of Foldwink:
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

No backend. No auth. No leaderboard. No overengineering.

# Mandatory repository context
Read and obey these files first:
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

# Operating mode
Act with high autonomy.
Do not stop for non-critical questions.
If a choice is low-risk, choose the simplest option, document it, and proceed.
If a blocker is material, present exactly 2 options, choose 1, and continue with the chosen option unless prevented by a hard failure.

Use subagents proactively where useful, especially:
- scope-keeper
- frontend-implementer
- puzzle-designer
- puzzle-validator
- qa-edge-tester
- release-manager

Keep changes small and reviewable, but do not wait for approval between milestones.

# Required execution sequence
Follow this exact order.

## Phase 1 — Discovery and freeze
1. Read the mandatory files.
2. Create `docs/MVP_DECISIONS.md` with:
   - chosen stack confirmation
   - assumptions
   - unresolved but non-blocking ambiguities
   - recommended defaults
   - risk register
   - milestone plan
3. Create or update `docs/TODO.md` with sections:
   - current phase
   - in progress
   - next
   - blocked
   - done
4. Write a concise implementation plan in `docs/BUILD_PLAN.md` with the exact build order.
5. Do not write app code before these files exist.

## Phase 2 — Scaffold
1. Scaffold a minimal React + TypeScript + Vite app if not already present.
2. Use minimal dependencies only.
3. Use Tailwind only if it meaningfully speeds implementation; otherwise choose the simpler styling path and document it.
4. Establish the folder structure implied by the project docs.
5. Ensure the repo has a clear README section for local startup.

## Phase 3 — Core game domain
Implement the core game logic as testable pure functions where possible.
Create or refine modules for:
- puzzle types/schema
- puzzle normalization
- game session state
- select/deselect logic
- submit validation
- solved group extraction
- mistake tracking
- win/loss detection
- daily puzzle selection by date/seed
- local stats persistence

The pure game logic must be unit-testable without rendering.

## Phase 4 — UI MVP
Build only the screens needed for MVP:
- main menu
- puzzle screen
- result screen
- stats screen

Required gameplay interactions:
- tap/click cards to select/deselect
- show selected count
- allow submit only when 4 selected
- clear selection action
- lock solved groups visually
- show mistakes left
- show timer or elapsed time if already planned in docs
- show victory/defeat result
- navigate to next standard puzzle and daily puzzle

UI requirements:
- clean and readable
- mobile-first
- no heavy animations
- no routing complexity unless clearly justified
- accessible text contrast

## Phase 5 — Content pipeline
1. Implement schema/types for puzzle JSON.
2. Implement a validator script that checks at minimum:
   - correct shape
   - exactly 4 groups
   - exactly 4 items per group
   - duplicate item detection across the puzzle
   - label presence
3. Add a lightweight ambiguity-risk checker if feasible without overengineering.
4. Expand the puzzle pool from examples toward at least 30 curated puzzles.
5. Validate all included puzzles.
6. If generating puzzle drafts, do not trust them blindly. Validate and revise.

## Phase 6 — Tests and QA
1. Add tests for core pure logic.
2. Run typecheck.
3. Run tests.
4. Run production build.
5. Fix failures.
6. Perform a manual QA pass against `docs/QA_CHECKLIST.md`.
7. Record issues found and fixed in `docs/QA_NOTES.md`.

## Phase 7 — Release prep
Create or update:
- README.md
- docs/RELEASE_NOTES.md
- docs/KNOWN_LIMITATIONS.md
- docs/DEPLOY.md

Also ensure:
- project title is set
- favicon placeholder exists if practical
- metadata/basic description exists
- startup instructions are accurate
- puzzle validation instructions are documented

# Constraints
Do not add:
- backend
- auth
- analytics SDK
- ads
- premium packs
- monetization flows
- cloud sync
- accounts
- localization beyond English
- procedural runtime generation
- unnecessary router/state abstractions
- heavy animation libraries

Do not widen the product into a platform.
Do not invent features outside the spec just because they are easy.
Do not spend time polishing what is not part of MVP completion.

# Decision rules
When in doubt:
1. Prefer simpler implementation.
2. Prefer local files over services.
3. Prefer pure functions over hidden logic in components.
4. Prefer one working screen over multiple speculative screens.
5. Prefer content quality over content volume.
6. Prefer documented defaults over asking questions.

# Required artifacts by the end
By the end of the run, the repository must contain at least:
- working app code
- validated puzzle content
- tests for core logic
- docs/MVP_DECISIONS.md
- docs/TODO.md
- docs/BUILD_PLAN.md
- docs/QA_NOTES.md
- docs/RELEASE_NOTES.md
- docs/KNOWN_LIMITATIONS.md
- docs/DEPLOY.md
- updated README.md

# Progress reporting behavior
At the end of each completed phase:
1. Summarize what changed.
2. Update `docs/TODO.md`.
3. State the next smallest high-value step.
4. Continue automatically unless a hard blocker prevents progress.

# Definition of done
The task is done only when all of the following are true:
- app starts locally
- at least one complete game can be played end-to-end
- daily puzzle mode works deterministically
- standard puzzle mode works
- local stats persist
- core logic tests pass
- typecheck passes
- production build passes
- included puzzles validate successfully
- key docs are updated

# First action
Start now with Phase 1.
Do not ask for confirmation.
Read the repo instructions, create the freeze documents, then continue through the build in order.
```

## Recommended usage

1. Open the repository root in Claude Code.
2. Run `/init` if needed.
3. Paste the one-shot prompt above.
4. Let Claude Code work phase by phase.
5. If it drifts, redirect it back to `CLAUDE.md` and `docs/TODO.md`.

## Optional tighter follow-up prompt

Use this if Claude Code starts overengineering or wandering:

```text
Stay inside MVP. Stop widening scope.
Return to CLAUDE.md, docs/MVP_DECISIONS.md, and docs/TODO.md.
Finish only the smallest shippable Foldwink MVP.
No backend, no extra modes, no monetization, no speculative abstractions.
Continue from the current phase and complete the remaining checklist.
```
