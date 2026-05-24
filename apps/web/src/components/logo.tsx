/**
 * Aswaq wordmark — arched-doorway concept placeholder. The brand team will
 * refine the real wordmark; the arch motif stays.
 */
export function Logo({
  height = 26,
  locale = "en",
}: {
  height?: number;
  locale?: "en" | "ar";
}) {
  if (locale === "ar") {
    return (
      <svg
        viewBox="0 0 120 32"
        height={height}
        fill="none"
        aria-label="أسواق"
      >
        <path
          d="M6 28 L6 16 A14 14 0 0 1 34 16 L34 28"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="44"
          y="24"
          fontFamily="var(--font-stack-arabic-display)"
          fontSize="22"
          fontWeight="700"
          fill="var(--color-charcoal-600)"
        >
          أسواق
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 140 32" height={height} fill="none" aria-label="Aswaq">
      <path
        d="M6 28 L6 16 A14 14 0 0 1 34 16 L34 28"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="42"
        y="24"
        fontFamily="var(--font-stack-display)"
        fontSize="22"
        fontWeight="800"
        letterSpacing="0.04em"
        fill="var(--color-charcoal-600)"
      >
        ASWAQ
      </text>
    </svg>
  );
}
