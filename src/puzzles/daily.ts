import type { Puzzle } from "../game/types/puzzle";
import { fnv1a } from "../utils/hash";

export function getDailyPuzzleId(date: string, pool: readonly Puzzle[]): string {
  if (pool.length === 0) {
    throw new Error("Puzzle pool is empty; cannot pick daily puzzle");
  }
  const idx = fnv1a(date) % pool.length;
  return pool[idx].id;
}
