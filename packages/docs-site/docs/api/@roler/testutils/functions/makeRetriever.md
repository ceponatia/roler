[**Documentation**](../../../README.md)

***

# Function: makeRetriever()

> **makeRetriever**\<`TCandidate`\>(`rows`, `vectorMs`): [`RetrieverLike`](../interfaces/RetrieverLike.md)\<`TCandidate`\>

Defined in: [index.ts:36](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/testutils/src/index.ts#L36)

## Type Parameters

### TCandidate

`TCandidate` *extends* `Readonly`\<\{ `chunkId`: `string`; `diversityBoost?`: `number`; `entityId`: `string`; `similarity`: `number`; `updatedAt`: `string`; \}\>

## Parameters

### rows

readonly `TCandidate`[]

### vectorMs

`number` = `5`

## Returns

[`RetrieverLike`](../interfaces/RetrieverLike.md)\<`TCandidate`\>
