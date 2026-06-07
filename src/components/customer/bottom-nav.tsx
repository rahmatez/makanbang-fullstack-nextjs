"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, ShoppingCart, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartHydrated, useCartStore } from "@/stores/cart-store";

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const hydrated = useCartHydrated();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const navItems = [
    { href: "/", label: "Menu", icon: Home },
    { href: "/cart", label: "Keranjang", icon: ShoppingCart },
    { href: "/orders", label: "Pesanan", icon: ClipboardList },
    {
      href: session?.user ? "/profile" : "/auth/login",
      label: session?.user ? "Profil" : "Masuk",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:scale-95",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              </span>
              {item.label}
              {item.href === "/cart" && hydrated && totalItems > 0 && (
                <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
