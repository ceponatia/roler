import { z } from 'zod';

export const ConflictAttributeSchema = z
  .object({ kind: z.literal('attribute'), key: z.string(), leftValue: z.unknown(), rightValue: z.unknown(), baseValue: z.unknown() })
  .strict();

export const ConflictTextSchema = z
  .object({ kind: z.literal('text'), index: z.number().int().nonnegative(), leftText: z.string(), rightText: z.string(), baseText: z.string() })
  .strict();

export const ConflictSchema = z.discriminatedUnion('kind', [ConflictAttributeSchema, ConflictTextSchema]);
export type Conflict = z.infer<typeof ConflictSchema>;
