"use client";

import { useEffect, useState } from "react";
import { commerceApi } from "@/src/services/commerceApi";
import type { Product } from "@/src/types/commerce";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    commerceApi
      .listProducts()
      .then((data) => active && setProducts(data))
      .catch((error: Error) =>
        active && setMessage(error.message || "Tidak dapat terhubung ke API"),
      );

    return () => {
      active = false;
    };
  }, []);

  return { products, message, setMessage };
}
