import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return (
    <main>
      <section className="bg-neutral-100">
        <div className="mx-auto grid min-h-155 max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Нова колекція
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight text-neutral-900 md:text-6xl">
              Одяг, що підкреслює твій стиль
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              Сучасний жіночий одяг для повсякденних образів, особливих
              подій і моментів, коли хочеться почуватися впевнено.
            </p>

            <Link
              href="/catalog"
              className="mt-8 inline-block bg-neutral-900 px-7 py-4 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Переглянути каталог
            </Link>
          </div>

          <div className="flex aspect-4/5 items-center justify-center bg-neutral-200">
            <span className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              Lunera Collection
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Категорії
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-neutral-900">
            Обери свій образ
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/catalog?category=dresses" className="group">
            <div className="flex aspect-4/5 items-end bg-neutral-100 p-6 transition group-hover:bg-neutral-200">
              <h3 className="text-xl font-medium">Сукні</h3>
            </div>
          </Link>

          <Link href="/catalog?category=blouses" className="group">
            <div className="flex aspect-4/5 items-end bg-neutral-100 p-6 transition group-hover:bg-neutral-200">
              <h3 className="text-xl font-medium">Блузи</h3>
            </div>
          </Link>

          <Link href="/catalog?category=trousers" className="group">
            <div className="flex aspect-4/5 items-end bg-neutral-100 p-6 transition group-hover:bg-neutral-200">
              <h3 className="text-xl font-medium">Штани</h3>
            </div>
          </Link>

          <Link href="/catalog?category=outerwear" className="group">
            <div className="flex aspect-4/5 items-end bg-neutral-100 p-6 transition group-hover:bg-neutral-200">
              <h3 className="text-xl font-medium">Верхній одяг</h3>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                Lunera
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Новинки
              </h2>
            </div>

            <Link
              href="/catalog"
              className="text-sm font-medium text-neutral-700 underline underline-offset-4"
            >
              Усі товари
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-4/5 overflow-hidden bg-neutral-100">
  {product.imageUrl ? (
    <Image
      src={product.imageUrl.trim()}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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

                <div className="pt-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                    {product.category.name}
                  </p>

                  <h3 className="mt-2 font-medium text-neutral-900 transition group-hover:text-neutral-500">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium">
                    {Number(product.price).toLocaleString("uk-UA")} грн
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}