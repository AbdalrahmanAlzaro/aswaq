# Aswaq mobile UI kit

The shopper-facing mobile app for Aswaq, recreated as a clickable HTML prototype. Both English (LTR) and Arabic (RTL) renders are wired up — the toggle is in the top-right of the page.

Open `index.html` and use the top-right dropdowns to switch language and jump to any screen. Inside the app, navigation uses the bottom tab bar and natural tap-throughs (home → business → product → cart → checkout → confirmed).

## Screens included

| Screen | File location |
|---|---|
| Home / discovery | `screens-discovery.jsx` · `HomeScreen` |
| Search & category results | `screens-discovery.jsx` · `SearchScreen` |
| Business profile (header + tabs) | `screens-discovery.jsx` · `BusinessScreen` |
| Compare (multi-product, with Premium paywall for luxury) | `screens-discovery.jsx` · `CompareScreen` |
| Favourites | `screens-discovery.jsx` · `FavoritesScreen` |
| Cart (multi-vendor, 25 JD minimum) | `screens-commerce.jsx` · `CartScreen` |
| Checkout | `screens-commerce.jsx` · `CheckoutScreen` |
| Order confirmed | `screens-commerce.jsx` · `ConfirmedScreen` |
| My orders | `screens-commerce.jsx` · `OrdersScreen` |
| Auth — login + register | `screens-commerce.jsx` · `AuthScreen` |
| Premium upsell | `screens-commerce.jsx` · `PremiumScreen` |
| Account ("You") | `screens-commerce.jsx` · `YouScreen` |
| "Become a seller" landing | `app.jsx` · `OwnerLandingScreen` |

## Components

In `components.jsx`:

- `Header`, `BottomNav`, `SearchBar` — chrome
- `BusinessCard`, `ProductCard` — main feed primitives (with `layout="h"` variant on BusinessCard)
- `StarRating` — numeric label + clipped 5-star track (no half-stars by design)
- `Heart` — toggle, pops on fill
- `Badge` — `verified` / `open` / `closed` / `luxury` / `premium`
- `Button` — `primary` / `secondary` / `ghost` / `ink` / `gold` × `sm` / `md` / `lg` × `full`
- `Chip`, `ChipRow` — category filter chips with luxury dot marker
- `Sheet`, `Modal` — bottom-sheet and centred modal with the same scrim
- `Field` — labelled text input with error state
- `Icon` — single inline-SVG component, Lucide-style 24px outline icons

## Bilingual & RTL

`MobileApp` accepts a `lang` prop. Setting `lang="ar"` flips `dir` on the root element and swaps `--font-body` for `--font-arabic` via CSS attribute selectors. All copy is rendered through the `t(en, ar, lang)` helper. Layouts use `marginInlineStart` / `insetInlineStart` everywhere so no special-case RTL screens exist — the same components render correctly in both directions.

## Caveats

- No real photography — image areas use the brand colour gradients defined in `data.js`. Drop in real photos by replacing the `grad` property with a CSS `url(...)`.
- Bottom-nav icons are inline SVG defined in `components.jsx` — they match Lucide's outline style but are not the Lucide assets themselves (one fewer dependency at runtime).
- Map view (toggle in `SearchScreen`) is stubbed — list-only for now.
- Live chat between shopper and shop is referenced in the brief but not wired into this prototype.
