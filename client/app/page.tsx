"use client";

import { useState } from "react";
import { getCartCount } from "@/src/domain/cart";
import { useCart } from "@/src/hooks/use-cart";
import { useCheckout } from "@/src/hooks/use-checkout";
import { useProducts } from "@/src/hooks/use-products";
import { CartPanel } from "@/src/components/store/cart-panel";
import { ProductGrid } from "@/src/components/store/product-grid";
import { StoreHero } from "@/src/components/store/store-hero";
import { StoreNav } from "@/src/components/store/store-nav";

export default function Home() {
  const { products, message, setMessage } = useProducts();
  const { cart, add, change } = useCart();
  const [showCart, setShowCart] = useState(false);
  const { submit: checkout } = useCheckout(setMessage);

  return (
    <main>
      <StoreNav
        cartCount={getCartCount(cart)}
        onOpenCart={() => setShowCart(true)}
      />
      <StoreHero />
      <ProductGrid products={products} notice={message} onAdd={add} />
      <CartPanel
        open={showCart}
        cart={cart}
        products={products}
        onClose={() => setShowCart(false)}
        onChange={change}
        onCheckout={checkout}
      />
    </main>
  );
}
