"use client";
import Link from "next/link";
import { useSavedItems } from "../../../context/SavedItemsContext";
import { useAuth } from "../../../context/AuthContext";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { savedItems, toggleSaved } = useSavedItems();
  const { user, loading } = useAuth();
  const router = useRouter();
  const scrollRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(Array.isArray(data) ? data : []));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <main className="profile-page">
        <p>Loading...</p>
      </main>
    );
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear your order history?")) return;
    const res = await fetch("/api/orders", { method: "DELETE" });
    if (res.ok) setOrders([]);
  };

  return (
    <main className="profile-page">
      <h1>My Account</h1>

      <section className="profile-section">
        <h2>Account Info</h2>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <Link href="/profile/edit" className="auth-link">
          Edit Profile
        </Link>
      </section>

      <section className="profile-section">
        <div className="section-header">
          <h2>Order History</h2>
          {orders.length > 0 && (
            <button className="clear-history-btn" onClick={handleClearHistory}>
              Clear history
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="order-list">
            <div className="order-row order-header">
              <span>Order ID</span>
              <span>Date</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {orders.map((order) => (
              <div key={order.id} className="order-row">
                <span>#{order.id}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span>₦{order.total.toLocaleString()}</span>
                <span
                  className={`order-status status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2>Saved Items</h2>
        {savedItems.length === 0 ? (
          <p>No saved items yet.</p>
        ) : (
          <div className="saved-items-wrapper">
            <button
              className="saved-scroll-btn prev"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="saved-items-scroll" ref={scrollRef}>
              {savedItems.map((item) => (
                <Link
                  href={`/product/${item.brand}/${item.category}/${item.productId}`}
                  className="item"
                  key={item.id}
                >
                  <button
                    className="save-heart"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSaved(
                        {
                          id: item.productId,
                          name: item.name,
                          image: item.image,
                          price: item.price,
                        },
                        item.brand,
                        item.category,
                      );
                    }}
                    aria-label="Remove from saved"
                  >
                    <i className="fa-solid fa-heart"></i>
                  </button>
                  <img src={item.image} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>₦{item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>

            <button
              className="saved-scroll-btn next"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
