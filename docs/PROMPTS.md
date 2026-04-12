# Prompt Pack for Claude Code

## 1. Discovery prompt

```text
Analyze this repository and the project docs for Cluster Twist.

Read:
- CLAUDE.md
- docs/PROJECT_SPEC.md
- docs/ARCHITECTURE.md
- docs/PUZZLE_SCHEMA.md
- docs/CONTENT_GUIDELINES.md
- docs/MVP_TASK_GRAPH.md

Produce:
1. a concise MVP clarification memo
2. recommended technical choices
3. a milestone plan
4. a risk list
5. a strict cut line between must-have and nice-to-have

Do not write code yet.
Use the scope-keeper subagent proactively.
```

## 2. Architecture prompt

```text
Design the MVP architecture for Cluster Twist.

Output:
- folder structure
- type model
- state model
- pure logic boundaries
- persistence strategy
- puzzle data loading plan
- daily puzzle selection approach
- test strategy

Constraints:
- no backend
- no auth
- no overengineering
- React + TypeScript + Vite
- static JSON content
- localStorage only for persistence
```

## 3. UI plan prompt

```text
Design the UI plan for Cluster Twist.

Need:
- menu screen
- game screen
- result screen
- stats screen
- mobile-first layout
- clear card states
- control hierarchy
- microcopy suggestions

Optimize for:
- clarity
- low tap friction
- readability
- one-handed phone usage

Do not produce decorative fluff.
```

## 4. Core loop implementation prompt

```text
Implement the smallest complete playable loop for Cluster Twist.

Required:
- 4x4 grid
- select/deselect cards
- submit button enabled only at 4 selected
- validate group against puzzle data
- lock solved groups
- track mistakes used
- detect win and loss
- show result screen
- allow returning to menu

Requirements:
- game rules in pure functions where possible
- small modular components
- types first
- include tests for core logic
- no fake abstractions for future modes
```

## 5. Content pipeline prompt

```text
Build the content pipeline for Cluster Twist.

Create:
- puzzle types
- puzzle validator
- duplicate detection
- fairness checklist
- starter content folder
- 10 initial puzzles first
- simple script to validate all puzzle files

Then evaluate whether the content format is stable enough to scale to 30 puzzles.

Use:
- puzzle-designer subagent
- puzzle-validator subagent
```

## 6. Daily mode prompt

```text
Implement deterministic daily puzzle selection for Cluster Twist.

Requirements:
- same date resolves to same puzzle id for same build
- avoid dependence on backend
- keep logic testable
- track daily completion locally
- ensure daily completion integrates with streak calculation

Add tests for:
- deterministic mapping
- date boundary handling
- repeat play on same date
```

## 7. Stats prompt

```text
Implement local stats for Cluster Twist.

Track:
- games played
- wins
- losses
- current streak
- best streak
- solved puzzle ids
- daily completion history

Requirements:
- localStorage persistence
- corrupted state recovery
- clear type-safe read/write helpers
- no analytics SDK
```

## 8. QA prompt

```text
Run a full QA pass on Cluster Twist.

Cover:
- functional flow
- edge cases
- mobile layout
- selection behavior
- mistake handling
- solved-group logic
- daily mode
- stats persistence
- corrupted localStorage recovery
- build readiness

Output:
- bug list
- severity
- reproduction
- recommended fixes

Use qa-edge-tester subagent proactively.
```

## 9. Release prompt

```text
Prepare Cluster Twist for MVP release.

Need:
- README
- run/build instructions
- deploy instructions for static hosting
- release notes draft
- screenshot checklist
- known limitations
- final TODO cleanup

Then run:
- typecheck
- tests
- build

Fix any remaining release blockers.
Use release-manager subagent proactively.
```

## 10. Full autopilot prompt

```text
Execute the full Cluster Twist MVP build from docs and existing files.

Use project commands and subagents proactively.
Do not ask unnecessary questions.
If a choice is non-critical, take the default defined in CLAUDE.md.
Maintain docs/TODO.md throughout.
Keep the implementation lean.
Stop only for a genuinely blocking contradiction.

Your target:
- running app
- playable loop
- daily mode
- stats
- validated content pipeline
- at least 30 puzzles
- passing typecheck/tests/build
- release-ready README
```
