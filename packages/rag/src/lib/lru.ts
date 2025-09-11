export type LruMetrics = Readonly<{ hits: number; misses: number; evictions: number }>;

export interface LruCache<K, V> {
  readonly size: number;
  readonly capacity: number;
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  metrics(): LruMetrics;
}

export function createLruCache<K, V>(capacity: number): LruCache<K, V> {
  if (!Number.isFinite(capacity) || capacity <= 0) {
    throw new Error('LRU capacity must be a positive finite number');
  }
  // Map preserves insertion order; we move updated keys to the end to represent recent use
  const map = new Map<K, V>();
  let hits = 0;
  let misses = 0;
  let evictions = 0;

  const api: LruCache<K, V> = {
    get size() {
      return map.size;
    },
    get capacity() {
      return capacity;
    },
    get(key: K): V | undefined {
      if (!map.has(key)) {
        misses++;
        return undefined;
      }
      const value = map.get(key) as V; // safe due to has()
      // refresh recency: delete and re-insert
      map.delete(key);
      map.set(key, value);
      hits++;
      return value;
    },
    set(key: K, value: V): void {
      if (map.has(key)) {
        map.delete(key);
      }
      map.set(key, value);
      // Evict least-recently-used while over capacity
      while (map.size > capacity) {
        const firstKey = map.keys().next().value as K | undefined;
        if (firstKey === undefined) break;
        map.delete(firstKey);
        evictions++;
      }
    },
    has(key: K): boolean {
      return map.has(key);
    },
    delete(key: K): boolean {
      return map.delete(key);
    },
    clear(): void {
      map.clear();
    },
    metrics(): LruMetrics {
      return { hits, misses, evictions } as const;
    }
  };

  return api;
}
