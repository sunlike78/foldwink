import type { Puzzle, PuzzleGroup } from "../types/puzzle";
import { SELECTION_SIZE } from "../types/game";

export function canSubmit(selection: readonly string[]): boolean {
  return selection.length === SELECTION_SIZE;
}

export function findMatchingGroup(
  selection: readonly string[],
  puzzle: Puzzle,
): PuzzleGroup | null {
  if (selection.length !== SELECTION_SIZE) return null;
  const selSet = new Set(selection);
  if (selSet.size !== SELECTION_SIZE) return null;
  for (const group of puzzle.groups) {
    const groupItems = new Set<string>(group.items);
    if (groupItems.size !== SELECTION_SIZE) continue;
    let match = true;
    for (const item of group.items) {
      if (!selSet.has(item)) {
        match = false;
        break;
      }
    }
    if (match) return group;
  }
  return null;
}
