/* eslint-disable import/order */
import { describe, it, expect } from 'vitest';
import { runPreChatTurn, runPostModelDraft, runPostModeration, runPrePersistTurn } from './pipelines.js';
import type { HydratedExtension } from './hooks-loader.js';

function ext(id: string, hooks: Partial<HydratedExtension['hooks']>, priority = 0): HydratedExtension {
  return {
    manifest: { id, name: id, version: '0.1.0', description: 'x', coreApiRange: '^1.0.0', capabilities: [], peerExtensions: [], priority, concurrencyLimit: 4, killSwitchEnabled: true, stateTransactionSupport: false, chatHooks: {} },
    entry: 'virtual',
    hooks: {
      normalize: [], retrievalEnrichment: [], preSaveValidate: [],
      preChatTurn: hooks.preChatTurn ?? [],
      postModelDraft: hooks.postModelDraft ?? [],
      postModeration: hooks.postModeration ?? [],
      prePersistTurn: hooks.prePersistTurn ?? []
    }
  } as HydratedExtension;
}

describe('chat pipelines', () => {
  it('preChatTurn first-wins keys', async () => {
    const e1 = ext('a', { preChatTurn: [() => ({ intro: 'one', shared: 1 })] }, 1);
    const e2 = ext('b', { preChatTurn: [() => ({ shared: 2, extra: true })] }, 0);
    const res = await runPreChatTurn([e1, e2], {});
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value.additions).toEqual({ intro: 'one', shared: 1, extra: true });
  });

  it('postModelDraft merges edits', async () => {
    const e1 = ext('a', { postModelDraft: [() => ({ tokens: 10 })] });
    const e2 = ext('b', { postModelDraft: [() => ({ tokens: 20, delta: 1 })] });
    const res = await runPostModelDraft([e1, e2], {});
    if (res.ok) expect(res.value.edits).toEqual({ tokens: 10, delta: 1 });
  });

  it('postModeration merges tags', async () => {
    const e1 = ext('a', { postModeration: [() => ({ tagA: true })] });
    const e2 = ext('b', { postModeration: [() => ({ tagA: false, tagB: 5 })] });
    const res = await runPostModeration([e1, e2], {});
    if (res.ok) expect(res.value.tags).toEqual({ tagA: true, tagB: 5 });
  });

  it('prePersistTurn collects attachments', async () => {
    const e1 = ext('a', { prePersistTurn: [() => ({ note: 'save' })] });
    const e2 = ext('b', { prePersistTurn: [() => ({ note: 'ignored', tx: 1 })] });
    const res = await runPrePersistTurn([e1, e2], {});
    if (res.ok) expect(res.value.attachments).toEqual({ note: 'save', tx: 1 });
  });
});
