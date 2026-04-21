import type { Puzzle } from "../game/types/puzzle";

const modules = import.meta.glob("../../puzzles/de/pool/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

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

function buildPool(): Puzzle[] {
  const collected: Puzzle[] = [];
  const seenIds = new Set<string>();
  for (const [path, mod] of Object.entries(modules)) {
    if (!isValidPuzzle(mod)) {
      console.warn(`[puzzles/de] dropping invalid puzzle at ${path}`);
      continue;
    }
    if (seenIds.has(mod.id)) continue;
    seenIds.add(mod.id);
    collected.push(mod);
  }
  collected.sort((a, b) => a.id.localeCompare(b.id));
  return collected;
}

export const DE_PUZZLE_POOL: readonly Puzzle[] = buildPool();
export const DE_EASY_POOL: readonly Puzzle[] = DE_PUZZLE_POOL.filter(
  (p) => p.difficulty === "easy",
);
export const DE_MEDIUM_POOL: readonly Puzzle[] = DE_PUZZLE_POOL.filter(
  (p) => p.difficulty === "medium",
);
export const DE_HARD_POOL: readonly Puzzle[] = DE_PUZZLE_POOL.filter(
  (p) => p.difficulty === "hard",
);

function compareByDifficultyScore(a: Puzzle, b: Puzzle): number {
  // Prefer the GPT + heuristic blended editorialRank when available; fall
  // back to the pure-heuristic difficultyScore; fall back to the midpoint.
  const sa = a.meta?.editorialRank ?? a.meta?.difficultyScore ?? 50;
  const sb = b.meta?.editorialRank ?? b.meta?.difficultyScore ?? 50;
  if (sa !== sb) return sa - sb;
  return a.id.localeCompare(b.id);
}

export const DE_EASY_POOL_RAMPED: readonly Puzzle[] = [...DE_EASY_POOL].sort(
  compareByDifficultyScore,
);
export const DE_MEDIUM_POOL_RAMPED: readonly Puzzle[] = [...DE_MEDIUM_POOL].sort(
  compareByDifficultyScore,
);
export const DE_HARD_POOL_RAMPED: readonly Puzzle[] = [...DE_HARD_POOL].sort(
  compareByDifficultyScore,
);

function getFromPool(pool: readonly Puzzle[], index: number): Puzzle | undefined {
  if (pool.length === 0) return undefined;
  const idx = ((index % pool.length) + pool.length) % pool.length;
  return pool[idx];
}

export function getDEPuzzleById(id: string): Puzzle | undefined {
  return DE_PUZZLE_POOL.find((p) => p.id === id);
}

export function getDEPuzzleByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_PUZZLE_POOL, index);
}

export function getDEEasyByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_EASY_POOL, index);
}

export function getDEMediumByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_MEDIUM_POOL, index);
}

export function getDEHardByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_HARD_POOL, index);
}

export function getDEEasyRampedByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_EASY_POOL_RAMPED, index);
}

export function getDEMediumRampedByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_MEDIUM_POOL_RAMPED, index);
}

export function getDEHardRampedByIndex(index: number): Puzzle | undefined {
  return getFromPool(DE_HARD_POOL_RAMPED, index);
}
