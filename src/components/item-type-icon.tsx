import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  Code2,
  FileText,
  ImageIcon,
  Link2,
  MessageSquareText,
  StickyNote,
  Terminal,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  snippet: Code2,
  prompt: MessageSquareText,
  note: StickyNote,
  command: Terminal,
  link: Link2,
  file: FileText,
  image: ImageIcon,
};

export type ItemTypeIconProps = {
  slug: string;
  color: string;
  /** Circle (types) vs soft square (collections sidebar). */
  shape?: "circle" | "rounded";
  size?: "sm" | "md";
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

export function ItemTypeIcon({
  slug,
  color,
  shape = "circle",
  size = "sm",
  className,
  "aria-hidden": ariaHidden,
}: ItemTypeIconProps) {
  const Icon = ICON_MAP[slug] ?? FileText;
  const box =
    size === "sm"
      ? shape === "circle"
        ? "h-5 w-5"
        : "h-3.5 w-3.5"
      : shape === "circle"
        ? "h-7 w-7"
        : "h-10 w-10";
  const iconClass =
    size === "sm"
      ? shape === "circle"
        ? "size-3"
        : "size-2.5"
      : shape === "circle"
        ? "size-4"
        : "size-[18px]";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        shape === "circle" ? "rounded-full" : "rounded-[3px]",
        box,
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${color} 26%, transparent)`,
        color,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 45%, transparent)`,
      }}
      aria-hidden={ariaHidden === true ? true : ariaHidden === false ? false : true}
    >
      <Icon className={iconClass} strokeWidth={2} aria-hidden />
    </span>
  );
}
