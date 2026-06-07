import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand-dark">
          Pembayaran Gagal
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pembayaran tidak berhasil. Silakan coba lagi atau hubungi support.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/checkout">
            <Button className="h-11 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
              Coba Lagi
            </Button>
          </Link>
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button variant="outline" className="h-11 w-full rounded-xl">
                Lihat Pesanan
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
