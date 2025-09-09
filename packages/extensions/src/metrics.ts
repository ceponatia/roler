export type HookKind = 'normalize' | 'retrievalEnrichment' | 'preSaveValidate' | 'preChatTurn' | 'postModelDraft' | 'postModeration' | 'prePersistTurn';

export interface HookStartEvent { readonly extensionId: string; readonly hook: HookKind; readonly requestId?: string }
export interface HookEndEvent { readonly extensionId: string; readonly hook: HookKind; readonly durationMs: number; readonly timedOut?: boolean; readonly requestId?: string }
export interface HookErrorEvent { readonly extensionId: string; readonly hook: HookKind; readonly code: string; readonly requestId?: string }
export interface BudgetEvent { readonly extensionId: string; readonly hook: HookKind; readonly type: 'token' | 'time'; readonly requestId?: string }

export interface MetricsSink {
  onHookStart(e: HookStartEvent): void;
  onHookEnd(e: HookEndEvent): void;
  onHookError(e: HookErrorEvent): void;
  onBudgetOverrun(e: BudgetEvent): void;
}

class Noop implements MetricsSink {
  onHookStart(): void { /* noop */ }
  onHookEnd(): void { /* noop */ }
  onHookError(): void { /* noop */ }
  onBudgetOverrun(): void { /* noop */ }
}

let currentSink: MetricsSink = new Noop();

export function setMetricsSink(sink: MetricsSink): void {
  currentSink = sink;
}

export function getMetricsSink(): MetricsSink {
  return currentSink;
}
