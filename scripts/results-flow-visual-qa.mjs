/**
 * results-flow-visual-qa.mjs
 *
 * Multi-round visual agent for the Result / Next puzzle flow.
 *
 * Purpose: produce evidence that on three device profiles
 *   - Desktop HTML (Chromium 1280x800)
 *   - Apple simulation (iPhone 14 390x844, iOS Safari UA)
 *   - Android simulation (Pixel 6 412x915, Android Chrome UA)
 *
 * the "Next puzzle" CTA remains in-viewport (or at most a short scroll
 * away) after the 1st, 2nd, and 3rd consecutive easy solves, and that
 * the document never enters a "frozen scroll" state.
 *
 * Saves screenshots and a JSON summary to
 *   reports/results_flow_qa/
 *
 * Usage: `node scripts/results-flow-visual-qa.mjs`
 * Requires a running preview server at http://localhost:4175.
 */

import { chromium } from "playwright";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.FOLDWINK_E2E_URL ?? "http://localhost:4175/";
const POOL_DIR = path.resolve(__dirname, "../puzzles/pool");
const OUT_DIR = path.resolve(__dirname, "../reports/results_flow_qa");

async function loadEasyPuzzles() {
  const files = (await readdir(POOL_DIR)).filter((f) => f.endsWith(".json"));
  const map = new Map();
  for (const f of files) {
    const raw = await readFile(path.join(POOL_DIR, f), "utf8");
    const p = JSON.parse(raw);
    if (p.difficulty === "easy") {
      map.set(
        p.title,
        p.groups.map((g) => g.items),
      );
    }
  }
  return map;
}

async function solveCurrent(page, puzzles) {
  const title = (await page.locator("header h1").textContent())?.trim();
  const groups = puzzles.get(title);
  if (!groups) throw new Error(`no solution for "${title}"`);
  for (const g of groups) {
    for (const item of g) {
      await page.locator(`button[aria-label="${item}"]`).first().click();
    }
    await page.locator("button", { hasText: "Submit" }).click();
    await page.waitForTimeout(140);
  }
  await page.waitForSelector('[data-testid="result-screen"]', { timeout: 6_000 });
}

async function measureCta(page) {
  const btn = page.locator('[data-testid="result-next-puzzle"]');
  const ok = await btn.count();
  if (ok === 0) return { exists: false };
  const vh = await page.evaluate(() => window.innerHeight);
  const box = await btn.boundingBox();
  const doc = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    scrollTop: (document.scrollingElement ?? document.documentElement).scrollTop,
    clientHeight: document.documentElement.clientHeight,
  }));
  return {
    exists: true,
    inViewport: box ? box.y >= 0 && box.y + box.height <= vh : false,
    y: box?.y ?? null,
    height: box?.height ?? null,
    viewportHeight: vh,
    doc,
  };
}

const PROFILES = {
  desktop: {
    label: "desktop",
    viewport: { width: 1280, height: 800 },
    userAgent: null,
    isMobile: false,
    hasTouch: false,
  },
  ios: {
    label: "ios",
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  },
  android: {
    label: "android",
    viewport: { width: 412, height: 915 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2.625,
  },
};

async function runProfile(browser, profile, puzzles) {
  const ctxOpts = { viewport: profile.viewport };
  if (profile.userAgent) ctxOpts.userAgent = profile.userAgent;
  if (profile.isMobile) ctxOpts.isMobile = profile.isMobile;
  if (profile.hasTouch) ctxOpts.hasTouch = profile.hasTouch;
  if (profile.deviceScaleFactor) ctxOpts.deviceScaleFactor = profile.deviceScaleFactor;
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("foldwink:onboarded", "true");
  });

  const measurements = [];
  await page.goto(BASE_URL);
  await page.waitForSelector("button:has-text('Easy puzzle')");
  await page.screenshot({ path: path.join(OUT_DIR, `${profile.label}-00-menu.png`) });
  await page.locator("button", { hasText: "Easy puzzle" }).first().click();
  await page.waitForSelector("header h1");

  for (let round = 1; round <= 3; round++) {
    await solveCurrent(page, puzzles);
    const m = await measureCta(page);
    m.round = round;
    m.profile = profile.label;
    measurements.push(m);
    await page.screenshot({
      path: path.join(OUT_DIR, `${profile.label}-${String(round).padStart(2, "0")}-result.png`),
      fullPage: true,
    });
    if (round < 3) {
      await page.locator('[data-testid="result-next-puzzle"]').click();
      await page.waitForSelector("header h1");
    }
  }

  await ctx.close();
  return measurements;
}

await mkdir(OUT_DIR, { recursive: true });
const puzzles = await loadEasyPuzzles();
const browser = await chromium.launch();
const all = [];
for (const p of Object.values(PROFILES)) {
  console.log(`[visual] ▶ ${p.label}`);
  try {
    const res = await runProfile(browser, p, puzzles);
    all.push(...res);
    for (const r of res) {
      console.log(
        `  round ${r.round}: inViewport=${r.inViewport}, y=${r.y}, doc.scrollHeight=${r.doc.scrollHeight}, vh=${r.viewportHeight}`,
      );
    }
  } catch (err) {
    console.error(`[visual] ${p.label} FAIL: ${err.message}`);
    all.push({ profile: p.label, error: err.message });
  }
}
await browser.close();

await writeFile(
  path.join(OUT_DIR, "summary.json"),
  JSON.stringify({ measurements: all, generatedAt: new Date().toISOString() }, null, 2),
);
console.log(`[visual] summary written to ${path.relative(process.cwd(), OUT_DIR)}`);
