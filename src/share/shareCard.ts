/**
 * Foldwink share-card renderer.
 *
 * Produces a square PNG (1080×1080) with the Foldwink dark palette, the
 * player's result, and a coloured solved-grid. Hand-drawn canvas, zero deps.
 *
 * The renderer is browser-only. Callers guard against non-browser
 * environments via `isShareCardSupported()`.
 */

const WIDTH = 1080;
const HEIGHT = 1080;

const COLOR = {
  bg: "#0f1115",
  surface: "#181b22",
  surfaceHi: "#22262f",
  text: "#e8eaf0",
  muted: "#8a8f9a",
  accent: "#7cc4ff",
  danger: "#e66565",
  solved: ["#f5c86b", "#8cd28e", "#ef9e9e", "#b49cf0"] as const,
  empty: "#262a33",
} as const;

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export interface ShareCardOptions {
  /** daily | standard */
  mode: "daily" | "standard";
  /** Puzzle title — used as a small caption above the headline */
  title: string;
  /** Sub-line describing the run, e.g. "Daily · 2026-04-11" or "Standard · #042" */
  subtitle: string;
  result: "win" | "loss";
  mistakesUsed: number;
  durationMs: number;
  difficulty: "easy" | "medium" | "hard";
  /** Ordered group ids matching the puzzle — drives the row colour palette */
  groupOrder: readonly string[];
  /** Which of those groups the player solved */
  solvedGroupIds: readonly string[];
  /** Wink availability — only medium puzzles carry the ✦ row */
  winkUsed: boolean;
  winkAvailable: boolean;
}

export function isShareCardSupported(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined" &&
    typeof document.createElement === "function"
  );
}

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Soft vignette via a radial gradient — cheap 2.5D feel, zero decoration.
  const grad = ctx.createRadialGradient(
    WIDTH / 2,
    HEIGHT / 2,
    WIDTH * 0.1,
    WIDTH / 2,
    HEIGHT / 2,
    WIDTH * 0.75,
  );
  grad.addColorStop(0, "#161922");
  grad.addColorStop(1, COLOR.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Thin accent underline on the outer card frame for brand anchoring.
  ctx.strokeStyle = "#22262f";
  ctx.lineWidth = 2;
  roundRect(ctx, 32, 32, WIDTH - 64, HEIGHT - 64, 36);
  ctx.stroke();
}

function drawWordmark(ctx: CanvasRenderingContext2D, y: number): number {
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = COLOR.text;
  ctx.font = `800 96px ${FONT_STACK}`;
  ctx.fillText("Foldwink", WIDTH / 2, y);

  // Accent underline
  ctx.fillStyle = COLOR.accent;
  ctx.fillRect(WIDTH / 2 - 56, y + 18, 112, 5);

  // Sublabel — restrained "by Neural Void" mark
  ctx.fillStyle = COLOR.muted;
  ctx.font = `600 22px ${FONT_STACK}`;
  ctx.fillText("BY  NEURAL  VOID", WIDTH / 2, y + 56);

  return y + 80;
}

function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  color: string = COLOR.muted,
): number {
  ctx.fillStyle = color;
  ctx.font = `600 28px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText(text, WIDTH / 2, y);
  return y + 36;
}

function drawHeadline(
  ctx: CanvasRenderingContext2D,
  opts: ShareCardOptions,
  y: number,
): number {
  const isWin = opts.result === "win";
  ctx.textAlign = "center";
  ctx.font = `800 120px ${FONT_STACK}`;
  ctx.fillStyle = isWin ? COLOR.text : COLOR.muted;
  const line = isWin ? "Solved" : "Close call";
  ctx.fillText(line, WIDTH / 2, y + 100);
  return y + 130;
}

function drawStatus(ctx: CanvasRenderingContext2D, opts: ShareCardOptions, y: number): number {
  const parts: string[] = [];
  parts.push(`${formatDuration(opts.durationMs)}`);
  parts.push(`${opts.mistakesUsed}/4 mistakes`);
  if (opts.difficulty === "medium") {
    parts.push(opts.winkUsed ? "Wink ✦" : "No Wink");
  }
  if (opts.difficulty === "hard") {
    parts.push("Hard");
  }
  const line = parts.join("   ·   ");
  ctx.fillStyle = COLOR.text;
  ctx.font = `500 34px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText(line, WIDTH / 2, y);
  return y + 44;
}

function drawGrid(ctx: CanvasRenderingContext2D, opts: ShareCardOptions, y: number): number {
  const cell = 96;
  const gap = 18;
  const rows = opts.groupOrder.length;
  const totalW = 4 * cell + 3 * gap;
  const startX = (WIDTH - totalW) / 2;

  const solvedSet = new Set(opts.solvedGroupIds);

  for (let r = 0; r < rows; r++) {
    const groupId = opts.groupOrder[r];
    const solved = solvedSet.has(groupId);
    const color = solved ? COLOR.solved[r % 4] : COLOR.empty;
    for (let c = 0; c < 4; c++) {
      const x = startX + c * (cell + gap);
      const cy = y + r * (cell + gap);
      ctx.fillStyle = color;
      roundRect(ctx, x, cy, cell, cell, 18);
      ctx.fill();

      if (!solved) {
        // Subtle inner stroke to keep the unsolved row from looking dead.
        ctx.strokeStyle = "#2e343f";
        ctx.lineWidth = 2;
        roundRect(ctx, x + 1, cy + 1, cell - 2, cell - 2, 17);
        ctx.stroke();
      }
    }
  }
  return y + rows * (cell + gap) - gap;
}

function drawFooter(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLOR.muted;
  ctx.font = `500 26px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText("neural-void.com/foldwink", WIDTH / 2, HEIGHT - 74);
}

/**
 * Draws a full Foldwink result card into the given canvas. Exposed for tests
 * or for consumers that want to control the canvas element themselves.
 */
export function drawShareCard(canvas: HTMLCanvasElement, opts: ShareCardOptions): void {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  drawBackground(ctx);

  const subtitleColor = opts.result === "win" ? COLOR.accent : COLOR.muted;

  let y = 160;
  y = drawWordmark(ctx, y);
  y = drawSubtitle(ctx, opts.subtitle.toUpperCase(), y + 20, subtitleColor);
  y = drawHeadline(ctx, opts, y + 24);
  y = drawStatus(ctx, opts, y + 30);
  drawGrid(ctx, opts, y + 36);

  drawFooter(ctx);
}

/**
 * Renders the share card and returns it as a PNG Blob. Returns `null` when
 * canvas / toBlob is unavailable or fails.
 */
export function renderShareCard(opts: ShareCardOptions): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!isShareCardSupported()) {
      resolve(null);
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      drawShareCard(canvas, opts);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    } catch {
      resolve(null);
    }
  });
}
