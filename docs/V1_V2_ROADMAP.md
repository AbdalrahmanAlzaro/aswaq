# V1 / V2 Roadmap

> **Rule:** v1 is designed **and** implemented now (polished for the shop-owner demo). v2 is designed (so the vision is whole for the pitch) but **implemented later** — it needs backend that doesn't exist yet. Items move v2 → v1 here as they ship.

## ✅ v1 — works today / building now (polish & ship)

- Email/password auth (roles: shopper / business / admin).
- Business discovery by category, city, area.
- Business profile (products, reviews, ratings, about, favourite).
- **Cross-market price comparison** for a single catalog item (cheapest flagged).
- Product compare (2–4) with the **luxury 402 paywall** (category OR price ≥ 75 JD).
- Native reviews & star ratings (verified-purchase / Google ratings omitted until real).
- Multi-vendor cart (client-side), 10 JD per-shop minimum, grouped by vendor.
- Checkout → confirmation → order history.
- **Delivery fee — platform zone-based** (Decision #1): one basket-level fee by city/area + service fee + 16% GST.
- Seller side: create/edit business, **logo/cover**, **manage products/menu**, subscription plans.
- Shopper Premium upsell (live perk: unlock luxury compare).
- **Arabic (RTL) default**, English switch — full bilingual.
- **Platform legal pages** — privacy policy + terms of service (static).

## 🔭 v2 — vision, not built (design now, implement later)

1. **Whole-list basket optimizer.**
2. **Distance-based delivery pricing** (km from store → user). *(v1 ships the platform city/area zone fee.)*
3. **Per-business delivery settings** (admin-configurable: own fee, free-delivery threshold, areas served, self-deliver) for direct single-business orders.
4. **Loyalty points** — per-business, admin-configured (earn on orders, redeem later).
5. **Per-business branding** (storefront beyond logo) **+ per-business privacy policy**.
6. **Google Reviews integration.**
7. **Google login (OAuth).**
8. **Map-based discovery / geo-search.**
9. **Deep RBAC dashboard** (admin with employees, per-page permissions) — where platform + business settings are configured.
10. **Personalization / recommendations.**
11. **Live Stripe** (checkout + webhooks).
12. **Delivery company / driver tracking.**
