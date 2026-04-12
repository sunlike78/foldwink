import { useMemo } from "react";
import { loadDailyHistory } from "../stats/persistence";
import type { DailyRecord } from "../game/types/stats";
import { formatDuration } from "../game/engine/result";

interface ArchiveEntry {
  date: string;
  record: DailyRecord;
}

export function DailyArchive() {
  const entries = useMemo<ArchiveEntry[]>(() => {
    const history = loadDailyHistory();
    return Object.entries(history)
      .map(([date, record]) => ({ date, record }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
  }, []);

  if (entries.length === 0) {
    return (
      <div className="text-center text-xs text-muted py-3">
        No daily history yet. Solve today&apos;s puzzle to start.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map(({ date, record }) => {
        const isWin = record.result === "win";
        return (
          <div
            key={date}
            className="flex items-center justify-between rounded-lg bg-surface border border-[#262a33] px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-muted">{date}</span>
              <span className={`font-semibold ${isWin ? "text-accent" : "text-muted"}`}>
                {isWin ? "Solved" : "Failed"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted tabular-nums">
              <span>{record.mistakesUsed}/4</span>
              <span>{formatDuration(record.durationMs)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
