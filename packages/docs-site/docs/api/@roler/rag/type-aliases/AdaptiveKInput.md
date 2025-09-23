[**Documentation**](../../../README.md)

***

# Type Alias: AdaptiveKInput

> **AdaptiveKInput** = `Readonly`\<\{ `backendFilters?`: `Readonly`\<`Record`\<`string`, `string` \| `number` \| `boolean`\>\>; `baseK`: `number`; `diversityMinEntityPercent`: `number`; `embedding`: readonly `number`[]; `filterPredicate?`: (`c`) => `boolean`; `halfLifeMinutes`: `number`; `limit`: `number`; `maxKBoost`: `number`; `namespace?`: `string`; `now?`: () => `number`; `retriever`: [`Retriever`](../interfaces/Retriever.md); `softPartialDeadlineMs`: `number`; \}\>

Defined in: [rag/src/lib/adaptive.ts:6](https://github.com/ceponatia/roler/blob/3285898e6e20febeb11523af0dddefd8f892e902/packages/rag/src/lib/adaptive.ts#L6)
