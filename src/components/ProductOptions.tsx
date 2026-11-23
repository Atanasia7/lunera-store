"use client";

import {
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/CartProvider";

type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

type ProductOptionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
    price: number;
  };

  variants: Variant[];
};

const colorMap: Record<string, string> = {
  black: "#1C1A20",
  white: "#F4F0E9",
  beige: "#D8C4B2",
  gray: "#A8A2A9",
  lilac: "#B89ACB",
};

const colorLabels: Record<string, string> = {
  black: "Чорний",
  white: "Білий",
  beige: "Бежевий",
  gray: "Сірий",
  lilac: "Ліловий",
};

export default function ProductOptions({
  product,
  variants,
}: ProductOptionsProps) {
  const { addItem } = useCart();

  const initialVariant = variants[0];

  const [selectedColor, setSelectedColor] =
    useState(initialVariant?.color ?? "");

  const [selectedSize, setSelectedSize] =
    useState(initialVariant?.size ?? "");

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const colors = [
    ...new Set(
      variants.map(
        (variant) => variant.color,
      ),
    ),
  ];

  const availableSizes = [
    ...new Set(
      variants
        .filter(
          (variant) =>
            variant.color ===
            selectedColor,
        )
        .map(
          (variant) =>
            variant.size,
        ),
    ),
  ];

  const selectedVariant =
    variants.find(
      (variant) =>
        variant.color ===
          selectedColor &&
        variant.size ===
          selectedSize,
    );

  const stock =
    selectedVariant?.stock ?? 0;

  function selectColor(
    color: string,
  ) {
    const firstVariant =
      variants.find(
        (variant) =>
          variant.color === color,
      );

    setSelectedColor(color);

    setSelectedSize(
      firstVariant?.size ?? "",
    );

    setQuantity(1);
    setAdded(false);
  }

  function selectSize(
    size: string,
  ) {
    setSelectedSize(size);
    setQuantity(1);
    setAdded(false);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(
        1,
        current - 1,
      ),
    );

    setAdded(false);
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(
        stock,
        current + 1,
      ),
    );

    setAdded(false);
  }

  function handleAddToCart() {
    if (
      !selectedVariant ||
      stock <= 0
    ) {
      return;
    }

    addItem({
      variantId:
        selectedVariant.id,

      productId:
        product.id,

      slug:
        product.slug,

      name:
        product.name,

      imageUrl:
        product.imageUrl,

      price:
        product.price,

      size:
        selectedVariant.size,

      color:
        selectedVariant.color,

      stock:
        selectedVariant.stock,

      quantity,
    });

    setAdded(true);
  }

  if (!initialVariant) {
    return (
      <div className="glass-panel p-5 text-sm text-muted">
        Наразі немає доступних
        варіантів товару.
      </div>
    );
  }

  return (
    <div>
      {/* Color */}
      <div>
        <p className="text-sm font-semibold text-foreground">
          Колір:{" "}
          <span className="font-normal text-muted">
            {colorLabels[
              selectedColor
            ] ?? selectedColor}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap gap-3">
          {colors.map(
            (color) => {
              const active =
                color ===
                selectedColor;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    selectColor(
                      color,
                    )
                  }
                  className={`h-10 w-10 rounded-full border-2 p-1 transition ${
                    active
                      ? "border-accent"
                      : "border-border-muted hover:border-accent"
                  }`}
                  aria-label={
                    colorLabels[
                      color
                    ] ?? color
                  }
                  title={
                    colorLabels[
                      color
                    ] ?? color
                  }
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{
                      background:
                        colorMap[
                          color.toLowerCase()
                        ] ??
                        "#A879C5",
                    }}
                  />
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Size */}
      <div className="mt-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground">
            Розмір
          </p>

          <button
            type="button"
            className="text-sm text-accent-hover underline underline-offset-4"
          >
            Таблиця розмірів
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {availableSizes.map(
            (size) => {
              const active =
                size ===
                selectedSize;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    selectSize(
                      size,
                    )
                  }
                  className={`flex h-11 min-w-12 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border-muted bg-surface text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Stock */}
      <p className="mt-4 text-sm text-muted">
        {stock > 0
          ? `В наявності: ${stock} шт.`
          : "Немає в наявності"}
      </p>

      {/* Quantity + Cart */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="glass-control flex h-13 items-center justify-between px-2">
          <button
            type="button"
            onClick={
              decreaseQuantity
            }
            disabled={
              quantity <= 1
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Зменшити кількість"
          >
            <Minus
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>

          <span className="min-w-10 text-center font-medium text-foreground">
            {quantity}
          </span>

          <button
            type="button"
            onClick={
              increaseQuantity
            }
            disabled={
              stock === 0 ||
              quantity >= stock
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Збільшити кількість"
          >
            <Plus
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={
            handleAddToCart
          }
          disabled={
            !selectedVariant ||
            stock === 0
          }
          className="flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-hover px-7 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag
            className="h-5 w-5"
            strokeWidth={1.8}
          />

          {added
            ? "Додано до кошика ✓"
            : "Додати до кошика"}
        </button>
      </div>
    </div>
  );
}