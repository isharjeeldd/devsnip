import type { CSSProperties } from "react";
import { Pin } from "lucide-react";

import { ItemTypeIcon } from "@/components/item-type-icon";
import type { DashboardItem, DashboardItemType } from "@/lib/db/items";
import { cn } from "@/lib/utils";

export type DashboardItemCardProps = {
  item: DashboardItem;
  itemType: DashboardItemType;
  onOpen?: () => void;
};

export function DashboardItemCard({
  item,
  itemType,
  onOpen,
}: DashboardItemCardProps) {
  const preview =
    item.description ?? item.content ?? item.url ?? "";
  const prose = Boolean(item.previewIsProse);

  const interactive = typeof onOpen === "function";

  const className = cn(
    "relative flex w-full min-h-[118px] flex-col gap-2.5 overflow-hidden rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-[background,border-color,transform] duration-150",
    "before:pointer-events-none before:absolute before:top-2.5 before:bottom-2.5 before:left-0 before:w-0.5 before:rounded-sm before:bg-[var(--tint)]",
    "hover:-translate-y-px hover:border-border hover:bg-muted/60",
    interactive && "cursor-pointer",
  );

  const style = { "--tint": itemType.color } as CSSProperties;

  const inner = (
    <>
      <div className="relative flex items-center gap-2 text-[11px] text-muted-foreground">
        <ItemTypeIcon
          slug={itemType.slug}
          color={itemType.color}
          shape="circle"
          size="sm"
        />
        <span
          className="min-w-0 truncate font-mono text-[10px] tracking-[0.1em] uppercase"
          style={{ color: itemType.color }}
        >
          {itemType.name}
        </span>
        {item.language ? (
          <span className="ml-1 font-mono text-[10px] text-muted-foreground">
            {item.language}
          </span>
        ) : null}
        <span className="ml-auto flex h-4 w-4 shrink-0 items-center justify-center">
          {item.isPinned ? (
            <Pin className="size-3 text-[#7170ff]" aria-label="Pinned" />
          ) : null}
        </span>
      </div>
      <h3 className="relative line-clamp-1 text-[14.5px] leading-snug font-medium tracking-[-0.015em] text-foreground">
        {item.title}
      </h3>
      <div
        className={cn(
          "relative line-clamp-2 rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-[11.5px] leading-snug whitespace-pre-wrap text-muted-foreground",
          prose && "font-sans text-[12.5px]",
          !prose && "font-mono",
        )}
      >
        {preview}
      </div>
      <div className="relative flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        {item.tagNames.slice(0, 3).map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[10.5px] tracking-[-0.005em] text-muted-foreground"
          >
            <span className="text-muted-foreground/80">#</span>
            {t}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
          {item.lastUsedLabel}
        </span>
      </div>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={onOpen}
      >
        {inner}
      </button>
    );
  }

  return (
    <article className={className} style={style}>
      {inner}
    </article>
  );
}
