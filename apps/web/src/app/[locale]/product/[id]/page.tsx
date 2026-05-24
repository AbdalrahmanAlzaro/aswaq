import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiBusiness,
  type ApiProduct,
  type ApiReview,
  type Locale,
  type Paginated,
  mapBusiness,
  mapReview,
} from "@/lib/api";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { StarRating } from "@/components/ui/star-rating";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeRaw, id } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const tCatalog = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  // Single fetch for the product (includes its business), then per-product
  // reviews. Per-product summary fields (ratingAvg, reviewCount) are
  // denormalised on the product itself — kept fresh by ReviewService.create.
  const product = await serverFetchOrNull<ApiProduct & { business?: ApiBusiness }>(
    `/products/${id}`,
  );
  if (!product) notFound();

  const reviewsPage = await serverFetchOrNull<Paginated<ApiReview>>("/reviews", {
    query: { productId: id, perPage: 20 },
  });
  const reviews = (reviewsPage?.items ?? []).map(mapReview);
  const business = product.business ? mapBusiness(product.business) : null;

  return (
    <div className="max-w-screen-md mx-auto pb-8">
      <div className="px-5 pt-4">
        <Link
          href="/catalog"
          className="text-[13px] text-[var(--accent)] font-semibold inline-flex items-center gap-1"
        >
          <Icon name="back" size={14} flip />
          {tCatalog("back_to_catalog")}
        </Link>
      </div>

      <div className="px-5 pt-3 flex gap-4 items-start">
        <div
          className="w-24 h-24 rounded-[var(--radius-md)] flex-none grid place-items-center"
          style={{
            background: product.imageUrl
              ? `center/cover no-repeat url(${product.imageUrl})`
              : "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-400))",
          }}
        >
          {!product.imageUrl && (
            <Icon name="bag" size={36} stroke={1.4} className="text-[var(--fg-3)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-2xl leading-tight">
            {product.name}
          </h1>
          {business && (
            <Link
              href={`/business/${business.id}`}
              className="text-[12.5px] text-[var(--accent)] font-semibold mt-1 inline-block"
            >
              {business[locale].name}
            </Link>
          )}
          <div className="mt-2 flex items-center gap-2.5">
            <Price value={product.price.toFixed(2)} locale={locale} className="text-xl" />
            {product.reviewCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--fg-3)]">
                <StarRating rating={product.ratingAvg} size={11} showNumber />
                <span>·</span>
                <span className="num">
                  {tCommon("review_count", { count: product.reviewCount })}
                </span>
              </span>
            ) : (
              <span className="text-[12px] text-[var(--fg-3)]">
                {tCatalog("no_product_reviews")}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-[13.5px] text-[var(--fg-2)] mt-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 mt-6">
        <h2 className="font-display font-semibold text-lg">
          {tCatalog("reviews_title")}
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-3 text-sm text-[var(--fg-3)]">
            {tCatalog("no_product_reviews")}
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-[var(--radius-md)] p-4 border border-[var(--border)]"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full grid place-items-center font-bold text-[13px] text-[var(--color-cream-50)]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-terracotta-300), var(--color-gold-300))",
                    }}
                  >
                    {r.initial}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-[13px]">{r.author}</div>
                    <div className="text-[11.5px] text-[var(--fg-3)]">
                      {r.when}
                      {r.verified && ` · ${tCommon("verified")}`}
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={12} />
                </div>
                <div className="text-sm mt-2 leading-relaxed">
                  {locale === "ar" ? r.ar : r.en}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
