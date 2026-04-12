import type { Puzzle } from "../game/types/puzzle";

const modules = import.meta.glob("../../puzzles/pool/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function isValidPuzzle(value: unknown): value is Puzzle {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || !v.id) return false;
  if (typeof v.title !== "string" || !v.title) return false;
  if (v.difficulty !== "easy" && v.difficulty !== "medium") return false;
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

function buildPool(): Puzzle[] {
  const collected: Puzzle[] = [];
  const seenIds = new Set<string>();
  for (const [path, mod] of Object.entries(modules)) {
    if (!isValidPuzzle(mod)) {
      if (import.meta.env.DEV) {
        throw new Error(`Invalid puzzle file: ${path}`);
      }
      console.warn(`[puzzles] dropping invalid puzzle at ${path}`);
      continue;
    }
    if (seenIds.has(mod.id)) {
      if (import.meta.env.DEV) {
        throw new Error(`Duplicate puzzle id: ${mod.id} (${path})`);
      }
      continue;
    }
    seenIds.add(mod.id);
    collected.push(mod);
  }
  collected.sort((a, b) => a.id.localeCompare(b.id));
  return collected;
}

export const PUZZLE_POOL: readonly Puzzle[] = buildPool();

export const EASY_POOL: readonly Puzzle[] = PUZZLE_POOL.filter((p) => p.difficulty === "easy");
export const MEDIUM_POOL: readonly Puzzle[] = PUZZLE_POOL.filter(
  (p) => p.difficulty === "medium",
);
export const HARD_POOL: readonly Puzzle[] = PUZZLE_POOL.filter((p) => p.difficulty === "hard");

export function getPuzzleById(id: string): Puzzle | undefined {
  return PUZZLE_POOL.find((p) => p.id === id);
}

function getFromPool(pool: readonly Puzzle[], index: number): Puzzle | undefined {
  if (pool.length === 0) return undefined;
  const idx = ((index % pool.length) + pool.length) % pool.length;
  return pool[idx];
}

export function getPuzzleByIndex(index: number): Puzzle | undefined {
  return getFromPool(PUZZLE_POOL, index);
}

export function getEasyByIndex(index: number): Puzzle | undefined {
  return getFromPool(EASY_POOL, index);
}

export function getMediumByIndex(index: number): Puzzle | undefined {
  return getFromPool(MEDIUM_POOL, index);
}

export function getHardByIndex(index: number): Puzzle | undefined {
  return getFromPool(HARD_POOL, index);
}
