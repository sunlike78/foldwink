import { useGameStore } from "../game/state/appStore";
import { Button } from "../components/Button";
import { Wordmark } from "../components/Wordmark";
import { StatStrip } from "../components/StatStrip";
import { DailyArchive } from "../components/DailyArchive";
import { useT } from "../i18n/useLanguage";

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center bg-surface rounded-xl px-3 py-2 border border-[#262a33]">
      <div className="text-xl font-bold tabular-nums leading-tight">{value}</div>
      <div className="text-[10px] text-muted uppercase tracking-[0.12em] mt-0.5">{label}</div>
    </div>
  );
}

export function StatsScreen() {
  const stats = useGameStore((s) => s.stats);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const t = useT();
  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const solvedCount = stats.solvedPuzzleIds.length;
  const mediumWins = stats.mediumWins ?? 0;
  const mediumLosses = stats.mediumLosses ?? 0;
  const mediumPlayed = mediumWins + mediumLosses;
  const mediumWinRate = mediumPlayed > 0 ? Math.round((mediumWins / mediumPlayed) * 100) : 0;
  const winkUses = stats.winkUses ?? 0;
  const totalMistakes = stats.totalMistakes ?? 0;
  const avgMistakes = stats.gamesPlayed > 0 ? totalMistakes / stats.gamesPlayed : 0;
  const flawlessWins = stats.flawlessWins ?? 0;

  return (
    <div className="max-w-md mx-auto">
      <Wordmark size="sm" subtitle={t.stats.subtitle} />

      <div className="mt-4">
        <StatStrip
          cells={[
            {
              label: t.stats.solved,
              value: solvedCount,
              tone: solvedCount > 0 ? "accent" : "default",
            },
            { label: t.stats.played, value: stats.gamesPlayed },
            {
              label: t.stats.winRate,
              value: `${winRate}%`,
            },
          ]}
        />
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2">
        <StatCell label={t.stats.wins} value={stats.wins} />
        <StatCell label={t.stats.losses} value={stats.losses} />
        <StatCell label={t.stats.streak} value={stats.currentStreak} />
        <StatCell label={t.stats.best} value={stats.bestStreak} />
      </div>

      {stats.gamesPlayed > 0 && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted text-center mb-1.5">
            {t.stats.depth}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatCell label={t.stats.flawless} value={flawlessWins} />
            <StatCell label={t.stats.avgMiss} value={avgMistakes.toFixed(1)} />
            <StatCell label={t.stats.medWinRate} value={`${mediumWinRate}%`} />
            <StatCell label={t.stats.winks} value={winkUses} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted text-center mb-1.5">
          {t.stats.dailyHistory}
        </div>
        <DailyArchive />
      </div>

      {stats.gamesPlayed === 0 && (
        <div className="mt-4 rounded-xl bg-surface border border-[#2e343f] px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">
            {t.stats.emptyRecord}
          </div>
          <p className="text-sm text-text">{t.stats.emptyRecordDetail}</p>
        </div>
      )}

      <div className="mt-4">
        <Button variant="secondary" onClick={goToMenu} className="w-full">
          {t.stats.backToMenu}
        </Button>
      </div>
    </div>
  );
}
