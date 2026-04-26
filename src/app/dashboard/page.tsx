import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardInteractiveArea } from "@/components/dashboard/dashboard-interactive-area";
import {
  getDemoUser,
  getCollectionsForDashboard,
} from "@/lib/db/collections";
import {
  getPinnedItems,
  getRecentItems,
  getItemStats,
} from "@/lib/db/items";

function heroGreeting(name: string | null) {
  const h = new Date().getHours();
  const sal =
    h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  const first = name?.trim().split(/\s+/)[0] ?? "there";
  return `${sal}, ${first}.`;
}

export default async function DashboardPage() {
  const demoUser = await getDemoUser();

  const emptyStats = { total: 0, favoriteCount: 0 };
  const [collections, pinnedItems, recentItems, itemStats] = demoUser
    ? await Promise.all([
        getCollectionsForDashboard(demoUser.id).catch(() => []),
        getPinnedItems(demoUser.id).catch(() => []),
        getRecentItems(demoUser.id).catch(() => []),
        getItemStats(demoUser.id).catch(() => emptyStats),
      ])
    : [
        [] as Awaited<ReturnType<typeof getCollectionsForDashboard>>,
        [] as Awaited<ReturnType<typeof getPinnedItems>>,
        [] as Awaited<ReturnType<typeof getRecentItems>>,
        emptyStats,
      ];

  const allCount = collections.length;
  const favCount = collections.filter((c) => c.isFavorite).length;
  const recentTop = recentItems[0];

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 min-[981px]:px-6 min-[981px]:pt-7">
      <section className="mb-7 flex flex-col flex-wrap items-end justify-between gap-6 min-[900px]:flex-row">
        <div className="min-w-0 flex-1">
          <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-[#7170ff] uppercase before:size-1.5 before:rounded-full before:bg-[#7170ff] before:shadow-[0_0_0_3px_rgba(113,112,255,0.18)] before:content-['']">
            Your vault · {itemStats.total} items
          </p>
          <h1 className="text-balance text-[clamp(2.5rem,6.2vw,4.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-foreground">
            {heroGreeting(demoUser?.name ?? null)}{" "}
            <br className="max-sm:hidden" />
            <span className="text-muted-foreground">Pick up where you left off.</span>
          </h1>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed tracking-[-0.005em] text-muted-foreground">
            {recentTop
              ? `Your last touch was "${recentTop.title}" · ${recentTop.lastUsedLabel} ago. ${favCount} favorite collections, ${itemStats.favoriteCount} starred items.`
              : "Start by saving a snippet, command, or prompt to your vault."}
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-wrap gap-2.5 min-[900px]:w-auto min-[900px]:max-w-[min(100%,420px)] min-[900px]:justify-end">
          <StatCard label="Items" value={itemStats.total} />
          <StatCard label="Collections" value={allCount} />
          <StatCard label="Favorite items" value={itemStats.favoriteCount} />
          <StatCard label="Favorite collections" value={favCount} />
        </div>
      </section>

      <DashboardInteractiveArea
        pinnedItems={pinnedItems}
        recentItems={recentItems}
        collections={collections}
        allCount={allCount}
        favCount={favCount}
        sharedCount={0}
      />
    </div>
  );
}
