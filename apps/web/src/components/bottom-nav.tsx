"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "./ui/icon";

const ITEMS: { id: string; href: string; icon: IconName; key: "home" | "search" | "favourites" | "cart" | "account" }[] = [
  { id: "home", href: "/", icon: "home", key: "home" },
  { id: "search", href: "/search", icon: "search", key: "search" },
  { id: "favourites", href: "/favourites", icon: "heart", key: "favourites" },
  { id: "cart", href: "/cart", icon: "cart", key: "cart" },
  { id: "account", href: "/account", icon: "user", key: "account" },
];

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--bg)] border-t border-[var(--border)] h-16 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map((it) => {
        const isActive = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.id}
            href={it.href}
            className={[
              "flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold",
              isActive ? "text-[var(--accent)]" : "text-[var(--fg-3)]",
            ].join(" ")}
          >
            <Icon name={it.icon} size={22} fill={isActive ? "currentColor" : "none"} />
            <span>{t(it.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
