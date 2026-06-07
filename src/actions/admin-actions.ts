"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import {
  categorySchema,
  menuItemSchema,
  restaurantSettingsSchema,
  type CategoryInput,
  type MenuItemInput,
} from "@/lib/validations";
import { logOrderStatusChange } from "@/lib/audit-log";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { orderStatusLabels } from "@/lib/order-status";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getDashboardStats() {
  await requireAdmin();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrders, pendingOrders, totalRevenue, totalMenuItems] =
    await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.READY],
          },
        },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: today },
        },
        _sum: { totalAmount: true },
      }),
      prisma.menuItem.count(),
    ]);

  return {
    todayOrders,
    pendingOrders,
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    totalMenuItems,
  };
}

export async function getWeeklyReport() {
  await requireAdmin();

  const days: Array<{ label: string; orders: number; revenue: number }> = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const [orders, revenue] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: date, lt: nextDate } },
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: date, lt: nextDate },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    days.push({
      label: date.toLocaleDateString("id-ID", { weekday: "short" }),
      orders,
      revenue: Number(revenue._sum.totalAmount ?? 0),
    });
  }

  return days;
}

export async function getAdminOrders() {
  await requireAdmin();

  return prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    return { error: "Pesanan tidak ditemukan" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  await logOrderStatusChange({
    orderId,
    fromStatus: order.status,
    toStatus: status,
    changedBy: session.user.id,
    note: "Diperbarui admin",
  });

  await notifyOrderStatusChange(
    order.userId,
    orderId,
    orderStatusLabels[status],
  );

  revalidatePath("/admin/orders");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}

export async function getCategoriesWithItems() {
  return prisma.category.findMany({
    include: {
      menuItems: {
        orderBy: { name: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createCategory(input: CategoryInput) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    return { error: "Kategori masih memiliki menu. Hapus atau pindahkan menu dulu." };
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function createMenuItem(input: MenuItemInput) {
  await requireAdmin();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.menuItem.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl || null,
      categoryId: parsed.data.categoryId,
      isAvailable: parsed.data.isAvailable,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function updateMenuItem(id: string, input: MenuItemInput) {
  await requireAdmin();

  const parsed = menuItemSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      imageUrl: parsed.data.imageUrl || null,
      categoryId: parsed.data.categoryId,
      isAvailable: parsed.data.isAvailable,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function toggleMenuAvailability(id: string, isAvailable: boolean) {
  await requireAdmin();

  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();

  await prisma.menuItem.delete({ where: { id } });

  revalidatePath("/admin/menu");
  revalidatePath("/");

  return { success: true };
}

export async function getRestaurantSettingsAdmin() {
  await requireAdmin();
  return prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {},
  });
}

export async function updateRestaurantSettings(input: unknown) {
  await requireAdmin();

  const parsed = restaurantSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  await prisma.restaurantSettings.upsert({
    where: { id: "default" },
    update: parsed.data,
    create: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true };
}
