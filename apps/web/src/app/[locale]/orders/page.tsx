import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  type ApiBusiness,
  type ApiOrder,
  type Business,
  type Locale,
  type Order,
  type Paginated,
  mapBusiness,
  mapOrder,
} from "@/lib/api";
import { serverFetchOrNull } from "@/lib/server-api";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<
  Order["status"],
  {
    key:
      | "status_preparing"
      | "status_delivered"
      | "status_cancelled"
      | "status_confirmed";
    kind: "open" | "verified" | "closed";
  }
> = {
  preparing: { key: "status_preparing", kind: "open" },
  delivered: { key: "status_delivered", kind: "verified" },
  cancelled: { key: "status_cancelled", kind: "closed" },
  confirmed: { key: "status_confirmed", kind: "open" },
};

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Orders");

  // Shoppers see only their own orders (the API enforces this via JWT role).
  const page = await serverFetchOrNull<Paginated<ApiOrder>>("/orders", {
    query: { perPage: 50 },
  });
  const orders: Order[] = (page?.items ?? []).map(mapOrder);

  // Look up business cards for the orders we just fetched.
  const vendorIds = Array.from(new Set(orders.map((o) => o.vendorId)));
  const vendors = (
    await Promise.all(
      vendorIds.map((vid) =>
        serverFetchOrNull<ApiBusiness>(`/businesses/${vid}`),
      ),
    )
  )
    .filter((v): v is ApiBusiness => !!v)
    .map(mapBusiness);
  const vendorMap = new Map<string, Business>(vendors.map((v) => [v.id, v]));

  return (
    <div className="max-w-screen-md mx-auto px-5 pt-4">
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-display font-semibold text-3xl mt-1">
        {t("title")}
      </h1>

      {orders.length === 0 ? (
        <div className="mt-6 text-center text-[var(--fg-3)]">
          <div className="font-display text-xl text-[var(--fg-1)]">
            {t("empty_title")}
          </div>
          <p className="text-sm mt-1.5">{t("empty_sub")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 mt-5">
          {orders.map((o) => {
            const v = vendorMap.get(o.vendorId);
            const badge = STATUS_BADGE[o.status];
            return (
              <div
                key={o.id}
                className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-xs)] p-4 flex items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-[var(--radius-md)] flex-none"
                  style={{
                    background: v?.photo
                      ? `center/cover no-repeat url(${v.photo})`
                      : "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-400))",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-sm truncate">
                      {v?.[locale].name ?? o.vendorId}
                    </div>
                    <Price
                      value={o.total.toFixed(2)}
                      locale={locale}
                      className="text-sm"
                    />
                  </div>
                  <div className="text-[11.5px] text-[var(--fg-3)] mt-0.5 num">
                    #{o.id.slice(0, 8)} · {o.date}
                  </div>
                  <div className="mt-2">
                    <Badge kind={badge.kind}>{t(badge.key)}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
