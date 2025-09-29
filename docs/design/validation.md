# Validation (R-004 Boundary Safety)

This document summarizes how to validate inbound data using Zod schemas and the helpers exported from `@roler/schemas`.

## Utilities

- `validate<T>(input, schema)` → `{ data?: T; error?: SchemaError }`
- `mapZodError(err)` → `SchemaError`

`SchemaError` has the shape:

```ts
type SchemaError = {
  code: ErrorCode;
  fieldPath?: string;
  message: string;
  hint?: string;
}
```

Validation error codes are standardized (VAL_*):

- `VAL_MISSING_FIELD`
- `VAL_TYPE_MISMATCH`
- `VAL_UNAUTHORIZED_FIELD`
- `VAL_SCHEMA_VIOLATION` (generic fallback)

## Example

```ts
import { z } from 'zod';
import { validate } from '@roler/schemas';

const CreateSchema = z.object({
  id: z.string().min(1),
  count: z.number().int(),
}).strict();

const result = validate({ id: 'a', count: 1 }, CreateSchema);
if (result.error) {
  // Return standardized error to client or log
} else {
  // Use result.data (typed)
}
```

## Notes

- Schemas should be defined in `@roler/schemas`. Applications should import and reuse them to ensure type inference and consistency.
- `validate` includes a small parser cache to keep parse overhead low.
- For SvelteKit routes, pair these helpers with a per-route schema and ensure imports are present to satisfy the CI gate.
