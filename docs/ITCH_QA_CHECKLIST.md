# Foldwink — Pre-Itch.io QA Checklist

Run this checklist on a real browser before any itch.io publication. Each item must be verified by a human. Do not mark items as passed based on code review alone.

## Instructions

Open https://sunlike78.github.io/foldwink/ (or the local preview at http://localhost:4173/) on each target device. Complete each check sequentially. Note any failures.

## Desktop Browser (Chrome / Firefox / Edge)

- [ ] App loads without console errors
- [ ] Onboarding modal appears on first visit
- [ ] Onboarding explains Easy / Medium / Hard + Tabs + Wink
- [ ] "Got it" dismisses onboarding, does not reappear on reload
- [ ] Menu shows: Daily, Easy, Medium (locked until 5 wins), Master Challenge
- [ ] Easy puzzle starts and plays to completion (win or loss)
- [ ] Timer ticks during play in the header
- [ ] Mistake dots update on wrong guess
- [ ] Grid shakes briefly on wrong guess
- [ ] Solved cards show colour + shape marker (●◆▲■)
- [ ] Result screen shows grade + time + mistakes + groups
- [ ] Share button produces an output (copy, download, or native share)
- [ ] Stats screen shows meaningful data after 2+ games
- [ ] Daily archive shows at least one entry after solving today's daily
- [ ] Sound plays after first card tap (not before)
- [ ] Sound mute toggle works and persists on reload
- [ ] Reload mid-game restores the game session
- [ ] Arrow keys navigate between cards in the grid
- [ ] Tab/Enter/Space can be used to select and submit
- [ ] About footer opens, shows Neural Void + email + privacy + clear log
- [ ] No clipped text or horizontal overflow at 1280px+ width

## Mobile Browser (iPhone Safari / Android Chrome)

- [ ] App loads in portrait orientation
- [ ] Cards are large enough to tap without misfire
- [ ] Sound plays after first tap (iOS AudioContext resume)
- [ ] Tabs are readable on small screen (if Medium)
- [ ] Timer is visible in header
- [ ] Share button works (navigator.share or clipboard fallback)
- [ ] No horizontal scroll
- [ ] Menu and result screens are scrollable if content overflows
- [ ] About footer opens and is readable

## Sound QA

- [ ] select cue: soft paper/card feel, not harsh
- [ ] deselect cue: slightly duller than select
- [ ] submit cue: warm wood knock, not bright
- [ ] wrong cue: two muted knocks, not buzzer-like
- [ ] correct cue: three low settles, not a chime
- [ ] wink cue: warm mid tone, not sparkly
- [ ] win cue: four quiet settles, not a fanfare
- [ ] loss cue: low thud, not punishing
- [ ] tabReveal cue: barely audible paper flip
- [ ] Repetition tolerance: play 5 easy puzzles in a row. Does sound become annoying? [ ] no / [ ] yes

## Share Card QA

Use `scripts/preview-share-cards.html` to render test cards, or trigger Share from in-game:

- [ ] Wordmark "Foldwink" is centred and readable
- [ ] "BY NEURAL VOID" sublabel is visible
- [ ] Subtitle (Daily / Standard / Master) is correct
- [ ] Result headline (Solved / Close call) is correct
- [ ] Status line (time · mistakes · Wink/Hard) is correct
- [ ] Solved grid colours match the four solved-group tints
- [ ] Unsolved squares are dark with subtle border
- [ ] Footer reads "neural-void.com/foldwink"
- [ ] No text overlap or clipping

## Itch.io Specific

- [ ] Zipped dist/ loads in itch.io draft (click to launch mode)
- [ ] Game fills the launch window without clipping
- [ ] Sound resumes after first click inside itch.io player
- [ ] localStorage persists between itch.io sessions
- [ ] No broken asset paths (favicon, manifest, CSS, JS all load)

## Progression QA

- [ ] Fresh record: Medium button shows "Medium — locked"
- [ ] After 3 easy wins: nudge message appears ("Almost there")
- [ ] After 5 easy wins: Medium button enables
- [ ] After 3 medium wins: Master Challenge button enables (if content exists)
- [ ] After 2 consecutive medium losses: fallback hint appears
- [ ] Hard puzzle: no Wink affordance shown, tabs reveal slowly

## Verdict

After completing this checklist, record:

- Desktop: PASS / FAIL (list failures)
- Mobile: PASS / FAIL (list failures)
- Sound: PASS / FAIL (list concerns)
- Share: PASS / FAIL (list concerns)
- Itch.io: PASS / FAIL (list failures)
- Progression: PASS / FAIL (list failures)

**Overall: READY / NOT READY for [unlisted / public free / PWYW]**
