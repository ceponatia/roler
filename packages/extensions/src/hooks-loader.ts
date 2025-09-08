import { pathToFileURL } from 'node:url';

import type { RegisteredExtension } from './registry.js';

// Generic hook function type placeholder (will be replaced with concrete typed contexts later)
export type ExtensionHookFn = (...args: readonly unknown[]) => unknown;

export interface HydratedExtension extends RegisteredExtension {
  readonly hooks: {
    readonly normalize: readonly ExtensionHookFn[];
    readonly retrievalEnrichment: readonly ExtensionHookFn[];
    readonly preSaveValidate: readonly ExtensionHookFn[];
  readonly preChatTurn: readonly ExtensionHookFn[];
  readonly postModelDraft: readonly ExtensionHookFn[];
  readonly postModeration: readonly ExtensionHookFn[];
  readonly prePersistTurn: readonly ExtensionHookFn[];
  };
}

export interface HookHydrationOptions {
  readonly strict?: boolean; // if true, missing hook export is an error (throws); else skipped silently
}

/**
 * Load hook function exports for each registered extension according to its manifest.hooks declarations.
 * Only the three core pipelines are implemented in this phase (normalization, retrievalEnrichment, preSaveValidate).
 * Chat-phase and state transaction hooks will be added in subsequent iterations.
 */
export async function hydrateHooks(
  exts: readonly RegisteredExtension[],
  opts: HookHydrationOptions = {}
): Promise<readonly HydratedExtension[]> {
  const strict = opts.strict ?? false;
  const hydrated: HydratedExtension[] = [];
  for (const ext of exts) {
    const manifestHooks = ext.manifest.hooks ?? {};
    const moduleUrl = pathToFileURL(ext.entry).href;
    let mod: Record<string, unknown>;
    try {
      mod = (await import(moduleUrl.startsWith('file://') ? moduleUrl : '')) as Record<string, unknown>;
    } catch (e) {
      if (strict) throw new Error(`failed to import extension entry for ${ext.manifest.id}: ${(e as Error).message}`);
      continue;
    }
    const loadGroup = (names: readonly string[] | undefined): ExtensionHookFn[] => {
      if (!names) return [];
      const arr: ExtensionHookFn[] = [];
      for (const n of names) {
        const fn = mod[n];
        if (typeof fn === 'function') arr.push(fn as ExtensionHookFn);
        else if (strict) throw new Error(`missing hook export '${n}' in ${ext.manifest.id}`);
      }
      return arr;
    };
    const normalize = loadGroup(manifestHooks.normalize);
    const retrievalEnrichment = loadGroup(manifestHooks.retrievalEnrichment);
    const preSaveValidate = loadGroup(manifestHooks.preSaveValidate);
    const chatH = ext.manifest.chatHooks ?? {};
    const preChatTurn = loadGroup(chatH.preChatTurn);
    const postModelDraft = loadGroup(chatH.postModelDraft);
    const postModeration = loadGroup(chatH.postModeration);
    const prePersistTurn = loadGroup(chatH.prePersistTurn);
    hydrated.push(Object.freeze({
      manifest: ext.manifest,
      entry: ext.entry,
      hooks: Object.freeze({ normalize, retrievalEnrichment, preSaveValidate, preChatTurn, postModelDraft, postModeration, prePersistTurn })
    }));
  }
  return Object.freeze(hydrated);
}
