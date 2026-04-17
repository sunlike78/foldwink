import type { DailyRecord } from "../game/types/stats";
import { formatDuration } from "../game/engine/result";
import { DailyCountdown } from "./DailyCountdown";

interface Props {
  record: DailyRecord;
  currentStreak?: number;
}

/**
 * Inline card used on the main menu when the player has already completed
 * today's daily puzzle. Shows the day's result pill, the next-daily
 * countdown, and optionally the current streak.
 *
 * Purposely contains no primary CTA — the menu already offers "Standard
 * puzzle" below it and "Back to menu" nav is not needed here.
 */
export function DailyCompleteCard({ record, currentStreak }: Props) {
  const isWin = record.result === "win";
  return (
    <div className="w-full max-w-xs rounded-2xl bg-surface border border-[#2e343f] px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.14em] text-accent">
          ✦ Daily · {isWin ? "solved" : "missed"}
        </div>
        <div className="text-[10px] text-muted tabular-nums">
          {formatDuration(record.durationMs)} · {record.mistakesUsed}/4
          {typeof currentStreak === "number" && currentStreak > 0 && (
            <>
              {" · "}
              <span className="text-text font-semibold">×{currentStreak}</span>
            </>
          )}
        </div>
      </div>
      <div className="mt-2 text-center text-[11px] text-muted">
        <DailyCountdown />
      </div>
    </div>
  );
}
