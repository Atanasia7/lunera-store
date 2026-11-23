"use client";

import {
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

type PasswordManagerProps = {
  hasPassword: boolean;
};

export default function PasswordManager({
  hasPassword:
    initialHasPassword,
}: PasswordManagerProps) {
  const [
    hasPassword,
    setHasPassword,
  ] = useState(
    initialHasPassword,
  );

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrent,
    setShowCurrent,
  ] = useState(false);

  const [
    showNew,
    setShowNew,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

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

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Нові паролі не збігаються.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/account/password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              currentPassword:
                hasPassword
                  ? currentPassword
                  : undefined,

              newPassword,
              confirmPassword,
            }),
          },
        );

      const data =
        (await response.json()) as {
          success?: boolean;
          error?: string;
          mode?:
            | "created"
            | "changed";
        };

      if (!response.ok) {
        setError(
          data.error ??
            "Не вдалося оновити пароль.",
        );

        return;
      }

      if (
        data.mode === "created"
      ) {
        setSuccess(
          "Пароль створено. Тепер ви можете входити і через Google, і за допомогою email та пароля.",
        );

        setHasPassword(true);
      } else {
        setSuccess(
          "Пароль успішно змінено.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
          <KeyRound
            className="h-5 w-5"
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {hasPassword
              ? "Змінити пароль"
              : "Створити пароль"}
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted">
            {hasPassword
              ? "Оновіть пароль для входу до вашого акаунта."
              : "Ви увійшли через Google. Створіть пароль, якщо хочете також входити за допомогою email та пароля."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 max-w-xl"
      >
        {hasPassword && (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">
              Поточний пароль
            </span>

            <div className="glass-control flex h-12 items-center">
              <input
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                value={
                  currentPassword
                }
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                required
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(
                    (current) =>
                      !current,
                  )
                }
                className="flex h-11 w-11 items-center justify-center text-muted hover:text-foreground"
                aria-label="Показати або приховати пароль"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>
        )}

        <label
          className={
            hasPassword
              ? "mt-5 block"
              : "block"
          }
        >
          <span className="mb-2 block text-sm font-medium text-foreground">
            Новий пароль
          </span>

          <div className="glass-control flex h-12 items-center">
            <input
              type={
                showNew
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value,
                )
              }
              minLength={8}
              maxLength={128}
              required
              autoComplete="new-password"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(
                  (current) =>
                    !current,
                )
              }
              className="flex h-11 w-11 items-center justify-center text-muted hover:text-foreground"
              aria-label="Показати або приховати новий пароль"
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <span className="mt-2 block text-xs text-muted">
            Мінімум 8 символів.
          </span>
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Повторіть новий пароль
          </span>

          <div className="glass-control flex h-12 items-center">
            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              minLength={8}
              maxLength={128}
              required
              autoComplete="new-password"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  (current) =>
                    !current,
                )
              }
              className="flex h-11 w-11 items-center justify-center text-muted hover:text-foreground"
              aria-label="Показати або приховати підтвердження пароля"
            >
              {showConfirm ? (
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

        {success && (
          <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Збереження..."
            : hasPassword
              ? "Змінити пароль"
              : "Створити пароль"}
        </button>
      </form>
    </section>
  );
}