import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getMockDashboard } from "@/lib/dashboard-metrics";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user, itemTypes, metrics } = getMockDashboard();
  const favIds = new Set(metrics.favoriteCollections.map((c) => c.id));
  const recentSidebar = metrics.recentCollections.filter((c) => !favIds.has(c.id));

  return (
    <DashboardShell
      user={user}
      itemTypes={itemTypes}
      countsByTypeId={metrics.countsByTypeId}
      favoriteCollections={metrics.favoriteCollections}
      recentCollections={recentSidebar}
      totalItems={metrics.itemCount}
      favoriteItemsCount={metrics.favoriteItemCount}
    >
      {children}
    </DashboardShell>
  );
}
