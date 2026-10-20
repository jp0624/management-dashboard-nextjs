# Target Management — implementation notes

## Changes

- Expanded the dataset from 29 to 89 targets, adding 60 sample companies and related history (124 total events).
- Rebuilt the dashboard with Tailwind utilities directly in React markup: mobile-first cards, responsive grid, usable touch targets, wrapping filters, constrained charts, and scrolling native dialogs.
- Added company/description/market search, market selection, sorting, pagination, summary cards, and filtered JSON export.
- Preserved all four chart types with explicit selection; charts and targets can be hidden independently. The line chart represents status counts, not historical trends.
- Corrected the all-status toggle and removed chart code that mutated React state with in-place sorting.
- Replaced bundled-file mutations with an explicitly labelled localStorage demo workspace. Targets and audit history save together, with validation and visible failure states. API routes now serve read-only seed data and return 405 for unsupported writes.
- Added focus-managed native dialogs, proper button types, confirmation on deletion, history search/action filtering, and stable record IDs.
- Upgraded Next.js 14.2.15 to 15.5.28, updated its ESLint package and lockfile, set Node 22, and added explicit Vercel build configuration.

## Architecture and trade-offs

The dashboard loads bundled seeds, restores a versioned browser workspace after hydration, validates mutations through `app/lib/workspace.ts`, writes a complete snapshot, and only then updates the visible state. This removes the original Vercel read-only filesystem failure without claiming a shared backend exists.

The current deployment needs no secrets or database. Browser data remains origin-specific and can be lost if site data is cleared. Cross-tab storage events refresh the UI, but simultaneous writes in separate tabs are not database transactions. A shared multi-user product would need authentication, durable database storage, and transactional audit history.

The existing API URLs remain available for read-only seed consumers. They do not expose browser edits. Export contains matching target records only; it is not a complete workspace backup.

## Validation

Production build, lint, and TypeScript checks pass locally. A Playwright/Chromium check against the production server confirmed:

- 89 seed targets and rejection of unsupported API writes (405).
- No horizontal overflow at widths 320, 375, 768, 1024, and 1440 pixels.
- Search, market filters, select/deselect all statuses, pagination, and all four chart views.
- Target creation, status change, and deletion surviving page reloads.
- Creation/update/deletion events retained in searchable history.
- Delete cancellation, Escape dismissal, and JSON download.
- Simulated localStorage quota failure keeps the form open and does not add an unsaved target.
- Zero browser runtime errors during the tested flows.

Desktop and mobile screenshots were inspected. Live Vercel verification is separate from these local checks.

## Deployment

Existing Vercel project: `management-dashboard-nextjs` in `jp0624s-projects`.

The connected Vercel account can list the project but returns HTTP 403 when reading its team-scoped configuration. Local CLI credentials are not available. GitHub changes can be pushed; live deployment status must be checked through GitHub deployment checks or after reconnecting Vercel with access to that team. Do not treat a successful local build as confirmation of a live deployment.
