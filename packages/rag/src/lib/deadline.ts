export type DeadlineSnapshot = Readonly<{
  startMs: number;
  nowMs: number;
  elapsedMs: number;
  remainingSoftMs: number;
  remainingHardMs: number;
  softExceeded: boolean;
  hardExceeded: boolean;
}>;

export interface DeadlineController {
  snapshot(): DeadlineSnapshot;
  softExceeded(): boolean;
  hardExceeded(): boolean;
  timeLeftMs(): number; // time until hard deadline
}

export function createDeadlineController(params: Readonly<{ softMs: number; hardMs: number; now?: () => number }>): DeadlineController {
  if (!(params.hardMs > 0) || !(params.softMs > 0) || !(params.softMs < params.hardMs)) {
    throw new Error('Invalid deadlines: require 0 < softMs < hardMs');
  }
  const clock = params.now ?? (() => Date.now());
  const startMs = clock();
  
  const api: DeadlineController = {
    snapshot(): DeadlineSnapshot {
      const nowMs = clock();
      const elapsedMs = Math.max(0, nowMs - startMs);
      const remainingSoftMs = Math.max(0, params.softMs - elapsedMs);
      const remainingHardMs = Math.max(0, params.hardMs - elapsedMs);
      const softExceeded = remainingSoftMs === 0 && elapsedMs >= params.softMs;
      const hardExceeded = remainingHardMs === 0 && elapsedMs >= params.hardMs;
      return { startMs, nowMs, elapsedMs, remainingSoftMs, remainingHardMs, softExceeded, hardExceeded } as const;
    },
    softExceeded(): boolean {
      return this.snapshot().softExceeded;
    },
    hardExceeded(): boolean {
      return this.snapshot().hardExceeded;
    },
    timeLeftMs(): number {
      return this.snapshot().remainingHardMs;
    }
  };

  return api;
}
