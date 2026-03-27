# 32 Feature - AI Client Brief

## Purpose

This page focuses on the admin-facing AI brief feature as a product capability, not just as a technical subsystem.

## Current State

- Entry point: intake detail page
- Trigger: admin clicks `Generate brief` or `Regenerate brief`
- Output:
  - structured JSON for app use
  - rendered markdown for easy reading
- Storage model: one brief per intake

## How It Works

### When to generate

Use the AI brief when:

- the team needs a faster internal summary before replying
- the intake contains enough detail to infer likely scope and next steps
- the submission should be translated into clearer internal language without rewriting by hand

Avoid relying on it as:

- a final proposal
- a replacement for missing discovery
- a source of invented constraints or budget detail

### Inputs

The brief uses:

- canonical client and intake fields
- raw submitted answers
- source metadata when available
- the current status value

The prompt explicitly tells the model to avoid making up facts.

### Outputs

Current structured sections:

- Client Summary
- Business Need
- Suggested Scope
- Open Questions
- Recommended Next Steps

The UI renders:

- structured blocks for JSON-backed sections
- a stored markdown preview
- model name and last updated timestamp

### Persistence

- Briefs are stored in `ai_briefs`
- Regeneration uses `upsert` on `intake_id`
- The latest generation replaces the previous record
- The saved model name supports basic operational tracing

### Known limitations

- No brief history or comparison view
- No human approval before overwrite
- No editing workflow after generation
- No async queue or retry mechanism
- Brief quality depends heavily on the completeness of the intake

## Dependencies

- Depends on a valid admin session
- Depends on OpenAI credentials and model access
- Depends on well-structured intake data already being present

## Open Questions

- Should regenerated briefs be versioned?
- Should the admin team be able to lock a brief once it has been reviewed?

## Related Pages

- [13 AI Brief Architecture](./13%20AI%20Brief%20Architecture.md)
- [22 API Flows](./22%20API%20Flows.md)
- [31 Feature - Admin Dashboard & Intake Review](./31%20Feature%20-%20Admin%20Dashboard%20%26%20Intake%20Review.md)
- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
