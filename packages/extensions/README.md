# @roler/extensions

Early scaffolding package providing the public facade for authoring Roler extensions.

Status: Experimental (see R-001 technical spec). Implemented so far: manifest utilities, discovery, registry builder (structural + version/peer checks, ordering), hook hydration, and initial execution pipelines (core + chat phases) with simple first-wins conflict policy.

## Exports

- `extensionsApiVersion`: Semver string representing the current public extensions API version.
- `createExtension(manifest, hooks)`: Helper performing schema validation (structural only) and freezing returned object.
- Manifest / hook related TypeScript types re-exported from `@roler/schemas`.
- `discoverExtensions(opts)`: Scans monorepo `packages/*/package.json` for the `rolerExtension` key (or allowlist) and returns validated manifests.
- `loadExtensions(opts)`: Builds a registry (ordering by priority desc then id asc) and performs duplicate id, core API version range, and peer extension checks.
- `hydrateHooks(extensions)`: Imports hook function exports per manifest declarations (normalization, retrievalEnrichment, preSaveValidate, and chat phases: preChatTurn, postModelDraft, postModeration, prePersistTurn).
- Core data pipelines: `runNormalization`, `runRetrievalEnrichment`, `runPreSaveValidation`.
- Chat pipelines: `runPreChatTurn`, `runPostModelDraft`, `runPostModeration`, `runPrePersistTurn`.
  - All pipelines apply a first-wins merge per top-level key: the earliest (highest priority) extension providing a non-undefined value for a key locks that key for later hooks.

## Notes

`discoverExtensions` performs only structural validation.
`loadExtensions` adds semantic checks: duplicate id, core API compatibility, peer resolution.

Pipelines (current semantics):

- Execution order: registry ordering (priority desc, then id asc).
- Conflict policy: first-wins per key (normalization, retrieval enrichment, chat phases). Validation pipeline accumulates errors (strict mode throws on first error; non-strict collects).

Future work (not implemented yet):

- Budgets & performance thresholds (warn/fail) per extension.
- Concurrency limits & kill switches.
- State transaction support & advanced conflict resolution policies.
- Unsafe capability gating & data class scope enforcement.
- Metrics, tracing, and overhead measurement.
- Enhanced chat hook context types and structured outputs.

Current limitations: simple first-wins merges, no timing budgets, no isolation for side effects, no state transaction engine.

### Quick Example

```ts
import { loadExtensions } from '@roler/extensions';

const registry = await loadExtensions({ coreApiVersion: '1.0.0' });
if (registry.errors.length) {
  for (const err of registry.errors) {
    console.warn(err.code, err.message);
  }
}
for (const ext of registry.extensions) {
  console.log(ext.manifest.id, ext.manifest.version);
}

// Hydrate and run chat pipelines (example)
import { hydrateHooks, runPreChatTurn } from '@roler/extensions';

const hydrated = await hydrateHooks(registry.extensions);
const preChat = await runPreChatTurn({
  extensions: hydrated,
  input: { userMessage: 'Hello world' },
});
console.log(preChat.result);
```
