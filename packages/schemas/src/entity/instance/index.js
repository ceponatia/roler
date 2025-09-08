import { z } from 'zod';
import { CharacterInstanceSchema } from './character-instance.js';
import { EpisodeInstanceSchema } from './episode.js';
import { ItemInstanceSchema } from './item-instance.js';
import { MemoryInstanceSchema } from './memory.js';
import { RelationshipInstanceSchema } from './relationship.js';
import { SceneInstanceSchema } from './scene.js';
// Use union then refine by discriminant to avoid early evaluation issues if any circular loading.
export const InstanceEntitySchema = z.discriminatedUnion('kind', [
    CharacterInstanceSchema,
    ItemInstanceSchema,
    RelationshipInstanceSchema,
    SceneInstanceSchema,
    EpisodeInstanceSchema,
    MemoryInstanceSchema
]);
//# sourceMappingURL=index.js.map