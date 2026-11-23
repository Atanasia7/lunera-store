import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Heart,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";

import LogoutButton from "@/components/LogoutButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email: session.user.email,
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

  const displayName =
    user.name ||
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") ||
    user.email ||
    "Lunera User";

  return (
    <main className="page-shell py-10">
      {/* Breadcrumbs */}

      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link
          href="/"
          className="transition hover:text-foreground"
        >
          Головна
        </Link>

        <span>/</span>

        <span className="text-foreground">
          Особистий кабінет
        </span>
      </nav>

      {/* Heading */}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-hover">
            Lunera account
          </p>

          <h1 className="editorial-title mt-2 text-5xl text-foreground md:text-6xl">
            Особистий кабінет
          </h1>

          <p className="mt-3 text-sm text-muted">
            Вітаємо, {displayName}.
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Main */}

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[300px_1fr]">
        {/* Sidebar */}

        <aside className="glass-panel p-6">
          <div className="flex items-center gap-4 border-b border-border-muted pb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <User
                className="h-6 w-6"
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {displayName}
              </p>

              <p className="mt-1 truncate text-xs text-muted">
                {user.email}
              </p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            <div className="rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
              Особисті дані
            </div>

            <Link
              href="/favorites"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              <Heart className="h-4 w-4" />
              Обране
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
            >
              <ShoppingBag className="h-4 w-4" />
              Кошик
            </Link>
          </nav>
        </aside>

        <div className="space-y-6">
          {/* Profile data */}

          <section className="glass-panel p-7">
            <h2 className="editorial-title text-3xl text-foreground">
              Особисті дані
            </h2>

            <p className="mt-2 text-sm text-muted">
              Дані вашого облікового запису Lunera.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <ProfileItem
                icon={<User />}
                label="Ім'я"
                value={
                  [user.firstName, user.lastName]
                    .filter(Boolean)
                    .join(" ") || "Не вказано"
                }
              />

              <ProfileItem
                icon={<Mail />}
                label="Електронна пошта"
                value={user.email ?? "Не вказано"}
              />

              <ProfileItem
                icon={<Phone />}
                label="Телефон"
                value={user.phone ?? "Не вказано"}
              />

              <ProfileItem
                icon={<User />}
                label="Тип акаунта"
                value={
                  user.role === "ADMIN"
                    ? "Адміністратор"
                    : "Користувач"
                }
              />
            </div>
          </section>

          {/* Orders */}

          <section className="glass-panel p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="editorial-title text-3xl text-foreground">
                  Мої замовлення
                </h2>

                <p className="mt-2 text-sm text-muted">
                  Останні замовлення вашого акаунта.
                </p>
              </div>

              <Package
                className="h-6 w-6 text-accent-hover"
                strokeWidth={1.6}
              />
            </div>

            {user.orders.length === 0 ? (
              <div className="glass-control mt-6 px-5 py-6 text-center">
                <p className="text-sm font-medium text-foreground">
                  Замовлень поки немає
                </p>

                <p className="mt-2 text-xs text-muted">
                  Після оформлення покупки вона з&apos;явиться тут.
                </p>

                <Link
                  href="/catalog"
                  className="mt-4 inline-block text-sm font-medium text-accent-hover"
                >
                  Перейти до каталогу →
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="glass-control flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Замовлення #
                        {order.id
                          .slice(0, 8)
                          .toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {order.createdAt.toLocaleDateString(
                          "uk-UA",
                        )}
                        {" · "}
                        {order.items.length} товарів
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {Number(
                          order.total,
                        ).toLocaleString(
                          "uk-UA",
                        )}{" "}
                        грн
                      </p>

                      <p className="mt-1 text-xs text-accent-hover">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-control flex items-center gap-4 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-hover [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}