# 51 Known Issues & Tech Debt

## Purpose

This page tracks real problems, shortcuts, and structural debt so they are visible and actionable instead of hidden behind roadmap optimism.

## Current State

- The system is clean for an MVP, but several deliberate shortcuts remain
- Most items below are acceptable now but should not be ignored before scale or production hardening

## How It Works

### Active issues

- No automated test suite beyond `lint`, `typecheck`, and `build`
- No committed CI workflow enforcing checks on pull requests
- No production deployment config committed in the repo yet

### Tech debt

- Public submission uses the service-role key for writes instead of anon insert policies
- Admin list filtering happens after loading the full intake list, which will not scale well
- AI brief generation is synchronous and blocks on provider response time
- AI brief regeneration overwrites the previous record with no version history
- Status changes have no separate audit trail
- `deadline` is collected publicly but does not currently populate the canonical `timeline` field
- `ADMIN_EMAILS` exists in the env template but is not used in the live authorization path

### Operational debt

- Environment setup lives mostly outside the repo
- Secret ownership and rotation policy are not documented yet
- There is no structured logging or request tracing strategy
- There is no runbook ownership model or incident severity classification

### Planned fixes

- Add CI before broader team collaboration
- Add pagination and stronger filtering on the admin dashboard
- Decide whether AI briefs need versioning
- Tighten auth and data-access boundaries before wider usage
- Improve deployment and secret management documentation as environments mature

## Dependencies

- Depends on architecture decisions around auth, RLS, and service-role usage
- Depends on roadmap prioritization and team capacity
- Depends on deployment maturity and expected traffic volume

## Open Questions

- Which debt items are blockers for a production launch versus acceptable MVP debt?
- Should operational debt be split into a separate reliability tracker once the app is live?

## Related Pages

- [50 Roadmap](./50%20Roadmap.md)
- [52 Decision Log](./52%20Decision%20Log.md)
- [14 Auth & Access Control](./14%20Auth%20%26%20Access%20Control.md)
- [42 Testing & Quality Gates](./42%20Testing%20%26%20Quality%20Gates.md)
