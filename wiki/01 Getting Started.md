# 01 Getting Started

## Purpose

This page is the shortest reliable path from a fresh clone to a working local environment.

## Current State

- Package manager in repo: `npm`
- Required services: Supabase, OpenAI, Resend
- Schema management: SQL migrations in `supabase/migrations/`
- Verification commands already available:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

## How It Works

### Prerequisites

- A modern Node.js LTS version compatible with Next.js 15
- An accessible Supabase project
- OpenAI API credentials for brief generation
- Resend API credentials for confirmation emails

### Environment variables

Copy `.env.example` to `.env.local` and set the following values:

```powershell
Copy-Item .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAILS`

Notes:

- `OPENAI_MODEL` currently defaults to `gpt-5-mini` if omitted.
- `ADMIN_EMAILS` exists in the environment template but is not yet enforced by the current auth flow.

### Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Apply the Supabase migrations in order:
   - `supabase/migrations/202603270001_initial_client_intake_schema.sql`
   - `supabase/migrations/202603270002_mvp_schema_hardening.sql`

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the main routes:
   - `/`
   - `/start-project`
   - `/success`
   - `/login`
   - `/admin`

### Smoke test checklist

- Public flow:
  - Submit a valid intake at `/start-project`
  - Confirm redirect to `/success`
  - Confirm new rows in `clients`, `intakes`, and `intake_answers`
- Admin flow:
  - Sign in through `/login` with a Supabase user whose `app_metadata.role` is `admin`
  - Confirm `/admin` loads
  - Open one intake detail page and save a status change
  - Add an internal note
- AI flow:
  - Generate a brief from the intake detail page
  - Confirm `ai_briefs` contains both markdown and structured JSON
- Delivery flow:
  - Run `npm run lint`
  - Run `npm run typecheck`
  - Run `npm run build`

## Dependencies

- Supabase project with schema applied
- Supabase Auth user marked as admin in `app_metadata`
- Valid OpenAI API key for brief generation
- Valid Resend API key and sender email for confirmation messages

## Open Questions

- Should local development standardize on Supabase local containers instead of a hosted project?
- Should a seed script be added for admin users and test intakes?

## Related Pages

- [10 System Architecture](./10%20System%20Architecture.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- [21 Supabase Schema & RLS](./21%20Supabase%20Schema%20%26%20RLS.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
