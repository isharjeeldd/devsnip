"use client";

import { Bell, Download, Menu, Plus, Search } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DashboardHeaderProps = {
  onMobileMenuClick: () => void;
};

export function DashboardHeader({ onMobileMenuClick }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-border px-4 py-3",
        "backdrop-blur-md backdrop-saturate-150 bg-background/78 supports-[backdrop-filter]:bg-background/78",
        "min-[981px]:px-6",
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="min-[981px]:hidden border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Open menu"
        onClick={onMobileMenuClick}
      >
        <Menu className="size-4" />
      </Button>

      <div className="relative flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-1.5 transition-[box-shadow,border-color] focus-within:border-[#7170ff] focus-within:shadow-[0_0_0_3px_rgba(113,112,255,0.15)] max-w-[620px]">
        <Search
          className="size-[15px] shrink-0 text-muted-foreground"
          aria-hidden
        />
        <Input
          className="h-8 border-0 bg-transparent px-0 text-[13.5px] tracking-[-0.01em] shadow-none focus-visible:ring-0"
          placeholder="Search snippets, prompts, commands…"
          type="search"
          aria-label="Search"
        />
        <kbd className="pointer-events-none hidden shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10.5px] tracking-wide text-muted-foreground sm:inline-block">
          ⌘ K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle className="shrink-0" />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="hidden border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell className="size-[15px]" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="hidden border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          aria-label="Import"
        >
          <Download className="size-[15px]" />
        </Button>
        <div className="hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden />
        <Button
          type="button"
          className="h-[34px] gap-1.5 rounded-full border-0 bg-foreground px-3.5 text-[12.5px] font-semibold text-background hover:bg-foreground/90"
        >
          <Plus className="size-3" strokeWidth={2.4} />
          <span className="max-[560px]:sr-only">New item</span>
        </Button>
      </div>
    </header>
  );
}
