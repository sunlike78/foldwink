# QA Checklist

## Functional

- app loads without console-breaking errors
- menu buttons navigate correctly
- daily mode starts a daily puzzle
- standard mode starts a standard puzzle
- submit disabled when selection count is not 4
- tap selected card again deselects it
- correct group is recognized
- solved group is no longer interactable
- incorrect guess consumes 1 mistake
- game ends after 4 mistakes
- game ends when all 4 groups solved
- result screen shows final status

## Edge cases

- repeated rapid taps do not corrupt selection state
- submitting same solved group is impossible
- submitting after game end is blocked
- timer stops when result is reached
- corrupted localStorage resets safely
- invalid puzzle data fails loudly in dev

## Daily mode

- same date returns same puzzle
- daily completion is tracked
- replaying daily does not break streak
- date rollover behavior is reasonable
- daily selector is tested and deterministic

## Stats

- games played increments correctly
- wins/losses recorded correctly
- streak updates correctly
- best streak updates correctly
- solved puzzle ids persist
- clearing storage resets cleanly

## UX

- grid readable at small mobile width
- selected state obvious
- solved state obvious
- disabled state obvious
- result actions clear

## Release readiness

- README exists
- run instructions work
- build passes
- tests pass
- typecheck passes
- no critical known bugs
