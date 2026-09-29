import ProductGrid from "../../../components/ProductGrid";
import products from "../../../products.json";

export default function Boots() {
  return (
    <main className="category-page">
      <h1>FOOTBALL BOOTS</h1>

      <h2>NIKE</h2>
      <ProductGrid items={products.Nike.boots} brand="Nike" category="boots" />

      <h2>ADIDAS</h2>
      <ProductGrid
        items={products.Adidas.boots}
        brand="Adidas"
        category="boots"
      />
    </main>
  );
}
