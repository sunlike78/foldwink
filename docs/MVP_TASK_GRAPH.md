# MVP Task Graph

## Milestones

### M0 — Project setup

- initialize Vite + React + TypeScript
- add styling setup
- add test runner
- add folder structure
- add docs placeholders

### M1 — Domain model

- define puzzle types
- define stats types
- define game state types
- create sample puzzle import path

### M2 — Core logic

- puzzle flattening
- group lookup
- submission validation
- solved group updates
- win/loss logic
- daily selector
- streak/stat updates

### M3 — Basic UI shell

- menu screen
- game screen shell
- result screen shell
- stats screen shell

### M4 — Playable loop

- grid rendering
- selection state
- submit
- solved group UI
- mistakes tracking
- result transition

### M5 — Persistence

- local stats
- solved ids
- daily completion history

### M6 — Content tooling

- puzzle validator script
- duplicate detection
- starter puzzle pool
- content docs

### M7 — Polish

- responsive pass
- empty/error states
- microcopy pass
- test pass
- README

## Dependency graph

```text
M0 -> M1 -> M2 -> M4 -> M5 -> M7
           -> M3 -> M4
M1 -> M6 -> M7
```

## Build order rule

Always prefer:

1. logic before polish
2. one complete loop before extra screens
3. content validation before mass content generation
4. release sanity before nice-to-have features
