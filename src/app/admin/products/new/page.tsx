import Link from "next/link";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import AdminProductCreateForm from "@/components/AdminProductCreateForm";

export const dynamic =
  "force-dynamic";

export default async function NewProductPage() {
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

  const categories =
    await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    });

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Новий товар
            </h1>

            <p className="mt-3 text-sm text-muted">
              Створення товару та
              його початкових
              варіантів.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="glass-control px-5 py-3 text-sm font-medium text-foreground"
          >
            ← Товари та склад
          </Link>
        </div>

        {categories.length ===
        0 ? (
          <section className="glass-panel mt-8 p-8">
            <p className="text-sm text-red-600">
              Спочатку необхідно
              створити хоча б одну
              категорію.
            </p>
          </section>
        ) : (
          <div className="mt-8">
            <AdminProductCreateForm
              categories={
                categories
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}