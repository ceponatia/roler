[**Documentation**](../../../README.md)

***

# Function: adaptiveRetrieve()

> **adaptiveRetrieve**(`input`): `Promise`\<`Readonly`\<\{ `adaptiveUsed`: `boolean`; `items`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `entityId`: [`Ulid`](../type-aliases/Ulid.md); `reasonBits`: readonly `string`[]; `score`: `number`; \}\>[]; `stats`: `Readonly`\<\{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}\>; `timings`: `Readonly`\<\{ `postProcessMs`: `number`; `vectorMs`: `number`; \}\>; \}\>\>

Defined in: [rag/src/lib/adaptive.ts:28](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/rag/src/lib/adaptive.ts#L28)

## Parameters

### input

[`AdaptiveKInput`](../type-aliases/AdaptiveKInput.md)

## Returns

`Promise`\<`Readonly`\<\{ `adaptiveUsed`: `boolean`; `items`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `entityId`: [`Ulid`](../type-aliases/Ulid.md); `reasonBits`: readonly `string`[]; `score`: `number`; \}\>[]; `stats`: `Readonly`\<\{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}\>; `timings`: `Readonly`\<\{ `postProcessMs`: `number`; `vectorMs`: `number`; \}\>; \}\>\>
