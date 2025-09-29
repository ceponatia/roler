import { z } from 'zod';

import { ErrorSchema } from '../errors.schema.js';

import type { ErrorCode } from '../base/enums.js';
import type { SchemaError } from '../errors.schema.js';

function classifyIssue(issue: z.ZodIssue): ErrorCode {
  // Unauthorized/unknown key
  if (issue.code === z.ZodIssueCode.unrecognized_keys) return 'VAL_UNAUTHORIZED_FIELD';
  // Missing required field
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === 'undefined') return 'VAL_MISSING_FIELD';
  // General type mismatch
  if (issue.code === z.ZodIssueCode.invalid_type) return 'VAL_TYPE_MISMATCH';
  // Fallback to schema violation
  return 'VAL_SCHEMA_VIOLATION';
}

function pathToString(path: (string | number)[]): string {
  // Convert zod path segments into a dot/bracket notation string, e.g. input.items[0].name
  let out = 'input';
  for (const seg of path) {
    if (typeof seg === 'number') out += `[${String(seg)}]`;
    else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(seg)) out += `.${seg}`;
    else out += `[${JSON.stringify(seg)}]`;
  }
  return out;
}

export function mapZodError(err: unknown): SchemaError {
  if (!(err instanceof z.ZodError)) {
    return ErrorSchema.parse({ code: 'VAL_SCHEMA_VIOLATION', message: 'Validation failed', hint: 'Unknown error' });
  }
  const first: z.ZodIssue | undefined = err.issues[0];
  if (!first) {
    // Shouldn't happen in normal Zod flow; provide a safe generic error
    return ErrorSchema.parse({ code: 'VAL_SCHEMA_VIOLATION', message: 'Validation failed', hint: 'No details' });
  }
  const code = classifyIssue(first);
  const fieldPath = first.path.length > 0 ? pathToString(first.path) : undefined;
  const message = first.message || 'Invalid request';
  return ErrorSchema.parse({ code, fieldPath, message });
}
