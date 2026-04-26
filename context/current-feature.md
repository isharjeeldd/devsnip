# Current Feature

**Stats & Sidebar** — Wire real database data into the dashboard stats and sidebar.

## Status

Complete

## Overview

Replace mock/static data in the dashboard stats area and sidebar with real data from the Neon database via Prisma. The stats cards should reflect actual item/collection counts. The sidebar should list all system item types with their icons (linking to `/items/[typename]`), show recent collections with a colored circle based on the most-used item type (instead of static icons), and include a "View all collections" link below the collections list.

## Goals

- [x] Display stats (total items, favorites, collections) from real DB data
- [x] Display system item types in sidebar with icons, each linking to `/items/[typename]`
- [x] Add "View all collections" link under the sidebar collections list → `/collections`
- [x] Sidebar recent collections: replace star icons with a colored circle based on the most-used item type in that collection (keep stars only for favorites)
- [x] Add `getSystemItemTypes` to `src/lib/db/items.ts`

## Notes

- Spec: `context/features/stats-sidebar-spec.md`
- Reference `src/lib/db/collections.ts` for patterns — it already computes `accentColor`/`accentSlug` per collection

## History

<!-- Keep this updated, earliest to latest -->

- **2026-04-19** — Initial Next.js + Tailwind setup. Cleaned up default Create Next App boilerplate (removed default public SVGs, updated `globals.css` and `page.tsx`). Added `context/` folder with project documentation.
- **2026-04-19** — Updated current feature to combine Dashboard UI Phase 2 and Phase 3 scope (sidebar shell + main dashboard content).
- **2026-04-19** — Implemented Phase 2–3: `dashboard-shell`, collapsible sidebar + mobile drawer, header, `/dashboard` page (stats, collections grid, pinned + recent items), `/items/[type]` placeholders, mock metrics, item-type icons, theme provider/toggle, Inter + mono fonts and design tokens in `globals.css` / `layout.tsx`. Item detail panel as right Vaul drawer (`item-detail-drawer.tsx`); snapshot state for close animation; Radix Dialog a11y (do not override `DialogTitle` id; `aria-describedby` opt-out on drawer content).
- **2026-04-26** — Installed Prisma 7.8.0 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`). Added `"type": "module"` to `package.json` and updated tsconfig target to ES2023 (Prisma 7 ESM requirements). Created `prisma/schema.prisma` (all models: User, Item, ItemType, Collection, ItemCollection, Tag, Account, Session, VerificationToken). Created `prisma.config.ts` at root. Created `src/lib/prisma.ts` singleton. Created initial `prisma/seed.ts` for system ItemTypes. Created `.env.local` + `.env.example`. Added `src/generated/` to `.gitignore`. Build passes. Awaiting DB credentials + first migration.
- **2026-04-26** — Added `password String?` and `emailVerified DateTime?` to `User` schema. Installed `bcryptjs`. Rewrote `prisma/seed.ts` with full dev seed: demo user, 7 system item types (icons/colors per seed-spec), and 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources) with 17 total items.
- **2026-04-26** — Dashboard Collections: created `src/lib/db/collections.ts` (`CollectionCardData` type, `getCollectionsForDashboard`, `getDemoUserId`). Updated `collection-card.tsx` to use DB type and render real `ItemTypeIcon` stack. Updated `dashboard-interactive-area.tsx` to accept `CollectionCardData[]`. Loosened `item-detail-drawer.tsx` collections prop to `{ id, name }[]`. Made `dashboard/page.tsx` async, fetching real collections from Neon with graceful fallback. Stats cards now reflect real collection counts.
- **2026-04-26** — Dashboard Items: created `src/lib/db/items.ts` (`DashboardItem`, `DashboardItemType` types, `getPinnedItems`, `getRecentItems`, `getItemStats`). Removed `MockItem`/`MockItemType` from all dashboard components; replaced with DB types. Updated `ItemTypeIcon` to accept `slug: string` with fallback icon. Removed `itemTypes` prop from `DashboardInteractiveArea` — each item embeds its type directly. Pinned section conditionally hidden when no pinned items. Stats cards (item count, favorite count) now come from DB. `getDemoUser` added to `collections.ts`.
- **2026-04-26** — Stats & Sidebar: added `getSystemItemTypes` to `src/lib/db/items.ts` and `SidebarItemType` type. Updated `getDemoUser` to return `email` and `isPro`. Made `dashboard/layout.tsx` async — fetches system item types, collections, and item stats from DB in parallel. Replaced all `MockUser`/`MockItemType`/`MockCollection` props in `DashboardShell` and `DashboardSidebar` with real DB types (`SidebarUser`, `SidebarItemType`, `CollectionCardData`). Removed `countsByTypeId` prop (count now embedded in each type). Item type links go to `/items/${slug}s`. Recent collections show a colored circle based on `accentColor` instead of `ItemTypeIcon`. Favorites keep `ItemTypeIcon`. "View all collections" link added below recent collections list. Progress bar in free-plan card now uses real item count.
