import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="brand" to="/">
          Niloy Mart
        </Link>

        <nav>
          <NavLink to="/products">Products</NavLink>

          <NavLink to="/cart">
            Cart ({itemCount})
          </NavLink>

          {user && (
            <NavLink to="/my-orders">
              My Orders
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin">
              Admin
            </NavLink>
          )}

          {!user ? (
            <NavLink to="/login">
              Login
            </NavLink>
          ) : (
            <button
              className="link-button"
              onClick={handleLogout}
            >
              Logout ({user.name})
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}