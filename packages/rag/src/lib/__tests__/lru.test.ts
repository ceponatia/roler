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

  it('throws error for invalid capacity', () => {
    expect(() => createLruCache(0)).toThrow('LRU capacity must be a positive finite number');
    expect(() => createLruCache(-1)).toThrow('LRU capacity must be a positive finite number');
    expect(() => createLruCache(Infinity)).toThrow('LRU capacity must be a positive finite number');
    expect(() => createLruCache(NaN)).toThrow('LRU capacity must be a positive finite number');
  });

  it('returns correct capacity', () => {
    const lru = createLruCache<string, number>(5);
    expect(lru.capacity).toBe(5);
  });

  it('updates existing key without changing size', () => {
    const lru = createLruCache<string, number>(2);
    lru.set('a', 1);
    expect(lru.size).toBe(1);
    lru.set('a', 10); // update existing key
    expect(lru.size).toBe(1);
    expect(lru.get('a')).toBe(10);
  });

  it('clears all entries', () => {
    const lru = createLruCache<string, number>(3);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    expect(lru.size).toBe(3);
    lru.clear();
    expect(lru.size).toBe(0);
    expect(lru.has('a')).toBe(false);
    expect(lru.has('b')).toBe(false);
    expect(lru.has('c')).toBe(false);
  });

  it('deletes entries correctly', () => {
    const lru = createLruCache<string, number>(3);
    lru.set('a', 1);
    lru.set('b', 2);
    expect(lru.size).toBe(2);
    expect(lru.delete('a')).toBe(true);
    expect(lru.size).toBe(1);
    expect(lru.has('a')).toBe(false);
    expect(lru.delete('nonexistent')).toBe(false);
  });
});
