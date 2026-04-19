/**
 * Itch.io screenshot pack — captures marketable in-game states at
 * desktop (1440×900) and mobile (390×844) viewports. Output: itch.io/screenshots/.
 *
 * Usage:
 *   npm run build
 *   npx vite preview --port 4174 --strictPort &
 *   node scripts/capture-itch-screenshots.mjs
 */

import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "fs";
import { join } from "path";

const BASE_URL = process.env.FOLDWINK_URL ?? "http://localhost:4174/";
const OUT = join(process.cwd(), "itch.io/screenshots");
mkdirSync(OUT, { recursive: true });

const SEEDED_STATS = {
  gamesPlayed: 28,
  wins: 22,
  losses: 6,
  currentStreak: 7,
  bestStreak: 12,
  solvedPuzzleIds: [],
  mediumWins: 9,
  mediumLosses: 2,
  totalMistakes: 19,
  winkUses: 5,
  flawlessWins: 7,
  mediumLossStreak: 0,
  recentSolves: [
    { difficulty: "easy", result: "win", mistakesUsed: 0, durationMs: 90000 },
    { difficulty: "medium", result: "win", mistakesUsed: 1, durationMs: 150000 },
    { difficulty: "medium", result: "win", mistakesUsed: 0, durationMs: 120000 },
    { difficulty: "easy", result: "win", mistakesUsed: 0, durationMs: 75000 },
  ],
  hardWins: 3,
  hardLosses: 1,
  hardLossStreak: 0,
};

const SEEDED_PROGRESS = {
  cursor: 0,
  easyCursor: 0,
  mediumCursor: 0,
  hardCursor: 0,
};

const PUZZLE_0001 = JSON.parse(
  readFileSync(join(process.cwd(), "puzzles/pool/puzzle-0001.json"), "utf8"),
);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function prepare(browser, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: width < 500,
    hasTouch: width < 500,
  });
  const page = await context.newPage();
  await page.addInitScript(
    ({ stats, progress }) => {
      localStorage.setItem("foldwink:stats", JSON.stringify(stats));
      localStorage.setItem("foldwink:progress", JSON.stringify(progress));
      localStorage.setItem("foldwink:onboarded", "true");
      localStorage.removeItem("foldwink:active-session");
      localStorage.setItem("foldwink:sound", JSON.stringify({ muted: true }));
    },
    { stats: SEEDED_STATS, progress: SEEDED_PROGRESS },
  );
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(400);
  return { context, page };
}

async function shot(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function clickMenuStart(page, label) {
  const btn = page.getByRole("button", { name: label });
  await btn.first().click();
  await sleep(500);
}

async function selectCards(page, items) {
  for (const text of items) {
    const card = page.locator(`button:has-text("${text}")`).first();
    await card.click();
    await sleep(80);
  }
}

(async () => {
  console.log("=== Itch screenshot pack ===");
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Output:   ${OUT}`);
  const browser = await chromium.launch({ headless: true });

  // ---------- Desktop 1440×900 ----------
  console.log("\nDesktop 1440×900:");

  // D1 — menu with seeded stats (clean hero-candidate).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    await shot(page, "01-desktop-menu");
    await context.close();
  }

  // D2 — easy game, 3 cards selected (shows selection feedback).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    await clickMenuStart(page, /Easy puzzle/i);
    await selectCards(page, PUZZLE_0001.groups[0].items.slice(0, 3));
    await sleep(200);
    await shot(page, "02-desktop-easy-selecting");
    await context.close();
  }

  // D3 — easy game with one group solved (mid-session, strong UI state).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    await clickMenuStart(page, /Easy puzzle/i);
    await selectCards(page, PUZZLE_0001.groups[0].items);
    const submit = page.getByRole("button", { name: /Submit/i });
    await submit.click();
    await sleep(900);
    await shot(page, "03-desktop-easy-one-solved");
    await context.close();
  }

  // D4 — medium game, showing Foldwink Tabs (USP).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    await clickMenuStart(page, /Medium puzzle/i);
    await shot(page, "04-desktop-medium-tabs");
    await context.close();
  }

  // D5 — medium game with one tab Winked (USP payoff).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    await clickMenuStart(page, /Medium puzzle/i);
    // Tabs are the 4 buttons in the Foldwink Tabs row. Click the second.
    const tab = page
      .locator('button[aria-label="Wink this tab to reveal the full category"]')
      .nth(1);
    if (await tab.count()) {
      await tab.click();
      await sleep(300);
    }
    await shot(page, "05-desktop-medium-winked");
    await context.close();
  }

  // D6 — stats screen with seeded Best streak.
  {
    const { context, page } = await prepare(browser, 1440, 900);
    const statsBtn = page.getByRole("button", { name: /Stats/i });
    await statsBtn.first().click();
    await sleep(500);
    await shot(page, "06-desktop-stats");
    await context.close();
  }

  // ---------- Mobile 390×844 ----------
  console.log("\nMobile 390×844:");

  // M1 — mobile menu.
  {
    const { context, page } = await prepare(browser, 390, 844);
    await shot(page, "07-mobile-menu");
    await context.close();
  }

  // M2 — mobile easy game mid-select.
  {
    const { context, page } = await prepare(browser, 390, 844);
    await clickMenuStart(page, /Easy puzzle/i);
    await selectCards(page, PUZZLE_0001.groups[1].items.slice(0, 2));
    await sleep(200);
    await shot(page, "08-mobile-easy-selecting");
    await context.close();
  }

  // M3 — mobile medium with winked tab.
  {
    const { context, page } = await prepare(browser, 390, 844);
    await clickMenuStart(page, /Medium puzzle/i);
    const tab = page
      .locator('button[aria-label="Wink this tab to reveal the full category"]')
      .nth(0);
    if (await tab.count()) {
      await tab.click();
      await sleep(300);
    }
    await shot(page, "09-mobile-medium-winked");
    await context.close();
  }

  await browser.close();
  console.log(`\nAll screenshots saved under ${OUT}`);
})();
