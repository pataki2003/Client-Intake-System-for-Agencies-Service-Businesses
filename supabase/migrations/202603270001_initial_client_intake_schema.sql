create extension if not exists pgcrypto;

create type public.intake_status as enum (
  'new',
  'reviewing',
  'brief_ready',
  'contacted',
  'archived'
);

create type public.intake_budget_range as enum (
  'under_2500',
  '2500_5000',
  '5000_10000',
  '10000_25000',
  '25000_plus',
  'undisclosed'
);

create type public.intake_timeline as enum (
  'asap',
  'within_30_days',
  'within_60_days',
  'within_90_days',
  'flexible'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company_name text,
  email text not null,
  phone text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint clients_client_name_not_blank check (length(trim(client_name)) > 0),
  constraint clients_email_not_blank check (length(trim(email)) > 0)
);

create table public.intakes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  status public.intake_status not null default 'new',
  service_requested text not null,
  budget_range public.intake_budget_range,
  timeline public.intake_timeline,
  project_summary text not null,
  business_goals text,
  current_challenges text,
  referral_source text,
  additional_info text,
  confirmation_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint intakes_service_requested_not_blank check (length(trim(service_requested)) > 0),
  constraint intakes_project_summary_not_blank check (length(trim(project_summary)) > 0)
);

create table public.intake_answers (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references public.intakes(id) on delete cascade,
  question_key text not null,
  question_label text not null,
  answer_type text not null default 'text',
  answer_value jsonb not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint intake_answers_question_key_not_blank check (length(trim(question_key)) > 0),
  constraint intake_answers_question_label_not_blank check (length(trim(question_label)) > 0),
  constraint intake_answers_display_order_non_negative check (display_order >= 0),
  constraint intake_answers_answer_type_valid check (
    answer_type in (
      'text',
      'long_text',
      'single_select',
      'multi_select',
      'email',
      'phone',
      'url'
    )
  ),
  constraint intake_answers_intake_question_key_unique unique (intake_id, question_key)
);

create table public.ai_briefs (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null unique references public.intakes(id) on delete cascade,
  brief_markdown text not null,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint ai_briefs_brief_markdown_not_blank check (length(trim(brief_markdown)) > 0)
);

create table public.internal_notes (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references public.intakes(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint internal_notes_body_not_blank check (length(trim(body)) > 0)
);

create index clients_email_lower_idx
  on public.clients (lower(email));

create index intakes_client_id_idx
  on public.intakes (client_id);

create index intakes_status_created_at_idx
  on public.intakes (status, created_at desc);

create index intakes_created_at_idx
  on public.intakes (created_at desc);

create index intake_answers_intake_display_order_idx
  on public.intake_answers (intake_id, display_order);

create index internal_notes_intake_created_at_idx
  on public.internal_notes (intake_id, created_at desc);

create index internal_notes_author_id_idx
  on public.internal_notes (author_id);

create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

create trigger set_intakes_updated_at
before update on public.intakes
for each row
execute function public.set_updated_at();

create trigger set_intake_answers_updated_at
before update on public.intake_answers
for each row
execute function public.set_updated_at();

create trigger set_ai_briefs_updated_at
before update on public.ai_briefs
for each row
execute function public.set_updated_at();

create trigger set_internal_notes_updated_at
before update on public.internal_notes
for each row
execute function public.set_updated_at();
