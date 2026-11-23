"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Heart,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/components/CartProvider";
import { useFavorites } from "@/components/FavoritesProvider";

const navigation = [
  {
    href: "/",
    label: "Головна",
  },
  {
    href: "/catalog",
    label: "Каталог",
  },
];

export default function Header() {
  const pathname = usePathname();

  const {
    totalItems,
    hydrated,
  } = useCart();

  const {
    totalFavorites,
  } = useFavorites();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="site-header sticky top-0 z-50 py-3">
      <div className="page-shell">
        <div className="glass-panel flex h-16 items-center gap-4 px-6">
          <Link
            href="/"
            className="editorial-title shrink-0 text-3xl tracking-[0.12em] text-foreground"
          >
            LUNERA
          </Link>

          <nav
            className="flex items-center gap-2"
            aria-label="Основна навігація"
          >
            {navigation.map((item) => {
              const active =
                isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-accent-soft text-foreground"
                      : "text-muted hover:bg-accent-soft hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <form
              action="/catalog"
              method="get"
              role="search"
              className="glass-control flex h-11 w-55 items-center gap-3 px-4 xl:w-75"
            >
              <Search
                className="h-5 w-5 shrink-0 text-muted"
                strokeWidth={1.8}
              />

              <input
                type="search"
                name="q"
                placeholder="Пошук товарів..."
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </form>

            <Link
              href="/favorites"
              className="glass-control relative flex h-11 w-11 items-center justify-center text-foreground transition hover:border-accent"
              aria-label="Обране"
              title="Обране"
            >
              <Heart
                className={`h-5 w-5 ${
                  totalFavorites > 0
                    ? "fill-accent text-accent"
                    : ""
                }`}
                strokeWidth={1.8}
              />

              {totalFavorites > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {totalFavorites > 99
                    ? "99+"
                    : totalFavorites}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="glass-control relative flex h-11 w-11 items-center justify-center text-foreground transition hover:border-accent"
              aria-label="Кошик"
              title="Кошик"
            >
              <ShoppingBag
                className="h-5 w-5"
                strokeWidth={1.8}
              />

              {hydrated &&
                totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                    {totalItems > 99
                      ? "99+"
                      : totalItems}
                  </span>
                )}
            </Link>

            <Link
              href="/account"
              className="glass-control flex h-11 w-11 items-center justify-center text-foreground transition hover:border-accent"
              aria-label="Особистий кабінет"
              title="Особистий кабінет"
            >
              <User
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </Link>

            <button
              type="button"
              className="glass-control flex h-11 items-center px-3 text-xs font-medium text-foreground transition hover:border-accent"
            >
              UA / EN
            </button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}