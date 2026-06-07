import { OrderStatus, PaymentStatus } from "@prisma/client";

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Dibayar",
  PREPARING: "Sedang Dimasak",
  READY: "Siap Diantar",
  DELIVERED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Menunggu",
  PAID: "Lunas",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PREPARING: "bg-amber-100 text-amber-800",
  READY: "bg-emerald-100 text-emerald-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const adminOrderStatuses: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
