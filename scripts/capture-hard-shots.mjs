import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:4174/";
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
  recentSolves: [],
  hardWins: 3,
  hardLosses: 1,
  hardLossStreak: 0,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function prepare(browser, width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: width < 500,
    hasTouch: width < 500,
  });
  const page = await context.newPage();
  await page.addInitScript((stats) => {
    localStorage.setItem("foldwink:stats", JSON.stringify(stats));
    localStorage.setItem(
      "foldwink:progress",
      JSON.stringify({ cursor: 0, easyCursor: 0, mediumCursor: 0, hardCursor: 0 }),
    );
    localStorage.setItem("foldwink:onboarded", "true");
    localStorage.removeItem("foldwink:active-session");
    localStorage.setItem("foldwink:sound", JSON.stringify({ muted: true }));
  }, SEEDED_STATS);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(400);
  return { context, page };
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // D7 — desktop hard gameplay (Master Challenge unlocked).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    const btn = page.getByRole("button", { name: /^Master Challenge$/ });
    await btn.first().click();
    await sleep(700);
    await shot(page, "10-desktop-hard-game");
    await context.close();
  }

  // D8 — desktop hard with 2 cards selected (shows selection on hard).
  {
    const { context, page } = await prepare(browser, 1440, 900);
    const btn = page.getByRole("button", { name: /^Master Challenge$/ });
    await btn.first().click();
    await sleep(700);
    const cards = page.locator('button[class*="aspect"]');
    const n = await cards.count();
    if (n >= 4) {
      await cards.nth(0).click();
      await sleep(80);
      await cards.nth(5).click();
      await sleep(80);
    }
    await shot(page, "11-desktop-hard-selecting");
    await context.close();
  }

  // M4 — mobile hard gameplay.
  {
    const { context, page } = await prepare(browser, 390, 844);
    const btn = page.getByRole("button", { name: /^Master Challenge$/ });
    await btn.first().click();
    await sleep(700);
    await shot(page, "12-mobile-hard-game");
    await context.close();
  }

  await browser.close();
})();
