import { Badge } from "@/components/ui/badge";
import {
  orderStatusColors,
  orderStatusLabels,
} from "@/lib/order-status";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", orderStatusColors[status], className)}
    >
      {orderStatusLabels[status]}
    </Badge>
  );
}
