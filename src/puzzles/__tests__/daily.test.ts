import { describe, it, expect } from "vitest";
import { getDailyPuzzleId } from "../daily";
import type { Puzzle } from "../../game/types/puzzle";

function mkPuzzle(id: string): Puzzle {
  return {
    id,
    title: id,
    difficulty: "easy",
    groups: [
      { id: "g1", label: "G1", items: ["a", "b", "c", "d"] },
      { id: "g2", label: "G2", items: ["e", "f", "g", "h"] },
      { id: "g3", label: "G3", items: ["i", "j", "k", "l"] },
      { id: "g4", label: "G4", items: ["m", "n", "o", "p"] },
    ],
  };
}

const pool: Puzzle[] = Array.from({ length: 30 }, (_, i) =>
  mkPuzzle(`puzzle-${String(i + 1).padStart(4, "0")}`),
);

describe("getDailyPuzzleId", () => {
  it("returns same id for the same date", () => {
    const a = getDailyPuzzleId("2026-04-10", pool);
    const b = getDailyPuzzleId("2026-04-10", pool);
    expect(a).toBe(b);
  });
  it("often differs across consecutive dates", () => {
    const dates = ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04", "2026-04-05"];
    const ids = dates.map((d) => getDailyPuzzleId(d, pool));
    const unique = new Set(ids);
    expect(unique.size).toBeGreaterThan(1);
  });
  it("always returns an id within the pool", () => {
    const ids = new Set(pool.map((p) => p.id));
    for (let d = 1; d <= 28; d++) {
      const date = `2026-04-${String(d).padStart(2, "0")}`;
      expect(ids.has(getDailyPuzzleId(date, pool))).toBe(true);
    }
  });
  it("throws on empty pool", () => {
    expect(() => getDailyPuzzleId("2026-04-10", [])).toThrow();
  });
});
