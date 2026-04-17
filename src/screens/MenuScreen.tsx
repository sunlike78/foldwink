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
  // Mirror the Medium-button style logic so a locked Master button looks
  // like a locked Medium button (both bordered secondary) instead of a
  // faint ghost link. This removed an inconsistency flagged in mobile QA
  // where Master-locked visually felt like a separate tier of UI element.
  const hardButtonVariant: "primary" | "secondary" | "ghost" =
    hReadiness.unlocked && hReadiness.hasContent ? "primary" : "secondary";

  return (
    <div className="flex flex-col items-center text-center gap-4 pt-1 sm:pt-3">
      <Wordmark
        size="lg"
        animated
        showSublabel={false}
        subtitle="Find 4 hidden groups of 4 in a 4×4 grid — 2–5 minutes."
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
              variant={hardButtonVariant}
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

      <div className="flex items-center gap-3 flex-wrap justify-center text-[11px] text-muted">
        <SoundToggle />
        <HapticsToggle />
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <AboutFooter />
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <span className="tabular-nums">{poolSize} puzzles</span>
      </div>
    </div>
  );
}
