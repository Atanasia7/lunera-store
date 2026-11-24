import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

const benefits = [
  {
    icon: Truck,
    title: "Швидка доставка",
    description: "По всій Україні",
  },
  {
    icon: PackageCheck,
    title: "Легке повернення",
    description: "Зрозумілі умови",
  },
  {
    icon: ShieldCheck,
    title: "Безпечна оплата",
    description: "Захищене оформлення",
  },
  {
    icon: Leaf,
    title: "Висока якість",
    description: "Добірні матеріали",
  },
];

function productCountLabel(
  count: number,
) {
  const lastDigit =
    count % 10;

  const lastTwoDigits =
    count % 100;

  if (
    lastDigit === 1 &&
    lastTwoDigits !== 11
  ) {
    return `${count} товар`;
  }

  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (
      lastTwoDigits < 12 ||
      lastTwoDigits > 14
    )
  ) {
    return `${count} товари`;
  }

  return `${count} товарів`;
}

export default async function HomePage() {
  const [
    categories,
    newestProducts,
  ] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        createdAt: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    }),

    prisma.product.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      include: {
        images: {
          orderBy: {
            position: "asc",
          },

          select: {
            url: true,
          },
        },

        variants: {
          select: {
            color: true,
          },
        },
      },
    }),
  ]);

  const preparedProducts =
    newestProducts.map(
      (product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,

        imageUrl:
          getProductPhotos(
            product,
          )[0] ?? null,

        price:
          Number(
            product.price,
          ),

        colors: [
          ...new Set(
            product.variants.map(
              (variant) =>
                variant.color,
            ),
          ),
        ],
      }),
    );

  return (
    <main className="pb-8">
      <section className="page-shell">
        <div className="glass-panel overflow-hidden">
          <div className="relative min-h-140 overflow-hidden sm:min-h-150 lg:min-h-135">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_30%),linear-gradient(120deg,var(--surface-strong),var(--accent-soft))]" />

            <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

            <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative z-10 flex min-h-140 items-start px-6 pb-72 pt-14 sm:min-h-150 sm:px-10 sm:pb-80 sm:pt-18 lg:min-h-135 lg:items-center lg:px-16 lg:py-16">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent-hover sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  Жіноча мода
                </p>

                <h1 className="editorial-title mt-5 max-w-xl text-5xl leading-[0.98] text-foreground sm:text-6xl lg:text-7xl">
                  Елегантність у кожній деталі
                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
                  Сучасний одяг для жінок, які
                  цінують стиль, комфорт і власну
                  індивідуальність.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  >
                    До каталогу

                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/about"
                    className="glass-control inline-flex items-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent"
                  >
                    Дізнатися більше
                  </Link>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] lg:left-[36%] lg:h-full">
              <Image
                src="/images/lunera-hero.png"
                alt="Модель Lunera у ліловій сукні"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-contain object-right-bottom"
              />
            </div>
          </div>

          <div className="relative z-20 grid border-t border-border-muted sm:grid-cols-2 xl:grid-cols-4">
            {benefits.map(
              (
                benefit,
                index,
              ) => {
                const Icon =
                  benefit.icon;

                return (
                  <div
                    key={
                      benefit.title
                    }
                    className={`flex items-center gap-4 px-6 py-5 ${
                      index > 0
                        ? "border-t border-border-muted sm:border-t-0"
                        : ""
                    } ${
                      index % 2 === 1
                        ? "sm:border-l"
                        : ""
                    } ${
                      index > 1
                        ? "sm:border-t xl:border-t-0"
                        : ""
                    } ${
                      index > 0
                        ? "xl:border-l"
                        : ""
                    } border-border-muted`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-hover">
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={
                          1.7
                        }
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {
                          benefit.title
                        }
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {
                          benefit.description
                        }
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-hover sm:text-sm">
              Категорії
            </p>

            <h2 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Обери свій образ
            </h2>
          </div>

          <Link
            href="/catalog"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent-hover sm:inline-flex"
          >
            Усі товари

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {categories.length >
        0 ? (
          <div className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3">
            {categories.map(
              (category) => (
                <Link
                  key={
                    category.id
                  }
                  href={`/catalog?category=${encodeURIComponent(
                    category.slug,
                  )}`}
                  className="group relative aspect-4/5 w-[78vw] max-w-91 shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-surface-soft shadow-(--shadow) sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
                >
                  {category.imageUrl ? (
                    <Image
                      src={
                        category.imageUrl
                      }
                      alt={
                        category.name
                      }
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-accent-soft">
                      <span className="editorial-title text-7xl text-muted">
                        {category.name.charAt(
                          0,
                        )}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3 className="editorial-title text-3xl sm:text-4xl">
                      {
                        category.name
                      }
                    </h3>

                    <p className="mt-2 text-sm text-white/75">
                      {productCountLabel(
                        category
                          ._count
                          .products,
                      )}
                    </p>
                  </div>
                </Link>
              ),
            )}
          </div>
        ) : (
          <div className="glass-panel px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Категорії поки не додані.
            </p>
          </div>
        )}
      </section>

      <section className="page-shell pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-hover sm:text-sm">
              Нова колекція
            </p>

            <h2 className="editorial-title mt-2 text-4xl text-foreground sm:text-5xl">
              Новинки
            </h2>
          </div>

          <Link
            href="/catalog"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition hover:text-accent-hover"
          >
            Дивитися всі

            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {preparedProducts.length >
        0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
            {preparedProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              ),
            )}
          </div>
        ) : (
          <div className="glass-panel px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Новинки з’являться після додавання товарів.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}