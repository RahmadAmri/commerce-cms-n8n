import type { CheckoutItem, Product } from "@/src/types/commerce";

export type Cart = Record<number, number>;

export function getCartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export function getCartTotal(cart: Cart, products: Product[]): number {
  return products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0,
  );
}

export function getCheckoutItems(
  cart: Cart,
  products: Product[],
): CheckoutItem[] {
  return products
    .filter((product) => (cart[product.id] || 0) > 0)
    .map((product) => ({
      sku: product.slug,
      name: product.name,
      price: product.price,
      quantity: cart[product.id],
    }));
}

export function changeCartQuantity(
  cart: Cart,
  productId: number,
  change: number,
): Cart {
  const quantity = Math.max(0, (cart[productId] || 0) + change);
  return { ...cart, [productId]: quantity };
}
