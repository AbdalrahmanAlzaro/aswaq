---
name: aswaq-design
description: Use this skill to generate well-branded interfaces and assets for Aswaq, the local marketplace for Jordan — either for production or for throwaway prototypes, mocks and slides. Contains the brand foundation (colors, type, Fraunces + Plus Jakarta Sans + IBM Plex Sans Arabic), iconography, ready-made UI kit components (BusinessCard, ProductCard, StarRating, Badge, Button, Sheet, Modal, BottomNav, OrdersTable, KPI tiles), and full prototype HTMLs for the shopper mobile app and the business-owner dashboard, in both English (LTR) and Arabic (RTL).
user-invocable: true
---

# Aswaq Design Skill

Aswaq (أسواق — *the markets*) is a local marketplace for Jordan. Shoppers discover nearby businesses (cafés, restaurants, gyms, electronics, watches, jewellery), compare prices, read reviews, save favourites, and check out from multiple vendors in one cart. Business owners list their shop and manage orders through a separate dashboard.

## Where to start

1. **Read `README.md`** at the repo root. It has the full content + visual foundations, color rationale, type system, iconography rules, and an index of every file in the system.
2. **Read `colors_and_type.css`** for the canonical CSS custom properties and semantic typography styles. Copy this file into any new artifact — never hand-roll the palette.
3. **Open the existing UI kits** before designing anything new:
   - `ui_kits/mobile_app/index.html` — interactive shopper-app prototype (13 screens, EN + AR toggle)
   - `ui_kits/business_dashboard/index.html` — desktop dashboard prototype
   The kits aren't production code — they're high-fidelity recreations you can reuse.
4. **Browse `preview/`** for design-system cards (colors, type, spacing, components, brand) you can lift specimens from.
5. **Check `assets/`** for logos (`aswaq-wordmark.svg`, `aswaq-wordmark-ar.svg`, `aswaq-mark.svg`) and icon assets (`verified.svg`, `premium.svg`).

## How to make things

- **Throwaway prototypes / mocks / slides:** copy the relevant assets into your output folder, import `colors_and_type.css`, and write a static HTML file. Use the components in `ui_kits/mobile_app/components.jsx` and `ui_kits/business_dashboard/app.jsx` as references — they're plain React/Babel scripts you can adapt.
- **Production code:** treat this skill as a brand reference. Re-implement components in your target framework using the documented tokens and rules. Do **not** copy the runtime CSS from `colors_and_type.css` verbatim — port it to your design-token system.

## Brand non-negotiables

- Cream (`#fdfbf6`) is the substrate, not white. Pure white is reserved for product imagery and surfaces that need to lift off the cream.
- Terracotta (`#bf532f`) is the single saturated colour on most screens. Use it for CTAs, brand mark, selection, active filter, filled-heart. Two terracotta blooms per screen is plenty.
- Gold (`#c99633`) is for status (verified, premium, stars), never for a CTA.
- Charcoal (`#1f1a15`) for ink. Pure `#000` is forbidden.
- **No emoji** in product UI — only in user-generated content.
- **No half-stars** — show an exact decimal with a clipped 5-star track.
- Currency is `12 JD` (number, space, "JD"), never `JOD`, never `$12`.
- **Every layout must work in RTL.** Use `marginInlineStart` / `insetInlineStart`, never `marginLeft` / `left`. Test with `lang="ar"` flipping `dir`.

## When the user invokes this skill without guidance

Ask what they want to build — a marketing landing, a new screen, a slide deck, a mock for stakeholder review, a refresh of an existing surface — then ask 3–5 focused questions (audience, surface, language coverage, variation count, fidelity). Then act as an expert Aswaq designer and produce HTML artifacts or production code per the workflow above.
