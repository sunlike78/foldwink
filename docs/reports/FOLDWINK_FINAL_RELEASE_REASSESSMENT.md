# Foldwink Final Release Reassessment — 0.3.3

Date: 2026-04-11
Scope: honest classification of Foldwink 0.3.3 at the end of the closed-beta preparation phase.
Visual observations remain **[Inferred]** from source, Tailwind tokens, and component markup. No browser session was run in this pass.

---

## The six straight-line questions

The brief asks six direct questions. Here are the answers, in order, without hedging.

### 1. Is this still a prototype?

**No.** The 0.1.0 build was a prototype. Foldwink 0.3.3 has:

- A consistent brand surface (Wordmark lockup, accent underline, dark palette, BrandMark, OG meta, manifest).
- A player-facing differentiating mechanic (Foldwink Tabs + Wink) that is visible on every medium puzzle and felt through a real action.
- 98 validated puzzles, validator with structural + `revealHint` + medium-only checks.
- A store architecture with injectable dependencies, a persistence subscriber, and 65 tests across 9 suites pinning engine and store behavior.
- ESLint, Prettier, GitHub Actions CI running typecheck / test / validate / lint / format:check / build on every push and PR.
- Docs divided into live (`docs/`, `docs/content/`, `docs/research/`, `docs/reports/`) and historical (MVP-era artefacts).
- A manual QA checklist and a closed-beta pack ready to hand to real humans.

None of this is prototype-grade work. This is small indie production work.

### 2. Is this a strong MVP beta?

**Yes, for closed beta.** Foldwink 0.3.3 clears every bar the 0.1.0 audit named, and most of what the 0.2.0 reassessment flagged:

| Audit concern            | 0.1.0                 | 0.2.0                   | 0.3.0                   | 0.3.3                                                |
| ------------------------ | --------------------- | ----------------------- | ----------------------- | ---------------------------------------------------- |
| Brand identity           | conflict              | fixed (name)            | fixed                   | **fixed + Wordmark lockup**                          |
| Cross-screen color bug   | present               | fixed                   | fixed                   | fixed                                                |
| First-run onboarding     | missing               | text-only               | visual + mechanic named | **visual + mechanic named + Wink explained**         |
| Differentiating mechanic | none                  | weak anchor hint        | Foldwink Tabs (passive) | **Tabs + Wink (active, player-driven)**              |
| Share loop               | missing               | text + clipboard        | text + clipboard        | text + clipboard + framed share card                 |
| Brand/release assets     | placeholder favicon   | favicon + OG + manifest | + BrandMark             | + Wordmark lockup across screens                     |
| Content depth            | 30                    | 42                      | 73                      | **98**                                               |
| Daily completion feel    | bare replay state     | countdown               | countdown + streak card | **DailyCompleteCard on menu + countdown + streak**   |
| Stats screen             | bare `<h1>Stats</h1>` | same                    | same                    | **Wordmark + StatStrip + 6-cell grid + empty state** |
| Loss state warmth        | dead-end              | same                    | same                    | **encouragement card**                               |
| Mechanic explainability  | n/a                   | weak                    | one sentence            | **one sentence with visible verb**                   |
| Tests                    | 26                    | 43                      | 51                      | **65**                                               |
| Bundle                   | 57 kB gzip            | 58 kB gzip              | 68 kB gzip              | **74 kB gzip** (with 98 puzzles)                     |
| CI                       | none                  | none                    | added                   | stable                                               |

These are not all perfect, but they all **cleared the "would block a closed beta" threshold**.

### 3. Is this releasable to a small external test?

**Yes, with confidence.** The closed-beta pack is complete:

- `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` — 30–45 minute actionable pass with explicit pre-flight, game-flow, persistence, daily-determinism, mobile, desktop, a11y, and console-hygiene rows.
- `docs/reports/FOLDWINK_CLOSED_BETA_PREP_REPORT.md` — who to invite, what to test, device matrix, proactive risk disclosure, exit criteria (≥5/10 complete both modes, ≥3/10 can explain the twist, ≤1/10 "didn't get the rules"), the six product questions the beta must answer, feedback channels, followup cadence.
- `docs/reports/FOLDWINK_TESTER_FEEDBACK_FORM.md` — 28-question structured form covering first-minute clarity, daily feel, standard feel, Tabs perception, Wink usage, fairness, visual impression, retention hypothesis, monetization gut check, blockers.

The author can run the manual QA pass today, deploy `dist/`, send 5–10 invites, and read answers within a week.

### 4. What still blocks a stronger public launch?

Blunt list, sorted by severity:

**Hard blockers for a real public launch (not for closed beta):**

1. **No browser QA has been run in-session.** Every visual claim in every report is inferred from code. The author must run the full manual QA pass in a real browser at least once before any public push.
2. **No real designed wordmark / logotype.** The current `<h1>Foldwink</h1>` is a system sans treatment. It is clean, but not memorable. A public launch without a mark leaks amateurness.
3. **OG image is still an SVG placeholder** (`/og.svg`). Many scrapers prefer PNG/JPG. A 1200×630 rendered PNG is table stakes for share-heavy launch.
4. **No error boundary** at the React root. A single render bug would white-screen the entire app. Trivial to add; not yet added.
5. **No deploy domain wired** — `foldwink.com` is a placeholder in the share string and the manifest. A public launch needs the real domain resolved.

**Soft blockers (reduce but don't kill a public launch):** 6. **98 puzzles** runs out for committed daily players in ~2 months. A public launch without a "new puzzles keep coming" story risks looking dead after week 4. 7. **No pay affordance** in the app — no Ko-fi / Gumroad / Patreon link, nothing to click if a player loves the thing. This is not a launch blocker but it is a **monetization blocker**. 8. **Mid-game state is not persisted** — a reload mid-game drops the attempt. Acceptable for closed beta; a public audience will hit this often enough to notice. 9. **Word-play mediums** (`___ FLY / ___ BALL`) still gate non-native English speakers. Phase 2 content expansion made this better (20/33 mediums are now classification-shape) but it's not solved. 10. **No hard difficulty** — skilled solvers will exhaust the medium tier fast.

### 5. What would need to change before asking for money?

**Do not ask for money at 0.3.3.** A monetization attempt here would fail and would be remembered.

To credibly ask for money, Foldwink would need:

- **≥ 150 puzzles in the free tier**, not 98. A paying customer expects a substantial catalog behind the paid one.
- **A real paid offering** — most likely: themed packs (`Foldwink: Europe`, `Foldwink: Science`) at €2–5 each, or a one-time supporter tier at €5–10 with a wordmark badge. This needs both a store integration (Stripe Checkout / Gumroad / Itch) and an unlock gate in the app.
- **A designed wordmark and logotype.** People do not pay indie prices to products that look generated.
- **A second mechanic** or a clearly stated difficulty / pack ladder. One mechanic is enough for free; paying players want the sense that the catalog has variety.
- **Real retention evidence**, not hopes. At minimum: 2 weeks of author + 5 testers playing daily, with honest "would I pay" answers from half of them.
- **Error boundary + basic observability.** A payment path with any kind of white-screen bug is catastrophic for trust.
- **A privacy page.** Even "we store nothing" needs one sentence on a page somewhere.
- **A support channel.** An email address the author actually reads.
- **A deployed, branded domain.** Not a Cloudflare Pages preview URL.

None of the above is hard. They are all weeks-not-months lifts, but they are required. Monetization attempted before they exist is premature.

---

## Updated scores (1–10)

Compared across every reassessment in this project's history:

| Dimension                        | 0.1.0 | 0.2.0 | 0.3.0 | 0.3.3 | Notes                                                                                   |
| -------------------------------- | ----- | ----- | ----- | ----- | --------------------------------------------------------------------------------------- |
| Technical Quality                | 7     | 8     | 8     | **8** | Store factory + subscriber + 65 tests + ESLint + CI hold steady.                        |
| Architecture Quality             | 7     | 8     | 8     | **8** | Persistence out of actions, mechanic is a pure helper, clean boundaries.                |
| Code Quality                     | 7     | 8     | 8     | **8** | No `any`, no dead comments, small files, consistent naming.                             |
| Maintainability                  | 8     | 8     | 8     | **8** | 9 test suites, CI, docs tree, no file >300 LOC.                                         |
| UI / Visual Quality _(inferred)_ | 5     | 6     | 7     | **7** | Wordmark + StatStrip + DailyCompleteCard tighten hierarchy. No designed mark yet.       |
| UX Quality                       | 5     | 7     | 8     | **8** | Wink is a real player decision; DailyCompleteCard + loss warmth round out the flows.    |
| Product Clarity                  | 6     | 8     | 9     | **9** | One name, one sentence, one mechanic the tester will see and remember.                  |
| Differentiation                  | 2     | 5     | 7     | **7** | Tabs + Wink is distinct; still one mechanic on one loop.                                |
| Commercial Readiness             | 3     | 5     | 6     | **6** | More content + more polish; still no pay path, no branded domain, no monetization code. |
| Release Readiness                | 5     | 7     | 8     | **8** | Closed beta ready. A polished public launch still needs the hard blockers in §4.        |

The scores do not all move up every phase. That is correct — after the 0.3.0 mechanic + polish pass, the remaining gaps are mostly content and brand-art, which are bounded tasks, not structural work.

---

## Classification

> **Releasable as polished indie MVP — for closed beta.**

### Justification, blunt

Foldwink 0.3.3 is a small, coherent indie puzzle game that can be put in front of real humans in a closed test this week. It has:

- one name used consistently everywhere,
- one mechanic the player sees every medium puzzle,
- one deliberate player action (Wink) that earns the second half of the name,
- 98 validated original puzzles,
- a dark minimal UI with a real brand lockup,
- a daily loop with a completion card and a live countdown,
- a share loop that works on mobile and desktop,
- tests that pin the engine and the branchy store logic,
- a CI that catches regressions,
- documentation that distinguishes live from historical,
- a manual QA checklist, a closed-beta pack, a tester form, and this reassessment.

It is **not** ready to:

- be pushed to Hacker News,
- have €2 asked for it,
- ship to a broad audience with a share button,
- be reviewed by an indie puzzle journalist,
- be claimed as "finished".

The gap between "ready for 5–10 private testers" and "ready for a public launch" is real and is §4 of this document. Respect it. The closed beta exists to tell you which of those §4 items matter most to real humans and which can wait.

The gap between "ready for a public launch" and "ready to ask for money" is also real and is §5. Respect that too.

**Classification:** _Releasable as polished indie MVP_ (closed beta scope). For public launch, the status would be _Releasable as MVP test_ until the hard blockers in §4 are resolved.

---

## Verification

```
npm run typecheck  → PASS (0 errors)
npm test           → PASS (65 / 65 across 9 files)
npm run lint       → PASS (0 warnings)
npm run validate   → PASS (98 puzzles — 65 easy + 33 medium), 93 intentional cross-puzzle warnings
npm run build      → PASS (226.25 kB JS / 74.07 kB gzip, 14.92 kB CSS / 3.92 kB gzip)
```

Version bumped to **0.3.3** in `package.json`.

## Changes in this final pass

- `package.json` — version `0.1.0` → `0.3.3`.
- `README.md` — adds Wink to the description, adds 98-puzzle count, reorders docs index into Live vs Historical.
- `docs/KNOWN_LIMITATIONS.md` — content line updated from 73 → 98 puzzles.
- `docs/reports/FOLDWINK_MANUAL_QA_CHECKLIST.md` — new actionable 0.3.3 manual QA.
- `docs/reports/FOLDWINK_CLOSED_BETA_PREP_REPORT.md` — new closed-beta pack.
- `docs/reports/FOLDWINK_TESTER_FEEDBACK_FORM.md` — new structured feedback form.
- `docs/reports/FOLDWINK_FINAL_RELEASE_REASSESSMENT.md` — this file.

No source code changes. No schema changes. No validator changes. Tightening and packaging only.
