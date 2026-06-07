import { prisma } from "@/lib/prisma";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
) {
  return prisma.notification.create({
    data: { userId, title, message },
  });
}

export async function notifyOrderStatusChange(
  userId: string,
  orderId: string,
  statusLabel: string,
) {
  return createNotification(
    userId,
    "Status Pesanan Diperbarui",
    `Pesanan #${orderId.slice(-6).toUpperCase()} sekarang: ${statusLabel}`,
  );
}
