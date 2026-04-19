import type { Puzzle } from "../types/puzzle";
import type { ResultSummary } from "./result";
import { formatDuration } from "./result";
import type { Strings } from "../../i18n/strings";

const SOLVED_EMOJI = ["🟨", "🟩", "🟥", "🟪"];

export interface ShareContext {
  mode: "daily" | "standard";
  dayLabel?: string;
  index?: number;
  strings?: Strings;
}

export function buildShareString(
  summary: ResultSummary,
  puzzle: Puzzle,
  ctx: ShareContext,
): string {
  const s = ctx.strings;
  const dailyLabel = s ? s.daily.label : "Daily";

  const header =
    ctx.mode === "daily"
      ? `Foldwink · ${ctx.dayLabel ?? dailyLabel}`
      : `Foldwink · #${String(ctx.index ?? 0).padStart(3, "0")}`;

  const statusLine =
    summary.result === "win"
      ? s
        ? s.share.shareTextSolvedLine(formatDuration(summary.durationMs), summary.mistakesUsed)
        : `Solved in ${formatDuration(summary.durationMs)} · ${summary.mistakesUsed}/4 mistakes`
      : s
        ? s.share.shareTextOutLine(summary.mistakesUsed)
        : `Out of mistakes · ${summary.mistakesUsed}/4`;

  const grid = puzzle.groups
    .map((g, i) => {
      const emoji = SOLVED_EMOJI[i % SOLVED_EMOJI.length];
      return summary.solvedGroupIds.includes(g.id) ? emoji.repeat(4) : "⬛".repeat(4);
    })
    .join("\n");

  const footer = s ? s.share.shareTextFooter : "neural-void.com/foldwink";

  return `${header}\n${statusLine}\n\n${grid}\n\n${footer}`;
}
