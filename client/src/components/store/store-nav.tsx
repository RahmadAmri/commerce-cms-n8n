import Link from "next/link";

type StoreNavProps = {
  cartCount: number;
  onOpenCart: () => void;
};

export function StoreNav({ cartCount, onOpenCart }: StoreNavProps) {
  return (
    <nav className="nav">
      <Link className="brand" href="/">
        NOVA<span>.</span>
      </Link>
      <div className="nav-links">
        <a href="#shop">Shop</a>
        <a href="#about">About</a>
        <Link href="/admin">CMS</Link>
      </div>
      <button className="bag" onClick={onOpenCart}>
        Bag <b>{cartCount}</b>
      </button>
    </nav>
  );
}
