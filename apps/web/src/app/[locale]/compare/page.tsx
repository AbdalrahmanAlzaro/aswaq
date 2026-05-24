import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  PaywallRequiredError,
  type ApiCompareItem,
  type ApiProduct,
  type Locale,
  type Product,
  mapProduct,
} from "@/lib/api";
import { serverFetch, serverFetchOrNull } from "@/lib/server-api";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { ArchMark } from "@/components/ui/arch-mark";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ vendorId?: string; productIds?: string }>;
}) {
  const { locale: localeRaw } = await params;
  const { vendorId, productIds } = await searchParams;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("Compare");
  const tCommon = await getTranslations("Common");

  // 1) Resolve the candidate product id set. If the caller passed `vendorId`,
  //    we list that vendor's products and pre-pick the first three. Otherwise
  //    the caller must pass `productIds=a,b,c`.
  let pickedIds: string[] = [];
  let candidateProducts: Product[] = [];
  if (productIds) {
    pickedIds = productIds.split(",").filter(Boolean);
  } else if (vendorId) {
    const list =
      (await serverFetchOrNull<ApiProduct[]>("/products", {
        query: { businessId: vendorId },
      })) ?? [];
    candidateProducts = list.map(mapProduct);
    pickedIds = candidateProducts.slice(0, 3).map((p) => p.id);
  }

  // 2) Call GET /products/compare?ids=a,b — surfaces a 402 when any picked
  //    product is luxury and the caller isn't Premium.
  let comparison: ApiCompareItem[] | null = null;
  let paywalled = false;
  try {
    if (pickedIds.length >= 2) {
      comparison = await serverFetch<ApiCompareItem[]>("/products/compare", {
        query: { ids: pickedIds.join(",") },
      });
    }
  } catch (e) {
    if (e instanceof PaywallRequiredError) {
      paywalled = true;
    }
  }

  // 3) Build display rows: prefer the API's marked isCheapest / isTopRated.
  type Row = {
    product: Product;
    vendor: { id: string; name: string; ratingAvg: number } | null;
    isCheapest: boolean;
  };
  const rows: Row[] = comparison
    ? comparison.map((c) => ({
        product: {
          id: c.id,
          vendorId: c.business.id,
          price: c.price,
          en: { name: c.name },
          ar: { name: c.name },
        },
        vendor: {
          id: c.business.id,
          name: c.business.name,
          ratingAvg: c.business.ratingAvg,
        },
        isCheapest: c.isCheapest,
      }))
    : candidateProducts
        .filter((p) => pickedIds.includes(p.id))
        .map((product) => ({ product, vendor: null, isCheapest: false }));

  // Fallback: if the API didn't mark anything (e.g. paywall blur), still
  // highlight the cheapest visible row locally.
  if (!rows.some((r) => r.isCheapest) && rows.length > 0) {
    const min = Math.min(...rows.map((r) => r.product.price));
    for (const r of rows) r.isCheapest = r.product.price === min;
  }

  return (
    <div className="max-w-screen-md mx-auto pb-8 relative">
      <section className="px-5 pt-6">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-display font-semibold text-2xl mt-1">
          {t("title")}
        </h1>
      </section>

      <div
        className={[
          "px-5 mt-5",
          paywalled && "blur-[6px] pointer-events-none select-none",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, rows.length)}, minmax(0, 1fr))`,
          }}
        >
          {rows.map(({ product: p, vendor, isCheapest }) => (
            <div
              key={p.id}
              className="bg-white rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden relative"
              style={{
                boxShadow: isCheapest
                  ? "0 0 0 2px var(--color-olive-300), var(--shadow-sm)"
                  : "var(--shadow-xs)",
              }}
            >
              <div
                className="relative"
                style={{
                  aspectRatio: "1",
                  background: p.photo
                    ? `center/cover no-repeat url(${p.photo})`
                    : "var(--color-cream-200)",
                }}
              >
                {isCheapest && (
                  <span
                    className="absolute top-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-olive-500)] text-[var(--color-cream-50)]"
                    style={{ insetInlineStart: 8 }}
                  >
                    {tCommon("cheapest")}
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="text-[11px] text-[var(--fg-3)] font-medium">
                  {vendor?.name ?? ""}
                </div>
                <div className="text-[12.5px] font-semibold mt-1 line-clamp-2 h-[2.6em]">
                  {p[locale].name}
                </div>
                <Price
                  value={p.price}
                  locale={locale}
                  className={[
                    "text-base mt-1.5 inline-block",
                    isCheapest && "text-[var(--color-olive-700)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-5 bg-white rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden">
          <Row
            label={t("price")}
            values={rows.map((r) => (
              <Price key={r.product.id} value={r.product.price} locale={locale} />
            ))}
            highlight={rows.map((r) => r.isCheapest)}
            cols={rows.length}
          />
          <Row
            label={t("vendor_rating")}
            values={rows.map((r) => (
              <span key={r.product.id} className="num">
                {r.vendor ? `${r.vendor.ratingAvg.toFixed(1)} ★` : "—"}
              </span>
            ))}
            cols={rows.length}
          />
          {/* distance row hidden — no geo yet */}
          <Row
            label={t("available")}
            values={rows.map((r) => <span key={r.product.id}>{t("in_stock")}</span>)}
            cols={rows.length}
            last
          />
        </div>

        <div className="mt-4 mb-8">
          <Button kind="ink" full icon="check">
            {t("pick_cheapest")}
          </Button>
        </div>
      </div>

      {paywalled && <PaywallOverlay />}
    </div>
  );
}

function Row({
  label,
  values,
  highlight = [],
  last,
  cols,
}: {
  label: string;
  values: React.ReactNode[];
  highlight?: boolean[];
  last?: boolean;
  cols: number;
}) {
  return (
    <div
      className={[
        "grid",
        last ? "" : "border-b border-[var(--border)]",
      ].join(" ")}
      style={{ gridTemplateColumns: `100px repeat(${cols}, minmax(0, 1fr))` }}
    >
      <div className="px-3.5 py-3 text-[12px] font-semibold text-[var(--fg-3)] bg-[var(--bg-raised)]">
        {label}
      </div>
      {values.map((v, i) => (
        <div
          key={i}
          className={[
            "px-2.5 py-3 text-[13px] text-center",
            highlight[i]
              ? "font-bold text-[var(--color-olive-700)]"
              : "font-medium text-[var(--fg-1)]",
          ].join(" ")}
        >
          {v}
        </div>
      ))}
    </div>
  );
}

async function PaywallOverlay() {
  const t = await getTranslations("Compare");
  return (
    <div
      className="absolute inset-0 flex items-end z-10"
      style={{
        background:
          "linear-gradient(to bottom, rgba(31,26,21,0.55), rgba(31,26,21,0.85))",
      }}
    >
      <div className="w-full bg-[var(--bg)] rounded-t-[28px] px-6 pt-6 pb-8 shadow-[var(--shadow-xl)]">
        <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-4" />
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--color-charcoal-600)] mx-auto mb-3 grid place-items-center shadow-[0_0_0_4px_var(--color-gold-100),0_0_0_5px_var(--color-gold-300)]">
            <Icon
              name="crown"
              size={26}
              className="text-[var(--color-gold-400)]"
              fill="currentColor"
            />
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--gold-soft-bg)] text-[var(--color-gold-600)] text-[10.5px] font-bold uppercase tracking-[0.14em]">
            Premium
          </span>
          <h2 className="font-display font-semibold text-[22px] leading-tight mt-3 text-[var(--fg-1)]">
            {t("paywall_title")}
          </h2>
          <ArchMark size={28} className="mx-auto mt-2 opacity-80" />
          <p className="text-[13.5px] text-[var(--fg-2)] mt-2 max-w-[280px] mx-auto leading-relaxed">
            {t("paywall_sub")}
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <Link href="/premium">
            <Button kind="gold" full size="lg">
              {t("paywall_cta")}
            </Button>
          </Link>
          <Link href="/">
            <Button kind="ghost" full>
              {t("not_now")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
