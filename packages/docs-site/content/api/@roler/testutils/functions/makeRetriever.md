[**Documentation**](../../../README.md)

***

# Function: makeRetriever()

> **makeRetriever**\<`TCandidate`\>(`rows`, `vectorMs`): [`RetrieverLike`](../interfaces/RetrieverLike.md)\<`TCandidate`\>

Defined in: [index.ts:36](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/testutils/src/index.ts#L36)

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
