"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useSavedItems } from "../context/SavedItemsContext";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProductGrid({ items, brand, category }) {
  const { addToCart } = useCart();
  const { toggleSaved, isSaved } = useSavedItems();
  const [loadingId, setLoadingId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setLoadingId(product.id);
    setTimeout(() => {
      addToCart(product, brand, category);
      setLoadingId(null);
    }, 600);
  };

  const handleToggleSaved = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleSaved(product, brand, category);
  };

  return (
    <div className="products-item-container">
      {items.map((product) => (
        <Link
          href={`/product/${brand}/${category}/${product.id}`}
          className="item"
          key={product.id}
        >
          <button
            className="save-heart"
            onClick={(e) => handleToggleSaved(e, product)}
            aria-label="Save item"
          >
            <i
              className={`${isSaved(product, brand, category) ? "fa-solid" : "fa-regular"} fa-heart`}
            ></i>
          </button>
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p>₦{product.price.toLocaleString()}</p>
          <button
            className="addCart"
            disabled={loadingId === product.id}
            onClick={(e) => handleAddToCart(e, product)}
          >
            {loadingId === product.id ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Add to Cart"
            )}
          </button>
        </Link>
      ))}
    </div>
  );
}
