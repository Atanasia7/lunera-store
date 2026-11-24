import Link from "next/link";

import {
  Heart,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import LogoutButton from "@/components/LogoutButton";
import PasswordManager from "@/components/PasswordManager";
import ProfileManager from "@/components/ProfileManager";

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
    },
  ).format(date);
}

function getStatusLabel(
  status: string,
) {
  const statuses: Record<
    string,
    string
  > = {
    NEW: "Нове",
    CONFIRMED: "Підтверджено",
    PROCESSING: "В обробці",
    SHIPPED: "Відправлено",
    COMPLETED: "Завершено",
    CANCELLED: "Скасовано",
  };

  return (
    statuses[status] ??
    status
  );
}

export default async function AccountPage() {
  const session =
    await auth();

  const email =
    session?.user?.email
      ?.trim()
      .toLowerCase();

  if (!email) {
    redirect("/login");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },

      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },

          take: 5,

          include: {
            items: true,
          },
        },
      },
    });

  if (!user) {
    redirect("/login");
  }

  const fallbackNameParts =
    (user.name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const firstName =
    user.firstName ||
    fallbackNameParts[0] ||
    "";

  const lastName =
    user.lastName ||
    fallbackNameParts
      .slice(1)
      .join(" ");

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName =
    fullName ||
    user.name ||
    user.email ||
    "Користувач";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0),
      )
      .join("")
      .toUpperCase() || "L";

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Особистий кабінет
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Мій акаунт
            </h1>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[28px] border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg font-semibold text-accent-hover">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-foreground">
                  {displayName}
                </h2>

                <p className="mt-1 truncate text-sm text-muted">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Телефон
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {user.phone ||
                    "Не вказано"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Тип акаунта
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {user.role ===
                  "ADMIN"
                    ? "Адміністратор"
                    : "Користувач"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              {user.role ===
                "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm font-semibold text-accent-hover transition hover:border-accent"
                >
                  <ShieldCheck
                    className="h-4 w-4"
                    strokeWidth={1.7}
                  />

                  Панель адміністратора
                </Link>
              )}

              <Link
                href="/favorites"
                className="glass-control flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent"
              >
                <Heart
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />

                Обрані товари
              </Link>

              <Link
                href="/cart"
                className="glass-control flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground transition hover:border-accent"
              >
                <ShoppingBag
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />

                Кошик
              </Link>
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <Package
                className="h-5 w-5 text-accent-hover"
                strokeWidth={1.7}
              />

              <h2 className="text-xl font-semibold text-foreground">
                Мої замовлення
              </h2>
            </div>

            {user.orders.length ===
            0 ? (
              <div className="mt-8 rounded-3xl border border-border bg-background/40 p-8 text-center">
                <Package
                  className="mx-auto h-8 w-8 text-muted"
                  strokeWidth={1.5}
                />

                <h3 className="mt-4 font-medium text-foreground">
                  Замовлень поки немає
                </h3>

                <p className="mt-2 text-sm text-muted">
                  Ваші нові замовлення
                  будуть відображатися
                  тут.
                </p>

                <Link
                  href="/catalog"
                  className="mt-5 inline-flex rounded-2xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
                >
                  До каталогу
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {user.orders.map(
                  (order) => (
                    <article
                      key={order.id}
                      className="rounded-3xl border border-border bg-background/40 p-5"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Замовлення #
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
                        </div>

                        <div className="sm:text-right">
                          <p className="text-sm font-semibold text-foreground">
                            {formatPrice(
                              order.total,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-accent-hover">
                            {getStatusLabel(
                              order.status,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-xs text-muted">
                          Товарів:{" "}
                          {order.items.reduce(
                            (
                              total,
                              item,
                            ) =>
                              total +
                              item.quantity,
                            0,
                          )}
                        </p>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-6">
          <ProfileManager
            firstName={firstName}
            lastName={lastName}
            phone={user.phone || ""}
            email={user.email || ""}
          />
        </div>

        <div className="mt-6">
          <PasswordManager
            hasPassword={Boolean(
              user.passwordHash,
            )}
          />
        </div>
      </div>
    </main>
  );
}