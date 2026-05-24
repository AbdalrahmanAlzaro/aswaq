import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiCatalogItem,
  type ApiCatalogOffer,
  type Locale,
} from "@/lib/api";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { StarRating } from "@/components/ui/star-rating";
import { CatalogAddButton } from "@/components/catalog-add-button";

export const dynamic = "force-dynamic";

export default async function CatalogItemPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeRaw, id } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  const [item, offers] = await Promise.all([
    serverFetchOrNull<ApiCatalogItem>(`/catalog/${id}`),
    serverFetchOrNull<ApiCatalogOffer[]>(`/catalog/${id}/offers`),
  ]);
  if (!item) notFound();
  const offerList = offers ?? [];
  const display = locale === "ar" ? item.nameAr ?? item.name : item.name;

  return (
    <div className="max-w-screen-md mx-auto pb-8">
      <div className="px-5 pt-4">
        <Link
          href="/catalog"
          className="text-[13px] text-[var(--accent)] font-semibold flex items-center gap-1"
        >
          <Icon name="back" size={14} flip />
          {t("back_to_catalog")}
        </Link>
      </div>

      <div className="px-5 pt-3 flex gap-4 items-start">
        <div
          className="w-24 h-24 rounded-[var(--radius-md)] flex-none grid place-items-center"
          style={{
            background: item.imageUrl
              ? `center/cover no-repeat url(${item.imageUrl})`
              : "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-400))",
          }}
        >
          {!item.imageUrl && (
            <Icon name="bag" size={36} stroke={1.4} className="text-[var(--fg-3)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="eyebrow">{t("eyebrow")}</div>
          <h1 className="font-display font-semibold text-2xl leading-tight mt-1">
            {display}
          </h1>
          <div className="text-[12.5px] text-[var(--fg-2)] mt-1">
            {[item.unit, item.brand].filter(Boolean).join(" · ")}
          </div>
          <div className="text-[12px] text-[var(--fg-3)] mt-1">
            {t("sellers", { count: offerList.length })}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        {offerList.length === 0 ? (
          <div className="text-center py-10 text-[var(--fg-3)] text-sm">
            {t("no_offers")}
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {offerList.map((o) => (
              <li
                key={o.id}
                className="bg-white rounded-[var(--radius-lg)] border overflow-hidden shadow-[var(--shadow-xs)]"
                style={{
                  borderColor: o.isCheapest
                    ? "var(--color-olive-500)"
                    : "var(--border)",
                  boxShadow: o.isCheapest
                    ? "0 0 0 2px var(--color-olive-300), var(--shadow-sm)"
                    : undefined,
                }}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Link
                    href={`/business/${o.business.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14.5px] text-[var(--fg-1)] truncate">
                        {o.business.name}
                      </span>
                      {o.isCheapest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-olive-500)] text-[var(--color-cream-50)]">
                          {tCommon("cheapest")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[var(--fg-3)]">
                      <StarRating rating={o.business.ratingAvg} size={11} showNumber />
                      {o.business.area && (
                        <>
                          <span>·</span>
                          <span>{o.business.area}</span>
                        </>
                      )}
                    </div>
                  </Link>
                  <Price
                    value={o.price.toFixed(2)}
                    locale={locale}
                    className={[
                      "text-[17px]",
                      o.isCheapest && "text-[var(--color-olive-700)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <CatalogAddButton
                    product={{
                      id: o.id,
                      vendorId: o.business.id,
                      price: o.price,
                      photo: o.imageUrl ?? undefined,
                      en: { name: display },
                      ar: { name: display },
                    }}
                    vendorName={o.business.name}
                  />
                </div>
                {/* Per-product rating summary + link to the product page */}
                <div className="border-t border-[var(--border)] px-4 py-2 flex items-center justify-between bg-[var(--bg-raised)]">
                  <span className="text-[12px] text-[var(--fg-3)] inline-flex items-center gap-1.5">
                    {o.reviewCount > 0 ? (
                      <>
                        <StarRating rating={o.ratingAvg} size={11} showNumber />
                        <span>·</span>
                        <span className="num">
                          {tCommon("review_count", { count: o.reviewCount })}
                        </span>
                      </>
                    ) : (
                      <span>{t("no_product_reviews")}</span>
                    )}
                  </span>
                  <Link
                    href={`/product/${o.id}`}
                    className="text-[12px] font-semibold text-[var(--accent)]"
                  >
                    {t("see_product")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
