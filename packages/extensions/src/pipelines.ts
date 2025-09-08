import type { HydratedExtension, ExtensionHookFn } from './hooks-loader.js';

// Result type (simplified placeholder) – future: align with shared ExtensionError shape
export type HookResult<T> = { ok: true; value: T; meta?: Record<string, unknown> } | { ok: false; error: { code: string; message: string } };

export interface NormalizationContext { readonly entity: Record<string, unknown>; }
export interface RetrievalContext { readonly context: Record<string, unknown>; }
export interface ValidationContext { readonly candidate: Record<string, unknown>; }

export interface NormalizedEntityDelta { readonly changes: Record<string, unknown>; }
export interface RetrievalAugmentation { readonly additions: Record<string, unknown>; }
export interface ChatTurnPreparation { readonly additions: Record<string, unknown>; }
export interface ModelDraftAdjustment { readonly edits: Record<string, unknown>; }
export interface ModeratedAdjustment { readonly tags: Record<string, unknown>; }
export interface PrePersistOutput { readonly attachments: Record<string, unknown>; }

function ok<T>(value: T, meta?: Record<string, unknown>): HookResult<T> { return { ok: true, value, meta }; }
function err<T = never>(code: string, message: string): HookResult<T> { return { ok: false, error: { code, message } }; }

export interface PipelineOptions {
  readonly strict?: boolean; // if true, stop on first error
}

// Execute normalization hooks in order; earliest wins for conflicting keys (first-wins strategy initial implementation)
export async function runNormalization(
  exts: readonly HydratedExtension[],
  ctx: NormalizationContext,
  opts: PipelineOptions = {}
): Promise<HookResult<NormalizedEntityDelta>> {
  const strict = opts.strict ?? false;
  const changes: Record<string, unknown> = {};
  const seenKeys = new Set<string>();
  for (const ext of exts) {
    for (const fn of ext.hooks.normalize) {
      let out: unknown;
      try { out = await (fn as ExtensionHookFn)(ctx); } catch (e) { if (strict) return err('EXT_HOOK_FAILURE', (e as Error).message); else continue; }
      if (out && typeof out === 'object') {
        for (const [k, v] of Object.entries(out as Record<string, unknown>)) {
          if (seenKeys.has(k)) continue; // first-wins
            seenKeys.add(k);
            if (/^[a-zA-Z0-9_]+$/.test(k)) changes[k] = v;
        }
      }
    }
  }
  return ok({ changes });
}

// Retrieval enrichment merges shallow objects; later extensions can add new keys but cannot overwrite existing (first-wins for parity)
export async function runRetrievalEnrichment(
  exts: readonly HydratedExtension[],
  ctx: RetrievalContext,
  opts: PipelineOptions = {}
): Promise<HookResult<RetrievalAugmentation>> {
  const strict = opts.strict ?? false;
  const additions: Record<string, unknown> = {};
  const seen = new Set<string>();
  for (const ext of exts) {
    for (const fn of ext.hooks.retrievalEnrichment) {
      let out: unknown;
      try { out = await (fn as ExtensionHookFn)(ctx); } catch (e) { if (strict) return err('EXT_HOOK_FAILURE', (e as Error).message); else continue; }
      if (out && typeof out === 'object') {
        for (const [k, v] of Object.entries(out as Record<string, unknown>)) {
          if (seen.has(k)) continue;
          seen.add(k);
          if (typeof k === 'string' && /^[a-zA-Z0-9_]+$/.test(k)) additions[k] = v;
        }
      }
    }
  }
  return ok({ additions });
}

// Pre-save validation: any hook returning an error-like object aborts (strict) else collects errors; initial simplified contract
export async function runPreSaveValidation(
  exts: readonly HydratedExtension[],
  ctx: ValidationContext,
  opts: PipelineOptions = {}
): Promise<HookResult<void>> {
  const strict = opts.strict ?? true; // validation defaults to strict
  const errors: string[] = [];
  for (const ext of exts) {
    for (const fn of ext.hooks.preSaveValidate) {
      try {
        const out = await (fn as ExtensionHookFn)(ctx);
        if (isHookResultObject(out) && !out.ok) {
          const msg = out.error.message;
          if (strict) return err('EXT_HOOK_FAILURE', msg);
          errors.push(msg);
        }
      } catch (e) {
        if (strict) return err('EXT_HOOK_FAILURE', (e as Error).message);
        errors.push((e as Error).message);
      }
    }
  }
  if (errors.length && !strict) return err('EXT_HOOK_FAILURE', errors.join('; '));
  return ok(undefined);
}

// Chat pipelines: first-wins semantics for overlapping keys in additive maps.
export async function runPreChatTurn(
  exts: readonly HydratedExtension[],
  ctx: Record<string, unknown>,
  _opts: PipelineOptions = {}
): Promise<HookResult<ChatTurnPreparation>> {
  return genericFirstWins(exts, e => e.hooks.preChatTurn, ctx, k => k, v => v, (m) => ({ additions: m }));
}

export async function runPostModelDraft(
  exts: readonly HydratedExtension[],
  ctx: Record<string, unknown>,
  _opts: PipelineOptions = {}
): Promise<HookResult<ModelDraftAdjustment>> {
  return genericFirstWins(exts, e => e.hooks.postModelDraft, ctx, k => k, v => v, (m) => ({ edits: m }));
}

export async function runPostModeration(
  exts: readonly HydratedExtension[],
  ctx: Record<string, unknown>,
  _opts: PipelineOptions = {}
): Promise<HookResult<ModeratedAdjustment>> {
  return genericFirstWins(exts, e => e.hooks.postModeration, ctx, k => k, v => v, (m) => ({ tags: m }));
}

export async function runPrePersistTurn(
  exts: readonly HydratedExtension[],
  ctx: Record<string, unknown>,
  _opts: PipelineOptions = {}
): Promise<HookResult<PrePersistOutput>> {
  return genericFirstWins(exts, e => e.hooks.prePersistTurn, ctx, k => k, v => v, (m) => ({ attachments: m }));
}

async function genericFirstWins<TOut>(
  exts: readonly HydratedExtension[],
  getter: (e: HydratedExtension) => readonly ExtensionHookFn[],
  ctx: Record<string, unknown>,
  keyMap: (k: string) => string,
  valMap: (v: unknown) => unknown,
  wrap: (m: Record<string, unknown>) => TOut,
): Promise<HookResult<TOut>> {
  const collected: Record<string, unknown> = {};
  const seen = new Set<string>();
  for (const ext of exts) {
    for (const fn of getter(ext)) {
      let out: unknown;
      try { out = await fn(ctx); } catch { continue; }
      if (out && typeof out === 'object') {
        for (const [k, v] of Object.entries(out as Record<string, unknown>)) {
          const mappedK = keyMap(k);
            if (seen.has(mappedK)) continue;
            seen.add(mappedK);
            if (typeof mappedK === 'string' && /^[a-zA-Z0-9_]+$/.test(mappedK)) collected[mappedK] = valMap(v);
        }
      }
    }
  }
  return ok(wrap(collected));
}

interface ErrLike { readonly ok: false; readonly error: { readonly message: string }; }
interface OkLike { readonly ok: true; }
function isHookResultObject(v: unknown): v is ErrLike | OkLike {
  if (!v || typeof v !== 'object') return false;
  if (!('ok' in v)) return false;
  const okVal = (v as { ok: unknown }).ok;
  if (typeof okVal !== 'boolean') return false;
  if (okVal) return true;
  const errObj = (v as { error?: unknown }).error;
  return !!errObj && typeof errObj === 'object' && 'message' in errObj && typeof (errObj as { message: unknown }).message === 'string';
}
