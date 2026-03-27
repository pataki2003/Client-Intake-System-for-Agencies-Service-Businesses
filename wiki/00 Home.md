# 00 Home

## Purpose

This is the working home page for the Client Intake System wiki. It should help a developer or product owner understand the system quickly, find the right source-of-truth page, and move from orientation to implementation without digging through the codebase first.

## Current State

- Status: MVP plus immediate growth planning
- Primary stack: Next.js App Router, Supabase, OpenAI API, Resend, Vercel
- Current branch model in active use: `develop` for integration, `main` for production releases
- Current major capabilities:
  - Public intake form at `/start-project`
  - Admin login at `/login`
  - Protected admin dashboard at `/admin`
  - Intake detail workspace at `/admin/intakes/[id]`
  - AI-generated internal brief
  - Confirmation email on successful submission

## How It Works

### Project at a glance

- A visitor submits a structured request through the public form.
- The server validates the payload, stores the client and intake data in Supabase, stores raw answers for auditability, and attempts to send a confirmation email.
- An authenticated admin reviews the submission in the dashboard, adds notes, updates workflow status, and can generate an AI brief from the intake data.

### Current status

- The app is intentionally MVP-oriented and single-tenant.
- Public submission writes currently use the Supabase service role from server-only code.
- Admin access is based on Supabase Auth plus `app_metadata.role = admin`.
- There is no committed CI workflow or automated test suite in the repo yet; the current quality gate is `lint`, `typecheck`, and `build`.

### Start here

1. Read [01 Getting Started](./01%20Getting%20Started.md) to run the app locally.
2. Read [10 System Architecture](./10%20System%20Architecture.md) to understand the high-level flow.
3. Read [20 Database Overview](./20%20Database%20Overview.md) and [22 API Flows](./22%20API%20Flows.md) before changing backend behavior.
4. Read the feature page for the area you are modifying before editing UI or server logic.

### Useful links

- Core orientation:
  - [02 Product Overview](./02%20Product%20Overview.md)
  - [10 System Architecture](./10%20System%20Architecture.md)
  - [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- Delivery and operations:
  - [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
  - [41 Development Workflow](./41%20Development%20Workflow.md)
  - [42 Testing & Quality Gates](./42%20Testing%20%26%20Quality%20Gates.md)
- Product management:
  - [50 Roadmap](./50%20Roadmap.md)
  - [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
  - [52 Decision Log](./52%20Decision%20Log.md)

## Dependencies

- Supabase for database and authentication
- OpenAI Responses API for brief generation
- Resend for confirmation emails
- Vercel as the intended deployment target

## Open Questions

- Should the wiki eventually split product-facing documentation and engineering runbooks into separate navigation zones?
- Should deployment decisions that live outside the repo be mirrored here as screenshots or only as text instructions?

## Related Pages

- [01 Getting Started](./01%20Getting%20Started.md)
- [10 System Architecture](./10%20System%20Architecture.md)
- [20 Database Overview](./20%20Database%20Overview.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
