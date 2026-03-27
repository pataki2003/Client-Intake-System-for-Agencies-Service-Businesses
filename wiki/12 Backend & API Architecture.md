# 12 Backend & API Architecture

## Purpose

This page explains how backend responsibilities are split between route handlers, validation, business logic, and data access.

## Current State

- API layer lives in `src/app/api/*`
- Business logic lives in `src/server/*`
- Validation lives in `src/lib/validations/*`
- Shared provider clients live in `src/lib/*`
- All current API routes explicitly run on the Node.js runtime

## How It Works

### API surface

- Public route:
  - `POST /api/public-intakes`
- Admin routes:
  - `PATCH /api/admin/intakes/[id]/status`
  - `POST /api/admin/intakes/[id]/notes`
  - `POST /api/admin/intakes/[id]/brief`

### Server layer responsibilities

- Route handlers:
  - Parse request input
  - Enforce auth where needed
  - Return HTTP responses and status codes
- Validation layer:
  - Owns input shape checks and human-readable validation errors
- Server workflows:
  - Own database writes
  - Build provider payloads
  - Decide side effects such as email send or brief upsert
- Shared clients:
  - Supabase SSR auth client
  - Supabase service-role client
  - OpenAI client
  - Resend client

### Validation flow

- Public intake:
  - Zod validates all fields
  - Empty optional strings are normalized to `null`
  - Email is lowercased before persistence
  - `service_type_other` becomes required when `service_type = other`
- Admin actions:
  - Intake ID must be a UUID
  - Status must be one of the allowed enum values
  - Note body must be non-empty and under 4,000 characters

### Error handling

- Route handlers return user-facing JSON errors, not raw stack traces.
- Public intake returns field-level errors when validation fails.
- Admin routes return `401` when the session user is not an admin.
- Brief generation maps common OpenAI failures into clearer operational errors.
- Email failure is logged and does not block a successful intake submission.

Current backend constraints:

- No queue or worker layer
- No retry orchestration for AI or email
- No versioned API; routes are internal to this app

## Dependencies

- Route handlers depend on server workflows staying side-effect aware
- Business logic depends on service-role access for current persistence model
- Validation contracts must stay aligned with UI field names

## Open Questions

- Should side effects like email and AI move to background jobs as soon as preview/production traffic increases?
- Should route-level error responses be standardized further for shared frontend handling?

## Related Pages

- [10 System Architecture](./10%20System%20Architecture.md)
- [22 API Flows](./22%20API%20Flows.md)
- [21 Supabase Schema & RLS](./21%20Supabase%20Schema%20%26%20RLS.md)
- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
