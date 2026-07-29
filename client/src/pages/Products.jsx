import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ keyword, category, sort });
        const { data } = await api.get(`/products?${params}`, { signal: controller.signal });
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError(err.response?.data?.message || "Could not load products");
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [keyword, category, sort]);

  return (
    <main className="container page-section">
      <h1>Products</h1>
      <div className="filters card">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search product name..."
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="nameAsc">Name: A–Z</option>
        </select>
      </div>

      {loading ? <Loader /> : error ? <Message>{error}</Message> : products.length === 0 ? (
        <Message type="info">No products found.</Message>
      ) : (
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      )}
    </main>
  );
}
