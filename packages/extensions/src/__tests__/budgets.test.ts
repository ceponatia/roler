import { describe, it, expect } from 'vitest';

import { DefaultHookBudgets, effectiveHookBudget } from '../budgets.js';

describe('budgets', () => {
  it('uses defaults when no override', () => {
    const b = effectiveHookBudget('preChatTurn');
    expect(b.maxLatencyMs).toBe(DefaultHookBudgets.preChatTurn.maxLatencyMs);
  });

  it('applies manifest override when present', () => {
    const b = effectiveHookBudget('postModeration', { postModeration: { maxLatencyMs: 15 } });
    expect(b.maxLatencyMs).toBe(15);
  });
});
