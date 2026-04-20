import { createStore, defaultDeps, type StoreState } from "./store";
import {
  loadStats,
  saveStats,
  loadProgress,
  saveProgress,
  loadDailyHistory,
  saveDailyHistory,
  loadOnboarded,
  saveOnboarded,
  loadActiveSession,
  saveActiveSession,
  clearActiveSession,
} from "../../stats/persistence";
import type { DailyRecord } from "../types/stats";
import type { ActiveGame, AppScreen } from "../types/game";
import type { Puzzle } from "../types/puzzle";
import {
  getPuzzleById,
  getPuzzleByIndex,
  getEasyByIndex,
  getMediumByIndex,
  getHardByIndex,
  PUZZLE_POOL,
  EASY_POOL,
  MEDIUM_POOL,
  HARD_POOL,
} from "../../puzzles/loader";
import {
  getDEPuzzleById,
  getDEPuzzleByIndex,
  getDEEasyByIndex,
  getDEMediumByIndex,
  getDEHardByIndex,
  DE_PUZZLE_POOL,
  DE_EASY_POOL,
  DE_MEDIUM_POOL,
  DE_HARD_POOL,
} from "../../puzzles/loaderDe";
import {
  getRUPuzzleById,
  getRUPuzzleByIndex,
  getRUEasyByIndex,
  getRUMediumByIndex,
  getRUHardByIndex,
  RU_PUZZLE_POOL,
  RU_EASY_POOL,
  RU_MEDIUM_POOL,
  RU_HARD_POOL,
} from "../../puzzles/loaderRu";
import { getLangSync, useLangStore } from "../../i18n/useLanguage";
import { todayLocal } from "../../utils/date";

function initialTodayDailyRecord(): DailyRecord | null {
  const history = loadDailyHistory();
  const today = todayLocal();
  return history[today] ?? null;
}

interface ResumedSession {
  active: ActiveGame;
  puzzle: Puzzle;
  screen: AppScreen;
}

function tryResumeSession(): ResumedSession | null {
  const session = loadActiveSession();
  if (!session) return null;
  // Only resume games that were in-progress. A finalised game must not come
  // back via the resume path — it lives in stats + daily history instead.
  if (session.active.result) {
    clearActiveSession();
    return null;
  }
  // Resume strictly from the current language pool. Resuming a puzzle from a
  // different language mixes chrome (current lang) with content (saved lang)
  // and confuses the player.
  const lang = getLangSync();
  const findById =
    lang === "ru" ? getRUPuzzleById
    : lang === "de" ? getDEPuzzleById
    : getPuzzleById;
  const puzzle = findById(session.puzzleId);
  if (!puzzle) {
    clearActiveSession();
    return null;
  }
  if (session.active.puzzleId !== puzzle.id) {
    clearActiveSession();
    return null;
  }
  return { active: session.active, puzzle, screen: "game" };
}

const resumed = tryResumeSession();

// Language-aware getters: read current language at call time so switching
// language takes effect on the next game start without recreating the store.
function langGetPuzzleById(id: string): Puzzle | undefined {
  const lang = getLangSync();
  if (lang === "de") return getDEPuzzleById(id) ?? getPuzzleById(id);
  if (lang === "ru") return getRUPuzzleById(id) ?? getPuzzleById(id);
  return getPuzzleById(id);
}
function langGetPuzzleByIndex(i: number): Puzzle | undefined {
  const lang = getLangSync();
  if (lang === "de") return getDEPuzzleByIndex(i) ?? getPuzzleByIndex(i);
  if (lang === "ru") return getRUPuzzleByIndex(i) ?? getPuzzleByIndex(i);
  return getPuzzleByIndex(i);
}
function langGetEasyByIndex(i: number): Puzzle | undefined {
  const lang = getLangSync();
  if (lang === "de") return getDEEasyByIndex(i) ?? getEasyByIndex(i);
  if (lang === "ru") return getRUEasyByIndex(i) ?? getEasyByIndex(i);
  return getEasyByIndex(i);
}
function langGetMediumByIndex(i: number): Puzzle | undefined {
  const lang = getLangSync();
  if (lang === "de") return getDEMediumByIndex(i) ?? getMediumByIndex(i);
  if (lang === "ru") return getRUMediumByIndex(i) ?? getMediumByIndex(i);
  return getMediumByIndex(i);
}
function langGetHardByIndex(i: number): Puzzle | undefined {
  const lang = getLangSync();
  if (lang === "de") return getDEHardByIndex(i) ?? getHardByIndex(i);
  if (lang === "ru") return getRUHardByIndex(i) ?? getHardByIndex(i);
  return getHardByIndex(i);
}

function langGetPool(): readonly Puzzle[] {
  const lang = getLangSync();
  if (lang === "de" && DE_PUZZLE_POOL.length > 0) return DE_PUZZLE_POOL;
  if (lang === "ru" && RU_PUZZLE_POOL.length > 0) return RU_PUZZLE_POOL;
  return PUZZLE_POOL;
}
function langGetEasyPool(): readonly Puzzle[] {
  const lang = getLangSync();
  if (lang === "de" && DE_EASY_POOL.length > 0) return DE_EASY_POOL;
  if (lang === "ru" && RU_EASY_POOL.length > 0) return RU_EASY_POOL;
  return EASY_POOL;
}
function langGetMediumPool(): readonly Puzzle[] {
  const lang = getLangSync();
  if (lang === "de" && DE_MEDIUM_POOL.length > 0) return DE_MEDIUM_POOL;
  if (lang === "ru" && RU_MEDIUM_POOL.length > 0) return RU_MEDIUM_POOL;
  return MEDIUM_POOL;
}
function langGetHardPool(): readonly Puzzle[] {
  const lang = getLangSync();
  if (lang === "de" && DE_HARD_POOL.length > 0) return DE_HARD_POOL;
  if (lang === "ru" && RU_HARD_POOL.length > 0) return RU_HARD_POOL;
  return HARD_POOL;
}

export const useGameStore = createStore({
  ...defaultDeps,
  getPuzzleById: langGetPuzzleById,
  getPuzzleByIndex: langGetPuzzleByIndex,
  getEasyByIndex: langGetEasyByIndex,
  getMediumByIndex: langGetMediumByIndex,
  getHardByIndex: langGetHardByIndex,
  getPool: langGetPool,
  getEasyPool: langGetEasyPool,
  getMediumPool: langGetMediumPool,
  getHardPool: langGetHardPool,
  initialStats: loadStats(),
  initialProgress: loadProgress(),
  initialTodayDailyRecord: initialTodayDailyRecord(),
  initialOnboarded: loadOnboarded(),
  initialActive: resumed?.active ?? null,
  initialPuzzle: resumed?.puzzle ?? null,
  initialScreen: resumed?.screen ?? "menu",
});

let prevStats = useGameStore.getState().stats;
let prevProgress = useGameStore.getState().progress;
let prevTodayDailyRecord = useGameStore.getState().todayDailyRecord;
let prevOnboarded = useGameStore.getState().onboarded;
let prevActive = useGameStore.getState().active;
let prevScreen = useGameStore.getState().screen;
let prevPuzzleId = useGameStore.getState().puzzle?.id ?? null;

useGameStore.subscribe((state: StoreState) => {
  if (state.stats !== prevStats) {
    prevStats = state.stats;
    saveStats(state.stats);
  }
  if (state.progress !== prevProgress) {
    prevProgress = state.progress;
    saveProgress(state.progress);
  }
  if (state.todayDailyRecord !== prevTodayDailyRecord) {
    prevTodayDailyRecord = state.todayDailyRecord;
    if (state.todayDailyRecord) {
      const history = loadDailyHistory();
      history[state.todayDailyRecord.date] = state.todayDailyRecord;
      saveDailyHistory(history);
    }
  }
  if (state.onboarded !== prevOnboarded) {
    prevOnboarded = state.onboarded;
    saveOnboarded(state.onboarded);
  }

  // Mid-game persistence.
  const currentPuzzleId = state.puzzle?.id ?? null;
  if (state.screen === "game" && state.active && !state.active.result && state.puzzle) {
    if (state.active !== prevActive || currentPuzzleId !== prevPuzzleId) {
      saveActiveSession({
        active: state.active,
        puzzleId: state.puzzle.id,
        savedAt: Date.now(),
      });
    }
  } else if (
    state.screen !== prevScreen ||
    state.active !== prevActive ||
    !!state.active?.result
  ) {
    // Any transition away from an active game screen clears the session.
    clearActiveSession();
  }
  prevActive = state.active;
  prevScreen = state.screen;
  prevPuzzleId = currentPuzzleId;
});

// When the player switches language, an in-flight game would carry its
// original-language puzzle into a different-language chrome (English title
// under Russian UI, etc.). Drop any active/resumable game and send them back
// to the menu so the next action starts in the new language pool.
let prevLang = useLangStore.getState().lang;
useLangStore.subscribe((state) => {
  if (state.lang === prevLang) return;
  prevLang = state.lang;
  const game = useGameStore.getState();
  if (game.active || game.screen === "game" || game.screen === "result") {
    game.goToMenu();
  }
  clearActiveSession();
});
