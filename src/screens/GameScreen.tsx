import { useEffect, useRef } from "react";
import { useGameStore } from "../game/state/appStore";
import { Header } from "../components/Header";
import { Grid } from "../components/Grid";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { MistakesDots } from "../components/MistakesDots";
import { FoldwinkTabs } from "../components/FoldwinkTabs";
import { SELECTION_SIZE } from "../game/types/game";
import { canSubmit } from "../game/engine/submit";
import { colorIndexForGroup } from "../game/solvedColors";
import { useSound } from "../audio/useSound";
import { useHaptics } from "../haptics/useHaptics";
import { GameTimer } from "../components/GameTimer";
import { useT } from "../i18n/useLanguage";

export function GameScreen() {
  const active = useGameStore((s) => s.active);
  const puzzle = useGameStore((s) => s.puzzle);
  const flash = useGameStore((s) => s.flash);
  const toggleSelection = useGameStore((s) => s.toggleSelection);
  const clearSelection = useGameStore((s) => s.clearSelection);
  const submit = useGameStore((s) => s.submit);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const clearFlash = useGameStore((s) => s.clearFlash);
  const winkTab = useGameStore((s) => s.winkTab);
  const play = useSound();
  const haptic = useHaptics();
  const t = useT();
  const prevSolvedCount = useRef(0);
  const prevWinkedId = useRef<string | null>(null);

  useEffect(() => {
    if (!flash) return;
    if (flash === "correct") {
      play("correct");
      haptic("correct");
    }
    if (flash === "incorrect") {
      play("wrong");
      haptic("wrong");
    }
    const id = setTimeout(() => clearFlash(), 450);
    return () => clearTimeout(id);
  }, [flash, clearFlash, play, haptic]);

  useEffect(() => {
    if (!active || !puzzle) {
      prevSolvedCount.current = 0;
      prevWinkedId.current = null;
      return;
    }
    if (
      puzzle.difficulty === "medium" &&
      active.solvedGroupIds.length > prevSolvedCount.current
    ) {
      play("tabReveal");
    }
    prevSolvedCount.current = active.solvedGroupIds.length;
    if (active.winkedGroupId && active.winkedGroupId !== prevWinkedId.current) {
      play("wink");
      haptic("wink");
    }
    prevWinkedId.current = active.winkedGroupId;
  }, [active, puzzle, play, haptic]);

  if (!active || !puzzle) {
    return (
      <div className="text-center text-muted p-8">
        {t.game.noActiveGame}
        <div className="mt-4">
          <Button onClick={goToMenu}>{t.game.backToMenu}</Button>
        </div>
      </div>
    );
  }

  const solvedItems = new Set<string>();
  const groupColorByItem = new Map<string, number>();
  puzzle.groups.forEach((g) => {
    if (active.solvedGroupIds.includes(g.id)) {
      for (const it of g.items) {
        solvedItems.add(it);
        groupColorByItem.set(it, colorIndexForGroup(puzzle, g.id));
      }
    }
  });

  const selectedSet = new Set(active.selection);

  const handleToggle = (value: string): void => {
    if (active.result) return;
    if (solvedItems.has(value)) return;
    const already = selectedSet.has(value);
    if (!already && active.selection.length >= SELECTION_SIZE) return;
    play(already ? "deselect" : "select");
    haptic(already ? "deselect" : "select");
    toggleSelection(value);
  };

  const handleSubmit = (): void => {
    if (!canSubmit(active.selection)) return;
    play("submit");
    haptic("submit");
    submit();
  };

  const flashRingClass =
    flash === "correct"
      ? "ring-2 ring-solved2"
      : flash === "incorrect"
        ? "ring-2 ring-danger"
        : "";
  const gridShakeKey = `${active.mistakesUsed}:${flash}`;

  return (
    <div className={`transition-shadow rounded-2xl ${flashRingClass}`}>
      <Header
        title={puzzle.title}
        subtitle={
          `${puzzle.difficulty.toUpperCase()} · ${active.mode}` +
          (active.mode === "daily" && !active.countsToStats ? " · replay" : "")
        }
        right={
          <div className="flex items-center gap-3">
            <GameTimer startedAt={active.startedAt} endedAt={active.endedAt} />
            <MistakesDots used={active.mistakesUsed} />
          </div>
        }
      />
      <FoldwinkTabs
        puzzle={puzzle}
        solvedGroupIds={active.solvedGroupIds}
        winkedGroupId={active.winkedGroupId}
        onWink={winkTab}
        gameEnded={!!active.result}
      />
      <Grid
        key={flash === "incorrect" ? gridShakeKey : undefined}
        shake={flash === "incorrect"}
      >
        {active.order.map((value) => {
          const isSolved = solvedItems.has(value);
          const isSelected = selectedSet.has(value);
          const state = isSolved ? "solved" : isSelected ? "selected" : "idle";
          return (
            <Card
              key={value}
              value={value}
              state={state}
              solvedColorIndex={groupColorByItem.get(value) ?? 0}
              disabled={isSolved || !!active.result}
              onClick={() => handleToggle(value)}
            />
          );
        })}
      </Grid>
      <div className="mt-5 flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2" aria-live="polite">
          <div
            className="flex gap-1"
            role="img"
            aria-label={`Selected ${active.selection.length} of ${SELECTION_SIZE}`}
          >
            {Array.from({ length: SELECTION_SIZE }).map((_, i) => (
              <span
                key={i}
                className={`inline-block w-2 h-2 rounded-full ${
                  i < active.selection.length ? "bg-accent" : "bg-[#2e343f]"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-text tabular-nums">
            {active.selection.length}/{SELECTION_SIZE}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={clearSelection}
            disabled={active.selection.length === 0}
          >
            {t.game.clear}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit(active.selection)}
            className={
              canSubmit(active.selection)
                ? "ring-2 ring-accent/40 shadow-[0_0_0_4px_rgba(124,196,255,0.12)]"
                : ""
            }
          >
            {t.game.submit}
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button className="text-muted text-sm underline underline-offset-2" onClick={goToMenu}>
          {t.game.quitToMenu}
        </button>
      </div>
    </div>
  );
}
