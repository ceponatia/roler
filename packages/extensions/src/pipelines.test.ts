/* eslint-disable import/order */
import { describe, it, expect } from 'vitest';

import { runNormalization, runRetrievalEnrichment, runPreSaveValidation } from './pipelines.js';
import type { HydratedExtension } from './hooks-loader.js';

function makeExt(id: string, hooks: Partial<HydratedExtension['hooks']>, priority = 0): HydratedExtension {
  return {
    manifest: { id, name: id, version: '0.1.0', description: 'x', coreApiRange: '^1.0.0', capabilities: [], peerExtensions: [], priority, concurrencyLimit: 4, killSwitchEnabled: true, stateTransactionSupport: false },
    entry: 'virtual',
    hooks: {
      normalize: hooks.normalize ?? [],
      retrievalEnrichment: hooks.retrievalEnrichment ?? [],
      preSaveValidate: hooks.preSaveValidate ?? []
    }
  } as HydratedExtension; // safe for test construction
}

describe('pipelines', () => {
  it('normalization first-wins ordering across extensions', async () => {
    const e1 = makeExt('a', { normalize: [() => ({ foo: 1, bar: 2 })] }, 1);
    const e2 = makeExt('b', { normalize: [() => ({ foo: 99, baz: 3 })] }, 0);
    const res = await runNormalization([e1, e2], { entity: {} });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.changes).toEqual({ foo: 1, bar: 2, baz: 3 });
    }
  });

  it('retrieval enrichment merges without overwriting existing keys', async () => {
    const e1 = makeExt('a', { retrievalEnrichment: [() => ({ x: 1 })] }, 0);
    const e2 = makeExt('b', { retrievalEnrichment: [() => ({ x: 2, y: 5 })] }, 0);
    const res = await runRetrievalEnrichment([e1, e2], { context: {} });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value.additions).toEqual({ x: 1, y: 5 });
  });

  it('preSaveValidation strict stops on throw', async () => {
    const e1 = makeExt('a', { preSaveValidate: [() => { throw new Error('boom'); }] }, 0);
    const res = await runPreSaveValidation([e1], { candidate: {} }, { strict: true });
    expect(res.ok).toBe(false);
  });

  it('preSaveValidation non-strict aggregates errors', async () => {
    const failing = () => { throw new Error('bad'); };
    const e1 = makeExt('a', { preSaveValidate: [failing, failing] }, 0);
    const res = await runPreSaveValidation([e1], { candidate: {} }, { strict: false });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.message.split(';').length).toBe(2);
  });
});
