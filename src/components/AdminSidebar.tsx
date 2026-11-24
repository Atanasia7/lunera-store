"use client";

import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Tags,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    href: "/admin",
    label: "Огляд",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/products",
    label: "Товари",
    icon: Boxes,
  },
  {
    href: "/admin/categories",
    label: "Категорії",
    icon: Tags,
  },
  {
    href: "/admin/orders",
    label: "Замовлення",
    icon: ClipboardList,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel p-5 lg:sticky lg:top-28">
      <div className="border-b border-border-muted pb-5">
        <p className="editorial-title text-2xl text-foreground">
          LUNERA
        </p>

        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
          Адмін-панель
        </p>
      </div>

      <nav
        className="mt-5 grid gap-2"
        aria-label="Адміністрування"
      >
        {navigation.map(
          (item) => {
            const Icon =
              item.icon;

            const active =
              item.exact
                ? pathname ===
                  item.href
                : pathname.startsWith(
                    item.href,
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-accent-soft text-accent-hover"
                    : "text-muted hover:bg-accent-soft hover:text-foreground"
                }`}
              >
                <Icon
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />

                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      <div className="mt-6 border-t border-border-muted pt-5">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-accent-hover transition hover:text-accent"
        >
          ← До магазину
        </Link>
      </div>
    </aside>
  );
}