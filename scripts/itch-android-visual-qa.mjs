/**
 * itch-android-visual-qa.mjs
 *
 * Android Chrome counterpart of itch-iphone-visual-qa.mjs. Same flow, same
 * snapshots, different device profile so visual diffs between iOS Safari
 * and Android Chrome stay directly comparable.
 *
 * Output: reports/itch_android_qa/*.png + summary.json
 * Requires preview server at http://localhost:4175.
 */

import { chromium } from "playwright";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.FOLDWINK_E2E_URL ?? "http://localhost:4175/";
const POOL_DIR = path.resolve(__dirname, "../puzzles/pool");
const OUT_DIR = path.resolve(__dirname, "../reports/itch_android_qa");

async function loadEasyPuzzles() {
  const files = (await readdir(POOL_DIR)).filter((f) => f.endsWith(".json"));
  const map = new Map();
  for (const f of files) {
    const raw = await readFile(path.join(POOL_DIR, f), "utf8");
    const p = JSON.parse(raw);
    if (p.difficulty === "easy") map.set(p.title, p.groups.map((g) => g.items));
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

// Pixel 6 portrait, Android Chrome UA. Touch + mobile flags match Chrome
// mobile rendering.
const ctx = await browser.newContext({
  viewport: { width: 412, height: 915 },
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
  deviceScaleFactor: 2.625,
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

await page.locator("button", { hasText: "Easy puzzle" }).first().click();
await page.waitForSelector("header h1");
await snap("02-game-start");

const firstTitle = (await page.locator("header h1").textContent())?.trim();
const firstGroup = puzzles.get(firstTitle)[0];
for (const item of firstGroup.slice(0, 3)) {
  await page.locator(`button[aria-label="${item}"]`).first().click();
}
await snap("03-game-selecting");

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
await page.screenshot({
  path: path.join(OUT_DIR, "05-result-round1-fullpage.png"),
  fullPage: true,
});

await page.locator('[data-testid="result-next-puzzle"]').click();
await page.waitForSelector("header h1");
await snap("06-round2-game-start");
await solveCurrent(page, puzzles);
await snap("07-result-round2-streak");
await page.screenshot({
  path: path.join(OUT_DIR, "07-result-round2-streak-fullpage.png"),
  fullPage: true,
});

await page.locator('[data-testid="result-next-puzzle"]').click();
await page.waitForSelector("header h1");
await solveCurrent(page, puzzles);
await snap("08-result-round3");
await page.screenshot({
  path: path.join(OUT_DIR, "08-result-round3-fullpage.png"),
  fullPage: true,
});

await browser.close();

await writeFile(
  path.join(OUT_DIR, "summary.json"),
  JSON.stringify({ log, generatedAt: new Date().toISOString() }, null, 2),
);
console.log(`\n[itch-android-qa] ${log.length} snapshots written to ${path.relative(process.cwd(), OUT_DIR)}`);
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
