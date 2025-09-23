import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { validateJsonBody } from '../request-validate.js';

describe('HTTP boundary integration (simulated)', () => {
  const CreateSchema = z.object({ id: z.string(), count: z.number().int() }).strict();

  async function handler(req: Request) {
    const result = await validateJsonBody(req, CreateSchema);
    if (result.error) {
      // Simulate standardized error payload shape
      return new Response(JSON.stringify(result.error), { status: 400, headers: { 'content-type': 'application/json' } });
    }
    return new Response(JSON.stringify(result.data), { status: 200, headers: { 'content-type': 'application/json' } });
  }

  it('returns standardized error on validation failure', async () => {
    const bad = new Request('http://x', { method: 'POST', body: JSON.stringify({ id: 'a' }), headers: { 'content-type': 'application/json' } });
    const res = await handler(bad);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { code: string; fieldPath?: string; message: string };
    expect(body.code).toBe('VAL_MISSING_FIELD');
    expect(body.fieldPath?.includes('count')).toBe(true);
  });
});
