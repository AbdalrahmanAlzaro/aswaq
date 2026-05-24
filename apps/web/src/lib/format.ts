import type { Locale } from "./api";

/**
 * Format a price as Western digits + localised currency: "12 JD" / "12 د.أ".
 * Always number-first, currency-after, one space. Caller wraps the result in
 * the <Price/> component so the run is bidi-isolated and doesn't reorder
 * inside Arabic text.
 */
export function formatPrice(
  value: number | string,
  locale: Locale,
  opts: { decimals?: number } = {},
): string {
  const num =
    typeof value === "number"
      ? opts.decimals != null
        ? value.toFixed(opts.decimals)
        : String(value)
      : value;
  const sym = locale === "ar" ? "د.أ" : "JD";
  return `${num} ${sym}`;
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}
