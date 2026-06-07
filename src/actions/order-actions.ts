"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { checkoutSchema } from "@/lib/validations";
import { canBypassPayment, generateMidtransOrderId, isMidtransConfigured } from "@/lib/midtrans";
import { logOrderStatusChange } from "@/lib/audit-log";
import { createNotification } from "@/lib/notifications";
import { isRestaurantOpen } from "@/lib/restaurant-hours";
import { orderStatusLabels } from "@/lib/order-status";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { headers } from "next/headers";

interface CartItemInput {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

async function getClientIp() {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function createOrder(
  input: { deliveryAddress: string; notes?: string },
  cartItems: CartItemInput[],
) {
  const session = await requireAuth();
  const ip = await getClientIp();
  const rate = checkRateLimit(getRateLimitKey("checkout", `${session.user.id}:${ip}`), 10, 60_000);
  if (!rate.success) {
    return { error: "Terlalu banyak percobaan checkout. Coba lagi nanti." };
  }

  const restaurant = await isRestaurantOpen();
  if (!restaurant.open) {
    return { error: restaurant.reason ?? "Restoran sedang tutup" };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  if (cartItems.length === 0) {
    return { error: "Keranjang masih kosong" };
  }

  const menuItemIds = cartItems.map((item) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: menuItemIds },
      isAvailable: true,
    },
  });

  if (menuItems.length !== cartItems.length) {
    return { error: "Beberapa menu tidak tersedia" };
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const midtransOrderId = generateMidtransOrderId();

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      totalAmount,
      deliveryAddress: parsed.data.deliveryAddress,
      notes: parsed.data.notes,
      midtransOrderId,
      items: {
        create: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      },
      statusLogs: {
        create: {
          fromStatus: null,
          toStatus: OrderStatus.PENDING,
          changedBy: session.user.id,
          note: "Pesanan dibuat",
        },
      },
    },
  });

  await createNotification(
    session.user.id,
    "Pesanan Dibuat",
    `Pesanan #${order.id.slice(-6).toUpperCase()} menunggu pembayaran.`,
  );

  if (!isMidtransConfigured()) {
    if (!canBypassPayment()) {
      return {
        error:
          "Midtrans belum dikonfigurasi. Set ALLOW_DEV_PAYMENT_BYPASS=true untuk development.",
      };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paymentStatus: PaymentStatus.PAID,
      },
    });

    await logOrderStatusChange({
      orderId: order.id,
      fromStatus: OrderStatus.PENDING,
      toStatus: OrderStatus.PAID,
      changedBy: session.user.id,
      note: "Dev bypass payment",
    });

    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    return {
      success: true,
      orderId: order.id,
      skipPayment: true,
    };
  }

  revalidatePath("/orders");

  return {
    success: true,
    orderId: order.id,
    midtransOrderId,
  };
}

export async function cancelOrder(orderId: string) {
  const session = await requireAuth();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) {
    return { error: "Pesanan tidak ditemukan" };
  }

  if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAID) {
    return { error: "Pesanan tidak bisa dibatalkan pada status ini" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCELLED,
      paymentStatus:
        order.paymentStatus === PaymentStatus.PAID
          ? PaymentStatus.PAID
          : PaymentStatus.FAILED,
    },
  });

  await logOrderStatusChange({
    orderId,
    fromStatus: order.status,
    toStatus: OrderStatus.CANCELLED,
    changedBy: session.user.id,
    note: "Dibatalkan pelanggan",
  });

  await createNotification(
    session.user.id,
    "Pesanan Dibatalkan",
    `Pesanan #${orderId.slice(-6).toUpperCase()} telah dibatalkan.`,
  );

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/orders");

  return { success: true };
}

export async function getUserOrders() {
  const session = await requireAuth();

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(orderId: string) {
  const session = await requireAuth();

  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          menuItem: true,
        },
      },
      statusLogs: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getOrderStatus(orderId: string) {
  const session = await requireAuth();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      updatedAt: true,
    },
  });

  if (!order) return null;

  return {
    ...order,
    statusLabel: orderStatusLabels[order.status],
  };
}
