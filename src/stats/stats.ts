import type { GameResult } from "../game/types/game";
import type { PuzzleDifficulty } from "../game/types/puzzle";
import { RECENT_SOLVES_LIMIT, type RecentSolve, type Stats } from "../game/types/stats";

export interface GameResultContext {
  puzzleId: string;
  difficulty: PuzzleDifficulty;
  mistakesUsed: number;
  winkUsed: boolean;
  durationMs: number;
}

function pushRecentSolve(
  current: RecentSolve[] | undefined,
  entry: RecentSolve,
): RecentSolve[] {
  const base = current ?? [];
  const next = [...base, entry];
  if (next.length > RECENT_SOLVES_LIMIT) {
    return next.slice(next.length - RECENT_SOLVES_LIMIT);
  }
  return next;
}

function updateMediumLossStreak(
  prev: number | undefined,
  result: GameResult,
  difficulty: PuzzleDifficulty,
): number {
  const current = prev ?? 0;
  if (difficulty !== "medium") return current;
  if (result === "loss") return current + 1;
  if (result === "win") return 0;
  return current;
}

function updateHardLossStreak(
  prev: number | undefined,
  result: GameResult,
  difficulty: PuzzleDifficulty,
): number {
  const current = prev ?? 0;
  if (difficulty !== "hard") return current;
  if (result === "loss") return current + 1;
  if (result === "win") return 0;
  return current;
}

export function applyGameResult(
  stats: Stats,
  result: GameResult,
  context: GameResultContext,
): Stats {
  const gamesPlayed = stats.gamesPlayed + 1;
  const wins = stats.wins + (result === "win" ? 1 : 0);
  const losses = stats.losses + (result === "loss" ? 1 : 0);
  const currentStreak = result === "win" ? stats.currentStreak + 1 : 0;
  const bestStreak = Math.max(stats.bestStreak, currentStreak);
  const solvedPuzzleIds =
    result === "win" && !stats.solvedPuzzleIds.includes(context.puzzleId)
      ? [...stats.solvedPuzzleIds, context.puzzleId]
      : stats.solvedPuzzleIds;

  const isMediumWin = result === "win" && context.difficulty === "medium";
  const isMediumLoss = result === "loss" && context.difficulty === "medium";
  const isHardWin = result === "win" && context.difficulty === "hard";
  const isHardLoss = result === "loss" && context.difficulty === "hard";

  const recentSolves = pushRecentSolve(stats.recentSolves, {
    difficulty: context.difficulty,
    result,
    mistakesUsed: context.mistakesUsed,
    durationMs: context.durationMs,
  });

  return {
    gamesPlayed,
    wins,
    losses,
    currentStreak,
    bestStreak,
    solvedPuzzleIds,
    mediumWins: (stats.mediumWins ?? 0) + (isMediumWin ? 1 : 0),
    mediumLosses: (stats.mediumLosses ?? 0) + (isMediumLoss ? 1 : 0),
    totalMistakes: (stats.totalMistakes ?? 0) + context.mistakesUsed,
    winkUses: (stats.winkUses ?? 0) + (context.winkUsed ? 1 : 0),
    flawlessWins:
      (stats.flawlessWins ?? 0) + (result === "win" && context.mistakesUsed === 0 ? 1 : 0),
    mediumLossStreak: updateMediumLossStreak(
      stats.mediumLossStreak,
      result,
      context.difficulty,
    ),
    recentSolves,
    hardWins: (stats.hardWins ?? 0) + (isHardWin ? 1 : 0),
    hardLosses: (stats.hardLosses ?? 0) + (isHardLoss ? 1 : 0),
    hardLossStreak: updateHardLossStreak(stats.hardLossStreak, result, context.difficulty),
  };
}
