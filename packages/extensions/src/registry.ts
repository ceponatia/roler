import semver from 'semver';

import { discoverExtensions, type DiscoverOptions, type DiscoveredExtensionMeta } from './loader.js';

import type { ExtensionManifest } from '@roler/schemas';

export interface RegisteredExtension {
  readonly manifest: ExtensionManifest;
  readonly entry: string;
  // hooks will be hydrated later; placeholder for future pipeline wiring
}

export interface LoadExtensionsOptions extends DiscoverOptions {
  readonly coreApiVersion?: string; // host core extensions API version
  readonly failFast?: boolean; // if false, collect errors and return partial registry (default true)
}

export interface ExtensionRegistry {
  readonly extensions: readonly RegisteredExtension[];
  readonly errors: readonly RegistryError[];
}

export type RegistryErrorCode =
  | 'EXT_VERSION_INCOMPATIBLE'
  | 'EXT_DUPLICATE_ID'
  | 'EXT_PEER_UNRESOLVED';

export interface RegistryError {
  readonly code: RegistryErrorCode;
  readonly message: string;
  readonly extensionId?: string;
  readonly peerId?: string;
}

interface PeerReq { readonly id: string; readonly range: string; }

export async function loadExtensions(opts: LoadExtensionsOptions = {}): Promise<ExtensionRegistry> {
  const coreApiVersion = opts.coreApiVersion ?? '1.0.0'; // assumption: host sets this later
  const failFast = opts.failFast ?? true;
  const discovered = await discoverExtensions(opts);
  const errors: RegistryError[] = [];
  const byId = new Map<string, DiscoveredExtensionMeta>();

  for (const meta of discovered) {
    const id = meta.manifest.id;
    // duplicate id check
    if (byId.has(id)) {
      errors.push({ code: 'EXT_DUPLICATE_ID', message: `duplicate extension id '${id}'`, extensionId: id });
      if (failFast) return { extensions: freezeExts(byId), errors };
      continue;
    }
    // core API version compatibility
    if (!semver.satisfies(coreApiVersion, meta.manifest.coreApiRange, { includePrerelease: true })) {
      errors.push({ code: 'EXT_VERSION_INCOMPATIBLE', message: `core API version ${coreApiVersion} not in range ${meta.manifest.coreApiRange} for ${id}`, extensionId: id });
      if (failFast) return { extensions: freezeExts(byId), errors };
      continue;
    }
    byId.set(id, meta);
  }

  // Peer dependency validation (requires map finalized for remaining)
  for (const meta of byId.values()) {
    const peers = meta.manifest.peerExtensions as readonly PeerReq[]; // schema ensures shape
    for (const peer of peers) {
      const found = byId.get(peer.id);
      if (!found) {
        errors.push({ code: 'EXT_PEER_UNRESOLVED', message: `peer extension '${peer.id}' required by '${meta.manifest.id}' missing`, extensionId: meta.manifest.id, peerId: peer.id });
        if (failFast) return { extensions: freezeExts(byId), errors };
        continue;
      }
      if (!semver.satisfies(found.manifest.version, peer.range, { includePrerelease: true })) {
        errors.push({ code: 'EXT_PEER_UNRESOLVED', message: `peer extension '${peer.id}' version ${found.manifest.version} does not satisfy range ${peer.range} required by '${meta.manifest.id}'`, extensionId: meta.manifest.id, peerId: peer.id });
        if (failFast) return { extensions: freezeExts(byId), errors };
      }
    }
  }

  // Ordering: priority DESC then id ASC
  const ordered = [...byId.values()].sort((a, b) => {
    const pa = a.manifest.priority ?? 0;
    const pb = b.manifest.priority ?? 0;
    if (pa !== pb) return pb - pa;
    return a.manifest.id.localeCompare(b.manifest.id);
  });
  const registered: RegisteredExtension[] = ordered.map(m => Object.freeze({ manifest: m.manifest, entry: m.entry }));
  return { extensions: Object.freeze(registered), errors: Object.freeze(errors) };
}

function freezeExts(map: Map<string, DiscoveredExtensionMeta>): readonly RegisteredExtension[] {
  return Object.freeze([...map.values()].map(m => Object.freeze({ manifest: m.manifest, entry: m.entry })));
}
