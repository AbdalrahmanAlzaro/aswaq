/* Verida — Button primitive
 * Adapted from a 21st.dev shadcn/originui button (cva).
 * Changes for Verida:
 *   - Tailwind v4 + Verida tokens (see app/globals.css).
 *   - Added `premium` (violet), `success` (cheapest/positive) and `ink` (dark) variants.
 *   - Direction-agnostic: flex + gap, no ml/mr — RTL-safe by default.
 *     Put `.flip-rtl` on any directional icon inside (e.g. a "next" arrow).
 *   - Accessible focus ring via --color-ring; auto icon sizing.
 *   - Backward-compat: legacy `kind`/`full`/`icon`/`iconAfter`/`size="md"` props
 *     from the pre-cva button are still accepted (see mapping below) so existing
 *     call sites keep working. Prefer `variant` + `<Icon/>` children for new code.
 * Deps: @radix-ui/react-slot, class-variance-authority, @/lib/utils (cn).
 * Path: apps/web/src/components/ui/button.tsx
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Brand action
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // Premium / luxury (scarce — Upgrade CTA). Legacy `kind="gold"` maps here.
        premium: "bg-premium text-premium-foreground hover:bg-premium/90",
        // Positive / cheapest confirm
        success: "bg-success text-success-foreground hover:bg-success/90",
        // Dark / high-emphasis confirm. Legacy `kind="ink"` maps here.
        ink: "bg-foreground text-background hover:bg-foreground/90",
        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        // Legacy alias from the pre-cva button (its old default height).
        md: "h-11 px-4 py-2",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Legacy `kind` (pre-cva button) → cva `variant`. */
type LegacyKind = "primary" | "secondary" | "ghost" | "ink" | "gold";
const KIND_TO_VARIANT: Record<
  LegacyKind,
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>
> = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  ink: "ink",
  gold: "premium",
};

/** Directional glyphs that must mirror under RTL. */
const FLIP_ICONS: ReadonlySet<IconName> = new Set([
  "arrow-right",
  "back",
  "chev",
  "forward",
]);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** @deprecated legacy prop — use `variant` instead. */
  kind?: LegacyKind;
  /** @deprecated legacy prop — use `className="w-full"` instead. */
  full?: boolean;
  /** @deprecated legacy prop — pass an `<Icon/>` as the first child instead. */
  icon?: IconName;
  /** @deprecated legacy prop — pass an `<Icon/>` as the last child instead. */
  iconAfter?: IconName;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      kind,
      full,
      icon,
      iconAfter,
      type,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const resolvedVariant = variant ?? (kind ? KIND_TO_VARIANT[kind] : undefined);

    // `asChild` (Slot) requires a single child element, so the legacy icon
    // helpers only apply when we render a real <button>.
    const content =
      !asChild && (icon || iconAfter) ? (
        <>
          {icon && <Icon name={icon} flip={FLIP_ICONS.has(icon)} />}
          {children}
          {iconAfter && <Icon name={iconAfter} flip={FLIP_ICONS.has(iconAfter)} />}
        </>
      ) : (
        children
      );

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: resolvedVariant, size, className }),
          full && "w-full",
        )}
        // Match the old button's safe default; explicit type (e.g. submit) wins.
        type={asChild ? type : (type ?? "button")}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
