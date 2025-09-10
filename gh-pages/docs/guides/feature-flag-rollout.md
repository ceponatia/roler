# Feature Flag Rollout (Retrieval)

The low-latency retrieval orchestrator ships behind an environment flag so you can enable it gradually and fall back at any time.

## Enabling/Disabling (fish shell)

- Enable for current session:

```fish
set -x LOW_LATENCY_RETRIEVAL true
```

- Disable (unset):

```fish
set -e LOW_LATENCY_RETRIEVAL
```

Accepted values (case-insensitive): `1`, `true`, `yes`, `on` for enabled; `0`, `false`, `no`, `off` for disabled.

## Using the Gated Orchestrator

Wire the orchestrator behind the gate in your API boundary. If the flag is off, route to your legacy retrieval path.

Pseudo-code outline:

```ts
import { createGatedRetrievalOrchestrator } from '@roler/rag';

// compose deps
const gated = createGatedRetrievalOrchestrator({ retriever, embedder, queryCache });

export async function handleRetrieval(req) {
	try {
		return await gated(req);
	} catch (e) {
		if (String(e.message).includes('Retrieval disabled')) {
			// fallback to legacy path
			return await legacyRetrieve(req);
		}
		throw e;
	}
}
```

## Notes

- Internal tools (e.g., the bench harness) can bypass the flag with `{ bypassFlag: true }` when creating the gated orchestrator.
- Keep the fallback path healthy until after canary + ramp-up is complete.
