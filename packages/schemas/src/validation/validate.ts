import { mapZodError } from './map-zod-error.js';

import type { SchemaError } from '../errors.schema.js';
import type { z } from 'zod';

export type ValidateResult<T> = Readonly<{ data?: T; error?: SchemaError }>;

const parseCache: WeakMap<z.ZodTypeAny, (i: unknown) => z.SafeParseReturnType<unknown, unknown>> = new WeakMap();

function getParser<T>(schema: z.ZodType<T, z.ZodTypeDef, unknown>): (i: unknown) => z.SafeParseReturnType<T, T> {
  const existing = parseCache.get(schema as z.ZodTypeAny);
  if (existing) return existing as (i: unknown) => z.SafeParseReturnType<T, T>;
  const fn = (i: unknown) => schema.safeParse(i);
  parseCache.set(schema as z.ZodTypeAny, fn as (i: unknown) => z.SafeParseReturnType<unknown, unknown>);
  return fn as (i: unknown) => z.SafeParseReturnType<T, T>;
}

export function validate<T>(input: unknown, schema: z.ZodType<T, z.ZodTypeDef, unknown>): ValidateResult<T> {
  const parsed = getParser(schema)(input);
  if (parsed.success) {
    return { data: parsed.data };
  }
  return { error: mapZodError(parsed.error) };
}
