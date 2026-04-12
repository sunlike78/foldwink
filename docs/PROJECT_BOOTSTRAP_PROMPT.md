# Initial Bootstrap Prompt for Claude Code

Paste this into Claude Code at the project root.

```text
You are bootstrapping the Foldwink MVP inside this repository.

Read and obey:
- CLAUDE.md
- docs/PROJECT_SPEC.md
- docs/ARCHITECTURE.md
- docs/PUZZLE_SCHEMA.md
- docs/CONTENT_GUIDELINES.md
- docs/MVP_TASK_GRAPH.md
- docs/STYLE_SYSTEM.md

Then perform this flow:

1. Produce a concise discovery memo in docs/MVP_DECISIONS.md covering:
   - chosen stack confirmation
   - any unresolved ambiguities
   - recommended defaults
   - milestone plan
   - major risks

2. Create docs/TODO.md with:
   - phase
   - in progress
   - next
   - blocked
   - done

3. Scaffold the repo for a React + TypeScript + Vite MVP.
   Use minimal dependencies.
   Do not add backend or auth.

4. Implement the smallest complete playable loop:
   - menu
   - daily and standard start actions
   - puzzle screen
   - select/deselect
   - submit
   - solved groups
   - mistakes
   - win/loss
   - result screen
   - stats screen

5. Build the content pipeline:
   - puzzle schema/types
   - loader
   - deterministic daily selector
   - validator script
   - at least 10 starter puzzles first

6. Add tests for core pure logic.

7. Run typecheck, tests, and build.
   Fix issues.

8. Expand puzzle pool toward 30 validated puzzles if architecture is stable.

9. Update README with run/build instructions.

Rules:
- use subagents proactively
- keep docs current
- do not ask non-critical questions
- choose defaults from CLAUDE.md and continue
- make small, reviewable changes
- after each milestone, summarize progress and update docs/TODO.md
```
