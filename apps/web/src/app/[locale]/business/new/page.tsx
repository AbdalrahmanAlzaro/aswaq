import { setRequestLocale } from "next-intl/server";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiCategory,
  type ApiCity,
  type Locale,
} from "@/lib/api";
import { BusinessForm } from "@/components/business-form";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  // Curated reference data fetched server-side; the form itself is a client
  // component (city → dependent area dropdown).
  const [cities, categories] = await Promise.all([
    serverFetchOrNull<ApiCity[]>("/cities").then((v) => v ?? []),
    serverFetchOrNull<ApiCategory[]>("/categories").then((v) => v ?? []),
  ]);

  return (
    <div className="max-w-md mx-auto px-5 pt-4 pb-12">
      <BusinessForm
        mode="new"
        locale={locale}
        cities={cities}
        categories={categories}
      />
    </div>
  );
}
