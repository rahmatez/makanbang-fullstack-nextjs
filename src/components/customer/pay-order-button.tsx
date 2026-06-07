"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { openSnapPayment } from "@/lib/snap-client";

interface PayOrderButtonProps {
  orderId: string;
}

export function PayOrderButton({ orderId }: PayOrderButtonProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  async function handlePay() {
    setIsPaying(true);

    try {
      await openSnapPayment(orderId, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          router.push(`/payment/success?orderId=${orderId}`);
          router.refresh();
        },
        onPending: () => {
          toast.info("Menunggu konfirmasi pembayaran...");
          router.refresh();
        },
        onError: () => {
          toast.error("Pembayaran gagal");
          router.push(`/payment/failure?orderId=${orderId}`);
        },
        onClose: () => {
          toast.info("Pembayaran dibatalkan. Kamu bisa bayar lagi kapan saja.");
          router.refresh();
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuka pembayaran");
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <Button
      onClick={handlePay}
      disabled={isPaying}
      className="h-11 rounded-xl bg-primary shadow-sm shadow-primary/20 hover:bg-brand-dark"
    >
      {isPaying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Membuka pembayaran...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Bayar Sekarang
        </>
      )}
    </Button>
  );
}
