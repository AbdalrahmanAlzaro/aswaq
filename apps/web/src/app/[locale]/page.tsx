import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiBusiness,
  type ApiCategory,
  type Business,
  type Locale,
  type Paginated,
  mapBusiness,
} from "@/lib/api";
import { ArchMark } from "@/components/ui/arch-mark";
import { BusinessCard } from "@/components/business-card";
import { SearchBar } from "@/components/search-bar";
import { Icon, categoryStyle } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Categories } from "@/components/categories";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const tHome = await getTranslations("Home");
  const tCommon = await getTranslations("Common");

  const [bizPage, categories] = await Promise.all([
    serverFetchOrNull<Paginated<ApiBusiness>>("/businesses", {
      query: { perPage: 20 },
    }),
    serverFetchOrNull<ApiCategory[]>("/categories"),
  ]);

  const businesses: Business[] = (bizPage?.items ?? []).map(mapBusiness);

  const featured = businesses[0];
  const trending = businesses.slice(1, 5);
  const nearMe = businesses.slice(2, 7);

  const badgeT = {
    verified: tCommon("verified"),
    luxury: tCommon("luxury"),
    open: tCommon("open"),
    closed: tCommon("closed"),
  };

  return (
    <div className="max-w-screen-md mx-auto pb-8">
      <section className="px-5 pt-4">
        <div className="eyebrow">{tHome("eyebrow")}</div>
        <h1 className="font-display font-semibold text-3xl md:text-4xl leading-[1.12] tracking-tight mt-1">
          {tHome("greeting_line1")}
          <br />
          <span className="text-[var(--accent)]">{tHome("greeting_line2")}</span>
        </h1>
        <ArchMark size={28} className="mt-2.5 mb-1 opacity-90" />
      </section>

      <div className="mt-3">
        <SearchBar placeholder={tCommon("search_placeholder")} />
      </div>

      <Categories categories={categories ?? []} locale={locale} />

      <SectionTitle title={tHome("featured")} />
      <div className="px-5">
        {featured ? (
          <FeaturedHero biz={featured} locale={locale} />
        ) : (
          <EmptyHero />
        )}
      </div>

      <SectionTitle
        title={tHome("trending")}
        seeAll={tCommon("see_all")}
        seeAllHref="/search"
      />
      <div
        className="flex gap-3 overflow-x-auto px-5 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {trending.map((b) => (
          <div key={b.id} className="w-[220px] flex-none">
            <BusinessCard biz={b} locale={locale} t={badgeT} />
          </div>
        ))}
      </div>

      <SectionTitle title={tHome("near_you")} />
      <div className="flex flex-col gap-2.5 px-5">
        {nearMe.map((b) => (
          <BusinessCard
            key={b.id}
            biz={b}
            locale={locale}
            layout="h"
            t={badgeT}
          />
        ))}
      </div>

      <PremiumStrip
        title={tHome("premium_strip_title")}
        sub={tHome("premium_strip_sub")}
      />
    </div>
  );
}

function SectionTitle({
  title,
  seeAll,
  seeAllHref,
}: {
  title: string;
  seeAll?: string;
  seeAllHref?: string;
}) {
  return (
    <div className="flex items-baseline justify-between px-5 mt-8 mb-3">
      <h2 className="font-display font-semibold text-xl md:text-2xl tracking-tight">
        {title}
      </h2>
      {seeAll && seeAllHref && (
        <Link
          href={seeAllHref}
          className="text-[13px] font-semibold text-[var(--accent)]"
        >
          {seeAll}
        </Link>
      )}
    </div>
  );
}

function FeaturedHero({ biz, locale }: { biz: Business; locale: Locale }) {
  const L = biz[locale];
  const cat = categoryStyle(biz.category);
  const hasPhoto = !!biz.photo;
  return (
    <Link
      href={`/business/${biz.id}`}
      className="relative block rounded-[24px] overflow-hidden h-[220px] shadow-[var(--shadow-md)]"
      style={{
        background: hasPhoto
          ? `center/cover no-repeat url(${biz.photo})`
          : cat.gradient,
        color: cat.ink,
      }}
    >
      {!hasPhoto && (
        <span
          className="absolute top-4 opacity-60 grid place-items-center"
          style={{ insetInlineEnd: 18, color: cat.ink }}
        >
          <Icon name={cat.glyph} size={64} stroke={1.2} />
        </span>
      )}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(31,26,21,0.7) 0%, rgba(31,26,21,0.12) 50%, transparent 100%)",
        }}
      />
      {biz.verified && (
        <div
          className="absolute top-3.5 flex gap-1.5"
          style={{ insetInlineStart: 14 }}
        >
          <Badge kind="verified">★</Badge>
        </div>
      )}
      <div
        className="absolute bottom-4 text-[var(--color-cream-50)]"
        style={{ insetInlineStart: 18, insetInlineEnd: 18 }}
      >
        {L.neighborhood && (
          <div className="eyebrow text-[var(--color-cream-100)]/90">
            {L.neighborhood}
          </div>
        )}
        <div className="font-display font-semibold text-[26px] leading-tight mt-1">
          {L.name}
        </div>
        {L.tagline && (
          <div className="text-[13px] mt-1.5 opacity-90">{L.tagline}</div>
        )}
      </div>
    </Link>
  );
}

function EmptyHero() {
  return (
    <div
      className="rounded-[24px] h-[220px] grid place-items-center text-[var(--fg-3)] text-sm border border-dashed border-[var(--border-strong)]"
      style={{ background: "var(--surface-alt)" }}
    >
      —
    </div>
  );
}

function PremiumStrip({ title, sub }: { title: string; sub: string }) {
  return (
    <Link
      href="/premium"
      className="mx-5 my-6 p-4 rounded-[var(--radius-lg)] bg-[var(--color-charcoal-600)] text-[var(--color-cream-50)] flex items-center gap-3.5 shadow-[var(--shadow-md)]"
    >
      <span className="w-10 h-10 rounded-full bg-[var(--gold-soft-bg)] text-[var(--color-gold-500)] grid place-items-center flex-none">
        <Icon name="crown" size={20} fill="currentColor" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-[var(--color-cream-300)] mt-0.5">{sub}</div>
      </div>
      <Icon
        name="arrow-right"
        size={18}
        className="text-[var(--color-gold-300)]"
        flip
      />
    </Link>
  );
}
