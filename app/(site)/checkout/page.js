"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load Paystack's popup script once
  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (loading || !user) {
    return (
      <main className="cartSection">
        <p>Loading...</p>
      </main>
    );
  }

  const handlePay = async () => {
    setError("");
    setIsPlacing(true);

    const initRes = await fetch("/api/checkout/initialize", { method: "POST" });
    const initData = await initRes.json();

    if (!initRes.ok) {
      setError(initData.error || "Could not start payment.");
      setIsPlacing(false);
      return;
    }

    if (!window.PaystackPop) {
      setError(
        "Payment system is still loading. Please try again in a moment.",
      );
      setIsPlacing(false);
      return;
    }

    const popup = new window.PaystackPop();
    popup.resumeTransaction(initData.access_code, {
      onSuccess: async (transaction) => {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: transaction.reference }),
        });
        const verifyData = await verifyRes.json();
        setIsPlacing(false);

        if (!verifyRes.ok) {
          setError(verifyData.error || "Payment could not be verified.");
          return;
        }

        await clearCart();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
      onCancel: () => {
        setIsPlacing(false);
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <main className="cartSection">
        {showSuccess && (
          <div className="order-success-toast">
            <i className="fa-solid fa-circle-check"></i>
            You have successfully placed your order.
          </div>
        )}
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="cartSection">
      {showSuccess && (
        <div className="order-success-toast">
          <i className="fa-solid fa-circle-check"></i>
          You have successfully placed your order.
        </div>
      )}

      <h1>Checkout</h1>

      <div className="cart-layout">
        <div className="cart-bag">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-line">
              <img
                className="cart-line-image"
                src={item.image}
                alt={item.name}
              />
              <div className="cart-line-details">
                <h4>{item.name}</h4>
                {item.size && (
                  <p className="cart-line-muted">Size {item.size}</p>
                )}
                {item.color && <p className="cart-line-muted">{item.color}</p>}
                <p className="cart-line-muted">Qty {item.quantity}</p>
              </div>
              <div className="cart-line-price">
                ₦{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            className="btn-17 cart-checkout-btn"
            disabled={isPlacing}
            onClick={handlePay}
          >
            <span className="text-container">
              <span className="text">
                {isPlacing ? "Processing..." : "Pay Now"}
              </span>
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
