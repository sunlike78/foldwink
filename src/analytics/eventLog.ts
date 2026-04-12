/**
 * Local-only aggregate event log.
 *
 * Foldwink does not ship network analytics. This module exists so the
 * author can answer product questions (how often does anyone open stats?
 * how often is Wink used per medium?) from their own browser's
 * localStorage without a tracker.
 *
 * No network. No third parties. No identifiers. Counters only. The data
 * never leaves the player's device. There is a matching "Clear" affordance
 * in the About footer.
 *
 * Because there is no network, there is no privacy surface to ask consent
 * for — but the privacy note still says what this stores.
 */

export type FoldwinkEvent =
  | "app:open"
  | "menu:view"
  | "stats:view"
  | "daily:start"
  | "daily:win"
  | "daily:loss"
  | "standard:start"
  | "standard:win"
  | "standard:loss"
  | "wink:used"
  | "share:clicked";

const STORAGE_KEY = "foldwink:events";

type EventCounts = Partial<Record<FoldwinkEvent, number>>;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeRead(): EventCounts {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as EventCounts;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function safeWrite(counts: EventCounts): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

export function logEvent(event: FoldwinkEvent): void {
  const counts = safeRead();
  counts[event] = (counts[event] ?? 0) + 1;
  safeWrite(counts);
}

export function getEventCounts(): EventCounts {
  return safeRead();
}

export function clearEventLog(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
