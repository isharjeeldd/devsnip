import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "min-w-[130px] flex-1 rounded-[14px] border border-border bg-card p-3.5 shadow-[0_0_0_1px_rgba(113,112,255,0.12)]",
        className,
      )}
    >
      <div className="font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 text-[28px] leading-none font-medium tracking-[-0.035em] text-foreground">
        {value}
      </div>
      {hint ? (
        <div className="mt-0.5 font-mono text-[10.5px] text-[#35d08a]">{hint}</div>
      ) : null}
    </div>
  );
}
