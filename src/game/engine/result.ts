import type { ActiveGame, GameResult } from "../types/game";

export interface ResultSummary {
  result: GameResult;
  mistakesUsed: number;
  durationMs: number;
  solvedGroupIds: string[];
}

export function calculateResultSummary(game: ActiveGame, endedAt: number): ResultSummary {
  if (!game.result) {
    throw new Error("calculateResultSummary called before game ended");
  }
  return {
    result: game.result,
    mistakesUsed: game.mistakesUsed,
    durationMs: Math.max(0, endedAt - game.startedAt),
    solvedGroupIds: game.solvedGroupIds.slice(),
  };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
