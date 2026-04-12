import { describe, it, expect } from "vitest";
import { flattenPuzzle, shuffleDeterministic, shuffleItems, seedFromString } from "../shuffle";
import type { Puzzle } from "../../types/puzzle";

const puzzle: Puzzle = {
  id: "test-0001",
  title: "Test",
  difficulty: "easy",
  groups: [
    { id: "g1", label: "G1", items: ["a1", "a2", "a3", "a4"] },
    { id: "g2", label: "G2", items: ["b1", "b2", "b3", "b4"] },
    { id: "g3", label: "G3", items: ["c1", "c2", "c3", "c4"] },
    { id: "g4", label: "G4", items: ["d1", "d2", "d3", "d4"] },
  ],
};

describe("flattenPuzzle", () => {
  it("returns 16 flat items", () => {
    const items = flattenPuzzle(puzzle);
    expect(items).toHaveLength(16);
  });
  it("preserves group membership", () => {
    const items = flattenPuzzle(puzzle);
    const g1items = items.filter((i) => i.groupId === "g1").map((i) => i.value);
    expect(g1items).toEqual(["a1", "a2", "a3", "a4"]);
  });
});

describe("shuffleDeterministic", () => {
  it("is stable under same seed", () => {
    const a = shuffleDeterministic([1, 2, 3, 4, 5, 6, 7, 8], 42);
    const b = shuffleDeterministic([1, 2, 3, 4, 5, 6, 7, 8], 42);
    expect(a).toEqual(b);
  });
  it("usually differs between seeds", () => {
    const a = shuffleDeterministic([1, 2, 3, 4, 5, 6, 7, 8], 1);
    const b = shuffleDeterministic([1, 2, 3, 4, 5, 6, 7, 8], 9999);
    expect(a).not.toEqual(b);
  });
  it("preserves elements", () => {
    const a = shuffleDeterministic([1, 2, 3, 4, 5, 6, 7, 8], 100);
    expect(a.slice().sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("shuffleItems", () => {
  it("returns all 16 values", () => {
    const values = shuffleItems(puzzle, seedFromString("test"));
    expect(values).toHaveLength(16);
    const all = new Set(values);
    expect(all.size).toBe(16);
  });
});
