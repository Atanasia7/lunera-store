"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
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

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const {
    totalItems,
    hydrated,
  } = useCart();

  const {
    totalFavorites,
  } = useFavorites();

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  }

  return (
    <header className="site-header sticky top-0 z-50 py-2.5 sm:py-3">
      <div className="page-shell">
        <div className="glass-panel flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5">
          <Link
            href="/"
            className="editorial-title shrink-0 text-2xl tracking-[0.1em] text-foreground sm:text-3xl"
          >
            LUNERA
          </Link>

          <nav
            className="ml-2 hidden items-center gap-1 lg:flex"
            aria-label="Основна навігація"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-xl px-3 py-2 text-sm font-medium transition xl:px-4 ${
                  isActive(item.href)
                    ? "bg-accent-soft text-foreground"
                    : "text-muted hover:bg-accent-soft hover:text-foreground"
                }`}
              >
                {item.label}

                {isActive(item.href) && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-accent" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
            <form
              action="/catalog"
              method="get"
              role="search"
              className="glass-control hidden h-11 w-52 items-center gap-3 px-4 xl:flex 2xl:w-72"
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
              className="icon-control relative hidden sm:inline-flex"
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
              className="icon-control relative inline-flex"
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
              className="icon-control hidden sm:inline-flex"
              aria-label="Особистий кабінет"
              title="Особистий кабінет"
            >
              <User
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </Link>

            <ThemeToggle />

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (value) => !value,
                )
              }
              className="icon-control inline-flex lg:hidden"
              aria-label={
                menuOpen
                  ? "Закрити меню"
                  : "Відкрити меню"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? (
                <X
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              ) : (
                <Menu
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-navigation"
            className="glass-panel mt-2 p-3 lg:hidden"
          >
            <form
              action="/catalog"
              method="get"
              role="search"
              className="glass-control flex h-11 items-center gap-3 px-4"
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

            <nav
              className="mt-3 grid gap-1 sm:grid-cols-2"
              aria-label="Мобільна навігація"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-accent-soft text-foreground"
                      : "text-muted hover:bg-accent-soft hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/favorites"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-accent-soft hover:text-foreground"
              >
                Обране

                {totalFavorites > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              <Link
                href="/account"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-accent-soft hover:text-foreground"
              >
                Особистий кабінет
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}