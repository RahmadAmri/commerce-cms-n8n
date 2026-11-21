"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderConfirmation() {
  const params = useSearchParams();
  const reference = params.get("paid");

  return (
    <main className="orders-page">
      <nav className="nav">
        <Link className="brand" href="/">
          NOVA<span>.</span>
        </Link>
        <Link className="bag" href="/">
          Continue shopping
        </Link>
      </nav>
      <section>
        <div className="success-mark">✓</div>
        <p className="eyebrow">PAYMENT CONFIRMED</p>
        <h1>
          Thank you for
          <br />
          your order.
        </h1>
        {reference && (
          <p className="reference">
            Order reference: <strong>{reference}</strong>
          </p>
        )}
        <Link className="primary" href="/">
          Back to store <span>→</span>
        </Link>
      </section>
    </main>
  );
}

export default function Orders() {
  return (
    <Suspense
      fallback={
        <main className="orders-page">
          <section>
            <p>Loading confirmation...</p>
          </section>
        </main>
      }
    >
      <OrderConfirmation />
    </Suspense>
  );
}
