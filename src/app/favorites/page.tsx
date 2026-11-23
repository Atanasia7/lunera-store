"use client";

import Link from "next/link";

import {
  Heart,
  Trash2,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/components/FavoritesProvider";

export default function FavoritesPage() {
  const {
    items,
    clearFavorites,
  } = useFavorites();

  if (items.length === 0) {
    return (
      <main className="page-shell py-10">
        <nav className="flex items-center gap-2 text-sm text-muted">
          <Link href="/">
            Головна
          </Link>

          <span>/</span>

          <span className="text-foreground">
            Обране
          </span>
        </nav>

        <section className="glass-panel mt-8 flex min-h-105 flex-col items-center justify-center px-6 text-center">
          <div className="glass-control flex h-16 w-16 items-center justify-center text-accent-hover">
            <Heart
              className="h-7 w-7"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="editorial-title mt-6 text-4xl text-foreground">
            В обраному поки порожньо
          </h1>

          <p className="mt-3 text-sm text-muted">
            Натисніть на сердечко біля
            товару, щоб зберегти його.
          </p>

          <Link
            href="/catalog"
            className="mt-7 rounded-2xl bg-accent px-7 py-3.5 text-sm font-medium text-white"
          >
            Перейти до каталогу
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-10">
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/">
          Головна
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Обране
        </span>
      </nav>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="editorial-title text-5xl text-foreground md:text-6xl">
            Обране
          </h1>

          <p className="mt-2 text-sm text-muted">
            Збережено товарів:{" "}
            <span className="font-medium text-foreground">
              {items.length}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={
            clearFavorites
          }
          className="glass-control flex h-11 items-center gap-2 px-4 text-sm text-muted transition hover:border-accent hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />

          Очистити обране
        </button>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ),
        )}
      </section>
    </main>
  );
}