import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { serverFetchOrNull } from "@/lib/server-api";
import {
  type ApiArea,
  type ApiBusiness,
  type ApiCategory,
  type ApiCity,
  type Locale,
} from "@/lib/api";
import { BusinessForm } from "@/components/business-form";

export const dynamic = "force-dynamic";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeRaw, id } = await params;
  const locale = localeRaw as Locale;
  setRequestLocale(locale);

  // Fetch the business + reference data in parallel; pre-fetch the areas
  // for the business's current city so the form hydrates with the right
  // dependent options on first paint.
  const [business, cities, categories] = await Promise.all([
    serverFetchOrNull<ApiBusiness>(`/businesses/${id}`),
    serverFetchOrNull<ApiCity[]>("/cities").then((v) => v ?? []),
    serverFetchOrNull<ApiCategory[]>("/categories").then((v) => v ?? []),
  ]);
  if (!business) notFound();

  const initialAreas = business.cityId
    ? (await serverFetchOrNull<ApiArea[]>(`/cities/${business.cityId}/areas`)) ?? []
    : [];

  return (
    <div className="max-w-md mx-auto px-5 pt-4 pb-12">
      <BusinessForm
        mode="edit"
        locale={locale}
        cities={cities}
        categories={categories}
        initial={business}
        initialAreas={initialAreas}
      />
    </div>
  );
}
