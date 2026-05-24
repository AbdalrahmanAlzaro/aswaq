import { getTranslations, setRequestLocale } from "next-intl/server";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiArea,
  type ApiBusiness,
  type ApiCategory,
  type ApiCity,
  type Locale,
  type Paginated,
  mapBusiness,
} from "@/lib/api";
import { BusinessCard } from "@/components/business-card";
import { SearchBar } from "@/components/search-bar";
import { Categories } from "@/components/categories";
import { CityAreaPicker } from "@/components/city-area-picker";
import { ALL_SLUG } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    cityId?: string;
    areaId?: string;
  }>;
}) {
  const { locale: localeRaw } = await params;
  const { q, category, cityId, areaId } = await searchParams;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const tSearch = await getTranslations("Search");
  const tCommon = await getTranslations("Common");

  // Pull curated cities + categories on the server; the dependent area list
  // for the currently-selected city is also pre-fetched so the picker hydrates
  // with the right options on first paint.
  const [categories, cities] = await Promise.all([
    serverFetchOrNull<ApiCategory[]>("/categories").then((v) => v ?? []),
    serverFetchOrNull<ApiCity[]>("/cities").then((v) => v ?? []),
  ]);

  // Only forward a cityId / areaId that the API knows about, so a stale URL
  // doesn't silently shrink the result set.
  const safeCityId = cityId && cities.find((c) => c.id === cityId) ? cityId : undefined;
  let initialAreas: ApiArea[] = [];
  let safeAreaId: string | undefined;
  if (safeCityId) {
    initialAreas =
      (await serverFetchOrNull<ApiArea[]>(`/cities/${safeCityId}/areas`)) ?? [];
    safeAreaId = areaId && initialAreas.find((a) => a.id === areaId) ? areaId : undefined;
  }

  const selectedSlug = category ?? ALL_SLUG;
  const selected =
    selectedSlug === ALL_SLUG
      ? null
      : categories.find((c) => c.slug === selectedSlug) ?? null;

  const bizPage = await serverFetchOrNull<Paginated<ApiBusiness>>(
    "/businesses",
    {
      query: {
        search: q,
        categoryId: selected?.id,
        cityId: safeCityId,
        areaId: safeAreaId,
        perPage: 40,
      },
    },
  );
  const businesses = (bizPage?.items ?? []).map(mapBusiness);

  const badgeT = {
    verified: tCommon("verified"),
    luxury: tCommon("luxury"),
    open: tCommon("open"),
    closed: tCommon("closed"),
  };

  return (
    <div className="max-w-screen-md mx-auto pt-3">
      <SearchBar placeholder={tCommon("search_placeholder")} />
      <Categories
        categories={categories}
        locale={locale}
        selectedSlug={selectedSlug}
      />

      <div className="flex items-center justify-between gap-3 px-5 mt-3 mb-2 flex-wrap">
        <div className="text-[13px] text-[var(--fg-2)]">
          <b className="text-[var(--fg-1)] num">{businesses.length}</b>{" "}
          {tCommon("results")}
        </div>
        <CityAreaPicker
          cities={cities}
          locale={locale}
          selectedCityId={safeCityId}
          selectedAreaId={safeAreaId}
          initialAreas={initialAreas}
          cityLabel={tSearch("city")}
          anyCityLabel={tSearch("any_city")}
          areaLabel={tSearch("area")}
          anyAreaLabel={tSearch("any_area")}
        />
      </div>

      {businesses.length === 0 ? (
        <div className="text-center px-6 py-12 text-[var(--fg-3)]">
          <div className="font-display text-xl text-[var(--fg-1)] mb-1.5">
            {tSearch("empty_title")}
          </div>
          <div className="text-[13px]">{tSearch("empty_sub")}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-5">
          {businesses.map((b) => (
            <BusinessCard key={b.id} biz={b} locale={locale} t={badgeT} />
          ))}
        </div>
      )}
    </div>
  );
}
