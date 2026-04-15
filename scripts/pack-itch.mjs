#!/usr/bin/env node
import { createWriteStream, readFileSync, statSync, mkdirSync, existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createDeflateRaw } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { PassThrough } from "node:stream";
import { Buffer } from "node:buffer";
import { crc32 as zlibCrc32 } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");
const version = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version;
const date = new Date().toISOString().slice(0, 10);
const outDir = join(root, "itch.io", "export");
const outPath = join(outDir, `foldwink-itch-upload-v${version}-${date}.zip`);

if (!existsSync(dist)) {
  console.error("dist/ missing — run `npm run build` first.");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

async function walk(d) {
  const out = [];
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

function u16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; }

async function deflate(buf) {
  const z = createDeflateRaw();
  const chunks = [];
  const sink = new PassThrough();
  sink.on("data", (c) => chunks.push(c));
  const src = new PassThrough();
  src.end(buf);
  await pipeline(src, z, sink);
  return Buffer.concat(chunks);
}

const files = await walk(dist);
const entries = [];
const parts = [];
let offset = 0;

for (const full of files) {
  const name = relative(dist, full).split(sep).join("/");
  const data = readFileSync(full);
  const crc = zlibCrc32(data) >>> 0;
  const deflated = await deflate(data);
  const useDeflate = deflated.length < data.length;
  const stored = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;
  const nameBuf = Buffer.from(name, "utf8");
  const local = Buffer.concat([
    u32(0x04034b50), u16(20), u16(0), u16(method), u16(0), u16(0),
    u32(crc), u32(stored.length), u32(data.length),
    u16(nameBuf.length), u16(0), nameBuf, stored,
  ]);
  entries.push({ name, crc, csize: stored.length, usize: data.length, method, offset, nameBuf });
  parts.push(local);
  offset += local.length;
}

const cdStart = offset;
for (const e of entries) {
  const cd = Buffer.concat([
    u32(0x02014b50), u16(20), u16(20), u16(0), u16(e.method), u16(0), u16(0),
    u32(e.crc), u32(e.csize), u32(e.usize),
    u16(e.nameBuf.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(e.offset),
    e.nameBuf,
  ]);
  parts.push(cd);
  offset += cd.length;
}
const cdSize = offset - cdStart;
const eocd = Buffer.concat([
  u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length),
  u32(cdSize), u32(cdStart), u16(0),
]);
parts.push(eocd);

const ws = createWriteStream(outPath);
for (const p of parts) ws.write(p);
await new Promise((r) => ws.end(r));
console.log(`wrote ${outPath}`);
console.log(`${entries.length} files, ${statSync(outPath).size} bytes`);
