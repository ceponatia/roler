import { beforeEach, vi } from 'vitest';

// Brand-agnostic helpers (no package deps)
export type CandidateLike = Readonly<{
  chunkId: string;
  entityId: string;
  similarity: number;
  updatedAt: string;
  diversityBoost?: number;
}>;

export type RetrieveResultLike<TCandidate extends CandidateLike> = Readonly<{
  candidates: readonly TCandidate[];
  vectorMs: number;
}>;

export interface RetrieverLike<TCandidate extends CandidateLike> {
  retrieve(opts: Readonly<Record<string, unknown>>): Promise<RetrieveResultLike<TCandidate>>;
}

// Type-safe ULID/ISO casters for test data
export const ULID = (s: string) => s as unknown as string;
export const ISO = (s: string) => s as unknown as string;

// Candidate factory
export function cand<T extends CandidateLike = CandidateLike>(
  id: string,
  ent: string,
  sim: number,
  updated: string = '2024-06-01T00:00:00.000Z'
): T {
  return { chunkId: ULID(id), entityId: ULID(ent), similarity: sim, updatedAt: ISO(updated) } as unknown as T;
}

// Simple retriever that returns provided rows with fixed vectorMs
export function makeRetriever<TCandidate extends CandidateLike>(
  rows: readonly TCandidate[],
  vectorMs = 5
): RetrieverLike<TCandidate> {
  return { async retrieve() { return { candidates: rows, vectorMs }; } };
}

// Run a function with fake argv
export async function withArgs<T>(args: readonly string[], run: () => Promise<T>): Promise<T> {
  const orig = process.argv;
  process.argv = ['node', '/tmp/bench.js', ...args];
  try {
    return await run();
  } finally {
    process.argv = orig;
  }
}

// Capture console.log into an array; returns [logs, restore]
export function captureLogs(): { logs: string[]; restore: () => void } {
  const logs: string[] = [];
  const spy = vi.spyOn(console, 'log').mockImplementation((...a: unknown[]) => {
    logs.push(String(a[0] ?? ''));
  });
  return { logs, restore: () => spy.mockRestore() };
}

// Reset metrics and register automatic beforeEach cleanup for suites that opt-in
export function setupMetricsReset(reset?: () => void): void {
  beforeEach(() => {
    if (reset) reset();
  });
}
