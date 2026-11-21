import { rupiah } from "@/src/domain/format";
import type { Order } from "@/src/types/commerce";

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <b>{order.reference}</b>
              </td>
              <td>{order.customerName}</td>
              <td>{rupiah(order.amount)}</td>
              <td>
                <span
                  className={order.status === "PAID" ? "status paid" : "status"}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
