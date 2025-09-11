-- CreateTable
CREATE TABLE "CanonVersion" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "lineageRootId" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "attributes" JSONB NOT NULL,
    "baseHash" TEXT NOT NULL,
    "integrityChecksum" TEXT NOT NULL,
    "changeSummary" TEXT,
    "meta" JSONB,

    CONSTRAINT "CanonVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonTextChunk" (
    "id" BIGSERIAL NOT NULL,
    "versionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "CanonTextChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonVersionParent" (
    "id" BIGSERIAL NOT NULL,
    "parentVersionId" TEXT NOT NULL,
    "childVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "CanonVersionParent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_canonversion_entity_seq" ON "CanonVersion"("entityId", "seq");

-- CreateIndex
CREATE INDEX "idx_canonversion_entity_created" ON "CanonVersion"("entityId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_chunk_version_index" ON "CanonTextChunk"("versionId", "index");

-- CreateIndex
CREATE INDEX "idx_parent_child_child" ON "CanonVersionParent"("childVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "uq_parent_child" ON "CanonVersionParent"("parentVersionId", "childVersionId");

-- AddForeignKey
ALTER TABLE "CanonTextChunk" ADD CONSTRAINT "CanonTextChunk_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "CanonVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonVersionParent" ADD CONSTRAINT "CanonVersionParent_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "CanonVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonVersionParent" ADD CONSTRAINT "CanonVersionParent_childVersionId_fkey" FOREIGN KEY ("childVersionId") REFERENCES "CanonVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

