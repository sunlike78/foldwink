# Foldwink Closed Beta Prep Report — 0.3.3

## Purpose

Foldwink 0.3.3 is the first build that reaches the "ready to put in front of real humans" bar. This document is the closed-beta pack: how to run the test, who to invite, what to test, what to ask, what to ignore, and what to report.

## Who this is for

- **Testers:** 5–10 people. Mix of:
  - 2 puzzle enthusiasts (plays NYT Connections, Wordle, or equivalent daily)
  - 2 casual solvers (plays sometimes but does not have a daily puzzle habit)
  - 1 first-time grouping-puzzle player (so you see a real cold start)
  - 1 non-native English speaker (to probe the word-play mediums)
  - 1–2 friends who will be blunt with you

- **You (the author):** read every piece of feedback the same day it lands. Do not batch.

## What the tester receives

1. A link to a deployed build of 0.3.3 (or preview instructions if self-hosting — see _Deploy_ below).
2. A **short welcome note** (template below).
3. A **feedback form** — `docs/reports/FOLDWINK_TESTER_FEEDBACK_FORM.md`.
4. Nothing else. No extra explanation, no rules sheet, no pre-tutorial. The onboarding overlay must carry the rules on its own.

## Welcome note template (copy, personalize, send)

> Hi — thanks for testing **Foldwink**. It's a small daily grouping puzzle I've been building solo.
>
> What I'd like from you:
>
> 1. Play at least **one daily puzzle** (the top button). It takes 2–5 minutes.
> 2. Play at least **one standard puzzle** (the second button).
> 3. If you hit a medium puzzle, please try the **Foldwink Tabs** row above the grid and — once per game — the **Wink** action (tap a tab to fully reveal its category).
> 4. Fill out the feedback form at the end: [link to form].
>
> I'm looking for honest reactions. "I got bored after two minutes" is useful. "I didn't understand the tabs" is useful. "Cute but I'd never play it again" is useful.
>
> There are no accounts, no tracking, and no email collection. Stats live only in your browser. Closing the tab loses nothing that matters.

## Deploy

Foldwink is a fully static build. For closed beta:

1. `npm ci`
2. `npm run build`
3. Upload `dist/` to any static host (Cloudflare Pages / Netlify / GitHub Pages / S3 + CloudFront / Vercel static). Full instructions in `docs/DEPLOY.md`.
4. Send the testers the deployed URL.
5. If using Cloudflare Pages / Netlify: preview URLs are fine for closed beta. A branded domain is nice-to-have but not required.

## What to test (tester perspective)

The tester's job is simple, stated in the welcome note: **play the daily, play a standard, fill out the form.**

Internally, the build must survive:

| Area             | Must hold                                                          |
| ---------------- | ------------------------------------------------------------------ |
| First paint      | Loads under 2 s on a mid-tier phone over a fast connection         |
| Onboarding       | Appears on first load, dismissible, persists                       |
| Daily mode       | One puzzle per local date; replays don't affect stats              |
| Standard mode    | Cursor advances on win, stays on loss                              |
| Foldwink Tabs    | Reveals one letter per solve, visible on every medium              |
| Wink             | Exactly one wink per puzzle; state visible in the header chip      |
| Sharing          | Share button works on mobile (share sheet) and desktop (clipboard) |
| Persistence      | Stats + daily history + onboarded flag survive reload              |
| No network calls | Zero third-party requests in devtools Network panel                |

## Device and viewport matrix

Prioritize this order:

| Priority | Device / browser / viewport         | Why                                      |
| -------- | ----------------------------------- | ---------------------------------------- |
| 1        | iPhone 13/14 Safari at 390×844      | Most common modern iOS target            |
| 2        | Android mid-range Chrome at 360×780 | Tests tight mobile width                 |
| 3        | iPad or iPad-size tablet Safari     | Checks 768 px layout                     |
| 4        | Desktop Chrome at 1280×800          | Checks the narrow-column desktop framing |
| 5        | Desktop Firefox at 1440×900         | Second engine sanity                     |
| 6        | Any browser at 1920×1080            | Checks nothing breaks at large sizes     |

**Skip** (known edge cases, not closed-beta priorities): IE11 (not supported), Safari < 15 (not supported), touchscreen Windows, e-readers.

## Manual QA before inviting testers

Run the full `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` end-to-end on at least one mobile-sized and one desktop-sized viewport **before** sending any tester link. No exceptions. This is a ~30–45 minute pass and it catches the stupid stuff.

## What feedback to collect (summary — see the form for details)

- **First-session feel.** Did the onboarding make the rules clear? Did they understand the Foldwink Tabs on their first medium? Did they use the Wink at all?
- **Mechanic clarity.** Can they explain in one sentence what Foldwink does differently from Connections?
- **Fairness.** Did any puzzle feel "unfair" — a category they couldn't recognize, an item they would have put in two different groups, an obscure trivia requirement?
- **Polish impression.** Does it feel like a real product or a prototype?
- **Return intent.** Would they come back tomorrow for another daily?
- **Monetization hypothesis.** Would they pay €2 for a curated pack of 50 new puzzles? (Ask for the gut reaction, not a commitment.)
- **Blockers.** Anything that broke, confused, or turned them off.

The **feedback form** `docs/reports/FOLDWINK_TESTER_FEEDBACK_FORM.md` formalizes all of this.

## Product questions the beta must answer

The beta exists to answer these six specific questions. Any beta that leaves them unanswered has failed its job:

1. **Does the Foldwink Tabs mechanic feel active or decorative?**
2. **Does the Wink get used, and do players understand it without being told?**
3. **Is the medium difficulty fair for non-native English speakers?**
4. **Does the daily loop create any return intent after one play?**
5. **Does the share string spread naturally, or does it feel like a vestigial button?**
6. **Is there a "wow this is actually nice" moment, and where in the flow does it happen?**

If the beta yields a clear answer to each of these, the next decision (ship public, keep iterating, or pivot) can be made with confidence. If it doesn't, run a second round.

## Known risks to flag to testers proactively

Be honest up front. These are not bugs; they are deliberate limits. Listing them upfront saves you from getting the same six "issues" back as surprises:

- Mid-game refresh drops the current attempt.
- Daily uses local date, so friends in other time zones see a different puzzle on the same calendar day.
- No sound, no haptics.
- No offline mode (first load needs network; subsequent loads depend on static host caching).
- No hard difficulty, no hint beyond the Wink.
- 98 puzzles — a committed daily player will see them all within ~2 months.
- Word-play mediums (e.g. `___ FLY / ___ BALL`) lean on English vocabulary.

## Feedback channels

- **Form:** `docs/reports/FOLDWINK_TESTER_FEEDBACK_FORM.md` (Markdown → convert to a Google Form / Notion / email as convenient).
- **Email:** your own address; tell testers "no tracking, I just want to read your reply".
- **Do not** spin up Discord, Slack, Google Analytics, or anything more. Closed beta does not earn community tooling yet.

## Followup cadence

- **Day 1:** send the invites, note who you invited.
- **Day 2:** check for feedback. Read everything.
- **Day 3:** follow up with testers who did not respond — one gentle nudge only.
- **Day 4:** compile findings into a 1-page memo and decide: ship public, iterate, or pivot.
- **Day 5+:** act on the memo.

## Closed-beta exit criteria

The closed beta is considered successful if:

- **≥ 5 of 10 testers complete both a daily and a standard puzzle.**
- **≥ 3 testers can explain the Foldwink twist in one sentence after playing.**
- **≥ 1 tester volunteers they'd come back tomorrow without being asked.**
- **0 blocker bugs (white-screen, data loss, unfair puzzles).**
- **≤ 1 "I didn't get the rules" response.**

Anything less is a signal to iterate before going broader.

## What this closed beta does NOT measure

- Retention over weeks. (Too short a window; 10 testers is too small a sample.)
- Monetization. (No pay path is wired; asking "would you pay" is a gut check only.)
- SEO, discovery, virality. (Not the job of a closed beta.)
- Accessibility compliance beyond basics. (A dedicated a11y pass is a separate future phase.)

## Handoff

When this closed beta is complete, the result should either be:

- **"Ship public as a polished indie MVP"** — proceed to a small public launch on Hacker News, indie puzzle communities, and personal social.
- **"Iterate one more round"** — fix what the beta surfaced, run another small round with 3–5 fresh testers.
- **"Pivot"** — the product is not landing. Not expected at this maturity level, but honest if it happens.
