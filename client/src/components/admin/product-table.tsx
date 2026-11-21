import { rupiah } from "@/src/domain/format";
import type { Product } from "@/src/types/commerce";

type ProductTableProps = {
  products: Product[];
  onDelete: (id: number) => void;
};

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <b>{product.name}</b>
                <small>#{product.id}</small>
              </td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>{rupiah(product.price)}</td>
              <td>
                <span className="status">Active</span>
              </td>
              <td>
                <button
                  className="delete"
                  onClick={() => onDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
