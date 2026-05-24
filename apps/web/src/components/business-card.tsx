import { Link } from "@/i18n/navigation";
import type { Business, Locale } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Icon, categoryStyle } from "@/components/ui/icon";
import { ArchMark } from "@/components/ui/arch-mark";
import { StarRating } from "@/components/ui/star-rating";
import { Heart } from "@/components/ui/heart";

/**
 * BusinessCard — 16:10 image at the top. When a photo is supplied, composite
 * over a charcoal bottom scrim for legibility. When no photo, fall back to a
 * warm category-tinted gradient + Lucide category glyph + a small gold
 * ArchMark in the corner.
 */
export function BusinessCard({
  biz,
  locale,
  saved,
  onToggleSave,
  layout = "v",
  t,
}: {
  biz: Business;
  locale: Locale;
  saved?: boolean;
  onToggleSave?: () => void;
  layout?: "v" | "h";
  t: { verified: string; luxury: string; open: string; closed: string };
}) {
  const L = biz[locale];
  const cat = categoryStyle(biz.category);
  const hasPhoto = !!biz.photo;
  const imgBg = hasPhoto
    ? `center/cover no-repeat url(${biz.photo})`
    : cat.gradient;

  if (layout === "h") {
    return (
      <Link
        href={`/business/${biz.id}`}
        className="flex bg-white rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-shadow overflow-hidden group"
      >
        <div
          className="w-24 grid place-items-center flex-none"
          style={{ background: imgBg, color: cat.ink, aspectRatio: "1" }}
        >
          {!hasPhoto && <Icon name={cat.glyph} size={32} stroke={1.4} />}
        </div>
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="font-semibold text-[15px] text-[var(--fg-1)] truncate">
            {L.name}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[var(--fg-3)]">
            <StarRating rating={biz.rating} size={11} showNumber />
            <span className="text-[var(--fg-3)]">·</span>
            <span className="num">({biz.reviews})</span>
            <span className="text-[var(--fg-3)]">·</span>
            <span>{L.neighborhood}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {biz.verified && <Badge kind="verified">★ {t.verified}</Badge>}
            {/* "open now" badge intentionally hidden — backend has no business
                hours yet, so we don't fake a status. */}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/business/${biz.id}`}
      className="block bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow overflow-hidden group"
    >
      <div
        className="relative grid place-items-center"
        style={{ aspectRatio: "16 / 10", background: imgBg, color: cat.ink }}
      >
        {!hasPhoto && (
          <>
            <Icon name={cat.glyph} size={56} stroke={1.4} />
            <span
              className="absolute bottom-2.5 opacity-70"
              style={{ insetInlineEnd: 10 }}
            >
              <ArchMark size={32} color={cat.ink} />
            </span>
          </>
        )}
        {hasPhoto && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(31,26,21,0.55) 0%, rgba(31,26,21,0) 55%)",
            }}
          />
        )}
        <div
          className="absolute top-2.5 flex gap-1.5"
          style={{ insetInlineStart: 10 }}
        >
          {biz.verified && <Badge kind="verified">★ {t.verified}</Badge>}
          {biz.luxury && <Badge kind="luxury">{t.luxury}</Badge>}
        </div>
        {onToggleSave && (
          <span
            className="absolute top-2.5"
            style={{ insetInlineEnd: 10 }}
            onClick={(e) => e.preventDefault()}
          >
            <Heart filled={saved} onToggle={onToggleSave} size={16} />
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="font-semibold text-[15px] text-[var(--fg-1)] truncate">
          {L.name}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[var(--fg-3)]">
          <StarRating rating={biz.rating} size={11} showNumber />
          <span>·</span>
          <span className="num">({biz.reviews})</span>
          {/* distance hidden — no geo yet */}
        </div>
      </div>
    </Link>
  );
}
