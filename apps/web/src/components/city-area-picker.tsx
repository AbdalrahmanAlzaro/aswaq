"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Api, type ApiArea, type ApiCity, type Locale } from "@/lib/api";

/**
 * Search-page filter: city dropdown + dependent area dropdown.
 *
 * Receives the curated city list from the server (one round-trip on first
 * render) and lazily fetches that city's areas on selection. Round-trips both
 * choices through the URL (?cityId, ?areaId) so the server fetch picks them
 * up and Next can stream the new results.
 */
export function CityAreaPicker({
  cities,
  locale,
  selectedCityId,
  selectedAreaId,
  initialAreas,
  cityLabel,
  anyCityLabel,
  areaLabel,
  anyAreaLabel,
  basePath = "/search",
}: {
  cities: ApiCity[];
  locale: Locale;
  selectedCityId?: string;
  selectedAreaId?: string;
  initialAreas?: ApiArea[];
  cityLabel: string;
  anyCityLabel: string;
  areaLabel: string;
  anyAreaLabel: string;
  basePath?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  // Areas state: seeded by the server (when a city was already chosen) and
  // refreshed when the user picks a different city.
  const [areas, setAreas] = useState<ApiArea[]>(initialAreas ?? []);
  const [areasLoading, setAreasLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!selectedCityId) {
      setAreas([]);
      return;
    }
    setAreasLoading(true);
    Api.cities
      .areas(selectedCityId)
      .then((next) => {
        if (!cancelled) setAreas(next);
      })
      .catch(() => {
        if (!cancelled) setAreas([]);
      })
      .finally(() => {
        if (!cancelled) setAreasLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCityId]);

  function pushQuery(cityId: string | undefined, areaId: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (cityId) next.set("cityId", cityId);
    else next.delete("cityId");
    if (areaId) next.set("areaId", areaId);
    else next.delete("areaId");
    const query = next.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  function onCityChange(cityId: string) {
    // Switching city invalidates any previous area selection.
    pushQuery(cityId || undefined, undefined);
  }

  function onAreaChange(areaId: string) {
    pushQuery(selectedCityId, areaId || undefined);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <label className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--fg-2)]">
        {cityLabel}
        <select
          value={selectedCityId ?? ""}
          onChange={(e) => onCityChange(e.target.value)}
          className="h-8 ps-2.5 pe-7 rounded-[8px] border border-[var(--border-strong)] bg-white text-[var(--fg-1)] text-[12px] font-semibold cursor-pointer"
        >
          <option value="">{anyCityLabel}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "ar" ? c.nameAr : c.name}
            </option>
          ))}
        </select>
      </label>
      <label
        className={[
          "inline-flex items-center gap-2 text-[12px] font-semibold",
          selectedCityId ? "text-[var(--fg-2)]" : "text-[var(--fg-3)]",
        ].join(" ")}
      >
        {areaLabel}
        <select
          value={selectedAreaId ?? ""}
          onChange={(e) => onAreaChange(e.target.value)}
          disabled={!selectedCityId || areasLoading}
          className="h-8 ps-2.5 pe-7 rounded-[8px] border border-[var(--border-strong)] bg-white text-[var(--fg-1)] text-[12px] font-semibold cursor-pointer disabled:bg-[var(--bg-raised)] disabled:cursor-not-allowed"
        >
          <option value="">{anyAreaLabel}</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {locale === "ar" ? a.nameAr : a.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
