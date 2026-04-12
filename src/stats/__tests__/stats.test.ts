import { describe, it, expect } from "vitest";
import { applyGameResult, type GameResultContext } from "../stats";
import { INITIAL_STATS } from "../../game/types/stats";

function ctx(overrides: Partial<GameResultContext> = {}): GameResultContext {
  return {
    puzzleId: "p1",
    difficulty: "easy",
    mistakesUsed: 0,
    winkUsed: false,
    durationMs: 120_000,
    ...overrides,
  };
}

describe("applyGameResult", () => {
  it("win increments wins, streak, records solved id", () => {
    const s = applyGameResult(INITIAL_STATS, "win", ctx());
    expect(s.gamesPlayed).toBe(1);
    expect(s.wins).toBe(1);
    expect(s.losses).toBe(0);
    expect(s.currentStreak).toBe(1);
    expect(s.bestStreak).toBe(1);
    expect(s.solvedPuzzleIds).toEqual(["p1"]);
    expect(s.flawlessWins).toBe(1);
  });

  it("loss resets streak and tracks losses", () => {
    let s = applyGameResult(INITIAL_STATS, "win", ctx({ puzzleId: "p1" }));
    s = applyGameResult(s, "win", ctx({ puzzleId: "p2" }));
    expect(s.currentStreak).toBe(2);
    s = applyGameResult(s, "loss", ctx({ puzzleId: "p3", mistakesUsed: 4 }));
    expect(s.currentStreak).toBe(0);
    expect(s.losses).toBe(1);
    expect(s.bestStreak).toBe(2);
  });

  it("dedups solvedPuzzleIds", () => {
    let s = applyGameResult(INITIAL_STATS, "win", ctx({ puzzleId: "p1" }));
    s = applyGameResult(s, "win", ctx({ puzzleId: "p1" }));
    expect(s.solvedPuzzleIds).toEqual(["p1"]);
  });

  it("bestStreak persists after reset", () => {
    let s = INITIAL_STATS;
    for (let i = 0; i < 5; i++) {
      s = applyGameResult(s, "win", ctx({ puzzleId: `p${i}` }));
    }
    expect(s.bestStreak).toBe(5);
    s = applyGameResult(s, "loss", ctx({ puzzleId: "px", mistakesUsed: 4 }));
    expect(s.bestStreak).toBe(5);
    expect(s.currentStreak).toBe(0);
  });

  it("tracks medium wins and losses separately", () => {
    let s = applyGameResult(INITIAL_STATS, "win", ctx({ difficulty: "medium" }));
    expect(s.mediumWins).toBe(1);
    s = applyGameResult(s, "loss", ctx({ difficulty: "medium", mistakesUsed: 4 }));
    expect(s.mediumLosses).toBe(1);
  });

  it("counts wink uses", () => {
    let s = applyGameResult(
      INITIAL_STATS,
      "win",
      ctx({ difficulty: "medium", winkUsed: true }),
    );
    expect(s.winkUses).toBe(1);
    s = applyGameResult(s, "win", ctx({ difficulty: "medium", winkUsed: false }));
    expect(s.winkUses).toBe(1);
  });

  it("accumulates total mistakes across runs", () => {
    let s = applyGameResult(INITIAL_STATS, "win", ctx({ mistakesUsed: 1 }));
    s = applyGameResult(s, "win", ctx({ mistakesUsed: 2 }));
    s = applyGameResult(s, "loss", ctx({ mistakesUsed: 4 }));
    expect(s.totalMistakes).toBe(7);
  });

  it("pushes recent solves and keeps the last 10 entries", () => {
    let s: import("../../game/types/stats").Stats = INITIAL_STATS;
    for (let i = 0; i < 12; i++) {
      s = applyGameResult(s, "win", ctx({ puzzleId: `p${i}`, durationMs: 100_000 + i }));
    }
    expect(s.recentSolves!.length).toBe(10);
    // Oldest kept entry is the 3rd solve (index 2 of the original 12).
    expect(s.recentSolves![0].durationMs).toBe(100_002);
    expect(s.recentSolves![9].durationMs).toBe(100_011);
  });

  it("increments mediumLossStreak on consecutive medium losses", () => {
    let s = applyGameResult(
      INITIAL_STATS,
      "loss",
      ctx({ difficulty: "medium", mistakesUsed: 4 }),
    );
    expect(s.mediumLossStreak).toBe(1);
    s = applyGameResult(s, "loss", ctx({ difficulty: "medium", mistakesUsed: 4 }));
    expect(s.mediumLossStreak).toBe(2);
  });

  it("resets mediumLossStreak on a medium win", () => {
    let s = applyGameResult(
      INITIAL_STATS,
      "loss",
      ctx({ difficulty: "medium", mistakesUsed: 4 }),
    );
    s = applyGameResult(s, "loss", ctx({ difficulty: "medium", mistakesUsed: 4 }));
    expect(s.mediumLossStreak).toBe(2);
    s = applyGameResult(s, "win", ctx({ difficulty: "medium" }));
    expect(s.mediumLossStreak).toBe(0);
  });

  it("does not touch mediumLossStreak on easy puzzles", () => {
    let s = applyGameResult(
      INITIAL_STATS,
      "loss",
      ctx({ difficulty: "medium", mistakesUsed: 4 }),
    );
    s = applyGameResult(s, "loss", ctx({ difficulty: "easy", mistakesUsed: 4 }));
    expect(s.mediumLossStreak).toBe(1);
  });
});
