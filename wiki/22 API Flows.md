# 22 API Flows

## Purpose

This page documents the real request and response behavior of the current API routes.

## Current State

- API style: internal Next.js route handlers
- Content type: JSON requests and JSON responses
- Auth split:
  - Public submission route is unauthenticated
  - Admin routes require an authenticated admin session
- All current routes run on the Node.js runtime

## How It Works

### Endpoint catalog

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/public-intakes` | None | Create a new intake submission |
| `PATCH` | `/api/admin/intakes/[id]/status` | Admin | Update intake workflow status |
| `POST` | `/api/admin/intakes/[id]/notes` | Admin | Add an internal note |
| `POST` | `/api/admin/intakes/[id]/brief` | Admin | Generate or regenerate an AI brief |

### Flow diagrams

#### `POST /api/public-intakes`

1. Parse JSON body
2. Validate with `publicIntakeSchema`
3. Normalize values
4. Find or create client by email
5. Insert intake record
6. Insert ordered answer rows
7. Attempt confirmation email send
8. If email succeeds, update `confirmation_sent_at`
9. Return `201` with `{ success: true, intakeId }`

#### `PATCH /api/admin/intakes/[id]/status`

1. Check admin session
2. Validate intake ID
3. Parse JSON body
4. Validate `status`
5. Update `intakes.status`
6. Return updated status payload

#### `POST /api/admin/intakes/[id]/notes`

1. Check admin session
2. Validate intake ID
3. Parse JSON body
4. Validate note body
5. Insert into `internal_notes`
6. Return created note payload

#### `POST /api/admin/intakes/[id]/brief`

1. Check admin session
2. Validate intake ID
3. Load intake detail
4. Build AI prompt payload
5. Request structured output from OpenAI
6. Render markdown
7. Upsert `ai_briefs`
8. Return brief payload

### Validation

- Public intake validation:
  - required contact, scope, and context fields
  - conditional validation for `service_type_other`
  - date-format validation for `deadline`
- Admin validation:
  - intake ID must be UUID
  - note body required and capped at 4,000 characters
  - status must match the known enum values

### Side effects

- Public intake:
  - creates multiple Supabase records
  - captures `referer` and `user-agent` metadata when available
  - attempts Resend email delivery
- Brief route:
  - triggers OpenAI request
  - overwrites the existing brief for the intake if one exists

### Failure cases

- Public intake:
  - `400` if body cannot be parsed or fields are invalid
  - `500` for server/database failure
  - email failure is logged but still allows success
- Admin routes:
  - `401` for non-admin users
  - `400` for invalid IDs or payloads
  - `404` for missing intake where applicable
  - `429`, `502`, or `500` for AI/provider failures on brief generation

## Dependencies

- Routes depend on shared validation schemas staying aligned with frontend fields
- Admin routes depend on auth middleware and role checks
- Provider-facing routes depend on environment variables and external service uptime

## Open Questions

- Should the app expose a read-only admin API layer beyond page-driven server fetching?
- Should request tracing or structured request IDs be added for operational debugging?

## Related Pages

- [12 Backend & API Architecture](./12%20Backend%20%26%20API%20Architecture.md)
- [20 Database Overview](./20%20Database%20Overview.md)
- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
- [43 Troubleshooting & Runbooks](./43%20Troubleshooting%20%26%20Runbooks.md)
