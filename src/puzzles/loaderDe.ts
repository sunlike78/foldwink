import type { Puzzle } from "../game/types/puzzle";

// Lazy-loaded DE puzzle pool. Switched to `eager: false` so the 500-odd
// DE puzzle JSONs ship in their own Vite chunk and EN-only players never
// pay for them. A call to `ensureDeLoaded()` resolves + populates the
// exported arrays on demand. Sync consumers that read the arrays before
// load completes see empty pools — `currentBundle()` in byLang.ts falls
// back to EN per tier while the load is in flight.
const lazyModules = import.meta.glob("../../puzzles/de/pool/*.json", {
  import: "default",
}) as Record<string, () => Promise<unknown>>;

function isValidPuzzle(value: unknown): value is Puzzle {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || !v.id) return false;
  if (typeof v.title !== "string" || !v.title) return false;
  if (v.difficulty !== "easy" && v.difficulty !== "medium" && v.difficulty !== "hard")
    return false;
  if (!Array.isArray(v.groups) || v.groups.length !== 4) return false;
  for (const g of v.groups as unknown[]) {
    if (!g || typeof g !== "object") return false;
    const gg = g as Record<string, unknown>;
    if (typeof gg.id !== "string" || !gg.id) return false;
    if (typeof gg.label !== "string" || !gg.label) return false;
    if (!Array.isArray(gg.items) || gg.items.length !== 4) return false;
    for (const it of gg.items as unknown[]) {
      if (typeof it !== "string" || !it.trim()) return false;
    }
  }
  return true;
}

function compareByDifficultyScore(a: Puzzle, b: Puzzle): number {
  const sa = a.meta?.editorialRank ?? a.meta?.difficultyScore ?? 50;
  const sb = b.meta?.editorialRank ?? b.meta?.difficultyScore ?? 50;
  if (sa !== sb) return sa - sb;
  return a.id.localeCompare(b.id);
}

// Backing stores — frozen replacements are swapped in once a load resolves.
const pool: Puzzle[] = [];
const easy: Puzzle[] = [];
const medium: Puzzle[] = [];
const hard: Puzzle[] = [];
const easyRamped: Puzzle[] = [];
const mediumRamped: Puzzle[] = [];
const hardRamped: Puzzle[] = [];
const byId = new Map<string, Puzzle>();
let loadPromise: Promise<void> | null = null;

export function ensureDeLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const paths = Object.keys(lazyModules).sort();
    const collected: Puzzle[] = [];
    const seen = new Set<string>();
    for (const path of paths) {
      let mod: unknown;
      try {
        mod = await lazyModules[path]();
      } catch (err) {
        console.warn(`[puzzles/de] failed to load ${path}: ${String(err)}`);
        continue;
      }
      if (!isValidPuzzle(mod)) {
        console.warn(`[puzzles/de] dropping invalid puzzle at ${path}`);
        continue;
      }
      if (seen.has(mod.id)) continue;
      seen.add(mod.id);
      collected.push(mod);
    }
    collected.sort((a, b) => a.id.localeCompare(b.id));
    pool.length = 0;
    pool.push(...collected);
    easy.length = 0;
    easy.push(...collected.filter((p) => p.difficulty === "easy"));
    medium.length = 0;
    medium.push(...collected.filter((p) => p.difficulty === "medium"));
    hard.length = 0;
    hard.push(...collected.filter((p) => p.difficulty === "hard"));
    easyRamped.length = 0;
    easyRamped.push(...[...easy].sort(compareByDifficultyScore));
    mediumRamped.length = 0;
    mediumRamped.push(...[...medium].sort(compareByDifficultyScore));
    hardRamped.length = 0;
    hardRamped.push(...[...hard].sort(compareByDifficultyScore));
    byId.clear();
    for (const p of collected) byId.set(p.id, p);
  })();
  return loadPromise;
}

export function isDeLoaded(): boolean {
  return pool.length > 0;
}

// Live read-only views. Start empty; populated once `ensureDeLoaded()`
// resolves. Consumers who need a snapshot should still read through
// these bindings so they pick up the populated state on the next call.
export const DE_PUZZLE_POOL: readonly Puzzle[] = pool;
export const DE_EASY_POOL: readonly Puzzle[] = easy;
export const DE_MEDIUM_POOL: readonly Puzzle[] = medium;
export const DE_HARD_POOL: readonly Puzzle[] = hard;
export const DE_EASY_POOL_RAMPED: readonly Puzzle[] = easyRamped;
export const DE_MEDIUM_POOL_RAMPED: readonly Puzzle[] = mediumRamped;
export const DE_HARD_POOL_RAMPED: readonly Puzzle[] = hardRamped;

function getFromPool(p: readonly Puzzle[], index: number): Puzzle | undefined {
  if (p.length === 0) return undefined;
  const idx = ((index % p.length) + p.length) % p.length;
  return p[idx];
}

export function getDEPuzzleById(id: string): Puzzle | undefined {
  return byId.get(id);
}

export function getDEPuzzleByIndex(i: number): Puzzle | undefined {
  return getFromPool(pool, i);
}

export function getDEEasyByIndex(i: number): Puzzle | undefined {
  return getFromPool(easy, i);
}

export function getDEMediumByIndex(i: number): Puzzle | undefined {
  return getFromPool(medium, i);
}

export function getDEHardByIndex(i: number): Puzzle | undefined {
  return getFromPool(hard, i);
}

export function getDEEasyRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(easyRamped, i);
}

export function getDEMediumRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(mediumRamped, i);
}

export function getDEHardRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(hardRamped, i);
}
