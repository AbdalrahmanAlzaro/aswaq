# Brand — Verida

**Name:** **Verida** — approved 2026-05-31 (see `../decisions/DECISIONS_LOG.md` #0).
**Pronunciation:** *ve-REE-da.*
**Meaning / rationale:** evokes *veritas* ("truth") — anchors the reviews-and-trust pillar; soft, warm, international sound that matched the owner's taste.
**Bilingual:** Latin wordmark "Verida"; Arabic rendering فيريدا — confirm preferred Arabic spelling and the bilingual wordmark treatment during design.
**Domain (planned):** `verida.jo` and/or `veridaapp.com` (`verida.com` is unavailable). Confirm at registration.
**Trademark:** must be cleared in the relevant class + country before launch (not yet done). *(Not legal advice.)*

---

## Visual system — LOCKED (Decision #4, 2026-06-01)

> Replaces the discarded "warm souq" placeholder (terracotta/cream/gold; Fraunces / Plus Jakarta / El Messiri / IBM Plex Arabic) **entirely**. Nothing is carried over from it.
>
> **Concept — "verified clarity":** clean, light, **white-based**; warm enough to feel local and credible, disciplined enough to feel honest. The tokens below are the source of truth for the design system; the Tailwind v4 `@theme` is generated from them.

### Color tokens

| Role | Token | Hex |
|---|---|---|
| Primary · brand / action | `--color-primary` | `#0E7A66` |
| Primary · hover / active | `--color-primary-hover` | `#0B6151` |
| Primary · tint / selected | `--color-primary-tint` | `#E8F3F0` |
| On-primary (text/icon on primary) | `--color-on-primary` | `#FFFFFF` |
| Premium / luxury accent (scarce) | `--color-premium` | `#7C3AED` |
| Premium · tint | `--color-premium-tint` | `#F1ECFE` |
| Premium · text-on-tint | `--color-premium-ink` | `#5B21B6` |
| Surface | `--color-surface` | `#FFFFFF` |
| Surface 2 (sections) | `--color-surface-2` | `#F5F7F8` |
| Border / hairline | `--color-border` | `#E6E9EC` |
| Ink · primary text | `--color-text` | `#111827` |
| Text · secondary | `--color-text-secondary` | `#5B6472` |
| Text · muted | `--color-text-muted` | `#98A1AD` |
| Success / cheapest / in-stock | `--color-success` | `#16A34A` |
| Success · tint | `--color-success-tint` | `#E9F7EF` |
| Danger / out-of-stock / destructive | `--color-danger` | `#DC2626` |
| Danger · tint | `--color-danger-tint` | `#FCEDED` |
| Warning / below-minimum nudge | `--color-warning` | `#D97706` |
| Warning · tint | `--color-warning-tint` | `#FDF3E7` |
| Info | `--color-info` | `#2563EB` |
| Info · tint | `--color-info-tint` | `#E8F0FE` |

**Color rules**
- **One scarce premium signal.** `--color-premium` (violet) is used *only* for the Premium/luxury badge and the "Upgrade to Premium" CTA — never as a generic accent.
- **Cheapest = success green**, kept visually distinct from the teal brand so a green action button never reads as a price flag.
- **Verified badge** uses the primary teal-green family + a check (the trust pillar).
- All foreground/background pairs target **WCAG AA**.
- *(Inactive alternative on file if ever revisited: premium as warm gold `#C9931F`.)*

### Typography

- **Family — Readex Pro** (one variable family covering **Arabic + Latin**), chosen for clear, simplified bilingual reading that serves the Arabic-first requirement and the "clarity / truth" brand from a single harmonious type system.
- **Weights:** headlines 600 · body 400 · labels / buttons 500 (300 available for large, quiet display text).
- **Numerals:** **Western digits (0–9)** for prices and cross-market comparison; **tabular / lining figures** so price columns align (supports the "prices never reorder" rule). *(Eastern-Arabic numerals ١٢٣ noted as a possible future toggle — not v1.)*
- *(Inactive alternative on file if ever revisited: Tajawal (Arabic) + Inter (Latin).)*

### Layout / RTL — product requirement, applies to every screen
- **Arabic (RTL) is the default**; English is a one-tap switch.
- Build **direction-agnostic**: logical properties (`ms-`/`me-`, `text-start`/`text-end`, `start`/`end`), `dir="rtl"`, and **mirrored** directional icons + chevrons.
- **Price isolation:** monetary values never reorder under RTL.

---

## Open brand decisions (still to make)
- **Logo:** direction not chosen.
- **Tagline:** not chosen — bilingual AR/EN.
- ~~**Visual system — Decision #4**~~ ✅ **LOCKED 2026-06-01** (see above).

---

## Code rename (post-approval chore for Claude Code)
- `aswaq_token` → `verida_token`
- `aswaq_cart_v1` → `verida_cart_v1`
- `design/aswaq-design-system` → `design/verida-design-system`
