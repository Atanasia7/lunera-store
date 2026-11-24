"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { useStorageIdentity } from "@/components/StorageIdentityProvider";

export type FavoriteItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  colors?: string[];
};

type FavoritesContextValue = {
  items: FavoriteItem[];
  totalFavorites: number;

  isFavorite: (
    productId: string,
  ) => boolean;

  toggleFavorite: (
    product: FavoriteItem,
  ) => void;

  clearFavorites: () => void;
};

const FavoritesContext =
  createContext<FavoritesContextValue | null>(
    null,
  );

const EMPTY_SNAPSHOT = "[]";

const CHANGE_EVENT =
  "lunera-favorites-change";

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ownerKey =
    useStorageIdentity();

  const storageKey = ownerKey
    ? `lunera-favorites:${ownerKey}`
    : null;

  const snapshot =
    useSyncExternalStore(
      (callback) => {
        window.addEventListener(
          "storage",
          callback,
        );

        window.addEventListener(
          CHANGE_EVENT,
          callback,
        );

        return () => {
          window.removeEventListener(
            "storage",
            callback,
          );

          window.removeEventListener(
            CHANGE_EVENT,
            callback,
          );
        };
      },

      () =>
        storageKey
          ? localStorage.getItem(
              storageKey,
            ) ?? EMPTY_SNAPSHOT
          : EMPTY_SNAPSHOT,

      () => EMPTY_SNAPSHOT,
    );

  const items = useMemo(() => {
    try {
      const parsed =
        JSON.parse(snapshot);

      return Array.isArray(parsed)
        ? (parsed as FavoriteItem[])
        : [];
    } catch {
      return [];
    }
  }, [snapshot]);

  function saveFavorites(
    nextItems: FavoriteItem[],
  ) {
    if (!storageKey) {
      return;
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(nextItems),
    );

    window.dispatchEvent(
      new Event(CHANGE_EVENT),
    );
  }

  function isFavorite(
    productId: string,
  ) {
    return items.some(
      (item) =>
        item.id === productId,
    );
  }

  function toggleFavorite(
    product: FavoriteItem,
  ) {
    if (
      isFavorite(product.id)
    ) {
      saveFavorites(
        items.filter(
          (item) =>
            item.id !== product.id,
        ),
      );

      return;
    }

    saveFavorites([
      ...items,
      product,
    ]);
  }

  function clearFavorites() {
    saveFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,

        totalFavorites:
          items.length,

        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(
      FavoritesContext,
    );

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider",
    );
  }

  return context;
}