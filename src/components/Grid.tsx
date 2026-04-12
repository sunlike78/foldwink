import { type ReactNode, useCallback, useRef } from "react";
import { MOTION_CLASS } from "../styles/motion";

interface Props {
  children: ReactNode;
  shake?: boolean;
}

/**
 * 4×4 puzzle grid with arrow-key navigation.
 *
 * Children are expected to be 16 card buttons. Arrow keys move focus
 * between them in a 4-column layout. Focus wraps at edges.
 */
export function Grid({ children, shake }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const grid = ref.current;
    if (!grid) return;
    const buttons = Array.from(grid.querySelectorAll<HTMLElement>("button"));
    const idx = buttons.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;

    const len = buttons.length;
    const col = idx % 4;
    let target: number | null = null;

    if (e.key === "ArrowRight") target = idx + 1 < len ? idx + 1 : 0;
    else if (e.key === "ArrowLeft") target = idx - 1 >= 0 ? idx - 1 : len - 1;
    else if (e.key === "ArrowDown") target = idx + 4 < len ? idx + 4 : col;
    else if (e.key === "ArrowUp") target = idx - 4 >= 0 ? idx - 4 : len - 4 + col;

    if (target === null) return;
    e.preventDefault();
    buttons[target]?.focus();
  }, []);

  const classes = `grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md mx-auto ${
    shake ? MOTION_CLASS.shake : ""
  }`;

  return (
    <div
      ref={ref}
      className={classes}
      role="grid"
      aria-label="Puzzle grid"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
