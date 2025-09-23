[**Documentation**](../../../README.md)

***

# Interface: Retriever

Defined in: [rag/src/lib/retriever.ts:17](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/rag/src/lib/retriever.ts#L17)

## Methods

### retrieve()

> **retrieve**(`opts`): `Promise`\<`Readonly`\<\{ `candidates`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `diversityBoost?`: `number`; `entityId`: [`Ulid`](../type-aliases/Ulid.md); `similarity`: `number`; `updatedAt`: [`IsoDateTime`](../type-aliases/IsoDateTime.md); \}\>[]; `vectorMs`: `number`; \}\>\>

Defined in: [rag/src/lib/retriever.ts:18](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/rag/src/lib/retriever.ts#L18)

#### Parameters

##### opts

[`RetrieveOpts`](../type-aliases/RetrieveOpts.md)

#### Returns

`Promise`\<`Readonly`\<\{ `candidates`: readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `diversityBoost?`: `number`; `entityId`: [`Ulid`](../type-aliases/Ulid.md); `similarity`: `number`; `updatedAt`: [`IsoDateTime`](../type-aliases/IsoDateTime.md); \}\>[]; `vectorMs`: `number`; \}\>\>
