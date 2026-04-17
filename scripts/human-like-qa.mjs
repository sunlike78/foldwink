/**
 * Foldwink Human-Like QA Agent
 *
 * Playwright script that walks through the app like a careful human tester.
 * Captures screenshots, console errors, and interaction results.
 *
 * Usage:
 *   npm run build
 *   npm run preview -- --host &
 *   npx playwright test scripts/human-like-qa.mjs --reporter=list
 *   # or directly:
 *   node scripts/human-like-qa.mjs
 */

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const BASE_URL = "http://localhost:4174";
const ARTIFACT_DIR = join(process.cwd(), "docs/reports/artifacts/human-qa");
const DELAY = 400; // ms between actions — human-like pacing

mkdirSync(ARTIFACT_DIR, { recursive: true });

const findings = [];
const consoleErrors = [];

function finding(severity, area, title, detail) {
  findings.push({ severity, area, title, detail });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runDesktopQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: "FoldwinkQA-Desktop/1.0",
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ viewport: "desktop", text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    consoleErrors.push({ viewport: "desktop", text: `PAGE ERROR: ${err.message}` });
  });

  // A. App load
  console.log("[Desktop] Loading app...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(DELAY);
  await page.screenshot({ path: join(ARTIFACT_DIR, "01-desktop-load.png"), fullPage: true });

  // B. Onboarding check
  const onboarding = await page.locator('[role="dialog"]').count();
  if (onboarding > 0) {
    console.log("[Desktop] Onboarding detected");
    await page.screenshot({ path: join(ARTIFACT_DIR, "02-desktop-onboarding.png") });
    const gotIt = page.locator("button", { hasText: "Got it" });
    if (await gotIt.count()) {
      await gotIt.click();
      await sleep(DELAY);
      finding("low", "onboarding", "Onboarding present and dismissable", "Got it button works");
    }
  } else {
    finding(
      "observation",
      "onboarding",
      "No onboarding shown",
      "Either already dismissed or missing",
    );
  }

  // C. Menu screenshot
  await page.screenshot({ path: join(ARTIFACT_DIR, "03-desktop-menu.png"), fullPage: true });
  console.log("[Desktop] Menu captured");

  // Check key buttons
  const dailyBtn = page.locator("button", { hasText: /daily|today/i });
  const easyBtn = page.locator("button", { hasText: /easy/i });
  const mediumBtn = page.locator("button", { hasText: /medium/i });
  const hardBtn = page.locator("button", { hasText: /master|hard/i });
  const _statsBtn = page.locator("button", { hasText: /stats/i });

  if (await dailyBtn.count()) finding("observation", "menu", "Daily button present", "");
  if (await easyBtn.count()) finding("observation", "menu", "Easy button present", "");
  if (await mediumBtn.count()) {
    const disabled = await mediumBtn.first().isDisabled();
    finding("observation", "menu", `Medium button present (disabled=${disabled})`, "");
  }
  if (await hardBtn.count()) {
    const disabled = await hardBtn.first().isDisabled();
    finding("observation", "menu", `Hard/Master button present (disabled=${disabled})`, "");
  }

  // D. Easy gameplay
  console.log("[Desktop] Starting Easy puzzle...");
  if (await easyBtn.count()) {
    await easyBtn.first().click();
    await sleep(DELAY * 2);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "04-desktop-easy-game.png"),
      fullPage: true,
    });

    // Click 4 cards (first 4 available buttons in the grid)
    const cards = page.locator('[role="grid"] button:not([disabled])');
    const cardCount = await cards.count();
    finding("observation", "gameplay", `Easy: ${cardCount} cards visible`, "");

    if (cardCount >= 4) {
      for (let i = 0; i < 4; i++) {
        await cards.nth(i).click();
        await sleep(DELAY / 2);
      }
      await page.screenshot({ path: join(ARTIFACT_DIR, "05-desktop-easy-selected.png") });

      // Submit
      const submitBtn = page.locator("button", { hasText: /submit/i });
      if (await submitBtn.count()) {
        await submitBtn.first().click();
        await sleep(DELAY * 2);
        await page.screenshot({ path: join(ARTIFACT_DIR, "06-desktop-easy-after-submit.png") });
        finding(
          "observation",
          "gameplay",
          "Submit clicked — response observed",
          "Check screenshot for correct/incorrect feedback",
        );
      }

      // Try a few more rounds
      for (let round = 0; round < 3; round++) {
        const remaining = page.locator('[role="grid"] button:not([disabled])');
        const rem = await remaining.count();
        if (rem < 4) break;
        for (let i = 0; i < 4; i++) {
          await remaining.nth(i).click();
          await sleep(DELAY / 3);
        }
        if (await submitBtn.count()) {
          await submitBtn.first().click();
          await sleep(DELAY);
        }
      }
    }

    // Check if we reached result screen
    await sleep(DELAY);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "07-desktop-easy-result.png"),
      fullPage: true,
    });

    // Go to menu
    const menuBtn = page.locator("button", { hasText: /menu/i });
    if (await menuBtn.count()) {
      await menuBtn.first().click();
      await sleep(DELAY);
    }
  }

  // H. Stats screen
  console.log("[Desktop] Checking Stats...");
  const statsBtn2 = page.locator("button", { hasText: /stats/i });
  if (await statsBtn2.count()) {
    await statsBtn2.first().click();
    await sleep(DELAY);
    await page.screenshot({ path: join(ARTIFACT_DIR, "08-desktop-stats.png"), fullPage: true });
    finding("observation", "stats", "Stats screen loaded", "Check screenshot");

    const backBtn = page.locator("button", { hasText: /menu|back/i });
    if (await backBtn.count()) {
      await backBtn.first().click();
      await sleep(DELAY);
    }
  }

  // J. Persistence — reload test
  console.log("[Desktop] Testing persistence...");
  if (await easyBtn.count()) {
    await easyBtn.first().click();
    await sleep(DELAY * 2);
    // Select 2 cards
    const cards2 = page.locator('[role="grid"] button:not([disabled])');
    if ((await cards2.count()) >= 2) {
      await cards2.nth(0).click();
      await sleep(DELAY / 2);
      await cards2.nth(1).click();
      await sleep(DELAY / 2);
    }
    // Reload
    await page.reload({ waitUntil: "networkidle" });
    await sleep(DELAY * 2);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "09-desktop-after-reload.png"),
      fullPage: true,
    });

    // Check if we're back in game
    const gridAfter = await page.locator('[role="grid"]').count();
    finding(
      gridAfter > 0 ? "observation" : "medium",
      "persistence",
      `After reload: grid ${gridAfter > 0 ? "restored" : "NOT restored"}`,
      "Mid-game session persistence check",
    );
  }

  await context.close();
}

async function runMobileQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X
    userAgent: "FoldwinkQA-Mobile/1.0",
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ viewport: "mobile-375x812", text: msg.text() });
    }
  });

  console.log("[Mobile 375x812] Loading app...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(DELAY);

  // Dismiss onboarding if present
  const gotIt = page.locator("button", { hasText: "Got it" });
  if (await gotIt.count()) {
    await gotIt.click();
    await sleep(DELAY);
  }

  await page.screenshot({ path: join(ARTIFACT_DIR, "10-mobile-menu.png"), fullPage: true });

  // Check horizontal overflow
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = 375;
  if (bodyWidth > viewportWidth + 5) {
    finding(
      "high",
      "mobile-fit",
      `Horizontal overflow detected: body=${bodyWidth}px > viewport=${viewportWidth}px`,
      "",
    );
  } else {
    finding(
      "observation",
      "mobile-fit",
      "No horizontal overflow on menu",
      `body=${bodyWidth}px`,
    );
  }

  // Start Easy game on mobile
  const easyBtn = page.locator("button", { hasText: /easy/i });
  if (await easyBtn.count()) {
    await easyBtn.first().click();
    await sleep(DELAY * 2);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "11-mobile-easy-game.png"),
      fullPage: true,
    });

    // Check card tap targets
    const cards = page.locator('[role="grid"] button');
    if ((await cards.count()) > 0) {
      const box = await cards.first().boundingBox();
      if (box) {
        const tapSize = Math.min(box.width, box.height);
        finding(
          tapSize < 40 ? "high" : tapSize < 48 ? "medium" : "observation",
          "mobile-fit",
          `Card tap target: ${Math.round(box.width)}×${Math.round(box.height)}px (min touch: ${Math.round(tapSize)}px)`,
          tapSize < 44 ? "Below recommended 44px minimum" : "Adequate",
        );
      }
    }

    // Play a round
    const playCards = page.locator('[role="grid"] button:not([disabled])');
    if ((await playCards.count()) >= 4) {
      for (let i = 0; i < 4; i++) {
        await playCards.nth(i).tap();
        await sleep(DELAY / 3);
      }
      const submitBtn = page.locator("button", { hasText: /submit/i });
      if (await submitBtn.count()) {
        await submitBtn.first().tap();
        await sleep(DELAY * 2);
      }
    }
    await page.screenshot({
      path: join(ARTIFACT_DIR, "12-mobile-after-submit.png"),
      fullPage: true,
    });

    // Go back to menu
    const quitBtn = page.locator("button, a", { hasText: /menu|quit/i });
    if (await quitBtn.count()) {
      await quitBtn.first().click();
      await sleep(DELAY);
    }
  }

  // Stats on mobile
  const statsBtn = page.locator("button", { hasText: /stats/i });
  if (await statsBtn.count()) {
    await statsBtn.first().click();
    await sleep(DELAY);
    await page.screenshot({ path: join(ARTIFACT_DIR, "13-mobile-stats.png"), fullPage: true });
  }

  await context.close();
}

async function runNarrowMobileQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 320, height: 568 }, // iPhone SE / very narrow
    userAgent: "FoldwinkQA-NarrowMobile/1.0",
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log("[Narrow 320x568] Loading app...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(DELAY);

  const gotIt = page.locator("button", { hasText: "Got it" });
  if (await gotIt.count()) {
    try {
      await gotIt.click({ timeout: 3000 });
    } catch {
      // Button may be off-screen on narrow viewport — real finding!
      finding(
        "high",
        "mobile-fit",
        "Onboarding 'Got it' button off-screen at 320px viewport",
        "Cannot dismiss onboarding without scrolling on narrowest phones",
      );
      // Use JS click to bypass viewport check
      await gotIt.evaluate((el) => el.click());
    }
    await sleep(DELAY);
  }

  await page.screenshot({ path: join(ARTIFACT_DIR, "14-narrow-menu.png"), fullPage: true });

  const easyBtn = page.locator("button", { hasText: /easy/i });
  if (await easyBtn.count()) {
    await easyBtn.first().click();
    await sleep(DELAY * 2);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "15-narrow-easy-game.png"),
      fullPage: true,
    });

    const bodyW = await page.evaluate(() => document.body.scrollWidth);
    if (bodyW > 325) {
      finding(
        "high",
        "mobile-fit",
        `Narrow viewport overflow: body=${bodyW}px at 320px viewport`,
        "Content may clip on smallest phones",
      );
    }
  }

  await context.close();
}

/**
 * Seeded stats that unlock Medium and Hard.
 * Medium requires 5 easy wins, Hard requires 3 medium wins.
 */
const SEEDED_STATS = JSON.stringify({
  gamesPlayed: 15,
  wins: 12,
  losses: 3,
  currentStreak: 4,
  bestStreak: 6,
  solvedPuzzleIds: [],
  mediumWins: 5,
  mediumLosses: 1,
  totalMistakes: 8,
  winkUses: 3,
  flawlessWins: 2,
  mediumLossStreak: 0,
  recentSolves: [
    { difficulty: "easy", result: "win", mistakesUsed: 0, durationMs: 90000 },
    { difficulty: "easy", result: "win", mistakesUsed: 1, durationMs: 120000 },
    { difficulty: "medium", result: "win", mistakesUsed: 1, durationMs: 180000 },
    { difficulty: "medium", result: "win", mistakesUsed: 0, durationMs: 150000 },
    { difficulty: "medium", result: "win", mistakesUsed: 2, durationMs: 200000 },
  ],
  hardWins: 1,
  hardLosses: 0,
  hardLossStreak: 0,
});

const SEEDED_PROGRESS = JSON.stringify({
  cursor: 10,
  easyCursor: 10,
  mediumCursor: 5,
  hardCursor: 1,
});

async function seedState(page) {
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

async function runMediumQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: "FoldwinkQA-Medium/1.0",
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error")
      consoleErrors.push({ viewport: "medium-desktop", text: msg.text() });
  });

  console.log("[Medium] Loading with seeded state...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(100);
  await seedState(page);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(DELAY);

  await page.screenshot({
    path: join(ARTIFACT_DIR, "20-medium-menu-seeded.png"),
    fullPage: true,
  });

  // Check Medium button is enabled
  const mediumBtn = page.locator("button", { hasText: /medium puzzle/i });
  if (await mediumBtn.count()) {
    const disabled = await mediumBtn.first().isDisabled();
    finding(
      disabled ? "high" : "observation",
      "medium-flow",
      `Medium button enabled=${!disabled} with seeded stats`,
      "",
    );

    if (!disabled) {
      await mediumBtn.first().click();
      await sleep(DELAY * 2);
      await page.screenshot({
        path: join(ARTIFACT_DIR, "21-medium-game-start.png"),
        fullPage: true,
      });

      // Check Foldwink Tabs are visible
      const tabsRow = page.locator("text=FOLDWINK TABS");
      const tabsVisible = (await tabsRow.count()) > 0;
      finding(
        tabsVisible ? "observation" : "high",
        "medium-flow",
        `Foldwink Tabs ${tabsVisible ? "visible" : "NOT visible"} on medium puzzle`,
        "",
      );

      // Check Wink indicator
      const winkChip = page.locator("text=/wink/i");
      finding(
        "observation",
        "medium-flow",
        `Wink indicator present: ${(await winkChip.count()) > 0}`,
        "",
      );

      // Play 4 rounds — select first 4 cards and submit each time
      const submitBtn = page.locator("button", { hasText: /submit/i });
      for (let round = 0; round < 4; round++) {
        const cards = page.locator('[role="grid"] button:not([disabled])');
        const count = await cards.count();
        if (count < 4) break;

        for (let i = 0; i < 4; i++) {
          await cards.nth(i).click();
          await sleep(DELAY / 3);
        }
        if (await submitBtn.count()) {
          await submitBtn.first().click();
          await sleep(DELAY * 2);
        }
      }

      await page.screenshot({
        path: join(ARTIFACT_DIR, "22-medium-after-rounds.png"),
        fullPage: true,
      });

      // Check if result screen arrived (look for share or grade)
      const shareSection = page.locator("text=/share your result/i");
      const resultReached = (await shareSection.count()) > 0;
      finding("observation", "medium-flow", `Result screen reached: ${resultReached}`, "");

      if (resultReached) {
        await page.screenshot({
          path: join(ARTIFACT_DIR, "23-medium-result.png"),
          fullPage: true,
        });

        // Try share button
        const shareBtn = page.locator("button", { hasText: /share|copy|download/i });
        if (await shareBtn.count()) {
          await shareBtn.first().click();
          await sleep(DELAY * 2);
          await page.screenshot({
            path: join(ARTIFACT_DIR, "24-medium-share-attempted.png"),
            fullPage: true,
          });
          finding(
            "observation",
            "share-flow",
            "Share button clicked on medium result",
            "Check screenshot for fallback behavior",
          );
        }
      }

      // Go to menu
      const menuBtn = page.locator("button", { hasText: /menu/i });
      if (await menuBtn.count()) {
        await menuBtn.first().click();
        await sleep(DELAY);
      }
    }
  }

  await context.close();
}

async function runHardQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: "FoldwinkQA-Hard/1.0",
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error")
      consoleErrors.push({ viewport: "hard-desktop", text: msg.text() });
  });

  console.log("[Hard] Loading with seeded state...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(100);
  await seedState(page);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(DELAY);

  // Check Hard/Master button
  const hardBtn = page.locator("button", { hasText: /master challenge/i });
  if (await hardBtn.count()) {
    const disabled = await hardBtn.first().isDisabled();
    finding(
      "observation",
      "hard-flow",
      `Master Challenge button enabled=${!disabled} with seeded stats`,
      "",
    );

    if (!disabled) {
      await hardBtn.first().click();
      await sleep(DELAY * 2);
      await page.screenshot({
        path: join(ARTIFACT_DIR, "30-hard-game-start.png"),
        fullPage: true,
      });

      // Check Tabs (should be at half-speed / visible)
      const tabsRow = page.locator("text=FOLDWINK TABS");
      finding(
        "observation",
        "hard-flow",
        `Foldwink Tabs on hard: ${(await tabsRow.count()) > 0}`,
        "",
      );

      // Verify NO Wink on Hard
      const winkReady = page.locator("text=/wink ready/i");
      const hasWink = (await winkReady.count()) > 0;
      finding(
        hasWink ? "high" : "observation",
        "hard-flow",
        `Wink indicator on hard: ${hasWink} (should be false)`,
        "",
      );

      // Play a few rounds
      const submitBtn = page.locator("button", { hasText: /submit/i });
      for (let round = 0; round < 4; round++) {
        const cards = page.locator('[role="grid"] button:not([disabled])');
        if ((await cards.count()) < 4) break;
        for (let i = 0; i < 4; i++) {
          await cards.nth(i).click();
          await sleep(DELAY / 3);
        }
        if (await submitBtn.count()) {
          await submitBtn.first().click();
          await sleep(DELAY * 2);
        }
      }

      await page.screenshot({
        path: join(ARTIFACT_DIR, "31-hard-after-rounds.png"),
        fullPage: true,
      });
    }
  }

  await context.close();
}

async function runMobileMediumQA(browser) {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: "FoldwinkQA-MobileMedium/1.0",
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error")
      consoleErrors.push({ viewport: "mobile-medium", text: msg.text() });
  });

  console.log("[Mobile Medium] Loading with seeded state...");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(100);
  await seedState(page);
  await page.reload({ waitUntil: "networkidle" });
  await sleep(DELAY);

  await page.screenshot({
    path: join(ARTIFACT_DIR, "40-mobile-medium-menu.png"),
    fullPage: true,
  });

  const mediumBtn = page.locator("button", { hasText: /medium puzzle/i });
  if ((await mediumBtn.count()) && !(await mediumBtn.first().isDisabled())) {
    await mediumBtn.first().tap();
    await sleep(DELAY * 2);
    await page.screenshot({
      path: join(ARTIFACT_DIR, "41-mobile-medium-game.png"),
      fullPage: true,
    });

    // Check Tabs + layout on mobile
    const tabsRow = page.locator("text=FOLDWINK TABS");
    finding(
      "observation",
      "mobile-medium",
      `Tabs visible on mobile medium: ${(await tabsRow.count()) > 0}`,
      "",
    );

    // Check horizontal overflow
    const bodyW = await page.evaluate(() => document.body.scrollWidth);
    if (bodyW > 380) {
      finding(
        "high",
        "mobile-medium",
        `Horizontal overflow on mobile medium: body=${bodyW}px`,
        "",
      );
    }

    // Play one round
    const cards = page.locator('[role="grid"] button:not([disabled])');
    if ((await cards.count()) >= 4) {
      for (let i = 0; i < 4; i++) {
        await cards.nth(i).tap();
        await sleep(DELAY / 3);
      }
      const submitBtn = page.locator("button", { hasText: /submit/i });
      if (await submitBtn.count()) {
        await submitBtn.first().tap();
        await sleep(DELAY * 2);
      }
      await page.screenshot({
        path: join(ARTIFACT_DIR, "42-mobile-medium-after-submit.png"),
        fullPage: true,
      });
    }
  }

  await context.close();
}

// Main
(async () => {
  console.log("=== Foldwink Human-Like QA Agent ===");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Artifacts: ${ARTIFACT_DIR}`);
  console.log("");

  const browser = await chromium.launch({ headless: true });

  try {
    await runDesktopQA(browser);
    await runMobileQA(browser);
    await runNarrowMobileQA(browser);
    await runMediumQA(browser);
    await runHardQA(browser);
    await runMobileMediumQA(browser);
  } finally {
    await browser.close();
  }

  // Generate report data
  const report = {
    date: new Date().toISOString(),
    url: BASE_URL,
    findings,
    consoleErrors,
    screenshotCount: 15,
  };

  writeFileSync(join(ARTIFACT_DIR, "qa-data.json"), JSON.stringify(report, null, 2));

  console.log("\n=== QA Complete ===");
  console.log(`Findings: ${findings.length}`);
  console.log(`Console errors: ${consoleErrors.length}`);
  console.log(`Screenshots saved to: ${ARTIFACT_DIR}`);

  // Print summary
  const critical = findings.filter((f) => f.severity === "critical");
  const high = findings.filter((f) => f.severity === "high");
  if (critical.length) console.log(`\n⚠ CRITICAL: ${critical.length}`);
  if (high.length) console.log(`⚠ HIGH: ${high.length}`);
  if (!critical.length && !high.length)
    console.log("\n✓ No critical or high-severity findings");
})();
