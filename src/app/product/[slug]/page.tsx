import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import FavoriteButton from "@/components/FavoriteButton";
import ProductCard from "@/components/ProductCard";
import ProductOptions from "@/components/ProductOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product =
    await prisma.product.findUnique({
      where: {
        slug,
      },

      include: {
        category: true,
        variants: true,
      },
    });

  if (!product || !product.isActive) {
    notFound();
  }

  const recommendations =
    await prisma.product.findMany({
      where: {
        isActive: true,

        id: {
          not: product.id,
        },
      },

      include: {
        variants: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 4,
    });

  const productColors = [
    ...new Set(
      product.variants.map(
        (variant) => variant.color,
      ),
    ),
  ];

  const preparedRecommendations =
    recommendations.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      imageUrl: item.imageUrl,
      price: Number(item.price),

      colors: [
        ...new Set(
          item.variants.map(
            (variant) => variant.color,
          ),
        ),
      ],
    }));

  const variants =
    product.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color,
      stock: variant.stock,
    }));

  return (
    <main className="page-shell py-8">
      {/* Breadcrumbs */}
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

        <Link
          href="/catalog"
          className="transition hover:text-foreground"
        >
          Каталог
        </Link>

        <span>/</span>

        <Link
          href={`/catalog?category=${product.category.slug}`}
          className="transition hover:text-foreground"
        >
          {product.category.name}
        </Link>

        <span>/</span>

        <span className="text-foreground">
          {product.name}
        </span>
      </nav>

      {/* Product */}
      <section className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[90px_1fr]">
          <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
            <div className="relative aspect-4/5 w-20 overflow-hidden rounded-2xl border-2 border-accent bg-surface-soft sm:w-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl.trim()}
                  alt={product.name}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel order-1 relative aspect-4/5 overflow-hidden sm:order-2">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl.trim()}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="editorial-title text-8xl text-muted">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="py-2">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-hover">
                {product.category.name}
              </p>

              <h1 className="editorial-title mt-3 text-5xl leading-tight text-foreground md:text-6xl">
                {product.name}
              </h1>

              <p className="mt-5 text-3xl font-semibold text-foreground">
                {Number(
                  product.price,
                ).toLocaleString(
                  "uk-UA",
                )}{" "}
                грн
              </p>
            </div>

            <FavoriteButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                imageUrl: product.imageUrl,
                price: Number(
                  product.price,
                ),
                colors:
                  productColors,
              }}
              className="glass-control flex h-12 w-12 shrink-0 items-center justify-center transition hover:border-accent"
            />
          </div>

          <p className="mt-7 max-w-2xl text-base leading-7 text-muted">
            {product.description}
          </p>

          <div className="mt-9">
            <ProductOptions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl:
                  product.imageUrl,
                price: Number(
                  product.price,
                ),
              }}
              variants={variants}
            />
          </div>

          {/* Information */}
          <div className="mt-10 space-y-3">
            <details className="glass-control group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                Опис
              </summary>

              <p className="mt-4 text-sm leading-6 text-muted">
                {product.description}
              </p>
            </details>

            <details className="glass-control group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                Склад та догляд
              </summary>

              <p className="mt-4 text-sm leading-6 text-muted">
                Делікатний догляд відповідно
                до рекомендацій на етикетці.
                Рекомендується прання при
                низькій температурі.
              </p>
            </details>

            <details className="glass-control group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                Доставка і повернення
              </summary>

              <p className="mt-4 text-sm leading-6 text-muted">
                Доставка по Україні.
                Повернення товару можливе
                протягом 14 днів.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="glass-panel mt-8 grid gap-3 px-4 py-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProductBenefit
          icon={<Truck />}
          title="Швидка доставка"
          text="по Україні"
        />

        <ProductBenefit
          icon={<RotateCcw />}
          title="Легке повернення"
          text="протягом 14 днів"
        />

        <ProductBenefit
          icon={<ShieldCheck />}
          title="Гарантія якості"
          text="перевірені товари"
        />

        <ProductBenefit
          icon={<Package />}
          title="Фірмове пакування"
          text="Lunera"
        />
      </section>

      {/* Recommendations */}
      {preparedRecommendations.length >
        0 && (
        <section className="py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="editorial-title text-4xl text-foreground md:text-5xl">
              Вам також може сподобатися
            </h2>

            <Link
              href="/catalog"
              className="shrink-0 text-sm font-medium text-accent-hover"
            >
              Переглянути всі →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {preparedRecommendations.map(
              (item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ),
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function ProductBenefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="glass-control flex h-11 w-11 shrink-0 items-center justify-center text-accent-hover [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs text-muted">
          {text}
        </p>
      </div>
    </div>
  );
}