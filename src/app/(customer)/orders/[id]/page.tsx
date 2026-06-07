import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/order-actions";
import { OrderStatusPoller } from "@/components/customer/order-status-poller";
import { CancelOrderButton } from "@/components/customer/cancel-order-button";
import { PayOrderButton } from "@/components/customer/pay-order-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { isMidtransConfigured } from "@/lib/midtrans";
import { paymentStatusLabels, orderStatusLabels } from "@/lib/order-status";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const canCancel =
    order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID;

  const canPay =
    order.status === OrderStatus.PENDING &&
    order.paymentStatus === PaymentStatus.PENDING &&
    isMidtransConfigured();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detail Pesanan</h1>
          <p className="text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusPoller orderId={order.id} initialStatus={order.status} />
      </div>

      {canPay && (
        <Card className="surface-card border-0 shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">Menunggu Pembayaran</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Selesaikan pembayaran{" "}
                <span className="font-medium text-primary">
                  {formatCurrency(Number(order.totalAmount))}
                </span>{" "}
                untuk memproses pesananmu.
              </p>
            </div>
            <PayOrderButton orderId={order.id} />
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div>
            <p className="text-sm text-slate-500">Alamat Pengiriman</p>
            <p className="font-medium">{order.deliveryAddress}</p>
          </div>
          {order.notes && (
            <div>
              <p className="text-sm text-slate-500">Catatan</p>
              <p>{order.notes}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500">Status Pembayaran</p>
            <p className="font-medium">{paymentStatusLabels[order.paymentStatus]}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-3 p-6">
          <h2 className="font-semibold">Item Pesanan</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>
                {item.quantity}x {item.menuItem.name}
              </span>
              <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(Number(order.totalAmount))}</span>
          </div>
        </CardContent>
      </Card>

      {order.statusLogs.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-semibold">Riwayat Status</h2>
            {order.statusLogs.map((log) => (
              <div key={log.id} className="flex justify-between text-sm">
                <span>
                  {log.fromStatus ? orderStatusLabels[log.fromStatus] : "Baru"} →{" "}
                  {orderStatusLabels[log.toStatus]}
                </span>
                <span className="text-slate-400">{formatDate(log.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        {canCancel && <CancelOrderButton orderId={order.id} />}
        <Link href="/orders">
          <Button variant="outline">Kembali ke Pesanan</Button>
        </Link>
      </div>
    </div>
  );
}
