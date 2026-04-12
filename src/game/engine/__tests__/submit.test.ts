import { describe, it, expect } from "vitest";
import { canSubmit, findMatchingGroup } from "../submit";
import type { Puzzle } from "../../types/puzzle";

const puzzle: Puzzle = {
  id: "test-0002",
  title: "Submit Test",
  difficulty: "easy",
  groups: [
    { id: "colors", label: "Colors", items: ["Red", "Blue", "Green", "Yellow"] },
    { id: "fruits", label: "Fruits", items: ["Apple", "Pear", "Plum", "Kiwi"] },
    { id: "animals", label: "Animals", items: ["Cat", "Dog", "Fox", "Owl"] },
    { id: "metals", label: "Metals", items: ["Iron", "Gold", "Tin", "Zinc"] },
  ],
};

describe("canSubmit", () => {
  it("requires exactly 4", () => {
    expect(canSubmit([])).toBe(false);
    expect(canSubmit(["a", "b", "c"])).toBe(false);
    expect(canSubmit(["a", "b", "c", "d"])).toBe(true);
    expect(canSubmit(["a", "b", "c", "d", "e"])).toBe(false);
  });
});

describe("findMatchingGroup", () => {
  it("matches an exact group regardless of order", () => {
    const m = findMatchingGroup(["Green", "Red", "Yellow", "Blue"], puzzle);
    expect(m?.id).toBe("colors");
  });
  it("returns null for a cross-group selection", () => {
    const m = findMatchingGroup(["Red", "Blue", "Apple", "Cat"], puzzle);
    expect(m).toBeNull();
  });
  it("returns null for partial 3-match", () => {
    const m = findMatchingGroup(["Red", "Blue", "Green", "Apple"], puzzle);
    expect(m).toBeNull();
  });
  it("returns null if duplicates present", () => {
    const m = findMatchingGroup(["Red", "Red", "Green", "Blue"], puzzle);
    expect(m).toBeNull();
  });
  it("returns null at wrong length", () => {
    expect(findMatchingGroup(["Red", "Blue", "Green"], puzzle)).toBeNull();
  });
});
