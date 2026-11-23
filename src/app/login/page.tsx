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
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function LoginPage() {
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

  return (
    <main className="page-shell py-12">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-border bg-surface shadow-(--shadow) backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left */}

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

        {/* Form */}

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

          {/* Google later */}

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-muted" />

            <span className="text-xs text-muted">
              або
            </span>

            <div className="h-px flex-1 bg-border-muted" />
          </div>

          <button
            type="button"
            disabled
            className="glass-control flex h-12 w-full items-center justify-center gap-3 text-sm font-medium text-muted opacity-60"
          >
            Google
            <span className="text-xs">
              — підключимо наступним кроком
            </span>
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