import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  PackageCheck,
  Truck,
} from "lucide-react";

const deliverySteps = [
  {
    icon: PackageCheck,
    title: "Підтвердження",
    description:
      "Після оформлення замовлення ви отримаєте підтвердження з усіма деталями.",
  },
  {
    icon: Clock3,
    title: "Підготовка",
    description:
      "Ми перевіряємо товар і готуємо замовлення до відправлення.",
  },
  {
    icon: Truck,
    title: "Відправлення",
    description:
      "Після передавання посилки перевізнику ви отримаєте номер для відстеження.",
  },
];

export default function DeliveryPage() {
  return (
    <main className="page-shell py-10 sm:py-14">
      <section className="glass-panel px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Покупцям
        </p>

        <h1 className="editorial-title mt-4 text-4xl text-foreground sm:text-5xl">
          Доставка та оплата
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
          Ми прагнемо, щоб оформлення та отримання замовлення були
          простими й зрозумілими на кожному етапі.
        </p>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-2">
        <article className="glass-panel p-7 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Truck className="h-5 w-5" />
          </div>

          <h2 className="editorial-title mt-6 text-3xl text-foreground">
            Доставка
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <div>
              <h3 className="font-semibold text-foreground">
                Відділення та поштомати
              </h3>

              <p className="mt-1">
                Замовлення можна отримати у вибраному відділенні або
                поштоматі перевізника.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Адресна доставка
              </h3>

              <p className="mt-1">
                Кур’єр доставить замовлення за адресою, вказаною під час
                оформлення.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Вартість і терміни
              </h3>

              <p className="mt-1">
                Вартість розраховується за тарифами перевізника.
                Орієнтовний строк доставки відображається під час
                оформлення замовлення.
              </p>
            </div>
          </div>
        </article>

        <article className="glass-panel p-7 sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <CreditCard className="h-5 w-5" />
          </div>

          <h2 className="editorial-title mt-6 text-3xl text-foreground">
            Оплата
          </h2>

          <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
            <div>
              <h3 className="font-semibold text-foreground">
                Онлайн-оплата
              </h3>

              <p className="mt-1">
                Оплатити замовлення можна банківською карткою під час
                оформлення.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Оплата при отриманні
              </h3>

              <p className="mt-1">
                Якщо цей спосіб доступний, оплату можна здійснити після
                огляду посилки у відділенні перевізника.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Підтвердження оплати
              </h3>

              <p className="mt-1">
                Після успішної оплати інформація про замовлення
                з’явиться у вашому особистому кабінеті.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="py-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Як це працює
          </p>

          <h2 className="editorial-title mt-3 text-3xl text-foreground sm:text-4xl">
            Шлях вашого замовлення
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {deliverySteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="glass-panel p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-semibold text-muted">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass-panel mt-10 flex flex-col gap-6 px-7 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Залишилися запитання?
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Перейдіть на сторінку контактів, щоб зв’язатися з нами.
          </p>
        </div>

        <Link
          href="/contacts"
          className="inline-flex w-fit items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Контакти
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
