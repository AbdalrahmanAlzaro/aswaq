import { formatRating } from "@/lib/format";

/* Verida — StarRating
 * Numeric label + a gold fill clipped to the exact rating % over a gray track.
 * No half-stars by design. Accessible via role="img" + aria-label.
 * Colours come from `.stars-track` / `.stars-fill` (see globals.css). API unchanged.
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
  const clamped = Math.max(0, Math.min(5, rating));
  const pct = (clamped / 5) * 100;
  const stars = "★★★★★";
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{ fontSize: size }}
      role="img"
      aria-label={`${formatRating(rating)} out of 5`}
    >
      {showNumber && (
        <b className="num font-bold text-foreground">{formatRating(rating)}</b>
      )}
      <span className="stars-track" aria-hidden="true">
        {stars}
        <span className="stars-fill" style={{ width: `${pct}%` }}>
          {stars}
        </span>
      </span>
      {count != null && (
        <span className="num text-[11px] text-subtle-foreground">({count})</span>
      )}
    </span>
  );
}
