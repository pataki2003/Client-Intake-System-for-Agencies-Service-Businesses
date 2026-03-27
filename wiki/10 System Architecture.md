# 10 System Architecture

## Purpose

This page is the top-level map of how the application is structured across UI, server logic, data storage, AI generation, authentication, and external services.

## Current State

- Framework: Next.js App Router
- Data and auth: Supabase
- AI: OpenAI Responses API
- Email: Resend
- Deployment target: Vercel
- Server-side business logic lives in `src/server/*`
- Shared helpers and clients live in `src/lib/*`

## How It Works

### High-level diagram

```text
Public browser
  -> /start-project form
  -> POST /api/public-intakes
  -> validation + normalization
  -> Supabase service-role writes
  -> clients + intakes + intake_answers
  -> confirmation email attempt
  -> /success

Admin browser
  -> /login
  -> Supabase auth session
  -> /admin and /admin/intakes/[id]
  -> server-side data loaders
  -> status updates, notes, AI brief generation
  -> Supabase service-role reads/writes
  -> ai_briefs + internal_notes updates
```

### Core flows

1. Public intake submission
   - The public form collects contact, scope, context, deadline, and budget data.
   - `POST /api/public-intakes` validates the payload and calls `createPublicIntakeSubmission`.
   - The server creates or reuses a `clients` row, creates an `intakes` row, stores ordered raw answers in `intake_answers`, and attempts to send a confirmation email.

2. Admin review
   - `/admin` loads a list of intakes and derived dashboard stats.
   - `/admin/intakes/[id]` loads the full intake, notes, and brief.
   - Admins can update status, add notes, and generate or regenerate the AI brief.

3. AI brief generation
   - A button click triggers `POST /api/admin/intakes/[id]/brief`.
   - The server loads the intake detail, builds a prompt payload, requests structured output from OpenAI, renders markdown, and upserts the result into `ai_briefs`.

### Service boundaries

- `src/app/*`
  - Routes, layouts, pages, API handlers
- `src/components/*`
  - Rendering and interactive UI only
- `src/lib/*`
  - Shared clients, validation, formatters, helpers
- `src/server/*`
  - Business logic and server-only workflows
- `supabase/migrations/*`
  - Database source of truth

### External dependencies

- Supabase:
  - Postgres tables
  - Auth sessions
  - Row Level Security
- OpenAI:
  - Structured brief generation
- Resend:
  - Confirmation email delivery
- Vercel:
  - Local, preview, and production hosting model

## Dependencies

- App Router pages depend on server data loaders and shared types
- Server workflows depend on environment variables and provider availability
- Admin features depend on Supabase Auth plus the admin role claim

## Open Questions

- Should AI brief generation stay synchronous or move to background jobs before production load increases?
- Should admin reads migrate away from service-role access to user-scoped queries over time?

## Related Pages

- [11 Frontend Architecture](./11%20Frontend%20Architecture.md)
- [12 Backend & API Architecture](./12%20Backend%20%26%20API%20Architecture.md)
- [20 Database Overview](./20%20Database%20Overview.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
