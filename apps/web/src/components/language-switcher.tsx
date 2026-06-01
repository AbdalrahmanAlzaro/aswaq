"use client";

/* Verida — language switch (Arabic <-> English)
 * Swaps the [locale] segment in the current path; next-intl applies dir/lang on navigation.
 * Uses next/navigation so it works regardless of the project's next-intl router wrapper.
 * (If you use next-intl's localized router, you can swap usePathname/useRouter for its versions.)
 * Path: apps/web/src/components/layout/language-switch.tsx
 */

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const next = locale === "ar" ? "en" : "ar";
  const label = locale === "ar" ? "English" : "العربية";

  const switchLocale = () => {
    const segments = pathname.split("/");
    if (segments[1] === "ar" || segments[1] === "en") {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={`Switch language to ${label}`}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Languages className="size-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
