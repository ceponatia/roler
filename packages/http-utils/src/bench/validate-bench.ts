import { validate } from '@roler/schemas';
import { performance } from 'node:perf_hooks';
import { z } from 'zod';


const N = Number(process.env.VAL_BENCH_ITERS ?? '2000');
const schema = z.object({ id: z.string(), n: z.number() }).strict();
const ok = { id: 'x', n: 1 };

const times: number[] = [];
for (let i = 0; i < N; i++) {
  const t0 = performance.now();
  const res = validate(ok, schema);
  if (res.error) throw new Error('Unexpected error');
  const t1 = performance.now();
  times.push(t1 - t0);
}

times.sort((a, b) => a - b);
const p95 = times[Math.floor(times.length * 0.95) - 1] ?? 0;
const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);

console.log(JSON.stringify({ N, avgMs: avg, p95Ms: p95 }));