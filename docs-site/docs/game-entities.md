# Game Entities

## Object Repositories

### Object File Structure

- Layer 1 - Canon (immutable): One file per entity (character/location/item/etc.). Stored content-addressed (by hash). New edits create a new version, never mutate the old one.
- Layer 2 - Instances (per-game): When a game starts, selected canon is cloned into game-scoped instances that can be edited. Instances keep a pointer to the canon version they came from.
- Indexing for RAG: Hybrid retrieval:
  - Structured (JSONB/GiN) on fields like tags, faction, biome, etc.
  - Vector (pgvector) on field - or chunk-level text (bio, history, notes).
  - Keep field_path on each chunk so you can pull only relevant fields (e.g., traits.personality, not the whole file).

### File Format

Use JSON (or YAML) with a small, explicit schema. Make the file path = content hash to enforce immutability.
Storage: Git repo. A CI job ingests/validates these into Postgres + object storage.

### Database Schema (Posgres + pgvector)

# Game Entities

## Object Repositories

### Object File Structure

- Layer 1 - Canon (immutable): One file per entity (character/location/item/etc.). Stored content-addressed (by hash). New edits create a new version, never mutate the old one.
- Layer 2 - Instances (per-game): When a game starts, selected canon is cloned into game-scoped instances that can be edited. Instances keep a pointer to the canon version they came from.
- Indexing for RAG: Hybrid retrieval:
  - Structured (JSONB/GiN) on fields like tags, faction, biome, etc.
  - Vector (pgvector) on field - or chunk-level text (bio, history, notes).
  - Keep field_path on each chunk so you can pull only relevant fields (e.g., traits.personality, not the whole file).

### File Format

Use JSON (or YAML) with a small, explicit schema. Make the file path = content hash to enforce immutability.
Storage: Git repo. A CI job ingests/validates these into Postgres + object storage.

### Database Schema (Posgres + pgvector)

Prisma-style sketch (names can be adjusted):

```prisma
model CanonObject {
  id         String   @id // ULID (logical id across versions)
  type       String   // 'character' | 'location' | 'item'
  title      String
  createdAt  DateTime @default(now())
  // convenience: current pointer (optional)
  currentVersionId String?
  currentVersion   CanonVersion? @relation("CurrentVersion", fields: [currentVersionId], references: [id])

  versions   CanonVersion[]
}

model CanonVersion {
  id         String   @id // ULID
  canonId    String
  canon      CanonObject @relation(fields: [canonId], references: [id])

  hash       String   // sha256
  blobUrl    String   // s3://… or repo path
  tags       Json     // from file.tags
  searchable Json     // from file.searchable
  createdAt  DateTime @default(now())

  chunks     TextChunk[]
  /// Unique: a canon can't have duplicate content hashes
  @@unique([canonId, hash])
}

model Game {
  id         String   @id // ULID
  name       String
  createdAt  DateTime @default(now())
  entities   GameEntity[]
}

model GameEntity {
  id              String   @id // ULID
  gameId          String
  game            Game     @relation(fields: [gameId], references: [id])

  canonId         String            // pointer to logical canon id
  canonVersionId  String            // snapshot provenance
  canonVersion    CanonVersion      @relation(fields: [canonVersionId], references: [id])

  // Editable per-game state:
  // either full materialized copy OR overlay/patch (see below)
  state           Json              // materialized merged document
  overrides       Json?             // optional RFC6902 patch for diffs

  chunks          TextChunk[]       // instance-specific chunks/embeddings
  createdAt       DateTime @default(now())
}

/// Field- or chunk-level text, with embeddings.
/// ownerType + ownerId let you store chunks for either a canon version or a game entity.
model TextChunk {
  id          String   @id
  ownerType   String   // 'canon' | 'instance'
  ownerId     String   // CanonVersion.id or GameEntity.id
  fieldPath   String   // e.g., 'fields.personality', 'fields.history[2].desc'
  text        String
  embedding   Bytes    // pgvector; Prisma stores via Bytes; use raw SQL for <=> ops
  meta        Json?

  // Useful composite index for structured filters
  @@index([ownerType, ownerId])
}
```

### Ingestion Pipeline

1. validate files against JSON schema with Zod.
2. Compute hash (sh256). If hash already exists for that canon id, skip.
3. Insert CanonObject (upsert by id), then create CanonVersion.
4. Chunk & embed each RAG-relevant field
5. Store each chunk as a TextChunk with ownerType='canon', ownerId=CanonVersion.id, and fieldpath.

## Cloning

When the user selects entities and a game is created:

1. Read the CanonVersion.
2. Build a materialized state (copy of the file's fields + selected metadata).
3. Create GameEntity with canonId, canonVersionId, state, overrides.
4. Create instance-level chunks for RAG with ownerType='instance', ownerId=GameEntity.id. Re-embed intance chunks when state changes.

## Retrieval (hybri, field aware)

1. Filter: Use SQL/Prisma to filter by type, tags, or searchable.
2. Vector search.
3. Return {snippet, fieldPath, ownerType, ownerId} so the prompt can slot the snippet into the right contextual section ("Personality, "History", etc.).

## Immutability Guarantees

- Files are content-addressed (version = sha256).
- DB enforces uniqueness per (canonId, hash).
- CanonVersion rows can only be altered by the owner via an edit method in their control panel; never alter them during a game.
- GameEntity always records canonVersionId provenance, so you know exactly what it cloned from.

## Updating canon vs. game instances

- If a new canon version is published (edited by the owner), leave existing game entities untouched. New canon version only affects new games.

## Clear module seams

- @app/canon (load/validate/import files)
- @app/rag (chunk, embed, retrieve)
- @app/games (clone, patch, merge)

