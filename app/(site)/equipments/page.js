// app/(site)/equipments/page.js
import ProductGrid from "../../../components/ProductGrid";
import products from "../../../products.json";

export default function Equipments() {
  return (
    <main className="category-page">
      <h1>FOOTBALL EQUIPMENT</h1>
      <h2>NIKE</h2>
      <ProductGrid
        items={products.Nike.equipment}
        brand="Nike"
        category="equipment"
      />
      <h2>ADIDAS</h2>
      <ProductGrid
        items={products.Adidas.equipment}
        brand="Adidas"
        category="equipment"
      />
    </main>
  );
}
