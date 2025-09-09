declare module '../../../scripts/safe-fs.mjs' {
  // Minimal opaque node types to avoid importing types in d.ts
  type _Stats = unknown;
  type _Dirent = unknown;
  type _FileHandle = unknown;
  export interface SafeFsFacade {
    statSafe(p: string): Promise<_Stats>;
    readFileSafe(p: string, enc?: BufferEncoding): Promise<string | Buffer>;
    readdirSafe(dir: string): Promise<_Dirent[]>;
    openForWriteSafe(p: string): Promise<_FileHandle>;
    writeFileSafe(p: string, data: string | Uint8Array, enc?: BufferEncoding): Promise<string>;
    asSafePath(root: string, p: string): string;
    assertInsideRoot(rootReal: string, target: string): Promise<string>;
  }
  export function createSafeFs(rootDir: string, opts?: { skipHidden?: boolean; maxBytes?: number }): SafeFsFacade;
  export function asSafePath(rootDir: string, p: string): string;
  export function assertInsideRoot(rootReal: string, target: string): Promise<string>;
}
