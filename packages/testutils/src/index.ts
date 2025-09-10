import { resetMetrics as resetMetricsImpl } from '@roler/rag';
import { beforeEach, vi } from 'vitest';

import type { Retriever, Candidate, IsoDateTime, Ulid } from '@roler/rag';

// Type-safe ULID/ISO casters for test data
export const ULID = (s: string) => s as unknown as Ulid;
export const ISO = (s: string) => s as unknown as IsoDateTime;

// Candidate factory
export function cand(id: string, ent: string, sim: number, updated: string = '2024-06-01T00:00:00.000Z'): Candidate {
  return { chunkId: ULID(id), entityId: ULID(ent), similarity: sim, updatedAt: ISO(updated) };
}

// Simple retriever that returns provided rows with fixed vectorMs
export function makeRetriever(rows: readonly Candidate[], vectorMs = 5): Retriever {
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
export function setupMetricsReset(): void {
  beforeEach(() => {
    resetMetricsImpl();
  });
}

export const resetMetrics = resetMetricsImpl;
