import { describe, expect, it } from 'vitest';

import { createPgVectorRetriever } from '../adapters/pgvector-adapter.js';
import { createQdrantRetriever } from '../adapters/qdrant-adapter.js';
import { createRetriever } from '../factory.js';

import type { IsoDateTime, Ulid } from '../../scoring.js';
import type { PgVectorRow } from '../adapters/pgvector-adapter.js';
import type { QdrantSearchResponse } from '../adapters/qdrant-adapter.js';
import type { RetrieverFactoryRegistry } from '../types.js';

const PG_CONN = 'postgres://user:pass@localhost:5432/roler';
const QDRANT_URL = 'https://qdrant.dev:6333';
const NOW = new Date('2024-06-01T12:00:00.000Z').toISOString() as IsoDateTime;

const ULID = (prefix: string, n: number): Ulid => (`${prefix}${(10 + n).toString(16).toUpperCase()}` as unknown as Ulid);

describe('pgvector ↔ Qdrant adapter swap smoke tests', () => {
  it('switches from pgvector to qdrant by changing config.primary.kind', async () => {
    // Setup mock query functions
    const pgRows: readonly PgVectorRow[] = [
      { chunk_id: ULID('chunk', 1), entity_id: ULID('entity', 1), similarity: 0.95, updated_at: NOW }
    ];

    const qdrantResponse: QdrantSearchResponse = {
      result: [
        {
          id: '1',
          payload: { chunk_id: ULID('chunk', 2), entity_id: ULID('entity', 2), updated_at: NOW },
          score: 0.92
        }
      ]
    };

    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => {
        if (cfg.kind !== 'pgvector') throw new Error('config mismatch');
        return createPgVectorRetriever({
          config: cfg,
          async runQuery() {
            return pgRows;
          }
        });
      },
      qdrant: (cfg) => {
        if (cfg.kind !== 'qdrant') throw new Error('config mismatch');
        return createQdrantRetriever({
          config: cfg,
          async search() {
            return qdrantResponse;
          }
        });
      }
    };

    // Initial config with pgvector
    const pgResult = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        }
      }
    });

    expect(pgResult.primary.kind).toBe('pgvector');
    const pgOutput = await pgResult.retriever.retrieve({ embedding: [0.1], k: 1 });
    expect(pgOutput.candidates[0]?.chunkId).toBe(ULID('chunk', 1));

    // Swap to qdrant by changing config
    const qdrantResult = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'qdrant',
          url: QDRANT_URL,
          collection: 'chunks'
        }
      }
    });

    expect(qdrantResult.primary.kind).toBe('qdrant');
    const qdrantOutput = await qdrantResult.retriever.retrieve({ embedding: [0.1], k: 1 });
    expect(qdrantOutput.candidates[0]?.chunkId).toBe(ULID('chunk', 2));
  });

  it('swaps from qdrant to pgvector by changing config.primary.kind', async () => {
    const qdrantResponse: QdrantSearchResponse = {
      result: [
        {
          id: 'q1',
          payload: { chunk_id: ULID('qdrant_chunk', 1), entity_id: ULID('ent', 1), updated_at: NOW },
          score: 0.88
        }
      ]
    };

    const pgRows: readonly PgVectorRow[] = [
      { chunk_id: ULID('pg_chunk', 1), entity_id: ULID('ent', 2), similarity: 0.93, updated_at: NOW }
    ];

    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => {
        if (cfg.kind !== 'pgvector') throw new Error('config mismatch');
        return createPgVectorRetriever({
          config: cfg,
          async runQuery() {
            return pgRows;
          }
        });
      },
      qdrant: (cfg) => {
        if (cfg.kind !== 'qdrant') throw new Error('config mismatch');
        return createQdrantRetriever({
          config: cfg,
          async search() {
            return qdrantResponse;
          }
        });
      }
    };

    // Start with qdrant
    const qdrantResult = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'qdrant',
          url: QDRANT_URL,
          collection: 'embeddings'
        }
      }
    });

    expect(qdrantResult.primary.kind).toBe('qdrant');
    const qdrantOutput = await qdrantResult.retriever.retrieve({ embedding: [0.2], k: 1 });
    expect(qdrantOutput.candidates[0]?.chunkId).toBe(ULID('qdrant_chunk', 1));

    // Swap to pgvector
    const pgResult = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        }
      }
    });

    expect(pgResult.primary.kind).toBe('pgvector');
    const pgOutput = await pgResult.retriever.retrieve({ embedding: [0.2], k: 1 });
    expect(pgOutput.candidates[0]?.chunkId).toBe(ULID('pg_chunk', 1));
  });

  it('supports dual-read with pgvector primary and qdrant shadow', async () => {
    const pgRows: readonly PgVectorRow[] = [
      { chunk_id: ULID('pg', 1), entity_id: ULID('ent', 1), similarity: 0.9, updated_at: NOW }
    ];

    const qdrantResponse: QdrantSearchResponse = {
      result: [
        {
          id: 'q1',
          payload: { chunk_id: ULID('qdrant', 1), entity_id: ULID('ent', 1), updated_at: NOW },
          score: 0.85
        }
      ]
    };

    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => {
        if (cfg.kind !== 'pgvector') throw new Error('config mismatch');
        return createPgVectorRetriever({
          config: cfg,
          async runQuery() {
            return pgRows;
          }
        });
      },
      qdrant: (cfg) => {
        if (cfg.kind !== 'qdrant') throw new Error('config mismatch');
        return createQdrantRetriever({
          config: cfg,
          async search() {
            return qdrantResponse;
          }
        });
      },
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
            collection: 'shadow_collection'
          }
        }
      }
    });

    expect(result.primary.kind).toBe('pgvector');
    expect(result.shadow?.kind).toBe('qdrant');

    const output = await result.retriever.retrieve({ embedding: [0.3], k: 1 });
    // Primary (pgvector) result returned
    expect(output.candidates[0]?.chunkId).toBe(ULID('pg', 1));
  });

  it('supports dual-read with qdrant primary and pgvector shadow', async () => {
    const qdrantResponse: QdrantSearchResponse = {
      result: [
        {
          id: 'primary',
          payload: { chunk_id: ULID('qdrant', 1), entity_id: ULID('ent', 1), updated_at: NOW },
          score: 0.91
        }
      ]
    };

    const pgRows: readonly PgVectorRow[] = [
      { chunk_id: ULID('pg', 1), entity_id: ULID('ent', 1), similarity: 0.87, updated_at: NOW }
    ];

    const registry: RetrieverFactoryRegistry = {
      pgvector: (cfg) => {
        if (cfg.kind !== 'pgvector') throw new Error('config mismatch');
        return createPgVectorRetriever({
          config: cfg,
          async runQuery() {
            return pgRows;
          }
        });
      },
      qdrant: (cfg) => {
        if (cfg.kind !== 'qdrant') throw new Error('config mismatch');
        return createQdrantRetriever({
          config: cfg,
          async search() {
            return qdrantResponse;
          }
        });
      }
    };

    const result = createRetriever({
      registry,
      config: {
        primary: {
          kind: 'qdrant',
          url: QDRANT_URL,
          collection: 'primary_collection'
        },
        dualRead: {
          enabled: true,
          sampleRate: 1,
          shadow: {
            kind: 'pgvector',
            connectionString: PG_CONN
          }
        }
      }
    });

    expect(result.primary.kind).toBe('qdrant');
    expect(result.shadow?.kind).toBe('pgvector');

    const output = await result.retriever.retrieve({ embedding: [0.4], k: 1 });
    // Primary (qdrant) result returned
    expect(output.candidates[0]?.chunkId).toBe(ULID('qdrant', 1));
  });
});
