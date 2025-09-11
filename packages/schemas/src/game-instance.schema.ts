/**
 * GameInstance schema
 *
 * Purpose: Represents a per-game instance of a canonical entity, including a
 * materialized state document and optional overrides patch. Tracks provenance
 * to canon id and version id and carries instance-specific chunk metadata.
 *
 * Example:
 * const gi = GameInstanceSchema.parse({
 *   id: '01HZY5RN3Q8K9N9G8ZV4Y6J1QK',
 *   gameId: '01HZY5RN3Q8K9N9G8ZV4Y6J1QL',
 *   canonId: '01HZY5RN3Q8K9N9G8ZV4Y6J1QM',
 *   canonVersionId: '01HZY5RN3Q8K9N9G8ZV4Y6J1QN',
 *   state: { kind: 'character', fields: { name: 'Aki' } },
 *   createdAt: new Date().toISOString()
 * });
 */
import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from './base/primitives.js';
import { CanonContent as CanonContentSchema } from './canon-content.schema.js';

export const GameInstanceSchema = z
	.object({
		id: UlidSchema,
		gameId: UlidSchema,
		canonId: UlidSchema,
		canonVersionId: UlidSchema,
		// Materialized merged state; reuse discriminated CanonContent shape for type-safety
		state: CanonContentSchema,
		// Optional RFC6902-like patch or custom overlay for auditing diffs
		overrides: z.unknown().optional(),
		createdAt: IsoDateTimeSchema
	})
	.strict();

export type GameInstance = z.infer<typeof GameInstanceSchema>;

