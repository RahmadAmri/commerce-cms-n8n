"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; price: number; stock: number; category: string; active: boolean };
type Order = { id: number; reference: string; customerName: string; amount: number; status: string };
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState("products");
  const [open, setOpen] = useState(false);

  async function load() {
    const [productData, orderData] = await Promise.all([
      fetch(`${API_URL}/api/products`).then((r) => r.json()),
      fetch(`${API_URL}/api/admin/orders`).then((r) => r.json()),
    ]);
    setProducts(productData);
    setOrders(orderData);
  }

  useEffect(() => { load(); }, []);

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await fetch(`${API_URL}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"), price: Number(form.get("price")), stock: Number(form.get("stock")),
        category: form.get("category"), description: form.get("description"), image: form.get("image"),
      }),
    });
    setOpen(false);
    load();
  }

  async function removeProduct(id: number) {
    await fetch(`${API_URL}/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <a className="brand" href="/">NOVA<span>.</span></a>
        <nav><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Products</button><button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>Orders</button></nav>
        <a className="view-store" href="/">View store ↗</a>
      </aside>
      <section className="admin-main">
        <header><div><p>COMMERCE CMS</p><h1>{tab === "products" ? "Products" : "Orders"}</h1></div><button className="new-button" onClick={() => setOpen(true)}>+ New product</button></header>
        {tab === "products" ? (
          <div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>
            {products.map((product) => <tr key={product.id}><td><b>{product.name}</b><small>#{product.id}</small></td><td>{product.category}</td><td>{product.stock}</td><td>{rupiah(product.price)}</td><td><span className="status">Active</span></td><td><button className="delete" onClick={() => removeProduct(product.id)}>Delete</button></td></tr>)}
          </tbody></table></div>
        ) : (
          <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead><tbody>
            {orders.map((order) => <tr key={order.id}><td><b>{order.reference}</b></td><td>{order.customerName}</td><td>{rupiah(order.amount)}</td><td><span className={order.status === "PAID" ? "status paid" : "status"}>{order.status}</span></td></tr>)}
          </tbody></table></div>
        )}
      </section>
      {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal" onSubmit={addProduct} onMouseDown={(e) => e.stopPropagation()}>
        <div className="cart-head"><h2>New product</h2><button type="button" onClick={() => setOpen(false)}>×</button></div>
        <input name="name" placeholder="Product name" required /><input name="category" placeholder="Category" defaultValue="Essentials" />
        <div className="form-row"><input name="price" type="number" placeholder="Price" required /><input name="stock" type="number" placeholder="Stock" defaultValue="10" /></div>
        <input name="image" placeholder="Image URL" /><textarea name="description" placeholder="Description" />
        <button className="pay" type="submit">Create product</button>
      </form></div>}
    </main>
  );
}
