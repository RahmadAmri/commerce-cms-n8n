import { API_URL } from "@/src/config/api";
import type {
  CheckoutInput,
  CheckoutResult,
  CreateProductInput,
  Order,
  Product,
} from "@/src/types/commerce";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (response.status === 204) return undefined as T;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Permintaan gagal");
  }
  return data as T;
}

export const commerceApi = {
  listProducts: () => request<Product[]>("/api/products"),

  listAdminData: async () => {
    const [products, orders] = await Promise.all([
      request<Product[]>("/api/products"),
      request<Order[]>("/api/admin/orders"),
    ]);
    return { products, orders };
  },

  createProduct: (input: CreateProductInput) =>
    request<Product>("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),

  deleteProduct: (id: number) =>
    request<void>(`/api/admin/products/${id}`, { method: "DELETE" }),

  checkout: (input: CheckoutInput) =>
    request<CheckoutResult>("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
};
