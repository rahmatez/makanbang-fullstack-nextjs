import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="surface-card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand-dark">
          Pembayaran Berhasil
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pesananmu sedang diproses. Terima kasih sudah memesan di MakanBang.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button className="h-11 w-full rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark">
                Lihat Detail Pesanan
              </Button>
            </Link>
          )}
          <Link href="/orders">
            <Button variant="outline" className="h-11 w-full rounded-xl">
              Ke Daftar Pesanan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
