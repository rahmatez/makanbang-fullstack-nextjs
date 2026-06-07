import crypto from "crypto";

interface SnapTransactionPayload {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface SnapTokenResponse {
  token: string;
  redirect_url: string;
}

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

export async function createSnapToken(
  payload: SnapTransactionPayload,
): Promise<SnapTokenResponse> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const baseUrl = isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";

  if (!serverKey || serverKey.includes("xxxxxxxx")) {
    throw new Error("Midtrans belum dikonfigurasi. Isi MIDTRANS_SERVER_KEY di .env");
  }

  const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

  const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: payload.orderId,
        gross_amount: payload.grossAmount,
      },
      customer_details: {
        first_name: payload.customerName,
        email: payload.customerEmail,
      },
      item_details: payload.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans error: ${errorText}`);
  }

  return response.json();
}

export function verifyMidtransSignature(notification: MidtransNotification) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;

  const signature = crypto
    .createHash("sha512")
    .update(
      notification.order_id +
        notification.status_code +
        notification.gross_amount +
        serverKey,
    )
    .digest("hex");

  return signature === notification.signature_key;
}

export function isFraudAcceptable(fraudStatus?: string) {
  if (!fraudStatus) return true;
  return fraudStatus === "accept";
}

export function getMidtransClientKey() {
  return process.env.MIDTRANS_CLIENT_KEY ?? "";
}

export function isMidtransConfigured() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY ?? "";
  return !serverKey.includes("xxxxxxxx") && !clientKey.includes("xxxxxxxx");
}

export function canBypassPayment() {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.ALLOW_DEV_PAYMENT_BYPASS === "true";
}

/** Unique ID per Snap attempt — Midtrans rejects reused order_id. */
export function generateMidtransOrderId() {
  return `MB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
