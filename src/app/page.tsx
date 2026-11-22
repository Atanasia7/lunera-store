import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="bg-neutral-100">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Нова колекція
            </p>

            <h1 className="max-w-xl text-5xl font-semibold leading-tight text-neutral-900 md:text-6xl">
              Одяг, що підкреслює твій стиль
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
              Сучасний жіночий одяг для повсякденних, ділових та особливих
              образів.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/catalog"
                className="bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Перейти до каталогу
              </Link>
            </div>
          </div>

          <div className="flex aspect-[4/5] items-center justify-center bg-neutral-200">
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
              Hero image
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Категорії
          </p>

          <h2 className="mt-2 text-3xl font-semibold">
            Обери свій образ
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Сукні", "dresses"],
            ["Блузи", "blouses"],
            ["Штани", "trousers"],
            ["Верхній одяг", "outerwear"],
          ].map(([name, slug]) => (
            <Link
              key={slug}
              href={`/catalog?category=${slug}`}
              className="group"
            >
              <div className="flex aspect-[4/5] items-center justify-center bg-neutral-100 transition group-hover:bg-neutral-200">
                <span className="text-neutral-400">{name}</span>
              </div>

              <h3 className="mt-4 text-lg font-medium">{name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}