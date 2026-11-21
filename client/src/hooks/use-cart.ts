"use client";

import { useState } from "react";
import { changeCartQuantity, type Cart } from "@/src/domain/cart";

export function useCart() {
  const [cart, setCart] = useState<Cart>({});

  function add(productId: number) {
    setCart((current) => changeCartQuantity(current, productId, 1));
  }

  function change(productId: number, changeBy: number) {
    setCart((current) => changeCartQuantity(current, productId, changeBy));
  }

  return { cart, add, change };
}
