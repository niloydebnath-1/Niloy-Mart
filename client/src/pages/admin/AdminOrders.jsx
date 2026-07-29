import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  async function changeStatus(orderId, status) {
    try {
      setError("");
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map((order) => order._id === orderId ? { ...order, status: data.status } : order));
      setSuccess("Order status updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order");
    }
  }

  return (
    <main className="container page-section">
      <h1>Manage orders</h1>
      <Message>{error}</Message><Message type="success">{success}</Message>
      {loading ? <Loader /> : orders.length === 0 ? <Message type="info">No orders yet.</Message> : (
        <div className="table-wrap card">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name}<br /><small>{order.user?.email}</small></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>৳{order.totalPrice.toLocaleString()}</td>
                  <td>
                    <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
