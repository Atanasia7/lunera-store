import Image from "next/image";
import Link from "next/link";

import FavoriteButton from "@/components/FavoriteButton";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    price: number | string;
    colors?: string[];
  };

  layout?: "grid" | "list";
};

const colorMap: Record<
  string,
  string
> = {
  black: "#1C1A20",
  white: "#F4F0E9",
  beige: "#D8C4B2",
  gray: "#A8A2A9",
  lilac: "#B89ACB",
  purple: "#8C5A9E",
  pink: "#D5A7B6",
  blue: "#7890B5",
  brown: "#76584C",
  green: "#788A72",
};

export default function ProductCard({
  product,
  layout = "grid",
}: ProductCardProps) {
  const listLayout =
    layout === "list";

  const favoriteProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,

    price:
      Number(
        product.price,
      ),

    colors: product.colors,
  };

  return (
    <article
      className={`group min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-(--shadow) backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-accent/50 ${
        listLayout
          ? "grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)]"
          : "flex h-full flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-soft ${
          listLayout
            ? "min-h-38"
            : "aspect-4/5"
        }`}
      >
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Переглянути ${product.name}`}
        />

        {product.imageUrl ? (
          <Image
            src={
              product.imageUrl.trim()
            }
            alt={product.name}
            fill
            sizes={
              listLayout
                ? "(max-width: 640px) 112px, 180px"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            }
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent-soft">
            <span className="editorial-title text-5xl text-muted sm:text-6xl">
              {product.name.charAt(
                0,
              )}
            </span>
          </div>
        )}

        <FavoriteButton
          product={
            favoriteProduct
          }
          className="glass-control absolute right-2.5 top-2.5 z-30 flex h-9 w-9 items-center justify-center transition hover:border-accent sm:right-3 sm:top-3 sm:h-10 sm:w-10"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <Link
          href={`/product/${product.slug}`}
          className="relative z-10"
        >
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground transition hover:text-accent-hover sm:text-base">
            {product.name}
          </h3>
        </Link>

        {listLayout && (
          <p className="mt-2 hidden text-sm leading-6 text-muted sm:block">
            Перегляньте доступні кольори,
            розміри та деталі товару.
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {Number(
              product.price,
            ).toLocaleString(
              "uk-UA",
            )}{" "}
            ₴
          </p>

          {product.colors &&
            product.colors.length >
              0 && (
              <div
                className="flex shrink-0 gap-1"
                aria-label="Доступні кольори"
              >
                {product.colors
                  .slice(0, 4)
                  .map(
                    (
                      color,
                    ) => (
                      <span
                        key={
                          color
                        }
                        className="h-3 w-3 rounded-full border border-border-muted ring-1 ring-black/5 sm:h-3.5 sm:w-3.5"
                        style={{
                          background:
                            colorMap[
                              color.toLowerCase()
                            ] ??
                            "#A879C5",
                        }}
                        title={
                          color
                        }
                      />
                    ),
                  )}
              </div>
            )}
        </div>
      </div>
    </article>
  );
}