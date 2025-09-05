/*
  safe-fs.mjs
  Centralized constrained filesystem wrapper to mitigate non-literal fs usage warnings.
  All dynamic path interactions for scripts should flow through this module so that
  security rules (root confinement, symlink resolution, hidden path filtering, size caps)
  are consistently enforced and lint suppressions are localized.
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

async function assertUnderRoot(rootReal, target) {
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
    const real = await assertUnderRoot(rootReal, p);
    await checkHidden(real);
    const st = await fs.stat(real, { bigint: false });
    if (st.size > maxBytes) throw new Error(`File too large: ${st.size} > ${maxBytes}`);
    return st;
  }

  async function readFileSafe(p, enc = 'utf8') {
    const rootReal = await getRootReal();
    const real = await assertUnderRoot(rootReal, p);
    await checkHidden(real);
    const st = await fs.stat(real);
    if (st.size > maxBytes) throw new Error(`File too large: ${st.size} > ${maxBytes}`);
    return fs.readFile(real, enc);
  }

  async function readdirSafe(dir) {
    const rootReal = await getRootReal();
    const real = await assertUnderRoot(rootReal, dir);
    await checkHidden(real);
    const entries = await fs.readdir(real, { withFileTypes: true });
    return entries.filter(d => !(skipHidden && d.name.startsWith('.')));
  }

  async function openForWriteSafe(p) {
    const rootReal = await getRootReal();
    const real = await assertUnderRoot(rootReal, p);
    // Ensure parent dir exists; caller handles mkdir earlier if needed.
    return fs.open(real, 'w');
  }

  return { statSafe, readFileSafe, readdirSafe, openForWriteSafe, asSafePath };
}
