import type { ActiveGame } from "../types/game";
import type { Puzzle } from "../types/puzzle";
import type { ResultSummary } from "./result";

/**
 * Foldwink result grading.
 *
 * Pure, local, no FOMO. Grades are a small post-puzzle reward: they reflect
 * the facts of the run, nothing more. They never unlock content and are not
 * displayed as a competitive ladder.
 *
 * Grade ladder:
 *   flawless     — win with 0 mistakes
 *   one-mistake  — win with exactly 1 mistake
 *   two-mistakes — win with exactly 2 mistakes
 *   clutch       — win with 3 mistakes (one away from loss)
 *   no-wink      — medium win without spending Wink (bonus flag, additive)
 *   loss         — failed run
 */

export type BaseGrade = "flawless" | "one-mistake" | "two-mistakes" | "clutch" | "loss";

export interface ResultGrade {
  base: BaseGrade;
  /** True when the player won a medium puzzle without using Wink. */
  noWinkMedium: boolean;
  /** Short human label, e.g. "Flawless" or "No-Wink Medium". */
  label: string;
  /** Optional caption, shown smaller beneath the label. */
  caption: string | null;
}

function baseFor(summary: ResultSummary): BaseGrade {
  if (summary.result !== "win") return "loss";
  switch (summary.mistakesUsed) {
    case 0:
      return "flawless";
    case 1:
      return "one-mistake";
    case 2:
      return "two-mistakes";
    default:
      return "clutch";
  }
}

export function gradeResult(
  summary: ResultSummary,
  puzzle: Puzzle,
  active: ActiveGame | null,
): ResultGrade {
  const base = baseFor(summary);

  const noWinkMedium =
    summary.result === "win" &&
    puzzle.difficulty === "medium" &&
    active !== null &&
    active.winkedGroupId === null;

  if (base === "loss") {
    return {
      base,
      noWinkMedium: false,
      label: "Close call",
      caption: null,
    };
  }

  if (noWinkMedium && base === "flawless") {
    return {
      base,
      noWinkMedium,
      label: "Flawless · No Wink",
      caption: "Medium solved clean",
    };
  }

  if (noWinkMedium) {
    return {
      base,
      noWinkMedium,
      label: "No-Wink Medium",
      caption:
        base === "one-mistake"
          ? "1 mistake"
          : base === "two-mistakes"
            ? "2 mistakes"
            : "Clutch",
    };
  }

  switch (base) {
    case "flawless":
      return { base, noWinkMedium, label: "Flawless", caption: "0 mistakes" };
    case "one-mistake":
      return { base, noWinkMedium, label: "Clean solve", caption: "1 mistake" };
    case "two-mistakes":
      return { base, noWinkMedium, label: "Steady solve", caption: "2 mistakes" };
    case "clutch":
      return { base, noWinkMedium, label: "Clutch", caption: "One away" };
  }
}
