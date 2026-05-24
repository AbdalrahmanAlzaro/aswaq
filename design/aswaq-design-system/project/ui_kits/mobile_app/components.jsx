// Aswaq mobile UI kit · shared components
// Exposes globals: Header, BottomNav, BusinessCard, ProductCard, StarRating,
// Badge, Heart, Button, Chip, ChipRow, SearchBar, Sheet, Modal, Icon

const { useState, useEffect, useRef } = React;

// ─── i18n helper ──────────────────────────────────────────────
window.t = function t(en, ar, lang) {
  return lang === "ar" ? ar : en;
};
const t = window.t;

// Format a price for either language. Currency symbol localised, digits
// Western (0–9) in both languages per brand spec.
window.fmtPrice = function fmtPrice(value, lang, opts = {}) {
  const num = typeof value === "number" ? (opts.decimals ? value.toFixed(opts.decimals) : String(value)) : String(value);
  const sym = lang === "ar" ? "د.أ" : "JD";
  return num + " " + sym;
};
const fmtPrice = window.fmtPrice;

// ─── Icon (Lucide-style inline SVGs we control) ───────────────
const ICONS = {
  home: <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  heart: <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.3 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9z"/>,
  cart: <><path d="M6 6h15l-1.5 9h-12L6 6zM6 6l-1-2H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  back: <path d="M15 6l-6 6 6 6"/>,
  forward: <path d="M9 6l6 6-6 6"/>,
  chev: <path d="M9 6l6 6-6 6"/>,
  close: <path d="M6 6l12 12M18 6L6 18"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  minus: <path d="M5 12h14"/>,
  star: <path d="M12 2l3 7h7l-5.5 4 2 8L12 17l-6.5 4 2-8L2 9h7z"/>,
  check: <path d="M5 12l5 5 9-10"/>,
  pin: <><path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  filter: <path d="M3 5h18M6 12h12M10 19h4"/>,
  share: <><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 11l8-4M8 13l8 4"/></>,
  more: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
  crown: <path d="M3 7 L7 11 L12 5 L17 11 L21 7 L19 18 H5 Z"/>,
  bag: <><path d="M6 8h12l-1 13H7zM9 8V6a3 3 0 0 1 6 0v2"/></>,
  truck: <><path d="M2 7h11v10H2zM13 10h5l3 3v4h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  receipt: <><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  store: <><path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18"/><path d="M9 20v-6h6v6"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  edit: <path d="M16 3l5 5-12 12H4v-5zM13 6l5 5"/>,
  trash: <><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></>,
  chart: <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-7"/>,
  alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3z"/><path d="M9 19a3 3 0 0 0 6 0"/></>,
  arrowright: <path d="M5 12h14M13 6l6 6-6 6"/>,

  // Category glyphs (Lucide-style outlines) — used as no-photo fallback art
  cat_cafe: <><path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2"/><path d="M7 3v2M10 3v2M13 3v2"/></>,
  cat_restaurant: <><path d="M5 3v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M7 13v8"/><path d="M16 3c-2 0-3 2-3 5s1 5 3 5v8"/></>,
  cat_gym: <><path d="M3 12h2M19 12h2M7 7v10M17 7v10M7 12h10"/></>,
  cat_electronics: <><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></>,
  cat_watches: <><circle cx="12" cy="12" r="6"/><path d="M12 9v3l2 1"/><path d="M9 6V3h6v3M9 18v3h6v-3"/></>,
  cat_jewelry: <><path d="M6 9l3-5h6l3 5-6 11z"/><path d="M6 9h12M9 4l3 5 3-5M9 9l3 11M15 9l-3 11"/></>,
};
function Icon({ name, size = 22, color = "currentColor", stroke = 2, fill = "none", flip = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         className={flip ? "flip-rtl" : undefined}
         fill={fill} stroke={color} strokeWidth={stroke}
         strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name] || null}
    </svg>
  );
}
window.Icon = Icon;

// ─── Gold delight: souq-arch flourish ────────────────────────
// Tiny gold decoration — used as eyebrow underline, section divider, or
// empty-state ornament. Keeps gold present in moments where it would
// otherwise vanish, without ever competing for action attention.
function ArchMark({ size = 28, color = "var(--gold-400)", style }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 56 28" fill="none" style={style} aria-hidden="true">
      <path d="M2 26 L2 16 A12 12 0 0 1 26 16 L26 26"  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 26 L30 16 A12 12 0 0 1 54 16 L54 26" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="14" cy="16" r="1.5" fill={color}/>
      <circle cx="42" cy="16" r="1.5" fill={color}/>
      <path d="M2 26h52" stroke={color} strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}
window.ArchMark = ArchMark;

// Category → glyph + tinted gradient (no-photo fallback art)
const CATEGORY_STYLE = {
  cafe:        { glyph: "cat_cafe",        grad: "linear-gradient(135deg, #fbf1ec 0%, #ecb9a1 100%)", ink: "var(--terracotta-700)" },
  restaurant:  { glyph: "cat_restaurant",  grad: "linear-gradient(135deg, #faf3e1 0%, #ebd086 100%)", ink: "var(--gold-600)" },
  gym:         { glyph: "cat_gym",         grad: "linear-gradient(135deg, #e6e7c8 0%, #a8ad62 100%)", ink: "var(--olive-700)" },
  electronics: { glyph: "cat_electronics", grad: "linear-gradient(135deg, #d8d2c8 0%, #4a4339 100%)", ink: "#fdfbf6" },
  watches:     { glyph: "cat_watches",     grad: "linear-gradient(135deg, #f3eada 0%, #756d63 100%)", ink: "var(--charcoal-700)" },
  jewelry:     { glyph: "cat_jewelry",     grad: "linear-gradient(135deg, #f3e3b5 0%, #c99633 100%)", ink: "var(--charcoal-700)" },
};
window.CATEGORY_STYLE = CATEGORY_STYLE;

// ─── Logo ─────────────────────────────────────────────────────
function Logo({ height = 24, lang = "en" }) {
  return <img src="../../assets/logo/aswaq-wordmark.svg" alt="Aswaq" style={{ height }} />;
}
window.Logo = Logo;

// ─── Heart toggle ─────────────────────────────────────────────
function Heart({ filled, onToggle, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill={filled ? "var(--accent)" : "none"}
         stroke={filled ? "var(--accent)" : "var(--charcoal-600)"}
         strokeWidth={2}
         onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }}
         style={{ cursor: "pointer", transition: "all 140ms", transform: filled ? "scale(1.05)" : "scale(1)" }}>
      <path d="M12 21s-7-4.5-9.5-9C.7 8.6 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.3 3.6 3.5 7-2.5 4.5-5.5 9-5.5 9z"/>
    </svg>
  );
}
window.Heart = Heart;

// ─── Star rating ──────────────────────────────────────────────
function StarRating({ rating = 0, size = 14, showNum = false, count = null }) {
  const pct = Math.max(0, Math.min(5, rating)) / 5 * 100;
  const star = (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2l3 7h7l-5.5 4 2 8L12 17l-6.5 4 2-8L2 9h7z"/>
    </svg>
  );
  return (
    <span className="aw-row" style={{ gap: 6 }}>
      {showNum && <b style={{ fontWeight: 700, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{rating.toFixed(1)}</b>}
      <span className="aw-stars" style={{ height: size }}>
        <span className="track">{star}{star}{star}{star}{star}</span>
        <span className="fill" style={{ width: pct + "%" }}>{star}{star}{star}{star}{star}</span>
      </span>
      {count != null && <span style={{ color: "var(--fg-3)", fontSize: 12 }}>({count})</span>}
    </span>
  );
}
window.StarRating = StarRating;

// ─── Badge ────────────────────────────────────────────────────
function Badge({ kind, children }) {
  return <span className={"aw-badge " + kind}>{children}</span>;
}
window.Badge = Badge;

// ─── Button ───────────────────────────────────────────────────
function Button({ kind = "primary", size = "md", full, children, onClick, icon, type }) {
  const cls = ["aw-btn", kind, size === "lg" && "lg", full && "full"].filter(Boolean).join(" ");
  return (
    <button type={type} className={cls} onClick={onClick}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
    </button>
  );
}
window.Button = Button;

// ─── Chip ─────────────────────────────────────────────────────
function Chip({ selected, luxury, onClick, children }) {
  return (
    <button className={["aw-chip", selected && "selected", luxury && "luxury"].filter(Boolean).join(" ")}
            onClick={onClick}>
      {children}
    </button>
  );
}
window.Chip = Chip;

function ChipRow({ items, selected, onSelect, lang = "en" }) {
  return (
    <div className="aw-chips">
      {items.map((c) => (
        <Chip key={c.id} selected={selected === c.id} luxury={c.luxury}
              onClick={() => onSelect && onSelect(c.id)}>
          {t(c.en, c.ar, lang)}
        </Chip>
      ))}
    </div>
  );
}
window.ChipRow = ChipRow;

// ─── Header ───────────────────────────────────────────────────
function Header({ title, lang, onLang, left, right, scrolled, children }) {
  return (
    <div className={"aw-header" + (scrolled ? " scrolled" : "")}>
      {left || <Logo />}
      {title && <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none", fontWeight: 700, fontSize: 15 }}>{title}</div>}
      <div className="aw-row" style={{ marginInlineStart: "auto", gap: 8 }}>
        {right}
        <div className="aw-lang">
          <button className={lang === "en" ? "on" : ""} onClick={() => onLang && onLang("en")}>EN</button>
          <button className={lang === "ar" ? "on" : ""} onClick={() => onLang && onLang("ar")}>ع</button>
        </div>
      </div>
    </div>
  );
}
window.Header = Header;

// ─── Search bar ───────────────────────────────────────────────
function SearchBar({ placeholder, value, onChange, onFocus, lang }) {
  return (
    <div className="aw-search">
      <Icon name="search" size={18} color="var(--fg-2)" />
      <input placeholder={placeholder || t("Search businesses, products…", "ابحث عن متاجر ومنتجات…", lang)}
             value={value || ""} onChange={(e) => onChange && onChange(e.target.value)}
             onFocus={onFocus} />
      <Icon name="filter" size={18} color="var(--fg-2)" />
    </div>
  );
}
window.SearchBar = SearchBar;

// ─── BusinessCard ─────────────────────────────────────────────
// One aspect ratio (16:10), one anatomy. Designed around real photography
// with a charcoal bottom scrim for legibility; falls back to a warm
// category-tinted card with a Lucide-style category glyph and a small
// gold arch mark when no photo is available.
function BusinessCard({ biz, lang = "en", saved, onSave, onOpen, layout = "v" }) {
  const L = biz[lang] || biz.en;
  const cat = CATEGORY_STYLE[biz.category] || CATEGORY_STYLE.cafe;
  const hasPhoto = !!biz.photo;
  const imgBg = hasPhoto ? `center/cover no-repeat url(${biz.photo})` : cat.grad;

  if (layout === "h") {
    return (
      <div className="aw-biz" style={{ display: "flex", borderRadius: 16 }} onClick={onOpen}>
        <div className="img" style={{ background: imgBg, color: cat.ink, width: 96, aspectRatio: "unset", flex: "none", borderRadius: 16, display: "grid", placeItems: "center" }}>
          {!hasPhoto && <Icon name={cat.glyph} size={32} color="currentColor" stroke={1.4} />}
        </div>
        <div className="body" style={{ flex: 1, padding: "10px 14px" }}>
          <div className="name">{L.name}</div>
          <div className="meta">
            <span className="star">★</span><b style={{ color: "var(--fg-1)" }} className="num">{biz.rating}</b>
            <span className="num">({biz.reviews})</span>
            <span className="sep">·</span>
            <span>{L.neighborhood}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {biz.verified && <Badge kind="verified">★ {t("Verified", "موثّق", lang)}</Badge>}
            {biz.open ? <Badge kind="open">● {t("Open", "مفتوح", lang)}</Badge> : <Badge kind="closed">● {t("Closed", "مغلق", lang)}</Badge>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="aw-biz" onClick={onOpen}>
      <div className="img" style={{ background: imgBg, color: cat.ink, position: "relative", display: hasPhoto ? "block" : "grid", placeItems: "center" }}>
        {!hasPhoto && (
          <>
            <Icon name={cat.glyph} size={56} color="currentColor" stroke={1.4} />
            <div style={{ position: "absolute", insetInlineEnd: 10, bottom: 10, opacity: 0.7 }}>
              <ArchMark size={32} color={cat.ink} />
            </div>
          </>
        )}
        <div className="badges">
          {biz.verified && <Badge kind="verified">★ {t("Verified", "موثّق", lang)}</Badge>}
          {biz.luxury && <Badge kind="luxury">{t("Luxury", "فاخر", lang)}</Badge>}
        </div>
        <button className="heart"><Heart filled={saved} onToggle={onSave} /></button>
      </div>
      <div className="body">
        <div className="name">{L.name}</div>
        <div className="meta">
          <span className="star">★</span><b style={{ color: "var(--fg-1)" }} className="num">{biz.rating}</b>
          <span style={{ color: "var(--fg-3)" }} className="num">({biz.reviews})</span>
          <span className="sep">·</span>
          <span className="num">{biz.distance}</span>
          {!biz.open && <><span className="sep">·</span><span style={{ color: "var(--pom-500)", fontWeight: 600 }}>{t("Closed", "مغلق", lang)}</span></>}
        </div>
      </div>
    </div>
  );
}
window.BusinessCard = BusinessCard;

// ─── ProductCard ──────────────────────────────────────────────
function ProductCard({ product, vendor, lang = "en", saved, onSave, onOpen, cheapest }) {
  const L = product[lang] || product.en;
  const V = vendor && (vendor[lang] || vendor.en);
  const discount = product.was ? Math.round((1 - product.price / product.was) * 100) : 0;
  return (
    <div className="aw-prod" onClick={onOpen}>
      <div className="img" style={{ background: product.grad, position: "relative" }}>
        {discount > 0 && <span className="disc">−{discount}%</span>}
        <button className="heart"><Heart filled={saved} onToggle={onSave} size={13} /></button>
      </div>
      <div className="body">
        {V && <div className="vendor">{V.name}</div>}
        <div className="name">{L.name}</div>
        <div className="price-row">
          <span className="price">{fmtPrice(product.price, lang)}</span>
          {product.was && <span className="was">{fmtPrice(product.was, lang)}</span>}
          {cheapest && <span style={{ marginInlineStart: "auto", background: "var(--olive-100)", color: "var(--olive-700)", padding: "2px 7px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{t("Cheapest", "الأرخص", lang)}</span>}
        </div>
      </div>
    </div>
  );
}
window.ProductCard = ProductCard;

// ─── BottomNav ────────────────────────────────────────────────
function BottomNav({ current, onNav, cartCount = 0, lang = "en" }) {
  const items = [
    { id: "home",    icon: "home",   en: "Home",  ar: "الرئيسية" },
    { id: "search",  icon: "search", en: "Search",ar: "بحث" },
    { id: "saved",   icon: "heart",  en: "Saved", ar: "المحفوظات" },
    { id: "cart",    icon: "cart",   en: "Cart",  ar: "السلة" },
    { id: "you",     icon: "user",   en: "You",   ar: "حسابي" },
  ];
  return (
    <nav className="aw-nav">
      {items.map((it) => (
        <button key={it.id} className={"item" + (current === it.id ? " on" : "")} onClick={() => onNav && onNav(it.id)}>
          <span style={{ position: "relative" }}>
            <Icon name={it.icon} size={22} />
            {it.id === "cart" && cartCount > 0 && <span className="dot">{cartCount}</span>}
          </span>
          <span>{t(it.en, it.ar, lang)}</span>
        </button>
      ))}
    </nav>
  );
}
window.BottomNav = BottomNav;

// ─── Sheet & Modal ────────────────────────────────────────────
function Sheet({ open, onDismiss, children }) {
  if (!open) return null;
  return (
    <div className="aw-scrim" onClick={onDismiss}>
      <div className="aw-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />
        {children}
      </div>
    </div>
  );
}
window.Sheet = Sheet;

function Modal({ open, onDismiss, children }) {
  if (!open) return null;
  return (
    <div className="aw-scrim" style={{ alignItems: "center" }} onClick={onDismiss}>
      <div className="aw-modal" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
window.Modal = Modal;

// ─── Field ────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", placeholder, error, lang = "en" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "var(--fg-2)", fontWeight: 600 }}>{label}</label>
      <input type={type} value={value || ""} placeholder={placeholder}
             onChange={(e) => onChange && onChange(e.target.value)}
             style={{
               fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)",
               fontSize: 15, padding: "12px 14px",
               borderRadius: 14,
               border: "1px solid " + (error ? "var(--danger)" : "var(--cream-400)"),
               background: "#fff", outline: "none",
             }} />
      {error && <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}
window.Field = Field;

// Make all exports available globally for sibling Babel scripts
Object.assign(window, {
  Icon, Logo, Heart, StarRating, Badge, Button, Chip, ChipRow,
  Header, SearchBar, BusinessCard, ProductCard, BottomNav, Sheet, Modal, Field, t,
  ArchMark, CATEGORY_STYLE,
});
