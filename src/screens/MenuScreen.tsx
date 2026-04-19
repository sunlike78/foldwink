import { useEffect } from "react";
import { useGameStore } from "../game/state/appStore";
import { Button } from "../components/Button";
import { Wordmark } from "../components/Wordmark";
import { DailyCompleteCard } from "../components/DailyCompleteCard";
import { SoundToggle } from "../components/SoundToggle";
import { HapticsToggle } from "../components/HapticsToggle";
import { LanguageToggle } from "../components/LanguageToggle";
import { AboutFooter } from "../components/AboutFooter";
import { logEvent } from "../analytics/eventLog";
import {
  mediumReadiness,
  hardReadiness,
  mediumReadinessDisplay,
  hardReadinessDisplay,
} from "../game/engine/readiness";
import { HARD_POOL } from "../puzzles/loader";
import { isIosSafariInBrowser } from "../utils/platform";
import { useT } from "../i18n/useLanguage";

export function MenuScreen() {
  const startEasy = useGameStore((s) => s.startEasy);
  const startMedium = useGameStore((s) => s.startMedium);
  const startHard = useGameStore((s) => s.startHard);
  const startDaily = useGameStore((s) => s.startDaily);
  const showStats = useGameStore((s) => s.showStats);
  const showOnboarding = useGameStore((s) => s.showOnboarding);
  const poolSize = useGameStore((s) => s.poolSize);
  const stats = useGameStore((s) => s.stats);
  const todayDailyRecord = useGameStore((s) => s.todayDailyRecord);
  const t = useT();

  useEffect(() => {
    logEvent("menu:view");
  }, []);

  const empty = poolSize === 0;
  const dailyDone = !!todayDailyRecord;
  const mReadiness = mediumReadiness(stats);
  const mDisplay = mediumReadinessDisplay(mReadiness, t);

  const hReadiness = hardReadiness(stats, HARD_POOL.length);
  const hDisplay = hardReadinessDisplay(hReadiness, t);

  const mediumLabelClass =
    mReadiness.level === "strong"
      ? "text-accent font-semibold"
      : mReadiness.level === "recommended"
        ? "text-text font-semibold"
        : "text-muted font-semibold";

  const mediumButtonLabel =
    mReadiness.level === "locked" ? t.menu.mediumLocked : t.menu.medium;
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
      ? t.menu.masterSoon
      : hReadiness.level === "locked"
        ? t.menu.masterLocked
        : t.menu.masterChallenge;
  const hardButtonVariant: "primary" | "secondary" | "ghost" =
    hReadiness.unlocked && hReadiness.hasContent ? "primary" : "secondary";

  return (
    <div className="flex flex-col items-center text-center gap-3 pt-1 sm:pt-3">
      <Wordmark size="lg" animated showSublabel={false} subtitle={t.menu.subtitle} />

      {empty ? (
        <div className="w-full max-w-xs rounded-2xl bg-surface border border-[#2e343f] px-5 py-6 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-2">
            {t.menu.emptyPool}
          </div>
          <p className="text-sm text-text">{t.menu.emptyPoolDetail}</p>
        </div>
      ) : (
        <>
          {dailyDone && todayDailyRecord && (
            <DailyCompleteCard record={todayDailyRecord} currentStreak={stats.currentStreak} />
          )}

          <div className="flex flex-col gap-3 w-full max-w-60">
            {dailyDone ? (
              <Button variant="secondary" onClick={startDaily}>
                {t.menu.replayDaily}
              </Button>
            ) : (
              <Button onClick={startDaily}>{t.menu.playDaily}</Button>
            )}
            <Button variant={dailyDone ? "primary" : "secondary"} onClick={startEasy}>
              {t.menu.easy}
            </Button>
            <Button
              variant={mediumButtonVariant}
              onClick={handleMediumClick}
              disabled={!mReadiness.unlocked}
              aria-disabled={!mReadiness.unlocked}
            >
              {mediumButtonLabel}
            </Button>
            {hReadiness.hasContent && (
              <Button
                variant={hardButtonVariant}
                onClick={handleHardClick}
                disabled={hardDisabled}
                aria-disabled={hardDisabled}
              >
                {hardButtonLabel}
              </Button>
            )}
            <Button variant="ghost" onClick={showStats}>
              {t.menu.stats}
            </Button>
          </div>

          {stats.gamesPlayed > 0 && (
            <div className="text-[11px] text-muted text-center max-w-xs space-y-1">
              <div>
                <span className={mediumLabelClass}>{mDisplay.label}</span> ·{" "}
                {mDisplay.caption}
              </div>
              {hReadiness.level !== "hidden" && (
                <div className="text-muted">
                  {hDisplay.label} · {hDisplay.caption}
                </div>
              )}
            </div>
          )}

          {(mDisplay.fallback || hDisplay.fallback) && (
            <div className="text-[11px] text-muted text-center max-w-xs border-t border-[#2e343f] pt-3 space-y-1">
              {mDisplay.fallback && <div>{mDisplay.fallback}</div>}
              {hDisplay.fallback && <div>{hDisplay.fallback}</div>}
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
        <LanguageToggle />
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <button
          type="button"
          onClick={showOnboarding}
          className="text-muted hover:text-text underline-offset-2 hover:underline transition-colors"
        >
          {t.onboarding.menuLink}
        </button>
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <AboutFooter />
        <span aria-hidden="true" className="opacity-50">
          ·
        </span>
        <span className="tabular-nums">{t.menu.poolSize(poolSize)}</span>
      </div>

      {isIosSafariInBrowser() && (
        <p className="text-[10px] text-muted text-center max-w-xs leading-relaxed mt-1">
          <span className="text-accent">{t.menu.iphoneTip}</span> — {t.menu.iphoneTipBody}
        </p>
      )}
    </div>
  );
}
