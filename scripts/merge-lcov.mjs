#!/usr/bin/env node
/* eslint-env node */
import { mkdir } from 'node:fs/promises';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createSafeFs, asSafePath } from './safe-fs.mjs';

// SECURITY RATIONALE:
// This script reads coverage artifacts from controlled package directories only.
// Package directory names are constrained to an allowlist regex (lowercase alnum + dash) below.
// All filesystem access goes through safe-fs which enforces realpath confinement under repo root.
// Dynamic paths are therefore validated and not influenced by external user input.

const PKG_NAME_RE = /^[a-z0-9-]+$/; // conservative allowlist for package dir names

// Resolve and freeze base directories to avoid path manipulation or traversal outside repo root.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(join(scriptDir, '..'));

async function findPackageCoverageFiles(baseDir, safe) {
  const resolved = resolve(baseDir);
  if (resolved !== packagesDir) {
    throw new Error(`Unsafe directory access attempt: ${baseDir}`);
  }
  const dirPath = asSafePath(rootDir, 'packages');
  const entries = await safe.readdirSafe(dirPath);
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;
    if (!PKG_NAME_RE.test(entry.name)) continue; // enforce allowlist
    const coveragePath = asSafePath(rootDir, `packages/${entry.name}/coverage/lcov.info`);
    try {
      const st = await safe.statSafe(coveragePath);
      if (st.isFile()) {
        files.push(coveragePath);
      }
    } catch {
      // ignore missing or unreadable
    }
  }
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

const packagesDir = join(rootDir, 'packages');
const outputDir = join(rootDir, 'coverage');
const outputFile = join(outputDir, 'monorepo-lcov.info');

async function merge() {
  await mkdir(outputDir, { recursive: true });
  const safe = createSafeFs(rootDir, { maxBytes: 5 * 1024 * 1024 });
  const files = await findPackageCoverageFiles(packagesDir, safe);
  if (files.length === 0) {
    globalThis.console.error('No package coverage files found.');
    globalThis.process.exit(1);
  }
  // Read sequentially to limit memory pressure if many packages (still small here but defensive)
  const parts = [];
  for (const f of files) {
    const rel = relative(rootDir, f.toString());
    try {
      const data = await safe.readFileSafe(f, 'utf8');
      parts.push(`# >> BEGIN ${rel}\n${data.trim()}\n# << END ${rel}`);
    } catch (e) {
      globalThis.console.warn(`Skipping unreadable coverage file ${rel}:`, e);
    }
  }
  if (!parts.length) {
    globalThis.console.error('All coverage files unreadable.');
    globalThis.process.exit(1);
  }
  const merged = parts.join('\n');
  const outPath = asSafePath(rootDir, 'coverage/monorepo-lcov.info');
  await safe.writeFileSafe(outPath, merged, 'utf8');
  globalThis.console.log(`Merged ${parts.length} coverage files into ${outputFile}`);
}

merge().catch(err => {
  globalThis.console.error(err);
  globalThis.process.exit(1);
});
