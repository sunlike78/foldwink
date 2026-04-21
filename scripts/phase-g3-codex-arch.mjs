#!/usr/bin/env node
// Phase G3 — independent GPT architecture + retention + playability
// analysis via codex CLI. Feeds CLAUDE.md + key source files to GPT and
// asks for structured findings. Complements the Claude (Phase G1/G2/G2b)
// passes for cross-validation.
//
// Output: reports/architecture/g3_codex_analysis.json + .txt

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "reports/architecture");
mkdirSync(OUT_DIR, { recursive: true });
const OUT_JSON = join(OUT_DIR, "g3_codex_analysis.json");
const OUT_TXT = join(OUT_DIR, "g3_codex_analysis.txt");
const SCHEMA_PATH = join(OUT_DIR, "_g3_schema.json");

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["architecture", "retention", "playability", "psychology", "summary"],
  properties: {
    architecture: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["area", "finding", "severity", "suggestion"],
        properties: {
          area: { type: "string" },
          finding: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
      },
    },
    retention: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["hook", "current", "severity", "suggestion"],
        properties: {
          hook: { type: "string" },
          current: { type: "string", enum: ["absent", "partial", "good", "strong"] },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
      },
    },
    playability: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["area", "finding", "severity", "suggestion"],
        properties: {
          area: { type: "string" },
          finding: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
      },
    },
    psychology: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["principle", "current", "severity", "suggestion"],
        properties: {
          principle: { type: "string" },
          current: { type: "string", enum: ["absent", "partial", "good", "strong"] },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          suggestion: { type: "string" },
        },
      },
    },
    summary: { type: "string" },
  },
};
writeFileSync(SCHEMA_PATH, JSON.stringify(SCHEMA, null, 2));

const sources = [
  "CLAUDE.md",
  "package.json",
  "src/App.tsx",
  "src/main.tsx",
  "src/game/state/store.ts",
  "src/game/state/appStore.ts",
  "src/game/types/puzzle.ts",
  "src/game/types/game.ts",
  "src/game/types/stats.ts",
  "src/game/engine/submit.ts",
  "src/game/engine/progress.ts",
  "src/game/engine/result.ts",
  "src/game/engine/readiness.ts",
  "src/game/engine/foldwinkTabs.ts",
  "src/puzzles/loader.ts",
  "src/puzzles/daily.ts",
  "src/stats/persistence.ts",
  "src/stats/stats.ts",
  "src/screens/MenuScreen.tsx",
  "src/screens/GameScreen.tsx",
  "src/screens/ResultScreen.tsx",
  "src/screens/StatsScreen.tsx",
  "src/components/PuzzleGrid.tsx",
  "src/components/FoldwinkTabs.tsx",
  "src/components/OnboardingOverlay.tsx",
  "src/i18n/useLanguage.ts",
  "src/audio/useSound.ts",
];

const PROMPT_HEADER = `# Foldwink architecture + retention + playability + psychology audit

You are a senior indie-game reviewer. Foldwink is a small daily-puzzle web
game (4x4 grouping puzzle). Read its CLAUDE.md and the selected source
files below, then produce a thorough cross-cutting review.

Your review must hold the line on Foldwink's red lines from CLAUDE.md —
most importantly: **no FOMO, no casino, no login-streak-saver retention
tricks**, no backend/auth/leaderboard, no ads, no premium, no
second-mechanic beyond Foldwink Tabs + Wink. Any suggestion that violates
a red line must NOT be proposed. Flag ethically acceptable hooks only.

## What to produce

Return JSON matching the provided schema with four arrays — architecture,
retention, playability, psychology — plus a short summary. Be specific
and concrete: cite filenames and functions. Severity = "high" only when
the issue blocks shipping a 1.0-quality small indie product.

### architecture
Cross-cutting structural issues: module boundaries, state coupling,
testability, bundle size risk, error surface, accidental complexity,
missing seams.

### retention
Ethical retention hooks (per CLAUDE.md). For each hook state whether it
is absent / partial / good / strong in current code, and a concrete next
step. Examples of allowed hooks:
- daily ritual (already partial — deterministic daily puzzle)
- within-run progression (Foldwink Tabs reveal, Wink)
- within-session closure ("one more" feel)
- aesthetic delight (minimal audio/visual polish)
- share moments (result share card)
- mastery progression (standard-mode ramp)
- FTUE clarity
Forbidden: anything that uses FOMO, guilt, or artificial scarcity.

### playability
Whether the game feels good to play end-to-end: first-time user
experience, state transitions, input feedback, error states, mobile
ergonomics, performance, accessibility.

### psychology
Ethical appeal hooks — competence loop, curiosity gap (Foldwink Tabs are
literally a curiosity-gap mechanic), aesthetic pleasure, surprise /
delight, meaningful-choice moments (Wink), session-end satisfaction.
State current strength (absent/partial/good/strong) + concrete next step.

### summary
One paragraph — overall posture, top 3 things to fix before 1.0.

## Source files

Below each file is its full contents.
`;

function loadSources() {
  const parts = [PROMPT_HEADER];
  for (const rel of sources) {
    const full = join(ROOT, rel);
    if (!existsSync(full)) {
      parts.push(`\n### ${rel}\n[MISSING]`);
      continue;
    }
    const text = readFileSync(full, "utf8");
    parts.push(`\n### ${rel}\n\n\`\`\`\n${text}\n\`\`\``);
  }
  return parts.join("\n");
}

function detectQuotaExhaustion(res) {
  const blob = (res.stdout ?? "") + (res.stderr ?? "");
  return /hit your usage limit|usage limit|Upgrade to Pro/i.test(blob);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runCodexWithRetry(prompt) {
  const lastMsg = join(OUT_DIR, "_g3_raw.txt");
  const QUOTA_SLEEP_MIN = 65;
  for (let attempt = 1; attempt <= 10; attempt++) {
    console.log(`[g3] codex attempt ${attempt}`);
    const res = spawnSync(
      "codex",
      [
        "exec",
        "--sandbox",
        "read-only",
        "--skip-git-repo-check",
        "--output-schema",
        `"${SCHEMA_PATH}"`,
        "-o",
        `"${lastMsg}"`,
        "-",
      ],
      {
        encoding: "utf8",
        input: prompt,
        shell: true,
        maxBuffer: 64 * 1024 * 1024,
      },
    );
    if (res.status === 0) return { res, lastMsg };
    if (detectQuotaExhaustion(res)) {
      console.log(`[g3] quota hit; sleep ${QUOTA_SLEEP_MIN} min`);
      await sleep(QUOTA_SLEEP_MIN * 60 * 1000);
      continue;
    }
    console.log(`[g3] transient (status ${res.status}); sleeping 60s`);
    await sleep(60_000);
  }
  return { res: { status: 1 }, lastMsg };
}

const prompt = loadSources();
console.log(`[g3] prompt size: ${prompt.length} chars`);
const t0 = Date.now();
const { res, lastMsg } = await runCodexWithRetry(prompt);
const elapsed = Math.round((Date.now() - t0) / 1000);
if (res.status !== 0) {
  console.error(`[g3] codex failed permanently after ${elapsed}s`);
  process.exit(1);
}
const raw = readFileSync(lastMsg, "utf8");
writeFileSync(OUT_TXT, raw);
const first = raw.indexOf("{");
const last = raw.lastIndexOf("}");
let payload;
try {
  payload = JSON.parse(first >= 0 ? raw.slice(first, last + 1) : raw);
} catch (err) {
  console.error(`[g3] JSON parse failed (${err.message}); raw kept at ${OUT_TXT}`);
  process.exit(1);
}
writeFileSync(OUT_JSON, JSON.stringify({ elapsedSec: elapsed, ...payload }, null, 2));
console.log(`[g3] OK in ${elapsed}s`);
console.log(`  architecture: ${(payload.architecture ?? []).length}`);
console.log(`  retention:    ${(payload.retention ?? []).length}`);
console.log(`  playability:  ${(payload.playability ?? []).length}`);
console.log(`  psychology:   ${(payload.psychology ?? []).length}`);
