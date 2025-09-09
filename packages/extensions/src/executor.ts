import type { BaseHookContext, HookResult } from './types.js';

export interface PipelineInputs {
  readonly normalize?: unknown;
  readonly retrievalEnrichment?: unknown;
  readonly preSaveValidate?: unknown;
  readonly preChatTurn?: unknown;
  readonly postModelDraft?: unknown;
  readonly postModeration?: unknown;
  readonly prePersistTurn?: unknown;
}

export interface PipelineOutputs {
  readonly normalize?: HookResult<unknown>;
  readonly retrievalEnrichment?: HookResult<unknown>;
  readonly preSaveValidate?: HookResult<void>;
  readonly preChatTurn?: HookResult<unknown>;
  readonly postModelDraft?: HookResult<unknown>;
  readonly postModeration?: HookResult<unknown>;
  readonly prePersistTurn?: HookResult<unknown>;
}

/**
 * No-op executor boundary. Keeps integration points stable while runtime is deferred.
 * Always returns empty successful results where applicable.
 */
export async function runPipelines(_ctx: BaseHookContext, _inputs: PipelineInputs): Promise<PipelineOutputs> {
  const ok = <T>(value: T): HookResult<T> => ({ ok: true as const, value });
  return {
    // Return minimal ok results; actual shapes will be refined when executor is implemented
    normalize: ok({}),
    retrievalEnrichment: ok({}),
    preSaveValidate: ok(undefined as unknown as void),
    preChatTurn: ok(undefined),
    postModelDraft: ok(undefined),
    postModeration: ok(undefined),
    prePersistTurn: ok(undefined),
  } as const;
}
