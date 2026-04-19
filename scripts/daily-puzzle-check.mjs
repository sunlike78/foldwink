/**
 * daily-puzzle-check.mjs
 *
 * Sanity-check that the FNV-1a based daily selection produces distinct
 * puzzle IDs across consecutive days and across unlock tiers. Prints a
 * 30-day calendar showing which puzzle each date picks for three
 * eligibility profiles (Easy-only, +Medium unlocked, +Hard unlocked).
 *
 * This is a diagnostic — not a unit test. Run ad-hoc:
 *   node scripts/daily-puzzle-check.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POOL_DIR = path.resolve(__dirname, "../puzzles/pool");

async function loadPool() {
  const files = (await readdir(POOL_DIR)).filter((f) => f.endsWith(".json"));
  const pool = [];
  for (const f of files) {
    const raw = await readFile(path.join(POOL_DIR, f), "utf8");
    pool.push(JSON.parse(raw));
  }
  return pool.sort((a, b) => a.id.localeCompare(b.id));
}

// Mirror of src/puzzles/daily.ts: FNV-1a 32-bit over the ISO date string.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function getDailyPuzzleId(date, candidates) {
  if (candidates.length === 0) return null;
  const idx = fnv1a(date) % candidates.length;
  return candidates[idx].id;
}

function addDays(iso, days) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const pool = await loadPool();
const easy = pool.filter((p) => p.difficulty === "easy");
const medium = pool.filter((p) => p.difficulty === "medium");
const hard = pool.filter((p) => p.difficulty === "hard");

console.log(
  `pool: ${pool.length} total — easy ${easy.length}, medium ${medium.length}, hard ${hard.length}\n`,
);

const profiles = {
  "Easy only (fresh player)": easy,
  "Easy + Medium (post-unlock)": [...easy, ...medium],
  "Easy + Medium + Hard (Master unlocked)": [...easy, ...medium, ...hard],
};

const startDate = "2026-04-17";
const days = 30;

for (const [label, candidates] of Object.entries(profiles)) {
  console.log(`=== ${label}: pool size ${candidates.length} ===`);
  const seen = new Map();
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const id = getDailyPuzzleId(date, candidates);
    const puzzle = pool.find((p) => p.id === id);
    const diff = puzzle?.difficulty ?? "?";
    const title = puzzle?.title ?? "?";
    console.log(`  ${date}  ${diff.padEnd(6)}  ${id.padEnd(14)}  ${title}`);
    seen.set(id, (seen.get(id) ?? 0) + 1);
  }
  const repeats = [...seen.entries()].filter(([, n]) => n > 1);
  console.log(
    `  → ${seen.size} distinct puzzles across ${days} days, ${repeats.length} repeats\n`,
  );
}
