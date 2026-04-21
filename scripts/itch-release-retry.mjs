#!/usr/bin/env node
// Retry itch.io release every 5 minutes until butler returns success.
// The itch API currently hangs on POST /wharf/builds; this script just
// keeps trying with a hard per-attempt timeout of 120s.
//
// Log: logs/overnight/itch-retry.log

import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "logs/overnight/itch-retry.log");
mkdirSync(join(ROOT, "logs/overnight"), { recursive: true });

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  appendFileSync(LOG, line + "\n");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

log("=== itch-release-retry START ===");

for (let attempt = 1; attempt <= 72; attempt++) {
  log(`attempt ${attempt}/72 — npm run release:butler -- --skip-pack`);
  const res = spawnSync("npm", ["run", "release:butler", "--", "--skip-pack"], {
    encoding: "utf8",
    shell: true,
    timeout: 180_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const stdout = res.stdout ?? "";
  const stderr = res.stderr ?? "";
  appendFileSync(LOG, `--- stdout ---\n${stdout}\n--- stderr ---\n${stderr}\n`);
  if (res.status === 0 && /pushed v\d/.test(stdout)) {
    log(`SUCCESS on attempt ${attempt}`);
    process.exit(0);
  }
  log(`attempt ${attempt} failed (status=${res.status}); sleeping 5 min`);
  await sleep(5 * 60 * 1000);
}

log("giving up after 72 attempts (~6 hours)");
process.exit(1);
