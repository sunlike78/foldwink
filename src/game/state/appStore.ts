import { createStore, defaultDeps } from "./store";
import {
  loadStats,
  loadProgress,
  loadDailyHistory,
  loadOnboarded,
  loadActiveSession,
  clearActiveSession,
} from "../../stats/persistence";
import { statsPersistenceObserver } from "./persistence/statsObserver";
import { sessionPersistenceObserver } from "./persistence/sessionObserver";
import type { DailyRecord } from "../types/stats";
import type { ActiveGame, AppScreen } from "../types/game";
import type { Puzzle } from "../types/puzzle";
import {
  langGetPuzzleById,
  langGetPuzzleByIdStrict,
  langGetPuzzleByIndex,
  langGetEasyByIndex,
  langGetMediumByIndex,
  langGetHardByIndex,
  langGetEasyRampedByIndex,
  langGetMediumRampedByIndex,
  langGetHardRampedByIndex,
  langGetPool,
  langGetEasyPool,
  langGetMediumPool,
  langGetHardPool,
} from "../../puzzles/byLang";
import { useLangStore } from "../../i18n/useLanguage";
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
  // Resume strictly from the current language pool — no EN fallback here,
  // otherwise a DE/RU session could reopen with English puzzle content after
  // a language switch.
  const puzzle = langGetPuzzleByIdStrict(session.puzzleId);
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

export const useGameStore = createStore({
  ...defaultDeps,
  getPuzzleById: langGetPuzzleById,
  getPuzzleByIndex: langGetPuzzleByIndex,
  getEasyByIndex: langGetEasyByIndex,
  getMediumByIndex: langGetMediumByIndex,
  getHardByIndex: langGetHardByIndex,
  getEasyRampedByIndex: langGetEasyRampedByIndex,
  getMediumRampedByIndex: langGetMediumRampedByIndex,
  getHardRampedByIndex: langGetHardRampedByIndex,
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

// Persistence is split into two narrow observers so tests can exercise
// each policy independently (stats vs mid-game session).
statsPersistenceObserver(useGameStore);
sessionPersistenceObserver(useGameStore);

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
