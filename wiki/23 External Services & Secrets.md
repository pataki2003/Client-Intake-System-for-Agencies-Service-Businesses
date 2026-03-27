# 23 External Services & Secrets

## Purpose

This page centralizes the external providers, environment variables, and operational expectations required to run the system safely.

## Current State

- Providers in active use:
  - Supabase
  - OpenAI
  - Resend
  - Vercel
- Environment variables are currently documented in `.env.example`
- Platform configuration is still mostly external to the repo

## How It Works

### Services

| Service | Used for | Required today |
| --- | --- | --- |
| Supabase | Postgres, auth, SSR session handling | Yes |
| OpenAI | AI brief generation | Yes for brief feature |
| Resend | Confirmation emails | Yes for submission email |
| Vercel | Hosting and environment separation | Intended deployment target |

### Required secrets

- App
  - `NEXT_PUBLIC_APP_URL`
- Supabase
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- OpenAI
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
- Resend
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Access control
  - `ADMIN_EMAILS`

### Per-environment values

Recommended setup:

- Local
  - local app URL
  - non-production Supabase project
  - non-production OpenAI budget controls
  - non-production Resend sender or sandbox domain
- Preview
  - Vercel preview URL
  - staging or preview Supabase project
  - preview-safe secrets
- Production
  - production app URL
  - production Supabase project
  - production email sender
  - production OpenAI limits and monitoring

### Rotation and recovery

- Supabase:
  - rotate anon and service-role keys if leakage is suspected
  - validate auth and server writes immediately after rotation
- OpenAI:
  - rotate `OPENAI_API_KEY`
  - re-test brief generation route
- Resend:
  - rotate `RESEND_API_KEY`
  - confirm sender identity still verifies
- Vercel:
  - keep env vars in sync across preview and production
  - confirm the correct values are assigned to the correct environment

## Dependencies

- All runtime provider clients fail fast if required env vars are missing
- Deployment success depends on secret parity between intended environments
- Admin auth and server writes depend on correct Supabase credentials

## Open Questions

- Should secret ownership and rotation cadence be tracked explicitly by person and date?
- Should preview and production each get a separate Supabase project by policy?

## Related Pages

- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- [13 AI Brief Architecture](./13%20AI%20Brief%20Architecture.md)
- [43 Troubleshooting & Runbooks](./43%20Troubleshooting%20%26%20Runbooks.md)
