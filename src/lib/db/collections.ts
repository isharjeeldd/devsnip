import { prisma } from "@/lib/prisma";

export type CollectionCardData = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Color of the most-used item type in the collection */
  accentColor: string;
  /** Name of the most-used item type — matches ItemTypeIcon slug values */
  accentSlug: string;
  /** Colors of all unique item types present (up to 4, for the stack) */
  stackColors: string[];
  /** Type names parallel to stackColors — used to render icons */
  stackSlugs: string[];
};

export async function getCollectionsForDashboard(
  userId: string,
): Promise<CollectionCardData[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 6,
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<
      string,
      { count: number; color: string; name: string }
    >();

    for (const ic of col.items) {
      const type = ic.item.itemType;
      const entry = typeCounts.get(type.id);
      if (entry) {
        entry.count++;
      } else {
        typeCounts.set(type.id, { count: 1, color: type.color, name: type.name });
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);
    const dominant = sorted[0] ?? { color: "#7170ff", name: "snippet" };

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      accentColor: dominant.color,
      accentSlug: dominant.name,
      stackColors: sorted.slice(0, 4).map((t) => t.color),
      stackSlugs: sorted.slice(0, 4).map((t) => t.name),
    };
  });
}

export async function getDemoUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function getDemoUser(): Promise<{ id: string; name: string | null } | null> {
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    select: { id: true, name: true },
  });
  return user ?? null;
}
