export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  active: boolean;
};

export type Order = {
  id: number;
  reference: string;
  customerName: string;
  amount: number;
  status: string;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
};

export type CheckoutItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CheckoutItem[];
};

export type CheckoutResult = {
  checkoutUrl?: string;
  message?: string;
};
