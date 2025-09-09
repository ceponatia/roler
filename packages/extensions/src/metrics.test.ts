import { describe, it, expect } from 'vitest';

import { getMetricsSink, setMetricsSink } from './metrics.js';

describe('metrics sink', () => {
  it('can set and retrieve sink', () => {
    const calls: string[] = [];
    const sink = {
      onHookStart: () => calls.push('start'),
      onHookEnd: () => calls.push('end'),
      onHookError: () => calls.push('error'),
      onBudgetOverrun: () => calls.push('budget'),
    };
    setMetricsSink(sink);
    const got = getMetricsSink();
    got.onHookStart({ extensionId: 'x', hook: 'preChatTurn' });
    got.onHookEnd({ extensionId: 'x', hook: 'preChatTurn', durationMs: 1 });
    got.onHookError({ extensionId: 'x', hook: 'preChatTurn', code: 'E' });
    got.onBudgetOverrun({ extensionId: 'x', hook: 'preChatTurn', type: 'time' });
    expect(calls).toEqual(['start','end','error','budget']);
  });
});
