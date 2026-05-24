"use client";

import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  error,
  className,
  inputClassName,
  ...rest
}: {
  label: string;
  error?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}>
      <span className="text-xs font-semibold text-[var(--fg-2)]">{label}</span>
      <input
        {...rest}
        className={[
          "h-12 px-3.5 rounded-[var(--radius-md)] bg-white text-[15px] outline-none",
          "border transition-colors duration-150",
          error
            ? "border-[var(--danger)]"
            : "border-[var(--border-strong)] focus:border-[var(--border-focus)] focus:border-2",
          inputClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {error && (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      )}
    </label>
  );
}
