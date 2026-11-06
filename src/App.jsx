import React from 'react';
import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavbar from './components/MobileNavbar';
import AuthModal from './components/AuthModal';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Discounts from './pages/Discounts';

// Toast Notification component
const ToastNotification = () => {
  const { notification } = useCart();
  if (!notification) return null;

  return (
    <div className={`toast-banner ${notification.type}`}>
      {notification.message}
    </div>
  );
};

// Scroll to top on route change
const ScrollToTop = () => {
  const [pathname, setPathname] = React.useState('');
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/discounts" element={<Discounts />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <MobileNavbar />
              <AuthModal />
              <ToastNotification />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

