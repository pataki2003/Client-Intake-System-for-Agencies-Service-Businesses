# 31 Feature - Admin Dashboard & Intake Review

## Purpose

This page documents the internal workflow for viewing, qualifying, and updating intake submissions.

## Current State

- Admin dashboard route: `/admin`
- Intake detail route: `/admin/intakes/[id]`
- Admin auth requirement: Supabase session user with `app_metadata.role = admin`
- Dashboard is server-rendered and currently loads the full intake list before applying filters

## How It Works

### Dashboard overview

The admin dashboard currently provides:

- Total submissions count
- Needs review count
- Ready or contacted count
- Briefs generated count
- Filter controls for:
  - status
  - service requested
- A table of intake records with key metadata

### Filtering logic

- The page reads `status` and `service` from `searchParams`
- All intakes are loaded first through `getAdminIntakeList()`
- Filtering is applied in page logic after the list is loaded
- Service options are derived from the currently loaded records

Current implication:

- This is simple and fine for MVP volume
- It will eventually need pagination and database-side filtering for scale

### Intake detail workspace

The detail page combines six working areas:

- Overview:
  - client identity and contact info
- Request:
  - canonical intake fields
- AI Brief:
  - generate or regenerate internal brief
- Submitted Answers:
  - raw intake answer history
- Workflow:
  - current status and status update form
- Notes:
  - admin-only notes
- Metadata:
  - created, updated, confirmation email time, and source metadata

### Workflow states

Current workflow statuses:

- `new`
- `reviewing`
- `brief_ready`
- `contacted`
- `archived`

Current behavior:

- Status changes overwrite the current row value
- There is no separate status history table yet
- The detail page is the main source of truth for the current workflow state

### Notes

- Notes are stored in `internal_notes`
- The note author stores the current admin user ID
- UI currently labels notes as `You` or `Admin`
- Notes are shown newest first

## Dependencies

- Depends on admin auth checks for every protected route and page
- Depends on `getAdminIntakeList()` and `getAdminIntakeDetail()`
- Depends on `internal_notes`, `ai_briefs`, and `intakes` staying in sync

## Open Questions

- Should the dashboard support search, pagination, and saved filters next?
- Should note author names resolve from a profile table instead of generic labels?

## Related Pages

- [11 Frontend Architecture](./11%20Frontend%20Architecture.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- [20 Database Overview](./20%20Database%20Overview.md)
- [32 Feature - AI Client Brief](./32%20Feature%20-%20AI%20Client%20Brief.md)
