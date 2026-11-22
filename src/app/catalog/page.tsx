import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-neutral-500">
            Lunera
          </p>

          <h1 className="text-4xl font-semibold text-neutral-900">
            Каталог
          </h1>

          <p className="mt-3 text-neutral-600">
            Жіночий одяг для сучасного гардероба
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const totalStock = product.variants.reduce(
              (sum, variant) => sum + variant.stock,
              0
            );

            return (
             <Link
  key={product.id}
  href={`/product/${product.slug}`}
  className="block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
>
 <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
  {product.imageUrl ? (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover transition duration-300 group-hover:scale-[1.02]"
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <span className="text-6xl font-light text-neutral-300">
        {product.name.charAt(0)}
      </span>
    </div>
  )}
</div>

  <div className="p-5">
    <p className="text-sm text-neutral-500">
      {product.category.name}
    </p>

    <h2 className="mt-1 text-xl font-medium text-neutral-900">
      {product.name}
    </h2>

    <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
      {product.description}
    </p>

    <div className="mt-5 flex items-end justify-between gap-4">
      <p className="text-lg font-semibold text-neutral-900">
        {Number(product.price).toLocaleString("uk-UA")} грн
      </p>

      <p className="text-xs text-neutral-500">
        {totalStock > 0
          ? `В наявності: ${totalStock}`
          : "Немає в наявності"}
      </p>
    </div>
  </div>
</Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="py-20 text-center text-neutral-500">
            Товари поки відсутні.
          </p>
        )}
      </div>
    </main>
  );
}