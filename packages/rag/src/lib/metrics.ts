// Lightweight in-memory counters and HDR-style histograms (fixed bins) for retrieval

import {
  getDualReadMetricsSnapshot,
  resetDualReadMetrics
} from './retriever/dual-read-metrics.js';

import type { DualReadMetricsSnapshot } from './retriever/dual-read-metrics.js';

export type CounterKeys =
  | 'retrieval_total'
  | 'retrieval_cache_hit'
  | 'retrieval_cache_miss'
  | 'retrieval_adaptive_used'
  | 'retrieval_partial';

export type HistoKeys = 'latency_total_ms' | 'latency_vector_ms' | 'latency_post_ms' | 'latency_cache_ms';

type Counters = Record<CounterKeys, number>;

type Histogram = {
  readonly buckets: readonly number[]; // upper bounds
  counts: number[];
  sum: number;
  count: number;
};

type Histograms = Record<HistoKeys, Histogram>;

const defaultBuckets = [5, 10, 20, 40, 80, 160, 320, 640, 1280, 2560] as const;

const counters: Counters = {
  retrieval_total: 0,
  retrieval_cache_hit: 0,
  retrieval_cache_miss: 0,
  retrieval_adaptive_used: 0,
  retrieval_partial: 0
};

const histos: Histograms = {
  latency_total_ms: makeHistogram(),
  latency_vector_ms: makeHistogram(),
  latency_post_ms: makeHistogram(),
  latency_cache_ms: makeHistogram()
};

export function incCounter(key: CounterKeys, by = 1): void {
  counters[key] += by;
}

export function observe(key: HistoKeys, value: number): void {
  const h = histos[key];
  h.sum += value;
  h.count += 1;
  const idx = h.buckets.findIndex((b) => value <= b);
  const bIdx = idx === -1 ? h.counts.length - 1 : idx;
  h.counts[bIdx] = (h.counts[bIdx] ?? 0) + 1;
}

export type MetricsSnapshot = Readonly<{
  counters: Readonly<Counters>;
  histograms: Readonly<Record<HistoKeys, { readonly p50: number; readonly p95: number; readonly count: number }>>;
  dualRead: DualReadMetricsSnapshot;
}>;

export function getRetrievalMetricsSnapshot(): MetricsSnapshot {
  const hist = Object.fromEntries(
    (Object.keys(histos) as HistoKeys[]).map((k) => [k, quantiles(histos[k])])
  ) as MetricsSnapshot['histograms'];
  return { counters: { ...counters }, histograms: hist, dualRead: getDualReadMetricsSnapshot() } as const;
}

export function resetMetrics(): void {
  for (const k of Object.keys(counters) as CounterKeys[]) counters[k] = 0;
  for (const k of Object.keys(histos) as HistoKeys[]) {
    const h = histos[k];
    h.counts.fill(0);
    h.sum = 0;
    h.count = 0;
  }
  resetDualReadMetrics();
}

export type MetricDatum = Readonly<{
  name: string;
  value: number;
  labels?: Readonly<Record<string, string>>;
}>;

const HISTOGRAM_METRIC_NAMES: Record<HistoKeys, string> = {
  latency_total_ms: 'retr_latency_total_ms',
  latency_vector_ms: 'retr_latency_vector_ms',
  latency_post_ms: 'retr_latency_post_ms',
  latency_cache_ms: 'retr_latency_cache_ms'
};

const COUNTER_METRIC_NAMES: Record<CounterKeys, string> = {
  retrieval_total: 'retrieval_total',
  retrieval_cache_hit: 'retrieval_cache_hit',
  retrieval_cache_miss: 'retrieval_cache_miss',
  retrieval_adaptive_used: 'retrieval_adaptive_used',
  retrieval_partial: 'retrieval_partial'
};

export function getRetrievalMetricSeries(): readonly MetricDatum[] {
  const snapshot = getRetrievalMetricsSnapshot();
  const metrics: MetricDatum[] = [];

  for (const key of Object.keys(snapshot.counters) as CounterKeys[]) {
    pushMetric(metrics, COUNTER_METRIC_NAMES[key], snapshot.counters[key]);
  }

  for (const key of Object.keys(snapshot.histograms) as HistoKeys[]) {
    const hist = snapshot.histograms[key];
    const baseName = HISTOGRAM_METRIC_NAMES[key];
    pushMetric(metrics, baseName, hist.p50, { quantile: 'p50' });
    pushMetric(metrics, baseName, hist.p95, { quantile: 'p95' });
    pushMetric(metrics, `${baseName}_samples_total`, hist.count);
  }

  const { backendLatency, dualRead } = snapshot.dualRead;
  for (const [backend, hist] of Object.entries(backendLatency)) {
    if (!hist) continue;
    pushMetric(metrics, 'retr_backend_latency_ms', hist.p50, { backend, quantile: 'p50' });
    pushMetric(metrics, 'retr_backend_latency_ms', hist.p95, { backend, quantile: 'p95' });
    pushMetric(metrics, 'retr_backend_latency_samples_total', hist.count, { backend });
  }

  const { deltaLatencyMs, deltaScore, samples, mismatches, shadowErrors } = dualRead;
  pushMetric(metrics, 'retr_dual_delta_latency_ms', deltaLatencyMs.p50, { quantile: 'p50' });
  pushMetric(metrics, 'retr_dual_delta_latency_ms', deltaLatencyMs.p95, { quantile: 'p95' });
  pushMetric(metrics, 'retr_dual_delta_latency_samples_total', deltaLatencyMs.count);

  pushMetric(metrics, 'retr_dual_delta_score', deltaScore.p50, { quantile: 'p50' });
  pushMetric(metrics, 'retr_dual_delta_score', deltaScore.p95, { quantile: 'p95' });
  pushMetric(metrics, 'retr_dual_delta_score_samples_total', deltaScore.count);

  pushMetric(metrics, 'retr_dual_samples_total', samples);
  pushMetric(metrics, 'retr_dual_mismatch_total', mismatches);
  pushMetric(metrics, 'retr_dual_shadow_errors_total', shadowErrors);

  return metrics;
}

function pushMetric(
  metrics: MetricDatum[],
  name: string,
  value: number,
  labels?: Readonly<Record<string, string>>
): void {
  if (!Number.isFinite(value)) return;
  const entry: MetricDatum = labels ? { name, value, labels: Object.freeze({ ...labels }) } : { name, value };
  metrics.push(entry);
}

function makeHistogram(): Histogram {
  return { buckets: [...defaultBuckets], counts: new Array(defaultBuckets.length + 1).fill(0), sum: 0, count: 0 };
}

function quantiles(h: Histogram): { p50: number; p95: number; count: number } {
  if (h.count === 0) return { p50: 0, p95: 0, count: 0 };
  const cum = [] as number[];
  let acc = 0;
  for (const c of h.counts) {
    acc += c;
    cum.push(acc);
  }
  const q = (p: number): number => {
    const target = p * h.count;
    const idx = cum.findIndex((c) => c >= target);
    if (idx === -1) return h.buckets[h.buckets.length - 1] ?? 0;
    const bi = Math.min(idx, h.buckets.length - 1);
    return h.buckets[bi] ?? 0;
  };
  return { p50: q(0.5), p95: q(0.95), count: h.count };
}
