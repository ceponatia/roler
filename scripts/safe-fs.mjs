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

import crypto from 'node:crypto';
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
  // NOTE: asSafePath does not itself assert confinement; callers must still
  // pass the resulting path through createSafeFs methods which enforce realpath checks.
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
    // If target does not yet exist (e.g., for write), resolve up the parent chain until we find an existing directory
    let current = target;
    while (current !== path.dirname(current)) { // while not at root
      const parent = path.dirname(current);
      try {
        const parentReal = await fs.realpath(path.resolve(parent));
        // Reconstruct path using real parent + remaining relative path
        const remaining = path.relative(parent, target);
        return path.join(parentReal, remaining);
      } catch {
        current = parent;
      }
    }
    // If we reach here, nothing exists in the path
    throw new Error(`No existing parent directory found for: ${target}`);
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
    await checkHidden(real);
    await fs.mkdir(path.resolve(rootReal, path.dirname(real)), { recursive: true });
    return fs.open(path.resolve(real), 'w', 0o600);
  }

  /**
   * Atomically write a file (best-effort) by writing to a temp sibling then renaming.
   * Ensures confinement, hidden check, size guarding handled by caller (content size) if needed.
   * @param {string} p target path (absolute or relative to root)
   * @param {string|Uint8Array} data
   * @param {BufferEncoding} [enc]
      await fs.writeFile(tmp, data, { mode: 0o600, ...(typeof data === 'string' ? { encoding: enc } : {}) });
  async function writeFileSafe(p, data, enc = 'utf8') {
    const rootReal = await getRootReal();
    const real = await assertInsideRoot(rootReal, p);
    await checkHidden(real);
    const dir = path.dirname(real);
    await fs.mkdir(path.resolve(rootReal, dir), { recursive: true });
    const tmp = path.join(dir, `.__tmp_${path.basename(real)}_${crypto.randomUUID()}`);
    try {
      await fs.writeFile(tmp, data, { encoding: 'utf8', mode: 0o600 });
      await fs.rename(path.resolve(tmp), path.resolve(real));
    } catch (err) {
      try { await fs.rm(tmp, { force: true }); } catch { /* ignore cleanup failure */ }
      throw err;
    }
    return real;
  }

  return { statSafe, readFileSafe, readdirSafe, openForWriteSafe, writeFileSafe, asSafePath, assertInsideRoot };
}
