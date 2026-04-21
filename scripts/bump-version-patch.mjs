#!/usr/bin/env node
// Bump patch version in package.json + package-lock.json (semver x.y.Z).

import { readFileSync, writeFileSync } from "node:fs";

for (const file of ["package.json", "package-lock.json"]) {
  const text = readFileSync(file, "utf8");
  const obj = JSON.parse(text);
  const parts = String(obj.version).split(".");
  if (parts.length !== 3) {
    console.error(`${file}: unexpected version shape ${obj.version}`);
    process.exit(1);
  }
  const next = `${parts[0]}.${parts[1]}.${Number(parts[2]) + 1}`;
  obj.version = next;
  if (file === "package-lock.json" && obj.packages && obj.packages[""]) {
    obj.packages[""].version = next;
  }
  writeFileSync(file, JSON.stringify(obj, null, 2) + "\n");
  console.log(`${file}: bumped to ${next}`);
}
