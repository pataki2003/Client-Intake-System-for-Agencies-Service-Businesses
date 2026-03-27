# 50 Roadmap

## Purpose

This page tracks the most important future work so engineering decisions stay connected to product direction.

## Current State

- Product stage: MVP moving toward a more production-ready internal tool
- Current strong areas:
  - public submission flow
  - admin review flow
  - AI brief generation
- Current weaker areas:
  - automation
  - scale
  - testing
  - operational hardening

## How It Works

### Now

- Add stronger dashboard search, filtering, and pagination
- Improve AI brief workflow with better operator controls
- Close data-model gaps such as better use of timeline and referral metadata
- Harden deployment and environment setup for repeatable releases
- Add CI and stronger testing coverage

### Next

- Version or edit AI briefs instead of overwriting the single record
- Add richer outbound email workflows after submission
- Improve admin role management beyond a single role
- Add better auditability for status changes and internal actions
- Add file uploads or onboarding attachments where needed

### Later

- Multi-user internal collaboration features
- Multi-tenant or client-isolated deployment options
- CRM or sales pipeline integrations
- Analytics and attribution reporting from stored source metadata

### Dependencies

- Better auth and role management affects most admin-scale features
- Better deployment discipline is required before heavier production usage
- Brief versioning depends on a storage and UX decision
- CI and testing improvements should come before riskier feature expansion

### Decision triggers

- If intake volume grows, prioritize pagination and async jobs
- If multiple admins use the system daily, prioritize role management and audit history
- If outbound workflow complexity grows, prioritize event-driven email and state changes

## Dependencies

- Depends on realistic production usage feedback
- Depends on keeping `Known Issues & Tech Debt` aligned with delivery priorities
- Depends on decision log entries capturing major architectural changes

## Open Questions

- Which roadmap item creates the highest leverage before the first serious production rollout?
- Should the next milestone optimize for internal team operations or external client experience?

## Related Pages

- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
- [52 Decision Log](./52%20Decision%20Log.md)
- [31 Feature - Admin Dashboard & Intake Review](./31%20Feature%20-%20Admin%20Dashboard%20%26%20Intake%20Review.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
