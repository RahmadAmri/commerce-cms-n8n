"use client";

import { useEffect, useState } from "react";
import { commerceApi } from "@/src/services/commerceApi";
import type {
  CreateProductInput,
  Order,
  Product,
} from "@/src/types/commerce";

export function useAdminData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await commerceApi.listAdminData();
      setProducts(data.products);
      setOrders(data.orders);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Gagal memuat data CMS",
      );
    }
  }

  useEffect(() => {
    let active = true;

    commerceApi.listAdminData().then(
      (data) => {
        if (!active) return;
        setProducts(data.products);
        setOrders(data.orders);
        setError("");
      },
      (loadError: Error) => {
        if (!active) return;
        setError(loadError.message || "Gagal memuat data CMS");
      },
    );

    return () => {
      active = false;
    };
  }, []);

  async function createProduct(input: CreateProductInput) {
    await commerceApi.createProduct(input);
    await load();
  }

  async function deleteProduct(id: number) {
    await commerceApi.deleteProduct(id);
    await load();
  }

  return { products, orders, error, createProduct, deleteProduct };
}
