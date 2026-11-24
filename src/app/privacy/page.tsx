import type { Metadata } from "next";
import {
  Cookie,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Lunera",
  description:
    "Інформація про обробку та захист персональних даних у магазині Lunera.",
};

const sections = [
  {
    icon: Database,
    title: "Які дані ми отримуємо",
    text: "Під час реєстрації або оформлення замовлення ми можемо отримувати ім’я, контактні дані, адресу доставки та інформацію, необхідну для виконання замовлення.",
  },
  {
    icon: ShieldCheck,
    title: "Як ми використовуємо дані",
    text: "Дані використовуються для оформлення і доставки замовлень, підтримки покупців, роботи особистого кабінету та покращення сервісу.",
  },
  {
    icon: LockKeyhole,
    title: "Захист інформації",
    text: "Ми застосовуємо організаційні та технічні заходи для захисту інформації від втрати, неправомірного доступу або розголошення.",
  },
  {
    icon: Cookie,
    title: "Файли cookie",
    text: "Сайт може використовувати cookie для збереження налаштувань, роботи кошика, авторизації та аналізу взаємодії із сайтом.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="page-shell py-10 sm:py-14">
      <section className="glass-panel px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Інформація
        </p>

        <h1 className="editorial-title mt-4 text-4xl text-foreground sm:text-5xl">
          Політика конфіденційності
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
          Ми поважаємо вашу приватність і використовуємо персональні
          дані лише для роботи магазину, виконання замовлень та
          покращення обслуговування.
        </p>
      </section>

      <section className="grid gap-5 py-10 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className="glass-panel p-7 sm:p-9"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </div>

              <h2 className="mt-6 text-xl font-semibold text-foreground">
                {section.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted">
                {section.text}
              </p>
            </article>
          );
        })}
      </section>

      <section className="glass-panel mt-4 p-7 sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Mail className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Запитання щодо персональних даних
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Ви можете звернутися до нас, щоб уточнити, оновити або
              видалити свої персональні дані, якщо їх подальше
              зберігання не вимагається законодавством.
            </p>

            <a
              href="mailto:support@lunera.ua"
              className="mt-5 inline-flex font-semibold text-accent transition hover:text-accent-hover"
            >
              support@lunera.ua
            </a>
          </div>
        </div>
      </section>

      <p className="mt-6 text-xs leading-6 text-muted">
        Ця сторінка містить загальний опис роботи з персональними
        даними. Перед комерційним запуском текст необхідно узгодити
        з фактичними процесами магазину та його юридичними реквізитами.
      </p>
    </main>
  );
}