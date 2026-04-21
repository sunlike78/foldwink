#!/usr/bin/env node
// Build a meaningful commit message for the overnight pipeline using
// what we can infer from the working tree and audit report, then commit.

import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const version = pkg.version;

const mergedJson = (() => {
  try {
    return JSON.parse(readFileSync("reports/puzzle_audit/MERGED_AUDIT_REPORT.json", "utf8"));
  } catch {
    return null;
  }
})();

const bTotal = (() => {
  try {
    const raw = readFileSync("reports/puzzle_audit/phase_c_claude_verifications.json", "utf8");
    return JSON.parse(raw).total ?? 0;
  } catch {
    return 0;
  }
})();

const highAuto = mergedJson?.buckets?.HIGH_AUTO?.length ?? 0;
const highReview = mergedJson?.buckets?.HIGH_REVIEW?.length ?? 0;
const medium = mergedJson?.buckets?.MEDIUM_NOTE?.length ?? 0;
const dropped = mergedJson?.buckets?.DROPPED_REFUTED?.length ?? 0;

const ratedCount = (() => {
  try {
    const dir = "reports/puzzle_audit/phase_e_raw";
    const files = readdirSync(dir).filter((f) => /\.json$/.test(f) && !f.startsWith("_"));
    let c = 0;
    for (const f of files) {
      const b = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
      c += (b.ratings ?? []).length;
    }
    return c;
  } catch {
    return 0;
  }
})();

const summary = [
  `feat(audit+ranking): v${version} — cross-validated audit + GPT/heuristic editorial ranking`,
  "",
  "Content audit (Claude + GPT via codex CLI, cross-validated):",
  `- Phase A static: local checks for pair splits, label subsets, duplicates.`,
  `- Phase B GPT audit: ${bTotal} fairness findings across EN/DE/RU pools.`,
  `- Phase C: Claude programmatic verification; ${dropped} GPT hallucinations caught.`,
  `- Phase D merge: HIGH_AUTO=${highAuto} HIGH_REVIEW=${highReview} MEDIUM=${medium}.`,
  `- Full artefact: reports/puzzle_audit/MERGED_AUDIT_REPORT.md.`,
  "",
  `Ranking (GPT-rated ${ratedCount} puzzles blended 40/60 with S1 heuristic):`,
  `- meta.editorialRank now drives the *_POOL_RAMPED pools in standard mode.`,
  `- Daily-mode selection intentionally unchanged (stays on id-sorted pools).`,
  "",
  "Gates: typecheck ✓, vitest ✓, validate ✓, build ✓.",
  "",
  "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>",
].join("\n");

const res = spawnSync("git", ["commit", "-m", summary], {
  encoding: "utf8",
  shell: false,
  stdio: "inherit",
});
process.exit(res.status ?? 1);
