"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    items,
    subtotal,
    hydrated,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  if (!hydrated) {
    return (
      <main className="page-shell py-10">
        <div className="glass-panel min-h-80" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-shell py-10">
        <nav
          className="flex items-center gap-2 text-sm text-muted"
          aria-label="Хлібні крихти"
        >
          <Link
            href="/"
            className="transition hover:text-foreground"
          >
            Головна
          </Link>

          <span>/</span>

          <span className="text-foreground">
            Кошик
          </span>
        </nav>

        <section className="glass-panel mt-8 flex min-h-105 flex-col items-center justify-center px-6 text-center">
          <div className="glass-control flex h-16 w-16 items-center justify-center text-accent-hover">
            <ShoppingBag
              className="h-7 w-7"
              strokeWidth={1.6}
            />
          </div>

          <h1 className="editorial-title mt-6 text-4xl text-foreground">
            Ваш кошик порожній
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Додайте товари з каталогу, щоб вони
            з&apos;явилися тут.
          </p>

          <Link
            href="/catalog"
            className="mt-7 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            Перейти до каталогу
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-10">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm text-muted"
        aria-label="Хлібні крихти"
      >
        <Link
          href="/"
          className="transition hover:text-foreground"
        >
          Головна
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Кошик
        </span>
      </nav>

      {/* Title */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="editorial-title text-5xl text-foreground md:text-6xl">
            Кошик
          </h1>

          <p className="mt-2 text-sm text-muted">
            Товарів у кошику:{" "}
            <span className="font-medium text-foreground">
              {items.length}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="glass-control flex h-11 items-center gap-2 px-4 text-sm text-muted transition hover:border-accent hover:text-foreground"
        >
          <Trash2
            className="h-4 w-4"
            strokeWidth={1.8}
          />

          Очистити кошик
        </button>
      </div>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[1fr_390px]">
        {/* Product list */}
        <section className="space-y-4">
          {items.map((item) => {
            const itemTotal =
              item.price * item.quantity;

            return (
              <article
                key={item.variantId}
                className="glass-panel grid gap-5 p-5 sm:grid-cols-[130px_1fr]"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative aspect-4/5 overflow-hidden rounded-2xl bg-surface-soft"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl.trim()}
                      alt={item.name}
                      fill
                      sizes="130px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="editorial-title text-4xl text-muted">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Information */}
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="editorial-title text-2xl text-foreground transition hover:text-accent-hover"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                        <p>
                          Розмір:{" "}
                          <span className="text-foreground">
                            {item.size}
                          </span>
                        </p>

                        <p>
                          Колір:{" "}
                          <span className="text-foreground">
                            {item.color}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.variantId)
                      }
                      className="glass-control flex h-10 w-10 shrink-0 items-center justify-center text-muted transition hover:border-accent hover:text-foreground"
                      aria-label={`Видалити ${item.name}`}
                      title="Видалити"
                    >
                      <Trash2
                        className="h-4 w-4"
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-7">
                    {/* Quantity */}
                    <div>
                      <p className="mb-2 text-xs text-muted">
                        Кількість
                      </p>

                      <div className="glass-control flex h-11 items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.variantId,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="flex h-10 w-10 items-center justify-center text-foreground transition hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Зменшити кількість"
                        >
                          <Minus
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                        </button>

                        <span className="min-w-10 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              item.variantId,
                              item.quantity + 1,
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                          className="flex h-10 w-10 items-center justify-center text-foreground transition hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Збільшити кількість"
                        >
                          <Plus
                            className="h-4 w-4"
                            strokeWidth={1.8}
                          />
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-muted">
                        Доступно: {item.stock} шт.
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted">
                          {item.price.toLocaleString(
                            "uk-UA",
                          )}{" "}
                          грн × {item.quantity}
                        </p>
                      )}

                      <p className="mt-1 text-xl font-semibold text-foreground">
                        {itemTotal.toLocaleString(
                          "uk-UA",
                        )}{" "}
                        грн
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 py-3 text-sm font-medium text-muted transition hover:text-foreground"
          >
            <ArrowLeft
              className="h-4 w-4"
              strokeWidth={1.8}
            />

            Продовжити покупки
          </Link>
        </section>

        {/* Order summary */}
        <aside className="glass-panel sticky top-28 p-6">
          <h2 className="editorial-title text-3xl text-foreground">
            Підсумок замовлення
          </h2>

          <div className="mt-7 space-y-4">
            <div className="flex items-center justify-between gap-5 text-sm">
              <span className="text-muted">
                Товари
              </span>

              <span className="font-medium text-foreground">
                {subtotal.toLocaleString(
                  "uk-UA",
                )}{" "}
                грн
              </span>
            </div>

            <div className="flex items-center justify-between gap-5 text-sm">
              <span className="text-muted">
                Доставка
              </span>

              <span className="font-medium text-accent-hover">
                Безкоштовно
              </span>
            </div>
          </div>

          <div className="my-6 border-t border-border-muted" />

          <div className="flex items-end justify-between gap-5">
            <span className="text-base font-semibold text-foreground">
              До сплати
            </span>

            <span className="text-2xl font-semibold text-foreground">
              {subtotal.toLocaleString(
                "uk-UA",
              )}{" "}
              грн
            </span>
          </div>

          {/* Promo code */}
          <div className="mt-7">
            <label
              htmlFor="promo"
              className="text-xs text-muted"
            >
              Промокод
            </label>

            <div className="mt-2 flex gap-2">
              <input
                id="promo"
                type="text"
                placeholder="Введіть промокод"
                className="glass-control h-11 min-w-0 flex-1 px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
              />

              <button
                type="button"
                className="glass-control h-11 px-4 text-sm font-medium text-foreground transition hover:border-accent"
              >
                OK
              </button>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-7 flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            Оформити замовлення →
          </Link>

          <p className="mt-4 text-center text-xs leading-5 text-muted">
            Остаточна сума буде підтверджена
            під час оформлення замовлення.
          </p>
        </aside>
      </div>
    </main>
  );
}