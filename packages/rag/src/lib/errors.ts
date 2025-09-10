import { ErrorCodeEnum } from '@roler/schemas';

import type { SchemaError } from '@roler/schemas';

export type KnownError = Readonly<{ message: string; fieldPath?: string; kind?: 'parse' | 'refine' | 'policy' | 'safety' }>;

export function mapErrorToSchemaError(err: unknown): SchemaError {
  const msg = messageOf(err);
  const kind = kindOf(err);
  return {
    code: ErrorCodeEnum.enum[kind],
    message: msg,
  fieldPath: extractFieldPath(err),
  } as const;
}

function messageOf(e: unknown): string {
  if (typeof e === 'string') return e;
  if (isRecord(e) && typeof e.message === 'string') return e.message;
  try { return JSON.stringify(e); } catch { return 'unknown error'; }
}

function kindOf(e: unknown): 'parse' | 'refine' | 'policy' | 'safety' {
  // Heuristic: zod parse issues -> parse/refine; otherwise policy as default
  const msg = messageOf(e).toLowerCase();
  if (msg.includes('parse') || msg.includes('invalid') || msg.includes('required')) return 'parse';
  if (msg.includes('refine') || msg.includes('refinement')) return 'refine';
  if (msg.includes('unsafe') || msg.includes('safety')) return 'safety';
  return 'policy';
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function extractFieldPath(e: unknown): string | undefined {
  if (!isRecord(e)) return undefined;
  const fp = e['fieldPath'];
  return typeof fp === 'string' ? fp : undefined;
}
