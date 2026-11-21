"use client";

import { commerceApi } from "@/src/services/commerceApi";
import type { CheckoutInput } from "@/src/types/commerce";

export function useCheckout(onError: (message: string) => void) {
  async function submit(input: CheckoutInput) {
    try {
      const order = await commerceApi.checkout(input);
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
        return;
      }
      onError(order.message || "Checkout gagal");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Checkout gagal");
    }
  }

  return { submit };
}
