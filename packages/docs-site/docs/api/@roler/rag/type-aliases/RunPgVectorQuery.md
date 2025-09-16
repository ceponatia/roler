[**Documentation**](../../../README.md)

***

# Type Alias: RunPgVectorQuery()

> **RunPgVectorQuery** = (`embedding`, `k`, `args`) => `Promise`\<readonly [`PgVectorRow`](PgVectorRow.md)[]\>

Defined in: [rag/src/lib/retriever.ts:29](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/rag/src/lib/retriever.ts#L29)

## Parameters

### embedding

readonly `number`[]

### k

`number`

### args

`Readonly`\<\{ `filters?`: `Readonly`\<`Record`\<`string`, `string` \| `number` \| `boolean`\>\>; `namespace?`: `string`; \}\>

## Returns

`Promise`\<readonly [`PgVectorRow`](PgVectorRow.md)[]\>
