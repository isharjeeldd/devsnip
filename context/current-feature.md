# Current Feature

**Dashboard Items** — Replace dummy item data on the dashboard with real data from the Neon database via Prisma.

## Status

Complete

## Overview

Replace the dummy item data displayed in the main area of the dashboard (right side) with actual data from the database. This includes both pinned and recent items. It should look how it does now, but instead of using data from `src/lib/mock-data.ts`, it should be from our Neon database using Prisma.

If there are no pinned items, nothing should display there.

## Goals

- [x] Create `src/lib/db/items.ts` with data fetching functions
- [x] Fetch items directly in server component
- [x] Item card icon/border derived from the item type
- [x] Display item type tags and anything else currently there
- [x] Update collection stats display

## Notes

- Spec: `context/features/dashboard-items-spec.md`
- Reference `context/screenshots/dashboard-ui-main.png` if needed — layout and design is already there

## History

<!-- Keep this updated, earliest to latest -->

- **2026-04-19** — Initial Next.js + Tailwind setup. Cleaned up default Create Next App boilerplate (removed default public SVGs, updated `globals.css` and `page.tsx`). Added `context/` folder with project documentation.
- **2026-04-19** — Updated current feature to combine Dashboard UI Phase 2 and Phase 3 scope (sidebar shell + main dashboard content).
- **2026-04-19** — Implemented Phase 2–3: `dashboard-shell`, collapsible sidebar + mobile drawer, header, `/dashboard` page (stats, collections grid, pinned + recent items), `/items/[type]` placeholders, mock metrics, item-type icons, theme provider/toggle, Inter + mono fonts and design tokens in `globals.css` / `layout.tsx`. Item detail panel as right Vaul drawer (`item-detail-drawer.tsx`); snapshot state for close animation; Radix Dialog a11y (do not override `DialogTitle` id; `aria-describedby` opt-out on drawer content).
- **2026-04-26** — Installed Prisma 7.8.0 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`). Added `"type": "module"` to `package.json` and updated tsconfig target to ES2023 (Prisma 7 ESM requirements). Created `prisma/schema.prisma` (all models: User, Item, ItemType, Collection, ItemCollection, Tag, Account, Session, VerificationToken). Created `prisma.config.ts` at root. Created `src/lib/prisma.ts` singleton. Created initial `prisma/seed.ts` for system ItemTypes. Created `.env.local` + `.env.example`. Added `src/generated/` to `.gitignore`. Build passes. Awaiting DB credentials + first migration.
- **2026-04-26** — Added `password String?` and `emailVerified DateTime?` to `User` schema. Installed `bcryptjs`. Rewrote `prisma/seed.ts` with full dev seed: demo user, 7 system item types (icons/colors per seed-spec), and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 17 total items.
- **2026-04-26** — Dashboard Collections: created `src/lib/db/collections.ts` (`CollectionCardData` type, `getCollectionsForDashboard`, `getDemoUserId`). Updated `collection-card.tsx` to use DB type and render real `ItemTypeIcon` stack. Updated `dashboard-interactive-area.tsx` to accept `CollectionCardData[]`. Loosened `item-detail-drawer.tsx` collections prop to `{ id, name }[]`. Made `dashboard/page.tsx` async, fetching real collections from Neon with graceful fallback. Stats cards now reflect real collection counts.
- **2026-04-26** — Dashboard Items: created `src/lib/db/items.ts` (`DashboardItem`, `DashboardItemType` types, `getPinnedItems`, `getRecentItems`, `getItemStats`). Removed `MockItem`/`MockItemType` from all dashboard components; replaced with DB types. Updated `ItemTypeIcon` to accept `slug: string` with fallback icon. Removed `itemTypes` prop from `DashboardInteractiveArea` — each item embeds its type directly. Pinned section conditionally hidden when no pinned items. Stats cards (item count, favorite count) now come from DB. `getDemoUser` added to `collections.ts`.
