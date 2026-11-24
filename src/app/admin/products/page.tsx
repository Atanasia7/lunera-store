import Link from "next/link";
import {
  Boxes,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminProductEditor from "@/components/AdminProductEditor";
import AdminSidebar from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();

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

  const products =
    await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        category: true,

        images: {
          orderBy: {
            position: "asc",
          },

          select: {
            url: true,
          },
        },

        variants: {
          orderBy: [
            {
              size: "asc",
            },
            {
              color: "asc",
            },
          ],
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
                Товари та склад
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Керування товарами, фотографіями,
                цінами та залишками магазину.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5"
              style={{
                color: "#ffffff",
              }}
            >
              <Plus className="h-4 w-4" />

              Додати товар
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
              <Boxes className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                Всього товарів:{" "}
                {products.length}
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
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-medium"
                style={{
                  color: "#ffffff",
                }}
              >
                <Plus className="h-4 w-4" />

                Створити перший товар
              </Link>
            </section>
          ) : (
            <div className="mt-8 space-y-3">
              {products.map(
                (product) => (
                  <AdminProductEditor
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,

                      description:
                        product.description,

                      price:
                        Number(
                          product.price,
                        ),

                      imageUrl:
                        product.imageUrl,

                      photos:
                        getProductPhotos(
                          product,
                        ),

                      isActive:
                        product.isActive,

                      categoryName:
                        product.category
                          .name,

                      variants:
                        product.variants.map(
                          (
                            variant,
                          ) => ({
                            id: variant.id,
                            size: variant.size,
                            color:
                              variant.color,
                            sku: variant.sku,
                            stock:
                              variant.stock,
                          }),
                        ),
                    }}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}