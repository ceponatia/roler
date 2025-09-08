/* eslint-disable import/order */
import fs from 'node:fs/promises';
import path from 'node:path';

import { describe, it, expect } from 'vitest';
import { loadExtensions } from './registry.js';

async function setupPkg(root: string, pkgName: string, manifest: Record<string, unknown>, options: { entry?: string; packageName?: string; addKey?: boolean } = {}): Promise<void> {
  const pkgDir = path.join(root, 'packages', pkgName);
  await fs.mkdir(path.join(pkgDir, 'dist'), { recursive: true });
  await fs.writeFile(`${pkgDir}/package.json`, JSON.stringify({
    name: options.packageName ?? pkgName,
    version: '0.0.0',
    ...(options.addKey === false ? {} : { rolerExtension: { entry: options.entry ?? 'dist/extension.js' } })
  }, null, 2));
  await fs.writeFile(path.join(pkgDir, 'dist/extension.js'), `export const manifest = ${JSON.stringify(manifest)};`);
}

function baseManifest(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    id: 'ext-' + Math.random().toString(36).slice(2, 7),
    name: 'Test',
    version: '0.1.0',
    description: 'x',
    coreApiRange: '^1.0.0',
    capabilities: [],
    peerExtensions: [],
    priority: 0,
    concurrencyLimit: 4,
    killSwitchEnabled: true,
    stateTransactionSupport: false,
    ...overrides
  };
}

describe('registry loadExtensions', () => {
  it('orders by priority desc then id asc', async () => {
    const root = path.join(process.cwd(), 'temp-registry-order');
    await fs.rm(root, { recursive: true, force: true });
    const m1 = baseManifest({ id: 'a-ext', priority: 1 });
    const m2 = baseManifest({ id: 'b-ext', priority: 2 });
    const m3 = baseManifest({ id: 'c-ext', priority: 2 });
    await setupPkg(root, 'a-ext', m1, {});
    await setupPkg(root, 'b-ext', m2, {});
    await setupPkg(root, 'c-ext', m3, {});
    const reg = await loadExtensions({ rootDir: root, coreApiVersion: '1.2.0' });
    expect(reg.errors.length).toBe(0);
    const ids = reg.extensions.map(e => e.manifest.id);
    expect(ids).toEqual(['b-ext', 'c-ext', 'a-ext']); // b & c priority 2 sorted lexical, then a
  });

  it('reports duplicate id', async () => {
    const root = path.join(process.cwd(), 'temp-registry-dup');
    await fs.rm(root, { recursive: true, force: true });
    const dup = baseManifest({ id: 'dup' });
    await setupPkg(root, 'dup1', dup, {});
    await setupPkg(root, 'dup2', { ...dup }, {});
    const reg = await loadExtensions({ rootDir: root, coreApiVersion: '1.0.0', failFast: false });
    expect(reg.errors.some(e => e.code === 'EXT_DUPLICATE_ID')).toBe(true);
  });

  it('fails version incompatible', async () => {
    const root = path.join(process.cwd(), 'temp-registry-version');
    await fs.rm(root, { recursive: true, force: true });
    const m = baseManifest({ id: 'ver', coreApiRange: '^2.0.0' });
    await setupPkg(root, 'ver', m, {});
    const reg = await loadExtensions({ rootDir: root, coreApiVersion: '1.0.0' });
    expect(reg.errors[0]?.code).toBe('EXT_VERSION_INCOMPATIBLE');
  });

  it('detects unresolved peer', async () => {
    const root = path.join(process.cwd(), 'temp-registry-peer');
    await fs.rm(root, { recursive: true, force: true });
    const m = baseManifest({ id: 'needs-peer', peerExtensions: [{ id: 'other', range: '^1.0.0' }] });
    await setupPkg(root, 'needs-peer', m, {});
    const reg = await loadExtensions({ rootDir: root, coreApiVersion: '1.0.0' });
    expect(reg.errors[0]?.code).toBe('EXT_PEER_UNRESOLVED');
  });
});
