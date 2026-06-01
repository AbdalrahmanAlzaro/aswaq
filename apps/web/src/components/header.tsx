"use client";

/* Verida — app header (top bar)
 * Adapted from 21st.dev "header-01" (sticky nav + theme toggle), reworked into
 * the Verida commerce shell:
 *   - Brand wordmark; primary nav → /catalog (Compare), /search (Discover),
 *     /business/new (Sell); inline search (GET /search?q=); favourites; cart
 *     (+count from cart context); account menu (logged-in vs logged-out);
 *     language switch (AR/EN) in place of the source's theme toggle (light-only v1).
 *   - RTL-first: logical spacing (ms/me, ps/pe, start/end); directional glyphs
 *     mirror via .flip-rtl. Sticky, drops a hairline + shadow on scroll.
 *   - Accessible: skip link, <header>/<nav> landmarks, aria labels, focus rings.
 *   - Categories mega-menu deferred to Phase 1 (no Radix nav-menu dep pulled).
 * Deps: next-intl, next/link, lucide-react, @/lib/utils, ./language-switcher,
 *   ./account-menu, @/lib/cart-context. i18n: keys under "nav".
 */

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LanguageSwitch } from "./language-switcher";
import { AccountMenu } from "./account-menu";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { totalItems } = useCart();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const p = (path: string) => `/${locale}${path}`;
  const links = [
    { href: p("/catalog"), label: t("compare") },
    { href: p("/search"), label: t("discover") },
    { href: p("/business/new"), label: t("sell") },
  ];

  const searchField = (
    <div className="relative">
      <Search
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="h-10 w-full rounded-md border border-input bg-background pe-3 ps-9 text-sm placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background transition-shadow",
        scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href={p("/")} aria-label={t("home")} className="flex items-center">
          <Logo height={22} locale={locale as "en" | "ar"} />
        </Link>

        <nav aria-label={t("primary")} className="ms-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form action={p("/search")} role="search" className="ms-auto hidden max-w-sm flex-1 lg:block">
          {searchField}
        </form>

        <div className="ms-auto flex items-center gap-1 lg:ms-2">
          <LanguageSwitch />

          <Link
            href={p("/favourites")}
            aria-label={t("favourites")}
            className="hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <Heart className="size-5" aria-hidden="true" />
          </Link>

          <Link
            href={p("/cart")}
            aria-label={t("cart")}
            className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="nums-tabular absolute -top-1 -end-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          <AccountMenu />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t("close") : t("menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
          >
            {open ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <form action={p("/search")} role="search" className="mb-3">
              {searchField}
            </form>
            <nav aria-label={t("primary")} className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
