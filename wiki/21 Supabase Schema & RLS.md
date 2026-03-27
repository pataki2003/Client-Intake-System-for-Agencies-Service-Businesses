# 21 Supabase Schema & RLS

## Purpose

This page is the canonical reference for the current Supabase schema, enum values, indexes, and Row Level Security behavior.

## Current State

- Migrations:
  - `202603270001_initial_client_intake_schema.sql`
  - `202603270002_mvp_schema_hardening.sql`
- RLS is enabled on the main application tables
- Public submission still relies on server-side service-role access rather than anon insert policies

## How It Works

### Enums

- `public.intake_status`
  - `new`
  - `reviewing`
  - `brief_ready`
  - `contacted`
  - `archived`
- `public.intake_budget_range`
  - `under_2500`
  - `2500_5000`
  - `5000_10000`
  - `10000_25000`
  - `25000_plus`
  - `undisclosed`
- `public.intake_timeline`
  - `asap`
  - `within_30_days`
  - `within_60_days`
  - `within_90_days`
  - `flexible`

### Tables

- `clients`
  - core fields: `client_name`, `company_name`, `email`, `phone`, `website`
  - notable constraints: non-blank `client_name` and `email`
- `intakes`
  - core fields: `client_id`, `status`, `service_requested`, `budget_range`, `timeline`, `project_summary`
  - additional context: `business_goals`, `current_challenges`, `referral_source`, `additional_info`
  - operational metadata: `confirmation_sent_at`, `source_metadata`
- `intake_answers`
  - stores ordered question/answer pairs
  - unique on `(intake_id, question_key)`
  - answer types constrained to a fixed list
- `ai_briefs`
  - unique `intake_id`
  - stores `brief_markdown`, nullable `brief_json`, and `model`
- `internal_notes`
  - stores `author_id`, `body`, and timestamps

### Indexes

- `clients_email_lower_idx`
- `intakes_client_id_idx`
- `intakes_status_created_at_idx`
- `intakes_created_at_idx`
- `intake_answers_intake_display_order_idx`
- `internal_notes_intake_created_at_idx`
- `internal_notes_author_id_idx`

### RLS policies

- Helper:
  - `public.is_admin()` returns true when the JWT contains `app_metadata.role = admin`
- Grants:
  - authenticated users receive limited table grants
- Policies:
  - admin-only `select` on `clients`, `intakes`, `intake_answers`, `ai_briefs`, `internal_notes`
  - admin-only `update` on `intakes`, `ai_briefs`, `internal_notes`
  - admin-only `insert` on `ai_briefs` and `internal_notes`
- No anon policies are created, so table access remains closed to anonymous clients

### Migration notes

- The second migration adds `brief_json` to `ai_briefs`
- The second migration adds `source_metadata` to `intakes`
- The second migration enables RLS across the application tables
- All main tables use a shared `set_updated_at()` trigger for `updated_at`

## Dependencies

- TypeScript constants in `src/types/intake.ts` and form option helpers must stay aligned with DB enums
- Auth claims must continue to populate the admin role used by `public.is_admin()`
- Route and server code depend on the presence of `brief_json` and `source_metadata`

## Open Questions

- Should anon insert policies be introduced later to reduce service-role usage for public submissions?
- Should schema comments be expanded into stronger internal database docs or generated ERDs?

## Related Pages

- [20 Database Overview](./20%20Database%20Overview.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- [22 API Flows](./22%20API%20Flows.md)
- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
