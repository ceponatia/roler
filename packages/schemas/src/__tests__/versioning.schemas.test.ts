import { describe, expect, it } from 'vitest';

import {
  AttributeChangeSchema,
  CanonVersionReaderSchema,
  CanonVersionSchema,
  MergePreviewRequestSchema,
  MergePreviewResponseSchema,
  RollbackRequestSchema,
  RollbackResponseSchema,
  TextChangeSchema,
  VersionDiffRequestSchema,
  VersionDiffResponseSchema
} from '../index.js';


// Valid 26-char Crockford ULID (no I, L, O, U)
const ulid = '01ARZ3NDEKTSV4RRFFQ69G5FAV';

const makeVersion = (overrides?: Partial<Record<string, unknown>>) => ({
  id: ulid,
  entityId: ulid,
  lineageRootId: ulid,
  parentIds: [ulid],
  seq: 1,
  authorUserId: ulid,
  createdAt: new Date().toISOString(),
  attributes: { title: 'Test', level: 2 },
  textChunks: [
    { index: 0, hash: 'hash-0-aaaaaaaaaaaaaa', text: 'Once upon a time.' },
    { index: 1, hash: 'hash-1-bbbbbbbbbbbbbb', text: 'The end.' }
  ],
  changeSummary: 'init',
  baseHash: 'base-hash-aaaaaaaaaaaa',
  integrityChecksum: 'integrity-cccccccccccc',
  ...overrides
});

describe('CanonVersionSchema', () => {
  it('parses a valid version snapshot', () => {
    const parsed = CanonVersionSchema.parse(makeVersion());
    expect(parsed.seq).toBe(1);
    expect(parsed.textChunks.length).toBe(2);
  });

  it('rejects extra fields due to strict()', () => {
    expect(() =>
      CanonVersionSchema.parse({
        ...makeVersion(),
        extra: true
      })
    ).toThrow();
  });

  it('reader schema parses the same shape (placeholder for migrations)', () => {
    const parsed = CanonVersionReaderSchema.parse(makeVersion());
    expect(parsed.entityId).toBe(ulid);
  });
});

describe('Diff schemas', () => {
  it('accepts attribute change union variants', () => {
    const added = AttributeChangeSchema.parse({ kind: 'added', key: 'title', newValue: 'Hello' });
    const removed = AttributeChangeSchema.parse({ kind: 'removed', key: 'title', oldValue: 'Hello' });
    const modified = AttributeChangeSchema.parse({
      kind: 'modified',
      key: 'level',
      oldValue: 1,
      newValue: 2
    });
    expect(added.kind).toBe('added');
    expect(removed.kind).toBe('removed');
    expect(modified.kind).toBe('modified');
  });

  it('validates diff request/response', () => {
    const req = VersionDiffRequestSchema.parse({ fromVersionId: ulid, toVersionId: ulid });
    expect(req.fromVersionId).toBe(ulid);
    const res = VersionDiffResponseSchema.parse({
      entityId: ulid,
      attributeChanges: [
        { kind: 'added', key: 'title', newValue: 'A' }
      ],
      textChanges: [
        { kind: 'added', index: 0, text: 'X' }
      ],
      stats: {
        addedAttrs: 1,
        removedAttrs: 0,
        modifiedAttrs: 0,
        textAdded: 1,
        textRemoved: 0,
        textModified: 0
      }
    });
    expect(res.stats.addedAttrs).toBe(1);
  });
});

describe('Merge & Rollback schemas', () => {
  it('validates merge preview request/response', () => {
    const req = MergePreviewRequestSchema.parse({ leftVersionId: ulid, rightVersionId: ulid });
    expect(req.leftVersionId).toBe(ulid);
    const resp = MergePreviewResponseSchema.parse({
      baseVersionId: ulid,
      mergedAttributes: { title: 'X' },
      mergedTextChunks: [{ index: 0, text: 'X' }],
      conflicts: [
        { kind: 'attribute', key: 'title', leftValue: 'A', rightValue: 'B', baseValue: 'C' },
        { kind: 'text', index: 0, leftText: 'A', rightText: 'B', baseText: 'C' }
      ],
      conflictCount: 2
    });
    expect(resp.conflicts.length).toBe(2);
  });

  it('validates rollback request/response', () => {
    const r1 = RollbackRequestSchema.parse({ targetVersionId: ulid });
    expect(r1.targetVersionId).toBe(ulid);
    const r2 = RollbackResponseSchema.parse({ newHeadVersionId: ulid, previousHeadVersionId: ulid });
    expect(r2.newHeadVersionId).toBe(ulid);
  });
});

describe('negative cases', () => {
  it('rejects invalid ulid', () => {
    expect(() => CanonVersionSchema.parse(makeVersion({ id: 'not-a-ulid' })) ).toThrow();
  });
  it('rejects non-integer indices in text changes', () => {
    expect(() =>
      TextChangeSchema.parse({ kind: 'added', index: 0.5, text: 'x' })
    ).toThrow();
  });
});
