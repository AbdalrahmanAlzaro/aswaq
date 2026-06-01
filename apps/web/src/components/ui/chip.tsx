"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Verida — Chip / filter selector (pill). Selected = teal brand; a luxury dot
 * uses the scarce violet. RTL-safe. API unchanged. */
export function Chip({
  selected,
  luxury,
  onClick,
  children,
  className,
}: {
  selected?: boolean;
  luxury?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted",
        className,
      )}
    >
      {luxury && !selected && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-premium" />
      )}
      {children}
    </button>
  );
}

export function ChipRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex gap-2 overflow-x-auto px-5 py-2", className)}
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}
