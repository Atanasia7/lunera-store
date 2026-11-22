import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-2xl font-semibold uppercase tracking-[0.2em] text-neutral-900"
        >
          Lunera
        </Link>

        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/" className="transition hover:text-black">
            Головна
          </Link>

          <Link href="/catalog" className="transition hover:text-black">
            Каталог
          </Link>

          <Link href="/favorites" className="transition hover:text-black">
            Обране
          </Link>

          <Link href="/cart" className="transition hover:text-black">
            Кошик
          </Link>

          <Link href="/account" className="transition hover:text-black">
            Кабінет
          </Link>
        </nav>
      </div>
    </header>
  );
}