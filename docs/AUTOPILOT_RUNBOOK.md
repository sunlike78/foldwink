# Autopilot Runbook

This runbook is for driving Claude Code with as little hand-holding as possible.

## 1. First session

Inside the repo:

```bash
claude
```

Then use:

```text
/init
```

If you already have this kit in the repo, Claude Code should pick up `CLAUDE.md`.

Then paste:

```text
Read CLAUDE.md and all docs in /docs.
Use project subagents and project commands proactively.
Start with discovery, then freeze, then implement the MVP in milestone order.
Do not ask unnecessary questions.
If a decision is non-critical, choose the simplest default and document it.
```

## 2. Recommended command sequence

Run these project slash commands in order:

```text
/discover
/freeze
/arch-plan
/build-loop
/content-pipeline
/qa-sweep
/release-pack
```

If implementation is already underway, you can also use:

```text
/ship-mvp
```

## 3. Low-intervention fallback prompts

If Claude Code stalls, use:

```text
Proceed with the next smallest milestone from docs/TODO.md.
Use the simplest implementation that satisfies the spec.
Do not redesign completed layers unless there is a real blocker.
```

If Claude Code starts expanding scope, use:

```text
Stop. Re-scope to strict MVP only.
List the out-of-scope items you were about to add and remove them.
Continue only with must-have delivery.
```

If Claude Code gets lost in content generation, use:

```text
Freeze content generation at 10 puzzles.
Stabilize schema, validators, and game loop first.
Scale to 30 puzzles only after validation and runtime loading are stable.
```

## 4. Commit rhythm

Ask Claude Code to commit after each milestone:

```text
Commit the completed milestone with a concise message.
Then update docs/TODO.md and summarize remaining risks.
```
