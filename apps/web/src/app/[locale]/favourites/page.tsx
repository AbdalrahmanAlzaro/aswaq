import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  type ApiBusiness,
  type ApiFavorite,
  type Locale,
  mapBusiness,
} from "@/lib/api";
import { serverFetchOrNull } from "@/lib/server-api";
import { BusinessCard } from "@/components/business-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

export default async function FavouritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("Favourites");
  const tCommon = await getTranslations("Common");

  // Backend exposes favorites only for businesses (not products). The list
  // endpoint embeds the parent business.
  const favs = (await serverFetchOrNull<ApiFavorite[]>("/favorites")) ?? [];
  const businesses = favs
    .map((f) => f.business)
    .filter((b): b is ApiBusiness => !!b)
    .map(mapBusiness);

  const badgeT = {
    verified: tCommon("verified"),
    luxury: tCommon("luxury"),
    open: tCommon("open"),
    closed: tCommon("closed"),
  };

  return (
    <div className="max-w-screen-md mx-auto px-5 pt-4">
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-display font-semibold text-3xl mt-1">
        {t("title")}
      </h1>

      {businesses.length === 0 ? (
        <div className="mt-6 mx-auto max-w-md px-6 py-8 text-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-white">
          <div className="w-14 h-14 rounded-full bg-[var(--bg-sunken)] mx-auto mb-3 grid place-items-center">
            <Icon name="heart" size={24} className="text-[var(--fg-3)]" />
          </div>
          <h2 className="font-display text-xl font-semibold">{t("empty_title")}</h2>
          <p className="text-sm text-[var(--fg-2)] mt-1.5">{t("empty_sub")}</p>
          <div className="mt-4">
            <Link href="/">
              <Button kind="primary">{t("browse_cta")}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="eyebrow mb-3">
            {t("tab_businesses")} · {businesses.length}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {businesses.map((b) => (
              <BusinessCard
                key={b.id}
                biz={b}
                locale={locale}
                saved
                t={badgeT}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
