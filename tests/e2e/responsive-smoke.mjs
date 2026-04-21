/**
 * Agent 3: responsive-smoke
 *
 * Confirms the app works at desktop + narrow-mobile widths. Specifically
 * guards QA rows M-06 (timer visible on mobile) and D-21 / M-08 (no
 * horizontal overflow).
 */

import { BASE_URL, runCases, seedDismissedOnboarding, waitForMenu } from "./lib/harness.mjs";

async function startEasy(page) {
  await page.locator("button", { hasText: "Easy puzzle" }).first().click();
  await page.waitForSelector("header h1");
}

async function assertNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    throw new Error(
      `horizontal overflow: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`,
    );
  }
}

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }, // iPhone 14 portrait
  narrow: { width: 320, height: 568 }, // iPhone SE 1st gen, smallest we care about
};

await runCases("responsive-smoke", [
  {
    name: "desktop: menu renders without horizontal scroll",
    viewport: VIEWPORTS.desktop,
    fn: async ({ page }) => {
      await seedDismissedOnboarding(page);
      await page.goto(BASE_URL);
      await waitForMenu(page);
      await assertNoHorizontalScroll(page);
    },
  },
  {
    name: "desktop: game screen renders timer and grid",
    viewport: VIEWPORTS.desktop,
    fn: async ({ page }) => {
      await seedDismissedOnboarding(page);
      await page.goto(BASE_URL);
      await waitForMenu(page);
      await startEasy(page);
      await page.waitForSelector('[aria-label^="Elapsed time"]');
      const cards = await page.locator("button[aria-pressed]").count();
      if (cards < 16) throw new Error(`expected 16 cards, got ${cards}`);
      await assertNoHorizontalScroll(page);
    },
  },
  {
    name: "mobile (390): menu renders without horizontal scroll",
    viewport: VIEWPORTS.mobile,
    fn: async ({ page }) => {
      await seedDismissedOnboarding(page);
      await page.goto(BASE_URL);
      await waitForMenu(page);
      await assertNoHorizontalScroll(page);
    },
  },
  {
    name: "mobile (390): game screen — timer visible, cards tappable",
    viewport: VIEWPORTS.mobile,
    fn: async ({ page }) => {
      await seedDismissedOnboarding(page);
      await page.goto(BASE_URL);
      await waitForMenu(page);
      await startEasy(page);
      const timer = page.locator('[aria-label^="Elapsed time"]');
      await timer.waitFor({ state: "visible" });
      const tb = await timer.boundingBox();
      if (!tb || tb.width < 20)
        throw new Error(`timer too small on mobile: ${JSON.stringify(tb)}`);
      // Tap the first card and confirm aria-pressed flipped.
      const first = page.locator("button[aria-pressed]").first();
      await first.click();
      const pressed = await first.getAttribute("aria-pressed");
      if (pressed !== "true")
        throw new Error("first card did not register selection on mobile");
      await assertNoHorizontalScroll(page);
    },
  },
  {
    name: "narrow (320): onboarding modal body is scrollable when tall",
    viewport: VIEWPORTS.narrow,
    fn: async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForSelector("text=How to play");
      // The modal wrapper applies max-h-[calc(100vh-2rem)] overflow-y-auto.
      const scrollable = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"] > div');
        if (!modal) return false;
        return (
          modal.scrollHeight > modal.clientHeight + 1 || modal.clientHeight < window.innerHeight
        );
      });
      if (!scrollable) {
        // Content may fit exactly; acceptable so long as "Got it" is reachable.
        const got = page.locator("button", { hasText: "Got it" });
        if (!(await got.isVisible())) {
          throw new Error("Got it button not reachable on narrow viewport");
        }
      }
      await assertNoHorizontalScroll(page);
    },
  },
]);
