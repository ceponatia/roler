import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

import { discoverExtensions } from './loader.js';

async function writeJson(p: string, obj: unknown): Promise<void> {
  await fs.mkdir(path.join(process.cwd(), 'temp-ext-test', path.dirname(p)), { recursive: true });
  await fs.writeFile(path.resolve(p), JSON.stringify(obj, null, 2), 'utf8');
}

describe('discoverExtensions', () => {
  it('discovers extension by manifest key and validates manifest', async () => {
    const tmpRoot = path.join(process.cwd(), 'temp-ext-test');
    await fs.rm(tmpRoot, { recursive: true, force: true });
    // Create fake package with manifest
    const pkgDir = path.join(tmpRoot, 'packages', 'example-ext');
    await writeJson(path.join(pkgDir, 'package.json'), {
      name: '@example/ext',
      version: '0.0.0',
      rolerExtension: { entry: 'dist/extension.js' }
    });
    const extEntry = path.join(pkgDir, 'dist');
    await fs.mkdir(extEntry, { recursive: true });
    const manifestObj = {
      id: 'example-ext',
      name: 'Example',
      version: '0.1.0',
      description: 'Example ext',
      coreApiRange: '^1.0.0',
      capabilities: ['demo'],
      peerExtensions: [],
      priority: 0,
      concurrencyLimit: 4,
      killSwitchEnabled: true,
      stateTransactionSupport: false
    };
    await fs.writeFile(path.join(extEntry, 'extension.js'), `export const manifest = ${JSON.stringify(manifestObj)};`);

    const result = await discoverExtensions({ rootDir: tmpRoot });
    expect(result.length).toBe(1);
    expect(result[0].manifest.id).toBe('example-ext');
  });

  it('skips packages without key unless allowlisted', async () => {
    const tmpRoot = path.join(process.cwd(), 'temp-ext-test-2');
    await fs.rm(tmpRoot, { recursive: true, force: true });
    const pkgDir = path.join(tmpRoot, 'packages', 'no-manifest');
    await writeJson(path.join(pkgDir, 'package.json'), { name: 'no-manifest', version: '0.0.0' });
    const resNone = await discoverExtensions({ rootDir: tmpRoot });
    expect(resNone.length).toBe(0);
    // Add an entry file with minimal manifest
    const distDir = path.join(pkgDir, 'dist');
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, 'extension.js'), `export const manifest = ${JSON.stringify({
      id: 'no-manifest-ext',
      name: 'No Manifest',
      version: '0.1.0',
      description: 'x',
      coreApiRange: '^1.0.0',
      capabilities: [],
      peerExtensions: [],
      priority: 0,
      concurrencyLimit: 4,
      killSwitchEnabled: true,
      stateTransactionSupport: false
    })};`);
    const resAllow = await discoverExtensions({ rootDir: tmpRoot, allowlist: ['no-manifest'] });
    expect(resAllow.length).toBe(1);
  });
});
