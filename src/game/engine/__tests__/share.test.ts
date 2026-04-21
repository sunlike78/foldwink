import { describe, it, expect } from "vitest";
import { buildShareString } from "../share";
import type { Puzzle } from "../../types/puzzle";
import type { ResultSummary } from "../result";

const puzzle: Puzzle = {
  id: "puzzle-0001",
  title: "Test",
  difficulty: "easy",
  groups: [
    { id: "a", label: "A", items: ["a1", "a2", "a3", "a4"] },
    { id: "b", label: "B", items: ["b1", "b2", "b3", "b4"] },
    { id: "c", label: "C", items: ["c1", "c2", "c3", "c4"] },
    { id: "d", label: "D", items: ["d1", "d2", "d3", "d4"] },
  ],
};

describe("buildShareString", () => {
  it("formats a daily win", () => {
    const summary: ResultSummary = {
      result: "win",
      mistakesUsed: 1,
      durationMs: 125_000,
      solvedGroupIds: ["a", "b", "c", "d"],
    };
    const s = buildShareString(summary, puzzle, { mode: "daily", dayLabel: "2026-04-10" });
    expect(s).toContain("Foldwink · 2026-04-10");
    expect(s).toContain("Solved in 2:05");
    expect(s).toContain("1/4 mistakes");
    expect(s).toContain("🟨🟨🟨🟨");
    expect(s).toContain("🟪🟪🟪🟪");
    expect(s).toContain("neural-void.com/foldwink");
  });

  it("formats a loss with partial groups", () => {
    const summary: ResultSummary = {
      result: "loss",
      mistakesUsed: 4,
      durationMs: 60_000,
      solvedGroupIds: ["a", "c"],
    };
    const s = buildShareString(summary, puzzle, { mode: "standard", index: 7 });
    expect(s).toContain("Foldwink · #007");
    expect(s).toContain("Out of mistakes");
    expect(s).toContain("🟨🟨🟨🟨");
    expect(s).toContain("⬛⬛⬛⬛");
    expect(s).toContain("🟥🟥🟥🟥");
  });

  it("appends the grade line on a win when grade is provided", () => {
    const summary: ResultSummary = {
      result: "win",
      mistakesUsed: 0,
      durationMs: 75_000,
      solvedGroupIds: ["a", "b", "c", "d"],
    };
    const s = buildShareString(summary, puzzle, {
      mode: "standard",
      index: 12,
      grade: {
        base: "flawless",
        noWinkMedium: false,
        label: "Flawless",
        caption: "0 mistakes",
      },
    });
    expect(s).toContain("✦ Flawless");
    // Grade line should sit between status and the grid blank separator.
    const lines = s.split("\n");
    const flawlessIdx = lines.findIndex((l) => l.startsWith("✦"));
    const solvedIdx = lines.findIndex((l) => l.startsWith("Solved in"));
    expect(solvedIdx).toBeGreaterThanOrEqual(0);
    expect(flawlessIdx).toBeGreaterThan(solvedIdx);
  });

  it("omits the grade line on a loss even if grade is provided", () => {
    const summary: ResultSummary = {
      result: "loss",
      mistakesUsed: 4,
      durationMs: 60_000,
      solvedGroupIds: ["a"],
    };
    const s = buildShareString(summary, puzzle, {
      mode: "daily",
      dayLabel: "2026-04-12",
      grade: {
        base: "loss",
        noWinkMedium: false,
        label: "Close call",
        caption: null,
      },
    });
    expect(s).not.toContain("✦");
  });
});
