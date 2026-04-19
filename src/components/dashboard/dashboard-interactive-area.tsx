"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { DashboardItemCard } from "@/components/dashboard/item-card";
import { ItemDetailDrawer } from "@/components/dashboard/item-detail-drawer";
import { DashboardSectionHeader } from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import type {
  MockCollection,
  MockItem,
  MockItemType,
} from "@/lib/mock-data";

export type DashboardInteractiveAreaProps = {
  pinnedItems: MockItem[];
  recentItems: MockItem[];
  itemTypes: MockItemType[];
  collections: MockCollection[];
  items: MockItem[];
  allCount: number;
  favCount: number;
  sharedCount: number;
};

function findType(
  itemTypes: MockItemType[],
  itemTypeId: string,
): MockItemType | undefined {
  return itemTypes.find((t) => t.id === itemTypeId);
}

function stackForCollection(
  collectionId: string,
  items: MockItem[],
  itemTypes: MockItemType[],
): string[] {
  const colors: string[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    if (!it.collectionIds.includes(collectionId)) {
      continue;
    }
    const t = itemTypes.find((x) => x.id === it.itemTypeId);
    if (t && !seen.has(t.id)) {
      seen.add(t.id);
      colors.push(t.color);
      if (colors.length >= 4) {
        break;
      }
    }
  }
  return colors;
}

export function DashboardInteractiveArea({
  pinnedItems,
  recentItems,
  itemTypes,
  collections,
  items,
  allCount,
  favCount,
  sharedCount,
}: DashboardInteractiveAreaProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const pinnedIdSet = useMemo(
    () => new Set(pinnedItems.map((i) => i.id)),
    [pinnedItems],
  );

  const recentForGrid = useMemo(
    () => recentItems.filter((i) => !pinnedIdSet.has(i.id)),
    [recentItems, pinnedIdSet],
  );

  const itemsById = useMemo(() => {
    const m = new Map<string, MockItem>();
    for (const it of pinnedItems) {
      m.set(it.id, it);
    }
    for (const it of recentItems) {
      m.set(it.id, it);
    }
    return m;
  }, [pinnedItems, recentItems]);

  const openItem = openId ? itemsById.get(openId) ?? null : null;
  const openType = openItem
    ? findType(itemTypes, openItem.itemTypeId) ?? null
    : null;

  return (
    <>
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
          {pinnedItems.map((it) => {
            const t = findType(itemTypes, it.itemTypeId);
            if (!t) {
              return null;
            }
            return (
              <DashboardItemCard
                key={it.id}
                item={it}
                itemType={t}
                onOpen={() => setOpenId(it.id)}
              />
            );
          })}
        </div>
      </section>

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
          {collections.map((c) => {
            const accent =
              itemTypes.find((x) => x.slug === c.accentSlug)?.color ??
              "#7170ff";
            const stack = stackForCollection(c.id, items, itemTypes);
            return (
              <CollectionCard
                key={c.id}
                collection={c}
                accentSlug={c.accentSlug}
                tint={accent}
                stackColors={stack}
                favorite={c.isFavorite}
              />
            );
          })}
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
          {recentForGrid.map((it) => {
            const t = findType(itemTypes, it.itemTypeId);
            if (!t) {
              return null;
            }
            return (
              <DashboardItemCard
                key={it.id}
                item={it}
                itemType={t}
                onOpen={() => setOpenId(it.id)}
              />
            );
          })}
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
