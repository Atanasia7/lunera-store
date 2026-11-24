import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  Package,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminOrderStatus from "@/components/AdminOrderStatus";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: unknown) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminOrdersPage() {
  const session = await auth();
  const email = session?.user?.email
    ?.trim()
    .toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const admin = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const newOrdersCount = orders.filter(
    (order) => order.status === "NEW",
  ).length;

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Замовлення
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Перегляд замовлень і керування їхніми
              статусами.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 py-3 text-sm font-semibold text-white"
            >
              <Boxes className="h-4 w-4" />
              Товари та склад
            </Link>

            <Link
              href="/"
              className="glass-control px-5 py-3 text-sm font-medium text-foreground"
            >
              До магазину
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="glass-panel flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <ClipboardList className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Всього
              </p>

              <p className="mt-1 text-xl font-semibold text-foreground">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="glass-panel flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Нові
              </p>

              <p className="mt-1 text-xl font-semibold text-foreground">
                {newOrdersCount}
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <section className="glass-panel mt-8 p-10 text-center">
            <Package className="mx-auto h-9 w-9 text-muted" />

            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Замовлень поки немає
            </h2>

            <p className="mt-2 text-sm text-muted">
              Нові замовлення з магазину з’являться тут.
            </p>
          </section>
        ) : (
          <div className="mt-8 space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="glass-panel overflow-hidden"
              >
                <div className="flex flex-col justify-between gap-5 border-b border-border p-6 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted">
                      Замовлення
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </p>

                    <AdminOrderStatus
                      orderId={order.id}
                      status={order.status}
                    />
                  </div>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
                  <section>
                    <h3 className="text-sm font-semibold text-foreground">
                      Покупець і доставка
                    </h3>

                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted">
                          Ім’я
                        </dt>

                        <dd className="mt-1 text-foreground">
                          {order.customerName}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-muted">
                          Email
                        </dt>

                        <dd className="mt-1 break-all text-foreground">
                          {order.email}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-muted">
                          Телефон
                        </dt>

                        <dd className="mt-1 text-foreground">
                          {order.phone}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-xs text-muted">
                          Адреса
                        </dt>

                        <dd className="mt-1 text-foreground">
                          {order.city}, {order.deliveryAddress}
                        </dd>
                      </div>

                      {order.comment && (
                        <div>
                          <dt className="text-xs text-muted">
                            Коментар
                          </dt>

                          <dd className="mt-1 whitespace-pre-line text-foreground">
                            {order.comment}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-foreground">
                      Товари
                    </h3>

                    <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
                      <table className="w-full min-w-150 text-left">
                        <thead>
                          <tr className="border-b border-border bg-background/30 text-xs text-muted">
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
                          {order.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-border/70 last:border-0"
                            >
                              <td className="px-4 py-3 text-sm text-foreground">
                                {item.productName}
                              </td>

                              <td className="px-4 py-3 text-sm text-muted">
                                {item.size} / {item.color}
                              </td>

                              <td className="px-4 py-3 text-sm text-foreground">
                                {item.quantity}
                              </td>

                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {formatPrice(
                                  Number(item.price) *
                                    item.quantity,
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}