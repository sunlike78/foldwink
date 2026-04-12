# Foldwink Sound Design

Scope: implementation as of 0.4.1 and the target palette for future asset
replacement.

## Material direction

Foldwink's audio is not decoration. It is the game's tactile layer. Every
cue must feel like a **physical event on a real surface**, not a software
notification. The reference palette:

- **Paper rustle** — the edge of a card sliding across a table. Airy, very
  brief, no pitched content.
- **Playing-card slide** — a card lifted off the deck and returned. Paper
  timbre plus a small low-mid undertone.
- **Soft wood tap** — a knuckle on a wooden table. Warm, low-body, no
  high-frequency sparkle.
- **Bone / tile on wood** — a mahjong tile or a small bone piece placed on
  a wooden surface. Short "knock" transient plus a very low (80–280 Hz)
  sine/triangle body that settles within 200 ms.
- **ASMR-adjacent** — the whole set should feel like it could live under
  whispered speech without competing with it.

Red lines, explicit:

- **No bright chime register.** Bodies stay ≤ 280 Hz. Anything in the
  500 Hz+ range is a tactile break.
- **No mobile-casino success fanfare.** Reward cues settle downward or stay
  flat, not ascend a melody.
- **No buzzer.** Loss is a muted wooden thud, not a synthetic error.
- **No reverb tail.** Every cue is dry — the "room" is the player's own
  room, not a simulated one.

## Current implementation

`src/audio/sound.ts` synthesises the entire palette with the Web Audio API
at runtime. Zero binary assets ship. This is a deliberate placeholder
strategy, documented below.

### Synthesis vocabulary

- **Tap.** Short band-limited or low-pass filtered burst from a pink-ish
  noise buffer, gain-envelope shaped (fast attack, exponential release).
- **Body.** Sine or triangle oscillator, short duration, matching fast
  attack + exponential release envelope. Frequencies 80–280 Hz only.
- **Composite.** A cue is a sum of 1–4 taps and 0–4 bodies. No cue uses
  more than ~4 source voices.

### Cue manifest (0.4.1)

| Event       | Material reference             | Tap filter      | Body freq                     | Peak gain | Duration |
| ----------- | ------------------------------ | --------------- | ----------------------------- | --------- | -------- |
| `select`    | paper edge under fingertip     | 1800 Hz LP      | —                             | 0.20      | 50 ms    |
| `deselect`  | card drop back into place      | 1200 Hz LP      | —                             | 0.16      | 45 ms    |
| `submit`    | knuckle on wood                | 1200 Hz LP      | 140 Hz sine                   | 0.22      | 120 ms   |
| `wrong`     | two muted wood knocks          | 900 / 700 Hz LP | 120 / 95 Hz sine              | 0.22      | 250 ms   |
| `correct`   | three bone-on-wood settles     | 1400–1600 Hz LP | 180 / 215 / 250 Hz sine       | 0.16      | 300 ms   |
| `tabReveal` | micro paper flip               | 1800 Hz LP      | —                             | 0.10      | 35 ms    |
| `wink`      | tile lift, warm mid            | 1600 Hz LP      | 280 / 210 Hz sine             | 0.15      | 240 ms   |
| `win`       | four tiles in sequence on wood | 1300–1600 Hz LP | 170 / 190 / 215 / 240 Hz sine | 0.16      | 480 ms   |
| `loss`      | wooden box closed firmly       | 500 Hz LP       | 95 Hz sine                    | 0.22      | 450 ms   |

All bodies use a sine waveform. Triangle is reserved — it was removed from
correct/win in 0.4.1 because it was reading as a "mobile chime" ascent.

Default master volume: **0.42** (lowered from 0.55 in 0.4.1). Persisted in
`foldwink:sound` via `src/audio/useSound.ts`.

Headroom: individual cue peak ≤ 0.30, composite ≤ 0.45. Cues should fall
below the perceived level of a typewriter keystroke in a quiet room.

### Integration points

- `src/audio/sound.ts` — synthesis engine and recipes.
- `src/audio/useSound.ts` — React hook + settings subscriber.
- `src/components/SoundToggle.tsx` — mute UI on the menu.
- Call sites:
  - `src/screens/GameScreen.tsx` — select / deselect / submit / correct /
    wrong / tabReveal / wink
  - `src/screens/ResultScreen.tsx` — win / loss (one-shot on arrival)

Components **never** instantiate `Audio` or `AudioContext` directly. Every
playback goes through `playSound(event)`.

## Placeholder strategy

The synthesised palette is **intentionally placeholder**. It is good
enough to ship 0.4.x without binary assets, but it cannot beat a
professionally recorded paper / card / wood / bone set.

When real samples arrive, the swap is one file:

1. Record or source the following as `.mp3` (or `.ogg`) at ≤ 12 kB each:
   - `paper_tap.mp3` — for `select` / `deselect` / `tabReveal`
   - `wood_knock.mp3` — for `submit`
   - `wood_double.mp3` — for `wrong`
   - `bone_settle_3.mp3` — for `correct`
   - `tile_lift.mp3` — for `wink`
   - `bone_settle_4.mp3` — for `win`
   - `wood_thud.mp3` — for `loss`
2. Place them under `public/sounds/`.
3. In `src/audio/sound.ts`, extend `RECIPES` with a manifest lookup that
   decodes the buffer once per cue and calls `ctx.createBufferSource` with
   the decoded audio data instead of calling `playTap` + `playBody`.
4. Leave the synthesised recipes as a fallback for any sample that fails
   to load.
5. Do **not** touch `useSound`, `SoundToggle`, or any call site.

Retargeting a single cue does not require a schema migration. The
`SoundEvent` union and the call site API are stable.

## What to record (spec for a future asset pass)

A one-session recording plan for a friend with a usable mic and a wooden
table:

- A sheet of printer paper, for soft paper taps.
- A deck of playing cards, for card slides and returns.
- A small wooden cutting board, for knuckle taps.
- 2–3 dominoes or mahjong tiles, for the bone-on-wood settles.

Record in a quiet room, no reverb. 60–80 takes per category. Trim to the
shortest clean hit. Normalize to −14 LUFS peak −3 dB. Total budget for
all cues combined: **≤ 80 kB gzipped**. Anything heavier is wasted on a
puzzle that plays in 2–5 minutes.

## Non-goals

- No music loop.
- No ambient bed.
- No reverb or chorus effects.
- No randomised pitch variation — it will sound cheap.
- No haptic / vibration API integration until a real device testing pass.
