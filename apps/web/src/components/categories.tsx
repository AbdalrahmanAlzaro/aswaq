"use client";

import { useTranslations } from "next-intl";
import { Chip, ChipRow } from "@/components/ui/chip";
import { useRouter } from "@/i18n/navigation";
import type { ApiCategory, Locale } from "@/lib/api";
import { ALL_SLUG } from "@/lib/categories";

export function Categories({
  categories,
  selectedSlug = ALL_SLUG,
  locale,
}: {
  categories: ApiCategory[];
  selectedSlug?: string;
  locale: Locale;
}) {
  const t = useTranslations("Categories");
  const router = useRouter();

  // "all" pseudo-chip + live API categories. Prefer the translation key if it
  // exists, otherwise fall back to the locale-appropriate API name.
  const items: Array<{ key: string; label: string; isLuxury: boolean }> = [
    { key: ALL_SLUG, label: safeT(t, ALL_SLUG, "All"), isLuxury: false },
    ...categories.map((c) => ({
      key: c.slug,
      label: safeT(t, c.slug, locale === "ar" ? c.nameAr : c.name),
      isLuxury: c.isLuxury,
    })),
  ];

  return (
    <ChipRow>
      {items.map((it) => (
        <Chip
          key={it.key}
          selected={selectedSlug === it.key}
          luxury={it.isLuxury}
          onClick={() => {
            router.push(
              it.key === ALL_SLUG ? "/search" : `/search?category=${it.key}`,
            );
          }}
        >
          {it.label}
        </Chip>
      ))}
    </ChipRow>
  );
}

function safeT(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback: string,
): string {
  try {
    const v = t(key);
    if (typeof v === "string" && v.length > 0 && v !== key) return v;
    return fallback;
  } catch {
    return fallback;
  }
}
