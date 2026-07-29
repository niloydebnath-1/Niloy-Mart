import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <main className="container page-section">
      <h1>My orders</h1>
      {location.state?.success && <Message type="success">{location.state.success}</Message>}
      {loading ? <Loader /> : error ? <Message>{error}</Message> : orders.length === 0 ? (
        <Message type="info">You have not placed any orders.</Message>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="card order-card" key={order._id}>
              <div className="section-heading">
                <div><strong>Order #{order._id.slice(-8).toUpperCase()}</strong><p>{new Date(order.createdAt).toLocaleString()}</p></div>
                <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              {order.items.map((item) => (
                <div className="summary-line" key={item.product}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="summary-line total"><span>Total</span><strong>৳{order.totalPrice.toLocaleString()}</strong></div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
