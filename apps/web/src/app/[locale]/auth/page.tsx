import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/api";

export const dynamic = "force-dynamic";

/* Verida — auth screen. Split-screen: brand panel + form. The flex row mirrors
 * automatically under dir="rtl" (brand panel moves to the inline-end). The brand
 * panel keeps the #E8F3F0 image-slot placeholder until real art exists. */
export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { locale: localeRaw } = await params;
  const { mode } = await searchParams;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Auth");

  const isLogin = mode !== "register";

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <Logo height={30} locale={locale} inverse />

        <div className="relative z-10 max-w-sm">
          <p className="text-2xl font-semibold leading-snug">{t("brand_tagline")}</p>
        </div>

        {/* #E8F3F0 image-slot placeholder (real photography lands later) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -end-16 h-72 w-72 rounded-3xl"
          style={{ background: "#E8F3F0", opacity: 0.12 }}
        />
        <p className="relative z-10 text-sm text-primary-foreground/80">
          {isLogin ? t("welcome_back") : t("join")}
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Wordmark on mobile (brand panel is hidden) */}
          <div className="mb-8 lg:hidden">
            <Logo height={26} locale={locale} />
          </div>
          <AuthForm mode={isLogin ? "login" : "register"} />
        </div>
      </div>
    </div>
  );
}
