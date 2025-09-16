[**Documentation**](../../../README.md)

***

# Function: mapErrorToSchemaError()

> **mapErrorToSchemaError**(`err`): `object`

Defined in: [rag/src/lib/errors.ts:7](https://github.com/ceponatia/roler/blob/1efd6363aec6d66587551f7c0b65cf6ffafb4079/packages/rag/src/lib/errors.ts#L7)

## Parameters

### err

`unknown`

## Returns

`object`

### code

> **code**: `"parse"` \| `"refine"` \| `"policy"` \| `"safety"` \| `"RETR_TIMEOUT_SOFT"` \| `"RETR_TIMEOUT_HARD"` \| `"RETR_INVALID_REQUEST"` \| `"RETR_VECTOR_EXEC_ERROR"` \| `"RETR_CACHE_FAILURE"` \| `"RETR_INSUFFICIENT_RESULTS"` \| `"VER_VERSION_NOT_FOUND"` \| `"VER_INVALID_PARENT_REFERENCE"` \| `"VER_LINEAGE_CYCLE_DETECTED"` \| `"VER_MERGE_NO_COMMON_ANCESTOR"` \| `"VER_CONFLICTS_EXCEED_LIMIT"` \| `"VER_ROLLBACK_TARGET_INVALID"` \| `"VER_DIFF_ENTITY_MISMATCH"`

### fieldPath?

> `optional` **fieldPath**: `string`

### hint?

> `optional` **hint**: `string`

### message

> **message**: `string`
