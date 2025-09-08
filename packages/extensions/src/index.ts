import { ExtensionManifestSchema, type ExtensionManifest } from '@roler/schemas';

// Current published extensions API version (bump only on breaking changes)
export const extensionsApiVersion = '0.1.0';

// Hook bundle placeholder (will expand as execution engine implemented)
// Placeholder hook function signature; will be replaced with strongly typed
// variants once execution engine and context/value types are integrated.
export type GenericHookFn = (...args: readonly unknown[]) => unknown;

export interface HookBundle {
  readonly normalize?: readonly GenericHookFn[];
  readonly retrievalEnrichment?: readonly GenericHookFn[];
  readonly preSaveValidate?: readonly GenericHookFn[];
  readonly preChatTurn?: readonly GenericHookFn[];
  readonly postModelDraft?: readonly GenericHookFn[];
  readonly postModeration?: readonly GenericHookFn[];
  readonly prePersistTurn?: readonly GenericHookFn[];
}

export interface CreatedExtension {
  readonly manifest: ExtensionManifest;
  readonly hooks: HookBundle;
}

// Validate manifest structurally using shared schema; semantic validation (semver etc) is deferred to loader layer.
export function createExtension(manifest: ExtensionManifest, hooks: HookBundle): CreatedExtension {
  const parsed = ExtensionManifestSchema.parse(manifest); // throws if invalid
  // Basic duplicate hook name detection inside provided hook arrays (structural sanity)
  const dupCheck = (arr: readonly GenericHookFn[] | undefined, label: string): void => {
    if (!arr) return;
    const names = arr.map(fn => (typeof fn === 'function' && fn.name) ? fn.name : 'anonymous');
    const seen = new Set<string>();
    for (const n of names) {
      if (seen.has(n)) {
        throw new Error(`duplicate hook function name '${n}' in bundle section ${label}`);
      }
      seen.add(n);
    }
  };
  dupCheck(hooks.normalize, 'normalize');
  dupCheck(hooks.retrievalEnrichment, 'retrievalEnrichment');
  dupCheck(hooks.preSaveValidate, 'preSaveValidate');
  dupCheck(hooks.preChatTurn, 'preChatTurn');
  dupCheck(hooks.postModelDraft, 'postModelDraft');
  dupCheck(hooks.postModeration, 'postModeration');
  dupCheck(hooks.prePersistTurn, 'prePersistTurn');
  return Object.freeze({ manifest: parsed, hooks: { ...hooks } });
}

// Re-export schema types for convenience
export type { ExtensionManifest } from '@roler/schemas';

// Minimal sample manifest (used in docs & tests)
export const sampleExtension = createExtension(
  {
    id: 'sample-ext',
    name: 'Sample Extension',
    version: '0.1.0',
    description: 'Demonstration manifest only',
    coreApiRange: '^1.0.0',
  capabilities: ['demo'],
  peerExtensions: [],
  priority: 0,
  concurrencyLimit: 4,
  killSwitchEnabled: true,
  stateTransactionSupport: false,
  },
  {}
);

export { discoverExtensions, type DiscoverOptions, type DiscoveredExtensionMeta } from './loader.js';
export { loadExtensions, type LoadExtensionsOptions, type ExtensionRegistry, type RegisteredExtension, type RegistryError, type RegistryErrorCode } from './registry.js';
export { hydrateHooks, type HydratedExtension, type HookHydrationOptions } from './hooks-loader.js';
export { runNormalization, runRetrievalEnrichment, runPreSaveValidation, type NormalizationContext, type RetrievalContext, type ValidationContext, type NormalizedEntityDelta, type RetrievalAugmentation, type HookResult } from './pipelines.js';
export { runPreChatTurn, runPostModelDraft, runPostModeration, runPrePersistTurn, type ChatTurnPreparation, type ModelDraftAdjustment, type ModeratedAdjustment, type PrePersistOutput } from './pipelines.js';
