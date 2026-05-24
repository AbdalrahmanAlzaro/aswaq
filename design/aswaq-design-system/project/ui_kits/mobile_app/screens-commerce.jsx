// Aswaq mobile UI kit · screens (2/2): Cart, Checkout, Confirmation, Orders, Auth, Premium, You

// ─── CART (multi-vendor, 25 JD minimum per shop) ─────────────────────────
function CartScreen({ lang, onLang, ctx }) {
  const items = ctx.cart;          // [{id, qty}]
  const byVendor = {};
  items.forEach((it) => {
    const p = ASWAQ_DATA.PRODUCTS.find((x) => x.id === it.id);
    if (!p) return;
    if (!byVendor[p.vendorId]) byVendor[p.vendorId] = [];
    byVendor[p.vendorId].push({ p, qty: it.qty });
  });
  const vendorIds = Object.keys(byVendor);
  const MIN = 25;

  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} title={t("Your cart", "سلتك", lang)}
              left={<button className="aw-icon-btn" onClick={() => ctx.nav("home")}><Icon name="back" size={18}flip /></button>} />

      <div className="aswaq-scroll" style={{ paddingBottom: 200 }}>
        {vendorIds.length === 0 ? (
          <EmptyCart lang={lang} ctx={ctx} />
        ) : (
          <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {vendorIds.map((vid) => {
              const v = ASWAQ_DATA.BUSINESSES.find((b) => b.id === vid);
              const lines = byVendor[vid];
              const sub = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
              const need = Math.max(0, MIN - sub);
              return (
                <div key={vid} style={{ background: "var(--surface)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow-xs)" }}>
                  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: v.grad, flex: "none" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{(v[lang] || v.en).name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{(v[lang] || v.en).neighborhood} · {v.distance}</div>
                    </div>
                    <Icon name="chev" size={16} color="var(--fg-3)" flip />
                  </div>
                  {lines.map(({ p, qty }) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: p.grad, flex: "none" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)", lineHeight: 1.3, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{(p[lang] || p.en).name}</div>
                        <div className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-1)", marginTop: 4, fontFeatureSettings: '"tnum"' }}>{fmtPrice(p.price, lang)}</div>
                      </div>
                      <QtyStepper qty={qty} onChange={(q) => ctx.setQty(p.id, q)} />
                    </div>
                  ))}
                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--cream-100)" }}>
                    <div style={{ fontSize: 12, color: "var(--fg-2)", fontWeight: 600 }}>{t("Shop subtotal", "مجموع المتجر", lang)}</div>
                    <div className="num" style={{ fontWeight: 700, fontSize: 15, fontFeatureSettings: '"tnum"' }}>{fmtPrice(sub.toFixed(2), lang)}</div>
                  </div>
                  {need > 0 && (
                    <div style={{ padding: "10px 16px", display: "flex", gap: 10, alignItems: "center", background: "var(--surface-tint)", color: "var(--accent-press)", fontSize: 12.5 }}>
                      <Icon name="alert" size={16} stroke={2.2} />
                      <span style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>
                        {t(`Add ${fmtPrice(need.toFixed(2), lang)} more to reach the 25 JD minimum for this shop.`, `أضِف ${need.toFixed(2)} د.أ لبلوغ الحد الأدنى 25 د.أ لهذا المتجر.`, lang)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {vendorIds.length > 0 && <CheckoutBar lang={lang} ctx={ctx} vendorIds={vendorIds} byVendor={byVendor} />}
    </div>
  );
}

function EmptyCart({ lang, ctx }) {
  return (
    <div style={{ margin: "32px 20px", padding: "32px 24px", textAlign: "center", border: "1px dashed var(--cream-400)", borderRadius: 20, background: "var(--surface)" }}>
      <div style={{ width: 56, height: 56, borderRadius: 999, background: "var(--cream-200)", margin: "0 auto 12px", display: "grid", placeItems: "center" }}>
        <Icon name="bag" size={24} color="var(--fg-3)" />
      </div>
      <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontSize: 20, fontWeight: lang === "ar" ? 700 : 600 }}>
        {t("Your cart is empty", "سلتك فارغة", lang)}
      </div>
      <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 6 }}>
        {t("Add something from any shop. You can mix vendors freely.", "أضِف أي شيء من أي متجر. يمكنك المزج بين المتاجر.", lang)}
      </div>
      <div style={{ marginTop: 16 }}>
        <Button kind="primary" onClick={() => ctx.nav("home")}>{t("Browse businesses", "تصفّح المتاجر", lang)}</Button>
      </div>
    </div>
  );
}

function QtyStepper({ qty, onChange }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 0, background: "var(--cream-100)", borderRadius: 999, padding: 2 }}>
      <button onClick={() => onChange(Math.max(0, qty - 1))} style={{ background: "transparent", border: 0, width: 28, height: 28, borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer" }}>
        <Icon name="minus" size={14} />
      </button>
      <span className="num" style={{ minWidth: 22, textAlign: "center", fontWeight: 700, fontSize: 13, fontFeatureSettings: '"tnum"' }}>{qty}</span>
      <button onClick={() => onChange(qty + 1)} style={{ background: "var(--accent)", color: "var(--accent-fg)", border: 0, width: 28, height: 28, borderRadius: 999, display: "grid", placeItems: "center", cursor: "pointer" }}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

function CheckoutBar({ lang, ctx, vendorIds, byVendor }) {
  const total = vendorIds.reduce((s, vid) => s + byVendor[vid].reduce((a, l) => a + l.p.price * l.qty, 0), 0);
  const fee = vendorIds.length * 2; // 2 JD delivery per shop
  const canCheckout = vendorIds.every((vid) => byVendor[vid].reduce((a, l) => a + l.p.price * l.qty, 0) >= 25);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 24px", background: "var(--cream-50)", borderTop: "1px solid var(--border)", boxShadow: "0 -8px 20px -8px rgba(31,26,21,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--fg-2)" }}>
        <span>{t("Subtotal", "المجموع", lang)}</span>
        <span className="num" style={{ fontWeight: 600, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{fmtPrice(total.toFixed(2), lang)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--fg-2)", marginTop: 4 }}>
        <span>{t(`Delivery · ${vendorIds.length} shops`, `التوصيل · ${vendorIds.length} متاجر`, lang)}</span>
        <span className="num" style={{ fontWeight: 600, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{fmtPrice(fee.toFixed(2), lang)}</span>
      </div>
      <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)", fontWeight: 700, fontSize: 14 }}>{t("Total", "الإجمالي", lang)}</span>
        <span className="num" style={{ fontWeight: 800, fontSize: 20, fontFeatureSettings: '"tnum"', fontFamily: "var(--font-body)" }}>{fmtPrice((total + fee).toFixed(2), lang)}</span>
      </div>
      <Button kind={canCheckout ? "primary" : "secondary"} full size="lg" onClick={() => canCheckout && ctx.go("checkout")}>
        {canCheckout ? t("Checkout", "الدفع", lang) : t("Meet shop minimums to checkout", "أكمل الحدود الدنيا للمتاجر", lang)}
      </Button>
    </div>
  );
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────
function CheckoutScreen({ lang, onLang, ctx }) {
  const [method, setMethod] = React.useState("card");
  const [address, setAddress] = React.useState("Jabal Al-Weibdeh, Paris Square");
  const items = ctx.cart;
  const total = items.reduce((s, it) => {
    const p = ASWAQ_DATA.PRODUCTS.find((x) => x.id === it.id);
    return s + (p ? p.price * it.qty : 0);
  }, 0);
  const fee = new Set(items.map((it) => { const p = ASWAQ_DATA.PRODUCTS.find((x) => x.id === it.id); return p && p.vendorId; })).size * 2;
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} title={t("Checkout", "الدفع", lang)}
              left={<button className="aw-icon-btn" onClick={() => ctx.back()}><Icon name="back" size={18}flip /></button>} />
      <div className="aswaq-scroll" style={{ padding: "12px 20px 200px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Section title={t("Delivery to", "التوصيل إلى", lang)} lang={lang}>
          <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="pin" size={20} color="var(--accent)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{t("Home", "البيت", lang)}</div>
              <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{address}</div>
            </div>
            <button className="aw-btn ghost" style={{ padding: "4px 6px" }}>{t("Change", "تغيير", lang)}</button>
          </div>
        </Section>

        <Section title={t("Payment method", "وسيلة الدفع", lang)} lang={lang}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PaymentRow method="card" current={method} set={setMethod} icon="bag" label={t("Visa · ending 4421", "فيزا · تنتهي 4421", lang)} sub="Default" lang={lang} />
            <PaymentRow method="cliq" current={method} set={setMethod} icon="globe" label={t("CliQ — Capital Bank", "كليك — البنك العربي", lang)} sub={t("Pay via your bank", "ادفع عبر بنكك", lang)} lang={lang} />
            <PaymentRow method="cash" current={method} set={setMethod} icon="receipt" label={t("Cash on delivery", "نقد عند الاستلام", lang)} sub={t("+0.50 JD service", "+0.50 د.أ رسوم خدمة", lang)} lang={lang} />
          </div>
        </Section>

        <Section title={t("Order summary", "ملخّص الطلب", lang)} lang={lang}>
          <div style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid var(--border)", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <SummaryLine label={t("Subtotal", "المجموع", lang)} value={total.toFixed(2) + " JD"} />
            <SummaryLine label={t("Delivery", "التوصيل", lang)} value={fee.toFixed(2) + " JD"} />
            <SummaryLine label={t("Service", "رسوم خدمة", lang)} value="0.75 JD" />
            <div style={{ height: 1, background: "var(--border)" }} />
            <SummaryLine label={t("Total", "الإجمالي", lang)} value={(total + fee + 0.75).toFixed(2) + " JD"} bold />
          </div>
        </Section>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 24px", background: "var(--cream-50)", borderTop: "1px solid var(--border)" }}>
        <Button kind="primary" full size="lg" onClick={() => ctx.go("confirmed")} icon="check">
          {t(`Place order · ${(total + fee + 0.75).toFixed(2)} JD`, `أكِّد الطلب · ${(total + fee + 0.75).toFixed(2)} د.أ`, lang)}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, lang, children }) {
  return (
    <div>
      <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
function PaymentRow({ method, current, set, icon, label, sub, lang }) {
  const sel = method === current;
  return (
    <div onClick={() => set(method)} style={{ background: "var(--surface)", borderRadius: 16, border: "1px solid " + (sel ? "var(--accent)" : "var(--border)"), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: sel ? "0 0 0 3px var(--surface-tint)" : "none" }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cream-100)", display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={18} color="var(--fg-1)" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{sub}</div>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: 999, border: "2px solid " + (sel ? "var(--accent)" : "var(--cream-400)"), display: "grid", placeItems: "center" }}>
        {sel && <div style={{ width: 10, height: 10, borderRadius: 999, background: "var(--accent)" }} />}
      </div>
    </div>
  );
}
function SummaryLine({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? 16 : 13, fontWeight: bold ? 800 : 500, color: bold ? "var(--fg-1)" : "var(--fg-2)" }}>
      <span>{label}</span>
      <span className="num" style={{ color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{value}</span>
    </div>
  );
}

// ─── ORDER CONFIRMED ─────────────────────────────────────────────────────
function ConfirmedScreen({ lang, onLang, ctx }) {
  React.useEffect(() => { ctx.clearCart(); }, []);
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"} style={{ background: "var(--cream-100)" }}>
      <Header lang={lang} onLang={onLang} />
      <div className="aswaq-scroll" style={{ padding: "32px 24px", textAlign: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: "var(--olive-100)", color: "var(--olive-700)", margin: "20px auto", display: "grid", placeItems: "center", boxShadow: "0 0 0 8px var(--cream-50)" }}>
          <Icon name="check" size={44} stroke={3} />
        </div>
        <div className="aw-eyebrow">{t("Order received", "تمّ استلام الطلب", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 6, color: "var(--fg-1)" }}>
          {t("Shukran. We've told your shops.", "شكراً. أبلغنا متاجرك.", lang)}
        </div>
        <div style={{ marginTop: 12, display: "grid", placeItems: "center" }}><ArchMark size={36} /></div>
        <div style={{ fontSize: 14, color: "var(--fg-2)", marginTop: 10, lineHeight: 1.5, maxWidth: 300, marginInline: "auto" }}>
          {t("Order #A-2461 is on its way. Estimated arrival in 35 minutes.", "الطلب رقم A-2461 في طريقه. الوصول المتوقع خلال 35 دقيقة.", lang)}
        </div>

        <div style={{ background: "var(--surface)", borderRadius: 20, padding: 20, marginTop: 24, textAlign: "start", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{t("Order A-2461", "الطلب A-2461", lang)}</div>
            <span className="aw-badge open">● {t("Confirmed", "مؤكَّد", lang)}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < 1 ? "var(--accent)" : "var(--cream-300)" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "var(--fg-3)", fontWeight: 600 }}>
            <span style={{ color: "var(--accent)" }}>{t("Placed", "تم الطلب", lang)}</span>
            <span>{t("Preparing", "تحضير", lang)}</span>
            <span>{t("Out for delivery", "في الطريق", lang)}</span>
            <span>{t("Delivered", "تم التوصيل", lang)}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
          <Button kind="ink" full size="lg" onClick={() => ctx.go("orders")}>{t("Track this order", "تتبّع الطلب", lang)}</Button>
          <Button kind="ghost" full onClick={() => ctx.nav("home")}>{t("Back to home", "العودة للرئيسية", lang)}</Button>
        </div>
      </div>
    </div>
  );
}

// ─── MY ORDERS ───────────────────────────────────────────────────────────
function OrdersScreen({ lang, onLang, ctx }) {
  const ORDERS = [
    { id: "A-2461", date: t("Today · 11:42a", "اليوم · 11:42ص", lang), vendor: "habibah", status: "preparing", total: 38.75 },
    { id: "A-2401", date: t("Yesterday", "أمس", lang), vendor: "rumi", status: "delivered", total: 13.50 },
    { id: "A-2389", date: t("Sun, 17 May", "الأحد 17 مايو", lang), vendor: "circuit", status: "delivered", total: 142.00 },
  ];
  const stmap = {
    preparing: { en: "Preparing", ar: "تحضير", kind: "open" },
    delivered: { en: "Delivered", ar: "تم التوصيل", kind: "verified" },
    cancelled: { en: "Cancelled", ar: "ملغي", kind: "closed" },
  };
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} />
      <div style={{ padding: "8px 20px 0" }}>
        <div className="aw-eyebrow">{t("History", "السجلّ", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, marginTop: 4, letterSpacing: "-0.02em" }}>
          {t("My orders", "طلباتي", lang)}
        </div>
      </div>
      <div className="aswaq-scroll" style={{ paddingTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 20px" }}>
          {ORDERS.map((o) => {
            const v = ASWAQ_DATA.BUSINESSES.find((b) => b.id === o.vendor);
            const st = stmap[o.status];
            return (
              <div key={o.id} className="aw-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: v.grad, flex: "none" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{(v[lang] || v.en).name}</div>
                    <div className="num" style={{ fontWeight: 800, fontSize: 14, fontFeatureSettings: '"tnum"' }}>{fmtPrice(o.total.toFixed(2), lang)}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-3)", marginTop: 2 }}>#{o.id} · {o.date}</div>
                  <div style={{ marginTop: 8 }}><Badge kind={st.kind}>{t(st.en, st.ar, lang)}</Badge></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AUTH: Login & Register ──────────────────────────────────────────────
function AuthScreen({ lang, onLang, ctx, mode = "login" }) {
  const [m, setM] = React.useState(mode);
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [name, setName] = React.useState("");
  const isLogin = m === "login";
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"} style={{ background: "var(--cream-100)" }}>
      <Header lang={lang} onLang={onLang}
              left={<button className="aw-icon-btn" onClick={() => ctx.nav("home")}><Icon name="close" size={18}/></button>} />
      <div className="aswaq-scroll" style={{ padding: "16px 24px 100px" }}>
        <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
          <img src="../../assets/logo/aswaq-mark.svg" style={{ height: 56 }} />
        </div>
        <div className="aw-eyebrow" style={{ textAlign: "center" }}>{isLogin ? t("Welcome back", "أهلاً بعودتك", lang) : t("Join Aswaq", "انضمّ إلى أسواق", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 28, textAlign: "center", marginTop: 4, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {isLogin ? t("Sign in to Aswaq", "سجّل دخولك إلى أسواق", lang) : t("Create your account", "أنشئ حسابك", lang)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          {!isLogin && <Field label={t("Full name", "الاسم الكامل", lang)} value={name} onChange={setName} placeholder={t("e.g. Yara A.", "مثال: يارا أ.", lang)} lang={lang} />}
          <Field label={t("Email or phone", "البريد أو رقم الهاتف", lang)} value={email} onChange={setEmail} placeholder={isLogin ? "you@example.com" : "+962 7…"} lang={lang} />
          <Field label={t("Password", "كلمة المرور", lang)} type="password" value={pass} onChange={setPass} placeholder="•••••••" lang={lang} />
          {isLogin && <a className="link" style={{ alignSelf: "flex-end", color: "var(--accent)", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>{t("Forgot password?", "نسيت كلمة المرور؟", lang)}</a>}
          <div style={{ marginTop: 4 }}>
            <Button kind="primary" full size="lg" onClick={() => ctx.signIn()}>{isLogin ? t("Sign in", "تسجيل الدخول", lang) : t("Create account", "إنشاء حساب", lang)}</Button>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "20px 0", color: "var(--fg-3)", fontSize: 12, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--border)" }} />
          <span style={{ position: "relative", background: "var(--cream-100)", padding: "0 12px" }}>{t("or", "أو", lang)}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button kind="secondary" full icon="globe">{t("Continue with Google", "المتابعة عبر Google", lang)}</Button>
          <Button kind="secondary" full>{t("Continue with Apple", "المتابعة عبر Apple", lang)}</Button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13.5, color: "var(--fg-2)" }}>
          {isLogin ? t("New here?", "جديد هنا؟", lang) : t("Already have an account?", "لديك حساب؟", lang)}{" "}
          <a onClick={() => setM(isLogin ? "register" : "login")} style={{ color: "var(--accent)", fontWeight: 700, cursor: "pointer" }}>
            {isLogin ? t("Create one", "أنشئ حساب", lang) : t("Sign in", "سجّل دخول", lang)}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── PREMIUM ─────────────────────────────────────────────────────────────
function PremiumScreen({ lang, onLang, ctx, premium }) {
  const features = [
    [t("Compare luxury items", "قارن المنتجات الفاخرة", lang), t("Side-by-side for watches and jewellery", "جنباً إلى جنب للساعات والمجوهرات", lang)],
    [t("Free delivery", "توصيل مجاني", lang), t("On any shop, no minimum", "من أي متجر، بلا حد أدنى", lang)],
    [t("Early access to new shops", "وصول مبكر للمتاجر الجديدة", lang), t("See verified shops before anyone else", "تصفّح المتاجر الموثّقة قبل الجميع", lang)],
    [t("Price drop alerts", "تنبيهات انخفاض الأسعار", lang), t("On items in your favourites", "على المنتجات المحفوظة", lang)],
  ];
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="aswaq-scroll" style={{ paddingBottom: 120 }}>
        {/* Hero */}
        <div style={{ position: "relative", background: "var(--charcoal-600)", color: "var(--cream-50)", padding: "16px 24px 36px" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(201, 150, 51, 0.22), transparent 50%), radial-gradient(circle at 80% 80%, rgba(191, 83, 47, 0.18), transparent 55%)" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button className="aw-icon-btn" onClick={() => ctx.back()} style={{ background: "rgba(253, 251, 246, 0.18)", color: "var(--cream-50)" }}><Icon name="back" size={18}flip /></button>
            <div className="aw-lang"><button className={lang === "en" ? "on" : ""} onClick={() => onLang("en")}>EN</button><button className={lang === "ar" ? "on" : ""} onClick={() => onLang("ar")}>ع</button></div>
          </div>
          <div style={{ position: "relative", marginTop: 24, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: "var(--gold-soft-bg)", display: "grid", placeItems: "center", margin: "0 auto 14px", boxShadow: "0 0 0 6px rgba(201, 150, 51, 0.18)" }}>
              <Icon name="crown" size={32} color="var(--gold-500)" fill="var(--gold-400)" stroke="none" />
            </div>
            <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, background: "rgba(201, 150, 51, 0.18)", color: "var(--gold-300)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{t("Aswaq Premium", "أسواق بريميوم", lang)}</div>
            <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, marginTop: 12, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              {t("Shop the souq like a regular.", "تسوّق السوق كأهل البلد.", lang)}
            </div>
            <div style={{ fontSize: 14, color: "var(--cream-200)", marginTop: 10, lineHeight: 1.55, maxWidth: 320, marginInline: "auto" }}>
              {t("4 JD a month. Cancel anytime. Try free for 7 days.", "4 دنانير شهرياً. ألغِ في أي وقت. جرّب مجاناً لمدة 7 أيام.", lang)}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {features.map(([title, sub], i) => (
            <div key={i} className="aw-card" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--gold-soft-bg)", color: "var(--gold-500)", display: "grid", placeItems: "center", flex: "none" }}>
                <Icon name="check" size={18} stroke={2.6} color="var(--gold-600)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div style={{ padding: "0 20px 16px" }}>
          <div className="aw-eyebrow" style={{ marginBottom: 10 }}>{t("Choose a plan", "اختر باقتك", lang)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <PlanCard period={t("Monthly", "شهري", lang)} price="4 JD" sub={t("Billed monthly", "فوترة شهرية", lang)} lang={lang} />
            <PlanCard period={t("Yearly", "سنوي", lang)} price="36 JD" sub={t("Save 25 %", "وفّر 25٪", lang)} selected lang={lang} />
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 24px", background: "var(--cream-50)", borderTop: "1px solid var(--border)" }}>
        <Button kind="gold" full size="lg" onClick={() => { ctx.upgrade(); ctx.back(); }} icon="crown">
          {premium ? t("You're a Premium member", "أنت عضو بريميوم", lang) : t("Start 7-day free trial", "ابدأ تجربة 7 أيام", lang)}
        </Button>
      </div>
    </div>
  );
}

function PlanCard({ period, price, sub, selected, lang }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 16, padding: 16, border: "1px solid " + (selected ? "var(--accent)" : "var(--border)"), boxShadow: selected ? "0 0 0 3px var(--surface-tint)" : "none", position: "relative" }}>
      {selected && <span style={{ position: "absolute", top: -10, insetInlineEnd: 12, padding: "3px 9px", borderRadius: 999, background: "var(--accent)", color: "var(--accent-fg)", fontSize: 10.5, fontWeight: 700 }}>{t("Best value", "الأفضل", lang)}</span>}
      <div className="aw-eyebrow" style={{ fontSize: 10 }}>{period}</div>
      <div className="num" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, marginTop: 6, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>{price}</div>
      <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ─── PROFILE / "YOU" ─────────────────────────────────────────────────────
function YouScreen({ lang, onLang, ctx, premium }) {
  const rows = [
    { icon: "receipt", en: "My orders", ar: "طلباتي", go: "orders" },
    { icon: "heart",   en: "Saved",     ar: "المحفوظات", nav: "saved" },
    { icon: "pin",     en: "Addresses", ar: "العناوين" },
    { icon: "bag",     en: "Payment methods", ar: "وسائل الدفع" },
    { icon: "store",   en: "Become a seller", ar: "كن بائعاً", go: "owner" },
    { icon: "globe",   en: "Language · العربية / English", ar: "اللغة · العربية / English" },
    { icon: "bell",    en: "Notifications", ar: "الإشعارات" },
    { icon: "alert",   en: "Help & support", ar: "المساعدة" },
  ];
  return (
    <div className="aswaq-app" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Header lang={lang} onLang={onLang} />
      <div className="aswaq-scroll" style={{ padding: "8px 20px 24px" }}>
        <div className="aw-eyebrow">{t("Account", "الحساب", lang)}</div>
        <div style={{ fontFamily: lang === "ar" ? "var(--font-arabic-display)" : "var(--font-display)", fontWeight: lang === "ar" ? 700 : 600, fontSize: 30, marginTop: 4, letterSpacing: "-0.02em" }}>
          {t("Marhaba, Yara", "مرحباً، يارا", lang)}
        </div>

        <div style={{ marginTop: 16, padding: 16, borderRadius: 20, background: premium ? "var(--charcoal-600)" : "var(--surface)", color: premium ? "var(--cream-50)" : "var(--fg-1)", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: premium ? "var(--shadow-md)" : "var(--shadow-xs)", border: premium ? "0" : "1px solid var(--border)" }} onClick={() => ctx.go("premium")}>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: premium ? "var(--gold-soft-bg)" : "var(--surface-tint)", color: premium ? "var(--gold-600)" : "var(--accent)", display: "grid", placeItems: "center", flex: "none" }}>
            <Icon name="crown" size={20} fill="currentColor" stroke="none" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>
              {premium ? t("Aswaq Premium · active", "أسواق بريميوم · مفعّل", lang) : t("Try Aswaq Premium", "جرّب أسواق بريميوم", lang)}
            </div>
            <div style={{ fontSize: 12, color: premium ? "var(--cream-300)" : "var(--fg-3)", marginTop: 2 }}>
              {premium ? t("Next renewal in 28 days · 4 JD", "التجديد بعد 28 يوماً · 4 د.أ", lang) : t("4 JD a month · 7 days free", "4 د.أ شهرياً · 7 أيام مجاناً", lang)}
            </div>
          </div>
          <Icon name="arrowright" size={18} color={premium ? "var(--gold-300)" : "var(--fg-3)"} flip />
        </div>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 4 }}>
          {rows.map((r, i) => (
            <div key={i} onClick={() => r.go ? ctx.go(r.go) : r.nav ? ctx.nav(r.nav) : null}
                 style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", cursor: "pointer", borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--cream-100)", display: "grid", placeItems: "center" }}>
                <Icon name={r.icon} size={18} color="var(--fg-1)" />
              </div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-body)" }}>{t(r.en, r.ar, lang)}</div>
              <Icon name="chev" size={16} color="var(--fg-3)" flip />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CartScreen, CheckoutScreen, ConfirmedScreen, OrdersScreen, AuthScreen, PremiumScreen, YouScreen });
