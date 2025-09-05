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
});
