"use client";

import { useCartHydrated, useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

export function CartBadge() {
  const hydrated = useCartHydrated();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartPulse = useCartStore((state) => state.cartPulse);

  if (!hydrated || totalItems === 0) return null;

  return (
    <span
      key={cartPulse}
      className={cn(
        "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-dark text-[10px] font-bold text-white",
        cartPulse > 0 && "animate-bounce",
      )}
    >
      {totalItems}
    </span>
  );
}
