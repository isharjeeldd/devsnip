import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type DashboardSectionHeaderProps = {
  title: string;
  right?: ReactNode;
  className?: string;
};

export function DashboardSectionHeader({
  title,
  right,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-3.5 flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      <h2 className="text-[28px] leading-none font-medium tracking-[-0.035em] text-foreground">
        {title}
      </h2>
      {right != null ? (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {right}
        </div>
      ) : null}
    </div>
  );
}
