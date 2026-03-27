# 30 Feature - Public Intake Flow

## Purpose

This page documents the end-to-end behavior of the public submission flow from form entry to saved intake.

## Current State

- Main route: `/start-project`
- Success route: `/success`
- Submission endpoint: `POST /api/public-intakes`
- Public form uses React Hook Form plus Zod validation
- Confirmation email is attempted after a successful save

## How It Works

### User journey

1. Visitor lands on `/start-project`
2. Visitor completes the intake form
3. Browser submits JSON to `/api/public-intakes`
4. Server validates and normalizes the payload
5. Server writes the intake to Supabase
6. Server attempts to send a confirmation email
7. Browser redirects to `/success`

### Field map

Current public fields:

- `name`
- `email`
- `company_name`
- `service_type`
- `service_type_other`
- `goal`
- `problem_description`
- `deadline`
- `budget_range`
- `extra_notes`

Important rules:

- `service_type_other` is required only when the selected service type is `other`
- `goal` max length: 600
- `problem_description` max length: 2000
- `extra_notes` max length: 2000
- `deadline` must match `YYYY-MM-DD`
- Email is normalized to lowercase
- Empty optional text fields become `null`

### Submission lifecycle

- Client lookup:
  - the app checks for an existing `clients` row by email
  - the oldest match is reused if found
- Canonical intake write:
  - `service_requested` is resolved from the service type label
  - `project_summary` is populated from `goal`
  - `current_challenges` is populated from `problem_description`
  - `budget_range` is stored
  - `timeline` is currently left `null`
  - `additional_info` is populated from `extra_notes`
  - `source_metadata` stores `referer`, `userAgent`, landing path, and basic tracking params when available
- Raw answer write:
  - every field is stored in `intake_answers` with `question_key`, `question_label`, `answer_type`, and `display_order`
- Email send:
  - Resend is called after the database write succeeds
  - `confirmation_sent_at` is updated only if email delivery succeeds

### Edge cases

- Duplicate email:
  - reuses an existing `clients` row rather than creating another client
- Email provider failure:
  - intake still succeeds
  - failure is logged
- Bad referer URL:
  - intake still succeeds
  - `landingPath` becomes `null`
- Invalid payload:
  - route returns field errors and does not write partial records

## Dependencies

- Depends on `publicIntakeSchema` and `normalizePublicIntakeFormValues`
- Depends on service-role database access
- Depends on Resend for the confirmation email side effect

## Open Questions

- Should `deadline` map into the canonical `timeline` field or stay raw only?
- Should the public form eventually collect website, phone, or referral source explicitly?

## Related Pages

- [11 Frontend Architecture](./11%20Frontend%20Architecture.md)
- [22 API Flows](./22%20API%20Flows.md)
- [20 Database Overview](./20%20Database%20Overview.md)
- [43 Troubleshooting & Runbooks](./43%20Troubleshooting%20%26%20Runbooks.md)
