import type { Stats } from "../types/stats";

/**
 * Foldwink Easy → Medium progression model (0.4.2).
 *
 * Design principles
 * -----------------
 * - Medium is **always visible** in the UI. The readiness signal frames it,
 *   it never hides it.
 * - Unlock is a **simple** condition: 5 solved easy puzzles. Anything more
 *   complex would feel bureaucratic.
 * - Recommendation is **smarter** than unlock. It looks at easy win rate,
 *   average mistakes, and recent confident wins to decide whether to
 *   actively encourage the player to try medium.
 * - **Time is secondary.** It never gates anything on its own. Median solve
 *   time on recent successful easy solves only contributes a confidence
 *   *bump*, not a requirement.
 * - Failback is **gentle**. After 2 consecutive medium losses we suggest a
 *   few more easy puzzles — we never lock medium away.
 *
 * Thresholds
 * ----------
 *   EASY_NUDGE_AT             = 3 easy wins   → early nudge appears
 *   MEDIUM_UNLOCK_AT          = 5 easy wins   → medium button is enabled
 *   RECOMMEND_WIN_RATE_MIN    = 0.70          → 70% easy win rate
 *   RECOMMEND_AVG_MISTAKES_MAX = 2            → ≤ 2 avg mistakes per game
 *   STRONG_RECENT_CONFIDENT_MIN = 2           → ≥ 2 recent confident solves
 *   STRONG_MEDIAN_TIME_MS     = 180_000       → ≤ 3 min median easy solve
 *   FAST_CONFIDENT_TIME_MS    = 150_000       → ≤ 2.5 min = "fast confident"
 *   FAST_CONFIDENT_MISTAKES_MAX = 1           → ≤ 1 mistake = "fast confident"
 *   FALLBACK_LOSS_STREAK      = 2             → 2 medium losses → gentle hint
 */

export const EASY_NUDGE_AT = 3;
export const MEDIUM_UNLOCK_AT = 5;
export const RECOMMEND_WIN_RATE_MIN = 0.7;
export const RECOMMEND_AVG_MISTAKES_MAX = 2;
export const STRONG_RECENT_CONFIDENT_MIN = 2;
export const STRONG_MEDIAN_TIME_MS = 180_000;
export const FAST_CONFIDENT_TIME_MS = 150_000;
export const FAST_CONFIDENT_MISTAKES_MAX = 1;
export const FALLBACK_LOSS_STREAK = 2;

export type ReadinessLevel =
  | "locked" // fewer than 5 easy wins
  | "unlocked-weak" // unlocked but easy performance is shaky
  | "recommended" // unlocked + meets recommendation thresholds
  | "strong"; // unlocked + recommended + recent confident signals

export interface ProgressionSignal {
  /** True once the player has MEDIUM_UNLOCK_AT easy wins. Never regresses. */
  unlocked: boolean;
  /** Should the UI show the early "Medium is coming" nudge? */
  showNudge: boolean;
  /** Current readiness level. */
  level: ReadinessLevel;
  /** Short label for the primary status line (≤ 2 words). */
  label: string;
  /** Short caption (≤ ~90 chars) explaining the level. */
  caption: string;
  /** Gentle fallback copy — set when mediumLossStreak ≥ FALLBACK_LOSS_STREAK. */
  fallback: string | null;
  /** Number of solved easy puzzles (derived from stats). */
  easyWins: number;
  /** Easy-only win rate (0..1). Returns 0 when easy games played = 0. */
  easyWinRate: number;
  /** Average mistakes per completed game across all attempts. */
  avgMistakes: number;
}

function computeEasyMedianTimeMs(stats: Stats): number | null {
  const recent = stats.recentSolves ?? [];
  const successful = recent
    .filter((r) => r.difficulty === "easy" && r.result === "win")
    .map((r) => r.durationMs)
    .sort((a, b) => a - b);
  if (successful.length === 0) return null;
  const mid = Math.floor(successful.length / 2);
  return successful.length % 2 === 1
    ? successful[mid]
    : Math.round((successful[mid - 1] + successful[mid]) / 2);
}

function countFastConfidentRecent(stats: Stats): number {
  const recent = stats.recentSolves ?? [];
  return recent.filter(
    (r) =>
      r.difficulty === "easy" &&
      r.result === "win" &&
      r.durationMs <= FAST_CONFIDENT_TIME_MS &&
      r.mistakesUsed <= FAST_CONFIDENT_MISTAKES_MAX,
  ).length;
}

function countRecentConfidentEasyWins(stats: Stats): number {
  // "Confident" in the recommendation sense = recent easy wins with ≤ 1 mistake
  // regardless of time. Time only contributes to the "strong" bump below.
  const recent = stats.recentSolves ?? [];
  return recent.filter(
    (r) =>
      r.difficulty === "easy" &&
      r.result === "win" &&
      r.mistakesUsed <= FAST_CONFIDENT_MISTAKES_MAX,
  ).length;
}

export function mediumReadiness(stats: Stats): ProgressionSignal {
  const mediumWins = stats.mediumWins ?? 0;
  const mediumLosses = stats.mediumLosses ?? 0;
  const easyWins = Math.max(0, stats.wins - mediumWins);
  const easyLosses = Math.max(0, stats.losses - mediumLosses);
  const easyGames = easyWins + easyLosses;
  const easyWinRate = easyGames > 0 ? easyWins / easyGames : 0;
  const totalMistakes = stats.totalMistakes ?? 0;
  const avgMistakes = stats.gamesPlayed > 0 ? totalMistakes / stats.gamesPlayed : 0;
  const mediumLossStreak = stats.mediumLossStreak ?? 0;

  const unlocked = easyWins >= MEDIUM_UNLOCK_AT;
  const showNudge = !unlocked && easyWins >= EASY_NUDGE_AT;

  // Recommendation thresholds — smarter than raw unlock.
  const meetsWinRate = easyWinRate >= RECOMMEND_WIN_RATE_MIN;
  const meetsMistakes = avgMistakes <= RECOMMEND_AVG_MISTAKES_MAX;
  const recentConfident = countRecentConfidentEasyWins(stats);
  const meetsRecommend = meetsWinRate && meetsMistakes && recentConfident >= 2;

  // Strong-confidence bump uses time *only* as a secondary signal.
  const medianTimeMs = computeEasyMedianTimeMs(stats);
  const medianTimeGood = medianTimeMs !== null && medianTimeMs <= STRONG_MEDIAN_TIME_MS;
  const fastConfidentRecent = countFastConfidentRecent(stats);
  const isStrong =
    meetsRecommend && (fastConfidentRecent >= STRONG_RECENT_CONFIDENT_MIN || medianTimeGood);

  let level: ReadinessLevel;
  let label: string;
  let caption: string;

  if (!unlocked) {
    level = "locked";
    if (showNudge) {
      label = "Almost there";
      caption = `You're getting the hang of it. ${MEDIUM_UNLOCK_AT - easyWins} more easy wins unlocks Medium — with Foldwink Tabs and one Wink per puzzle.`;
    } else {
      label = "Warming up";
      caption = `A few easy solves first — Medium unlocks at ${MEDIUM_UNLOCK_AT} easy wins.`;
    }
  } else if (isStrong) {
    level = "strong";
    label = "Medium-ready";
    caption = "Your Easy form is steady. Foldwink Tabs will feel natural.";
  } else if (meetsRecommend) {
    level = "recommended";
    label = "Recommended";
    caption = "A Medium puzzle is a good next step.";
  } else {
    level = "unlocked-weak";
    label = "Medium unlocked";
    caption = "Try one when you feel ready — or keep polishing Easy first.";
  }

  const fallback =
    mediumLossStreak >= FALLBACK_LOSS_STREAK
      ? "Two tough mediums in a row — try a few more Easy puzzles first."
      : null;

  return {
    unlocked,
    showNudge,
    level,
    label,
    caption,
    fallback,
    easyWins,
    easyWinRate,
    avgMistakes,
  };
}

// =========================================================================
// Hard / Master Challenge readiness (0.4.3)
// =========================================================================

export const HARD_UNLOCK_AT = 3; // medium wins
export const HARD_RECOMMEND_MEDIUM_WINS = 5;
export const HARD_RECOMMEND_MEDIUM_WIN_RATE = 0.6;
export const HARD_FALLBACK_LOSS_STREAK = 2;

export type HardReadinessLevel =
  | "hidden" // hard pool empty — no content to show
  | "locked" // not enough medium wins
  | "unlocked" // 3+ medium wins but stats are weak
  | "recommended" // strong medium record
  | "coming-soon"; // hard button visible but pool is empty

export interface HardProgressionSignal {
  /** Is the Hard pool non-empty? If false, the button shows "coming soon". */
  hasContent: boolean;
  /** True once the player has HARD_UNLOCK_AT medium wins. */
  unlocked: boolean;
  level: HardReadinessLevel;
  label: string;
  caption: string;
  fallback: string | null;
  mediumWins: number;
}

export function hardReadiness(stats: Stats, hardPoolSize: number): HardProgressionSignal {
  const mediumWins = stats.mediumWins ?? 0;
  const mediumLosses = stats.mediumLosses ?? 0;
  const mediumGames = mediumWins + mediumLosses;
  const mediumWinRate = mediumGames > 0 ? mediumWins / mediumGames : 0;
  const hardLossStreak = stats.hardLossStreak ?? 0;
  const hasContent = hardPoolSize > 0;
  const unlocked = mediumWins >= HARD_UNLOCK_AT;

  const fallback =
    hardLossStreak >= HARD_FALLBACK_LOSS_STREAK
      ? "Tough stretch — try a Medium to rebuild momentum."
      : null;

  if (!hasContent) {
    return {
      hasContent: false,
      unlocked,
      level: "coming-soon",
      label: "Master Challenge",
      caption: "Curated hard puzzles are being authored. Check back soon.",
      fallback: null,
      mediumWins,
    };
  }

  if (!unlocked) {
    return {
      hasContent: true,
      unlocked: false,
      level: "locked",
      label: "Master Challenge — locked",
      caption: `Solve ${HARD_UNLOCK_AT - mediumWins} more Medium puzzles to unlock.`,
      fallback: null,
      mediumWins,
    };
  }

  const isRecommended =
    mediumWins >= HARD_RECOMMEND_MEDIUM_WINS && mediumWinRate >= HARD_RECOMMEND_MEDIUM_WIN_RATE;

  if (isRecommended) {
    return {
      hasContent: true,
      unlocked: true,
      level: "recommended",
      label: "Master Challenge",
      caption: "Less guidance. Cleaner pressure. You're ready.",
      fallback,
      mediumWins,
    };
  }

  return {
    hasContent: true,
    unlocked: true,
    level: "unlocked",
    label: "Master Challenge",
    caption: "Tabs reveal slowly. No Wink. Try it when you feel sharp.",
    fallback,
    mediumWins,
  };
}
