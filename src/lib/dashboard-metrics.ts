import type {
  MockCollection,
  MockItem,
  MockItemTypeSlug,
} from "@/lib/mock-data";
import { mockDashboardData } from "@/lib/mock-data";

/** URL segment after `/items/` — matches sidebar examples (`/items/snippets`). */
export const ITEM_TYPE_ROUTE_SLUG: Record<MockItemTypeSlug, string> = {
  snippet: "snippets",
  prompt: "prompts",
  note: "notes",
  command: "commands",
  link: "links",
  file: "files",
  image: "images",
};

export function itemTypeHref(slug: MockItemTypeSlug): string {
  return `/items/${ITEM_TYPE_ROUTE_SLUG[slug]}`;
}

/** Reverse lookup for `/items/[type]` dynamic segment → mock slug. */
export const ROUTE_SEGMENT_TO_ITEM_SLUG = Object.fromEntries(
  (Object.keys(ITEM_TYPE_ROUTE_SLUG) as MockItemTypeSlug[]).map((k) => [
    ITEM_TYPE_ROUTE_SLUG[k],
    k,
  ]),
) as Record<string, MockItemTypeSlug>;

export function isKnownItemRouteSegment(
  segment: string,
): segment is keyof typeof ROUTE_SEGMENT_TO_ITEM_SLUG {
  return segment in ROUTE_SEGMENT_TO_ITEM_SLUG;
}

/** Lower = more recent for sorting `lastUsedLabel` strings (mock has no real timestamps). */
const LAST_USED_RANK: Record<string, number> = {
  "12m": 0,
  "1h": 1,
  "3h": 2,
  yesterday: 3,
  "2d": 4,
  "3d": 5,
  "4d": 6,
  "5d": 7,
  "6d": 8,
  "1w": 9,
};

function lastUsedRank(label: string): number {
  return LAST_USED_RANK[label] ?? 100;
}

export type DashboardMetrics = {
  itemCount: number;
  collectionCount: number;
  favoriteItemCount: number;
  favoriteCollectionCount: number;
  countsByTypeId: Record<string, number>;
  /** Collections marked favorite — sidebar. */
  favoriteCollections: MockCollection[];
  /**
   * “Recent” without DB timestamps: unique collection ids in order of first appearance
   * when walking `items`, then any remaining collections in mock array order.
   */
  recentCollections: MockCollection[];
  pinnedItems: MockItem[];
  recentItems: MockItem[];
};

export function buildDashboardMetrics(
  items: MockItem[],
  collections: MockCollection[],
): DashboardMetrics {
  const itemCount = items.length;
  const collectionCount = collections.length;
  const favoriteItemCount = items.filter((i) => i.isFavorite).length;
  const favoriteCollectionCount = collections.filter((c) => c.isFavorite)
    .length;

  const countsByTypeId: Record<string, number> = {};
  for (const it of items) {
    countsByTypeId[it.itemTypeId] = (countsByTypeId[it.itemTypeId] ?? 0) + 1;
  }

  const favoriteCollections = collections.filter((c) => c.isFavorite);

  const recentCollectionIds: string[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    for (const cid of it.collectionIds) {
      if (!seen.has(cid)) {
        seen.add(cid);
        recentCollectionIds.push(cid);
      }
    }
  }
  for (const c of collections) {
    if (!seen.has(c.id)) {
      recentCollectionIds.push(c.id);
    }
  }
  const recentCollections = recentCollectionIds
    .map((id) => collections.find((c) => c.id === id))
    .filter((c): c is MockCollection => Boolean(c));

  const pinnedItems = items.filter((i) => i.isPinned);

  const recentItems = [...items]
    .sort((a, b) => lastUsedRank(a.lastUsedLabel) - lastUsedRank(b.lastUsedLabel))
    .slice(0, 10);

  return {
    itemCount,
    collectionCount,
    favoriteItemCount,
    favoriteCollectionCount,
    countsByTypeId,
    favoriteCollections,
    recentCollections,
    pinnedItems,
    recentItems,
  };
}

/** Single entry for dashboard layout + page (mock-backed). */
export function getMockDashboard() {
  const { user, itemTypes, collections, items } = mockDashboardData;
  const metrics = buildDashboardMetrics(items, collections);
  return { user, itemTypes, collections, items, metrics };
}
