import { describe, it, expect } from 'vitest';

import { StateTransactionSchema } from '../../system/extensions/state-transaction.schema.js';

describe('StateTransactionSchema', () => {
  it('accepts valid weighted transaction', () => {
    const tx = StateTransactionSchema.parse({
      txId: 't1',
      originExtension: 'sample-ext',
      conflictPolicy: 'weighted',
      weight: 10,
      operations: [
        { path: 'entity.stats.hp', op: 'increment', delta: 5 },
        { path: 'entity.meta.tags', op: 'append', value: 'recent' },
      ],
    });
    expect(tx.operations).toHaveLength(2);
  });

  it('rejects increment without delta', () => {
    expect(() =>
      StateTransactionSchema.parse({
        txId: 't2',
        originExtension: 'sample-ext',
        conflictPolicy: 'first-wins',
        operations: [{ path: 'x', op: 'increment' }],
      })
    ).toThrow();
  });

  it('rejects set without value and allows append without value', () => {
    expect(() =>
      StateTransactionSchema.parse({
        txId: 't3',
        originExtension: 'sample-ext',
        conflictPolicy: 'last-wins',
        operations: [{ path: 'x', op: 'set' }],
      })
    ).toThrow();

  const ok = StateTransactionSchema.parse({
      txId: 't4',
      originExtension: 'sample-ext',
      conflictPolicy: 'first-wins',
      operations: [{ path: 'x', op: 'append' }],
    });
  expect(ok.operations.length).toBe(1);
  const op0 = ok.operations[0];
  if (!op0) throw new Error('expected at least one operation');
  expect(op0.op).toBe('append');
  });
});
