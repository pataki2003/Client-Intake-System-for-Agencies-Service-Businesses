# 43 Troubleshooting & Runbooks

## Purpose

This page is the first-stop operational guide when the app is broken, misconfigured, or behaving unexpectedly.

## Current State

- Main operational risk areas:
  - missing environment variables
  - Supabase auth or key issues
  - OpenAI brief generation failures
  - Resend delivery failures
  - preview versus production config drift

## How It Works

### Common failure modes

- Admin login fails for a valid user
- `/admin` redirects unexpectedly
- Public submission returns a generic error
- AI brief generation fails or hangs
- Confirmation emails do not send
- Preview behaves differently from local

### How to diagnose

- Admin login or redirect issues
  - confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - confirm the user exists in Supabase Auth
  - confirm `app_metadata.role = admin`
- Public submission issues
  - confirm `SUPABASE_SERVICE_ROLE_KEY`
  - confirm migrations were applied
  - inspect server logs for insert failures
- AI brief issues
  - confirm `OPENAI_API_KEY`
  - confirm the configured model is available to the project
  - inspect route logs for `429`, `502`, or refusal-related errors
- Email issues
  - confirm `RESEND_API_KEY`
  - confirm `RESEND_FROM_EMAIL`
  - confirm the sender domain or address is valid in Resend
- Preview drift
  - compare preview env vars with local and production
  - confirm the right Supabase project is connected

### How to recover

- Auth issue:
  - repair user role metadata
  - sign out and sign back in
- Database issue:
  - reapply missing migrations in non-production
  - correct the environment-specific Supabase URL or keys
- OpenAI issue:
  - correct the model or API key
  - retry after rate limits subside
- Resend issue:
  - fix sender configuration
  - rotate the key if needed
- Deployment issue:
  - redeploy after correcting environment variables
  - revert to the previous deployment if the release is broken

### What to check first

When something fails, check in this order:

1. Environment variables
2. Provider credentials and access
3. Database migrations
4. Admin user role metadata
5. Recent code changes touching the affected route or feature

## Dependencies

- Depends on logs being available in the current environment
- Depends on provider dashboards for deeper debugging
- Depends on the deployment workflow being disciplined enough to isolate recent changes

## Open Questions

- Should this evolve into service-specific runbooks with owner fields and severity levels?
- Should structured application logging be added before production launch?

## Related Pages

- [22 API Flows](./22%20API%20Flows.md)
- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
- [42 Testing & Quality Gates](./42%20Testing%20%26%20Quality%20Gates.md)
