import Link from "next/link";

import {
  Boxes,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import AdminOrderStatus from "@/components/AdminOrderStatus";

export const dynamic =
  "force-dynamic";

function formatPrice(
  value: unknown,
) {
  return new Intl.NumberFormat(
    "uk-UA",
    {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}

function formatDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "uk-UA",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

export default async function AdminPage() {
  const session =
    await auth();

  const email =
    session?.user?.email
      ?.trim()
      .toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const admin =
    await prisma.user.findUnique({
      where: {
        email,
      },

      select: {
        role: true,
        name: true,
        firstName: true,
      },
    });

  if (
    !admin ||
    admin.role !== "ADMIN"
  ) {
    redirect("/");
  }

  const [
    orders,
    ordersCount,
    newOrdersCount,
    productsCount,
    usersCount,
    lowStockCount,
  ] = await Promise.all([
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      take: 30,

      include: {
        items: true,
      },
    }),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.product.count(),

    prisma.user.count(),

    prisma.productVariant.count({
      where: {
        stock: {
          lte: 5,
        },
      },
    }),
  ]);

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Панель адміністратора
            </h1>

            <p className="mt-3 text-sm text-muted">
              Вітаємо,{" "}
              {admin.firstName ||
                admin.name ||
                "Admin"}
              .
            </p>
          </div>

          <Link
            href="/"
            className="glass-control px-5 py-3 text-sm font-medium text-foreground"
          >
            ← До магазину
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            icon={
              <ShoppingBag className="h-5 w-5" />
            }
            label="Замовлення"
            value={ordersCount}
          />

          <StatCard
            icon={
              <Package className="h-5 w-5" />
            }
            label="Нові"
            value={
              newOrdersCount
            }
          />

          <StatCard
            icon={
              <Boxes className="h-5 w-5" />
            }
            label="Товари"
            value={
              productsCount
            }
          />

          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Користувачі"
            value={
              usersCount
            }
          />

          <StatCard
            icon={
              <Boxes className="h-5 w-5" />
            }
            label="Мало на складі"
            value={
              lowStockCount
            }
          />
        </section>

        <section className="glass-panel mt-8 overflow-hidden">
          <div className="flex flex-col justify-between gap-3 border-b border-border p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="editorial-title text-3xl text-foreground">
                Замовлення
              </h2>

              <p className="mt-1 text-sm text-muted">
                Останні 30 замовлень
                магазину.
              </p>
            </div>

            <span className="text-sm text-muted">
              Всього:{" "}
              {ordersCount}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">
              Замовлень поки немає.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left">
                <thead>
                  <tr className="border-b border-border bg-background/30 text-xs uppercase tracking-[0.1em] text-muted">
                    <th className="px-6 py-4 font-medium">
                      Замовлення
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Клієнт
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Доставка
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Товари
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Сума
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Статус
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/70 align-top last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-foreground">
                            #
                            {order.id
                              .slice(
                                0,
                                8,
                              )
                              .toUpperCase()}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {formatDate(
                              order.createdAt,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-foreground">
                            {
                              order.customerName
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {
                              order.email
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {
                              order.phone
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm text-foreground">
                            {
                              order.city
                            }
                          </p>

                          <p className="mt-1 max-w-52 text-xs leading-5 text-muted">
                            {
                              order.deliveryAddress
                            }
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            {order.items.map(
                              (item) => (
                                <div
                                  key={
                                    item.id
                                  }
                                >
                                  <p className="text-sm text-foreground">
                                    {
                                      item.productName
                                    }
                                  </p>

                                  <p className="text-xs text-muted">
                                    {
                                      item.size
                                    }{" "}
                                    ·{" "}
                                    {
                                      item.color
                                    }{" "}
                                    ·{" "}
                                    {
                                      item.quantity
                                    }{" "}
                                    шт.
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="whitespace-nowrap text-sm font-semibold text-foreground">
                            {formatPrice(
                              order.total,
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <AdminOrderStatus
                            orderId={
                              order.id
                            }
                            status={
                              order.status
                            }
                          />
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="glass-panel p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-semibold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-sm text-muted">
        {label}
      </p>
    </article>
  );
}