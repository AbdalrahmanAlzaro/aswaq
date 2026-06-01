# Design Notes

> Page-by-page decisions from the design discussion. Filled as we lock each screen.
> For each screen, record: **phase** (v1/v2), **states** (default / empty / loading / error, plus 402 paywall and offline where relevant), and **LTR + RTL** notes.

## Status

- **Visual system: LOCKED** — "verified clarity" (light / white-based). See `../brand/BRAND.md` and `../decisions/DECISIONS_LOG.md` #4. The tokens there are the source of truth for every screen.
- **Method:** screens are designed in **Claude Design**, in **phases**. Each phase uses a prompt that fuses (a) the relevant business rules + data model, (b) adapted example components (RTL + Tailwind v4), and (c) the locked tokens. Each phase is approved in Claude Design, then handed to Claude Code as an ordered task list (v1 phases are implemented; v2 phases are designed only). Per-screen decisions are recorded here as each phase is approved.
- **Per-screen design: not started** — begins with Phase 0 once the phase order is approved.

### Screen inventory (PROJECT_BRIEF §5) — to detail per phase

**Shopper:** splash / brand intro · auth (login / register, Google button v2-wired) · home / discovery · search & results (map toggle v2) · catalog / price comparison · basket optimizer (v2) · business profile (Google rating v2) · product detail · compare (luxury paywall) · cart · checkout (Stripe live = v2) · order confirmation / history / detail · favourites · premium upsell · account / settings · legal (privacy + terms).

**Seller:** become a seller / register business (map v2) · dashboard home · manage products / menu · orders for my shop · subscription.

**Admin:** admin dashboard · RBAC employees & permissions (v2).

**System states (every screen):** empty · loading · error · 402 paywall · offline / failed-network.

---

## Phase 0 — Foundation, shell & auth — ✅ LOCKED (2026-06-01)

Built from the Claude Design handoff (`design/verida-design-system/`) against the real auth API. Visual system = `../brand/BRAND.md` (Decision #4): light / white-based, teal primary, violet premium (scarce), Readex Pro via `next/font` (self-hosted). **Arabic (RTL) is the default; English is one tap.** Light theme only; Lucide locked for v1. Primitive catalog: `apps/web/docs/COMPONENTS.md`.

**Cross-cutting:** every interactive control is keyboard-focusable with a visible teal focus ring; directional glyphs mirror via `.flip-rtl`; prices use `.price` isolation + tabular figures; all motion honours `prefers-reduced-motion`.

### Splash / brand intro — `/[locale]/welcome`
- **States:** default only (wordmark reveal → language choice); no data, so no empty/error.
- **Motion:** wordmark + tagline fade/rise (framer-motion), then language buttons. Fades, never slides text. Reduced-motion → instant.
- **RTL/LTR:** centered, direction-agnostic. Bilingual wordmark lockup (Latin · hairline · Arabic). AR is the primary (default) button, EN secondary.

### App shell — Header + BottomNav (wraps every screen)
- **Header (lg):** wordmark → `/`; nav Compare `/catalog` · Discover `/search` · Sell `/business/new`; inline search (GET `/search?q=`); favourites; cart + live count (cart context); AccountMenu; LanguageSwitch. Sticky; hairline + shadow on scroll. Skip-link to `#main`; `<header>`/`<nav>` landmarks; aria labels.
- **BottomNav (mobile, `lg:hidden`):** Home · Compare · Discover · Cart (+badge) · Account; active from pathname; iOS safe-area inset.
- **States:** logged-out (AccountMenu → Sign in / Create account) vs logged-in (account / orders / saved / become-seller [shoppers] / sign-out). Cart badge hidden at 0, "99+" past 99.
- **RTL/LTR:** logical spacing throughout; nav + actions mirror automatically; mobile menu sheet drops from the top.

### Auth — login / register / forgot — `/[locale]/auth`
- **Layout:** split-screen — brand panel (teal, inverse wordmark, tagline, `#E8F3F0` image-slot) + form panel. **Mirrors in RTL** (brand panel moves to the inline-end). On mobile the brand panel is hidden and the wordmark sits above the form.
- **Login:** email + password (show/hide), remember-me, forgot link, primary Sign in, Google **disabled "coming soon" (v2)**, link to register.
- **Register:** role toggle **Shopper / Seller** (→ `role` shopper|business), name, email, password, confirm, terms → privacy/terms links, Google coming-soon, link to login.
- **Forgot:** email → send → success state → back to login. *(No backend reset endpoint yet → success is a stub; real reset is v2.)*
- **States per screen:** default · validation-error (inline per field, `aria-invalid`) · loading (button spinner, disabled) · server-error (dismissible `Alert`: 401 → bad credentials, 409 → email taken, else generic) · success (animated check → redirect home).
- **Transitions:** login⇄register⇄forgot via `AnimatePresence` (fade + RTL-aware slide); success/error via `StateIcon` draw; all reduced-motion safe.
- **Auth wiring:** POST `/auth/login` + `/auth/register` (real API); JWT in `verida_token` cookie (persistent with remember-me, else session); AccountMenu resolves the user via GET `/auth/me`. Roles shopper / business / admin.

> Phase 1+ shopper/seller/admin screens are **not** in Phase 0 and still carry pre-Verida styling via the temporary legacy-compat token aliases in `globals.css`; each is re-skinned in its own phase.
