# Project Brief — Jordanian Local Commerce Super-App

> **⚠️ THE NAME IS NOT DECIDED.** This project has **no chosen name, logo, or tagline yet.** Everything about the brand identity is open and will be negotiated fresh. Throughout this document the product is referred to neutrally as **"the platform."** The existing codebase uses the string **"aswaq"** as a *working placeholder only* (e.g. the auth cookie `aswaq_token`, the cart key `aswaq_cart_v1`, the folder `aswaq-design-system`) — this is **not** an approved name; it is a temporary label that will be renamed once a real name is chosen. Do not treat "aswaq" as the product's name.

> **⚠️ WHAT "START FROM ZERO" MEANS HERE.** This is a **fresh start on the brand, design, and discussion — built on top of an existing working codebase.** Be precise about the three layers:
> - **The code is KEPT as a foundation.** A real, working backend already exists (see §3). We do not throw it away or pretend it doesn't exist — that's why this brief documents it in detail.
> - **The schema is a LIVING STARTING POINT, not frozen.** The existing 14-entity schema is where we *begin*. The vision in §2 will *change and grow* it — the basket optimizer, single-delivery-fee logic, RBAC (employees/roles/permissions), maps/geo-search, and Google-review fields all require new or altered tables. A mature version of this product reaches ~25–40 tables. So every schema change is expected and deliberate, built on top of the current one. The schema is not locked.
> - **The design is a FRESH START, unbound by the placeholder.** The current colors, fonts, and layouts (§7) are a placeholder only. Once the new name/brand is chosen, the design may change completely. The new design is **not** required to resemble the old one. The only constraint on the design is *what the backend can actually serve for v1* — never the look of the previous design.
>
> In one line: **keep the working code, let the schema evolve to serve the vision, start the brand and design fresh — and make every change deliberate, grounded in the current truth recorded here and in `docs/`.**

---

## 0. How to use this document (instructions for the assistant reading it)

- **The brand identity starts from zero.** Name, logo, tagline, and even whether to keep the current colors/fonts are all open for discussion. The owner wants to negotiate the name interactively. Do not assume any name.
- **Code kept, schema living, design fresh.** Keep the existing backend as a foundation; treat the current schema as a starting point that *will* change and grow to serve the vision; treat the current design as a placeholder that the new brand may fully replace. (See the boxed note at the top.) Make every schema or design change deliberate and grounded in the current truth.
- **Ground everything in reality.** Sections 3 and 4 describe what *actually exists* in the codebase (verified by Claude Code). Section 2 and the v2 list describe the *full vision*, parts of which do **not** exist yet. Never design a screen or write a prompt for a feature without first checking which bucket it falls into.
- **Phasing is mandatory.** Every feature is labelled **v1 (works now)** or **v2 (vision / not built)**. v1 is what we polish and ship for the real shop-owner demo. v2 is the roadmap and the investor story.
- **If the owner requests something in the v2 bucket**, flag it as "needs a backend change first" rather than quietly designing a UI that cannot work.
- **Current working mode:** the owner is starting fresh to (a) negotiate the brand/name, (b) design every screen in Claude Design, then (c) hand the approved design to Claude Code to implement the v1 set. This document precedes the brand + design discussion.

---

## 1. The one-line summary

**A bilingual (Arabic-first, RTL), Jordan-focused local commerce super-app that combines three things: cross-market price comparison for everyday goods, local business discovery with reviews and ratings, and multi-vendor ordering — monetized through shopper Premium and business subscriptions.**

Currency is the Jordanian Dinar (JD / د.أ) throughout.

---

## 2. The vision in the owner's own words (summarized)

The platform solves a real problem for people in Jordan and makes money for the owner. It has several pillars:

**Pillar 1 — Cross-market price comparison (the standout feature).** A user searches for a specific standardized good — e.g. "Tiger rice 5kg" or "sugar 3kg" — and sees the price of that exact item at every store (Safeway, HyperMax, Sameh Mall, etc.), sorted from lowest to highest. The user can also enter a **whole shopping list** and get a summary of the cheapest way to buy all of it, then add those items to a cart and order.

**Pillar 2 — Smart multi-vendor cart.** If the cheapest rice is at Safeway and the cheapest sugar is at HyperMax, the user can buy rice from Safeway and sugar from HyperMax in one order. To make this viable as a national-scale operation, there is a **per-shop minimum order value** (each shop's portion must reach a minimum). The owner's stated intent is that **delivery is charged once**, not per shop, because the whole point is to save the user money. *(NOTE: this contradicts what is currently built — see §6. Must be resolved.)*

**Pillar 3 — Business discovery & reviews (Yelp-style).** Businesses register, add their menu/products/prices/photos/description/location. Users browse by **category** (restaurants, cafés, gyms, salons, electronics, perfumes, watches, jewelry, services like gardeners, etc.), search within a **city and neighborhood**, and find the closest ones on a **map**. Every user can **rate and review** a business. The vision also includes **pulling in Google Reviews** alongside native reviews to establish business trustworthiness.

**Pillar 4 — Luxury comparison paywall.** For high-value items (cars, watches, jewelry — roughly items averaging 75+ JD), a user must be **registered/Premium** to compare them. This is a monetization lever.

**Pillar 5 — Seller subscriptions.** Any seller (shop, mall, restaurant, perfume store, watch shop, anyone) registers as a service provider and pays a **monthly or annual plan**; plans differ by features/visibility/verification.

**Pillar 6 — Deep dashboard with Role-Based Access Control (RBAC).** The admin can have **employees**, and define each employee's permissions **per page** (read / edit / add / delete). This is to be done "truly globally and very deeply." *(This is RBAC with granular permissions — the concept the owner referred to but couldn't name.)*

**Pillar 7 — Personalization.** Study how each user browses and uses the platform, and tailor what they see — relevant products, services, and ads — to their interests.

**Pillar 8 — Delivery (future).** Eventually a delivery company / driver-tracking arm. For now, orders are simply prepared by the business/provider with the driver "on the way" — no live tracking.

**Cross-cutting requirements the owner emphasized:**
- Arabic ⇄ English translation throughout, with full RTL.
- **Google login** (OAuth), in addition to email/password.
- Excellent UX and visual craft — "incredible precision, detail, and creativity," because the owner intends to invest in and grow this seriously.
- **Stripe** as the initial payment method (chosen because there's no capital for a heavier PSP).
- Same tech stack and clean monorepo structure as the owner's previous project.

---

## 3. What ACTUALLY EXISTS today — the build (verified)

> This section is authoritative. It is the verified state of the codebase as reported by Claude Code. **This is the MVP. It is production-shaped but is still a prototype** — payments record an "intent" only (no live PSP webhook), some checkout addresses are partly hard-coded, and "verified purchase" on reviews is a placeholder. (Reminder: the "aswaq" strings in code are placeholders, not the chosen name.)

### 3.1 Repository shape — npm-workspaces monorepo

| Path | What |
|---|---|
| `apps/api` | NestJS 11 + TypeORM + PostgreSQL backend (strict TypeScript). Runs at `localhost:3001/api/v1`. Swagger at `/doc` (dev only). |
| `apps/web` | Next.js 16 (App Router) + React 19 + Tailwind v4 + next-intl frontend. Runs at `localhost:3000`. |
| `design/aswaq-design-system` | Handoff bundle from claude.ai/design — HTML/CSS prototypes + chat transcripts the web app was built from. (Folder name is a placeholder.) |

The root `README.md` is partially stale (documents the original 5 modules; the codebase now has 13).

### 3.2 Backend architecture & conventions (`apps/api`)

- **Auth:** global JWT auth via `APP_GUARD` (`JwtAuthGuard`); routes opt out with `@Public()`. Roles enforced with `@Roles()` + `RolesGuard`.
- **Response envelope:** every response wrapped by a `ResponseInterceptor` as `{ data, message: "success" }`. List endpoints return `{ data: { items, meta }, message }` — **`meta` is nested inside `data`**.
- **Exception handling:** `HttpExceptionFilter` + `QueryFailedExceptionFilter` (maps Postgres `23505` unique / `23503` FK / `23502` not-null to clean HTTP errors).
- **BaseEntity (every table):** UUID PK generated in-app via `crypto.randomUUID()`, plus `created/updated/deleted_at` + `created/updated/deleted_by` audit columns and **soft deletes**.
- **BaseRepository.paginate():** shared list logic — free-text search across an allow-list of columns, `sortBy` validated against an allow-list (SQL-injection safe), standard `{ items, meta }` paging. Dependency-free so services stay singletons.
- **Design choice — NO database-level foreign keys** (`createForeignKeyConstraints: false`). Relations are mapped by TypeORM but not enforced in Postgres.
- **Numbers:** money is `NUMERIC(10,2)`, lat/lng is `NUMERIC(9,6)`, both round-tripped through a `NumericTransformer` so they surface as JS numbers.
- **History note:** many code comments reference **"Safeer"** — a prior codebase this one deliberately fixes (await bugs, open CORS, missing validation whitelist, request-scope contagion, SQL identifier injection). This platform is the corrected successor.

### 3.3 Data model — 14 entities

- **User** — email, passwordHash (never selected by default), `role` (shopper / business / admin), `isPremium`.
- **Business** — name, location (new `city_id` / `area_id` refs + deprecated free-text `city`/`area` kept in sync), lat/lng, phone, logo/cover, `isVerified`, `subscriptionTier`, denormalized `ratingAvg` / `reviewCount`, `categoryId`, `ownerId` (ownership = tenant scoping).
- **Product** — name, price, currency, availability, denormalized rating, `businessId`, optional `catalogItemId` (the link that puts it into cross-market comparison).
- **CatalogItem** — the canonical brand+unit good ("Rice 5kg", with `nameAr`, unit, brand) that many products point at.
- **Category** — slug, name/nameAr, icon, `isLuxury` (drives the Premium paywall), sort order.
- **City / Area** — curated bilingual reference tables (slug, name/nameAr, lat/lng) replacing free-text location.
- **Review** — 1–5 rating + comment, on a business and optionally a product.
- **Order / OrderItem** — status (pending / confirmed / cancelled / completed), total, currency, line items with snapshotted name/price.
- **Payment** — purpose (premium upgrade / business subscription / order), status, amount, `providerRef` (opaque PSP ref).
- **SubscriptionPlan / BusinessSubscription** — plans (tier, price, period days) and a business's active subscription window.
- **PriceHistory** — append-only price log per product.
- **Media** — polymorphic (`owner_type` business/product/review) logo/cover/gallery images with sort order.

### 3.4 Backend modules — 13

`auth`, `users`, `businesses`, `categories`, `products`, `reviews`, `orders`, `subscriptions`, `payments`, `media`, `favorites`, `catalog`, `cities`.

**Key transactional business logic:**
- **Products** — create/update runs in a transaction that also writes a `PriceHistory` row whenever price changes, and can inline-create a `CatalogItem`. `compare(ids)` is the paywall: if any product's category `isLuxury` and the user isn't Premium → **HTTP 402**; otherwise returns rows flagged `isCheapest` / `isTopRated`.
- **Catalog** — hand-written aggregation SQL (the paginate helper doesn't compose with aggregates): per-item `MIN(price)` + distinct seller count, with optional city filtering; `findOffers()` lists every seller's offer ascending by price, flagging the cheapest (tie-aware). **This is the cross-market comparison engine.**
- **Orders** — transaction across orders/order_items/products: validates products belong to the business and are available, computes total, **enforces the 25 JD minimum**, snapshots line data. Role-scoped (shoppers see/cancel only their own pending orders; owners see their business's orders).
- **Reviews** — transaction that inserts the review then recomputes denormalized `ratingAvg` / `reviewCount` on the business (and product). Joins the reviewer's name without leaking the user object.
- **Subscriptions** — subscribing deactivates the prior active sub and bumps the business's `subscriptionTier`, in one transaction.
- **Payments** — prototype only: records a `PENDING` intent; a real PSP webhook would later flip status.

### 3.5 Migrations & seed

Five ordered migrations: `InitSchema → MarketplaceData → MediaPriceFavorites → Catalog → Locations`. An idempotent seed creates a demo owner, 3 shoppers, 6 businesses across categories (including luxury watches/jewelry to demo the paywall), 3–4 products each, catalog links, and reviews. Dev uses `DB_SYNCHRONIZE=true`; prod uses migrations via a standalone `data-source.ts`.

### 3.6 Frontend (`apps/web`)

> ⚠️ Uses **Next.js 16** (per `AGENTS.md`, treated as having breaking changes vs older Next; docs live in `node_modules/next/dist/docs/`).

**Routing — all under `src/app/[locale]/`:** Home, search (filter by query/category/city/area), `catalog` + `catalog/[id]` (cross-market comparison), `business/[id]` (+ `new`, `[id]/edit`), `product/[id]`, `compare` (with paywall overlay), `cart`, `checkout`, `orders` + `orders/[id]/confirmed`, `favourites`, `premium`, `account`, `auth`.

**i18n & RTL:** next-intl, locales `en` / `ar` (**default `en`**), middleware in `proxy.ts`, messages in `messages/{en,ar}.json`. Layout flips `dir="rtl"` and swaps font stacks for Arabic (**El Messiri + IBM Plex Sans Arabic**) vs English (**Fraunces + Plus Jakarta Sans**). CSS isolates prices (so "12 JD" never reorders), uses logical `ms-`/`me-` spacing, and `.flip-rtl` mirrors directional icons. *(Fonts/colors are inherited from the placeholder design and are themselves open to change in the brand discussion.)*

**Data layer:**
- `src/lib/api.ts` — typed `apiFetch` that reads the JWT from the `aswaq_token` cookie (placeholder name), unwraps the `{ data, message }` envelope, throws typed `ApiError` / `UnauthorizedError` / `PaywallRequiredError` (402). Exposes a flat `Api` object. Constants: **`SHOP_MINIMUM_JD = 25`**, **`DELIVERY_FEE_PER_SHOP_JD = 2`**.
- `src/lib/server-api.ts` — `serverFetch` / `serverFetchOrNull` for SSR.
- `src/lib/cart-context.tsx` — **client-side cart** in React Context + localStorage (`aswaq_cart_v1`, placeholder name); no server cart. Vendor name snapshotted at add-time.

**UI / design system:** Tailwind v4, warm earthy souq theme — **terracotta primary, cream surfaces, gold accents (status/premium only), charcoal ink, olive (success), pomegranate (danger)** — as tokens in `globals.css`. Mobile-first: sticky `Header` + mobile `BottomNav`. Domain components (business-card, product-card, cart-view, checkout-form, auth-form, business-form, categories, city-area-picker) + a UI primitive kit (button, icon with ~39 SVGs, badge, field, price, star-rating, heart, chip). *(This visual system is the current placeholder; keep, evolve, or replace it in the brand discussion.)*

### 3.7 How the two halves connect

The web app reads `NEXT_PUBLIC_API_URL` and calls the API under `/api/v1`. Auth is a JWT in the `aswaq_token` cookie (placeholder name); CORS is locked to `WEB_ORIGIN`. The signature rule — the luxury-comparison **402 paywall** — is enforced in `ProductService.compare()` and surfaced in the UI as `PaywallRequiredError`, routing the shopper to the Premium page.

---

## 4. v1 vs v2 — the phasing map

> **Rule:** v1 is designed *and* implemented now. v2 is designed (so the vision is whole and demoable as a prototype/pitch) but **implemented later** — it requires backend work that does not exist yet.

### ✅ v1 — works today (design polished, ship for the shop-owner demo)
- Email/password auth (login, register, roles: shopper / business / admin).
- Business discovery by category, city, and area.
- Business profile (menu/products, reviews, ratings, about, save/favourite).
- **Cross-market price comparison** for a single catalog item (every seller's offer, cheapest flagged).
- Product compare (2–4 products) with the **luxury 402 paywall**.
- Reviews & star ratings (native).
- Multi-vendor cart (client-side), per-shop **25 JD minimum**, grouped by vendor.
- Checkout → one order per vendor → confirmation → order history.
- Seller side: create/edit business, manage products, subscription plans.
- Shopper Premium upsell page.
- Full bilingual AR/EN + RTL.

### 🔭 v2 — vision, NOT built yet (design now, implement later)
1. **Whole-list basket optimizer** — enter a full shopping list, get the cheapest combination across stores. *(Engine currently compares one item at a time.)*
2. **Single delivery fee across multiple shops** — owner's intent. *(Currently delivery is per-shop.)* Must be reconciled — see §6.
3. **Google Reviews integration** — show a business's Google rating beside native reviews.
4. **Google login (OAuth).** *(Currently email/password only.)*
5. **Map-based discovery** — "nearest burger places in this area," distance sorting, map pins. *(lat/lng exist; no map UI or geo-search.)*
6. **Deep RBAC dashboard** — admin with employees, per-page permissions (read/edit/add/delete), roles & permissions tables. *(Currently 3 flat roles, no employees, no granular permissions.)*
7. **Personalization / recommendations** — usage-driven tailoring of products, services, and ads per user.
8. **Live Stripe** — real Stripe checkout + webhooks. *(Currently payments record a PENDING intent only.)*
9. **Delivery company / driver tracking** — explicitly future.

---

## 5. The product surfaces (page inventory for design)

Grouped by audience. Each page notes its phase.

### Shopper-facing
- **Splash / brand intro** — logo, tagline, language choice. *(new — design; depends on brand decisions)*
- **Auth** — login, register (with shopper/seller intent), Google login button *(button is v2-wired)*. *(v1 core)*
- **Home / discovery** — category chips, search bar, featured/nearby businesses, entry to price comparison. *(v1)*
- **Search & results** — filter by query / category / city / area; map toggle is v2. *(v1 + v2 map)*
- **Catalog (price comparison)** — search a good → list of items; item detail → every seller's price, cheapest flagged. *(v1)*
- **Basket optimizer** — paste/enter a shopping list → cheapest-basket summary. *(v2)*
- **Business profile** — header (logo/cover, rating, verified/premium badges), tabs: menu/products, reviews, about/location. Native + Google rating *(Google = v2)*. *(v1)*
- **Product detail** — price, availability, add-to-cart, link to compare. *(v1)*
- **Compare** — pick 2–4 products, comparison table, cheapest/top-rated highlights, **luxury paywall overlay**. *(v1)*
- **Cart** — grouped by vendor, per-shop 25 JD minimum warnings, delivery line *(per-shop vs single = §6)*. *(v1)*
- **Checkout** — address, payment (Stripe = v2-live), places one order per vendor. *(v1, partly stubbed)*
- **Order confirmation + order history + order detail.** *(v1)*
- **Favourites.** *(v1)*
- **Premium upsell** — benefits (unlock luxury compare, free delivery, early access, price alerts), plans. *(v1)*
- **Account / profile / settings** — language, premium status, logout. *(v1)*

### Seller-facing
- **Become a seller / register business** — business details, category, location (map = v2), logo/cover. *(v1)*
- **Seller dashboard home** — overview of business, orders, subscription state. *(v1 basic; deepens in v2)*
- **Manage products** — add/edit/remove products, prices (writes price history), link to catalog item, availability. *(v1)*
- **Orders for my shop** — list, status changes (pending → confirmed → completed/cancelled). *(v1)*
- **Subscription** — current plan, available plans, subscribe/cancel. *(v1)*

### Admin-facing
- **Admin dashboard** — manage businesses, categories, catalog items, cities/areas, users, verification. *(partly v1, deepens v2)*
- **RBAC: employees & permissions** — invite employees, assign per-page read/edit/add/delete. *(v2)*

### System states (every screen)
- Empty, loading, and error states; the 402 paywall state; offline/failed-network. *(v1)*

---

## 6. Open decisions that MUST be resolved before/while designing

0. **THE NAME, LOGO & TAGLINE — wholly open.** No name is chosen. The owner will negotiate it interactively. Decide the name first (it shapes the splash, header, and every brand touch), then logo direction and tagline. Until then, refer to the product as "the platform." Note that picking the name triggers a later rename of the "aswaq" placeholder strings in code (cookie, cart key, folder) — a trivial Claude Code chore, not a blocker.
1. **Delivery fee model — THE big contradiction.** Vision says **one delivery fee total** across multiple shops (to save the user money). Build currently charges **2 JD per shop**. These cannot both be true. Pick one, and the cart/checkout design follows. *(Owner leans toward single-fee; this is more user-friendly but reduces margin and complicates logistics — needs a deliberate decision.)*
2. **Per-shop minimum value.** Build uses **25 JD per shop**. Vision example used a smaller figure (~7 JD). Confirm the real minimum.
3. **Default language.** Build defaults to **English**. Audience is Jordanian and product is "Arabic-first." Recommendation: **open in Arabic (RTL) by default**, English as the switch. Confirm.
4. **Whether to keep the current visual system.** Colors (terracotta/cream/gold/charcoal) and fonts (Fraunces/Plus Jakarta/El Messiri/IBM Plex Arabic) are inherited from the placeholder design. Keep, evolve, or replace — part of the brand discussion.
5. **Luxury threshold.** Paywall is currently driven by a category `isLuxury` flag (watches/jewelry). Vision also mentioned a price threshold (~75 JD). Decide: category-based (as built), price-based, or both.
6. **Premium benefits scope.** Which Premium perks are real in v1 (luxury compare unlock) vs marketing-only for now (free delivery, early access, price alerts)? Don't let the Premium page promise unbuilt perks as if live.
7. **Verified purchase & Google ratings on reviews** are placeholders/v2 — design must not imply they're functioning.

---

## 7. Brand & design system (current placeholder — all open to change)

> None of this is locked. It is the look the placeholder build currently has. Treat it as a starting reference for the brand discussion, not a decision.

- **Mood:** warm Levantine souq — earthy, premium-but-approachable, mobile-first.
- **Colors:** terracotta = primary action; cream = surfaces; gold = status/premium only; charcoal = ink; olive = success; pomegranate = danger.
- **Possible gold rule:** keep gold scarce so it signals premium; the "Upgrade to Premium" CTA could be the one sanctioned gold action.
- **Fonts:** English — Fraunces (display) + Plus Jakarta Sans (body). Arabic — El Messiri (display) + IBM Plex Sans Arabic (body).
- **RTL is first-class:** every screen works in both directions; layouts direction-agnostic (logical `ms-`/`me-`, `text-start/end`); prices never reorder; directional icons mirror.
- **Components already defined:** business-card, product-card, star-rating, badges (verified / premium / luxury), tabs, modal (paywall), toast, buttons, inputs, chips, price, heart/favourite.

---

## 8. Tech stack (locked)

- **Monorepo:** npm workspaces.
- **Backend:** NestJS 11, TypeORM, PostgreSQL, strict TypeScript, JWT auth, soft deletes + audit columns, no DB-level FKs (by design), transactional integrity, `{ data, message }` response envelope.
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind v4, next-intl (en/ar, RTL).
- **Payments:** Stripe (intended; currently intent-only stub).
- **Conventions:** `CLAUDE.md` / `AGENTS.md` in repo root define rules — keep it present so assistants don't reinvent conventions. Keep builds green (`npm run build:api && npm run build:web`). Strict TS throughout.

---

## 9. Strategic context (why we build in this order)

- The immediate goal is a **polished, working v1 demo to take to café/grocery/shop owners in Amman** — "walk in and make them an offer they can't refuse." That means v1 screens must look complete and real; v2 screens exist for the vision/investor story but must not masquerade as working.
- Known startup risks already discussed: the **chicken-and-egg problem** (seed one neighborhood/category yourself first so the app isn't empty), **monetization timing** (don't charge small shops before sending them customers — consider free-to-join, charge later), and **price staleness** (someone must keep seller prices fresh, or comparison loses its value).
- Build order recommendation: choose the name/brand → finish/polish v1 → end-to-end test both shopper & seller journeys → deploy a shareable v1 → real owner feedback → then build v2 features one at a time.

---

## 10. Working method for the design phase

1. **Set up the `docs/` folder first** (see §11) so every decision below is recorded as it's made.
2. **Negotiate the name and brand** (interactively, in the new chat) — log the result in `docs/decisions/DECISIONS_LOG.md` and `docs/brand/BRAND.md`.
3. Discuss the product **page by page** and lock every decision — record in `docs/design/DESIGN_NOTES.md`.
4. Resolve the §6 open decisions as they come up — each goes into `DECISIONS_LOG.md`.
5. Produce **one comprehensive Claude Design prompt** covering all screens (v1 + v2), labelled by phase, in both LTR and RTL.
6. Review/approve the design.
7. Hand the approved design to **Claude Code** to implement the **v1 set** against the real API (read `CLAUDE.md` *and* `docs/`, match the real routes, keep builds green, rename the "aswaq" placeholder strings to the chosen name, and update `docs/` as part of the work), with v2 screens kept as the roadmap.

---

## 11. The `docs/` folder — the project's living memory (MANDATORY)

> **This is a permanent, non-negotiable requirement.** The repository must contain a `docs/` folder that records every meaningful detail and decision about the project. It exists so that any fresh Claude Code (or Claude Design) session can read it and stay perfectly consistent — never again re-guessing conventions, business rules, or past decisions. This folder is the project's single source of truth alongside the code.

### 11.1 Why this exists
A prior session lost the thread because `CLAUDE.md` wasn't present and conventions had to be reverse-engineered. `docs/` prevents that permanently: decisions, rules, the real API surface, and the design rationale all live in version-controlled files that travel with the repo.

### 11.2 Required structure
```
docs/
├── PROJECT_BRIEF.md          ← this master file (the entry point; read this first)
├── decisions/
│   └── DECISIONS_LOG.md       ← every locked decision, dated, with the reasoning
├── brand/
│   └── BRAND.md               ← name, logo, tagline, colors, fonts (once chosen)
├── design/
│   └── DESIGN_NOTES.md        ← page-by-page design decisions from the design discussion
├── backend/
│   ├── API_REFERENCE.md       ← the REAL endpoint list, kept in sync with the live API
│   └── DATA_MODEL.md          ← the entities, fields, and relationships
├── business/
│   └── BUSINESS_RULES.md      ← per-shop minimum, delivery-fee model, paywall logic, subscription tiers
└── roadmap/
    └── V1_V2_ROADMAP.md       ← the phasing map; items move v2→v1 here as they ship
```

### 11.3 The discipline that makes it work (read carefully)
- **Update docs as part of doing the work, never after.** When Claude Code implements or changes a feature, the *same task* updates the relevant doc file. A task is not "done" until its docs reflect reality.
- **A stale doc is worse than no doc** — it lies confidently and will mislead the next session. Accuracy over completeness.
- **`API_REFERENCE.md` and `DATA_MODEL.md` must mirror the actual code**, not the plan. They are generated/verified from the live API (`/doc-json`) and the entities — not from memory.
- **`DECISIONS_LOG.md` is append-only and dated.** Every locked choice (the name, the delivery-fee model, the per-shop minimum, the default language, etc.) gets an entry: what was decided, when, and why. Superseded decisions are struck through, not deleted, so the history is visible.
- **`PROJECT_BRIEF.md` is the entry point.** Any new session reads it first; it points to the more detailed files. Keep §3–§4 of it current as features move from v2 to v1.
- **On every significant Claude Code session**, the first step is to read the relevant `docs/` files, and the last step is to update them.

### 11.4 Instruction to assistants
Treat `docs/` as authoritative. Before designing or implementing, consult it. After designing or implementing, update it. If something in `docs/` conflicts with the code, the code is the truth — fix the doc immediately and note the correction in `DECISIONS_LOG.md`.

---

*End of brief. Keep this document in the repo at `/docs/PROJECT_BRIEF.md` as the entry point to the `docs/` folder described in §11. Update §3–§4 whenever the build advances a v2 feature into v1. Replace "the platform" with the real name once chosen, and log that choice in `docs/decisions/DECISIONS_LOG.md`.*
