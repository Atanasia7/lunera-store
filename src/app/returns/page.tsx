import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
  Send,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Обмін і повернення | Lunera",
  description:
    "Умови обміну та повернення товарів у магазині Lunera.",
};

const conditions = [
  "Товар не використовувався та не має слідів носіння або прання.",
  "Збережено фабричні ярлики, етикетки, пакування та комплектність.",
  "Є номер замовлення або інше підтвердження покупки.",
];

const steps = [
  {
    icon: Send,
    number: "01",
    title: "Зв’яжіться з нами",
    description:
      "Повідомте номер замовлення та причину повернення.",
  },
  {
    icon: PackageCheck,
    number: "02",
    title: "Підготуйте товар",
    description:
      "Перевірте товарний вигляд, ярлики та комплектність.",
  },
  {
    icon: RotateCcw,
    number: "03",
    title: "Надішліть посилку",
    description:
      "Після погодження передайте товар обраному перевізнику.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="page-shell py-10 sm:py-14">
      <section className="glass-panel px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Покупцям
        </p>

        <h1 className="editorial-title mt-4 text-4xl text-foreground sm:text-5xl">
          Обмін і повернення
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
          Якщо товар не підійшов, зверніться до нас щодо обміну або
          повернення відповідно до чинного законодавства України.
        </p>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-2">
        <article className="glass-panel p-7 sm:p-9">
          <h2 className="editorial-title text-3xl text-foreground">
            Умови повернення
          </h2>

          <div className="mt-7 space-y-5">
            {conditions.map((condition) => (
              <div
                key={condition}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" />

                <p className="text-sm leading-7 text-muted">
                  {condition}
                </p>
              </div>
            ))}
          </div>
        </article>

        <aside className="glass-panel p-7 sm:p-9">
          <h2 className="text-xl font-semibold text-foreground">
            Важлива інформація
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted">
            Деякі категорії товарів належної якості можуть не
            підлягати поверненню або обміну відповідно до
            законодавства. Кожне звернення розглядається
            індивідуально.
          </p>

          <p className="mt-4 text-sm leading-7 text-muted">
            Повернення коштів здійснюється після отримання та
            перевірки товару.
          </p>

          <Link
            href="/contacts"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Зв’язатися з нами
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>

      <section className="py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Послідовність дій
        </p>

        <h2 className="editorial-title mt-3 text-3xl text-foreground sm:text-4xl">
          Як оформити повернення
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="glass-panel p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-semibold text-muted">
                    {step.number}
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
    </main>
  );
}