"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Verida — Alert / Toast
 * Adapted from 21st.dev "alert-1" (cva variants), re-skinned to Verida tokens.
 * Semantic variants on tints; optional dismiss. RTL-safe (logical spacing, the
 * close button sits at the inline-end). Lucide icons (stroke 1.5 family).
 */
const alertVariants = cva(
  "relative flex gap-3 rounded-xl border p-3.5 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        success: "border-success/30 bg-success-tint text-success-ink",
        danger: "border-destructive/30 bg-destructive-tint text-destructive",
        warning: "border-warning/30 bg-warning-tint text-warning",
        info: "border-info/30 bg-info-tint text-info",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const ICONS = {
  default: Info,
  success: CheckCircle2,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: string;
  icon?: boolean;
  onClose?: () => void;
}

export function Alert({
  variant = "default",
  title,
  icon = true,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const Glyph = ICONS[variant ?? "default"];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {icon && <Glyph className="mt-0.5 size-5 shrink-0" aria-hidden="true" />}
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="-me-1 -mt-1 shrink-0 rounded-md p-1 transition-colors hover:bg-foreground/5"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
