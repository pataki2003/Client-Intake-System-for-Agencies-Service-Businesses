# Client Intake System

Client Intake System is a full-stack intake and onboarding platform for agencies and service businesses. The current MVP includes a public intake form, a protected admin dashboard, AI-generated project briefs, internal notes, and confirmation email delivery after successful submissions.

## Current MVP

- Public intake flow at `/start-project`
- Supabase-backed `clients`, `intakes`, and `intake_answers` persistence
- Admin login and protected admin area
- Submission dashboard at `/admin`
- Intake detail page with status updates and internal notes
- AI-generated project brief creation with OpenAI
- Confirmation email sending with Resend

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Supabase Postgres + Supabase Auth
- OpenAI Responses API
- Resend
- Vercel-ready deployment target

## App Routes

Public routes:

- `/`
- `/start-project`
- `/success`
- `/login`

Admin routes:

- `/admin`
- `/admin/intakes/[id]`

API routes:

- `/api/public-intakes`
- `/api/admin/intakes/[id]/status`
- `/api/admin/intakes/[id]/notes`
- `/api/admin/intakes/[id]/brief`

## Data Model

The current MVP uses these core tables in Supabase Postgres:

- `clients`: canonical client contact records
- `intakes`: intake submissions, workflow status, and high-level project data
- `intake_answers`: ordered raw answers captured from the public form
- `ai_briefs`: generated project briefs stored as markdown plus structured JSON
- `internal_notes`: private admin notes attached to an intake

Database migrations live in `supabase/migrations/`.

The follow-up hardening migration adds:

- `brief_json` on `ai_briefs`
- `source_metadata` on `intakes`
- row level security policies for the main intake tables

## Environment Variables

App:

- `NEXT_PUBLIC_APP_URL`: base app URL for local development or deployment

Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`: project URL for browser and server Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon key used by server-side auth helpers
- `SUPABASE_SERVICE_ROLE_KEY`: service-role key used for protected server writes

OpenAI:

- `OPENAI_API_KEY`: API key for AI brief generation
- `OPENAI_MODEL`: model used for AI brief generation, currently defaulted to `gpt-5-mini`

Resend:

- `RESEND_API_KEY`: API key for confirmation email delivery
- `RESEND_FROM_EMAIL`: sender address for outbound confirmation emails

Access control:

- `ADMIN_EMAILS`: allowlist-style environment variable reserved for access control needs

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Fill in your Supabase, OpenAI, and Resend credentials in `.env.local`.

4. Apply the Supabase migrations from `supabase/migrations/` to your project database.

5. Start the development server:

   ```bash
   npm run dev
   ```

Verification commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## How It Works

Public intake flow:

- A visitor submits the public intake form at `/start-project`.
- The server validates the payload, creates or reuses a `clients` row, creates an `intakes` row, and stores the submitted answers in `intake_answers`.
- After a successful save, the app attempts to send a confirmation email. Email failures are logged safely and do not block the submission success response.

Admin workflow:

- Admin authentication uses Supabase SSR auth.
- Admin access is limited to authenticated users whose Supabase `app_metadata.role` is set to `admin`.
- The dashboard lists intake submissions, and the detail page supports status changes, internal notes, and AI brief generation.

AI brief generation:

- Admins can generate or regenerate a brief from the intake detail page.
- The brief is generated synchronously with the OpenAI Responses API.
- The app stores both structured JSON and rendered markdown in `ai_briefs`.

Architecture:

- UI components remain focused on rendering and interaction.
- Validation, data access, AI generation, and email sending stay in server-only layers.
- This keeps server/client separation clear and the MVP architecture simple.

## Project Structure

```text
src/
|- app/                    # App Router pages, layouts, and API routes
|- components/             # Reusable UI, intake, auth, and admin components
|- lib/                    # Shared helpers, validation, Supabase, email, and AI clients
|- server/                 # Server-only business logic for intakes, briefs, auth, and email
|- types/                  # Shared TypeScript domain types
`- emails/                 # Email content builders

supabase/
`- migrations/             # Database schema and hardening migrations
```

## Wiki

The repo includes a ready-to-use internal wiki scaffold in [`wiki/`](./wiki/).

- Start here: [`wiki/00 Home.md`](./wiki/00%20Home.md)
- Navigation source: [`wiki/_Sidebar.md`](./wiki/_Sidebar.md)

## Roadmap

- Richer admin filtering and search on the intake dashboard
- Editable or versioned AI project briefs
- Additional outbound email workflows beyond the initial confirmation email
- File uploads as part of intake or onboarding
- Stronger role management and multi-user admin tooling
- Deployment polish and operational hardening for Vercel + Supabase

## Notes

- The current architecture is intentionally single-tenant and MVP-oriented.
- Most writes run through server-side service-role operations for simplicity.
- Admin users are identified through Supabase Auth `app_metadata.role = admin`.
