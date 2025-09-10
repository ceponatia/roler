/*
 Benchmark harness for R-002 retrieval orchestrator
 - Runs N iterations with configurable mode (hit|miss|mixed)
 - Reports p50/p95/p99, partial rate, and basic counters from metrics snapshot
 - Optional gate: exit 1 if p95 > threshold
*/

import { UlidSchema } from '@roler/schemas';
import process from 'node:process';

import { getRetrievalMetricsSnapshot, resetMetrics } from '../lib/metrics.js';
import { createRetrievalOrchestrator } from '../lib/orchestrator.js';
import { createQueryResultCache } from '../lib/query-result-cache.js';

import type { Retriever } from '../lib/retriever.js';
import type { Candidate, IsoDateTime, Ulid } from '../lib/scoring.js';
import type { RetrievalConfig } from '@roler/schemas';

type Mode = 'hit' | 'miss' | 'mixed';

type Args = Readonly<{
  n: number;
  mode: Mode;
  limit: number;
  baseK: number;
  maxKBoost: number;
  softMs: number;
  gateP95?: number;
  vectorMs: number;
}>;

function parseArgs(argv: readonly string[]): Args {
  const get = (name: string, d?: string): string | undefined => {
    const idx = argv.findIndex((a) => a === `--${name}`);
    if (idx !== -1 && idx + 1 < argv.length) return argv[idx + 1];
    return d;
  };
  const asInt = (s: string | undefined, d: number) => {
    const v = s ? Number.parseInt(s, 10) : d;
    return Number.isFinite(v) ? v : d;
  };
  const n = asInt(get('n'), 200);
  const mode = (get('mode', 'miss') as Mode) ?? 'miss';
  const limit = asInt(get('limit'), 8);
  const baseK = asInt(get('baseK'), 32);
  const maxKBoost = asInt(get('maxKBoost'), 16);
  const softMs = asInt(get('soft'), 180);
  const vectorMs = asInt(get('vectorMs'), 5);
  const gateP95 = (() => {
    const raw = get('gate-p95');
    if (!raw) return undefined;
    const v = Number.parseInt(raw, 10);
    return Number.isFinite(v) ? v : undefined;
  })();
  return { n, mode, limit, baseK, maxKBoost, softMs, gateP95, vectorMs } as const;
}

const asUlid = (s: string) => s as unknown as Ulid;
const ISO = (s: string) => s as unknown as IsoDateTime;

function makeCandidate(id: string, ent: string, sim: number, updated: string): Candidate {
  return { chunkId: asUlid(id), entityId: asUlid(ent), similarity: sim, updatedAt: ISO(updated) };
}

function makeRows(count: number): readonly Candidate[] {
  const rows: Candidate[] = [];
  const baseDate = Date.parse('2024-06-01T00:00:00.000Z');
  for (let i = 0; i < count; i++) {
    const ent = `01HYA7Y3KZJ5MNS4AE8Q9R2B${(10 + (i % 16)).toString(36).toUpperCase()}`; // 16 distinct entities
    const id = `01HYA7Y3KZJ5MNS4AE8Q9R2BA${(i % 36).toString(36).toUpperCase()}`;
    const sim = 0.6 + (i % 10) / 100; // 0.6..0.69
    const dt = new Date(baseDate + (i % 7) * 86400000).toISOString();
    rows.push(makeCandidate(id, ent, sim, dt));
  }
  return rows;
}

function makeRetriever(rows: readonly Candidate[], vectorMs: number): Retriever {
  return {
    async retrieve(opts) {
      // simulate vector time budget
      await new Promise((r) => setTimeout(r, vectorMs));
      const k = Math.min(opts.k, rows.length);
      return { candidates: rows.slice(0, k), vectorMs } as const;
    }
  };
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  const rows = makeRows(Math.max(args.baseK + args.maxKBoost, 64));
  const retriever = makeRetriever(rows, args.vectorMs);
  const embedder = async () => [0.01, 0.02];
  const cache = createQueryResultCache(1000);

  const baseConfig: Partial<RetrievalConfig> = {
    baseK: args.baseK,
    maxKBoost: args.maxKBoost,
    softPartialDeadlineMs: args.softMs
  };

  const orch = createRetrievalOrchestrator({ retriever, embedder, queryCache: cache, now: () => performance.now() }, baseConfig);

  const G = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';
  const times: number[] = [];
  let partials = 0;

  resetMetrics();

  // Prewarm cache if hit mode
  if (args.mode === 'hit') {
    const gid = UlidSchema.parse(G);
    await orch({ queryText: 'bench-seed', gameId: gid, limit: args.limit });
  }

  for (let i = 0; i < args.n; i++) {
  const q = args.mode === 'miss' ? `bench-${i}` : 'bench-seed';
    const t0 = performance.now();
  const gid2 = UlidSchema.parse(G);
  const res = await orch({ queryText: q, gameId: gid2, limit: args.limit });
    const dt = performance.now() - t0;
    times.push(dt);
    if (res.partial) partials++;
  }

  times.sort((a, b) => a - b);
  const pct = (p: number) => times.length === 0 ? 0 : times[Math.min(times.length - 1, Math.floor(p * (times.length - 1)))];
  const p50 = pct(0.5);
  const p95 = pct(0.95);
  const p99 = pct(0.99);

  const snapshot = getRetrievalMetricsSnapshot();
  const out = {
    n: args.n,
    mode: args.mode,
    limit: args.limit,
    baseK: args.baseK,
    maxKBoost: args.maxKBoost,
    softPartialDeadlineMs: args.softMs,
    vectorMs: args.vectorMs,
    partialRate: args.n ? partials / args.n : 0,
    p50,
    p95,
    p99,
    counters: snapshot.counters,
    h_total_count: snapshot.histograms.latency_total_ms.count
  } as const;

  // Print JSON summary
  console.log(JSON.stringify(out, null, 2));

  if (typeof args.gateP95 === 'number') {
    const p95n = Number(p95);
    if (Number.isFinite(p95n) && p95n > args.gateP95) {
      console.error(`p95 ${p95}ms exceeds gate ${args.gateP95}ms`);
      return 1;
    }
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
