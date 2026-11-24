import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import CatalogToolbar from "@/components/CatalogToolbar";
import ProductCard from "@/components/ProductCard";

import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

import type {
  Prisma,
} from "../../../generated/prisma/client";

export const dynamic =
  "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    view?: string;
  }>;
};

type FilterSectionProps = {
  title: string;
  children: ReactNode;
};

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
];

const colors = [
  {
    value: "black",
    label: "Чорний",
    hex: "#1C1A20",
  },
  {
    value: "white",
    label: "Білий",
    hex: "#F4F0E9",
  },
  {
    value: "beige",
    label: "Бежевий",
    hex: "#D8C4B2",
  },
  {
    value: "gray",
    label: "Сірий",
    hex: "#A8A2A9",
  },
];

function FilterSection({
  title,
  children,
}: FilterSectionProps) {
  return (
    <details
      className="group border-t border-border-muted"
      open
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-semibold text-foreground marker:hidden">
        {title}

        <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" />
      </summary>

      <div className="pb-5">
        {children}
      </div>
    </details>
  );
}

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params =
    await searchParams;

  const q =
    params.q?.trim() ?? "";

  const category =
    params.category ?? "";

  const size =
    params.size ?? "";

  const color =
    params.color ?? "";

  const sort =
    params.sort ?? "newest";

  const view:
    | "grid"
    | "list" =
    params.view === "list"
      ? "list"
      : "grid";

  const parsedMinPrice =
    Number(
      params.minPrice,
    );

  const parsedMaxPrice =
    Number(
      params.maxPrice,
    );

  const hasMinPrice =
    params.minPrice !==
      undefined &&
    params.minPrice !== "" &&
    Number.isFinite(
      parsedMinPrice,
    );

  const hasMaxPrice =
    params.maxPrice !==
      undefined &&
    params.maxPrice !== "" &&
    Number.isFinite(
      parsedMaxPrice,
    );

  const variantFilter:
    Prisma.ProductVariantWhereInput =
    {
      ...(size
        ? {
            size,
          }
        : {}),

      ...(color
        ? {
            color,
          }
        : {}),
    };

  const where:
    Prisma.ProductWhereInput =
    {
      isActive: true,

      ...(q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode:
                    "insensitive",
                },
              },
              {
                description: {
                  contains: q,
                  mode:
                    "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),

      ...(size || color
        ? {
            variants: {
              some:
                variantFilter,
            },
          }
        : {}),

      ...(hasMinPrice ||
      hasMaxPrice
        ? {
            price: {
              ...(hasMinPrice
                ? {
                    gte:
                      parsedMinPrice,
                  }
                : {}),

              ...(hasMaxPrice
                ? {
                    lte:
                      parsedMaxPrice,
                  }
                : {}),
            },
          }
        : {}),
    };

  let orderBy:
    Prisma.ProductOrderByWithRelationInput =
    {
      createdAt: "desc",
    };

  if (
    sort === "price-asc"
  ) {
    orderBy = {
      price: "asc",
    };
  }

  if (
    sort === "price-desc"
  ) {
    orderBy = {
      price: "desc",
    };
  }

  if (sort === "name") {
    orderBy = {
      name: "asc",
    };
  }

  const [
    categories,
    products,
  ] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,

        _count: {
          select: {
            products: true,
          },
        },
      },
    }),

    prisma.product.findMany({
      where,

      include: {
        images: {
          orderBy: {
            position: "asc",
          },

          select: {
            url: true,
          },
        },

        variants: true,
      },

      orderBy,
    }),
  ]);

  const preparedProducts =
    products.map(
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

  const queryString =
    new URLSearchParams(
      Object.entries(
        params,
      ).reduce<
        Record<
          string,
          string
        >
      >(
        (
          result,
          [
            key,
            value,
          ],
        ) => {
          if (value) {
            result[key] =
              value;
          }

          return result;
        },
        {},
      ),
    ).toString();

  return (
    <main className="relative overflow-hidden pb-20">

      <div className="page-shell relative z-10 py-6 sm:py-8">
        <div className="mb-7 sm:mb-9">
          <nav
            className="flex flex-wrap items-center gap-2 text-sm text-muted"
            aria-label="Хлібні крихти"
          >
            <Link
              href="/"
              className="transition hover:text-foreground"
            >
              Головна
            </Link>

            <span>/</span>

            <span className="text-foreground">
              Каталог
            </span>
          </nav>

          <h1 className="editorial-title mt-5 text-5xl text-foreground">
            Каталог
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Стильний жіночий одяг для
            щоденних образів та особливих
            моментів.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[270px_1fr] lg:gap-8">
          <input
            id="catalog-filter-toggle"
            type="checkbox"
            className="peer sr-only"
          />

          <label
            htmlFor="catalog-filter-toggle"
            className="glass-panel flex cursor-pointer items-center justify-between px-5 py-4 lg:hidden"
          >
            <span className="flex items-center gap-3 font-semibold text-foreground">
              <SlidersHorizontal className="h-5 w-5 text-accent-hover" />
              Фільтри
            </span>

            <span className="text-sm text-muted">
              Показати / сховати
            </span>
          </label>

          <aside className="hidden peer-checked:block lg:block">
            <form
              action="/catalog"
              method="get"
              className="glass-panel p-6 lg:sticky lg:top-28"
            >
              {q && (
                <input
                  type="hidden"
                  name="q"
                  value={q}
                />
              )}

              <input
                type="hidden"
                name="sort"
                value={sort}
              />

              <input
                type="hidden"
                name="view"
                value={view}
              />

              <div className="flex items-center justify-between gap-4 pb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />

                  <h2 className="text-lg font-semibold text-foreground">
                    Фільтри
                  </h2>
                </div>

                <Link
                  href={
                    q
                      ? `/catalog?q=${encodeURIComponent(
                          q,
                        )}`
                      : "/catalog"
                  }
                  className="text-xs font-medium text-accent-hover transition hover:text-accent"
                >
                  Скинути
                </Link>
              </div>

              <FilterSection title="Категорія">
                <div className="space-y-1.5">
                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-muted transition hover:bg-accent-soft">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        defaultChecked={
                          !category
                        }
                        className="h-4 w-4 accent-accent"
                      />

                      Усі категорії
                    </span>
                  </label>

                  {categories.map(
                    (item) => (
                      <label
                        key={
                          item.id
                        }
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2 text-sm text-muted transition hover:bg-accent-soft"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <input
                            type="radio"
                            name="category"
                            value={
                              item.slug
                            }
                            defaultChecked={
                              category ===
                              item.slug
                            }
                            className="h-4 w-4 shrink-0 accent-accent"
                          />

                          <span className="truncate">
                            {
                              item.name
                            }
                          </span>
                        </span>

                        <span className="text-xs">
                          {
                            item
                              ._count
                              .products
                          }
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </FilterSection>

              <FilterSection title="Розмір">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value=""
                      defaultChecked={
                        !size
                      }
                      className="filter-option-input sr-only"
                    />

                    <span className="filter-option">
                      Усі
                    </span>
                  </label>

                  {sizes.map(
                    (item) => (
                      <label
                        key={item}
                        className="cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="size"
                          value={
                            item
                          }
                          defaultChecked={
                            size ===
                            item
                          }
                          className="filter-option-input sr-only"
                        />

                        <span className="filter-option">
                          {item}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </FilterSection>

              <FilterSection title="Колір">
                <div className="flex flex-wrap gap-3">
                  <label
                    className="cursor-pointer"
                    title="Усі кольори"
                  >
                    <input
                      type="radio"
                      name="color"
                      value=""
                      defaultChecked={
                        !color
                      }
                      className="peer sr-only"
                    />

                    <span className="glass-control flex h-9 w-9 items-center justify-center text-sm text-muted transition hover:border-accent peer-checked:border-accent peer-checked:ring-2 peer-checked:ring-accent">
                      ×
                    </span>
                  </label>

                  {colors.map(
                    (item) => (
                      <label
                        key={
                          item.value
                        }
                        className="cursor-pointer"
                        title={
                          item.label
                        }
                      >
                        <input
                          type="radio"
                          name="color"
                          value={
                            item.value
                          }
                          defaultChecked={
                            color ===
                            item.value
                          }
                          className="peer sr-only"
                        />

                        <span
                          className="block h-9 w-9 rounded-full border-2 border-transparent ring-1 ring-border-muted transition hover:scale-105 peer-checked:border-accent peer-checked:ring-2 peer-checked:ring-accent"
                          style={{
                            backgroundColor:
                              item.hex,
                          }}
                        />
                      </label>
                    ),
                  )}
                </div>
              </FilterSection>

              <FilterSection title="Ціна">
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="mb-2 block text-xs text-muted">
                      Від
                    </span>

                    <input
                      type="number"
                      name="minPrice"
                      min="0"
                      step="1"
                      defaultValue={
                        params.minPrice ??
                        ""
                      }
                      placeholder="0"
                      className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none transition focus:border-accent"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-xs text-muted">
                      До
                    </span>

                    <input
                      type="number"
                      name="maxPrice"
                      min="0"
                      step="1"
                      defaultValue={
                        params.maxPrice ??
                        ""
                      }
                      placeholder="6000"
                      className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none transition focus:border-accent"
                    />
                  </label>
                </div>
              </FilterSection>

              <button
                type="submit"
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 py-3.5 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Застосувати фільтри
              </button>
            </form>
          </aside>

          <section className="min-w-0">
            <CatalogToolbar
              count={
                products.length
              }
              query={q}
              queryString={
                queryString
              }
              sort={sort}
              view={view}
            />

            {preparedProducts.length >
            0 ? (
              <div
                className={
                  view === "list"
                    ? "grid grid-cols-1 gap-4"
                    : "grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3"
                }
              >
                {preparedProducts.map(
                  (
                    product,
                  ) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      layout={
                        view
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="glass-panel flex min-h-90 flex-col items-center justify-center px-6 text-center">
                <p className="editorial-title text-3xl text-foreground">
                  Товарів не знайдено
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                  Спробуйте змінити параметри
                  фільтрації або очистити
                  пошуковий запит.
                </p>

                <Link
                  href="/catalog"
                  className="mt-6 rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-hover"
                >
                  Очистити фільтри
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}