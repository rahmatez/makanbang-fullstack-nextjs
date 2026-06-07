"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  cartPulse: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartPulse: 0,
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.menuItemId === item.menuItemId,
          );

          if (existing) {
            return {
              cartPulse: Date.now(),
              items: state.items.map((cartItem) =>
                cartItem.menuItemId === item.menuItemId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem,
              ),
            };
          }

          return {
            cartPulse: Date.now(),
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItemId !== menuItemId),
        }));
      },
      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
    }),
    {
      name: "makan-bang-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/** Wait for localStorage rehydration before rendering cart UI (avoids SSR mismatch). */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useCartStore.persist.hasHydrated());

    return useCartStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}
