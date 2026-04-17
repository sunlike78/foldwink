/**
 * Run every e2e agent in sequence against a throwaway `vite preview`
 * server. Exits non-zero if any agent fails.
 *
 * Usage:
 *   npm run build
 *   node tests/e2e/run-all.mjs
 *
 * Assumes `dist/` is already built. The runner does NOT rebuild — this
 * keeps the feedback loop fast when iterating on tests.
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync } from "node:fs";

const PORT = Number(process.env.FOLDWINK_E2E_PORT ?? 4175);
const BASE = `http://localhost:${PORT}/`;

const agents = [
  "tests/e2e/progression-validator.mjs",
  "tests/e2e/gameplay-smoke.mjs",
  "tests/e2e/responsive-smoke.mjs",
  "tests/e2e/itch-embed-smoke.mjs",
  "tests/e2e/results-next-flow.mjs",
];

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html is missing — run `npm run build` first.");
  process.exit(2);
}

const preview = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: process.platform === "win32",
});

let serverReady = false;
preview.stdout.on("data", (chunk) => {
  const s = String(chunk);
  if (!serverReady && /Local:/i.test(s)) serverReady = true;
});
preview.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

process.on("exit", () => {
  if (!preview.killed) preview.kill();
});
process.on("SIGINT", () => {
  if (!preview.killed) preview.kill();
  process.exit(130);
});

// Poll the server until it answers — `vite preview` usually takes <2s.
async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* not ready */
    }
    await sleep(200);
  }
  throw new Error(`preview server at ${BASE} did not come up within 10s`);
}

await waitForServer();
console.log(`[run-all] preview server ready at ${BASE}`);

let failed = false;
for (const agent of agents) {
  console.log(`\n[run-all] ▶ ${agent}`);
  const code = await new Promise((res) => {
    const child = spawn("node", [agent], {
      stdio: "inherit",
      env: { ...process.env, FOLDWINK_E2E_URL: BASE },
      shell: process.platform === "win32",
    });
    child.on("exit", (c) => res(c ?? 1));
  });
  if (code !== 0) {
    console.error(`[run-all] ${agent} exited with code ${code}`);
    failed = true;
  }
}

preview.kill();
process.exit(failed ? 1 : 0);
