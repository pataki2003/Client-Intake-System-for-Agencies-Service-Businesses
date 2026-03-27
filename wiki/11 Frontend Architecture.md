# 11 Frontend Architecture

## Purpose

This page documents how the Next.js frontend is organized, where rendering happens, and how UI concerns are separated from server logic.

## Current State

- Router model: Next.js App Router
- Styling: Tailwind CSS with shadcn-style primitives
- Forms:
  - Public intake form uses React Hook Form + Zod resolver
  - Admin interactions use lightweight client-side form state with `fetch`
- Rendering split:
  - Server components for pages and data loading
  - Client components for interactive controls

## How It Works

### Route map

- Public routes:
  - `/`
  - `/start-project`
  - `/success`
  - `/login`
- Protected admin routes:
  - `/admin`
  - `/admin/intakes/[id]`
- API routes:
  - `/api/public-intakes`
  - `/api/admin/intakes/[id]/status`
  - `/api/admin/intakes/[id]/notes`
  - `/api/admin/intakes/[id]/brief`

### Rendering model

- Server-rendered pages handle data loading and redirect logic.
- Client components handle browser-side interactions:
  - Public form submission
  - Status updates
  - Note creation
  - AI brief generation button state
- Middleware refreshes Supabase auth cookies for SSR pages.

### UI components

- `src/components/ui/*`
  - Reusable primitives such as button, input, card, select, table, and alert
- `src/components/intake/*`
  - Public intake form and related UI
- `src/components/admin/*`
  - Dashboard, detail page, notes, status, and brief components
- `src/components/shared/*`
  - Reusable page-level helpers

### State and forms

- Public intake form:
  - Uses `publicIntakeSchema`
  - Normalizes values before persistence
  - Maps server validation errors back to fields
- Admin status and notes:
  - Use simple client state
  - Submit to route handlers via `fetch`
  - Refresh the current route after success

Current frontend constraints:

- No global client-side state manager
- No optimistic updates beyond simple submit states
- No component-level test suite yet

## Dependencies

- Pages depend on server loaders in `src/server/*`
- Interactive components depend on the JSON contracts defined by the route handlers
- Auth-aware pages depend on middleware cookie refresh plus admin checks

## Open Questions

- Should admin filters stay URL-based and server-rendered, or move to richer client-side search once pagination exists?
- Should the public form eventually support draft save or multi-step progression?

## Related Pages

- [10 System Architecture](./10%20System%20Architecture.md)
- [12 Backend & API Architecture](./12%20Backend%20%26%20API%20Architecture.md)
- [30 Feature - Public Intake Flow](./30%20Feature%20-%20Public%20Intake%20Flow.md)
- [31 Feature - Admin Dashboard & Intake Review](./31%20Feature%20-%20Admin%20Dashboard%20%26%20Intake%20Review.md)
