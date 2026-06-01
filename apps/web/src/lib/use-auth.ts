"use client";

import { useCallback, useEffect, useState } from "react";
import { Api, type ApiMe } from "@/lib/api";

/* Client-side auth state for the shell (account menu). The JWT lives in the
 * non-httpOnly `verida_token` cookie (set by the auth form), so the browser can
 * read it and resolve the current user via GET /auth/me. */
const TOKEN_COOKIE = "verida_token";

export function readToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function clearToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function useAuth() {
  const [user, setUser] = useState<ApiMe | null>(null);

  useEffect(() => {
    let active = true;
    // setUser only ever runs inside the async resolution (not synchronously in
    // the effect body), which keeps it off the cascading-render path.
    if (readToken()) {
      Api.me()
        .then((u) => {
          if (active) setUser(u);
        })
        .catch(() => {
          /* not signed in / token expired — stay logged-out */
        });
    }
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return { user, signOut };
}
