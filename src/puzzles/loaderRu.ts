import type { Puzzle } from "../game/types/puzzle";

// Lazy-loaded RU puzzle pool. See loaderDe.ts for the pattern rationale.
const lazyModules = import.meta.glob("../../puzzles/ru/pool/*.json", {
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

const pool: Puzzle[] = [];
const easy: Puzzle[] = [];
const medium: Puzzle[] = [];
const hard: Puzzle[] = [];
const easyRamped: Puzzle[] = [];
const mediumRamped: Puzzle[] = [];
const hardRamped: Puzzle[] = [];
const byId = new Map<string, Puzzle>();
let loadPromise: Promise<void> | null = null;

export function ensureRuLoaded(): Promise<void> {
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
        console.warn(`[puzzles/ru] failed to load ${path}: ${String(err)}`);
        continue;
      }
      if (!isValidPuzzle(mod)) {
        console.warn(`[puzzles/ru] dropping invalid puzzle at ${path}`);
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

export function isRuLoaded(): boolean {
  return pool.length > 0;
}

export const RU_PUZZLE_POOL: readonly Puzzle[] = pool;
export const RU_EASY_POOL: readonly Puzzle[] = easy;
export const RU_MEDIUM_POOL: readonly Puzzle[] = medium;
export const RU_HARD_POOL: readonly Puzzle[] = hard;
export const RU_EASY_POOL_RAMPED: readonly Puzzle[] = easyRamped;
export const RU_MEDIUM_POOL_RAMPED: readonly Puzzle[] = mediumRamped;
export const RU_HARD_POOL_RAMPED: readonly Puzzle[] = hardRamped;

function getFromPool(p: readonly Puzzle[], index: number): Puzzle | undefined {
  if (p.length === 0) return undefined;
  const idx = ((index % p.length) + p.length) % p.length;
  return p[idx];
}

export function getRUPuzzleById(id: string): Puzzle | undefined {
  return byId.get(id);
}

export function getRUPuzzleByIndex(i: number): Puzzle | undefined {
  return getFromPool(pool, i);
}

export function getRUEasyByIndex(i: number): Puzzle | undefined {
  return getFromPool(easy, i);
}

export function getRUMediumByIndex(i: number): Puzzle | undefined {
  return getFromPool(medium, i);
}

export function getRUHardByIndex(i: number): Puzzle | undefined {
  return getFromPool(hard, i);
}

export function getRUEasyRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(easyRamped, i);
}

export function getRUMediumRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(mediumRamped, i);
}

export function getRUHardRampedByIndex(i: number): Puzzle | undefined {
  return getFromPool(hardRamped, i);
}
