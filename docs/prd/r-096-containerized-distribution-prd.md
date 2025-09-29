# PRD: R-096 Containerized Distribution

Requirement ID: R-096
Source: requirements.md Section 20
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Deliver system components as versioned container images supporting reproducible builds and deployment to orchestration platforms (Kubernetes, Nomad, etc.).

## Problem / Opportunity

Containerization standardizes runtime, eases scaling and CI/CD integration, and enables isolated performance debugging.

## Goals

- Deterministic builds with pinned dependencies.
- Multi-stage Dockerfiles minimizing image size.
- SBOM generation for security review.

## Non-Goals

- Helm charts (can be future enhancement).

## User Stories

1. As an operator, I can pull a tagged image and deploy identical environment.
2. As a developer, I can reproduce a production issue locally via same image.
3. As security auditor, I can view SBOM to assess vulnerabilities.

## Functional Scope

- Dockerfiles for web & worker apps.
- Build pipeline producing tagged & latest images.
- SBOM export (e.g., Syft) artifact.

## Out of Scope

- Full GitOps deployment pipeline.

## Acceptance Criteria

- GIVEN commit tag WHEN pipeline runs THEN images with matching tag pushed.
- GIVEN image scan WHEN executed THEN critical vulnerabilities count reported (target 0 before release).
- GIVEN local run WHEN using image THEN service boots with validated config.

## Metrics / KPIs

- Image build duration.
- Critical vuln count per release.

## Risks & Mitigations

- Risk: Large image size → Mitigation: prune dev deps, use distroless.
- Risk: Supply chain vulnerability → Mitigation: regular dependency scans.

## Dependencies

- R-094 (validated env), build system.

## Security / Privacy Considerations

- No secrets baked into images; runtime injection only.

## Performance Considerations

- Optimize for startup time (layer cache, minimal runtime layers).

## Operational Considerations

- Versioning: semantic tags + commit SHA.

## Open Questions

- OQ: Use BuildKit cache exporter to speed builds?

## Alternatives Considered

- Bare metal/manual deployment — rejected (non-reproducible, slower scaling).

## Definition of Done

- Images build & push in CI.
- SBOM produced & archived.
- Docs include run examples.

---
