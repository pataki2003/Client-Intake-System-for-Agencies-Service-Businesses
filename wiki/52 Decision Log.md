# 52 Decision Log

## Purpose

This page records why important technical and workflow choices were made so future changes do not lose context.

## Current State

- Decision logging is being started with the current MVP architecture
- The format below should be reused for future decisions

## How It Works

### Decision template

Use this structure for each new entry:

- Date:
- Status:
- Decision:
- Context:
- Consequences:
- Follow-up:

### Accepted decisions

#### D-001: Use Next.js App Router for the full stack

- Status: Accepted
- Context: The project needs public pages, protected admin pages, and internal API routes in one codebase.
- Decision: Use Next.js App Router with server components and route handlers.
- Consequences: UI and backend live together cleanly, but server/client boundaries must stay disciplined.

#### D-002: Use Supabase Auth with `app_metadata.role = admin`

- Status: Accepted
- Context: The MVP needs a simple internal access model without building a custom auth layer.
- Decision: Gate admin access on the Supabase user claim `app_metadata.role = admin`.
- Consequences: This is fast to ship, but role management remains coarse and metadata must be managed carefully.

#### D-003: Use server-only service-role access for current writes

- Status: Accepted
- Context: The MVP needs simple public submission and internal update flows without exposing direct client writes.
- Decision: Keep writes in server-only code through the Supabase service-role client.
- Consequences: Implementation stays simple, but long-term least-privilege boundaries are weaker than a fuller RLS-driven approach.

#### D-004: Store AI briefs as both structured JSON and markdown

- Status: Accepted
- Context: The team needs a human-readable internal brief and a reliable machine-validated shape.
- Decision: Save structured output in `brief_json` and rendered text in `brief_markdown`.
- Consequences: Rendering stays simple and future automation stays possible, at the cost of keeping two representations in sync.

#### D-005: Use `develop` for integration and `main` for production

- Status: Accepted
- Context: The project needs a lightweight but scalable workflow.
- Decision: Feature branches target `develop`; release-ready changes move from `develop` to `main`.
- Consequences: Preview and release flow are clearer, but discipline is required to keep `develop` stable.

### Superseded decisions

- None recorded yet

## Dependencies

- Depends on the team updating this page when major architectural or process decisions change
- Depends on roadmap items referencing decisions when scope or constraints shift

## Open Questions

- Should this evolve into one page per ADR once decision volume increases?
- Should product decisions and technical decisions stay together or split later?

## Related Pages

- [50 Roadmap](./50%20Roadmap.md)
- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
- [41 Development Workflow](./41%20Development%20Workflow.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
