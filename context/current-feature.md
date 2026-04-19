# Current Feature

**Dashboard UI — Phases 2 & 3** — Sidebar shell and main dashboard surface. Reference: `@context/starter-ui/dashboard.html`. Data from `@src/lib/mock-data.ts` and `@src/lib/dashboard-metrics.ts` until a database exists.

## Status

Complete — delivered on `main` (merged from `feature/dashboard-ui-phase-1`).

## Overview

- **Phase 2** — Sidebar, navigation, favorites, and recent collections in the shell.
- **Phase 3** — Main content: stats, recent collections, pinned items, and recent items list.

## Goals — Phase 2

- Collapsible sidebar
- Items/types with links to `/items/TYPE` (e.g. `/items/snippets`)
- Favorite collections
- Most recent collections
- User avatar area at the bottom
- Drawer icon to open/close sidebar
- Always a drawer on mobile view

## Goals — Phase 3

- The main area to the right
- Recent collections
- Pinned items
- 10 recent items
- Four stats cards at the top: number of items, collections, favorite items, and favorite collections (not in screenshot)

## Notes

- Reference UI: `@context/starter-ui/dashboard.html`
- Full specs: `@context/features/dashboard-phase-2-spec.md`, `@context/features/dashboard-phase-3-spec.md`
- Item detail uses Vaul drawer (`@/components/ui/drawer`); do not override Radix `DialogTitle`’s generated `id` or dev `TitleWarning` will fire.

## History

<!-- Keep this updated, earliest to latest -->

- **2026-04-19** — Initial Next.js + Tailwind setup. Cleaned up default Create Next App boilerplate (removed default public SVGs, updated `globals.css` and `page.tsx`). Added `context/` folder with project documentation.
- **2026-04-19** — Updated current feature to combine Dashboard UI Phase 2 and Phase 3 scope (sidebar shell + main dashboard content).
- **2026-04-19** — Implemented Phase 2–3: `dashboard-shell`, collapsible sidebar + mobile drawer, header, `/dashboard` page (stats, collections grid, pinned + recent items), `/items/[type]` placeholders, mock metrics, item-type icons, theme provider/toggle, Inter + mono fonts and design tokens in `globals.css` / `layout.tsx`. Item detail panel as right Vaul drawer (`item-detail-drawer.tsx`); snapshot state for close animation; Radix Dialog a11y (do not override `DialogTitle` id; `aria-describedby` opt-out on drawer content).
- **2026-04-19** — Fast-forward merged `feature/dashboard-ui-phase-1` into `main` and pushed.
