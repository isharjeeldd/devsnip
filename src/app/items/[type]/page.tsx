import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ROUTE_SEGMENT_TO_ITEM_SLUG,
  itemTypeHref,
} from "@/lib/dashboard-metrics";
import { mockItemTypes } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ type: string }>;
};

export default async function ItemTypePlaceholderPage({ params }: PageProps) {
  const { type } = await params;
  const slug = ROUTE_SEGMENT_TO_ITEM_SLUG[type];
  if (!slug) {
    notFound();
  }

  const meta = mockItemTypes.find((t) => t.slug === slug);
  const label = meta?.name ?? slug;

  return (
    <div className="bg-background text-foreground md:min-h-screen">
      <div className="mx-auto max-w-lg px-6 py-24">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          Items
        </p>
        <h1 className="mt-3 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">
          {label}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          This route is a placeholder for <span className="text-foreground">{label}</span>{" "}
          — list view will load from the database later.
        </p>
        <p className="mt-6">
          <Link
            href="/dashboard"
            className="text-[15px] font-medium text-[#7170ff] hover:text-[#828fff]"
          >
            Back to dashboard
          </Link>
        </p>
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          URL: <code className="text-foreground/90">{itemTypeHref(slug)}</code>
        </p>
      </div>
    </div>
  );
}
