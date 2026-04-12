import type { ReactNode } from "react";

interface Cell {
  label: string;
  value: ReactNode;
  tone?: "default" | "accent" | "muted";
}

interface Props {
  cells: Cell[];
}

const TONE_CLS: Record<NonNullable<Cell["tone"]>, string> = {
  default: "text-text",
  accent: "text-accent",
  muted: "text-muted",
};

/**
 * A compact 2–4 cell metric strip. Used at the top of the result screen and
 * as the hero row on the stats screen. No gradients, no colors beyond the
 * existing token set.
 */
export function StatStrip({ cells }: Props) {
  if (cells.length === 0) return null;
  return (
    <div
      className="flex items-stretch justify-center rounded-xl bg-surface border border-[#262a33] overflow-hidden"
      role="group"
    >
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`flex-1 flex flex-col items-center justify-center px-3 py-3 min-w-0 ${
            i > 0 ? "border-l border-[#262a33]" : ""
          }`}
        >
          <div
            className={`text-xl sm:text-2xl font-bold tabular-nums leading-none truncate ${
              TONE_CLS[cell.tone ?? "default"]
            }`}
          >
            {cell.value}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted truncate">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
