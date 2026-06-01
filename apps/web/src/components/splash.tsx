"use client";

/* Verida — splash / brand intro
 * Wordmark reveal + language choice (AR default, EN one tap). Fades, never
 * slides text (BRAND motion); honours prefers-reduced-motion. RTL-safe.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export function Splash() {
  const reduce = useReducedMotion();
  const t = useTranslations("Splash");
  const router = useRouter();
  const go = (loc: "ar" | "en") => router.push(`/${loc}`);

  const reveal = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: EASE },
        };

  return (
    <div className="grid min-h-[calc(100svh-4rem)] place-items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <motion.div {...reveal(0)}>
          <Logo height={46} bilingual />
        </motion.div>

        <motion.p className="mt-6 text-base text-muted-foreground" {...reveal(reduce ? 0 : 0.2)}>
          {t("tagline")}
        </motion.p>

        <motion.div className="mt-10 w-full" {...reveal(reduce ? 0 : 0.4)}>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-subtle-foreground">
            {t("choose_language")}
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={() => go("ar")}>
              {t("lang_ar")}
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={() => go("en")}>
              {t("lang_en")}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
