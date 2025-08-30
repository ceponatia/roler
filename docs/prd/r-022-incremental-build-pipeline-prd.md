# PRD: R-022 Incremental / Affected Build Pipeline

Requirement ID: R-022
Source: requirements.md Section 4

## Summary

Implement an affected-only build/test pipeline to reduce CI duration and provide fast feedback loops.

## Problem / Opportunity

Full monorepo builds are slow and waste resources when only a subset of packages changed.

## Goals

- Detect dependency graph and limit build/test scope to changed + dependents
- Cache build artifacts between CI runs
- Provide summary of skipped vs executed tasks

## User Stories

1. As a contributor, I receive CI results faster when my change only touches one package.
2. As a maintainer, I can trust that all impacted packages were built and tested.

## Functional Scope

- Use Turborepo or pnpm recursive with filtering by git diff
- Remote build cache (S3 or filesystem) optional
- Output report listing tasks executed / skipped

## Acceptance Criteria

- GIVEN a change limited to one leaf package THEN CI completes in < X minutes (target baseline defined) and skips unrelated builds.
- GIVEN a change affecting a core shared package THEN dependent packages rebuild.

## Metrics / KPIs

- Average CI duration reduction (%) compared to full build baseline
- Cache hit rate > 70% after warm-up

## Risks & Mitigations

- Risk: Incorrect dependency graph misses rebuilds → Mitigation: Periodic full build validation job.

## Dependencies

- R-020 structure; R-021 boundaries for accurate dependency mapping

## Open Questions

- Preferred remote cache impl? (Turborepo native vs custom)

## Definition of Done

- Incremental pipeline merged, documentation added, sample timing metrics captured.
