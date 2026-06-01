import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Verida — Badge
 * Pill status markers on the Verida palette. Scarcity rules (BRAND.md):
 *  - verified  → teal-green family + check (the trust pillar)
 *  - premium / luxury → violet (the ONE scarce premium signal; badge + Upgrade only)
 *  - success (cheapest/in-stock) → green, kept distinct from the teal brand
 *  - danger / warning → semantic tints
 * Presentational: callers pass the glyph + label as children. API unchanged
 * (kind/children/className); `success`/`danger`/`warning` added to the set.
 */
type Kind =
  | "verified"
  | "open"
  | "closed"
  | "luxury"
  | "premium"
  | "neutral"
  | "success"
  | "danger"
  | "warning";

const STYLES: Record<Kind, string> = {
  verified: "bg-primary-tint text-primary border border-primary/20",
  premium: "bg-premium-tint text-premium-ink border border-premium/20 uppercase tracking-[0.08em]",
  luxury: "bg-premium-tint text-premium-ink border border-premium/20",
  success: "bg-success-tint text-success-ink border border-success/20",
  open: "bg-success-tint text-success-ink border border-success/20",
  danger: "bg-destructive-tint text-destructive border border-destructive/20",
  closed: "bg-destructive-tint text-destructive border border-destructive/20",
  warning: "bg-warning-tint text-warning border border-warning/20",
  neutral: "bg-muted text-muted-foreground border border-border",
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
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none [&_svg]:size-3",
        STYLES[kind],
        className,
      )}
    >
      {children}
    </span>
  );
}
