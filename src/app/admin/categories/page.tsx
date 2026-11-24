import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminCategoryManager from "@/components/AdminCategoryManager";
import AdminSidebar from "@/components/AdminSidebar";
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
                {"\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0457"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                {"\u0421\u0442\u0432\u043e\u0440\u0435\u043d\u043d\u044f \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0439, \u043a\u0435\u0440\u0443\u0432\u0430\u043d\u043d\u044f \u043d\u0430\u0437\u0432\u0430\u043c\u0438 \u0442\u0430 \u043e\u0431\u043a\u043b\u0430\u0434\u0438\u043d\u043a\u0430\u043c\u0438 \u0434\u043b\u044f \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0443."}
              </p>
            </div>

            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ color: "#ffffff" }}
            >
              <Plus className="h-4 w-4" />

              {"\u0414\u043e\u0434\u0430\u0442\u0438 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u044e"}
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <Tags className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                {"\u0412\u0441\u044c\u043e\u0433\u043e \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0439"}:{" "}
                {categories.length}
              </p>

              <p className="text-xs text-muted">
                {"\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0456\u0457 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e \u0432\u0456\u0434\u043e\u0431\u0440\u0430\u0436\u0430\u044e\u0442\u044c\u0441\u044f \u0432 \u043a\u0430\u0442\u0430\u043b\u043e\u0437\u0456."}
              </p>
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
      </div>
    </main>
  );
}
