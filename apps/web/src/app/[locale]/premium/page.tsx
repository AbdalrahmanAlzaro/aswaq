import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

export default async function PremiumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Premium");

  const features = [
    { title: t("feature_compare_title"), sub: t("feature_compare_sub") },
    { title: t("feature_delivery_title"), sub: t("feature_delivery_sub") },
    { title: t("feature_early_title"), sub: t("feature_early_sub") },
    { title: t("feature_alerts_title"), sub: t("feature_alerts_sub") },
  ];

  return (
    <div className="max-w-screen-md mx-auto pb-32">
      {/* Hero */}
      <section
        className="relative bg-[var(--color-charcoal-600)] text-[var(--color-cream-50)] px-6 pt-8 pb-10 text-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(201, 150, 51, 0.22), transparent 50%), radial-gradient(circle at 80% 80%, rgba(191, 83, 47, 0.18), transparent 55%)",
        }}
      >
        <div className="w-[72px] h-[72px] rounded-full bg-[var(--gold-soft-bg)] grid place-items-center mx-auto mb-3.5 shadow-[0_0_0_6px_rgba(201,150,51,0.18)]">
          <Icon name="crown" size={32} className="text-[var(--color-gold-500)]" fill="var(--color-gold-400)" />
        </div>
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[rgba(201,150,51,0.18)] text-[var(--color-gold-300)] text-[10.5px] font-bold uppercase tracking-[0.14em]">
          {t("eyebrow")}
        </span>
        <h1 className="font-display font-semibold text-3xl mt-3 leading-tight">
          {t("title")}
        </h1>
        <p className="text-sm mt-2.5 text-[var(--color-cream-200)] max-w-[320px] mx-auto leading-relaxed">
          {t("sub")}
        </p>
      </section>

      {/* Features */}
      <div className="px-5 py-6 flex flex-col gap-3.5">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-xs)] p-4 flex gap-3.5 items-start"
          >
            <span className="w-9 h-9 rounded-[10px] bg-[var(--gold-soft-bg)] text-[var(--color-gold-500)] grid place-items-center flex-none">
              <Icon name="check" size={18} stroke={2.6} className="text-[var(--color-gold-600)]" />
            </span>
            <div>
              <div className="font-bold text-[14.5px]">{f.title}</div>
              <div className="text-[13px] text-[var(--fg-2)] mt-1 leading-snug">
                {f.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="px-5 pb-4">
        <div className="eyebrow mb-2.5">{t("choose_plan")}</div>
        <div className="grid grid-cols-2 gap-2.5">
          <Plan
            period={t("monthly")}
            price="4 JD"
            sub={t("billed_monthly")}
          />
          <Plan
            period={t("yearly")}
            price="36 JD"
            sub={t("save_25")}
            selected
            bestValueLabel={t("best_value")}
          />
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="max-w-screen-md mx-auto px-5 py-3.5">
          <Button kind="gold" full size="lg" icon="crown">
            {t("start_trial")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Plan({
  period,
  price,
  sub,
  selected,
  bestValueLabel,
}: {
  period: string;
  price: string;
  sub: string;
  selected?: boolean;
  bestValueLabel?: string;
}) {
  return (
    <div
      className={[
        "bg-white rounded-[var(--radius-md)] p-4 relative",
        selected
          ? "border-2 border-[var(--accent)] shadow-[0_0_0_3px_var(--surface-tint)]"
          : "border border-[var(--border)]",
      ].join(" ")}
    >
      {selected && bestValueLabel && (
        <span
          className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] text-[10.5px] font-bold"
          style={{ insetInlineEnd: 12 }}
        >
          {bestValueLabel}
        </span>
      )}
      <div className="eyebrow" style={{ fontSize: 10 }}>
        {period}
      </div>
      <div className="font-display font-bold text-[28px] mt-1.5 num">
        {price}
      </div>
      <div className="text-xs text-[var(--fg-3)] mt-0.5">{sub}</div>
    </div>
  );
}
