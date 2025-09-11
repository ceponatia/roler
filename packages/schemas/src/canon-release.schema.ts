/**
 * CanonRelease schema
 *
 * Purpose: Represents a release artifact for a canon repository/export, bundling
 * selected canon versions and metadata for distribution or import/export flows.
 *
 * Versioning: Additive fields only; keep strict for writers, tolerant for readers via migrations (future).
 *
 * Example:
 * const rel = CanonReleaseSchema.parse({
 *   id: '01HZY5RN3Q8K9N9G8ZV4Y6J1QK',
 *   createdAt: new Date().toISOString(),
 *   label: 'v0.1.0',
 *   versionIds: ['01HZY5RN3Q8K9N9G8ZV4Y6J1QM'],
 *   notes: 'Initial drop',
 *   meta: { author: 'gm@example.com' }
 * });
 */
import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from './base/primitives.js';

export const CanonReleaseSchema = z
	.object({
		id: UlidSchema,
		createdAt: IsoDateTimeSchema,
		label: z.string().min(1),
		// CanonVersion ids included in this release bundle
		versionIds: z.array(UlidSchema).min(1).readonly(),
		notes: z.string().optional(),
		meta: z.record(z.unknown()).optional()
	})
	.strict();

export type CanonRelease = z.infer<typeof CanonReleaseSchema>;

