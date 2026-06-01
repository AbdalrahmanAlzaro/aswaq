# Aswaq business owner dashboard

The operator counterpart to the shopper app. A desktop-web dashboard for cafés, shops, gyms and others to manage their Aswaq listing.

Open `index.html` directly. Use the **sidebar** to switch pages; the **language switcher** in the header flips the entire UI between English (LTR) and Arabic (RTL).

## Pages

| Page | What it does |
|---|---|
| **Overview** | Greeting, today's KPIs (orders, revenue, rating, cancellations), 14-day revenue sparkline, top products, recent orders |
| **Orders** | All orders, filterable by status (new / preparing / delivered / cancelled), with row-level accept/decline |
| **Products** | List + stock + price + 30-day sold count, filter by stock state, table actions |
| **Reviews** | Aggregate rating + reply-rate + verified-share, recent reviews with reply / flag actions |
| **My business** | Public profile fields + verification + premium-seller upsell |
| **Subscription** | Three plans: free Souq / Souq + / Premium Seller, with per-order fee schedule and "Current" indicator |
| **Settings** | Stubbed |

## Components

All in `app.jsx`:

- `Dashboard` — root component, owns page + lang state
- `Side` — vertical sidebar nav with grouping, counts, owner card
- `Top` — header crumbs + search + language switch + bell
- `Tile`, `RevenueSpark` — KPI tile + inline area chart
- `OrdersTable`, `STATUS_BADGE` — orders table + status pill
- `PlanCard` — three styling modes: free / current-highlight / dark Premium
- `DashField`, `Ico` — small primitives

## Caveats

- This is a recreation of how the dashboard should *look*; the filters and accept/decline buttons don't mutate state.
- Revenue chart uses synthetic data hard-coded in `RevenueSpark`.
- No real export / CSV import / role management / billing flow — those are stubbed at the surface level.
