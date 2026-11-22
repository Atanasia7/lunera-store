import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
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

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/catalog"
        className="text-sm text-neutral-500 transition hover:text-black"
      >
        ← Повернутися до каталогу
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="flex aspect-[4/5] items-center justify-center bg-neutral-100">
          <span className="text-8xl font-light text-neutral-300">
            {product.name.charAt(0)}
          </span>
        </div>

        <div className="py-4">
          <p className="text-sm uppercase tracking-[0.15em] text-neutral-500">
            {product.category.name}
          </p>

          <h1 className="mt-3 text-4xl font-semibold">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-medium">
            {Number(product.price).toLocaleString("uk-UA")} грн
          </p>

          <p className="mt-8 max-w-xl leading-7 text-neutral-600">
            {product.description}
          </p>

          <div className="mt-10">
            <p className="mb-3 font-medium">Доступні варіанти</p>

            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="border border-neutral-300 px-4 py-3 text-sm"
                >
                  <p>
                    {variant.size} · {variant.color}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    Залишок: {variant.stock}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="mt-10 w-full bg-neutral-900 px-6 py-4 font-medium text-white"
          >
            Додати до кошика
          </button>
        </div>
      </div>
    </main>
  );
}