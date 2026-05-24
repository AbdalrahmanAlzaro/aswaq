"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Api,
  type ApiArea,
  type ApiBusiness,
  type ApiCategory,
  type ApiCity,
  type Locale,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

interface BusinessFormProps {
  mode: "new" | "edit";
  locale: Locale;
  cities: ApiCity[];
  categories: ApiCategory[];
  // For edit mode: prefill values + areas for the currently-selected city.
  initial?: ApiBusiness;
  initialAreas?: ApiArea[];
}

/**
 * Owner / admin form for creating or editing a business. The city + area
 * selectors are dependent dropdowns backed by the curated reference tables
 * (GET /cities, GET /cities/:id/areas).
 */
export function BusinessForm({
  mode,
  locale,
  cities,
  categories,
  initial,
  initialAreas,
}: BusinessFormProps) {
  const t = useTranslations("BusinessForm");
  const router = useRouter();

  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [cityId, setCityId] = useState(initial?.cityId ?? "");
  const [areaId, setAreaId] = useState(initial?.areaId ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [areas, setAreas] = useState<ApiArea[]>(initialAreas ?? []);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Refresh the dependent area list when the city changes.
  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      setAreaId("");
      return;
    }
    let cancelled = false;
    Api.cities
      .areas(cityId)
      .then((next) => {
        if (cancelled) return;
        setAreas(next);
        // If the previously-selected area doesn't belong to the new city,
        // clear it; otherwise keep the existing selection (edit mode case).
        if (!next.find((a) => a.id === areaId)) setAreaId("");
      })
      .catch(() => {
        if (!cancelled) {
          setAreas([]);
          setAreaId("");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      try {
        const body = {
          name: name.trim(),
          categoryId,
          cityId: cityId || undefined,
          areaId: areaId || undefined,
          address: address.trim() || undefined,
          phone: phone.trim() || undefined,
          description: description.trim() || undefined,
        };
        const saved =
          mode === "edit" && initial
            ? await Api.updateBusiness(initial.id, body)
            : await Api.createBusiness(body);
        router.push(`/business/${saved.id}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : t("error"));
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 mt-6">
      <h1 className="font-display font-semibold text-2xl">
        {mode === "edit" ? t("title_edit") : t("title_new")}
      </h1>

      <Field
        label={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--fg-2)]">
        {t("category")}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="h-11 px-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white text-[15px] text-[var(--fg-1)] cursor-pointer"
        >
          <option value="" disabled>
            {t("category_placeholder")}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.nameAr : c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--fg-2)]">
        {t("city")}
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="h-11 px-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white text-[15px] text-[var(--fg-1)] cursor-pointer"
        >
          <option value="">{t("city_placeholder")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.nameAr : c.name}
            </option>
          ))}
        </select>
      </label>

      <label
        className={[
          "flex flex-col gap-1.5 text-[13px] font-semibold",
          cityId ? "text-[var(--fg-2)]" : "text-[var(--fg-3)]",
        ].join(" ")}
      >
        {t("area")}
        <select
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          disabled={!cityId}
          className="h-11 px-3 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white text-[15px] text-[var(--fg-1)] cursor-pointer disabled:bg-[var(--bg-raised)] disabled:cursor-not-allowed"
        >
          <option value="">
            {cityId ? t("area_placeholder") : t("area_disabled")}
          </option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {locale === "ar" ? a.nameAr : a.name}
            </option>
          ))}
        </select>
      </label>

      <Field
        label={t("address")}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Field
        label={t("phone")}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-[var(--fg-2)]">
        {t("description")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="px-3 py-2 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-white text-[15px] text-[var(--fg-1)] leading-relaxed resize-y"
        />
      </label>

      {error && (
        <div className="text-[var(--danger)] text-sm">{error}</div>
      )}

      <div className="mt-2">
        <Button kind="primary" full size="lg" type="submit" disabled={pending}>
          {pending
            ? t("saving")
            : mode === "edit"
              ? t("save_edit")
              : t("save_new")}
        </Button>
      </div>
    </form>
  );
}
