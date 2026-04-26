import type { CSSProperties } from "react";
import { Star } from "lucide-react";

import { ItemTypeIcon } from "@/components/item-type-icon";
import type { CollectionCardData } from "@/lib/db/collections";
import { cn } from "@/lib/utils";

export type CollectionCardProps = {
  collection: CollectionCardData;
  className?: string;
};

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const { accentColor, accentSlug, stackColors, stackSlugs, isFavorite } =
    collection;

  return (
    <article
      className={cn(
        "group relative flex min-h-[148px] cursor-pointer flex-col justify-between gap-3.5 overflow-hidden rounded-[14px] border border-border bg-card p-4 shadow-[0_0_0_1px_rgba(113,112,255,0.12)] transition-[transform,border-color,box-shadow] duration-200",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-[0.22] before:[background:radial-gradient(120%_80%_at_0%_0%,var(--tint),transparent_55%)]",
        "hover:-translate-y-0.5 hover:border-border hover:shadow-[0_0_0_1px_rgba(113,112,255,0.35),0_16px_40px_rgba(0,0,0,0.35)]",
        className,
      )}
      style={{ "--tint": accentColor } as CSSProperties}
    >
      <div className="relative flex items-start justify-between gap-2.5">
        <ItemTypeIcon
          slug={accentSlug}
          color={accentColor}
          shape="rounded"
          size="md"
          className="h-10 w-10 rounded-[10px]"
        />
        {isFavorite ? (
          <Star
            className="size-3.5 shrink-0 fill-[#ffb257] text-[#ffb257]"
            aria-label="Favorite collection"
          />
        ) : null}
      </div>
      <div className="relative">
        <h3 className="text-[20px] leading-[1.05] font-medium tracking-[-0.028em] text-foreground">
          {collection.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted-foreground">
          {collection.description ?? ""}
        </p>
      </div>
      <div className="relative flex items-center justify-between font-mono text-[10.5px] text-muted-foreground">
        <div className="flex items-center">
          {stackSlugs.map((slug, i) => (
            <span
              key={`${collection.id}-${slug}-${i}`}
              className="shadow-[0_0_0_2px_var(--background)]"
              style={{ marginLeft: i > 0 ? -5 : 0 }}
            >
              <ItemTypeIcon
                slug={slug}
                color={stackColors[i] ?? accentColor}
                shape="rounded"
                size="sm"
              />
            </span>
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.04] px-2 py-0.5 text-[11px] font-sans tracking-[-0.005em] text-muted-foreground">
          {collection.itemCount} items
        </div>
      </div>
    </article>
  );
}
