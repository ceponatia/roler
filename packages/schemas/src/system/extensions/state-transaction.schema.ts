/**
 * State Transaction Schema
 * Represents a collection of atomic operations proposed by an extension (chat phases / normalization) to be merged.
 * Aligns with spec Section 5 (State Transactions).
 */
import { z } from 'zod';

export const TxOperationSchema = z.object({
  path: z.string().min(1),
  op: z.enum(['set', 'increment', 'append']),
  value: z.unknown().optional(),
  delta: z.number().optional(),
}).strict().refine(
  (op) => {
    if (op.op === 'increment') return typeof op.delta === 'number';
    if (op.op === 'set') return 'value' in op;
    return true; // append may carry value or not depending on implementation
  },
  { message: 'Invalid operation payload for op type' }
);
export type TxOperation = z.infer<typeof TxOperationSchema>;

export const StateTransactionSchema = z.object({
  txId: z.string().min(1),
  originExtension: z.string().min(1),
  operations: z.array(TxOperationSchema).min(1).readonly(),
  conflictPolicy: z.enum(['first-wins', 'last-wins', 'weighted', 'resolver']),
  weight: z.number().int().nonnegative().optional(),
  resolverId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).strict();
export type StateTransaction = z.infer<typeof StateTransactionSchema>;
