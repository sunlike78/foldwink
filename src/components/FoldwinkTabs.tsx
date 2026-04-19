import { useEffect, useRef, useState } from "react";
import type { Puzzle } from "../game/types/puzzle";
import { buildFoldwinkTabs } from "../game/engine/foldwinkTabs";
import { colorIndexForGroup, SOLVED_COLOR_CLASSES } from "../game/solvedColors";
import { MOTION_CLASS } from "../styles/motion";
import { useT } from "../i18n/useLanguage";

interface Props {
  puzzle: Puzzle;
  solvedGroupIds: readonly string[];
  winkedGroupId: string | null;
  onWink: (groupId: string) => void;
  gameEnded: boolean;
}

export function FoldwinkTabs({
  puzzle,
  solvedGroupIds,
  winkedGroupId,
  onWink,
  gameEnded,
}: Props) {
  const t = useT();
  const [armedGroupId, setArmedGroupId] = useState<string | null>(null);
  const armTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (armTimer.current !== null) window.clearTimeout(armTimer.current);
    };
  }, []);

  const handleTabClick = (groupId: string): void => {
    if (armedGroupId === groupId) {
      if (armTimer.current !== null) window.clearTimeout(armTimer.current);
      setArmedGroupId(null);
      onWink(groupId);
      return;
    }
    if (armTimer.current !== null) window.clearTimeout(armTimer.current);
    setArmedGroupId(groupId);
    armTimer.current = window.setTimeout(() => setArmedGroupId(null), 3000);
  };

  const tabs = buildFoldwinkTabs(puzzle, solvedGroupIds, winkedGroupId);
  if (tabs.length === 0) return null;

  const winkAvailable = puzzle.difficulty === "medium" && winkedGroupId === null && !gameEnded;
  const stageKey = solvedGroupIds.length;

  return (
    <div className="mb-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted">{t.tabs.label}</span>
        <span className="text-[10px] text-muted flex items-center gap-2">
          <span>{t.tabs.solvedCount(solvedGroupIds.length, 4)}</span>
          {puzzle.difficulty === "medium" && (
            <>
              <span className="text-muted">·</span>
              {winkAvailable ? (
                <span className="text-accent">{t.tabs.winkReady}</span>
              ) : winkedGroupId ? (
                <span className="text-muted">{t.tabs.winkUsed}</span>
              ) : (
                <span className="text-muted">{t.tabs.winkShort}</span>
              )}
            </>
          )}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {tabs.map((tab) => {
          const colorIdx = colorIndexForGroup(puzzle, tab.groupId);
          const base = `rounded-lg px-2.5 py-1.5 text-xs font-semibold text-center leading-tight truncate ${MOTION_CLASS.baseTransition}`;
          const clickable = winkAvailable && !tab.solved;

          const showWinkMark = tab.winked || (tab.solved && winkedGroupId === tab.groupId);

          const isArmed = clickable && armedGroupId === tab.groupId;
          let cls: string;
          if (tab.solved) {
            cls = `${base} ${SOLVED_COLOR_CLASSES[colorIdx]}`;
          } else if (tab.winked) {
            cls = `${base} bg-surfaceHi border border-accent text-accent tracking-[0.18em]`;
          } else if (isArmed) {
            cls = `${base} bg-accent/10 border-2 border-accent text-accent tracking-[0.18em] cursor-pointer`;
          } else if (clickable) {
            cls = `${base} bg-surface border border-[#2e343f] text-text tracking-[0.18em] tabular-nums hover:border-accent hover:text-accent cursor-pointer`;
          } else {
            cls = `${base} bg-surface border border-[#2e343f] text-text tracking-[0.18em] tabular-nums`;
          }

          const ariaLabel = tab.solved
            ? t.tabs.solvedAria(tab.display)
            : tab.winked
              ? t.tabs.winkedAria(tab.display)
              : clickable
                ? t.tabs.clickAria
                : t.tabs.concealedAria;

          const revealCls = tab.solved ? "" : `${MOTION_CLASS.tabReveal}`;

          if (clickable) {
            return (
              <button
                key={`${tab.groupId}:${stageKey}`}
                type="button"
                className={`${cls} ${revealCls} ${MOTION_CLASS.press}`}
                aria-label={ariaLabel}
                onClick={() => handleTabClick(tab.groupId)}
              >
                {isArmed ? `✦ ${t.tabs.winkConfirm}` : tab.display}
              </button>
            );
          }

          return (
            <div
              key={`${tab.groupId}:${stageKey}`}
              className={`${cls} ${revealCls}`}
              aria-label={ariaLabel}
            >
              {showWinkMark && (
                <span className="mr-1" aria-hidden="true">
                  ✦
                </span>
              )}
              {tab.display}
            </div>
          );
        })}
      </div>
    </div>
  );
}
