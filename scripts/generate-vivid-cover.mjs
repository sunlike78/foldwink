/**
 * generate-vivid-cover.mjs
 *
 * Renders a high-contrast 630x500 Foldwink cover for the itch.io page.
 *
 * The previous cover was mostly dark — on mobile itch crops it behind the
 * "Run game" launcher and the whole area collapsed into a flat black
 * rectangle. The new cover leads with the four solved-group colors
 * (the visual fingerprint of the game) and keeps the wordmark as the
 * dominant element so it reads even scaled down in search tiles.
 *
 * Output: itch.io/mockups/mockup-itch-cover-630x500-vivid.png
 */

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
  __dirname,
  "../itch.io/mockups/mockup-itch-cover-630x500-vivid.png",
);

const HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root {
        color-scheme: dark;
      }
      html, body {
        margin: 0;
        padding: 0;
        width: 630px;
        height: 500px;
        background: #0f1115;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #e8eaf0;
        overflow: hidden;
      }
      .cover {
        position: relative;
        width: 630px;
        height: 500px;
        background:
          radial-gradient(ellipse at 20% 10%, rgba(124,196,255,0.10), transparent 55%),
          radial-gradient(ellipse at 80% 90%, rgba(214,155,85,0.08), transparent 55%),
          linear-gradient(180deg, #10141c 0%, #0b0d12 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 22px;
      }
      .wordmark {
        font-size: 86px;
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1;
        background: linear-gradient(180deg, #ffffff 0%, #cfd7e2 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 2px 0 rgba(0,0,0,0.3);
      }
      .tagline {
        font-size: 20px;
        color: #b5bcc9;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .bars {
        display: grid;
        grid-template-columns: repeat(4, 120px);
        gap: 14px;
        margin-top: 12px;
      }
      .bar {
        height: 54px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 14px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(15,17,21,0.82);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
      }
      .bar.amber  { background: linear-gradient(180deg, #e3bf6b, #c9a456); }
      .bar.green  { background: linear-gradient(180deg, #8bc490, #6faa73); }
      .bar.coral  { background: linear-gradient(180deg, #d9857f, #bc6962); }
      .bar.purple { background: linear-gradient(180deg, #b093d1, #9478b3); }
      .credit {
        position: absolute;
        bottom: 24px;
        right: 26px;
        font-size: 12px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #6c7381;
      }
      .credit strong {
        color: #7cc4ff;
        font-weight: 700;
      }
      .badge {
        position: absolute;
        top: 24px;
        left: 26px;
        font-size: 11px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #7cc4ff;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <div class="cover">
      <div class="badge">✦ Daily grouping puzzle</div>
      <div class="wordmark">Foldwink</div>
      <div class="tagline">4 groups · 4 cards · 4 mistakes</div>
      <div class="bars">
        <div class="bar amber">Planets</div>
        <div class="bar green">Colors</div>
        <div class="bar coral">Pets</div>
        <div class="bar purple">Sports</div>
      </div>
      <div class="credit">by <strong>Neural Void</strong></div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 630, height: 500 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.setContent(HTML, { waitUntil: "networkidle" });
await page.screenshot({
  path: OUT,
  clip: { x: 0, y: 0, width: 630, height: 500 },
  omitBackground: false,
});
await browser.close();

console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
