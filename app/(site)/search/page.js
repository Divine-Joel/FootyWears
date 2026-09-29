"use client";
import { useSearchParams } from "next/navigation";
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../products.json";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const grouped = {};
  Object.entries(products).forEach(([brand, categories]) => {
    Object.entries(categories).forEach(([category, items]) => {
      const matched = items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      );
      matched.forEach((item) => {
        const key = `${brand}-${category}`;
        if (!grouped[key]) grouped[key] = { brand, category, items: [] };
        grouped[key].items.push(item);
      });
    });
  });

  const groups = Object.values(grouped);
  const totalResults = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <main className="category-page">
      <h1>Search results for "{query}"</h1>
      <p>
        {totalResults} result{totalResults !== 1 ? "s" : ""} found
      </p>

      {groups.length === 0 ? (
        <p>No products matched your search.</p>
      ) : (
        groups.map((group) => (
          <div key={`${group.brand}-${group.category}`}>
            <h2>
              {group.brand} {group.category}
            </h2>
            <ProductGrid
              items={group.items}
              brand={group.brand}
              category={group.category}
            />
          </div>
        ))
      )}
    </main>
  );
}
