import Link from "next/link";

export type AdminTab = "products" | "orders";

type AdminSidebarProps = {
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

export function AdminSidebar({ tab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="sidebar">
      <Link className="brand" href="/">
        NOVA<span>.</span>
      </Link>
      <nav>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => onTabChange("products")}
        >
          Products
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => onTabChange("orders")}
        >
          Orders
        </button>
      </nav>
      <Link className="view-store" href="/">
        View store ↗
      </Link>
    </aside>
  );
}
