import type { Puzzle } from "../types/puzzle";
import type { ResultSummary } from "./result";
import { formatDuration } from "./result";

const SOLVED_EMOJI = ["🟨", "🟩", "🟥", "🟪"];

export interface ShareContext {
  mode: "daily" | "standard";
  dayLabel?: string;
  index?: number;
}

export function buildShareString(
  summary: ResultSummary,
  puzzle: Puzzle,
  ctx: ShareContext,
): string {
  const header =
    ctx.mode === "daily"
      ? `Foldwink · ${ctx.dayLabel ?? "Daily"}`
      : `Foldwink · #${String(ctx.index ?? 0).padStart(3, "0")}`;

  const statusLine =
    summary.result === "win"
      ? `Solved in ${formatDuration(summary.durationMs)} · ${summary.mistakesUsed}/4 mistakes`
      : `Out of mistakes · ${summary.mistakesUsed}/4`;

  const grid = puzzle.groups
    .map((g, i) => {
      const emoji = SOLVED_EMOJI[i % SOLVED_EMOJI.length];
      return summary.solvedGroupIds.includes(g.id) ? emoji.repeat(4) : "⬛".repeat(4);
    })
    .join("\n");

  return `${header}\n${statusLine}\n\n${grid}\n\nneural-void.com/foldwink`;
}
