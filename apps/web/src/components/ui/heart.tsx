"use client";

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
      className="inline-grid place-items-center w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm cursor-pointer transition-transform"
      style={{
        transform: filled ? "scale(1.05)" : "scale(1)",
        transitionDuration: "var(--ease-spring)",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "var(--accent)" : "none"}
        stroke={filled ? "var(--accent)" : "var(--color-charcoal-600)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.3 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9z" />
      </svg>
    </button>
  );
}
