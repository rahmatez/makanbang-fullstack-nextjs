"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MenuImage } from "@/components/customer/menu-image";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

export function MenuCard({
  id,
  name,
  description,
  price,
  imageUrl,
  isAvailable,
}: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!isAvailable || isAdding) return;

    setIsAdding(true);
    addItem({
      menuItemId: id,
      name,
      price,
      imageUrl,
    });

    toast.success(`${name} ditambahkan`);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <article className="group surface-card surface-card-hover flex h-full flex-col overflow-hidden">
      <div className="relative aspect-4/3 overflow-hidden bg-brand-light">
        <MenuImage
          src={imageUrl}
          alt={name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-brand-dark shadow-sm backdrop-blur-sm">
            {formatCurrency(price)}
          </span>
        </div>
        {!isAvailable && (
          <Badge className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 hover:bg-red-500/90">
            Habis
          </Badge>
        )}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!isAvailable || isAdding}
          aria-label={`Tambah ${name}`}
          className={cn(
            "absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all",
            "hover:scale-105 hover:bg-brand-dark active:scale-95 disabled:opacity-50",
          )}
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug tracking-tight text-foreground">{name}</h3>
        {description && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <Button
          onClick={handleAdd}
          disabled={!isAvailable || isAdding}
          className="mt-4 h-10 w-full rounded-xl bg-primary font-medium hover:bg-brand-dark disabled:opacity-60"
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menambahkan...
            </>
          ) : (
            "Pesan Yuk"
          )}
        </Button>
      </div>
    </article>
  );
}
