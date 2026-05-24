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
  type Review,
  mapBusiness,
  mapProduct,
  mapReview,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon, categoryStyle } from "@/components/ui/icon";
import { StarRating } from "@/components/ui/star-rating";
import { ProductCard } from "@/components/product-card";
import { BusinessTabs } from "@/components/business-tabs";

export const dynamic = "force-dynamic";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeRaw, id } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const tBiz = await getTranslations("Business");
  const tCommon = await getTranslations("Common");

  const [apiBiz, apiProducts, apiReviewsPage] = await Promise.all([
    serverFetchOrNull<ApiBusiness>(`/businesses/${id}`),
    serverFetchOrNull<ApiProduct[]>("/products", { query: { businessId: id } }),
    serverFetchOrNull<Paginated<ApiReview>>("/reviews", {
      query: { businessId: id, perPage: 20 },
    }),
  ]);

  if (!apiBiz) notFound();
  const biz = mapBusiness(apiBiz);
  const L = biz[locale];
  const cat = categoryStyle(biz.category);
  const productList = (apiProducts ?? []).map(mapProduct);
  const reviewList: Review[] = (apiReviewsPage?.items ?? []).map(mapReview);

  return (
    <div className="max-w-screen-md mx-auto">
      {/* Hero */}
      <div
        className="relative h-[240px]"
        style={{
          background: biz.photo
            ? `center/cover no-repeat url(${biz.photo})`
            : cat.gradient,
          color: cat.ink,
        }}
      >
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(31,26,21,0.5) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute bottom-4 text-[var(--color-cream-50)]"
          style={{ insetInlineStart: 20, insetInlineEnd: 20 }}
        >
          <div className="flex gap-1.5 mb-2">
            {biz.verified && <Badge kind="verified">★ {tCommon("verified")}</Badge>}
            {biz.luxury && <Badge kind="luxury">{tCommon("luxury")}</Badge>}
          </div>
          <h1 className="font-display font-semibold text-[30px] leading-tight">
            {L.name}
          </h1>
        </div>
      </div>

      {/* Stats — distance/open hidden until backend supports geo + hours. */}
      <div className="flex px-5 py-4 gap-3 border-b border-[var(--border)]">
        <Stat
          value={
            <span className="flex items-center gap-1.5">
              <StarRating rating={biz.rating} size={13} />
              <b className="text-[18px] num">{biz.rating.toFixed(1)}</b>
            </span>
          }
          sub={`${biz.reviews} ${tCommon("reviews")}`}
        />
        {L.neighborhood && (
          <>
            <Divider />
            <Stat
              value={
                <span className="flex items-center gap-1 font-bold text-sm">
                  <Icon name="pin" size={14} className="text-[var(--fg-2)]" />
                  <span>{L.neighborhood}</span>
                </span>
              }
              sub=""
            />
          </>
        )}
      </div>

      <BusinessTabs
        menuLabel={`${tBiz("menu")} · ${productList.length}`}
        reviewsLabel={`${tBiz("reviews_tab")} · ${biz.reviews}`}
        aboutLabel={tBiz("about")}
        menu={
          <div className="grid grid-cols-2 gap-3 p-5">
            {productList.length === 0 && (
              <div className="col-span-full text-center text-[var(--fg-3)] py-6">
                {tBiz("no_products")}
              </div>
            )}
            {productList.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                vendor={biz}
                locale={locale}
              />
            ))}
          </div>
        }
        reviews={
          reviewList.length > 0 ? (
            <div className="px-5 py-4 flex flex-col gap-3">
              <h3 className="font-display text-xl font-semibold">
                {tBiz("reviews_tab")}
              </h3>
              {reviewList.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  locale={locale}
                  tVerified={tCommon("verified")}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-[var(--fg-3)]">
              {tBiz("reviews_tab")} · 0
            </div>
          )
        }
        about={
          <div className="px-5 py-4 text-sm leading-relaxed text-[var(--fg-1)]">
            {L.tagline ? `${L.tagline}. ` : ""}
            {tBiz("about_blurb")}
          </div>
        }
      />

      {/* Sticky action bar */}
      <div className="sticky bottom-16 md:bottom-0 bg-[var(--bg)]/95 backdrop-blur border-t border-[var(--border)] px-5 py-3 flex gap-2.5">
        <Link
          href={`/compare?vendorId=${biz.id}`}
          className="flex-1"
        >
          <Button kind="secondary" full icon="chart">
            {tBiz("compare")}
          </Button>
        </Link>
        <Button kind="primary" full icon="bag">
          {tBiz("order_now")}
        </Button>
      </div>
    </div>
  );
}

function Stat({
  value,
  sub,
}: {
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="flex-1">
      <div>{value}</div>
      <div className="text-[11.5px] text-[var(--fg-3)] mt-1">{sub}</div>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-[var(--border)]" />;
}

function ReviewCard({
  review,
  locale,
  tVerified,
}: {
  review: Review;
  locale: Locale;
  tVerified: string;
}) {
  const body = locale === "ar" ? review.ar : review.en;
  return (
    <div className="bg-white rounded-[var(--radius-md)] p-4 border border-[var(--border)]">
      <div className="flex items-center gap-2.5">
        <span
          className="w-8 h-8 rounded-full grid place-items-center font-bold text-[13px] text-[var(--color-cream-50)]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-terracotta-300), var(--color-gold-300))",
          }}
        >
          {review.initial}
        </span>
        <div className="flex-1">
          <div className="font-bold text-[13px]">{review.author}</div>
          <div className="text-[11.5px] text-[var(--fg-3)]">
            {review.when}
            {review.verified && ` · ${tVerified}`}
          </div>
        </div>
        <StarRating rating={review.rating} size={12} />
      </div>
      <div className="text-sm mt-2 leading-relaxed">{body}</div>
    </div>
  );
}
