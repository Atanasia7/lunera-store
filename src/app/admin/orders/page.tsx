import {
  ClipboardList,
  Package,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminOrderStatus from "@/components/AdminOrderStatus";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: unknown) {
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

function formatDate(date: Date) {
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

export default async function AdminOrdersPage() {
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

  const orders =
    await prisma.order.findMany({
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
    });

  const newOrdersCount =
    orders.filter(
      (order) =>
        order.status === "NEW",
    ).length;

  return (
    <main className="page-shell py-8 sm:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="min-w-0">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Замовлення
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              Керування статусами та інформацією
              про доставку.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="glass-panel flex items-center gap-4 p-5">
              <span className="glass-control flex h-11 w-11 items-center justify-center text-accent-hover">
                <ClipboardList className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-muted">
                  Всього замовлень
                </p>

                <p className="mt-1 text-xl font-semibold text-foreground">
                  {orders.length}
                </p>
              </div>
            </div>

            <div className="glass-panel flex items-center gap-4 p-5">
              <span className="glass-control flex h-11 w-11 items-center justify-center text-accent-hover">
                <Package className="h-5 w-5" />
              </span>

              <div>
                <p className="text-xs text-muted">
                  Нові замовлення
                </p>

                <p className="mt-1 text-xl font-semibold text-foreground">
                  {newOrdersCount}
                </p>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="glass-panel mt-6 p-10 text-center text-muted">
              Замовлень поки немає.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {orders.map(
                (order) => (
                  <details
                    key={order.id}
                    className="glass-panel group overflow-hidden"
                  >
                    <summary className="grid cursor-pointer list-none gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
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
                          )}{" "}
                          ·{" "}
                          {
                            order.customerName
                          }
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(
                          order.total,
                        )}
                      </p>

                      <AdminOrderStatus
                        orderId={
                          order.id
                        }
                        status={
                          order.status
                        }
                      />
                    </summary>

                    <div className="grid gap-6 border-t border-border-muted p-5 lg:grid-cols-[0.8fr_1.2fr]">
                      <section>
                        <h2 className="text-sm font-semibold text-foreground">
                          Покупець і доставка
                        </h2>

                        <dl className="mt-4 space-y-3 text-sm">
                          <OrderField
                            label="Email"
                            value={
                              order.email
                            }
                          />

                          <OrderField
                            label="Телефон"
                            value={
                              order.phone
                            }
                          />

                          <OrderField
                            label="Адреса"
                            value={`${order.city}, ${order.deliveryAddress}`}
                          />

                          {order.comment && (
                            <OrderField
                              label="Коментар"
                              value={
                                order.comment
                              }
                            />
                          )}
                        </dl>
                      </section>

                      <section>
                        <h2 className="text-sm font-semibold text-foreground">
                          Товари
                        </h2>

                        <div className="mt-4 overflow-x-auto rounded-2xl border border-border-muted">
                          <table className="w-full min-w-150 text-left text-sm">
                            <thead className="bg-accent-soft text-muted">
                              <tr>
                                <th className="px-4 py-3 font-medium">
                                  Товар
                                </th>

                                <th className="px-4 py-3 font-medium">
                                  Варіант
                                </th>

                                <th className="px-4 py-3 font-medium">
                                  Кількість
                                </th>

                                <th className="px-4 py-3 font-medium">
                                  Сума
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {order.items.map(
                                (
                                  item,
                                ) => (
                                  <tr
                                    key={
                                      item.id
                                    }
                                    className="border-t border-border-muted"
                                  >
                                    <td className="px-4 py-3 text-foreground">
                                      {
                                        item.productName
                                      }
                                    </td>

                                    <td className="px-4 py-3 text-muted">
                                      {
                                        item.size
                                      }{" "}
                                      /{" "}
                                      {
                                        item.color
                                      }
                                    </td>

                                    <td className="px-4 py-3 text-foreground">
                                      {
                                        item.quantity
                                      }
                                    </td>

                                    <td className="px-4 py-3 font-medium text-foreground">
                                      {formatPrice(
                                        Number(
                                          item.price,
                                        ) *
                                          item.quantity,
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  </details>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function OrderField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs text-muted">
        {label}
      </dt>

      <dd className="mt-1 break-words text-foreground">
        {value}
      </dd>
    </div>
  );
}