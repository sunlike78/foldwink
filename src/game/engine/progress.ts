import type { ActiveGame } from "../types/game";
import type { Puzzle } from "../types/puzzle";
import { MAX_MISTAKES } from "../types/game";

export function applyCorrectGroup(game: ActiveGame, groupId: string): ActiveGame {
  if (game.solvedGroupIds.includes(groupId)) return game;
  return {
    ...game,
    solvedGroupIds: [...game.solvedGroupIds, groupId],
    selection: [],
  };
}

export function applyIncorrectGuess(game: ActiveGame): ActiveGame {
  return {
    ...game,
    mistakesUsed: game.mistakesUsed + 1,
    selection: [],
  };
}

export function remainingMistakes(game: ActiveGame): number {
  return Math.max(0, MAX_MISTAKES - game.mistakesUsed);
}

export function isWin(game: ActiveGame, puzzle: Puzzle): boolean {
  return game.solvedGroupIds.length === puzzle.groups.length;
}

export function isLoss(game: ActiveGame): boolean {
  return game.mistakesUsed >= MAX_MISTAKES;
}
