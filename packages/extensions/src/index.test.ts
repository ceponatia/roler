import path from 'node:path';
import { describe, it, expect } from 'vitest';

import { createExtension, discoverExtensions, loadExtensions, extensionsApiVersion } from './index.js';
import { createTempWorkspace, writeJson, writeModule } from '../test-utils/test-fs.js';

describe('@roler/extensions basics', () => {
  it('creates a validated extension bundle', () => {
    const ext = createExtension({
      id: 'ext-a',
      name: 'A',
      version: '0.1.0',
      description: 'x',
      coreApiRange: '^1.0.0',
      capabilities: [],
      peerExtensions: [],
      priority: 0,
      concurrencyLimit: 4,
      killSwitchEnabled: true,
      stateTransactionSupport: false,
    }, {});
    expect(ext.manifest.id).toBe('ext-a');
  });

  it('discovers extensions from package.json rolerExtension entry', async () => {
    const root = await createTempWorkspace('temp-registry-order');
  const _pkgDir = path.join(root, 'packages', 'e1');
    await writeJson(root, 'packages/e1/package.json', {
      name: 'e1',
      version: '0.0.0',
      rolerExtension: { entry: 'dist/extension.js' },
    });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", capabilities:[], peerExtensions:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');

    const found = await discoverExtensions({ rootDir: root });
    expect(found.length).toBe(1);
    expect(found[0].packageName).toBe('e1');
  });

  it('loads and orders extensions deterministically and checks peers', async () => {
    const root = await createTempWorkspace('temp-registry-order');
    // e1 requires e2
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[{id:"e2", range:">=0.1.0"}], capabilities:[], priority:10, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');
    // e2 lower priority
    await writeJson(root, 'packages/e2/package.json', { name: 'e2', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e2/dist/extension.js', 'export const manifest = { id:"e2", name:"E2", version:"0.2.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[], capabilities:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');

    const reg = await loadExtensions({ rootDir: root, coreApiVersion: extensionsApiVersion });
    expect(reg.map(r => r.manifest.id)).toEqual(['e1','e2']);
  });
});
