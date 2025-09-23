#!/usr/bin/env node
/**
 * CI Gate: Boundary Schema Imports
 *
 * Fails if any SvelteKit API route file (+server.ts under routes/api) does NOT
 * import a schema from @roler/schemas (preferred) or zod. This enforces R-004 coverage.
 *
 * Notes:
 * - This script is intentionally conservative: it checks for presence of imports that
 *   strongly indicate validation usage. It doesn't parse AST for full certainty to keep
 *   runtime minimal in CI. We can harden later if needed.
 * - Uses scripts/safe-fs.mjs for root confinement and hidden path filtering.
 */

import path from 'node:path';

import { createSafeFs, asSafePath } from './safe-fs.mjs';

const root = process.cwd();
const sfs = createSafeFs(root, { skipHidden: true, maxBytes: 256 * 1024 });

/**
 * Recursively list files under a directory.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function listFiles(dir) {
  const entries = await sfs.readdirSafe(dir).catch(() => []);
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const sub = await listFiles(full);
      files.push(...sub);
    } else if (ent.isFile()) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Does a file appear to import schemas for validation?
 * @param {string} file
 */
async function hasSchemaImport(file) {
  const content = String(await sfs.readFileSafe(file, 'utf8'));
  const importRegexes = [
    /from\s+['"]@roler\/schemas['"];?/,
    /from\s+['"]@roler\/schemas\//,
    /from\s+['"]zod['"];?/
  ];
  return importRegexes.some(r => r.test(content));
}

async function main() {
  const routesDir = asSafePath(root, 'routes');
  const all = await listFiles(routesDir);
  const routeFiles = all.filter(f => /\/routes\/api\/.+\+server\.ts$/.test(f));

  // If no route files yet, pass.
  if (routeFiles.length === 0) {
    console.log('[ci-boundary-schemas] No route files found; skipping.');
    return;
  }

  const missing = [];
  for (const f of routeFiles) {
    const ok = await hasSchemaImport(f);
    if (!ok) missing.push(f);
  }

  if (missing.length > 0) {
    console.error('\nR-004 CI Gate FAILED: Missing schema imports in:');
    for (const f of missing) console.error(' - ' + path.relative(root, f));
    console.error('\nEach API route must import a schema from @roler/schemas (preferred) or zod.');
    process.exit(1);
  }

  console.log('[ci-boundary-schemas] OK: All API routes import schemas.');
}

main().catch(err => {
  console.error('[ci-boundary-schemas] ERROR', err);
  process.exit(1);
});
