import { UlidSchema } from '@roler/schemas';
import { describe, expect, it, vi } from 'vitest';

import { createGatedRetrievalOrchestrator } from '../../index.js';

const fakeRetriever = {
  retrieve: vi.fn(async () => ({ candidates: [], vectorMs: 1 }))
};

const fakeEmbedder = async () => [0, 1, 2] as const;

const minimalReq = {
  queryText: 'hi',
  gameId: UlidSchema.parse('01ARZ3NDEKTSV4RRFFQ69G5FAV')
} as const;

describe('createGatedRetrievalOrchestrator', () => {
  it('throws when flag disabled', async () => {
    // Sanity: ensure env not set
    const old = process.env.LOW_LATENCY_RETRIEVAL;
    delete process.env.LOW_LATENCY_RETRIEVAL;
    const exec = createGatedRetrievalOrchestrator({ retriever: fakeRetriever as any, embedder: fakeEmbedder });
    await expect(exec(minimalReq as any)).rejects.toThrow(/R-002 disabled/);
    process.env.LOW_LATENCY_RETRIEVAL = old;
  });

  it('delegates when flag enabled', async () => {
    const old = process.env.LOW_LATENCY_RETRIEVAL;
    process.env.LOW_LATENCY_RETRIEVAL = 'true';
    const exec = createGatedRetrievalOrchestrator({ retriever: fakeRetriever as any, embedder: fakeEmbedder });
    // It will attempt to run but our retriever returns no candidates; the orchestrator may still succeed with empty items.
    await expect(exec(minimalReq as any)).resolves.toMatchObject({ partial: expect.any(Boolean), items: expect.any(Array) });
    process.env.LOW_LATENCY_RETRIEVAL = old;
  });

  it('bypassFlag allows execution regardless of env', async () => {
    const old = process.env.LOW_LATENCY_RETRIEVAL;
    delete process.env.LOW_LATENCY_RETRIEVAL;
    const exec = createGatedRetrievalOrchestrator({ retriever: fakeRetriever as any, embedder: fakeEmbedder }, undefined, { bypassFlag: true });
    await expect(exec(minimalReq as any)).resolves.toBeTruthy();
    process.env.LOW_LATENCY_RETRIEVAL = old;
  });
});
