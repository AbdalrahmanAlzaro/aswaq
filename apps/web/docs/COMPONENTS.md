# Components Catalog — Verida

> The running catalog of the adapted UI components. Updated as part of processing each one.
> **Columns per entry:** name · source · original author · used in (phase) · dependencies · status.
> **Source note:** the collected `prompt.md` files list only the generic `https://21st.dev/` as source and don't name the author, so **specific source URL + author are filled in as each component is processed** (some author handles are inferable from dependency lines, e.g. `originui`, `jolbol1`, `shadcn`).
> **Adaptation standard (every component):** Tailwind v4 + `BRAND.md` tokens · RTL-safe (logical props, `dir`, mirrored chevrons via `.flip-rtl`) · accessible (aria-labels, visible focus ring) · self-contained with deps listed · generic look stripped.

## Foundation — Phase 0 — ✅ done (built from the Claude Design handoff)

Built from `design/verida-design-system/` reconciled to `docs/brand/BRAND.md` (Decision #4 — Verida tokens win; the souq palette/fonts are discarded). Layout, states, and motion are adapted from the collected 21st.dev components (mapping below). Public component **APIs + call sites were preserved** (re-skin only); the only renames are the approved `aswaq*`→`verida*` placeholders. Actual paths are flat under `components/` (not `components/layout/`).

| Component | File | Source / notes | Status |
|---|---|---|---|
| Design tokens + fonts | `app/globals.css`, `app/fonts.ts`, `app/[locale]/layout.tsx` | Tailwind v4 `@theme` from BRAND.md; `.price` / `.nums-tabular` / `.flip-rtl` + star track. **Readex Pro via `next/font/google`** (subsets latin+arabic, var `--font-readex`, swap — self-hosted at build, no runtime CDN); `--font-sans` → `var(--font-readex)`. Default locale **ar**. A clearly-marked legacy-compat alias block keeps not-yet-reskinned Phase 1–5 screens rendering on Verida tokens (delete per phase). | ✅ done |
| Button | `components/ui/button.tsx` | 21st.dev shadcn/originui button (cva). Backward-compat superset (`kind`/`full`/`icon`/`iconAfter` + `variant`/`size`); added `premium`/`success`/`ink`; RTL-safe; focus ring. | ✅ done |
| Logo (wordmark) | `components/logo.tsx` | Wordmark-only: Latin "Verida" (Readex 500, +2% tracking, dotless i + teal check), Arabic فيريدا, optional bilingual lockup w/ hairline divider, `inverse` for dark panels. | ✅ done |
| Badge | `components/ui/badge.tsx` | Re-skinned: verified=teal, premium/luxury=violet (scarce), success/open=green, danger/closed=red, +warning. API unchanged. | ✅ done |
| Field / input | `components/ui/field.tsx` | Re-skinned; +`helper`; `aria-invalid`/`aria-describedby`; error state. | ✅ done |
| Chip / ChipRow | `components/ui/chip.tsx` | Selected=teal; luxury dot=violet. | ✅ done |
| SearchBar | `components/search-bar.tsx` | Re-skinned; GET `/search?q=`; RTL-safe. | ✅ done |
| Price | `components/ui/price.tsx` | `.price` LTR isolation + tabular figures. | ✅ done |
| StarRating | `components/ui/star-rating.tsx` | Gold fill clipped to exact %, no half-stars; `.stars-track`/`.stars-fill`; `role=img` + aria-label. | ✅ done |
| Heart | `components/ui/heart.tsx` | Outline → teal fill on save; spring pop; reduced-motion safe. | ✅ done |
| Alert / Toast | `components/ui/alert.tsx` | ← `alert-1` (cva): success/danger/warning/info/default + dismiss; lucide; RTL. | ✅ done |
| Skeleton | `components/ui/skeleton.tsx` | ← `animated-loading-skeleton` (framer-motion) → calm 1→0.6 pulse over 1.2s; reduced-motion safe; `CardSkeleton`. | ✅ done |
| StateIcon | `components/ui/state-icon.tsx` | ← `animated-state-icons` (framer-motion): loading spinner / success-check draw / error-cross draw; reduced-motion safe. | ✅ done |
| Icon set | `components/ui/icon.tsx` | Inline SVG sprite (stroke 1.5; directional via `.flip-rtl`); `CATEGORY_STYLE` → `#E8F3F0` image-slot placeholder. Lucide is the icon library for shell/menus/auth. | ✅ done |
| Header (app shell) | `components/header.tsx` | ← `header-01`. Brand wordmark; nav compare/discover/sell; inline search; favourites; cart (+count from cart ctx); AccountMenu; LanguageSwitch (replaces theme toggle); sticky + scroll shadow; skip link; landmarks; RTL-first. | ✅ done |
| AccountMenu | `components/account-menu.tsx` | ← `account-menu` PATTERN, built dependency-free (no Radix): logged-in (account/orders/saved/become-seller/sign-out) vs logged-out (sign in/register); click-outside + Escape; RTL. Reads `verida_token` → GET `/auth/me`. | ✅ done |
| LanguageSwitch | `components/language-switcher.tsx` | AR/EN; swaps `[locale]` segment. | ✅ done |
| BottomNav | `components/bottom-nav.tsx` | `lg:hidden`; home/compare/discover/cart (+badge from cart ctx)/account; active state; safe-area; RTL. | ✅ done |
| Splash / brand intro | `components/splash.tsx`, `app/[locale]/welcome/page.tsx` | Wordmark reveal (framer-motion, fades) + language choice (AR default / EN). Reduced-motion safe. | ✅ done |
| Auth (login/register/forgot) | `components/auth-form.tsx`, `app/[locale]/auth/page.tsx` | ← `sign-in` (split-screen) + `sign-in-form` + `forgot-password`, with `animated-state-icons`. Split-screen mirrors in RTL; login⇄register⇄forgot via `AnimatePresence` (RTL-aware slide); role toggle Shopper/Seller → `role`; remember-me; password show/hide; client validation; `StateIcon` success/error; `Alert` server errors; Google shown **disabled "coming soon" (v2)**. Wired to POST `/auth/login` + `/auth/register`; sets `verida_token`. Forgot = success-state stub (no backend reset endpoint yet → v2). | ✅ done |
| App icon / favicon | `app/icon.svg` | Verida teal mark + white check. | ✅ done |

> **Font wiring (done, in `app/[locale]/layout.tsx` + `app/fonts.ts`):** `Readex_Pro({ subsets: ["latin","arabic"], variable: "--font-readex", display: "swap" })`; `readex.variable` on `<html>`; `globals.css` `--font-sans → var(--font-readex)`. Self-hosted at build (no runtime Google CDN).

## Collected components (63) — mapped to phases, pending adaptation

> Key deps shown (shadcn/Radix primitives omitted for brevity). Status: ⬜ pending · ▶ next · ✅ done.

### Phase 0 — foundation, shell, auth
- ✅ `header-01` → **Header + BottomNav + LanguageSwitch** (shell). Theme toggle repurposed as AR/EN switch. Categories **mega-menu deferred to Phase 1** (Radix nav-menu dep not pulled).
- ✅ `account-menu` → **AccountMenu** (logged-in vs logged-out). Built dependency-free (no Radix) to stay within the allowed deps.
- ✅ `alert-1` → **Alert / Toast** (cva variants success/danger/warning/info/default + dismiss).
- ✅ `animated-state-icons` → **StateIcon** (loading spinner / success-check / error-cross draws; reduced-motion safe).
- ✅ `animated-loading-skeleton` → **Skeleton** + `CardSkeleton` (calm 1→0.6 pulse 1.2s; reduced-motion safe).
- ✅ `sign-in` (split-screen) + `sign-in-form` + `forgot-password` → **auth split-screen + AuthForm** (login⇄register⇄forgot, `AnimatePresence` RTL-aware, Google "coming soon").
- ⬜ `dropdown-navigation` — mega-menu nav · framer-motion (Phase 1)
- ⬜ `dropdown-menu` — menu primitive · radix (Phase 1+, if Radix adopted)
- ⬜ `profile-dropdown` — profile dropdown · radix, cva (superseded by AccountMenu)
- ⬜ `spotlight-button` — nav bar w/ spotlight · lucide
- ⬜ `circle-menu` — radial menu (optional) · framer-motion
- ⬜ `circular-command-menu` — command palette (optional) · framer-motion
- ⬜ `floating-action-menu` — FAB (optional) · framer-motion
- ⬜ `flexnative-breadcrumb` — breadcrumb (RTL chevrons) · cva · +tailwind-extend
- ⬜ `pagination-ant` — pagination (RTL) · —
- ⬜ `sliding-pagination` — animated pagination (RTL) · framer-motion
- ⬜ `dialog` — modal primitive (also paywall) · radix, cva (Phase 2)
- ⬜ `popover` — popover primitive · radix, cva
- ⬜ `popover-ark-ui` — popover (Ark UI alt) · ark-ui
- ⬜ `notifications-toggle` — preference toggles · radix, cva
- ⬜ `page-not-found` — animated 404 · —
- ⬜ `file-upload-1` — file upload (reused P5) · radix, cva
- ⬜ `file-upload-card` — upload card (reused P5) · ark-ui, framer-motion
- ⬜ `file-upload-ark-ui` — upload (Ark UI alt) · ark-ui
- ⬜ `use-image-upload` — image-upload hook (reused P5) · —

### Phase 1 — shopper discovery
- ⬜ `discover-button` — search + tabs · framer-motion
- ⬜ `product-card` — 3D-tilt product card · framer-motion
- ⬜ `gradient-card` — content card · framer-motion
- ⬜ `card-studio` — login card + product-card demos · cva
- ⬜ `shirt-parallax-card` — product/parallax card variant · framer-motion
- ⬜ `animated-testimonials` — repurpose for **reviews** · framer-motion
- ⬜ `testimonial-2` — reviews grid variant · framer-motion
- ⬜ `testimonials-column` — reviews columns variant · framer-motion

### Phase 2 — price comparison
- ⬜ `contacts-table-with-modal` — base for **compare table** · framer-motion
- ⬜ `ruixen-contributors-table` — table variant · framer-motion
- ⬜ `points-chart` — chart (offers/price history) · recharts

### Phase 3 — transaction (cart/checkout/orders)
- *(largely net-new; no strong matches — build cart, checkout, order views fresh)*

### Phase 4 — premium, account, legal
- ⬜ `pricing-module` — tiered pricing (Premium + plans) · radix, cva
- ⬜ `glass-account-settings-card` — account settings card · framer-motion

### Phase 5 — seller suite
- ⬜ `sidebar-component` — two-level dashboard sidebar · lucide
- ⬜ `monthly-heatmap-calendar` — orders-over-time heatmap · radix, cva
- ⬜ `streak-card` — dashboard stat card · lucide
- ⬜ `features-9` — stat/feature grid (reuse) · recharts
- *(reuses tables, file-upload, pricing-module, card-studio from above)*

### Phase 6 — admin
- *(reuses `sidebar-component`, tables, `dialog`)*

### Phase 7 — v2 vision pack (design-only)
- ⬜ `globe-hero` — 3D globe hero (coverage/pitch) · three
- ⬜ `image-sphere` — 3D photo sphere · —
- ⬜ `world-map` — animated arc map (geo/coverage) · framer-motion
- ⬜ `cobe-globe` — COBE globe (coverage) · cobe

### Marketing / landing site (separate track)
- ⬜ `ai-image-generator-hero` · lucide
- ⬜ `fin-tech-landing-page` · framer-motion
- ⬜ `floating-icons-hero-section` · framer-motion
- ⬜ `modern-hero-section` · framer-motion
- ⬜ `product-spotlight-hero-section` · framer-motion
- ⬜ `section-with-mockup` · framer-motion
- ⬜ `stack-feature-section` — orbiting logos · cva
- ⬜ `project-showcase` · lucide
- ⬜ `3d-testimonials` — 3D marquee · radix · +tailwind-extend
- ⬜ `animated-gallery` — scroll 3D gallery · framer-motion
- ⬜ `gallery` — draggable photo spread · framer-motion
- ⬜ `sparkles` — particle background · three

### Unassigned / optional flourish
- ⬜ `animated-weather-icons` — decorative weather glyphs (no clear Verida use yet)
