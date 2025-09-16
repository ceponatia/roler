[**Documentation**](../../README.md)

***

# @roler/rag

Low-latency retrieval orchestration utilities for R-002.

## Install

This package is part of the monorepo and is consumed via workspace imports.

## Quickstart (Feature-gated)

```ts
import { createGatedRetrievalOrchestrator } from '@roler/rag';

const orchestrate = createGatedRetrievalOrchestrator({ retriever, embedder, queryCache });
const res = await orchestrate({ queryText, gameId });
```

If the env flag is off, the gated orchestrator throws. Catch and route to your legacy path:

```ts
try {
  const res = await orchestrate(req);
  // ...
} catch (e) {
  if (String(e.message).includes('R-002 disabled')) {
    return legacyRetrieve(req);
  }
  throw e;
}
```

## Enable the Flag (fish)

```fish
set -x LOW_LATENCY_RETRIEVAL true
```

Unset to disable:

```fish
set -e LOW_LATENCY_RETRIEVAL
```

Accepted truthy: 1, true, yes, on. Falsy: 0, false, no, off.

## Interfaces

- [Retriever](interfaces/Retriever.md)

## Type Aliases

- [AdaptiveKInput](type-aliases/AdaptiveKInput.md)
- [AdaptiveKResult](type-aliases/AdaptiveKResult.md)
- [Candidate](type-aliases/Candidate.md)
- [CounterKeys](type-aliases/CounterKeys.md)
- [Embedder](type-aliases/Embedder.md)
- [GateOptions](type-aliases/GateOptions.md)
- [HistoKeys](type-aliases/HistoKeys.md)
- [IsoDateTime](type-aliases/IsoDateTime.md)
- [KnownError](type-aliases/KnownError.md)
- [MetricsSnapshot](type-aliases/MetricsSnapshot.md)
- [OrchestratorDeps](type-aliases/OrchestratorDeps.md)
- [PgVectorRow](type-aliases/PgVectorRow.md)
- [PostProcessInput](type-aliases/PostProcessInput.md)
- [PostProcessItem](type-aliases/PostProcessItem.md)
- [PostProcessResult](type-aliases/PostProcessResult.md)
- [RagEnv](type-aliases/RagEnv.md)
- [RetrieveOpts](type-aliases/RetrieveOpts.md)
- [RetrieveResult](type-aliases/RetrieveResult.md)
- [RunPgVectorQuery](type-aliases/RunPgVectorQuery.md)
- [ScoredCandidate](type-aliases/ScoredCandidate.md)
- [ScoringWeights](type-aliases/ScoringWeights.md)
- [Ulid](type-aliases/Ulid.md)

## Variables

- [DEFAULT\_WEIGHTS](variables/DEFAULT_WEIGHTS.md)

## Functions

- [adaptiveRetrieve](functions/adaptiveRetrieve.md)
- [computeRecencyWeight](functions/computeRecencyWeight.md)
- [createGatedRetrievalOrchestrator](functions/createGatedRetrievalOrchestrator.md)
- [createPgVectorRetriever](functions/createPgVectorRetriever.md)
- [createRetrievalOrchestrator](functions/createRetrievalOrchestrator.md)
- [deterministicSort](functions/deterministicSort.md)
- [getRetrievalMetricsSnapshot](functions/getRetrievalMetricsSnapshot.md)
- [incCounter](functions/incCounter.md)
- [isLowLatencyRetrievalEnabled](functions/isLowLatencyRetrievalEnabled.md)
- [mapErrorToSchemaError](functions/mapErrorToSchemaError.md)
- [observe](functions/observe.md)
- [postProcess](functions/postProcess.md)
- [resetMetrics](functions/resetMetrics.md)
- [resolveRetrievalConfig](functions/resolveRetrievalConfig.md)
- [scoreAndSort](functions/scoreAndSort.md)
- [scoreCandidates](functions/scoreCandidates.md)
