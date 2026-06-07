"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { updateOrderStatus } from "@/actions/admin-actions";
import { adminOrderStatuses, orderStatusLabels } from "@/lib/order-status";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatus } from "@prisma/client";

interface AdminOrdersTableProps {
  orders: Array<{
    id: string;
    status: OrderStatus;
    totalAmount: number;
    deliveryAddress: string;
    createdAt: Date;
    user: { name: string; email: string };
    items: Array<{
      quantity: number;
      menuItem: { name: string };
    }>;
  }>;
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(orderId: string, status: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) toast.error(result.error);
      else toast.success("Status pesanan diperbarui");
    });
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm dark:bg-slate-900">
        <p className="text-slate-500">Belum ada pesanan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Menu</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{order.user.name}</p>
                  <p className="text-xs text-slate-500">{order.user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs text-sm text-slate-600">
                  {order.items.map((item) => `${item.quantity}x ${item.menuItem.name}`).join(", ")}
                </div>
              </TableCell>
              <TableCell>{formatCurrency(Number(order.totalAmount))}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(order.id, value as OrderStatus)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adminOrderStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {orderStatusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
