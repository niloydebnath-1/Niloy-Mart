import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="card product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <span className="badge">{product.category}</span>
        <h3><Link to={`/products/${product._id}`}>{product.name}</Link></h3>
        <p className="price">৳{product.price.toLocaleString()}</p>
        <p className={product.stock > 0 ? "stock" : "out-stock"}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <button
          className="button full"
          disabled={product.stock === 0}
          onClick={() => addToCart(product, 1)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
