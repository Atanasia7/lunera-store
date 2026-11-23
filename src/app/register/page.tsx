"use client";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserPlus,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

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

    const password =
      String(
        formData.get("password") ?? "",
      );

    const confirmPassword =
      String(
        formData.get(
          "confirmPassword",
        ) ?? "",
      );

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Паролі не співпадають.",
      );

      setIsSubmitting(false);

      return;
    }

    try {
      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              firstName:
                formData.get(
                  "firstName",
                ),

              lastName:
                formData.get(
                  "lastName",
                ),

              email:
                formData.get(
                  "email",
                ),

              phone:
                formData.get(
                  "phone",
                ),

              password,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Помилка реєстрації.",
        );
      }

      router.push(
        "/login?registered=true",
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Помилка реєстрації.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell py-12">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-border bg-surface shadow-(--shadow) backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left side */}

        <div className="hidden bg-accent-soft p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="editorial-title text-3xl tracking-[0.12em] text-foreground"
            >
              LUNERA
            </Link>

            <h2 className="editorial-title mt-14 max-w-sm text-5xl leading-tight text-foreground">
              Створіть свій
              простір Lunera
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              Зберігайте обрані товари,
              переглядайте замовлення та
              оформлюйте покупки швидше.
            </p>
          </div>

          <div className="glass-control mt-12 p-5">
            <p className="text-sm font-medium text-foreground">
              Один акаунт — усі можливості
            </p>

            <p className="mt-2 text-xs leading-5 text-muted">
              Після реєстрації ви зможете
              використовувати особистий
              кабінет Lunera.
            </p>
          </div>
        </div>

        {/* Form */}

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
            <UserPlus
              className="h-5 w-5"
              strokeWidth={1.7}
            />
          </div>

          <h1 className="editorial-title mt-6 text-4xl text-foreground sm:text-5xl">
            Реєстрація
          </h1>

          <p className="mt-3 text-sm text-muted">
            Створіть обліковий запис Lunera.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <RegisterField
                label="Ім'я"
                name="firstName"
                placeholder="Олена"
              />

              <RegisterField
                label="Прізвище"
                name="lastName"
                placeholder="Шевченко"
              />
            </div>

            <div className="mt-5">
              <RegisterField
                label="Електронна пошта"
                name="email"
                type="email"
                placeholder="example@email.com"
              />
            </div>

            <div className="mt-5">
              <RegisterField
                label="Телефон"
                name="phone"
                type="tel"
                placeholder="+380 67 123 45 67"
                required={false}
              />
            </div>

            <div className="mt-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-foreground">
                  Пароль
                </span>

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
                    minLength={8}
                    placeholder="Мінімум 8 символів"
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
            </div>

            <div className="mt-5">
              <RegisterField
                label="Повторіть пароль"
                name="confirmPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Повторіть пароль"
              />
            </div>

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
                ? "Створення акаунта..."
                : "Створити акаунт"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Вже маєте акаунт?{" "}
            <Link
              href="/login"
              className="font-medium text-accent-hover"
            >
              Увійти
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-muted">
            Реєструючись, ви погоджуєтесь
            з політикою конфіденційності
            Lunera.
          </p>
        </div>
      </section>
    </main>
  );
}

function RegisterField({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>

      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}