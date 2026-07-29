import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const emptyForm = { name: "", description: "", price: "", image: "", category: "", stock: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setSuccess("Product updated");
      } else {
        await api.post("/products", payload);
        setSuccess("Product added");
      }
      cancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function remove(productId) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      setSuccess("Product deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    }
  }

  return (
    <main className="container page-section">
      <h1>Manage products</h1>
      <form className="card form-card" onSubmit={submit}>
        <h2>{editingId ? "Edit product" : "Add product"}</h2>
        <Message>{error}</Message><Message type="success">{success}</Message>
        <div className="form-grid">
          <label>Name<input name="name" value={form.name} onChange={update} required /></label>
          <label>Category<input name="category" value={form.category} onChange={update} required /></label>
          <label>Price<input name="price" type="number" min="0" value={form.price} onChange={update} required /></label>
          <label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={update} required /></label>
        </div>
        <label>Image URL<input name="image" type="url" value={form.image} onChange={update} placeholder="https://..." /></label>
        <label>Description<textarea name="description" value={form.description} onChange={update} required /></label>
        <div className="button-row">
          <button className="button" disabled={saving}>{saving ? "Saving..." : editingId ? "Update" : "Add product"}</button>
          {editingId && <button type="button" className="secondary-button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {loading ? <Loader /> : (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><div className="table-product"><img src={product.image} alt="" /><span>{product.name}</span></div></td>
                  <td>{product.category}</td>
                  <td>৳{product.price.toLocaleString()}</td>
                  <td>{product.stock}</td>
                  <td><div className="button-row"><button className="small-button" onClick={() => startEdit(product)}>Edit</button><button className="danger-button" onClick={() => remove(product._id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
