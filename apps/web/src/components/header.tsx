import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import { Icon } from "./ui/icon";
import type { Locale } from "@/lib/api";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations("Nav");
  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)] border-b border-[var(--border)] h-[72px] flex items-center px-5 md:px-8">
      <Link href="/" className="flex items-center">
        <Logo height={28} locale={locale} />
      </Link>
      <nav className="hidden md:flex items-center gap-6 ms-10 text-sm font-semibold text-[var(--fg-2)]">
        <Link href="/" className="hover:text-[var(--fg-1)]">{t("home")}</Link>
        <Link href="/search" className="hover:text-[var(--fg-1)]">{t("search")}</Link>
        <Link href="/favourites" className="hover:text-[var(--fg-1)]">{t("favourites")}</Link>
        <Link href="/orders" className="hover:text-[var(--fg-1)]">{t("orders")}</Link>
      </nav>
      <div className="ms-auto flex items-center gap-2">
        <Link
          href="/cart"
          aria-label={t("cart")}
          className="w-10 h-10 grid place-items-center rounded-full hover:bg-[var(--surface-alt)] text-[var(--fg-1)]"
        >
          <Icon name="cart" size={20} />
        </Link>
        <Link
          href="/account"
          aria-label={t("account")}
          className="w-10 h-10 grid place-items-center rounded-full hover:bg-[var(--surface-alt)] text-[var(--fg-1)]"
        >
          <Icon name="user" size={20} />
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
