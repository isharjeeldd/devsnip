"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { DashboardItemCard } from "@/components/dashboard/item-card";
import { ItemDetailDrawer } from "@/components/dashboard/item-detail-drawer";
import { DashboardSectionHeader } from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import type { CollectionCardData } from "@/lib/db/collections";
import type { DashboardItem } from "@/lib/db/items";

export type DashboardInteractiveAreaProps = {
  pinnedItems: DashboardItem[];
  recentItems: DashboardItem[];
  collections: CollectionCardData[];
  allCount: number;
  favCount: number;
  sharedCount: number;
};

export function DashboardInteractiveArea({
  pinnedItems,
  recentItems,
  collections,
  allCount,
  favCount,
  sharedCount,
}: DashboardInteractiveAreaProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const itemsById = useMemo(() => {
    const m = new Map<string, DashboardItem>();
    for (const it of pinnedItems) {
      m.set(it.id, it);
    }
    for (const it of recentItems) {
      m.set(it.id, it);
    }
    return m;
  }, [pinnedItems, recentItems]);

  const openItem = openId ? itemsById.get(openId) ?? null : null;
  const openType = openItem?.itemType ?? null;

  return (
    <>
      {pinnedItems.length > 0 && (
        <section className="mt-10 space-y-3.5">
          <DashboardSectionHeader
            title="Pinned"
            right={
              <span className="font-mono text-[10px] text-muted-foreground">
                {pinnedItems.length} pinned
              </span>
            }
          />
          <div className="grid grid-cols-1 gap-2.5 min-[560px]:grid-cols-2 xl:grid-cols-3">
            {pinnedItems.map((it) => (
              <DashboardItemCard
                key={it.id}
                item={it}
                itemType={it.itemType}
                onOpen={() => setOpenId(it.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 space-y-3.5">
        <DashboardSectionHeader
          title="Collections"
          right={
            <>
              <div className="flex gap-0.5 rounded-[10px] border border-border bg-card p-[3px]">
                <button
                  type="button"
                  className="rounded-[7px] bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                >
                  All{" "}
                  <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                    {allCount}
                  </span>
                </button>
                <button
                  type="button"
                  className="rounded-[7px] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  Favorites{" "}
                  <span className="ml-1 font-mono text-[10px]">{favCount}</span>
                </button>
                <button
                  type="button"
                  className="rounded-[7px] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  Shared{" "}
                  <span className="ml-1 font-mono text-[10px]">{sharedCount}</span>
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-border bg-transparent text-muted-foreground hover:bg-muted"
                aria-label="Sort collections"
              >
                <SlidersHorizontal className="size-3.5" />
              </Button>
            </>
          }
        />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
          <button
            type="button"
            className="group flex min-h-[148px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0_8px,transparent_8px_16px),var(--card)] px-4 py-6 text-center text-muted-foreground transition-[border-color,color] hover:border-[#7170ff] hover:text-foreground"
          >
            <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-muted text-foreground">
              <span className="text-lg leading-none">+</span>
            </span>
            <span className="text-[13px] font-medium text-foreground">
              New collection
            </span>
            <span className="mt-1 text-[11.5px] text-muted-foreground">
              Group related items together
            </span>
          </button>
        </div>
      </section>

      <section className="mt-10 space-y-3.5">
        <DashboardSectionHeader
          title="Recently used"
          right={
            <div className="flex max-w-full flex-wrap gap-0.5 overflow-x-auto rounded-[10px] border border-border bg-card p-[3px]">
              {(
                [
                  "All",
                  "Snippets",
                  "Prompts",
                  "Notes",
                  "Commands",
                ] as const
              ).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={
                    i === 0
                      ? "shrink-0 rounded-[7px] bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                      : "shrink-0 rounded-[7px] px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {recentItems.map((it) => (
            <DashboardItemCard
              key={it.id}
              item={it}
              itemType={it.itemType}
              onOpen={() => setOpenId(it.id)}
            />
          ))}
        </div>
      </section>

      <ItemDetailDrawer
        open={openId !== null}
        item={openItem}
        itemType={openType}
        collections={collections}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}
