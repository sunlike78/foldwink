# PROJECT SPEC — Foldwink

## 1. Project summary

Foldwink is a web-first daily word/logic puzzle game inspired by category-grouping games.

The player sees a 4x4 grid of 16 cards and must identify 4 hidden groups of 4.

The MVP is intentionally small:

- no backend
- no accounts
- no live ops
- no monetization code
- no procedural generation in gameplay

The point is to ship a polished first version quickly.

## 2. Product goals

### Primary goal

Create a clean, playable, mobile-friendly MVP that can be deployed publicly.

### Secondary goals

- establish a repeatable content pipeline
- support daily puzzle habit loop
- support future premium packs without rewriting the core
- keep codebase understandable by one person

### Anti-goals

- not a platform
- not an AI product
- not a procedural generator
- not a content CMS
- not a community feature set

## 3. Core experience

### Session length

- 2 to 5 minutes

### Player fantasy

- pattern recognition
- small burst of cleverness
- clean feedback
- quick retry
- daily return habit

## 4. Core mechanics

### Board

- 16 visible cards
- all cards are text-only in MVP
- shuffled display order

### Selection

- player may select up to 4 cards
- tap selected card again to deselect
- submit only when exactly 4 selected

### Validation

- submitted group is checked against the puzzle’s 4 canonical groups
- if correct:
  - lock the group as solved
  - remove or visually isolate it from active play
- if incorrect:
  - increment mistakes

### Failure budget

- 4 mistakes max

### End states

- win when all 4 groups are solved
- lose when mistake cap is reached

### Optional hint for MVP

- `One away` may be implemented only if cheap and fair
- not required for first playable

## 5. Daily mode

### Requirement

Support a deterministic daily puzzle chosen by date.

### MVP approach

- daily puzzle is selected from local validated pool using deterministic mapping by date
- same date must resolve to same puzzle id for all players on same build

## 6. Standard puzzle mode

Allow:

- “Play”
- next unsolved puzzle or simple puzzle list

Do not overbuild progression. A simple list or sequence is enough.

## 7. Difficulty model

### MVP difficulties

- easy
- medium

### Hard mode

Post-MVP only

### Easy

- obvious categories
- little cross-category interference

### Medium

- stronger false associations
- less obvious group labels
- still fair and explainable

## 8. Twist policy

The MVP should feel slightly more interesting than a generic clone, but must not introduce fairness problems.

### Allowed twist

Use a **false trail** concept at content-design level:

- two or more cards may suggest a tempting but incorrect pattern
- but there must still be a single fair canonical solution

### Disallowed in MVP

- cards that genuinely fit multiple groups unless carefully audited
- dynamic rules that change mid-round
- timed bonus systems
- rescue mechanics
- theme-specific rule exceptions

## 9. UX principles

### Must be

- clear in under 5 seconds
- playable one-handed on phone
- low-friction
- fast to restart
- text readable at mobile sizes
- no tutorial wall

### Must avoid

- clutter
- tiny buttons
- dense menus
- noisy feedback
- decorative nonsense
- aggressive animations
- pop-up overload

## 10. Screens

### Main menu

- title
- play button
- daily button
- stats button
- optional settings access

### Game screen

- puzzle title or id
- difficulty
- mistakes remaining
- timer
- 4x4 card grid
- selected count
- submit button
- clear selection button

### Result screen

- victory or defeat
- solved groups summary
- time
- mistakes used
- streak
- next action button

### Stats screen

- games played
- wins
- losses
- current streak
- best streak
- average mistakes or best time if cheap

## 11. Visual direction

Minimal, flat, calm, readable.

Guidelines:

- large card surfaces
- strong spacing
- restrained palette
- color-coded solved groups
- visual priority on words and interaction states

## 12. Technical architecture

- React
- TypeScript
- Vite
- Zustand or `useReducer`
- Tailwind CSS preferred
- local JSON puzzle files
- deterministic daily selector
- localStorage for stats and progress

## 13. File/module boundaries

### `src/game/engine`

Pure game logic:

- submit handling
- correctness check
- solved groups
- win/loss detection

### `src/game/state`

Runtime state:

- current selection
- active puzzle
- mode
- timer
- mistakes
- result state

### `src/puzzles`

- data
- loading
- daily selection
- validators

### `src/stats`

- aggregation
- persistence
- streak logic

### `src/components`

- card
- grid
- header
- footer controls
- result summary

### `src/screens`

- menu
- puzzle
- stats
- result

## 14. Content model

Each puzzle must contain:

- unique id
- title
- difficulty
- 4 groups
- each group has label and 4 items
- optional metadata for editorial notes

See `docs/PUZZLE_SCHEMA.md`.

## 15. Content pipeline

1. draft puzzle
2. schema validation
3. duplicate check
4. ambiguity/fairness review
5. manual editorial approval
6. add to pool

No puzzle is publishable without manual validation.

## 16. MVP deliverables

### Must have

- running web app
- menu
- daily mode
- standard puzzle mode
- result screen
- stats
- persistence
- 30 validated puzzles minimum
- typecheck
- build passes
- basic tests for pure logic

### Nice to have

- one-away hint
- keyboard controls
- tiny success animation
- share result string

### Not in MVP

- online leaderboard
- cloud data
- in-app purchase
- ad SDK
- multilingual packs
- procedural puzzle generation in runtime

## 17. Risks

### Risk 1 — puzzle unfairness

Bad content breaks trust faster than bad polish.

### Risk 2 — clone feel

Game may feel too generic.

### Risk 3 — overengineering

The easiest way to lose is to build systems for future modes.

### Risk 4 — weak retention

Even a polished MVP may not retain players.

## 18. Success criteria

### MVP success

- game ships
- game is understandable without tutorial wall
- content feels fair
- at least 30 playable puzzles
- daily mode works
- mobile layout feels competent

### Business signal success

- real users complete puzzles
- repeat visits exist
- some users ask for more puzzles or daily continuation
- possible supporter conversions later

## 19. Build philosophy

This project should be built with:

- speed
- scope discipline
- fairness
- clarity
- maintainability

It should **not** be built with:

- speculation
- architecture vanity
- feature creep
- monetization creep
