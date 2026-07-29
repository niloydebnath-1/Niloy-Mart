import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <main className="container page-section"><Message>{error}</Message></main>;

  return (
    <main className="container page-section">
      <Link to="/products">← Back to products</Link>
      <div className="product-detail card">
        <img src={product.image} alt={product.name} />
        <div>
          <span className="badge">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="price large">৳{product.price.toLocaleString()}</p>
          <p>{product.description}</p>
          <p className={product.stock > 0 ? "stock" : "out-stock"}>
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </p>
          {product.stock > 0 && (
            <div className="quantity-row">
              <label htmlFor="quantity">Quantity</label>
              <select id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                {Array.from({ length: product.stock }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
              <button className="button" onClick={() => addToCart(product, quantity)}>Add to cart</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
