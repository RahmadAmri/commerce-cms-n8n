"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderConfirmation() {
  const params = useSearchParams();
  const reference = params.get("paid");

  return (
    <main className="orders-page">
      <nav className="nav"><a className="brand" href="/">NOVA<span>.</span></a><a className="bag" href="/">Continue shopping</a></nav>
      <section>
        <div className="success-mark">✓</div>
        <p className="eyebrow">PAYMENT CONFIRMED</p>
        <h1>Thank you for<br />your order.</h1>
        {reference && <p className="reference">Order reference: <strong>{reference}</strong></p>}
        <a className="primary" href="/">Back to store <span>→</span></a>
      </section>
    </main>
  );
}

export default function Orders() {
  return (
    <Suspense fallback={<main className="orders-page"><section><p>Loading confirmation...</p></section></main>}>
      <OrderConfirmation />
    </Suspense>
  );
}
