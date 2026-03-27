# 20 Database Overview

## Purpose

This page gives a fast, practical understanding of the Supabase data model and how records move through the system.

## Current State

- Primary datastore: Supabase Postgres
- Schema source of truth: SQL migrations in `supabase/migrations/`
- Main tables:
  - `clients`
  - `intakes`
  - `intake_answers`
  - `ai_briefs`
  - `internal_notes`
- Update timestamps are maintained through shared trigger logic

## How It Works

### Core tables

- `clients`
  - Canonical client contact record
  - Reused when a submission comes from an existing email
- `intakes`
  - Canonical project request record and workflow state
- `intake_answers`
  - Ordered raw answers captured from the public form
- `ai_briefs`
  - One structured and rendered brief per intake
- `internal_notes`
  - Admin-only collaboration notes linked to an intake

### Relationships

```text
clients 1 --- many intakes
intakes 1 --- many intake_answers
intakes 1 --- 0..1 ai_briefs
intakes 1 --- many internal_notes
internal_notes many --- 0..1 auth.users
```

### Lifecycle of an intake

1. Public form submitted
2. Existing client checked by email
3. `clients` row created if needed
4. `intakes` row created with workflow status `new`
5. `intake_answers` rows created in display order
6. Confirmation email attempted
7. Admin reviews intake and updates status
8. Admin may generate `ai_briefs`
9. Admin may add `internal_notes`

### Feature mapping

- Public intake form:
  - `clients`
  - `intakes`
  - `intake_answers`
- Admin dashboard:
  - `intakes`
  - `clients`
  - `ai_briefs`
- Intake detail page:
  - all core tables
- AI brief feature:
  - `ai_briefs`
- Internal collaboration:
  - `internal_notes`

## Dependencies

- Depends on migrations being applied in order
- Depends on enum values in Postgres staying aligned with TypeScript constants
- Depends on admin auth for safe note and brief operations

## Open Questions

- Should `clients` eventually enforce unique normalized email addresses at the database level?
- Should status history become its own table instead of relying on the current row state only?

## Related Pages

- [21 Supabase Schema & RLS](./21%20Supabase%20Schema%20%26%20RLS.md)
- [22 API Flows](./22%20API%20Flows.md)
- [30 Feature - Public Intake Flow](./30%20Feature%20-%20Public%20Intake%20Flow.md)
- [31 Feature - Admin Dashboard & Intake Review](./31%20Feature%20-%20Admin%20Dashboard%20%26%20Intake%20Review.md)
