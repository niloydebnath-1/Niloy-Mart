import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <main className="container page-section">
      <h1>Shopping cart</h1>
      {items.length === 0 ? (
        <div className="card empty-state">
          <p>Your cart is empty.</p>
          <Link className="button" to="/products">Browse products</Link>
        </div>
      ) : (
        <div className="two-column">
          <section className="card cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.product}>
                <img src={item.image} alt={item.name} />
                <div className="grow">
                  <Link to={`/products/${item.product}`}><strong>{item.name}</strong></Link>
                  <p>৳{item.price.toLocaleString()} each</p>
                </div>
                <select value={item.quantity} onChange={(e) => updateQuantity(item.product, e.target.value)}>
                  {Array.from({ length: item.stock }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
                <strong>৳{(item.price * item.quantity).toLocaleString()}</strong>
                <button className="danger-button" onClick={() => removeFromCart(item.product)}>Remove</button>
              </div>
            ))}
          </section>
          <aside className="card summary-card">
            <h2>Order summary</h2>
            <div className="summary-line"><span>Subtotal</span><strong>৳{totalPrice.toLocaleString()}</strong></div>
            <div className="summary-line"><span>Delivery</span><strong>৳0</strong></div>
            <div className="summary-line total"><span>Total</span><strong>৳{totalPrice.toLocaleString()}</strong></div>
            <Link className="button full" to="/checkout">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
