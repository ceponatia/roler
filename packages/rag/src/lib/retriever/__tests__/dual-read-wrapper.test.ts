import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getDualReadMetricsSnapshot,
  resetDualReadMetrics
} from '../dual-read-metrics.js';
import { createDualReadRetriever } from '../dual-read.js';
import { createScoreNormalizer } from '../normalizer.js';

import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';
import type { RetrieveOpts, RetrieverAdapter } from '../types.js';

const NOW = new Date('2024-01-01T00:00:00.000Z').toISOString() as IsoDateTime;

const ULID = (prefix: string, n: number): Ulid => (`${prefix}${(10 + n).toString(16).toUpperCase()}` as unknown as Ulid);

const makeCandidate = (similarity: number, suffix: number): Candidate => ({
  chunkId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R2B', suffix),
  entityId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R3B', suffix),
  similarity,
  updatedAt: NOW
});

const PRIMARY_NORMALIZER = createScoreNormalizer({ strategy: 'auto', targetRange: [0, 1] }, 'pgvector');
const SHADOW_NORMALIZER = createScoreNormalizer({ strategy: 'auto', targetRange: [0, 1] }, 'qdrant');

const NO_OP_OPTS: RetrieveOpts = { embedding: [0.1], k: 5 } as const;

type Task = () => Promise<void>;

const makeScheduler = () => {
  const tasks: Task[] = [];
  return {
    schedule(task: Task) {
      tasks.push(task);
    },
    async runAll() {
      const pending = [...tasks];
      tasks.length = 0;
      for (const task of pending) {
        await task();
      }
    }
  } as const;
};

const makeAdapter = (
  kind: 'pgvector' | 'qdrant',
  response: Readonly<{ result: Candidate[]; vectorMs: number }>
): Readonly<{ adapter: RetrieverAdapter; spy: ReturnType<typeof vi.fn> }> => {
  const retrieve = vi.fn(async () => ({ candidates: response.result, vectorMs: response.vectorMs } as const));
  const config = kind === 'pgvector'
    ? {
        kind,
        connectionString: 'postgres://local',
        schema: 'public',
        table: 'vector_chunks',
        embeddingColumn: 'embedding',
        metadataColumns: [],
        namespaceField: 'namespace'
      }
    : {
        kind,
        url: 'https://qdrant.local:6333',
        collection: 'chunks',
        timeoutMs: 5_000,
        consistency: 'eventual' as const,
        namespaceField: 'namespace'
      };

  const adapter: RetrieverAdapter = { kind, config, retrieve };
  return { adapter, spy: retrieve } as const;
};

describe('createDualReadRetriever', () => {
  beforeEach(() => {
    resetDualReadMetrics();
  });

  it('returns normalized primary result when dual-read sample not triggered', async () => {
    const primary = makeAdapter('pgvector', { result: [makeCandidate(0.9, 1)], vectorMs: 12 });
    const shadow = makeAdapter('qdrant', { result: [makeCandidate(0.8, 2)], vectorMs: 14 });
    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 0, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 1 // ensure sample skipped
    });

    const result = await retriever.retrieve(NO_OP_OPTS);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.similarity).toBeCloseTo(0.9, 6);
    expect(shadow.spy).not.toHaveBeenCalled();
  });

  it('executes shadow adapter when sampled and records metrics', async () => {
    const scheduler = makeScheduler();
    const primary = makeAdapter('pgvector', {
      result: [makeCandidate(0.3, 1), makeCandidate(0.2, 2)],
      vectorMs: 10
    });
    const shadow = makeAdapter('qdrant', {
      result: [makeCandidate(0.6, 3), makeCandidate(0.4, 4)],
      vectorMs: 20
    });

    const events: unknown[] = [];
    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 0,
      schedule: scheduler.schedule,
      onEvent: (event) => events.push(event)
    });

    const result = await retriever.retrieve(NO_OP_OPTS);
    expect(result.candidates).toHaveLength(2);
    expect(result.candidates[0]?.similarity).toBeCloseTo(0.3, 6);
    expect(shadow.spy).toHaveBeenCalledOnce();

    await scheduler.runAll();

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.backendLatency.pgvector?.count).toBe(1);
    expect(snapshot.backendLatency.qdrant?.count).toBe(1);
    expect(snapshot.dualRead.samples).toBe(1);
    expect(snapshot.dualRead.deltaLatencyMs.count).toBe(1);
    const comparisonEvent = events.find((event) => (event as { type: string }).type === 'comparison') as
      | undefined
      | { shadowKind: string; primaryKind: string };
    expect(comparisonEvent).toBeDefined();
    const varianceEvent = events.find((event) => (event as { type: string }).type === 'variance-high') as
      | undefined
      | { code: string; causes: readonly string[]; comparison?: { mismatch: boolean } };
    expect(varianceEvent).toBeDefined();
    expect(varianceEvent?.code).toBe('RETR_DUAL_VARIANCE_HIGH');
    expect(varianceEvent?.causes).toEqual(expect.arrayContaining(['mismatch', 'score-delta']));
    expect(varianceEvent?.causes).not.toContain('latency-delta');
    expect(varianceEvent?.comparison?.mismatch).toBe(true);
  });

  it('processes sampled comparisons without an event handler', async () => {
    const scheduler = makeScheduler();
    const primary = makeAdapter('pgvector', { result: [makeCandidate(0.5, 1)], vectorMs: 15 });
    const shadow = makeAdapter('qdrant', { result: [makeCandidate(0.52, 2)], vectorMs: 30 });

    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 0,
      schedule: scheduler.schedule
    });

    await retriever.retrieve(NO_OP_OPTS);
    await scheduler.runAll();

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.dualRead.samples).toBe(1);
    expect(snapshot.dualRead.shadowErrors).toBe(0);
  });

  it('does not emit a variance alert when deltas are within thresholds and top candidates match', async () => {
    const scheduler = makeScheduler();
    const primaryCandidates = [makeCandidate(0.48, 1), makeCandidate(0.45, 2)];
    const primaryNormalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0, 1] }, 'pgvector');
    const shadowNormalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0, 1] }, 'qdrant');
    const primary = makeAdapter('pgvector', {
      result: primaryCandidates,
      vectorMs: 18
    });
    const shadow = makeAdapter('qdrant', {
      result: primaryCandidates.map((candidate) => ({ ...candidate })),
      vectorMs: 20
    });

    const events: unknown[] = [];
    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer,
      shadowNormalizer,
      random: () => 0,
      schedule: scheduler.schedule,
      onEvent: (event) => events.push(event)
    });

    await retriever.retrieve(NO_OP_OPTS);
    await scheduler.runAll();

    const comparisonEvents = events.filter((event) => (event as { type: string }).type === 'comparison');
    expect(comparisonEvents).toHaveLength(1);
    const varianceEvents = events.filter((event) => (event as { type: string }).type === 'variance-high');
    expect(varianceEvents).toHaveLength(0);
  });

  it('records shadow errors without throwing', async () => {
    const scheduler = makeScheduler();
    const primary = makeAdapter('pgvector', { result: [makeCandidate(0.4, 1)], vectorMs: 10 });
    const shadow = makeAdapter('qdrant', { result: [], vectorMs: 0 });
    shadow.spy.mockRejectedValueOnce(new Error('shadow failed'));

    const events: unknown[] = [];

    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 0,
      schedule: scheduler.schedule,
      onEvent: (event) => events.push(event)
    });

    await retriever.retrieve(NO_OP_OPTS);
    await scheduler.runAll();

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.dualRead.samples).toBe(1);
    expect(snapshot.dualRead.shadowErrors).toBe(1);
    const varianceEvent = events.find((event) => (event as { type: string }).type === 'variance-high') as
      | undefined
      | { code: string; causes: readonly string[] };
    expect(varianceEvent).toBeDefined();
    expect(varianceEvent?.code).toBe('RETR_DUAL_VARIANCE_HIGH');
    expect(varianceEvent?.causes).toEqual(['shadow-error']);
  });

  it('emits latency variance alerts when latency delta exceeds threshold', async () => {
    const scheduler = makeScheduler();
    const candidate = makeCandidate(0.6, 7);
    const primary = makeAdapter('pgvector', { result: [candidate], vectorMs: 10 });
    const shadow = makeAdapter('qdrant', { result: [candidate], vectorMs: 200 });

    const events: unknown[] = [];
    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 0,
      schedule: scheduler.schedule,
      onEvent: (event) => events.push(event)
    });

    await retriever.retrieve(NO_OP_OPTS);
    await scheduler.runAll();

    const varianceEvent = events.find((event) => (event as { type: string }).type === 'variance-high') as
      | undefined
      | { causes: readonly string[] };
    expect(varianceEvent?.causes).toEqual(expect.arrayContaining(['latency-delta']));
  });

  it('handles empty candidate lists without variance', async () => {
    const scheduler = makeScheduler();
    const primary = makeAdapter('pgvector', { result: [], vectorMs: 8 });
    const shadow = makeAdapter('qdrant', { result: [], vectorMs: 9 });

    const events: unknown[] = [];
    const retriever = createDualReadRetriever({
      primary: primary.adapter,
      shadow: shadow.adapter,
      plan: { sampleRate: 1, shadow: shadow.adapter.config },
      primaryNormalizer: PRIMARY_NORMALIZER,
      shadowNormalizer: SHADOW_NORMALIZER,
      random: () => 0,
      schedule: scheduler.schedule,
      onEvent: (event) => events.push(event)
    });

    await retriever.retrieve(NO_OP_OPTS);
    await scheduler.runAll();

    const comparison = events.find((event) => (event as { type: string }).type === 'comparison') as
      | undefined
      | { mismatch: boolean; scoreDelta: number };
    expect(comparison?.mismatch).toBe(false);
    expect(comparison?.scoreDelta).toBe(0);
    const varianceEvents = events.filter((event) => (event as { type: string }).type === 'variance-high');
    expect(varianceEvents).toHaveLength(0);
  });
});
