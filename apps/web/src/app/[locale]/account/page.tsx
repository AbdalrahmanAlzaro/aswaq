import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import { serverFetchOrNull } from "@/lib/server-api";
import type { ApiMe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Account");

  const user = await serverFetchOrNull<ApiMe>("/auth/me");
  const isPremium = !!user?.isPremium;
  const name = user?.name ?? "—";

  const rows: { icon: IconName; key: keyof typeof labels; href?: string }[] = [
    { icon: "receipt", key: "my_orders", href: "/orders" },
    { icon: "heart", key: "saved", href: "/favourites" },
    { icon: "pin", key: "addresses" },
    { icon: "bag", key: "payment_methods" },
    { icon: "store", key: "become_seller" },
    { icon: "globe", key: "language" },
    { icon: "bell", key: "notifications" },
    { icon: "alert", key: "help" },
  ];

  const labels = {
    my_orders: t("my_orders"),
    saved: t("saved"),
    addresses: t("addresses"),
    payment_methods: t("payment_methods"),
    become_seller: t("become_seller"),
    language: t("language"),
    notifications: t("notifications"),
    help: t("help"),
  };

  return (
    <div className="max-w-screen-md mx-auto px-5 pt-4">
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-display font-semibold text-3xl mt-1">
        {t("greeting", { name })}
      </h1>

      <Link
        href="/premium"
        className={[
          "mt-4 p-4 rounded-[var(--radius-lg)] flex items-center gap-3 shadow-[var(--shadow-xs)] border",
          isPremium
            ? "bg-[var(--color-charcoal-600)] text-[var(--color-cream-50)] border-transparent shadow-[var(--shadow-md)]"
            : "bg-white text-[var(--fg-1)] border-[var(--border)]",
        ].join(" ")}
      >
        <span
          className={[
            "w-[42px] h-[42px] rounded-full grid place-items-center flex-none",
            isPremium
              ? "bg-[var(--gold-soft-bg)] text-[var(--color-gold-600)]"
              : "bg-[var(--surface-tint)] text-[var(--accent)]",
          ].join(" ")}
        >
          <Icon name="crown" size={20} fill="currentColor" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">
            {isPremium ? t("premium_active") : t("try_premium")}
          </div>
          <div
            className={[
              "text-xs mt-0.5",
              isPremium ? "text-[var(--color-cream-300)]" : "text-[var(--fg-3)]",
            ].join(" ")}
          >
            {isPremium ? t("premium_active_sub") : t("try_premium_sub")}
          </div>
        </div>
        <Icon
          name="arrow-right"
          size={18}
          flip
          className={
            isPremium
              ? "text-[var(--color-gold-300)]"
              : "text-[var(--fg-3)]"
          }
        />
      </Link>

      <div className="mt-5 flex flex-col">
        {rows.map((r, i) => (
          <AccountRow
            key={r.key}
            icon={r.icon}
            label={labels[r.key]}
            href={r.href}
            divider={i < rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function AccountRow({
  icon,
  label,
  href,
  divider,
}: {
  icon: IconName;
  label: string;
  href?: string;
  divider?: boolean;
}) {
  const content = (
    <div
      className={[
        "flex items-center gap-3.5 py-3.5 px-1 cursor-pointer",
        divider && "border-b border-[var(--border)]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] grid place-items-center">
        <Icon name={icon} size={18} className="text-[var(--fg-1)]" />
      </span>
      <span className="flex-1 font-semibold text-sm">{label}</span>
      <Icon name="chev" size={16} className="text-[var(--fg-3)]" flip />
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
