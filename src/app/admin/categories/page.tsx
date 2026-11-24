import Link from "next/link";
import { Boxes, ClipboardList, Tags } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminCategoryManager from "@/components/AdminCategoryManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
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

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
                <Tags className="h-5 w-5" />
              </div>

              <h1 className="editorial-title text-4xl text-foreground sm:text-5xl">
                Категорії
              </h1>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Створення категорій, керування назвами та
              обкладинками для каталогу.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="glass-control flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground"
            >
              <Boxes className="h-4 w-4" />
              Товари
            </Link>

            <Link
              href="/admin"
              className="glass-control flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              Замовлення
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <AdminCategoryManager
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
              imageUrl: category.imageUrl,
              productCount: category._count.products,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
