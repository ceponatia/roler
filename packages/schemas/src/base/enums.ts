import { z } from 'zod';

export const EntityKindEnum = z.enum([
  'character',
  'location',
  'item',
  'relationshipType',
  'promptTemplate',
  'characterInstance',
  'itemInstance',
  'relationship',
  'scene',
  'episode',
  'memory'
]);
export type EntityKind = z.infer<typeof EntityKindEnum>;

export const ContentRatingEnum = z.enum(['g', 'pg', 'pg13', 'r', 'nc17']);
export type ContentRating = z.infer<typeof ContentRatingEnum>;

export const RelationshipStageEnum = z.enum(['acquaintance', 'friendly', 'close', 'romantic', 'intimate', 'estranged']);
export type RelationshipStage = z.infer<typeof RelationshipStageEnum>;

export const MemoryScopeEnum = z.enum(['L1', 'L2', 'L3']);
export type MemoryScope = z.infer<typeof MemoryScopeEnum>;

export const ErrorCodeEnum = z.enum([
  'parse',
  'refine',
  'policy',
  'safety',
  // Retrieval-specific (R-002)
  'RETR_TIMEOUT_SOFT',
  'RETR_TIMEOUT_HARD',
  'RETR_INVALID_REQUEST',
  'RETR_VECTOR_EXEC_ERROR',
  'RETR_CACHE_FAILURE',
  'RETR_INSUFFICIENT_RESULTS',
  // Versioning-specific (R-003)
  'VER_VERSION_NOT_FOUND',
  'VER_INVALID_PARENT_REFERENCE',
  'VER_LINEAGE_CYCLE_DETECTED',
  'VER_MERGE_NO_COMMON_ANCESTOR',
  'VER_CONFLICTS_EXCEED_LIMIT',
  'VER_ROLLBACK_TARGET_INVALID',
  'VER_DIFF_ENTITY_MISMATCH'
]);
export type ErrorCode = z.infer<typeof ErrorCodeEnum>;

// Additional controlled vocabularies
export const HairColorEnum = z.enum([
  'black',
  'brown',
  'blonde',
  'red',
  'auburn',
  'gray',
  'white',
  'blue',
  'green',
  'pink',
  'purple',
  'dyed',
  'bald'
]);
export type HairColor = z.infer<typeof HairColorEnum>;

export const EducationLevelEnum = z.enum([
  'none',
  'primary',
  'secondary',
  'associate',
  'bachelor',
  'master',
  'doctorate',
  'vocational',
  'other'
]);
export type EducationLevel = z.infer<typeof EducationLevelEnum>;

export const ToneTagEnum = z.enum([
  'serious',
  'humorous',
  'sarcastic',
  'romantic',
  'tense',
  'mysterious',
  'cheerful',
  'grim',
  'hopeful',
  'melancholic'
]);
export type ToneTag = z.infer<typeof ToneTagEnum>;

// Simple emotional valence/arousal/dominance tags (coarse buckets)
export const EmotionVADTagEnum = z.enum([
  'calm',
  'excited',
  'happy',
  'sad',
  'angry',
  'fearful',
  'disgusted',
  'surprised',
  'neutral'
]);
export type EmotionVADTag = z.infer<typeof EmotionVADTagEnum>;
