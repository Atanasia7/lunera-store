import type { ReactNode } from "react";
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
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getShortDescription(description: string) {
  const clean = description.trim();

  if (!clean) {
    return "";
  }

  const match = clean.match(/^.*?[.!?](?:\s|$)/);
  return match?.[0].trim() ?? clean;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { position: "asc" },
        select: { url: true },
      },
      variants: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const recommendations = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
    },
    include: {
      images: {
        orderBy: { position: "asc" },
        select: { url: true },
      },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const photos = getProductPhotos(product);
  const mainPhoto = photos[0] ?? null;

  const productColors = [
    ...new Set(
      product.variants.map((variant) => variant.color),
    ),
  ];

  const preparedRecommendations = recommendations.map(
    (item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      imageUrl: getProductPhotos(item)[0] ?? null,
      price: Number(item.price),
      colors: [
        ...new Set(
          item.variants.map((variant) => variant.color),
        ),
      ],
    }),
  );

  const variants = product.variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
  }));

  const shortDescription = getShortDescription(
    product.description,
  );

  return (
    <main className="page-shell py-8">
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

      <section className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery
          name={product.name}
          photos={photos}
        />

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
                {Number(product.price).toLocaleString(
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
                imageUrl: mainPhoto,
                price: Number(product.price),
                colors: productColors,
              }}
              className="glass-control flex h-12 w-12 shrink-0 items-center justify-center transition hover:border-accent"
            />
          </div>

          {shortDescription && (
            <p className="mt-7 max-w-2xl text-base leading-7 text-muted">
              {shortDescription}
            </p>
          )}

          <div className="mt-9">
            <ProductOptions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                imageUrl: mainPhoto,
                price: Number(product.price),
              }}
              variants={variants}
            />
          </div>

          <div className="mt-10 space-y-3">
            <details className="glass-control group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                Склад та догляд
              </summary>

              <p className="mt-4 text-sm leading-6 text-muted">
                Делікатний догляд відповідно до
                рекомендацій на етикетці. Рекомендується
                прання при низькій температурі.
              </p>
            </details>

            <details className="glass-control group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                Доставка і повернення
              </summary>

              <p className="mt-4 text-sm leading-6 text-muted">
                Доставка по Україні. Повернення товару
                можливе протягом 14 днів.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="glass-panel mt-10 overflow-hidden">
        <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-hover">
              Lunera
            </p>

            <h2 className="editorial-title mt-3 text-4xl text-foreground md:text-5xl">
              Про товар
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="whitespace-pre-line text-base leading-8 text-muted">
              {product.description}
            </p>
          </div>
        </div>
      </section>

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

      {preparedRecommendations.length > 0 && (
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
            {preparedRecommendations.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
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
  icon: ReactNode;
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