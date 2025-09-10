import { describe, expect, it } from 'vitest';

import { isLowLatencyRetrievalEnabled } from '../../index.js';

describe('env flag parsing: isLowLatencyRetrievalEnabled', () => {
  it('returns false when undefined', () => {
    expect(isLowLatencyRetrievalEnabled({})).toBe(false);
  });

  it('accepts truthy variants', () => {
    for (const v of ['1', 'true', 'TRUE', 'yes', 'on', 'On']) {
      expect(isLowLatencyRetrievalEnabled({ LOW_LATENCY_RETRIEVAL: v })).toBe(true);
    }
  });

  it('accepts falsy variants', () => {
    for (const v of ['0', 'false', 'FALSE', 'no', 'off', 'Off']) {
      expect(isLowLatencyRetrievalEnabled({ LOW_LATENCY_RETRIEVAL: v })).toBe(false);
    }
  });

  it('defaults to false for garbage', () => {
    expect(isLowLatencyRetrievalEnabled({ LOW_LATENCY_RETRIEVAL: 'maybe' })).toBe(false);
  });
});
