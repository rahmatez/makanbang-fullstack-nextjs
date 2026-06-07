"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  Settings,
  Home,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Pesanan", icon: ClipboardList },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

interface AdminSidebarProps {
  signOutAction: () => Promise<void>;
}

export function AdminSidebar({ signOutAction }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white dark:bg-slate-950 md:flex md:flex-col">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-bold text-white">
            MB
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">MakanBang</p>
            <p className="text-xs text-slate-500">Panel Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-light text-brand-dark"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t p-4">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Ke Situs Pelanggan
          </Button>
        </Link>
        <form action={signOutAction}>
          <Button
            variant="ghost"
            type="submit"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </form>
      </div>
    </aside>
  );
}
