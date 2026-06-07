"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartBadge } from "@/components/customer/cart-badge";
import { CartDrawer } from "@/components/customer/cart-drawer";
import { NotificationBell } from "@/components/customer/notification-bell";
import { formatCurrency } from "@/lib/format";
import { useCartHydrated, useCartStore } from "@/stores/cart-store";

interface HeaderActionsProps {
  notificationCount: number;
  isLoggedIn: boolean;
}

export function HeaderActions({ notificationCount, isLoggedIn }: HeaderActionsProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const hydrated = useCartHydrated();
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const displayPrice = hydrated ? totalPrice : 0;

  return (
    <>
      {isLoggedIn && <NotificationBell initialCount={notificationCount} />}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="relative flex items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-brand-dark active:scale-[0.98]"
      >
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">{formatCurrency(displayPrice)}</span>
        <CartBadge />
      </button>
      <Link href="/cart" className="hidden lg:inline-flex">
        <Button variant="outline" size="sm" className="rounded-full">
          Keranjang
        </Button>
      </Link>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
