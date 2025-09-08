# Chat Hooks (Draft)

## Phases (Planned)

1. preChatTurn – Prepare context, enforce budgets
2. postModelDraft – Inspect raw model output for policies / adjustments
3. postModeration – React to moderation signals, redact or abort
4. prePersistTurn – Final normalization & state transaction proposal stage

## Extension Integration

- Manifest lists `chatHooks` participation.
- Ordering determined by manifest priority + registration overrides.
- Concurrency + budgets enforced by runtime (pending implementation).

## Data Passed (Planned Shape)

- Session metadata (user roles, game id)
- Recent turns (bounded window)
- Retrieved context (vector + canonical fallback)
- Extension scratchpad (per-turn ephemeral space)

## Safety & Policy

- Token budget checks before/after draft
- Profanity / disallowed content filters in postModeration
- Deterministic redact transforms applied before persistence

## Metrics (Planned)

- Hook execution duration
- Overhead vs baseline chat cycle
- Budget exceed count
- Moderation intervention rate
