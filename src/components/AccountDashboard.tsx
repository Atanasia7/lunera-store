"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Heart,
  KeyRound,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import {
  useState,
  useSyncExternalStore,
} from "react";

import { useCart } from "@/components/CartProvider";
import { useFavorites } from "@/components/FavoritesProvider";

type AccountTab =
  | "overview"
  | "orders"
  | "profile"
  | "password";

type AccountDashboardProps = {
  displayName: string;
  email: string;
  phone: string;
  roleLabel: string;
  initials: string;
  image: string | null;
  isAdmin: boolean;
  orderCount: number;
  overview: ReactNode;
  orders: ReactNode;
  profile: ReactNode;
  password: ReactNode;
};

const tabs: Array<{
  id: AccountTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "overview",
    label: "Огляд",
    icon: LayoutDashboard,
  },
  {
    id: "orders",
    label: "Замовлення",
    icon: Package,
  },
  {
    id: "profile",
    label: "Особисті дані",
    icon: UserRound,
  },
  {
    id: "password",
    label: "Пароль",
    icon: KeyRound,
  },
];

export default function AccountDashboard({
  displayName,
  email,
  phone,
  roleLabel,
  initials,
  image,
  isAdmin,
  orderCount,
  overview,
  orders,
  profile,
  password,
}: AccountDashboardProps) {
  const [activeTab, setActiveTab] =
    useState<AccountTab>("overview");
    const clientReady =
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="glass-panel p-5 lg:sticky lg:top-28">
        <div className="flex items-center gap-4 border-b border-border-muted pb-5">
          {image ? (
            // Google profile photos use an external URL that is not fixed in Next image config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent-hover">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {displayName}
            </p>

            <p className="mt-1 truncate text-xs text-muted">
              {email}
            </p>
          </div>
        </div>

        <nav
          className="mt-5 grid gap-2"
          aria-label="Розділи особистого кабінету"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-accent-soft text-accent-hover"
                    : "text-muted hover:bg-accent-soft hover:text-foreground"
                }`}
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-border-muted pt-5">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Телефон
          </p>

          <p className="mt-1 text-sm text-foreground">
            {phone || "Не вказано"}
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
            Тип акаунта
          </p>

          <p className="mt-1 text-sm text-foreground">
            {roleLabel}
          </p>
        </div>

        <div className="mt-5 grid gap-2 border-t border-border-muted pt-5">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent-soft"
            >
              <ShieldCheck
                className="h-4 w-4"
                strokeWidth={1.8}
              />

              Адмін-панель
            </Link>
          )}

          <Link
            href="/favorites"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent-soft"
          >
            <Heart
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            Обране
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent-soft"
          >
            <ShoppingBag
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            Кошик
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        {activeTab === "overview" && (
          <div>
            <section className="glass-panel p-6 sm:p-8">
              <p className="text-sm text-accent-hover">
                Особистий кабінет
              </p>

              <h2 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
                Вітаємо,{" "}
                {displayName.split(" ")[0]}! ✦
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Тут зібрані ваші замовлення,
                обрані товари та особисті дані.
              </p>
            </section>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Package />}
                value={orderCount}
                label="Замовлень"
                onClick={() =>
                  setActiveTab("orders")
                }
              />

              <StatLink
  href="/favorites"
  icon={<Heart />}
  value={
    clientReady
      ? totalFavorites
      : 0
  }
  label="В обраному"
/>

<StatLink
  href="/cart"
  icon={<ShoppingBag />}
  value={
    clientReady
      ? totalItems
      : 0
  }
  label="У кошику"
/>
            </div>

            <div className="mt-5">
              {overview}
            </div>
          </div>
        )}

        {activeTab === "orders" &&
          orders}

        {activeTab === "profile" &&
          profile}

        {activeTab === "password" &&
          password}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  onClick,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass-panel flex items-center gap-4 p-5 text-left transition hover:-translate-y-0.5 hover:border-accent"
    >
      <span className="glass-control flex h-11 w-11 shrink-0 items-center justify-center text-accent-hover [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <span>
        <strong className="block text-xl text-foreground">
          {value}
        </strong>

        <span className="text-xs text-muted">
          {label}
        </span>
      </span>
    </button>
  );
}

function StatLink({
  href,
  icon,
  value,
  label,
}: {
  href: string;
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="glass-panel flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <span className="glass-control flex h-11 w-11 shrink-0 items-center justify-center text-accent-hover [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <span>
        <strong className="block text-xl text-foreground">
          {value}
        </strong>

        <span className="text-xs text-muted">
          {label}
        </span>
      </span>
    </Link>
  );
}