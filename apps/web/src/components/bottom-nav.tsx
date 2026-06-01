"use client";

/* Verida — mobile bottom navigation (lg:hidden)
 * Items: home / compare / discover / cart (+badge) / account. Active state from
 * the current pathname; cart count from the cart context. RTL-safe (a flex row
 * that mirrors under dir="rtl"); iOS safe-area padding at the bottom.
 * Deps: next-intl, next/navigation, lucide-react, @/lib/cart-context.
 */

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Home, Scale, Store, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function BottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const p = (path: string) => `/${locale}${path}`;

  const items = [
    { href: p("/"), label: t("home"), Icon: Home },
    { href: p("/catalog"), label: t("compare"), Icon: Scale },
    { href: p("/search"), label: t("discover"), Icon: Store },
    { href: p("/cart"), label: t("cart"), Icon: ShoppingCart, badge: totalItems },
    { href: p("/account"), label: t("account"), Icon: User },
  ];

  const isActive = (href: string) =>
    href === p("/") ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      aria-label={t("primary")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ href, label, Icon, badge }) => {
          const active = isActive(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-2 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {badge && badge > 0 ? (
                    <span className="nums-tabular absolute -top-1 -end-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
