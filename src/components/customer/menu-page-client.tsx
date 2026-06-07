"use client";

import { useMemo, useState } from "react";
import { Clock, Search, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MenuCard } from "@/components/customer/menu-card";
import { CategoryFilter } from "@/components/customer/category-filter";

interface MenuPageClientProps {
  categories: Array<{
    id: string;
    name: string;
    menuItems: Array<{
      id: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      isAvailable: boolean;
    }>;
  }>;
  closedMessage?: string | null;
}

export function MenuPageClient({ categories, closedMessage }: MenuPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCategories = selectedCategory
    ? categories.filter((category) => category.id === selectedCategory)
    : categories;

  const allItems = useMemo(() => {
    const items = filteredCategories.flatMap((category) => category.menuItems);
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query),
    );
  }, [filteredCategories, search]);

  const totalItems = categories.reduce((sum, cat) => sum + cat.menuItems.length, 0);

  return (
    <div className="space-y-8 md:space-y-12">
      <section className="hero-mesh relative overflow-hidden rounded-3xl px-6 py-10 text-white md:px-10 md:py-14">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5" />
                Fresh daily
              </span>
              <span className="chip">
                <Star className="h-3.5 w-3.5 fill-current" />
                4.9 rating
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl">
              Sajian khas Indonesia,
              <span className="block text-white/85">praktis & higienis.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              Pilih dari {totalItems}+ menu favorit, pesan online, dan nikmati cita rasa autentik
              tanpa repot.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                20–30 menit
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Pembayaran aman
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="surface-card rounded-2xl p-1.5 shadow-2xl shadow-black/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nasi goreng, mie ayam..."
                  className="h-12 rounded-xl border-0 bg-white pl-11 text-foreground shadow-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-white/60 lg:text-left">
              Ketik nama menu untuk filter cepat
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
      </section>

      {closedMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3.5 text-sm text-red-700 backdrop-blur-sm">
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
          {closedMessage}
        </div>
      )}

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Katalog</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Menu Favorit
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {allItems.length} menu tersedia
              {selectedCategory
                ? ` · ${categories.find((c) => c.id === selectedCategory)?.name}`
                : ""}
            </p>
          </div>
        </div>

        <CategoryFilter
          categories={categories.map(({ id, name }) => ({ id, name }))}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {allItems.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-white/60 px-6 py-20 text-center backdrop-blur-sm">
            <Search className="mb-4 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-foreground">Menu tidak ditemukan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allItems.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
                isAvailable={item.isAvailable}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
