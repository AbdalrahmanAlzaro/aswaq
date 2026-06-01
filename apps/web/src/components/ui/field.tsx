"use client";

import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* Verida — Field (labelled text input)
 * Re-skinned to Verida tokens; RTL-safe (logical box). Adds `helper` text and
 * proper a11y wiring (htmlFor + aria-invalid + aria-describedby). Backward
 * compatible: label/error/inputClassName/className + native input props.
 */
export function Field({
  label,
  error,
  helper,
  className,
  inputClassName,
  id,
  ...rest
}: {
  label: string;
  error?: string;
  helper?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={msgId}
        {...rest}
        className={cn(
          "h-11 w-full rounded-xl border bg-background px-3.5 text-[15px] text-foreground outline-none transition-colors",
          "placeholder:text-subtle-foreground",
          error
            ? "border-destructive focus:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30"
            : "border-input focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
          inputClassName,
        )}
      />
      {error ? (
        <span id={msgId} className="text-xs text-destructive">
          {error}
        </span>
      ) : helper ? (
        <span id={msgId} className="text-xs text-subtle-foreground">
          {helper}
        </span>
      ) : null}
    </div>
  );
}
