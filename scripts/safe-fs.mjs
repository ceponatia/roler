/*
  safe-fs.mjs
  Centralized constrained filesystem wrapper to mitigate non-literal fs usage warnings.
  All dynamic path interactions for scripts should flow through this module so that
  security rules (root confinement, symlink resolution, hidden path filtering, size caps)
  are consistently enforced and lint suppressions are localized.

  SECURITY RATIONALE:
  - All external (untrusted) input MUST be mapped to a path relative to a predetermined root.
  - realpath resolution + prefix check prevents path traversal (".." & symlink escapes).
  - Hidden segments optionally rejected to avoid leaking dotfiles/secrets by default.
  - File size capped to mitigate accidental large file ingestion (DoS vector).
  - This centralization allows us to justify eslint/semgrep non-literal fs path warnings.
*/

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @typedef {string & { readonly __brand: 'SafePath' }} SafePath
 */

/**
 * Brand a path after resolving it against a root directory.
 * Caller must ensure the provided relative/absolute path is intended.
 * The returned string is absolute.
 * @param {string} rootDir
 * @param {string} p
 * @returns {SafePath}
 */
export function asSafePath(rootDir, p) {
  const abs = path.resolve(rootDir, p);
  return /** @type {SafePath} */ (abs);
}

/**
 * Resolve target path ensuring it remains under root.
 * Exported for reuse in other scripts requiring explicit validation.
 * @param {string} rootReal pre-resolved realpath of root directory
 * @param {string} target path to validate (may or may not exist yet)
 * @returns {Promise<string>} real path (or constructed path under an existing parent)
 */
export async function assertInsideRoot(rootReal, target) {
  const targetReal = await fs.realpath(target).catch(async () => {
    // If target does not yet exist (e.g., for write), still resolve parent.
    const parent = path.dirname(target);
    const parentReal = await fs.realpath(parent);
    return path.join(parentReal, path.basename(target));
  });
  if (targetReal !== rootReal && !targetReal.startsWith(rootReal + path.sep)) {
    throw new Error(`Path escapes root: ${targetReal}`);
  }
  return targetReal;
}

/**
 * Create a safe fs facade bound to a root path.
 * @param {string} rootDir
 * @param {{ skipHidden?: boolean; maxBytes?: number }} [opts]
 */
export function createSafeFs(rootDir, { skipHidden = true, maxBytes = 5 * 1024 * 1024 } = {}) {
  let rootRealPromise = null;
  const getRootReal = () => (rootRealPromise ??= fs.realpath(rootDir));

  // Centralized dynamic path handling; security constraints enforced here.

  async function checkHidden(real) {
    if (skipHidden && real.split(path.sep).some(seg => seg.startsWith('.'))) {
      throw new Error(`Hidden path segment disallowed: ${real}`);
    }
  }

  async function statSafe(p) {
    const rootReal = await getRootReal();
    const real = await assertInsideRoot(rootReal, p);
    await checkHidden(real);
    const st = await fs.stat(real, { bigint: false });
    if (st.size > maxBytes) throw new Error(`File too large: ${st.size} > ${maxBytes}`);
    return st;
  }

  async function readFileSafe(p, enc = 'utf8') {
    const rootReal = await getRootReal();
    const real = await assertInsideRoot(rootReal, p);
    await checkHidden(real);
    const st = await fs.stat(real);
    if (st.size > maxBytes) throw new Error(`File too large: ${st.size} > ${maxBytes}`);
    return fs.readFile(real, enc);
  }

  async function readdirSafe(dir) {
    const rootReal = await getRootReal();
    const real = await assertInsideRoot(rootReal, dir);
    await checkHidden(real);
    const entries = await fs.readdir(real, { withFileTypes: true });
    return entries.filter(d => !(skipHidden && d.name.startsWith('.')));
  }

  async function openForWriteSafe(p) {
    const rootReal = await getRootReal();
    const real = await assertInsideRoot(rootReal, p);
    // Ensure parent dir exists; caller handles mkdir earlier if needed.
    return fs.open(real, 'w');
  }

  return { statSafe, readFileSafe, readdirSafe, openForWriteSafe, asSafePath, assertInsideRoot };
}
