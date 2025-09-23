[**Documentation**](../../../README.md)

***

# Function: createGatedRetrievalOrchestrator()

> **createGatedRetrievalOrchestrator**(`deps`, `baseConfig?`, `opts?`): (`request`, `overrides?`) => `Promise`\<\{ `errors`: `object`[]; `issuedAt?`: `string`; `items`: readonly `object`[]; `partial`: `boolean`; `partialReason?`: `"SOFT_TIMEOUT"` \| `"HARD_TIMEOUT"` \| `"ADAPTIVE_LIMIT"`; `requestId?`: `string` & `BRAND`\<`"Ulid"`\>; `stats`: \{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}; `timings`: \{ `cacheMs`: `number`; `postProcessMs`: `number`; `totalMs`: `number`; `vectorMs`: `number`; \}; \}\>

Defined in: [rag/src/lib/feature-gated.ts:10](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/rag/src/lib/feature-gated.ts#L10)

## Parameters

### deps

[`OrchestratorDeps`](../type-aliases/OrchestratorDeps.md)

### baseConfig?

`Partial`\<\{ `baseK`: `number`; `diversityMinEntityPercent`: `number`; `embeddingCacheSize`: `number`; `enableAdaptiveK`: `boolean`; `entityContextCacheSize`: `number`; `maxKBoost`: `number`; `maxTotalDeadlineMs`: `number`; `partialReturnPolicy`: \{ `minResults`: `number`; `tag`: `"retrieval"`; \}; `queryResultCacheSize`: `number`; `recencyHalfLifeMinutes`: `number`; `softPartialDeadlineMs`: `number`; \}\>

### opts?

`Readonly`\<\{ `bypassFlag?`: `boolean`; \}\>

## Returns

> (`request`, `overrides?`): `Promise`\<\{ `errors`: `object`[]; `issuedAt?`: `string`; `items`: readonly `object`[]; `partial`: `boolean`; `partialReason?`: `"SOFT_TIMEOUT"` \| `"HARD_TIMEOUT"` \| `"ADAPTIVE_LIMIT"`; `requestId?`: `string` & `BRAND`\<`"Ulid"`\>; `stats`: \{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}; `timings`: \{ `cacheMs`: `number`; `postProcessMs`: `number`; `totalMs`: `number`; `vectorMs`: `number`; \}; \}\>

### Parameters

#### request

##### actorEntityId?

`string` & `BRAND`\<`"Ulid"`\>

##### gameId

`string` & `BRAND`\<`"Ulid"`\>

##### includeRestricted?

`boolean`

##### limit?

`number`

##### queryText

`string`

#### overrides?

`Partial`\<\{ `baseK`: `number`; `diversityMinEntityPercent`: `number`; `embeddingCacheSize`: `number`; `enableAdaptiveK`: `boolean`; `entityContextCacheSize`: `number`; `maxKBoost`: `number`; `maxTotalDeadlineMs`: `number`; `partialReturnPolicy`: \{ `minResults`: `number`; `tag`: `"retrieval"`; \}; `queryResultCacheSize`: `number`; `recencyHalfLifeMinutes`: `number`; `softPartialDeadlineMs`: `number`; \}\>

### Returns

`Promise`\<\{ `errors`: `object`[]; `issuedAt?`: `string`; `items`: readonly `object`[]; `partial`: `boolean`; `partialReason?`: `"SOFT_TIMEOUT"` \| `"HARD_TIMEOUT"` \| `"ADAPTIVE_LIMIT"`; `requestId?`: `string` & `BRAND`\<`"Ulid"`\>; `stats`: \{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}; `timings`: \{ `cacheMs`: `number`; `postProcessMs`: `number`; `totalMs`: `number`; `vectorMs`: `number`; \}; \}\>
