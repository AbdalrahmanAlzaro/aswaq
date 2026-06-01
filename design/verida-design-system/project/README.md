# Aswaq Design System

**Aswaq** (أسواق — *the markets*) is a local marketplace for Jordan. People use it to discover nearby businesses — cafés, restaurants, gyms, electronics, watches, jewelry — compare product prices across shops, read and write reviews, save favorites, and check out from multiple vendors in a single cart.

This design system encodes the brand, the typographic and color foundations, the iconography conventions, and the UI kit needed to design and ship Aswaq surfaces fluently in both **English (LTR)** and **Arabic (RTL)**.

## Sources

This system was created from a written brief — no codebase, Figma file, or existing brand assets were attached. The visual direction, components, and screens here are an original interpretation of the brief and should be treated as v0 — review and iterate before treating any of it as canonical.

If you have:

- A Figma file → re-attach and ask for a pass to align components.
- An existing iOS/Android/web codebase → import and ask for a pass to align tokens.
- Brand assets (logo, photography, illustration) → drop them in `assets/` and ask for a refresh.

## Product surfaces

| Surface | Audience | Platform | UI kit |
|---|---|---|---|
| **Marketplace mobile app** | Shoppers in Jordan | iOS / Android (mobile web mock) | `ui_kits/mobile_app/` |
| **Business owner dashboard** | Café / shop / gym owners managing their listing | Desktop web | `ui_kits/business_dashboard/` |

The mobile app is the centre of gravity — most screens in the brief are shopper-facing. The dashboard is the operator counterpart: manage business profile, products, subscription plan, and incoming orders.

---

## Content fundamentals

Aswaq writes like a knowledgeable neighbour, not a corporation. Copy is **warm, plain, and useful**.

### Voice

- **Local, never colonial.** Talk about Jordan, dinars, Amman, by name. Don't translate "JD" out, don't anglicise neighbourhood names.
- **Plural-you in Arabic, singular-you in English.** English copy uses "you"; Arabic copy uses **أنتم/-كم** (formal plural — the souq register).
- **Concrete over corporate.** "Pay 2 JD delivery from Jabal Amman" beats "Affordable shipping options available."
- **No hype words.** Avoid *seamless, revolutionary, world-class, AI-powered*.
- **No emoji in product surfaces.** Emoji are allowed in user-generated content (reviews, chat), never in our own UI labels, buttons, empty states, or marketing.
- **Sentence case for everything** — buttons, headings, nav items. The only exception is the wordmark **ASWAQ** and ALL-CAPS eyebrows (≤ 4 words, used sparingly above section headings).

### Casing & punctuation

- **Currency** is always `JD` after the number with a space in English: `12 JD`, `1,250 JD`. In Arabic, use `د.أ` after the number with a space: `12 د.أ`. Never the `JOD` code, never the `$`-style prefix.
- **Ratings** are shown to one decimal: `4.6`, never `4.60`. Counts in parens: `4.6 (218)`.
- **Distance** is metric: `1.2 km away` / `على بُعد 1.2 km`. **Western Arabic numerals (0–9)** in both languages — we explicitly do not use Eastern numerals.
- **Hours** are 12-hour with lowercase am/pm in English (`8:00 am — 11:00 pm`), shortened `8ص — 11م` in Arabic when space is tight.
- Headings: sentence case. No trailing periods on headings, buttons, or one-line empty states.

### Tone examples

| Situation | ✅ Aswaq | ❌ Off-brand |
|---|---|---|
| Empty favourites | "Nothing saved yet. Tap the heart on anything worth coming back to." | "Your wishlist is empty. Start exploring our amazing selection!" |
| Minimum-cart warn | "Add 7 JD more from this shop to check out." | "Order does not meet minimum requirements." |
| Premium upsell | "Compare watches and jewellery, side by side. 4 JD a month." | "Unlock the full power of Aswaq Premium today!" |
| Verified badge | "Owner-verified" | "OFFICIAL ✔" |
| Closed-now state | "Closed — opens 9:00 am tomorrow" | "UNAVAILABLE" |

### Localisation

Every English string has an Arabic counterpart. Translate **meaning**, not words — the Arabic copy is written natively, not as English-to-Arabic. Layouts must work in RTL with no special-cased screens; the components in this system are direction-agnostic. Specifically:

- **Digits** — always Western (0–9), even in Arabic surfaces. (We deliberately do not use Eastern Arabic numerals.)
- **Currency** — `12 JD` in English, `12 د.أ` in Arabic. Number first, currency after, one space.
- **Time** — 12-hour with lowercase am/pm in English (`8:00 am — 11:00 pm`), shortened `8ص — 11م` in Arabic UI when space is tight.
- **Bidi** — any element mixing Latin digits with Arabic text must be wrapped in `class="num"` or a `dir="ltr"` span so the run doesn't reorder visually.
- **Mirroring** — directional icons (back chevron, list-item chevron, arrow) get the `flip-rtl` class so they mirror automatically; never hard-code `marginLeft` or `left` — use `marginInlineStart` / `insetInlineStart`.

---

## Visual foundations

### Vibe in one paragraph

Aswaq looks like the souq at golden hour: cream walls, terracotta canvas awnings, brass lanterns, deep charcoal doorways. The surface is generous and bright — most of the screen is **cream**, with **terracotta** as the focused accent (CTAs, selection, brand), **soft gold** for status (verified, premium, ratings), and **deep charcoal** for ink. We let air do the work: cards are roomy, type breathes, and decoration is restrained. Where most marketplaces try to look like a tech product, Aswaq tries to look like a **place**.

### Color

- **Cream is the substrate.** `--bg` is `#fdfbf6`. Pure white is reserved for product imagery, surfaces that need to lift off the cream (cards on a cream page sit on `#ffffff`), and the camera roll. Saturated white is never a page background.
- **Terracotta is rationed.** It's the *only* fully-saturated colour on most screens — used for the primary button, the selected tab, the brand mark, the active filter chip, and the "save" heart in its filled state. Two terracotta blooms per screen is plenty.
- **Gold = status, not decoration.** Stars, verified badge, premium ring, luxury chip. Never used as a background, never used for a CTA.
- **Charcoal ink, not black.** All text is `--charcoal-600` (`#1f1a15`). Pure `#000` is forbidden — it shouts against the cream.
- **Olive + pomegranate** carry success/danger so the palette stays in the same family — no off-the-shelf Material green or iOS red.

### Type

- **Fraunces** for Latin display — sizes ≥ 24px. Optical-size axis is set per cut (`opsz` 96 at hero, 72 at h2, 48 at h3). Weights 500–700; 800 only for the wordmark.
- **Plus Jakarta Sans** for Latin body / UI. Weights 400 / 500 / 600 / 700. Body is 15px on mobile, 16px on web.
- **El Messiri** for Arabic display — the expressive counterpart to Fraunces. Headings, hero copy, and any size ≥ 24px in RTL surfaces use El Messiri 600–700.
- **IBM Plex Sans Arabic** for Arabic body / UI. Weights 400 / 500 / 600 / 700. Both Arabic faces ship from the same Google Fonts request and are OFL-licensed.
- **Prices and digits stay 0–9** in both languages — we use Western Arabic numerals (`1, 2, 3`) inside Arabic copy, not Eastern (`١, ٢, ٣`). Wrap any number-containing snippet in `class="num"` (or a `<span dir="ltr">`) so it gets tabular figures and an LTR bidi run — this prevents `"12 JD"` from re-ordering to `"JD 12"` inside Arabic text.
- **Currency is localised:** `12 JD` in English, `12 د.أ` in Arabic. Always after the number with one space, never the JOD code, never a `$`-style prefix.
- **Eyebrows** are 12px, semi-bold, +0.14em tracking, uppercase Latin / standard-case Arabic. Used sparingly above section dividers.

### Spacing

- 4-base scale (`4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96`).
- Mobile screen gutter: **20px**. Web container: **max 1200px** with **32px** gutters.
- Card padding: **20px**. Card-to-card gap on a grid: **12–16px**.
- Section break on mobile: **40px**.

### Backgrounds

- Default: flat cream. **No** noise textures, **no** gradients on flat surfaces.
- Hero and category cards may carry a single photographic image, full-bleed, with a 24% charcoal vignette from the bottom for text legibility — the *only* gradient pattern in the system.
- Section dividers are 1px hairlines in `--cream-300`, or empty space — never a 2px rule.

### Animation

- **Easing:** `cubic-bezier(0.22, 0.61, 0.36, 1)` for entrances; spring `cubic-bezier(0.34, 1.56, 0.64, 1)` for small-element pop (heart-fill, badge-grant).
- **Duration:** 140ms for hover/active, 220ms for sheet/modal, 360ms for screen transitions.
- **Fades, never slides** on text content. Sheets slide up from the bottom edge. Cards lift on press (`translateY(-1px)` + shadow step), they do **not** scale.
- **No parallax**, no spinning logos, no skeleton shimmers that look like marketing trickery — skeletons use a calm pulse at 0.6 → 1.0 opacity over 1.2s.

### Hover & press

- **Hover (desktop):** background tone shifts one step warmer (e.g. button: `--terracotta-500` → `--terracotta-600`), cursor changes, no scale. Cards add a faint shadow step (`--shadow-sm` → `--shadow-md`).
- **Press (mobile + desktop):** subtle 96% scale on tappable cards, 50ms; primary button drops to `--terracotta-700` and inset shadow appears.
- **Focus:** 4px terracotta @ 22% halo around the element — `--shadow-focus`.

### Borders

- Hairlines: **1px**, colour `--cream-300` on cream backgrounds, `--cream-400` on white surfaces.
- Inputs: 1px `--cream-400` resting → 2px `--terracotta-500` focused.
- We do **not** use coloured left-borders as decoration. We do **not** use 2-tone borders.

### Shadows & elevation

| Token | Use |
|---|---|
| `--shadow-xs` | Hairline lift, chips that need separation |
| `--shadow-sm` | Resting card on cream background |
| `--shadow-md` | Card hover, sticky header on scroll |
| `--shadow-lg` | Floating action button, dropdown menus, toast |
| `--shadow-xl` | Modal, paywall, bottom sheet |
| `--shadow-focus` | Keyboard focus ring (always terracotta) |

All shadows are charcoal-tinted at low opacity — never grey, never blue.

### Layout rules

- **Fixed elements:** mobile bottom nav (5 items, 64px tall, no labels until selected); web header (72px, sticky, drops shadow on scroll).
- **No floating ads.** No "back to top" buttons. No floating chat bubbles except inside the owner dashboard.
- **One primary action per screen.** The terracotta button is singular per viewport; secondary actions are ghost-style.

### Transparency & blur

- **Blur is for sheets**, not chrome. A bottom sheet over a screen uses a 4% charcoal scrim + 16px backdrop-blur on the underlying content.
- **The sticky header is opaque cream**, not translucent — translucent headers don't read against busy product imagery.

### Imagery

- Photography is **warm-leaning**: golden hour, indoor lamp light, daylight from a window. We avoid cool, fluorescent-lit retail photography.
- **No collage backgrounds, no isolated white-cutout product shots** on the marketing surfaces. Lifestyle in context > white-table-top.
- For categories without real imagery, we use a flat cream card with the Arabic letter (س for souq) tonally embossed in `--cream-300` at the corner.

### Corner radii

- Cards: **20px**.
- Buttons: **14px** (or pill `999px` for chips and filter selectors).
- Inputs: **14px**.
- Sheets / modals: **28px top corners**.
- Pills (filter chip, badge): **999px**.

### Card anatomy

A standard business card:

1. 16:10 image at the top with **20px** radius matching the card.
2. 20px padding below.
3. Name in `--fs-md` / weight 600, one line + ellipsis.
4. Meta row: ⭐ rating · review count · neighbourhood — `--fg-2`, `--fs-sm`.
5. Optional badge row (verified, open-now).
6. Shadow `--shadow-sm`, 1px `--cream-300` border.

The card lifts to `--shadow-md` on hover, drops to scale 0.98 on press.

---

## Iconography

We use **[Lucide](https://lucide.dev/)** (the modern fork of Feather) as the primary icon system for the Latin/EN UI — clean 1.5px outline icons at 24×24 that match the cream-and-charcoal calm of the brand. Lucide is linked from CDN in the UI kits (`lucide@latest`) and rendered as inline SVG so individual icons can adopt `currentColor`.

Specific overrides:

- **Star (rating)** — Lucide's filled `star` at `--gold-400`. We do **not** use half-filled stars; we render an exact-decimal numeric label next to a 5-star track with a clipped fill.
- **Heart (save / favourite)** — Lucide outline by default, filled `--terracotta-500` when active. Pop animation on toggle.
- **Verified badge** — custom 16×16 SVG drawn at `assets/icons/verified.svg` — a soft gold seal, not a checkmark-in-circle. (TODO: replaced from CDN for now with Lucide's `badge-check` in `--gold-400` — flagged below.)
- **Premium / luxury** — Lucide `crown` at `--gold-400` on a soft gold pill.
- **Logo** — custom wordmark at `assets/logo/aswaq-wordmark.svg`.

**No emoji** in any Aswaq-owned UI string (see Content Fundamentals). Emoji are only allowed in user-generated content like review bodies.

**No unicode characters as icons.** No `★`, `♥`, `➜`. Always real SVG so we control stroke weight.

### Substitutions flagged for review

| Asset | Currently using | What I'd want |
|---|---|---|
| Aswaq logo | Custom wordmark drawn in this repo (`assets/logo/aswaq-wordmark.svg`) | Real logo from brand team |
| Display font (Fraunces) | Google Fonts CDN | Confirm licensing is fine for app embed |
| Arabic font (IBM Plex Sans Arabic) | Google Fonts CDN | Confirm if Tajawal preferred — both linked, swap is one CSS var |
| Verified seal | Lucide `badge-check` recoloured gold | Bespoke seal mark from brand team |
| Category illustrations (café, gym, jewelry) | Not yet drawn — using flat coloured cards with Lucide category icons | Commissioned hand-drawn set in the souq style |

---

## Index

```
README.md                      ← you are here
SKILL.md                       ← Agent-Skills-compatible skill manifest
colors_and_type.css            ← CSS tokens + semantic typography styles
assets/
  logo/
    aswaq-wordmark.svg
    aswaq-wordmark-ar.svg
    aswaq-mark.svg
  icons/
    verified.svg
    premium.svg
preview/                       ← Design System tab cards
  colors-*.html
  type-*.html
  spacing-*.html
  components-*.html
  brand-*.html
ui_kits/
  mobile_app/
    README.md
    index.html                 ← interactive prototype, EN + AR toggle
    components/                ← BusinessCard, ProductCard, StarRating, ...
    screens/                   ← Home, Search, Business, Compare, Cart, ...
  business_dashboard/
    README.md
    index.html                 ← desktop dashboard prototype
    components/
    screens/
```

---

## Caveats & next steps

This system was built from a written brief — there was no codebase, Figma, brand asset library, or photography to reference. Every concrete decision below is **a designer's interpretation**, not a brand-team-approved truth. Argue with all of it.

**Open items I'd want help on:**

1. **Logo.** The wordmark in `assets/logo/aswaq-wordmark.svg` is an arched-doorway mark I drew to anchor the system. Owner confirmed the arch concept stays; refine to a real wordmark before shipping.
2. **Photography.** All hero / card images currently use a warm category-tinted gradient + category glyph as the **explicit no-photo fallback**. The `BusinessCard` component accepts a `photo` prop — drop in real shop photography and it composites over a bottom-charcoal scrim. No code changes needed.
3. **Arabic copy quality.** A native Jordanian copywriter pass is queued; current strings are reasonable but want a final tonal sweep — especially the souq-warmth in `"أهلاً بعودتك"`, `"شكراً. أبلغنا متاجرك."`, `"تسوّق السوق كأهل البلد."`
4. **Fonts** — Fraunces, Plus Jakarta Sans, IBM Plex Sans Arabic, and El Messiri are all OFL-licensed and confirmed for embed. Production should self-host (e.g. via `next/font`) rather than reach Google Fonts at runtime.
5. **Verified seal.** Currently a custom SVG drawn from scratch — bespoke would be better.
6. **Iconography.** Lucide-style outline icons drawn inline as React components in `components.jsx`. For production, swap for the real Lucide library (`lucide-react` on npm, or CDN).
7. **Category illustrations.** Each category card uses a Lucide-style category glyph + warm gradient as the no-photo fallback. A commissioned hand-drawn set in the souq style would lift the brand further.
8. **Multi-vendor minimum.** 25 JD per shop per the brief; flat 2 JD per-shop delivery fee is placeholder.
9. **Premium price points.** 4 JD/mo shopper, 24–60 JD/mo seller — placeholder pending real business validation.
10. **Map view** on the search screen is stubbed (list-only).

