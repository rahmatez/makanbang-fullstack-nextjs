"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrderStatus } from "@/actions/order-actions";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

interface OrderStatusPollerProps {
  orderId: string;
  initialStatus: OrderStatus;
}

export function OrderStatusPoller({
  orderId,
  initialStatus,
}: OrderStatusPollerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getOrderStatus(orderId);
      if (!result) return;

      setStatus((current) => {
        if (result.status !== current) {
          toast.info(`Status pesanan: ${result.statusLabel}`);
          router.refresh();
          return result.status;
        }
        return current;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  return <OrderStatusBadge status={status} />;
}
