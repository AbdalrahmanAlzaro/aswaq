import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import type { Locale } from "@/lib/api";

export const dynamic = "force-dynamic";

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
    <div className="max-w-md mx-auto px-6 pt-6 pb-16 bg-[var(--bg-raised)] min-h-[calc(100vh-72px)]">
      <div className="text-center py-3">
        <Logo height={48} locale={locale} />
      </div>
      <div className="eyebrow text-center mt-2">
        {isLogin ? t("welcome_back") : t("join")}
      </div>
      <h1 className="font-display font-semibold text-[28px] text-center mt-1 leading-tight">
        {isLogin ? t("sign_in_title") : t("create_title")}
      </h1>
      <AuthForm mode={isLogin ? "login" : "register"} />
    </div>
  );
}
