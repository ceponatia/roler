# Validation Error Codes (VAL_*)

This note catalogs standardized validation error codes used across inbound validation.

- `VAL_MISSING_FIELD` — Required field is missing (often `invalid_type` with `received: undefined`).
- `VAL_TYPE_MISMATCH` — Field present but wrong type.
- `VAL_UNAUTHORIZED_FIELD` — Unrecognized/extra key when using `.strict()` schemas.
- `VAL_SCHEMA_VIOLATION` — Generic schema violation fallback or non-Zod errors.

References

- Schemas package: `@roler/schemas` (`mapZodError`, `validate`)
- Tech spec: `docs/design/r-004-boundary-safety-techspec.md`
