import { describe, expect, it } from 'vitest';

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

  it('rejects invalid params', () => {
    expect(() => createDeadlineController({ softMs: 0, hardMs: 100 })).toThrow();
    expect(() => createDeadlineController({ softMs: 100, hardMs: 50 })).toThrow();
  });
});
