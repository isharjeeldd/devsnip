"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  LayoutDashboard,
  List,
  PanelLeft,
  Plus,
  Star,
} from "lucide-react";

import { ItemTypeIcon } from "@/components/item-type-icon";
import { Button } from "@/components/ui/button";
import { itemTypeHref } from "@/lib/dashboard-metrics";
import type {
  MockCollection,
  MockItemType,
  MockUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type DashboardSidebarProps = {
  collapsed: boolean;
  user: MockUser;
  itemTypes: MockItemType[];
  countsByTypeId: Record<string, number>;
  favoriteCollections: MockCollection[];
  recentCollections: MockCollection[];
  totalItems: number;
  favoriteItemsCount: number;
  onToggleCollapse: () => void;
};

function initials(name: string | null, email: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0];
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1];
    return `${a ?? ""}${b ?? ""}`.toUpperCase() || email.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function NavSectionTitle({
  children,
  collapsed,
}: {
  children: string;
  collapsed: boolean;
}) {
  if (collapsed) {
    return null;
  }
  return (
    <div className="px-2.5 pt-3.5 pb-1.5 text-[10px] tracking-[0.14em] text-muted-foreground uppercase whitespace-nowrap">
      {children}
    </div>
  );
}

function SidebarNavLink({
  href,
  active,
  collapsed,
  children,
  trailing,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] tracking-[-0.005em] transition-colors",
        "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
        active &&
        "bg-white/[0.04] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? String(children) : undefined}
    >
      {children}
      {!collapsed && trailing != null ? (
        <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          {trailing}
        </span>
      ) : null}
    </Link>
  );
}

export function DashboardSidebar({
  collapsed,
  user,
  itemTypes,
  countsByTypeId,
  favoriteCollections,
  recentCollections,
  totalItems,
  favoriteItemsCount,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isDash = pathname === "/dashboard";

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2.5 border-b border-border px-2 pb-3.5 pt-1.5",
          collapsed && "justify-center px-0 pb-3.5",
        )}
      >
        {!collapsed ? (
          <span className="min-w-0 truncate text-3xl leading-none font-medium tracking-[-0.04em]">
            <b>Dev</b><span className="text-[#7170ff]">Snip</span>
          </span>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
            "ml-auto h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground max-[980px]:hidden",
            collapsed && "ml-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapse}
        >
          <PanelLeft className="size-3.5" />
        </Button>
      </div>

      <div className="sidebar-scroll thin-scrollbar mx-[-6px] flex-1 overflow-y-auto px-1.5 pb-2 pt-1">
        <NavSectionTitle collapsed={collapsed}>Library</NavSectionTitle>
        <nav className="flex flex-col gap-px">
          <SidebarNavLink
            href="/dashboard"
            active={isDash}
            collapsed={collapsed}
            trailing={undefined}
          >
            <LayoutDashboard className="size-3.5 shrink-0 opacity-80" />
            {!collapsed ? <span className="min-w-0 flex-1 truncate">Dashboard</span> : null}
          </SidebarNavLink>
          <SidebarNavLink
            href="/dashboard"
            active={false}
            collapsed={collapsed}
            trailing={totalItems}
          >
            <List className="size-3.5 shrink-0 opacity-80" />
            {!collapsed ? <span className="min-w-0 flex-1 truncate">All items</span> : null}
          </SidebarNavLink>
          <SidebarNavLink
            href="/dashboard"
            active={false}
            collapsed={collapsed}
            trailing={favoriteItemsCount}
          >
            <Star className="size-3.5 shrink-0 opacity-80" />
            {!collapsed ? <span className="min-w-0 flex-1 truncate">Favorites</span> : null}
          </SidebarNavLink>
          <SidebarNavLink
            href="/dashboard"
            active={false}
            collapsed={collapsed}
            trailing={undefined}
          >
            <Clock className="size-3.5 shrink-0 opacity-80" />
            {!collapsed ? <span className="min-w-0 flex-1 truncate">Recent</span> : null}
          </SidebarNavLink>
        </nav>

        <NavSectionTitle collapsed={collapsed}>Types</NavSectionTitle>
        <nav className="flex flex-col gap-px">
          {itemTypes.map((t) => {
            const count = countsByTypeId[t.id] ?? 0;
            const locked = !user.isPro && (t.slug === "file" || t.slug === "image");
            return (
              <Link
                key={t.id}
                href={itemTypeHref(t.slug)}
                className={cn(
                  "relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] tracking-[-0.005em] transition-colors",
                  "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  collapsed && "justify-center px-0",
                )}
                title={collapsed ? t.name : undefined}
              >
                <ItemTypeIcon
                  slug={t.slug}
                  color={t.color}
                  shape="circle"
                  size="sm"
                  className={collapsed ? "mx-auto" : undefined}
                />
                {!collapsed ? (
                  <span className="min-w-0 flex-1 truncate">{t.name}s</span>
                ) : null}
                {!collapsed && (
                  <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                    {locked ? (
                      <span className="text-[10px] text-muted-foreground">PRO</span>
                    ) : (
                      count
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <NavSectionTitle collapsed={collapsed}>Favorites</NavSectionTitle>
        <nav className="flex flex-col gap-px">
          {favoriteCollections.map((c) => {
            const accent =
              itemTypes.find((x) => x.slug === c.accentSlug)?.color ?? "#7170ff";
            return (
              <SidebarNavLink
                key={c.id}
                href="/dashboard"
                active={false}
                collapsed={collapsed}
                trailing={c.itemCount}
              >
                <ItemTypeIcon
                  slug={c.accentSlug}
                  color={accent}
                  shape="rounded"
                  size="sm"
                />
                {!collapsed ? (
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                ) : null}
              </SidebarNavLink>
            );
          })}
        </nav>

        <NavSectionTitle collapsed={collapsed}>Recent collections</NavSectionTitle>
        <nav className="flex flex-col gap-px">
          {recentCollections.map((c) => {
            const accent =
              itemTypes.find((x) => x.slug === c.accentSlug)?.color ?? "#7170ff";
            return (
              <SidebarNavLink
                key={c.id}
                href="/dashboard"
                active={false}
                collapsed={collapsed}
                trailing={c.itemCount}
              >
                <ItemTypeIcon
                  slug={c.accentSlug}
                  color={accent}
                  shape="rounded"
                  size="sm"
                />
                {!collapsed ? (
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                ) : null}
              </SidebarNavLink>
            );
          })}
          {!collapsed ? (
            <button
              type="button"
              className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-left text-[13.5px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <Plus className="size-3 shrink-0 opacity-70" />
              <span className="min-w-0 flex-1 truncate">New collection</span>
            </button>
          ) : null}
        </nav>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-2.5">
        {!collapsed ? (
          <div className="relative overflow-hidden rounded-xl border border-border bg-[linear-gradient(120%_100%_at_0%_0%,rgba(94,106,210,0.12),transparent_50%),#191a1b] p-3 shadow-[0_0_0_1px_rgba(113,112,255,0.15)]">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-[-0.01em]">
              Free plan
              <span className="rounded-full bg-primary px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide text-primary-foreground">
                {Math.min(totalItems, 50)}/50
              </span>
            </div>
            <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
              Upgrade to unlock file uploads, AI, and unlimited collections.
            </p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#5e6ad2] to-[#828fff]"
                aria-hidden
              />
            </div>
            <p className="mt-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>items used</span>
              <span>
                {favoriteCollections.length} fav · {recentCollections.length} recent
              </span>
            </p>
            <Button
              type="button"
              className="mt-2.5 h-[30px] w-full rounded-full border-0 bg-foreground text-xs font-semibold text-background hover:bg-foreground/90"
            >
              Upgrade to Pro
            </Button>
          </div>
        ) : null}

        <div
          className={cn(
            "flex items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-white/[0.04]",
            collapsed && "justify-center p-1.5",
          )}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2a5eff] to-[#7a4cff] text-xs font-semibold text-white"
            aria-hidden
          >
            {initials(user.name, user.email)}
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium tracking-[-0.01em] text-foreground">
                {user.name ?? "Account"}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
