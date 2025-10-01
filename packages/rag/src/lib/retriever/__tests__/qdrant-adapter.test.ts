import { describe, expect, it, vi } from 'vitest';

import { createQdrantRetriever, type RunQdrantSearch } from '../adapters/qdrant-adapter.js';
import { createRetriever } from '../factory.js';

import type { IsoDateTime, Ulid } from '../../scoring.js';
import type { RetrieverFactoryRegistry } from '../types.js';
import type { QdrantAdapterConfig } from '@roler/schemas';

const NOW = new Date('2024-07-01T00:00:00.000Z').toISOString() as IsoDateTime;

const ULID = (prefix: string, n: number): Ulid =>
  (`${prefix}${(10 + n).toString(16).toUpperCase()}` as unknown as Ulid);

const BASE_CONFIG: QdrantAdapterConfig = {
  kind: 'qdrant',
  url: 'https://qdrant.dev:6333',
  collection: 'chunks',
  timeoutMs: 1_000,
  consistency: 'eventual',
  namespaceField: 'namespace'
};

describe('createQdrantRetriever', () => {
  it('combines namespace and filters when building Qdrant payload filter', async () => {
    let capturedArgs: Parameters<RunQdrantSearch>[3] | undefined;
    const search = vi.fn<RunQdrantSearch>(async (_collection, _vector, _limit, args) => {
      capturedArgs = args;
      return {
        result: [
          {
            id: '1',
            payload: {
              chunk_id: ULID('chunk', 1),
              entity_id: ULID('entity', 1),
              updated_at: NOW
            },
            score: 0.42
          }
        ]
      } as const;
    });

    const retriever = createQdrantRetriever({
      config: BASE_CONFIG,
      search
    });

    const result = await retriever.retrieve({
      embedding: [0.1, 0.2],
      k: 1,
      namespace: 'campaign',
      filters: { tier: 'gold', active: true }
    });

    expect(result.candidates).toHaveLength(1);

    expect(capturedArgs).toBeDefined();
    expect(capturedArgs?.filter).toEqual({
      must: [
        { key: 'namespace', match: { value: 'campaign' } },
        { key: 'tier', match: { value: 'gold' } },
        { key: 'active', match: { value: true } }
      ]
    });
  });

  it('returns raw backend scores without clamping', async () => {
    const rawScore = -0.4;
    const retriever = createQdrantRetriever({
      config: BASE_CONFIG,
      search: async () => ({
        result: [
          {
            id: 'raw',
            payload: {
              chunk_id: ULID('chunk', 2),
              entity_id: ULID('entity', 2),
              updated_at: NOW
            },
            score: rawScore
          }
        ]
      })
    });

    const output = await retriever.retrieve({ embedding: [0.3], k: 1 });
    expect(output.candidates[0]?.similarity).toBe(rawScore);
  });
});

describe('qdrant adapter integration', () => {
  it('normalizes cosine scores when resolved through createRetriever', async () => {
    const registry: RetrieverFactoryRegistry = {
      qdrant: (cfg) => {
        if (cfg.kind !== 'qdrant') {
          throw new Error('config mismatch');
        }
        return createQdrantRetriever({
          config: cfg,
          search: async () => ({
            result: [
              {
                id: 'neg',
                payload: {
                  chunk_id: ULID('chunk', 3),
                  entity_id: ULID('entity', 3),
                  updated_at: NOW
                },
                score: -0.5
              }
            ]
          })
        });
      }
    };

    const { retriever } = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'qdrant',
          url: BASE_CONFIG.url,
          collection: BASE_CONFIG.collection
        }
      }
    });

    const output = await retriever.retrieve({ embedding: [0.5], k: 1 });
    expect(output.candidates[0]?.similarity).toBeCloseTo(0.25, 6);
  });
});
