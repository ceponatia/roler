import { describe, expect, it } from 'vitest';

import {
  assertAdapterConfig,
  assertDualReadConfig,
  parseRetrieverConfig,
  resolveAdapterFactory,
  type RetrieverAdapter,
  type RetrieverFactoryRegistry
} from '../types.js';

const PG_CONN = 'postgres://user:pass@localhost:5432/roler';
const QDRANT_URL = 'https://qdrant.dev:6333';

function makeStubAdapter(kind: 'pgvector' | 'qdrant'): RetrieverAdapter {
  const config = kind === 'pgvector'
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

  assertAdapterConfig(config);

  return {
    kind,
    config,
    async retrieve() {
      return { candidates: [], vectorMs: 0 } as const;
    }
  } satisfies RetrieverAdapter;
}

describe('parseRetrieverConfig', () => {
  it('parses pgvector config and freezes the result', () => {
    const parsed = parseRetrieverConfig({
      primary: {
        kind: 'pgvector',
        connectionString: PG_CONN
      }
    });

    expect(parsed.primary.kind).toBe('pgvector');
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(parsed.normalization.strategy).toBe('auto');
    expect(parsed.dualRead).toBeUndefined();
  });

  it('parses dual-read shadow configuration when provided', () => {
    const parsed = parseRetrieverConfig({
      primary: {
        kind: 'pgvector',
        connectionString: PG_CONN
      },
      dualRead: {
        enabled: true,
        sampleRate: 0.25,
        shadow: {
          kind: 'qdrant',
          url: QDRANT_URL,
          collection: 'shadow'
        }
      }
    });

    expect(parsed.dualRead).toEqual({
      sampleRate: 0.25,
      shadow: {
        kind: 'qdrant',
        url: QDRANT_URL,
        collection: 'shadow',
        timeoutMs: 5_000,
        consistency: 'eventual',
        namespaceField: 'namespace'
      }
    });
  });

  it('rejects invalid dual-read payloads', () => {
    expect(() =>
      parseRetrieverConfig({
        primary: {
          kind: 'pgvector',
          connectionString: PG_CONN
        },
        dualRead: {
          enabled: true,
          sampleRate: 0.5
        }
      })
    ).toThrow(/shadow backend/);
  });
});

describe('resolveAdapterFactory', () => {
  it('returns the registered factory for the requested kind', async () => {
    const registry: RetrieverFactoryRegistry = {
      pgvector: (_config) => makeStubAdapter('pgvector')
    };

    const factory = resolveAdapterFactory('pgvector', registry);
    const rawConfig = { kind: 'pgvector', connectionString: PG_CONN };
    assertAdapterConfig(rawConfig);
    const adapter = factory(rawConfig);

    expect(adapter.kind).toBe('pgvector');
  });

  it('throws when adapter is not registered', () => {
    const registry: RetrieverFactoryRegistry = {};
    expect(() => resolveAdapterFactory('qdrant', registry)).toThrow(/No retriever adapter registered/);
  });
});

describe('assertDualReadConfig', () => {
  it('accepts disabled dual-read without a shadow backend', () => {
    const cfg: unknown = { enabled: false, sampleRate: 0.1 };
    expect(() => assertDualReadConfig(cfg)).not.toThrow();
  });

  it('requires a shadow backend when dual-read is enabled', () => {
    const cfg: unknown = { enabled: true, sampleRate: 0.25 };
    expect(() => assertDualReadConfig(cfg)).toThrow(/shadow backend/);
  });
});
