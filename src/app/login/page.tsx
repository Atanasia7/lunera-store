"use client";

import Link from "next/link";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
} from "lucide-react";

import { signIn } from "next-auth/react";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const registered =
    searchParams.get("registered") ===
    "true";

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    const formData =
      new FormData(
        event.currentTarget,
      );

    const email =
      String(
        formData.get("email") ?? "",
      )
        .trim()
        .toLowerCase();

    const password =
      String(
        formData.get("password") ?? "",
      );

    try {
      const result =
        await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false,
          },
        );

      if (result?.error) {
        setError(
          "Невірна електронна пошта або пароль.",
        );

        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError(
        "Не вдалося виконати вхід.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");

    try {
      await signIn(
        "google",
        {
          redirectTo:
            "/account",
        },
      );
    } catch {
      setError(
        "Не вдалося виконати вхід через Google.",
      );
    }
  }

  return (
    <main className="page-shell py-12">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-border bg-surface shadow-(--shadow) backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-accent-soft p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="editorial-title text-3xl tracking-[0.12em] text-foreground"
            >
              LUNERA
            </Link>

            <h2 className="editorial-title mt-14 max-w-sm text-5xl leading-tight text-foreground">
              Раді бачити
              вас знову
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              Увійдіть до особистого
              кабінету, щоб переглядати
              замовлення, обране та
              керувати своїми даними.
            </p>
          </div>

          <div className="glass-control mt-12 p-5">
            <p className="text-sm font-medium text-foreground">
              Ваш простір Lunera
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              Один акаунт для покупок,
              обраних товарів і історії
              замовлень.
            </p>
          </div>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
            <LogIn
              className="h-5 w-5"
              strokeWidth={1.7}
            />
          </div>

          <h1 className="editorial-title mt-6 text-4xl text-foreground sm:text-5xl">
            Вхід
          </h1>

          <p className="mt-3 text-sm text-muted">
            Увійдіть до свого акаунта
            Lunera.
          </p>

          {registered && (
            <div className="mt-6 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-foreground">
              Реєстрацію завершено.
              Тепер ви можете увійти ✓
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">
                Електронна пошта
              </span>

              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="example@email.com"
                className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
              />
            </label>

            <label className="mt-5 block">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-foreground">
                  Пароль
                </span>

                <button
                  type="button"
                  className="text-xs text-accent-hover"
                >
                  Забули пароль?
                </button>
              </div>

              <div className="glass-control flex h-12 items-center">
                <LockKeyhole
                  className="ml-4 h-4 w-4 shrink-0 text-muted"
                  strokeWidth={1.7}
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Ваш пароль"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  className="flex h-11 w-11 items-center justify-center text-muted transition hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Приховати пароль"
                      : "Показати пароль"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Вхід..."
                : "Увійти"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-muted" />

            <span className="text-xs text-muted">
              або
            </span>

            <div className="h-px flex-1 bg-border-muted" />
          </div>

          <button
            type="button"
            onClick={
              handleGoogleLogin
            }
            className="glass-control flex h-12 w-full items-center justify-center gap-3 text-sm font-medium text-foreground transition hover:border-accent"
          >
            <GoogleIcon />

            Увійти через Google
          </button>

          <p className="mt-7 text-center text-sm text-muted">
            Ще немає акаунта?{" "}
            <Link
              href="/register"
              className="font-medium text-accent-hover"
            >
              Зареєструватися
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function LoginPageFallback() {
  return (
    <main className="page-shell py-12">
      <section className="mx-auto min-h-150 max-w-5xl animate-pulse rounded-[32px] border border-border bg-surface shadow-(--shadow)" />
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.227c0-.709-.064-1.391-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.509h3.232c1.891-1.741 2.982-4.305 2.982-7.35Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.041.955-3.386.955-2.605 0-4.809-1.759-5.596-4.123H3.064v2.591A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.404 13.9A6.01 6.01 0 0 1 6.09 12c0-.659.114-1.3.314-1.9V7.509H3.064A10 10 0 0 0 2 12c0 1.614.386 3.141 1.064 4.491L6.404 13.9Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.977c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.959 2.991 14.695 2 12 2a10 10 0 0 0-8.936 5.509l3.34 2.591C7.191 7.736 9.395 5.977 12 5.977Z"
      />
    </svg>
  );
}