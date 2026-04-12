# Content Batch Workflow — Foldwink

This is the disciplined process for growing the curated pool beyond 98
puzzles toward the 200 → 500 target. It codifies what the first 98 were
authored by intuition.

## Why batches

Scaling past 100 puzzles without discipline leads to three failure modes:
fabricated diversity, unnoticed near-duplicates, and reviewer fatigue. A
batch of ~25 is small enough to review carefully in one session, large
enough to move the pool meaningfully, and bounded enough that rejected
drafts don't poison the next batch.

## Batch size

- **Target batch size:** 25 puzzles.
- **Mix per batch:** 15 easy + 8 medium + 2 reserve (themed, seasonal, or
  higher-variance experiments).
- **Cadence:** a batch is done when it is approved, not when a date arrives.

## Inputs

Each batch starts from one seed list:

- A theme bucket (e.g. "astronomy", "music genres", "kitchen objects").
- A reminder of the already-used theme signatures in the pool (see
  `npm run validate` output — it reports cross-puzzle label collisions).
- The editorial profile in `docs/content/EASY_VS_MEDIUM_PROFILE.md`.

## Steps per draft

1. **Draft.** Four category labels + four items each. Authored, not scraped.
   Use reference material for _vocabulary_ only (Wikipedia for species
   names, a dictionary for `revealHint` keywords). No copying of puzzle
   structure from other grouping games.
2. **Self-check.** Answer every row of the Section 3 table in
   `EASY_VS_MEDIUM_PROFILE.md`. If any answer fails, rewrite or drop.
3. **Validator pass.** `npm run validate`. Hard errors must be zero. Review
   every new warning — especially cross-puzzle label collisions and the
   niche-character flag. Warnings left unexamined are the failure mode.
4. **Editorial pass.** A human read-through on a phone-sized viewport. Is
   every group label defensible in one sentence? Does any item fit two
   groups? Can the player form a first hypothesis in under 20 seconds on
   easy, under 60 on medium?
5. **Fairness review.** For medium puzzles: is the `revealHint` a keyword,
   not a giveaway item? Does the puzzle still solve without Wink?
6. **Commit.** Only then commit the JSON file to `puzzles/pool/`.

## Batch report

At the end of each batch, write a one-page report at
`docs/reports/FOLDWINK_CONTENT_BATCH_N_REPORT.md` covering:

- Theme bucket used
- Count of drafts attempted vs. accepted
- Reasons for any rejections (over-niche, unfair medium, near-duplicate,
  reviewer fatigue)
- Validator diversity score before and after
- Any editorial signals the validator surfaced (label collisions, niche
  characters)
- Decision on whether to continue toward 500 or stop at the next round
  milestone (200 / 300)

The report exists so later batches can be reviewed against the same bar
and so future contributors can read one document to understand where the
pool stands.

## Rejection quotas

Expect **at least 30% of drafts to be rejected** on a disciplined batch.
Rejection is a signal the bar is being held, not that the author is
failing. A batch with zero rejections almost certainly leaked weak
puzzles.

## Diversity guardrails

Two running counters the validator tracks:

- **Distinct label shapes** — every group label (normalised, lowercased)
  should be unique. Cross-puzzle collisions are legal but must be rare.
- **Theme signature** — the sorted set of 4 label tokens per puzzle. No
  two puzzles should share a theme signature.

If a batch pushes either counter below the prior snapshot, the batch is
not moving the pool forward — it is inflating it. Reject it.

## Stop condition

The content scale target is **500 curated puzzles**. If the discipline
cannot be held at the 200-puzzle mark — measured by validator diversity
score drop, editorial rejection rate falling below 30%, or any single
batch needing more than three review passes — stop at the next round
milestone and publish what exists. **A disciplined 200-puzzle pool beats
an undisciplined 500.**

## What this workflow does not cover

This workflow does not attempt to generate puzzles automatically. The
Foldwink identity depends on human editorial judgement, and the 98
existing puzzles were authored by hand. Any future tooling must support
the author, not replace them.
