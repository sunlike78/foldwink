/**
 * itch-iphone-visual-qa.mjs
 *
 * Simulate an iPhone 14 Safari user visiting the Foldwink game wrapped in
 * an itch.io-style iframe and capture screenshots at every stage of the
 * menu → game → solve → result → next-puzzle flow.
 *
 * Purpose: verify that inside a 390x844 visual viewport, rendered *through*
 * an iframe with itch-like dimensions, the Foldwink UI background, badges,
 * and CTAs all render correctly and nothing gets visually cut. The previous
 * issue reports described missing backgrounds on the itch page, which in
 * practice comes from two separate layers:
 *   1) the itch page chrome — cover image, theme background (set on itch
 *      dashboard, not in our bundle).
 *   2) the in-iframe Foldwink app — that's what this agent verifies.
 *
 * Output: reports/itch_iphone_qa/*.png + summary.json
 * Requires preview server at http://localhost:4175.
 */

import { chromium } from "playwright";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.FOLDWINK_E2E_URL ?? "http://localhost:4175/";
const POOL_DIR = path.resolve(__dirname, "../puzzles/pool");
const OUT_DIR = path.resolve(__dirname, "../reports/itch_iphone_qa");

async function loadEasyPuzzles() {
  const files = (await readdir(POOL_DIR)).filter((f) => f.endsWith(".json"));
  const map = new Map();
  for (const f of files) {
    const raw = await readFile(path.join(POOL_DIR, f), "utf8");
    const p = JSON.parse(raw);
    if (p.difficulty === "easy")
      map.set(
        p.title,
        p.groups.map((g) => g.items),
      );
  }
  return map;
}

async function solveCurrent(page, puzzles) {
  const title = (await page.locator("header h1").textContent())?.trim();
  const groups = puzzles.get(title);
  if (!groups) throw new Error(`no solution for "${title}"`);
  for (const g of groups) {
    for (const item of g) await page.locator(`button[aria-label="${item}"]`).first().click();
    await page.locator("button", { hasText: "Submit" }).click();
    await page.waitForTimeout(140);
  }
  await page.waitForSelector('[data-testid="result-screen"]', { timeout: 6_000 });
}

async function measure(page, label) {
  const metrics = await page.evaluate(() => {
    const doc = document.scrollingElement ?? document.documentElement;
    const cta = document.querySelector('[data-testid="result-next-puzzle"]');
    const body = document.body;
    const cs = getComputedStyle(body);
    return {
      bodyBg: cs.backgroundColor,
      bodyColor: cs.color,
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
      docScrollHeight: doc.scrollHeight,
      docScrollTop: doc.scrollTop,
      ctaInViewport: cta
        ? (() => {
            const r = cta.getBoundingClientRect();
            return r.top >= 0 && r.bottom <= window.innerHeight;
          })()
        : null,
    };
  });
  return { label, ...metrics };
}

await mkdir(OUT_DIR, { recursive: true });
const puzzles = await loadEasyPuzzles();
const browser = await chromium.launch();

// iPhone 14 portrait, Safari UA. Touch + mobile emulation on so the app
// takes the mobile code paths (e.g. haptics detection).
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.addInitScript(() => {
  localStorage.setItem("foldwink:onboarded", "true");
});

const log = [];
async function snap(name) {
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: false,
  });
  log.push(await measure(page, name));
  console.log(`  [snap] ${name}`);
}

await page.goto(BASE_URL);
await page.waitForSelector("button:has-text('Easy puzzle')");
await snap("01-menu");

// Easy puzzle start
await page.locator("button", { hasText: "Easy puzzle" }).first().click();
await page.waitForSelector("header h1");
await snap("02-game-start");

// Pick 3 of 4 cards so the selection state is visible in the snapshot
const firstTitle = (await page.locator("header h1").textContent())?.trim();
const firstGroup = puzzles.get(firstTitle)[0];
for (const item of firstGroup.slice(0, 3)) {
  await page.locator(`button[aria-label="${item}"]`).first().click();
}
await snap("03-game-selecting");

// Finish solve + land on result
await page.locator(`button[aria-label="${firstGroup[3]}"]`).first().click();
await page.locator("button", { hasText: "Submit" }).click();
await page.waitForTimeout(150);
await snap("04-game-one-solved");

const remaining = puzzles.get(firstTitle).slice(1);
for (const g of remaining) {
  for (const item of g) await page.locator(`button[aria-label="${item}"]`).first().click();
  await page.locator("button", { hasText: "Submit" }).click();
  await page.waitForTimeout(150);
}
await page.waitForSelector('[data-testid="result-screen"]');
await snap("05-result-round1");

// Full-page snapshot of result (catches any overflowing content)
await page.screenshot({
  path: path.join(OUT_DIR, "05-result-round1-fullpage.png"),
  fullPage: true,
});

// Round 2 — triggers streak-celebration
await page.locator('[data-testid="result-next-puzzle"]').click();
await page.waitForSelector("header h1");
await snap("06-round2-game-start");
await solveCurrent(page, puzzles);
await snap("07-result-round2-streak");
await page.screenshot({
  path: path.join(OUT_DIR, "07-result-round2-streak-fullpage.png"),
  fullPage: true,
});

// Round 3
await page.locator('[data-testid="result-next-puzzle"]').click();
await page.waitForSelector("header h1");
await solveCurrent(page, puzzles);
await snap("08-result-round3");
await page.screenshot({
  path: path.join(OUT_DIR, "08-result-round3-fullpage.png"),
  fullPage: true,
});

// Visit Stats screen from the result screen — this is the path the reviewer
// flagged for the "Back to menu cut off at bottom" regression. The Stats
// screen is the tallest in the app (StatStrip + 4x2 StatCells + Depth 4x2
// + DailyArchive + back button).
const statsBtn = page.locator("button", { hasText: "Stats" }).last();
if (await statsBtn.count()) {
  await statsBtn.click();
  await page.waitForSelector("text=Your Foldwink record", { timeout: 5_000 });
  await snap("09-stats-top");
  await page.screenshot({
    path: path.join(OUT_DIR, "09-stats-fullpage.png"),
    fullPage: true,
  });
  // Measure: is "Back to menu" reachable without the document being cut?
  const backBtn = page.locator("button", { hasText: "Back to menu" });
  const box = await backBtn.boundingBox();
  const metrics = await page.evaluate(() => ({
    docH: document.documentElement.scrollHeight,
    vh: window.innerHeight,
  }));
  console.log(
    `  stats back-to-menu: y=${box?.y}, docH=${metrics.docH}, vh=${metrics.vh}, overflow=${metrics.docH - metrics.vh}px`,
  );
  // Scroll to the bottom to capture the worst-case iOS case
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await snap("10-stats-scrolled-bottom");
}

await browser.close();

await writeFile(
  path.join(OUT_DIR, "summary.json"),
  JSON.stringify({ log, generatedAt: new Date().toISOString() }, null, 2),
);
console.log(
  `\n[itch-iphone-qa] ${log.length} snapshots written to ${path.relative(process.cwd(), OUT_DIR)}`,
);
console.log("Key measurements:");
for (const l of log) {
  if (l.ctaInViewport !== null) {
    console.log(
      `  ${l.label}: ctaInViewport=${l.ctaInViewport}, docH=${l.docScrollHeight}, vh=${l.viewportH}, bodyBg=${l.bodyBg}`,
    );
  } else {
    console.log(`  ${l.label}: bodyBg=${l.bodyBg}, viewport=${l.viewportW}x${l.viewportH}`);
  }
}
