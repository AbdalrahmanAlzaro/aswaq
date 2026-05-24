import type { Locale } from "@/lib/api";
import { formatPrice } from "@/lib/format";

/**
 * Price — Latin digits + localised currency, wrapped in an LTR bidi-isolated
 * span so "12 JD" never reorders to "JD 12" inside Arabic text.
 *
 * Pass either a pre-formatted `children` string or a `value` + `locale`.
 */
export function Price({
  value,
  locale,
  decimals,
  className,
  children,
}: {
  value?: number | string;
  locale?: Locale;
  decimals?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const text =
    children ?? (value != null && locale ? formatPrice(value, locale, { decimals }) : "");
  return (
    <span className={["price", className].filter(Boolean).join(" ")}>
      {text}
    </span>
  );
}
