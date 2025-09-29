import { describe, it, expect } from 'vitest';

import { composeStateTransactions } from '../transactions.js';

import type { StateTransaction } from '@roler/schemas';

const base = (id: string, ops: StateTransaction['operations'], policy: StateTransaction['conflictPolicy'] = 'first-wins'): StateTransaction => ({
  txId: id,
  originExtension: id,
  operations: ops,
  conflictPolicy: policy,
});

describe('composeStateTransactions', () => {
  it('keeps first op with first-wins', () => {
    const t1 = base('t1', [{ path: 'a', op: 'set', value: 1 }]);
    const t2 = base('t2', [{ path: 'a', op: 'set', value: 2 }], 'first-wins');
    const out = composeStateTransactions([t1, t2]);
    expect(out.operations).toEqual([{ path: 'a', op: 'set', value: 1 }]);
  });

  it('replaces with last op under last-wins', () => {
    const t1 = base('t1', [{ path: 'a', op: 'set', value: 1 }], 'last-wins');
    const t2 = base('t2', [{ path: 'a', op: 'set', value: 2 }], 'last-wins');
    const out = composeStateTransactions([t1, t2]);
    expect(out.operations).toEqual([{ path: 'a', op: 'set', value: 2 }]);
  });

  it('sums increments for same path with last-wins', () => {
    const t1 = base('t1', [{ path: 'score', op: 'increment', delta: 2 }], 'last-wins');
    const t2 = base('t2', [{ path: 'score', op: 'increment', delta: 3 }], 'last-wins');
    const out = composeStateTransactions([t1, t2]);
    expect(out.operations).toEqual([{ path: 'score', op: 'increment', delta: 5 }]);
  });

  it('throws for weighted/resolver (not implemented yet)', () => {
    const t1 = base('t1', [{ path: 'a', op: 'set', value: 1 }], 'weighted');
    const t2 = base('t2', [{ path: 'a', op: 'set', value: 2 }], 'weighted');
    expect(() => composeStateTransactions([t1, t2])).toThrow();
  });
});
