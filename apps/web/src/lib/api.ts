/**
 * Verida API client.
 *
 * Hits NEXT_PUBLIC_API_URL (which already includes /api/v1), unwraps the
 * `{ data, message }` envelope, attaches the JWT from the `verida_token`
 * cookie (client) or the incoming request cookies (server), and surfaces
 * the 402 luxury-compare paywall as a typed `PaywallRequiredError`.
 *
 * The backend returns flat domain entities (no localised name fields). The
 * UI components were built around `{ en: { name }, ar: { name } }` shapes,
 * so the mappers in this file project each API entity into that shape with
 * the same value in both locales. Real i18n on entity fields is a future
 * task — flagged in CLAUDE.md.
 */

/* ---------------------------------- types --------------------------------- */

export type Locale = "en" | "ar";

export type ApiEnvelope<T> = { data: T; message?: string };
export type Paginated<T> = { items: T[]; meta: PaginatedMeta };
export interface PaginatedMeta {
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
export class PaywallRequiredError extends ApiError {
  constructor(body?: unknown) {
    super(402, "Premium required", body);
    this.name = "PaywallRequiredError";
  }
}
export class UnauthorizedError extends ApiError {
  constructor(body?: unknown) {
    super(401, "Unauthorized", body);
    this.name = "UnauthorizedError";
  }
}

export type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
};

const TOKEN_COOKIE = "verida_token";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to apps/web/.env.local.",
    );
  }
  return url.replace(/\/$/, "");
}

function readBrowserToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = getBaseUrl();
  const url = new URL(
    path.startsWith("/") ? `${base}${path}` : `${base}/${path}`,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { body, token, query, headers, ...rest } = opts;
  const url = buildUrl(path, query);

  const finalHeaders = new Headers(headers);
  finalHeaders.set("accept", "application/json");
  if (body !== undefined) {
    finalHeaders.set("content-type", "application/json");
  }
  const authToken = token ?? readBrowserToken();
  if (authToken) {
    finalHeaders.set("authorization", `Bearer ${authToken}`);
  }

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let parsed: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401) throw new UnauthorizedError(parsed);
    if (res.status === 402) throw new PaywallRequiredError(parsed);
    let msg: string = res.statusText || `HTTP ${res.status}`;
    if (
      parsed &&
      typeof parsed === "object" &&
      "message" in parsed &&
      typeof (parsed as { message: unknown }).message === "string"
    ) {
      msg = (parsed as { message: string }).message;
    }
    throw new ApiError(res.status, msg, parsed);
  }

  // The Nest ResponseInterceptor wraps every success in `{ data, message }`.
  // Paginated lists land as `{ data: { items, meta }, message }`.
  if (
    parsed &&
    typeof parsed === "object" &&
    "data" in parsed &&
    !Array.isArray(parsed)
  ) {
    return (parsed as ApiEnvelope<T>).data;
  }
  return parsed as T;
}

/* -------------------------- raw API entity shapes ------------------------- */

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  icon: string | null;
  isLuxury: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface ApiBusiness {
  id: string;
  name: string;
  // Deprecated free-text columns (kept during transition; new readers should
  // use cityId / areaId).
  area: string | null;
  city: string | null;
  cityId: string | null;
  areaId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  description: string | null;
  isVerified: boolean;
  subscriptionTier: "basic" | "pro" | "premium";
  ratingAvg: number;
  reviewCount: number;
  categoryId: string;
  category?: ApiCategory;
  ownerId: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  currency: string;
  isAvailable: boolean;
  ratingAvg: number;
  reviewCount: number;
  businessId: string;
}

export interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  businessId: string;
  productId: string | null;
  userId: string;
  createdAt: string;
  // Present on GET /reviews?businessId — joined from the reviewer's user row.
  // `verified` is a placeholder until verified-purchase support exists.
  author?: string | null;
  verified?: boolean;
}

// Curated reference table — admin-extendable. Used by the search city
// dropdown and the business owner form.
export interface ApiCity {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  governorate: string | null;
  latitude: number | null;
  longitude: number | null;
  sortOrder: number;
  isActive: boolean;
}

// Neighbourhood / district inside a city.
export interface ApiArea {
  id: string;
  cityId: string;
  slug: string;
  name: string;
  nameAr: string;
  latitude: number | null;
  longitude: number | null;
  sortOrder: number;
}

// Canonical, brand+unit-specific item that multiple sellers offer. Standardised
// goods carry a CatalogItem; unique items (a cafe's dish) leave it null.
export interface ApiCatalogItem {
  id: string;
  name: string;
  nameAr: string | null;
  categoryId: string;
  unit: string;
  brand: string | null;
  imageUrl: string | null;
}

// /catalog list rows carry aggregates over their seller offers.
export interface ApiCatalogListItem extends ApiCatalogItem {
  lowestPrice: number | null;
  sellerCount: number;
}

// /catalog/:id/offers — one row per seller, ascending by price.
export interface ApiCatalogOffer {
  id: string;
  name: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  imageUrl: string | null;
  isCheapest: boolean;
  // Per-product rating summary (denormalised on the Product row).
  ratingAvg: number;
  reviewCount: number;
  business: {
    id: string;
    name: string;
    ratingAvg: number;
    area: string | null;
    city: string | null;
  };
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ApiOrder {
  id: string;
  userId: string;
  businessId: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  total: number;
  currency: string;
  notes: string | null;
  createdAt: string;
  items?: ApiOrderItem[];
}

export interface ApiFavorite {
  id: string;
  userId: string;
  businessId: string;
  business?: ApiBusiness;
}

export type UserRole = "shopper" | "business" | "admin";

export interface ApiMe {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPremium: boolean;
}

export interface ApiCompareItem {
  id: string;
  name: string;
  price: number;
  ratingAvg: number;
  business: {
    id: string;
    name: string;
    ratingAvg: number;
    category: { id: string; slug: string; name: string } | null;
  };
  isCheapest: boolean;
  isTopRated: boolean;
}

/* ------------------------- UI-friendly projections ------------------------ */
// The UI components were built against bilingual {en, ar} shapes; project the
// flat API entities into that shape with identical strings in both locales.

export interface Business {
  id: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  open: boolean;
  verified?: boolean;
  luxury?: boolean;
  photo?: string;
  en: { name: string; tagline?: string; neighborhood?: string };
  ar: { name: string; tagline?: string; neighborhood?: string };
}

export interface Product {
  id: string;
  vendorId: string;
  price: number;
  was?: number;
  luxury?: boolean;
  photo?: string;
  en: { name: string };
  ar: { name: string };
}

export interface Review {
  id: string;
  author: string;
  initial: string;
  rating: number;
  when: string;
  verified?: boolean;
  en: string;
  ar: string;
}

export interface Order {
  id: string;
  date: string;
  vendorId: string;
  status: "preparing" | "delivered" | "cancelled" | "confirmed";
  total: number;
}

export function mapBusiness(b: ApiBusiness): Business {
  const name = b.name;
  const tagline = b.description ?? undefined;
  const neighborhood = b.area ?? b.city ?? undefined;
  return {
    id: b.id,
    category: b.category?.slug ?? "",
    rating: b.ratingAvg ?? 0,
    reviews: b.reviewCount ?? 0,
    distance: "",
    open: true,
    verified: b.isVerified,
    luxury: b.category?.isLuxury ?? false,
    photo: b.coverUrl ?? b.logoUrl ?? undefined,
    en: { name, tagline, neighborhood },
    ar: { name, tagline, neighborhood },
  };
}

export function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    vendorId: p.businessId,
    price: p.price,
    photo: p.imageUrl ?? undefined,
    en: { name: p.name },
    ar: { name: p.name },
  };
}

export function mapReview(r: ApiReview): Review {
  const comment = r.comment ?? "";
  const author = r.author?.trim() ? r.author : null;
  return {
    id: r.id,
    author: author ?? "—",
    initial: (author ?? "·").slice(0, 1).toUpperCase(),
    rating: r.rating,
    when: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : "",
    verified: !!r.verified,
    en: comment,
    ar: comment,
  };
}

function mapApiStatusToUi(s: ApiOrder["status"]): Order["status"] {
  switch (s) {
    case "pending":
      return "preparing";
    case "confirmed":
      return "confirmed";
    case "completed":
      return "delivered";
    case "cancelled":
      return "cancelled";
  }
}

export function mapOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    date: o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "",
    vendorId: o.businessId,
    status: mapApiStatusToUi(o.status),
    total: o.total,
  };
}

/* ------------------------------- public Api ------------------------------- */

export const Api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: ApiMe }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  // `role` is optional; the API defaults to "shopper". The register screen
  // sends "shopper" or "business" via the Shopper / Seller intent toggle.
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
  ) =>
    apiFetch<{ accessToken: string; user: ApiMe }>("/auth/register", {
      method: "POST",
      body: { name, email, password, ...(role ? { role } : {}) },
    }),
  me: (token?: string) => apiFetch<ApiMe>("/auth/me", { token }),

  // Categories
  categories: () => apiFetch<ApiCategory[]>("/categories"),

  // Businesses (paginated)
  businessesPage: (params: {
    categoryId?: string;
    cityId?: string;
    areaId?: string;
    search?: string;
    page?: number;
    perPage?: number;
  } = {}) =>
    apiFetch<Paginated<ApiBusiness>>("/businesses", {
      query: params,
    }),
  business: (id: string) => apiFetch<ApiBusiness>(`/businesses/${id}`),

  // Cities + areas (curated reference tables; public list, admin extend).
  cities: {
    list: (search?: string) =>
      apiFetch<ApiCity[]>("/cities", { query: { search } }),
    get: (id: string) => apiFetch<ApiCity>(`/cities/${id}`),
    areas: (cityId: string) => apiFetch<ApiArea[]>(`/cities/${cityId}/areas`),
  },

  // Owner / admin: create a business
  createBusiness: (body: {
    name: string;
    categoryId: string;
    cityId?: string;
    areaId?: string;
    address?: string;
    phone?: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
  }, token?: string) =>
    apiFetch<ApiBusiness>("/businesses", { method: "POST", body, token }),
  updateBusiness: (
    id: string,
    body: Partial<{
      name: string;
      categoryId: string;
      cityId: string | null;
      areaId: string | null;
      address: string;
      phone: string;
      description: string;
      logoUrl: string;
      coverUrl: string;
    }>,
    token?: string,
  ) =>
    apiFetch<ApiBusiness>(`/businesses/${id}`, {
      method: "PATCH",
      body,
      token,
    }),

  // Products (list by business is not paginated server-side)
  productsByBusiness: (businessId: string) =>
    apiFetch<ApiProduct[]>("/products", { query: { businessId } }),
  product: (id: string) => apiFetch<ApiProduct>(`/products/${id}`),
  compare: (ids: string[], token?: string) =>
    apiFetch<ApiCompareItem[]>("/products/compare", {
      query: { ids: ids.join(",") },
      token,
    }),

  // Reviews (paginated)
  reviewsByBusiness: (businessId: string, page = 1, perPage = 20) =>
    apiFetch<Paginated<ApiReview>>("/reviews", {
      query: { businessId, page, perPage },
    }),
  reviewsByProduct: (productId: string, page = 1, perPage = 20) =>
    apiFetch<Paginated<ApiReview>>("/reviews", {
      query: { productId, page, perPage },
    }),

  // Orders
  ordersPage: (page = 1, perPage = 20, token?: string) =>
    apiFetch<Paginated<ApiOrder>>("/orders", {
      query: { page, perPage },
      token,
    }),
  placeOrder: (
    body: {
      businessId: string;
      items: { productId: string; quantity: number }[];
      notes?: string;
    },
    token?: string,
  ) =>
    apiFetch<ApiOrder>("/orders", {
      method: "POST",
      body,
      token,
    }),

  // Catalog (cross-market price comparison)
  catalog: {
    list: (params: {
      search?: string;
      categoryId?: string;
      city?: string;
      page?: number;
      perPage?: number;
    } = {}) =>
      apiFetch<Paginated<ApiCatalogListItem>>("/catalog", { query: params }),
    get: (id: string) => apiFetch<ApiCatalogItem>(`/catalog/${id}`),
    offers: (id: string) =>
      apiFetch<ApiCatalogOffer[]>(`/catalog/${id}/offers`),
  },

  // Favorites (shopper-scoped)
  favorites: {
    list: (token?: string) => apiFetch<ApiFavorite[]>("/favorites", { token }),
    add: (businessId: string, token?: string) =>
      apiFetch<ApiFavorite>("/favorites", {
        method: "POST",
        body: { businessId },
        token,
      }),
    remove: (businessId: string, token?: string) =>
      apiFetch<{ businessId: string }>(`/favorites/${businessId}`, {
        method: "DELETE",
        token,
      }),
  },
};

/* -------------------------- shop minimum (25 JD) --------------------------- */

export const SHOP_MINIMUM_JD = 25;
export const DELIVERY_FEE_PER_SHOP_JD = 2;

// `vendorName` is a snapshot of the business name at add-to-cart time, so
// the cart can render the real vendor without a follow-up GET /businesses/:id.
// If a caller adds without supplying it, the UI falls back to a translated
// placeholder (Cart.shop_label).
export type CartLine = {
  product: Product;
  qty: number;
  vendorName?: string;
};

export interface VendorGroup {
  vendorName?: string;
  lines: CartLine[];
  subtotal: number;
  needed: number;
}

export function groupByVendor(
  cart: CartLine[],
): Record<string, VendorGroup> {
  const groups: Record<string, VendorGroup> = {};
  for (const line of cart) {
    const vid = line.product.vendorId;
    if (!groups[vid]) groups[vid] = { lines: [], subtotal: 0, needed: 0 };
    groups[vid].lines.push(line);
    groups[vid].subtotal += line.product.price * line.qty;
    // First non-empty snapshot wins; later lines from the same shop keep it.
    if (!groups[vid].vendorName && line.vendorName) {
      groups[vid].vendorName = line.vendorName;
    }
  }
  for (const g of Object.values(groups)) {
    g.needed = Math.max(0, SHOP_MINIMUM_JD - g.subtotal);
  }
  return groups;
}

export function canCheckout(cart: CartLine[]): boolean {
  const groups = groupByVendor(cart);
  return (
    Object.keys(groups).length > 0 &&
    Object.values(groups).every((g) => g.needed === 0)
  );
}
