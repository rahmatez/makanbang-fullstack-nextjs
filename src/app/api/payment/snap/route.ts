import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { createSnapToken, generateMidtransOrderId, isMidtransConfigured } from "@/lib/midtrans";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rate = checkRateLimit(
      getRateLimitKey("snap", `${session.user.id}:${ip}`),
      10,
      60_000,
    );

    if (!rate.success) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        { status: 429 },
      );
    }

    if (!isMidtransConfigured()) {
      return NextResponse.json(
        { error: "Midtrans belum dikonfigurasi" },
        { status: 400 },
      );
    }

    const body = (await request.json()) as { orderId?: string };
    if (!body.orderId) {
      return NextResponse.json({ error: "orderId wajib diisi" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: body.orderId,
        userId: session.user.id,
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (
      order.status === OrderStatus.CANCELLED ||
      order.paymentStatus === PaymentStatus.PAID ||
      order.status !== OrderStatus.PENDING
    ) {
      return NextResponse.json(
        { error: "Pesanan tidak dapat dibayar. Status sudah berubah." },
        { status: 400 },
      );
    }

    // Midtrans rejects duplicate order_id — issue a fresh one for each payment attempt.
    const midtransOrderId = generateMidtransOrderId();
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransOrderId },
    });

    const snap = await createSnapToken({
      orderId: midtransOrderId,
      grossAmount: Number(order.totalAmount),
      customerName: session.user.name,
      customerEmail: session.user.email,
      items: order.items.map((item) => ({
        id: item.menuItemId,
        name: item.menuItem.name,
        price: Number(item.unitPrice),
        quantity: item.quantity,
      })),
    });

    return NextResponse.json({
      snapToken: snap.token,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal membuat snap token",
      },
      { status: 500 },
    );
  }
}
