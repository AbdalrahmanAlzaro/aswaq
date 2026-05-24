"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Api,
  DELIVERY_FEE_PER_SHOP_JD,
  groupByVendor,
  type Locale,
} from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { formatPrice } from "@/lib/format";

type Method = "card" | "cliq" | "cash";

export function CheckoutForm({ locale }: { locale: Locale }) {
  const t = useTranslations("Checkout");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const { lines, clear } = useCart();

  const [method, setMethod] = useState<Method>("card");
  const [address] = useState("Jabal Al-Weibdeh, Paris Square");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { subtotal, delivery, service, total, groups } = useMemo(() => {
    const groups = groupByVendor(lines);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const delivery = Object.keys(groups).length * DELIVERY_FEE_PER_SHOP_JD;
    const service = lines.length > 0 ? 0.75 : 0;
    return { subtotal, delivery, service, total: subtotal + delivery + service, groups };
  }, [lines]);

  function place() {
    setError(null);
    start(async () => {
      try {
        // The backend has no cart endpoint and accepts one POST /orders per
        // business. We send one request per vendor group in parallel; the
        // first created order id is used for the confirmation route.
        const vendorIds = Object.keys(groups);
        if (vendorIds.length === 0) {
          setError(t("empty_error"));
          return;
        }
        const created = await Promise.all(
          vendorIds.map((bid) =>
            Api.placeOrder({
              businessId: bid,
              items: groups[bid].lines.map((l) => ({
                productId: l.product.id,
                quantity: l.qty,
              })),
              notes: `payment:${method}; address:${address}`,
            }),
          ),
        );
        clear();
        router.push(`/orders/${created[0].id}/confirmed`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout failed");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="font-display font-semibold text-2xl">{t("title")}</h1>

      <Section title={t("delivery_to")}>
        <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-3.5 flex items-center gap-3">
          <Icon name="pin" size={20} className="text-[var(--accent)]" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">{t("home_label")}</div>
            <div className="text-[12.5px] text-[var(--fg-2)]">{address}</div>
          </div>
          <button
            type="button"
            className="text-[var(--accent)] text-[13px] font-semibold cursor-pointer"
          >
            {tCommon("change")}
          </button>
        </div>
      </Section>

      <Section title={t("payment_method")}>
        <div className="flex flex-col gap-2">
          <PaymentRow
            id="card"
            current={method}
            onSelect={setMethod}
            icon="bag"
            label={t("card")}
            sub={t("card_default")}
          />
          <PaymentRow
            id="cliq"
            current={method}
            onSelect={setMethod}
            icon="globe"
            label={t("cliq")}
            sub={t("cliq_sub")}
          />
          <PaymentRow
            id="cash"
            current={method}
            onSelect={setMethod}
            icon="receipt"
            label={t("cash")}
            sub={t("cash_sub")}
          />
        </div>
      </Section>

      <Section title={t("summary")}>
        <div className="bg-white rounded-[var(--radius-md)] border border-[var(--border)] p-4 flex flex-col gap-2">
          <Line label={t("subtotal")} value={subtotal} locale={locale} />
          <Line label={t("delivery")} value={delivery} locale={locale} />
          <Line label={t("service")} value={service} locale={locale} />
          <div className="h-px bg-[var(--border)]" />
          <Line label={t("total")} value={total} locale={locale} bold />
        </div>
      </Section>

      {error && (
        <div className="rounded-[var(--radius-md)] bg-[var(--danger-soft-bg)] text-[var(--color-pom-700)] text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-screen-md mx-auto px-5 py-3.5">
          <Button
            kind="primary"
            full
            size="lg"
            icon="check"
            disabled={pending || lines.length === 0}
            onClick={place}
          >
            {t("place_order", { total: formatPrice(total.toFixed(2), locale) })}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      {children}
    </div>
  );
}

function PaymentRow({
  id,
  current,
  onSelect,
  icon,
  label,
  sub,
}: {
  id: Method;
  current: Method;
  onSelect: (m: Method) => void;
  icon: "bag" | "globe" | "receipt";
  label: string;
  sub: string;
}) {
  const selected = current === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={[
        "bg-white rounded-[var(--radius-md)] px-4 py-3.5 flex items-center gap-3 cursor-pointer text-start",
        selected
          ? "border-2 border-[var(--accent)] shadow-[0_0_0_3px_var(--surface-tint)]"
          : "border border-[var(--border)]",
      ].join(" ")}
    >
      <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] grid place-items-center">
        <Icon name={icon} size={18} className="text-[var(--fg-1)]" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-sm">{label}</span>
        <span className="block text-xs text-[var(--fg-3)]">{sub}</span>
      </span>
      <span
        className={[
          "w-5 h-5 rounded-full grid place-items-center border-2",
          selected ? "border-[var(--accent)]" : "border-[var(--border-strong)]",
        ].join(" ")}
      >
        {selected && (
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
        )}
      </span>
    </button>
  );
}

function Line({
  label,
  value,
  locale,
  bold,
}: {
  label: string;
  value: number;
  locale: Locale;
  bold?: boolean;
}) {
  return (
    <div
      className={[
        "flex justify-between",
        bold ? "text-base font-extrabold" : "text-[13px] font-medium text-[var(--fg-2)]",
      ].join(" ")}
    >
      <span>{label}</span>
      <Price
        value={value.toFixed(2)}
        locale={locale}
        className={bold ? "text-[var(--fg-1)] text-base" : "text-[var(--fg-1)]"}
      />
    </div>
  );
}
