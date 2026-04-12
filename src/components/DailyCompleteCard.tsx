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
    <div className="w-full max-w-xs rounded-2xl bg-surface border border-[#2e343f] px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-accent">
          ✦ Daily complete
        </div>
        <div
          className={`text-[10px] uppercase tracking-[0.12em] ${
            isWin ? "text-solved2" : "text-muted"
          }`}
        >
          {isWin ? "solved" : "missed"}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="text-2xl font-extrabold tabular-nums leading-none">
          {formatDuration(record.durationMs)}
        </div>
        <div className="text-xs text-muted">{record.mistakesUsed}/4 mistakes</div>
      </div>
      {typeof currentStreak === "number" && currentStreak > 0 && (
        <div className="mt-2 text-[11px] text-muted">
          Streak <span className="text-text font-semibold tabular-nums">{currentStreak}</span>
        </div>
      )}
      <div className="mt-4 pt-3 border-t border-[#262a33]">
        <DailyCountdown />
      </div>
    </div>
  );
}
