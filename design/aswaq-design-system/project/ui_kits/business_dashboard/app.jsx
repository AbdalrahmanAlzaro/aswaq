// Aswaq business owner dashboard — components + screens
// Single-file for the dashboard kit; loaded as one Babel script.

const { useState } = React;

// Icons (shared style with mobile kit, kept local so the dashboard can be opened standalone)
const I = {
  home: <path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>,
  store: <><path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18"/><path d="M9 20v-6h6v6"/></>,
  package: <><path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>,
  receipt: <><path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  chart: <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-7"/>,
  star: <path d="M12 2l3 7h7l-5.5 4 2 8L12 17l-6.5 4 2-8L2 9h7z"/>,
  crown: <path d="M3 7 L7 11 L12 5 L17 11 L21 7 L19 18 H5 Z"/>,
  cog: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7.1 4.6l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3z"/><path d="M9 19a3 3 0 0 0 6 0"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  edit: <path d="M16 3l5 5-12 12H4v-5zM13 6l5 5"/>,
  trash: <><path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 20h16"/></>,
  more: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
  check: <path d="M5 12l5 5 9-10"/>,
  arrowup: <path d="M12 19V5M5 12l7-7 7 7"/>,
  arrowdown: <path d="M12 5v14M19 12l-7 7-7-7"/>,
  truck: <><path d="M2 7h11v10H2zM13 10h5l3 3v4h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
};
function Ico({ name, size = 18, stroke = 2, fill = "none", color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{I[name] || null}</svg>;
}

// Mock data — for "Café Rumi"
const PRODUCTS = [
  { id: "p1", name: "V60 single origin, Yirgacheffe", price: 4.5, stock: "In stock", sold: 142, photos: 3, grad: "linear-gradient(135deg, #8a611b, #2b251f)" },
  { id: "p2", name: "Espresso blend, 250g",           price: 9,    stock: "In stock", sold: 86,  photos: 4, grad: "linear-gradient(135deg, #a64223, #3b170c)" },
  { id: "p3", name: "Iced shakerato",                 price: 3.5,  stock: "In stock", sold: 412, photos: 2, grad: "linear-gradient(135deg, #d2c0a1, #4a4339)" },
  { id: "p4", name: "Cheese kunafa slice",            price: 3.5,  stock: "Out",      sold: 38,  photos: 1, grad: "linear-gradient(135deg, #ecb9a1, #c99633)" },
  { id: "p5", name: "Olive-oil scone",                price: 2.5,  stock: "Low",      sold: 24,  photos: 2, grad: "linear-gradient(135deg, #c99633, #6e7331)" },
];
const ORDERS = [
  { id: "A-2461", customer: "Yara A.",      items: 3, total: 38.75,  when: "11:42a today",   status: "new" },
  { id: "A-2459", customer: "Omar K.",      items: 1, total: 4.50,   when: "11:18a today",   status: "preparing" },
  { id: "A-2452", customer: "Lina A.",      items: 2, total: 13.50,  when: "10:02a today",   status: "preparing" },
  { id: "A-2447", customer: "Rana S.",      items: 4, total: 28.00,  when: "Yesterday 8:14p",status: "delivered" },
  { id: "A-2441", customer: "Tarek M.",     items: 2, total: 9.00,   when: "Yesterday 5:33p",status: "delivered" },
  { id: "A-2435", customer: "Hala N.",      items: 1, total: 4.50,   when: "Yesterday 11:02a",status: "cancelled" },
];
const REVIEWS = [
  { author: "Omar K.",  rating: 5, when: "2 days ago",  body: "Best V60 in Amman, the barista is patient and the playlist is great." },
  { author: "Lina A.",  rating: 4, when: "1 week ago",  body: "Loved the kunafa but the queue at 11a was steep — maybe two registers?" },
  { author: "Hala N.",  rating: 5, when: "2 weeks ago", body: "I work from here every Thursday. Service is consistently warm." },
];

function STATUS_BADGE({ status }) {
  const m = {
    new:        { en: "New",        ar: "جديد",       kind: "brand" },
    preparing:  { en: "Preparing",  ar: "تحضير",      kind: "warn" },
    delivered:  { en: "Delivered",  ar: "تم التوصيل", kind: "success" },
    cancelled:  { en: "Cancelled",  ar: "ملغي",       kind: "danger" },
  };
  const s = m[status] || m.new;
  return <span className={"bdg dot " + s.kind}>{s.en}</span>;
}

// ─── App shell ────────────────────────────────────────────────
function Dashboard({ initialPage = "overview", lang: initialLang = "en" }) {
  const [page, setPage] = useState(initialPage);
  const [lang, setLang] = useState(initialLang);
  const tr = (en, ar) => lang === "ar" ? ar : en;

  return (
    <div className="dash" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Side page={page} setPage={setPage} tr={tr} />
      <main className="dash-main">
        <Top page={page} lang={lang} setLang={setLang} tr={tr} />
        <div className="dash-body">
          {page === "overview"   && <Overview tr={tr} setPage={setPage} />}
          {page === "products"   && <Products tr={tr} />}
          {page === "orders"     && <Orders tr={tr} />}
          {page === "reviews"    && <Reviews tr={tr} />}
          {page === "business"   && <BusinessProfile tr={tr} />}
          {page === "subscription" && <Subscription tr={tr} />}
          {page === "settings"   && <SettingsStub tr={tr} />}
        </div>
      </main>
    </div>
  );
}

function Side({ page, setPage, tr }) {
  const items = [
    { id: "overview",    icon: "home",    en: "Overview",     ar: "نظرة عامة" },
    { id: "orders",      icon: "receipt", en: "Orders",       ar: "الطلبات", count: "3 new" },
    { id: "products",    icon: "package", en: "Products",     ar: "المنتجات", count: PRODUCTS.length },
    { id: "reviews",     icon: "star",    en: "Reviews",      ar: "المراجعات" },
    { id: "business",    icon: "store",   en: "My business",  ar: "متجري" },
    { id: "subscription",icon: "crown",   en: "Subscription", ar: "الباقة" },
    { id: "settings",    icon: "cog",     en: "Settings",     ar: "الإعدادات" },
  ];
  return (
    <aside className="dash-side">
      <div className="brand">
        <img src="../../assets/logo/aswaq-mark.svg" alt="" />
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--cream-50)", letterSpacing: "-0.01em" }}>Aswaq</span>
        <span className="sub">Sellers</span>
      </div>
      <div className="group-label">{tr("Manage", "إدارة")}</div>
      {items.map((it) => (
        <button key={it.id} className={"nav-item" + (page === it.id ? " on" : "")} onClick={() => setPage(it.id)}>
          <Ico name={it.icon} size={17} />
          <span>{tr(it.en, it.ar)}</span>
          {it.count && <span className="count">{it.count}</span>}
        </button>
      ))}
      <div className="footer">
        <div className="me">
          <div className="av">R</div>
          <div>
            <div className="who">{tr("Café Rumi", "مقهى رومي")}</div>
            <div className="biz">{tr("Owner · since 2024", "مالك · منذ 2024")}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Top({ page, lang, setLang, tr }) {
  const labels = {
    overview: tr("Overview", "نظرة عامة"),
    products: tr("Products", "المنتجات"),
    orders: tr("Orders", "الطلبات"),
    reviews: tr("Reviews", "المراجعات"),
    business: tr("My business", "متجري"),
    subscription: tr("Subscription", "الباقة"),
    settings: tr("Settings", "الإعدادات"),
  };
  return (
    <header className="dash-top">
      <div className="crumbs">
        <span>{tr("Café Rumi", "مقهى رومي")}</span>
        <span style={{ color: "var(--fg-mute)" }}>/</span>
        <b>{labels[page]}</b>
      </div>
      <div className="right">
        <div className="search">
          <Ico name="search" size={15} color="var(--fg-2)" />
          <input placeholder={tr("Search orders, products, customers…", "ابحث في الطلبات والمنتجات…")} />
        </div>
        <div style={{ display: "inline-flex", background: "var(--cream-200)", padding: 3, borderRadius: 999 }}>
          <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "var(--charcoal-600)" : "transparent", color: lang === "en" ? "var(--cream-50)" : "var(--fg-2)", border: 0, padding: "5px 12px", borderRadius: 999, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>EN</button>
          <button onClick={() => setLang("ar")} style={{ background: lang === "ar" ? "var(--charcoal-600)" : "transparent", color: lang === "ar" ? "var(--cream-50)" : "var(--fg-2)", border: 0, padding: "5px 12px", borderRadius: 999, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>ع</button>
        </div>
        <button className="icon-btn"><Ico name="bell" size={16} /><span className="dot"/></button>
      </div>
    </header>
  );
}

// ─── Overview ─────────────────────────────────────────────────
function Overview({ tr, setPage }) {
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("Sabah el-kheir, Rumi.", "صباح الخير، رومي.")}</h1>
          <div className="sub">{tr("Here's how your shop is doing today — 11 May.", "إليك أداء متجرك اليوم — 11 مايو.")}</div>
        </div>
        <div className="actions">
          <button className="btn secondary"><Ico name="receipt" size={15} />{tr("View orders", "عرض الطلبات")}</button>
          <button className="btn primary" onClick={() => setPage("products")}><Ico name="plus" size={15} />{tr("Add product", "إضافة منتج")}</button>
        </div>
      </div>

      <div className="kpi">
        <Tile label={tr("Orders today", "طلبات اليوم")} num="38" delta="+12 %" dir="up" tr={tr} />
        <Tile label={tr("Revenue", "الإيرادات")} num="312 JD" delta="+8 %" dir="up" tr={tr} />
        <Tile label={tr("Avg rating", "متوسّط التقييم")} num="4.7" delta="+0.1" dir="up" tr={tr} />
        <Tile label={tr("Cancelled", "ملغاة")} num="2" delta="−1" dir="down" tr={tr} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><h3>{tr("Revenue · last 14 days", "الإيرادات · آخر 14 يوماً")}</h3><span className="meta">312 JD {tr("today", "اليوم")}</span></div>
          <div className="card-pad"><RevenueSpark /></div>
        </div>
        <div className="card">
          <div className="card-head"><h3>{tr("Top products", "المنتجات الأعلى مبيعاً")}</h3></div>
          <div>
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", borderBottom: i < 3 ? "1px solid var(--border)" : "0" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: p.grad, flex: "none" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--fg-1)" }}>{p.name}</div>
                  <div className="muted">{p.sold} {tr("sold", "بيع")}</div>
                </div>
                <div className="num" style={{ fontWeight: 700, fontSize: 14 }}>{(p.price * p.sold).toFixed(0)} JD</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <div className="card">
        <div className="card-head"><h3>{tr("New orders", "الطلبات الجديدة")}</h3><a className="btn ghost sm" onClick={() => setPage("orders")} style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 600 }}>{tr("See all", "عرض الكل")} →</a></div>
        <OrdersTable rows={ORDERS.slice(0, 3)} tr={tr} />
      </div>
    </>
  );
}

function Tile({ label, num, delta, dir, tr }) {
  return (
    <div className="tile">
      <div className="label">{label}</div>
      <div className="num">{num}</div>
      <span className={"delta " + dir}><Ico name={dir === "up" ? "arrowup" : "arrowdown"} size={11} stroke={3} /> {delta}</span>
    </div>
  );
}

function RevenueSpark() {
  const data = [120, 180, 140, 220, 190, 260, 230, 310, 280, 340, 290, 360, 330, 312];
  const max = Math.max(...data);
  const w = 600, h = 160, pad = 8;
  const points = data.map((v, i) => [
    pad + i * ((w - pad * 2) / (data.length - 1)),
    h - pad - (v / max) * (h - pad * 2)
  ]);
  const path = points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = path + ` L${points.at(-1)[0]},${h} L${points[0][0]},${h} Z`;
  return (
    <div className="spark">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bf532f" stopOpacity="0.22"/>
            <stop offset="1" stopColor="#bf532f" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill="url(#sparkfill)" />
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={points.at(-1)[0]} cy={points.at(-1)[1]} r="4" fill="var(--accent)" stroke="var(--cream-50)" strokeWidth="2"/>
      </svg>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────
function Products({ tr }) {
  const [filter, setFilter] = useState("all");
  const rows = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.stock === "Out");
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("Products", "المنتجات")}</h1>
          <div className="sub">{tr("Manage what shoppers see on your storefront.", "إدارة ما يظهر للمتسوّقين في متجرك.")}</div>
        </div>
        <div className="actions">
          <button className="btn secondary"><Ico name="upload" size={15} />{tr("Import CSV", "استيراد CSV")}</button>
          <button className="btn primary"><Ico name="plus" size={15} />{tr("Add product", "إضافة منتج")}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <button onClick={() => setFilter("all")} className={"btn " + (filter === "all" ? "ink" : "secondary") + " sm"}>{tr("All", "الكل")} · {PRODUCTS.length}</button>
        <button className="btn secondary sm">{tr("In stock", "متوفّر")} · 3</button>
        <button onClick={() => setFilter("out")} className={"btn " + (filter === "out" ? "ink" : "secondary") + " sm"}>{tr("Out", "نافد")} · 1</button>
        <button className="btn secondary sm">{tr("Low stock", "منخفض")} · 1</button>
        <div className="search" style={{ marginInlineStart: "auto", padding: "7px 12px", border: "1px solid var(--border)", borderRadius: 10, background: "var(--surface)", display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
          <Ico name="search" size={14} color="var(--fg-2)" />
          <input placeholder={tr("Search products", "ابحث في المنتجات")} style={{ border: 0, background: "transparent", outline: "none", flex: 1, fontSize: 13 }}/>
        </div>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: "44%" }}>{tr("Product", "المنتج")}</th>
              <th>{tr("Price", "السعر")}</th>
              <th>{tr("Stock", "المخزون")}</th>
              <th>{tr("Sold (30d)", "مبيعات (30ي)")}</th>
              <th>{tr("Photos", "الصور")}</th>
              <th style={{ width: 110, textAlign: "end" }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="img-thumb" style={{ background: p.grad }}/>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--fg-1)" }}>{p.name}</div>
                      <div className="muted">#{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="num">{p.price.toFixed(2)} JD</td>
                <td>
                  {p.stock === "In stock" && <span className="bdg success dot">{tr("In stock", "متوفّر")}</span>}
                  {p.stock === "Low"      && <span className="bdg warn dot">{tr("Low", "منخفض")}</span>}
                  {p.stock === "Out"      && <span className="bdg danger dot">{tr("Out", "نافد")}</span>}
                </td>
                <td className="num">{p.sold}</td>
                <td>{p.photos}</td>
                <td style={{ textAlign: "end" }}>
                  <button className="icon-btn" style={{ width: 30, height: 30 }}><Ico name="edit" size={14}/></button>
                  <button className="icon-btn" style={{ width: 30, height: 30, marginInlineStart: 6 }}><Ico name="more" size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Orders ───────────────────────────────────────────────────
function Orders({ tr }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? ORDERS : ORDERS.filter((o) => o.status === tab);
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("Orders", "الطلبات")}</h1>
          <div className="sub">{tr("Three new orders waiting to be accepted.", "ثلاثة طلبات جديدة بانتظار القبول.")}</div>
        </div>
        <div className="actions">
          <button className="btn secondary"><Ico name="truck" size={15} />{tr("Manage couriers", "إدارة المندوبين")}</button>
          <button className="btn primary"><Ico name="check" size={15} />{tr("Accept all new", "قبول الكل")}</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["all", "All", "الكل", ORDERS.length],
          ["new", "New", "جديد", 1],
          ["preparing", "Preparing", "تحضير", 2],
          ["delivered", "Delivered", "تم التوصيل", 2],
          ["cancelled", "Cancelled", "ملغي", 1]].map(([id, en, ar, c]) => (
          <button key={id} onClick={() => setTab(id)} className={"btn " + (tab === id ? "ink" : "secondary") + " sm"}>
            {tr(en, ar)} · {c}
          </button>
        ))}
      </div>

      <div className="card">
        <OrdersTable rows={filtered} tr={tr} />
      </div>
    </>
  );
}
function OrdersTable({ rows, tr }) {
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>{tr("Order", "الطلب")}</th>
          <th>{tr("Customer", "العميل")}</th>
          <th>{tr("Items", "العناصر")}</th>
          <th>{tr("Total", "الإجمالي")}</th>
          <th>{tr("When", "الوقت")}</th>
          <th>{tr("Status", "الحالة")}</th>
          <th style={{ width: 140, textAlign: "end" }}></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((o) => (
          <tr key={o.id}>
            <td><b>#{o.id}</b></td>
            <td>{o.customer}</td>
            <td className="num">{o.items}</td>
            <td className="num"><b>{o.total.toFixed(2)} JD</b></td>
            <td className="muted">{o.when}</td>
            <td><STATUS_BADGE status={o.status}/></td>
            <td style={{ textAlign: "end" }}>
              {o.status === "new"
                ? <><button className="btn primary sm">{tr("Accept", "قبول")}</button> <button className="btn secondary sm">{tr("Decline", "رفض")}</button></>
                : <button className="btn secondary sm">{tr("View", "عرض")}</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Reviews ──────────────────────────────────────────────────
function Reviews({ tr }) {
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("Reviews", "المراجعات")}</h1>
          <div className="sub">{tr("Replies show publicly under each review. Keep it warm.", "الردود تظهر علناً تحت كل مراجعة. حافظ على الدفء.")}</div>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card card-pad">
          <div className="label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)" }}>{tr("Overall", "إجمالي")}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 40, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--fg-1)" }}>4.7</span>
            <span style={{ color: "var(--gold-400)", fontSize: 18 }}>★★★★★</span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>312 {tr("reviews", "مراجعة")} · {tr("+12 this month", "+12 هذا الشهر")}</div>
        </div>
        <div className="card card-pad">
          <div className="label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)" }}>{tr("Reply rate", "نسبة الرد")}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32, marginTop: 8, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>92 %</div>
          <div className="muted" style={{ marginTop: 6 }}>{tr("Within 48 hours", "خلال 48 ساعة")}</div>
        </div>
        <div className="card card-pad">
          <div className="label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-3)" }}>{tr("Verified-order share", "نسبة الموثّقة")}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32, marginTop: 8, color: "var(--fg-1)", fontFeatureSettings: '"tnum"' }}>88 %</div>
          <div className="muted" style={{ marginTop: 6 }}>{tr("Of recent reviews", "من المراجعات الأخيرة")}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>{tr("Recent", "الأحدث")}</h3></div>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ padding: "18px 22px", borderBottom: i < REVIEWS.length - 1 ? "1px solid var(--border)" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: "linear-gradient(135deg, var(--terracotta-300), var(--gold-300))", color: "var(--cream-50)", fontWeight: 700, fontSize: 13, display: "grid", placeItems: "center" }}>{r.author[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.author}</div>
                <div className="muted">{r.when}</div>
              </div>
              <span style={{ color: "var(--gold-400)" }}>{"★".repeat(r.rating)}</span>
            </div>
            <div style={{ fontSize: 14, marginTop: 8, color: "var(--fg-1)", lineHeight: 1.55 }}>{r.body}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button className="btn secondary sm">{tr("Reply", "رد")}</button>
              <button className="btn ghost sm">{tr("Flag as off-topic", "علّم كغير ذي صلة")}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Business profile ─────────────────────────────────────────
function BusinessProfile({ tr }) {
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("My business", "متجري")}</h1>
          <div className="sub">{tr("What shoppers see on your public profile.", "ما يراه المتسوّقون في ملفك العام.")}</div>
        </div>
        <div className="actions">
          <button className="btn secondary">{tr("Preview public profile", "معاينة الملف العام")}</button>
          <button className="btn primary"><Ico name="check" size={15}/>{tr("Save changes", "حفظ التغييرات")}</button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-pad">
          <h3 style={{ margin: 0, fontSize: 14 }}>{tr("Basics", "الأساسيات")}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <DashField label={tr("Business name", "اسم المتجر")} value="Café Rumi" />
            <DashField label={tr("Category", "الفئة")} value={tr("Café", "مقهى")} />
            <DashField label={tr("Phone", "الهاتف")} value="+962 7 7123 4567" />
            <DashField label={tr("Email", "البريد")} value="hello@caferumi.jo" />
            <DashField label={tr("Neighbourhood", "المنطقة")} value={tr("Jabal Al-Weibdeh", "جبل اللويبدة")} />
            <DashField label={tr("Hours", "ساعات العمل")} value={tr("8:00 am — 11:00 pm", "8:00 ص — 11:00 م")} />
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "var(--fg-2)", fontWeight: 600, marginBottom: 6 }}>{tr("Tagline", "وصف قصير")}</div>
            <input value={tr("Specialty filter, slow mornings", "قهوة مختصة وصباحات هادئة")}
                   readOnly
                   style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", fontSize: 14, background: "var(--cream-50)" }}/>
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ margin: 0, fontSize: 14 }}>{tr("Verification", "التوثيق")}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <Ico name="check" size={20} color="var(--olive-500)" stroke={3}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tr("Owner-verified", "موثَّق")}</div>
              <div className="muted">{tr("ID checked · April 2024", "تم التحقق · أبريل 2024")}</div>
            </div>
            <span className="bdg success dot">{tr("Active", "مفعّل")}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
            <Ico name="crown" size={20} color="var(--gold-500)" fill="var(--gold-400)" stroke="none"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tr("Premium seller plan", "باقة بريميوم")}</div>
              <div className="muted">{tr("Includes featured placement, lower fees", "تتضمن ظهور مميّز ورسوم أقل")}</div>
            </div>
            <span className="bdg warn dot">{tr("Not active", "غير مفعّل")}</span>
          </div>
          <button className="btn gold" style={{ marginTop: 12, width: "100%" }}><Ico name="crown" size={15} fill="currentColor" stroke="none"/>{tr("Upgrade to Premium", "ترقية إلى بريميوم")}</button>
        </div>
      </div>
    </>
  );
}
function DashField({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <input defaultValue={value} style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", fontSize: 14, background: "var(--cream-50)" }}/>
    </div>
  );
}

// ─── Subscription ─────────────────────────────────────────────
function Subscription({ tr }) {
  return (
    <>
      <div className="page-head">
        <div className="title-block">
          <h1>{tr("Subscription", "الباقة")}</h1>
          <div className="sub">{tr("Choose how Aswaq charges you. Switch plans anytime.", "اختر طريقة احتساب رسوم أسواق. يمكنك التبديل في أي وقت.")}</div>
        </div>
      </div>

      <div className="grid-3">
        <PlanCard
          name={tr("Souq", "السوق")}
          price={tr("0 JD/mo", "0 د.أ/شهر")}
          fee={tr("8 % per order", "8٪ لكل طلب")}
          features={[
            tr("Up to 20 products", "حتى 20 منتج"),
            tr("Aswaq review collection", "جمع المراجعات"),
            tr("Email support", "دعم بالبريد"),
          ]}
          tr={tr}
        />
        <PlanCard
          name={tr("Souq +", "سوق +")}
          price={tr("24 JD/mo", "24 د.أ/شهر")}
          fee={tr("5 % per order", "5٪ لكل طلب")}
          features={[
            tr("Unlimited products", "منتجات غير محدودة"),
            tr("Promo banners + featured", "إعلانات مميّزة"),
            tr("Priority chat support", "دعم محادثة بأولوية"),
            tr("Custom delivery rules", "قواعد توصيل مخصّصة"),
          ]}
          highlighted
          tr={tr}
        />
        <PlanCard
          name={tr("Aswaq Premium Seller", "بائع بريميوم")}
          price={tr("60 JD/mo", "60 د.أ/شهر")}
          fee={tr("3 % per order", "3٪ لكل طلب")}
          features={[
            tr("Everything in Souq +", "كل ميزات سوق +"),
            tr("Top of search in your category", "أعلى نتائج فئتك"),
            tr("Compare-eligible (luxury)", "مؤهّل للمقارنة")
,           tr("Dedicated account manager", "مدير حساب مخصّص"),
          ]}
          dark
          tr={tr}
        />
      </div>

      <div className="card" style={{ marginTop: 20, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <Ico name="receipt" size={28} color="var(--fg-2)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{tr("Next invoice", "الفاتورة التالية")}</div>
          <div className="muted">{tr("Souq plan · billed at end of month", "باقة السوق · فوترة نهاية الشهر")}</div>
        </div>
        <div className="num" style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24 }}>24.80 JD</div>
        <button className="btn secondary">{tr("View invoices", "عرض الفواتير")}</button>
      </div>
    </>
  );
}
function PlanCard({ name, price, fee, features, highlighted, dark, tr }) {
  const style = dark
    ? { background: "var(--charcoal-600)", color: "var(--cream-100)", border: "0" }
    : highlighted
    ? { background: "var(--surface)", border: "2px solid var(--accent)", boxShadow: "0 0 0 4px var(--surface-tint)" }
    : { background: "var(--surface)", border: "1px solid var(--border)" };
  return (
    <div style={{ ...style, borderRadius: 20, padding: 24, position: "relative" }}>
      {highlighted && <span style={{ position: "absolute", top: -12, insetInlineStart: 20, padding: "3px 10px", borderRadius: 999, background: "var(--accent)", color: "var(--accent-fg)", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>{tr("Current", "حاليّاً")}</span>}
      {dark && <Ico name="crown" size={22} color="var(--gold-400)" fill="var(--gold-400)" stroke="none"/>}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, marginTop: dark ? 8 : 0, letterSpacing: "-0.01em" }}>{name}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
        <span style={{ fontWeight: 800, fontSize: 22, fontFeatureSettings: '"tnum"' }}>{price}</span>
      </div>
      <div style={{ fontSize: 12.5, opacity: 0.7, marginTop: 2 }}>{fee}</div>
      <div style={{ height: 1, background: dark ? "rgba(253, 251, 246, 0.12)" : "var(--border)", margin: "16px 0" }}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "flex-start" }}>
            <Ico name="check" size={15} color={dark ? "var(--gold-400)" : "var(--olive-500)"} stroke={3}/>
            <span>{f}</span>
          </div>
        ))}
      </div>
      <button className={"btn " + (highlighted ? "secondary" : dark ? "gold" : "ink")} style={{ marginTop: 18, width: "100%" }}>
        {highlighted ? tr("Manage", "إدارة") : dark ? tr("Upgrade", "ترقية") : tr("Switch to this plan", "التبديل إلى هذه الباقة")}
      </button>
    </div>
  );
}

function SettingsStub({ tr }) {
  return (
    <>
      <div className="page-head"><div className="title-block"><h1>{tr("Settings", "الإعدادات")}</h1><div className="sub">{tr("Account, team, notifications.", "الحساب والفريق والإشعارات.")}</div></div></div>
      <div className="card card-pad muted">{tr("Settings UI lives here. Stubbed for the kit preview.", "تواجد إعدادات الحساب هنا. مُختصرة في معاينة الكِت.")}</div>
    </>
  );
}

window.Dashboard = Dashboard;
