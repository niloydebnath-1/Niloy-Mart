import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await api.get("/products?sort=newest");
        setProducts(data.products.slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <p className="eyebrow">E-Commerce Platform</p>
          <h1>Everything you need in one basic online shop.</h1>
          <p>Browse products, add them to your cart and place a Cash on Delivery order.</p>
          <Link className="button" to="/products">Shop now</Link>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <h2>Latest products</h2>
          <Link to="/products">View all</Link>
        </div>
        {loading ? <Loader /> : error ? <Message>{error}</Message> : (
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </section>
    </>
  );
}
