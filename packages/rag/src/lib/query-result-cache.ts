import { createLruCache, type LruMetrics } from './lru.js';

import type { Ulid } from './scoring.js';

export type QueryKey = string & { readonly __brand_qk: unique symbol };

export type CachedQueryResult = Readonly<{
  itemIds: readonly Ulid[]; // ordered chunk IDs
  scores: readonly number[];
  stampMs: number; // creation timestamp (ms)
  entities: readonly Ulid[]; // involved entity IDs for invalidation
}>;

export interface QueryResultCacheApi {
  get(key: QueryKey): CachedQueryResult | undefined;
  set(key: QueryKey, value: CachedQueryResult): void;
  invalidateByEntity(entityId: Ulid): void;
  clear(): void;
  size(): number;
  capacity(): number;
  metrics(): LruMetrics;
}

export function createQueryResultCache(capacity: number): QueryResultCacheApi {
  const lru = createLruCache<QueryKey, CachedQueryResult>(capacity);
  // Reverse index: entityId -> set of query keys
  const ix = new Map<Ulid, Set<QueryKey>>();

  const api: QueryResultCacheApi = {
    get(key: QueryKey) {
      return lru.get(key);
    },
    set(key: QueryKey, value: CachedQueryResult) {
      lru.set(key, value);
      // update reverse index
      for (const e of value.entities) {
        const set = ix.get(e) ?? new Set<QueryKey>();
        set.add(key);
        ix.set(e, set);
      }
    },
    invalidateByEntity(entityId: Ulid) {
      const set = ix.get(entityId);
      if (!set) return;
      for (const key of set) {
        lru.delete(key);
      }
      ix.delete(entityId);
    },
    clear() {
      lru.clear();
      ix.clear();
    },
    size() {
      return lru.size;
    },
    capacity() {
      return lru.capacity;
    },
    metrics() {
      return lru.metrics();
    }
  };

  return api;
}

export function makeQueryKey(signature: string): QueryKey {
  return signature as unknown as QueryKey;
}
