import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("shopCart");
    return saved ? JSON.parse(saved) : [];
  });

  function persist(nextItems) {
    setItems(nextItems);
    localStorage.setItem("shopCart", JSON.stringify(nextItems));
  }

  function addToCart(product, quantity = 1) {
    const safeQuantity = Math.max(1, Math.min(Number(quantity), product.stock));
    const existing = items.find((item) => item.product === product._id);

    if (existing) {
      persist(
        items.map((item) =>
          item.product === product._id
            ? { ...item, quantity: Math.min(item.quantity + safeQuantity, product.stock) }
            : item
        )
      );
      return;
    }

    persist([
      ...items,
      {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        stock: product.stock,
        quantity: safeQuantity,
      },
    ]);
  }

  function updateQuantity(productId, quantity) {
    persist(
      items.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.stock)) }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    persist(items.filter((item) => item.product !== productId));
  }

  function clearCart() {
    persist([]);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ items, itemCount, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart }),
    [items, itemCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
