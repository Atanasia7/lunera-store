"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import { useStorageIdentity } from "@/components/StorageIdentityProvider";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  size: string;
  color: string;
  stock: number;
  quantity: number;
};

type AddCartItem = Omit<
  CartItem,
  "quantity"
> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  hydrated: boolean;

  addItem: (
    item: AddCartItem,
  ) => void;

  removeItem: (
    variantId: string,
  ) => void;

  setQuantity: (
    variantId: string,
    quantity: number,
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextValue | null>(
    null,
  );

const EMPTY_SNAPSHOT = "[]";
const CHANGE_EVENT =
  "lunera-cart-change";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ownerKey =
    useStorageIdentity();

  const storageKey = ownerKey
    ? `lunera-cart:${ownerKey}`
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
        ? (parsed as CartItem[])
        : [];
    } catch {
      return [];
    }
  }, [snapshot]);

  function saveCart(
    nextItems: CartItem[],
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

  function addItem(
    item: AddCartItem,
  ) {
    const quantity =
      item.quantity ?? 1;

    const existing =
      items.find(
        (currentItem) =>
          currentItem.variantId ===
          item.variantId,
      );

    if (existing) {
      saveCart(
        items.map(
          (currentItem) =>
            currentItem.variantId ===
            item.variantId
              ? {
                  ...currentItem,

                  quantity:
                    Math.min(
                      currentItem.stock,
                      currentItem.quantity +
                        quantity,
                    ),
                }
              : currentItem,
        ),
      );

      return;
    }

    saveCart([
      ...items,
      {
        ...item,

        quantity:
          Math.min(
            item.stock,
            quantity,
          ),
      },
    ]);
  }

  function removeItem(
    variantId: string,
  ) {
    saveCart(
      items.filter(
        (item) =>
          item.variantId !==
          variantId,
      ),
    );
  }

  function setQuantity(
    variantId: string,
    quantity: number,
  ) {
    saveCart(
      items.map((item) =>
        item.variantId ===
        variantId
          ? {
              ...item,

              quantity:
                Math.max(
                  1,
                  Math.min(
                    item.stock,
                    quantity,
                  ),
                ),
            }
          : item,
      ),
    );
  }

  function clearCart() {
    saveCart([]);
  }

  const totalItems =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0,
    );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,

        hydrated:
          ownerKey !== null,

        addItem,
        removeItem,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}