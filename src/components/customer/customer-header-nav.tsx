"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Menu", exact: true },
  { href: "/orders", label: "Pesanan", exact: false },
  { href: "/cart", label: "Keranjang", exact: false },
];

export function CustomerHeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 rounded-full bg-muted/60 p-1 md:flex">
      {navLinks.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
