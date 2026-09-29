"use client";
import { useCart } from "../../../context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="cartSection">
        <p>Loading...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="cartSection">
        <h1>Bag</h1>
        <p>Your bag is empty.</p>
      </main>
    );
  }

  return (
    <main className="cartSection">
      <div className="cart-layout">
        <div className="cart-bag">
          <h1>Bag</h1>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-line">
              <img
                className="cart-line-image"
                src={item.image}
                alt={item.name}
              />
              <div className="cart-line-details">
                <h4>{item.name}</h4>
                {item.color && <p className="cart-line-muted">{item.color}</p>}
                {item.size && (
                  <p className="cart-line-muted">Size {item.size}</p>
                )}
                <div className="cart-line-stepper">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeFromCart(item.id)
                    }
                    aria-label={
                      item.quantity > 1 ? "Decrease quantity" : "Remove"
                    }
                  >
                    <i
                      className={`${item.quantity > 1 ? "fa-solid fa-minus" : "fa-regular fa-trash-can"}`}
                    ></i>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <div className="cart-line-price">
                ₦{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <div className="cart-summary-row">
            <span>Estimated Delivery</span>
            <span>Free</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="btn-17 cart-checkout-btn">
            <span className="text-container">
              <span className="text">Checkout</span>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
