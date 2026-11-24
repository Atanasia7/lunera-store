"use client";

import {
  Save,
  UserRound,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

type ProfileManagerProps = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function ProfileManager({
  firstName:
    initialFirstName,
  lastName:
    initialLastName,
  phone:
    initialPhone,
  email,
}: ProfileManagerProps) {
  const router =
    useRouter();

  const [
    firstName,
    setFirstName,
  ] = useState(
    initialFirstName,
  );

  const [
    lastName,
    setLastName,
  ] = useState(
    initialLastName,
  );

  const [
    phone,
    setPhone,
  ] = useState(
    initialPhone,
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/account/profile",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              firstName,
              lastName,
              phone,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Не вдалося оновити профіль.",
        );

        return;
      }

      setSuccess(
        "Дані профілю збережено.",
      );

      router.refresh();
    } catch {
      setError(
        "Сталася помилка. Спробуйте ще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
          <UserRound
            className="h-5 w-5"
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Особисті дані
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted">
            Ці дані автоматично
            підставляються при
            оформленні замовлення.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Ім&apos;я
            </span>

            <input
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(
                  event.target.value,
                )
              }
              required
              maxLength={60}
              autoComplete="given-name"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Прізвище
            </span>

            <input
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(
                  event.target.value,
                )
              }
              required
              maxLength={60}
              autoComplete="family-name"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Телефон
            </span>

            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value,
                )
              }
              maxLength={30}
              placeholder="+380 67 123 45 67"
              autoComplete="tel"
              className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Email
            </span>

            <input
              type="email"
              value={email}
              disabled
              className="glass-control h-12 w-full cursor-not-allowed px-4 text-sm text-muted opacity-70"
            />

            <span className="mt-2 block text-xs text-muted">
              Email використовується
              для входу до акаунта.
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />

          {isSubmitting
            ? "Збереження..."
            : "Зберегти зміни"}
        </button>
      </form>
    </section>
  );
}