"use client";

import type { FormEvent } from "react";
import type { CreateProductInput } from "@/src/types/commerce";

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProductInput) => Promise<void>;
};

export function ProductModal({
  open,
  onClose,
  onSubmit,
}: ProductModalProps) {
  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await onSubmit({
      name: String(form.get("name") || ""),
      category: String(form.get("category") || "Essentials"),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      image: String(form.get("image") || ""),
      description: String(form.get("description") || ""),
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cart-head">
          <h2>New product</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <input name="name" placeholder="Product name" required />
        <input
          name="category"
          placeholder="Category"
          defaultValue="Essentials"
        />
        <div className="form-row">
          <input name="price" type="number" placeholder="Price" required />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            defaultValue="10"
          />
        </div>
        <input name="image" placeholder="Image URL" />
        <textarea name="description" placeholder="Description" />
        <button className="pay" type="submit">
          Create product
        </button>
      </form>
    </div>
  );
}
