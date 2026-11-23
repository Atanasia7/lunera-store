"use client";

import Link from "next/link";
import {
  Heart,
  LogOut,
  Package,
  Save,
  ShoppingBag,
  User,
} from "lucide-react";

import {
  FormEvent,
  useState,
  useSyncExternalStore,
} from "react";

import { useCart } from "@/components/CartProvider";
import { useFavorites } from "@/components/FavoritesProvider";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const STORAGE_KEY =
  "lunera-profile";

const EMPTY_PROFILE: Profile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function loadProfile(): Profile {
  if (typeof window === "undefined") {
    return EMPTY_PROFILE;
  }

  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!saved) {
      return EMPTY_PROFILE;
    }

    return JSON.parse(saved);
  } catch {
    return EMPTY_PROFILE;
  }
}

function subscribeToHydration() {
  return () => {};
}

export default function AccountPage() {
  const { totalItems } =
    useCart();

  const { totalFavorites } =
    useFavorites();

  const hydrated =
    useSyncExternalStore(
      subscribeToHydration,
      () => true,
      () => false,
    );

  const [profile, setProfile] =
    useState<Profile>(
      loadProfile,
    );

  const [saved, setSaved] =
    useState(false);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function clearProfile() {
    localStorage.removeItem(
      STORAGE_KEY,
    );

    setProfile({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

    setSaved(false);
  }

  if (!hydrated) {
    return (
      <main className="page-shell py-10">
        <div className="glass-panel min-h-100" />
      </main>
    );
  }

  return (
    <main className="page-shell py-10">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link
          href="/"
          className="transition hover:text-foreground"
        >
          Головна
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Особистий кабінет
        </span>
      </nav>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-hover">
          Lunera account
        </p>

        <h1 className="editorial-title mt-2 text-5xl text-foreground md:text-6xl">
          Особистий кабінет
        </h1>

        <p className="mt-3 text-sm text-muted">
          Керуйте особистими даними,
          обраними товарами та покупками.
        </p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <AccountStat
          icon={<Heart />}
          value={totalFavorites}
          label="Обраних товарів"
          href="/favorites"
        />

        <AccountStat
          icon={<ShoppingBag />}
          value={totalItems}
          label="Товарів у кошику"
          href="/cart"
        />

        <AccountStat
          icon={<Package />}
          value="—"
          label="Замовлення"
        />
      </section>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="glass-panel p-5">
          <div className="flex items-center gap-4 border-b border-border-muted pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <User
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-foreground">
                {profile.firstName ||
                profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : "Гість"}
              </p>

              <p className="mt-1 truncate text-xs text-muted">
                {profile.email ||
                  "Дані профілю не заповнені"}
              </p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            <div className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
              Особисті дані
            </div>

            <Link
              href="/favorites"
              className="block rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              Обране
            </Link>

            <Link
              href="/cart"
              className="block rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              Кошик
            </Link>
          </nav>

          <button
            type="button"
            onClick={clearProfile}
            className="mt-6 flex w-full items-center gap-2 border-t border-border-muted px-4 pt-5 text-sm text-muted transition hover:text-foreground"
          >
            <LogOut
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            Очистити профіль
          </button>
        </aside>

        <section className="glass-panel p-7">
          <h2 className="editorial-title text-3xl text-foreground">
            Особисті дані
          </h2>

          <p className="mt-2 text-sm text-muted">
            Дані використовуються для
            швидшого оформлення замовлень.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ProfileField
                label="Ім'я"
                value={
                  profile.firstName
                }
                placeholder="Олена"
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    firstName:
                      value,
                  })
                }
              />

              <ProfileField
                label="Прізвище"
                value={
                  profile.lastName
                }
                placeholder="Шевченко"
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    lastName:
                      value,
                  })
                }
              />

              <ProfileField
                label="Електронна пошта"
                type="email"
                value={profile.email}
                placeholder="example@email.com"
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    email: value,
                  })
                }
              />

              <ProfileField
                label="Телефон"
                type="tel"
                value={profile.phone}
                placeholder="+380 67 123 45 67"
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    phone: value,
                  })
                }
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 text-sm font-semibold text-white shadow-lg"
              >
                <Save
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                Зберегти зміни
              </button>

              {saved && (
                <p className="text-sm font-medium text-accent-hover">
                  Дані збережено ✓
                </p>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}

function AccountStat({
  icon,
  value,
  label,
  href,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="glass-panel flex items-center gap-4 p-5 transition hover:border-accent">
      <div className="glass-control flex h-11 w-11 items-center justify-center text-accent-hover [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground">
          {value}
        </p>

        <p className="mt-1 text-xs text-muted">
          {label}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}