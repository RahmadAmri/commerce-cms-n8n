"use client";

import { useEffect, useState } from "react";

type Product = { id: number; name: string; slug: string; price: number; category: string; image: string; description: string };
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products`).then((r) => r.json()).then(setProducts).catch(() => setMessage("Tidak dapat terhubung ke API"));
  }, []);

  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const items = products.filter((product) => cart[product.id]).map((product) => ({
      sku: product.slug,
      name: product.name,
      price: product.price,
      quantity: cart[product.id],
    }));
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: form.get("name"),
        customerEmail: form.get("email"),
        customerPhone: form.get("phone"),
        items,
      }),
    });
    const order = await response.json();
    if (!response.ok) return setMessage(order.message || "Checkout gagal");
    if (order.checkoutUrl) window.location.href = order.checkoutUrl;
  }

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="/">NOVA<span>.</span></a>
        <div className="nav-links"><a href="#shop">Shop</a><a href="#about">About</a><a href="/admin">CMS</a></div>
        <button className="bag" onClick={() => setShowCart(true)}>Bag <b>{count}</b></button>
      </nav>

      <section className="hero" id="about">
        <div>
          <p className="eyebrow">NEW SEASON · 2026</p>
          <h1>Objects for<br /><em>everyday</em> life.</h1>
          <p className="hero-copy">A considered collection of modern essentials, made with honest materials and quiet purpose.</p>
          <a className="primary" href="#shop">Explore collection <span>→</span></a>
        </div>
        <div className="hero-image" role="img" aria-label="Modern fashion collection">
          <span>01 / 04</span>
        </div>
      </section>

      <section className="shop" id="shop">
        <div className="section-head"><div><p className="eyebrow">CURATED FOR YOU</p><h2>New arrivals</h2></div><p>{products.length} products</p></div>
        {message && <p className="notice">{message}</p>}
        <div className="product-grid">
          {products.map((product) => (
            <article className="product" key={product.id}>
              <div className="product-image"><img src={product.image} alt={product.name} /><button onClick={() => setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }))}>Add to bag</button></div>
              <div className="product-meta"><div><p>{product.category}</p><h3>{product.name}</h3></div><strong>{rupiah(product.price)}</strong></div>
            </article>
          ))}
        </div>
      </section>

      {showCart && (
        <div className="cart-backdrop" onMouseDown={() => setShowCart(false)}>
          <aside className="cart" onMouseDown={(event) => event.stopPropagation()}>
            <div className="cart-head"><h2>Your bag</h2><button onClick={() => setShowCart(false)}>×</button></div>
            {count === 0 ? <p className="empty">Your bag is empty.</p> : (
              <>
                {products.filter((p) => cart[p.id]).map((p) => <div className="cart-row" key={p.id}><img src={p.image} alt="" /><div><b>{p.name}</b><small>{rupiah(p.price)}</small></div><button onClick={() => setCart((c) => ({ ...c, [p.id]: Math.max(0, c[p.id] - 1) }))}>−</button><span>{cart[p.id]}</span><button onClick={() => setCart((c) => ({ ...c, [p.id]: c[p.id] + 1 }))}>+</button></div>)}
                <form className="checkout" onSubmit={checkout}>
                  <input name="name" placeholder="Nama lengkap" required />
                  <input name="email" type="email" placeholder="Email" required />
                  <input name="phone" placeholder="Nomor telepon" required />
                  <div className="total"><span>Total</span><strong>{rupiah(total)}</strong></div>
                  <button className="pay" type="submit">Proceed to payment</button>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
