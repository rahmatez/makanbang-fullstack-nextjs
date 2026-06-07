import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function logOrderStatusChange(params: {
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  changedBy?: string;
  note?: string;
}) {
  await prisma.orderStatusLog.create({
    data: {
      orderId: params.orderId,
      fromStatus: params.fromStatus,
      toStatus: params.toStatus,
      changedBy: params.changedBy,
      note: params.note,
    },
  });
}
