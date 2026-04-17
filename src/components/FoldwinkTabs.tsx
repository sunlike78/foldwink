import type { Puzzle } from "../game/types/puzzle";
import { buildFoldwinkTabs } from "../game/engine/foldwinkTabs";
import { colorIndexForGroup, SOLVED_COLOR_CLASSES } from "../game/solvedColors";
import { MOTION_CLASS } from "../styles/motion";

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
  const tabs = buildFoldwinkTabs(puzzle, solvedGroupIds, winkedGroupId);
  if (tabs.length === 0) return null;

  const winkAvailable = puzzle.difficulty === "medium" && winkedGroupId === null && !gameEnded;
  const stageKey = solvedGroupIds.length;

  return (
    <div className="mb-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
          Foldwink Tabs
        </span>
        <span className="text-[10px] text-muted flex items-center gap-2">
          <span>{solvedGroupIds.length}/4 solved</span>
          {puzzle.difficulty === "medium" && (
            <>
              <span className="text-muted">·</span>
              {winkAvailable ? (
                <span className="text-accent">✦ wink ready</span>
              ) : winkedGroupId ? (
                <span className="text-muted">✦ wink used</span>
              ) : (
                <span className="text-muted">✦ wink</span>
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

          let cls: string;
          if (tab.solved) {
            cls = `${base} ${SOLVED_COLOR_CLASSES[colorIdx]}`;
          } else if (tab.winked) {
            cls = `${base} bg-surfaceHi border border-accent text-accent tracking-[0.18em]`;
          } else if (clickable) {
            cls = `${base} bg-surface border border-[#2e343f] text-text tracking-[0.18em] tabular-nums hover:border-accent hover:text-accent cursor-pointer`;
          } else {
            cls = `${base} bg-surface border border-[#2e343f] text-text tracking-[0.18em] tabular-nums`;
          }

          const ariaLabel = tab.solved
            ? `Solved category: ${tab.display}`
            : tab.winked
              ? `Winked category: ${tab.display}`
              : clickable
                ? `Wink this tab to reveal the full category`
                : `Concealed category preview`;

          const revealCls = tab.solved ? "" : `${MOTION_CLASS.tabReveal}`;

          if (clickable) {
            return (
              <button
                key={`${tab.groupId}:${stageKey}`}
                type="button"
                className={`${cls} ${revealCls} ${MOTION_CLASS.press}`}
                aria-label={ariaLabel}
                onClick={() => onWink(tab.groupId)}
              >
                {tab.display}
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
