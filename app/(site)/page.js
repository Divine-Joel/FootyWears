import HeroCarousel from "../../components/HeroCarousel";
import ProductGrid from "../../components/ProductGrid";
import products from "../../products.json";

export default function Home() {
  return (
    <main>
      <HeroCarousel />

      <section className="option">
        <h2>SHOP FOOTBALL</h2>
        <div className="option-container">
          <div className="products-highlight-container">
            <a href="/boots">
              <img src="/images/Nike Vapor Elite 1.jpeg" alt="Nike boot" />
            </a>
            <p>Football boots</p>
          </div>
          <div className="products-highlight-container">
            <a href="/balls">
              <img
                src="/images/fifa-world-cup-26-trionda-competition-ball.jpeg"
                alt="Adidas football"
              />
            </a>
            <p>Football</p>
          </div>
          <div className="products-highlight-container">
            <a href="/equipments">
              <img
                src="/images/NK+CLUB+TEAM+ROLL.jpeg"
                alt="Nike club team roll"
              />
            </a>
            <p>Football equipment</p>
          </div>
          <div className="products-highlight-container">
            <a href="/outfits">
              <img src="/images/nike sweatsuit.jpeg" alt="Nike sweatsuit" />
            </a>
            <p>Football outfit</p>
          </div>
        </div>
      </section>

      <section className="nike-section">
        <h2>Nike</h2>
        <h3>Football Boots</h3>
        <ProductGrid
          items={products.Nike.boots.slice(0, 4)}
          brand="Nike"
          category="boots"
        />

        <h3>Football balls</h3>
        <ProductGrid
          items={products.Nike.balls.slice(0, 4)}
          brand="Nike"
          category="balls"
        />

        <h3>Football Equipment</h3>
        <ProductGrid
          items={products.Nike.equipment.slice(0, 4)}
          brand="Nike"
          category="equipment"
        />

        <h3>Football Outfits</h3>
        <ProductGrid
          items={products.Nike.outfit.slice(0, 4)}
          brand="Nike"
          category="outfit"
        />
      </section>

      <section className="adidas-section">
        <h2>Adidas</h2>
        <h3>Football boots</h3>
        <ProductGrid
          items={products.Adidas.boots.slice(0, 4)}
          brand="Adidas"
          category="boots"
        />

        <h3>Football balls</h3>
        <ProductGrid
          items={products.Adidas.balls.slice(0, 4)}
          brand="Adidas"
          category="balls"
        />

        <h3>Football equipment</h3>
        <ProductGrid
          items={products.Adidas.equipment.slice(0, 4)}
          brand="Adidas"
          category="equipment"
        />

        <h3>Football outfit</h3>
        <ProductGrid
          items={products.Adidas.outfit.slice(0, 4)}
          brand="Adidas"
          category="outfit"
        />
      </section>
    </main>
  );
}
