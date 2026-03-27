# 02 Product Overview

## Purpose

This page explains what the Client Intake System is for, who it serves, and what the current product boundary actually includes.

## Current State

- Product type: intake and review workflow for agencies and service businesses
- Intended users:
  - External prospects submitting project requests
  - Internal admins reviewing, qualifying, and structuring those requests
- Product maturity: MVP with room for operational hardening and deeper team workflows

## How It Works

### Problem

- Generic contact forms produce weak context and more follow-up work.
- Teams need a structured first pass on goals, budget, timing, and current challenges before a call or proposal.
- Internal handoff quality drops when notes, status, and intake data live in separate tools.

### Users

- Prospect or client:
  - Needs a clean, low-friction form to describe the project request
- Admin or operator:
  - Needs one place to review submissions, add context, and move work forward
- Delivery or sales team:
  - Needs a concise internal brief before replying or scoping

### Core capabilities

- Capture structured project requests through the public intake form
- Store canonical client and intake records in Supabase
- Preserve the raw answer set for auditability and context
- Let admins review submissions in a protected dashboard
- Support workflow status updates and internal notes
- Generate an internal project brief with OpenAI
- Send a confirmation email after successful submission

### Non-goals

- This is not a full CRM
- This is not a multi-tenant white-label platform yet
- This is not a full proposal, contract, or invoicing system
- This is not currently an async job-processing system

### MVP boundaries

- One admin role only
- One AI brief record per intake
- One main intake pipeline with status values:
  - `new`
  - `reviewing`
  - `brief_ready`
  - `contacted`
  - `archived`
- No file uploads, no task assignment, no customer portal

## Dependencies

- Product flow depends on Supabase being the source of truth for intake data
- Admin operations depend on Supabase Auth and server-only data access
- AI value depends on the quality of intake answers already captured

## Open Questions

- Should this stay single-tenant for the first production release?
- Should the next product expansion focus on richer qualification, onboarding, or outbound follow-up?

## Related Pages

- [10 System Architecture](./10%20System%20Architecture.md)
- [30 Feature - Public Intake Flow](./30%20Feature%20-%20Public%20Intake%20Flow.md)
- [31 Feature - Admin Dashboard & Intake Review](./31%20Feature%20-%20Admin%20Dashboard%20%26%20Intake%20Review.md)
- [50 Roadmap](./50%20Roadmap.md)
