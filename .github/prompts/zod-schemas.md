# Copilot Prompt

You are tasked with building the `@roler/schemas` package for the Roler project.
Read the end of this file to see if any to-do' were left from the last turn.
Follow the requirements and folder structure outlined below.  
**Do not invent new types or patterns beyond what is specified.**  
All schemas must use Zod for runtime validation and export inferred TypeScript types for compile-time safety.  
Respect canonical vs instance entity boundaries, RAG embedding metadata, mutability guardrails, and error contracts.
When finished with your turn, append what was completed and what is left to do at the end of this file.

---

## Zod Schema and Build Guidelines

### 1. Scope & Goals

- Centralize all runtime validation in `@roler/schemas`.
- Cover **canonical entities** (immutable design records), **instance entities** (per-game, mutable), **system/infra**, **RAG contracts**, and **LLM tool I/O**.
- Preserve **canonical source of truth** with lineage and versioning.
- Support **RAG retrieval** with field-level embedding metadata.
- Enforce **mutability and change control** with event logging and guardrails.

### 2. Package Layout & Conventions

@roler/schemas
├─ base/ ← primitives, enums, attribute model
├─ entity/
│ ├─ canonical/ ← Character, Location, Item, RelationshipType, PromptTemplate
│ └─ instance/ ← CharacterInstance, ItemInstance, Relationship, Scene, Episode, Memory
├─ system/ ← User, Session, Permission, Event
├─ llm/ ← tool I/O, controller policies
├─ rag/ ← embedding metadata, retrieval query shapes
├─ api/ ← request/response contracts
├─ index.ts ← public exports
├─ server.ts ← server-only refinements
└─ client.ts ← client-safe subsets

- Naming: `XxxSchema` for Zod object, `Xxx` for `z.infer`.
- Top-level discriminated union with `kind` property.
- No circular dependencies.

### 3. IDs, Dates, Audit

- `id`: ULID.  
- `createdAt`, `updatedAt` (ISO).  
- `createdBy`, `updatedBy`, `source`.  
- `version` (monotonic), `lineageId` (canonical ancestry).  

### 4. Canonical vs Instance

- **Canonical**: immutable after publish; status = `draft|published|archived`.  
- **Instance**: mutable per session; must declare `mutableAttributes` allowlist and `changePolicy`.  

### 5. Attribute System

- Schema: `{ keyPath, value, confidence, lastUpdatedBy, updatedAt, evidenceRefs[] }`.  
- Value union: `string | number | boolean | enum | date | range | tuple | json`.  
- Controlled vocab enums in `/base/enums.ts`.  

### 6. Relationships

- **RelationshipType (canonical)**: name, allowed participants, exclusivity, default stages.  
- **Relationship (instance)**: participants, `typeRef`, `intensity`, `stage`, `history[]`, `boundaries`.  
- Consent/safety flags with last-confirmed timestamps.  

### 7. Scene / Episode / Turn

- **Scene**: `sessionId`, `title`, `settingRef`, `participants[]`, `summary(VectorizableText)`, `beats[]`, `tags`.  
- **Episode/Turn**: atomic exchange; includes `inputs`, `llmOutputs`, `appliedChanges`, `memoryWrites`, `seed`, `modelInfo`.  

### 8. Memory & Retrieval

- **Memory**: `kind`, `scope(L1|L2|L3)`, `salience`, `decayPolicy`.  
- **VectorizableText**: `{ text, embed, chunk, namespace, contentTags[] }`.  
- Embed RAG-relevant fields with chunk metadata.  

### 9. LLM Change Control

- Each entity declares `allowedKeys`, `requiresEvidence`, `rateLimit`, `stability`.  
- Update envelope: `proposedBy`, `proposedAt`, `rationale`, `evidenceRefs`, `policyCheck`.  
- Support moderator overrides.  

### 10. Content Controls

- Flags: `contentRating`, `nsfwTags[]`, `blockedTags[]`, `ageCheck`.  
- Refinements reject disallowed tags at parse time.  

### 11. Enums & Controlled Vocabularies

Centralized enums: `EntityKind`, `HairColor`, `EducationLevel`, `ContentRating`, `RelationshipStage`, `ToneTag`, `EmotionVADTag`, etc.  

### 12. DB Integration

- Schemas = runtime contracts.  
- Map to Prisma models (see `game-entities.md`).  
- No unchecked input; always validate with `safeParse`.  

### 13. API & Tool I/O

- Define schemas for LLM tools:  
  - ProposeChangeInput/Output  
  - RetrieveContextInput/Output  
  - CreateSceneInput/Output  
- Controller policies enforce evidence/rate limits.  

### 14. Validation Tiers

- **Tier A**: parse & types.  
- **Tier B**: cross-field constraints.  
- **Tier C**: mutability, policy, safety.  

### 15. Error Model

- `{ code, fieldPath, message, hint? }`.  
- Codes: `parse | refine | policy | safety`.  

### 16. Testability

- Factory helpers (`makeCharacter()`) generate valid objects.  
- Snapshot schema `.describe()` outputs in CI.  
- Stable surface with deprecation tags.  

---

## Wireframe Mockup

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

---

## Acceptance Checklist

- [x] Implement branded primitives, enums, and `VectorizableText`.  
- [x] Build `Attribute` schema and typed values.  
- [x] Define discriminated unions for all entities.  
- [x] Encode mutability and `StateChangeEvent`.  
- [x] Add romance-centric relationships.  
- [x] Provide scene/episode/memory with RAG metadata.  
- [x] Implement content controls.  
- [x] Add API + LLM tool contracts.  
- [x] Export consistent error model.  
- [x] Include test factories and schema snapshots.

### Status (appended this turn)

Completed: Core schemas (canonical & instance with romance + content controls), enums extended, attribute model, RAG + LLM + API contracts, error model, factories, snapshot & factory tests (currently fixing ULID generation), discriminated unions restored.
Remaining / Next Opportunities: Tier B/C advanced policy refinements (rate limiting, evidence enforcement) not yet encoded; potential migration/versioning helpers; client/server differential refinements (placeholders only); improve ULID generator robustness if needed; add more factory coverage & negative tests.
