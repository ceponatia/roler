[**Documentation**](../../../README.md)

***

# Function: adaptiveRetrieve()

> **adaptiveRetrieve**(`input`): `Promise`\<`Readonly`\<\{ `adaptiveUsed`: `boolean`; `items`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `entityId`: [`Ulid`](../type-aliases/Ulid.md); `reasonBits`: readonly `string`[]; `score`: `number`; \}\>[]; `stats`: `Readonly`\<\{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}\>; `timings`: `Readonly`\<\{ `postProcessMs`: `number`; `vectorMs`: `number`; \}\>; \}\>\>

Defined in: [rag/src/lib/adaptive.ts:28](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/rag/src/lib/adaptive.ts#L28)

## Parameters

### input

[`AdaptiveKInput`](../type-aliases/AdaptiveKInput.md)

## Returns

`Promise`\<`Readonly`\<\{ `adaptiveUsed`: `boolean`; `items`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `entityId`: [`Ulid`](../type-aliases/Ulid.md); `reasonBits`: readonly `string`[]; `score`: `number`; \}\>[]; `stats`: `Readonly`\<\{ `candidateCount`: `number`; `filteredCount`: `number`; `kRequested`: `number`; `kUsed`: `number`; \}\>; `timings`: `Readonly`\<\{ `postProcessMs`: `number`; `vectorMs`: `number`; \}\>; \}\>\>
