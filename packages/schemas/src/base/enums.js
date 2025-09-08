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
export const ContentRatingEnum = z.enum(['g', 'pg', 'pg13', 'r', 'nc17']);
export const RelationshipStageEnum = z.enum(['acquaintance', 'friendly', 'close', 'romantic', 'intimate', 'estranged']);
export const MemoryScopeEnum = z.enum(['L1', 'L2', 'L3']);
export const ErrorCodeEnum = z.enum(['parse', 'refine', 'policy', 'safety']);
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
//# sourceMappingURL=enums.js.map