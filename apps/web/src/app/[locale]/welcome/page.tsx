import { setRequestLocale } from "next-intl/server";
import { Splash } from "@/components/splash";

export default async function WelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Splash />;
}
