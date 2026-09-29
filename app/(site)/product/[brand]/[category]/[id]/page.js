"use client";
import { useCart } from "../../../../../../context/CartContext";
import { useState } from "react";
import { useParams } from "next/navigation";
import products from "../../../../../../products.json";
import { useSavedItems } from "../../../../../../context/SavedItemsContext";

const SIZE_OPTIONS = {
  boots: ["39", "40", "41", "42", "43", "44", "45"],
  outfit: ["S", "M", "L", "XL", "XXL"],
  balls: ["3", "4", "5"],
  equipment: ["S", "M", "L", "XL"],
};

const COLOR_OPTIONS = ["Black", "White", "Red", "Blue"];

export default function ProductDetail() {
  const { brand, category, id } = useParams();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleSaved, isSaved } = useSavedItems();
  const [isAdding, setIsAdding] = useState(false);

  const product = products[brand]?.[category]?.find((p) => String(p.id) === id);
  const saved = product ? isSaved(product, brand, category) : false;

  if (!product) {
    return (
      <main className="product-detail-empty">
        <h1>Product not found</h1>
      </main>
    );
  }

  const showColor = category === "boots" || category === "outfit";
  const sizes = SIZE_OPTIONS[category] || [];
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, brand, category, { size, color, quantity });
      setIsAdding(false);
    }, 600);
  };

  return (
    <main className="product-detail">
      <div className="product-detail-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-price">
          ₦{product.price.toLocaleString()}
        </p>

        <button
          className={`product-detail-save ${saved ? "saved" : ""}`}
          onClick={() => toggleSaved(product, brand, category)}
        >
          <i className={`${saved ? "fa-solid" : "fa-regular"} fa-heart`}></i>
          {saved ? " Saved" : " Save"}
        </button>

        {sizes.length > 0 && (
          <div className="product-detail-field">
            <label>Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Select size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {showColor && (
          <div className="product-detail-field">
            <label>Color</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">Select color</option>
              {COLOR_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="product-detail-field">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button
          className="addCart product-detail-addcart"
          disabled={isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </main>
  );
}
