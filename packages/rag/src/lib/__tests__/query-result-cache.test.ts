import { describe, expect, it } from 'vitest';

import { createQueryResultCache, makeQueryKey } from '../query-result-cache.js';

const ULID_A = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C' as unknown as string;
const ULID_B = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D' as unknown as string;
const ULID_C = '01HYA7Y3KZJ5MNS4AE8Q9R2B7E' as unknown as string;

describe('query result cache', () => {
  it('stores and retrieves by key', () => {
    const c = createQueryResultCache(2);
    const k = makeQueryKey('sig1');
    c.set(k, { itemIds: [ULID_A] as any, scores: [0.9], stampMs: Date.now(), entities: [ULID_A] as any });
    const r = c.get(k);
    expect(r).toBeDefined();
    if (!r) throw new Error('expected cache hit');
    expect(r.itemIds.length).toBe(1);
  });

  it('invalidates by entity', () => {
    const c = createQueryResultCache(2);
    const k1 = makeQueryKey('sig1');
    const k2 = makeQueryKey('sig2');
    c.set(k1, { itemIds: [ULID_A] as any, scores: [1], stampMs: 1, entities: [ULID_A] as any });
    c.set(k2, { itemIds: [ULID_B] as any, scores: [1], stampMs: 1, entities: [ULID_B] as any });
    c.invalidateByEntity(ULID_A as any);
    expect(c.get(k1)).toBeUndefined();
    expect(c.get(k2)).toBeDefined();
  });

  it('trims to capacity via LRU', () => {
    const c = createQueryResultCache(2);
    const k1 = makeQueryKey('s1');
    const k2 = makeQueryKey('s2');
    const k3 = makeQueryKey('s3');
    c.set(k1, { itemIds: [ULID_A] as any, scores: [1], stampMs: 1, entities: [ULID_A] as any });
    c.set(k2, { itemIds: [ULID_B] as any, scores: [1], stampMs: 1, entities: [ULID_B] as any });
    // access k1 to make it recent
    expect(c.get(k1)).toBeDefined();
    c.set(k3, { itemIds: [ULID_C] as any, scores: [1], stampMs: 1, entities: [ULID_C] as any });
    // k2 should be evicted
    expect(c.get(k2)).toBeUndefined();
    expect(c.size()).toBe(2);
  });

  it('exposes capacity, metrics, and ignores unknown invalidations', () => {
    const c = createQueryResultCache(3);
    expect(c.capacity()).toBe(3);
    // Invalidate before anything stored; should be a no-op
    c.invalidateByEntity(ULID_C as any);
    expect(c.size()).toBe(0);

    const key = makeQueryKey('known');
    c.set(key, { itemIds: [ULID_A] as any, scores: [0.7], stampMs: 42, entities: [ULID_C] as any });
    expect(c.metrics()).toEqual({ hits: 0, misses: 0, evictions: 0 });

    c.clear();
    expect(c.size()).toBe(0);
    expect(c.metrics()).toEqual({ hits: 0, misses: 0, evictions: 0 });
  });
});
