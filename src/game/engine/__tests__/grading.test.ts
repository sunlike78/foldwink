import { describe, it, expect } from "vitest";
import { gradeResult } from "../grading";
import type { Puzzle } from "../../types/puzzle";
import type { ActiveGame } from "../../types/game";
import type { ResultSummary } from "../result";

function mkPuzzle(difficulty: "easy" | "medium" = "easy"): Puzzle {
  return {
    id: "p1",
    title: "P",
    difficulty,
    groups: [
      { id: "a", label: "A", items: ["a1", "a2", "a3", "a4"] },
      { id: "b", label: "B", items: ["b1", "b2", "b3", "b4"] },
      { id: "c", label: "C", items: ["c1", "c2", "c3", "c4"] },
      { id: "d", label: "D", items: ["d1", "d2", "d3", "d4"] },
    ],
  };
}

function mkActive(overrides: Partial<ActiveGame> = {}): ActiveGame {
  return {
    puzzleId: "p1",
    mode: "standard",
    order: [],
    selection: [],
    solvedGroupIds: ["a", "b", "c", "d"],
    mistakesUsed: 0,
    startedAt: 0,
    countsToStats: true,
    winkedGroupId: null,
    ...overrides,
  };
}

function mkSummary(
  result: "win" | "loss",
  mistakesUsed: number,
  solved = ["a", "b", "c", "d"],
): ResultSummary {
  return { result, mistakesUsed, durationMs: 60_000, solvedGroupIds: solved };
}

describe("gradeResult", () => {
  it("flawless for a zero-mistake easy win", () => {
    const g = gradeResult(mkSummary("win", 0), mkPuzzle(), mkActive());
    expect(g.base).toBe("flawless");
    expect(g.label).toBe("Flawless");
  });

  it("one-mistake easy win", () => {
    const g = gradeResult(mkSummary("win", 1), mkPuzzle(), mkActive({ mistakesUsed: 1 }));
    expect(g.base).toBe("one-mistake");
  });

  it("clutch for a 3-mistake win", () => {
    const g = gradeResult(mkSummary("win", 3), mkPuzzle(), mkActive({ mistakesUsed: 3 }));
    expect(g.base).toBe("clutch");
  });

  it("loss overrides mistake count", () => {
    const g = gradeResult(
      mkSummary("loss", 4, ["a", "b"]),
      mkPuzzle(),
      mkActive({ mistakesUsed: 4, solvedGroupIds: ["a", "b"] }),
    );
    expect(g.base).toBe("loss");
    expect(g.noWinkMedium).toBe(false);
  });

  it("no-wink flag set only for a medium win without Wink", () => {
    const g = gradeResult(
      mkSummary("win", 1),
      mkPuzzle("medium"),
      mkActive({ mistakesUsed: 1, winkedGroupId: null }),
    );
    expect(g.noWinkMedium).toBe(true);
  });

  it("no-wink flag cleared when Wink was used on a medium", () => {
    const g = gradeResult(
      mkSummary("win", 0),
      mkPuzzle("medium"),
      mkActive({ winkedGroupId: "a" }),
    );
    expect(g.noWinkMedium).toBe(false);
  });

  it("no-wink flag cleared for easy puzzles regardless", () => {
    const g = gradeResult(mkSummary("win", 0), mkPuzzle("easy"), mkActive());
    expect(g.noWinkMedium).toBe(false);
  });

  it("flawless + no-wink composes into a combined label", () => {
    const g = gradeResult(mkSummary("win", 0), mkPuzzle("medium"), mkActive());
    expect(g.label).toBe("Flawless · No Wink");
  });
});
