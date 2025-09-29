import { describe, it, expect } from 'vitest';

import { runPipelines } from '../executor.js';

import type { BaseHookContext } from '../types.js';

const baseCtx: BaseHookContext = {
  tenantId: 't1',
  sessionId: 's1',
  role: 'GM',
  requestId: 'r1',
};

describe('runPipelines', () => {
  it('returns ok results for all hook groups with default shapes', async () => {
    const out = await runPipelines(baseCtx, { normalize: { foo: 'bar' } });
    expect(out.normalize?.ok).toBe(true);
    expect(out.retrievalEnrichment?.ok).toBe(true);
    expect(out.preSaveValidate?.ok).toBe(true);
    expect(out.postModelDraft?.ok).toBe(true);
    expect(out.postModeration?.ok).toBe(true);
    expect(out.prePersistTurn?.ok).toBe(true);
  });

  it('does not mutate provided inputs object', async () => {
    const inputs = { normalize: { x: 1 } } as const;
    const snapshot = JSON.stringify(inputs);
    await runPipelines(baseCtx, inputs);
    expect(JSON.stringify(inputs)).toBe(snapshot);
  });
});
