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
};

const colorMap: Record<string, string> = {
  black: "#1C1A20",
  white: "#F4F0E9",
  beige: "#D8C4B2",
  gray: "#A8A2A9",
  lilac: "#B89ACB",
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const favoriteProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    imageUrl: product.imageUrl,
    price: Number(product.price),
    colors: product.colors,
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-(--shadow) backdrop-blur-xl">
      <div className="relative aspect-4/5 overflow-hidden bg-surface-soft">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Переглянути ${product.name}`}
        />

        {product.imageUrl ? (
          <Image
            src={product.imageUrl.trim()}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="editorial-title text-6xl text-muted">
              {product.name.charAt(0)}
            </span>
          </div>
        )}

        <FavoriteButton
          product={favoriteProduct}
          className="glass-control absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center transition hover:border-accent"
        />
      </div>

      <div className="p-4">
        <Link
          href={`/product/${product.slug}`}
        >
          <h3 className="editorial-title text-xl text-foreground transition hover:text-accent-hover">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="font-semibold text-foreground">
            {Number(
              product.price,
            ).toLocaleString("uk-UA")}{" "}
            грн
          </p>

          {product.colors &&
            product.colors.length > 0 && (
              <div className="flex gap-1.5">
                {product.colors.map(
                  (color) => (
                    <span
                      key={color}
                      className="h-3.5 w-3.5 rounded-full border border-border-muted"
                      style={{
                        background:
                          colorMap[
                            color.toLowerCase()
                          ] ?? "#A879C5",
                      }}
                      title={color}
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