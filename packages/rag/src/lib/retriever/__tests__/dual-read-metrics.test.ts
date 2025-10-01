import { beforeEach, describe, expect, it } from 'vitest';

import {
  getDualReadMetricsSnapshot,
  recordBackendLatency,
  recordDualReadShadowError,
  recordDualReadSuccess,
  resetDualReadMetrics
} from '../dual-read-metrics.js';

describe('dual-read metrics', () => {
  beforeEach(() => {
    resetDualReadMetrics();
  });

  it('tracks backend latency per adapter kind', () => {
    recordBackendLatency('pgvector', 12);
    recordBackendLatency('pgvector', 20);
    recordBackendLatency('qdrant', 7);

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.backendLatency.pgvector?.count).toBe(2);
    expect(snapshot.backendLatency.qdrant?.count).toBe(1);
    expect(snapshot.backendLatency.pgvector?.p95).toBeGreaterThanOrEqual(20);
  });

  it('ignores invalid backend latency observations', () => {
    recordBackendLatency('pgvector', Number.POSITIVE_INFINITY);
    recordBackendLatency('pgvector', -5);

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.backendLatency.pgvector?.count ?? 0).toBe(0);
  });

  it('records dual-read success statistics', () => {
    recordDualReadSuccess({ scoreDelta: 0.2, latencyDeltaMs: 15, mismatch: true });

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.dualRead.samples).toBe(1);
    expect(snapshot.dualRead.mismatches).toBe(1);
    expect(snapshot.dualRead.deltaScore.count).toBe(1);
    expect(snapshot.dualRead.deltaLatencyMs.count).toBe(1);
  });

  it('increments sample and error counters when shadow errors occur', () => {
    recordDualReadShadowError();
    recordDualReadShadowError();

    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.dualRead.samples).toBe(2);
    expect(snapshot.dualRead.shadowErrors).toBe(2);
  });

  it('resets accumulated metrics', () => {
    recordBackendLatency('pgvector', 12);
    recordDualReadSuccess({ scoreDelta: 0.1, latencyDeltaMs: 10, mismatch: false });
    recordDualReadShadowError();

    resetDualReadMetrics();
    const snapshot = getDualReadMetricsSnapshot();
    expect(snapshot.backendLatency.pgvector?.count ?? 0).toBe(0);
    expect(snapshot.dualRead.samples).toBe(0);
    expect(snapshot.dualRead.shadowErrors).toBe(0);
  });
});
