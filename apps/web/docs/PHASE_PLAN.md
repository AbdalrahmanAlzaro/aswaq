# Phase Plan — Verida design + build

> Approved 2026-06-01. The phased roadmap for designing in **Claude Design** and implementing with **Claude Code**.
> v1 phases are designed **and** implemented (the shop-owner demo). v2 items are designed only (for the pitch) until the backend exists.

## How each phase runs
1. **Author the Claude Design prompt** — fuses (a) the phase's business rules + data model, (b) the adapted example components (RTL + Tailwind v4 + locked tokens), (c) the `docs/brand/BRAND.md` tokens, in Arabic-first / RTL with all required states.
2. **Design + iterate in Claude Design**, then approve.
3. **Claude Code task list** — implement the approved design against the real API (v1), or keep as roadmap (v2).
4. **Update docs** — `DESIGN_NOTES.md` (per-screen), `COMPONENTS.md` (catalog), and any schema flags, as part of the same step.

## Cross-cutting (every screen)
States: default · empty · loading · error · **402 paywall** · offline/failed-network. Arabic (RTL) default, English one-tap switch. Prices use `.price` isolation + tabular figures.

## Phase order (approved)

- **Phase 0 — Foundation, shell & auth (v1)** ← in progress
  Design tokens + primitives (button, field, chip, **badges: verified / premium / luxury**, price, star-rating, heart, toast/alert, modal, tabs, skeleton, the 5 system states), RTL app shell (header + mobile bottom nav), **language switch**, splash/brand intro, auth (login/register with shopper-vs-seller intent; Google button shown, v2-wired).
- **Phase 1 — Shopper discovery (v1)**
  Home/discovery, search & results (map toggle = v2 placeholder), business profile (tabs: products/reviews/about, rating, favourite), product detail.
- **Phase 2 — Price comparison + luxury paywall (v1, standout pillar)**
  Catalog search → item list → item detail (every seller's offer, cheapest flagged); product compare (2–4) with the **402 paywall** (category `isLuxury` OR price ≥ 75 JD) → Premium.
- **Phase 3 — Transaction: cart → checkout → orders (v1)**
  Cart (grouped by vendor, **10 JD** per-shop minimum, **one** basket-level delivery + service + 16% GST), checkout (city/area address; Stripe = "coming soon"; one order per vendor), confirmation, order history, order detail, favourites.
- **Phase 4 — Premium, account & legal (v1)**
  Premium upsell (live perk = unlock luxury compare; others "coming soon"), account/settings (language, premium status, logout), privacy policy + terms (static).
- **Phase 5 — Seller suite (v1)**
  Become a seller / register business (location map = v2; logo/cover upload), dashboard home, manage products/menu (price → price history, link catalog item, availability), orders for my shop (status changes), subscription (plans, subscribe/cancel).
- **Phase 6 — Admin (v1 partial)**
  Admin dashboard: manage businesses, categories, catalog items, cities/areas, users, verification.
- **Phase 7 — v2 vision pack (design-only, marked not-live)**
  Basket optimizer · distance-based delivery · per-business delivery settings · loyalty points · Google reviews · Google login · deep RBAC (employees + per-page permissions) · personalization · live Stripe · driver tracking.

## Separate track
- **Marketing / landing site** — public site + investor story, built from the hero/globe/showcase components. Parked after the v1 product unless reprioritised.

## Schema flags to carry (UI needs backend work — from DATA_MODEL.md "planned additions")
- **Phase 3:** new `DeliveryZone` table; `Order.deliveryFee/serviceFee/taxTotal/taxBreakdown`; `OrderItem.gstRate/taxAmount`; single basket-level fee at the order-**group** level (checkout currently makes one order per vendor).
- **Phase 5/7 (v2):** `BusinessDeliverySettings`, `LoyaltyProgram`, `LoyaltyLedger`, `Business.privacyPolicy`.
- **Phase 2:** comparison engine exists; the compare-table UI is largely net-new.
