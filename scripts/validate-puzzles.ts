/**
 * Foldwink puzzle validator.
 *
 * Run: npm run validate
 *
 * Validates every JSON file in puzzles/pool/ against the canonical schema:
 *   - exactly 4 groups
 *   - each group has exactly 4 non-empty string items
 *   - unique group ids within a puzzle
 *   - no duplicate items inside a puzzle (case-insensitive)
 *   - unique puzzle id across the pool
 *   - difficulty in {easy, medium}
 *   - reasonable item length for mobile layout
 *   - medium puzzles: revealHint present, non-empty, and no duplicates
 *
 * Also emits warnings (non-fatal) for:
 *   - items shared across different puzzles (possibly fine)
 *   - extremely short or long items
 *   - overly long revealHint strings
 */

import fs from "node:fs";
import path from "node:path";

type PuzzleDifficulty = "easy" | "medium" | "hard";

interface PuzzleGroup {
  id: string;
  label: string;
  items: [string, string, string, string];
  revealHint?: string;
}

interface PuzzleMeta {
  theme?: string;
  categoryType?: string;
  wordplay?: boolean;
  fairnessRisk?: number;
  repetitionRisk?: number;
  tags?: string[];
  batch?: string;
  status?: string;
}

interface Puzzle {
  id: string;
  title: string;
  difficulty: PuzzleDifficulty;
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
  editorialSummary?: string;
  meta?: PuzzleMeta;
}

const POOL_DIR = path.resolve("puzzles/pool");
const MAX_ITEM_LEN = 22;
const MIN_ITEM_LEN = 2;

const errors: string[] = [];
const warnings: string[] = [];

function fail(file: string, msg: string): void {
  errors.push(`[${file}] ${msg}`);
}

function warn(file: string, msg: string): void {
  warnings.push(`[${file}] ${msg}`);
}

function readJsonFiles(dir: string): { file: string; json: unknown }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => ({
      file: f,
      json: JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")),
    }));
}

function validatePuzzle(file: string, raw: unknown): Puzzle | null {
  if (!raw || typeof raw !== "object") {
    fail(file, "puzzle must be an object");
    return null;
  }
  const v = raw as Record<string, unknown>;

  if (typeof v.id !== "string" || !v.id) {
    fail(file, "missing or empty id");
    return null;
  }
  if (typeof v.title !== "string" || !v.title) {
    fail(file, "missing or empty title");
  }
  if (v.difficulty !== "easy" && v.difficulty !== "medium" && v.difficulty !== "hard") {
    fail(file, `invalid difficulty: ${String(v.difficulty)}`);
  }
  if (!Array.isArray(v.groups) || v.groups.length !== 4) {
    fail(
      file,
      `must have exactly 4 groups (got ${Array.isArray(v.groups) ? v.groups.length : "none"})`,
    );
    return null;
  }

  const groupIds = new Set<string>();
  const itemsNormalized = new Set<string>();

  for (const gRaw of v.groups as unknown[]) {
    if (!gRaw || typeof gRaw !== "object") {
      fail(file, "group must be an object");
      continue;
    }
    const g = gRaw as Record<string, unknown>;
    if (typeof g.id !== "string" || !g.id) {
      fail(file, "group missing id");
      continue;
    }
    if (groupIds.has(g.id)) fail(file, `duplicate group id: ${g.id}`);
    groupIds.add(g.id);

    if (typeof g.label !== "string" || !g.label) {
      fail(file, `group ${g.id} missing label`);
    }

    if (!Array.isArray(g.items) || g.items.length !== 4) {
      fail(file, `group ${g.id} must have exactly 4 items`);
      continue;
    }

    for (const item of g.items as unknown[]) {
      if (typeof item !== "string" || !item.trim()) {
        fail(file, `group ${g.id} has an empty/invalid item`);
        continue;
      }
      const normalized = item.trim().toLowerCase();
      if (itemsNormalized.has(normalized)) {
        fail(file, `duplicate item across groups: "${item}"`);
      }
      itemsNormalized.add(normalized);
      if (item.length > MAX_ITEM_LEN) {
        warn(file, `item "${item}" exceeds ${MAX_ITEM_LEN} chars (mobile layout risk)`);
      }
      if (item.trim().length < MIN_ITEM_LEN) {
        warn(file, `item "${item}" is extremely short`);
      }
    }
  }

  // Validate revealHint fields (Foldwink Tabs mechanic, medium puzzles).
  if (v.difficulty === "medium") {
    const hintSamples: string[] = [];
    for (const gRaw of v.groups as unknown[]) {
      if (!gRaw || typeof gRaw !== "object") continue;
      const g = gRaw as Record<string, unknown>;
      if (g.revealHint === undefined) continue;
      if (typeof g.revealHint !== "string" || !g.revealHint.trim()) {
        fail(file, `group ${String(g.id)} revealHint must be a non-empty string`);
        continue;
      }
      const hint = g.revealHint.trim();
      if (hint.length > 24) {
        warn(file, `group ${String(g.id)} revealHint "${hint}" is long — trim for mobile tab`);
      }
      hintSamples.push(hint.toLowerCase());
    }
    const seen = new Set<string>();
    for (const h of hintSamples) {
      if (seen.has(h)) warn(file, `duplicate revealHint "${h}" on more than one group`);
      seen.add(h);
    }
  } else {
    for (const gRaw of v.groups as unknown[]) {
      if (!gRaw || typeof gRaw !== "object") continue;
      const g = gRaw as Record<string, unknown>;
      if (g.revealHint !== undefined) {
        warn(file, "revealHint is only meaningful on medium puzzles");
      }
    }
  }

  if (errors.length > 0) return null;
  return v as unknown as Puzzle;
}

/**
 * Semantic diversity helpers.
 *
 * These are cheap approximations — we do not ship an NLP dependency. A
 * "near-duplicate" item shares a normalised form, a "collision-risk" label
 * shares a distinctive token with a label in a different puzzle, and
 * "over-niche" items are flagged for manual review.
 */

function normaliseToken(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, "")
    .replace(/\s+/g, " ");
}

function labelTokens(label: string): string[] {
  return normaliseToken(label)
    .split(" ")
    .filter((t) => t.length >= 4 && !STOP_WORDS.has(t));
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "with",
  "from",
  "that",
  "this",
  "into",
  "onto",
  "over",
  "your",
  "have",
  "been",
  "their",
  "about",
  "kind",
  "sort",
  "list",
]);

const NICHE_CHAR = /[^\p{L}\p{N}\s'’\-.]/u;

function main(): void {
  const files = readJsonFiles(POOL_DIR);
  if (files.length === 0) {
    console.log("No puzzle files in puzzles/pool/.");
    process.exit(1);
  }

  const seenPuzzleIds = new Map<string, string>();
  const itemsGlobal = new Map<string, string[]>();
  const labelTokenIndex = new Map<string, Set<string>>();
  const labelShapeIndex = new Map<string, Set<string>>();
  const themeSignatures = new Set<string>();

  let easy = 0;
  let medium = 0;
  let hard = 0;
  let validCount = 0;
  let nicheFlags = 0;
  let labelCollisions = 0;
  let withMeta = 0;
  let withTheme = 0;
  let withCategoryType = 0;
  const themeCounts = new Map<string, number>();
  const categoryTypeCounts = new Map<string, number>();
  const batchCounts = new Map<string, number>();
  let wordplayMediums = 0;
  let totalMediums = 0;

  for (const { file, json } of files) {
    const errorsBefore = errors.length;
    const puzzle = validatePuzzle(file, json);
    if (!puzzle) continue;

    if (errors.length > errorsBefore) continue;

    if (seenPuzzleIds.has(puzzle.id)) {
      fail(file, `duplicate puzzle id: ${puzzle.id} (also in ${seenPuzzleIds.get(puzzle.id)})`);
      continue;
    }
    seenPuzzleIds.set(puzzle.id, file);

    if (puzzle.difficulty === "easy") easy++;
    if (puzzle.difficulty === "medium") {
      medium++;
      totalMediums++;
    }
    if (puzzle.difficulty === "hard") hard++;
    validCount++;

    // Metadata coverage (additive only — no failures for missing meta).
    if (puzzle.meta && typeof puzzle.meta === "object") {
      withMeta++;
      if (typeof puzzle.meta.theme === "string" && puzzle.meta.theme.trim()) {
        withTheme++;
        const t = puzzle.meta.theme.trim().toLowerCase();
        themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1);
      }
      if (typeof puzzle.meta.categoryType === "string" && puzzle.meta.categoryType.trim()) {
        withCategoryType++;
        const ct = puzzle.meta.categoryType.trim().toLowerCase();
        categoryTypeCounts.set(ct, (categoryTypeCounts.get(ct) ?? 0) + 1);
      }
      if (puzzle.meta.wordplay === true && puzzle.difficulty === "medium") {
        wordplayMediums++;
      }
      if (typeof puzzle.meta.batch === "string" && puzzle.meta.batch.trim()) {
        const b = puzzle.meta.batch.trim();
        batchCounts.set(b, (batchCounts.get(b) ?? 0) + 1);
      }
      if (typeof puzzle.meta.fairnessRisk === "number" && puzzle.meta.fairnessRisk >= 2) {
        warn(
          file,
          `editorial fairness risk = ${puzzle.meta.fairnessRisk} — human review recommended`,
        );
      }
    }

    const puzzleLabelTokens: string[] = [];

    for (const g of puzzle.groups) {
      for (const item of g.items) {
        const key = normaliseToken(item);
        const list = itemsGlobal.get(key) ?? [];
        list.push(puzzle.id);
        itemsGlobal.set(key, list);

        if (NICHE_CHAR.test(item)) {
          warn(
            file,
            `item "${item}" contains unusual characters — editorial review recommended`,
          );
          nicheFlags++;
        }
      }

      const normalisedLabel = normaliseToken(g.label);
      const shape = normalisedLabel.replace(/\s+/g, "·");
      const shapeList = labelShapeIndex.get(shape) ?? new Set();
      shapeList.add(puzzle.id);
      labelShapeIndex.set(shape, shapeList);

      for (const tok of labelTokens(g.label)) {
        puzzleLabelTokens.push(tok);
        const idx = labelTokenIndex.get(tok) ?? new Set();
        idx.add(puzzle.id);
        labelTokenIndex.set(tok, idx);
      }
    }

    // Theme signature = sorted distinct label tokens. Two puzzles with the
    // exact same label shape (e.g. Colors + Sports + Planets + Pets) share a
    // theme signature and are worth flagging even when item sets differ.
    if (puzzleLabelTokens.length > 0) {
      const sig = Array.from(new Set(puzzleLabelTokens)).sort().join("|");
      if (themeSignatures.has(sig)) {
        warn(file, `label theme signature already used by another puzzle: ${sig}`);
      }
      themeSignatures.add(sig);
    }
  }

  for (const [item, ids] of itemsGlobal) {
    if (ids.length > 1) {
      warn("global", `item "${item}" appears in ${ids.length} puzzles: ${ids.join(", ")}`);
    }
  }

  for (const [shape, ids] of labelShapeIndex) {
    if (ids.size > 1 && shape.length > 0) {
      warn(
        "global",
        `label "${shape.replace(/·/g, " ")}" appears verbatim in ${ids.size} puzzles: ${Array.from(ids).join(", ")}`,
      );
      labelCollisions++;
    }
  }

  const distinctLabels = labelShapeIndex.size;
  const distinctLabelTokens = labelTokenIndex.size;
  const diversityScore = validCount > 0 ? distinctLabels / (validCount * 4) : 0; // 1.0 = every group label unique

  for (const w of warnings) console.warn("WARN " + w);

  if (errors.length > 0) {
    for (const e of errors) console.error("ERROR " + e);
    console.error(
      `\nValidation FAILED: ${errors.length} error(s), ${warnings.length} warning(s).`,
    );
    process.exit(1);
  }

  console.log(
    `\nValidated ${validCount} puzzle(s). easy=${easy}, medium=${medium}, hard=${hard}. warnings=${warnings.length}.`,
  );
  console.log(
    `Diversity: ${distinctLabels} distinct group labels, ${distinctLabelTokens} distinct label tokens, score ${diversityScore.toFixed(3)} (1.0 = every group unique).`,
  );
  console.log(
    `Editorial signals: ${labelCollisions} cross-puzzle label collision(s), ${nicheFlags} niche-character flag(s).`,
  );

  // Metadata coverage (0.4.1 addition). Non-fatal.
  const metaPct = validCount > 0 ? Math.round((withMeta / validCount) * 100) : 0;
  const themePct = validCount > 0 ? Math.round((withTheme / validCount) * 100) : 0;
  const catPct = validCount > 0 ? Math.round((withCategoryType / validCount) * 100) : 0;
  console.log(
    `Metadata coverage: ${withMeta}/${validCount} (${metaPct}%) have meta, ${withTheme} theme (${themePct}%), ${withCategoryType} categoryType (${catPct}%).`,
  );
  if (totalMediums > 0) {
    const wordplayPct = Math.round((wordplayMediums / totalMediums) * 100);
    console.log(
      `Medium mix: ${wordplayMediums}/${totalMediums} flagged wordplay (${wordplayPct}%) — target ≤ 25%.`,
    );
  }
  if (batchCounts.size > 0) {
    const batchLine = Array.from(batchCounts.entries())
      .sort()
      .map(([k, v]) => `${k}:${v}`)
      .join(" ");
    console.log(`Batches: ${batchLine}`);
  }
}

main();
