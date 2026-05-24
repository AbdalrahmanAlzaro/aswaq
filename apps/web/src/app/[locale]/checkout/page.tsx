import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/api";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);
  // Totals are computed from the client cart; the server page just renders
  // the form (which reads the cart context).
  return (
    <div className="max-w-screen-md mx-auto pb-32 px-5 pt-4">
      <CheckoutForm locale={locale} />
    </div>
  );
}
