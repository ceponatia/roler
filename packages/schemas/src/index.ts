// Legacy canonical content schema intentionally not exported to avoid duplication.
export * from './base/primitives.js';
export * from './base/enums.js';
export * from './base/attribute.js';
export * from './entity/canonical/index.js';
export * from './entity/canonical/character.js';
export * from './entity/canonical/location.js';
export * from './entity/canonical/item.js';
export * from './entity/canonical/relationship-type.js';
export * from './entity/canonical/prompt-template.js';
export * from './entity/canonical/migrations.js';
export * from './entity/instance/index.js';
export * from './entity/instance/character-instance.js';
export * from './entity/instance/item-instance.js';
export * from './entity/instance/relationship.js';
export * from './entity/instance/scene.js';
export * from './entity/instance/episode.js';
export * from './entity/instance/memory.js';
export * from './errors.schema.js';
export * from './system/user.js';
export * from './system/permission.js';
export * from './system/session.js';
export * from './system/state-change-event.js';
export * from './system/change-proposal.js';
// Versioning (R-003)
export * from './system/versioning/index.js';

// Retrieval (R-002)
export * from './rag/embedding.js';
export * from './rag/retrieval.js';
export * from './rag/retrieval-low-latency.js';
export * from './llm/propose-change.js';
export * from './llm/retrieve-context.js';
export * from './llm/create-scene.js';
export * from './api/chat.js';
export * from './api/scene.js';
export * from './api/memory.js';
export * from './factories/index.js';

// Extension Framework (R-001)
export * from './system/extensions/extension-manifest.schema.js';
export * from './system/extensions/extension-registration-config.schema.js';
export * from './system/extensions/state-transaction.schema.js';
export * from './system/env/extensions-env.schema.js';
export * from './system/env/extensions-runtime-env.schema.js';

// Core entities (contracts-first): GameInstance, TextChunk, CanonRelease
export * from './game-instance.schema.js';
export * from './text-chunk.schema.js';
export * from './canon-release.schema.js';
