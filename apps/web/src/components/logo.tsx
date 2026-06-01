import { cn } from "@/lib/utils";

/* Verida — wordmark
 * Wordmark-only (BRAND.md: logo direction not finalised). Latin "Verida" set in
 * Readex Pro 500 with +2% tracking and a dotless "i" whose tittle is a precise
 * teal check — the brand's "verified clarity" signature. Arabic فيريدا is matched
 * with a leading teal check. `bilingual` renders both with a hairline divider.
 * Scales with `height` (px → font-size). API: { height?, locale? } + additive
 * { bilingual?, inverse?, className? }.
 */
function Check({
  style,
  className,
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M4 13l5 5L20 6" />
    </svg>
  );
}

function LatinMark({ height, inverse }: { height: number; inverse: boolean }) {
  return (
    <span
      className="inline-flex items-baseline leading-none"
      style={{
        fontSize: height,
        fontWeight: 500,
        letterSpacing: "0.02em",
        color: inverse ? "#ffffff" : "var(--color-foreground)",
      }}
      aria-label="Verida"
    >
      <span aria-hidden="true">Ver</span>
      <span aria-hidden="true" className="relative inline-block">
        {/* dotless i — its tittle is replaced by the check below */}
        {"ı"}
        <Check
          className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2"
          style={{
            top: "0.04em",
            width: "0.34em",
            height: "0.34em",
            color: inverse ? "#ffffff" : "var(--color-primary)",
          }}
        />
      </span>
      <span aria-hidden="true">da</span>
    </span>
  );
}

function ArabicMark({ height, inverse }: { height: number; inverse: boolean }) {
  return (
    <span
      className="inline-flex items-center leading-none"
      style={{ fontSize: height, fontWeight: 600, gap: "0.18em" }}
      aria-label="فيريدا"
    >
      <Check
        style={{
          width: "0.5em",
          height: "0.5em",
          color: inverse ? "#ffffff" : "var(--color-primary)",
        }}
      />
      <span
        aria-hidden="true"
        style={{ color: inverse ? "#ffffff" : "var(--color-foreground)" }}
      >
        فيريدا
      </span>
    </span>
  );
}

export function Logo({
  height = 26,
  locale = "en",
  bilingual = false,
  inverse = false,
  className,
}: {
  height?: number;
  locale?: "en" | "ar";
  bilingual?: boolean;
  inverse?: boolean;
  className?: string;
}) {
  if (bilingual) {
    return (
      <span className={cn("inline-flex items-center gap-3", className)}>
        <LatinMark height={height} inverse={inverse} />
        <span
          aria-hidden="true"
          className="w-px self-stretch bg-border"
          style={{ opacity: inverse ? 0.5 : 1 }}
        />
        <ArabicMark height={height} inverse={inverse} />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center", className)}>
      {locale === "ar" ? (
        <ArabicMark height={height} inverse={inverse} />
      ) : (
        <LatinMark height={height} inverse={inverse} />
      )}
    </span>
  );
}
