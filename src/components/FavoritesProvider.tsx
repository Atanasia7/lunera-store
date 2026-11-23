"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

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

const STORAGE_KEY =
  "lunera-favorites";

const CHANGE_EVENT =
  "lunera-favorites-change";

const EMPTY_SNAPSHOT = "[]";

function subscribe(
  callback: () => void,
) {
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
}

function getSnapshot() {
  return (
    localStorage.getItem(
      STORAGE_KEY,
    ) ?? EMPTY_SNAPSHOT
  );
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function saveFavorites(
  items: FavoriteItem[],
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  );

  window.dispatchEvent(
    new Event(CHANGE_EVENT),
  );
}

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshot =
    useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot,
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
    const exists =
      items.some(
        (item) =>
          item.id === product.id,
      );

    if (exists) {
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