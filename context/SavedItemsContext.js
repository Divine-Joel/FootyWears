"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const SavedItemsContext = createContext();

export function SavedItemsProvider({ children }) {
  const { user } = useAuth();
  const [savedItems, setSavedItems] = useState([]);

  const loadSaved = async () => {
    if (!user) {
      setSavedItems([]);
      return;
    }
    const res = await fetch("/api/saved-items");
    if (res.ok) {
      setSavedItems(await res.json());
    }
  };

  useEffect(() => {
    loadSaved();
  }, [user]);

  const toggleSaved = async (product, brand, category) => {
    if (!user) return;
    await fetch("/api/saved-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, brand, category }),
    });
    await loadSaved();
  };

  const isSaved = (product, brand, category) => {
    return savedItems.some(
      (item) =>
        item.productId === product.id &&
        item.brand === brand &&
        item.category === category,
    );
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, toggleSaved, isSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  return useContext(SavedItemsContext);
}
