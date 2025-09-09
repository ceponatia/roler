export interface HookBudget { readonly maxTokens?: number; readonly maxLatencyMs?: number }

export const DefaultHookBudgets: Readonly<Record<string, HookBudget>> = Object.freeze({
  normalization: { maxLatencyMs: 50 },
  retrievalEnrichment: { maxLatencyMs: 30 },
  preSaveValidate: { maxLatencyMs: 40 },
  preChatTurn: { maxLatencyMs: 40 },
  postModelDraft: { maxLatencyMs: 25 },
  postModeration: { maxLatencyMs: 20 },
  prePersistTurn: { maxLatencyMs: 30 },
});

export function effectiveHookBudget(hookName: string, manifestBudgets?: Readonly<Record<string, HookBudget>>): HookBudget {
  const base = DefaultHookBudgets[hookName] ?? {};
  const override = manifestBudgets?.[hookName] ?? {};
  const maxLatencyMs = override.maxLatencyMs ?? base.maxLatencyMs;
  const maxTokens = override.maxTokens ?? base.maxTokens;
  return { maxLatencyMs, maxTokens };
}
