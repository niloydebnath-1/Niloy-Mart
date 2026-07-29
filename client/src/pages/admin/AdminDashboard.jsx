import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <main className="container page-section">
      <h1>Admin dashboard</h1>
      <div className="admin-grid">
        <Link className="card admin-tile" to="/admin/products"><h2>Manage products</h2><p>Add, edit or delete products.</p></Link>
        <Link className="card admin-tile" to="/admin/orders"><h2>Manage orders</h2><p>View orders and update status.</p></Link>
      </div>
    </main>
  );
}
