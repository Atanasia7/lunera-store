import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border-muted bg-background pb-6">
      <div className="page-shell pt-8">
        <div className="glass-panel grid gap-10 px-8 py-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="editorial-title text-3xl tracking-[0.12em] text-foreground"
            >
              LUNERA
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Сучасний жіночий одяг для щоденного стилю,
              особливих подій і впевненого настрою.
            </p>
          </div>

          {/* Customer links */}
          <div>
            <h3 className="font-semibold text-foreground">
              Покупцям
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <Link
                href="/catalog"
                className="transition hover:text-foreground"
              >
                Каталог
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-foreground"
              >
                Кошик
              </Link>

              <Link
                href="/favorites"
                className="transition hover:text-foreground"
              >
                Обране
              </Link>

              <Link
                href="/checkout"
                className="transition hover:text-foreground"
              >
                Доставка та оплата
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground">
              Про Lunera
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <span>Про бренд</span>
              <span>Контакти</span>
              <span>Повернення</span>
              <span>Політика конфіденційності</span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground">
              Підписатися на новини
            </h3>

            <p className="mt-3 text-sm leading-6 text-muted">
              Нові колекції та оновлення Lunera.
            </p>

            <form className="glass-control mt-4 flex h-12 overflow-hidden">
              <input
                type="email"
                placeholder="Ваш e-mail"
                aria-label="Електронна пошта"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted"
              />

              <button
                type="submit"
                className="m-1 rounded-xl bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                →
              </button>
            </form>

            {/* Social icons */}
            <div className="mt-5 flex gap-2">
              <a
                href="#"
                className="glass-control flex h-10 w-10 items-center justify-center text-foreground transition hover:border-accent hover:text-accent-hover"
                aria-label="Instagram"
                title="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              <a
                href="#"
                className="glass-control flex h-10 w-10 items-center justify-center text-foreground transition hover:border-accent hover:text-accent-hover"
                aria-label="Facebook"
                title="Facebook"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>

              <a
                href="#"
                className="glass-control flex h-10 w-10 items-center justify-center text-foreground transition hover:border-accent hover:text-accent-hover"
                aria-label="YouTube"
                title="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="flex flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Lunera. Усі права захищені.
          </p>

          <p>
            UA / EN
          </p>
        </div>
      </div>
    </footer>
  );
}