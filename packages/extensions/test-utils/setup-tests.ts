import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll } from 'vitest';

import { cleanupTempWorkspaces } from './test-fs.js';

async function sweepStaleTempDirs(): Promise<void> {
  const cwd = path.resolve(process.cwd());
  const entries = await fs.readdir(cwd, { withFileTypes: true }).catch(() => []);
  const prefixes = ['temp-', 'temp_'];
  const targets = entries
    .filter(d => d.isDirectory() && prefixes.some(p => d.name.startsWith(p)))
    .map(d => path.join(cwd, d.name));
  for (const dir of targets) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

afterAll(async () => {
  await cleanupTempWorkspaces();
  await sweepStaleTempDirs();
});
