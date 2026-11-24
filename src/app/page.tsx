import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, newestProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        _count: {
          select: { products: true },
        },
      },
    }),

    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        images: {
          orderBy: { position: "asc" },
          select: { url: true },
        },
        variants: {
          select: { color: true },
        },
      },
    }),
  ]);

  const preparedProducts = newestProducts.map(
    (product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: getProductPhotos(product)[0] ?? null,
      price: Number(product.price),
      colors: [
        ...new Set(
          product.variants.map(
            (variant) => variant.color,
          ),
        ),
      ],
    }),
  );

  return (
    <main>
      <section className="bg-neutral-100">
        <div className="mx-auto grid min-h-155 max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Нова колекція
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight text-neutral-900 md:text-6xl">
              Одяг, що підкреслює твій стиль
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              Сучасний жіночий одяг для повсякденних
              образів, особливих подій і моментів, коли
              хочеться почуватися впевнено.
            </p>

            <Link
              href="/catalog"
              className="mt-8 inline-block bg-neutral-900 px-7 py-4 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Переглянути каталог
            </Link>
          </div>

          <div className="flex aspect-4/5 items-center justify-center bg-neutral-200">
            <span className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              Lunera Collection
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">
              Категорії
            </p>

            <h2 className="editorial-title mt-2 text-4xl text-foreground">
              Обери свій образ
            </h2>
          </div>

          <Link
            href="/catalog"
            className="shrink-0 text-sm font-medium text-accent-hover"
          >
            Усі товари →
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                className="group relative aspect-4/5 w-[82vw] max-w-91 shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-surface-soft shadow-(--shadow) sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-accent-soft">
                    <span className="editorial-title text-7xl text-muted">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="editorial-title text-3xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/75">
                    {category._count.products} товарів
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Категорії поки не додані.
            </p>
          </div>
        )}
      </section>

      <section className="bg-background/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">
                Lunera
              </p>

              <h2 className="editorial-title mt-2 text-4xl text-foreground">
                Новинки
              </h2>
            </div>

            <Link
              href="/catalog"
              className="text-sm font-medium text-accent-hover"
            >
              Усі товари →
            </Link>
          </div>

          {preparedProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {preparedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel px-6 py-12 text-center">
              <p className="text-sm text-muted">
                Новинки з’являться після додавання товарів.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}