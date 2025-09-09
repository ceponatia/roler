import type { StateTransaction, TxOperation } from '@roler/schemas';

/**
 * Compose multiple StateTransactions into a single idempotent delta.
 * - Deterministic: processes transactions in provided order
 * - Conflict handling: supports 'first-wins' and 'last-wins'
 * - Increment reduction: sums consecutive increments for the same path
 * - Weighted/resolver policies are not implemented yet (deferred per spec)
 */
export function composeStateTransactions(txs: readonly StateTransaction[]): StateTransaction {
  const opsByPath = new Map<string, TxOperation>();
  const metadata: Record<string, unknown> = {};

  for (const tx of txs) {
    // Shallow merge metadata (later keys overwrite)
    if (tx.metadata) {
      for (const [k, v] of Object.entries(tx.metadata)) {
        metadata[k] = v;
      }
    }

    for (const op of tx.operations) {
      const existing = opsByPath.get(op.path);
      if (!existing) {
        // first op for this path
        opsByPath.set(op.path, op);
        continue;
      }

      // Conflict: decide based on current transaction's policy
      switch (tx.conflictPolicy) {
        case 'first-wins': {
          // keep existing; no change
          break;
        }
        case 'last-wins': {
          if (op.op === 'increment' && existing.op === 'increment') {
            const prev = typeof existing.delta === 'number' ? existing.delta : 0;
            const cur = typeof op.delta === 'number' ? op.delta : 0;
            opsByPath.set(op.path, { ...op, delta: prev + cur });
          } else {
            // replace with latest op (preserve insertion order position)
            opsByPath.set(op.path, op);
          }
          break;
        }
        case 'weighted':
        case 'resolver': {
          throw new Error('EXT_STATE_TX_CONFLICT: weighted/resolver policies not implemented');
        }
        default: {
          const _exhaustive: never = tx.conflictPolicy;
          return _exhaustive;
        }
      }
    }
  }

  const operations = Array.from(opsByPath.values());
  const txId = `compose:${txs.map(t => t.txId).join('+')}`;
  const composed: StateTransaction = {
    txId,
    originExtension: 'compose',
    operations,
    conflictPolicy: 'first-wins',
    ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
  };
  return composed;
}
