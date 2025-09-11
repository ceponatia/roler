import { UlidSchema, type Ulid } from '@roler/schemas';
import { describe, it, expect, vi } from 'vitest';

import { createInvalidationBus, type InvalidationEvent } from '../invalidation-bus';

// Contract
// - subscribe returns an unsubscribe fn that removes the listener
// - publishEntity emits a single event { type: 'entity', entityId }
// - multiple listeners all receive the event
// - unsubscribed listeners do not receive further events
// - subscribing the same function multiple times results in a single entry (Set semantics)

const validUlid = (): Ulid => {
  // 26 chars Crockford base32; use a fixed example that passes the regex
  // We validate with UlidSchema to keep type-safety without any casting.
  const id = '00000000000000000000000000';
  const parsed = UlidSchema.parse(id);
  return parsed;
};

describe('createInvalidationBus', () => {
  it('publishes entity events to a subscriber', () => {
    const bus = createInvalidationBus();
    const listener = vi.fn();
    bus.subscribe(listener);

    const id = validUlid();
    bus.publishEntity(id);

    expect(listener).toHaveBeenCalledTimes(1);
    const ev = listener.mock.calls[0][0] as InvalidationEvent;
    expect(ev).toEqual({ type: 'entity', entityId: id });
  });

  it('supports multiple listeners', () => {
    const bus = createInvalidationBus();
    const a = vi.fn();
    const b = vi.fn();
    bus.subscribe(a);
    bus.subscribe(b);

    const id = validUlid();
    bus.publishEntity(id);

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops further notifications', () => {
    const bus = createInvalidationBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);

    const id1 = validUlid();
    bus.publishEntity(id1);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    const id2 = validUlid();
    bus.publishEntity(id2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('deduplicates the same function listener (Set semantics)', () => {
    const bus = createInvalidationBus();
    const fn = vi.fn();
    bus.subscribe(fn);
    bus.subscribe(fn); // Set should keep only one instance

    const id = validUlid();
    bus.publishEntity(id);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
