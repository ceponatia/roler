#!/usr/bin/env node
/* eslint-env node */
import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(scriptDir, '..');

async function findPackageCoverageFiles(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pkgCoverage = join(baseDir, entry.name, 'coverage', 'lcov.info');
      try {
        const s = await stat(pkgCoverage);
        if (s.isFile()) files.push(pkgCoverage);
      } catch {
        // ignore
      }
    }
  }
  return files;
}

const packagesDir = join(rootDir, 'packages');
const outputDir = join(rootDir, 'coverage');
const outputFile = join(outputDir, 'monorepo-lcov.info');

async function merge() {
  await mkdir(outputDir, { recursive: true });
  const files = await findPackageCoverageFiles(packagesDir);
  if (!files.length) {
    globalThis.console.error('No package coverage files found.');
    globalThis.process.exit(1);
  }
  const parts = await Promise.all(files.map(f => readFile(f, 'utf8')));
  const merged = parts.join('\n');
  await writeFile(outputFile, merged, 'utf8');
  globalThis.console.log(`Merged ${files.length} coverage files into ${outputFile}`);
}

merge().catch(err => {
  globalThis.console.error(err);
  globalThis.process.exit(1);
});
