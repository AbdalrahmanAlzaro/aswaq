import { formatRating } from "@/lib/format";

/**
 * StarRating — numeric label + clipped 5-star track. No half-stars by design.
 */
export function StarRating({
  rating,
  size = 14,
  showNumber,
  count,
}: {
  rating: number;
  size?: number;
  showNumber?: boolean;
  count?: number;
}) {
  const pct = (Math.max(0, Math.min(5, rating)) / 5) * 100;
  const stars = "★★★★★";
  return (
    <span className="inline-flex items-center gap-1.5" style={{ fontSize: size }}>
      {showNumber && (
        <b className="num font-bold text-[var(--fg-1)]">
          {formatRating(rating)}
        </b>
      )}
      <span className="stars-track" aria-hidden="true">
        {stars}
        <span className="stars-fill" style={{ width: `${pct}%` }}>
          {stars}
        </span>
      </span>
      {count != null && (
        <span className="num text-[var(--fg-3)] text-[11px]">
          ({count})
        </span>
      )}
    </span>
  );
}
