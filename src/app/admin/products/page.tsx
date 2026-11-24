import Link from "next/link";
import { Boxes, Plus, Tags } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminProductEditor from "@/components/AdminProductEditor";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
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

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: {
        orderBy: { position: "asc" },
        select: { url: true },
      },
      variants: {
        orderBy: [
          { size: "asc" },
          { color: "asc" },
        ],
      },
    },
  });

  return (
    <main className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">
              Lunera Administration
            </p>

            <h1 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Товари та склад
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Керування товарами, фотографіями,
              цінами та залишками магазину.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Додати товар
            </Link>

            <Link
              href="/admin"
              className="glass-control px-5 py-3 text-sm font-medium text-foreground"
            >
              ← Замовлення
            </Link>

            <Link
              href="/admin/categories"
              className="glass-control flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground"
            >
              <Tags className="h-4 w-4" />
              Категорії
            </Link>

            <Link
              href="/"
              className="glass-control px-5 py-3 text-sm font-medium text-foreground"
            >
              До магазину
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
            <Boxes className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-foreground">
              Всього товарів: {products.length}
            </p>

            <p className="text-xs text-muted">
              Зміни застосовуються одразу після
              збереження.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <section className="glass-panel mt-8 p-10 text-center">
            <p className="text-sm text-muted">
              Товарів поки немає.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Створити перший товар
            </Link>
          </section>
        ) : (
          <div className="mt-8 space-y-6">
            {products.map((product) => (
              <AdminProductEditor
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  description: product.description,
                  price: Number(product.price),
                  imageUrl: product.imageUrl,
                  photos: getProductPhotos(product),
                  isActive: product.isActive,
                  categoryName: product.category.name,
                  variants: product.variants.map(
                    (variant) => ({
                      id: variant.id,
                      size: variant.size,
                      color: variant.color,
                      sku: variant.sku,
                      stock: variant.stock,
                    }),
                  ),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}