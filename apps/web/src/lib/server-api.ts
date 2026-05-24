import { cookies } from "next/headers";
import { apiFetch, type RequestOptions } from "./api";

const TOKEN_COOKIE = "aswaq_token";

export async function getServerToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

/**
 * Server-side fetch wrapper. Reads the JWT from the request cookie and forwards
 * it as a Bearer token. Bubbles errors — callers can catch ApiError /
 * PaywallRequiredError / UnauthorizedError to render the right UI.
 */
export async function serverFetch<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const token = opts.token ?? (await getServerToken());
  return apiFetch<T>(path, { ...opts, token });
}

/**
 * Like `serverFetch` but returns `null` on any error. Use when the screen has
 * a sensible empty state and we'd rather render than 5xx.
 */
export async function serverFetchOrNull<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T | null> {
  try {
    return await serverFetch<T>(path, opts);
  } catch {
    return null;
  }
}
