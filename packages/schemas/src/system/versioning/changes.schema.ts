import { z } from 'zod';

export const AttributeAddedChangeSchema = z
  .object({ kind: z.literal('added'), key: z.string(), newValue: z.unknown() })
  .strict();
export const AttributeRemovedChangeSchema = z
  .object({ kind: z.literal('removed'), key: z.string(), oldValue: z.unknown() })
  .strict();
export const AttributeModifiedChangeSchema = z
  .object({ kind: z.literal('modified'), key: z.string(), oldValue: z.unknown(), newValue: z.unknown() })
  .strict();
export const AttributeChangeSchema = z.discriminatedUnion('kind', [
  AttributeAddedChangeSchema,
  AttributeRemovedChangeSchema,
  AttributeModifiedChangeSchema
]);
export type AttributeChange = z.infer<typeof AttributeChangeSchema>;

export const DiffHunkSchema = z.object({ op: z.enum(['eq', 'ins', 'del']), text: z.string() }).strict();
export type DiffHunk = z.infer<typeof DiffHunkSchema>;

export const TextAddedChangeSchema = z
  .object({ kind: z.literal('added'), index: z.number().int().nonnegative(), text: z.string() })
  .strict();
export const TextRemovedChangeSchema = z
  .object({ kind: z.literal('removed'), index: z.number().int().nonnegative(), text: z.string() })
  .strict();
export const TextModifiedChangeSchema = z
  .object({
    kind: z.literal('modified'),
    index: z.number().int().nonnegative(),
    oldText: z.string(),
    newText: z.string(),
    diffHunks: z.array(DiffHunkSchema).readonly()
  })
  .strict();
export const TextChangeSchema = z.discriminatedUnion('kind', [
  TextAddedChangeSchema,
  TextRemovedChangeSchema,
  TextModifiedChangeSchema
]);
export type TextChange = z.infer<typeof TextChangeSchema>;
