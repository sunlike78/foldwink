import { useEffect } from "react";
import { useGameStore } from "../game/state/appStore";
import { Button } from "../components/Button";
import { ResultSummary } from "../components/ResultSummary";
import { ShareButton } from "../components/ShareButton";
import { DailyCountdown } from "../components/DailyCountdown";
import { buildShareString } from "../game/engine/share";
import { gradeResult } from "../game/engine/grading";
import { todayLocal } from "../utils/date";
import { useSound } from "../audio/useSound";
import { useHaptics } from "../haptics/useHaptics";

export function ResultScreen() {
  const summary = useGameStore((s) => s.summary);
  const puzzle = useGameStore((s) => s.puzzle);
  const active = useGameStore((s) => s.active);
  const stats = useGameStore((s) => s.stats);
  const progress = useGameStore((s) => s.progress);
  const streakDelta = useGameStore((s) => s.streakDelta);
  const newBest = useGameStore((s) => s.newBest);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const showStats = useGameStore((s) => s.showStats);
  const startNextSame = useGameStore((s) => s.startNextSame);
  const play = useSound();
  const haptic = useHaptics();

  useEffect(() => {
    if (!summary) return;
    play(summary.result === "win" ? "win" : "loss");
    haptic(summary.result === "win" ? "win" : "loss");
    // Play once on arrival only — summary is frozen for this result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!summary || !puzzle) {
    return (
      <div className="text-center text-muted p-8">
        No result.
        <div className="mt-4">
          <Button onClick={goToMenu}>Back to menu</Button>
        </div>
      </div>
    );
  }

  const isDaily = active?.mode === "daily";
  const isWin = summary.result === "win";
  const grade = gradeResult(summary, puzzle, active);
  const shareText = buildShareString(summary, puzzle, {
    mode: isDaily ? "daily" : "standard",
    dayLabel: isDaily ? todayLocal() : undefined,
    index: isDaily ? undefined : Math.max(1, progress.cursor),
  });

  const subtitle = isDaily
    ? `Daily · ${todayLocal()}`
    : `Standard · #${String(Math.max(1, progress.cursor)).padStart(3, "0")}`;

  const cardOptions = {
    mode: (isDaily ? "daily" : "standard") as "daily" | "standard",
    title: puzzle.title,
    subtitle,
    result: summary.result,
    mistakesUsed: summary.mistakesUsed,
    durationMs: summary.durationMs,
    difficulty: puzzle.difficulty,
    groupOrder: puzzle.groups.map((g) => g.id),
    solvedGroupIds: summary.solvedGroupIds,
    winkUsed: active?.winkedGroupId !== null && active?.winkedGroupId !== undefined,
    winkAvailable: puzzle.difficulty === "medium",
  };

  const showStreakCelebration = isWin && streakDelta > 0 && stats.currentStreak >= 2;

  return (
    <div className="max-w-md mx-auto" data-testid="result-screen">
      <ResultSummary summary={summary} puzzle={puzzle} currentStreak={stats.currentStreak} />

      {isWin && (
        <div
          className={`mt-3 rounded-xl px-4 py-3 text-center border ${
            grade.noWinkMedium ? "bg-surface border-accent/60" : "bg-surface border-[#2e343f]"
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">Grade</div>
          <div
            className={`text-lg font-bold ${grade.noWinkMedium ? "text-accent" : "text-text"}`}
          >
            {grade.label}
          </div>
          {grade.caption && (
            <div className="text-[11px] text-muted mt-0.5">{grade.caption}</div>
          )}
        </div>
      )}

      {showStreakCelebration && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-surface border border-accent/60 px-4 py-3 fw-streak-pulse">
          <span className="text-accent text-lg" aria-hidden="true">
            ✦
          </span>
          <span className="text-sm">
            Streak{" "}
            <span className="font-bold text-text tabular-nums">{stats.currentStreak}</span>
            {newBest && stats.bestStreak >= 3 && (
              <span className="text-accent"> · new best</span>
            )}
          </span>
        </div>
      )}

      {!isWin && (
        <div className="mt-3 rounded-xl bg-surface border border-[#2e343f] px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">
            Close one
          </div>
          <p className="text-sm text-text">
            Every good solver misses a puzzle.{" "}
            {isDaily
              ? "A new daily lands tomorrow."
              : "Try a fresh one — the pattern won't catch you twice."}
          </p>
        </div>
      )}

      {isDaily && (
        <div className="mt-3 rounded-xl bg-surface border border-[#2e343f] px-4 py-3">
          <DailyCountdown />
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-surface border border-[#2e343f] px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted text-center mb-2">
          Share your result
        </div>
        <ShareButton text={shareText} card={cardOptions} />
      </div>

      <div className="mt-3 flex flex-col gap-2" data-testid="result-cta-stack">
        {!isDaily && (
          <Button onClick={startNextSame} data-testid="result-next-puzzle">
            Next puzzle
          </Button>
        )}
        <Button variant="secondary" onClick={showStats}>
          Stats
        </Button>
        <Button variant="ghost" onClick={goToMenu}>
          Back to menu
        </Button>
      </div>
    </div>
  );
}
