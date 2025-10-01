import type { RetrieverAdapterKind } from './types.js';

/**
 * Aggregated view of histogram observations with high-level quantiles.
 */
export type HistogramSummary = Readonly<{ count: number; p50: number; p95: number }>;

/**
 * Snapshot of the dual-read metric state including backend latencies and comparison deltas.
 */
export type DualReadMetricsSnapshot = Readonly<{
  backendLatency: Readonly<Partial<Record<RetrieverAdapterKind, HistogramSummary>>>;
  dualRead: Readonly<{
    samples: number;
    mismatches: number;
    shadowErrors: number;
    deltaScore: HistogramSummary;
    deltaLatencyMs: HistogramSummary;
  }>;
}>;

type Histogram = {
  readonly buckets: readonly number[];
  counts: number[];
  sum: number;
  count: number;
};

const LATENCY_BUCKETS = [5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560] as const;
const SCORE_DELTA_BUCKETS = [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.4, 0.8, 1.6] as const;

const backendLatency: Partial<Record<RetrieverAdapterKind, Histogram>> = {};
const dualReadDeltaLatency = makeHistogram(LATENCY_BUCKETS);
const dualReadDeltaScore = makeHistogram(SCORE_DELTA_BUCKETS);

let samples = 0;
let mismatches = 0;
let shadowErrors = 0;

/**
 * Observe latency for a particular adapter kind, feeding histogram summaries.
 */
export function recordBackendLatency(kind: RetrieverAdapterKind, latencyMs: number): void {
  const hist = ensureBackendHistogram(kind);
  observe(hist, latencyMs);
}

/**
 * Record a successful dual-read comparison, updating delta histograms and counters.
 */
export function recordDualReadSuccess(sample: Readonly<{ scoreDelta: number; latencyDeltaMs: number; mismatch: boolean }>): void {
  samples += 1;
  if (sample.mismatch) mismatches += 1;
  observe(dualReadDeltaLatency, Math.abs(sample.latencyDeltaMs));
  observe(dualReadDeltaScore, Math.abs(sample.scoreDelta));
}

/**
 * Track a dual-read attempt that failed due to a shadow adapter error.
 */
export function recordDualReadShadowError(): void {
  samples += 1;
  shadowErrors += 1;
}

/**
 * Generate an immutable snapshot of the current dual-read metrics for external reporting.
 */
export function getDualReadMetricsSnapshot(): DualReadMetricsSnapshot {
  const backend = Object.fromEntries(
    Object.entries(backendLatency).map(([kind, hist]) => [kind, summarize(hist)])
  ) as DualReadMetricsSnapshot['backendLatency'];

  return {
    backendLatency: backend,
    dualRead: {
      samples,
      mismatches,
      shadowErrors,
      deltaScore: summarize(dualReadDeltaScore),
      deltaLatencyMs: summarize(dualReadDeltaLatency)
    }
  } as const;
}

/**
 * Reset all accumulated dual-read metrics, primarily for tests or benchmarking scenarios.
 */
export function resetDualReadMetrics(): void {
  for (const value of Object.values(backendLatency)) {
    resetHistogram(value);
  }
  for (const key of Object.keys(backendLatency) as RetrieverAdapterKind[]) {
    delete backendLatency[key];
  }
  resetHistogram(dualReadDeltaLatency);
  resetHistogram(dualReadDeltaScore);
  samples = 0;
  mismatches = 0;
  shadowErrors = 0;
}

function ensureBackendHistogram(kind: RetrieverAdapterKind): Histogram {
  const existing = backendLatency[kind];
  if (existing) return existing;
  const created = makeHistogram(LATENCY_BUCKETS);
  backendLatency[kind] = created;
  return created;
}

function makeHistogram(buckets: readonly number[]): Histogram {
  return { buckets: [...buckets], counts: new Array(buckets.length + 1).fill(0), sum: 0, count: 0 };
}

function resetHistogram(hist: Histogram): void {
  hist.count = 0;
  hist.sum = 0;
  hist.counts.fill(0);
}

function observe(hist: Histogram, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    return;
  }
  hist.sum += value;
  hist.count += 1;
  const idx = hist.buckets.findIndex((bucket) => value <= bucket);
  const bucketIndex = idx === -1 ? hist.counts.length - 1 : idx;
  hist.counts[bucketIndex] = (hist.counts[bucketIndex] ?? 0) + 1;
}

function summarize(hist: Histogram): HistogramSummary {
  if (hist.count === 0) {
    return { count: 0, p50: 0, p95: 0 } as const;
  }

  const cumulative: number[] = [];
  let acc = 0;
  for (const count of hist.counts) {
    acc += count;
    cumulative.push(acc);
  }

  const percentile = (p: number): number => {
    const target = p * hist.count;
    const idx = cumulative.findIndex((value) => value >= target);
    if (idx === -1) return hist.buckets[hist.buckets.length - 1] ?? 0;
    const bucketIdx = Math.min(idx, hist.buckets.length - 1);
    return hist.buckets[bucketIdx] ?? 0;
  };

  return { count: hist.count, p50: percentile(0.5), p95: percentile(0.95) } as const;
}
