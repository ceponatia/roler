import type { Ulid } from '@roler/schemas';

export type InvalidationEvent = Readonly<{ type: 'entity'; entityId: Ulid }>;
export type InvalidationListener = (ev: InvalidationEvent) => void;

export interface InvalidationBus {
  subscribe(listener: InvalidationListener): () => void;
  publishEntity(entityId: Ulid): void;
}

export function createInvalidationBus(): InvalidationBus {
  const listeners = new Set<InvalidationListener>();
  return {
    subscribe(listener: InvalidationListener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publishEntity(entityId: Ulid): void {
      const ev: InvalidationEvent = { type: 'entity', entityId } as const;
      for (const fn of listeners) fn(ev);
    }
  };
}
