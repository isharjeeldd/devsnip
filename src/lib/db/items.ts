import { prisma } from "@/lib/prisma";

export type DashboardItemType = {
  id: string;
  name: string;
  color: string;
  slug: string;
};

export type DashboardItem = {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  itemType: DashboardItemType;
  tagNames: string[];
  collectionIds: string[];
  lastUsedLabel: string;
  previewIsProse: boolean;
};

const PROSE_SLUGS = new Set(["prompt", "note", "link"]);

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

function mapItem(item: {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  updatedAt: Date;
  itemType: { id: string; name: string; color: string };
  tags: { name: string }[];
  collections: { collectionId: string }[];
}): DashboardItem {
  const slug = item.itemType.name.toLowerCase();
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.contentType,
    content: item.content,
    url: item.url,
    language: item.language,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    itemTypeId: item.itemTypeId,
    itemType: {
      id: item.itemType.id,
      name: item.itemType.name,
      color: item.itemType.color,
      slug,
    },
    tagNames: item.tags.map((t) => t.name),
    collectionIds: item.collections.map((c) => c.collectionId),
    lastUsedLabel: formatRelativeTime(item.updatedAt),
    previewIsProse: PROSE_SLUGS.has(slug),
  };
}

export async function getPinnedItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { name: true } },
      collections: { select: { collectionId: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return items.map(mapItem);
}

export async function getRecentItems(userId: string): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    include: {
      itemType: { select: { id: true, name: true, color: true } },
      tags: { select: { name: true } },
      collections: { select: { collectionId: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });
  return items.map(mapItem);
}

export async function getItemStats(
  userId: string,
): Promise<{ total: number; favoriteCount: number }> {
  const [total, favoriteCount] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favoriteCount };
}
