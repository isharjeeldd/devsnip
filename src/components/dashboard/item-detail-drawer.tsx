"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  MoreHorizontal,
  Pin,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { ItemTypeIcon } from "@/components/item-type-icon";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import type {
  MockCollection,
  MockItem,
  MockItemType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type ItemDetailDrawerProps = {
  open: boolean;
  item: MockItem | null;
  itemType: MockItemType | null;
  collections: MockCollection[];
  onClose: () => void;
};

function collectionNames(
  item: MockItem,
  collections: MockCollection[],
): string[] {
  return item.collectionIds
    .map((id) => collections.find((c) => c.id === id)?.name)
    .filter((n): n is string => Boolean(n));
}

export function ItemDetailDrawer({
  open,
  item,
  itemType,
  collections,
  onClose,
}: ItemDetailDrawerProps) {
  const [snapshot, setSnapshot] = useState<{
    item: MockItem;
    itemType: MockItemType;
  } | null>(null);

  /* Keep last opened item so the panel can finish Vaul’s close animation after the parent clears selection. */
  useEffect(() => {
    if (item && itemType) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- snapshot mirrors props when an item is open
      setSnapshot({ item, itemType });
    }
  }, [item, itemType]);

  const active =
    item && itemType ? { item, itemType } : snapshot;

  if (!active) {
    return null;
  }

  const { item: displayItem, itemType: displayType } = active;
  const labels = collectionNames(displayItem, collections);

  const body =
    displayItem.content ??
    displayItem.url ??
    displayItem.description ??
    "";

  const isProse = Boolean(displayItem.previewIsProse);

  return (
    <Drawer
      direction="right"
      shouldScaleBackground={false}
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      onAnimationEnd={(isOpen) => {
        if (!isOpen) {
          setSnapshot(null);
        }
      }}
    >
      <DrawerContent
        aria-describedby={undefined}
        className={cn(
          "flex !h-[100dvh] max-h-[100dvh] w-[min(520px,92vw)] gap-0 border-0 bg-background p-0 shadow-[-30px_0_60px_rgba(0,0,0,0.45)]",
        )}
      >
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-5 py-3.5">
          <span
            className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.1em] uppercase shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            style={{
              backgroundColor: `color-mix(in oklab, ${displayType.color} 14%, var(--background))`,
              color: displayType.color,
            }}
          >
            <ItemTypeIcon
              slug={displayType.slug}
              color={displayType.color}
              shape="circle"
              size="sm"
            />
            {displayType.name}
          </span>
          <span className="min-w-0 flex-1" />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label={displayItem.isPinned ? "Pinned" : "Pin"}
          >
            <Pin
              className={cn(
                "size-[15px]",
                displayItem.isPinned ? "text-[#7170ff]" : "opacity-50",
              )}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="Favorite"
          >
            <Star
              className={cn(
                "size-[15px]",
                displayItem.isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "opacity-50",
              )}
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="More"
          >
            <MoreHorizontal className="size-[15px]" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="thin-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4.5">
          <DrawerTitle className="text-[1.875rem] leading-[1.05] font-medium tracking-[-0.04em] text-foreground">
            {displayItem.title}
          </DrawerTitle>

          {displayItem.description ? (
            <p className="mt-2 text-[13.5px] leading-relaxed tracking-[-0.005em] text-muted-foreground">
              {displayItem.description}
            </p>
          ) : null}

          <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Used {displayItem.lastUsedLabel} ago</span>
            <span className="text-muted-foreground/70">·</span>
            {displayItem.language ? (
              <>
                <span className="font-mono text-[11px] uppercase">
                  {displayItem.language}
                </span>
                <span className="text-muted-foreground/70">·</span>
              </>
            ) : null}
            <span>{displayItem.contentType === "file" ? "File" : "Text"}</span>
          </p>

          {body ? (
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-[10px] tracking-[0.1em] text-[#7170ff] uppercase">
                  {displayItem.language ?? "text"}
                </span>
                <span className="min-w-0 shrink truncate opacity-80">
                  {displayItem.title}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="ml-auto h-6 gap-1 rounded-full border-border px-2.5 text-[11px]"
                  onClick={() => void navigator.clipboard.writeText(body)}
                >
                  <Copy className="size-3" />
                  Copy
                </Button>
              </div>
              <pre
                className={cn(
                  "thin-scrollbar max-h-[min(360px,45vh)] overflow-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-foreground/90",
                  isProse && "font-sans text-[13px] leading-relaxed",
                )}
              >
                {body}
              </pre>
            </div>
          ) : null}

          <div>
            <div className="mb-2 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayItem.tagNames.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  <span className="text-muted-foreground/80">#</span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
              In collections
            </div>
            <div className="flex flex-wrap gap-1.5">
              {labels.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground"
                >
                  {name}
                </span>
              ))}
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-dashed border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted/60"
              >
                + Add to collection
              </button>
            </div>
          </div>
        </div>

        <DrawerFooter className="flex flex-row flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-4 py-3 sm:justify-start">
          <Button type="button" variant="outline" size="sm" className="gap-1">
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1 text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
          <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
            ESC to close
          </span>
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => void navigator.clipboard.writeText(body)}
          >
            <Copy className="size-3.5" />
            Copy snippet
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
