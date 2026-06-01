"use client";

/* Verida — Account menu (header)
 * Logged-out: Sign in / Create account links. Logged-in: greeting + account
 * links + Sign out. Adapted from 21st.dev "account-menu" PATTERN but built as a
 * lightweight, dependency-free dropdown (no Radix — only deps already present):
 * click-outside + Escape to close, roving aria, RTL-safe (menu at inline-end).
 */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { User, ChevronDown, LogOut, Store, Heart, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

export function AccountMenu() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const p = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleSignOut = () => {
    signOut();
    close();
    router.push(p("/"));
    router.refresh();
  };

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("account")}
        className="inline-flex items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <User className="size-5" aria-hidden="true" />
        {user && (
          <span className="hidden max-w-24 truncate text-sm font-medium text-foreground lg:inline">
            {user.name?.split(" ")[0] || user.email}
          </span>
        )}
        <ChevronDown className="hidden size-4 lg:inline" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg"
        >
          {user ? (
            <>
              <p className="truncate px-3 py-1.5 text-xs text-muted-foreground">
                {t("greeting", { name: user.name || user.email })}
              </p>
              <Link href={p("/account")} role="menuitem" onClick={close} className={itemClass}>
                <User aria-hidden="true" />
                {t("myAccount")}
              </Link>
              <Link href={p("/orders")} role="menuitem" onClick={close} className={itemClass}>
                <Receipt aria-hidden="true" />
                {t("orders")}
              </Link>
              <Link href={p("/favourites")} role="menuitem" onClick={close} className={itemClass}>
                <Heart aria-hidden="true" />
                {t("saved")}
              </Link>
              {user.role === "shopper" && (
                <Link
                  href={p("/business/new")}
                  role="menuitem"
                  onClick={close}
                  className={itemClass}
                >
                  <Store aria-hidden="true" />
                  {t("becomeSeller")}
                </Link>
              )}
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className={cn(itemClass, "text-destructive [&_svg]:text-destructive")}
              >
                <LogOut aria-hidden="true" />
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href={p("/auth")} role="menuitem" onClick={close} className={itemClass}>
                <User aria-hidden="true" />
                {t("signIn")}
              </Link>
              <Link
                href={p("/auth?mode=register")}
                role="menuitem"
                onClick={close}
                className={cn(itemClass, "font-medium text-primary [&_svg]:text-primary")}
              >
                <Store aria-hidden="true" />
                {t("register")}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
