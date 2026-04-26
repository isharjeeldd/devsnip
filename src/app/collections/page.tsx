import Link from "next/link";
import { Plus } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { getDemoUser, getAllCollections, getCollectionStats } from "@/lib/db/collections";

export default async function CollectionsPage() {
  const demoUser = await getDemoUser();

  const [collections, stats] = demoUser
    ? await Promise.all([
        getAllCollections(demoUser.id).catch(() => []),
        getCollectionStats(demoUser.id).catch(() => ({ total: 0, favoriteCount: 0 })),
      ])
    : [[], { total: 0, favoriteCount: 0 }];

  const favorites = collections.filter((c) => c.isFavorite);
  const others = collections.filter((c) => !c.isFavorite);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-20 min-[981px]:px-6 min-[981px]:pt-7">
      <section className="mb-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-[#7170ff] uppercase before:size-1.5 before:rounded-full before:bg-[#7170ff] before:shadow-[0_0_0_3px_rgba(113,112,255,0.18)] before:content-['']">
              Collections · {stats.total} total
            </p>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-foreground">
              Collections
            </h1>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed tracking-[-0.005em] text-muted-foreground">
              {stats.favoriteCount} favorites · {stats.total - stats.favoriteCount} other collections
            </p>
          </div>
          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-2 rounded-[10px] bg-[#5e6ad2] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#828fff]"
          >
            <Plus className="size-3.5" />
            New collection
          </button>
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Favorites
          </h2>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {favorites.map((c) => (
              <Link key={c.id} href={`/collections/${c.id}`} className="block">
                <CollectionCard collection={c} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          All collections
        </h2>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {others.map((c) => (
            <Link key={c.id} href={`/collections/${c.id}`} className="block">
              <CollectionCard collection={c} />
            </Link>
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

      {collections.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Plus className="size-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground">No collections yet</h2>
          <p className="mt-1 max-w-[320px] text-[14px] text-muted-foreground">
            Create your first collection to organize snippets, prompts, and more.
          </p>
        </div>
      )}
    </div>
  );
}
