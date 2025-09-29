// Related Requirement: R-004 Boundary Safety
// Shared normalized error shape used by boundary validators and HTTP utils.
import { z } from 'zod';

import { ErrorCodeEnum } from './base/enums.js';

export const ErrorSchema = z.object({
	code: ErrorCodeEnum,
	fieldPath: z.string().optional(),
	message: z.string(),
	hint: z.string().optional()
});
export type SchemaError = z.infer<typeof ErrorSchema>;

