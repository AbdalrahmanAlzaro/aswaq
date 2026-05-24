// Categories are now sourced from the API (GET /categories). This file only
// exports types/constants needed by the URL layer (the "all" pseudo-slug used
// by the search page to mean "no filter").

export const ALL_SLUG = "all";

export type CategoryNav =
  | { slug: typeof ALL_SLUG }
  | { id: string; slug: string; isLuxury: boolean };
