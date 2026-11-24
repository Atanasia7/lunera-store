import Link from "next/link";
import { Package } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AccountDashboard from "@/components/AccountDashboard";
import LogoutButton from "@/components/LogoutButton";
import PasswordManager from "@/components/PasswordManager";
import ProfileManager from "@/components/ProfileManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(value: unknown) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string) {
  const statuses: Record<string, string> = {
    NEW: "Нове",
    CONFIRMED: "Підтверджено",
    PROCESSING: "В обробці",
    SHIPPED: "Відправлено",
    COMPLETED: "Завершено",
    CANCELLED: "Скасовано",
  };

  return statuses[status] ?? status;
}

export default async function AccountPage() {
  const session = await auth();

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
          take: 10,
          include: {
            items: true,
          },
        },
        _count: {
          select: {
            orders: true,
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

  const ordersPanel = (
    <OrdersPanel
      title="Мої замовлення"
      orders={user.orders}
    />
  );

  const overviewPanel = (
    <OrdersPanel
      title="Останні замовлення"
      orders={user.orders.slice(0, 3)}
      compact
    />
  );

  return (
    <main className="page-shell py-8 sm:py-12">
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
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

      <AccountDashboard
        displayName={displayName}
        email={user.email || ""}
        phone={user.phone || ""}
        roleLabel={
          user.role === "ADMIN"
            ? "Адміністратор"
            : "Користувач"
        }
        initials={initials}
        image={user.image}
        isAdmin={
          user.role === "ADMIN"
        }
        orderCount={
          user._count.orders
        }
        overview={
          overviewPanel
        }
        orders={
          ordersPanel
        }
        profile={
          <ProfileManager
            firstName={firstName}
            lastName={lastName}
            phone={user.phone || ""}
            email={user.email || ""}
          />
        }
        password={
          <PasswordManager
            hasPassword={Boolean(
              user.passwordHash,
            )}
          />
        }
      />
    </main>
  );
}

type AccountOrder = {
  id: string;
  total: unknown;
  status: string;
  createdAt: Date;
  items: Array<{
    quantity: number;
  }>;
};

function OrdersPanel({
  title,
  orders,
  compact = false,
}: {
  title: string;
  orders: AccountOrder[];
  compact?: boolean;
}) {
  return (
    <section className="glass-panel p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package
            className="h-5 w-5 text-accent-hover"
            strokeWidth={1.8}
          />

          <h2 className="text-xl font-semibold text-foreground">
            {title}
          </h2>
        </div>

        {compact &&
          orders.length > 0 && (
            <span className="text-xs text-muted">
              Останні {orders.length}
            </span>
          )}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-accent-soft p-8 text-center">
          <Package
            className="mx-auto h-8 w-8 text-muted"
            strokeWidth={1.5}
          />

          <h3 className="mt-4 font-medium text-foreground">
            Замовлень поки немає
          </h3>

          <p className="mt-2 text-sm text-muted">
            Ваші нові замовлення будуть
            відображатися тут.
          </p>

          <Link
            href="/catalog"
            className="mt-5 inline-flex rounded-2xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
          >
            До каталогу
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-border-muted">
          {orders.map(
            (order, index) => (
              <article
                key={order.id}
                className={`grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center ${
                  index > 0
                    ? "border-t border-border-muted"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    #
                    {order.id
                      .slice(0, 8)
                      .toUpperCase()}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    {formatDate(
                      order.createdAt,
                    )}
                  </p>
                </div>

                <div className="text-xs text-muted sm:text-center">
                  {order.items.reduce(
                    (
                      total,
                      item,
                    ) =>
                      total +
                      item.quantity,
                    0,
                  )}{" "}
                  товарів
                </div>

                <div className="sm:min-w-32 sm:text-right">
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
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}