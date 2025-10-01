import { describe, expect, it } from 'vitest';

import { createRetriever } from '../factory.js';

import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';
import type {
  RetrieverAdapter,
  RetrieverAdapterConfig,
  RetrieverFactoryRegistry
} from '../types.js';

const PG_CONN = 'postgres://user:pass@localhost:5432/roler';
const QDRANT_URL = 'https://qdrant.dev:6333';
const NOW = new Date('2024-06-01T12:00:00.000Z').toISOString() as IsoDateTime;

const ULID = (prefix: string, n: number): Ulid => (`${prefix}${(10 + n).toString(16).toUpperCase()}` as unknown as Ulid);

function makeStubAdapter(kind: 'pgvector' | 'qdrant', override?: Partial<RetrieverAdapter>): RetrieverAdapter {
  const baseConfig: RetrieverAdapterConfig =
    kind === 'pgvector'
      ? {
          kind,
          connectionString: PG_CONN,
          schema: 'public',
          table: 'vector_chunks',
          embeddingColumn: 'embedding',
          metadataColumns: [],
          namespaceField: 'namespace'
        }
      : {
          kind,
          url: QDRANT_URL,
          collection: 'chunks',
          timeoutMs: 5_000,
          consistency: 'eventual',
          namespaceField: 'namespace'
        };

  return {
    kind,
    config: baseConfig,
    async retrieve() {
      return { candidates: [], vectorMs: 0 } as const;
    },
    ...(override ?? {})
  } satisfies RetrieverAdapter;
}

describe('createRetriever', () => {
  it('selects the primary adapter using the registry', () => {
    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => makeStubAdapter('pgvector', { config: cfg })
    };

    const { retriever, primary, parsedConfig, shadow } = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        }
      }
    });

    expect(primary.kind).toBe('pgvector');
    expect(primary.config.kind).toBe('pgvector');
    expect(parsedConfig.primary.kind).toBe('pgvector');
    expect(retriever.kind).toBe('pgvector');
    expect(shadow).toBeUndefined();
  });

  it('throws when requested adapter is not registered', () => {
    const registry: RetrieverFactoryRegistry = {};
    expect(() =>
      createRetriever({
        registry,
        config: {
          primary: {
            kind: 'qdrant',
            url: QDRANT_URL,
            collection: 'chunks'
          }
        }
      })
    ).toThrow(/No retriever adapter registered/);
  });

  it('throws when adapter factory returns mismatched kind', () => {
    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => makeStubAdapter('qdrant', { config: cfg as RetrieverAdapterConfig })
    };

    expect(() =>
      createRetriever({
        registry,
        config: {
          primary: {
            kind: 'pgvector',
            connectionString: PG_CONN
          }
        }
      })
    ).toThrow(/Adapter kind mismatch/);
  });

  it('includes a shadow adapter when dual-read evaluation is configured', () => {
    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => makeStubAdapter('pgvector', { config: cfg }),
      qdrant: (cfg) => makeStubAdapter('qdrant', { config: cfg })
    };

    const result = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        },
        dualRead: {
          enabled: true,
          sampleRate: 1,
          shadow: {
            kind: 'qdrant',
            url: QDRANT_URL,
            collection: 'shadow'
          }
        }
      }
    });

    expect(result.shadow?.kind).toBe('qdrant');
    expect(result.retriever.kind).toBe('pgvector');
  });

  it('normalizes adapter results before returning', async () => {
    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) =>
        makeStubAdapter('pgvector', {
          config: cfg,
          async retrieve() {
            const candidate = {
              chunkId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R2B', 1),
              entityId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R3B', 1),
              similarity: 2,
              updatedAt: NOW
            } satisfies Candidate;
            return { candidates: [candidate], vectorMs: 7 } as const;
          }
        })
    };

    const result = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        }
      }
    });

    const output = await result.retriever.retrieve({ embedding: [0.2], k: 1 });
    expect(output.vectorMs).toBe(7);
    expect(output.candidates[0]?.similarity).toBeCloseTo(1 / 3, 6);
  });
});
