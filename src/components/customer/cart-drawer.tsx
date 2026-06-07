"use client";

import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuImage } from "@/components/customer/menu-image";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-white p-1 shadow-sm ring-1 ring-black/6">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Kurangi jumlah"
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-95"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Tambah jumlah"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-brand-dark active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="relative border-b border-border/60 px-5 py-4">
          <SheetClose className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </SheetClose>
          <SheetTitle className="text-left text-lg font-bold tracking-tight text-brand-dark">
            Keranjang
          </SheetTitle>
          {items.length > 0 && (
            <p className="text-left text-sm text-muted-foreground">
              {totalItems} item · {items.length} menu
            </p>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light text-primary/40">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="font-semibold text-foreground">Keranjang masih kosong</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan menu favoritmu untuk mulai pesan
            </p>
            <Link href="/" onClick={() => onOpenChange(false)} className="mt-6">
              <Button className="rounded-full bg-primary px-8 shadow-sm shadow-primary/20 hover:bg-brand-dark">
                Pesan Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {items.map((item) => {
                const subtotal = item.price * item.quantity;

                return (
                  <article
                    key={item.menuItemId}
                    className="surface-card overflow-hidden rounded-2xl p-3.5"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-brand-light">
                        <MenuImage
                          src={item.imageUrl}
                          alt={item.name}
                          sizes="72px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-semibold leading-snug text-foreground">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {formatCurrency(item.price)} / porsi
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.menuItemId)}
                            aria-label={`Hapus ${item.name}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100 active:scale-95"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <QuantityStepper
                            quantity={item.quantity}
                            onDecrease={() =>
                              updateQuantity(item.menuItemId, item.quantity - 1)
                            }
                            onIncrease={() =>
                              updateQuantity(item.menuItemId, item.quantity + 1)
                            }
                          />
                          <p className="text-sm font-bold tabular-nums text-primary">
                            {formatCurrency(subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <SheetFooter className="mt-0 border-t border-border/60 bg-white/95 px-4 py-4 backdrop-blur-sm">
              <div className="w-full space-y-3">
                <div className="space-y-2 rounded-2xl bg-muted/50 px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="tabular-nums">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold tabular-nums text-primary">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => onOpenChange(false)} className="block">
                  <Button
                    className={cn(
                      "h-12 w-full rounded-xl bg-primary text-base font-semibold",
                      "shadow-md shadow-primary/25 hover:bg-brand-dark active:scale-[0.99]",
                    )}
                  >
                    Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => onOpenChange(false)}
                  className="block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Lihat detail keranjang
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
