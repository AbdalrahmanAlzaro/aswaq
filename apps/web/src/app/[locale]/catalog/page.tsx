import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiCatalogListItem,
  type Locale,
  type Paginated,
} from "@/lib/api";
import { SearchBar } from "@/components/search-bar";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const { locale: localeRaw } = await params;
  const { q, city } = await searchParams;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("Catalog");
  const tCommon = await getTranslations("Common");

  // GET /catalog returns paginated items with MIN(price) + seller count.
  const page = await serverFetchOrNull<Paginated<ApiCatalogListItem>>(
    "/catalog",
    {
      query: {
        search: q,
        city,
        perPage: 40,
      },
    },
  );
  const items = page?.items ?? [];

  return (
    <div className="max-w-screen-md mx-auto pt-4 pb-8">
      <section className="px-5">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-display font-semibold text-2xl mt-1">
          {t("title")}
        </h1>
      </section>

      <div className="mt-3">
        <SearchBar placeholder={t("search_placeholder")} basePath="/catalog" />
      </div>

      <div className="px-5 mt-3 text-[13px] text-[var(--fg-2)]">
        <b className="text-[var(--fg-1)] num">{items.length}</b>{" "}
        {tCommon("results")}
      </div>

      {items.length === 0 ? (
        <div className="text-center px-6 py-12 text-[var(--fg-3)]">
          <div className="font-display text-xl text-[var(--fg-1)] mb-1.5">
            {t("empty_title")}
          </div>
          <div className="text-[13px]">{t("empty_sub")}</div>
        </div>
      ) : (
        <div className="px-5 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((it) => {
            const display = locale === "ar" ? it.nameAr ?? it.name : it.name;
            return (
              <Link
                key={it.id}
                href={`/catalog/${it.id}`}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-shadow overflow-hidden flex"
              >
                <div
                  className="w-24 grid place-items-center flex-none bg-[var(--color-cream-200)]"
                  style={{
                    aspectRatio: "1",
                    background: it.imageUrl
                      ? `center/cover no-repeat url(${it.imageUrl})`
                      : "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-400))",
                  }}
                >
                  {!it.imageUrl && (
                    <Icon name="bag" size={32} stroke={1.4} className="text-[var(--fg-3)]" />
                  )}
                </div>
                <div className="flex-1 px-4 py-3 min-w-0">
                  <div className="font-semibold text-[15px] text-[var(--fg-1)] truncate">
                    {display}
                  </div>
                  <div className="text-[12px] text-[var(--fg-3)] mt-0.5">
                    {[it.unit, it.brand].filter(Boolean).join(" · ")}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    {it.lowestPrice !== null ? (
                      <>
                        <span className="text-[11px] text-[var(--fg-3)]">
                          {t("from_price", { price: it.lowestPrice.toFixed(2) }).split(" ")[0]}
                        </span>
                        <Price
                          value={it.lowestPrice.toFixed(2)}
                          locale={locale}
                          className="text-[15px] text-[var(--color-olive-700)]"
                        />
                      </>
                    ) : (
                      <span className="text-[12px] text-[var(--fg-3)]">{t("no_offers")}</span>
                    )}
                  </div>
                  <div className="text-[11.5px] text-[var(--fg-3)] mt-1">
                    {t("sellers", { count: it.sellerCount })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
