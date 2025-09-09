// Type declarations for safe-fs.mjs central wrapper
// Narrow surface needed by tests currently.
import type { Stats, Dirent } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';

export interface SafeFsFacade {
  statSafe(p: string): Promise<Stats>;
  readFileSafe(p: string, enc?: BufferEncoding): Promise<string | Buffer>;
  readdirSafe(dir: string): Promise<Dirent[]>;
  openForWriteSafe(p: string): Promise<FileHandle>;
  writeFileSafe(p: string, data: string | Uint8Array, enc?: BufferEncoding): Promise<string>;
  asSafePath(root: string, p: string): string;
  assertInsideRoot(rootReal: string, target: string): Promise<string>;
}
export function createSafeFs(rootDir: string, opts?: { skipHidden?: boolean; maxBytes?: number }): SafeFsFacade;
export function asSafePath(rootDir: string, p: string): string;
export function assertInsideRoot(rootReal: string, target: string): Promise<string>;
