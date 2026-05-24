// Aswaq mobile UI kit · screens (1/2): Home, Search, Business, Compare, Favorites
// Depends on globals from components.jsx and ASWAQ_DATA from data.js
const { CATEGORIES, BUSINESSES, PRODUCTS, REVIEWS } = window.ASWAQ_DATA;

// ─── HOME ────────────────────────────────────────────────────────────────
function HomeScreen({ lang, onLang, ctx }) {
  const [cat, setCat] = React.useState("all");
  const [scrolled, setScrolled] = React.useState(false);
  const featured = BUSINESSES[0];
  const trending = BUSINESSES.slice(1, 4);
  const nearMe = BUSINESSES.slice(2, 6);

  const greeting = t("Sahtain, Amman ☕", "صحتين، يا عمّان", lang).replace("☕", "");

  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} scrolled={scrolled}
              right={<button className="aw-icon-btn"><Icon name="bell" size={18}/></button>} />
      <div className="aswaq-scroll" onScroll={(e) => setScrolled(e.target.scrollTop > 8)}>
        <div style={{ padding: "4px 20px 0" }}>
          <div className="aw-eyebrow">{t("Discover", "اكتشف", lang)}</div>
          <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.02em", marginTop: 4, color: "var(--fg-1)" }}>
            {t("Good morning,", "صباح الخير،", lang)}<br/>
            <span style={{ color: "var(--accent)" }}>{t("Amman", "عمّان", lang)}</span>
          </div>
          <ArchMark size={28} style={{ marginTop: 10, marginBottom: 2, opacity: 0.85 }} />
        </div>

        <SearchBar lang={lang} onFocus={() => ctx.go("search")} />

        <ChipRow items={CATEGORIES} selected={cat} onSelect={setCat} lang={lang} />

        <div className="aw-h2-row">
          <h2 className="aw-h2">{t("Featured today", "مميّز اليوم", lang)}</h2>
        </div>
        <div style={{ padding: "0 20px" }}>
          <FeaturedHero biz={featured} lang={lang} ctx={ctx} />
        </div>

        <div className="aw-h2-row">
          <h2 className="aw-h2">{t("Trending nearby", "الأكثر رواجاً قريب منك", lang)}</h2>
          <a className="link" onClick={() => ctx.go("search")}>{t("See all", "عرض الكل", lang)}</a>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px 4px", scrollbarWidth: "none" }}>
          {trending.map((b) => (
            <div key={b.id} style={{ width: 200, flex: "none" }}>
              <BusinessCard biz={b} lang={lang}
                            saved={ctx.savedBiz.has(b.id)}
                            onSave={() => ctx.toggleSaveBiz(b.id)}
                            onOpen={() => ctx.openBiz(b.id)} />
            </div>
          ))}
        </div>

        <div className="aw-h2-row">
          <h2 className="aw-h2">{t("Near you", "بالقرب منك", lang)}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
          {nearMe.map((b) => (
            <BusinessCard key={b.id} biz={b} lang={lang} layout="h"
                          onOpen={() => ctx.openBiz(b.id)} />
          ))}
        </div>

        <PremiumStrip lang={lang} onTry={() => ctx.go("premium")} />
      </div>
    </div>
  );
}

function FeaturedHero({ biz, lang, ctx }) {
  const L = biz[lang] || biz.en;
  const cat = CATEGORY_STYLE[biz.category] || CATEGORY_STYLE.cafe;
  const hasPhoto = !!biz.photo;
  return (
    <div onClick={() => ctx.openBiz(biz.id)} style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: 220, cursor: "pointer", boxShadow: "var(--shadow-md)", background: hasPhoto ? `center/cover no-repeat url(${biz.photo})` : cat.grad, color: cat.ink }}>
      {!hasPhoto && (
        <div style={{ position: "absolute", insetInlineEnd: 18, top: 18, opacity: 0.55, color: cat.ink, display: "grid", placeItems: "center" }}>
          <Icon name={cat.glyph} size={64} color="currentColor" stroke={1.2} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(31,26,21,0.7) 0%, rgba(31,26,21,0.12) 50%, transparent 100%)" }} />
      <div style={{ position: "absolute", top: 14, insetInlineStart: 14, display: "flex", gap: 6 }}>
        <Badge kind="verified">★ {t("Verified", "موثّق", lang)}</Badge>
        <Badge kind="open">● {t("Open · 8a–11p", "مفتوح · 8ص–11م", lang)}</Badge>
      </div>
      <div style={{ position: "absolute", insetInlineStart: 18, insetInlineEnd: 18, bottom: 18, color: "var(--cream-50)" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.9 }}>
          {t("Café · Jabal Al-Weibdeh", "مقهى · جبل اللويبدة", lang)}
        </div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>
          {L.name}
        </div>
        <div style={{ fontSize: 13, marginTop: 6, opacity: 0.92 }}>{L.tagline}</div>
      </div>
    </div>
  );
}

function PremiumStrip({ lang, onTry }) {
  return (
    <div onClick={onTry} style={{ margin: "20px", padding: "16px 18px", borderRadius: 20, background: "var(--charcoal-600)", color: "var(--cream-50)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "var(--shadow-md)" }}>
      <div style={{ width: 42, height: 42, borderRadius: 999, background: "var(--gold-soft-bg)", color: "var(--gold-500)", display: "grid", placeItems: "center", flex: "none" }}>
        <Icon name="crown" size={20} fill="currentColor" stroke="none" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>
          {t("Compare luxury items", "قارن المنتجات الفاخرة", lang)}
        </div>
        <div style={{ fontSize: 12, color: "var(--cream-300)", marginTop: 2 }}>
          {t("Premium · 4 JD/month · 7 days free", "بريميوم · 4 د.أ/شهر · 7 أيام مجاناً", lang)}
        </div>
      </div>
      <Icon name="arrowright" size={18} color="var(--gold-300)" flip />
    </div>
  );
}

// ─── SEARCH / CATEGORY RESULTS ───────────────────────────────────────────
function SearchScreen({ lang, onLang, ctx }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const filtered = BUSINESSES.filter((b) => {
    if (cat !== "all" && b.category !== cat) return false;
    if (q) {
      const hay = ((b.en.name + " " + b.en.tagline + " " + b.en.neighborhood + " " + b.ar.name) || "").toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang}
              left={<button className="aw-icon-btn" onClick={() => ctx.back()}><Icon name="back" size={18}flip /></button>}
              right={<button className="aw-icon-btn"><Icon name="filter" size={18}/></button>} />
      <div style={{ padding: "8px 20px 4px" }}>
        <div className="aw-search" style={{ margin: 0 }}>
          <Icon name="search" size={18} color="var(--fg-2)" />
          <input autoFocus placeholder={t("Search businesses, products…", "ابحث عن متاجر ومنتجات…", lang)}
                 value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ("")} style={{ border: 0, background: "transparent", color: "var(--fg-3)", cursor: "pointer" }}><Icon name="close" size={16}/></button>}
        </div>
      </div>
      <ChipRow items={CATEGORIES} selected={cat} onSelect={setCat} lang={lang} />
      <div className="aswaq-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "12px 20px 8px" }}>
          <div style={{ fontSize: 13, color: "var(--fg-2)" }}>
            <b style={{ color: "var(--fg-1)" }}>{filtered.length}</b> {t("results", "نتيجة", lang)}
          </div>
          <div style={{ display: "inline-flex", background: "var(--cream-200)", padding: 3, borderRadius: 10, gap: 3 }}>
            <button style={{ background: "var(--surface)", border: 0, padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 600, boxShadow: "var(--shadow-xs)" }}>{t("Top rated", "الأعلى تقييماً", lang)}</button>
            <button style={{ background: "transparent", border: 0, padding: "5px 10px", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "var(--fg-2)" }}>{t("Nearest", "الأقرب", lang)}</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px" }}>
          {filtered.map((b) => (
            <BusinessCard key={b.id} biz={b} lang={lang}
                          saved={ctx.savedBiz.has(b.id)}
                          onSave={() => ctx.toggleSaveBiz(b.id)}
                          onOpen={() => ctx.openBiz(b.id)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--fg-3)" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--fg-1)", marginBottom: 6 }}>{t("Nothing matches that", "لا توجد نتائج مطابقة", lang)}</div>
            <div style={{ fontSize: 13 }}>{t("Try a neighbourhood or a category.", "جرّب اسم منطقة أو فئة.", lang)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BUSINESS PROFILE ────────────────────────────────────────────────────
function BusinessScreen({ lang, onLang, ctx, bizId }) {
  const biz = BUSINESSES.find((b) => b.id === bizId) || BUSINESSES[0];
  const L = biz[lang] || biz.en;
  const products = PRODUCTS.filter((p) => p.vendorId === biz.id);
  const reviews = REVIEWS;
  const [tab, setTab] = React.useState("menu");
  const saved = ctx.savedBiz.has(biz.id);
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="aswaq-scroll" style={{ paddingBottom: 120 }}>
        {/* Hero image */}
        <div style={{ position: "relative", height: 240, background: biz.grad }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(31,26,21,0.5) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", top: 12, insetInlineStart: 12, insetInlineEnd: 12, display: "flex", justifyContent: "space-between" }}>
            <button className="aw-icon-btn" onClick={() => ctx.back()} style={{ background: "rgba(253, 251, 246, 0.92)" }}>
              <Icon name="back" size={18}flip />
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="aw-icon-btn" style={{ background: "rgba(253, 251, 246, 0.92)" }}><Icon name="share" size={18}/></button>
              <button className="aw-icon-btn" style={{ background: "rgba(253, 251, 246, 0.92)" }} onClick={() => ctx.toggleSaveBiz(biz.id)}>
                <Heart filled={saved} onToggle={() => ctx.toggleSaveBiz(biz.id)} size={18} />
              </button>
            </div>
          </div>
          <div style={{ position: "absolute", insetInlineStart: 20, insetInlineEnd: 20, bottom: 16, color: "var(--cream-50)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {biz.verified && <Badge kind="verified">★ {t("Verified", "موثّق", lang)}</Badge>}
              {biz.luxury && <Badge kind="luxury">{t("Luxury", "فاخر", lang)}</Badge>}
            </div>
            <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontSize: 30, fontWeight: lang === "ar" ? 700 : 600, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              {L.name}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", padding: "16px 20px", gap: 12, borderBottom: "1px solid var(--border)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StarRating rating={biz.rating} size={14} />
              <b style={{ fontSize: 18, fontFamily: "var(--font-body)", fontFeatureSettings: '"tnum"' }}>{biz.rating}</b>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 2 }}>{biz.reviews} {t("reviews", "مراجعة", lang)}</div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 14 }}>
              <Icon name="pin" size={14} color="var(--fg-2)" />{biz.distance}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 4 }}>{L.neighborhood}</div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: biz.open ? "var(--olive-500)" : "var(--pom-500)", fontWeight: 700, fontSize: 14 }}>
              <Icon name="clock" size={14} />{biz.open ? t("Open", "مفتوح", lang) : t("Closed", "مغلق", lang)}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 4 }}>{t("8a — 11p", "8ص — 11م", lang)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", paddingInlineStart: 20, gap: 0 }}>
          {[["menu", t("Menu", "المنتجات", lang) + " · " + products.length],
            ["reviews", t("Reviews", "المراجعات", lang) + " · " + biz.reviews],
            ["about", t("About", "عن المتجر", lang)]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
                    style={{ background: "transparent", border: 0, padding: "14px 16px",
                             borderBottom: "2px solid " + (tab === k ? "var(--accent)" : "transparent"),
                             marginBottom: -1,
                             fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)",
                             fontWeight: 600, fontSize: 14,
                             color: tab === k ? "var(--fg-1)" : "var(--fg-3)", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "menu" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "16px 20px" }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang}
                           saved={ctx.savedProd.has(p.id)}
                           onSave={() => ctx.toggleSaveProd(p.id)}
                           onOpen={() => ctx.openProd(p.id)} />
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: 24, color: "var(--fg-3)", textAlign: "center" }}>
                {t("No products yet.", "لا توجد منتجات بعد.", lang)}
              </div>
            )}
          </div>
        )}
        {tab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px" }}>
            <div style={{ background: "var(--surface)", borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600, lineHeight: 1, color: "var(--fg-1)", letterSpacing: "-0.02em" }}>{biz.rating}</div>
              <div style={{ flex: 1 }}>
                <StarRating rating={biz.rating} size={16} />
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4 }}>{biz.reviews} {t("reviews", "مراجعة", lang)}</div>
              </div>
              <Button kind="secondary" size="md">{t("Write a review", "أكتب مراجعة", lang)}</Button>
            </div>
            {reviews.map((r, i) => <ReviewCard key={i} review={r} lang={lang} />)}
          </div>
        )}
        {tab === "about" && (
          <div style={{ padding: "16px 20px", fontSize: 14, color: "var(--fg-1)", lineHeight: 1.6 }}>
            <p>{L.tagline}. {t("Open daily from 8a until 11p. Outdoor seating, free wifi, accepts cash and card. Delivery via three couriers.", "مفتوح يومياً من 8ص حتى 11م. جلسات خارجية، واي فاي مجاني، نقبل النقد والبطاقات. التوصيل عبر ثلاث شركات.", lang)}</p>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 24px", background: "linear-gradient(to top, var(--cream-50) 60%, transparent)", display: "flex", gap: 10 }}>
        <Button kind="secondary" full onClick={() => ctx.go("compare", { vendorId: biz.id })} icon="chart">
          {t("Compare", "قارن", lang)}
        </Button>
        <Button kind="primary" full onClick={() => ctx.openProd(products[0] && products[0].id)} icon="bag">
          {t("Order now", "اطلب الآن", lang)}
        </Button>
      </div>
    </div>
  );
}

function ReviewCard({ review, lang }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 16, border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "linear-gradient(135deg, var(--terracotta-300), var(--gold-300))", color: "var(--cream-50)", fontWeight: 700, display: "grid", placeItems: "center", fontSize: 13 }}>{review.initial}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{review.author}</div>
          <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{review.when}{review.verified && " · " + t("Verified order", "طلب موثّق", lang)}</div>
        </div>
        <StarRating rating={review.rating} size={13} />
      </div>
      <div style={{ fontSize: 14, marginTop: 8, color: "var(--fg-1)", lineHeight: 1.5 }}>{review[lang] || review.en}</div>
    </div>
  );
}

// ─── PRODUCT COMPARE (with paywall for luxury) ────────────────────────────
function CompareScreen({ lang, onLang, ctx, premium, vendorId }) {
  const pool = vendorId
    ? PRODUCTS.filter((p) => p.vendorId === vendorId)
    : PRODUCTS;
  const luxury = pool.some((p) => p.luxury);
  const [pickedIds, setPickedIds] = React.useState(pool.slice(0, 3).map((p) => p.id));
  const picked = pickedIds.map((id) => pool.find((p) => p.id === id)).filter(Boolean);
  const cheapest = picked.reduce((a, b) => (!a || b.price < a.price ? b : a), null);

  const showPaywall = luxury && !premium;

  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang}
              title={t("Compare", "مقارنة", lang)}
              left={<button className="aw-icon-btn" onClick={() => ctx.back()}><Icon name="back" size={18}flip /></button>} />
      <div className="aswaq-scroll" style={{ position: "relative" }}>
        <div style={{ padding: "8px 20px 16px" }}>
          <div className="aw-eyebrow">{t("Side by side", "جنباً إلى جنب", lang)}</div>
          <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 24, marginTop: 4 }}>
            {t("Compare prices and ratings", "قارن الأسعار والتقييمات", lang)}
          </div>
        </div>

        <div style={{ filter: showPaywall ? "blur(6px)" : "none", pointerEvents: showPaywall ? "none" : "auto", padding: "0 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${picked.length}, 1fr)`, gap: 10 }}>
            {picked.map((p) => {
              const v = BUSINESSES.find((b) => b.id === p.vendorId);
              const isCheapest = cheapest && p.id === cheapest.id;
              return (
                <div key={p.id} style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", position: "relative", boxShadow: isCheapest ? "0 0 0 2px var(--olive-300), var(--shadow-sm)" : "var(--shadow-xs)" }}>
                  <div style={{ aspectRatio: "1", background: p.grad, position: "relative" }}>
                    {isCheapest && <span style={{ position: "absolute", top: 8, insetInlineStart: 8, padding: "3px 8px", borderRadius: 999, background: "var(--olive-500)", color: "var(--cream-50)", fontSize: 10, fontWeight: 700 }}>{t("Cheapest", "الأرخص", lang)}</span>}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", fontWeight: 500 }}>{v && (v[lang] || v.en).name}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.3, marginTop: 2, height: "2.6em", overflow: "hidden" }}>{(p[lang] || p.en).name}</div>
                    <div className="num" style={{ fontWeight: 700, fontSize: 16, marginTop: 6, color: isCheapest ? "var(--olive-700)" : "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{fmtPrice(p.price, lang)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <div style={{ marginTop: 18, background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden" }}>
            <CompareRow lang={lang} label={t("Price", "السعر", lang)} values={picked.map((p) => p.price + " JD")} highlight={picked.map((p) => cheapest && p.id === cheapest.id)} />
            <CompareRow lang={lang} label={t("Vendor rating", "تقييم البائع", lang)} values={picked.map((p) => { const v = BUSINESSES.find((b) => b.id === p.vendorId); return v ? v.rating.toFixed(1) + " ★" : "—"; })} />
            <CompareRow lang={lang} label={t("Distance", "المسافة", lang)} values={picked.map((p) => { const v = BUSINESSES.find((b) => b.id === p.vendorId); return v ? v.distance : "—"; })} />
            <CompareRow lang={lang} label={t("Available", "متوفّر", lang)} values={picked.map(() => t("In stock", "متوفّر", lang))} last />
          </div>

          {/* Recommendation */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, marginBottom: 32 }}>
            <Button kind="ink" full icon="check">{t("Pick the cheapest", "اختر الأرخص", lang)}</Button>
          </div>
        </div>

        {showPaywall && <PaywallOverlay lang={lang} onUpgrade={() => ctx.upgrade()} onClose={() => ctx.back()} />}
      </div>
    </div>
  );
}

function CompareRow({ label, values, highlight = [], last, lang }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `100px repeat(${values.length}, 1fr)`, borderBottom: last ? "0" : "1px solid var(--border)" }}>
      <div style={{ padding: "12px 14px", fontSize: 12, color: "var(--fg-3)", fontWeight: 600, background: "var(--cream-100)" }}>{label}</div>
      {values.map((v, i) => (
        <div className="num" key={i} style={{ padding: "12px 10px", fontSize: 13, fontWeight: highlight[i] ? 700 : 500, color: highlight[i] ? "var(--olive-700)" : "var(--fg-1)", textAlign: "center", fontFeatureSettings: '"tnum"' }}>
          {v}
        </div>
      ))}
    </div>
  );
}

function PaywallOverlay({ lang, onUpgrade, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(31,26,21,0.55), rgba(31,26,21,0.85))", display: "flex", alignItems: "flex-end", zIndex: 5 }}>
      <div style={{ background: "var(--cream-50)", width: "100%", borderRadius: "28px 28px 0 0", padding: "24px 24px 32px", boxShadow: "var(--shadow-xl)" }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: "var(--cream-400)", margin: "-4px auto 16px" }}/>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--charcoal-600)", margin: "0 auto 12px", display: "grid", placeItems: "center", boxShadow: "0 0 0 4px var(--gold-100), 0 0 0 5px var(--gold-300)" }}>
            <Icon name="crown" size={26} color="var(--gold-400)" fill="var(--gold-400)" stroke="none" />
          </div>
          <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: "var(--gold-soft-bg)", color: "var(--gold-600)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{t("Premium", "بريميوم", lang)}</div>
          <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 22, lineHeight: 1.2, marginTop: 12, color: "var(--fg-1)" }}>
            {t("Compare luxury items, side by side", "قارن المنتجات الفاخرة جنباً إلى جنب", lang)}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--fg-2)", marginTop: 8, maxWidth: 280, marginInline: "auto", lineHeight: 1.5 }}>
            {t("Comparison for watches and jewellery is included with Premium. 4 JD a month, cancel anytime.", "مقارنة الساعات والمجوهرات متاحة مع بريميوم. 4 د.أ شهرياً، يمكنك الإلغاء في أي وقت.", lang)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
          <Button kind="gold" full size="lg" onClick={onUpgrade}>{t("Try Premium · 7 days free", "جرّب بريميوم · 7 أيام مجاناً", lang)}</Button>
          <Button kind="ghost" full onClick={onClose}>{t("Not now", "ليس الآن", lang)}</Button>
        </div>
      </div>
    </div>
  );
}

// ─── FAVORITES ────────────────────────────────────────────────────────────
function FavoritesScreen({ lang, onLang, ctx }) {
  const [tab, setTab] = React.useState("biz");
  const bizList = [...ctx.savedBiz].map((id) => BUSINESSES.find((b) => b.id === id)).filter(Boolean);
  const prodList = [...ctx.savedProd].map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  const list = tab === "biz" ? bizList : prodList;
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} />
      <div style={{ padding: "8px 20px 0" }}>
        <div className="aw-eyebrow">{t("Saved", "المحفوظات", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, marginTop: 4, letterSpacing: "-0.02em" }}>
          {t("Your favourites", "مفضّلاتك", lang)}
        </div>
        <div style={{ display: "inline-flex", background: "var(--cream-200)", padding: 4, borderRadius: 12, gap: 4, marginTop: 14 }}>
          <button onClick={() => setTab("biz")} style={{ background: tab === "biz" ? "var(--surface)" : "transparent", border: 0, padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, color: tab === "biz" ? "var(--fg-1)" : "var(--fg-2)", boxShadow: tab === "biz" ? "var(--shadow-xs)" : "none", fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>
            {t("Businesses", "المتاجر", lang)} · {bizList.length}
          </button>
          <button onClick={() => setTab("prod")} style={{ background: tab === "prod" ? "var(--surface)" : "transparent", border: 0, padding: "7px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13, color: tab === "prod" ? "var(--fg-1)" : "var(--fg-2)", boxShadow: tab === "prod" ? "var(--shadow-xs)" : "none", fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>
            {t("Products", "المنتجات", lang)} · {prodList.length}
          </button>
        </div>
      </div>
      <div className="aswaq-scroll" style={{ paddingTop: 16 }}>
        {list.length === 0 ? (
          <div style={{ margin: "40px 20px", padding: "32px 24px", textAlign: "center", border: "1px dashed var(--cream-400)", borderRadius: 20, background: "var(--surface)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--cream-200)", margin: "0 auto 12px", display: "grid", placeItems: "center" }}>
              <Icon name="heart" size={24} color="var(--fg-3)" />
            </div>
            <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontSize: 20, fontWeight: lang === "ar" ? 700 : 600, color: "var(--fg-1)" }}>
              {t("Nothing saved yet", "لم تحفظ شيئاً بعد", lang)}
            </div>
            <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 6 }}>
              {t("Tap the heart on anything worth coming back to.", "اضغط القلب على أي شيء يستحق العودة إليه.", lang)}
            </div>
            <div style={{ marginTop: 16 }}>
              <Button kind="primary" onClick={() => ctx.nav("home")}>{t("Browse businesses", "تصفّح المتاجر", lang)}</Button>
            </div>
          </div>
        ) : tab === "biz" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px" }}>
            {list.map((b) => <BusinessCard key={b.id} biz={b} lang={lang} saved={true} onSave={() => ctx.toggleSaveBiz(b.id)} onOpen={() => ctx.openBiz(b.id)} />)}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 20px" }}>
            {list.map((p) => <ProductCard key={p.id} product={p} vendor={BUSINESSES.find((b) => b.id === p.vendorId)} lang={lang} saved={true} onSave={() => ctx.toggleSaveProd(p.id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, SearchScreen, BusinessScreen, CompareScreen, FavoritesScreen, ReviewCard });
