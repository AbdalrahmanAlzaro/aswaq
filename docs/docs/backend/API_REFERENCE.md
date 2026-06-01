# API Reference

> ⚠️ **Do NOT fill this from memory.** Generate and verify it from the live API: Swagger at `/doc` (dev) and the JSON at `/doc-json`.
> This file is a **provisional index only**. Claude Code must replace it with the real, verified endpoint list as a first step of implementation, and keep it in sync whenever routes change.

## Basics (verified)

- **Base URL:** `localhost:3001/api/v1`
- **Response envelope:** `{ data, message }`; lists return `{ data: { items, meta }, message }` (meta nested in data).
- **Auth:** global `JwtAuthGuard` (JWT); routes opt out with `@Public()`. Roles via `@Roles()` + `RolesGuard`.
- **Errors:** `HttpExceptionFilter` + `QueryFailedExceptionFilter` (Postgres 23505 unique / 23503 FK / 23502 not-null → clean HTTP errors).
- **Paging:** `BaseRepository.paginate()` — allow-listed free-text search + validated `sortBy`, returns `{ items, meta }`.

## Modules (13) — provisional; verify all routes against the code

`auth`, `users`, `businesses`, `categories`, `products`, `reviews`, `orders`, `subscriptions`, `payments`, `media`, `favorites`, `catalog`, `cities`.

## TODO (Claude Code)

- [ ] Export `/doc-json` and generate the real endpoint list (paths, methods, DTOs, auth, roles).
- [ ] Document the catalog comparison endpoints and the `compare()` **402** paywall behaviour explicitly.
- [ ] Keep this file in sync as part of any task that changes routes.
