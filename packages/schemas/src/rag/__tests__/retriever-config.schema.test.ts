import { describe, expect, it } from 'vitest';

import {
  DualReadConfigSchema,
  RetrieverConfigSchema
} from '../retriever-config.js';

const PG_CONN = 'postgres://user:pass@localhost:5432/roler';
const QDRANT_URL = 'https://qdrant.local:6333';

describe('RetrieverConfigSchema', () => {
  it('parses pgvector config and applies defaults', () => {
    const config = RetrieverConfigSchema.parse({
      primary: {
        kind: 'pgvector',
        connectionString: PG_CONN
      }
    });

    expect(config.primary.kind).toBe('pgvector');
    if (config.primary.kind !== 'pgvector') {
      throw new Error('expected pgvector adapter');
    }
    expect(config.primary.table).toBe('vector_chunks');
    expect(config.normalization.strategy).toBe('auto');
    expect(config.dualRead.enabled).toBe(false);
  });

  it('parses qdrant config with optional defaults', () => {
    const config = RetrieverConfigSchema.parse({
      primary: {
        kind: 'qdrant',
        url: QDRANT_URL,
        collection: 'chunks'
      }
    });

    expect(config.primary.kind).toBe('qdrant');
    if (config.primary.kind !== 'qdrant') {
      throw new Error('expected qdrant adapter');
    }
    expect(config.primary.consistency).toBe('eventual');
    expect(config.primary.timeoutMs).toBe(5_000);
    expect(config.primary.namespaceField).toBe('namespace');
  });

  it('rejects dual-read without a shadow adapter', () => {
    const result = RetrieverConfigSchema.safeParse({
      primary: {
        kind: 'pgvector',
        connectionString: PG_CONN
      },
      dualRead: {
        enabled: true,
        sampleRate: 0.5
      }
    });

    expect(result.success).toBe(false);
  });

  it('accepts dual-read when shadow adapter provided', () => {
    const config = RetrieverConfigSchema.parse({
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

    expect(config.dualRead.enabled).toBe(true);
    expect(config.dualRead.shadow?.kind).toBe('qdrant');
  });
});

describe('DualReadConfigSchema', () => {
  it('defaults to disabled dual read', () => {
    const cfg = DualReadConfigSchema.parse({});
    expect(cfg.enabled).toBe(false);
    expect(cfg.sampleRate).toBe(0);
  });
});
