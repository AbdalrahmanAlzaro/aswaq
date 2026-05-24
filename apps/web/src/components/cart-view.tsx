"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  canCheckout,
  groupByVendor,
  DELIVERY_FEE_PER_SHOP_JD,
  SHOP_MINIMUM_JD,
  type Locale,
} from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/ui/price";
import { CartQtyStepper } from "@/components/cart-qty-stepper";
import { formatPrice } from "@/lib/format";

export function CartView({ locale }: { locale: Locale }) {
  const t = useTranslations("Cart");
  const { lines } = useCart();

  if (lines.length === 0) return <EmptyCart />;

  const groups = groupByVendor(lines);
  const vendorIds = Object.keys(groups);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const fee = vendorIds.length * DELIVERY_FEE_PER_SHOP_JD;
  const total = subtotal + fee;
  const canPay = canCheckout(lines);

  return (
    <div className="max-w-screen-md mx-auto pb-48">
      <section className="px-5 pt-4">
        <h1 className="font-display font-semibold text-2xl">{t("title")}</h1>
      </section>

      <div className="px-5 pt-4 flex flex-col gap-4">
        {vendorIds.map((vid) => {
          const group = groups[vid];
          const need = group.needed;
          // Vendor name is snapshotted onto the cart line at add-to-cart time
          // (CartContext.addItem). Fall back to a translated placeholder for
          // pre-snapshot lines persisted in localStorage.
          const vendorLabel =
            group.vendorName ?? t("shop_label", { id: vid.slice(0, 8) });
          return (
            <div
              key={vid}
              className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-xs)]"
            >
              <div className="px-4 py-3.5 flex items-center gap-3 border-b border-[var(--border)]">
                <div
                  className="w-9 h-9 rounded-[10px] flex-none"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-400))",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{vendorLabel}</div>
                </div>
                <Icon name="chev" size={16} className="text-[var(--fg-3)]" flip />
              </div>

              {group.lines.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]"
                >
                  <div
                    className="w-14 h-14 rounded-[var(--radius-md)] flex-none"
                    style={{
                      background: product.photo
                        ? `center/cover no-repeat url(${product.photo})`
                        : "var(--color-cream-200)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold leading-snug">
                      {product[locale].name}
                    </div>
                    <Price
                      value={product.price}
                      locale={locale}
                      className="text-[13px] mt-1 inline-block"
                    />
                  </div>
                  <CartQtyStepper initialQty={qty} productId={product.id} />
                </div>
              ))}

              <div className="px-4 py-3 flex justify-between items-center bg-[var(--bg-raised)]">
                <div className="text-xs font-semibold text-[var(--fg-2)]">
                  {t("shop_subtotal")}
                </div>
                <Price
                  value={group.subtotal.toFixed(2)}
                  locale={locale}
                  className="text-[15px]"
                />
              </div>

              {need > 0 && (
                <div className="px-4 py-2.5 flex items-center gap-2.5 bg-[var(--surface-tint)] text-[var(--accent-press)] text-[12.5px]">
                  <Icon name="alert" size={16} stroke={2.2} />
                  <span>
                    {t("minimum_warning", {
                      amount: formatPrice(need.toFixed(2), locale),
                    })}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 bg-[var(--bg)] border-t border-[var(--border)] shadow-[0_-8px_20px_-8px_rgba(31,26,21,0.08)]">
        <div className="max-w-screen-md mx-auto px-5 pt-3.5 pb-6">
          <div className="flex justify-between text-[12.5px] text-[var(--fg-2)]">
            <span>{t("subtotal")}</span>
            <Price value={subtotal.toFixed(2)} locale={locale} className="text-[var(--fg-1)] font-semibold" />
          </div>
          <div className="flex justify-between text-[12.5px] text-[var(--fg-2)] mt-1">
            <span>{t("delivery_shops", { count: vendorIds.length })}</span>
            <Price value={fee.toFixed(2)} locale={locale} className="text-[var(--fg-1)] font-semibold" />
          </div>
          <div className="h-px bg-[var(--border)] my-2.5" />
          <div className="flex justify-between mb-3">
            <span className="font-bold text-sm">{t("total")}</span>
            <Price value={total.toFixed(2)} locale={locale} className="text-xl" />
          </div>
          {canPay ? (
            <Link href="/checkout">
              <Button kind="primary" full size="lg">
                {t("checkout")}
              </Button>
            </Link>
          ) : (
            <Button kind="secondary" full size="lg" disabled>
              {t("checkout_blocked")}
            </Button>
          )}
        </div>
      </div>

      <p className="sr-only">Shop minimum: {SHOP_MINIMUM_JD} JD per shop.</p>
    </div>
  );
}

function EmptyCart() {
  const t = useTranslations("Cart");
  return (
    <div className="max-w-screen-md mx-auto px-5 pt-8">
      <div className="mt-6 px-6 py-8 text-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-white">
        <div className="w-14 h-14 rounded-full bg-[var(--bg-sunken)] mx-auto mb-3 grid place-items-center">
          <Icon name="bag" size={24} className="text-[var(--fg-3)]" />
        </div>
        <h2 className="font-display text-xl font-semibold">{t("empty_title")}</h2>
        <p className="text-[13px] text-[var(--fg-2)] mt-1.5">{t("empty_sub")}</p>
        <div className="mt-4">
          <Link href="/">
            <Button kind="primary">{t("browse_cta")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
