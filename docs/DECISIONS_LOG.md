# Decisions Log

> Append-only and dated. Each entry records **what** was decided, **when**, and **why**.
> Superseded decisions are struck through, not deleted, so the history stays visible.
> This file is authoritative for "what did we decide and why." See `PROJECT_BRIEF.md` §6 for the open-decision list.

---

## 2026-05-31 — Decision #0: Product name → **Verida**

**Decided:** The product name is **Verida**. (Pronounced *ve-REE-da*.)

**Status:** Approved by the owner as the name to build under. Formal trademark clearance is still required before public launch.

**Why:**
- Chosen interactively with the owner after evaluating ~30 candidates across four approaches (value words, luxury-Arabic, merged Arabic-international, and coined names).
- Hits the owner's demonstrated taste: a soft, warm, flowing, international sound.
- Evokes *veritas* ("truth"), which anchors the **reviews-and-trust** pillar.

**Open items / caveats:**
- **Domain:** `verida.com` is taken (a US firm). Plan to register `verida.jo` and/or `veridaapp.com` — confirm at registration.
- **Existing uses (out of our space):** a web3 personal-data network and a US medical-transport company both use "Verida." Neither competes in Jordanian local commerce. **But** the web3 Verida is also software, so a trademark attorney must clear the mark in the relevant class + country before launch. *(Not legal advice.)*
- **Code rename triggered:** rename placeholder "aswaq" strings to "verida" — `aswaq_token` → `verida_token`, `aswaq_cart_v1` → `verida_cart_v1`, `design/aswaq-design-system` → `design/verida-design-system`.

---

## 2026-05-31 — Decision #1: Delivery fee model → **zone fee + service fee + 16% GST, charged once per basket**

**Decided:** One delivery charge **per basket/checkout** (covering all vendors together), never per shop, built as a stack:
- **Delivery fee — by the user's location.**
  - **v1:** a **city/area zone table** — each Area carries a delivery rate; the basket's fee comes from the user's chosen area. Uses the existing City/Area entities; no maps.
  - **v2:** replace the zone rate with **true distance** (km from store → user) once maps/geo-search are built.
- **Service fee** — the platform's own charge (configurable rate).
- **GST (tax) — 16%**, per Jordanian law, on the delivery fee and the service fee. Goods carry their own GST (see notes).

**Why:** charging once per basket (not per shop) protects the "save money" promise; a location-scaled fee reflects real delivery cost; tax follows Jordan's GST law; true distance needs v2 geo, so v1 ships a real, demoable zone approximation.

**~~Supersedes~~:** ~~the original build behaviour of 2 JD flat per shop~~ and ~~the earlier "single flat fee" recommendation~~ — replaced by **zone-fee-per-basket + service fee + 16% GST**.

**Tax notes (verified via search 2026-05-31):**
- Jordan **General Sales Tax standard rate = 16%**, on goods *and services*.
- Staples exempt/reduced: bread, sugar, tea, wheat exempt; cooking oils 4%; other reduced 1–10%. A grocery basket may carry little/no GST on items, while delivery + service still add 16%.
- GST **registration required once sales exceed JOD 30,000**.
- Confirm exact per-item classes + compliance with a Jordanian accountant. *(Not tax advice.)*

**Backend impact:** new **delivery-zone / fee table**; **tax fields** on orders + order-items (per-item GST rate + computed tax). **Reconciliation flag:** checkout currently creates one order **per vendor**, so the single basket-level delivery + service + tax must live at the checkout/order-group level (or on a primary order), not be duplicated per vendor. See `../backend/DATA_MODEL.md`, `../business/BUSINESS_RULES.md`.

---

## 2026-05-31 — Decision #2: Per-shop minimum → **10 JD (configurable)**

**Decided:** Per-shop minimum order value = **10 JD**, kept as a single admin-configurable value (`SHOP_MINIMUM_JD`).

**Why:** balances the cross-market split feature against vendor + delivery-pickup viability. 25 JD per shop makes splitting a normal ~20–40 JD basket impossible (kills the feature); below ~7 JD makes a pickup uneconomic (one basket = one delivery fee, so the platform absorbs every extra pickup); 10 JD lets a shopper split across two or three shops while each vendor slice and pickup stays worthwhile. v1 favours feature usability (adoption first).

**v2 levers (documented, not built):** a **per-city** minimum, and/or a small **per-extra-shop** delivery surcharge — pull these only if data shows multi-shop orders losing money.

**Backend impact:** value change only (`SHOP_MINIMUM_JD` in `OrderService` + frontend); no schema change.

---

## 2026-05-31 — Decision #3: Default language → **Arabic (RTL)**

**Decided:** Default locale = **Arabic (RTL)**; English is the one-tap switch.
**Why:** Arabic-first product, Jordanian audience; bilingual + RTL already built. Config only (next-intl default `ar`).

---

## 2026-05-31 — Decision #5: Luxury paywall trigger → **category OR price ≥ 75 JD**

**Decided:** The 402 paywall fires if a product's category `isLuxury` **OR** its price ≥ **75 JD** (threshold configurable).
**Why:** category alone misses pricey items in normal categories; price alone misses cheap items in luxury categories; both = a robust net. Small change to `ProductService.compare()`.

---

## 2026-05-31 — Decision #6: Premium perks in v1 → **only "unlock luxury compare" is live**

**Decided:** v1's only live Premium perk is unlocking luxury comparison. Free delivery, early access, and price alerts show as **coming soon**, not active.
**Why:** don't oversell unbuilt perks. Premium is a soft lever in v1; real monetization = seller subscriptions. ("Free delivery" later = waiving the delivery fee, v2.)

---

## 2026-05-31 — Decision #7: Verified purchase + Google ratings → **omit from v1**

**Decided:** v1 shows native reviews/ratings only — no "verified purchase" badge (placeholder) and no Google-rating slot (v2) until each is real.
**Why:** a non-functional badge or an empty Google slot erodes the trust the reviews pillar is meant to build.

---

## 2026-05-31 — Decision #1 (extension): delivery is admin-configurable + merchant-platform scope

**Context:** owner clarified that the delivery fee and loyalty points are **dashboard-configurable, never hardcoded**, at two admin levels.

**Delivery (layered, admin-configurable):**
- **Platform admin** sets the **city/area zones + rates** (the single fee on a multi-vendor cross-market basket), the service fee, and GST. → **v1**.
- **Business admin** sets **its own delivery** (fee, free-delivery threshold, areas served, self-deliver toggle) for **direct single-business orders**. → **v2** (no per-business delivery exists today).
- Multi-vendor cross-market basket → platform zone fee; direct order from one shop → that shop's settings. Keeps the single-basket promise (#1) intact while giving each business control.

**Merchant-platform additions (design now, build later):**
- **Loyalty points** — per-business program, admin-configured; points accrue on orders, redeem later. → **v2**.
- **Per-business branding + privacy policy** — storefront branding beyond the logo + a `Business.privacyPolicy` field. → **v2 / small**.
- **Logo + product-menu management** — **already in v1** (Business/Media + products module); richer menu (sections, item modifiers) = enhancement.

**Platform legal:** Verida needs its **own privacy policy + terms of service** (static pages). → **v1**.

**Backend impact:** new `BusinessDeliverySettings`, `LoyaltyProgram` + `LoyaltyLedger`, `Business.privacyPolicy`; platform delivery-zone config (from #1). See `../backend/DATA_MODEL.md`.

---

## 2026-06-01 — Phase 0 build (from Claude Design handoff)

Phase 0 (design system + app shell + auth) built from the Claude Design handoff against the real backend. Readex Pro wired via `next/font` (self-hosted, no runtime CDN); Lucide locked as the v1 icon library; Button kept as a backward-compat superset (`kind`/`full`/`icon`/`iconAfter` + new `variant`/`size`, `premium`/`success`). Arabic (RTL) is the default locale; light theme only. Placeholder renames applied: `aswaq_token`→`verida_token`, `aswaq_cart_v1`→`verida_cart_v1`, `design/aswaq-design-system`→`design/verida-design-system`. Public component APIs + call sites preserved (re-skin only); a temporary legacy-compat token-alias block in `globals.css` keeps Phase 1–5 screens rendering on Verida tokens until each is reskinned. Per-screen states + RTL/LTR notes: `DESIGN_NOTES.md`; component catalog: `apps/web/docs/COMPONENTS.md`.

---

## Pending decisions (PROJECT_BRIEF §6) — to be resolved one by one

> Logged as **OPEN**; each becomes a dated entry above once locked.

- ~~**#1 — Delivery fee model.**~~ ✅ **DECIDED 2026-05-31** (+ extension: admin-configurable, layered).
- ~~**#2 — Per-shop minimum.**~~ ✅ **DECIDED 2026-05-31** — 10 JD, configurable.
- ~~**#3 — Default language.**~~ ✅ **DECIDED 2026-05-31** — Arabic (RTL) default.
- **#4 — Visual system (keep / evolve / replace).** OPEN — the remaining brand decision.
- ~~**#5 — Luxury paywall trigger.**~~ ✅ **DECIDED 2026-05-31** — category OR price ≥ 75 JD.
- ~~**#6 — Premium benefits scope in v1.**~~ ✅ **DECIDED 2026-05-31** — luxury-compare only is live.
- ~~**#7 — Verified purchase + Google ratings.**~~ ✅ **DECIDED 2026-05-31** — omit from v1.
- **Logo & tagline.** OPEN — part of the brand step (#4).
