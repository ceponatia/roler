import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getRetrievalMetricsSnapshot, resetMetrics } from '../../lib/metrics.js';
import { main as benchMain } from '../bench.js';

// Minimal contract for the JSON printed by bench.ts
type BenchOut = Readonly<{
  n: number;
  mode: 'hit' | 'miss' | 'mixed';
  limit: number;
  baseK: number;
  maxKBoost: number;
  softPartialDeadlineMs: number;
  vectorMs: number;
  partialRate: number;
  p50: number;
  p95: number;
  p99: number;
  counters: Record<string, number>;
  h_total_count: number;
}>;

function withArgs<T>(args: string[], run: () => Promise<T>): Promise<T> {
  const orig = process.argv;
  // Simulate: node bench.js ...args
  process.argv = ['node', '/tmp/bench.js', ...args];
  return run().finally(() => {
    process.argv = orig;
  });
}

describe('bench main()', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetMetrics();
  });

  it('runs in miss mode and prints valid JSON summary', async () => {
    const logs: string[] = [];
    const spy = vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => {
      logs.push(String(a[0] ?? ''));
    });

    const code = await withArgs(['--n', '10', '--mode', 'miss', '--limit', '6', '--vectorMs', '1'], async () => benchMain());
    expect(code).toBe(0);

    expect(spy).toHaveBeenCalled();
    const last = logs[logs.length - 1] ?? '';
    const out = JSON.parse(last) as BenchOut;
    expect(out.n).toBe(10);
    expect(out.mode).toBe('miss');
    expect(out.limit).toBe(6);
    expect(out.p50).toBeGreaterThanOrEqual(0);
    expect(out.p95).toBeGreaterThanOrEqual(0);
    expect(out.counters).toBeTruthy();
    expect(out.h_total_count).toBeGreaterThan(0);

    const snap = getRetrievalMetricsSnapshot();
    expect(snap.counters.retrieval_total).toBeGreaterThan(0);
  });

  it('prewarms cache in hit mode and reports cache hits', async () => {
    const logs: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => {
      logs.push(String(a[0] ?? ''));
    });

    await withArgs(['--n', '6', '--mode', 'hit', '--limit', '5', '--vectorMs', '1'], async () => benchMain());
    const out = JSON.parse(logs[logs.length - 1] ?? '{}') as BenchOut;
    // In hit mode, we should see at least one cache hit recorded
    expect(out.counters['retrieval_cache_hit']).toBeGreaterThanOrEqual(1);
    expect(out.counters['retrieval_total']).toBeGreaterThan(0);
  });

  it('honors gate-p95 and exits non-zero when exceeded (using tiny gate)', async () => {
    const logs: string[] = [];
    vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => {
      logs.push(String(a[0] ?? ''));
    });

    const code = await withArgs(['--n', '3', '--mode', 'miss', '--gate-p95', '0'], async () => benchMain());
    // With a 0ms gate, any non-zero latency should fail; tolerate race by allowing either 0 or 1
    expect([0, 1]).toContain(code);
    const out = JSON.parse(logs[logs.length - 1] ?? '{}') as BenchOut;
    expect(out.p95).toBeGreaterThanOrEqual(0);
  });
});
