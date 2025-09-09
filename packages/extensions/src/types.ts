import type { StateTransaction } from '@roler/schemas';

export type Role = 'GM' | 'Player';

export interface BaseHookContext {
  readonly tenantId: string;
  readonly sessionId: string;
  readonly role: Role;
  readonly timeBudgetMs?: number;
  readonly tokenBudget?: number;
  readonly requestId: string;
}

export type HookOk<T> = { readonly ok: true; readonly value: T; readonly meta?: Readonly<Record<string, unknown>> };
export type HookErr = { readonly ok: false; readonly error: { readonly code: string; readonly message: string; readonly extensionId?: string; readonly hook?: string; readonly causes?: readonly unknown[]; readonly severity?: 'warn' | 'error' | 'fatal' } };
export type HookResult<T> = HookOk<T> | HookErr;

// Normalization
export interface NormalizationContext extends BaseHookContext {
  readonly entityKind: string;
}
export type NormalizationDelta = Readonly<Record<string, unknown>>;
export type NormalizationHook = (ctx: NormalizationContext) => HookResult<Partial<NormalizationDelta>> | Promise<HookResult<Partial<NormalizationDelta>>>;

// Retrieval enrichment
export interface RetrievalContext extends BaseHookContext {
  readonly query: string;
}
export type RetrievalAugmentation = Readonly<{ readonly snippets?: readonly string[]; readonly tags?: readonly string[] }>;
export type RetrievalEnrichmentHook = (ctx: RetrievalContext) => HookResult<RetrievalAugmentation> | Promise<HookResult<RetrievalAugmentation>>;

// Pre-save validation
export interface EntityStateSnapshot { readonly kind: string; readonly data: Readonly<Record<string, unknown>> }
export type PreSaveValidationHook = (candidate: EntityStateSnapshot) => HookResult<void> | Promise<HookResult<void>>;

// Chat-phase hooks
export type PreChatTurnHook = (ctx: BaseHookContext) => HookResult<unknown> | Promise<HookResult<unknown>>;
export type PostModelDraftHook = (ctx: BaseHookContext) => HookResult<unknown> | Promise<HookResult<unknown>>;
export type PostModerationHook = (ctx: BaseHookContext) => HookResult<unknown> | Promise<HookResult<unknown>>;
export type PrePersistTurnHook = (ctx: BaseHookContext) => HookResult<StateTransaction | void> | Promise<HookResult<StateTransaction | void>>;
