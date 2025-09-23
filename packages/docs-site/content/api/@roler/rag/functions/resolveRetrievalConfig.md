[**Documentation**](../../../README.md)

***

# Function: resolveRetrievalConfig()

> **resolveRetrievalConfig**(`input?`): `object`

Defined in: [rag/src/lib/config.ts:6](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/rag/src/lib/config.ts#L6)

## Parameters

### input?

`Partial`\<\{ `baseK`: `number`; `diversityMinEntityPercent`: `number`; `embeddingCacheSize`: `number`; `enableAdaptiveK`: `boolean`; `entityContextCacheSize`: `number`; `maxKBoost`: `number`; `maxTotalDeadlineMs`: `number`; `partialReturnPolicy`: \{ `minResults`: `number`; `tag`: `"retrieval"`; \}; `queryResultCacheSize`: `number`; `recencyHalfLifeMinutes`: `number`; `softPartialDeadlineMs`: `number`; \}\>

## Returns

`object`

### baseK

> **baseK**: `number`

### diversityMinEntityPercent

> **diversityMinEntityPercent**: `number`

### embeddingCacheSize

> **embeddingCacheSize**: `number`

### enableAdaptiveK

> **enableAdaptiveK**: `boolean`

### entityContextCacheSize

> **entityContextCacheSize**: `number`

### maxKBoost

> **maxKBoost**: `number`

### maxTotalDeadlineMs

> **maxTotalDeadlineMs**: `number`

### partialReturnPolicy

> **partialReturnPolicy**: `object`

#### partialReturnPolicy.minResults

> **minResults**: `number`

#### partialReturnPolicy.tag

> **tag**: `"retrieval"`

### queryResultCacheSize

> **queryResultCacheSize**: `number`

### recencyHalfLifeMinutes

> **recencyHalfLifeMinutes**: `number`

### softPartialDeadlineMs

> **softPartialDeadlineMs**: `number`
