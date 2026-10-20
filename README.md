# Target Management

A responsive opportunity pipeline demo built with Next.js, React, TypeScript, Tailwind CSS, and Chart.js.

## Run locally

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The root redirects to `/dashboard`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Docker remains supported with `docker-compose up --build`.

## Deploy to Vercel

Import `jp0624/management-dashboard-nextjs` with the **Next.js** preset and repository root as the Root Directory. Use Node.js **22.x**. The committed `vercel.json` sets `npm ci` and `npm run build`; leave Output Directory at its framework default. No environment variables, filesystem writes, database, or external image/font services are required for the demo. Pushes to the configured production branch trigger Vercel's Git integration.

The project uses Next.js 15.5.28 and an npm lockfile. The former Next.js 14.2.15 dependency and writable-JSON API implementation have been replaced.

## Features

- 89 sample targets: the original 29 plus 60 companies across technology, healthcare, finance, energy, retail, logistics, education, property, manufacturing, and media.
- 124 sample history events, with names preserved after target deletion.
- Summary cards for total, active/hot, closed, and market coverage.
- Search by name, description, or market; market dropdown; multi-select pipeline statuses; sort by company or status.
- Bar, line, pie, and doughnut charts derived from the same filtered records. Line view compares categories; it is not a time series.
- 12-item pagination, with responsive target cards, wrapping controls, and independently visible charts and targets.
- Add targets with multiple markets, update statuses, and confirm deletion.
- Searchable history with action filters and newest-first events.
- JSON export of **all matching targets**, not just the current page. This export does not include history and is not an import/restore format.
- Native dialogs with focus containment, Escape to close, focus restoration, accessible labels, visible focus, and touch-sized controls.

## Persistence and scope

This is an explicitly labelled **browser-local demo**, not a shared CRM. Initial data is bundled from `public/data/targets.json` and `public/data/targets-history.json`. After hydration, the app restores `target-management.workspace.v1` from localStorage. Every change saves targets and history in one versioned snapshot, then updates the UI. Invalid data, unavailable storage, or quota failures display errors without claiming a successful save. Reloads retain edits and other tabs receive storage updates.

Data is scoped to the current browser and origin; preview and production URLs have separate workspaces. Clearing site data removes saved edits. No server database, authentication, cross-device syncing, or strict concurrent multi-tab transaction guarantee is provided. New tabs load the seed until the first change is saved. To restore the seeded demo, remove the `target-management.workspace.v1` key in browser storage; export anything you want to keep first.

For a shared deployment, add authenticated server mutations backed by a durable database and transactional history writes. Do not restore writes to bundled files or use `/tmp` or in-memory state as persistent storage on Vercel.

## Read-only seed API

| Endpoint | Behaviour |
| --- | --- |
| `GET /api/targets` | All bundled sample targets |
| `GET /api/targets/:id` | One sample target, or 404 |
| `GET /api/history` | Bundled sample history |
| `GET /api/history/:id` | One sample history event, or 404 |

Unsupported mutation methods return 405. These endpoints intentionally expose seed data; they do not reflect a visitor's private browser workspace. UI mutations use the validated workspace reducer in `app/lib/workspace.ts`.

## Theme and artwork

The header includes an accessible **Dark mode** switch. It follows the system preference until a choice is saved in `target-management.theme`; saved choices survive reloads and synchronize between tabs. A pre-paint script avoids an incorrect initial theme flash. Tailwind dark variants cover the workspace, forms, status badges, and dialogs; Chart.js adapts its labels, grids, and borders.

Two generated WebP images are integrated: `public/images/pipeline-network.webp` in the intro and `public/images/opportunity-scanner.webp` in the empty search state. They are decorative conceptual images, not data visualizations. See `public/images/README.md` for generation prompts.

## Styling

Tailwind is compiled through PostCSS, scanning `app/**/*.{js,ts,jsx,tsx,mdx}`. Responsive grid, spacing, typography, colours, focus states, cards, forms, dialogs, and chart containers use utility classes directly in TSX. `app/globals.css` only includes Tailwind directives and common base rules. There is no Tailwind CDN and no runtime-generated utility class names. Chart drawing colours remain in Chart.js configuration.

## Main files

- `app/dashboard/page.tsx`: dashboard, filtering, pagination, summaries, and export.
- `app/hooks/useTargets.ts`: hydration, browser persistence, and storage errors.
- `app/lib/workspace.ts`: schema validation and atomic target/history snapshot updates.
- `app/components/charts/PipelineCharts.tsx`: lazy-loaded chart views.
- `app/components/charts/TargetTable.tsx`: responsive target cards and status editing.
- `app/components/modals/`: add, history, delete confirmation, and shared native dialog.
- `public/data/`: deterministic sample data.

See `submission-notes.md` for validation and deployment limitations.
