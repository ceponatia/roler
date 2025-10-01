import { describe, expect, it, vi } from 'vitest';

import { createDeadlineController } from '../deadline.js';

describe('deadline controller', () => {
  it('tracks soft and hard exceedance', () => {
    let now = 0;
    const dc = createDeadlineController({ softMs: 100, hardMs: 200, now: () => now });
    let s = dc.snapshot();
    expect(s.softExceeded).toBe(false);
    expect(s.hardExceeded).toBe(false);
    now = 120;
    s = dc.snapshot();
    expect(s.softExceeded).toBe(true);
    expect(s.hardExceeded).toBe(false);
    now = 220;
    s = dc.snapshot();
    expect(s.hardExceeded).toBe(true);
    expect(dc.timeLeftMs()).toBe(0);
  });

  it('exposes softExceeded() and hardExceeded() accessors', () => {
    let now = 0;
    const dc = createDeadlineController({ softMs: 50, hardMs: 90, now: () => now });

    expect(dc.softExceeded()).toBe(false);
    expect(dc.hardExceeded()).toBe(false);

    now = 60;
    expect(dc.softExceeded()).toBe(true);
    expect(dc.hardExceeded()).toBe(false);

    now = 120;
    expect(dc.hardExceeded()).toBe(true);
    expect(dc.timeLeftMs()).toBe(0);
  });

  it('rejects invalid params', () => {
    expect(() => createDeadlineController({ softMs: 0, hardMs: 100 })).toThrow();
    expect(() => createDeadlineController({ softMs: 100, hardMs: 50 })).toThrow();
  });

  it('falls back to Date.now when no clock is provided', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(1_000);
      const dc = createDeadlineController({ softMs: 10, hardMs: 20 });

      vi.setSystemTime(1_015);
      expect(dc.snapshot().elapsedMs).toBe(15);
      expect(dc.timeLeftMs()).toBe(5);
    } finally {
      vi.useRealTimers();
    }
  });
});
