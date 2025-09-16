[**Documentation**](../../../README.md)

***

# Function: scoreCandidates()

> **scoreCandidates**(`candidates`, `opts`): readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `composite`: `number`; `diversityBoost`: `number`; `entityId`: [`Ulid`](../type-aliases/Ulid.md); `recency`: `number`; `sim`: `number`; `updatedAt`: [`IsoDateTime`](../type-aliases/IsoDateTime.md); \}\>[]

Defined in: [rag/src/lib/scoring.ts:38](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/rag/src/lib/scoring.ts#L38)

## Parameters

### candidates

readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `diversityBoost?`: `number`; `entityId`: [`Ulid`](../type-aliases/Ulid.md); `similarity`: `number`; `updatedAt`: [`IsoDateTime`](../type-aliases/IsoDateTime.md); \}\>[]

### opts

`Readonly`\<\{ `halfLifeMinutes`: `number`; `now?`: `number`; `weights?`: [`ScoringWeights`](../type-aliases/ScoringWeights.md); \}\>

## Returns

readonly `Readonly`\<\{ `chunkId`: [`Ulid`](../type-aliases/Ulid.md); `composite`: `number`; `diversityBoost`: `number`; `entityId`: [`Ulid`](../type-aliases/Ulid.md); `recency`: `number`; `sim`: `number`; `updatedAt`: [`IsoDateTime`](../type-aliases/IsoDateTime.md); \}\>[]
