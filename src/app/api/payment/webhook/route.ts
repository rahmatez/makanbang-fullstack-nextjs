import { prisma } from "@/lib/prisma";
import {
  isFraudAcceptable,
  type MidtransNotification,
  verifyMidtransSignature,
} from "@/lib/midtrans";
import { logOrderStatusChange } from "@/lib/audit-log";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { orderStatusLabels } from "@/lib/order-status";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function mapPaymentStatus(
  transactionStatus: string,
  fraudStatus?: string,
): {
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
} | null {
  if (!isFraudAcceptable(fraudStatus)) {
    return {
      paymentStatus: PaymentStatus.FAILED,
      orderStatus: OrderStatus.CANCELLED,
    };
  }

  switch (transactionStatus) {
    case "capture":
    case "settlement":
      return {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PAID,
      };
    case "pending":
      return {
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING,
      };
    case "deny":
    case "cancel":
      return {
        paymentStatus: PaymentStatus.FAILED,
        orderStatus: OrderStatus.CANCELLED,
      };
    case "expire":
      return {
        paymentStatus: PaymentStatus.EXPIRED,
        orderStatus: OrderStatus.CANCELLED,
      };
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(getRateLimitKey("webhook", ip), 60, 60_000);

  if (!rate.success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  try {
    const body = (await request.json()) as MidtransNotification;

    if (!verifyMidtransSignature(body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const mapped = mapPaymentStatus(
      body.transaction_status,
      body.fraud_status,
    );

    if (!mapped || !body.order_id) {
      return NextResponse.json({ message: "Ignored" });
    }

    const order = await prisma.order.findUnique({
      where: { midtransOrderId: body.order_id },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" });
    }

    const previousStatus = order.status;

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: mapped.paymentStatus,
        status: mapped.orderStatus,
      },
    });

    if (previousStatus !== mapped.orderStatus) {
      await logOrderStatusChange({
        orderId: order.id,
        fromStatus: previousStatus,
        toStatus: mapped.orderStatus,
        note: `Webhook Midtrans: ${body.transaction_status}`,
      });

      await notifyOrderStatusChange(
        order.userId,
        order.id,
        orderStatusLabels[mapped.orderStatus],
      );
    }

    return NextResponse.json({ message: "OK" });
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
