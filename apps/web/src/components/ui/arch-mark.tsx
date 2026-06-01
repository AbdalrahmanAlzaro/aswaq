/**
 * ArchMark — the souq-arch flourish in gold. A small ornament that keeps
 * the gold accent alive in moments where it would otherwise disappear
 * (eyebrows, confirmations, no-photo card corners). Never used as a CTA.
 */
export function ArchMark({
  size = 28,
  color = "var(--color-primary)",
  className,
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 56 28"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M2 26 L2 16 A12 12 0 0 1 26 16 L26 26"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M30 26 L30 16 A12 12 0 0 1 54 16 L54 26"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="16" r="1.5" fill={color} />
      <circle cx="42" cy="16" r="1.5" fill={color} />
      <path d="M2 26h52" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
