# 14 Auth & Access Control

## Purpose

This page explains how authentication, authorization, session refresh, and data access boundaries work in the current MVP.

## Current State

- Authentication provider: Supabase Auth
- Session handling: Supabase SSR cookie flow plus middleware refresh
- Authorization model: `app_metadata.role = admin`
- Public submissions: server-only service-role writes
- Database policies: RLS enabled for main application tables

## How It Works

### Login flow

- `/login` renders the admin login form.
- `loginAdmin` signs the user in with email and password through Supabase.
- After sign-in, the app fetches the current user and requires `app_metadata.role === "admin"`.
- Non-admin users are immediately signed out and shown an access error.

### Protected routes

- `middleware.ts` calls `updateSession` for request-level session refresh.
- Server components call `requireAdminUser()` to protect admin pages.
- If the current user is missing or not an admin, the app redirects to `/login`.

### Admin authorization

- Current admin identity check is claim-based, not table-based.
- The database also defines a helper function `public.is_admin()` for future direct RLS-backed admin access.
- Current admin API routes still check auth in app code before performing writes.

### Security model

- `createServerSupabaseClient()` uses anon credentials for session-aware auth operations.
- `createServiceRoleClient()` uses the Supabase service role for server-only reads and writes.
- RLS policies allow authenticated admin users to read or mutate application tables directly if the JWT role is admin.
- Anonymous table access remains blocked because there are no anon policies.

### Current limits

- `ADMIN_EMAILS` is present in the environment template but not currently enforced.
- Most admin reads and writes still run through the service role, which bypasses the spirit of end-user scoping.
- There is only one role type documented in code today: `admin`.

## Dependencies

- Requires valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for auth flows
- Requires `SUPABASE_SERVICE_ROLE_KEY` for current server-side persistence model
- Depends on Supabase Auth user metadata being managed correctly

## Open Questions

- Should the app move from a single admin role to multiple internal roles?
- Should authorization eventually rely more on RLS-backed user access and less on service-role queries?

## Related Pages

- [10 System Architecture](./10%20System%20Architecture.md)
- [21 Supabase Schema & RLS](./21%20Supabase%20Schema%20%26%20RLS.md)
- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
- [41 Development Workflow](./41%20Development%20Workflow.md)
