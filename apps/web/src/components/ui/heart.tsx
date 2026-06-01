"use client";

/* Verida — Heart (save / favourite). Outline by default; fills teal-brand when
 * active, with a small spring pop. Honours reduced motion. API unchanged. */
export function Heart({
  filled,
  onToggle,
  size = 18,
  label,
}: {
  filled?: boolean;
  onToggle?: () => void;
  size?: number;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label ?? (filled ? "Remove from saved" : "Save")}
      aria-pressed={filled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className="inline-grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-background/90 shadow-sm transition-transform duration-200 ease-out hover:bg-background motion-reduce:transition-none"
      style={{ transform: filled ? "scale(1.08)" : "scale(1)" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "var(--color-primary)" : "none"}
        stroke={filled ? "var(--color-primary)" : "currentColor"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={filled ? "" : "text-muted-foreground"}
      >
        <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.3 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9z" />
      </svg>
    </button>
  );
}
