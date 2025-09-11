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
