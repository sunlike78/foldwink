import type { Puzzle } from "./types/puzzle";

export const SOLVED_COLOR_CLASSES = [
  "bg-solved1 text-[#2a1f00]",
  "bg-solved2 text-[#0d260e]",
  "bg-solved3 text-[#2a0d0d]",
  "bg-solved4 text-[#180f2e]",
] as const;

export function colorIndexForGroup(puzzle: Puzzle, groupId: string): number {
  const idx = puzzle.groups.findIndex((g) => g.id === groupId);
  if (idx < 0) return 0;
  return idx % SOLVED_COLOR_CLASSES.length;
}

export function solvedClassForGroup(puzzle: Puzzle, groupId: string): string {
  return SOLVED_COLOR_CLASSES[colorIndexForGroup(puzzle, groupId)];
}
