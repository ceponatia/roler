/// <reference types="node" />
/* eslint-disable import/order */
import { ExtensionManifestSchema, type ExtensionManifest } from '@roler/schemas';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Dirent } from 'node:fs';

export interface DiscoveredExtensionMeta {
  readonly packageDir: string; // absolute
  readonly packageName: string;
  readonly manifest: ExtensionManifest;
  readonly entry: string; // resolved entry file
}

export interface DiscoverOptions {
  readonly rootDir?: string; // monorepo root (default process.cwd())
  readonly allowlist?: readonly string[]; // explicit package names to consider
  readonly manifestKey?: string; // package.json key containing extension config (default 'rolerExtension')
  readonly defaultEntrypoint?: string; // relative path fallback inside package (default 'dist/extension.js')
}

interface PackageJsonShape { name?: string; [k: string]: unknown; }

/**
 * Discover installed extension packages by scanning the workspace packages folder.
 * Heuristic: package.json contains the configured manifestKey OR package name is explicitly allowlisted.
 * Each candidate's entrypoint is dynamically imported to obtain an exported `manifest` object OR default export.
 * The manifest is validated structurally (semantic checks happen later in registry builder).
 */
export async function discoverExtensions(opts: DiscoverOptions = {}): Promise<readonly DiscoveredExtensionMeta[]> {
  const root = path.resolve(opts.rootDir ?? process.cwd());
  const manifestKey = opts.manifestKey ?? 'rolerExtension';
  const defaultEntrypoint = opts.defaultEntrypoint ?? 'dist/extension.js';
  const allow = new Set(opts.allowlist ?? []);
  const pkgsDir = path.join(root, 'packages');
  let entries: string[] = [];
  try {
    entries = (await fs.readdir(pkgsDir, { withFileTypes: true }))
      .filter((d: Dirent) => d.isDirectory())
      .map((d: Dirent) => d.name);
  } catch {
    // If no packages dir, return empty (graceful degradation)
    return [];
  }

  const discovered: DiscoveredExtensionMeta[] = [];

  for (const dirName of entries) {
    const pkgDir = path.join(pkgsDir, dirName);
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    let raw: string;
    try { raw = await fs.readFile(pkgJsonPath, 'utf8'); } catch { continue; }
    let pkg: PackageJsonShape;
    try { pkg = JSON.parse(raw); } catch { continue; }
    const name = pkg.name ?? dirName;
    const hasKey = Object.prototype.hasOwnProperty.call(pkg, manifestKey);
    if (!hasKey && !allow.has(name)) continue;
    // Determine entrypoint: explicit field value maybe object with entry or just boolean.
    // Accept forms: { "rolerExtension": { "entry": "dist/extension.js" } } or true / {} meaning defaultEntrypoint
    let entryRel = defaultEntrypoint;
    const keyValUnknown = (pkg as Record<string, unknown>)[manifestKey];
    if (keyValUnknown && typeof keyValUnknown === 'object' && typeof (keyValUnknown as { entry?: unknown }).entry === 'string') {
      entryRel = (keyValUnknown as { entry: string }).entry;
    }
    const entryAbs = path.join(pkgDir, entryRel);
    let mod: unknown;
    try {
      mod = await import(pathToFileURL(entryAbs).href);
    } catch {
      // Skip silently; could optionally collect error diagnostics
      continue;
    }
    const recordMod = mod as Record<string, unknown>;
    const manifestExport = recordMod.manifest ?? recordMod.default ?? (recordMod as Record<string, unknown>).manifestExport;
    if (!manifestExport) {
      continue; // no manifest present
    }
    let manifest: ExtensionManifest;
    try {
      manifest = ExtensionManifestSchema.parse(manifestExport);
    } catch {
      continue; // invalid structure -> skip (future: collect errors if failOpen)
    }
    discovered.push({ packageDir: pkgDir, packageName: name, manifest, entry: entryAbs });
  }

  return Object.freeze(discovered);
}
