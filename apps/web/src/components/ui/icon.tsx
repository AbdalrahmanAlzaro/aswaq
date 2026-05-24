import type { SVGProps } from "react";

type IconName =
  | "home"
  | "search"
  | "heart"
  | "cart"
  | "user"
  | "back"
  | "forward"
  | "chev"
  | "close"
  | "plus"
  | "minus"
  | "star"
  | "check"
  | "pin"
  | "clock"
  | "filter"
  | "share"
  | "more"
  | "crown"
  | "bag"
  | "truck"
  | "receipt"
  | "store"
  | "globe"
  | "edit"
  | "trash"
  | "chart"
  | "alert"
  | "bell"
  | "arrow-right"
  | "cat-cafe"
  | "cat-restaurant"
  | "cat-gym"
  | "cat-electronics"
  | "cat-watches"
  | "cat-jewelry";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  heart: (
    <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.3 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9z" />
  ),
  cart: (
    <>
      <path d="M6 6h15l-1.5 9h-12L6 6zM6 6l-1-2H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  back: <path d="M15 6l-6 6 6 6" />,
  forward: <path d="M9 6l6 6-6 6" />,
  chev: <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: <path d="M12 2l3 7h7l-5.5 4 2 8L12 17l-6.5 4 2-8L2 9h7z" />,
  check: <path d="M5 12l5 5 9-10" />,
  pin: (
    <>
      <path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  share: (
    <>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 11l8-4M8 13l8 4" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>
  ),
  crown: <path d="M3 7 L7 11 L12 5 L17 11 L21 7 L19 18 H5 Z" />,
  bag: (
    <>
      <path d="M6 8h12l-1 13H7zM9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  truck: (
    <>
      <path d="M2 7h11v10H2zM13 10h5l3 3v4h-8z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  store: (
    <>
      <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  edit: <path d="M16 3l5 5-12 12H4v-5zM13 6l5 5" />,
  trash: (
    <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
  ),
  chart: <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-7" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16v.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3z" />
      <path d="M9 19a3 3 0 0 0 6 0" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "cat-cafe": (
    <>
      <path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M16 10h2a3 3 0 0 1 0 6h-2" />
      <path d="M7 3v2M10 3v2M13 3v2" />
    </>
  ),
  "cat-restaurant": (
    <>
      <path d="M5 3v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M7 13v8" />
      <path d="M16 3c-2 0-3 2-3 5s1 5 3 5v8" />
    </>
  ),
  "cat-gym": <path d="M3 12h2M19 12h2M7 7v10M17 7v10M7 12h10" />,
  "cat-electronics": (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  "cat-watches": (
    <>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 9v3l2 1" />
      <path d="M9 6V3h6v3M9 18v3h6v-3" />
    </>
  ),
  "cat-jewelry": (
    <>
      <path d="M6 9l3-5h6l3 5-6 11z" />
      <path d="M6 9h12M9 4l3 5 3-5M9 9l3 11M15 9l-3 11" />
    </>
  ),
};

export type { IconName };

export function Icon({
  name,
  size = 22,
  stroke = 2,
  fill = "none",
  flip = false,
  className,
  ...rest
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  fill?: string;
  flip?: boolean;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "fill" | "stroke">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[flip ? "flip-rtl" : "", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

/* Category → glyph + warm tinted gradient (no-photo fallback). */
export const CATEGORY_STYLE: Record<
  string,
  { glyph: IconName; gradient: string; ink: string }
> = {
  cafe: {
    glyph: "cat-cafe",
    gradient: "linear-gradient(135deg, #fbf1ec 0%, #ecb9a1 100%)",
    ink: "var(--color-terracotta-700)",
  },
  restaurant: {
    glyph: "cat-restaurant",
    gradient: "linear-gradient(135deg, #faf3e1 0%, #ebd086 100%)",
    ink: "var(--color-gold-600)",
  },
  gym: {
    glyph: "cat-gym",
    gradient: "linear-gradient(135deg, #e6e7c8 0%, #a8ad62 100%)",
    ink: "var(--color-olive-700)",
  },
  electronics: {
    glyph: "cat-electronics",
    gradient: "linear-gradient(135deg, #d8d2c8 0%, #4a4339 100%)",
    ink: "#fdfbf6",
  },
  watches: {
    glyph: "cat-watches",
    gradient: "linear-gradient(135deg, #f3eada 0%, #756d63 100%)",
    ink: "var(--color-charcoal-700)",
  },
  jewelry: {
    glyph: "cat-jewelry",
    gradient: "linear-gradient(135deg, #f3e3b5 0%, #c99633 100%)",
    ink: "var(--color-charcoal-700)",
  },
};

export function categoryStyle(category: string | undefined) {
  return (category && CATEGORY_STYLE[category]) || CATEGORY_STYLE.cafe;
}
