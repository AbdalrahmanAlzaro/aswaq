import type { Locale, Product, Business } from "@/lib/api";
import { categoryStyle, Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { Heart } from "@/components/ui/heart";

export function ProductCard({
  product,
  vendor,
  locale,
  saved,
  onToggleSave,
  cheapest,
  cheapestLabel,
  onClick,
}: {
  product: Product;
  vendor?: Business;
  locale: Locale;
  saved?: boolean;
  onToggleSave?: () => void;
  cheapest?: boolean;
  cheapestLabel?: string;
  onClick?: () => void;
}) {
  const L = product[locale];
  const V = vendor?.[locale];
  const cat = categoryStyle(vendor?.category);
  const discount = product.was
    ? Math.round((1 - product.price / product.was) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className={[
        "bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-xs)] overflow-hidden",
        onClick && "cursor-pointer hover:shadow-[var(--shadow-md)] transition-shadow",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="relative grid place-items-center"
        style={{
          aspectRatio: "1 / 1",
          background: product.photo
            ? `center/cover no-repeat url(${product.photo})`
            : cat.gradient,
          color: cat.ink,
        }}
      >
        {!product.photo && <Icon name={cat.glyph} size={48} stroke={1.4} />}
        {discount > 0 && (
          <span
            className="absolute top-2 num text-[10px] font-bold bg-[var(--accent)] text-[var(--accent-fg)] px-1.5 py-0.5 rounded-full"
            style={{ insetInlineStart: 8 }}
          >
            −{discount}%
          </span>
        )}
        {onToggleSave && (
          <span
            className="absolute top-2"
            style={{ insetInlineEnd: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Heart filled={saved} onToggle={onToggleSave} size={14} />
          </span>
        )}
      </div>
      <div className="p-3">
        {V && (
          <div className="text-[11px] text-[var(--fg-3)] font-medium truncate">
            {V.name}
          </div>
        )}
        <div className="text-[13px] font-semibold text-[var(--fg-1)] leading-snug mt-0.5 line-clamp-2 h-[2.6em]">
          {L.name}
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Price value={product.price} locale={locale} className="text-[15px]" />
          {product.was != null && (
            <Price
              value={product.was}
              locale={locale}
              className="text-[12px] text-[var(--fg-3)] line-through"
            />
          )}
          {cheapest && cheapestLabel && (
            <span
              className="ms-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-olive-100)] text-[var(--color-olive-700)]"
            >
              {cheapestLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
