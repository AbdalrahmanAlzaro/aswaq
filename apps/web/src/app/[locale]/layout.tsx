import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  fontDisplay,
  fontBody,
  fontArabicDisplay,
  fontArabic,
} from "@/app/fonts";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart-context";
import "../globals.css";

export const metadata: Metadata = {
  title: "Aswaq",
  description: "Local price comparison, reviews & marketplace — Jordan",
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

  const fontClasses = [
    fontDisplay.variable,
    fontBody.variable,
    fontArabicDisplay.variable,
    fontArabic.variable,
  ].join(" ");

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${fontClasses} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg-1)]">
        <NextIntlClientProvider>
          <CartProvider>
            <Header locale={locale as "en" | "ar"} />
            <main className="flex-1 pb-20 md:pb-12">{children}</main>
            <BottomNav />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
