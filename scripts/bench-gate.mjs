#!/usr/bin/env node
/**
 * Benchmark gate script
 * Usage: node scripts/bench-gate.mjs [pathToBenchJson] [gateMs]
 * Defaults: path=bench.json, gateMs=5
 */
import process from 'node:process';

import { createSafeFs, asSafePath } from './safe-fs.mjs';

const root = process.cwd();
const sfs = createSafeFs(root, { skipHidden: true, maxBytes: 1024 * 1024 });

function parseArgs() {
  const benchPath = process.argv[2] ?? 'bench.json';
  const gateRaw = process.argv[3];
  const gateMs = Number.isFinite(Number(gateRaw)) ? Number(gateRaw) : 5;
  return { benchPath, gateMs };
}

async function readJson(filePath) {
  const safe = asSafePath(root, filePath);
  const data = await sfs.readFileSafe(safe, 'utf8');
  try {
    return JSON.parse(String(data));
  } catch (e) {
    throw new Error(`Failed to parse JSON from ${filePath}: ${(e && /** @type {Error} */ (e).message) || e}`);
  }
}

async function main() {
  const { benchPath, gateMs } = parseArgs();
  const report = await readJson(benchPath);
  const p95 = Number(report?.p95Ms);
  if (!Number.isFinite(p95)) {
    console.error(`[bench-gate] Invalid report: missing numeric p95Ms in ${benchPath}`);
    process.exit(2);
    return;
  }

  if (p95 > gateMs) {
    console.error(`p95 ${p95}ms exceeds gate ${gateMs}ms`);
    process.exit(1);
    return;
  }

  console.log(`p95 OK: ${p95}ms ≤ gate ${gateMs}ms`);
}

main().catch((err) => {
  console.error('[bench-gate] error', err);
  process.exit(1);
});
