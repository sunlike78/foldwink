import { useGameStore } from "../game/state/appStore";
import { Button } from "../components/Button";
import { Wordmark } from "../components/Wordmark";
import { StatStrip } from "../components/StatStrip";
import { DailyArchive } from "../components/DailyArchive";

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
      <Wordmark size="sm" subtitle="Your Foldwink record" />

      <div className="mt-4">
        <StatStrip
          cells={[
            {
              label: "Solved",
              value: solvedCount,
              tone: solvedCount > 0 ? "accent" : "default",
            },
            { label: "Played", value: stats.gamesPlayed },
            {
              label: "Win %",
              value: `${winRate}%`,
            },
          ]}
        />
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2">
        <StatCell label="Wins" value={stats.wins} />
        <StatCell label="Losses" value={stats.losses} />
        <StatCell label="Streak" value={stats.currentStreak} />
        <StatCell label="Best" value={stats.bestStreak} />
      </div>

      {stats.gamesPlayed > 0 && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted text-center mb-1.5">
            Depth
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatCell label="Flawless" value={flawlessWins} />
            <StatCell label="Avg miss" value={avgMistakes.toFixed(1)} />
            <StatCell label="Med W%" value={`${mediumWinRate}%`} />
            <StatCell label="Winks" value={winkUses} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted text-center mb-1.5">
          Daily history
        </div>
        <DailyArchive />
      </div>

      {stats.gamesPlayed === 0 && (
        <div className="mt-4 rounded-xl bg-surface border border-[#2e343f] px-4 py-3 text-center">
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">
            Empty record
          </div>
          <p className="text-sm text-text">
            No puzzles played yet. Start with today&apos;s daily from the menu.
          </p>
        </div>
      )}

      <div className="mt-4">
        <Button variant="secondary" onClick={goToMenu} className="w-full">
          Back to menu
        </Button>
      </div>
    </div>
  );
}
