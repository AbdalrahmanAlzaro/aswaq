import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./icon";

type Kind = "primary" | "secondary" | "ghost" | "ink" | "gold";
type Size = "sm" | "md" | "lg";

const KIND_CLASS: Record<Kind, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-press)] shadow-sm",
  secondary:
    "bg-white text-[var(--fg-1)] border border-[var(--border-strong)] hover:bg-[var(--surface-alt)]",
  ghost:
    "bg-transparent text-[var(--fg-1)] hover:bg-[var(--surface-alt)]",
  ink:
    "bg-[var(--color-charcoal-600)] text-[var(--color-cream-50)] hover:bg-[var(--color-charcoal-500)]",
  gold:
    "bg-[var(--color-gold-400)] text-[var(--color-charcoal-700)] hover:bg-[var(--color-gold-500)] hover:text-[var(--color-cream-50)] shadow-sm",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px] gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-13 px-5 text-[15px] gap-2",
};

export function Button({
  kind = "primary",
  size = "md",
  full,
  icon,
  iconAfter,
  children,
  className,
  type = "button",
  ...rest
}: {
  kind?: Kind;
  size?: Size;
  full?: boolean;
  icon?: IconName;
  iconAfter?: IconName;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)]",
        "transition-colors duration-150 [transition-timing-function:var(--ease-out-aswaq)]",
        "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        KIND_CLASS[kind],
        SIZE_CLASS[size],
        full && "w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} flip={icon === "arrow-right" || icon === "back" || icon === "chev" || icon === "forward"} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === "lg" ? 18 : 16} flip={iconAfter === "arrow-right" || iconAfter === "back" || iconAfter === "chev" || iconAfter === "forward"} />}
    </button>
  );
}
