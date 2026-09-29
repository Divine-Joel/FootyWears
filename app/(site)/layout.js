import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CartProvider } from "../../context/CartContext";
import { SavedItemsProvider } from "../../context/SavedItemsContext";
import { AuthProvider } from "../../context/AuthContext";

export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SavedItemsProvider>
          <Header />
          {children}
          <Footer />
        </SavedItemsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
