"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";

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

type AddCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  hydrated: boolean;

  addItem: (item: AddCartItem) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (
    variantId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const CartContext =
  createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lunera-cart";

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart =
      localStorage.getItem(STORAGE_KEY);

    if (!savedCart) {
      return [];
    }

    const parsed = JSON.parse(savedCart);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function subscribeToHydration() {
  return () => {};
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] =
    useState<CartItem[]>(getInitialCart);

  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  function saveCart(nextItems: CartItem[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(nextItems),
      );
    }

    return nextItems;
  }

  function addItem(item: AddCartItem) {
    setItems((currentItems) => {
      const quantity =
        item.quantity ?? 1;

      const existing =
        currentItems.find(
          (currentItem) =>
            currentItem.variantId ===
            item.variantId,
        );

      if (existing) {
        const nextItems =
          currentItems.map(
            (currentItem) => {
              if (
                currentItem.variantId !==
                item.variantId
              ) {
                return currentItem;
              }

              return {
                ...currentItem,

                quantity: Math.min(
                  currentItem.stock,
                  currentItem.quantity +
                    quantity,
                ),
              };
            },
          );

        return saveCart(nextItems);
      }

      const nextItems = [
        ...currentItems,
        {
          ...item,
          quantity: Math.min(
            item.stock,
            quantity,
          ),
        },
      ];

      return saveCart(nextItems);
    });
  }

  function removeItem(variantId: string) {
    setItems((currentItems) => {
      const nextItems =
        currentItems.filter(
          (item) =>
            item.variantId !== variantId,
        );

      return saveCart(nextItems);
    });
  }

  function setQuantity(
    variantId: string,
    quantity: number,
  ) {
    setItems((currentItems) => {
      const nextItems =
        currentItems.map((item) => {
          if (
            item.variantId !== variantId
          ) {
            return item;
          }

          return {
            ...item,

            quantity: Math.max(
              1,
              Math.min(
                item.stock,
                quantity,
              ),
            ),
          };
        });

      return saveCart(nextItems);
    });
  }

  function clearCart() {
    setItems(() => saveCart([]));
  }

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        hydrated,
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