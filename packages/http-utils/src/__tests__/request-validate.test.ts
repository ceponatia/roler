import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { validateJsonBody, validateRaw } from '../request-validate.js';

describe('@roler/http-utils request validation', () => {
  const schema = z.object({ id: z.string(), n: z.number().int() }).strict();

  it('validateRaw returns data on success', () => {
    const res = validateRaw({ id: 'a', n: 1 }, schema);
    expect(res.error).toBeUndefined();
    expect(res.data).toEqual({ id: 'a', n: 1 });
  });

  it('validateJsonBody handles JSON parse error via mapZodError', async () => {
    const req = new Request('http://x', { method: 'POST', body: 'not-json', headers: { 'content-type': 'application/json' } });
    const res = await validateJsonBody(req, schema);
    expect(res.error).toBeDefined();
    expect(res.error?.code).toBe('VAL_SCHEMA_VIOLATION');
  });
});
