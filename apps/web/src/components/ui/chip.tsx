"use client";

import type { ReactNode } from "react";

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
      className={[
        "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-semibold whitespace-nowrap",
        "border transition-colors duration-150 [transition-timing-function:var(--ease-out-aswaq)] cursor-pointer",
        selected
          ? "bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)]"
          : "bg-white text-[var(--fg-1)] border-[var(--border)] hover:bg-[var(--surface-alt)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {luxury && !selected && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold-400)]" />
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
      className={[
        "flex gap-2 overflow-x-auto px-5 py-2 [scrollbar-width:none]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}
