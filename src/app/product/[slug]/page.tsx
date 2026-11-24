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
import ProductDetailsTabs from "@/components/ProductDetailsTabs";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import { prisma } from "@/lib/prisma";
import { getProductPhotos } from "@/lib/product-photos";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
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
    where: {
      slug,
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
      variants: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const recommendations = await prisma.product.findMany({
    where: {
      isActive: true,
      id: {
        not: product.id,
      },
      categoryId: product.categoryId,
    },
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
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  const photos = getProductPhotos(product);
  const mainPhoto = photos[0] ?? null;

  const productColors = [
    ...new Set(
      product.variants.map((variant) => variant.color),
    ),
  ];

  const shortDescription = getShortDescription(
    product.description,
  );

  const variants = product.variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color,
    stock: variant.stock,
  }));

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

  return (
    <main className="page-shell py-6 sm:py-8">
      <nav
        className="flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm"
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

      <section className="mt-6 grid items-start gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-12">
        <ProductGallery
          name={product.name}
          photos={photos}
        />

        <div className="glass-panel p-6 sm:p-8 lg:sticky lg:top-28">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-hover">
                {product.category.name}
              </p>

              <h1 className="editorial-title mt-3 text-4xl leading-tight text-foreground sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                {Number(product.price).toLocaleString(
                  "uk-UA",
                )}{" "}
                ₴
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
            <p className="mt-6 text-sm leading-7 text-muted sm:text-base">
              {shortDescription}
            </p>
          )}

          <div className="mt-8 border-t border-border-muted pt-7">
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
        </div>
      </section>

      <ProductDetailsTabs
        description={product.description}
      />

      <section className="glass-panel mt-8 grid gap-1 px-3 py-3 sm:grid-cols-2 xl:grid-cols-4">
        <ProductBenefit
          icon={<Truck />}
          title="Швидка доставка"
          text="по Україні"
        />

        <ProductBenefit
          icon={<RotateCcw />}
          title="Легке повернення"
          text="зрозумілі умови"
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
        <section className="py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="editorial-title max-w-3xl text-4xl text-foreground sm:text-5xl">
              Вам також може сподобатися
            </h2>

            <Link
              href="/catalog"
              className="hidden shrink-0 text-sm font-semibold text-accent-hover transition hover:text-accent sm:block"
            >
              Переглянути всі →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {preparedRecommendations.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
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
    <div className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-accent-soft">
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