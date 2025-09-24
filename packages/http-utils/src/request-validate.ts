// Requirement: R-004 Boundary Safety
// PRD: docs/prd/r-004-boundary-safety-prd.md
// Tech Spec: docs/design/r-004-boundary-safety-techspec.md
// Validates inbound HTTP request payloads using shared Zod schemas and maps errors to stable codes (DS-006/DS-017/DS-018).
import { mapZodError, validate, type ValidateResult } from '@roler/schemas';

import type { z } from 'zod';

export async function validateJsonBody<T>(
  request: Request,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>
): Promise<ValidateResult<T>> {
  try {
    const json = await request.json();
    return validateRaw(json, schema);
  } catch (err) {
    // Non-JSON or parse failure: map to standardized error
    return { error: mapZodError(err) };
  }
}

export function validateRaw<T>(input: unknown, schema: z.ZodType<T, z.ZodTypeDef, unknown>): ValidateResult<T> {
  return validate(input, schema);
}
