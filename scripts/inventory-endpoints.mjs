#!/usr/bin/env node
/**
 * Inventory SvelteKit API endpoints and report missing schema imports
 * Prints a JSON list of files with a flag `hasSchemaImport`. Non-fatal script.
 */
import path from 'node:path';

import { createSafeFs, asSafePath } from './safe-fs.mjs';

const root = process.cwd();
const sfs = createSafeFs(root, { skipHidden: true, maxBytes: 256 * 1024 });

async function listFiles(dir) {
  const out = [];
  const ents = await sfs.readdirSafe(dir).catch(() => []);
  for (const ent of ents) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await listFiles(full)));
    else if (ent.isFile()) out.push(full);
  }
  return out;
}

async function hasSchemaImport(file) {
  const content = String(await sfs.readFileSafe(file, 'utf8'));
  return /from\s+['"]@roler\/schemas/.test(content) || /from\s+['"]zod/.test(content);
}

async function main() {
  const routesDir = asSafePath(root, 'routes');
  const files = (await listFiles(routesDir)).filter((f) => /\/routes\/api\/.+\+server\.ts$/.test(f));
  const rows = [];
  for (const f of files) rows.push({ file: path.relative(root, f), hasSchemaImport: await hasSchemaImport(f) });
  console.log(JSON.stringify(rows, null, 2));
}

main().catch((e) => {
  console.error('[inventory-endpoints] error', e);
  process.exit(1);
});
