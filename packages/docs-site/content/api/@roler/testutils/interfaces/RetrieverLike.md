[**Documentation**](../../../README.md)

***

# Interface: RetrieverLike\<TCandidate\>

Defined in: [index.ts:17](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/testutils/src/index.ts#L17)

## Type Parameters

### TCandidate

`TCandidate` *extends* [`CandidateLike`](../type-aliases/CandidateLike.md)

## Methods

### retrieve()

> **retrieve**(`opts`): `Promise`\<`Readonly`\<\{ `candidates`: readonly `TCandidate`[]; `vectorMs`: `number`; \}\>\>

Defined in: [index.ts:18](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/testutils/src/index.ts#L18)

#### Parameters

##### opts

`Readonly`\<`Record`\<`string`, `unknown`\>\>

#### Returns

`Promise`\<`Readonly`\<\{ `candidates`: readonly `TCandidate`[]; `vectorMs`: `number`; \}\>\>
