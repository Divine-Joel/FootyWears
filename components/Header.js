"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import products from "../products.json";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const router = useRouter();

  const allProducts = Object.entries(products).flatMap(([brand, categories]) =>
    Object.entries(categories).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, brand, category })),
    ),
  );

  const matches =
    query.length > 0
      ? allProducts
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 6)
      : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="header-topbar">
          <div className="topbar-inner">
            <div className="topbar-left">
              <Link href="/help">Help</Link>
            </div>
            <div className="topbar-right">
              {user ? (
                <>
                  <Link href="/profile">Hi, {user.name}</Link>
                  <button
                    onClick={logout}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="header-top">
          <div className="logo">
            Footy<span>Wears</span>
          </div>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            {user && (
              <Link href="/profile" className="drawer-profile">
                <i className="fa-regular fa-user"></i>
                <span>Hi, {user.name}</span>
              </Link>
            )}
            <Link href="/" className={isActive("/") ? "active" : ""}>
              Home
            </Link>
            <Link href="/boots" className={isActive("/boots") ? "active" : ""}>
              Football boots
            </Link>
            <Link href="/balls" className={isActive("/balls") ? "active" : ""}>
              Football
            </Link>
            <Link
              href="/equipments"
              className={isActive("/equipments") ? "active" : ""}
            >
              Equipments
            </Link>
            <Link
              href="/outfits"
              className={isActive("/outfits") ? "active" : ""}
            >
              Outfits
            </Link>

            <div className="drawer-footer">
              <Link href="/cart">
                <i className="fa-solid fa-bag-shopping"></i> Cart
              </Link>
              <Link href="/help">
                <i className="fa-regular fa-circle-question"></i> Help
              </Link>
              {user ? (
                <button onClick={logout} className="drawer-logout">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <i className="fa-regular fa-user"></i> Login
                  </Link>
                  <Link href="/register">
                    <i className="fa-solid fa-user-plus"></i> Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="header-icons">
            <div className="header-search" ref={searchRef}>
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="header-search-box"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                  {matches.length > 0 && (
                    <div className="header-search-results">
                      {matches.map((item) => (
                        <Link
                          key={`${item.brand}-${item.category}-${item.id}`}
                          href={`/product/${item.brand}/${item.category}/${item.id}`}
                          className="header-search-result"
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                          }}
                        >
                          <img src={item.image} alt={item.name} />
                          <div>
                            <p>{item.name}</p>
                            <span>₦{item.price.toLocaleString()}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </form>
              )}
            </div>
            <Link href="/profile" aria-label="Account">
              <i className="fa-regular fa-user"></i>
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className={`cart-icon-wrapper `}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          <button
            className={`menu-toggle ${menuOpen ? "active" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        className={`nav-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </>
  );
}
