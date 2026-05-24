# Aswāq — Monorepo

Local price comparison, reviews & marketplace (Jordan).

- **apps/web** — Next.js 16 (App Router, `src/`, TypeScript, Tailwind, Turbopack) → **http://localhost:3000**
- **apps/api** — NestJS 11 + TypeORM + PostgreSQL (strict TypeScript) → **http://localhost:3001**

The backend mirrors the architecture of the "Safeer Engine v2" AML codebase (BaseEntity,
BaseRepository, GenericController, JWT auth, pagination DSL, response envelope, exception
filters) — but built clean, applying every "do the opposite" lesson from that codebase.

## Requirements
- Node.js 20.9+ (you have 22 ✓)
- npm 10+
- PostgreSQL 13+ running locally

## 1. Install (npm workspaces — one command from the root)
    npm install

## 2. Create the database & env file
    createdb aswaq                       # or: psql -c "CREATE DATABASE aswaq;"
    cp apps/api/.env.example apps/api/.env
    cp apps/web/.env.example apps/web/.env.local
Edit `apps/api/.env` with your Postgres user/password and set a real `JWT_SECRET`.

In development, `DB_SYNCHRONIZE=true` makes TypeORM create the tables from the entities
automatically on first boot — no manual SQL needed. For production, set it to `false` and
use migrations (a standalone `apps/api/src/data-source.ts` is ready for the TypeORM CLI).

## 3. Run (two terminals)
Terminal 1 — API:

    npm run dev:api
    # → http://localhost:3001/api/v1
    # → Swagger UI at http://localhost:3001/doc  (dev only)

Terminal 2 — Web:

    npm run dev:web
    # → http://localhost:3000

CORS is locked to the web origin (`WEB_ORIGIN`). The frontend reads the API base URL from
`NEXT_PUBLIC_API_URL` (see `apps/web/.env.example`).

## API endpoints (all under `/api/v1`)
Auth (public):
- `POST /auth/register`  → { email, password, name, role? }  → { accessToken, user }
- `POST /auth/login`     → { email, password }                → { accessToken, user }

Businesses:
- `GET  /businesses`         (public) list + filter (`category`, `area`, `search`, paging, `sortBy`)
- `GET  /businesses/:id`     (public) one business + its products
- `POST /businesses`         (role: business/admin) create — owner = current user
- `PATCH /businesses/:id`    (owner/admin) update
- `DELETE /businesses/:id`   (owner/admin) soft-delete

Products:
- `GET  /products?businessId=…`     (public) list a business's products
- `GET  /products/compare?ids=a,b`  (auth) compare 2–4 products; **luxury items require Premium → 402**
- `POST /products`                  (owner of the business) create
- `PATCH /products/:id` / `DELETE /products/:id`  (owner/admin)

Reviews:
- `GET  /reviews?businessId=…`  (public) list reviews for a business
- `POST /reviews`               (auth) rate a business (and optionally a product); updates rating averages in a transaction

Every successful response is wrapped as `{ "data": …, "message": "success" }`.

## Backend structure (mirrors the AML codebase, cleanly)
    apps/api/src/
      config/app.config.ts            typed env (app / database / jwt)
      data-source.ts                  standalone DataSource for the TypeORM CLI
      database/entities/              BaseEntity + User, Business, Product, Review
      shared/
        repo/base.repo.ts             pagination (sortBy allow-list, no request-scope contagion)
        dto/pagination.dto.ts         universal list query
        decorators/                   GenericController, @Public, @Roles, @CurrentUser
        guards/                       JwtAuthGuard (global) + RolesGuard
        filters/                      HttpException + QueryFailed (Postgres 23505/23503/23502)
        interceptors/                 ResponseInterceptor ({ data, message })
        modules/jwt-auth/             minimal-payload JWT, one secret, expiresIn
        services/bcrypt.service.ts    bcryptjs
      modules/
        auth/  users/  businesses/  products/  reviews/
