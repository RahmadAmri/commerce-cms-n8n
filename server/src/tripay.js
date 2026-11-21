import axios from "axios";
import crypto from "crypto";

const isSandbox = process.env.TRIPAY_SANDBOX !== "false";
const baseUrl = (process.env.TRIPAY_BASE_URL || (isSandbox
  ? process.env.TRIPAY_SANDBOX_URL || "https://tripay.co.id/api-sandbox"
  : process.env.TRIPAY_PRODUCTION_URL || "https://tripay.co.id/api")).replace(/\/$/, "");

export async function createTripayTransaction(order) {
  if (!process.env.TRIPAY_API_KEY || !process.env.TRIPAY_PRIVATE_KEY || !process.env.TRIPAY_MERCHANT_CODE) {
    return {
      reference: `MOCK-${order.reference}`,
      checkout_url: `http://localhost:4000/api/payments/mock/${order.reference}`,
      status: "UNPAID",
      mock: true,
    };
  }

  const signature = crypto
    .createHmac("sha256", process.env.TRIPAY_PRIVATE_KEY)
    .update(`${process.env.TRIPAY_MERCHANT_CODE}${order.reference}${order.amount}`)
    .digest("hex");

  let response;
  try {
    const publicApiUrl = process.env.API_PUBLIC_URL || "";
    const callbackUrl = /^(https?:\/\/)(?!localhost|127\.0\.0\.1)/i.test(publicApiUrl)
      ? `${publicApiUrl}/api/payments/tripay/callback`
      : undefined;
    response = await axios.post(`${baseUrl}/transaction/create`, {
    method: "QRIS2",
    merchant_ref: order.reference,
    amount: order.amount,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    order_items: order.items,
    return_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/orders`,
    signature,
    ...(callbackUrl ? { callback_url: callbackUrl } : {}),
    }, {
      headers: { Authorization: `Bearer ${process.env.TRIPAY_API_KEY}` },
    });
  } catch (error) {
    const detail = error.response?.data?.message || error.response?.data?.data || error.message;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  if (!response.data?.success) throw new Error(response.data?.message || "Tripay transaction failed");
  return response.data.data;
}

export function verifyTripayCallback(payload, receivedSignature, rawBody) {
  if (!process.env.TRIPAY_PRIVATE_KEY) return true;
  const signature = crypto
    .createHmac("sha256", process.env.TRIPAY_PRIVATE_KEY)
    .update(rawBody || JSON.stringify(payload))
    .digest("hex");
  const received = String(receivedSignature || payload.signature || "");
  if (signature.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(received));
}
