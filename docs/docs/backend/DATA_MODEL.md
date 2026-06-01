# Data Model

> Mirrors the verified build described in `../PROJECT_BRIEF.md` §3. **The live TypeORM entities are the source of truth** — this file is regenerated/verified from the code, not memory. If it ever conflicts with the code, the code wins; fix this file and note the correction in `DECISIONS_LOG.md`.
> Last synced from brief: 2026-05-31. Schema is a **living starting point** — it will grow toward the vision (basket optimizer, single-fee delivery, RBAC, geo-search, Google-review fields).

## Conventions

- **BaseEntity** on every table: UUID PK (`crypto.randomUUID()`), `created/updated/deleted_at` + `created/updated/deleted_by` audit columns, **soft deletes**.
- **No DB-level foreign keys** (`createForeignKeyConstraints: false`) — relations mapped in TypeORM, not enforced in Postgres.
- **Numbers:** money = `NUMERIC(10,2)`; lat/lng = `NUMERIC(9,6)`; both via `NumericTransformer` (surface as JS numbers).
- **List responses:** `{ data: { items, meta }, message }` — `meta` is nested inside `data`.

## Entities (~14 core)

- **User** — email, passwordHash (not selected by default), role (shopper / business / admin), isPremium.
- **Business** — name, `city_id`/`area_id` (+ deprecated free-text `city`/`area` kept in sync), lat/lng, phone, logo/cover, isVerified, subscriptionTier, denormalized ratingAvg/reviewCount, categoryId, ownerId (tenant scope).
- **Product** — name, price, currency, availability, denormalized rating, businessId, optional `catalogItemId` (links into cross-market comparison).
- **CatalogItem** — canonical brand+unit good (name, nameAr, unit, brand); many products point at one.
- **Category** — slug, name/nameAr, icon, `isLuxury` (drives the paywall), sort order.
- **City / Area** — curated bilingual reference (slug, name/nameAr, lat/lng).
- **Review** — 1–5 rating + comment; on a business, optionally a product.
- **Order / OrderItem** — status (pending/confirmed/cancelled/completed), total, currency, line items with snapshotted name/price.
- **Payment** — purpose (premium / subscription / order), status, amount, providerRef.
- **SubscriptionPlan / BusinessSubscription** — plans (tier, price, period days) + a business's active subscription window.
- **PriceHistory** — append-only price log per product.
- **Media** — polymorphic (`owner_type` business/product/review) logo/cover/gallery with sort order.

## Key transactional logic (brief §3.4)

- **Products:** create/update in a transaction that writes a `PriceHistory` row on price change; can inline-create a `CatalogItem`.
- **Catalog (the comparison engine):** hand-written aggregation SQL — per-item `MIN(price)` + distinct seller count (+ optional city filter); `findOffers()` lists every seller ascending by price, flagging the cheapest (tie-aware).
- **ProductService.compare(ids):** luxury paywall → **HTTP 402** if any product's category `isLuxury` and the user isn't Premium; otherwise flags `isCheapest` / `isTopRated`.
- **Orders:** transaction; validates products belong to the business and are available; computes total; **enforces the per-shop minimum**; snapshots line data; role-scoped.
- **Reviews:** transaction — insert then recompute denormalized ratingAvg/reviewCount.
- **Subscriptions:** deactivate prior active sub + bump tier, in one transaction.
- **Payments:** prototype — records a `PENDING` intent only (no live PSP webhook yet).

---

## Planned additions — Decision #1 (delivery fee), 2026-05-31

> Schema changes to implement the locked delivery-fee model. Reconcile with live entities when built.

- **DeliveryZone** (new): keyed by `area_id` (and/or `city_id`), a delivery `rate` (NUMERIC(10,2)), active flag. v1 source of the per-basket delivery fee. (v2 adds distance-based pricing alongside.)
- **Order — new fields:** `deliveryFee`, `serviceFee`, `taxTotal`, `taxBreakdown` (per-line GST). Delivery/service/tax modeled **once per basket/checkout** — since checkout creates one order per vendor, attach the single basket-level delivery + service + tax to the checkout/order-group (or a primary order), not duplicated per vendor.
- **OrderItem — new fields:** `gstRate` (the item's GST class) and `taxAmount`.
- **Tax:** GST 16% on delivery & service; goods at their own rate (many staples exempt/reduced).

---

## Planned additions — merchant-platform scope (Decision #1 extension), 2026-05-31

> Admin-configurable per-business settings + loyalty. Reconcile with live entities when built. (See also the DeliveryZone addition above.)

- **BusinessDeliverySettings** (new, v2): per `business_id` — own `deliveryFee`, `freeDeliveryThreshold`, served areas, `selfDeliver` toggle, active flag. Applies to **direct single-business orders**; the platform `DeliveryZone` fee applies to multi-vendor cross-market baskets.
- **LoyaltyProgram** (new, v2): per `business_id` — earn rate, redemption rules, active flag.
- **LoyaltyLedger** (new, v2): per `user_id` + `business_id` — points balance + accrual/redemption entries (append-only).
- **Business — new field:** `privacyPolicy` (text). Storefront branding fields (beyond logo) TBD.
- **Platform settings:** delivery zones/rates, service fee, GST rate — admin-configurable (platform admin).
- **Note:** logo/cover + product-menu management already exist (Business/Media + products module).
