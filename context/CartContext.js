"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    const res = await fetch("/api/cart");
    if (res.ok) {
      setCartItems(await res.json());
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product, brand, category, options = {}) => {
    if (!user) return;
    const { size = "", color = "", quantity = 1 } = options;
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, brand, category, size, color, quantity }),
    });
    await loadCart();
  };

  const removeFromCart = async (id) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadCart();
  };

  const updateQuantity = async (id, quantity) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: Math.max(1, quantity) }),
    });
    await loadCart();
  };

  const clearCart = async () => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
