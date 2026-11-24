import Link from "next/link";
import {
  Grid2X2,
  List,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

import type { Prisma } from "../../../generated/prisma/client";

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

const sizes = ["XS", "S", "M", "L", "XL"];

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

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const size = params.size ?? "";
  const color = params.color ?? "";
  const sort = params.sort ?? "newest";

  const parsedMinPrice = Number(params.minPrice);
  const parsedMaxPrice = Number(params.maxPrice);

  const hasMinPrice =
    params.minPrice !== undefined &&
    params.minPrice !== "" &&
    Number.isFinite(parsedMinPrice);

  const hasMaxPrice =
    params.maxPrice !== undefined &&
    params.maxPrice !== "" &&
    Number.isFinite(parsedMaxPrice);

  const variantFilter: Prisma.ProductVariantWhereInput = {
    ...(size ? { size } : {}),
    ...(color ? { color } : {}),
  };

  const where: Prisma.ProductWhereInput = {
    isActive: true,

    ...(q
      ? {
          OR: [
            {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: q,
                mode: "insensitive",
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
            some: variantFilter,
          },
        }
      : {}),

    ...(hasMinPrice || hasMaxPrice
      ? {
          price: {
            ...(hasMinPrice
              ? {
                  gte: parsedMinPrice,
                }
              : {}),

            ...(hasMaxPrice
              ? {
                  lte: parsedMaxPrice,
                }
              : {}),
          },
        }
      : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: "desc",
  };

  if (sort === "price-asc") {
    orderBy = {
      price: "asc",
    };
  }

  if (sort === "price-desc") {
    orderBy = {
      price: "desc",
    };
  }

  if (sort === "name") {
    orderBy = {
      name: "asc",
    };
  }

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),

    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { position: "asc" },
          select: { url: true },
        },
        variants: true,
      },
      orderBy,
    }),
  ]);

  const preparedProducts = products.map((product) => ({
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
  }));

  return (
    <main className="page-shell py-8">
      <div className="mb-10">
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

        <div className="mt-6">
          <h1 className="editorial-title text-5xl text-foreground md:text-6xl">
            Каталог
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Стильний жіночий одяг для щоденних образів
            та особливих моментів.
          </p>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <form
            action="/catalog"
            method="get"
            className="glass-panel sticky top-24 p-6"
          >
            {q && (
              <input
                type="hidden"
                name="q"
                value={q}
              />
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  className="h-5 w-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <h2 className="text-lg font-semibold text-foreground">
                  Фільтри
                </h2>
              </div>

              <Link
                href={
                  q
                    ? `/catalog?q=${encodeURIComponent(q)}`
                    : "/catalog"
                }
                className="text-xs font-medium text-accent-hover transition hover:text-accent"
              >
                Скинути
              </Link>
            </div>

            <div className="mt-6 border-t border-border-muted pt-5">
              <p className="text-sm font-semibold text-foreground">
                Категорія
              </p>

              <div className="mt-4 space-y-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-muted transition hover:bg-accent-soft">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    defaultChecked={!category}
                    className="h-4 w-4 accent-accent"
                  />

                  <span>Усі категорії</span>
                </label>

                {categories.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-sm text-muted transition hover:bg-accent-soft"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={item.slug}
                      defaultChecked={
                        category === item.slug
                      }
                      className="h-4 w-4 accent-accent"
                    />

                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-border-muted pt-5">
              <p className="text-sm font-semibold text-foreground">
                Розмір
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value=""
                    defaultChecked={!size}
                    className="filter-option-input sr-only"
                  />

                  <span className="filter-option">
                    Усі
                  </span>
                </label>

                {sizes.map((item) => (
                  <label
                    key={item}
                    className="cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="size"
                      value={item}
                      defaultChecked={
                        size === item
                      }
                      className="filter-option-input sr-only"
                    />

                    <span className="filter-option">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-border-muted pt-5">
              <p className="text-sm font-semibold text-foreground">
                Колір
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <label
                  className="cursor-pointer"
                  title="Усі кольори"
                >
                  <input
                    type="radio"
                    name="color"
                    value=""
                    defaultChecked={!color}
                    className="peer sr-only"
                  />

                  <span className="glass-control flex h-9 w-9 items-center justify-center text-sm text-muted transition hover:border-accent peer-checked:border-accent">
                    ×
                  </span>
                </label>

                {colors.map((item) => (
                  <label
                    key={item.value}
                    className="cursor-pointer"
                    title={item.label}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={item.value}
                      defaultChecked={
                        color === item.value
                      }
                      className="peer sr-only"
                    />

                    <span
                      className="block h-9 w-9 rounded-full border-2 border-transparent ring-1 ring-border-muted transition hover:scale-105 peer-checked:border-accent peer-checked:ring-2 peer-checked:ring-accent"
                      style={{
                        backgroundColor: item.hex,
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-border-muted pt-5">
              <p className="text-sm font-semibold text-foreground">
                Ціна
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
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
                      params.minPrice ?? ""
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
                      params.maxPrice ?? ""
                    }
                    placeholder="6000"
                    className="glass-control h-11 w-full px-3 text-sm text-foreground outline-none transition focus:border-accent"
                  />
                </label>
              </div>
            </div>

            <input
              type="hidden"
              name="sort"
              value={sort}
            />

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-5 py-3.5 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Застосувати фільтри
            </button>
          </form>
        </aside>

        <section>
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm text-muted">
                Знайдено товарів:{" "}
                <span className="font-semibold text-foreground">
                  {products.length}
                </span>
              </p>

              {q && (
                <p className="mt-1 text-sm text-muted">
                  Пошук за запитом:{" "}
                  <span className="font-medium text-foreground">
                    «{q}»
                  </span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="glass-control flex h-11 items-center p-1"
                aria-label="Вигляд каталогу"
              >
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-hover"
                  aria-label="Сітка"
                  title="Сітка"
                >
                  <Grid2X2
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:text-foreground"
                  aria-label="Список"
                  title="Список"
                >
                  <List
                    className="h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <form
                action="/catalog"
                method="get"
                className="flex items-center gap-2"
              >
                {q && (
                  <input
                    type="hidden"
                    name="q"
                    value={q}
                  />
                )}

                {category && (
                  <input
                    type="hidden"
                    name="category"
                    value={category}
                  />
                )}

                {size && (
                  <input
                    type="hidden"
                    name="size"
                    value={size}
                  />
                )}

                {color && (
                  <input
                    type="hidden"
                    name="color"
                    value={color}
                  />
                )}

                {params.minPrice && (
                  <input
                    type="hidden"
                    name="minPrice"
                    value={params.minPrice}
                  />
                )}

                {params.maxPrice && (
                  <input
                    type="hidden"
                    name="maxPrice"
                    value={params.maxPrice}
                  />
                )}

                <select
                  name="sort"
                  defaultValue={sort}
                  className="glass-control h-11 min-w-56 px-4 text-sm text-foreground outline-none"
                  aria-label="Сортування"
                >
                  <option value="newest">
                    Спочатку нові
                  </option>

                  <option value="price-asc">
                    Ціна: від нижчої
                  </option>

                  <option value="price-desc">
                    Ціна: від вищої
                  </option>

                  <option value="name">
                    За назвою
                  </option>
                </select>

                <button
                  type="submit"
                  className="glass-control h-11 px-4 text-sm font-medium text-foreground transition hover:border-accent"
                >
                  ОК
                </button>
              </form>
            </div>
          </div>

          {preparedProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {preparedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel flex min-h-90 flex-col items-center justify-center px-6 text-center">
              <p className="editorial-title text-3xl text-foreground">
                Товарів не знайдено
              </p>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                Спробуйте змінити параметри фільтрації
                або очистити пошуковий запит.
              </p>

              <Link
                href="/catalog"
                className="mt-6 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-6 py-3.5 text-sm font-medium text-white"
              >
                Очистити фільтри
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}