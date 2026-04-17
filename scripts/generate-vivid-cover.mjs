/**
 * generate-vivid-cover.mjs
 *
 * Renders both Foldwink itch.io visual assets in one pass:
 *
 *   - itch.io/mockups/mockup-itch-cover-630x500-vivid.png
 *       Cover image for itch.io "Edit game → Cover image". Required
 *       630×500. Appears in search tiles, game listings, and the small
 *       header thumbnail on the game page.
 *
 *   - itch.io/mockups/mockup-itch-embed-bg-1100x800-vivid.png
 *       Embed BG for itch.io "Edit theme → Embed BG". Must match the
 *       configured iframe embed frame (1100×800 in our case). This is
 *       the image itch paints *behind* the iframe, including the
 *       "Run game" launcher on mobile Safari. Getting the aspect ratio
 *       right here is what makes the iPhone area not-black.
 *
 * Previously only the 630×500 cover existed and was reused as Embed BG;
 * itch cropped to center and the mobile launcher ended up showing only
 * the dark top/bottom of the cover. The 1100×800 landscape render puts
 * the colored category bars + wordmark in the zone itch actually keeps
 * visible behind the launcher button.
 */

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COVER_OUT = path.resolve(
  __dirname,
  "../itch.io/mockups/mockup-itch-cover-630x500-vivid.png",
);
const EMBED_OUT = path.resolve(
  __dirname,
  "../itch.io/mockups/mockup-itch-embed-bg-1100x800-vivid.png",
);

function html({ width, height, wordmarkSize, tagSize, barWidth, barHeight, padding }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      :root { color-scheme: dark; }
      html, body {
        margin: 0;
        padding: 0;
        width: ${width}px;
        height: ${height}px;
        background: #0f1115;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #e8eaf0;
        overflow: hidden;
      }
      .cover {
        position: relative;
        width: ${width}px;
        height: ${height}px;
        background:
          radial-gradient(ellipse at 20% 10%, rgba(124,196,255,0.10), transparent 55%),
          radial-gradient(ellipse at 80% 90%, rgba(214,155,85,0.08), transparent 55%),
          linear-gradient(180deg, #10141c 0%, #0b0d12 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${Math.max(18, Math.round(height * 0.04))}px;
        padding: ${padding}px;
        box-sizing: border-box;
      }
      .wordmark {
        font-size: ${wordmarkSize}px;
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
        font-size: ${tagSize}px;
        color: #b5bcc9;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .bars {
        display: grid;
        grid-template-columns: repeat(4, ${barWidth}px);
        gap: ${Math.round(barWidth * 0.12)}px;
      }
      .bar {
        height: ${barHeight}px;
        border-radius: ${Math.round(barHeight * 0.22)}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: ${Math.round(barHeight * 0.26)}px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(15,17,21,0.82);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
      }
      .bar.amber  { background: linear-gradient(180deg, #e3bf6b, #c9a456); }
      .bar.green  { background: linear-gradient(180deg, #8bc490, #6faa73); }
      .bar.coral  { background: linear-gradient(180deg, #d9857f, #bc6962); }
      .bar.purple { background: linear-gradient(180deg, #b093d1, #9478b3); }
      .credit {
        position: absolute;
        bottom: ${Math.round(padding * 0.7)}px;
        right: ${Math.round(padding * 0.8)}px;
        font-size: ${Math.max(11, Math.round(height * 0.022))}px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #6c7381;
      }
      .credit strong { color: #7cc4ff; font-weight: 700; }
      .badge {
        position: absolute;
        top: ${Math.round(padding * 0.7)}px;
        left: ${Math.round(padding * 0.8)}px;
        font-size: ${Math.max(11, Math.round(height * 0.022))}px;
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
}

const RENDERS = [
  {
    out: COVER_OUT,
    spec: {
      width: 630,
      height: 500,
      wordmarkSize: 86,
      tagSize: 20,
      barWidth: 120,
      barHeight: 54,
      padding: 26,
    },
  },
  {
    out: EMBED_OUT,
    spec: {
      width: 1100,
      height: 800,
      wordmarkSize: 160,
      tagSize: 32,
      barWidth: 200,
      barHeight: 88,
      padding: 48,
    },
  },
];

const browser = await chromium.launch();
for (const { out, spec } of RENDERS) {
  const ctx = await browser.newContext({
    viewport: { width: spec.width, height: spec.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.setContent(html(spec), { waitUntil: "networkidle" });
  await page.screenshot({
    path: out,
    clip: { x: 0, y: 0, width: spec.width, height: spec.height },
    omitBackground: false,
  });
  await ctx.close();
  console.log(`wrote ${path.relative(process.cwd(), out)}`);
}
await browser.close();
