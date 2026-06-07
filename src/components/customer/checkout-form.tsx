"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckoutSteps } from "@/components/customer/checkout-steps";
import { EmptyState } from "@/components/customer/empty-state";
import { MenuImage } from "@/components/customer/menu-image";
import { formatCurrency } from "@/lib/format";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartHydrated, useCartStore } from "@/stores/cart-store";
import { createOrder } from "@/actions/order-actions";
import { loadSnapScript, requestSnapToken } from "@/lib/snap-client";

export function CheckoutForm({ defaultAddress }: { defaultAddress?: string }) {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: defaultAddress ?? "",
      notes: "",
    },
  });

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-16 w-16" />}
        title="Keranjang masih kosong"
        description="Tambahkan menu favoritmu sebelum checkout."
        actionLabel="Lihat Menu"
        actionHref="/"
      />
    );
  }

  async function onSubmit(data: CheckoutInput) {
    setError(null);
    setIsProcessing(true);

    try {
      const result = await createOrder(data, items);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.skipPayment) {
        clearCart();
        toast.success("Pesanan berhasil dibuat!");
        router.push(`/payment/success?orderId=${result.orderId}`);
        return;
      }

      if (result.orderId) {
        const snapData = await requestSnapToken(result.orderId);

        await loadSnapScript(snapData.clientKey);
        window.snap?.pay(snapData.snapToken, {
          onSuccess: () => {
            clearCart();
            router.push(`/payment/success?orderId=${result.orderId}`);
          },
          onPending: () => {
            toast.info("Menunggu pembayaran...");
            router.push(`/orders/${result.orderId}`);
          },
          onError: () => {
            toast.error("Pembayaran gagal");
            router.push(`/payment/failure?orderId=${result.orderId}`);
          },
          onClose: () => {
            toast.info("Pembayaran dibatalkan");
            router.push(`/orders/${result.orderId}`);
          },
        });
      }
    } catch (snapError) {
      setError(snapError instanceof Error ? snapError.message : "Gagal memproses pesanan");
    } finally {
      setIsProcessing(false);
    }
  }

  const isBusy = isSubmitting || isProcessing;

  return (
    <div className="space-y-6">
      <CheckoutSteps currentStep={2} />

      <div className="grid gap-6 lg:grid-cols-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:col-span-3">
          <Card className="surface-card border-0 shadow-none">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold tracking-tight">Detail Pengiriman</h2>
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Alamat Pengiriman</Label>
                <textarea
                  id="deliveryAddress"
                  rows={4}
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  {...register("deliveryAddress")}
                />
                {errors.deliveryAddress && (
                  <p className="text-sm text-red-600">{errors.deliveryAddress.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (opsional)</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Contoh: pedas level 2"
                  className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <Button type="submit" className="h-12 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark" disabled={isBusy}>
            {isBusy ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </form>

        <Card className="surface-card h-fit border-0 shadow-none lg:col-span-2">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold tracking-tight">Ringkasan Pesanan</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.menuItemId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-brand-light">
                    <MenuImage
                      src={item.imageUrl}
                      alt={item.name}
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CartPageClient() {
  const hydrated = useCartHydrated();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-16 w-16" />}
        title="Keranjang masih kosong"
        description="Tambahkan menu favoritmu sebelum checkout."
        actionLabel="Lihat Menu"
        actionHref="/"
      />
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <CheckoutSteps currentStep={1} />

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.menuItemId} className="surface-card border-0 shadow-none">
            <CardContent className="flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-brand-light">
                <MenuImage
                  src={item.imageUrl}
                  alt={item.name}
                  sizes="96px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary">{formatCurrency(item.price)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.menuItemId)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-card hidden border-0 shadow-none lg:block">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(getTotalPrice())}</span>
          </div>
          <Link href="/checkout">
            <Button className="h-12 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
              Lanjut Checkout
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border/60 bg-white/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(getTotalPrice())}</p>
          </div>
          <Link href="/checkout" className="flex-1">
            <Button className="h-12 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
              Lanjut Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
