# Copilot Prompt

Goal: Maintain `@roler/schemas` — single source of runtime validation (Zod) + inferred TS types. No new patterns beyond this file. Append status at bottom each turn.

## Zod Schema and Build Guidelines

### 1. Scope

- Canonical vs Instance entities (+ lineage/version).
- System (user/session/permission/events), RAG, LLM tool IO, API contracts.
- Extension platform (manifest / registration / state transactions) — runtime executor pending.

### 2. Layout

`base/` primitives+enums+attribute, `entity/{canonical,instance}`, `system/`, `llm/`, `rag/`, `api/`, `server.ts` (server-only refinements), `client.ts` (client-safe), root `index.ts` (public surface). No cycles. Names: `XxxSchema` + `Xxx` type.

### 3. IDs & Audit

ULID `id`; ISO `createdAt/updatedAt`; `createdBy/updatedBy/source`; `version`; canonical `lineageId`.

### 4. Canonical vs Instance

Canonical: status `draft|published|archived`, immutable post publish. Instance: declares `mutableAttributes` + `changePolicy`.

### 5. Attribute System

`{ keyPath, value, confidence, lastUpdatedBy, updatedAt, evidenceRefs[] }`; value union includes primitives/enums/date/range/tuple/json. Enums centralized in `base/enums.ts`.

### 6. Relationships

Canonical type: participants, exclusivity, stages. Instance relationship: participants, typeRef, intensity, stage, history, boundaries, consent flags.

### 7. Scene/Episode

Scene: sessionId, settingRef, participants, summary(VectorizableText), beats, tags. Episode/Turn: inputs, llmOutputs, appliedChanges, memoryWrites, seed, modelInfo.

### 8. Memory & Retrieval

Memory: kind, scope (L1/L2/L3), salience, decayPolicy. VectorizableText: text + embed + chunk + namespace + contentTags.

### 9. Change Control

Entities: allowedKeys, requiresEvidence, rateLimit, stability. Update envelope: proposedBy/proposedAt/rationale/evidenceRefs/policyCheck; moderator override supported.

### 10. Content Controls

contentRating, nsfwTags, blockedTags, ageCheck; refinements enforce constraints.

### 11. Enums

Centralized: EntityKind, HairColor, EducationLevel, ContentRating, RelationshipStage, ToneTag, EmotionVADTag, etc.

### 12. DB Integration

Schemas are contracts mapping to Prisma; always `safeParse` at boundaries.

### 13. LLM & API

Schemas for: ProposeChange, RetrieveContext, CreateScene (input/output). Policies enforce evidence + rate limits (advanced policy pending).

### 14. Validation Tiers

Tier A structural; Tier B cross-field; Tier C mutability/policy/safety (partially pending).

### 15. Error Model

Shape: { code, fieldPath, message, hint? }; codes: parse | refine | policy | safety.

### 16. Testability

Factories produce valid objects; snapshot `.describe()` for surface stability; include negative tests.

## Wireframe

@roler/schemas
├─ base/
│ ├─ primitives ← ULID, ISODate, VectorizableText
│ ├─ enums ← EntityKind, ContentRating, RelationshipStage...
│ └─ attribute ← AttributeSchema
│
├─ entity/canonical/
│ ├─ CharacterSchema
│ ├─ LocationSchema
│ ├─ ItemSchema
│ ├─ RelationshipTypeSchema
│ └─ PromptTemplateSchema
│
├─ entity/instance/
│ ├─ CharacterInstanceSchema
│ ├─ ItemInstanceSchema
│ ├─ RelationshipSchema
│ ├─ SceneSchema
│ ├─ EpisodeSchema
│ └─ MemorySchema
│
├─ system/
│ ├─ UserSchema
│ ├─ SessionSchema
│ ├─ PermissionSchema
│ └─ StateChangeEventSchema
│
├─ llm/
│ ├─ ProposeChangeSchemas
│ ├─ RetrieveContextSchemas
│ └─ CreateSceneSchemas
│
├─ rag/
│ ├─ EmbeddingMeta
│ └─ RetrievalQuerySchemas
│
├─ api/
│ ├─ ChatSchemas
│ ├─ SceneSchemas
│ └─ MemorySchemas
│
├─ index.ts
├─ server.ts
└─ client.ts

### Status (9-8-25 8:40AM)

Completed: Core + extension schemas, factories, snapshots, coverage merge hardening, Codacy workflow.
Next: Tier B/C policy refinements, extension runtime, semver validation, more negative tests (state tx conflicts), factory helpers for extensions.
