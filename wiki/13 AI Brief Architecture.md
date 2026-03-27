# 13 AI Brief Architecture

## Purpose

This page documents the AI subsystem that converts intake data into a structured internal project brief.

## Current State

- AI provider: OpenAI
- API style: Responses API with structured parsing
- Default model: `gpt-5-mini`
- Storage:
  - `brief_json` for structured output
  - `brief_markdown` for rendered human-readable output
- One brief record per intake, enforced by unique `intake_id`

## How It Works

### Trigger point

- The admin detail page exposes a `Generate brief` or `Regenerate brief` action.
- The button calls `POST /api/admin/intakes/[id]/brief`.
- The route handler checks admin access, validates the intake ID, and calls `generateIntakeBrief`.

### Prompt inputs

The AI prompt is built from:

- Client identity fields
- Canonical intake fields:
  - service requested
  - status
  - budget range
  - timeline
  - project summary
  - business goals
  - current challenges
  - referral source
  - additional info
  - source metadata
  - created timestamp
- Raw dynamic answers extracted from `intake_answers`

Prompt rules:

- Use only provided facts
- Do not invent scope, deadlines, or constraints
- Put ambiguity into `openQuestions`
- Return a schema-shaped internal brief

### Structured output

The stored structured shape includes:

- `clientSummary`
- `businessNeed`
- `suggestedScope`
- `openQuestions`
- `recommendedNextSteps`

The server validates the output with Zod and then renders a markdown representation for easy viewing.

### Storage

- The brief is upserted into `ai_briefs` on `intake_id`.
- Regeneration overwrites the prior markdown and JSON for the same intake.
- The model name is stored with the record.

### Failure handling

Handled error categories already include:

- Missing `OPENAI_API_KEY`
- Authentication or permission issues
- Model misconfiguration
- Rate limiting
- API connection issues
- Model refusal
- Invalid structured output
- Supabase save failure

Current implementation constraints:

- No brief version history
- No async queue
- No manual brief editing UI
- No approval workflow before overwriting an existing brief

## Dependencies

- Depends on complete intake detail loading
- Depends on prompt and schema staying aligned
- Depends on admin-only route access
- Depends on valid OpenAI credentials in each environment

## Open Questions

- Should brief regeneration create versions instead of overwriting the single record?
- Should the team be able to edit the structured brief manually after generation?

## Related Pages

- [12 Backend & API Architecture](./12%20Backend%20%26%20API%20Architecture.md)
- [22 API Flows](./22%20API%20Flows.md)
- [32 Feature - AI Client Brief](./32%20Feature%20-%20AI%20Client%20Brief.md)
- [23 External Services & Secrets](./23%20External%20Services%20%26%20Secrets.md)
