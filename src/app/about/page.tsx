import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Leaf,
  Sparkles,
} from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Виразний стиль",
    description:
      "Речі, які легко поєднувати між собою та адаптувати до різних подій.",
  },
  {
    icon: Heart,
    title: "Турбота про деталі",
    description:
      "Увага до силуетів, матеріалів і посадки кожної моделі.",
  },
  {
    icon: Leaf,
    title: "Свідомий вибір",
    description:
      "Колекції, створені для тривалого використання, а не швидкоплинних трендів.",
  },
];

export default function AboutPage() {
  return (
    <main className="page-shell py-10 sm:py-14">
      <section className="glass-panel overflow-hidden">
        <div className="grid gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Про Lunera
            </p>

            <h1 className="editorial-title mt-4 max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Одяг, у якому легко бути собою
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Lunera — український fashion-простір для жінок, які цінують
              сучасний дизайн, комфорт і власну індивідуальність.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              Ми збираємо колекції, що доповнюють повсякденний гардероб,
              допомагають створювати впевнені образи та залишають простір
              для особистого стилю.
            </p>

            <Link
              href="/catalog"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Перейти до каталогу
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-border-muted bg-accent-soft p-8 sm:min-h-105">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between">
              <span className="editorial-title text-6xl text-accent/30 sm:text-8xl">
                L
              </span>

              <div>
                <p className="editorial-title text-3xl text-foreground sm:text-4xl">
                  LUNERA
                </p>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                  Жіночність, свобода поєднань і спокійна впевненість
                  у кожній деталі.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Наші цінності
          </p>

          <h2 className="editorial-title mt-3 text-3xl text-foreground sm:text-4xl">
            Стиль, що працює для вас
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="glass-panel p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}