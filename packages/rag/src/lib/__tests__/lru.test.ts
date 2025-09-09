import { describe, expect, it } from 'vitest';

import { createLruCache } from '../lru.js';

describe('createLruCache', () => {
  it('evicts least recently used entries', () => {
    const lru = createLruCache<string, number>(2);
    lru.set('a', 1);
    lru.set('b', 2);
    // Access 'a' to make it most recent
    expect(lru.get('a')).toBe(1);
    // Insert 'c', should evict 'b'
    lru.set('c', 3);
    expect(lru.has('b')).toBe(false);
    expect(lru.has('a')).toBe(true);
    expect(lru.has('c')).toBe(true);
  });

  it('tracks hits, misses, evictions', () => {
    const lru = createLruCache<string, number>(1);
    expect(lru.get('x')).toBeUndefined();
    lru.set('x', 42);
    expect(lru.get('x')).toBe(42);
    lru.set('y', 24); // evict x
    const m = lru.metrics();
    expect(m.hits).toBe(1);
    expect(m.misses).toBe(1);
    expect(m.evictions).toBe(1);
  });
});
