# PRD: Relational Vector Datastore (R-012)

Requirement ID: R-012
Source: requirements.md Section 3 (Platform & Technology)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide a single transactional relational datastore (Postgres) augmented with vector similarity (pgvector) to support unified ACID entity management and retrieval workflows during early and mid-scale phases before migration to specialized vector backends.

## Problem / Opportunity

Maintaining separate systems early (OLTP + dedicated vector DB) increases operational complexity, cost, and synchronization risk. Leveraging Postgres with pgvector supplies sufficient performance (<10M chunks) while simplifying transactions and reducing initial TCO.

## Goals

- Support atomic writes of entity data and associated embeddings.
- Enable efficient top-k similarity queries within established latency targets (PT-140 baseline).
- Provide schema migrations & index management for vector operations.

## Non-Goals

- Implementing approximate ANN algorithms beyond pgvector capabilities.
- Advanced multi-region replication strategies (handled later if needed).

## User Stories

1. As a developer, I can insert entity text and embedding in a single transaction so that data and vector remain consistent.
2. As an operator, I can monitor vector index health and size for capacity planning.
3. As a developer, I can run parameterized top-k searches with filters without writing raw SQL.

## Functional Scope

- Migration scripts for vector columns, indexes (ivfflat / hnsw configurable), and statistics.
- Repository / DAO abstraction exposing typed CRUD + similarity API.
- Maintenance tasks: index vacuum/analyze guidance.
- Configuration for distance metric (cosine vs euclidean) aligned with embedding model.

## Out of Scope

- Cross-database dual-write (covered in R-056 / future alternative backend PRDs).
- Real-time replication lag monitoring dashboards.

## Acceptance Criteria

- GIVEN an entity insertion WITH embedding WHEN transaction commits THEN both row and vector present atomically (verified by test rollback scenario).
- GIVEN a similarity query (k=10) over N=1M vectors WHEN executed under nominal load THEN p95 latency ≤250 ms.
- GIVEN a migration applying new index parameters WHEN completed THEN existing queries continue to function (compatibility test passes).
- GIVEN a failed transaction during embedding insert WHEN rolled back THEN no orphan vector rows remain.
- All criteria trace back to R-012.

## Metrics / KPIs

- Vector Query p95 Latency: ≤250 ms (<10M chunks).
- Failed Orphan Vector Rows Count: 0.
- Index Build Duration for 1M vectors: Tracked (baseline recorded for capacity planning).

## Risks & Mitigations

- Risk: Single DB bottleneck under growth → Mitigation: Clear migration path to specialized backend (R-013, R-056).
- Risk: Index parameter misconfiguration → Mitigation: Config validation + documented defaults.
- Risk: Large transaction contention → Mitigation: Batch embedding writes with size threshold guidance.

## Dependencies

- Postgres 15+ with pgvector extension.
- Embedding generation pipeline (R-043) producing vectors.

## Security / Privacy Considerations

- Ensure embeddings do not leak restricted GM-only content to unauthorized contexts (redaction upstream per R-059/067/077).
- Access limited to app role; no superuser operations at runtime (migration phase only).

## Performance Considerations

- Periodic reindexing or clustering guidelines documented.
- Monitoring of table + index bloat via system metrics.

## Accessibility & UX Notes

- N/A (backend); admin docs must be clear and include sample queries.

## Operational Considerations

- Migration ordering ensures pgvector extension present before dependent objects.
- Alert thresholds: query p95 > target for 3 consecutive intervals triggers evaluation of R-013 migration timeline.

## Open Questions

- OQ-R012-01: Default index type (ivfflat vs hnsw) for baseline corpus?
- OQ-R012-02: Automated vs manual index rebuild trigger thresholds.

## Alternatives Considered

- Early adoption of dedicated vector DB: Rejected to reduce early complexity and cost.
- Storing vectors in separate table with foreign key: Rejected for baseline; inlined column simplifies atomic writes (revisit if size concerns emerge).

## Definition of Done

- Vector schema & migrations merged.
- CRUD + similarity repository with tests (including rollback scenario) implemented.
- Performance baseline recorded and documented.
- Operations guide section published.

## Appendix (Optional)

Example similarity query wrapper (pseudo):

SELECT id, distance
FROM vector_search($1::vector, k := 10, filters := $2);

---
Template compliance confirmed.
