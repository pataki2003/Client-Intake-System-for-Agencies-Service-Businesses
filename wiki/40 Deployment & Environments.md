# 40 Deployment & Environments

## Purpose

This page defines the deployment model and environment expectations for running the app reliably across local, preview, and production.

## Current State

- Intended hosting platform: Vercel
- Runtime model: Next.js Node.js server routes plus SSR pages
- Current repo state:
  - Vercel-ready app structure
  - no committed `vercel.json`
  - no committed infrastructure automation
- Environment separation is currently driven by environment variables

## How It Works

### Environment model

- Local
  - used for feature development and manual QA
  - should point to non-production Supabase, OpenAI, and Resend credentials
- Preview
  - created from pull requests and `develop`
  - should validate code before promotion to production
- Production
  - should be driven from `main`
  - should use production-grade secrets, database, and sender identity

### Vercel setup

Recommended standard:

- Connect the GitHub repository to one Vercel project
- Configure preview deployments for pull requests
- Treat `main` as the production branch
- Use Vercel environment scopes for:
  - development
  - preview
  - production

Minimum Vercel checks:

- All required env vars are present in each environment
- `NEXT_PUBLIC_APP_URL` matches the deployed base URL
- server routes execute with Node.js support

### Supabase setup

Recommended standard:

- Use at least one non-production Supabase project and one production project
- Apply the full migration set before routing traffic
- Create admin users in the correct environment and set `app_metadata.role = admin`

Production-sensitive checks:

- confirm RLS policies exist
- confirm the service-role key is set only in server environments
- confirm the correct project URL is paired with the correct keys

### Env var matrix

Required in every environment:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_EMAILS`

### Go-live checklist

- Migrations applied successfully
- Admin login verified with a real admin user
- Public submission verified end to end
- Confirmation email verified
- AI brief generation verified
- `npm run lint`, `npm run typecheck`, and `npm run build` all green on the release commit
- Preview environment validated before production promotion

## Dependencies

- Depends on Vercel environment variable configuration
- Depends on Supabase projects being provisioned and migrated correctly
- Depends on domain and email sender setup outside the codebase

## Open Questions

- Should preview and `develop` share the same non-production Supabase project or get separate ones?
- Should Vercel config be committed later for more explicit runtime and environment control?

## Related Pages

- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
- [41 Development Workflow](./41%20Development%20Workflow.md)
- [42 Testing & Quality Gates](./42%20Testing%20%26%20Quality%20Gates.md)
- [43 Troubleshooting & Runbooks](./43%20Troubleshooting%20%26%20Runbooks.md)
