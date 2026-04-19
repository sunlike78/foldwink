/**
 * Verify itch.io embed first-impression after tightening fixes.
 * Captures at typical itch embed sizes and measures document/scroll height.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:4174/";
const OUT = join(process.cwd(), "itch.io/embed-verify");
mkdirSync(OUT, { recursive: true });

const SEEDED = {
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

async function capture(browser, name, w, h, opts = {}) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 500,
    hasTouch: w < 500,
  });
  const page = await context.newPage();
  if (!opts.freshOnboarding) {
    await page.addInitScript((stats) => {
      localStorage.setItem("foldwink:stats", JSON.stringify(stats));
      localStorage.setItem("foldwink:onboarded", "true");
      localStorage.removeItem("foldwink:active-session");
      localStorage.setItem("foldwink:sound", JSON.stringify({ muted: true }));
      localStorage.setItem(
        "foldwink:progress",
        JSON.stringify({ cursor: 0, easyCursor: 0, mediumCursor: 0, hardCursor: 0 }),
      );
    }, SEEDED);
  }
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(500);

  const metrics = await page.evaluate(() => ({
    docH: document.documentElement.scrollHeight,
    clientH: document.documentElement.clientHeight,
    hasScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight,
    bodyOverflowX: window.getComputedStyle(document.body).overflowX,
  }));

  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
  console.log(
    `  ${name.padEnd(36)} ${w}×${h}  docH=${metrics.docH}  scroll=${metrics.hasScroll}`,
  );
  await context.close();
  return metrics;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  console.log("\n== Embed-size verification ==");

  // itch.io default embed ratio ~960x720 → run both
  await capture(browser, "itch-embed-960x720-menu", 960, 720);
  await capture(browser, "itch-embed-1280x720-menu", 1280, 720);

  // Common mobile embed
  await capture(browser, "mobile-iframe-390x660-menu", 390, 660);
  await capture(browser, "mobile-iframe-360x640-menu", 360, 640);

  // Desktop fullscreen baseline
  await capture(browser, "fullscreen-1440x900-menu", 1440, 900);

  // Fresh onboarding on tiny embed — check it doesn't explode
  await capture(browser, "fresh-onboarding-390x660", 390, 660, { freshOnboarding: true });

  await browser.close();
  console.log("\nDone.\n");
})();
