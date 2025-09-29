import { describe, it, expect } from 'vitest';

import { createTempWorkspace, writeJson, writeModule } from '../../test-utils/test-fs.js';
import { extensionsApiVersion, loadExtensions } from '../index.js';

describe('loader error paths', () => {
  it('throws on duplicate extension ids', async () => {
    const root = await createTempWorkspace('dup');
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeJson(root, 'packages/e2/package.json', { name: 'e2', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    // two manifests with same id
    const code = 'export const manifest = { id:"dup", name:"Dup", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[], capabilities:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };';
    await writeModule(root, 'packages/e1/dist/extension.js', code);
    await writeModule(root, 'packages/e2/dist/extension.js', code);
    await expect(loadExtensions({ rootDir: root, coreApiVersion: extensionsApiVersion })).rejects.toThrow(/EXT_DUPLICATE_ID/);
  });

  it('throws on unresolved peer dependency', async () => {
    const root = await createTempWorkspace('peer');
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:"^1.0.0", peerExtensions:[{id:"missing", range:">=0.1.0"}], capabilities:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');
    await expect(loadExtensions({ rootDir: root, coreApiVersion: extensionsApiVersion })).rejects.toThrow(/EXT_PEER_UNRESOLVED/);
  });

  it('throws on incompatible core API version', async () => {
    const root = await createTempWorkspace('corever');
    await writeJson(root, 'packages/e1/package.json', { name: 'e1', version: '0.0.0', rolerExtension: { entry: 'dist/extension.js' } });
    await writeModule(root, 'packages/e1/dist/extension.js', 'export const manifest = { id:"e1", name:"E1", version:"0.1.0", description:"x", coreApiRange:">=999.0.0", peerExtensions:[], capabilities:[], priority:0, concurrencyLimit:4, killSwitchEnabled:true, stateTransactionSupport:false };');
    await expect(loadExtensions({ rootDir: root, coreApiVersion: '1.0.0' })).rejects.toThrow(/EXT_VERSION_INCOMPATIBLE/);
  });
});
