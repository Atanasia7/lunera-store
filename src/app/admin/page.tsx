import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChartNoAxesCombined,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}

export default async function AdminDashboardPage() {
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
    productCount,
    userCount,
  ] = await Promise.all([
    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),

    prisma.product.count(),

    prisma.user.count(),
  ]);

  const validOrders =
    orders.filter(
      (order) =>
        order.status !==
        "CANCELLED",
    );

  const salesTotal =
    validOrders.reduce(
      (total, order) =>
        total +
        Number(order.total),
      0,
    );

  const newOrdersCount =
    orders.filter(
      (order) =>
        order.status === "NEW",
    ).length;

  const productSales =
    new Map<
      string,
      {
        quantity: number;
        revenue: number;
      }
    >();

  for (
    const order
    of validOrders
  ) {
    for (
      const item
      of order.items
    ) {
      const current =
        productSales.get(
          item.productName,
        ) ?? {
          quantity: 0,
          revenue: 0,
        };

      productSales.set(
        item.productName,
        {
          quantity:
            current.quantity +
            item.quantity,

          revenue:
            current.revenue +
            Number(
              item.price,
            ) *
              item.quantity,
        },
      );
    }
  }

  const topProducts = [
    ...productSales.entries(),
  ]
    .map(
      ([
        name,
        values,
      ]) => ({
        name,
        ...values,
      }),
    )
    .sort(
      (a, b) =>
        b.quantity -
        a.quantity,
    )
    .slice(0, 5);

  const salesByDay =
    Array.from(
      {
        length: 7,
      },
      (
        _,
        index,
      ) => {
        const date =
          new Date();

        date.setHours(
          0,
          0,
          0,
          0,
        );

        date.setDate(
          date.getDate() -
            (6 - index),
        );

        const nextDate =
          new Date(date);

        nextDate.setDate(
          nextDate.getDate() +
            1,
        );

        const total =
          validOrders
            .filter(
              (order) =>
                order.createdAt >=
                  date &&
                order.createdAt <
                  nextDate,
            )
            .reduce(
              (
                sum,
                order,
              ) =>
                sum +
                Number(
                  order.total,
                ),
              0,
            );

        return {
          label:
            new Intl.DateTimeFormat(
              "uk-UA",
              {
                day: "2-digit",
                month: "2-digit",
              },
            ).format(date),

          total,
        };
      },
    );

  const maxDailySales =
    Math.max(
      ...salesByDay.map(
        (day) =>
          day.total,
      ),
      1,
    );

  return (
    <main className="page-shell py-8 sm:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="min-w-0">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                Lunera Administration
              </p>

              <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
                Панель керування
              </h1>

              <p className="mt-3 text-sm text-muted">
                Огляд продажів, замовлень і товарів
                магазину.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
              style={{
                color: "#ffffff",
              }}
            >
              + Додати товар
            </Link>
          </div>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={
                <ShoppingBag />
              }
              label="Замовлення"
              value={
                orders.length.toString()
              }
              note={`${newOrdersCount} нових`}
            />

            <MetricCard
              icon={
                <ChartNoAxesCombined />
              }
              label="Продажі"
              value={formatPrice(
                salesTotal,
              )}
              note="без скасованих"
            />

            <MetricCard
              icon={<Package />}
              label="Товари"
              value={
                productCount.toString()
              }
              note="у каталозі"
            />

            <MetricCard
              icon={<Users />}
              label="Користувачі"
              value={
                userCount.toString()
              }
              note="зареєстровано"
            />
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <section className="glass-panel p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Продажі за останні 7 днів
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Сума успішних замовлень за днями
                  </p>
                </div>

                <ChartNoAxesCombined className="h-6 w-6 text-accent-hover" />
              </div>

              <div className="mt-8 flex h-56 items-end gap-3 border-b border-border-muted pb-3 sm:gap-5">
                {salesByDay.map(
                  (day) => {
                    const height =
                      day.total >
                      0
                        ? Math.max(
                            (day.total /
                              maxDailySales) *
                              100,
                            8,
                          )
                        : 3;

                    return (
                      <div
                        key={
                          day.label
                        }
                        className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"
                      >
                        <p className="mb-2 truncate text-[10px] font-medium text-muted sm:text-xs">
                          {day.total >
                          0
                            ? formatPrice(
                                day.total,
                              )
                            : "—"}
                        </p>

                        <div
                          className="mx-auto w-full max-w-14 rounded-t-xl bg-gradient-to-t from-accent-hover to-accent transition hover:opacity-80"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${day.label}: ${formatPrice(
                            day.total,
                          )}`}
                        />
                      </div>
                    );
                  },
                )}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-3 text-center text-[10px] text-muted sm:gap-5 sm:text-xs">
                {salesByDay.map(
                  (day) => (
                    <span
                      key={
                        day.label
                      }
                    >
                      {day.label}
                    </span>
                  ),
                )}
              </div>
            </section>

            <section className="glass-panel p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground">
                Топ товарів
              </h2>

              <p className="mt-1 text-sm text-muted">
                За кількістю проданих одиниць
              </p>

              {topProducts.length ===
              0 ? (
                <p className="mt-8 rounded-2xl bg-accent-soft p-5 text-sm text-muted">
                  Даних про продажі поки немає.
                </p>
              ) : (
                <div className="mt-6 space-y-3">
                  {topProducts.map(
                    (
                      product,
                      index,
                    ) => (
                      <div
                        key={
                          product.name
                        }
                        className="flex items-center gap-3 rounded-2xl bg-accent-soft p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface font-semibold text-accent-hover">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {
                              product.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {formatPrice(
                              product.revenue,
                            )}
                          </p>
                        </div>

                        <strong className="text-sm text-foreground">
                          {
                            product.quantity
                          }
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="glass-panel flex items-center gap-4 p-5">
      <span className="glass-control flex h-12 w-12 shrink-0 items-center justify-center text-accent-hover [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-1 truncate text-xl font-semibold text-foreground">
          {value}
        </p>

        <p className="mt-1 text-[11px] text-accent-hover">
          {note}
        </p>
      </div>
    </div>
  );
}