import { useGameStore } from "../game/state/appStore";
import { useT } from "../i18n/useLanguage";
import { Button } from "../components/Button";
import { ResultSummary } from "../components/ResultSummary";
import { ShareButton } from "../components/ShareButton";
import { DailyCountdown } from "../components/DailyCountdown";
import { buildShareString } from "../game/engine/share";
import { gradeResult } from "../game/engine/grading";
import { mediumReadiness } from "../game/engine/readiness";
import { seedFromString } from "../game/engine/shuffle";
import { todayLocal } from "../utils/date";

// Deterministic picker: same puzzle id → same copy every replay, so we
// rotate without introducing variable-reward feel. Empty array safe-guard.
function pickVariant(variants: readonly string[], seed: string): string {
  if (variants.length === 0) return "";
  const h = seedFromString(seed);
  return variants[h % variants.length];
}

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
  const startMedium = useGameStore((s) => s.startMedium);
  const t = useT();

  // The terminal win/loss sound used to play from this screen's mount.
  // After v0.7's 600 ms board-hold (store.ts RESULT_HOLD_MS), it plays
  // from GameScreen the instant the board finalises so the cue lands on
  // the fully-painted grid, not here.

  if (!summary || !puzzle) {
    return (
      <div className="text-center text-muted p-8">
        {t.result.noResult}
        <div className="mt-4">
          <Button onClick={goToMenu}>{t.result.backToMenu}</Button>
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
    strings: t,
    grade,
  });

  const subtitle = isDaily
    ? t.result.subtitleDaily(todayLocal())
    : t.result.subtitleStandard(Math.max(1, progress.cursor));

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

  // The streak-celebration card was redundant with the Streak value that
  // already appears in the stats strip at the top of the result. Its only
  // irreplaceable signal was the "new best" accent — we fold that into
  // the Grade caption instead so nothing is lost.
  const showNewBest = isWin && streakDelta > 0 && newBest && stats.bestStreak >= 3;

  return (
    <div className="max-w-md mx-auto" data-testid="result-screen">
      <ResultSummary summary={summary} puzzle={puzzle} currentStreak={stats.currentStreak} />

      {isWin && (
        <div
          className={`mt-3 rounded-xl px-4 py-2.5 text-center border ${
            grade.noWinkMedium || showNewBest
              ? "bg-surface border-accent/60"
              : "bg-surface border-[#2e343f]"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted">{t.result.grade}</span>
            <span
              className={`text-base font-bold ${
                grade.noWinkMedium || showNewBest ? "text-accent" : "text-text"
              }`}
            >
              {grade.label}
            </span>
          </div>
          {(grade.caption || showNewBest) && (
            <div className="text-[11px] text-muted mt-0.5">
              {showNewBest ? (
                <>
                  <span className="text-accent">{t.result.newBest(stats.bestStreak)}</span>
                  {grade.caption && <span className="opacity-70"> · {grade.caption}</span>}
                </>
              ) : (
                grade.caption
              )}
            </div>
          )}
          {/* Seeded win affirmation — deterministic per puzzle id, keeps
              repeat sessions feeling fresh without introducing variable-
              ratio randomness. */}
          <div className="text-[11px] text-muted mt-1 italic opacity-80">
            {pickVariant(t.result.winAffirmations, puzzle.id)}
          </div>
        </div>
      )}

      {!isWin && (
        <div className="mt-3 rounded-xl bg-surface border border-[#2e343f] px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">
            {t.result.closeOne}
          </div>
          <p className="text-sm text-text">
            {pickVariant(t.result.missedVariants, puzzle.id)}{" "}
            {isDaily ? t.result.nextDaily : t.result.tryFresh}
          </p>
        </div>
      )}

      {isDaily && (
        <div className="mt-3 text-center text-[11px] text-muted">
          <DailyCountdown />
        </div>
      )}

      <div className="mt-3">
        <ShareButton text={shareText} card={cardOptions} />
      </div>

      <div className="mt-3 flex flex-col gap-2" data-testid="result-cta-stack">
        {!isDaily && (
          <Button onClick={startNextSame} data-testid="result-next-puzzle">
            {t.result.nextPuzzle}
          </Button>
        )}
        {!isDaily &&
          isWin &&
          puzzle.difficulty === "easy" &&
          mediumReadiness(stats).unlocked && (
            <Button
              variant="secondary"
              onClick={startMedium}
              data-testid="result-try-medium"
            >
              {t.result.tryMedium}
            </Button>
          )}
        <Button variant="secondary" onClick={showStats}>
          {t.result.showStats}
        </Button>
        <Button variant="ghost" onClick={goToMenu}>
          {t.result.backToMenu}
        </Button>
      </div>
    </div>
  );
}
