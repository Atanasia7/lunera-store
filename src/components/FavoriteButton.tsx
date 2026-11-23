"use client";

import { Heart } from "lucide-react";

import {
  useFavorites,
} from "@/components/FavoritesProvider";

import type {
  FavoriteItem,
} from "@/components/FavoritesProvider";

type FavoriteButtonProps = {
  product: FavoriteItem;
  className?: string;
};

export default function FavoriteButton({
  product,
  className = "",
}: FavoriteButtonProps) {
  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const active =
    isFavorite(product.id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        toggleFavorite(product);
      }}
      className={className}
      aria-label={
        active
          ? "Видалити з обраного"
          : "Додати в обране"
      }
      title={
        active
          ? "Видалити з обраного"
          : "Додати в обране"
      }
    >
      <Heart
        className={`h-5 w-5 transition ${
          active
            ? "fill-accent text-accent"
            : "text-foreground"
        }`}
        strokeWidth={1.8}
      />
    </button>
  );
}