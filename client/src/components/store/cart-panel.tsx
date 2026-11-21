"use client";

import Image from "next/image";
import { getCartTotal, getCheckoutItems, type Cart } from "@/src/domain/cart";
import { rupiah } from "@/src/domain/format";
import type { CheckoutInput, Product } from "@/src/types/commerce";

type CartPanelProps = {
  open: boolean;
  cart: Cart;
  products: Product[];
  onClose: () => void;
  onChange: (productId: number, change: number) => void;
  onCheckout: (input: CheckoutInput) => Promise<void>;
};

export function CartPanel({
  open,
  cart,
  products,
  onClose,
  onChange,
  onCheckout,
}: CartPanelProps) {
  if (!open) return null;

  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );
  const total = getCartTotal(cart, products);

  return (
    <div className="cart-backdrop" onMouseDown={onClose}>
      <aside className="cart" onMouseDown={(event) => event.stopPropagation()}>
        <div className="cart-head">
          <h2>Your bag</h2>
          <button onClick={onClose}>×</button>
        </div>
        {count === 0 ? (
          <p className="empty">Your bag is empty.</p>
        ) : (
          <>
            {products
              .filter((product) => cart[product.id])
              .map((product) => (
                <div className="cart-row" key={product.id}>
                  <Image
                    src={product.image}
                    alt=""
                    width={68}
                    height={82}
                    unoptimized
                  />
                  <div>
                    <b>{product.name}</b>
                    <small>{rupiah(product.price)}</small>
                  </div>
                  <button onClick={() => onChange(product.id, -1)}>−</button>
                  <span>{cart[product.id]}</span>
                  <button onClick={() => onChange(product.id, 1)}>+</button>
                </div>
              ))}
            <form
              className="checkout"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                await onCheckout({
                  customerName: String(form.get("name") || ""),
                  customerEmail: String(form.get("email") || ""),
                  customerPhone: String(form.get("phone") || ""),
                  items: getCheckoutItems(cart, products),
                });
              }}
            >
              <input name="name" placeholder="Nama lengkap" required />
              <input name="email" type="email" placeholder="Email" required />
              <input name="phone" placeholder="Nomor telepon" required />
              <div className="total">
                <span>Total</span>
                <strong>{rupiah(total)}</strong>
              </div>
              <button className="pay" type="submit">
                Proceed to payment
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
