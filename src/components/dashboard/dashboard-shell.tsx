"use client";

import { useEffect, useState, type ReactNode } from "react";

import type {
  MockCollection,
  MockItemType,
  MockUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export type DashboardShellProps = {
  children: ReactNode;
  user: MockUser;
  itemTypes: MockItemType[];
  countsByTypeId: Record<string, number>;
  favoriteCollections: MockCollection[];
  recentCollections: MockCollection[];
  totalItems: number;
  favoriteItemsCount: number;
};

export function DashboardShell({
  children,
  user,
  itemTypes,
  countsByTypeId,
  favoriteCollections,
  recentCollections,
  totalItems,
  favoriteItemsCount,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 981) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[4px] min-[981px]:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <div
        className={cn(
          "min-h-screen w-full max-[980px]:block",
          "min-[981px]:grid min-[981px]:min-h-screen min-[981px]:transition-[grid-template-columns] min-[981px]:duration-[280ms] min-[981px]:ease-[cubic-bezier(.2,.7,.2,1)]",
          collapsed
            ? "min-[981px]:grid-cols-[64px_minmax(0,1fr)]"
            : "min-[981px]:grid-cols-[248px_minmax(0,1fr)]",
        )}
      >
        <aside
          className={cn(
            "flex flex-col gap-0 border-border bg-sidebar py-3.5 pl-2.5 pr-2.5 text-sidebar-foreground min-[981px]:h-screen min-[981px]:border-r",
            "max-[980px]:fixed max-[980px]:inset-y-0 max-[980px]:left-0 max-[980px]:z-40 max-[980px]:w-[280px] max-[980px]:overflow-hidden max-[980px]:border-r max-[980px]:pt-3.5 max-[980px]:transition-transform max-[980px]:duration-300 max-[980px]:ease-[cubic-bezier(.2,.7,.2,1)]",
            mobileOpen
              ? "max-[980px]:translate-x-0"
              : "max-[980px]:-translate-x-full",
            "min-[981px]:sticky min-[981px]:top-0 min-[981px]:translate-x-0 min-[981px]:self-start",
          )}
        >
          <DashboardSidebar
            collapsed={collapsed}
            user={user}
            itemTypes={itemTypes}
            countsByTypeId={countsByTypeId}
            favoriteCollections={favoriteCollections}
            recentCollections={recentCollections}
            totalItems={totalItems}
            favoriteItemsCount={favoriteItemsCount}
            onToggleCollapse={() => setCollapsed((c) => !c)}
          />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-col max-[980px]:w-full">
          <DashboardHeader
            onMobileMenuClick={() => setMobileOpen((o) => !o)}
          />
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
