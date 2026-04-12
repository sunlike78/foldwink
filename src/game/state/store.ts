import { create } from "zustand";
import type { ActiveGame, AppScreen, GameMode, GameResult } from "../types/game";
import type { Puzzle } from "../types/puzzle";
import type { Stats, StandardProgress, DailyRecord } from "../types/stats";
import { INITIAL_STATS } from "../types/stats";
import { SELECTION_SIZE } from "../types/game";
import {
  PUZZLE_POOL,
  EASY_POOL,
  MEDIUM_POOL,
  HARD_POOL,
  getPuzzleById,
  getPuzzleByIndex,
  getEasyByIndex,
  getMediumByIndex,
  getHardByIndex,
} from "../../puzzles/loader";
import { getDailyPuzzleId } from "../../puzzles/daily";
import { shuffleItems, seedFromString } from "../engine/shuffle";
import { canSubmit, findMatchingGroup } from "../engine/submit";
import { applyCorrectGroup, applyIncorrectGuess, isLoss, isWin } from "../engine/progress";
import { calculateResultSummary, type ResultSummary } from "../engine/result";
import { canWinkGroup } from "../engine/foldwinkTabs";
import { applyGameResult } from "../../stats/stats";
import { todayLocal } from "../../utils/date";

type FlashKind = "correct" | "incorrect" | null;

export interface StoreState {
  screen: AppScreen;
  stats: Stats;
  progress: StandardProgress;
  todayDailyRecord: DailyRecord | null;
  poolSize: number;
  active: ActiveGame | null;
  puzzle: Puzzle | null;
  summary: ResultSummary | null;
  flash: FlashKind;
  streakDelta: number;
  onboarded: boolean;

  startStandard: () => void;
  startEasy: () => void;
  startMedium: () => void;
  startHard: () => void;
  startDaily: () => void;
  toggleSelection: (value: string) => void;
  clearSelection: () => void;
  submit: () => void;
  goToMenu: () => void;
  showStats: () => void;
  startNextSame: () => void;
  clearFlash: () => void;
  dismissOnboarding: () => void;
  winkTab: (groupId: string) => void;
}

export interface StoreDeps {
  pool: readonly Puzzle[];
  easyPool: readonly Puzzle[];
  mediumPool: readonly Puzzle[];
  hardPool: readonly Puzzle[];
  getPuzzleById: (id: string) => Puzzle | undefined;
  getPuzzleByIndex: (i: number) => Puzzle | undefined;
  getEasyByIndex: (i: number) => Puzzle | undefined;
  getMediumByIndex: (i: number) => Puzzle | undefined;
  getHardByIndex: (i: number) => Puzzle | undefined;
  now: () => number;
  todayLocal: () => string;
  initialStats: Stats;
  initialProgress: StandardProgress;
  initialTodayDailyRecord: DailyRecord | null;
  initialOnboarded: boolean;
  initialActive?: ActiveGame | null;
  initialPuzzle?: Puzzle | null;
  initialScreen?: AppScreen;
}

export const defaultDeps: StoreDeps = {
  pool: PUZZLE_POOL,
  easyPool: EASY_POOL,
  mediumPool: MEDIUM_POOL,
  hardPool: HARD_POOL,
  getPuzzleById,
  getPuzzleByIndex,
  getEasyByIndex,
  getMediumByIndex,
  getHardByIndex,
  now: () => Date.now(),
  todayLocal,
  initialStats: INITIAL_STATS,
  initialProgress: { cursor: 0, easyCursor: 0, mediumCursor: 0, hardCursor: 0 },
  initialTodayDailyRecord: null,
  initialOnboarded: true,
  initialActive: null,
  initialPuzzle: null,
  initialScreen: "menu",
};

function resolveCursor(
  progress: StandardProgress,
  difficulty: "easy" | "medium" | "hard",
): number {
  if (difficulty === "easy") return progress.easyCursor ?? progress.cursor ?? 0;
  if (difficulty === "medium") return progress.mediumCursor ?? 0;
  return progress.hardCursor ?? 0;
}

export const selectDailyPlayedDate = (s: StoreState): string | null =>
  s.todayDailyRecord?.date ?? null;

function initialActive(
  puzzle: Puzzle,
  mode: GameMode,
  seedExtra: string,
  countsToStats: boolean,
  now: number,
): ActiveGame {
  const seed = seedFromString(puzzle.id + "|" + seedExtra);
  return {
    puzzleId: puzzle.id,
    mode,
    order: shuffleItems(puzzle, seed),
    selection: [],
    solvedGroupIds: [],
    mistakesUsed: 0,
    startedAt: now,
    countsToStats,
    winkedGroupId: null,
  };
}

function finalizeIfEnded(
  active: ActiveGame,
  puzzle: Puzzle,
  now: number,
): { active: ActiveGame; ended: boolean } {
  if (isWin(active, puzzle)) {
    return { active: { ...active, result: "win", endedAt: now }, ended: true };
  }
  if (isLoss(active)) {
    return { active: { ...active, result: "loss", endedAt: now }, ended: true };
  }
  return { active, ended: false };
}

export function createStore(deps: StoreDeps = defaultDeps) {
  return create<StoreState>((set, get) => ({
    screen: deps.initialScreen ?? "menu",
    stats: deps.initialStats,
    progress: deps.initialProgress,
    todayDailyRecord: deps.initialTodayDailyRecord,
    poolSize: deps.pool.length,
    active: deps.initialActive ?? null,
    puzzle: deps.initialPuzzle ?? null,
    summary: null,
    flash: null,
    streakDelta: 0,
    onboarded: deps.initialOnboarded,

    startStandard: () => {
      get().startEasy();
    },

    startEasy: () => {
      const progress = get().progress;
      const cursor = resolveCursor(progress, "easy");
      const fromEasy = deps.getEasyByIndex(cursor);
      // Fallback to the full pool when there is no easy puzzle loaded (edge
      // case for test fixtures with no easy entries). This keeps the action
      // safe for callers that don't distinguish pools.
      const puzzle = fromEasy ?? deps.getPuzzleByIndex(cursor);
      if (!puzzle) return;
      const active = initialActive(puzzle, "standard", String(deps.now()), true, deps.now());
      set({
        screen: "game",
        puzzle,
        active,
        summary: null,
        flash: null,
        streakDelta: 0,
      });
    },

    startMedium: () => {
      const progress = get().progress;
      const cursor = resolveCursor(progress, "medium");
      const puzzle = deps.getMediumByIndex(cursor);
      if (!puzzle) return;
      const active = initialActive(puzzle, "standard", String(deps.now()), true, deps.now());
      set({
        screen: "game",
        puzzle,
        active,
        summary: null,
        flash: null,
        streakDelta: 0,
      });
    },

    startHard: () => {
      const progress = get().progress;
      const cursor = resolveCursor(progress, "hard");
      const puzzle = deps.getHardByIndex(cursor);
      // Hard is scaffolded — if no Hard content exists yet, the action is a
      // safe no-op. The menu surfaces this via its own disabled state.
      if (!puzzle) return;
      const active = initialActive(puzzle, "standard", String(deps.now()), true, deps.now());
      set({
        screen: "game",
        puzzle,
        active,
        summary: null,
        flash: null,
        streakDelta: 0,
      });
    },

    startDaily: () => {
      if (deps.pool.length === 0) return;
      const date = deps.todayLocal();
      const id = getDailyPuzzleId(date, deps.pool);
      const puzzle = deps.getPuzzleById(id);
      if (!puzzle) return;
      const alreadyPlayed = get().todayDailyRecord?.date === date;
      const active = initialActive(puzzle, "daily", date, !alreadyPlayed, deps.now());
      set({
        screen: "game",
        puzzle,
        active,
        summary: null,
        flash: null,
        streakDelta: 0,
      });
    },

    toggleSelection: (value: string) => {
      const { active, puzzle } = get();
      if (!active || !puzzle) return;
      if (active.result) return;
      if (active.solvedGroupIds.length > 0) {
        const solvedItems = new Set<string>();
        for (const g of puzzle.groups) {
          if (active.solvedGroupIds.includes(g.id)) {
            for (const it of g.items) solvedItems.add(it);
          }
        }
        if (solvedItems.has(value)) return;
      }
      const already = active.selection.includes(value);
      if (already) {
        set({
          active: { ...active, selection: active.selection.filter((v) => v !== value) },
        });
        return;
      }
      if (active.selection.length >= SELECTION_SIZE) return;
      set({ active: { ...active, selection: [...active.selection, value] } });
    },

    clearSelection: () => {
      const { active } = get();
      if (!active || active.result) return;
      set({ active: { ...active, selection: [] } });
    },

    submit: () => {
      const state = get();
      const { active, puzzle, stats, progress } = state;
      if (!active || !puzzle || active.result) return;
      if (!canSubmit(active.selection)) return;
      const matched = findMatchingGroup(active.selection, puzzle);
      let next: ActiveGame;
      let flash: FlashKind;
      if (matched) {
        next = applyCorrectGroup(active, matched.id);
        flash = "correct";
      } else {
        next = applyIncorrectGuess(active);
        flash = "incorrect";
      }
      const finalized = finalizeIfEnded(next, puzzle, deps.now());
      if (!finalized.ended || !finalized.active.result) {
        set({ active: finalized.active, flash });
        return;
      }

      const result: GameResult = finalized.active.result;
      const endedAt = finalized.active.endedAt ?? deps.now();
      const summary = calculateResultSummary(finalized.active, endedAt);

      let nextStats = stats;
      let nextProgress = progress;
      let nextTodayDailyRecord = state.todayDailyRecord;
      let streakDelta = 0;

      if (active.countsToStats) {
        nextStats = applyGameResult(stats, result, {
          puzzleId: puzzle.id,
          difficulty: puzzle.difficulty,
          mistakesUsed: summary.mistakesUsed,
          winkUsed: active.winkedGroupId !== null,
          durationMs: summary.durationMs,
        });
        if (result === "win") streakDelta = nextStats.currentStreak - stats.currentStreak;

        if (active.mode === "standard" && result === "win") {
          if (puzzle.difficulty === "easy") {
            const nextEasy = (progress.easyCursor ?? progress.cursor ?? 0) + 1;
            nextProgress = {
              ...progress,
              easyCursor: nextEasy,
              cursor: nextEasy, // keep legacy field in sync
            };
          } else if (puzzle.difficulty === "medium") {
            const nextMedium = (progress.mediumCursor ?? 0) + 1;
            nextProgress = { ...progress, mediumCursor: nextMedium };
          } else {
            const nextHard = (progress.hardCursor ?? 0) + 1;
            nextProgress = { ...progress, hardCursor: nextHard };
          }
        }
        if (active.mode === "daily") {
          const date = deps.todayLocal();
          nextTodayDailyRecord = {
            date,
            puzzleId: puzzle.id,
            result,
            mistakesUsed: summary.mistakesUsed,
            durationMs: summary.durationMs,
          };
        }
      }

      set({
        active: finalized.active,
        stats: nextStats,
        progress: nextProgress,
        todayDailyRecord: nextTodayDailyRecord,
        summary,
        screen: "result",
        flash,
        streakDelta,
      });
    },

    goToMenu: () => {
      set({
        screen: "menu",
        active: null,
        puzzle: null,
        summary: null,
        flash: null,
        streakDelta: 0,
      });
    },

    showStats: () => {
      set({ screen: "stats", flash: null });
    },

    startNextSame: () => {
      const { active, puzzle } = get();
      if (!active) {
        get().goToMenu();
        return;
      }
      if (active.mode === "daily") {
        get().goToMenu();
        return;
      }
      // Preserve difficulty across "next puzzle" in standard flow.
      if (puzzle?.difficulty === "hard") {
        get().startHard();
        return;
      }
      if (puzzle?.difficulty === "medium") {
        get().startMedium();
        return;
      }
      get().startEasy();
    },

    clearFlash: () => set({ flash: null }),

    dismissOnboarding: () => set({ onboarded: true }),

    winkTab: (groupId: string) => {
      const { active, puzzle } = get();
      if (!active || !puzzle || active.result) return;
      if (!canWinkGroup(puzzle, active.solvedGroupIds, active.winkedGroupId, groupId)) return;
      set({ active: { ...active, winkedGroupId: groupId } });
    },
  }));
}
