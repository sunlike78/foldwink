import { describe, it, expect } from "vitest";
import { createStore, type StoreDeps } from "../store";
import type { Puzzle } from "../../types/puzzle";
import { INITIAL_STATS } from "../../types/stats";

function mkPuzzle(id: string, overrides: Partial<Puzzle> = {}): Puzzle {
  return {
    id,
    title: id,
    difficulty: "easy",
    groups: [
      { id: "g1", label: "G1", items: ["a", "b", "c", "d"] },
      { id: "g2", label: "G2", items: ["e", "f", "g", "h"] },
      { id: "g3", label: "G3", items: ["i", "j", "k", "l"] },
      { id: "g4", label: "G4", items: ["m", "n", "o", "p"] },
    ],
    ...overrides,
  };
}

function makeDeps(pool: Puzzle[], opts: Partial<StoreDeps> = {}): StoreDeps {
  let t = 1_000_000;
  const byId = new Map(pool.map((p) => [p.id, p] as const));
  const easyPool = pool.filter((p) => p.difficulty === "easy");
  const mediumPool = pool.filter((p) => p.difficulty === "medium");
  const hardPool = pool.filter((p) => p.difficulty === "hard");
  const wrap = (arr: Puzzle[], i: number): Puzzle | undefined =>
    arr.length === 0 ? undefined : arr[((i % arr.length) + arr.length) % arr.length];
  return {
    pool,
    easyPool,
    mediumPool,
    hardPool,
    getPuzzleById: (id) => byId.get(id),
    getPuzzleByIndex: (i) => wrap(pool, i),
    getEasyByIndex: (i) => wrap(easyPool, i),
    getMediumByIndex: (i) => wrap(mediumPool, i),
    getHardByIndex: (i) => wrap(hardPool, i),
    now: () => {
      t += 1000;
      return t;
    },
    todayLocal: () => "2026-04-11",
    initialStats: { ...INITIAL_STATS },
    initialProgress: { cursor: 0, easyCursor: 0, mediumCursor: 0, hardCursor: 0 },
    initialTodayDailyRecord: null,
    initialOnboarded: true,
    ...opts,
  };
}

function winCurrentPuzzle(store: ReturnType<typeof createStore>) {
  const puzzle = store.getState().puzzle!;
  for (const g of puzzle.groups) {
    for (const item of g.items) store.getState().toggleSelection(item);
    store.getState().submit();
  }
}

describe("store — standard mode", () => {
  it("advances cursor on win", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2"), mkPuzzle("p3")];
    const store = createStore(makeDeps(pool));

    store.getState().startStandard();
    expect(store.getState().puzzle!.id).toBe("p1");
    winCurrentPuzzle(store);
    expect(store.getState().progress.cursor).toBe(1);
    expect(store.getState().screen).toBe("result");

    store.getState().goToMenu();
    store.getState().startStandard();
    expect(store.getState().puzzle!.id).toBe("p2");
  });

  it("does not advance cursor on loss", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2")];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();

    for (let i = 0; i < 4; i++) {
      store.getState().toggleSelection("a");
      store.getState().toggleSelection("e");
      store.getState().toggleSelection("i");
      store.getState().toggleSelection("m");
      store.getState().submit();
    }
    expect(store.getState().summary?.result).toBe("loss");
    expect(store.getState().progress.cursor).toBe(0);
    expect(store.getState().stats.losses).toBe(1);
  });

  it("wraps cursor past the end of pool", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2")];
    const store = createStore(makeDeps(pool, { initialProgress: { cursor: 5 } }));
    store.getState().startStandard();
    expect(store.getState().puzzle!.id).toBe("p2");
  });
});

describe("store — daily mode", () => {
  it("records daily completion and blocks stat double-count on replay", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2")];
    const store = createStore(makeDeps(pool));

    store.getState().startDaily();
    winCurrentPuzzle(store);
    expect(store.getState().todayDailyRecord?.date).toBe("2026-04-11");
    expect(store.getState().stats.wins).toBe(1);

    store.getState().goToMenu();
    store.getState().startDaily();
    expect(store.getState().active!.countsToStats).toBe(false);
    winCurrentPuzzle(store);
    expect(store.getState().stats.wins).toBe(1);
  });
});

describe("store — selection limits", () => {
  it("caps selection at 4", () => {
    const pool = [mkPuzzle("p1")];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();
    store.getState().toggleSelection("a");
    store.getState().toggleSelection("b");
    store.getState().toggleSelection("c");
    store.getState().toggleSelection("d");
    store.getState().toggleSelection("e");
    expect(store.getState().active!.selection).toEqual(["a", "b", "c", "d"]);
  });

  it("deselects on second tap", () => {
    const pool = [mkPuzzle("p1")];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();
    store.getState().toggleSelection("a");
    store.getState().toggleSelection("a");
    expect(store.getState().active!.selection).toEqual([]);
  });
});

describe("store — streak delta", () => {
  it("reports streak delta on a winning submit", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2")];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();
    winCurrentPuzzle(store);
    expect(store.getState().streakDelta).toBe(1);
    expect(store.getState().stats.currentStreak).toBe(1);
  });

  it("resets streak delta on a fresh game", () => {
    const pool = [mkPuzzle("p1"), mkPuzzle("p2")];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();
    winCurrentPuzzle(store);
    store.getState().goToMenu();
    store.getState().startStandard();
    expect(store.getState().streakDelta).toBe(0);
  });
});

describe("store — onboarding", () => {
  it("dismissal flips the flag", () => {
    const pool = [mkPuzzle("p1")];
    const store = createStore(makeDeps(pool, { initialOnboarded: false }));
    expect(store.getState().onboarded).toBe(false);
    store.getState().dismissOnboarding();
    expect(store.getState().onboarded).toBe(true);
  });
});

describe("store — easy vs medium mode split", () => {
  it("startEasy only picks from the easy pool", () => {
    const pool = [
      mkPuzzle("e1"),
      mkPuzzle("m1", { difficulty: "medium" }),
      mkPuzzle("e2"),
      mkPuzzle("m2", { difficulty: "medium" }),
    ];
    const store = createStore(makeDeps(pool));
    store.getState().startEasy();
    expect(store.getState().puzzle!.id).toBe("e1");
    expect(store.getState().puzzle!.difficulty).toBe("easy");
  });

  it("startMedium only picks from the medium pool", () => {
    const pool = [
      mkPuzzle("e1"),
      mkPuzzle("m1", { difficulty: "medium" }),
      mkPuzzle("e2"),
      mkPuzzle("m2", { difficulty: "medium" }),
    ];
    const store = createStore(makeDeps(pool));
    store.getState().startMedium();
    expect(store.getState().puzzle!.id).toBe("m1");
    expect(store.getState().puzzle!.difficulty).toBe("medium");
  });

  it("advances mediumCursor independently of easyCursor on medium win", () => {
    const pool = [
      mkPuzzle("e1"),
      mkPuzzle("m1", { difficulty: "medium" }),
      mkPuzzle("m2", { difficulty: "medium" }),
    ];
    const store = createStore(makeDeps(pool));
    store.getState().startMedium();
    winCurrentPuzzle(store);
    expect(store.getState().progress.mediumCursor).toBe(1);
    // Easy cursor should be untouched.
    expect(store.getState().progress.easyCursor ?? 0).toBe(0);
  });

  it("records medium losses and bumps mediumLossStreak via store", () => {
    const pool = [mkPuzzle("m1", { difficulty: "medium" })];
    const store = createStore(makeDeps(pool));
    store.getState().startMedium();
    // Force a loss: select 4 items from different groups, submit until dead.
    const puzzle = store.getState().puzzle!;
    const wrong = [
      puzzle.groups[0].items[0],
      puzzle.groups[1].items[0],
      puzzle.groups[2].items[0],
      puzzle.groups[3].items[0],
    ];
    for (let i = 0; i < 4; i++) {
      wrong.forEach((v) => store.getState().toggleSelection(v));
      store.getState().submit();
      store.getState().clearSelection?.();
    }
    const s = store.getState().stats;
    expect(s.losses).toBeGreaterThanOrEqual(1);
    expect(s.mediumLossStreak ?? 0).toBeGreaterThanOrEqual(1);
  });
});

describe("store — wink mechanic", () => {
  const mediumPool = [mkPuzzle("m1", { difficulty: "medium" })];
  const easyPool = [mkPuzzle("e1")];

  it("winks an unsolved tab on medium puzzles", () => {
    const store = createStore(makeDeps(mediumPool));
    store.getState().startStandard();
    expect(store.getState().active!.winkedGroupId).toBeNull();
    store.getState().winkTab("g2");
    expect(store.getState().active!.winkedGroupId).toBe("g2");
  });

  it("refuses a second wink in the same game", () => {
    const store = createStore(makeDeps(mediumPool));
    store.getState().startStandard();
    store.getState().winkTab("g2");
    store.getState().winkTab("g3");
    expect(store.getState().active!.winkedGroupId).toBe("g2");
  });

  it("refuses winking a solved group", () => {
    const store = createStore(makeDeps(mediumPool));
    store.getState().startStandard();
    for (const item of ["a", "b", "c", "d"]) store.getState().toggleSelection(item);
    store.getState().submit();
    store.getState().winkTab("g1");
    expect(store.getState().active!.winkedGroupId).toBeNull();
  });

  it("refuses winking on easy puzzles", () => {
    const store = createStore(makeDeps(easyPool));
    store.getState().startStandard();
    store.getState().winkTab("g1");
    expect(store.getState().active!.winkedGroupId).toBeNull();
  });

  it("refuses winking an unknown group id", () => {
    const store = createStore(makeDeps(mediumPool));
    store.getState().startStandard();
    store.getState().winkTab("ghost");
    expect(store.getState().active!.winkedGroupId).toBeNull();
  });

  it("resets winkedGroupId on a fresh game", () => {
    const pool = [
      mkPuzzle("m1", { difficulty: "medium" }),
      mkPuzzle("m2", { difficulty: "medium" }),
    ];
    const store = createStore(makeDeps(pool));
    store.getState().startStandard();
    store.getState().winkTab("g2");
    expect(store.getState().active!.winkedGroupId).toBe("g2");
    store.getState().goToMenu();
    store.getState().startStandard();
    expect(store.getState().active!.winkedGroupId).toBeNull();
  });

  it("refuses winking after the game has ended", () => {
    const store = createStore(makeDeps(mediumPool));
    store.getState().startStandard();
    for (let i = 0; i < 4; i++) {
      store.getState().toggleSelection("a");
      store.getState().toggleSelection("e");
      store.getState().toggleSelection("i");
      store.getState().toggleSelection("m");
      store.getState().submit();
    }
    expect(store.getState().summary?.result).toBe("loss");
    store.getState().winkTab("g1");
    expect(store.getState().active!.winkedGroupId).toBeNull();
  });
});
