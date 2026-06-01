"use client";

/* Verida — auth form (login ⇄ register ⇄ forgot)
 * Wired to the REAL auth API (POST /auth/login, /auth/register; sets the
 * `verida_token` cookie). Register sends the Shopper/Seller intent as `role`
 * (shopper | business). Google is shown but disabled ("coming soon", v2).
 * Animations adapted from the 21st.dev sign-in + state-icons (framer-motion):
 *   - login⇄register⇄forgot panel transition (fade + RTL-aware slide)
 *   - StateIcon success/error draw on submit result
 *   all gated by prefers-reduced-motion. RTL-safe (logical props).
 * Public API unchanged: <AuthForm mode="login" | "register" />.
 * Note: there is no backend reset endpoint yet, so "forgot" shows the success
 * state without sending mail (real reset is v2).
 */
import * as React from "react";
import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Api, ApiError, type UserRole } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { StateIcon } from "@/components/ui/state-icon";
import { cn } from "@/lib/utils";

type View = "login" | "register" | "forgot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setTokenCookie(token: string, remember: boolean) {
  if (typeof document === "undefined") return;
  const maxAge = remember ? `; max-age=${60 * 60 * 24 * 30}` : "";
  document.cookie = `verida_token=${encodeURIComponent(token)}; path=/${maxAge}; samesite=lax`;
}

function GoogleGlyph() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete,
  show,
  onToggle,
  showLabel,
  hideLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  show: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
}) {
  const id = useId();
  const msgId = error ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          aria-invalid={error ? true : undefined}
          aria-describedby={msgId}
          className={cn(
            "h-11 w-full rounded-xl border bg-background pe-11 ps-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-subtle-foreground",
            error
              ? "border-destructive focus:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30"
              : "border-input focus:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? hideLabel : showLabel}
          className="absolute inset-y-0 end-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && (
        <span id={msgId} className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [view, setView] = useState<View>(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("shopper");
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [forgotSent, setForgotSent] = useState(false);

  const p = (path: string) => `/${locale}${path}`;
  const dirSign = locale === "ar" ? -1 : 1;

  const variants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 18 * dirSign },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -18 * dirSign },
      };

  function switchView(v: View) {
    setView(v);
    setServerError(null);
    setErrs({});
    setForgotSent(false);
    setStatus("idle");
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = t("err_email_required");
    else if (!EMAIL_RE.test(email.trim())) e.email = t("err_email_invalid");

    if (view !== "forgot") {
      if (!password) e.password = t("err_password_min");
      else if (view === "register" && password.length < 8)
        e.password = t("err_password_min");
    }
    if (view === "register") {
      if (!name.trim()) e.name = t("err_name_required");
      if (confirm !== password) e.confirm = t("err_password_mismatch");
      if (!agree) e.agree = t("err_terms");
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function redirectHome() {
    setTimeout(
      () => {
        router.push("/");
        router.refresh();
      },
      reduce ? 150 : 800,
    );
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;

    if (view === "forgot") {
      setStatus("loading");
      // No backend reset endpoint yet (v2) — show the success state.
      setTimeout(
        () => {
          setStatus("idle");
          setForgotSent(true);
        },
        reduce ? 0 : 650,
      );
      return;
    }

    setStatus("loading");
    try {
      if (view === "login") {
        const { accessToken } = await Api.login(email.trim(), password);
        setTokenCookie(accessToken, remember);
      } else {
        const { accessToken } = await Api.register(
          name.trim(),
          email.trim(),
          password,
          role,
        );
        setTokenCookie(accessToken, true);
      }
      setStatus("success");
      redirectHome();
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.status === 401) {
        setServerError(t("invalid_credentials"));
      } else if (err instanceof ApiError && err.status === 409) {
        setServerError(t("email_taken"));
      } else {
        setServerError(t("generic_error"));
      }
    }
  }

  const loading = status === "loading";
  const screen: string =
    status === "success" ? "success" : view === "forgot" && forgotSent ? "sent" : view;

  const googleButton = (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title={t("google_soon")}
      className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-muted-foreground opacity-70"
    >
      <GoogleGlyph />
      {t("continue_google")}
      <span className="ms-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-subtle-foreground">
        {t("google_soon")}
      </span>
    </button>
  );

  const divider = (
    <div className="relative my-1 text-center text-xs text-subtle-foreground">
      <span className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden="true" />
      <span className="relative bg-background px-3">{t("or")}</span>
    </div>
  );

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: reduce ? 0.15 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {screen === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <StateIcon state="success" size={56} className="text-success" label={t("success_title")} />
              <h2 className="mt-4 text-lg font-semibold">{t("success_title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("success_sub")}</p>
            </div>
          ) : screen === "sent" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <StateIcon state="success" size={56} className="text-primary" label={t("forgot_success_title")} />
              <h2 className="mt-4 text-lg font-semibold">{t("forgot_success_title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("forgot_success_sub", { email: email.trim() })}
              </p>
              <Button variant="outline" className="mt-6" onClick={() => switchView("login")}>
                {t("back_to_login")}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {view === "login"
                    ? t("login_title")
                    : view === "register"
                      ? t("register_title")
                      : t("forgot_title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {view === "login"
                    ? t("login_sub")
                    : view === "register"
                      ? t("register_sub")
                      : t("forgot_sub")}
                </p>
              </div>

              {serverError && (
                <Alert variant="danger" onClose={() => setServerError(null)}>
                  {serverError}
                </Alert>
              )}

              {view === "register" && (
                <fieldset className="flex flex-col gap-1.5">
                  <legend className="mb-1.5 text-xs font-medium text-muted-foreground">
                    {t("role_label")}
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["shopper", "business"] as const).map((r) => {
                      const selected = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-xl border p-3 text-start transition-colors",
                            selected
                              ? "border-primary bg-primary-tint"
                              : "border-border bg-background hover:bg-muted",
                          )}
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {r === "shopper" ? t("role_shopper") : t("role_seller")}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {r === "shopper" ? t("role_shopper_hint") : t("role_seller_hint")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {view === "register" && (
                <Field
                  label={t("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("name_placeholder")}
                  autoComplete="name"
                  error={errs.name}
                />
              )}

              <Field
                label={t("email")}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email_placeholder")}
                autoComplete="email"
                error={errs.email}
              />

              {view !== "forgot" && (
                <PasswordField
                  label={t("password")}
                  value={password}
                  onChange={setPassword}
                  error={errs.password}
                  autoComplete={view === "login" ? "current-password" : "new-password"}
                  show={showPw}
                  onToggle={() => setShowPw((v) => !v)}
                  showLabel={t("show_password")}
                  hideLabel={t("hide_password")}
                />
              )}

              {view === "register" && (
                <PasswordField
                  label={t("confirm_password")}
                  value={confirm}
                  onChange={setConfirm}
                  error={errs.confirm}
                  autoComplete="new-password"
                  show={showPw}
                  onToggle={() => setShowPw((v) => !v)}
                  showLabel={t("show_password")}
                  hideLabel={t("hide_password")}
                />
              )}

              {view === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="size-4 rounded border-input accent-primary"
                    />
                    {t("remember_me")}
                  </label>
                  <button
                    type="button"
                    onClick={() => switchView("forgot")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("forgot")}
                  </button>
                </div>
              )}

              {view === "register" && (
                <div className="flex flex-col gap-1">
                  <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      aria-invalid={errs.agree ? true : undefined}
                      className="mt-0.5 size-4 rounded border-input accent-primary"
                    />
                    <span>
                      {t("terms_prefix")}{" "}
                      <a href={p("/terms")} className="font-medium text-primary hover:underline">
                        {t("terms_link")}
                      </a>{" "}
                      {t("terms_and")}{" "}
                      <a href={p("/privacy")} className="font-medium text-primary hover:underline">
                        {t("privacy_link")}
                      </a>
                    </span>
                  </label>
                  {errs.agree && <span className="text-xs text-destructive">{errs.agree}</span>}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && (
                  <StateIcon state="loading" size={18} className="text-primary-foreground" />
                )}
                {view === "login"
                  ? loading
                    ? t("signing_in")
                    : t("sign_in")
                  : view === "register"
                    ? loading
                      ? t("creating")
                      : t("create")
                    : loading
                      ? t("forgot_sending")
                      : t("forgot_send")}
              </Button>

              {view === "forgot" ? (
                <Button variant="ghost" className="w-full" onClick={() => switchView("login")}>
                  {t("back_to_login")}
                </Button>
              ) : (
                <>
                  {divider}
                  {googleButton}
                  <p className="mt-1 text-center text-sm text-muted-foreground">
                    {view === "login" ? t("new_here") : t("have_account")}{" "}
                    <button
                      type="button"
                      onClick={() => switchView(view === "login" ? "register" : "login")}
                      className="font-semibold text-primary hover:underline"
                    >
                      {view === "login" ? t("create_one") : t("sign_in_link")}
                    </button>
                  </p>
                </>
              )}
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
