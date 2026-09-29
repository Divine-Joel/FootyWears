// app/(site)/balls/page.js
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../products.json";

export default function Balls() {
  return (
    <main className="category-page">
      <h1>FOOTBALL BALLS</h1>
      <h2>NIKE</h2>
      <ProductGrid items={products.Nike.balls} brand="Nike" category="balls" />
      <h2>ADIDAS</h2>
      <ProductGrid
        items={products.Adidas.balls}
        brand="Adidas"
        category="balls"
      />
    </main>
  );
}
