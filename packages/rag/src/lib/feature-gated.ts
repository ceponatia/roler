import { isLowLatencyRetrievalEnabled } from './env.js';
import { createRetrievalOrchestrator, type OrchestratorDeps } from './orchestrator.js';

import type { RetrievalConfig, RetrievalRequest, RetrievalResponse } from '@roler/schemas';

export type GateOptions = Readonly<{
  bypassFlag?: boolean; // for tests or internal CLI usage
}>;

export function createGatedRetrievalOrchestrator(
  deps: OrchestratorDeps,
  baseConfig?: Partial<RetrievalConfig>,
  opts?: GateOptions
): (request: RetrievalRequest, overrides?: Partial<RetrievalConfig>) => Promise<RetrievalResponse> {
  const execute = createRetrievalOrchestrator(deps, baseConfig);
  const bypass = opts?.bypassFlag === true;
  return async (request, overrides) => {
    if (!bypass && !isLowLatencyRetrievalEnabled()) {
      const err = new Error('R-002 disabled: set LOW_LATENCY_RETRIEVAL=true to enable the low-latency retrieval path.');
      // Throwing here is acceptable: this function is a boundary entrypoint.
      throw err;
    }
    return execute(request, overrides);
  };
}
