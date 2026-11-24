"use client";

import Link from "next/link";
import { useState } from "react";

type ProductDetailsTabsProps = {
  description: string;
};

type Tab = "description" | "care" | "delivery";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "description", label: "Опис" },
  { id: "care", label: "Склад та догляд" },
  { id: "delivery", label: "Доставка і повернення" },
];

export default function ProductDetailsTabs({
  description,
}: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  return (
    <section className="glass-panel mt-8 overflow-hidden">
      <div
        className="grid border-b border-border-muted sm:grid-cols-3"
        role="tablist"
        aria-label="Інформація про товар"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-4 text-sm font-medium transition ${
              activeTab === tab.id
                ? "bg-accent-soft text-foreground"
                : "text-muted hover:bg-accent-soft hover:text-foreground"
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}

            {activeTab === tab.id && (
              <span className="absolute inset-x-8 bottom-0 h-0.5 rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div
        className="min-h-32 px-6 py-6 sm:px-8"
        role="tabpanel"
      >
        {activeTab === "description" && (
          <p className="whitespace-pre-line text-sm leading-7 text-muted sm:text-base sm:leading-8">
            {description}
          </p>
        )}

        {activeTab === "care" && (
          <div className="space-y-3 text-sm leading-7 text-muted sm:text-base">
            <p>
              Делікатний догляд відповідно до рекомендацій на етикетці.
            </p>

            <p>
              Рекомендується прання при низькій температурі, без
              агресивного відбілювання та інтенсивного віджимання.
            </p>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-3 text-sm leading-7 text-muted sm:text-base">
            <p>
              Доставка здійснюється по Україні обраним під час
              оформлення перевізником.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/delivery"
                className="font-semibold text-accent-hover transition hover:text-accent"
              >
                Умови доставки
              </Link>

              <Link
                href="/returns"
                className="font-semibold text-accent-hover transition hover:text-accent"
              >
                Обмін і повернення
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}