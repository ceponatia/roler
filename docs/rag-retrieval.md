# Retrieval & RAG (Draft)

## Current State

Schemas define embedding-related structures (`VectorizableText`, embedding metadata, retrieval query shapes) but runtime retriever implementation presently targets pgvector (future Qdrant support planned).

## Retrieval Strategy (Planned)

- Instance-first: prioritize recent / instance-scoped `AttrAtom` vectors
- Canonical fallback: use canonical `TextChunk` vectors when instance lacks context
- Hybrid scoring: blend semantic similarity and field importance (future)

## Data Structures

- Text Chunk: original text + vector + chunk metadata
- Attribute Atom: normalized attribute fact with optional vector representation
- Retrieval Query: structured filters + topK + namespace

## Future Enhancements

- Qdrant backend + dual-read feature flag
- Payload filtering (attribute class, scope)
- Adaptive chunk sizing based on token budget
- Caching layer (Redis) for hot queries

## Metrics (Planned)

- Query latency (p50/p95)
- Cache hit rate
- Recall approximations (sampled)
- Embedding throughput
