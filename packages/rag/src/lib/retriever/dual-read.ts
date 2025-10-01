import {
  recordBackendLatency,
  recordDualReadShadowError,
  recordDualReadSuccess
} from './dual-read-metrics.js';

import type { ScoreNormalizer } from './normalizer.js';
import type {
  DualReadShadowPlan,
  RetrieveOpts,
  RetrieveResult,
  Retriever,
  RetrieverAdapter,
  RetrieverAdapterKind
} from './types.js';
import type { Candidate } from '../scoring.js';

/** Absolute top-score delta that marks a variance event (aligned with histogram bucket boundaries). */
const SCORE_DELTA_VARIANCE_THRESHOLD = 0.2;
/** Absolute latency delta (ms) that marks a variance event for shadow comparisons. */
const LATENCY_DELTA_VARIANCE_THRESHOLD_MS = 80;

/**
 * Enumerates the reasons a dual-read variance alert may be emitted.
 *
 * - `score-delta`: Absolute score delta exceeded the configured threshold.
 * - `latency-delta`: Absolute latency delta exceeded the configured threshold.
 * - `mismatch`: Top candidate identifiers diverged between primary and shadow.
 * - `shadow-error`: Shadow adapter threw or rejected during comparison.
 */
export type VarianceCause = 'score-delta' | 'latency-delta' | 'mismatch' | 'shadow-error';

/**
 * Structured events emitted by the dual-read wrapper for observability and debugging hooks.
 */
export type DualReadEvent =
  | Readonly<{
      type: 'comparison';
      primaryKind: RetrieverAdapterKind;
      shadowKind: RetrieverAdapterKind;
      scoreDelta: number;
      latencyDeltaMs: number;
      mismatch: boolean;
    }>
  | Readonly<{
      type: 'shadow-error';
      adapterKind: RetrieverAdapterKind;
      error: unknown;
    }>
  | Readonly<{
      type: 'variance-high';
      code: 'RETR_DUAL_VARIANCE_HIGH';
      primaryKind: RetrieverAdapterKind;
      shadowKind: RetrieverAdapterKind;
      causes: readonly VarianceCause[];
      comparison?: Readonly<{
        scoreDelta: number;
        latencyDeltaMs: number;
        mismatch: boolean;
      }>;
      error?: unknown;
    }>;

/**
 * Scheduler interface used to control when asynchronous shadow comparison work executes.
 */
export type DualReadScheduler = (task: () => Promise<void>) => void;

/**
 * Dependency bag for creating a dual-read retriever around a primary and shadow adapter.
 */
export type DualReadWrapperDeps = Readonly<{
  primary: RetrieverAdapter;
  shadow: RetrieverAdapter;
  plan: DualReadShadowPlan;
  primaryNormalizer: ScoreNormalizer;
  shadowNormalizer: ScoreNormalizer;
  random?: () => number;
  schedule?: DualReadScheduler;
  onEvent?: (event: DualReadEvent) => void;
}>;

/**
 * Wrap a primary retriever with dual-read sampling against a shadow adapter, capturing variance metrics.
 */
export function createDualReadRetriever(deps: DualReadWrapperDeps): Retriever {
  const random = deps.random ?? Math.random;
  const schedule = deps.schedule ?? defaultScheduler;

  return {
    kind: deps.primary.kind,
    async retrieve(opts: RetrieveOpts): Promise<RetrieveResult> {
      const primaryPromise = deps.primary.retrieve(opts);
      const shouldSample = deps.plan.sampleRate > 0 && random() < deps.plan.sampleRate;
      const shadowPromise = shouldSample ? deps.shadow.retrieve(opts) : undefined;

      const primaryResult = await primaryPromise;
      recordBackendLatency(deps.primary.kind, primaryResult.vectorMs);
      const normalizedPrimary = deps.primaryNormalizer.normalize(primaryResult.candidates);
      const retrieverResult: RetrieveResult = {
        candidates: normalizedPrimary,
        vectorMs: primaryResult.vectorMs
      } as const;

      if (shadowPromise) {
        const primaryVectorMs = primaryResult.vectorMs;
        schedule(async () => {
          try {
            const shadowResult = await shadowPromise;
            recordBackendLatency(deps.shadow.kind, shadowResult.vectorMs);
            const normalizedShadow = deps.shadowNormalizer.normalize(shadowResult.candidates);
            const comparison = compareTopCandidates(normalizedPrimary, normalizedShadow);
            const latencyDeltaMs = shadowResult.vectorMs - primaryVectorMs;
            recordDualReadSuccess({
              scoreDelta: comparison.scoreDelta,
              latencyDeltaMs,
              mismatch: comparison.mismatch
            });
            const eventHandler = deps.onEvent;
            if (eventHandler) {
              const comparisonSnapshot = {
                scoreDelta: comparison.scoreDelta,
                latencyDeltaMs,
                mismatch: comparison.mismatch
              } as const;
              eventHandler({
                type: 'comparison',
                primaryKind: deps.primary.kind,
                shadowKind: deps.shadow.kind,
                ...comparisonSnapshot
              });
              const causes = detectComparisonVariance({
                scoreDelta: comparison.scoreDelta,
                latencyDeltaMs,
                mismatch: comparison.mismatch
              });
              emitVarianceAlert(eventHandler, {
                primaryKind: deps.primary.kind,
                shadowKind: deps.shadow.kind,
                causes,
                comparison: comparisonSnapshot
              });
            }
          } catch (error) {
            recordDualReadShadowError();
            const eventHandler = deps.onEvent;
            if (eventHandler) {
              eventHandler({ type: 'shadow-error', adapterKind: deps.shadow.kind, error });
              emitVarianceAlert(eventHandler, {
                primaryKind: deps.primary.kind,
                shadowKind: deps.shadow.kind,
                causes: ['shadow-error'] as const,
                error
              });
            }
          }
        });
      }

      return retrieverResult;
    }
  } satisfies Retriever;
}

function compareTopCandidates(primary: readonly Candidate[], shadow: readonly Candidate[]): Readonly<{
  scoreDelta: number;
  mismatch: boolean;
}> {
  const primaryTop = primary[0];
  const shadowTop = shadow[0];
  const primaryScore = primaryTop?.similarity ?? 0;
  const shadowScore = shadowTop?.similarity ?? 0;
  const mismatch = normalizeId(primaryTop?.chunkId) !== normalizeId(shadowTop?.chunkId);
  return {
    scoreDelta: Math.abs(primaryScore - shadowScore),
    mismatch
  } as const;
}

function normalizeId(value: Candidate['chunkId'] | undefined): string | null {
  return typeof value === 'string' ? value : null;
}

function detectComparisonVariance(sample: Readonly<{ scoreDelta: number; latencyDeltaMs: number; mismatch: boolean }>): readonly VarianceCause[] {
  const causes: VarianceCause[] = [];
  if (sample.mismatch) {
    causes.push('mismatch');
  }
  if (sample.scoreDelta > SCORE_DELTA_VARIANCE_THRESHOLD) {
    causes.push('score-delta');
  }
  if (Math.abs(sample.latencyDeltaMs) > LATENCY_DELTA_VARIANCE_THRESHOLD_MS) {
    causes.push('latency-delta');
  }
  return causes;
}

function emitVarianceAlert(
  handler: ((event: DualReadEvent) => void) | undefined,
  payload: Readonly<{
    primaryKind: RetrieverAdapterKind;
    shadowKind: RetrieverAdapterKind;
    causes: readonly VarianceCause[];
    comparison?: Readonly<{ scoreDelta: number; latencyDeltaMs: number; mismatch: boolean }>;
    error?: unknown;
  }>
): void {
  if (!handler) return;
  if (payload.causes.length === 0) return;
  handler({
    type: 'variance-high',
    code: 'RETR_DUAL_VARIANCE_HIGH',
    primaryKind: payload.primaryKind,
    shadowKind: payload.shadowKind,
    causes: Object.freeze([...payload.causes]) as readonly VarianceCause[],
    comparison: payload.comparison,
    error: payload.error
  });
}

const defaultScheduler: DualReadScheduler = (task) => {
  void task();
};
