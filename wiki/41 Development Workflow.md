# 41 Development Workflow

## Purpose

This page defines how work should move through GitHub, preview environments, and production in a way that fits the current repo and supports growth.

## Current State

- Active integration branch: `develop`
- Recommended production branch: `main`
- No committed GitHub Actions workflows yet
- Current engineering checks are run manually through npm scripts

## How It Works

### Branch strategy

Recommended branch model:

- `main`
  - production-ready branch
  - protected from direct feature work
- `develop`
  - integration branch
  - receives completed feature pull requests
- `feature/*`
  - one branch per focused change
  - opened from `develop`

### PR checklist

Before opening or merging a pull request:

- rebase or update from the latest `develop`
- run:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
- manually verify the affected public or admin flow
- update wiki pages if the change alters architecture, schema, APIs, or workflow

### Preview workflow

Recommended flow:

1. Create feature branch from `develop`
2. Push branch and open PR into `develop`
3. Review preview deployment
4. Validate:
   - public form
   - admin login
   - dashboard behavior
   - AI brief generation if touched
5. Merge into `develop`

### Release flow

Recommended release flow:

1. Stabilize `develop`
2. Run the full manual and script-based release checks
3. Open PR from `develop` into `main`
4. Validate the production-target preview or staging check
5. Merge into `main`
6. Confirm production deployment health immediately after release

### Rollback

Recommended rollback options:

- fast revert the release PR if the issue is code-level and isolated
- restore the previous Vercel production deployment if the platform supports faster recovery
- rotate or correct environment variables if the issue is configuration-only

## Dependencies

- Depends on Vercel preview deployments being connected to the repo
- Depends on developers running the local quality gates consistently
- Depends on deployment access and merge permissions being controlled

## Open Questions

- Should CI be added before the first production release so preview checks are enforced automatically?
- Should release PRs use squash merge or merge commits consistently?

## Related Pages

- [40 Deployment & Environments](./40%20Deployment%20%26%20Environments.md)
- [42 Testing & Quality Gates](./42%20Testing%20%26%20Quality%20Gates.md)
- [52 Decision Log](./52%20Decision%20Log.md)
- [51 Known Issues & Tech Debt](./51%20Known%20Issues%20%26%20Tech%20Debt.md)
