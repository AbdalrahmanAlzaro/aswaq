import type { ReactNode } from "react";

type Kind = "verified" | "open" | "closed" | "luxury" | "premium" | "neutral";

const STYLES: Record<Kind, string> = {
  verified:
    "bg-[var(--color-gold-50)] text-[var(--color-gold-600)] border border-[var(--color-gold-200)]",
  open:
    "bg-[var(--color-olive-100)] text-[var(--color-olive-700)] border border-[var(--color-olive-300)]/40",
  closed:
    "bg-[var(--color-pom-100)] text-[var(--color-pom-700)] border border-[var(--color-pom-300)]/40",
  luxury:
    "bg-[var(--color-charcoal-600)] text-[var(--color-gold-300)] border border-[var(--color-charcoal-500)]",
  premium:
    "bg-[var(--color-gold-50)] text-[var(--color-gold-600)] border border-[var(--color-gold-200)] uppercase tracking-[0.14em]",
  neutral:
    "bg-[var(--surface-alt)] text-[var(--fg-2)] border border-[var(--border)]",
};

export function Badge({
  kind = "neutral",
  children,
  className,
}: {
  kind?: Kind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none",
        STYLES[kind],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
