"use client";

import { useState } from "react";
import {
  AdminSidebar,
  type AdminTab,
} from "@/src/components/admin/admin-sidebar";
import { OrderTable } from "@/src/components/admin/order-table";
import { ProductModal } from "@/src/components/admin/product-modal";
import { ProductTable } from "@/src/components/admin/product-table";
import { useAdminData } from "@/src/hooks/use-admin-data";

export default function Admin() {
  const [tab, setTab] = useState<AdminTab>("products");
  const [open, setOpen] = useState(false);
  const { products, orders, error, createProduct, deleteProduct } =
    useAdminData();

  return (
    <main className="admin-shell">
      <AdminSidebar tab={tab} onTabChange={setTab} />
      <section className="admin-main">
        <header>
          <div>
            <p>COMMERCE CMS</p>
            <h1>{tab === "products" ? "Products" : "Orders"}</h1>
          </div>
          {tab === "products" && (
            <button className="new-button" onClick={() => setOpen(true)}>
              + New product
            </button>
          )}
        </header>
        {error && <p className="notice">{error}</p>}
        {tab === "products" ? (
          <ProductTable products={products} onDelete={deleteProduct} />
        ) : (
          <OrderTable orders={orders} />
        )}
      </section>
      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (input) => {
          await createProduct(input);
          setOpen(false);
        }}
      />
    </main>
  );
}
