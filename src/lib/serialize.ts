export function serializeAdminOrders<
  T extends {
    id: string;
    status: import("@prisma/client").OrderStatus;
    totalAmount: unknown;
    deliveryAddress: string;
    createdAt: Date;
    user: { name: string; email: string };
    items: Array<{
      quantity: number;
      unitPrice?: unknown;
      menuItem: { name: string; price?: unknown };
    }>;
  },
>(orders: T[]) {
  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt,
    user: order.user,
    items: order.items.map((item) => ({
      quantity: item.quantity,
      menuItem: { name: item.menuItem.name },
    })),
  }));
}
