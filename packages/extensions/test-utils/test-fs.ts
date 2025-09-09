import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Create an isolated temporary workspace directory under process.cwd().
 * The directory name is prefixed to ease cleanup. Returns absolute path.
 */
export async function createTempWorkspace(prefix: string): Promise<string> {
  // Sanitize the prefix to avoid path separators or traversal tokens in test inputs.
  const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9-_]/g, '');
  const baseName = `${sanitizedPrefix || 'tmp'}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  // Resolve against CWD and enforce confinement under it.
  const cwd = path.resolve(process.cwd());
  const base = path.resolve(cwd, baseName);
  if (!(base === cwd || base.startsWith(cwd + path.sep))) {
    throw new Error('path traversal detected when creating temp workspace');
  }
  await fs.rm(base, { recursive: true, force: true });
  await fs.mkdir(base, { recursive: true });
  return base;
}

/**
 * Write JSON using safe-fs (root confinement + hidden filtering bypassed for test clarity).
 */
export async function writeJson(root: string, rel: string, value: unknown): Promise<void> {
  // Constrain writes to stay within the provided root (tests control both inputs).
  if (path.isAbsolute(rel)) throw new Error('absolute rel path not allowed');
  const abs = path.resolve(root, rel);
  const rootAbs = path.resolve(root);
  if (!(abs === rootAbs || abs.startsWith(rootAbs + path.sep))) {
    throw new Error('path traversal detected');
  }
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, JSON.stringify(value, null, 2), 'utf8');
}

/**
 * Write a JS module file (string data) safely.
 */
export async function writeModule(root: string, rel: string, code: string): Promise<void> {
  // Constrain writes to stay within the provided root (tests control both inputs).
  if (path.isAbsolute(rel)) throw new Error('absolute rel path not allowed');
  const abs = path.resolve(root, rel);
  const rootAbs = path.resolve(root);
  if (!(abs === rootAbs || abs.startsWith(rootAbs + path.sep))) {
    throw new Error('path traversal detected');
  }
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, code, 'utf8');
}
