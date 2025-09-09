import { ExtensionManifestSchema, type ExtensionManifest } from '@roler/schemas';
import { pathToFileURL } from 'node:url';
import semver from 'semver';

// Current published extensions API version (bump only on breaking changes)
export const extensionsApiVersion = '1.0.0' as const;
export type ExtensionsApiVersion = typeof extensionsApiVersion;

// Hook bundle types (narrow initial surface; actual hook fns are extension-provided)
export interface HookBundle {
  readonly normalize?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly retrievalEnrichment?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly preSaveValidate?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly preChatTurn?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly postModelDraft?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly postModeration?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
  readonly prePersistTurn?: ReadonlyArray<(...args: readonly unknown[]) => unknown>;
}

export interface CreatedExtension {
  readonly manifest: ExtensionManifest;
  readonly hooks: HookBundle;
}

// Validate manifest structurally using shared schema; semantic validation (semver etc) is deferred to loader layer.
export function createExtension(manifest: ExtensionManifest, hooks: HookBundle): CreatedExtension {
  const parsed = ExtensionManifestSchema.parse(manifest); // throws if invalid

  // Basic duplicate hook name detection inside provided hook arrays (structural sanity)
  const dupCheck = (arr: ReadonlyArray<(...args: readonly unknown[]) => unknown> | undefined, label: string): void => {
    if (!arr) return;
    const names = arr.map(fn => {
      const maybe = (fn as unknown as { readonly name?: unknown }).name;
      return typeof maybe === 'string' && maybe.length > 0 ? maybe : 'anonymous';
    });
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

export interface DiscoverOptions {
  readonly rootDir: string;
  readonly allowlist?: ReadonlyArray<string>;
}

export interface DiscoveredExtensionEntry {
  readonly packageName: string;
  readonly entryPath: string;
}

// Simple discovery: read package.json files beneath rootDir/packages/* looking for rolerExtension.entry
export async function discoverExtensions(opts: DiscoverOptions): Promise<readonly DiscoveredExtensionEntry[]> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  const found: DiscoveredExtensionEntry[] = [];
  // Note: pathToFileURL (used downstream) requires an absolute path.
  // Callers should pass an absolute opts.rootDir. We intentionally do not
  // auto-resolve here to avoid masking misconfigured callers.
  const packagesDir = path.join(opts.rootDir, 'packages');
  let entries: string[] = [];
  try {
    const items = await fs.readdir(packagesDir, { withFileTypes: true });
    entries = items.filter(d => d.isDirectory()).map(d => d.name);
  } catch {
    // ignore if no packages dir
  }

  const candidates = entries.filter(name => !opts.allowlist || opts.allowlist.includes(name));
  for (const pkgName of candidates) {
    const pkgJsonPath = path.join(packagesDir, pkgName, 'package.json');
    try {
      const raw = await fs.readFile(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(raw) as { name?: string; rolerExtension?: { entry?: string } };
      if (pkg.rolerExtension?.entry) {
  // entryPath is expected to be absolute if opts.rootDir is absolute.
  // loadExtensions converts via pathToFileURL without importing 'path'.
  const entryPath = path.join(packagesDir, pkgName, pkg.rolerExtension.entry);
        found.push({ packageName: pkg.name ?? pkgName, entryPath });
      }
    } catch {
      // ignore
    }
  }
  return found;
}

export interface RegisteredExtension {
  readonly manifest: ExtensionManifest;
  readonly entryPath: string;
  readonly disabled: boolean;
}

export interface LoadConfig {
  readonly rootDir: string;
  readonly coreApiVersion?: string;
  readonly allowlist?: ReadonlyArray<string>;
  readonly capabilityAllowlist?: ReadonlyArray<string>;
}

// Load, validate semver compatibility, apply capability allowlist, and deterministically sort.
export async function loadExtensions(cfg: LoadConfig): Promise<readonly RegisteredExtension[]> {
  const entries = await discoverExtensions({ rootDir: cfg.rootDir, allowlist: cfg.allowlist });
  const registry: RegisteredExtension[] = [];
  const path = await import('node:path');
  const fs = await import('node:fs/promises');
  const rootAbs = path.resolve(cfg.rootDir);
  const allowedExts = new Set<string>(['.js', '.mjs']);

  for (const ent of entries) {
  // dynamic import the entry module to read manifest export
  // pathToFileURL requires an absolute file system path; discoverExtensions returns
  // such paths when given an absolute rootDir (recommended).
    const entryAbs = path.resolve(ent.entryPath);
    // Constrain path to stay under the configured root (string check first).
    if (!(entryAbs === rootAbs || entryAbs.startsWith(rootAbs + path.sep))) {
      throw new Error(`EXT_IMPORT_OUTSIDE_ROOT: ${entryAbs}`);
    }
    // Only import JS modules from expected extensions
    const ext = path.extname(entryAbs).toLowerCase();
    if (!allowedExts.has(ext)) {
      throw new Error(`EXT_ENTRY_INVALID_EXT: ${entryAbs}`);
    }
    // Ensure file exists and resolve symlinks safely under root
    const lst = await fs.lstat(entryAbs).catch(() => null);
    if (!lst) {
      throw new Error(`EXT_ENTRY_NOT_FOUND: ${entryAbs}`);
    }
    let importFsPath = entryAbs;
    if (lst.isSymbolicLink()) {
      const real = await fs.realpath(entryAbs);
      if (!(real === rootAbs || real.startsWith(rootAbs + path.sep))) {
        throw new Error(`EXT_IMPORT_OUTSIDE_ROOT_REAL: ${real}`);
      }
      importFsPath = real;
    } else if (!lst.isFile()) {
      throw new Error(`EXT_ENTRY_NOT_FILE: ${entryAbs}`);
    }
    const mod = await import(pathToFileURL(importFsPath).href);
    const manifest: ExtensionManifest | undefined = (mod as Record<string, unknown>).manifest as ExtensionManifest | undefined;
    if (!manifest) continue; // skip if no manifest export
    const parsed = ExtensionManifestSchema.parse(manifest);

    // core API semver compatibility if host provided a version
    if (cfg.coreApiVersion && !semver.satisfies(semver.coerce(cfg.coreApiVersion) ?? cfg.coreApiVersion, parsed.coreApiRange)) {
      throw new Error(`EXT_VERSION_INCOMPATIBLE: ${parsed.id} requires core '${parsed.coreApiRange}', host '${cfg.coreApiVersion}'`);
    }

    // filter unsafe data class scopes / capabilities if allowlist provided
    let effective: ExtensionManifest = parsed;
    if (cfg.capabilityAllowlist && cfg.capabilityAllowlist.length > 0) {
      const allowed = new Set(cfg.capabilityAllowlist);
      const caps = parsed.capabilities.filter((c: string) => allowed.has(c));
      effective = { ...parsed, capabilities: caps };
    }

    registry.push(Object.freeze({ manifest: effective, entryPath: ent.entryPath, disabled: effective.killSwitchEnabled === false }));
  }

  // collision detection by id
  const ids = new Set<string>();
  for (const r of registry) {
    if (ids.has(r.manifest.id)) {
      throw new Error(`EXT_DUPLICATE_ID: ${r.manifest.id}`);
    }
    ids.add(r.manifest.id);
  }

  // peer dependency resolution: ensure required peers present with compatible versions
  const versionById = new Map<string, string>(registry.map(r => [r.manifest.id, r.manifest.version] as const));
  for (const r of registry) {
    for (const peer of r.manifest.peerExtensions ?? []) {
      const v = versionById.get(peer.id);
      if (!v || !semver.satisfies(semver.coerce(v) ?? v, peer.range)) {
        throw new Error(`EXT_PEER_UNRESOLVED: ${r.manifest.id} requires ${peer.id}@'${peer.range}'`);
      }
    }
  }

  // deterministic ordering: priority DESC then id ASC
  const ordered = [...registry].sort((a, b) => {
    const p = (b.manifest.priority ?? 0) - (a.manifest.priority ?? 0);
    return p !== 0 ? p : a.manifest.id.localeCompare(b.manifest.id);
  });

  return ordered;
}

// Minimal sample manifest (used in docs & tests)
export const sampleExtension = createExtension({
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
}, {});

export { composeStateTransactions } from './transactions.js';
export type {
  BaseHookContext,
  HookResult,
  NormalizationContext,
  NormalizationDelta,
  NormalizationHook,
  RetrievalContext,
  RetrievalAugmentation,
  RetrievalEnrichmentHook,
  EntityStateSnapshot,
  PreSaveValidationHook,
  PreChatTurnHook,
  PostModelDraftHook,
  PostModerationHook,
  PrePersistTurnHook,
} from './types.js';
