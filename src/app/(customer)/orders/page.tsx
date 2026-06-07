import Link from "next/link";
import { Package } from "lucide-react";
import { getUserOrders } from "@/actions/order-actions";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { EmptyState } from "@/components/customer/empty-state";
import { PageHeader } from "@/components/customer/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Riwayat"
        title="Pesanan Saya"
        description="Lacak status pesanan kamu"
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-16 w-16" />}
          title="Belum ada pesanan"
          description="Pesan menu favoritmu dan lacak statusnya di sini."
          actionLabel="Pesan Sekarang"
          actionHref="/"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="surface-card border-0 shadow-none transition-all hover:shadow-md">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-semibold">
                      {order.items
                        .map(
                          (item) =>
                            `${item.quantity}x ${item.menuItem.name}`,
                        )
                        .join(", ")}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(Number(order.totalAmount))}
                  </span>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
