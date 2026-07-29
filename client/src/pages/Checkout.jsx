import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Message from "../components/Message";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/orders", {
        items: items.map(({ product, quantity }) => ({ product, quantity })),
        shippingAddress: form,
        paymentMethod: "Cash on Delivery",
      });
      clearCart();
      navigate("/my-orders", { state: { success: "Order placed successfully" } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container page-section">
      <h1>Checkout</h1>
      <div className="two-column">
        <form className="card form-card" onSubmit={submit}>
          <h2>Shipping information</h2>
          <Message>{error}</Message>
          <label>Full name<input name="fullName" value={form.fullName} onChange={update} required /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={update} required /></label>
          <label>Full address<textarea name="address" value={form.address} onChange={update} required /></label>
          <label>City<input name="city" value={form.city} onChange={update} required /></label>
          <label>Payment method<input value="Cash on Delivery" disabled /></label>
          <button className="button full" disabled={loading || items.length === 0}>
            {loading ? "Placing order..." : "Confirm order"}
          </button>
        </form>
        <aside className="card summary-card">
          <h2>Your items</h2>
          {items.map((item) => (
            <div className="summary-line" key={item.product}>
              <span>{item.name} × {item.quantity}</span>
              <strong>৳{(item.price * item.quantity).toLocaleString()}</strong>
            </div>
          ))}
          <div className="summary-line total"><span>Total</span><strong>৳{totalPrice.toLocaleString()}</strong></div>
        </aside>
      </div>
    </main>
  );
}
