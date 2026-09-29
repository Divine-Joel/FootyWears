// app/(site)/outfits/page.js
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../products.json";

export default function Outfits() {
  return (
    <main className="category-page">
      <h1>FOOTBALL OUTFIT</h1>
      <h2>NIKE</h2>
      <ProductGrid
        items={products.Nike.outfit}
        brand="Nike"
        category="outfit"
      />
      <h2>ADIDAS</h2>
      <ProductGrid
        items={products.Adidas.outfit}
        brand="Adidas"
        category="outfit"
      />
    </main>
  );
}
