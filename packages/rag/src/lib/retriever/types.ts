import {
  DualReadConfigSchema,
  RetrieverAdapterConfigSchema,
  RetrieverConfigSchema,
  type DualReadConfig,
  type RetrieverAdapterConfig,
  type RetrieverNormalizationConfig
} from '@roler/schemas';

import type { Candidate } from '../scoring.js';

export type RetrieverVector = ReadonlyArray<number>;

export type RetrieverFilters = Readonly<Record<string, string | number | boolean>>;

export type RetrieveOpts = Readonly<{
  embedding: RetrieverVector;
  k: number;
  namespace?: string;
  filters?: RetrieverFilters;
}>;

export type RetrieveResult = Readonly<{
  candidates: readonly Candidate[];
  vectorMs: number;
}>;

export type RetrieverAdapterKind = RetrieverAdapterConfig['kind'];

export interface Retriever {
  readonly kind: RetrieverAdapterKind;
  retrieve(opts: RetrieveOpts): Promise<RetrieveResult>;
}

export interface RetrieverAdapter extends Retriever {
  readonly config: RetrieverAdapterConfig;
}

export type RetrieverAdapterFactory = (config: RetrieverAdapterConfig) => RetrieverAdapter;

export type RetrieverFactoryRegistry = Readonly<Partial<Record<RetrieverAdapterKind, RetrieverAdapterFactory>>>;

export type DualReadShadowPlan = Readonly<{
  sampleRate: number;
  shadow: RetrieverAdapterConfig;
}>;

export type NormalizationPlan = Readonly<{
  strategy: RetrieverNormalizationConfig['strategy'];
  targetRange: RetrieverNormalizationConfig['targetRange'];
}>;

export type ParsedRetrieverConfig = Readonly<{
  primary: RetrieverAdapterConfig;
  dualRead?: DualReadShadowPlan;
  normalization: NormalizationPlan;
}>;

export function parseRetrieverConfig(input: unknown): ParsedRetrieverConfig {
  const cfg = RetrieverConfigSchema.parse(input);
  const dualRead = cfg.dualRead.enabled && cfg.dualRead.shadow
    ? { sampleRate: cfg.dualRead.sampleRate, shadow: cfg.dualRead.shadow }
    : undefined;
  return Object.freeze({
    primary: cfg.primary,
    dualRead,
    normalization: cfg.normalization
  });
}

export function assertAdapterConfig(config: unknown): asserts config is RetrieverAdapterConfig {
  RetrieverAdapterConfigSchema.parse(config);
}

export function assertDualReadConfig(config: unknown): asserts config is DualReadConfig {
  DualReadConfigSchema.parse(config);
}

export function resolveAdapterFactory(
  kind: RetrieverAdapterKind,
  registry: RetrieverFactoryRegistry
): RetrieverAdapterFactory {
  const factory = registry[kind];
  if (!factory) {
    throw new Error(`No retriever adapter registered for kind "${kind}"`);
  }
  return factory;
}

export type { RetrieverAdapterConfig } from '@roler/schemas';
