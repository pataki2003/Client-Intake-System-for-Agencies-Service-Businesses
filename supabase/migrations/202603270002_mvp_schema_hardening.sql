-- Follow-up MVP hardening for the initial Client Intake System schema.
-- This migration keeps anonymous access blocked at the table layer and
-- relies on server-side service role usage for public submission flows.

-- Add structured brief storage alongside the existing markdown representation.
alter table public.ai_briefs
  add column if not exists brief_json jsonb;

comment on column public.ai_briefs.brief_json is
  'Nullable structured AI brief payload stored alongside brief_markdown for MVP use cases.';

-- Add nullable attribution metadata for UTM, referrer, and source tracking.
alter table public.intakes
  add column if not exists source_metadata jsonb;

comment on column public.intakes.source_metadata is
  'Nullable source tracking payload for UTM, referrer, campaign, and related intake attribution data.';

-- Helper used by RLS policies for any future direct authenticated admin access.
-- Admin users are identified via Supabase Auth JWT app metadata: role=admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

comment on function public.is_admin() is
  'Returns true when the current authenticated user has app_metadata.role = admin in their Supabase JWT.';

-- Explicit grants for authenticated users. RLS still decides which rows are visible
-- or mutable, and anon access remains blocked because no anon policies are created.
grant select on table public.clients to authenticated;
grant select, update on table public.intakes to authenticated;
grant select on table public.intake_answers to authenticated;
grant select, insert, update on table public.ai_briefs to authenticated;
grant select, insert, update on table public.internal_notes to authenticated;

-- Enable RLS across all application tables touched by the intake workflow.
alter table public.clients enable row level security;
alter table public.intakes enable row level security;
alter table public.intake_answers enable row level security;
alter table public.ai_briefs enable row level security;
alter table public.internal_notes enable row level security;

drop policy if exists clients_admin_select on public.clients;
create policy clients_admin_select
on public.clients
for select
to authenticated
using (public.is_admin());

drop policy if exists intakes_admin_select on public.intakes;
create policy intakes_admin_select
on public.intakes
for select
to authenticated
using (public.is_admin());

drop policy if exists intakes_admin_update on public.intakes;
create policy intakes_admin_update
on public.intakes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists intake_answers_admin_select on public.intake_answers;
create policy intake_answers_admin_select
on public.intake_answers
for select
to authenticated
using (public.is_admin());

drop policy if exists ai_briefs_admin_select on public.ai_briefs;
create policy ai_briefs_admin_select
on public.ai_briefs
for select
to authenticated
using (public.is_admin());

drop policy if exists ai_briefs_admin_insert on public.ai_briefs;
create policy ai_briefs_admin_insert
on public.ai_briefs
for insert
to authenticated
with check (public.is_admin());

drop policy if exists ai_briefs_admin_update on public.ai_briefs;
create policy ai_briefs_admin_update
on public.ai_briefs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists internal_notes_admin_select on public.internal_notes;
create policy internal_notes_admin_select
on public.internal_notes
for select
to authenticated
using (public.is_admin());

drop policy if exists internal_notes_admin_insert on public.internal_notes;
create policy internal_notes_admin_insert
on public.internal_notes
for insert
to authenticated
with check (public.is_admin());

drop policy if exists internal_notes_admin_update on public.internal_notes;
create policy internal_notes_admin_update
on public.internal_notes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
