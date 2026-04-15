import { useEffect } from "react";
import { useGameStore } from "../game/state/appStore";
import { Button } from "../components/Button";
import { Wordmark } from "../components/Wordmark";
import { DailyCompleteCard } from "../components/DailyCompleteCard";
import { SoundToggle } from "../components/SoundToggle";
import { HapticsToggle } from "../components/HapticsToggle";
import { AboutFooter } from "../components/AboutFooter";
import { logEvent } from "../analytics/eventLog";
import { mediumReadiness, hardReadiness } from "../game/engine/readiness";
import { HARD_POOL } from "../puzzles/loader";

export function MenuScreen() {
  const startEasy = useGameStore((s) => s.startEasy);
  const startMedium = useGameStore((s) => s.startMedium);
  const startHard = useGameStore((s) => s.startHard);
  const startDaily = useGameStore((s) => s.startDaily);
  const showStats = useGameStore((s) => s.showStats);
  const poolSize = useGameStore((s) => s.poolSize);
  const stats = useGameStore((s) => s.stats);
  const todayDailyRecord = useGameStore((s) => s.todayDailyRecord);

  useEffect(() => {
    logEvent("menu:view");
  }, []);

  const empty = poolSize === 0;
  const dailyDone = !!todayDailyRecord;
  const mReadiness = mediumReadiness(stats);

  const hReadiness = hardReadiness(stats, HARD_POOL.length);

  const mediumLabelClass =
    mReadiness.level === "strong"
      ? "text-accent font-semibold"
      : mReadiness.level === "recommended"
        ? "text-text font-semibold"
        : "text-muted font-semibold";

  const mediumButtonLabel = mReadiness.level === "locked" ? "Medium — locked" : "Medium puzzle";
  const mediumButtonVariant: "primary" | "secondary" | "ghost" =
    mReadiness.level === "strong" || mReadiness.level === "recommended"
      ? "primary"
      : "secondary";

  const handleMediumClick = () => {
    if (!mReadiness.unlocked) return;
    startMedium();
  };

  const handleHardClick = () => {
    if (!hReadiness.unlocked || !hReadiness.hasContent) return;
    startHard();
  };

  const hardDisabled = !hReadiness.unlocked || !hReadiness.hasContent;
  const hardButtonLabel =
    hReadiness.level === "coming-soon"
      ? "Master Challenge — soon"
      : hReadiness.level === "locked"
        ? "Master Challenge — locked"
        : "Master Challenge";

  return (
    <div className="flex flex-col items-center text-center gap-8 pt-6 sm:pt-10">
      <Wordmark
        size="lg"
        animated
        subtitle="A daily grouping puzzle. Medium puzzles reveal their categories one letter at a time — tap once to Wink."
      />

      {empty ? (
        <div className="w-full max-w-xs rounded-2xl bg-surface border border-[#2e343f] px-5 py-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-2">
            Empty pool
          </div>
          <p className="text-sm text-text">
            No puzzles are bundled in this build. Drop JSON files into{" "}
            <span className="font-mono text-xs">puzzles/pool/</span> and rebuild.
          </p>
        </div>
      ) : (
        <>
          {dailyDone && todayDailyRecord && (
            <DailyCompleteCard record={todayDailyRecord} currentStreak={stats.currentStreak} />
          )}

          <div className="flex flex-col gap-3 w-full max-w-60">
            {dailyDone ? (
              <Button variant="secondary" onClick={startDaily}>
                Replay daily
              </Button>
            ) : (
              <Button onClick={startDaily}>Play today&apos;s puzzle</Button>
            )}
            <Button variant={dailyDone ? "primary" : "secondary"} onClick={startEasy}>
              Easy puzzle
            </Button>
            <Button
              variant={mediumButtonVariant}
              onClick={handleMediumClick}
              disabled={!mReadiness.unlocked}
              aria-disabled={!mReadiness.unlocked}
            >
              {mediumButtonLabel}
            </Button>
            <Button
              variant="ghost"
              onClick={handleHardClick}
              disabled={hardDisabled}
              aria-disabled={hardDisabled}
            >
              {hardButtonLabel}
            </Button>
            <Button variant="ghost" onClick={showStats}>
              Stats
            </Button>
          </div>

          {stats.gamesPlayed > 0 && (
            <div className="text-[11px] text-muted text-center max-w-xs space-y-1">
              <div>
                <span className={mediumLabelClass}>{mReadiness.label}</span> ·{" "}
                {mReadiness.caption}
              </div>
              {hReadiness.level !== "hidden" && (
                <div className="text-muted">
                  {hReadiness.label} · {hReadiness.caption}
                </div>
              )}
            </div>
          )}

          {(mReadiness.fallback || hReadiness.fallback) && (
            <div className="text-[11px] text-muted text-center max-w-xs border-t border-[#2e343f] pt-3 space-y-1">
              {mReadiness.fallback && <div>{mReadiness.fallback}</div>}
              {hReadiness.fallback && <div>{hReadiness.fallback}</div>}
            </div>
          )}
        </>
      )}

      {!dailyDone && !empty && stats.currentStreak > 0 && (
        <div className="text-xs text-muted">
          Current streak{" "}
          <span className="text-text font-semibold tabular-nums">{stats.currentStreak}</span>
          {stats.bestStreak > stats.currentStreak && (
            <>
              {" "}
              · best{" "}
              <span className="text-text font-semibold tabular-nums">{stats.bestStreak}</span>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <p className="text-[11px] text-muted">
          {poolSize} curated puzzles in this build · target library 500
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <SoundToggle />
          <HapticsToggle />
        </div>
        <AboutFooter />
      </div>
    </div>
  );
}
