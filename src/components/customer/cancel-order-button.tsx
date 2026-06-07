"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/actions/order-actions";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    if (!confirm("Batalkan pesanan ini?")) return;

    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Pesanan dibatalkan");
        router.refresh();
      }
    });
  }

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={isPending}>
      Batalkan Pesanan
    </Button>
  );
}
