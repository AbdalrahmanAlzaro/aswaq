import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/api";
import { CartView } from "@/components/cart-view";

export const dynamic = "force-dynamic";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);
  // Cart is client-side (React context backed by localStorage) — there is no
  // server cart API. The server page just sets up the locale and renders the
  // client view.
  return <CartView locale={locale} />;
}
