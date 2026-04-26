"use client";

import { useMemo, useState } from "react";

import { DashboardItemCard } from "@/components/dashboard/item-card";
import { ItemDetailDrawer } from "@/components/dashboard/item-detail-drawer";
import type { CollectionCardData } from "@/lib/db/collections";
import type { DashboardItem } from "@/lib/db/items";

export type CollectionDetailItemsProps = {
  items: DashboardItem[];
  collections: CollectionCardData[];
};

export function CollectionDetailItems({
  items,
  collections,
}: CollectionDetailItemsProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const itemsById = useMemo(() => {
    const m = new Map<string, DashboardItem>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  const openItem = openId ? itemsById.get(openId) ?? null : null;
  const openType = openItem?.itemType ?? null;

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center text-center">
        <p className="text-[14px] text-muted-foreground">
          No items in this collection yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {items.map((it) => (
          <DashboardItemCard
            key={it.id}
            item={it}
            itemType={it.itemType}
            onOpen={() => setOpenId(it.id)}
          />
        ))}
      </div>

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
