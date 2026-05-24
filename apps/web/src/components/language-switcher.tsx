"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const current = (params.locale as "en" | "ar") ?? "en";

  function setLocale(locale: "en" | "ar") {
    if (locale === current) return;
    startTransition(() => {
      router.replace(
        // pathname is locale-agnostic via createNavigation
        pathname,
        { locale },
      );
    });
  }

  return (
    <div
      className="inline-flex items-center bg-[var(--surface-alt)] rounded-full p-0.5 text-[12px] font-semibold"
      data-pending={isPending ? "true" : undefined}
    >
      <button
        type="button"
        className={[
          "px-2.5 py-1 rounded-full cursor-pointer",
          current === "en" ? "bg-white text-[var(--fg-1)] shadow-sm" : "text-[var(--fg-2)]",
        ].join(" ")}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={[
          "px-2.5 py-1 rounded-full cursor-pointer",
          current === "ar" ? "bg-white text-[var(--fg-1)] shadow-sm" : "text-[var(--fg-2)]",
        ].join(" ")}
        onClick={() => setLocale("ar")}
      >
        ع
      </button>
    </div>
  );
}
