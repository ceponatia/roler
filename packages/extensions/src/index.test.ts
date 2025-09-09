import path from 'node:path';
import { describe, it, expect } from 'vitest';

import { createExtension, discoverExtensions, loadExtensions, loadExtensionsFromConfig, extensionsApiVersion, shouldEnableExtensions, loadExtensionsGuarded, loadExtensionsFromConfigGuarded } from './index.js';
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

  it('guards loading behind EXTENSIONS_ENABLED flag', async () => {
    const root = await createTempWorkspace('temp-guarded');
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[], capabilities:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');

    expect(shouldEnableExtensions({ EXTENSIONS_ENABLED: 'false' })).toBe(false);
    expect(shouldEnableExtensions({ EXTENSIONS_ENABLED: 'true' })).toBe(true);

    const empty = await loadExtensionsGuarded({ rootDir: root, coreApiVersion: extensionsApiVersion }, { EXTENSIONS_ENABLED: '0' });
    expect(empty.length).toBe(0);

    const reg = await loadExtensionsGuarded({ rootDir: root, coreApiVersion: extensionsApiVersion }, { EXTENSIONS_ENABLED: '1' });
    expect(reg.length).toBe(1);

    const emptyCfg = await loadExtensionsFromConfigGuarded(root, { coreApiVersion: extensionsApiVersion, extensions: [{ id: 'e1' }] }, { EXTENSIONS_ENABLED: 'off' });
    expect(emptyCfg.length).toBe(0);
    const regCfg = await loadExtensionsFromConfigGuarded(root, { coreApiVersion: extensionsApiVersion, extensions: [{ id: 'e1' }] }, { EXTENSIONS_ENABLED: 'on' });
    expect(regCfg.length).toBe(1);
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

  it('loads via config allowlist and applies overrides and orderOverrides', async () => {
    const root = await createTempWorkspace('temp-registry-order');
    // e1 lower priority
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[], capabilities:["cap-a"], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');
    // e2 higher priority
    await writeJson(root, 'packages/e2/package.json', { name: 'e2', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e2/dist/extension.js', 'export const manifest = { id:"e2", name:"E2", version:"0.2.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[], capabilities:["cap-b"], priority:10, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');

  const config = {
      extensions: [
        { id: 'e1', overrides: { killSwitchEnabled: false } },
        { id: 'e2' }
      ],
      orderOverrides: ['e2', 'e1'],
      capabilityAllowlist: ['cap-a','cap-b']
  };

    const reg = await loadExtensionsFromConfig(root, config);
    // orderOverrides should put e2 first
    expect(reg.map(r => r.manifest.id)).toEqual(['e2','e1']);
    // overrides.killSwitchEnabled === false -> disabled true in registry
    const e1 = reg.find(r => r.manifest.id === 'e1');
    expect(e1?.disabled).toBe(true);
  });
});
