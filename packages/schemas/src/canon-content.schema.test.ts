import { expect, test } from 'vitest';
import { CanonContent } from './canon-content.schema.js';

// Minimal smoke test for schema discriminated union

test('character payload validates', () => {
  const parsed = CanonContent.parse({
    kind: 'character',
    fields: { name: 'Aria', traits: ['brave'] }
  });
  if (parsed.kind !== 'character') throw new Error('expected character kind');
  expect(parsed.fields.name).toBe('Aria');
});
