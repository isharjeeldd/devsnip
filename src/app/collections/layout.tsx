import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDemoUser, getCollectionsForDashboard } from "@/lib/db/collections";
import { getSystemItemTypes, getItemStats } from "@/lib/db/items";

export default async function CollectionsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const demoUser = await getDemoUser();

  const [itemTypes, collections, itemStats] = demoUser
    ? await Promise.all([
        getSystemItemTypes(demoUser.id).catch(() => []),
        getCollectionsForDashboard(demoUser.id).catch(() => []),
        getItemStats(demoUser.id).catch(() => ({ total: 0, favoriteCount: 0 })),
      ])
    : [
        [] as Awaited<ReturnType<typeof getSystemItemTypes>>,
        [] as Awaited<ReturnType<typeof getCollectionsForDashboard>>,
        { total: 0, favoriteCount: 0 },
      ];

  const user = demoUser
    ? { id: demoUser.id, name: demoUser.name, email: demoUser.email, isPro: demoUser.isPro }
    : { id: "", name: null, email: "", isPro: false };

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  return (
    <DashboardShell
      user={user}
      itemTypes={itemTypes}
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
      totalItems={itemStats.total}
      favoriteItemsCount={itemStats.favoriteCount}
    >
      {children}
    </DashboardShell>
  );
}
