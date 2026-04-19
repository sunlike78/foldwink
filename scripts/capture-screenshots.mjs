/**
 * Foldwink Screenshot Capture for Store Assets
 *
 * Generates store-ready screenshots at multiple viewpoints.
 *
 * Usage:
 *   npm run build
 *   npx vite preview --port 4174 &
 *   node scripts/capture-screenshots.mjs
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:4174";
const OUT = join(process.cwd(), "docs/reports/artifacts/store-screenshots");

mkdirSync(OUT, { recursive: true });

const SEEDED_STATS = JSON.stringify({
  gamesPlayed: 25,
  wins: 20,
  losses: 5,
  currentStreak: 7,
  bestStreak: 12,
  solvedPuzzleIds: [],
  mediumWins: 8,
  mediumLosses: 2,
  totalMistakes: 18,
  winkUses: 5,
  flawlessWins: 6,
  mediumLossStreak: 0,
  recentSolves: [
    { difficulty: "easy", result: "win", mistakesUsed: 0, durationMs: 90000 },
    { difficulty: "medium", result: "win", mistakesUsed: 1, durationMs: 150000 },
    { difficulty: "medium", result: "win", mistakesUsed: 0, durationMs: 120000 },
  ],
  hardWins: 2,
  hardLosses: 0,
  hardLossStreak: 0,
});

const SEEDED_PROGRESS = JSON.stringify({
  cursor: 15,
  easyCursor: 15,
  mediumCursor: 8,
  hardCursor: 2,
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function seed(page) {
  await page.evaluate(
    ([stats, progress]) => {
      localStorage.setItem("foldwink:stats", stats);
      localStorage.setItem("foldwink:progress", progress);
      localStorage.setItem("foldwink:onboarded", "1");
      localStorage.removeItem("foldwink:active-session");
    },
    [SEEDED_STATS, SEEDED_PROGRESS],
  );
}

async function capture(browser, name, width, height, action) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 500,
    hasTouch: width < 500,
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(200);
  await seed(page);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(500);

  if (action) await action(page);

  await page.screenshot({
    path: join(OUT, `${name}.png`),
    fullPage: false,
  });
  console.log(`  ✓ ${name} (${width}×${height})`);
  await context.close();
}

(async () => {
  console.log("=== Foldwink Store Screenshot Capture ===\n");
  const browser = await chromium.launch({ headless: true });

  // Desktop screenshots
  console.log("Desktop 1280×800:");
  await capture(browser, "desktop-menu", 1280, 800);

  await capture(browser, "desktop-easy-game", 1280, 800, async (page) => {
    const btn = page.locator("button", { hasText: /easy puzzle/i });
    if (await btn.count()) {
      await btn.first().click();
      await sleep(800);
    }
  });

  await capture(browser, "desktop-medium-game", 1280, 800, async (page) => {
    const btn = page.locator("button", { hasText: /medium puzzle/i });
    if (await btn.count()) {
      await btn.first().click();
      await sleep(800);
    }
  });

  await capture(browser, "desktop-hard-game", 1280, 800, async (page) => {
    const btn = page.locator("button", { hasText: /master challenge$/i });
    if ((await btn.count()) && !(await btn.first().isDisabled())) {
      await btn.first().click();
      await sleep(800);
    }
  });

  await capture(browser, "desktop-stats", 1280, 800, async (page) => {
    const btn = page.locator("button", { hasText: /stats/i });
    if (await btn.count()) {
      await btn.first().click();
      await sleep(500);
    }
  });

  // Mobile screenshots
  console.log("\nMobile 375×812:");
  await capture(browser, "mobile-menu", 375, 812);

  await capture(browser, "mobile-easy-game", 375, 812, async (page) => {
    const btn = page.locator("button", { hasText: /easy puzzle/i });
    if (await btn.count()) {
      await btn.first().click();
      await sleep(800);
    }
  });

  await capture(browser, "mobile-medium-game", 375, 812, async (page) => {
    const btn = page.locator("button", { hasText: /medium puzzle/i });
    if (await btn.count()) {
      await btn.first().click();
      await sleep(800);
    }
  });

  await browser.close();
  console.log(`\nDone. Screenshots in: ${OUT}`);
})();
