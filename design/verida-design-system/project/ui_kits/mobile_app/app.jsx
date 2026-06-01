// Aswaq mobile UI kit — App shell.
// Renders one phone with bottom-nav navigation between screens.
// Used by index.html and design-canvas wrappers.

function MobileApp({ lang: initialLang = "en", startScreen = "home" }) {
  const [lang, setLang] = React.useState(initialLang);
  const [stack, setStack] = React.useState([{ id: startScreen, params: {} }]);
  const [nav, setNav] = React.useState(startScreen === "home" || startScreen === "saved" || startScreen === "cart" || startScreen === "you" ? startScreen : "home");
  const [savedBiz, setSavedBiz] = React.useState(new Set(["royal-time", "rumi"]));
  const [savedProd, setSavedProd] = React.useState(new Set(["seiko-presage"]));
  const [cart, setCart] = React.useState([
    { id: "kunafa-kilo", qty: 2 },
    { id: "halawet-jibn", qty: 1 },
    { id: "v60", qty: 2 },
  ]);
  const [premium, setPremium] = React.useState(false);

  const top = stack[stack.length - 1];

  const ctx = {
    savedBiz, savedProd, cart, premium,
    toggleSaveBiz: (id) => setSavedBiz((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    toggleSaveProd: (id) => setSavedProd((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => x.id === id ? { ...x, qty } : x)),
    clearCart: () => setCart([]),
    upgrade: () => setPremium(true),
    signIn: () => { setStack([{ id: "home", params: {} }]); setNav("home"); },

    nav: (id) => { setNav(id); setStack([{ id, params: {} }]); },
    go: (id, params = {}) => setStack((s) => [...s, { id, params }]),
    back: () => setStack((s) => s.length > 1 ? s.slice(0, -1) : s),

    openBiz: (id) => ctx.go("business", { bizId: id }),
    openProd: (id) => {
      // For demo, opening a product adds 1 to cart and toasts.
      const p = ASWAQ_DATA.PRODUCTS.find((x) => x.id === id);
      if (!p) return;
      setCart((c) => c.find((x) => x.id === id) ? c.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1 }]);
    },
  };

  // Switch between bottom-nav screens or modal stack
  let screen = null;
  if (stack.length > 1) {
    const s = top;
    if (s.id === "business")   screen = <BusinessScreen lang={lang} onLang={setLang} ctx={ctx} bizId={s.params.bizId} />;
    if (s.id === "compare")    screen = <CompareScreen lang={lang} onLang={setLang} ctx={ctx} premium={premium} vendorId={s.params.vendorId} />;
    if (s.id === "checkout")   screen = <CheckoutScreen lang={lang} onLang={setLang} ctx={ctx} />;
    if (s.id === "confirmed")  screen = <ConfirmedScreen lang={lang} onLang={setLang} ctx={ctx} />;
    if (s.id === "search")     screen = <SearchScreen lang={lang} onLang={setLang} ctx={ctx} />;
    if (s.id === "premium")    screen = <PremiumScreen lang={lang} onLang={setLang} ctx={ctx} premium={premium} />;
    if (s.id === "orders")     screen = <OrdersScreen lang={lang} onLang={setLang} ctx={ctx} />;
    if (s.id === "login" || s.id === "register") screen = <AuthScreen lang={lang} onLang={setLang} ctx={ctx} mode={s.id} />;
    if (s.id === "owner")      screen = <OwnerLandingScreen lang={lang} onLang={setLang} ctx={ctx} />;
  } else {
    if (nav === "home")   screen = <HomeScreen      lang={lang} onLang={setLang} ctx={ctx} />;
    if (nav === "search") screen = <SearchScreen    lang={lang} onLang={setLang} ctx={ctx} />;
    if (nav === "saved")  screen = <FavoritesScreen lang={lang} onLang={setLang} ctx={ctx} />;
    if (nav === "cart")   screen = <CartScreen      lang={lang} onLang={setLang} ctx={ctx} />;
    if (nav === "you")    screen = <YouScreen       lang={lang} onLang={setLang} ctx={ctx} premium={premium} />;
  }

  return (
    <>
      {screen}
      {stack.length === 1 && <BottomNav current={nav} onNav={(id) => ctx.nav(id)} cartCount={cart.reduce((s, c) => s + c.qty, 0)} lang={lang} />}
    </>
  );
}

// Tiny stub for the "Become a seller" landing inside the consumer app
function OwnerLandingScreen({ lang, onLang, ctx }) {
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"} style={{ background: "var(--cream-100)" }}>
      <Header lang={lang} onLang={onLang} left={<button className="aw-icon-btn" onClick={() => ctx.back()}><Icon name="back" size={18}flip /></button>} />
      <div className="aswaq-scroll" style={{ padding: "20px 24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--surface-tint)", margin: "20px auto", display: "grid", placeItems: "center", color: "var(--accent)" }}>
          <Icon name="store" size={32} />
        </div>
        <div className="aw-eyebrow">{t("For business owners", "لأصحاب المتاجر", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 28, marginTop: 6, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {t("Bring your shop to Aswaq.", "أضِف متجرك إلى أسواق.", lang)}
        </div>
        <div style={{ fontSize: 14, color: "var(--fg-2)", marginTop: 10, lineHeight: 1.5, maxWidth: 300, marginInline: "auto" }}>
          {t("List your products, take orders, build a verified reputation in your neighbourhood.", "اعرض منتجاتك، استقبل الطلبات، وابنِ سمعة موثّقة في منطقتك.", lang)}
        </div>
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          <Button kind="primary" full size="lg" icon="store">{t("Open your dashboard", "افتح لوحة التحكم", lang)}</Button>
          <Button kind="ghost" full>{t("How does it work?", "كيف تعمل؟", lang)}</Button>
        </div>
      </div>
    </div>
  );
}

window.MobileApp = MobileApp;
window.OwnerLandingScreen = OwnerLandingScreen;
