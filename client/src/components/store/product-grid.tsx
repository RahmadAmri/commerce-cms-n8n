import Image from "next/image";
import { rupiah } from "@/src/domain/format";
import type { Product } from "@/src/types/commerce";

type ProductGridProps = {
  products: Product[];
  notice: string;
  onAdd: (productId: number) => void;
};

export function ProductGrid({
  products,
  notice,
  onAdd,
}: ProductGridProps) {
  return (
    <section className="shop" id="shop">
      <div className="section-head">
        <div>
          <p className="eyebrow">CURATED FOR YOU</p>
          <h2>New arrivals</h2>
        </div>
        <p>{products.length} products</p>
      </div>
      {notice && <p className="notice">{notice}</p>}
      <div className="product-grid">
        {products.map((product, index) => (
          <article className="product" key={product.id}>
            <div className="product-image">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
                loading={index < 4 ? "eager" : "lazy"}
              />
              <button onClick={() => onAdd(product.id)}>Add to bag</button>
            </div>
            <div className="product-meta">
              <div>
                <p>{product.category}</p>
                <h3>{product.name}</h3>
              </div>
              <strong>{rupiah(product.price)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
