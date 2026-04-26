import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

import { CollectionDetailItems } from "@/components/collections/collection-detail-items";
import { ItemTypeIcon } from "@/components/item-type-icon";
import { getDemoUser, getCollectionById } from "@/lib/db/collections";
import { getItemsByCollection } from "@/lib/db/items";

type Params = Promise<{ id: string }>;

export default async function CollectionDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const demoUser = await getDemoUser();
  if (!demoUser) notFound();

  const collection = await getCollectionById(id, demoUser.id);
  if (!collection) notFound();

  const items = await getItemsByCollection(id, demoUser.id);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 min-[981px]:px-6 min-[981px]:pt-7">
      <Link
        href="/collections"
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All collections
      </Link>

      <section className="mb-8">
        <div className="flex items-start gap-4">
          <ItemTypeIcon
            slug={collection.accentSlug}
            color={collection.accentColor}
            shape="rounded"
            size="md"
            className="h-12 w-12 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] leading-none font-medium tracking-[-0.04em] text-foreground">
                {collection.name}
              </h1>
              {collection.isFavorite && (
                <Star className="size-4 shrink-0 fill-type-note text-type-note" />
              )}
            </div>
            {collection.description && (
              <p className="mt-2 max-w-[560px] text-[14px] leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/4 px-2.5 py-1 font-mono text-[11px]">
                {collection.itemCount} items
              </span>
              <div className="flex items-center gap-1">
                {collection.stackSlugs.map((slug, i) => (
                  <ItemTypeIcon
                    key={`${slug}-${i}`}
                    slug={slug}
                    color={collection.stackColors[i] ?? collection.accentColor}
                    shape="circle"
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CollectionDetailItems items={items} collections={[collection]} />
    </div>
  );
}
