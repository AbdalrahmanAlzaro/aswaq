# Business Rules

> Decided rules are dated. Pending items reference `../PROJECT_BRIEF.md` §6 and `../decisions/DECISIONS_LOG.md`.

- **Currency:** Jordanian Dinar (JD / د.أ) throughout.

- **Default language — DECIDED 2026-05-31:** **Arabic (RTL)** default; English the one-tap switch (next-intl default `ar`).

- **Tax (GST) — DECIDED 2026-05-31:** Jordan **General Sales Tax = 16%**, on **services** (delivery + service fee) and **goods at their own rate** (bread/sugar/tea/wheat exempt; oils 4%; other 1–10%). Register once sales exceed **JOD 30,000**. Cart taxes **line by line**. Set by the platform admin. *Confirm exact per-item classes with a Jordanian accountant — not tax advice.*

- **Delivery fee — DECIDED 2026-05-31 (admin-configurable, layered; nothing hardcoded):** one charge **per basket/checkout**, never per shop = **delivery + service fee + 16% GST**.
  - **Platform admin** sets the **city/area zones + rates** (used for the multi-vendor cross-market basket), the service fee, and GST. → **v1**.
  - **Business admin** sets **its own delivery** (fee, free-delivery threshold, areas served, self-deliver toggle) for **direct single-business orders**. → **v2** (no per-business delivery exists today).
  - Multi-vendor cross-market basket → **platform zone fee**; direct order from one shop → **that shop's settings**. Keeps the single-basket promise intact.
  - *Reconciliation:* checkout creates one order per vendor, so the basket-level delivery + service + tax sits at the checkout/order-group level (or a primary order).

- **Loyalty points — v2 (admin-configurable, per business):** each business runs its **own** points program (set in its dashboard); points accrue on orders and redeem later.

- **Per-shop minimum — DECIDED 2026-05-31:** **10 JD** per shop, single admin-configurable value (`SHOP_MINIMUM_JD`). Balances split feature vs vendor/pickup viability. *v2 levers (not built): per-city minimum; per-extra-shop surcharge.*

- **Luxury paywall — DECIDED 2026-05-31:** `compare()` returns **HTTP 402** if a product's category `isLuxury` **OR** its price ≥ **75 JD** (threshold configurable). *(Was category-only; price check added.)*

- **Premium scope — DECIDED 2026-05-31:** v1 **live** perk = unlock luxury compare only. Free delivery / early access / price alerts = **coming soon**, not active. Real monetization = seller subscriptions.

- **Reviews trust — DECIDED 2026-05-31:** v1 shows **native reviews/ratings only**. No "verified purchase" badge (placeholder), no Google ratings (v2) until real.

- **Per-business branding & privacy policy — v2 / small:** storefront branding beyond the logo + a `Business.privacyPolicy` field. **Logo + product-menu management already exist in v1.**

- **Platform legal — v1:** Verida needs its **own privacy policy + terms of service** (static pages).

- **Cart:** client-side (React context + `localStorage`), grouped by vendor; checkout creates **one order per vendor** (single basket-level delivery/service/tax — see Delivery fee).

- **Payments:** intent-only (`PENDING`) until live Stripe (v2).
