import { useState } from "react";
import { clearEventLog } from "../analytics/eventLog";

/**
 * Compact About footer — privacy one-liner, support channel, and a
 * "clear local data" affordance. Collapsed by default. Zero network.
 */
export function AboutFooter() {
  const [open, setOpen] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = (): void => {
    clearEventLog();
    setCleared(true);
    setTimeout(() => setCleared(false), 1800);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-text transition-colors"
      >
        About · Privacy
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-surface border border-[#2e343f] px-5 py-4 text-left">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted">About Foldwink</div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[10px] text-muted hover:text-text transition-colors"
          aria-label="Close about footer"
        >
          close
        </button>
      </div>
      <p className="text-xs text-text leading-relaxed mb-3">
        A small daily grouping puzzle by{" "}
        <a
          href="https://neural-void.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-2"
        >
          Neural Void
        </a>
        . 16 cards, 4 hidden groups, 4 mistakes. Medium puzzles reveal their categories one
        letter at a time — tap once to Wink.
      </p>
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">Privacy</div>
      <p className="text-xs text-muted leading-relaxed mb-3">
        No accounts, no tracking, no network. Your stats, streaks, sound preference, and an
        optional local-only event counter live in your browser&apos;s localStorage and never
        leave your device. Clearing your site data wipes everything.
      </p>
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-1">Support</div>
      <p className="text-xs text-muted leading-relaxed mb-3">
        Bug reports and feedback:{" "}
        <a
          href="mailto:foldwink@neural-void.com"
          className="text-text font-mono text-[11px] hover:text-accent transition-colors"
        >
          foldwink@neural-void.com
        </a>
      </p>
      <button
        type="button"
        onClick={handleClear}
        className="text-[11px] text-muted hover:text-text transition-colors underline underline-offset-2"
      >
        {cleared ? "Local event log cleared" : "Clear local event log"}
      </button>
    </div>
  );
}
