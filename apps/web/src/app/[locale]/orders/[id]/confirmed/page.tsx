import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ArchMark } from "@/components/ui/arch-mark";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Confirmed");

  return (
    <div className="max-w-screen-md mx-auto px-6 pt-8 pb-16 text-center">
      <div className="w-24 h-24 mx-auto my-5 rounded-full bg-[var(--color-olive-100)] text-[var(--color-olive-700)] grid place-items-center shadow-[0_0_0_8px_var(--bg)]">
        <Icon name="check" size={44} stroke={3} />
      </div>
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-display font-semibold text-3xl leading-tight mt-1.5">
        {t("title")}
      </h1>
      <div className="mt-3 grid place-items-center">
        <ArchMark size={36} />
      </div>
      <p className="text-sm text-[var(--fg-2)] mt-2 max-w-[300px] mx-auto leading-relaxed">
        {t("sub", { id })}
      </p>

      <div className="bg-white border border-[var(--border)] shadow-[var(--shadow-sm)] rounded-[var(--radius-lg)] p-5 mt-6 text-start">
        <div className="flex justify-between items-baseline">
          <div className="font-bold text-sm">{t("order_label", { id })}</div>
          <Badge kind="open">● {t("status_confirmed")}</Badge>
        </div>
        <div className="flex gap-2.5 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded"
              style={{
                background:
                  i < 1 ? "var(--accent)" : "var(--color-cream-300)",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2.5 text-[11px] font-semibold text-[var(--fg-3)]">
          <span style={{ color: "var(--accent)" }}>{t("step_placed")}</span>
          <span>{t("step_preparing")}</span>
          <span>{t("step_out")}</span>
          <span>{t("step_delivered")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <Link href="/orders">
          <Button kind="ink" full size="lg">
            {t("track")}
          </Button>
        </Link>
        <Link href="/">
          <Button kind="ghost" full>
            {t("home")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
