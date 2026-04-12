import type { Puzzle } from "../game/types/puzzle";
import type { ResultSummary as ResultSummaryModel } from "../game/engine/result";
import { formatDuration } from "../game/engine/result";
import { solvedClassForGroup } from "../game/solvedColors";
import { StatStrip } from "./StatStrip";

interface Props {
  summary: ResultSummaryModel;
  puzzle: Puzzle;
  currentStreak: number;
}

export function ResultSummary({ summary, puzzle, currentStreak }: Props) {
  const isWin = summary.result === "win";
  const headline = isWin ? "Solved" : "Out of mistakes";

  return (
    <div className="space-y-5 fw-result-pop">
      <div className="text-center">
        <div
          className={`text-[11px] uppercase tracking-[0.14em] mb-2 ${
            isWin ? "text-accent" : "text-muted"
          }`}
        >
          {isWin ? "Foldwink · cleared" : "Foldwink · close call"}
        </div>
        <div className="text-4xl font-extrabold mb-3">{headline}</div>
        <div className="mx-auto h-[3px] w-12 rounded-full bg-accent/60" />
      </div>

      <StatStrip
        cells={[
          {
            label: "Time",
            value: formatDuration(summary.durationMs),
          },
          {
            label: "Mistakes",
            value: `${summary.mistakesUsed}/4`,
            tone: summary.mistakesUsed >= 3 ? "muted" : "default",
          },
          {
            label: "Streak",
            value: currentStreak,
            tone: isWin && currentStreak > 0 ? "accent" : "default",
          },
        ]}
      />

      <div className="space-y-2">
        {puzzle.groups.map((g) => (
          <div
            key={g.id}
            className={`rounded-xl px-4 py-3 ${solvedClassForGroup(puzzle, g.id)}`}
          >
            <div className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-80">
              {g.label}
            </div>
            <div className="font-semibold mt-0.5">{g.items.join(" · ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
