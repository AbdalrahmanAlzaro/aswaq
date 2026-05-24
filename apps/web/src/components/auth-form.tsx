"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

const TOKEN_COOKIE = "aswaq_token";

function setTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function AuthForm({ mode: initialMode }: { mode: "login" | "register" }) {
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const isLogin = mode === "login";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      try {
        const { accessToken } = isLogin
          ? await Api.login(email, password)
          : await Api.register(name, email, password);
        setTokenCookie(accessToken);
        router.push("/");
        router.refresh();
      } catch {
        setError(t("invalid_credentials"));
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 mt-6">
      {!isLogin && (
        <Field
          label={t("name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name_placeholder")}
        />
      )}
      <Field
        label={t("email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={
          isLogin ? t("email_placeholder_login") : t("email_placeholder_register")
        }
      />
      <Field
        label={t("password")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="•••••••"
      />
      {isLogin && (
        <a
          href="#"
          className="self-end text-[var(--accent)] text-[12.5px] font-semibold no-underline"
        >
          {t("forgot")}
        </a>
      )}
      {error && (
        <div className="text-[var(--danger)] text-sm">{error}</div>
      )}
      <div className="mt-1">
        <Button
          kind="primary"
          full
          size="lg"
          type="submit"
          disabled={pending}
        >
          {isLogin ? t("sign_in") : t("create")}
        </Button>
      </div>

      <div className="text-center my-3 text-[var(--fg-3)] text-xs relative">
        <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--border)]" />
        <span className="relative bg-[var(--bg-raised)] px-3">
          {tCommon("or")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button kind="secondary" full icon="globe">
          {t("continue_google")}
        </Button>
        <Button kind="secondary" full>
          {t("continue_apple")}
        </Button>
      </div>

      <div className="text-center mt-5 text-[13.5px] text-[var(--fg-2)]">
        {isLogin ? t("new_here") : t("have_account")}{" "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          className="text-[var(--accent)] font-bold cursor-pointer"
        >
          {isLogin ? t("create_one") : t("sign_in_link")}
        </button>
      </div>
    </form>
  );
}
