"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  LockKeyhole,
  MapPin,
  PackageCheck,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";

import { useCart } from "@/components/CartProvider";

type CreatedOrder = {
  id: string;
  total: number;
};

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    hydrated,
    clearCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    const formData = new FormData(
      event.currentTarget,
    );

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customerName:
              formData.get(
                "customerName",
              ),

            email:
              formData.get("email"),

            phone:
              formData.get("phone"),

            city:
              formData.get("city"),

            deliveryAddress:
              formData.get(
                "deliveryAddress",
              ),

            comment:
              formData.get("comment"),

            items: items.map(
              (item) => ({
                variantId:
                  item.variantId,

                quantity:
                  item.quantity,
              }),
            ),
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Не вдалося створити замовлення.",
        );
      }

      setCreatedOrder({
        id: result.orderId,
        total: Number(result.total),
      });

      clearCart();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не вдалося створити замовлення.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="page-shell py-10">
        <div className="glass-panel min-h-105" />
      </main>
    );
  }

  if (createdOrder) {
    return (
      <main className="page-shell py-10">
        <section className="glass-panel mx-auto flex min-h-120 max-w-2xl flex-col items-center justify-center px-8 text-center">
          <div className="flex h-18 w-18 items-center justify-center rounded-3xl bg-accent-soft text-accent-hover">
            <CheckCircle2
              className="h-9 w-9"
              strokeWidth={1.5}
            />
          </div>

          <h1 className="editorial-title mt-6 text-5xl text-foreground">
            Замовлення оформлено
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-muted">
            Дякуємо за замовлення.
            Ми отримали ваші дані та
            зв&apos;яжемося з вами для
            підтвердження.
          </p>

          <div className="glass-control mt-7 px-6 py-4">
            <p className="text-xs text-muted">
              Номер замовлення
            </p>

            <p className="mt-1 font-semibold text-foreground">
              #
              {createdOrder.id
                .slice(0, 8)
                .toUpperCase()}
            </p>

            <p className="mt-3 text-sm text-muted">
              Сума:{" "}
              <span className="font-semibold text-foreground">
                {createdOrder.total.toLocaleString(
                  "uk-UA",
                )}{" "}
                грн
              </span>
            </p>
          </div>

          <Link
            href="/catalog"
            className="mt-8 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 py-3.5 text-sm font-medium text-white"
          >
            Продовжити покупки
          </Link>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-shell py-10">
        <section className="glass-panel mx-auto flex min-h-105 max-w-2xl flex-col items-center justify-center px-8 text-center">
          <PackageCheck
            className="h-10 w-10 text-accent-hover"
            strokeWidth={1.5}
          />

          <h1 className="editorial-title mt-5 text-4xl text-foreground">
            Немає товарів для оформлення
          </h1>

          <p className="mt-3 text-sm text-muted">
            Спочатку додайте товари
            до кошика.
          </p>

          <Link
            href="/catalog"
            className="mt-7 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 py-3.5 text-sm font-medium text-white"
          >
            Перейти до каталогу
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link
          href="/"
          className="transition hover:text-foreground"
        >
          Головна
        </Link>

        <span>/</span>

        <Link
          href="/cart"
          className="transition hover:text-foreground"
        >
          Кошик
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Оформлення замовлення
        </span>
      </nav>

      <div className="mt-6">
        <h1 className="editorial-title text-5xl text-foreground md:text-6xl">
          Оформлення замовлення
        </h1>

        <p className="mt-3 text-sm text-muted">
          Заповніть контактні дані
          та адресу доставки.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid items-start gap-8 xl:grid-cols-[1fr_420px]"
      >
        <div className="space-y-5">
          <section className="glass-panel p-7">
            <h2 className="editorial-title text-3xl text-foreground">
              1. Контактна інформація
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <CheckoutField
                label="Ім'я та прізвище"
                name="customerName"
                placeholder="Олена Шевченко"
              />

              <CheckoutField
                label="Телефон"
                name="phone"
                type="tel"
                placeholder="+380 67 123 45 67"
              />

              <div className="md:col-span-2">
                <CheckoutField
                  label="Електронна пошта"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </section>

          <section className="glass-panel p-7">
            <h2 className="editorial-title text-3xl text-foreground">
              2. Доставка
            </h2>

            <div className="glass-control mt-7 flex items-center gap-4 p-4">
              <MapPin
                className="h-5 w-5 shrink-0 text-accent-hover"
                strokeWidth={1.7}
              />

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Доставка по Україні
                </p>

                <p className="mt-1 text-xs text-muted">
                  Вкажіть місто та адресу
                  або номер відділення.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <CheckoutField
                label="Місто"
                name="city"
                placeholder="Київ"
              />

              <CheckoutField
                label="Адреса / відділення"
                name="deliveryAddress"
                placeholder="Відділення №12"
              />
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium text-foreground">
                Коментар
              </span>

              <textarea
                name="comment"
                rows={4}
                placeholder="Додаткова інформація до замовлення"
                className="glass-control w-full resize-none px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
              />
            </label>
          </section>

          <section className="glass-panel p-7">
            <h2 className="editorial-title text-3xl text-foreground">
              3. Оплата
            </h2>

            <div className="glass-control mt-7 p-4">
              <p className="text-sm font-semibold text-foreground">
                Оплата при отриманні
              </p>

              <p className="mt-1 text-xs text-muted">
                Оплата після отримання
                та перевірки замовлення.
              </p>
            </div>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <aside className="glass-panel sticky top-28 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="editorial-title text-3xl text-foreground">
              Ваше замовлення
            </h2>

            <span className="text-sm text-muted">
              {items.length} товарів
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="grid grid-cols-[70px_1fr_auto] gap-4 border-b border-border-muted pb-5"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface-soft">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl.trim()}
                      alt={item.name}
                      fill
                      sizes="70px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {item.size} ·{" "}
                    {item.color} ·{" "}
                    {item.quantity} шт.
                  </p>
                </div>

                <p className="text-sm font-semibold text-foreground">
                  {(
                    item.price *
                    item.quantity
                  ).toLocaleString(
                    "uk-UA",
                  )}{" "}
                  грн
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">
                Товари
              </span>

              <span className="text-foreground">
                {subtotal.toLocaleString(
                  "uk-UA",
                )}{" "}
                грн
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted">
                Доставка
              </span>

              <span className="text-accent-hover">
                Безкоштовно
              </span>
            </div>
          </div>

          <div className="my-6 border-t border-border-muted" />

          <div className="flex items-end justify-between gap-4">
            <span className="font-semibold text-foreground">
              До сплати
            </span>

            <span className="text-2xl font-semibold text-foreground">
              {subtotal.toLocaleString(
                "uk-UA",
              )}{" "}
              грн
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Створення замовлення..."
              : "Підтвердити замовлення →"}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
            <LockKeyhole className="h-4 w-4" />

            Безпечне оформлення
          </div>
        </aside>
      </form>
    </main>
  );
}

function CheckoutField({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>

      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        className="glass-control h-12 w-full px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-accent"
      />
    </label>
  );
}