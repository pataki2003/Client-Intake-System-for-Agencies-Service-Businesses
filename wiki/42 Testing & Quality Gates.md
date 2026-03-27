# 42 Testing & Quality Gates

## Purpose

This page documents the minimum quality bar for changes while the project is still in its MVP stage.

## Current State

- Automated scripts available:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- No committed unit, integration, or E2E test suite yet
- Manual verification is still part of every meaningful change

## How It Works

### Required checks

Run these on any branch that changes behavior:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected use:

- `lint` catches code quality and framework issues
- `typecheck` catches TypeScript contract drift
- `build` catches App Router and runtime integration problems

### Manual QA

Minimum manual QA matrix:

- Public intake flow
  - submit a valid request
  - verify success redirect
  - verify saved data
- Admin auth
  - log in with an admin user
  - verify protected pages load
- Admin operations
  - change intake status
  - add internal note
  - confirm page refresh reflects changes
- AI brief
  - generate or regenerate a brief
  - verify structured brief renders correctly

### Pre-merge gate

Before merging into `develop`:

- required scripts all pass
- changed feature manually validated
- any schema, API, or workflow changes documented in the wiki
- no unresolved known issue introduced without documentation

### Pre-release gate

Before merging into `main`:

- latest `develop` has green script checks
- preview deployment verified
- environment variables confirmed for production
- public intake and admin brief generation smoke tested on release candidate

## Dependencies

- Depends on providers being available in the target environment for real end-to-end checks
- Depends on the wiki staying accurate when workflows change
- Depends on humans running the checks until CI is added

## Open Questions

- What should be the first automated test layer: schema/service tests or E2E browser tests?
- Should preview deploy validation become a required status check?

## Related Pages

- [41 Development Workflow](./41%20Development%20Workflow.md)
- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
- [43 Troubleshooting & Runbooks](./43%20Troubleshooting%20%26%20Runbooks.md)
- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
