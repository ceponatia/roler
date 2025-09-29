import { describe, it, expect } from 'vitest';

import { composeStateTransactions } from '../transactions.js';
import type { StateTransaction } from '@roler/schemas';

describe('composeStateTransactions edge cases', () => {
  const tx = (id: string, ops: StateTransaction['operations'], policy: StateTransaction['conflictPolicy'] = 'first-wins'): StateTransaction => ({
    txId: id,
    originExtension: 't',
    operations: ops,
    conflictPolicy: policy,
  });

  it('merges metadata shallowly with last-wins semantics', () => {
    const out = composeStateTransactions([
      { ...tx('a', [], 'first-wins'), metadata: { a: 1, collide: 'x' } },
      { ...tx('b', [], 'first-wins'), metadata: { b: 2, collide: 'y' } }
    ]);
    expect(out.metadata).toEqual({ a: 1, b: 2, collide: 'y' });
  });

  it('last-wins increments are summed', () => {
    const out = composeStateTransactions([
      tx('a', [{ path: 'p', op: 'increment', delta: 2 }], 'last-wins'),
      tx('b', [{ path: 'p', op: 'increment', delta: 3 }], 'last-wins')
    ]);
    const op = out.operations.find(o => o.path === 'p');
    expect(op?.delta).toBe(5);
  });

  it('last-wins replaces non-increment op', () => {
    const out = composeStateTransactions([
      tx('a', [{ path: 'p', op: 'set', value: 1 }], 'last-wins'),
      tx('b', [{ path: 'p', op: 'set', value: 2 }], 'last-wins')
    ]);
    const op = out.operations.find(o => o.path === 'p');
    expect(op?.value).toBe(2);
  });

  it('first-wins retains first op', () => {
    const out = composeStateTransactions([
      tx('a', [{ path: 'p', op: 'set', value: 1 }], 'first-wins'),
      tx('b', [{ path: 'p', op: 'set', value: 2 }], 'first-wins')
    ]);
    const op = out.operations.find(o => o.path === 'p');
    expect(op?.value).toBe(1);
  });

  it('throws on unsupported weighted policy (requires conflicting ops to reach branch)', () => {
    expect(() => composeStateTransactions([
      tx('a', [{ path: 'p', op: 'set', value: 1 }], 'first-wins'),
      tx('b', [{ path: 'p', op: 'set', value: 2 }], 'weighted')
    ])).toThrow(/EXT_STATE_TX_CONFLICT/);
  });
});
