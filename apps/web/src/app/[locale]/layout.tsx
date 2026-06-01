import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { readex } from "@/app/fonts";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart-context";
import "../globals.css";

export const metadata: Metadata = {
  title: "Verida",
  description:
    "Verida — local price comparison, reviews & marketplace for Jordan.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${readex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <CartProvider>
            <Header />
            {/* pb-16 leaves room for the mobile BottomNav; cleared at lg where it hides */}
            <main id="main" className="flex-1 pb-16 lg:pb-0">
              {children}
            </main>
            <BottomNav />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
