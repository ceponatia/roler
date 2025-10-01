import { createDualReadRetriever } from './dual-read.js';
import { createScoreNormalizer } from './normalizer.js';
import {
  parseRetrieverConfig,
  resolveAdapterFactory
} from './types.js';

import type { ScoreNormalizer } from './normalizer.js';
import type {
  ParsedRetrieverConfig,
  RetrieveOpts,
  RetrieveResult,
  Retriever,
  RetrieverAdapter,
  RetrieverAdapterConfig,
  RetrieverFactoryRegistry
} from './types.js';

/**
 * Dependencies required to instantiate a configured retriever.
 */
export type CreateRetrieverDeps = Readonly<{
  registry: RetrieverFactoryRegistry;
  config: unknown;
}>;

/**
 * Immutable description of the retriever assets constructed from configuration.
 */
export type RetrieverFactoryResult = Readonly<{
  retriever: Retriever;
  primary: RetrieverAdapter;
  shadow?: RetrieverAdapter;
  parsedConfig: ParsedRetrieverConfig;
}>;

/**
 * Construct the primary retriever, optional shadow adapter, and normalization utilities from config.
 */
export function createRetriever(deps: CreateRetrieverDeps): RetrieverFactoryResult {
  const parsed = parseRetrieverConfig(deps.config);
  const primary = buildAdapter(parsed.primary, deps.registry);
  const primaryNormalizer = createScoreNormalizer(parsed.normalization, primary.kind);
  const dualRead = parsed.dualRead;

  if (dualRead && dualRead.sampleRate > 0) {
    const shadow = buildAdapter(dualRead.shadow, deps.registry);
    const shadowNormalizer = createScoreNormalizer(parsed.normalization, shadow.kind);
    const retriever = createDualReadRetriever({
      primary,
      shadow,
      plan: dualRead,
      primaryNormalizer,
      shadowNormalizer
    });
    return Object.freeze({ retriever, primary, shadow, parsedConfig: parsed });
  }

  const retriever = wrapWithNormalizer(primary, primaryNormalizer);
  return Object.freeze({ retriever, primary, parsedConfig: parsed });
}

function buildAdapter(config: RetrieverAdapterConfig, registry: RetrieverFactoryRegistry): RetrieverAdapter {
  const factory = resolveAdapterFactory(config.kind, registry);
  const adapter = factory(config);
  if (adapter.kind !== config.kind) {
    throw new Error(`Adapter kind mismatch: expected "${config.kind}" got "${adapter.kind}"`);
  }
  return adapter;
}

function wrapWithNormalizer(adapter: RetrieverAdapter, normalizer: ScoreNormalizer): Retriever {
  return {
    kind: adapter.kind,
    async retrieve(opts: RetrieveOpts): Promise<RetrieveResult> {
      const result = await adapter.retrieve(opts);
      const normalized = normalizer.normalize(result.candidates);
      return { candidates: normalized, vectorMs: result.vectorMs } as const;
    }
  } satisfies Retriever;
}
