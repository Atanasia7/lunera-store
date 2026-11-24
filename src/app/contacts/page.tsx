import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const contacts = [
  {
    icon: Mail,
    title: "Електронна пошта",
    value: "support@lunera.ua",
    description:
      "Для запитань щодо товарів, замовлень, доставки та повернення.",
    href: "mailto:support@lunera.ua",
  },
  {
    icon: Phone,
    title: "Телефон",
    value: "+380 67 000 00 00",
    description:
      "Зв’яжіться з нами у робочий час.",
    href: "tel:+380670000000",
  },
  {
    icon: FaInstagram,
    title: "Instagram",
    value: "@lunera.ua",
    description:
      "Новинки, образи, добірки та новини бренду.",
    href: "#",
  },
];

export default function ContactsPage() {
  return (
    <main className="page-shell py-10 sm:py-14">
      <section className="glass-panel px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Зв’язок із нами
        </p>

        <h1 className="editorial-title mt-4 text-4xl text-foreground sm:text-5xl">
          Контакти
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
          Ми допоможемо з вибором товару, оформленням замовлення,
          доставкою або поверненням.
        </p>
      </section>

      <section className="grid gap-5 py-10 md:grid-cols-3">
        {contacts.map((contact) => {
          const Icon = contact.icon;

          return (
            <a
              key={contact.title}
              href={contact.href}
              className="glass-panel group p-7 transition hover:-translate-y-1 hover:border-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-6 text-sm text-muted">
                {contact.title}
              </p>

              <h2 className="mt-2 text-lg font-semibold text-foreground transition group-hover:text-accent">
                {contact.value}
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted">
                {contact.description}
              </p>
            </a>
          );
        })}
      </section>

      <section className="grid gap-6 py-8 lg:grid-cols-2">
        <article className="glass-panel p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Графік підтримки
              </h2>

              <div className="mt-5 space-y-3 text-sm text-muted">
                <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-3">
                  <span>Понеділок — п’ятниця</span>
                  <span className="font-medium text-foreground">
                    09:00–18:00
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-border-muted pb-3">
                  <span>Субота</span>
                  <span className="font-medium text-foreground">
                    10:00–15:00
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Неділя</span>
                  <span className="font-medium text-foreground">
                    Вихідний
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="glass-panel p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Онлайн-магазин
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted">
                Lunera працює онлайн по всій Україні. Замовлення
                оформлюються на сайті та доставляються обраним
                перевізником.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent-soft p-4">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />

                <p className="text-sm leading-6 text-muted">
                  У повідомленні вкажіть номер замовлення, якщо ваше
                  звернення стосується вже оформленої покупки.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}