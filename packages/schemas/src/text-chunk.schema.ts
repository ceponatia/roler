/**
 * TextChunk schema
 *
 * Purpose: Represents a field-scoped text chunk owned by either a canonical version
 * (ownerType='canon', ownerId = CanonVersion.id) or a game instance entity
 * (ownerType='instance', ownerId = GameEntity.id). These are vectorizable units
 * for retrieval.
 *
 * Example:
 * const parsed = TextChunkSchema.parse({
 *   id: '01HZY5RN3Q8K9N9G8ZV4Y6J1QK',
 *   ownerType: 'canon',
 *   ownerId: '01HZY5RN3Q8K9N9G8ZV4Y6J1QL',
 *   fieldPath: 'fields.personality',
 *   text: 'Calm and inquisitive.',
 *   meta: { source: 'bio' }
 * });
 */
import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from './base/primitives.js';

export const TextChunkOwnerTypeSchema = z.union([z.literal('canon'), z.literal('instance')]);

export const TextChunkSchema = z
	.object({
		id: UlidSchema,
		ownerType: TextChunkOwnerTypeSchema,
		ownerId: UlidSchema,
		fieldPath: z.string().min(1),
		text: z.string().min(1),
		// Optional embedding info kept lightweight; vector lives in DB/vector store
		embedding: z
			.object({
				model: z.string(),
				dimension: z.number().int().positive().optional(),
				embeddedAt: IsoDateTimeSchema.optional()
			})
			.optional(),
		meta: z.record(z.unknown()).optional()
	})
	.strict();

export type TextChunk = z.infer<typeof TextChunkSchema>;
export type TextChunkOwnerType = z.infer<typeof TextChunkOwnerTypeSchema>;

